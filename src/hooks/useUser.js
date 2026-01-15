import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { queryKeys, staleTimes } from '@/lib/queryClient';
import { useAuth } from '@/App';

/**
 * Hook to get current user data
 * Uses AuthContext as the source of truth, eliminating redundant /users/me calls
 */
export function useCurrentUser() {
  const { user: authUser, isAuthenticated, isLoading: authLoading, refreshUser } = useAuth();

  // Return auth user directly - no additional API call needed!
  return {
    user: authUser,
    isLoading: authLoading,
    isAuthenticated,
    refetch: refreshUser,
  };
}

/**
 * Hook to update current user profile
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: async (updateData) => {
      const { data } = await api.put('/users/me', updateData);
      return data;
    },
    onSuccess: (data) => {
      // Update React Query cache
      queryClient.setQueryData(queryKeys.user.me(), data);
      // Also refresh AuthContext
      refreshUser();
    },
  });
}

/**
 * Hook to get another user's public profile
 */
export function useUserProfile(userId) {
  return useQuery({
    queryKey: queryKeys.user.byId(userId),
    queryFn: async () => {
      const { data } = await api.get(`/users/${userId}`);
      return data;
    },
    staleTime: staleTimes.user,
    enabled: !!userId,
  });
}

/**
 * Hook to get another user's public stats
 */
export function useUserStats(userId) {
  return useQuery({
    queryKey: ['user', userId, 'stats'],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userId}/stats`);
      return data;
    },
    staleTime: staleTimes.user,
    enabled: !!userId,
  });
}

/**
 * Hook to get connection status with another user
 * Efficient single-query check instead of fetching all connections
 */
export function useConnectionStatus(userId) {
  return useQuery({
    queryKey: ['user', userId, 'connection-status'],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userId}/connection-status`);
      return data;
    },
    staleTime: staleTimes.connections,
    enabled: !!userId,
  });
}

/**
 * Hook to delete user account
 */
export function useDeleteUser() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete('/users/me');
      return data;
    },
  });
}
