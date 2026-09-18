import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { AppContext } from './types';
import { errorHandler } from './middleware/error.middleware';
import { errorResponse } from './lib/response';

import { healthRoutes } from './routes/health';
import { authRoutes } from './routes/auth';
import { communitiesRoutes } from './routes/communities';
import { itemsRoutes } from './routes/items';
import { borrowingRequestsRoutes } from './routes/borrowing-requests';
import { communityNeedsRoutes } from './routes/community-needs';

export function createApp() {
  const app = new Hono<AppContext>();

  // 1. Logger middleware
  app.use('*', logger());

  // 2. Comprehensive CORS configuration
  app.use('*', async (c, next) => {
    const corsMiddleware = cors({
      origin: (origin) => {
        if (!origin) return '*';
        // Allow any localhost / 127.0.0.1 port or configured origin
        if (
          origin.includes('localhost') ||
          origin.includes('127.0.0.1') ||
          origin.includes('.supabase.co')
        ) {
          return origin;
        }
        const allowed = c.env.CORS_ORIGIN || 'http://localhost:5173';
        if (allowed === '*' || allowed.split(',').map((o) => o.trim()).includes(origin)) {
          return origin;
        }
        return allowed;
      },
      allowHeaders: [
        'Content-Type',
        'Authorization',
        'x-demo-user-id',
        'apikey',
        'X-Client-Info',
        'prefer',
      ],
      allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      exposeHeaders: ['Content-Length'],
      maxAge: 86400,
      credentials: true,
    });
    return corsMiddleware(c, next);
  });

  // 3. Centralized error handling
  app.onError(errorHandler);

  // 4. 404 fallback
  app.notFound((c) => {
    return errorResponse(c, 404, 'NOT_FOUND', `Route not found: ${c.req.method} ${c.req.path}`);
  });

  // 5. Mount routes
  app.route('/health', healthRoutes);
  app.route('/api/v1/auth', authRoutes);
  app.route('/api/v1/communities', communitiesRoutes);
  app.route('/api/v1/items', itemsRoutes);
  app.route('/api/v1/borrowing-requests', borrowingRequestsRoutes);
  app.route('/api/v1/community-needs', communityNeedsRoutes);

  return app;
}
