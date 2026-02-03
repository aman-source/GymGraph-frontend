import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';

// Query keys for admin - include pagination params
export const adminQueryKeys = {
  all: ['admin'],
  analytics: () => ['admin', 'analytics'],
  users: (filters) => ['admin', 'users', filters],
  gyms: (filters) => ['admin', 'gyms', filters],
  challenges: (filters) => ['admin', 'challenges', filters],
  config: () => ['admin', 'config'],
  transactions: (filters) => ['admin', 'transactions', filters],
  badges: () => ['admin', 'badges'],
  auditLogs: (filters) => ['admin', 'audit-logs', filters],
};

/**
 * Hook to get admin analytics overview
 */
export function useAdminAnalytics() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  return useQuery({
    queryKey: adminQueryKeys.analytics(),
    queryFn: async () => {
      const { data } = await api.get('/admin/analytics');
      return data;
    },
    staleTime: 60 * 1000,
    enabled: isSuperAdmin,
    retry: false,
  });
}

/**
 * Hook to get admin users list with pagination
 */
export function useAdminUsers({ limit = 20, skip = 0, search = '', role = '', status = '' } = {}) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  return useQuery({
    queryKey: adminQueryKeys.users({ limit, skip, search, role, status }),
    queryFn: async () => {
      const params = { limit, skip };
      if (search) params.search = search;
      if (role && role !== 'all') params.role = role;
      if (status && status !== 'all') params.status = status;

      const { data } = await api.get('/admin/users', { params });
      return data;
    },
    staleTime: 30 * 1000,
    enabled: isSuperAdmin,
    retry: false,
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to get admin gyms list with pagination
 */
export function useAdminGyms({ limit = 20, skip = 0, search = '', city = '', verified = null } = {}) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  return useQuery({
    queryKey: adminQueryKeys.gyms({ limit, skip, search, city, verified }),
    queryFn: async () => {
      const params = { limit, skip };
      if (search) params.search = search;
      if (city && city !== 'all') params.city = city;
      if (verified !== null) params.verified = verified;

      const { data } = await api.get('/admin/gyms', { params });
      return data;
    },
    staleTime: 60 * 1000,
    enabled: isSuperAdmin,
    retry: false,
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to get admin challenges with pagination
 */
export function useAdminChallenges({ limit = 20, skip = 0, status = '' } = {}) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  return useQuery({
    queryKey: adminQueryKeys.challenges({ limit, skip, status }),
    queryFn: async () => {
      const params = { limit, skip };
      if (status && status !== 'all') params.status = status;

      const { data } = await api.get('/admin/challenges', { params });
      return data;
    },
    staleTime: 60 * 1000,
    enabled: isSuperAdmin,
    retry: false,
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to get platform config
 */
export function useAdminConfig() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  return useQuery({
    queryKey: adminQueryKeys.config(),
    queryFn: async () => {
      const { data } = await api.get('/admin/config');
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: isSuperAdmin,
    retry: false,
  });
}

/**
 * Hook to get admin transactions with pagination
 */
export function useAdminTransactions({ limit = 20, skip = 0 } = {}) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  return useQuery({
    queryKey: adminQueryKeys.transactions({ limit, skip }),
    queryFn: async () => {
      const { data } = await api.get('/admin/transactions', { params: { limit, skip } });
      return data;
    },
    staleTime: 30 * 1000,
    enabled: isSuperAdmin,
    retry: false,
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to get badges
 */
export function useAdminBadges() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  return useQuery({
    queryKey: adminQueryKeys.badges(),
    queryFn: async () => {
      const { data } = await api.get('/admin/badges');
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: isSuperAdmin,
    retry: false,
  });
}

/**
 * Hook to get audit logs with pagination
 */
export function useAdminAuditLogs({ limit = 50, skip = 0, action = '', entityType = '' } = {}) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  return useQuery({
    queryKey: adminQueryKeys.auditLogs({ limit, skip, action, entityType }),
    queryFn: async () => {
      const params = { limit, skip };
      if (action) params.action = action;
      if (entityType) params.entity_type = entityType;

      const { data } = await api.get('/admin/audit-logs', { params });
      return data;
    },
    staleTime: 30 * 1000,
    enabled: isSuperAdmin,
    retry: false,
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to ban user
 */
export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, reason }) => {
      const { data } = await api.post(`/admin/users/${userId}/ban`, { reason });
      return data;
    },
    onSuccess: () => {
      // Invalidate all user queries regardless of params
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.analytics() });
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit-logs'] });
      toast.success('User banned successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to ban user');
    },
  });
}

/**
 * Hook to unban user
 */
export function useUnbanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await api.post(`/admin/users/${userId}/unban`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit-logs'] });
      toast.success('User unbanned');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to unban user');
    },
  });
}

/**
 * Hook to update user role
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role, managedGymId }) => {
      const { data } = await api.put(`/admin/users/${userId}/role`, {
        role,
        managed_gym_id: role === 'gym_admin' ? managedGymId : null,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit-logs'] });
      toast.success('Role updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to update role');
    },
  });
}

/**
 * Hook to delete user
 */
