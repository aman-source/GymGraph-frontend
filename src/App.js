import { useEffect, useState, createContext, useContext, useCallback, useRef, lazy, Suspense } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { supabase, auth } from "@/lib/supabase";
import { QueryClientProvider } from "@tanstack/react-query";
// DevTools lazy loaded in dev mode only
import { queryClient, queryKeys } from "@/lib/queryClient";
import api, { clearTokenCache, updateTokenCache } from "@/lib/api";
import { initOneSignal, logoutUser as logoutOneSignal } from "@/lib/onesignal";

// Pages - Lazy loaded for code splitting
const Landing = lazy(() => import("@/pages/Landing"));
const AuthCallback = lazy(() => import("@/pages/AuthCallback"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const CheckIn = lazy(() => import("@/pages/CheckIn"));
const Profile = lazy(() => import("@/pages/Profile"));
const PublicProfile = lazy(() => import("@/pages/PublicProfile"));
const Gyms = lazy(() => import("@/pages/Gyms"));
const GymDetail = lazy(() => import("@/pages/GymDetail"));
const Leaderboards = lazy(() => import("@/pages/Leaderboards"));
const Connections = lazy(() => import("@/pages/Connections"));
const Challenges = lazy(() => import("@/pages/Challenges"));
const ChallengeDetail = lazy(() => import("@/pages/ChallengeDetail"));
const MyChallenges = lazy(() => import("@/pages/MyChallenges"));
const Settings = lazy(() => import("@/pages/Settings"));
const GymOwnerDashboard = lazy(() => import("@/pages/GymOwnerDashboard"));
const Rewards = lazy(() => import("@/pages/Rewards"));
const Notifications = lazy(() => import("@/pages/Notifications"));

// Public Pages - Lazy loaded
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));

// Admin Pages - Lazy loaded
const SuperAdminDashboard = lazy(() => import("@/pages/SuperAdminDashboard"));
const GymAdminDashboard = lazy(() => import("@/pages/GymAdminDashboard"));

// Coming Soon Page - shown for protected routes during waitlist mode
const ComingSoon = lazy(() => import("@/pages/ComingSoon"));

// DevTools - Only loaded in development
const LazyDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then(m => ({ default: m.ReactQueryDevtools }))
);

