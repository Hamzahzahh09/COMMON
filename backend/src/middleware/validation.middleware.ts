import type { MiddlewareHandler } from 'hono';
import type { ZodSchema } from 'zod';
import type { AppContext } from '../types';

export function validateBody<T>(schema: ZodSchema<T>): MiddlewareHandler<AppContext> {
  return async (c, next) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json(
        {
          success: false,
          error: {
            code: 'INVALID_JSON',
            message: 'Malformed JSON payload in request body',
          },
        },
        400
      );
    }

    const parsed = schema.parse(body);
    // Attach validated body to request context
    c.set('validatedBody' as any, parsed);
    await next();
  };
}

export function validateQuery<T>(schema: ZodSchema<T>): MiddlewareHandler<AppContext> {
  return async (c, next) => {
    const query = c.req.query();
    const parsed = schema.parse(query);
    c.set('validatedQuery' as any, parsed);
    await next();
  };
}

export function validateParam<T>(schema: ZodSchema<T>): MiddlewareHandler<AppContext> {
  return async (c, next) => {
    const param = c.req.param();
    const parsed = schema.parse(param);
    c.set('validatedParam' as any, parsed);
    await next();
  };
}
