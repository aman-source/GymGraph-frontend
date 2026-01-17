import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required')
}

// Check if running as installed PWA
const isStandalonePWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
};

// Custom storage adapter with fallback and PWA-aware persistence
// iOS Safari can purge localStorage after 7 days of inactivity for PWAs
// This adapter provides better session recovery
const createPersistentStorage = () => {
  const STORAGE_KEY_PREFIX = 'sb-gymgraph-auth-';

  return {
    getItem: (key) => {
      try {
        // Try localStorage first
        const value = localStorage.getItem(key);
        if (value) return value;

        // Fallback: try sessionStorage (survives some iOS purges)
        return sessionStorage.getItem(key);
      } catch (e) {
        console.warn('Storage getItem failed:', e);
        return null;
      }
    },
    setItem: (key, value) => {
      try {
        // Store in both localStorage and sessionStorage for redundancy
        localStorage.setItem(key, value);

        // Also store in sessionStorage as backup (helps with some iOS scenarios)
        if (isStandalonePWA()) {
          sessionStorage.setItem(key, value);
        }
      } catch (e) {
        console.warn('Storage setItem failed:', e);
      }
    },
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      } catch (e) {
        console.warn('Storage removeItem failed:', e);
      }
    }
  };
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createPersistentStorage(),
    storageKey: 'gymgraph-auth',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Flow type for better mobile/PWA compatibility
    flowType: 'pkce',
  },
})

// Auth helper functions
export const auth = {
  // Google OAuth - redirects to Google login
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  // Email/Password - Sign Up
  signUpWithEmail: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  // Email/Password - Sign In
  signInWithEmail: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Magic Link
  signInWithMagicLink: async (email) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  // Sign Out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Listen for auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export default supabase