// Loading fallback for Suspense - premium shimmer skeleton
const PageLoader = () => (
  <div className="min-h-screen min-h-[100dvh] bg-[#F8F9FA]">
    {/* Top Navigation Skeleton */}
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-white/95 border-b border-[#E5E7EB]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 512 512" className="w-6 h-6" fill="white">
                <polygon points="80,400 220,160 320,400" />
                <polygon points="200,400 340,100 460,400" />
              </svg>
            </div>
            <div className="h-5 w-24 bg-[#E5E7EB] rounded hidden sm:block animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#E5E7EB] rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </nav>

    {/* Main Content Skeleton */}
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-24">
      <div className="space-y-6 animate-fade-in">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-48 bg-[#E5E7EB] rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-[#E5E7EB] rounded animate-pulse" />
        </div>

        {/* Cards skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F0F2F5] rounded-xl animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-[#F0F2F5] rounded animate-pulse" />
                  <div className="h-3 w-16 bg-[#F0F2F5] rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* List skeleton */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-[#F8F9FA] rounded-xl">
              <div className="w-10 h-10 bg-[#E5E7EB] rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-[#E5E7EB] rounded animate-pulse" />
                <div className="h-3 w-24 bg-[#E5E7EB] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>

    {/* Mobile Bottom Navigation Skeleton */}
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-[#E5E7EB]/50 lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 bg-[#E5E7EB] rounded animate-pulse" />
            <div className="w-10 h-2 bg-[#E5E7EB] rounded animate-pulse" />
          </div>
        ))}
      </div>
    </nav>
  </div>
);

import { Toaster } from "@/components/ui/sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Validate environment variable
if (!BACKEND_URL) {
  console.error('VITE_BACKEND_URL environment variable is not set. API calls will fail.');
}

export const API = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

// Configure axios defaults (for legacy code still using axios directly)
axios.defaults.withCredentials = true;

// Auth Context for global state
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: null,
    user: null,
    isLoading: true
  });

  // Refs to prevent duplicate fetches
  const profileFetchInProgress = useRef(false);
  const profileFetched = useRef(false);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // New user without profile
      }
      throw error;
    }
  }, []);

  // Single function to fetch profile with deduplication
  const fetchProfileOnce = useCallback(async (isMounted) => {
    // Skip if already fetched or fetch in progress
    if (profileFetched.current || profileFetchInProgress.current) {
      return null;
    }

    profileFetchInProgress.current = true;
    try {
      const profile = await fetchUserProfile();
      profileFetched.current = true;
      queryClient.setQueryData(queryKeys.user.me(), profile);
      if (isMounted) {
        setAuthState({ isAuthenticated: true, user: profile, isLoading: false });
      }
      // Initialize OneSignal push notifications with user ID
      if (profile?.id) {
        initOneSignal(profile.id);
      }
      return profile;
    } catch (error) {
      if (isMounted) {
        setAuthState({ isAuthenticated: true, user: null, isLoading: false });
      }
      return null;
    } finally {
      profileFetchInProgress.current = false;
    }
  }, [fetchUserProfile]);

  const refreshUser = useCallback(async () => {
    // Force refresh - reset the flag
    profileFetched.current = false;
    try {
      const profile = await fetchUserProfile();
      profileFetched.current = true;
      setAuthState(prev => ({ ...prev, user: profile }));
      return profile;
    } catch (error) {
      console.error("Failed to refresh user:", error);
      return null;
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        let { data: { session } } = await supabase.auth.getSession();

        // If no session or token expired, try to refresh (handles overnight/long idle)
        if (!session) {
          const { data: refreshData } = await supabase.auth.refreshSession();
          session = refreshData?.session;
        }

        if (!session) {
          if (isMounted) {
            setAuthState({ isAuthenticated: false, user: null, isLoading: false });
          }
          return;
        }

        // Cache the token FIRST before any API calls
        updateTokenCache(session.access_token, session.expires_at);

        // Fetch user profile (deduplicated)
        await fetchProfileOnce(isMounted);
      } catch (error) {
        console.error("Auth init error:", error);
        if (isMounted) {
          setAuthState({ isAuthenticated: false, user: null, isLoading: false });
        }
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          clearTokenCache();
          profileFetched.current = false; // Reset on sign out
          logoutOneSignal(); // Unlink user from push notifications
          if (isMounted) {
            setAuthState({ isAuthenticated: false, user: null, isLoading: false });
          }
        } else if (event === 'SIGNED_IN' && session) {
          updateTokenCache(session.access_token, session.expires_at);
          // Deduplicated fetch - will skip if already fetched or in progress
          fetchProfileOnce(isMounted);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          updateTokenCache(session.access_token, session.expires_at);
        }
      }
    );

    // Check if running as installed PWA
    const isStandalonePWA = window.matchMedia('(display-mode: standalone)').matches ||
                            window.navigator.standalone === true;

    // Refresh session when app becomes visible (prevents logout after idle)
    // More aggressive for PWA to handle iOS storage purging
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isMounted) {
        try {
          let { data: { session }, error } = await supabase.auth.getSession();

          // For PWA, always try to refresh to get fresh tokens
          if (isStandalonePWA || !session) {
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshData?.session) {
              session = refreshData.session;
            } else if (refreshError && !session) {
              // Refresh failed and no existing session - user needs to login
              console.log('PWA session expired, redirect to login');
              return;
            }
          }

          if (session) {
            updateTokenCache(session.access_token, session.expires_at);
          }
        } catch (error) {
          console.error('Session refresh on visibility change failed:', error);
        }
      }
    };

    // Also listen for focus event (helps with PWA switching)
    const handleFocus = () => {
      if (isMounted && isStandalonePWA) {
        handleVisibilityChange();
      }
    };

    // Periodic session refresh for PWA (every 10 minutes when visible)
    // This keeps tokens fresh and prevents iOS from purging them
    let refreshInterval = null;
    if (isStandalonePWA) {
      refreshInterval = setInterval(async () => {
        if (document.visibilityState === 'visible' && isMounted) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              // Refresh proactively to keep session active
              const { data: refreshData } = await supabase.auth.refreshSession();
              if (refreshData?.session) {
                updateTokenCache(refreshData.session.access_token, refreshData.session.expires_at);
              }
            }
          } catch (e) {
            // Ignore errors in background refresh
          }
        }
      }, 10 * 60 * 1000); // Every 10 minutes
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [fetchProfileOnce]);

  return (
    <AuthContext.Provider value={{ ...authState, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component - WAITLIST MODE: Show Coming Soon page
// During the waitlist period, all protected routes show the ComingSoon page
const ProtectedRoute = ({ children }) => {
  // Waitlist mode - show Coming Soon page for all protected routes
  return <ComingSoon />;
};

// Admin Route Component - Bypasses waitlist, admin pages handle their own auth
const AdminRoute = ({ children }) => {
  return children;
};

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// App Router - handles session detection
function AppRouter() {
  const location = useLocation();

  // Check for auth callback routes (OAuth, magic link, etc.)
  if (location.pathname === '/auth/callback' || location.hash?.includes('access_token') || location.hash?.includes('error')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {/* Public Pages */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      {/* Auth callback route */}
      <Route path="/auth/callback" element={<AuthCallback />} />
      {/* Admin Routes - Bypass waitlist, pages handle their own auth */}
      <Route path="/super-admin" element={
        <AdminRoute>
          <SuperAdminDashboard />
        </AdminRoute>
      } />
      <Route path="/gym-admin-dashboard" element={
        <AdminRoute>
          <GymAdminDashboard />
        </AdminRoute>
      } />
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/checkin" element={
        <ProtectedRoute>
          <CheckIn />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/user/:userId" element={
        <ProtectedRoute>
          <PublicProfile />
        </ProtectedRoute>
      } />
      <Route path="/gyms" element={
        <ProtectedRoute>
          <Gyms />
        </ProtectedRoute>
      } />
      <Route path="/gym/:gymId" element={
        <ProtectedRoute>
          <GymDetail />
        </ProtectedRoute>
      } />
      <Route path="/leaderboards" element={
        <ProtectedRoute>
          <Leaderboards />
        </ProtectedRoute>
      } />
      <Route path="/connections" element={
        <ProtectedRoute>
          <Connections />
        </ProtectedRoute>
      } />
      <Route path="/challenges" element={
        <ProtectedRoute>
          <Challenges />
        </ProtectedRoute>
      } />
      <Route path="/challenge/:challengeId" element={
        <ProtectedRoute>
          <ChallengeDetail />
        </ProtectedRoute>
      } />
      <Route path="/my-challenges" element={
        <ProtectedRoute>
          <MyChallenges />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/rewards" element={
        <ProtectedRoute>
          <Rewards />
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <AppRouter />
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </div>
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <LazyDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}

export default App;
