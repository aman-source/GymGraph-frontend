import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { queryKeys, staleTimes } from '@/lib/queryClient';
import { toast } from 'sonner';

/**
 * Hook to get user's progress/stats
 */
export function useUserProgress() {
  return useQuery({
    queryKey: queryKeys.engagement.userProgress(),
    queryFn: async () => {
      const { data } = await api.get('/engagement/user-progress');
      return data;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to get gym activity (today's check-ins, weekly stats)
 */
export function useGymActivity(gymId) {
  return useQuery({
    queryKey: queryKeys.engagement.gymActivity(gymId),
    queryFn: async () => {
      const { data } = await api.get(`/engagement/gym-activity/${gymId}`);
      return data;
    },
    staleTime: 30 * 1000, // 30 seconds - gym activity changes frequently
    enabled: !!gymId,
  });
}

/**
 * Hook to get user's leaderboard position at a gym
 */
export function useLeaderboardPosition(gymId) {
  return useQuery({
    queryKey: queryKeys.engagement.leaderboardPosition(gymId),
    queryFn: async () => {
      const { data } = await api.get(`/engagement/leaderboard-position/${gymId}`);
      return data;
    },
    staleTime: staleTimes.leaderboard,
    enabled: !!gymId,
  });
}

/**
 * Hook to get gym vs gym leaderboard
 */
export function useGymVsGym() {
  return useQuery({
    queryKey: queryKeys.engagement.gymVsGym(),
    queryFn: async () => {
      const { data } = await api.get('/engagement/gym-vs-gym');
      return data;
    },
    staleTime: staleTimes.leaderboard,
  });
}

/**
 * Hook to get notifications with unread count (merged API)
 * No automatic polling - use refetch() for manual refresh
 */
export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: async () => {
      const { data } = await api.get('/engagement/notifications');
      return data; // Returns { notifications: [], unread_count: number }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - notifications don't need frequent updates
    refetchOnWindowFocus: false, // Don't refetch on tab focus
  });
}

/**
 * Hook to get notification count only
 * DEPRECATED: Use useNotifications() which returns both list and count
 */
export function useNotificationCount() {
  return useQuery({
    queryKey: queryKeys.notifications.count(),
    queryFn: async () => {
      const { data } = await api.get('/engagement/notifications/count');
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: false, // Disabled by default - use useNotifications instead
  });
}

/**
 * Hook to get credits balance
 */
export function useCredits() {
  return useQuery({
    queryKey: queryKeys.credits.balance(),
    queryFn: async () => {
      const { data } = await api.get('/engagement/credits');
      return data;
    },
    staleTime: 60 * 1000,
  });
}

/**
 * Helper to update notification in cache
 */
const updateNotificationInCache = (queryClient, notificationId, updates) => {
  queryClient.setQueryData(queryKeys.notifications.list(), (old) => {
    if (!old) return old;

    const updateNotif = (notif) =>
      notif.notification_id === notificationId || notif.id === notificationId
        ? { ...notif, ...updates }
        : notif;

    const newUnreadCount = updates.read
      ? Math.max(0, (old.unread_count || 0) - 1)
      : old.unread_count;

    return {
      ...old,
      notifications: old.notifications?.map(updateNotif) || [],
      unread_count: newUnreadCount,
      grouped: old.grouped ? {
        last_hour: old.grouped.last_hour?.map(updateNotif) || [],
        today: old.grouped.today?.map(updateNotif) || [],
        yesterday: old.grouped.yesterday?.map(updateNotif) || [],
        this_week: old.grouped.this_week?.map(updateNotif) || [],
        older: old.grouped.older?.map(updateNotif) || [],
      } : undefined
    };
  });
};

/**
 * Helper to remove notification from cache
 */
const removeNotificationFromCache = (queryClient, notificationId) => {
  queryClient.setQueryData(queryKeys.notifications.list(), (old) => {
    if (!old) return old;

    const filterNotif = (notif) =>
      notif.notification_id !== notificationId && notif.id !== notificationId;

    // Check if removed notification was unread
    const removedNotif = old.notifications?.find(
      n => n.notification_id === notificationId || n.id === notificationId
    );
    const wasUnread = removedNotif && !removedNotif.read;

    return {
      ...old,
      notifications: old.notifications?.filter(filterNotif) || [],
      unread_count: wasUnread ? Math.max(0, (old.unread_count || 0) - 1) : old.unread_count,
      grouped: old.grouped ? {
        last_hour: old.grouped.last_hour?.filter(filterNotif) || [],
        today: old.grouped.today?.filter(filterNotif) || [],
        yesterday: old.grouped.yesterday?.filter(filterNotif) || [],
        this_week: old.grouped.this_week?.filter(filterNotif) || [],
        older: old.grouped.older?.filter(filterNotif) || [],
      } : undefined
    };
  });
};

/**
 * Hook to mark a notification as read with optimistic update
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId) => {
      const { data } = await api.post('/engagement/notifications/mark-read', [notificationId]);
      return data;
    },
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.list() });
      const previous = queryClient.getQueryData(queryKeys.notifications.list());

      // Optimistically mark as read
      updateNotificationInCache(queryClient, notificationId, { read: true });

      return { previous };
    },
    onError: (err, notificationId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.notifications.list(), context.previous);
      }
      toast.error('Failed to mark as read');
    },
  });
}

/**
 * Hook to mark all notifications as read with optimistic update
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/engagement/notifications/mark-all-read');
      return data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.list() });
      const previous = queryClient.getQueryData(queryKeys.notifications.list());

      // Optimistically mark all as read
      queryClient.setQueryData(queryKeys.notifications.list(), (old) => {
        if (!old) return old;

        const markRead = (notif) => ({ ...notif, read: true });

        return {
          ...old,
          notifications: old.notifications?.map(markRead) || [],
          unread_count: 0,
          grouped: old.grouped ? {
            last_hour: old.grouped.last_hour?.map(markRead) || [],
            today: old.grouped.today?.map(markRead) || [],
            yesterday: old.grouped.yesterday?.map(markRead) || [],
            this_week: old.grouped.this_week?.map(markRead) || [],
            older: old.grouped.older?.map(markRead) || [],
          } : undefined
        };
      });

      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.notifications.list(), context.previous);
      }
      toast.error('Failed to mark all as read');
    },
    onSuccess: () => {
      toast.success('All notifications marked as read');
    },
  });
}

/**
 * Hook to delete a notification with optimistic update
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId) => {
      const { data } = await api.delete(`/engagement/notifications/${notificationId}`);
      return data;
    },
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.list() });
      const previous = queryClient.getQueryData(queryKeys.notifications.list());

      // Optimistically remove
      removeNotificationFromCache(queryClient, notificationId);

      return { previous };
    },
    onError: (err, notificationId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.notifications.list(), context.previous);
      }
      toast.error('Failed to delete notification');
    },
    onSuccess: () => {
      toast.success('Notification deleted');
    },
  });
}
