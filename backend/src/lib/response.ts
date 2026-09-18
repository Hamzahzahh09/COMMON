import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { ApiResponse } from '../types';

export function successResponse<T>(
  c: Context,
  data: T,
  statusCode: ContentfulStatusCode = 200,
  message?: string
) {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    ...(message ? { message } : {}),
  };
  return c.json(payload, statusCode);
}

export function createdResponse<T>(c: Context, data: T, message?: string) {
  return successResponse(c, data, 201, message);
}

export function errorResponse(
  c: Context,
  statusCode: ContentfulStatusCode,
  code: string,
  message: string,
  details?: unknown
) {
  const payload: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  };
  return c.json(payload, statusCode);
}
