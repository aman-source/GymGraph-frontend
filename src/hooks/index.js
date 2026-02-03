// Re-export useAuth as useCurrentUser for backwards compatibility
export { useAuth as useCurrentUser } from '@/lib/auth';

// Admin hooks
export {
  useAdminAnalytics,
  useAdminUsers,
  useAdminGyms,
  useAdminChallenges,
  useAdminConfig,
  useAdminTransactions,
  useAdminBadges,
  useAdminAuditLogs,
  useBanUser,
  useUnbanUser,
  useUpdateUserRole,
  useDeleteAdminUser,
  useCreateAdminGym,
  useUpdateAdminGym,
  useVerifyGym,
  useDeleteAdminGym,
  useSetGymOwner,
  useCreateAdminChallenge,
  useCancelChallenge,
  useRefundChallenge,
  useUpdateConfig,
  useAdminFeedback,
  useAdminFeedbackStats,
  useUpdateFeedback,
  useDeleteFeedback,
} from './useAdmin';

// Gym Admin hooks
export {
  useGymAdminDashboard,
  useGymAdminMembers,
  useGymAdminMemberHistory,
  useGymAdminChallenges,
  useGymAdminAnnouncements,
  useCreateGymChallenge,
  useSendGymAnnouncement,
  useDeleteGymAnnouncement,
  useUpdateGymSettings,
} from './useGymAdmin';
