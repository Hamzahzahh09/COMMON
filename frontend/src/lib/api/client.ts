import { get } from 'svelte/store';
import { authState } from '../stores/auth';
import { env } from '$env/dynamic/public';

const API_BASE_URL =
  env.PUBLIC_API_BASE_URL ||
  (import.meta.env.VITE_API_BASE_URL as string) ||
  (import.meta.env.PUBLIC_API_BASE_URL as string) ||
  'http://127.0.0.1:8787/api/v1';

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
};

export type ApiRequestOptions = RequestInit & {
  skipCache?: boolean;
};

// In-flight request deduplication map
const inFlightRequests = new Map<string, Promise<ApiResponse<any>>>();

// In-memory cache for fast page reloads & rapid navigation (10s TTL)
type CacheEntry = {
  timestamp: number;
  data: ApiResponse<any>;
};
const apiCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10_000; // 10 seconds

export function clearApiCache() {
  apiCache.clear();
}

// Listen for global cache clear events (e.g. resource added or user switched)
if (typeof window !== 'undefined') {
  window.addEventListener('clear-api-cache', () => clearApiCache());
  window.addEventListener('resource-added', () => clearApiCache());
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const method = (options.method || 'GET').toUpperCase();
  const isGet = method === 'GET';

  // Invalidate cache on mutations
  if (!isGet) {
    clearApiCache();
  }

  // 1. Resolve auth token synchronously from store first, without async storage lag
  const currentAuth = get(authState);
  const token = currentAuth?.session?.access_token;
  const currentResidentId = currentAuth?.resident?.id;

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else if (currentResidentId) {
    headers.set('Authorization', `Bearer demo-token-${currentResidentId}`);
    headers.set('x-demo-user-id', currentResidentId);
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const primaryUrl = `${API_BASE_URL}${cleanEndpoint}`;

  // Cache key includes method, resident id, and full URL
  const cacheKey = `${method}:${currentResidentId || 'anon'}:${primaryUrl}`;

  // 2. Check cache for GET requests
  if (isGet && !options.skipCache) {
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data as ApiResponse<T>;
    }

    // 3. Deduplicate in-flight GET requests
    const inFlight = inFlightRequests.get(cacheKey);
    if (inFlight) {
      return inFlight as Promise<ApiResponse<T>>;
    }
  }

  const executeFetch = async (): Promise<ApiResponse<T>> => {
    async function parseSafeResponse(res: Response): Promise<ApiResponse<T>> {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          return await res.json();
        } catch {
          // fallback to text parse below
        }
      }

      const rawText = await res.text().catch(() => '');
      if (!res.ok) {
        return {
          success: false,
          error: {
            code: `HTTP_${res.status}`,
            message: `Server returned HTTP ${res.status}`,
          },
        };
      }

      try {
        return JSON.parse(rawText);
      } catch {
        return {
          success: true,
          data: rawText as any,
        };
      }
    }

    try {
      const response = await fetch(primaryUrl, {
        ...options,
        headers,
      });

      const data = await parseSafeResponse(response);

      if (isGet && data.success) {
        apiCache.set(cacheKey, {
          timestamp: Date.now(),
          data,
        });
      }

      return data;
    } catch (err: any) {
      // Fallback: If 127.0.0.1 fails, try localhost or vice-versa
      const altBase = API_BASE_URL.includes('127.0.0.1')
        ? API_BASE_URL.replace('127.0.0.1', 'localhost')
        : API_BASE_URL.replace('localhost', '127.0.0.1');

      try {
        const fallbackResponse = await fetch(`${altBase}${cleanEndpoint}`, {
          ...options,
          headers,
        });
        const fallbackData = await parseSafeResponse(fallbackResponse);

        if (isGet && fallbackData.success) {
          apiCache.set(cacheKey, {
            timestamp: Date.now(),
            data: fallbackData,
          });
        }

        return fallbackData;
      } catch {
        return {
          success: false,
          error: {
            code: 'NETWORK_ERROR',
            message: err?.message || 'Gagal menghubungi server backend (Hono API). Pastikan API berjalan di port 8787.',
          },
        };
      }
    } finally {
      if (isGet) {
        inFlightRequests.delete(cacheKey);
      }
    }
  };

  if (isGet) {
    const fetchPromise = executeFetch();
    inFlightRequests.set(cacheKey, fetchPromise);
    return fetchPromise;
  }

  return executeFetch();
}

