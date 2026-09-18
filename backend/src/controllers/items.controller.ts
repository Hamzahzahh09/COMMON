import type { Context } from 'hono';
import type { AppContext, AuthUser } from '../types';
import { ItemsService } from '../services/items.service';
import { createdResponse, successResponse } from '../lib/response';
import type { CreateItemInput, ItemQueryParams, UpdateItemInput } from '../schemas/item.schema';
import { UnauthorizedError } from '../utils/errors';

export class ItemsController {
  static async list(c: Context<AppContext>) {
    const user = c.get('user') as AuthUser | undefined;
    const supabase = c.get('supabase') || c.get('supabaseAdmin');
    const query = c.get('validatedQuery' as any) as ItemQueryParams;

    const items = await ItemsService.listItems(supabase, query, user?.id);
    return successResponse(c, items);
  }

  static async getById(c: Context<AppContext>) {
    const user = c.get('user') as AuthUser | undefined;
    const supabase = c.get('supabase') || c.get('supabaseAdmin');
    const id = c.req.param('id') as string;

    const item = await ItemsService.getItemById(supabase, id, user?.id);
    return successResponse(c, item);
  }

  static async create(c: Context<AppContext>) {
    const user = c.get('user');
    if (!user) throw new UnauthorizedError('Authentication required');
    const supabaseAdmin = c.get('supabaseAdmin');
    const body = c.get('validatedBody' as any) as CreateItemInput;

    const item = await ItemsService.createItem(supabaseAdmin, body, user.id);
    return createdResponse(c, item, 'Item created successfully');
  }

  static async update(c: Context<AppContext>) {
    const user = c.get('user');
    if (!user) throw new UnauthorizedError('Authentication required');
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;
    const body = c.get('validatedBody' as any) as UpdateItemInput;

    const item = await ItemsService.updateItem(supabaseAdmin, id, body, user.id);
    return successResponse(c, item, 200, 'Item updated successfully');
  }

  static async delete(c: Context<AppContext>) {
    const user = c.get('user');
    if (!user) throw new UnauthorizedError('Authentication required');
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;

    const result = await ItemsService.deleteItem(supabaseAdmin, id, user.id);
    return successResponse(c, result, 200, 'Item deleted successfully');
  }
}
