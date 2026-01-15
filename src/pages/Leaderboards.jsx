import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout";
import { useAuth } from "@/App";
import { useGym, useGymLeaderboard, useLeaderboardPosition, useGymVsGym, useConnectionsLeaderboard, useCityLeaderboard } from "@/hooks";
import {
  Trophy,
  Zap,
  TrendingUp,
  MapPin,
  Users,
  Search,
  Award,
  Gift,
  Clock,
  ChevronRight,
  Medal,
  Building2
} from "lucide-react";

// Helper function for rank display
const getRankDisplay = (rank) => {
  if (rank === 1) return { bg: "bg-gradient-to-r from-[#FFD700] to-[#FFC000]", text: "text-white", label: "1", icon: <Trophy className="w-4 h-4" /> };
  if (rank === 2) return { bg: "bg-gradient-to-r from-[#C0C0C0] to-[#A8A8A8]", text: "text-white", label: "2", icon: <Medal className="w-4 h-4" /> };
  if (rank === 3) return { bg: "bg-gradient-to-r from-[#CD7F32] to-[#B87333]", text: "text-white", label: "3", icon: <Medal className="w-4 h-4" /> };
  return { bg: "bg-[#F0F2F5]", text: "text-[#555555]", label: `${rank}`, icon: null };
};

// Reward amounts by leaderboard type
const LEADERBOARD_REWARDS = {
  gym: { first: 50, second: 30, third: 20 },
  city: { first: 100, second: 75, third: 50 },
  connections: { first: 0, second: 0, third: 0 } // No rewards for connections
};

