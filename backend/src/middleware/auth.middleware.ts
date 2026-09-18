import type { MiddlewareHandler } from 'hono';
import type { AppContext, AuthUser } from '../types';
import { getSupabaseAdminClient, getSupabaseUserClient } from '../lib/supabase';
import { UnauthorizedError } from '../utils/errors';
import { SEED_PROFILES } from '../data/seed-data';

/**
 * Helper to resolve demo user ID from token or header
 */
async function resolveDemoUser(
  targetId: string,
  supabaseAdmin: ReturnType<typeof getSupabaseAdminClient>
): Promise<AuthUser | null> {
  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', targetId)
      .maybeSingle();

    if (profile) {
      return {
        id: profile.id,
        email: `${profile.full_name.toLowerCase().replace(/\s+/g, '')}@rt05.commons.id`,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url || undefined,
      };
    }
  } catch {
    // Fallback to local memory if Supabase is offline
  }

  const matched = SEED_PROFILES.find((p) => p.id === targetId);
  if (matched) {
    return {
      id: matched.id,
      email: `${matched.full_name.toLowerCase().replace(/\s+/g, '')}@rt05.commons.id`,
      full_name: matched.full_name,
      avatar_url: matched.avatar_url,
    };
  }

  return {
    id: targetId,
    email: `warga-${targetId.slice(0, 6)}@rt05.commons.id`,
    full_name: 'Warga Terdaftar',
  };
}

export const authMiddleware: MiddlewareHandler<AppContext> = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  const demoHeader = c.req.header('x-demo-user-id');
  const supabaseAdmin = getSupabaseAdminClient(c.env);

  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // 1. Check for Demo Resident Token or Header
  let demoIdCandidate = '';
  if (token.startsWith('demo-token-')) {
    demoIdCandidate = token.replace('demo-token-', '').trim();
  } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
    demoIdCandidate = token;
  } else if (demoHeader && !token) {
    demoIdCandidate = demoHeader.trim();
  }

  if (demoIdCandidate) {
    const demoUser = await resolveDemoUser(demoIdCandidate, supabaseAdmin);
    if (demoUser) {
      c.set('user', demoUser);
      c.set('supabase', supabaseAdmin);
      c.set('supabaseAdmin', supabaseAdmin);
      return await next();
    }
  }

  // 2. Standard JWT Authentication
  if (!token) {
    throw new UnauthorizedError('Missing or malformed Authorization header. Bearer token required.');
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (user && !error) {
      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        full_name: (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || user.email?.split('@')[0],
        avatar_url: (user.user_metadata?.avatar_url as string) || (user.user_metadata?.picture as string),
      };

      const userClient = getSupabaseUserClient(c.env, token);

      c.set('user', authUser);
      c.set('rawUser', user);
      c.set('supabase', userClient);
      c.set('supabaseAdmin', supabaseAdmin);

      return await next();
    }
  } catch {
    // If Supabase Auth throws network or unexpected error
  }

  throw new UnauthorizedError('Invalid or expired authentication token.');
};

/**
 * Optional Auth Middleware:
 * Attaches user context if a valid token or demo resident is provided,
 * but does NOT throw if unauthenticated. Allows public read operations.
 */
export const optionalAuthMiddleware: MiddlewareHandler<AppContext> = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  const demoHeader = c.req.header('x-demo-user-id');
  const supabaseAdmin = getSupabaseAdminClient(c.env);

  c.set('supabaseAdmin', supabaseAdmin);
  c.set('supabase', supabaseAdmin);

  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // Check demo user
  let demoIdCandidate = '';
  if (token.startsWith('demo-token-')) {
    demoIdCandidate = token.replace('demo-token-', '').trim();
  } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
    demoIdCandidate = token;
  } else if (demoHeader && !token) {
    demoIdCandidate = demoHeader.trim();
  }

  if (demoIdCandidate) {
    const demoUser = await resolveDemoUser(demoIdCandidate, supabaseAdmin);
    if (demoUser) {
      c.set('user', demoUser);
      return await next();
    }
  }

  // Check real JWT
  if (token) {
    try {
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      if (user) {
        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          full_name: (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || user.email?.split('@')[0],
          avatar_url: (user.user_metadata?.avatar_url as string) || (user.user_metadata?.picture as string),
        };
        const userClient = getSupabaseUserClient(c.env, token);
        c.set('user', authUser);
        c.set('rawUser', user);
        c.set('supabase', userClient);
      }
    } catch {
      // Ignored for optional auth
    }
  }

  await next();
};
