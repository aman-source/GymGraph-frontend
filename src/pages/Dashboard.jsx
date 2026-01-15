import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout";
import {
  useCurrentUser,
  useGym,
  useCheckinFeed,
  useUserProgress,
  useGymActivity,
  useLeaderboardPosition,
  useCoinBalance,
  useMyCheckins,
  useStreak,
} from "@/hooks";
import {
  Zap,
  Target,
  Trophy,
  Calendar,
  MapPin,
  TrendingUp,
  Users,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Building2,
  AlertTriangle,
  Award,
  Flame,
  Coins,
  Clock,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Star,
  Crown,
  Play,
  Gift,
  Rocket,
  Dumbbell,
  Heart,
  Footprints,
  Swords,
  Hash,
} from "lucide-react";
import { formatDistanceToNow, isToday, format } from "date-fns";

// GymGraph Mountain Logo
const GymGraphLogo = ({ className = "w-6 h-6", color = "white" }) => (
  <svg viewBox="0 0 512 512" className={className} fill={color}>
    <polygon points="80,400 220,160 320,400" />
    <polygon points="200,400 340,100 460,400" />
  </svg>
);

// Workout type icons mapping
const workoutIcons = {
  "Weights": Dumbbell,
  "Cardio": Heart,
  "Yoga": Sparkles,
  "CrossFit": Zap,
  "HIIT": Flame,
  "Swimming": Zap,
  "Boxing": Swords,
  "Class": Users,
  "default": Dumbbell,
};

// Badge icons mapping
const badgeIcons = {
  "first_checkin": Footprints,
  "week_warrior": Swords,
  "month_master": Calendar,
  "streak_10": Flame,
  "century_club": Hash,
};

// Get time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

// Animated streak ring
const StreakRing = ({ current, size = 100 }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(current * 10, 100);
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F0F2F5"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#streakGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="100%" stopColor="#FF9500" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Flame className="w-6 h-6 text-[#FF6B35] mb-1" />
        <span className="text-2xl font-bold text-[#111111]">{current}</span>
        <span className="text-[10px] text-[#888888] uppercase tracking-wide">days</span>
      </div>
    </div>
  );
};

// Stat card component
const StatCard = ({ icon: Icon, value, label, suffix, color, onClick }) => (
  <Card
    className="card-premium hover:shadow-lg transition-all cursor-pointer group"
    onClick={onClick}
  >
    <CardContent className="p-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110`} style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-2xl font-bold text-[#111111]">
        {value}
        {suffix && <span className="text-sm text-[#888888] ml-0.5">{suffix}</span>}
      </p>
      <p className="text-sm text-[#555555]">{label}</p>
    </CardContent>
  </Card>
);

