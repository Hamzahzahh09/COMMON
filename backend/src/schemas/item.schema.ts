import { z } from 'zod';

export const createItemSchema = z.object({
  community_id: z.string().uuid('Invalid community ID format'),
  name: z.string().min(2, 'Item name must be at least 2 characters long').max(120),
  description: z.string().max(2000).optional(),
  category: z.string().min(2, 'Category must be specified').max(50),
  condition: z.string().max(50).optional(),
  location_hint: z.string().max(200).optional(),
  borrowing_rules: z.string().max(2000).optional(),
  ownership_type: z.enum(['personal', 'community']).default('personal').optional(),
  image_url: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

export const updateItemSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  description: z.string().max(2000).optional(),
  category: z.string().min(2).max(50).optional(),
  condition: z.string().max(50).optional(),
  location_hint: z.string().max(200).optional(),
  borrowing_rules: z.string().max(2000).optional(),
  ownership_type: z.enum(['personal', 'community']).optional(),
  status: z.enum(['available', 'borrowed', 'unavailable']).optional(),
  image_url: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

export const itemQuerySchema = z.object({
  community_id: z.string().uuid().optional(),
  category: z.string().optional(),
  ownership_type: z.enum(['personal', 'community']).optional(),
  status: z.enum(['available', 'borrowed', 'unavailable']).optional(),
  search: z.string().optional(),
});

export const itemIdParamSchema = z.object({
  id: z.string().uuid('Invalid item ID format'),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type ItemQueryParams = z.infer<typeof itemQuerySchema>;

