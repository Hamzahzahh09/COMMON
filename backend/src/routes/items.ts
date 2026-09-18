import { Hono } from 'hono';
import type { AppContext } from '../types';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware';
import {
  validateBody,
  validateParam,
  validateQuery,
} from '../middleware/validation.middleware';
import {
  createItemSchema,
  itemIdParamSchema,
  itemQuerySchema,
  updateItemSchema,
} from '../schemas/item.schema';
import { ItemsController } from '../controllers/items.controller';

export const itemsRoutes = new Hono<AppContext>();

// GET /api/v1/items - List items with optional filtering (Public / Optional Auth)
itemsRoutes.get('/', optionalAuthMiddleware, validateQuery(itemQuerySchema), ItemsController.list);

// GET /api/v1/items/:id - Get item details with owner & community (Public / Optional Auth)
itemsRoutes.get('/:id', optionalAuthMiddleware, validateParam(itemIdParamSchema), ItemsController.getById);

// POST /api/v1/items - Create item in community (requires auth)
itemsRoutes.post('/', authMiddleware, validateBody(createItemSchema), ItemsController.create);

// PATCH /api/v1/items/:id - Update item (requires auth, owner only)
itemsRoutes.patch(
  '/:id',
  authMiddleware,
  validateParam(itemIdParamSchema),
  validateBody(updateItemSchema),
  ItemsController.update
);

// DELETE /api/v1/items/:id - Delete item (requires auth, owner only, not if active borrows)
itemsRoutes.delete('/:id', authMiddleware, validateParam(itemIdParamSchema), ItemsController.delete);