export function useDeleteAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const { data } = await api.delete(`/admin/users/${userId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.analytics() });
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit-logs'] });
      toast.success('User deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to delete user');
    },
  });
}

/**
 * Hook to create gym
 */
export function useCreateAdminGym() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (gymData) => {
      const { data } = await api.post('/admin/gyms', gymData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gyms'] });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.analytics() });
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit-logs'] });
      toast.success('Gym created');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to create gym');
    },
  });
}

/**
 * Hook to verify/unverify gym
 */
export function useVerifyGym() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ gymId, verify }) => {
      const { data } = await api.post(`/admin/gyms/${gymId}/${verify ? 'verify' : 'unverify'}`);
      return data;
    },
    onSuccess: (_, { verify }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gyms'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit-logs'] });
      toast.success(verify ? 'Gym verified' : 'Gym unverified');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to update gym');
    },
  });
}

/**
 * Hook to update gym details
 */
export function useUpdateAdminGym() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ gymId, data: gymData }) => {
      const { data } = await api.put(`/admin/gyms/${gymId}`, gymData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gyms'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit-logs'] });
      toast.success('Gym updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to update gym');
    },
  });
}

/**
 * Hook to delete gym
 */
export function useDeleteAdminGym() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (gymId) => {
      const { data } = await api.delete(`/admin/gyms/${gymId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gyms'] });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.analytics() });
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit-logs'] });
      toast.success('Gym deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to delete gym');
    },
  });
}

/**
 * Hook to set gym owner
 */
export function useSetGymOwner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ gymId, ownerId }) => {
      const { data } = await api.put(`/admin/gyms/${gymId}/owner?owner_id=${ownerId || ''}`);
      return data;
    },
    onSuccess: (_, { ownerId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gyms'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit-logs'] });
      toast.success(ownerId ? 'Gym owner assigned' : 'Gym owner removed');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to update gym owner');
    },
  });
}

/**
 * Hook to create global challenge
 */
export function useCreateAdminChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (challengeData) => {
      const { data } = await api.post('/admin/challenges', challengeData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'challenges'] });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.analytics() });
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit-logs'] });
      toast.success('Global challenge created');
    },
    onError: (error) => {
      // Handle Pydantic validation errors (array of objects) or string errors
      const detail = error.response?.data?.detail;
      let message = 'Failed to create challenge';
      if (typeof detail === 'string') {
        message = detail;
      } else if (Array.isArray(detail) && detail.length > 0) {
        message = detail[0]?.msg || message;
      }
      toast.error(message);
    },
  });
}

/**
 * Hook to cancel challenge
 */
export function useCancelChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (challengeId) => {
      const { data } = await api.post(`/admin/challenges/${challengeId}/cancel`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'challenges'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit-logs'] });
      toast.success('Challenge cancelled');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to cancel challenge');
    },
  });
}

/**
 * Hook to refund challenge
 */
export function useRefundChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (challengeId) => {
      const { data } = await api.post(`/admin/challenges/${challengeId}/refund`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'challenges'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'transactions'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit-logs'] });
      toast.success(`Refunded ${data.refunded_count} participants`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to refund challenge');
    },
  });
}

/**
 * Hook to update config
 */
export function useUpdateConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (configData) => {
      const { data } = await api.put('/admin/config', configData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.config() });
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit-logs'] });
      toast.success('Configuration saved');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to save configuration');
    },
  });
}

/**
 * Hook to get admin feedback list with pagination
 */
export function useAdminFeedback({ limit = 20, skip = 0, type = '', status = '' } = {}) {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  return useQuery({
    queryKey: ['admin', 'feedback', { limit, skip, type, status }],
    queryFn: async () => {
      const params = { limit, skip };
      if (type && type !== 'all') params.type = type;
      if (status && status !== 'all') params.status = status;
      const { data } = await api.get('/admin/feedback', { params });
      return data;
    },
    staleTime: 60 * 1000,
    enabled: isSuperAdmin,
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to get admin feedback statistics
 */
export function useAdminFeedbackStats() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  return useQuery({
    queryKey: ['admin', 'feedback-stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/feedback/stats');
      return data;
    },
    staleTime: 60 * 1000,
    enabled: isSuperAdmin,
  });
}

/**
 * Hook to update feedback status
 */
export function useUpdateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ feedbackId, status, adminNotes }) => {
      const { data } = await api.patch(`/admin/feedback/${feedbackId}`, { status, admin_notes: adminNotes });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'feedback'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'feedback-stats'] });
      toast.success('Feedback updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to update feedback');
    },
  });
}

/**
 * Hook to delete feedback
 */
export function useDeleteFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedbackId) => {
      const { data } = await api.delete(`/admin/feedback/${feedbackId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'feedback'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'feedback-stats'] });
      toast.success('Feedback deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to delete feedback');
    },
  });
}
