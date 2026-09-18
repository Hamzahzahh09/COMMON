import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import { BadRequestError, ForbiddenError, NotFoundError } from '../utils/errors';
import { CommunitiesService } from './communities.service';
import { BorrowingService } from './borrowing.service';

export class NeedOffersService {
  /**
   * List offers for a community need
   */
  static async getOffersByNeedId(
    supabaseAdmin: SupabaseClient<Database>,
    needId: string,
    userId?: string
  ) {
    // 1. Fetch the need
    const { data: need, error: needErr } = await supabaseAdmin
      .from('community_needs')
      .select('*')
      .eq('id', needId)
      .maybeSingle();

    if (needErr || !need) {
      throw new NotFoundError(`Community need not found with ID ${needId}`);
    }

    // 2. Fetch offers with user and item metadata
    const { data: offers, error } = await supabaseAdmin
      .from('community_need_offers' as any)
      .select(`
        id,
        need_id,
        user_id,
        item_id,
        message,
        status,
        created_at,
        user:profiles (
          id,
          full_name,
          avatar_url
        ),
        item:items (
          id,
          name,
          category,
          condition,
          status,
          image_url,
          ownership_type
        )
      `)
      .eq('need_id', needId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return offers || [];
  }

  /**
   * Create an "I HAVE" offer for a need
   */
  static async createOffer(
    supabaseAdmin: SupabaseClient<Database>,
    needId: string,
    userId: string,
    data: { item_id?: string; message: string }
  ) {
    // 1. Fetch the need
    const { data: need, error: needErr } = await supabaseAdmin
      .from('community_needs')
      .select('*')
      .eq('id', needId)
      .maybeSingle();

    if (needErr || !need) {
      throw new NotFoundError(`Community need not found with ID ${needId}`);
    }

    if (need.user_id === userId) {
      throw new BadRequestError('You cannot offer an item for your own need request');
    }

    // 2. Verify membership in community
    const isMember = await CommunitiesService.isMember(supabaseAdmin, need.community_id, userId);
    if (!isMember) {
      throw new ForbiddenError('You must be a member of the community to make an offer');
    }

    // 3. If item_id provided, verify caller owns the item
    if (data.item_id) {
      const { data: item } = await supabaseAdmin
        .from('items')
        .select('*')
        .eq('id', data.item_id)
        .maybeSingle();

      if (!item) {
        throw new NotFoundError(`Item not found with ID ${data.item_id}`);
      }
      if (item.owner_id !== userId) {
        throw new ForbiddenError('You can only offer items you own');
      }
    }

    // 4. Insert offer
    const { data: offer, error } = await supabaseAdmin
      .from('community_need_offers' as any)
      .insert({
        need_id: needId,
        user_id: userId,
        item_id: data.item_id || null,
        message: data.message.trim(),
        status: 'pending',
      })
      .select(`
        id,
        need_id,
        user_id,
        item_id,
        message,
        status,
        created_at,
        user:profiles (
          id,
          full_name,
          avatar_url
        ),
        item:items (
          id,
          name,
          category,
          condition,
          status,
          image_url,
          ownership_type
        )
      `)
      .single();

    if (error) throw error;
    return offer;
  }

  /**
   * Accept an offer (Need creator only).
   * If an item was offered, optionally converts into a borrowing request!
   */
  static async acceptOffer(
    supabaseAdmin: SupabaseClient<Database>,
    offerId: string,
    userId: string
  ) {
    const { data: offer } = await supabaseAdmin
      .from('community_need_offers')
      .select('*, need:community_needs(*)')
      .eq('id', offerId)
      .maybeSingle();

    if (!offer) {
      throw new NotFoundError(`Offer not found with ID ${offerId}`);
    }

    const offerData = offer as any;
    const need = offerData.need;
    if (need.user_id !== userId) {
      throw new ForbiddenError('Only the creator of the need can accept offers');
    }

    // 1. Mark offer as accepted
    const { data: updatedOffer, error } = await supabaseAdmin
      .from('community_need_offers')
      .update({ status: 'accepted' })
      .eq('id', offerId)
      .select()
      .single();

    if (error) throw error;

    // 2. Mark need as fulfilled
    await supabaseAdmin
      .from('community_needs')
      .update({ status: 'fulfilled' })
      .eq('id', need.id);

    // 3. If offer has item_id, create a pending borrowing request for the need creator
    let createdBorrowRequest = null;
    if (offerData.item_id) {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const threeDaysLater = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

      try {
        createdBorrowRequest = await BorrowingService.createRequest(
          supabaseAdmin,
          {
            item_id: offerData.item_id,
            start_date: need.needed_from || tomorrow,
            end_date: need.needed_until || threeDaysLater,
            purpose: `Ditawarkan dari kebutuhan: ${need.title}`,
          },
          userId
        );
      } catch (e) {
        // If overlapping booking or already requested, proceed gracefully
      }
    }

    return {
      offer: updatedOffer,
      borrow_request: createdBorrowRequest,
    };
  }
}
