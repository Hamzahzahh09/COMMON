import { Hono } from 'hono';
import type { AppContext } from '../types';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';
import {
  validateBody,
  validateParam,
  validateQuery,
} from '../middleware/validation.middleware';
import {
  communityNeedQuerySchema,
  createCommunityNeedSchema,
  needIdParamSchema,
  updateCommunityNeedSchema,
} from '../schemas/community-need.schema';
import { CommunityNeedsController } from '../controllers/community-needs.controller';

export const communityNeedsRoutes = new Hono<AppContext>();

// GET /api/v1/community-needs - List needs (Public / Optional Auth)
communityNeedsRoutes.get('/', optionalAuthMiddleware, validateQuery(communityNeedQuerySchema), CommunityNeedsController.list);

// POST /api/v1/community-needs - Post a new community need (requires auth)
communityNeedsRoutes.post(
  '/',
  authMiddleware,
  validateBody(createCommunityNeedSchema),
  CommunityNeedsController.create
);

// PATCH /api/v1/community-needs/:id - Update need (creator only, requires auth)
communityNeedsRoutes.patch(
  '/:id',
  authMiddleware,
  validateParam(needIdParamSchema),
  validateBody(updateCommunityNeedSchema),
  CommunityNeedsController.update
);

// DELETE /api/v1/community-needs/:id - Delete need (creator only, requires auth)
communityNeedsRoutes.delete(
  '/:id',
  authMiddleware,
  validateParam(needIdParamSchema),
  CommunityNeedsController.delete
);

// GET /api/v1/community-needs/:id/offers - List offers for a need
communityNeedsRoutes.get(
  '/:id/offers',
  optionalAuthMiddleware,
  validateParam(needIdParamSchema),
  async (c) => {
    const user = c.get('user');
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;
    const { NeedOffersService } = await import('../services/need-offers.service');
    const offers = await NeedOffersService.getOffersByNeedId(supabaseAdmin, id, user?.id);
    return c.json({ success: true, data: offers });
  }
);

// POST /api/v1/community-needs/:id/offers - Post an "I HAVE" offer
communityNeedsRoutes.post(
  '/:id/offers',
  authMiddleware,
  validateParam(needIdParamSchema),
  async (c) => {
    const user = c.get('user');
    const supabaseAdmin = c.get('supabaseAdmin');
    const id = c.req.param('id') as string;
    const body = await c.req.json();
    if (!body?.message) {
      return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Message is required' } }, 400);
    }
    const { NeedOffersService } = await import('../services/need-offers.service');
    const offer = await NeedOffersService.createOffer(supabaseAdmin, id, user.id, body);
    return c.json({ success: true, data: offer, message: 'Offer submitted successfully' }, 201);
  }
);

// POST /api/v1/community-needs/:id/offers/:offerId/accept - Accept an offer
communityNeedsRoutes.post(
  '/:id/offers/:offerId/accept',
  authMiddleware,
  async (c) => {
    const user = c.get('user');
    const supabaseAdmin = c.get('supabaseAdmin');
    const offerId = c.req.param('offerId') as string;
    const { NeedOffersService } = await import('../services/need-offers.service');
    const result = await NeedOffersService.acceptOffer(supabaseAdmin, offerId, user.id);
    return c.json({ success: true, data: result, message: 'Offer accepted successfully' });
  }
);

