import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Layout from "@/components/Layout";
import { useAuth } from "@/App";
import {
  useUserProfile,
  useUserStats,
  useConnectionStatus,
  useGym,
  useSendConnectionRequest,
} from "@/hooks";
import {
  Zap,
  Trophy,
  Calendar,
  TrendingUp,
  Building2,
  Target,
  UserPlus,
  Lock,
  Check,
  Clock,
  Flame,
  Award,
  Footprints,
  Swords,
  Crown,
  Gem,
  Hash,
  Medal,
  Dumbbell,
  Heart,
  Sparkles,
  Activity,
  Brain,
} from "lucide-react";

// Fitness goal options - matches Profile.jsx
const fitnessGoals = [
  { value: "weight_loss", label: "Weight Loss", icon: Flame, color: "#FF6B35" },
  { value: "muscle_gain", label: "Muscle Gain", icon: Dumbbell, color: "#0066FF" },
  { value: "strength", label: "Build Strength", icon: Activity, color: "#8B5CF6" },
  { value: "endurance", label: "Improve Endurance", icon: Heart, color: "#FF3B30" },
  { value: "flexibility", label: "Flexibility", icon: Sparkles, color: "#00BCD4" },
  { value: "general_fitness", label: "General Fitness", icon: Zap, color: "#FF9500" },
  { value: "sports_performance", label: "Sports Performance", icon: Target, color: "#00C853" },
  { value: "mental_health", label: "Mental Wellness", icon: Brain, color: "#9B59B6" },
];

// Badge data - matches Profile.jsx
const badgeData = {
  badge_first_checkin: { name: "First Steps", icon: Footprints, color: "#FFB800" },
  badge_week_warrior: { name: "Week Warrior", icon: Swords, color: "#FF6B35" },
  badge_month_master: { name: "Month Master", icon: Calendar, color: "#0066FF" },
  badge_lion: { name: "Lion Heart", icon: Flame, color: "#FF9500" },
  badge_century: { name: "Century Club", icon: Hash, color: "#00C853" },
  badge_streak_starter: { name: "Streak Starter", icon: Flame, color: "#FF9500" },
  badge_streak_10: { name: "10 Week Streak", icon: Flame, color: "#FF3B30" },
  badge_consistency_king: { name: "Consistency King", icon: Crown, color: "#8B5CF6" },
  badge_streak_25: { name: "25 Week Legend", icon: Gem, color: "#9B59B6" },
  badge_streak_52: { name: "Year Legend", icon: Crown, color: "#FFD700" },
  badge_challenge_winner: { name: "Challenge Champion", icon: Trophy, color: "#FFB800" },
  badge_challenge_master: { name: "Challenge Master", icon: Medal, color: "#FF9500" },
  badge_challenge_legend: { name: "Challenge Legend", icon: Trophy, color: "#FFD700" },
};

// Streak Ring Component - matches Profile.jsx
const StreakRing = ({ current, best, size = 100 }) => {
  const progress = best > 0 ? Math.min((current / best) * 100, 100) : 0;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#0066FF"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-[#111111]">{current}</span>
        <span className="text-xs text-[#888888]">weeks</span>
      </div>
    </div>
  );
};