// Leaderboard Entry Component - moved outside to prevent re-renders
const LeaderboardEntry = ({ entry, metric, metricLabel, currentUserId, leaderboardType = 'city' }) => {
  const rankStyle = getRankDisplay(entry.rank);
  const isCurrentUser = entry.user_id === currentUserId;
  const rewards = LEADERBOARD_REWARDS[leaderboardType] || LEADERBOARD_REWARDS.city;

  const getRewardText = () => {
    if (rewards.first === 0) return null; // No rewards for this type
    if (entry.rank === 1) return `Gold + ${rewards.first} coins`;
    if (entry.rank === 2) return `Silver + ${rewards.second} coins`;
    if (entry.rank === 3) return `Bronze + ${rewards.third} coins`;
    return null;
  };

  const rewardText = getRewardText();

  return (
    <Link
      to={`/user/${entry.user_id}`}
      className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all hover:bg-[#F8F9FA] card-interactive ${
        entry.rank <= 3 ? 'bg-[#FAFBFF]' : ''
      } ${isCurrentUser ? 'ring-2 ring-[#0066FF]/30' : ''}`}
    >
      <div className={`w-8 h-8 sm:w-10 sm:h-10 ${rankStyle.bg} rounded-lg flex items-center justify-center ${rankStyle.text} font-bold text-xs sm:text-sm shadow-sm flex-shrink-0`}>
        {rankStyle.icon || rankStyle.label}
      </div>
      <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border border-[#E5E7EB] flex-shrink-0">
        <AvatarImage src={entry.picture} className="rounded-full" />
        <AvatarFallback className="bg-[#0066FF] text-white font-semibold rounded-full text-xs sm:text-sm">
          {(entry.display_name || entry.name || 'U').charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-[#111111] font-medium text-sm sm:text-base truncate">
          {entry.display_name || entry.name}
          {isCurrentUser && (
            <span className="ml-1 sm:ml-2 text-[#0066FF] text-xs font-semibold">(You)</span>
          )}
        </p>
        {rewardText && (
          <p className="text-[#00C853] text-[10px] sm:text-xs font-medium">
            {rewardText}
          </p>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-lg sm:text-xl font-bold text-[#111111]">{metric}</p>
        <p className="text-[#888888] text-xs sm:text-sm">{metricLabel}</p>
      </div>
    </Link>
  );
};

export default function Leaderboards() {
  const { user } = useAuth();

  // Use cached hooks for all leaderboard data (no duplicate API calls)
  const { data: gym } = useGym(user?.primary_gym_id);
  const { data: gymLeaderboardData, isLoading: gymLoading } = useGymLeaderboard(user?.primary_gym_id);
  const { data: leaderboardPos } = useLeaderboardPosition(user?.primary_gym_id);
  const { data: gymVsGym } = useGymVsGym();
  const { data: connectionsData, isLoading: connectionsLoading } = useConnectionsLeaderboard();

  // City search state - searchedCity is what triggers the query
  const [cityInput, setCityInput] = useState("");
  const [searchedCity, setSearchedCity] = useState("");

  // City leaderboard with React Query (cached, no duplicate calls)
  const { data: cityData, isLoading: cityLoading } = useCityLeaderboard(searchedCity);

  // Derive data from cached hooks
  const gymLeaderboard = gymLeaderboardData?.leaderboard || [];
  const connectionsLeaderboard = connectionsData?.leaderboard || [];
  const cityLeaderboard = cityData?.leaderboard || [];
  const gymName = gym?.name || "";
  const city = gym?.city || "";
  const loading = gymLoading || connectionsLoading;

  // Search city - updates searchedCity which triggers the hook
  const searchCity = (cityToSearch) => {
    const searchTerm = cityToSearch || cityInput;
    if (!searchTerm) return;
    setSearchedCity(searchTerm);
  };

  if (loading) {
    return (
      <Layout user={user}>
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="space-y-2">
            <div className="h-8 w-40 bg-[#E5E7EB] rounded-lg animate-shimmer" />
            <div className="h-4 w-56 bg-[#E5E7EB] rounded animate-shimmer" />
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 animate-shimmer">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#F0F2F5] rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 bg-[#F0F2F5] rounded" />
                <div className="h-4 w-48 bg-[#F0F2F5] rounded" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-1 animate-shimmer">
            <div className="h-10 bg-[#F0F2F5] rounded-lg" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E5E7EB] p-4 animate-shimmer">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#F0F2F5] rounded-lg" />
                  <div className="w-10 h-10 bg-[#F0F2F5] rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-[#F0F2F5] rounded" />
                    <div className="h-3 w-24 bg-[#F0F2F5] rounded" />
                  </div>
                  <div className="h-6 w-16 bg-[#F0F2F5] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto space-y-6" data-testid="leaderboards-page">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111]">Leaderboards</h1>
          <p className="text-[#555555] mt-1">Compete, climb, and win rewards</p>
        </div>

        {/* Your Position Card */}
        {leaderboardPos && (
          <Card className="card-premium border-[#0066FF]/20 bg-gradient-to-r from-[#FAFBFF] to-[#F0F4FF]">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg ${
                    leaderboardPos.is_top_3 ? 'bg-gradient-to-r from-[#FFD700] to-[#FFC000] text-white' :
                    leaderboardPos.is_top_10 ? 'bg-[#0066FF] text-white' :
                    'bg-[#F0F2F5] text-[#555555]'
                  }`}>
                    #{leaderboardPos.user_position}
                  </div>
                  <div>
                    <p className="text-[#111111] font-semibold text-lg">Your Position at {gymName}</p>
                    <p className="text-[#555555]">{leaderboardPos.user_checkins} check-ins total</p>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2">
                  {leaderboardPos.to_overtake_next && (
                    <div className="bg-[#0066FF] text-white px-4 py-2 rounded-xl text-sm font-medium">
                      {leaderboardPos.to_overtake_next} more to reach #{leaderboardPos.user_position - 1}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[#888888]">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Resets in {leaderboardPos.days_until_reset} days</span>
                  </div>
                </div>
              </div>

              {/* Progress to Top 3 */}
              {!leaderboardPos.is_top_3 && leaderboardPos.top_3?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                  <p className="text-[#555555] text-sm mb-2">Distance to Top 3:</p>
                  <div className="flex items-center gap-4">
                    <Progress
                      value={(leaderboardPos.user_checkins / leaderboardPos.top_3[2]?.checkin_count) * 100 || 0}
                      className="flex-1 h-2"
                    />
                    <span className="text-[#0066FF] font-medium text-sm">
                      {Math.max(0, (leaderboardPos.top_3[2]?.checkin_count || 0) - leaderboardPos.user_checkins + 1)} to #3
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Rewards Info */}
        <Card className="card-premium border-[#FFD700]/30 bg-gradient-to-r from-[#FFFEF5] to-[#FFF8E6]">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#FFD700] rounded-xl flex items-center justify-center flex-shrink-0">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[#111111] font-semibold mb-1">Monthly Leaderboard Rewards</p>
                <div className="text-[#555555] text-sm space-y-1">
                  <p><span className="font-medium">Gym:</span> Top 3 get 50/30/20 coins</p>
                  <p><span className="font-medium">City:</span> Top 50 get coins (100/75/50 for top 3, 25 for 4-10, 10 for 11-50)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="gym" className="w-full">
          <TabsList className="bg-[#F0F2F5] border border-[#E5E7EB] w-full grid grid-cols-4 p-1 rounded-xl">
            <TabsTrigger value="gym" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-[#555555] data-[state=active]:text-[#111111]">
              <MapPin className="w-4 h-4 mr-2" />
              Gym
            </TabsTrigger>
            <TabsTrigger value="connections" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-[#555555] data-[state=active]:text-[#111111]">
              <Users className="w-4 h-4 mr-2" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="gym-vs-gym" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-[#555555] data-[state=active]:text-[#111111]">
              <Building2 className="w-4 h-4 mr-2" />
              Gyms
            </TabsTrigger>
            <TabsTrigger value="city" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-[#555555] data-[state=active]:text-[#111111]">
              <TrendingUp className="w-4 h-4 mr-2" />
              City
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gym" className="mt-4">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-[#111111] flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#FFD700]" />
                  {gymName || "Your Gym"} Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gymLeaderboard.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 bg-[#F0F2F5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-7 h-7 text-[#888888]" />
                    </div>
                    <p className="text-[#555555] font-medium">No leaderboard data yet</p>
                    <p className="text-[#888888] text-sm mt-1">Start checking in to appear on the leaderboard</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {gymLeaderboard.map((entry) => (
                      <LeaderboardEntry
                        key={entry.user_id}
                        entry={entry}
                        metric={entry.checkin_count}
                        metricLabel="check-ins"
                        currentUserId={user?.user_id}
                        leaderboardType="gym"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections" className="mt-4">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-[#111111] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#0066FF]" />
                  Connections by Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                {connectionsLeaderboard.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 bg-[#F0F2F5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-7 h-7 text-[#888888]" />
                    </div>
                    <p className="text-[#555555] font-medium">No connections yet</p>
                    <p className="text-[#888888] text-sm mt-1">Connect with gym members to compete!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {connectionsLeaderboard.map((entry) => (
                      <LeaderboardEntry
                        key={entry.user_id}
                        entry={entry}
                        metric={entry.current_streak || 0}
                        metricLabel="week streak"
                        currentUserId={user?.user_id}
                        leaderboardType="connections"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gym-vs-gym" className="mt-4">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-[#111111] flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#0066FF]" />
                  Gym vs Gym - This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!gymVsGym || gymVsGym.leaderboard?.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 bg-[#F0F2F5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-7 h-7 text-[#888888]" />
                    </div>
                    <p className="text-[#555555] font-medium">No gym data yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {gymVsGym.leaderboard.map((gym) => (
                      <div
                        key={gym.id}
                        className={`flex items-center gap-4 p-4 rounded-xl ${
                          gym.is_user_gym ? 'bg-[#E6F0FF] ring-2 ring-[#0066FF]/30' : 'bg-[#F8F9FA]'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                          gym.rank === 1 ? 'bg-[#FFD700] text-white' :
                          gym.rank === 2 ? 'bg-[#C0C0C0] text-white' :
                          gym.rank === 3 ? 'bg-[#CD7F32] text-white' :
                          'bg-[#E5E7EB] text-[#555555]'
                        }`}>
                          #{gym.rank}
                        </div>
                        <div className="flex-1">
                          <p className="text-[#111111] font-medium">
                            {gym.gym_name}
                            {gym.is_user_gym && <span className="text-[#0066FF] ml-2 text-sm">(Your Gym)</span>}
                          </p>
                          <p className="text-[#555555] text-sm">{gym.city}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-[#111111]">{gym.week_checkins}</p>
                          <p className="text-[#888888] text-sm">{gym.active_members} active</p>
                        </div>
                      </div>
                    ))}
                    {gymVsGym.user_gym_rank && gymVsGym.user_gym_rank > 3 && (
                      <p className="text-center text-[#0066FF] font-medium">
                        Your gym is #{gymVsGym.user_gym_rank} in the city!
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="city" className="mt-4">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-[#111111] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#00C853]" />
                  City Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-6">
                  <Input
                    placeholder="Enter city name..."
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    className="bg-[#F8F9FA] border-[#E5E7EB] text-[#111111] rounded-xl"
                    onKeyDown={(e) => e.key === 'Enter' && searchCity()}
                  />
                  <Button
                    onClick={() => searchCity()}
                    disabled={cityLoading}
                    className="bg-[#0066FF] hover:bg-[#0052CC] rounded-xl"
                  >
                    {cityLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {cityLeaderboard.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 bg-[#F0F2F5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-7 h-7 text-[#888888]" />
                    </div>
                    <p className="text-[#555555] font-medium">
                      {cityLoading ? "Searching..." : "Search for a city to see the leaderboard"}
                    </p>
                    {city && !searchedCity && (
                      <Button
                        onClick={() => {
                          setCityInput(city);
                          searchCity(city);
                        }}
                        variant="outline"
                        className="mt-4 border-[#E5E7EB] text-[#555555] hover:border-[#0066FF] hover:text-[#0066FF] rounded-xl"
                      >
                        Search {city}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cityLeaderboard.map((entry) => (
                      <LeaderboardEntry
                        key={entry.user_id}
                        entry={entry}
                        metric={`${Math.round(entry.consistency_score || 0)}%`}
                        metricLabel="consistency"
                        currentUserId={user?.user_id}
                        leaderboardType="city"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
