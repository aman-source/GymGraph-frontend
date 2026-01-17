import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { queryKeys, staleTimes } from '@/lib/queryClient';
import { toast } from 'sonner';

/**
 * Hook to get check-in feed (activity from connections)
 */
export function useCheckinFeed() {
  return useQuery({
    queryKey: queryKeys.checkins.feed(),
    queryFn: async () => {
      const { data } = await api.get('/checkins/feed');
      return data;
    },
    staleTime: staleTimes.feed,
  });
}

/**
 * Hook to get user's own check-ins
 */
export function useMyCheckins(limit = 50, skip = 0) {
  return useQuery({
    queryKey: [...queryKeys.checkins.mine(), { limit, skip }],
    queryFn: async () => {
      const { data } = await api.get('/checkins/me', { params: { limit, skip } });
      return data;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to get today's check-ins for the current user
 */
export function useTodayCheckins() {
  return useQuery({
    queryKey: [...queryKeys.checkins.mine(), 'today'],
    queryFn: async () => {
      const { data } = await api.get('/checkins/me', { params: { limit: 10 } });
      // Filter to only today's check-ins
      const today = new Date().toDateString();
      const todayCheckins = (data.checkins || []).filter(checkin => {
        const checkinDate = new Date(checkin.checked_in_at).toDateString();
        return checkinDate === today;
      });
      return todayCheckins;
    },
    staleTime: 30 * 1000, // 30 seconds - need fresh data for check-in limits
  });
}

/**
 * Hook to create a check-in
 * Invalidates all related caches on success
 */
export function useCreateCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (checkinData) => {
      const { data } = await api.post('/checkins', checkinData);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate all related queries to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.checkins.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.me() });
      queryClient.invalidateQueries({ queryKey: queryKeys.engagement.userProgress() });
      queryClient.invalidateQueries({ queryKey: queryKeys.engagement.all });
      // Invalidate active session to show the new pending reward
      queryClient.invalidateQueries({ queryKey: ['activeSession'] });

      // Show workout started message (coins come later)
      if (data.pending_reward) {
        toast.success(`Workout started! Stay ${data.pending_reward.minutes_until_eligible} mins to earn coins`);
      } else {
        toast.success('Check-in successful!');
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Check-in failed');
    },
  });
}

/**
 * Hook to get active workout session
 * Used to restore state when app reopens
 */
export function useActiveSession() {
  return useQuery({
    queryKey: ['activeSession'],
    queryFn: async () => {
      const { data } = await api.get('/checkins/active-session');
      return data;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: (data) => {
      // Poll more frequently when there's an active session
      return data?.active_session ? 30 * 1000 : false;
    },
  });
}

/**
 * Hook to claim pending workout reward
 * Requires GPS verification that user is still at gym
 */
export function useClaimReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pendingId, latitude, longitude }) => {
      const { data } = await api.post(`/checkins/claim-reward/${pendingId}`, {
        latitude,
        longitude,
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['activeSession'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.me() });
      queryClient.invalidateQueries({ queryKey: queryKeys.credits?.balance?.() });
      queryClient.invalidateQueries({ queryKey: queryKeys.checkins.all });

      // Clear localStorage session
      localStorage.removeItem('activeWorkoutSession');

      toast.success(data.message || `You earned ${data.coins_earned} coins!`);
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 'Failed to claim reward';
      toast.error(message);

      // If reward was forfeited, clear the session
      if (message.includes('forfeited')) {
        localStorage.removeItem('activeWorkoutSession');
        queryClient.invalidateQueries({ queryKey: ['activeSession'] });
      }
    },
  });
}
