import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { queryKeys, staleTimes } from '@/lib/queryClient';
import { toast } from 'sonner';

/**
 * Hook to get all available badges with user's earned status
 */
export function useBadges() {
  return useQuery({
    queryKey: ['badges', 'all'],
    queryFn: async () => {
      const { data } = await api.get('/badges');
      return data;
    },
    staleTime: staleTimes.badges || 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get current user's earned badges
 */
export function useMyBadges() {
  return useQuery({
    queryKey: ['badges', 'me'],
    queryFn: async () => {
      const { data } = await api.get('/badges/me');
      return data;
    },
    staleTime: staleTimes.badges || 5 * 60 * 1000,
  });
}

/**
 * Hook to get user's badge progress (earned + in-progress badges)
 */
export function useBadgeProgress() {
  return useQuery({
    queryKey: ['badges', 'progress'],
    queryFn: async () => {
      const { data } = await api.get('/badges/progress');
      return data;
    },
    staleTime: 60 * 1000, // 1 minute - refresh more often for progress
  });
}

/**
 * Hook to get the next badge user is closest to earning
 */
export function useNextBadge() {
  return useQuery({
    queryKey: ['badges', 'next'],
    queryFn: async () => {
      const { data } = await api.get('/badges/next');
      return data;
    },
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to manually trigger badge check (useful after system updates)
 */
export function useCheckBadges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/badges/check');
      return data;
    },
    onSuccess: (data) => {
      // Invalidate badge queries to refresh
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      // Also refresh user data as badges are stored there too
      queryClient.invalidateQueries({ queryKey: queryKeys.user.me() });

      return data;
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to check badges');
    },
  });
}
