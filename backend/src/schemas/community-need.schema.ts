import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createCommunityNeedSchema = z
  .object({
    community_id: z.string().uuid('Invalid community ID format'),
    title: z.string().min(3, 'Title must be at least 3 characters long').max(150),
    description: z.string().max(2000).optional(),
    needed_from: z.string().regex(dateRegex, 'needed_from must be formatted as YYYY-MM-DD').optional(),
    needed_until: z.string().regex(dateRegex, 'needed_until must be formatted as YYYY-MM-DD').optional(),
  })
  .refine(
    (data) => {
      if (data.needed_from && data.needed_until) {
        return data.needed_from <= data.needed_until;
      }
      return true;
    },
    {
      message: 'needed_from must be before or equal to needed_until',
      path: ['needed_until'],
    }
  );

export const updateCommunityNeedSchema = z
  .object({
    title: z.string().min(3).max(150).optional(),
    description: z.string().max(2000).optional(),
    needed_from: z.string().regex(dateRegex).optional(),
    needed_until: z.string().regex(dateRegex).optional(),
    status: z.enum(['open', 'fulfilled', 'closed']).optional(),
  })
  .refine(
    (data) => {
      if (data.needed_from && data.needed_until) {
        return data.needed_from <= data.needed_until;
      }
      return true;
    },
    {
      message: 'needed_from must be before or equal to needed_until',
      path: ['needed_until'],
    }
  );

export const communityNeedQuerySchema = z.object({
  community_id: z.string().uuid().optional(),
  status: z.enum(['open', 'fulfilled', 'closed']).optional(),
});

export const needIdParamSchema = z.object({
  id: z.string().uuid('Invalid need ID format'),
});

export type CreateCommunityNeedInput = z.infer<typeof createCommunityNeedSchema>;
export type UpdateCommunityNeedInput = z.infer<typeof updateCommunityNeedSchema>;
export type CommunityNeedQueryParams = z.infer<typeof communityNeedQuerySchema>;
