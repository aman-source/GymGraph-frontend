// User hooks
export { useCurrentUser, useUpdateUser, useUserProfile, useUserStats, useConnectionStatus, useDeleteUser } from './useUser';

// Gym hooks
export { useGym, useGyms, useSearchGyms, useNearbyGyms, useGymLeaderboard, useGymMembers } from './useGym';

// Connection hooks
export {
  useConnections,
  usePendingConnections,
  useDiscoverConnections,
  useConnectionsData,
  useAcceptConnection,
  useDeclineConnection,
  useRemoveConnection,
  useSendConnectionRequest,
} from './useConnections';

// Check-in hooks
export { useCheckinFeed, useMyCheckins, useCreateCheckin, useTodayCheckins } from './useCheckins';

// Engagement hooks
export {
  useUserProgress,
  useGymActivity,
  useLeaderboardPosition,
  useGymVsGym,
  useNotifications,
  useNotificationCount,
  useCredits,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from './useEngagement';

// Leaderboard hooks
export { useConnectionsLeaderboard, useCityLeaderboard } from './useLeaderboards';

// Challenge hooks
export {
  useChallenges,
  useMyChallenges,
  useChallenge,
  useChallengeLeaderboard,
  useJoinChallenge,
  useCreateChallenge,
  useProcessChallenges,
} from './useChallenges';

// Coin system hooks
export {
  useCoinBalance,
  useCoinSummary,
  useCoinTransactions,
  useStreak,
  useReferral,
  useEconomyInfo,
  useStore,
  useChallengePool,
  useClaimSignupBonus,
  useClaimProfileBonus,
  useApplyReferral,
  useFreezeStreak,
  useRestoreStreak,
  useJoinChallengeWithCoins,
} from './useCoins';

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
} from './useAdmin';

// Gym Owner hooks
export {
  useGymOwnerDashboard,
  useRegenerateQR,
  useGymAuthorization,
} from './useGymOwner';

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

// Badge hooks
export {
  useBadges,
  useMyBadges,
  useBadgeProgress,
  useNextBadge,
  useCheckBadges,
} from './useBadges';

// Feedback hooks
export {
  useSubmitFeedback,
  useMyFeedback,
  useAdminFeedback,
  useAdminFeedbackStats,
  useUpdateFeedback,
  useDeleteFeedback,
} from './useFeedback';
