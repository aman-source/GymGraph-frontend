import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

// Query keys for gym owner
export const gymOwnerQueryKeys = {
  all: ['gymOwner'],
  dashboard: (gymId) => ['gymOwner', 'dashboard', gymId],
};

/**
 * Hook to get gym owner dashboard data
 */
export function useGymOwnerDashboard(gymId) {
  return useQuery({
    queryKey: gymOwnerQueryKeys.dashboard(gymId),
    queryFn: async () => {
      const { data } = await api.get(`/gym-owner/dashboard/${gymId}`);
      return data;
    },
    enabled: !!gymId,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to regenerate gym QR code
 */
export function useRegenerateQR() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (gymId) => {
      const { data } = await api.post(`/gym-owner/regenerate-qr/${gymId}`);
      return data;
    },
    onSuccess: (data, gymId) => {
      queryClient.invalidateQueries({ queryKey: gymOwnerQueryKeys.dashboard(gymId) });
      toast.success('QR code regenerated');
    },
    onError: () => {
      toast.error('Failed to regenerate QR code');
    },
  });
}

/**
 * Hook to check gym authorization
 */
export function useGymAuthorization(gymId, user) {
  return useQuery({
    queryKey: ['gymOwner', 'auth', gymId],
    queryFn: async () => {
      const { data: gym } = await api.get(`/gyms/${gymId}`);
      const isOwner = gym.owner_id === user?.user_id;
      const isSuperAdmin = user?.role === 'super_admin';
      const isGymAdmin = user?.role === 'gym_admin' && user?.managed_gym_id === gymId;
      return {
        gym,
        isAuthorized: isOwner || isSuperAdmin || isGymAdmin,
        isOwner,
        isSuperAdmin,
        isGymAdmin,
      };
    },
    enabled: !!gymId && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
