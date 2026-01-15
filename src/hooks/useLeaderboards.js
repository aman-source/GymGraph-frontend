import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { queryKeys, staleTimes } from '@/lib/queryClient';

/**
 * Hook to get connections leaderboard (friends leaderboard)
 */
export function useConnectionsLeaderboard() {
  return useQuery({
    queryKey: queryKeys.leaderboards.connections(),
    queryFn: async () => {
      const { data } = await api.get('/leaderboards/connections');
      return data;
    },
    staleTime: staleTimes.leaderboard,
  });
}

/**
 * Hook to get city leaderboard
 */
export function useCityLeaderboard(city) {
  return useQuery({
    queryKey: queryKeys.leaderboards.city(city),
    queryFn: async () => {
      const { data } = await api.get('/leaderboards/city', { params: { city } });
      return data;
    },
    staleTime: staleTimes.leaderboard,
    enabled: !!city,
  });
}
