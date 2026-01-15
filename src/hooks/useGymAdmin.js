import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/App';

// Query keys for gym admin
export const gymAdminQueryKeys = {
  all: ['gym-admin'],
  dashboard: () => ['gym-admin', 'dashboard'],
  members: (filters) => ['gym-admin', 'members', filters],
  memberHistory: (userId) => ['gym-admin', 'members', userId, 'history'],
  challenges: () => ['gym-admin', 'challenges'],
  announcements: () => ['gym-admin', 'announcements'],
};

/**
 * Hook to get gym admin dashboard data
 */
export function useGymAdminDashboard() {
  const { user } = useAuth();
  const isGymAdmin = Boolean(user?.role === 'gym_admin' && user?.managed_gym_id);

  return useQuery({
    queryKey: gymAdminQueryKeys.dashboard(),
    queryFn: async () => {
      const { data } = await api.get('/gym-admin/dashboard');
      return data;
    },
    staleTime: 60 * 1000, // 1 minute
    enabled: isGymAdmin,
    retry: false,
  });
}

/**
 * Hook to get gym members with optional search and pagination
 */
export function useGymAdminMembers({ search = '', limit = 100, skip = 0 } = {}) {
  const { user } = useAuth();
  const isGymAdmin = Boolean(user?.role === 'gym_admin' && user?.managed_gym_id);

  return useQuery({
    queryKey: gymAdminQueryKeys.members({ search, limit, skip }),
    queryFn: async () => {
      const params = { limit, skip };
      if (search) params.search = search;

      const { data } = await api.get('/gym-admin/members', { params });
      return data;
    },
    staleTime: 30 * 1000, // 30 seconds
    enabled: isGymAdmin,
    retry: false,
  });
}

/**
 * Hook to get a specific member's check-in history
 */
export function useGymAdminMemberHistory(userId) {
  const { user } = useAuth();
  const isGymAdmin = Boolean(user?.role === 'gym_admin' && user?.managed_gym_id);

  return useQuery({
    queryKey: gymAdminQueryKeys.memberHistory(userId),
    queryFn: async () => {
      const { data } = await api.get(`/gym-admin/members/${userId}/history`);
      return data;
    },
    staleTime: 60 * 1000,
    enabled: isGymAdmin && Boolean(userId),
    retry: false,
  });
}

/**
 * Hook to get gym challenges
 */
export function useGymAdminChallenges() {
  const { user } = useAuth();
  const isGymAdmin = Boolean(user?.role === 'gym_admin' && user?.managed_gym_id);

  return useQuery({
    queryKey: gymAdminQueryKeys.challenges(),
    queryFn: async () => {
      const { data } = await api.get('/gym-admin/challenges');
      return data;
    },
    staleTime: 60 * 1000,
    enabled: isGymAdmin,
    retry: false,
  });
}

/**
 * Hook to get gym announcements
 */
export function useGymAdminAnnouncements() {
  const { user } = useAuth();
  const isGymAdmin = Boolean(user?.role === 'gym_admin' && user?.managed_gym_id);

  return useQuery({
    queryKey: gymAdminQueryKeys.announcements(),
    queryFn: async () => {
      const { data } = await api.get('/gym-admin/announcements');
      return data;
    },
    staleTime: 30 * 1000,
    enabled: isGymAdmin,
    retry: false,
  });
}

/**
 * Hook to create a gym challenge
 */
export function useCreateGymChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeData) => {
      const { data } = await api.post('/gym-admin/challenges', challengeData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gymAdminQueryKeys.challenges() });
      queryClient.invalidateQueries({ queryKey: gymAdminQueryKeys.dashboard() });
      toast.success('Challenge created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to create challenge');
    },
  });
}

/**
 * Hook to send a gym announcement
 */
export function useSendGymAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (announcementData) => {
      const { data } = await api.post('/gym-admin/announcements', announcementData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: gymAdminQueryKeys.announcements() });
      toast.success(`Announcement sent to ${data.members_notified || 0} members!`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to send announcement');
    },
  });
}

/**
 * Hook to delete a gym announcement
 */
export function useDeleteGymAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (announcementId) => {
      const { data } = await api.delete(`/gym-admin/announcements/${announcementId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gymAdminQueryKeys.announcements() });
      toast.success('Announcement deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to delete announcement');
    },
  });
}

/**
 * Hook to update gym settings
 */
export function useUpdateGymSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settingsData) => {
      const { data } = await api.put('/gym-admin/settings', settingsData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gymAdminQueryKeys.dashboard() });
      toast.success('Settings saved successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to save settings');
    },
  });
}
