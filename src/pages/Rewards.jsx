import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout";
import ShareModal from "@/components/ShareModal";
import { useAuth } from "@/App";
import { toast } from "sonner";
import {
  useCoinSummary,
  useCoinTransactions,
  useStreak,
  useReferral,
  useEconomyInfo,
  useFreezeStreak,
  useRestoreStreak,
  useClaimProfileBonus,
} from "@/hooks";
import {
  Coins,
  Trophy,
  Flame,
  Zap,
  ShoppingBag,
  Clock,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Snowflake,
  RotateCcw,
  Gift,
  UserPlus,
  Target,
  Award,
  Lock,
  TrendingUp,
  MapPin,
  Share2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
  Shirt,
  Dumbbell,
  Rocket,
  Headphones,
  Pill,
  GiftIcon,
  Weight,
  Package,
  FlaskConical,
} from "lucide-react";
import { format } from "date-fns";

export default function Rewards() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [earnExpanded, setEarnExpanded] = useState(false);

  // Fetch data using React Query hooks
  const { data: summary, isLoading: summaryLoading } = useCoinSummary();
  const { data: streak, isLoading: streakLoading } = useStreak();
  const { data: referral } = useReferral();
  const { data: economyInfo } = useEconomyInfo();
  const { data: transactionsData } = useCoinTransactions(20);

  // Mutations
  const freezeStreak = useFreezeStreak();
  const restoreStreak = useRestoreStreak();
  const claimProfileBonus = useClaimProfileBonus();

  const isLoading = summaryLoading || streakLoading;

  const copyReferralCode = async () => {
    if (referral?.referral_code) {
      await navigator.clipboard.writeText(referral.referral_code);
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFreezeStreak = async () => {
    try {
      const result = await freezeStreak.mutateAsync();
      toast.success(result.message);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to freeze streak");
    }
  };

  const handleRestoreStreak = async () => {
    try {
      const result = await restoreStreak.mutateAsync();
      toast.success(result.message);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to restore streak");
    }
  };

  const handleClaimProfileBonus = async () => {
    try {
      const result = await claimProfileBonus.mutateAsync();
      toast.success(result.message);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to claim bonus");
    }
  };

  // Get streak tier info
  const getStreakTierInfo = (days) => {
    if (days >= 100) return { tier: "crown", icon: Crown, color: "from-yellow-400 to-yellow-600", name: "Legend" };
    if (days >= 30) return { tier: "lightning", icon: Zap, color: "from-purple-500 to-purple-700", name: "Lightning" };
    if (days >= 7) return { tier: "double_fire", icon: Flame, color: "from-orange-500 to-red-600", name: "On Fire" };
    if (days >= 1) return { tier: "fire", icon: Flame, color: "from-orange-400 to-orange-600", name: "Starting" };
    return { tier: "none", icon: null, color: "from-slate-500 to-slate-600", name: "Get Started" };
  };

  const tierInfo = getStreakTierInfo(streak?.current_streak || 0);

  // Check if streak freeze is currently active
  const isFreezeActive = streak?.streak_frozen_until &&
    new Date(streak.streak_frozen_until) >= new Date(new Date().toDateString());

  // Calculate progress to next tier
  const getNextTierProgress = (days) => {
    if (days >= 100) return { next: null, progress: 100, remaining: 0 };
    if (days >= 30) return { next: 100, progress: ((days - 30) / 70) * 100, remaining: 100 - days };
    if (days >= 7) return { next: 30, progress: ((days - 7) / 23) * 100, remaining: 30 - days };
    return { next: 7, progress: (days / 7) * 100, remaining: 7 - days };
  };

  const nextTier = getNextTierProgress(streak?.current_streak || 0);

  if (isLoading) {
    return (
      <Layout user={user}>
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-fade-in px-1">
          <div className="space-y-2">
            <div className="h-7 sm:h-8 w-40 sm:w-48 bg-[#E5E7EB] rounded-lg animate-shimmer" />
            <div className="h-4 w-52 sm:w-64 bg-[#E5E7EB] rounded animate-shimmer" />
          </div>
          {/* Coin Balance Skeleton */}
          <div className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFC000]/10 rounded-2xl border border-[#FFD700]/20 p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FFD700]/20 rounded-2xl animate-shimmer" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-24 bg-[#FFD700]/20 rounded animate-shimmer" />
                <div className="h-10 w-20 bg-[#FFD700]/20 rounded animate-shimmer" />
              </div>
            </div>
          </div>
          {/* Streak Skeleton */}
          <div className="bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-2xl animate-shimmer" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-24 bg-white/20 rounded animate-shimmer" />
                <div className="h-10 w-32 bg-white/20 rounded animate-shimmer" />
              </div>
            </div>
          </div>
          {/* Other sections skeleton */}
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 animate-shimmer">
              <div className="h-6 w-32 bg-[#F0F2F5] rounded mb-4" />
              <div className="h-24 bg-[#F0F2F5] rounded-xl" />
            </div>
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-fade-in" data-testid="rewards-page">
        {/* Header */}
        <div className="animate-stagger">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#111111]">Coins & Rewards</h1>
          <p className="text-[#555555] text-sm sm:text-base mt-0.5 sm:mt-1">Earn coins through check-ins, streaks, and challenges</p>
        </div>

        {/* Coin Balance Card */}
        <Card className="card-premium bg-gradient-to-br from-[#FFD700]/15 via-[#FFC000]/10 to-[#FF9500]/5 border-[#FFD700]/30 overflow-hidden relative animate-stagger">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FFC000]/10 rounded-full blur-2xl -ml-12 -mb-12" />
          <CardContent className="p-4 sm:p-6 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#FFD700] to-[#FF9500] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FFD700]/30 animate-fire-glow">
                  <Coins className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <p className="text-[#888888] text-xs sm:text-sm font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Your Balance
                  </p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl sm:text-4xl font-bold text-[#111111] animate-count">{summary?.balance || 0}</p>
                    <span className="text-[#888888] text-sm sm:text-base font-medium">coins</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 sm:gap-6 w-full sm:w-auto">
                <div className="flex-1 sm:flex-none sm:text-right bg-[#E6FFF5]/50 sm:bg-transparent rounded-xl p-2 sm:p-0">
                  <p className="text-[#555555] text-xs sm:text-sm">Earned</p>
                  <p className="text-[#00C853] font-bold text-lg sm:text-xl flex items-center sm:justify-end gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    {summary?.total_earned || 0}
                  </p>
                </div>
                <div className="flex-1 sm:flex-none sm:text-right bg-[#FFF5F0]/50 sm:bg-transparent rounded-xl p-2 sm:p-0">
                  <p className="text-[#555555] text-xs sm:text-sm">Spent</p>
                  <p className="text-[#FF9500] font-bold text-lg sm:text-xl flex items-center sm:justify-end gap-1">
                    <ArrowDownRight className="w-4 h-4" />
                    {summary?.total_spent || 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card className={`card-premium bg-gradient-to-br ${tierInfo.color} text-white overflow-hidden relative animate-stagger`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <CardContent className="p-4 sm:p-6 relative">
            {/* Main Streak Display */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  {tierInfo.icon ? <tierInfo.icon className="w-7 h-7 sm:w-8 sm:h-8" /> : <Flame className="w-7 h-7 sm:w-8 sm:h-8" />}
                </div>
                {isFreezeActive && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center border-2 border-white/30">
                    <Snowflake className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-white/80 text-xs sm:text-sm font-medium">Current Streak</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl sm:text-4xl font-bold animate-count">{streak?.current_streak || 0}</p>
                  <span className="text-white/80 text-sm sm:text-base font-medium">days</span>
                  <Badge className="bg-white/20 text-white border-0 text-xs ml-1">{tierInfo.name}</Badge>
                </div>
              </div>
            </div>

            {/* Progress to next tier */}
            {nextTier.next && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex justify-between text-xs sm:text-sm mb-2">
                  <span className="text-white/80">{nextTier.remaining} days to next tier</span>
                  <span className="text-white font-semibold">{nextTier.next}-day milestone</span>
                </div>
                <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${nextTier.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Streak Actions */}
            <div className="mt-4 pt-4 border-t border-white/20">
              {isFreezeActive ? (
                /* Frozen State - Show status prominently */
                <div className="flex items-center justify-between p-3 bg-cyan-500/20 backdrop-blur-sm rounded-xl border border-cyan-300/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-400/30 rounded-xl flex items-center justify-center">
                      <Snowflake className="w-5 h-5 text-cyan-100" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Streak Protected</p>
                      <p className="text-cyan-100 text-xs">
                        Until {(() => { try { return format(new Date(streak.streak_frozen_until), "MMM d"); } catch { return 'tomorrow'; } })()}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-cyan-400/30 text-cyan-100 border-0 text-xs">Active</Badge>
                </div>
              ) : (
                /* Normal State - Show freeze/restore options */
                <div className="flex flex-col sm:flex-row gap-2">
                  {streak?.can_restore && (
                    <Button
                      onClick={handleRestoreStreak}
                      disabled={restoreStreak.isPending}
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white rounded-xl border-0 tap-scale text-sm h-11"
                    >
                      <RotateCcw className={`w-4 h-4 mr-2 ${restoreStreak.isPending ? 'animate-spin' : ''}`} />
                      <span className="flex-1">Restore Streak</span>
                      <span className="text-white/70 text-xs ml-2">{streak?.restore_cost} coins</span>
                    </Button>
                  )}
                  <Button
                    onClick={handleFreezeStreak}
                    disabled={freezeStreak.isPending}
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white rounded-xl border-0 tap-scale text-sm h-11"
                  >
                    <Snowflake className={`w-4 h-4 mr-2 ${freezeStreak.isPending ? 'animate-spin' : ''}`} />
                    <span className="flex-1">Freeze Streak</span>
                    <span className="text-white/70 text-xs ml-2">
                      {streak?.free_freeze_available ? "Free" : `${streak?.freeze_cost ?? 50} coins`}
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* How to Earn Coins - Collapsible */}
        <Card className="card-premium animate-stagger overflow-hidden">
          <CardContent className="p-0">
            {/* Compact Header - Always Visible */}
            <button
              onClick={() => setEarnExpanded(!earnExpanded)}
              className="w-full p-4 sm:px-6 flex items-center justify-between hover:bg-[#F8F9FA] transition-colors tap-scale"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00C853] to-[#00E676] rounded-xl flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-[#111111] font-bold text-sm sm:text-base">Earn More Coins</h3>
                  <p className="text-[#888888] text-xs">Check-ins, streaks, challenges & more</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-[#888888] transition-transform duration-300 ${earnExpanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Quick Earn Summary - Always Visible */}
            <div className="px-4 sm:px-6 pb-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { icon: Target, label: "Check-in", coins: economyInfo?.earning?.daily_checkin?.amount || 10, color: "from-[#0066FF] to-[#4D8DFF]" },
                  { icon: Flame, label: "7-day", coins: economyInfo?.earning?.streak_7_days?.amount || 50, color: "from-[#FF6B00] to-[#FF9500]" },
                  { icon: Zap, label: "30-day", coins: economyInfo?.earning?.streak_30_days?.amount || 200, color: "from-[#9B59B6] to-[#8E44AD]" },
                  { icon: Trophy, label: "Challenge", coins: "Win", color: "from-[#FFD700] to-[#FFC000]" },
                  { icon: UserPlus, label: "Referral", coins: economyInfo?.earning?.referral?.amount || 100, color: "from-[#00C853] to-[#00E676]" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB] hover:border-[#0066FF]/30 transition-all"
                  >
                    <div className={`w-7 h-7 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                      <item.icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-[#555555] text-[10px] leading-tight">{item.label}</p>
                      <p className="text-[#00C853] text-xs font-bold">+{item.coins}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Profile Bonus CTA - Always visible if not claimed */}
              {!summary?.profile_bonus_claimed && (
                <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#0066FF]/5 to-[#0066FF]/10 border border-[#0066FF]/20">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#0066FF]" />
                    <span className="text-[#111111] text-sm font-medium">Complete Profile</span>
                    <span className="text-[#00C853] text-sm font-bold">+{economyInfo?.earning?.profile_completion?.amount || 50}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleClaimProfileBonus}
                    disabled={claimProfileBonus.isPending}
                    className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg tap-scale text-xs h-8 px-3 font-semibold"
                  >
                    {claimProfileBonus.isPending ? '...' : 'Claim'}
                  </Button>
                </div>
              )}
            </div>

            {/* Expanded Content */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${earnExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="px-4 sm:px-6 pb-4 border-t border-[#E5E7EB]">
                <div className="pt-4 grid sm:grid-cols-2 gap-4">
                  {/* Daily Actions */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#111111] text-xs flex items-center gap-2 uppercase tracking-wide">
                      <MapPin className="w-3.5 h-3.5 text-[#0066FF]" />
                      Daily
                    </h4>
                    <EarnItem icon={<Target />} title="Check-in at Gym" coins={economyInfo?.earning?.daily_checkin?.amount || 10} />
                  </div>

                  {/* Streak Bonuses */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#111111] text-xs flex items-center gap-2 uppercase tracking-wide">
                      <Flame className="w-3.5 h-3.5 text-[#FF6B00]" />
                      Streaks
                    </h4>
                    <EarnItem
                      icon={<Flame className="w-4 h-4" />}
                      title="7-Day Streak"
                      coins={economyInfo?.earning?.streak_7_days?.amount || 50}
                      claimed={streak?.tier_bonuses?.["7_day_claimed"]}
                    />
                    <EarnItem
                      icon={<Zap className="w-4 h-4" />}
                      title="30-Day Streak"
                      coins={economyInfo?.earning?.streak_30_days?.amount || 200}
                      claimed={streak?.tier_bonuses?.["30_day_claimed"]}
                    />
                    <EarnItem
                      icon={<Crown className="w-4 h-4" />}
                      title="100-Day Streak"
                      coins={economyInfo?.earning?.streak_100_days?.amount || 1000}
                      claimed={streak?.tier_bonuses?.["100_day_claimed"]}
                    />
                  </div>

                  {/* One-time Bonuses */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#111111] text-xs flex items-center gap-2 uppercase tracking-wide">
                      <Gift className="w-3.5 h-3.5 text-[#9B59B6]" />
                      Bonuses
                    </h4>
                    <EarnItem
                      icon={<Sparkles />}
                      title="Welcome Bonus"
                      coins={economyInfo?.earning?.signup_bonus?.amount || 100}
                      claimed={summary?.signup_bonus_claimed}
                    />
                    <EarnItem
                      icon={<Award />}
                      title="Complete Profile"
                      coins={economyInfo?.earning?.profile_completion?.amount || 50}
                      claimed={summary?.profile_bonus_claimed}
                    />
                    <EarnItem
                      icon={<UserPlus />}
                      title="Refer a Friend"
                      coins={economyInfo?.earning?.referral?.amount || 100}
                    />
                  </div>

                  {/* Challenges */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#111111] text-xs flex items-center gap-2 uppercase tracking-wide">
                      <Trophy className="w-3.5 h-3.5 text-[#FFD700]" />
                      Challenges
                    </h4>
                    <EarnItem icon={<Trophy />} title="Win 1st Place" coins="40%" highlight />
                    <EarnItem icon={<Trophy />} title="Win 2nd Place" coins="20%" />
                    <EarnItem icon={<Trophy />} title="Win 3rd Place" coins="10%" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex gap-2">
                  <Button
                    onClick={() => navigate('/challenges')}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-[#E5E7EB] text-[#555555] hover:border-[#0066FF] hover:text-[#0066FF] hover:bg-[#FAFBFF] rounded-xl tap-scale text-xs"
                  >
                    <Trophy className="w-3.5 h-3.5 mr-1.5" />
                    Challenges
                  </Button>
                  <Button
                    onClick={() => setEarnExpanded(false)}
                    variant="ghost"
                    size="sm"
                    className="text-[#888888] hover:text-[#555555] rounded-xl text-xs"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Card */}
        <Card className="card-premium border-[#0066FF]/20 bg-gradient-to-br from-[#FAFBFF] to-[#F0F4FF] overflow-hidden relative animate-stagger">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0066FF]/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <CardContent className="p-4 sm:p-6 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0066FF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0066FF]/20">
                  <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <p className="text-[#111111] font-semibold text-base sm:text-lg">Invite Friends</p>
                  <p className="text-[#555555] text-xs sm:text-sm">You both get <span className="text-[#00C853] font-semibold">{economyInfo?.earning?.referral?.amount || 100} coins</span></p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex-1 sm:flex-none px-4 sm:px-5 py-3 bg-white rounded-2xl border-2 border-[#E5E7EB] font-mono text-base sm:text-lg font-bold text-[#111111] text-center shadow-sm">
                  {referral?.referral_code || "--------"}
                </div>
                <Button
                  onClick={copyReferralCode}
                  variant="outline"
                  size="sm"
                  className={`rounded-xl tap-scale h-11 w-11 p-0 border-2 transition-all ${
                    copied
                      ? 'bg-[#00C853] border-[#00C853] text-white shadow-md'
                      : 'border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white hover:shadow-md'
                  }`}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
                <Button
                  onClick={() => setShareModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="border-2 border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white rounded-xl tap-scale h-11 px-4 transition-all hover:shadow-md"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            {referral?.total_referrals > 0 ? (
              <div className="mt-5 pt-5 border-t border-[#E5E7EB]/50 flex gap-3 sm:gap-4">
                <div className="flex-1 bg-white rounded-2xl p-4 text-center border border-[#E5E7EB]">
                  <p className="text-[#888888] text-xs sm:text-sm mb-1">Total Referrals</p>
                  <p className="text-[#111111] font-bold text-xl sm:text-2xl">{referral.total_referrals}</p>
                </div>
                <div className="flex-1 bg-gradient-to-br from-[#E6FFF5] to-white rounded-2xl p-4 text-center border border-[#00C853]/20">
                  <p className="text-[#888888] text-xs sm:text-sm mb-1">Coins Earned</p>
                  <p className="text-[#00C853] font-bold text-xl sm:text-2xl">+{referral.total_earnings}</p>
                </div>
              </div>
            ) : (
              <div className="mt-5 pt-5 border-t border-[#E5E7EB]/50">
                <p className="text-[#555555] text-sm text-center">Share your code and earn coins when friends sign up</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Store Coming Soon - Hype Section */}
        <Card className="card-premium overflow-hidden animate-stagger border-0 bg-transparent shadow-none">
          <CardContent className="p-0">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] p-6 sm:p-8 rounded-t-2xl overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#0066FF]/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-[#9B59B6]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 right-10 w-24 h-24 bg-[#FFD700]/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-0 left-10 w-20 h-20 bg-[#00C853]/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />
                {/* Floating particles effect */}
                <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-[#FFD700]/60 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
                <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-[#0066FF]/50 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '1s' }} />
              </div>

              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FF9500]/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-[#FFD700]/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD700]"></span>
                  </span>
                  <span className="text-[#FFD700] text-xs sm:text-sm font-semibold tracking-wide">COMING SOON</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
                  Rewards Store
                </h2>
                <p className="text-white/60 text-sm sm:text-base max-w-md mx-auto mb-6">
                  Your workout rewards are about to get real
                </p>

                {/* Coin Stack Display */}
                <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#FF9500] rounded-xl flex items-center justify-center shadow-lg shadow-[#FFD700]/30">
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00C853] rounded-full flex items-center justify-center">
                      <TrendingUp className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-white/50 text-xs">Your Stash</p>
                    <p className="text-white font-bold text-xl sm:text-2xl">{summary?.balance || 0} <span className="text-white/50 text-sm font-normal">coins</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Categories Preview */}
            <div className="p-4 sm:p-6 bg-gradient-to-b from-[#16213e] via-[#1a1a2e]/50 to-white rounded-b-2xl">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="text-white/70 text-xs sm:text-sm font-semibold tracking-widest px-3">SNEAK PEEK</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Energy Drinks */}
                <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-white to-[#FFF5F5] border-2 border-[#FF6B6B]/20 hover:border-[#FF6B6B]/50 hover:shadow-xl hover:shadow-[#FF6B6B]/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-4 h-4 text-[#FF6B6B] animate-pulse" />
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#FF6B6B]/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-[#111111] font-bold text-base sm:text-lg mb-1">Energy Drinks</h3>
                  <p className="text-[#555555] text-xs sm:text-sm leading-relaxed">
                    Pre-workout energy boosters to fuel your sessions
                  </p>
                  <div className="mt-3 pt-3 border-t border-[#FF6B6B]/10">
                    <span className="text-[#FF6B6B] text-xs font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3" /> High Demand
                    </span>
                  </div>
                </div>

                {/* Protein Powders */}
                <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-white to-[#F8F5FF] border-2 border-[#9B59B6]/20 hover:border-[#9B59B6]/50 hover:shadow-xl hover:shadow-[#9B59B6]/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-4 h-4 text-[#9B59B6] animate-pulse" />
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#9B59B6] to-[#8E44AD] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#9B59B6]/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Dumbbell className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-[#111111] font-bold text-base sm:text-lg mb-1">Protein Powders</h3>
                  <p className="text-[#555555] text-xs sm:text-sm leading-relaxed">
                    Premium whey, isolate & plant-based proteins
                  </p>
                  <div className="mt-3 pt-3 border-t border-[#9B59B6]/10">
                    <span className="text-[#9B59B6] text-xs font-semibold flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> Fan Favorite
                    </span>
                  </div>
                </div>

                {/* Apparel */}
                <div className="group relative p-5 rounded-2xl bg-gradient-to-br from-white to-[#F0FFF4] border-2 border-[#00C853]/20 hover:border-[#00C853]/50 hover:shadow-xl hover:shadow-[#00C853]/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-4 h-4 text-[#00C853] animate-pulse" />
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#00C853] to-[#00E676] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#00C853]/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Shirt className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-[#111111] font-bold text-base sm:text-lg mb-1">Gym Apparel</h3>
                  <p className="text-[#555555] text-xs sm:text-sm leading-relaxed">
                    T-shirts, tanks, shorts & workout gear
                  </p>
                  <div className="mt-3 pt-3 border-t border-[#00C853]/10">
                    <span className="text-[#00C853] text-xs font-semibold flex items-center gap-1">
                      <Shirt className="w-3 h-3" /> Exclusive Drops
                    </span>
                  </div>
                </div>
              </div>

              {/* More Categories Teaser */}
              <div className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                {[
                  { icon: Headphones, label: "Accessories", color: "text-[#0066FF]", bg: "bg-[#0066FF]/10" },
                  { icon: Pill, label: "Supplements", color: "text-[#FF6B6B]", bg: "bg-[#FF6B6B]/10" },
                  { icon: FlaskConical, label: "Shakers", color: "text-[#00C853]", bg: "bg-[#00C853]/10" },
                  { icon: GiftIcon, label: "Gift Cards", color: "text-[#9B59B6]", bg: "bg-[#9B59B6]/10" },
                  { icon: Weight, label: "Equipment", color: "text-[#FF9500]", bg: "bg-[#FF9500]/10" },
                  { icon: Package, label: "& More", color: "text-[#555555]", bg: "bg-[#555555]/10" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group flex flex-col items-center p-3 sm:p-4 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#0066FF]/30 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className="text-[#555555] text-[10px] sm:text-xs font-medium text-center">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFD700]/10 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#0066FF]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left flex-1">
                    <div className="inline-flex items-center gap-2 mb-2">
                      <Rocket className="w-5 h-5 text-[#FFD700]" />
                      <h3 className="text-white font-bold text-lg sm:text-xl">Stack Now, Redeem Later</h3>
                    </div>
                    <p className="text-white/50 text-xs sm:text-sm max-w-sm">
                      Every check-in brings you closer to real rewards. The grind pays off.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                    <div className="text-center">
                      <p className="text-[#FFD700] font-bold text-2xl">{summary?.balance || 0}</p>
                      <p className="text-white/40 text-xs">coins ready</p>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="text-center">
                      <p className="text-[#00C853] font-bold text-2xl">{streak?.current_streak || 0}</p>
                      <p className="text-white/40 text-xs">day streak</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="card-premium animate-stagger">
          <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-[#111111] flex items-center gap-2 text-base sm:text-lg">
              <div className="w-8 h-8 bg-[#F0F2F5] rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#888888]" />
              </div>
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            {transactionsData?.transactions?.length > 0 ? (
              <div className="space-y-3">
                {transactionsData.transactions.slice(0, 10).map((txn, index) => (
                  <div
                    key={txn.id || index}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#F8F9FA] to-white border border-[#E5E7EB] hover:border-[#0066FF]/30 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        txn.amount > 0 ? 'bg-[#E6FFF5]' : 'bg-[#FFF5F0]'
                      }`}>
                        {txn.amount > 0 ? (
                          <ArrowUpRight className="w-5 h-5 text-[#00C853]" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-[#FF9500]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[#111111] font-semibold text-sm sm:text-base capitalize truncate">
                          {txn.type?.replace(/_/g, ' ')}
                        </p>
                        <p className="text-[#888888] text-xs sm:text-sm truncate">
                          {txn.reason || (txn.created_at ? format(new Date(txn.created_at), "MMM d 'at' h:mm a") : '')}
                        </p>
                      </div>
                    </div>
                    <div className={`font-bold text-lg sm:text-xl flex-shrink-0 ml-2 ${
                      txn.amount > 0 ? 'text-[#00C853]' : 'text-[#FF9500]'
                    }`}>
                      {txn.amount > 0 ? '+' : ''}{txn.amount}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 sm:py-14">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#F0F2F5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-[#888888]" />
                </div>
                <p className="text-[#333333] font-semibold text-base sm:text-lg">No transactions yet</p>
                <p className="text-[#888888] text-sm mt-1">Check in at the gym to earn your first coins</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Share Modal */}
      <ShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        referralCode={referral?.referral_code}
        coinsReward={economyInfo?.earning?.referral?.amount || 100}
      />
    </Layout>
  );
}

// Helper component for earn items
function EarnItem({ icon, title, coins, claimed, highlight }) {
  return (
    <div className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 ${
      highlight
        ? 'bg-gradient-to-r from-[#FFF8E6] to-[#FFFBF0] border-[#FFD700]/40 hover:border-[#FFD700]/60 hover:shadow-sm'
        : 'bg-gradient-to-r from-[#FAFBFF] to-white border-[#E5E7EB] hover:border-[#0066FF]/40 hover:shadow-sm'
    }`}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          highlight ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'bg-[#0066FF]/10 text-[#0066FF]'
        }`}>
          {icon}
        </div>
        <p className="text-[#111111] font-semibold text-sm sm:text-base">{title}</p>
      </div>
      {claimed ? (
        <Badge className="bg-[#E6FFF5] text-[#00C853] border-0 text-xs sm:text-sm px-3 py-1 rounded-full font-medium">Claimed</Badge>
      ) : (
        <p className="text-[#00C853] font-bold text-base sm:text-lg">+{coins}</p>
      )}
    </div>
  );
}
