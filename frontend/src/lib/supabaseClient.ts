import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const supabaseUrl =
  PUBLIC_SUPABASE_URL ||
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  'https://llsubmizttyjfakgedwp.supabase.co';

const supabaseAnonKey =
  PUBLIC_SUPABASE_ANON_KEY ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc3VibWl6dHR5amZha2dlZHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NzA2NzAsImV4cCI6MjEwNDA0NjY3MH0.h17u3vDWzo3I4m3iWDu765GiKwlfhr4SpLSxHoaoc0Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});


