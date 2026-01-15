import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// ==================== USER HOOKS ====================

/**
 * Hook to submit feedback
 */
export function useSubmitFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedbackData) => {
      const { data } = await api.post('/feedback', feedbackData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-feedback'] });
    },
  });
}

/**
 * Hook to get user's own feedback
 */
export function useMyFeedback(limit = 10) {
  return useQuery({
    queryKey: ['my-feedback', limit],
    queryFn: async () => {
      const { data } = await api.get('/feedback/my', { params: { limit } });
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ==================== ADMIN HOOKS ====================

/**
 * Hook to get all feedback (admin)
 */
export function useAdminFeedback(filters = {}) {
  const { type, status, limit = 20, skip = 0 } = filters;

  return useQuery({
    queryKey: ['admin-feedback', type, status, limit, skip],
    queryFn: async () => {
      const params = { limit, skip };
      if (type) params.type = type;
      if (status) params.status = status;
      const { data } = await api.get('/feedback/admin', { params });
      return data;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to get feedback stats (admin)
 */
export function useAdminFeedbackStats() {
  return useQuery({
    queryKey: ['admin-feedback-stats'],
    queryFn: async () => {
      const { data } = await api.get('/feedback/admin/stats');
      return data;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Hook to update feedback (admin)
 */
export function useUpdateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ feedbackId, updateData }) => {
      const { data } = await api.put(`/feedback/admin/${feedbackId}`, updateData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
      queryClient.invalidateQueries({ queryKey: ['admin-feedback-stats'] });
    },
  });
}

/**
 * Hook to delete feedback (admin)
 */
export function useDeleteFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedbackId) => {
      const { data } = await api.delete(`/feedback/admin/${feedbackId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
      queryClient.invalidateQueries({ queryKey: ['admin-feedback-stats'] });
    },
  });
}
