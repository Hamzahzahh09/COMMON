import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from './database.types';

export type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  CORS_ORIGIN?: string;
  ENVIRONMENT?: string;
};

export type AuthUser = {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
};

export type Variables = {
  user: AuthUser;
  rawUser?: User;
  supabase: SupabaseClient<Database>;
  supabaseAdmin: SupabaseClient<Database>;
};

export type AppContext = {
  Bindings: Bindings;
  Variables: Variables;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
};
