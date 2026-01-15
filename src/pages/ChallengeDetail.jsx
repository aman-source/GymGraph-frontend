import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useAuth } from "@/App";
import { toast } from "sonner";
import {
  useCoinBalance,
  useChallengePool,
  useJoinChallengeWithCoins,
  useChallenge,
  useChallengeLeaderboard,
} from "@/hooks";
import {
  Target,
  Coins,
  Users,
  Clock,
  Trophy,
  CheckCircle,
  Building2,
  Calendar,
  ArrowLeft,
  Award,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

export default function ChallengeDetail() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // React Query hooks for data fetching with proper caching
  const { data: challenge, isLoading: challengeLoading, isError: challengeError, refetch: refetchChallenge } = useChallenge(challengeId);
  const { data: leaderboardData, isLoading: leaderboardLoading } = useChallengeLeaderboard(challengeId);
  const { data: coinBalance } = useCoinBalance();
  const { data: poolInfo } = useChallengePool(challengeId);
  const joinChallengeMutation = useJoinChallengeWithCoins();

  const loading = challengeLoading || leaderboardLoading;
  const leaderboard = leaderboardData?.leaderboard || [];
  const hasJoined = challenge?.joined || false;
  const myProgress = challenge?.user_progress?.current_count || 0;

  const handleJoin = async () => {
    // Check coin balance
    const entryFee = poolInfo?.entry_fee || challenge?.entry_fee || 75;
    if ((coinBalance?.balance || 0) < entryFee) {
      toast.error(`Not enough coins! You need ${entryFee} coins, but have ${coinBalance?.balance || 0}`);
      return;
    }

    try {
      const result = await joinChallengeMutation.mutateAsync(challengeId);
      toast.success(result.message);
      // React Query will automatically refetch due to invalidation in the mutation
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to join challenge");
    }
  };

  const getRankDisplay = (rank) => {
    // Speed bonus for fastest completers: 1st +20%, 2nd +10%, 3rd +5% of winners' pool
    if (rank === 1) return { bg: "bg-[#FFD700]", text: "text-white", label: "1", speedBonus: "+20%" };
    if (rank === 2) return { bg: "bg-[#C0C0C0]", text: "text-white", label: "2", speedBonus: "+10%" };
    if (rank === 3) return { bg: "bg-[#CD7F32]", text: "text-white", label: "3", speedBonus: "+5%" };
    return { bg: "bg-[#F0F2F5]", text: "text-[#555555]", label: `${rank}`, speedBonus: null };
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-[#E6F0FF] text-[#0066FF] border-[#0066FF]/20";
      case "active":
        return "bg-[#E6FFF5] text-[#00C853] border-[#00C853]/20";
      case "completed":
        return "bg-[#F0F2F5] text-[#555555] border-[#E5E7EB]";
      default:
        return "bg-[#F0F2F5] text-[#555555] border-[#E5E7EB]";
    }
  };

  const getTierBadge = (tier) => {
    const tiers = {
      small: { label: "Small", color: "bg-green-100 text-green-700", coins: 30 },
      medium: { label: "Medium", color: "bg-blue-100 text-blue-700", coins: 75 },
      big: { label: "Big", color: "bg-purple-100 text-purple-700", coins: 150 },
    };
    return tiers[tier] || tiers.medium;
  };

  if (loading) {
    return (
      <Layout user={user}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 w-32 bg-[#E5E7EB] rounded-lg animate-shimmer" />
          <Card className="card-premium">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-[#F0F2F5] rounded animate-shimmer" />
                  <div className="h-4 w-64 bg-[#F0F2F5] rounded animate-shimmer" />
                </div>
                <div className="h-8 w-24 bg-[#F0F2F5] rounded-lg animate-shimmer" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-[#F0F2F5] rounded-xl animate-shimmer" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-6">
              <div className="h-5 w-32 bg-[#F0F2F5] rounded mb-4 animate-shimmer" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-[#F0F2F5] rounded-xl animate-shimmer" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (challengeError || !challenge) {
    return (
      <Layout user={user}>
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/challenges')}
            className="text-[#555555] hover:text-[#0066FF] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Challenges
          </Button>
          <Card className="card-premium">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-[#FFF0F0] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-[#FF3B30]" />
              </div>
              <h2 className="text-xl font-semibold text-[#111111] mb-2">Challenge Not Found</h2>
              <p className="text-[#555555] mb-6">This challenge may have been removed or doesn't exist.</p>
              <Button onClick={() => refetchChallenge()} className="btn-primary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const daysLeft = challenge?.end_date ? differenceInDays(new Date(challenge.end_date), new Date()) : 0;
  const progressPercent = challenge ? (myProgress / challenge.goal_count) * 100 : 0;
  const entryFee = poolInfo?.entry_fee || challenge?.entry_fee || 75;
  const totalPool = poolInfo?.total_pool || challenge?.total_pool || 0;
  const tierInfo = getTierBadge(poolInfo?.tier || challenge?.coin_tier || "medium");
  const hasEnoughCoins = (coinBalance?.balance || 0) >= entryFee;

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto space-y-6" data-testid="challenge-detail-page">
        <Button
          variant="ghost"
          onClick={() => navigate('/challenges')}
          className="text-[#555555] hover:text-[#0066FF]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Challenges
        </Button>

        {/* Challenge Header */}
        <Card className="card-premium">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-[#111111]">{challenge?.name}</h1>
                  <Badge className={getStatusStyle(challenge?.status)}>
                    {challenge?.status?.charAt(0).toUpperCase() + challenge?.status?.slice(1)}
                  </Badge>
                  <Badge className={tierInfo.color}>
                    {tierInfo.label} Challenge
                  </Badge>
                </div>
                <p className="text-[#555555] mb-4">{challenge?.description}</p>

                {challenge?.gym_name && (
                  <div className="flex items-center gap-2 text-[#555555] mb-4">
                    <Building2 className="w-4 h-4" />
                    <span>{challenge.gym_name}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[#555555]">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={challenge?.creator?.picture} />
                    <AvatarFallback className="bg-[#0066FF] text-white text-xs">
                      {(challenge?.creator?.display_name || 'C').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>Created by {challenge?.creator?.display_name || challenge?.creator?.name}</span>
                </div>
              </div>

              {/* Prize Pool */}
              <div className="bg-gradient-to-br from-[#FFD700]/10 to-[#FFC000]/20 rounded-xl p-6 text-center border border-[#FFD700]/30">
                <Coins className="w-8 h-8 text-[#FFD700] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#111111] mb-1">
                  {totalPool.toLocaleString()}
                </div>
                <p className="text-[#555555]">Total Coin Pool</p>

                {/* How Prizes Work */}
                <div className="mt-4 pt-4 border-t border-[#FFD700]/30 text-left text-sm space-y-2">
                  <p className="text-[#555555] font-medium mb-2">How prizes work:</p>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00C853] mt-0.5 flex-shrink-0" />
                    <span className="text-[#555555]">Complete the goal to keep your entry + win coins</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Trophy className="w-4 h-4 text-[#FFD700] mt-0.5 flex-shrink-0" />
                    <span className="text-[#555555]">Fastest completers get speed bonus</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#FF9500] mt-0.5 flex-shrink-0" />
                    <span className="text-[#555555]">Non-completers lose their entry fee</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-[#FFD700]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Coins className="w-5 h-5 text-[#FFD700]" />
              </div>
              <p className="text-2xl font-bold text-[#111111]">{entryFee}</p>
              <p className="text-[#555555] text-sm">Entry Fee (coins)</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-[#E6F0FF] rounded-xl flex items-center justify-center mx-auto mb-2">
                <Target className="w-5 h-5 text-[#0066FF]" />
              </div>
              <p className="text-2xl font-bold text-[#111111]">{challenge?.goal_count}</p>
              <p className="text-[#555555] text-sm">Check-ins Required</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-[#FFF8E6] rounded-xl flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-[#FF9500]" />
              </div>
              <p className="text-2xl font-bold text-[#111111]">{challenge?.current_participants}/{challenge?.max_participants || '∞'}</p>
              <p className="text-[#555555] text-sm">Participants</p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 bg-[#F0F2F5] rounded-xl flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-[#555555]" />
              </div>
              <p className="text-2xl font-bold text-[#111111]">{daysLeft > 0 ? daysLeft : 0}</p>
              <p className="text-[#555555] text-sm">Days Left</p>
            </CardContent>
          </Card>
        </div>

        {/* My Progress (if joined) */}
        {hasJoined && (
          <Card className="card-premium border-[#0066FF]/30 bg-[#FAFBFF]">
            <CardHeader>
              <CardTitle className="text-[#111111] flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#00C853]" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="text-[#555555]">Progress</span>
                    <span className="text-[#111111] font-medium">{myProgress}/{challenge?.goal_count} check-ins</span>
                  </div>
                  <Progress value={progressPercent} className="h-3" />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#111111]">
                    {progressPercent >= 100 ? (
                      <span className="text-[#00C853]">Complete!</span>
                    ) : (
                      `${Math.round(progressPercent)}%`
                    )}
                  </p>
                </div>
              </div>
              {progressPercent >= 100 && (
                <div className="mt-4 p-4 bg-[#E6FFF5] rounded-xl">
                  <p className="text-[#00C853] text-center font-medium">Congratulations! You've completed the challenge goal!</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Join Button - Only for UPCOMING challenges */}
        {!hasJoined && challenge?.status === 'upcoming' && (
          <Card className={`card-premium ${challenge?.almost_full ? 'border-[#FF9500]/50 bg-[#FF9500]/5' : 'border-[#00C853]/30 bg-[#00C853]/5'}`}>
            <CardContent className="p-6">
              {/* Urgency Banner */}
              {challenge?.spots_left <= 10 && challenge?.spots_left > 0 && (
                <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-[#FF9500]/10 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-[#FF9500]" />
                  <span className="text-[#FF9500] font-bold">Only {challenge.spots_left} spots left!</span>
                </div>
              )}

              {/* Min participants info */}
              {challenge?.min_participants && challenge.current_participants < challenge.min_participants && (
                <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-[#0066FF]/10 rounded-xl">
                  <Users className="w-5 h-5 text-[#0066FF]" />
                  <span className="text-[#0066FF] font-medium">
                    {challenge.current_participants}/{challenge.min_participants} joined - {challenge.min_participants - challenge.current_participants} more needed to start
                  </span>
                </div>
              )}

              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#111111] mb-2">Ready to Compete?</h3>
                  <div className="space-y-2">
                    <p className="text-[#555555] flex items-center gap-2">
                      <Coins className="w-4 h-4 text-[#FFD700]" />
                      Entry fee: <span className="font-bold text-[#111111]">{entryFee} coins</span>
                    </p>
                    <p className="text-[#555555] flex items-center gap-2">
                      <span className="text-[#888888]">Your balance:</span>
                      <span className={`font-bold ${hasEnoughCoins ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}>
                        {coinBalance?.balance || 0} coins
                      </span>
                      {hasEnoughCoins && <span className="text-[#00C853] text-sm">✓ Ready</span>}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center md:items-end gap-3">
                  <Button
                    onClick={handleJoin}
                    disabled={joinChallengeMutation.isPending || !hasEnoughCoins || challenge?.is_full}
                    size="lg"
                    className={`px-10 py-6 text-lg rounded-xl shadow-lg transition-all ${
                      hasEnoughCoins && !challenge?.is_full
                        ? 'bg-gradient-to-r from-[#00C853] to-[#00E676] hover:from-[#00B847] hover:to-[#00D068] text-white'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                    data-testid="join-challenge-button"
                  >
                    <Coins className="w-5 h-5 mr-2" />
                    {joinChallengeMutation.isPending ? "Joining..." : challenge?.is_full ? "Challenge Full" : `Join for ${entryFee} Coins`}
                  </Button>
                  {!hasEnoughCoins && (
                    <div className="flex items-center gap-1 text-[#FF3B30] text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Need {entryFee - (coinBalance?.balance || 0)} more coins</span>
                    </div>
                  )}
                  {hasEnoughCoins && !challenge?.is_full && (
                    <p className="text-[#888888] text-xs">Your coins will be added to the prize pool!</p>
                  )}
                </div>
              </div>

              {/* Prize Distribution Info */}
              <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                <p className="text-[#888888] text-sm mb-3">How prizes work:</p>
                <div className="space-y-3 text-sm">
                  {/* Winners section */}
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#00C853] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#111111] font-medium">Complete the challenge = Win!</p>
                      <p className="text-[#555555]">Keep your entry fee + earn share of losers' pool</p>
                    </div>
                  </div>

                  {/* Speed bonus section */}
                  <div className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#111111] font-medium">Speed Bonus (fastest completers)</p>
                      <div className="flex flex-wrap gap-3 mt-1">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-5 h-5 bg-[#FFD700] rounded text-white text-xs font-bold flex items-center justify-center">1</span>
                          <span className="text-[#555555]">+20%</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <span className="w-5 h-5 bg-[#C0C0C0] rounded text-white text-xs font-bold flex items-center justify-center">2</span>
                          <span className="text-[#555555]">+10%</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <span className="w-5 h-5 bg-[#CD7F32] rounded text-white text-xs font-bold flex items-center justify-center">3</span>
                          <span className="text-[#555555]">+5%</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Losers section */}
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#FF3B30] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#111111] font-medium">Don't complete = Lose entry fee</p>
                      <p className="text-[#555555]">Your coins go to winners (90%) + platform (10%)</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message for active challenges user didn't join */}
        {!hasJoined && challenge?.status === 'active' && (
          <Card className="card-premium border-[#FF9800]/30 bg-gradient-to-r from-[#FF9800]/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FF9800]/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#FF9800]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#111111]">Challenge In Progress</h3>
                  <p className="text-[#555555]">
                    This challenge has already started. You can no longer join, but you can watch the leaderboard below!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message for completed challenges user didn't join */}
        {!hasJoined && challenge?.status === 'completed' && (
          <Card className="card-premium border-[#888888]/30 bg-gradient-to-r from-[#888888]/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#888888]/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-[#888888]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#111111]">Challenge Ended</h3>
                  <p className="text-[#555555]">
                    This challenge has finished. Check out the final results in the leaderboard below!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-[#111111] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#FFD700]" />
              Challenge Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 bg-[#F0F2F5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-[#888888]" />
                </div>
                <p className="text-[#555555] font-medium">No participants yet</p>
                <p className="text-[#888888] text-sm mt-1">Be the first to join!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => {
                  const rankStyle = getRankDisplay(entry.rank);
                  return (
                    <Link
                      key={entry.user_id || index}
                      to={`/user/${entry.user_id}`}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-[#F8F9FA] ${
                        entry.rank <= 3 ? 'bg-[#FAFBFF]' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 ${rankStyle.bg} rounded-lg flex items-center justify-center ${rankStyle.text} font-bold text-sm`}>
                        {rankStyle.label}
                      </div>
                      <Avatar className="h-10 w-10 border border-[#E5E7EB]">
                        <AvatarImage src={entry.picture} />
                        <AvatarFallback className="bg-[#0066FF] text-white font-semibold">
                          {(entry.display_name || entry.name || 'U').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-[#111111] font-medium">
                          {entry.display_name || entry.name}
                          {entry.user_id === user?.id && (
                            <span className="ml-2 text-[#0066FF] text-sm">(You)</span>
                          )}
                        </p>
                        {entry.completed && (
                          <span className="text-[#00C853] text-sm flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Completed
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#111111]">{entry.current_count}</p>
                        <p className="text-[#888888] text-sm">/{challenge?.goal_count}</p>
                      </div>
                      {entry.coins_won > 0 && (
                        <div className="text-right ml-4">
                          <p className="text-[#00C853] font-semibold">+{entry.coins_won}</p>
                          <p className="text-[#888888] text-xs">coins won</p>
                        </div>
                      )}
                      {rankStyle.speedBonus && entry.completed && !poolInfo?.distributed && (
                        <div className="text-right ml-4">
                          <p className="text-[#FFD700] font-semibold">{rankStyle.speedBonus}</p>
                          <p className="text-[#888888] text-xs">speed bonus</p>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Challenge Details */}
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="text-[#111111]">Challenge Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#888888]" />
                <div>
                  <p className="text-[#888888] text-sm">Start Date</p>
                  <p className="text-[#111111]">{challenge?.start_date ? format(new Date(challenge.start_date), "MMMM d, yyyy") : '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#888888]" />
                <div>
                  <p className="text-[#888888] text-sm">End Date</p>
                  <p className="text-[#111111]">{challenge?.end_date ? format(new Date(challenge.end_date), "MMMM d, yyyy") : '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#888888]" />
                <div>
                  <p className="text-[#888888] text-sm">Min/Max Participants</p>
                  <p className="text-[#111111]">{challenge?.min_participants} - {challenge?.max_participants || 'Unlimited'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-[#888888]" />
                <div>
                  <p className="text-[#888888] text-sm">Scope</p>
                  <p className="text-[#111111] capitalize">{challenge?.scope}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
