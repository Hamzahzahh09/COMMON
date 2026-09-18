import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import type { CreateItemInput, ItemQueryParams, UpdateItemInput } from '../schemas/item.schema';
import { ConflictError, ForbiddenError, NotFoundError } from '../utils/errors';
import { CommunitiesService } from './communities.service';
import { SEED_ITEMS, SEED_PROFILES, SEED_COMMUNITIES, type SeedItem } from '../data/seed-data';

export class ItemsService {
  /**
   * Query items across user communities or a specific community
   */
  static async listItems(
    supabase: SupabaseClient<Database>,
    filters: ItemQueryParams,
    userId?: string
  ) {
    let query = supabase
      .from('items')
      .select(`
        id,
        community_id,
        owner_id,
        name,
        description,
        category,
        condition,
        location_hint,
        borrowing_rules,
        ownership_type,
        status,
        image_url,
        created_at,
        updated_at,
        owner:profiles (
          id,
          full_name,
          avatar_url
        ),
        community:communities (
          id,
          name,
          slug
        )
      `)
      .order('created_at', { ascending: false });

    if (filters.community_id) {
      if (userId) {
        const isMember = await CommunitiesService.isMember(supabase, filters.community_id, userId);
        if (!isMember) {
          throw new ForbiddenError('You are not a member of the requested community');
        }
      }
      query = query.eq('community_id', filters.community_id);
    } else if (userId) {
      // Find all community IDs for the user
      const { data: memberships } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', userId);

      const communityIds = (memberships || []).map((m) => m.community_id);
      if (communityIds.length > 0) {
        query = query.in('community_id', communityIds);
      }
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.ownership_type) {
      query = query.eq('ownership_type', filters.ownership_type);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    try {
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback to seed data if Supabase connection fails
    }

    // High-performance fallback from SEED_ITEMS
    let items = SEED_ITEMS.map((item) => {
      const owner = SEED_PROFILES.find((p) => p.id === item.owner_id);
      const community = SEED_COMMUNITIES.find((c) => c.id === item.community_id);
      return {
        ...item,
        owner: owner ? { id: owner.id, full_name: owner.full_name, avatar_url: owner.avatar_url } : undefined,
        community: community ? { id: community.id, name: community.name, slug: community.slug } : undefined,
      };
    });

    if (filters.category && filters.category !== 'Semua') {
      items = items.filter((i) => i.category.toLowerCase() === filters.category?.toLowerCase());
    }
    if (filters.ownership_type) {
      items = items.filter((i) => i.ownership_type === filters.ownership_type);
    }
    if (filters.status) {
      items = items.filter((i) => i.status === filters.status);
    }
    if ((filters as any).owner_id) {
      items = items.filter((i) => i.owner_id === (filters as any).owner_id);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter((i) => i.name.toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q));
    }

    return items;
  }

  /**
   * Get item details by ID
   */
  static async getItemById(
    supabase: SupabaseClient<Database>,
    itemId: string,
    userId?: string
  ) {
    try {
      const { data: item, error } = await supabase
        .from('items')
        .select(`
          *,
          owner:profiles (
            id,
            full_name,
            avatar_url
          ),
          community:communities (
            id,
            name,
            slug,
            location
          )
        `)
        .eq('id', itemId)
        .maybeSingle();

      if (!error && item) {
        return item;
      }
    } catch {
      // Fallback
    }

    const item = SEED_ITEMS.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundError(`Item not found with ID ${itemId}`);
    }

    const owner = SEED_PROFILES.find((p) => p.id === item.owner_id);
    const community = SEED_COMMUNITIES.find((c) => c.id === item.community_id);

