import type { Context } from 'hono';
import type { AppContext, AuthUser } from '../types';
import { CommunityNeedsService } from '../services/community-needs.service';
import { createdResponse, successResponse } from '../lib/response';
import type {
  CommunityNeedQueryParams,
  CreateCommunityNeedInput,
  UpdateCommunityNeedInput,
} from '../schemas/community-need.schema';
import { UnauthorizedError } from '../utils/errors';

export class CommunityNeedsController {
  static async list(c: Context<AppContext>) {
    const user = c.get('user') as AuthUser | undefined;
    const supabase = c.get('supabase') || c.get('supabaseAdmin');
    const query = c.get('validatedQuery' as any) as CommunityNeedQueryParams;

    const needs = await CommunityNeedsService.listNeeds(supabase, query, user?.id);
    return successResponse(c, needs);
  }

  static async create(c: Context<AppContext>) {
    const user = c.get('user');
    if (!user) throw new UnauthorizedError('Authentication required');
    const supabaseAdmin = c.get('supabaseAdmin');
    const body = c.get('validatedBody' as any) as CreateCommunityNeedInput;

    const need = await CommunityNeedsService.createNeed(supabaseAdmin, body, user.id);
    return createdResponse(c, need, 'Community need posted successfully');
  }

  static async update(c: Context<AppContext>) {
    const user = c.get('user');
    if (!user) throw new UnauthorizedError('Authentication required');
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;
    const body = c.get('validatedBody' as any) as UpdateCommunityNeedInput;

    const need = await CommunityNeedsService.updateNeed(supabaseAdmin, id, body, user.id);
    return successResponse(c, need, 200, 'Community need updated successfully');
  }

  static async delete(c: Context<AppContext>) {
    const user = c.get('user');
    if (!user) throw new UnauthorizedError('Authentication required');
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;

    const result = await CommunityNeedsService.deleteNeed(supabaseAdmin, id, user.id);
    return successResponse(c, result, 200, 'Community need deleted successfully');
  }
}
