import { useEffect, useState, createContext, useContext, useCallback, useRef, lazy, Suspense } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { supabase, auth } from "@/lib/supabase";
import { QueryClientProvider } from "@tanstack/react-query";
// DevTools lazy loaded in dev mode only
import { queryClient, queryKeys } from "@/lib/queryClient";
import api, { clearTokenCache, updateTokenCache } from "@/lib/api";

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

// DevTools - Only loaded in development
const LazyDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then(m => ({ default: m.ReactQueryDevtools }))
);

// Loading fallback for Suspense
const PageLoader = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="w-10 h-10 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin"></div>
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
        const { session } = await auth.getSession();

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

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfileOnce]);

  return (
    <AuthContext.Provider value={{ ...authState, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component - handles auth and onboarding checks
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Check onboarding status and redirect accordingly
  if (location.pathname === "/onboarding") {
    // If already onboarded, redirect to dashboard
    if (user?.onboarding_completed) {
      return <Navigate to="/dashboard" replace />;
    }
    // If on onboarding page and not onboarded (or user is null), allow access
  } else {
    // If not on onboarding and not onboarded, redirect to onboarding
    // Only redirect if we have the user object and they haven't completed onboarding
    if (user && !user.onboarding_completed) {
      return <Navigate to="/onboarding" replace />;
    }
    // If user is null (profile doesn't exist yet), also redirect to onboarding
    if (!user) {
      return <Navigate to="/onboarding" replace />;
    }
  }

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
      {/* Admin Routes */}
      <Route path="/super-admin" element={
        <ProtectedRoute>
          <SuperAdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/gym-admin-dashboard" element={
        <ProtectedRoute>
          <GymAdminDashboard />
        </ProtectedRoute>
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
