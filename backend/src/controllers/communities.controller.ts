import type { Context } from 'hono';
import type { AppContext, AuthUser } from '../types';
import { CommunitiesService } from '../services/communities.service';
import { createdResponse, successResponse } from '../lib/response';
import type { CreateCommunityInput } from '../schemas/community.schema';
import { UnauthorizedError } from '../utils/errors';

export class CommunitiesController {
  static async list(c: Context<AppContext>) {
    const user = c.get('user') as AuthUser | undefined;
    const supabaseAdmin = c.get('supabaseAdmin');
    const isAll = c.req.query('all') === 'true';
    const search = c.req.query('search');

    if (isAll || !user) {
      const communities = await CommunitiesService.listAllCommunities(
        supabaseAdmin,
        search,
        user?.id
      );
      return successResponse(c, communities);
    }

    const communities = await CommunitiesService.listUserCommunities(supabaseAdmin, user.id);
    return successResponse(c, communities);
  }

  static async getById(c: Context<AppContext>) {
    const user = c.get('user') as AuthUser | undefined;
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;

    const community = await CommunitiesService.getCommunityById(supabaseAdmin, id, user?.id);
    return successResponse(c, community);
  }

  static async getBySlug(c: Context<AppContext>) {
    const user = c.get('user') as AuthUser | undefined;
    const supabaseAdmin = c.get('supabaseAdmin');
    const slug = c.req.param('slug') as string;

    const community = await CommunitiesService.getCommunityBySlug(supabaseAdmin, slug, user?.id);
    return successResponse(c, community);
  }

  static async create(c: Context<AppContext>) {
    const user = c.get('user');
    if (!user) throw new UnauthorizedError('Authentication required');
    const supabaseAdmin = c.get('supabaseAdmin');
    const body = c.get('validatedBody' as any) as CreateCommunityInput;

    const community = await CommunitiesService.createCommunity(supabaseAdmin, body, user.id);
    return createdResponse(c, community, 'Community created successfully');
  }

  static async join(c: Context<AppContext>) {
    const user = c.get('user');
    if (!user) throw new UnauthorizedError('Authentication required');
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;

    const result = await CommunitiesService.joinCommunity(supabaseAdmin, id, user.id);
    return successResponse(c, result, 200, 'Successfully joined community');
  }

  static async leave(c: Context<AppContext>) {
    const user = c.get('user');
    if (!user) throw new UnauthorizedError('Authentication required');
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;

    const result = await CommunitiesService.leaveCommunity(supabaseAdmin, id, user.id);
    return successResponse(c, result, 200, 'Successfully left community');
  }

  static async getMembers(c: Context<AppContext>) {
    const user = c.get('user') as AuthUser | undefined;
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;

    const members = await CommunitiesService.getCommunityMembers(supabaseAdmin, id, user?.id);
    return successResponse(c, members);
  }
}
