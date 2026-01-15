import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { queryKeys, staleTimes } from '@/lib/queryClient';
import { toast } from 'sonner';

/**
 * Hook to get all challenges
 */
export function useChallenges(filters = {}) {
  return useQuery({
    queryKey: queryKeys.challenges.list(filters),
    queryFn: async () => {
      const { data } = await api.get('/challenges', { params: filters });
      return data;
    },
    staleTime: staleTimes.challenges,
  });
}

/**
 * Hook to get user's challenges
 */
export function useMyChallenges() {
  return useQuery({
    queryKey: queryKeys.challenges.mine(),
    queryFn: async () => {
      const { data } = await api.get('/challenges/me');
      return data;
    },
    staleTime: staleTimes.challenges,
  });
}

/**
 * Hook to get a specific challenge
 */
export function useChallenge(challengeId) {
  return useQuery({
    queryKey: queryKeys.challenges.byId(challengeId),
    queryFn: async () => {
      const { data } = await api.get(`/challenges/${challengeId}`);
      return data;
    },
    staleTime: staleTimes.challenges,
    enabled: !!challengeId,
  });
}

/**
 * Hook to get challenge leaderboard
 */
export function useChallengeLeaderboard(challengeId) {
  return useQuery({
    queryKey: queryKeys.challenges.leaderboard(challengeId),
    queryFn: async () => {
      const { data } = await api.get(`/challenges/${challengeId}/leaderboard`);
      return data;
    },
    staleTime: staleTimes.leaderboard,
    enabled: !!challengeId,
  });
}

/**
 * Hook to join a challenge
 */
export function useJoinChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeId) => {
      const { data } = await api.post(`/challenges/${challengeId}/join`);
      return data;
    },
    onSuccess: (data, challengeId) => {
      // Invalidate challenge queries to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.byId(challengeId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.mine() });
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.list() });
      // Also refresh coin balance since entry fee was deducted
      queryClient.invalidateQueries({ queryKey: queryKeys.coins.all });
      toast.success('Joined challenge!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to join challenge');
    },
  });
}

/**
 * Hook to process all challenges (start/cancel based on dates)
 * This triggers the backend to check start dates and either:
 * - Start challenges that have enough participants
 * - Cancel and refund challenges that don't have enough participants
 */
export function useProcessChallenges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/challenges/process');
      return data;
    },
    onSuccess: (data) => {
      // Refresh all challenge data
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.coins.all });

      const { started, cancelled, completed } = data.summary || {};
      if (started > 0 || cancelled > 0 || completed > 0) {
        const messages = [];
        if (started > 0) messages.push(`${started} challenge(s) started`);
        if (cancelled > 0) messages.push(`${cancelled} challenge(s) cancelled`);
        if (completed > 0) messages.push(`${completed} challenge(s) completed`);
        toast.success(messages.join(', '));
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to process challenges');
    },
  });
}

/**
 * Hook to create a challenge
 */
export function useCreateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeData) => {
      const { data } = await api.post('/challenges', challengeData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all });
      toast.success('Challenge created!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to create challenge');
    },
  });
}
