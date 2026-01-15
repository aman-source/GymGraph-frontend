import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
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