// Activity item
const ActivityItem = ({ checkin, onClick }) => (
  <div
    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8F9FA] transition-colors cursor-pointer"
    onClick={onClick}
  >
    <Avatar className="w-10 h-10 border border-[#E5E7EB]">
      <AvatarImage src={checkin.user?.picture} />
      <AvatarFallback className="bg-gradient-to-br from-[#0066FF] to-[#0052CC] text-white font-semibold text-sm">
        {(checkin.user?.display_name || checkin.user?.name || 'U').charAt(0)}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-[#111111]">
        <span className="font-semibold">{checkin.user?.display_name || checkin.user?.name}</span>
        {" checked in"}
      </p>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-xs text-[#555555] truncate">{checkin.gym_name}</span>
        <span className="text-xs text-[#888888]">
          {formatDistanceToNow(new Date(checkin.checked_in_at), { addSuffix: true })}
        </span>
      </div>
    </div>
    {checkin.workout_type && (
      <span className="text-xs bg-[#E6F0FF] text-[#0066FF] px-2 py-1 rounded-lg font-medium">
        {checkin.workout_type}
      </span>
    )}
  </div>
);

// Quick action button
const QuickAction = ({ icon: Icon, label, sublabel, color, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8F9FA] transition-all text-left group"
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
      style={{ backgroundColor: `${color}15` }}
    >
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <div className="flex-1">
      <p className="font-medium text-[#111111] text-sm">{label}</p>
      <p className="text-xs text-[#888888]">{sublabel}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-[#888888] group-hover:translate-x-0.5 transition-transform" />
  </button>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [activityExpanded, setActivityExpanded] = useState(false);

  // React Query hooks
  const { user, isLoading: userLoading } = useCurrentUser();
  const { data: feedData } = useCheckinFeed();
  const { data: progress } = useUserProgress();
  const { data: gym } = useGym(user?.primary_gym_id);
  const { data: gymActivity } = useGymActivity(user?.primary_gym_id);
  const { data: leaderboardPos } = useLeaderboardPosition(user?.primary_gym_id);
  const { data: coinData } = useCoinBalance();
  const { data: checkinsData } = useMyCheckins(5);
  const { data: streakData } = useStreak(); // Daily streak data

  const feed = feedData?.feed || [];
  const myCheckins = checkinsData?.checkins || [];
  const todayCheckin = myCheckins.find(c => isToday(new Date(c.checked_in_at)));
  const coinBalance = coinData?.balance || 0;
  const dailyStreak = streakData?.current_streak || 0;

  // Loading skeleton
  if (userLoading) {
    return (
      <Layout user={user}>
        <div className="space-y-6">
          <div>
            <div className="h-7 w-48 bg-[#F0F2F5] rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-64 bg-[#F0F2F5] rounded animate-pulse" />
          </div>
          <div className="h-32 bg-[#F0F2F5] rounded-2xl animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-28 bg-[#F0F2F5] rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const isNewUser = (user?.total_sessions || 0) === 0;
  const hasStreak = dailyStreak > 0;
  const firstName = user?.display_name?.split(' ')[0] || user?.name?.split(' ')[0] || 'there';

  // New user experience
  if (isNewUser) {
    return (
      <Layout user={user}>
        <div className="space-y-6" data-testid="dashboard-page">
          {/* Welcome Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-[#0066FF] bg-[#E6F0FF] px-2 py-0.5 rounded-full">NEW</span>
            </div>
            <h1 className="text-2xl font-bold text-[#111111]">Welcome, {firstName}!</h1>
          </div>

          {/* Hero Check-in CTA */}
          <Card
            className="overflow-hidden cursor-pointer group"
            onClick={() => navigate('/checkin')}
          >
            <div className="bg-gradient-to-br from-[#0066FF] via-[#0052CC] to-[#003D99] p-6 relative">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full" />
              </div>
              <div className="relative flex items-center gap-5">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white/70 text-sm font-medium mb-1">YOUR FIRST STEP</p>
                  <p className="text-white font-bold text-2xl">Start Your Journey</p>
                  <p className="text-white/70 text-sm mt-1">Check in at your gym to begin</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </Card>

          {/* What You'll Unlock */}
          <div>
            <h2 className="text-lg font-semibold text-[#111111] mb-4">Unlock with your first check-in</h2>
            <div className="grid grid-cols-3 gap-3">
              <Card className="card-premium text-center border-2 border-dashed border-[#FFD700]/50 bg-gradient-to-br from-[#FFFBEB] to-white">
                <CardContent className="p-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FF9500] rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Footprints className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-semibold text-[#111111] text-sm">First Step</p>
                  <p className="text-xs text-[#888888]">Your first badge</p>
                </CardContent>
              </Card>
              <Card className="card-premium text-center">
                <CardContent className="p-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FFB800] to-[#FF9500] rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Coins className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-semibold text-[#111111] text-sm">+50 Coins</p>
                  <p className="text-xs text-[#888888]">Bonus reward</p>
                </CardContent>
              </Card>
              <Card className="card-premium text-center">
                <CardContent className="p-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#FF9500] rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-semibold text-[#111111] text-sm">1 Week</p>
                  <p className="text-xs text-[#888888]">Streak started</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Journey Steps */}
          <Card className="card-premium">
            <CardContent className="p-5">
              <h3 className="font-semibold text-[#111111] mb-5">Your Journey</h3>
              <div className="space-y-4">
                {[
                  { step: 1, title: "Check in at your gym", desc: "Earn your first badge + 50 coins", active: true },
                  { step: 2, title: "Build your streak", desc: "Check in weekly to grow your streak", active: false },
                  { step: 3, title: "Join challenges", desc: "Compete with others & win rewards", active: false },
                  { step: 4, title: "Top the leaderboard", desc: "Become #1 at your gym", active: false, icon: Crown },
                ].map((item) => (
                  <div key={item.step} className={`flex items-center gap-4 ${!item.active && 'opacity-50'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      item.active ? 'bg-[#0066FF] text-white' : 'bg-[#F0F2F5] text-[#888888]'
                    }`}>
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#111111]">{item.title}</p>
                      <p className="text-sm text-[#888888]">{item.desc}</p>
                    </div>
                    {item.icon ? (
                      <item.icon className="w-5 h-5 text-[#FFD700]" />
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 ${item.active ? 'border-[#0066FF]' : 'border-[#E5E7EB]'}`} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Social Proof */}
          <Card className="card-premium bg-gradient-to-r from-[#E6FFF5] to-white border-[#00C853]/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {['#0066FF', '#00C853', '#FF9500', '#8B5CF6'].map((color, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white font-semibold text-sm shadow-md" style={{ backgroundColor: color }}>
                      {['A', 'B', 'C', 'D'][i]}
                    </div>
                  ))}
                  <div className="w-10 h-10 bg-[#111111] rounded-full border-2 border-white flex items-center justify-center text-white font-semibold text-xs shadow-md">
                    +1K
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#111111]">Join 1,000+ members</p>
                  <p className="text-sm text-[#555555]">Track workouts, compete, level up</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="card-premium cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/gyms')}>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-[#E6F0FF] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-6 h-6 text-[#0066FF]" />
                </div>
                <p className="font-medium text-[#111111] text-sm">Explore Gyms</p>
              </CardContent>
            </Card>
            <Card className="card-premium cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/challenges')}>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-[#FFF8E6] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-[#FFB800]" />
                </div>
                <p className="font-medium text-[#111111] text-sm">Challenges</p>
              </CardContent>
            </Card>
          </div>

          {/* Bottom CTA */}
          <Button
            onClick={() => navigate('/checkin')}
            className="w-full bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:from-[#0052CC] hover:to-[#003D99] text-white font-semibold py-6 rounded-xl text-lg shadow-lg shadow-[#0066FF]/20"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Check In Now
          </Button>
        </div>
      </Layout>
    );
  }

  // Returning user dashboard
  return (
    <Layout user={user}>
      <div className="space-y-6" data-testid="dashboard-page">
        {/* Streak Warning */}
        {progress?.streak_at_risk && (
          <Card className="bg-gradient-to-r from-[#FF3B30] to-[#FF6B35] border-0 overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold">Streak at risk!</p>
                <p className="text-white/80 text-sm truncate">{progress.streak_warning}</p>
              </div>
              <Button
                onClick={() => navigate('/checkin')}
                className="bg-white text-[#FF3B30] hover:bg-white/90 rounded-xl font-semibold shrink-0"
              >
                Save Now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#111111]">{getGreeting()}, {firstName}</h1>
            <p className="text-[#555555]">
              {todayCheckin ? "Great workout today!" : "Ready to crush it?"}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm text-[#888888]">{format(new Date(), "EEEE")}</p>
            <p className="text-lg font-semibold text-[#111111]">{format(new Date(), "MMM d")}</p>
          </div>
        </div>

        {/* Check-in Card */}
        {todayCheckin ? (
          <Card className="card-premium bg-gradient-to-br from-[#E6FFF5] to-white border-[#00C853]/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#00C853] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-[#00C853] font-semibold">Checked in today</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-2xl flex items-center justify-center">
                  {(() => {
                    const WorkoutIcon = workoutIcons[todayCheckin.workout_type] || workoutIcons.default;
                    return <WorkoutIcon className="w-8 h-8 text-white" />;
                  })()}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#111111] text-xl">{todayCheckin.workout_type || "Workout"}</p>
                  <p className="text-[#555555]">{todayCheckin.gym_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-[#111111]">{format(new Date(todayCheckin.checked_in_at), "h:mm")}</p>
                  <p className="text-sm text-[#888888]">{format(new Date(todayCheckin.checked_in_at), "a")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card
            className="overflow-hidden cursor-pointer group"
            onClick={() => navigate('/checkin')}
          >
            <div className="bg-gradient-to-br from-[#0066FF] via-[#0052CC] to-[#003D99] p-6 relative">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full" />
              </div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-xl">Check In</p>
                    <p className="text-white/70 text-sm">{gym?.name || "Select your gym"}</p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={Flame}
            value={dailyStreak}
            suffix="d"
            label="Day Streak"
            color="#FF6B35"
            onClick={() => navigate('/rewards')}
          />
          <StatCard
            icon={Calendar}
            value={user?.total_sessions || 0}
            label="Sessions"
            color="#0066FF"
            onClick={() => navigate('/profile')}
          />
          <StatCard
            icon={TrendingUp}
            value={Math.round(user?.consistency_score || 0)}
            suffix="%"
            label="Consistency"
            color="#00C853"
            onClick={() => navigate('/profile')}
          />
          <StatCard
            icon={Coins}
            value={coinBalance}
            label="Coins"
            color="#FFB800"
            onClick={() => navigate('/rewards')}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Feed - Expandable */}
            <Card className="card-premium overflow-hidden">
              <CardContent className="p-0">
                {/* Header */}
                <div className="flex items-center justify-between p-4 pb-0">
                  <h2 className="font-semibold text-[#111111] text-lg">Activity</h2>
                  <span className="text-[#888888] text-xs">From connections</span>
                </div>

                {feed.length === 0 ? (
                  <div className="text-center py-10 px-4">
                    <div className="w-16 h-16 bg-[#F0F2F5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-[#888888]" />
                    </div>
                    <p className="text-[#111111] font-medium mb-1">No activity yet</p>
                    <p className="text-[#888888] text-sm mb-4">Connect with gym members to see their activity</p>
                    <Button
                      onClick={() => navigate('/connections')}
                      variant="outline"
                      className="border-[#0066FF] text-[#0066FF] hover:bg-[#E6F0FF] rounded-xl"
                    >
                      Find Gym Buddies
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Activity List - Scrollable when expanded */}
                    <div
                      className={`px-4 pt-3 transition-all duration-300 ease-in-out ${
                        activityExpanded
                          ? 'max-h-[50vh] overflow-y-auto'
                          : 'max-h-[280px] overflow-hidden'
                      }`}
                    >
                      <div className="space-y-1">
                        {(activityExpanded ? feed : feed.slice(0, 4)).map((checkin, index) => (
                          <ActivityItem
                            key={checkin.id || index}
                            checkin={checkin}
                            onClick={() => navigate(
                              String(checkin.user_id) === String(user?.user_id) ? '/profile' : `/user/${checkin.user_id}`
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    {feed.length > 4 && (
                      <div className="p-3 pt-2 border-t border-[#F0F2F5] mt-2">
                        <button
                          onClick={() => setActivityExpanded(!activityExpanded)}
                          className="w-full flex items-center justify-center gap-2 py-2 text-[#0066FF] text-sm font-medium hover:bg-[#E6F0FF] active:bg-[#D6E8FF] rounded-xl transition-colors"
                        >
                          {activityExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              Show {feed.length - 4} More
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Your Gym */}
            {gym && (
              <Card
                className="card-premium cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/gym/${user?.primary_gym_id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-2xl flex items-center justify-center">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-[#0066FF] font-medium uppercase tracking-wide">Your Gym</p>
                      <p className="font-bold text-[#111111] text-lg">{gym.name}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#888888]" />
                  </div>
                  {gymActivity && (
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#F0F2F5]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#00C853] rounded-full animate-pulse" />
                        <span className="text-sm text-[#555555]">{gymActivity.display_today_checkins} today</span>
                      </div>
                      <span className="text-sm text-[#888888]">{gymActivity.display_week_checkins} this week</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4">
            {/* Streak Card */}
            <Card className="card-premium">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#888888] mb-1">Day Streak</p>
                    <p className="text-3xl font-bold text-[#111111]">
                      {dailyStreak}
                      <span className="text-lg text-[#888888] ml-1">days</span>
                    </p>
                    {hasStreak && dailyStreak >= (streakData?.longest_streak || 0) && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 text-[#FFB800] fill-current" />
                        <span className="text-sm text-[#FFB800] font-medium">Personal best!</span>
                      </div>
                    )}
                  </div>
                  <StreakRing current={dailyStreak} />
                </div>
              </CardContent>
            </Card>

            {/* Gym Ranking */}
            {leaderboardPos?.user_position && (
              <Card
                className="card-premium cursor-pointer hover:shadow-md transition-all"
                onClick={() => navigate('/leaderboards')}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      leaderboardPos.is_top_3
                        ? 'bg-gradient-to-br from-[#FFD700] to-[#FF9500]'
                        : 'bg-[#F0F2F5]'
                    }`}>
                      {leaderboardPos.is_top_3 ? (
                        <Crown className="w-7 h-7 text-white" />
                      ) : (
                        <span className="text-xl font-bold text-[#555555]">#{leaderboardPos.user_position}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#111111]">
                        {leaderboardPos.is_top_3 ? `#${leaderboardPos.user_position}` : 'Gym Ranking'}
                      </p>
                      {leaderboardPos.to_overtake_next && (
                        <p className="text-sm text-[#0066FF]">
                          {leaderboardPos.to_overtake_next} to move up
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#888888]" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Badge */}
            {progress?.next_badge && (
              <Card
                className="card-premium cursor-pointer hover:shadow-md transition-all"
                onClick={() => navigate('/profile')}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FF9500] rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-[#888888]">Next Badge</p>
                      <p className="font-semibold text-[#111111]">{progress.next_badge.name}</p>
                    </div>
                  </div>
                  <Progress value={progress.next_badge.percentage} className="h-2 mb-2" />
                  <p className="text-xs text-[#0066FF] font-medium">{progress.next_badge.remaining} more to unlock</p>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="card-premium">
              <CardContent className="p-4">
                <h3 className="font-semibold text-[#111111] mb-3">Quick Actions</h3>
                <div className="space-y-1">
                  <QuickAction
                    icon={Target}
                    label="Challenges"
                    sublabel="Join & compete"
                    color="#0066FF"
                    onClick={() => navigate('/challenges')}
                  />
                  <QuickAction
                    icon={Trophy}
                    label="Leaderboards"
                    sublabel="See rankings"
                    color="#FFB800"
                    onClick={() => navigate('/leaderboards')}
                  />
                  <QuickAction
                    icon={Users}
                    label="Connections"
                    sublabel="Find members"
                    color="#00C853"
                    onClick={() => navigate('/connections')}
                  />
                  <QuickAction
                    icon={Gift}
                    label="Rewards"
                    sublabel="Claim rewards"
                    color="#8B5CF6"
                    onClick={() => navigate('/rewards')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Badges Preview */}
            <Card
              className="card-premium cursor-pointer hover:shadow-md transition-all"
              onClick={() => navigate('/profile')}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#111111]">Badges</h3>
                  <span className="text-sm text-[#888888]">{user?.badges?.length || 0}/9</span>
                </div>
                {user?.badges?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.badges.slice(0, 5).map((badge, i) => {
                      const BadgeIcon = badgeIcons[badge] || Award;
                      return (
                        <div
                          key={i}
                          className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-xl flex items-center justify-center"
                        >
                          <BadgeIcon className="w-5 h-5 text-white" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-[#F8F9FA] rounded-xl p-3 text-center">
                    <p className="text-sm text-[#555555]">
                      1 check-in to unlock <span className="text-[#0066FF] font-medium">First Step</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