    return {
      ...item,
      owner: owner ? { id: owner.id, full_name: owner.full_name, avatar_url: owner.avatar_url } : undefined,
      community: community ? { id: community.id, name: community.name, slug: community.slug, location: community.location } : undefined,
    };
  }

  /**
   * Create a new item (owner is automatically the authenticated user)
   */
  static async createItem(
    supabaseAdmin: SupabaseClient<Database>,
    data: CreateItemInput,
    ownerId: string
  ) {
    // 1. Verify user belongs to the target community
    const isMember = await CommunitiesService.isMember(supabaseAdmin, data.community_id, ownerId);
    if (!isMember) {
      throw new ForbiddenError('You can only create items in communities you belong to');
    }

    // 2. Insert item
    try {
      const { data: item, error } = await supabaseAdmin
        .from('items')
        .insert({
          community_id: data.community_id,
          owner_id: ownerId,
          name: data.name,
          description: data.description || null,
          category: data.category,
          condition: data.condition || null,
          location_hint: data.location_hint || null,
          borrowing_rules: data.borrowing_rules || null,
          ownership_type: data.ownership_type || 'personal',
          image_url: data.image_url || null,
          status: 'available',
        } as any)
        .select(`
          *,
          owner:profiles (
            id,
            full_name,
            avatar_url
          ),
          community:communities (
            id,
            name,
            slug
          )
        `)
        .single();

      if (!error && item) {
        return item;
      }
    } catch {
      // Fallback
    }

    const createdId = `item-${Date.now()}`;
    const created: SeedItem = {
      id: createdId,
      community_id: data.community_id,
      owner_id: ownerId,
      name: data.name,
      description: data.description || '',
      category: data.category,
      condition: data.condition || 'Good',
      location_hint: data.location_hint || '',
      borrowing_rules: data.borrowing_rules || '',
      ownership_type: (data.ownership_type as any) || 'personal',
      image_url: data.image_url || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600',
      status: 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    SEED_ITEMS.unshift(created);

    const owner = SEED_PROFILES.find((p) => p.id === ownerId);
    const comm = SEED_COMMUNITIES.find((c) => c.id === data.community_id);

    return {
      ...created,
      owner: owner ? { id: owner.id, full_name: owner.full_name, avatar_url: owner.avatar_url } : undefined,
      community: comm ? { id: comm.id, name: comm.name, slug: comm.slug } : undefined,
    };
  }

  /**
   * Update item details (only owner)
   */
  static async updateItem(
    supabaseAdmin: SupabaseClient<Database>,
    itemId: string,
    data: UpdateItemInput,
    userId: string
  ) {
    const { data: item } = await supabaseAdmin
      .from('items')
      .select('*')
      .eq('id', itemId)
      .maybeSingle();

    if (!item) {
      throw new NotFoundError(`Item not found with ID ${itemId}`);
    }

    if (item.owner_id !== userId) {
      throw new ForbiddenError('Only the item owner can modify item details');
    }

    const { data: updatedItem, error } = await supabaseAdmin
      .from('items')
      .update({
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.condition !== undefined ? { condition: data.condition } : {}),
        ...(data.location_hint !== undefined ? { location_hint: data.location_hint } : {}),
        ...(data.borrowing_rules !== undefined ? { borrowing_rules: data.borrowing_rules } : {}),
        ...(data.ownership_type !== undefined ? { ownership_type: data.ownership_type } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.image_url !== undefined ? { image_url: data.image_url } : {}),
      } as any)
      .eq('id', itemId)
      .select()
      .single();

    if (error || !updatedItem) {
      throw error;
    }

    return updatedItem;
  }

  /**
   * Delete item (only owner, cannot delete if active borrowing exists)
   */
  static async deleteItem(
    supabaseAdmin: SupabaseClient<Database>,
    itemId: string,
    userId: string
  ) {
    const { data: item } = await supabaseAdmin
      .from('items')
      .select('*')
      .eq('id', itemId)
      .maybeSingle();

    if (!item) {
      throw new NotFoundError(`Item not found with ID ${itemId}`);
    }

    if (item.owner_id !== userId) {
      throw new ForbiddenError('Only the item owner can delete this item');
    }

    // Check active borrowings
    const { data: activeBorrows } = await supabaseAdmin
      .from('borrowing_requests')
      .select('id, status')
      .eq('item_id', itemId)
      .in('status', ['approved', 'overdue']);

    if (activeBorrows && activeBorrows.length > 0) {
      throw new ConflictError('Cannot delete item with active approved or overdue borrowings');
    }

    const { error } = await supabaseAdmin.from('items').delete().eq('id', itemId);
    if (error) {
      throw error;
    }

    return { id: itemId, deleted: true };
  }
}
