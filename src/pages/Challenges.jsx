import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { useAuth } from "@/App";
import { useChallenges, useCoinBalance } from "@/hooks";
import {
  Target,
  Users,
  Coins,
  Trophy,
  Clock,
  ChevronRight,
  Building2,
  Flame,
  AlertCircle,
  RefreshCw,
  Zap,
  TrendingUp,
  Timer,
  CheckCircle,
  UserPlus
} from "lucide-react";
import { format, differenceInDays, differenceInHours } from "date-fns";

// Countdown Timer Component - creates urgency
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Show appropriate units based on time remaining
  if (timeLeft.days > 0) {
    return (
      <span className="font-mono font-bold">
        {timeLeft.days}d {timeLeft.hours}h
      </span>
    );
  }
  if (timeLeft.hours > 0) {
    return (
      <span className="font-mono font-bold text-[#FF9500]">
        {timeLeft.hours}h {timeLeft.minutes}m
      </span>
    );
  }
  if (timeLeft.minutes > 0) {
    return (
      <span className="font-mono font-bold text-[#FF3B30] animate-pulse">
        {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
    );
  }
  return (
    <span className="font-mono font-bold text-[#FF3B30] animate-pulse">
      {timeLeft.seconds}s
    </span>
  );
};

// Challenge Card with psychology-driven design
const ChallengeCard = ({ challenge, onClick, coinBalance }) => {
  const hasPool = challenge.total_pool > 0;
  const maxParticipants = challenge.max_participants ?? 100;
  const currentParticipants = challenge.current_participants ?? 0;
  const spotsLeft = challenge.spots_left ?? (maxParticipants - currentParticipants);
  const isAlmostFull = spotsLeft <= 5 && spotsLeft > 0;
  const isFull = spotsLeft <= 0;
  const isUpcoming = challenge.status === 'upcoming';
  const isActive = challenge.status === 'active';
  const hasJoined = challenge.joined;
  const canAfford = (coinBalance || 0) >= (challenge.entry_fee ?? 0);
  const fillPercentage = challenge.fill_percentage ?? (maxParticipants > 0 ? Math.round((currentParticipants / maxParticipants) * 100) : 0);
  const minParticipants = challenge.min_participants || 5;
  const needsMore = minParticipants - currentParticipants;

  // Days until challenge starts
  const daysUntilStart = differenceInDays(new Date(challenge.start_date), new Date());
  const hoursUntilStart = differenceInHours(new Date(challenge.start_date), new Date());

  // Days left in active challenge
  const daysLeft = differenceInDays(new Date(challenge.end_date), new Date());

  // Urgency messaging - spots and participants focused (countdown timer handles time)
  const getUrgencyMessage = () => {
    if (isFull) return { text: "SPOTS FILLED", color: "text-[#FF3B30]", bg: "bg-[#FF3B30]/10" };
    if (isAlmostFull) return { text: `Only ${spotsLeft} spots left!`, color: "text-[#FF9500]", bg: "bg-[#FF9500]/10" };
    if (isUpcoming && currentParticipants >= 3) {
      return { text: `${currentParticipants} joined - ${needsMore > 0 ? needsMore + ' more needed' : 'Ready to start!'}`, color: "text-[#00C853]", bg: "bg-[#00C853]/10" };
    }
    return null;
  };

  const urgency = getUrgencyMessage();

  return (
    <Card
      data-testid={`challenge-card-${challenge.id}`}
      className={`card-premium transition-all cursor-pointer group card-interactive ${
        hasJoined ? 'border-[#00C853]/30 ring-1 ring-[#00C853]/20' : 'hover:border-[#0066FF]/30'
      } ${isFull && !hasJoined ? 'opacity-60' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Header with Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {hasJoined && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-[#00C853]/10 text-[#00C853] rounded-full text-xs font-bold">
                    <CheckCircle className="w-3 h-3" />
                    JOINED
                  </span>
                )}
                {isUpcoming && !hasJoined && hoursUntilStart > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-[#0066FF]/10 text-[#0066FF] rounded-full text-xs font-medium">
                    <Timer className="w-3 h-3" />
                    Starts in <CountdownTimer targetDate={challenge.start_date} />
                  </span>
                )}
                {isActive && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-[#00C853]/10 text-[#00C853] rounded-full text-xs font-bold animate-pulse">
                    <Flame className="w-3 h-3" />
                    LIVE
                  </span>
                )}
                <h3 className="text-base sm:text-lg font-bold text-[#111111] group-hover:text-[#0066FF] transition-colors">
                  {challenge.name}
                </h3>
              </div>
              <p className="text-[#555555] text-xs sm:text-sm line-clamp-2">{challenge.description}</p>
            </div>

            {/* Prize Pool */}
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1 justify-end">
                <Coins className="w-5 h-5 text-[#FFD700]" />
                <span className={`text-xl sm:text-2xl font-bold ${hasPool ? 'text-[#FFD700]' : 'text-[#888888]'}`}>
                  {hasPool ? challenge.total_pool.toLocaleString() : "0"}
                </span>
              </div>
              <p className="text-[#888888] text-xs">
                {hasPool ? "Prize Pool" : "Grows as people join"}
              </p>
            </div>
          </div>

          {/* Urgency Banner */}
          {urgency && (
            <div className={`flex items-center gap-2 px-3 py-2 ${urgency.bg} rounded-lg`}>
              <Zap className={`w-4 h-4 ${urgency.color}`} />
              <span className={`text-sm font-semibold ${urgency.color}`}>{urgency.text}</span>
            </div>
          )}

          {/* Progress Bar - Shows how many joined */}
          {isUpcoming && currentParticipants > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#555555]">
                  <UserPlus className="w-3 h-3 inline mr-1" />
                  {currentParticipants} of {minParticipants} min needed
                </span>
                <span className="text-[#888888]">{spotsLeft} spots left</span>
              </div>
              <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0066FF] to-[#00C853] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((currentParticipants / minParticipants) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 py-2">
            <div className="flex items-center gap-1.5 text-[#555555]">
              <Coins className="w-4 h-4 text-[#FFD700]" />
              <span className="text-xs sm:text-sm font-medium">{challenge.entry_fee} coins</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#555555]">
              <Target className="w-4 h-4 text-[#0066FF]" />
              <span className="text-xs sm:text-sm">{challenge.goal_count} check-ins</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#555555]">
              <Users className="w-4 h-4 text-[#FF9500]" />
              <span className="text-xs sm:text-sm">
                {currentParticipants}/{maxParticipants}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#555555]">
              <Clock className="w-4 h-4 text-[#888888]" />
              <span className="text-xs sm:text-sm">
                {isUpcoming ? `${challenge.goal_count} day challenge` : `${daysLeft}d left`}
              </span>
            </div>
          </div>

          {/* CTA Row */}
          <div className="flex items-center justify-between pt-2 border-t border-[#EEEEEE]">
            {hasJoined ? (
              <Badge className="bg-[#00C853]/10 text-[#00C853] border-[#00C853]/20">
                <Trophy className="w-3 h-3 mr-1" />
                {isActive ? "Track Progress" : "Waiting to Start"}
              </Badge>
            ) : isFull ? (
              <Badge className="bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]/20">
                Challenge Full
              </Badge>
            ) : !canAfford ? (
              <span className="text-[#FF9500] text-xs">Need {challenge.entry_fee - (coinBalance || 0)} more coins</span>
            ) : (
              <span className="text-[#00C853] text-xs font-medium flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Ready to join for {challenge.entry_fee} coins
              </span>
            )}
            <div className="flex items-center gap-2">
              <span className="text-[#0066FF] text-sm font-medium group-hover:underline">
                {hasJoined ? "View Details" : "Join Now"}
              </span>
              <ChevronRight className="w-5 h-5 text-[#888888] group-hover:text-[#0066FF] transition-colors" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Challenges() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: challengesData, isLoading: loading, isError, refetch } = useChallenges();
  const { data: coinData } = useCoinBalance();
  const coinBalance = coinData?.balance || 0;

  // Separate challenges by type
  const { upcomingChallenges, myActiveChallenges, gymChallenges, totalPotentialPool } = useMemo(() => {
    const allChallenges = challengesData?.challenges || [];
    const now = new Date();
    const platform = allChallenges.filter(c => !c.gym_id);
    const gymAll = allChallenges.filter(c => c.gym_id);

    // Upcoming = can join (only show if start date hasn't passed yet)
    // Filter out challenges whose start_date has passed - they should be processed soon
    const upcoming = platform.filter(c => {
      if (c.status !== 'upcoming') return false;
      // If start date has passed, don't show (will be processed to active/cancelled)
      if (c.start_date && new Date(c.start_date) <= now) return false;
      return true;
    });

    // My Active = challenges user joined that are running
    const myActive = platform.filter(c => c.status === 'active' && c.joined);

    // Gym challenges: only show upcoming ones user can join, or active ones they joined
    const gym = gymAll.filter(c => {
      // Show upcoming gym challenges (that haven't started yet)
      if (c.status === 'upcoming') {
        if (c.start_date && new Date(c.start_date) <= now) return false;
        return true;
      }
      // Show active gym challenges only if user joined
      if (c.status === 'active') {
        return c.joined;
      }
      return false;
    });

    return {
      upcomingChallenges: upcoming,
      myActiveChallenges: myActive,
      gymChallenges: gym,
      totalPotentialPool: upcoming.reduce((sum, c) => sum + (c.entry_fee * c.max_participants), 0)
    };
  }, [challengesData]);

  if (loading) {
    return (
      <Layout user={user}>
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <div className="h-8 w-40 bg-[#E5E7EB] rounded-lg animate-shimmer" />
              <div className="h-4 w-64 bg-[#E5E7EB] rounded animate-shimmer" />
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 animate-shimmer">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="h-5 w-48 bg-[#F0F2F5] rounded" />
                    <div className="h-4 w-64 bg-[#F0F2F5] rounded" />
                  </div>
                  <div className="h-8 w-24 bg-[#FFD700]/20 rounded-lg" />
                </div>
                <div className="h-2 bg-[#F0F2F5] rounded-full mb-3" />
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout user={user}>
        <div className="max-w-4xl mx-auto">
          <Card className="card-premium">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-[#FFF0F0] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-[#FF3B30]" />
              </div>
              <h2 className="text-xl font-semibold text-[#111111] mb-2">Failed to Load Challenges</h2>
              <p className="text-[#555555] mb-6">Something went wrong. Please try again.</p>
              <Button onClick={() => refetch()} className="btn-primary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto space-y-6" data-testid="challenges-page">
        {/* Hero Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111]">Challenges</h1>
            <p className="text-[#555555] mt-1">Join challenges, compete, win coins!</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/30">
              <Coins className="w-5 h-5 text-[#FFD700]" />
              <span className="font-bold text-[#111111]">{coinBalance}</span>
              <span className="text-[#888888] text-sm">coins</span>
            </div>
            <Button
              onClick={() => navigate('/my-challenges')}
              variant="outline"
              className="border-[#E5E7EB] text-[#555555] hover:border-[#0066FF] hover:text-[#0066FF] rounded-xl"
            >
              <Trophy className="w-4 h-4 mr-2" />
              My Challenges
            </Button>
          </div>
        </div>


        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="bg-[#F0F2F5] border border-[#E5E7EB] w-full grid grid-cols-2 p-1 rounded-xl">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-[#555555] data-[state=active]:text-[#111111]">
              <UserPlus className="w-4 h-4 mr-2" />
              Join ({upcomingChallenges.length})
            </TabsTrigger>
            <TabsTrigger value="gym" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-[#555555] data-[state=active]:text-[#111111]">
              <Building2 className="w-4 h-4 mr-2" />
              Gym ({gymChallenges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4 space-y-6">
            {/* My Active Challenges Section */}
            {myActiveChallenges.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#00C853]" />
                  <h2 className="text-lg font-bold text-[#111111]">Your Active Challenges</h2>
                  <Badge className="bg-[#00C853]/10 text-[#00C853] text-xs">
                    {myActiveChallenges.length} running
                  </Badge>
                </div>
                {myActiveChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onClick={() => navigate(`/challenge/${challenge.id}`)}
                    coinBalance={coinBalance}
                  />
                ))}
              </div>
            )}

            {/* Upcoming Challenges Section */}
            {upcomingChallenges.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-[#0066FF]" />
                  <h2 className="text-lg font-bold text-[#111111]">Join Now</h2>
                  <Badge className="bg-[#0066FF]/10 text-[#0066FF] text-xs">
                    {upcomingChallenges.length} open
                  </Badge>
                </div>
                {upcomingChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onClick={() => navigate(`/challenge/${challenge.id}`)}
                    coinBalance={coinBalance}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {upcomingChallenges.length === 0 && myActiveChallenges.length === 0 && (
              <Card className="card-premium">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-[#E6F0FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-[#0066FF]" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#111111] mb-2">No Challenges Available</h2>
                  <p className="text-[#555555] mb-6">New challenges are coming soon! Check back later.</p>
                  <Button
                    onClick={() => navigate('/my-challenges')}
                    variant="outline"
                    className="border-[#E5E7EB] hover:border-[#0066FF] hover:text-[#0066FF] rounded-xl"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    View Past Challenges
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="gym" className="mt-4 space-y-4">
            {gymChallenges.length === 0 ? (
              <Card className="card-premium">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-[#F3E8FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-[#7C3AED]" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#111111] mb-2">No Gym Challenges</h2>
                  <p className="text-[#555555] mb-6">Gym-specific challenges will appear here when available.</p>
                  <Button
                    onClick={() => navigate('/gyms')}
                    variant="outline"
                    className="border-[#E5E7EB] hover:border-[#7C3AED] hover:text-[#7C3AED] rounded-xl"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Browse Gyms
                  </Button>
                </CardContent>
              </Card>
            ) : (
              gymChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onClick={() => navigate(`/challenge/${challenge.id}`)}
                  coinBalance={coinBalance}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
