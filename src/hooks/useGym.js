import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { queryKeys, staleTimes } from '@/lib/queryClient';

/**
 * Hook to get gym by ID
 * Cached for 5 minutes since gym data rarely changes
 */
export function useGym(gymId) {
  return useQuery({
    queryKey: queryKeys.gyms.byId(gymId),
    queryFn: async () => {
      const { data } = await api.get(`/gyms/${gymId}`);
      return data;
    },
    staleTime: staleTimes.gym,
    enabled: !!gymId,
  });
}

/**
 * Hook to list gyms with optional filters
 */
export function useGyms(filters = {}) {
  return useQuery({
    queryKey: queryKeys.gyms.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/gyms', { params: filters });
      return data;
    },
    staleTime: staleTimes.gym,
  });
}

/**
 * Hook to search gyms with pagination (infinite scroll)
 */
export function useSearchGyms(searchTerm, limit = 12) {
  return useInfiniteQuery({
    queryKey: ['gyms', 'search', searchTerm, limit],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await api.get('/gyms', {
        params: { search: searchTerm, limit, skip: pageParam },
      });
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.has_more) {
        return allPages.length * limit;
      }
      return undefined;
    },
    staleTime: staleTimes.gym,
    enabled: !!searchTerm && searchTerm.length >= 2,
  });
}

/**
 * Hook to get nearby gyms with pagination (infinite scroll)
 */
export function useNearbyGyms(latitude, longitude, radiusKm = 10, limit = 10) {
  return useInfiniteQuery({
    queryKey: ['gyms', 'nearby', latitude, longitude, radiusKm, limit],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await api.get('/gyms/nearby', {
        params: {
          latitude,
          longitude,
          radius_km: radiusKm,
          limit,
          skip: pageParam,
        },
      });
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.has_more) {
        return allPages.length * limit;
      }
      return undefined;
    },
    staleTime: staleTimes.gym,
    enabled: !!latitude && !!longitude,
  });
}

/**
 * Hook to get gym leaderboard
 */
export function useGymLeaderboard(gymId, period = 'week') {
  return useQuery({
    queryKey: queryKeys.gyms.leaderboard(gymId, period),
    queryFn: async () => {
      const { data } = await api.get(`/gyms/${gymId}/leaderboard`, {
        params: { period },
      });
      return data;
    },
    staleTime: staleTimes.leaderboard,
    enabled: !!gymId,
  });
}

/**
 * Hook to get gym members
 */
export function useGymMembers(gymId) {
  return useQuery({
    queryKey: queryKeys.gyms.members(gymId),
    queryFn: async () => {
      const { data } = await api.get(`/gyms/${gymId}/members`);
      return data;
    },
    staleTime: staleTimes.gym,
    enabled: !!gymId,
  });
}


// ============================================
// SMART SEARCH HOOKS
// ============================================

/**
 * Smart gym search with fuzzy matching, ranking, and Google fallback
 * Uses location-aware ranking: distance (40%), name match (30%), popularity (20%), recency (10%)
 */
export function useSmartSearchGyms(searchTerm, userLocation, options = {}) {
  const { limit = 12, enabled = true } = options;

  return useInfiniteQuery({
    queryKey: ['gyms', 'smart-search', searchTerm, userLocation?.latitude, userLocation?.longitude, limit],
    queryFn: async ({ pageParam = 0 }) => {
      const params = {
        query: searchTerm,
        limit,
        skip: pageParam,
      };

      if (userLocation?.latitude && userLocation?.longitude) {
        params.latitude = userLocation.latitude;
        params.longitude = userLocation.longitude;
      }

      const { data } = await api.get('/gyms/search', { params });
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.has_more) {
        return allPages.length * limit;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - search results cached longer
    gcTime: 30 * 60 * 1000,   // 30 minutes garbage collection
    enabled: enabled && !!searchTerm && searchTerm.length >= 2,
  });
}

/**
 * Preload nearby gyms on app open
 * Uses geohash-based caching for fast startup (24hr cache)
 */
export function usePreloadNearbyGyms(latitude, longitude) {
  return useQuery({
    queryKey: ['gyms', 'preload', latitude, longitude],
    queryFn: async () => {
      const { data } = await api.get('/gyms/preload', {
        params: { latitude, longitude },
      });
      return data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000,    // 1 hour
    enabled: !!latitude && !!longitude,
  });
}

/**
 * Record gym selection for learning system
 * Improves future search rankings based on user behavior
 */
export function useRecordGymSelection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (selectionData) => {
      const { data } = await api.post('/gyms/select', selectionData);
      return data;
    },
    onSuccess: () => {
      // Invalidate suggestions to reflect new selection
      queryClient.invalidateQueries({ queryKey: ['gyms', 'suggestions'] });
    },
  });
}

/**
 * Submit a new gym ("Can't find your gym?")
 */
export function useSubmitGym() {
  return useMutation({
    mutationFn: async (gymData) => {
      const { data } = await api.post('/gyms/submit', gymData);
      return data;
    },
  });
}

/**
 * Get personalized gym suggestions
 * Based on user's past selections, popular gyms nearby, and recently added gyms
 */
export function useGymSuggestions(latitude, longitude, options = {}) {
  const { limit = 5, enabled = true } = options;

  return useQuery({
    queryKey: ['gyms', 'suggestions', latitude, longitude, limit],
    queryFn: async () => {
      const { data } = await api.get('/gyms/suggestions', {
        params: { latitude, longitude, limit },
      });
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: enabled && !!latitude && !!longitude,
  });
}
