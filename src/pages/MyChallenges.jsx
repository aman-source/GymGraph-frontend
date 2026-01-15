import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { SkeletonChallengeCard } from "@/components/PageLoader";
import { useAuth } from "@/App";
import { useMyChallenges } from "@/hooks";
import {
  Target,
  Trophy,
  Coins,
  Clock,
  ChevronRight,
  CheckCircle,
  Flame,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { differenceInDays } from "date-fns";

// Challenge Card Component - moved outside to prevent re-renders
const ChallengeCard = ({ challenge, onClick }) => {
  const progressPercent = challenge.goal_count > 0
    ? (challenge.my_progress / challenge.goal_count) * 100
    : 0;
  const daysLeft = differenceInDays(new Date(challenge.end_date), new Date());
  const isCompleted = challenge.completed;
  const isWon = challenge.won;

  const getStatusStyle = (status, completed, won) => {
    if (won) return "bg-[#FFD700]/10 text-[#B8860B] border-[#FFD700]/30";
    if (completed) return "bg-[#E6FFF5] text-[#00C853] border-[#00C853]/20";
    switch (status) {
      case "upcoming":
        return "bg-[#E6F0FF] text-[#0066FF] border-[#0066FF]/20";
      case "active":
        return "bg-[#FFF8E6] text-[#FF9500] border-[#FF9500]/20";
      case "completed":
        return "bg-[#F0F2F5] text-[#555555] border-[#E5E7EB]";
      default:
        return "bg-[#F0F2F5] text-[#555555] border-[#E5E7EB]";
    }
  };

  return (
    <Card
      className={`card-premium hover:border-[#0066FF]/30 transition-all cursor-pointer group ${
        isWon ? 'ring-2 ring-[#FFD700]/30' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <h3 className="text-lg font-semibold text-[#111111] group-hover:text-[#0066FF] transition-colors">
                {challenge.name}
              </h3>
              <Badge className={`${getStatusStyle(challenge.status, isCompleted, isWon)} border rounded-lg px-2 py-0.5`}>
                {isWon ? (
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Won!
                  </span>
                ) : isCompleted ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </span>
                ) : challenge.status === "active" ? (
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    Active
                  </span>
                ) : (
                  challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)
                )}
              </Badge>
            </div>

            {/* Progress section */}
            <div className="mt-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-[#555555] text-sm">Your Progress</span>
                <span className="text-[#111111] font-semibold text-sm">
                  {challenge.my_progress || 0}/{challenge.goal_count} check-ins
                </span>
              </div>
              <div className="relative h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-gradient-to-r from-[#00C853] to-[#00E676]' : 'bg-gradient-to-r from-[#0066FF] to-[#00C853]'
                  }`}
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
              {progressPercent >= 100 && !isCompleted && (
                <p className="text-[#00C853] text-xs mt-1 font-medium">Goal reached! Keep going for bonus points.</p>
              )}
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1.5 text-[#555555]">
                <Coins className="w-4 h-4 text-[#FFD700]" />
                <span className="text-sm">Pool: {(challenge.total_pool || 0).toLocaleString()} coins</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#555555]">
                <Clock className="w-4 h-4 text-[#888888]" />
                <span className="text-sm">
                  {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? "Ends today" : "Ended"}
                </span>
              </div>
              {challenge.entry_fee > 0 && (
                <div className="flex items-center gap-1.5 text-[#555555]">
                  <Target className="w-4 h-4 text-[#0066FF]" />
                  <span className="text-sm">{challenge.entry_fee} coins entry</span>
                </div>
              )}
            </div>
          </div>

          {/* Right side - progress percentage */}
          <div className="flex items-center gap-4 md:flex-col md:items-end">
            <div className="text-center md:text-right">
              <div className={`text-3xl font-bold ${
                isWon ? 'text-[#FFD700]' : progressPercent >= 100 ? 'text-[#00C853]' : 'text-[#111111]'
              }`}>
                {isWon ? (
                  <Trophy className="w-8 h-8" />
                ) : (
                  `${Math.round(progressPercent)}%`
                )}
              </div>
              <p className="text-[#888888] text-sm">
                {isWon ? "Winner!" : "Progress"}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#888888] group-hover:text-[#0066FF] transition-colors hidden md:block" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function MyChallenges() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  // Use React Query hook for proper caching and refetching
  const { data: challengesData, isLoading: loading, isError, refetch } = useMyChallenges();
  const challenges = challengesData?.challenges || [];

  // Filter challenges based on tab using useMemo
  const filteredChallenges = useMemo(() => {
    if (!challenges.length) return [];

    switch (activeTab) {
      case "active":
        return challenges.filter(c => c.status === "active" && !c.completed);
      case "upcoming":
        return challenges.filter(c => c.status === "upcoming");
      case "completed":
        return challenges.filter(c => c.completed || c.status === "completed");
      case "won":
        return challenges.filter(c => c.won === true);
      default:
        return challenges;
    }
  }, [challenges, activeTab]);

  // Stats summary
  const stats = {
    total: challenges.length,
    active: challenges.filter(c => c.status === "active" && !c.completed).length,
    completed: challenges.filter(c => c.completed).length,
    won: challenges.filter(c => c.won === true).length
  };

  if (loading) {
    return (
      <Layout user={user}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 w-48 bg-[#E5E7EB] rounded-lg animate-pulse" />
              <div className="h-4 w-64 bg-[#E5E7EB] rounded-lg animate-pulse mt-2" />
            </div>
          </div>
          <div className="space-y-4">
            <SkeletonChallengeCard />
            <SkeletonChallengeCard />
            <SkeletonChallengeCard />
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
              <div className="w-16 h-16 bg-[#FF3B30]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-[#FF3B30]" />
              </div>
              <h2 className="text-xl font-semibold text-[#111111] mb-2">Failed to Load Your Challenges</h2>
              <p className="text-[#555555] mb-6">
                We couldn't load your challenges. Please check your connection and try again.
              </p>
              <Button
                onClick={() => refetch()}
                className="bg-[#0066FF] hover:bg-[#0052CC] rounded-xl"
              >
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
      <div className="max-w-4xl mx-auto space-y-6" data-testid="my-challenges-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111]">My Challenges</h1>
            <p className="text-[#555555] mt-1">Track your challenge progress and victories</p>
          </div>
          <Button
            onClick={() => navigate('/challenges')}
            className="bg-[#0066FF] hover:bg-[#0052CC] rounded-xl"
          >
            <Target className="w-4 h-4 mr-2" />
            Browse Challenges
          </Button>
        </div>

        {/* Stats Summary */}
        {challenges.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="card-premium p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E6F0FF] flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#0066FF]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#111111]">{stats.total}</p>
                  <p className="text-xs text-[#888888]">Total Joined</p>
                </div>
              </div>
            </Card>
            <Card className="card-premium p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF8E6] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[#FF9500]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#111111]">{stats.active}</p>
                  <p className="text-xs text-[#888888]">Active</p>
                </div>
              </div>
            </Card>
            <Card className="card-premium p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E6FFF5] flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#00C853]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#111111]">{stats.completed}</p>
                  <p className="text-xs text-[#888888]">Completed</p>
                </div>
              </div>
            </Card>
            <Card className="card-premium p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-[#B8860B]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#111111]">{stats.won}</p>
                  <p className="text-xs text-[#888888]">Won</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tabs for filtering */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            <TabsList className="bg-[#F0F2F5] border border-[#E5E7EB] inline-flex sm:w-full sm:grid sm:grid-cols-5 p-1 rounded-xl min-w-max sm:min-w-0">
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-[#555555] data-[state=active]:text-[#111111] text-sm px-4 sm:px-2">
                All
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-[#555555] data-[state=active]:text-[#111111] text-sm px-4 sm:px-2">
                Active
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-[#555555] data-[state=active]:text-[#111111] text-sm px-4 sm:px-2">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-[#555555] data-[state=active]:text-[#111111] text-sm px-4 sm:px-2">
                Done
              </TabsTrigger>
              <TabsTrigger value="won" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-[#555555] data-[state=active]:text-[#111111] text-sm px-4 sm:px-2">
                <Trophy className="w-3 h-3 mr-1" />
                Won
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-4 space-y-4">
            {filteredChallenges.length === 0 ? (
              <Card className="card-premium">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-[#F0F2F5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {activeTab === "won" ? (
                      <Trophy className="w-8 h-8 text-[#888888]" />
                    ) : activeTab === "active" ? (
                      <Flame className="w-8 h-8 text-[#888888]" />
                    ) : (
                      <Target className="w-8 h-8 text-[#888888]" />
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-[#111111] mb-2">
                    {activeTab === "all" ? "No Challenges Joined" :
                     activeTab === "won" ? "No Victories Yet" :
                     activeTab === "active" ? "No Active Challenges" :
                     activeTab === "upcoming" ? "No Upcoming Challenges" :
                     "No Completed Challenges"}
                  </h2>
                  <p className="text-[#555555] mb-4">
                    {activeTab === "all"
                      ? "Start competing in challenges to track your progress here"
                      : activeTab === "won"
                      ? "Keep pushing! Your first victory is waiting"
                      : "Browse available challenges and join one"}
                  </p>
                  <Button
                    onClick={() => navigate('/challenges')}
                    className="bg-[#0066FF] hover:bg-[#0052CC] rounded-xl"
                  >
                    Browse Challenges
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id || challenge.challenge_id}
                  challenge={challenge}
                  onClick={() => navigate(`/challenge/${challenge.id || challenge.challenge_id}`)}
                />
              ))
            )}
          </div>
        </Tabs>
      </div>
    </Layout>
  );
}
