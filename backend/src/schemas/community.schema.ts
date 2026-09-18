import { z } from 'zod';

export const createCommunitySchema = z.object({
  name: z.string().min(3, 'Community name must be at least 3 characters long').max(100),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric characters separated by single hyphens'),
  description: z.string().max(1000).optional(),
  location: z.string().max(200).optional(),
});

export const communityIdParamSchema = z.object({
  id: z.string().uuid('Invalid community ID format'),
});

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
