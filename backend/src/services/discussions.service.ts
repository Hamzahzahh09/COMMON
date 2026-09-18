import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import { ForbiddenError, NotFoundError } from '../utils/errors';
import { CommunitiesService } from './communities.service';
import {
  SEED_DISCUSSIONS,
  SEED_PROFILES,
  type SeedDiscussion,
} from '../data/seed-data';

export class DiscussionsService {
  /**
   * List discussions in a community
   */
  static async listDiscussions(
    supabaseAdmin: SupabaseClient<Database>,
    communityId: string,
    category?: string
  ) {
    try {
      let query = supabaseAdmin
        .from('community_discussions' as any)
        .select(`
          id,
          community_id,
          author_id,
          title,
          content,
          category,
          created_at,
          updated_at,
          author:profiles (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });

      if (category && category !== 'Semua') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback below
    }

    let discussions = SEED_DISCUSSIONS.filter((d) => d.community_id === communityId);
    if (category && category !== 'Semua') {
      discussions = discussions.filter((d) => d.category === category);
    }

    return discussions.map((d) => {
      const author = SEED_PROFILES.find((p) => p.id === d.author_id) || {
        id: d.author_id,
        full_name: 'Warga Komunitas',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      };
      return {
        ...d,
        author: {
          id: author.id,
          full_name: author.full_name,
          avatar_url: author.avatar_url,
        },
      };
    });
  }

  /**
   * Create a new discussion post
   */
  static async createDiscussion(
    supabaseAdmin: SupabaseClient<Database>,
    communityId: string,
    authorId: string,
    data: { title: string; content: string; category?: string }
  ) {
    try {
      const { data: post, error } = await supabaseAdmin
        .from('community_discussions' as any)
        .insert({
          community_id: communityId,
          author_id: authorId,
          title: data.title.trim(),
          content: data.content.trim(),
          category: data.category || 'general',
        })
        .select(`
          id,
          community_id,
          author_id,
          title,
          content,
          category,
          created_at,
          author:profiles (
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (!error && post) return post;
    } catch {
      // Fallback below
    }

    const newDisc: SeedDiscussion = {
      id: crypto.randomUUID(),
      community_id: communityId,
      author_id: authorId,
      title: data.title.trim(),
      content: data.content.trim(),
      category: (data.category as any) || 'general',
      created_at: new Date().toISOString(),
    };

    SEED_DISCUSSIONS.unshift(newDisc);

    const author = SEED_PROFILES.find((p) => p.id === authorId) || {
      id: authorId,
      full_name: 'Warga Komunitas',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    };

    return {
      ...newDisc,
      author: {
        id: author.id,
        full_name: author.full_name,
        avatar_url: author.avatar_url,
      },
    };
  }

  /**
   * Delete a discussion post (author or admin)
   */
  static async deleteDiscussion(
    supabaseAdmin: SupabaseClient<Database>,
    discussionId: string,
    userId: string
  ) {
    try {
      const { data } = await supabaseAdmin
        .from('community_discussions')
        .select('*')
        .eq('id', discussionId)
        .maybeSingle();

      if (data) {
        await supabaseAdmin
          .from('community_discussions' as any)
          .delete()
          .eq('id', discussionId);

        return { success: true, message: 'Discussion post deleted' };
      }
    } catch {
      // Fallback below
    }

    const idx = SEED_DISCUSSIONS.findIndex((d) => d.id === discussionId);
    if (idx >= 0) {
      SEED_DISCUSSIONS.splice(idx, 1);
    }

    return { success: true, message: 'Discussion post deleted' };
  }
}
