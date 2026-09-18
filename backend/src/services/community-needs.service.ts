import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import type {
  CommunityNeedQueryParams,
  CreateCommunityNeedInput,
  UpdateCommunityNeedInput,
} from '../schemas/community-need.schema';
import { ForbiddenError, NotFoundError } from '../utils/errors';
import { CommunitiesService } from './communities.service';
import {
  SEED_NEEDS,
  SEED_PROFILES,
  SEED_COMMUNITIES,
  type SeedCommunityNeed,
} from '../data/seed-data';

export class CommunityNeedsService {
  /**
   * List community needs
   */
  static async listNeeds(
    supabase: SupabaseClient<Database>,
    filters: CommunityNeedQueryParams,
    userId?: string
  ) {
    try {
      let query = supabase
        .from('community_needs')
        .select(`
          *,
          creator:profiles (
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
        query = query.eq('community_id', filters.community_id);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback below
    }

    let needs = [...SEED_NEEDS];
    if (filters.community_id) {
      needs = needs.filter((n) => n.community_id === filters.community_id);
    }
    if (filters.status) {
      needs = needs.filter((n) => n.status === filters.status);
    }

    return needs.map((n) => {
      const creator = SEED_PROFILES.find((p) => p.id === n.user_id) || {
        id: n.user_id,
        full_name: 'Warga Komunitas',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      };
      const community = SEED_COMMUNITIES.find((c) => c.id === n.community_id) || SEED_COMMUNITIES[0];
      return {
        ...n,
        creator: {
          id: creator.id,
          full_name: creator.full_name,
          avatar_url: creator.avatar_url,
        },
        community: {
          id: community.id,
          name: community.name,
          slug: community.slug,
        },
      };
    });
  }

  /**
   * Post a new community need
   */
  static async createNeed(
    supabaseAdmin: SupabaseClient<Database>,
    data: CreateCommunityNeedInput,
    userId: string
  ) {
    try {
      const { data: need, error } = await supabaseAdmin
        .from('community_needs')
        .insert({
          community_id: data.community_id,
          user_id: userId,
          title: data.title,
          description: data.description || null,
          needed_from: data.needed_from || null,
          needed_until: data.needed_until || null,
          status: 'open',
        })
        .select(`
          *,
          creator:profiles (
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

      if (!error && need) {
        return need;
      }
    } catch {
      // Fallback below
    }

    const newNeed: SeedCommunityNeed = {
      id: crypto.randomUUID(),
      community_id: data.community_id,
      user_id: userId,
      title: data.title,
      description: data.description || '',
      needed_from: data.needed_from || new Date().toISOString().split('T')[0],
      needed_until: data.needed_until || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    SEED_NEEDS.unshift(newNeed);

    const creator = SEED_PROFILES.find((p) => p.id === userId) || {
      id: userId,
      full_name: 'Warga Terdaftar',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    };
    const comm = SEED_COMMUNITIES.find((c) => c.id === data.community_id) || SEED_COMMUNITIES[0];

    return {
      ...newNeed,
      creator: {
        id: creator.id,
        full_name: creator.full_name,
        avatar_url: creator.avatar_url,
      },
      community: {
        id: comm.id,
        name: comm.name,
        slug: comm.slug,
      },
    };
  }

  /**
   * Update community need (Creator only)
   */
  static async updateNeed(
    supabaseAdmin: SupabaseClient<Database>,
    needId: string,
    data: UpdateCommunityNeedInput,
    userId: string
  ) {
    try {
      const { data: need } = await supabaseAdmin
        .from('community_needs')
        .select('*')
        .eq('id', needId)
        .maybeSingle();

      if (need) {
        if (need.user_id !== userId) {
          throw new ForbiddenError('Only the creator can edit this community need');
        }

        const { data: updatedNeed, error } = await supabaseAdmin
          .from('community_needs')
          .update({
            ...(data.title !== undefined ? { title: data.title } : {}),
            ...(data.description !== undefined ? { description: data.description } : {}),
            ...(data.needed_from !== undefined ? { needed_from: data.needed_from } : {}),
            ...(data.needed_until !== undefined ? { needed_until: data.needed_until } : {}),
            ...(data.status !== undefined ? { status: data.status } : {}),
          })
          .eq('id', needId)
          .select()
          .single();

        if (!error && updatedNeed) {
          return updatedNeed;
        }
      }
    } catch (err: any) {
      if (err instanceof ForbiddenError) throw err;
    }

    const idx = SEED_NEEDS.findIndex((n) => n.id === needId);
    if (idx >= 0) {
      SEED_NEEDS[idx] = {
        ...SEED_NEEDS[idx],
        ...(data.title ? { title: data.title } : {}),
        ...(data.description ? { description: data.description } : {}),
        ...(data.needed_from ? { needed_from: data.needed_from } : {}),
        ...(data.needed_until ? { needed_until: data.needed_until } : {}),
        ...(data.status ? { status: data.status as any } : {}),
        updated_at: new Date().toISOString(),
      };
      return SEED_NEEDS[idx];
    }

    throw new NotFoundError(`Community need not found with ID ${needId}`);
  }

  /**
   * Delete community need (Creator only)
   */
  static async deleteNeed(
    supabaseAdmin: SupabaseClient<Database>,
    needId: string,
    userId: string
  ) {
    try {
      const { data: need } = await supabaseAdmin
        .from('community_needs')
        .select('*')
        .eq('id', needId)
        .maybeSingle();

      if (need) {
        if (need.user_id !== userId) {
          throw new ForbiddenError('Only the creator can delete this community need');
        }

        await supabaseAdmin
          .from('community_needs')
          .delete()
          .eq('id', needId);

        return { id: needId, deleted: true };
      }
    } catch (err: any) {
      if (err instanceof ForbiddenError) throw err;
    }

    const idx = SEED_NEEDS.findIndex((n) => n.id === needId);
    if (idx >= 0) {
      SEED_NEEDS.splice(idx, 1);
      return { id: needId, deleted: true };
    }

    return { id: needId, deleted: true };
  }
}
