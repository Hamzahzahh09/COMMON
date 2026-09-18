import { Hono } from 'hono';
import type { AppContext } from '../types';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody, validateParam } from '../middleware/validation.middleware';
import {
  createBorrowingRequestSchema,
  requestIdParamSchema,
  rejectBorrowingRequestSchema,
} from '../schemas/borrowing-request.schema';
import { BorrowingRequestsController } from '../controllers/borrowing-requests.controller';

export const borrowingRequestsRoutes = new Hono<AppContext>();

borrowingRequestsRoutes.use('*', authMiddleware);

// POST /api/v1/borrowing-requests - Submit new borrowing request
borrowingRequestsRoutes.post(
  '/',
  validateBody(createBorrowingRequestSchema),
  BorrowingRequestsController.create
);

// GET /api/v1/borrowing-requests/me - Requests created by current user
borrowingRequestsRoutes.get('/me', BorrowingRequestsController.getMyRequests);

// GET /api/v1/borrowing-requests/incoming - Requests for items owned by current user
borrowingRequestsRoutes.get('/incoming', BorrowingRequestsController.getIncoming);

// POST /api/v1/borrowing-requests/sync-overdue - Maintenance trigger to sync overdue items
borrowingRequestsRoutes.post('/sync-overdue', BorrowingRequestsController.syncOverdue);

// GET /api/v1/borrowing-requests/:id - Request details (requester or owner)
borrowingRequestsRoutes.get(
  '/:id',
  validateParam(requestIdParamSchema),
  BorrowingRequestsController.getById
);

// POST /api/v1/borrowing-requests/:id/approve - Approve request (owner only)
borrowingRequestsRoutes.post(
  '/:id/approve',
  validateParam(requestIdParamSchema),
  BorrowingRequestsController.approve
);

// POST /api/v1/borrowing-requests/:id/reject - Reject request (owner only)
borrowingRequestsRoutes.post(
  '/:id/reject',
  validateParam(requestIdParamSchema),
  validateBody(rejectBorrowingRequestSchema),
  BorrowingRequestsController.reject
);

// POST /api/v1/borrowing-requests/:id/cancel - Cancel request (requester only)
borrowingRequestsRoutes.post(
  '/:id/cancel',
  validateParam(requestIdParamSchema),
  BorrowingRequestsController.cancel
);

// POST /api/v1/borrowing-requests/:id/return - Mark item returned (requester or owner)
borrowingRequestsRoutes.post(
  '/:id/return',
  validateParam(requestIdParamSchema),
  BorrowingRequestsController.returnItem
);

// GET /api/v1/borrowing-requests/:id/messages - Get messages for request
borrowingRequestsRoutes.get(
  '/:id/messages',
  validateParam(requestIdParamSchema),
  BorrowingRequestsController.getMessages
);

// POST /api/v1/borrowing-requests/:id/messages - Add message to request
borrowingRequestsRoutes.post(
  '/:id/messages',
  validateParam(requestIdParamSchema),
  BorrowingRequestsController.addMessage
);