export default function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  // React Query hooks for data fetching
  const { data: profileUser, isLoading: profileLoading } = useUserProfile(userId);
  const { data: stats, isLoading: statsLoading } = useUserStats(userId);
  const { data: connectionData } = useConnectionStatus(userId);
  const { data: gymData } = useGym(profileUser?.primary_gym_id);

  // Mutation for sending connection request
  const sendRequestMutation = useSendConnectionRequest();

  const loading = profileLoading || statsLoading;
  const connectionStatus = connectionData?.status;
  const gymName = gymData?.name || "";

  const handleConnect = () => {
    sendRequestMutation.mutate(userId);
  };

  // Check if viewing own profile - redirect immediately
  const isOwnProfile = currentUser?.user_id && String(currentUser.user_id) === String(userId);

  // Redirect to own profile page if viewing self (do this early, before loading completes)
  if (isOwnProfile) {
    navigate('/profile', { replace: true });
    return null;
  }

  const isPrivate = profileUser?.privacy === 'private' ||
    (profileUser?.privacy === 'connections_only' && connectionStatus !== 'connected');

  const fitnessGoalData = fitnessGoals.find(g => g.value === profileUser?.fitness_goal);
  const earnedBadges = stats?.badges || [];

  // Render connection button based on status
  const renderConnectionButton = () => {
    // Don't show connect button for own profile
    if (isOwnProfile) return null;

    if (connectionStatus === 'connected') {
      return (
        <Button disabled className="bg-[#E6FFF5] text-[#00C853] border-0 rounded-xl h-10">
          <Check className="w-4 h-4 mr-2" />
          Connected
        </Button>
      );
    }

    if (connectionStatus === 'requested') {
      return (
        <Button disabled className="bg-[#F0F2F5] text-[#888888] border-0 rounded-xl h-10">
          <Clock className="w-4 h-4 mr-2" />
          Request Sent
        </Button>
      );
    }

    if (connectionStatus === 'pending') {
      return (
        <Button disabled className="bg-[#E6F0FF] text-[#0066FF] border-0 rounded-xl h-10">
          <Clock className="w-4 h-4 mr-2" />
          Pending Response
        </Button>
      );
    }

    return (
      <Button
        onClick={handleConnect}
        disabled={sendRequestMutation.isPending}
        className="bg-[#0066FF] hover:bg-[#0052CC] rounded-xl h-10"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        {sendRequestMutation.isPending ? "Sending..." : "Connect"}
      </Button>
    );
  };

  if (loading) {
    return (
      <Layout user={currentUser}>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-[#F0F2F5] rounded-2xl animate-pulse" />
              <div className="space-y-2">
                <div className="h-6 w-32 bg-[#F0F2F5] rounded animate-pulse" />
                <div className="h-4 w-24 bg-[#F0F2F5] rounded animate-pulse" />
              </div>
            </div>
            <div className="h-10 w-24 bg-[#F0F2F5] rounded-xl animate-pulse" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-[#F8F9FA] border-0 shadow-none">
                <CardContent className="p-4 text-center">
                  <div className="h-8 w-12 bg-[#E5E7EB] rounded mx-auto mb-2 animate-pulse" />
                  <div className="h-4 w-16 bg-[#E5E7EB] rounded mx-auto animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Streak Skeleton */}
          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-[#F0F2F5] rounded animate-pulse" />
                  <div className="h-10 w-20 bg-[#F0F2F5] rounded animate-pulse" />
                </div>
                <div className="w-[100px] h-[100px] bg-[#F0F2F5] rounded-full animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={currentUser}>
      <div className="max-w-2xl mx-auto space-y-6" data-testid="public-profile-page">
        {/* Profile Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 rounded-2xl border-2 border-[#E5E7EB]">
              <AvatarImage src={profileUser?.picture} className="rounded-xl" />
              <AvatarFallback className="bg-[#0066FF] text-white text-2xl rounded-xl font-bold">
                {(profileUser?.display_name || profileUser?.name || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-[#111111]">
                {profileUser?.display_name || profileUser?.name}
              </h1>
              {!isPrivate && gymName && (
                <div className="flex items-center gap-1.5 text-[#555555] text-sm mt-1">
                  <Building2 className="w-4 h-4" />
                  <span>{gymName}</span>
                </div>
              )}
              {!isPrivate && profileUser?.bio && (
                <p className="text-[#555555] text-sm mt-2 max-w-xs">{profileUser.bio}</p>
              )}
            </div>
          </div>

          {renderConnectionButton()}
        </div>

        {/* Fitness Goal Badge */}
        {!isPrivate && fitnessGoalData && (
          <div className="inline-flex items-center gap-2 bg-[#F0F2F5] px-4 py-2 rounded-full">
            <fitnessGoalData.icon className="w-5 h-5" style={{ color: fitnessGoalData.color }} />
            <span className="text-sm font-medium text-[#555555]">{fitnessGoalData.label}</span>
          </div>
        )}

        {isPrivate ? (
          /* Private Profile Notice */
          <Card className="card-premium">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-[#F0F2F5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-[#888888]" />
              </div>
              <h2 className="text-xl font-semibold text-[#111111] mb-2">Private Profile</h2>
              <p className="text-[#555555] max-w-sm mx-auto">
                {profileUser?.privacy === 'connections_only'
                  ? "Connect with this user to view their full profile and stats"
                  : "This user has chosen to keep their profile private"}
              </p>
              {connectionStatus !== 'connected' && connectionStatus !== 'requested' && (
                <Button
                  onClick={handleConnect}
                  disabled={sendRequestMutation.isPending}
                  className="bg-[#0066FF] hover:bg-[#0052CC] rounded-xl mt-6"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {sendRequestMutation.isPending ? "Sending..." : "Send Connection Request"}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-[#F8F9FA] border-0 shadow-none">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-[#111111]">{stats?.total_sessions || 0}</p>
                  <p className="text-sm text-[#555555] mt-1">Sessions</p>
                </CardContent>
              </Card>
              <Card className="bg-[#F8F9FA] border-0 shadow-none">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-[#111111]">{stats?.longest_streak || 0}<span className="text-lg">w</span></p>
                  <p className="text-sm text-[#555555] mt-1">Best Streak</p>
                </CardContent>
              </Card>
              <Card className="bg-[#F8F9FA] border-0 shadow-none">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-[#111111]">{stats?.challenges_won || 0}</p>
                  <p className="text-sm text-[#555555] mt-1">Wins</p>
                </CardContent>
              </Card>
            </div>

            {/* Current Streak with Ring */}
            <Card className="card-premium overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-[#888888] uppercase tracking-wide mb-1">Current Streak</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-[#111111]">{stats?.current_streak || 0}</span>
                      <span className="text-lg text-[#555555]">weeks</span>
                    </div>
                    {stats?.current_streak > 0 && (
                      <p className="text-sm text-[#00C853] mt-2 flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        {stats.current_streak >= stats?.longest_streak
                          ? "Personal best!"
                          : `${stats.longest_streak - stats.current_streak}w to personal best`}
                      </p>
                    )}
                  </div>
                  <StreakRing
                    current={stats?.current_streak || 0}
                    best={stats?.longest_streak || 1}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Badges Section */}
            <Card className="card-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#111111]">Badges</h3>
                  <span className="text-sm text-[#888888]">{earnedBadges.length} earned</span>
                </div>
                {earnedBadges.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {earnedBadges.map((badgeId, index) => {
                      const badge = badgeData[badgeId] || { name: badgeId, icon: Award, color: "#0066FF" };
                      const BadgeIcon = badge.icon;
                      return (
                        <div
                          key={index}
                          className="relative group"
                        >
                          <div
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110"
                            style={{ backgroundColor: `${badge.color}15` }}
                          >
                            <BadgeIcon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: badge.color }} />
                          </div>
                          <p className="text-xs text-center text-[#555555] mt-1.5 truncate">{badge.name}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-[#F0F2F5] rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-[#888888]" />
                    </div>
                    <p className="text-[#888888] text-sm">No badges earned yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Stats */}
            <Card className="card-premium">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#111111] mb-4">Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-xl">
                    <div className="w-10 h-10 bg-[#E6F0FF] rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-[#0066FF]" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[#111111]">{Math.round(stats?.consistency_score || 0)}%</p>
                      <p className="text-xs text-[#888888]">Consistency</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-xl">
                    <div className="w-10 h-10 bg-[#FFF8E6] rounded-xl flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-[#FF9500]" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[#111111]">{stats?.challenges_participated || 0}</p>
                      <p className="text-xs text-[#888888]">Challenges</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
