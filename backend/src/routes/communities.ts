import { Hono } from 'hono';
import type { AppContext } from '../types';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';
import { validateBody, validateParam } from '../middleware/validation.middleware';
import {
  communityIdParamSchema,
  createCommunitySchema,
} from '../schemas/community.schema';
import { CommunitiesController } from '../controllers/communities.controller';

export const communitiesRoutes = new Hono<AppContext>();

// GET /api/v1/communities - List communities (Public / Optional Auth, ?all=true&search=...)
communitiesRoutes.get('/', optionalAuthMiddleware, CommunitiesController.list);

// GET /api/v1/communities/slug/:slug - Get community by slug (Public / Optional Auth)
communitiesRoutes.get('/slug/:slug', optionalAuthMiddleware, CommunitiesController.getBySlug);

// GET /api/v1/communities/:id - Get community details by ID (Public / Optional Auth)
communitiesRoutes.get('/:id', optionalAuthMiddleware, validateParam(communityIdParamSchema), CommunitiesController.getById);

// GET /api/v1/communities/:id/members - Get community members (Public / Optional Auth)
communitiesRoutes.get(
  '/:id/members',
  optionalAuthMiddleware,
  validateParam(communityIdParamSchema),
  CommunitiesController.getMembers
);

// POST /api/v1/communities - Create a new community (Auth required)
communitiesRoutes.post('/', authMiddleware, validateBody(createCommunitySchema), CommunitiesController.create);

// POST /api/v1/communities/:id/join - Join a community (Auth required)
communitiesRoutes.post('/:id/join', authMiddleware, validateParam(communityIdParamSchema), CommunitiesController.join);

// POST /api/v1/communities/:id/leave - Leave a community (Auth required)
communitiesRoutes.post('/:id/leave', authMiddleware, validateParam(communityIdParamSchema), CommunitiesController.leave);

// GET /api/v1/communities/:id/discussions - List discussions in community
communitiesRoutes.get(
  '/:id/discussions',
  optionalAuthMiddleware,
  validateParam(communityIdParamSchema),
  async (c) => {
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;
    const category = c.req.query('category');
    const { DiscussionsService } = await import('../services/discussions.service');
    const posts = await DiscussionsService.listDiscussions(supabaseAdmin, id, category);
    return c.json({ success: true, data: posts });
  }
);

// POST /api/v1/communities/:id/discussions - Create a discussion post
communitiesRoutes.post(
  '/:id/discussions',
  authMiddleware,
  validateParam(communityIdParamSchema),
  async (c) => {
    const user = c.get('user');
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;
    const body = await c.req.json();
    if (!body?.title || !body?.content) {
      return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Title and content are required' } }, 400);
    }
    const { DiscussionsService } = await import('../services/discussions.service');
    const post = await DiscussionsService.createDiscussion(supabaseAdmin, id, user.id, body);
    return c.json({ success: true, data: post, message: 'Discussion posted successfully' }, 201);
  }
);

// DELETE /api/v1/communities/:id/discussions/:discussionId - Delete discussion post
communitiesRoutes.delete(
  '/:id/discussions/:discussionId',
  authMiddleware,
  async (c) => {
    const user = c.get('user');
    const supabaseAdmin = c.get('supabaseAdmin');
    const discussionId = c.req.param('discussionId') as string;
    const { DiscussionsService } = await import('../services/discussions.service');
    const result = await DiscussionsService.deleteDiscussion(supabaseAdmin, discussionId, user.id);
    return c.json({ success: true, data: result });
  }
);

