import type { ErrorHandler } from 'hono';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { errorResponse } from '../lib/response';
import type { AppContext } from '../types';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export const errorHandler: ErrorHandler<AppContext> = (err, c) => {
  console.error('[API Error]:', {
    name: err.name,
    message: err.message,
    stack: c.env.ENVIRONMENT === 'development' ? err.stack : undefined,
  });

  if (err instanceof AppError) {
    return errorResponse(
      c,
      err.statusCode as ContentfulStatusCode,
      err.code,
      err.message,
      err.details
    );
  }

  if (err instanceof ZodError) {
    const formattedDetails = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    return errorResponse(
      c,
      422,
      'VALIDATION_ERROR',
      'Request input validation failed',
      formattedDetails
    );
  }

  // Handle default unhandled exceptions
  const message = c.env.ENVIRONMENT === 'development' ? err.message : 'An internal server error occurred';
  return errorResponse(c, 500, 'INTERNAL_ERROR', message);
};
