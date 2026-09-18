import { Hono } from 'hono';
import type { AppContext } from '../types';

export const healthRoutes = new Hono<AppContext>();

healthRoutes.get('/', (c) => {
  return c.json({
    success: true,
    message: 'COMMON API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT || 'development',
  });
});
