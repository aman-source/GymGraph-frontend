import axios from 'axios';
import { auth, supabase } from '@/lib/supabase';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Validate environment variable
if (!BACKEND_URL) {
  console.error('VITE_BACKEND_URL environment variable is not set. API calls will fail.');
}

export const API_BASE = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Session token cache to avoid repeated getSession calls
let cachedToken = null;
let tokenExpiry = 0;

/**
 * Get the auth token, using cache when possible
 */
export const getAuthToken = async () => {
  const now = Date.now();
  // Use cached token if still valid (with 60s buffer)
  if (cachedToken && tokenExpiry > now + 60000) {
    return cachedToken;
  }

  try {
    const { session } = await auth.getSession();
    if (session?.access_token) {
      cachedToken = session.access_token;
      // Token expires_at is in seconds, convert to ms
      tokenExpiry = session.expires_at ? session.expires_at * 1000 : now + 3600000;
      return cachedToken;
    }
  } catch (e) {
    // Session error - token will be null
  }
  return null;
};

/**
 * Clear the token cache (call on sign out)
 */
export const clearTokenCache = () => {
  cachedToken = null;
  tokenExpiry = 0;
};

/**
 * Update the token cache with a new token
 */
export const updateTokenCache = (token, expiresAt) => {
  cachedToken = token;
  tokenExpiry = expiresAt ? expiresAt * 1000 : Date.now() + 3600000;
};

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      clearTokenCache();

      // Try to refresh the session with proper error handling
      try {
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
        if (!session || refreshError) {
          await auth.signOut();
          window.location.href = '/';
          return Promise.reject(error);
        }

        // Update cache and retry
        updateTokenCache(session.access_token, session.expires_at);
        error.config.headers.Authorization = `Bearer ${session.access_token}`;
        return api(error.config);
      } catch (refreshException) {
        // Network error or other failure during refresh
        console.error('Token refresh failed:', refreshException);
        try {
          await auth.signOut();
        } catch (signOutError) {
          // Ignore sign out errors
        }
        window.location.href = '/';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
