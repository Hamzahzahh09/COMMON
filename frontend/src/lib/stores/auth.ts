import { writable, derived, get } from 'svelte/store';
import { supabase } from '../supabaseClient';
import { toast } from './toast';


export type DemoResident = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  desc: string;
};

export const DEMO_RESIDENTS: DemoResident[] = [];

export type RegisteredUser = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  avatar: string;
  desc: string;
  created_at: string;
};

export type AuthState = {
  user: any | null;
  session: any | null;
  resident: DemoResident | null;
  loading: boolean;
  community: {
    id: string;
    name: string;
    slug: string;
    location: string;
  };
};

export const activeCommunity = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'RT 05 Commons',
  slug: 'rt-05-commons',
  location: 'Komp. Griya Harmoni, Jakarta Selatan',
};

const REGISTERED_USERS_KEY = 'common_registered_users_v1';
const ACTIVE_RESIDENT_KEY = 'common_active_resident';

export function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUser(user: RegisteredUser) {
  if (typeof window === 'undefined') return;
  try {
    const list = getRegisteredUsers();
    const existingIndex = list.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (existingIndex >= 0) {
      list[existingIndex] = user;
    } else {
      list.push(user);
    }
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(list));
  } catch {
    // Ignored
  }
}

export function getAllResidents(): DemoResident[] {
  const customUsers = getRegisteredUsers().map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatar: u.avatar,
    desc: u.desc,
  }));
  return customUsers;
}

function getInitialResident(): DemoResident | null {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(ACTIVE_RESIDENT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Purge old mock demo residents
        if (parsed.email && parsed.email.endsWith('@rt05.commons.id')) {
          localStorage.removeItem(ACTIVE_RESIDENT_KEY);
          return null;
        }
        const registered = getRegisteredUsers();
        const matched = registered.find((r) => r.id === parsed.id || r.email === parsed.email);
        if (matched) return matched;
        return null;
      }
    } catch {}
  }
  return null;
}

export const authState = writable<AuthState>({
  user: null,
  session: null,
  resident: getInitialResident(),
  loading: false,
  community: activeCommunity,
});

export const isAuthenticated = derived(
  authState,
  ($s) => Boolean($s.user || $s.resident)
);

/**
 * Register a new user account on COMMON.
 * Stores credentials safely in persistent local storage and syncs to Supabase if reachable.
 */
