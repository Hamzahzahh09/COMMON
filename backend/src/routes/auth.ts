import { Hono } from 'hono';
import type { AppContext } from '../types';
import { authMiddleware } from '../middleware/auth.middleware';
import { successResponse } from '../lib/response';

export const authRoutes = new Hono<AppContext>();

authRoutes.use('*', authMiddleware);

/**
 * GET /api/v1/auth/me
 * Retrieve the authenticated user's profile and active community memberships
 */
authRoutes.get('/me', async (c) => {
  const user = c.get('user');
  const supabase = c.get('supabase');

  // Fetch full profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch community memberships
  const { data: memberships } = await supabase
    .from('community_members')
    .select(`
      role,
      joined_at,
      community:communities (
        id,
        name,
        slug,
        description,
        location
      )
    `)
    .eq('user_id', user.id);

  return successResponse(c, {
    user: {
      ...user,
      profile: profile || null,
      communities: (memberships || []).map((m) => ({
        ...m.community,
        role: m.role,
        joined_at: m.joined_at,
      })),
    },
  });
});
