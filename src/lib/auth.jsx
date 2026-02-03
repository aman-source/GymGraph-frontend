import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import api, { clearTokenCache, updateTokenCache } from "@/lib/api";
import { queryClient, queryKeys } from "@/lib/queryClient";

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: null,
    user: null,
    isLoading: true
  });

  const profileFetchInProgress = useRef(false);
  const profileFetched = useRef(false);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }, []);

  const fetchProfileOnce = useCallback(async (isMounted) => {
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

        updateTokenCache(session.access_token, session.expires_at);
        await fetchProfileOnce(isMounted);
      } catch (error) {
        console.error("Auth init error:", error);
        if (isMounted) {
          setAuthState({ isAuthenticated: false, user: null, isLoading: false });
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          clearTokenCache();
          profileFetched.current = false;
          if (isMounted) {
            setAuthState({ isAuthenticated: false, user: null, isLoading: false });
          }
        } else if (event === 'SIGNED_IN' && session) {
          updateTokenCache(session.access_token, session.expires_at);
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