export async function registerAccount(params: {
  fullName: string;
  email: string;
  password?: string;
}): Promise<{ success: boolean; message?: string; user?: DemoResident }> {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanName = params.fullName.trim();

  if (!cleanEmail || !cleanName) {
    return { success: false, message: 'Nama lengkap dan email wajib diisi.' };
  }

  // Check if email already registered
  const allResidents = getAllResidents();
  const existing = allResidents.find((r) => r.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, message: 'Email tersebut sudah terdaftar di komunitas ini.' };
  }

  const newId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `user-${Date.now()}`;

  const newUser: RegisteredUser = {
    id: newId,
    name: cleanName,
    email: cleanEmail,
    password: params.password,
    role: 'Warga',
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
    desc: 'Warga Terdaftar',
    created_at: new Date().toISOString(),
  };

  saveRegisteredUser(newUser);

  // Attempt background sync to Supabase without blocking if offline
  try {
    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/discover` : '/discover';
    supabase.auth.signUp({
      email: cleanEmail,
      password: params.password || 'Password123!',
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: cleanName,
          avatar_url: newUser.avatar,
        },
      },
    }).catch(() => {});
  } catch {
    // Gracefully ignore Supabase network failures
  }

  // Update active state
  const resident: DemoResident = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    avatar: newUser.avatar,
    desc: newUser.desc,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(ACTIVE_RESIDENT_KEY, JSON.stringify(resident));
    window.dispatchEvent(new CustomEvent('clear-api-cache'));
  }

  authState.update((s) => ({
    ...s,
    user: { id: resident.id, email: resident.email, user_metadata: { full_name: resident.name } },
    session: { access_token: `token-${resident.id}`, user: { id: resident.id, email: resident.email } },
    resident,
    loading: false,
  }));

  return { success: true, user: resident };
}

/**
 * Login with email and password.
 */
export async function loginAccount(params: {
  email: string;
  password?: string;
}): Promise<{ success: boolean; message?: string; user?: DemoResident }> {
  const cleanEmail = params.email.trim().toLowerCase();

  // 1. Check registered users
  const registered = getRegisteredUsers();
  const matchedReg = registered.find((u) => u.email.toLowerCase() === cleanEmail);
  if (matchedReg) {
    if (params.password && matchedReg.password && matchedReg.password !== params.password) {
      return { success: false, message: 'Password salah. Silakan periksa kembali kata sandi Anda.' };
    }

    const resident: DemoResident = {
      id: matchedReg.id,
      name: matchedReg.name,
      email: matchedReg.email,
      role: matchedReg.role,
      avatar: matchedReg.avatar,
      desc: matchedReg.desc,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(ACTIVE_RESIDENT_KEY, JSON.stringify(resident));
      window.dispatchEvent(new CustomEvent('clear-api-cache'));
    }

    authState.update((s) => ({
      ...s,
      user: { id: resident.id, email: resident.email, user_metadata: { full_name: resident.name } },
      session: { access_token: `token-${resident.id}`, user: { id: resident.id, email: resident.email } },
      resident,
      loading: false,
    }));

    return { success: true, user: resident };
  }

  // 2. Fallback: If password provided, attempt Supabase
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: params.password || '',
    });

    if (!error && data?.session) {
      const email = data.session.user.email;
      const res: DemoResident = {
        id: data.session.user.id,
        name: data.session.user.user_metadata?.full_name || email?.split('@')[0] || 'Warga',
        email: email || '',
        role: 'Warga',
        avatar: data.session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        desc: 'Warga RT 05',
      };
      authState.update((s) => ({
        ...s,
        session: data.session,
        user: data.session.user,
        resident: res,
        loading: false,
      }));
      return { success: true, user: res };
    }
  } catch {
    // Ignore network error
  }

  return { success: false, message: 'Email tidak ditemukan atau password salah.' };
}

export async function initAuth() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const email = session.user.email;
      const all = getAllResidents();
      const matched = all.find((r) => r.email === email);
      authState.update((s) => ({
        ...s,
        session,
        user: session.user,
        resident: matched || {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || email?.split('@')[0] || 'Warga',
          email: email || '',
          role: 'Warga',
          avatar: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          desc: 'Warga RT 05',
        },
        loading: false,
      }));
    } else {
      authState.update((s) => ({ ...s, loading: false }));
    }
  } catch {
    authState.update((s) => ({ ...s, loading: false }));
  }

  try {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email;
        const all = getAllResidents();
        const matched = all.find((r) => r.email === email);
        authState.update((s) => ({
          ...s,
          session,
          user: session.user,
          resident: matched || s.resident,
          loading: false,
        }));
      } else if (_event === 'SIGNED_OUT') {
        authState.update((s) => ({ ...s, session: null, user: null, loading: false }));
      }
    });
  } catch {
    // Ignored
  }
}

export async function switchDemoResident(email: string, showNotification = true) {
  const all = getAllResidents();
  const target = all.find((r) => r.email.toLowerCase() === email.toLowerCase());
  if (!target) return;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ACTIVE_RESIDENT_KEY, JSON.stringify(target));
    } catch {}
  }

  authState.update((s) => ({
    ...s,
    user: { id: target.id, email: target.email, user_metadata: { full_name: target.name } },
    session: { access_token: `token-${target.id}`, user: { id: target.id } },
    resident: target,
    loading: false,
  }));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('clear-api-cache'));
  }

  if (showNotification) {
    toast.info(`Beralih simulasi ke warga: ${target.name} (${target.desc})`);
  }
}

export async function signOut() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(ACTIVE_RESIDENT_KEY);
    } catch {}
  }
  try {
    await supabase.auth.signOut();
  } catch {}
  authState.update((s) => ({
    ...s,
    session: null,
    user: null,
    resident: null,
  }));
  toast.info('Anda telah keluar.');
}


