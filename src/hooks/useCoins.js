import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { queryKeys } from '@/lib/queryClient';
import { toast } from 'sonner';

/**
 * Hook to get coin balance
 */
export function useCoinBalance() {
  return useQuery({
    queryKey: queryKeys.coins.balance(),
    queryFn: async () => {
      const { data } = await api.get('/coins/balance');
      return data;
    },
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to get comprehensive coin summary
 * Includes balance, streak, referrals, challenges stats
 */
export function useCoinSummary() {
  return useQuery({
    queryKey: queryKeys.coins.summary(),
    queryFn: async () => {
      const { data } = await api.get('/coins/summary');
      return data;
    },
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to get coin transaction history
 */
export function useCoinTransactions(limit = 50, offset = 0) {
  return useQuery({
    queryKey: queryKeys.coins.transactions(limit, offset),
    queryFn: async () => {
      const { data } = await api.get('/coins/transactions', {
        params: { limit, offset }
      });
      return data;
    },
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to get streak data
 */
export function useStreak() {
  return useQuery({
    queryKey: queryKeys.coins.streak(),
    queryFn: async () => {
      const { data } = await api.get('/coins/streak');
      return data;
    },
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to get referral code and stats
 */
export function useReferral() {
  return useQuery({
    queryKey: queryKeys.coins.referral(),
    queryFn: async () => {
      const { data } = await api.get('/coins/referral/code');
      return data;
    },
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to get economy info (public, no auth)
 */
export function useEconomyInfo() {
  return useQuery({
    queryKey: queryKeys.coins.economyInfo(),
    queryFn: async () => {
      const { data } = await api.get('/coins/economy-info');
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - rarely changes
  });
}

/**
 * Hook to get store items
 */
export function useStore() {
  return useQuery({
    queryKey: queryKeys.coins.store(),
    queryFn: async () => {
      const { data } = await api.get('/coins/store');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get challenge pool info
 */
export function useChallengePool(challengeId) {
  return useQuery({
    queryKey: queryKeys.coins.challengePool(challengeId),
    queryFn: async () => {
      const { data } = await api.get(`/coins/challenges/${challengeId}/pool`);
      return data;
    },
    staleTime: 30 * 1000,
    enabled: !!challengeId,
  });
}

/**
 * Hook to claim signup bonus
 */
export function useClaimSignupBonus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/coins/claim/signup');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coins.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.me() });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to claim signup bonus');
    },
  });
}

/**
 * Hook to claim profile completion bonus
 */
export function useClaimProfileBonus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/coins/claim/profile');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coins.all });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to claim profile bonus');
    },
  });
}

/**
 * Hook to apply referral code
 */
export function useApplyReferral() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (referralCode) => {
      const { data } = await api.post('/coins/referral/apply', {
        referral_code: referralCode
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coins.all });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to apply referral code');
    },
  });
}

/**
 * Hook to freeze streak
 */
export function useFreezeStreak() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/coins/streak/freeze');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coins.streak() });
      queryClient.invalidateQueries({ queryKey: queryKeys.coins.balance() });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to freeze streak');
    },
  });
}

/**
 * Hook to restore streak
 */
export function useRestoreStreak() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/coins/streak/restore');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coins.streak() });
      queryClient.invalidateQueries({ queryKey: queryKeys.coins.balance() });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to restore streak');
    },
  });
}

/**
 * Hook to join challenge with coins
 */
export function useJoinChallengeWithCoins() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeId) => {
      const { data } = await api.post('/coins/challenges/join', {
        challenge_id: challengeId
      });
      return data;
    },
    onSuccess: (_, challengeId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coins.balance() });
      queryClient.invalidateQueries({ queryKey: queryKeys.coins.challengePool(challengeId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.mine() });
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to join challenge');
    },
  });
}
