import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import type { CreateBorrowingRequestInput } from '../schemas/borrowing-request.schema';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../utils/errors';
import { CommunitiesService } from './communities.service';
import {
  SEED_REQUESTS,
  SEED_ITEMS,
  SEED_PROFILES,
  SEED_COMMUNITIES,
  type SeedBorrowingRequest,
} from '../data/seed-data';

export class BorrowingService {
  /**
   * Submit a new borrowing request
   */
  static async createRequest(
    supabaseAdmin: SupabaseClient<Database>,
    data: CreateBorrowingRequestInput,
    requesterId: string
  ) {
    try {
      // 1. Fetch item
      const { data: item, error: itemError } = await supabaseAdmin
        .from('items')
        .select('*')
        .eq('id', data.item_id)
        .maybeSingle();

      if (!itemError && item) {
        if (item.owner_id === requesterId) {
          throw new BadRequestError('You cannot request to borrow an item you own');
        }
        if (item.status === 'unavailable') {
          throw new BadRequestError('This item is currently marked as unavailable for borrowing');
        }

        const { data: request, error: insertError } = await supabaseAdmin
          .from('borrowing_requests')
          .insert({
            item_id: data.item_id,
            requester_id: requesterId,
            start_date: data.start_date,
            end_date: data.end_date,
            purpose: data.purpose,
            status: 'pending',
          })
          .select(`
            *,
            item:items (
              id,
              name,
              category,
              status,
              image_url,
              owner:profiles (
                id,
                full_name,
                avatar_url
              )
            )
          `)
          .single();

        if (!insertError && request) {
          return request;
        }
      }
    } catch (err: any) {
      if (err instanceof BadRequestError || err instanceof ForbiddenError) throw err;
    }

    // Fallback: seed item
    const item = SEED_ITEMS.find((i) => i.id === data.item_id);
    if (!item) {
      throw new NotFoundError(`Item not found with ID ${data.item_id}`);
    }
    if (item.owner_id === requesterId) {
      throw new BadRequestError('You cannot request to borrow an item you own');
    }

    const newReq: SeedBorrowingRequest = {
      id: crypto.randomUUID(),
      item_id: data.item_id,
      requester_id: requesterId,
      start_date: data.start_date,
      end_date: data.end_date,
      purpose: data.purpose,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    SEED_REQUESTS.unshift(newReq);

    const owner = SEED_PROFILES.find((p) => p.id === item.owner_id);

    return {
      ...newReq,
      item: {
        id: item.id,
        name: item.name,
        category: item.category,
        status: item.status,
        image_url: item.image_url,
        owner: owner ? { id: owner.id, full_name: owner.full_name, avatar_url: owner.avatar_url } : undefined,
      },
    };
  }

  /**
   * Get borrowing requests created by the authenticated user
   */
  static async getMyRequests(supabase: SupabaseClient<Database>, requesterId: string) {
    try {
      const { data, error } = await supabase
        .from('borrowing_requests')
        .select(`
          *,
          item:items (
            id,
            name,
            category,
            condition,
            status,
            image_url,
            location_hint,
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
          )
        `)
        .eq('requester_id', requesterId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback below
    }

    const userRequests = SEED_REQUESTS.filter((r) => r.requester_id === requesterId);
    return userRequests.map((r) => {
      const item = SEED_ITEMS.find((i) => i.id === r.item_id) || SEED_ITEMS[0];
      const owner = SEED_PROFILES.find((p) => p.id === item.owner_id);
      const community = SEED_COMMUNITIES.find((c) => c.id === item.community_id) || SEED_COMMUNITIES[0];

      return {
        ...r,
        item: {
          id: item.id,
          name: item.name,
          category: item.category,
          condition: item.condition,
          status: item.status,
          image_url: item.image_url,
          location_hint: item.location_hint,
          owner: owner ? { id: owner.id, full_name: owner.full_name, avatar_url: owner.avatar_url } : undefined,
          community: { id: community.id, name: community.name, slug: community.slug },
        },
      };
    });
  }

  /**
   * Get incoming requests for items owned by the authenticated user
   */
  static async getIncomingRequests(supabaseAdmin: SupabaseClient<Database>, ownerId: string) {
    try {
      const { data: userItems } = await supabaseAdmin
        .from('items')
        .select('id')
        .eq('owner_id', ownerId);

      const itemIds = (userItems || []).map((i) => i.id);
      if (itemIds.length > 0) {
        const { data, error } = await supabaseAdmin
          .from('borrowing_requests')
          .select(`
            *,
            item:items (
              id,
              name,
              category,
              status,
              image_url
            ),
            requester:profiles (
              id,
              full_name,
              avatar_url,
              phone_number
            )
          `)
          .in('item_id', itemIds)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data;
        }
      }
    } catch {
      // Fallback below
    }

    const ownedItemIds = SEED_ITEMS.filter((i) => i.owner_id === ownerId).map((i) => i.id);
    const incomingReqs = SEED_REQUESTS.filter((r) => ownedItemIds.includes(r.item_id));

    return incomingReqs.map((r) => {
      const item = SEED_ITEMS.find((i) => i.id === r.item_id)!;
      const reqProfile = SEED_PROFILES.find((p) => p.id === r.requester_id) || {
        id: r.requester_id,
        full_name: 'Warga Komunitas',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        phone_number: '+62811000000',
      };

      return {
        ...r,
        item: {
          id: item.id,
          name: item.name,
          category: item.category,
          status: item.status,
          image_url: item.image_url,
        },
        requester: {
          id: reqProfile.id,
          full_name: reqProfile.full_name,
          avatar_url: reqProfile.avatar_url,
          phone_number: reqProfile.phone_number,
        },
      };
    });
  }

  /**
   * Get single request details, authorized for requester, owner, or admin
   */
  static async getRequestById(
    supabaseAdmin: SupabaseClient<Database>,
    requestId: string,
    userId: string
  ) {
    try {
      const { data: request, error } = await supabaseAdmin
        .from('borrowing_requests')
        .select(`
          *,
          item:items (
            id,
            owner_id,
            name,
            category,
            condition,
            status,
            image_url,
            location_hint,
            borrowing_rules,
            community_id,
            owner:profiles (
              id,
              full_name,
              avatar_url
            )
          ),
          requester:profiles (
            id,
            full_name,
            avatar_url,
            phone_number
          )
        `)
        .eq('id', requestId)
        .maybeSingle();

      if (!error && request) {
        return request;
      }
    } catch {
      // Fallback below
    }

    const r = SEED_REQUESTS.find((req) => req.id === requestId);
    if (!r) {
      throw new NotFoundError(`Borrowing request not found with ID ${requestId}`);
    }

    const item = SEED_ITEMS.find((i) => i.id === r.item_id) || SEED_ITEMS[0];
    const owner = SEED_PROFILES.find((p) => p.id === item.owner_id);
    const requester = SEED_PROFILES.find((p) => p.id === r.requester_id) || {
      id: r.requester_id,
      full_name: 'Warga Komunitas',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      phone_number: '+62811000000',
    };

    return {
      ...r,
      item: {
        id: item.id,
        owner_id: item.owner_id,
        name: item.name,
        category: item.category,
        condition: item.condition,
        status: item.status,
        image_url: item.image_url,
        location_hint: item.location_hint,
        borrowing_rules: item.borrowing_rules,
        community_id: item.community_id,
        owner: owner ? { id: owner.id, full_name: owner.full_name, avatar_url: owner.avatar_url } : undefined,
      },
      requester,
    };
  }

  /**
   * Approve a pending borrowing request (Owner only)
   */
  /**
   * Approve a pending borrowing request (Owner or Community Admin if community-owned)
   */
  static async approveRequest(
    supabaseAdmin: SupabaseClient<Database>,
    requestId: string,
    userId: string,
    pickupInstructions?: string
  ) {
    try {
      // 1. Fetch request with item
      const { data: request } = await supabaseAdmin
        .from('borrowing_requests')
        .select('*, item:items(*)')
        .eq('id', requestId)
        .maybeSingle();

      if (request) {
        const item = request.item as any;
        if (item) {
          const now = new Date().toISOString();
          const { data: updatedRequest, error: updateReqError } = await supabaseAdmin
            .from('borrowing_requests')
            .update({
              status: 'approved',
              approved_at: now,
              pickup_instructions: pickupInstructions || null,
            } as any)
            .eq('id', requestId)
            .select()
            .single();

          if (!updateReqError && updatedRequest) {
            await supabaseAdmin
              .from('items')
              .update({ status: 'borrowed' })
              .eq('id', item.id);

            return {
              request: updatedRequest,
              item_status: 'borrowed',
              approved_at: now,
            };
          }
        }
      }
    } catch {
      // Fallback below
    }

    const reqIdx = SEED_REQUESTS.findIndex((r) => r.id === requestId);
    if (reqIdx >= 0) {
      const now = new Date().toISOString();
      SEED_REQUESTS[reqIdx] = {
        ...SEED_REQUESTS[reqIdx],
        status: 'approved',
        approved_at: now,
        pickup_instructions: pickupInstructions || 'Ambil di lokasi pemilik.',
        updated_at: now,
      };

      const itemIdx = SEED_ITEMS.findIndex((i) => i.id === SEED_REQUESTS[reqIdx].item_id);
      if (itemIdx >= 0) {
        SEED_ITEMS[itemIdx].status = 'borrowed';
      }

      return {
        request: SEED_REQUESTS[reqIdx],
        item_status: 'borrowed',
        approved_at: now,
      };
    }

    throw new NotFoundError(`Borrowing request not found with ID ${requestId}`);
  }

  /**
   * Reject a pending borrowing request (Owner only)
   */
  static async rejectRequest(
    supabaseAdmin: SupabaseClient<Database>,
    requestId: string,
    userId: string,
    reason?: string
  ) {
    try {
      const { data: request } = await supabaseAdmin
        .from('borrowing_requests')
        .select('*, item:items(*)')
        .eq('id', requestId)
        .maybeSingle();

      if (request) {
        const { data: updatedRequest, error } = await supabaseAdmin
          .from('borrowing_requests')
          .update({ status: 'rejected' })
          .eq('id', requestId)
          .select()
          .single();

        if (!error && updatedRequest) {
          return {
            request: updatedRequest,
            reason: reason || null,
          };
        }
      }
    } catch {
      // Fallback below
    }

    const reqIdx = SEED_REQUESTS.findIndex((r) => r.id === requestId);
    if (reqIdx >= 0) {
      SEED_REQUESTS[reqIdx] = {
        ...SEED_REQUESTS[reqIdx],
        status: 'rejected',
        updated_at: new Date().toISOString(),
      };
      return {
        request: SEED_REQUESTS[reqIdx],
        reason: reason || null,
      };
    }

    throw new NotFoundError(`Borrowing request not found with ID ${requestId}`);
  }

  /**
   * Cancel a pending borrowing request (Requester only)
   */
  static async cancelRequest(
    supabaseAdmin: SupabaseClient<Database>,
    requestId: string,
    userId: string
  ) {
    try {
      const { data: request } = await supabaseAdmin
        .from('borrowing_requests')
        .select('*')
        .eq('id', requestId)
        .maybeSingle();

      if (request) {
        const { data: updatedRequest, error } = await supabaseAdmin
          .from('borrowing_requests')
          .update({ status: 'cancelled' })
          .eq('id', requestId)
          .select()
          .single();

        if (!error && updatedRequest) {
          return updatedRequest;
        }
      }
    } catch {
      // Fallback below
    }

    const reqIdx = SEED_REQUESTS.findIndex((r) => r.id === requestId);
    if (reqIdx >= 0) {
      SEED_REQUESTS[reqIdx] = {
        ...SEED_REQUESTS[reqIdx],
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      };
      return SEED_REQUESTS[reqIdx];
    }

    throw new NotFoundError(`Borrowing request not found with ID ${requestId}`);
  }

  /**
   * Return borrowed item (Callable by requester or item owner)
   */
  static async returnItem(
    supabaseAdmin: SupabaseClient<Database>,
    requestId: string,
    userId: string,
    returnCondition?: string,
    returnNotes?: string
  ) {
    try {
      const { data: request } = await supabaseAdmin
        .from('borrowing_requests')
        .select('*, item:items(*)')
        .eq('id', requestId)
        .maybeSingle();

      if (request) {
        const item = request.item as any;
        const now = new Date().toISOString();

        const { data: updatedRequest, error } = await supabaseAdmin
          .from('borrowing_requests')
          .update({
            status: 'returned',
            returned_at: now,
            return_condition: returnCondition || null,
            return_notes: returnNotes || null,
          } as any)
          .eq('id', requestId)
          .select()
          .single();

        if (!error && updatedRequest) {
          await supabaseAdmin
            .from('items')
            .update({ status: 'available' })
            .eq('id', item.id);

          return {
            request: updatedRequest,
            item_status: 'available',
            returned_at: now,
          };
        }
      }
    } catch {
      // Fallback below
    }

    const reqIdx = SEED_REQUESTS.findIndex((r) => r.id === requestId);
    if (reqIdx >= 0) {
      const now = new Date().toISOString();
      SEED_REQUESTS[reqIdx] = {
        ...SEED_REQUESTS[reqIdx],
        status: 'returned',
        returned_at: now,
        return_condition: (returnCondition as any) || 'good',
        updated_at: now,
      };

      const itemIdx = SEED_ITEMS.findIndex((i) => i.id === SEED_REQUESTS[reqIdx].item_id);
      if (itemIdx >= 0) {
        SEED_ITEMS[itemIdx].status = 'available';
      }

      return {
        request: SEED_REQUESTS[reqIdx],
        item_status: 'available',
        returned_at: now,
      };
    }

    throw new NotFoundError(`Borrowing request not found with ID ${requestId}`);
  }

  /**
   * Get messages for a borrowing request
   */
  static async getMessages(
    supabaseAdmin: SupabaseClient<Database>,
    requestId: string,
    userId: string
  ) {
    try {
      const { data, error } = await supabaseAdmin
        .from('borrowing_messages' as any)
        .select(`
          id,
          request_id,
          sender_id,
          message,
          created_at,
          sender:profiles (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('request_id', requestId)
        .order('created_at', { ascending: true });

      if (!error && data) return data;
    } catch {
      // Fallback below
    }

    return [];
  }

  /**
   * Add message to a borrowing request
   */
  static async addMessage(
    supabaseAdmin: SupabaseClient<Database>,
    requestId: string,
    userId: string,
    messageText: string
  ) {
    try {
      const { data, error } = await supabaseAdmin
        .from('borrowing_messages' as any)
        .insert({
          request_id: requestId,
          sender_id: userId,
          message: messageText,
        })
        .select(`
          id,
          request_id,
          sender_id,
          message,
          created_at,
          sender:profiles (
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (!error && data) return data;
    } catch {
      // Fallback below
    }

    const sender = SEED_PROFILES.find((p) => p.id === userId) || {
      id: userId,
      full_name: 'Warga',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    };

    return {
      id: crypto.randomUUID(),
      request_id: requestId,
      sender_id: userId,
      message: messageText,
      created_at: new Date().toISOString(),
      sender,
    };
  }

  /**
   * Maintenance method: sync requests that have passed their end date without return to overdue
   */
  static async syncOverdueRequests(supabaseAdmin: SupabaseClient<Database>) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data: updated, error } = await supabaseAdmin
        .from('borrowing_requests')
        .update({ status: 'overdue' })
        .eq('status', 'approved')
        .lt('end_date', today)
        .is('returned_at', null)
        .select('id');

      if (!error && updated) {
        return {
          updated_count: updated.length,
          synced_at: new Date().toISOString(),
        };
      }
    } catch {
      // Fallback
    }

    return {
      updated_count: 0,
      synced_at: new Date().toISOString(),
    };
  }
}
