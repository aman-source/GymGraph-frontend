import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { useAuth } from "@/App";
import { useGym, useGymLeaderboard, useGymMembers, useGymActivity } from "@/hooks";
import {
  Building2,
  MapPin,
  Users,
  Trophy,
  CheckCircle,
  Settings,
  Zap,
  ExternalLink,
  Navigation,
  Calendar,
  TrendingUp,
  Clock,
  ChevronRight,
  Flame,
  Crown
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Generate Google Maps URL for directions
const getGoogleMapsUrl = (gym) => {
  if (gym?.latitude && gym?.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${gym.latitude},${gym.longitude}`;
  }
  const query = encodeURIComponent(`${gym?.name}, ${gym?.address}, ${gym?.city}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

// Extract concise location from address
const getConciseLocation = (gym) => {
  const address = gym?.address || "";
  const city = gym?.city || "";
  if (address) {
    const parts = address.split(",").map(p => p.trim());
    if (parts.length >= 2) {
      const area = parts[parts.length - 2] || parts[0];
      if (area.toLowerCase() !== city.toLowerCase()) {
        return `${area}, ${city}`;
      }
    }
  }
  return city;
};

// Podium component for top 3
const Podium = ({ leaderboard, currentUserId }) => {
  if (leaderboard.length < 3) return null;

  const top3 = leaderboard.slice(0, 3);
  const [first, second, third] = [top3[0], top3[1], top3[2]];

  return (
    <div className="flex items-end justify-center gap-2 mb-6 pt-4">
      {/* 2nd Place */}
      <div className="flex flex-col items-center">
        <Link to={`/user/${second?.user_id}`} className="group">
          <Avatar className="h-14 w-14 border-2 border-[#C0C0C0] group-hover:scale-105 transition-transform">
            <AvatarImage src={second?.picture} />
            <AvatarFallback className="bg-[#C0C0C0] text-white font-bold">
              {(second?.display_name || second?.name || 'U').charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="bg-gradient-to-t from-[#C0C0C0] to-[#E8E8E8] w-20 h-16 rounded-t-lg mt-2 flex flex-col items-center justify-center">
          <span className="text-white font-bold text-lg">2</span>
          <span className="text-white/80 text-xs">{second?.checkin_count}</span>
        </div>
        <p className="text-xs text-[#555555] mt-1 truncate w-20 text-center">
          {second?.display_name || second?.name}
          {second?.user_id === currentUserId && <span className="text-[#0066FF]"> (You)</span>}
        </p>
      </div>

      {/* 1st Place */}
      <div className="flex flex-col items-center -mt-4">
        <div className="relative">
          <Link to={`/user/${first?.user_id}`} className="group">
            <Avatar className="h-18 w-18 border-3 border-[#FFD700] group-hover:scale-105 transition-transform" style={{width: '72px', height: '72px'}}>
              <AvatarImage src={first?.picture} />
              <AvatarFallback className="bg-[#FFD700] text-white font-bold text-xl">
                {(first?.display_name || first?.name || 'U').charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="absolute -top-2 -right-1 w-6 h-6 bg-gradient-to-br from-[#FFD700] to-[#FF9500] rounded-full flex items-center justify-center shadow">
            <Crown className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <div className="bg-gradient-to-t from-[#FFD700] to-[#FFF4CC] w-24 h-24 rounded-t-lg mt-2 flex flex-col items-center justify-center">
          <span className="text-white font-bold text-2xl drop-shadow">1</span>
          <span className="text-white/90 text-sm font-medium">{first?.checkin_count} check-ins</span>
        </div>
        <p className="text-sm font-medium text-[#111111] mt-1 truncate w-24 text-center">
          {first?.display_name || first?.name}
          {first?.user_id === currentUserId && <span className="text-[#0066FF]"> (You)</span>}
        </p>
      </div>

      {/* 3rd Place */}
      <div className="flex flex-col items-center">
        <Link to={`/user/${third?.user_id}`} className="group">
          <Avatar className="h-14 w-14 border-2 border-[#CD7F32] group-hover:scale-105 transition-transform">
            <AvatarImage src={third?.picture} />
            <AvatarFallback className="bg-[#CD7F32] text-white font-bold">
              {(third?.display_name || third?.name || 'U').charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="bg-gradient-to-t from-[#CD7F32] to-[#E8C8A8] w-20 h-12 rounded-t-lg mt-2 flex flex-col items-center justify-center">
          <span className="text-white font-bold text-lg">3</span>
          <span className="text-white/80 text-xs">{third?.checkin_count}</span>
        </div>
        <p className="text-xs text-[#555555] mt-1 truncate w-20 text-center">
          {third?.display_name || third?.name}
          {third?.user_id === currentUserId && <span className="text-[#0066FF]"> (You)</span>}
        </p>
      </div>
    </div>
  );
};

export default function GymDetail() {
  const { gymId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [period, setPeriod] = useState("week");

  // React Query hooks
  const { data: gym, isLoading: gymLoading } = useGym(gymId);
  const { data: leaderboardData, isLoading: leaderboardLoading } = useGymLeaderboard(gymId, period);
  const { data: membersData, isLoading: membersLoading } = useGymMembers(gymId);
  const { data: activityData } = useGymActivity(gymId);

  const leaderboard = leaderboardData?.leaderboard || [];
  const members = membersData?.members || [];
  const recentActivity = activityData?.recent_activity || [];
  const todayCheckins = activityData?.display_today_checkins || 0;
  const weekCheckins = activityData?.display_week_checkins || 0;

  const isUserGym = user?.primary_gym_id === gymId;
  const isAdmin = gym?.owner_id === user?.user_id || user?.role === 'super_admin' ||
    (user?.role === 'gym_admin' && user?.managed_gym_id === gymId);

  const openInMaps = () => {
    window.open(getGoogleMapsUrl(gym), "_blank", "noopener,noreferrer");
  };

  if (gymLoading) {
    return (
      <Layout user={user}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="card-premium animate-pulse">
            <CardContent className="p-6">
              <div className="flex gap-6">
                <div className="w-20 h-20 bg-[#E5E7EB] rounded-2xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-8 bg-[#E5E7EB] rounded w-1/2" />
                  <div className="h-4 bg-[#E5E7EB] rounded w-1/3" />
                  <div className="h-10 bg-[#E5E7EB] rounded w-40" />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <Card key={i} className="card-premium animate-pulse">
                <CardContent className="p-4">
                  <div className="h-20 bg-[#E5E7EB] rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!gym) {
    return (
      <Layout user={user}>
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-[#888888] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#111111] mb-2">Gym not found</h2>
          <p className="text-[#555555] mb-4">The gym you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/gyms")} className="bg-[#0066FF] hover:bg-[#0052CC] rounded-xl">
            Browse Gyms
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto space-y-6" data-testid="gym-detail-page">
        {/* Hero Header */}
        <Card className="card-premium overflow-hidden">
          <div className="bg-gradient-to-r from-[#0066FF] to-[#0052CC] p-6 text-white">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold">{gym.name}</h1>
                  {gym.is_verified && (
                    <CheckCircle className="w-6 h-6 text-white/90" />
                  )}
                  {isUserGym && (
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                      Your Gym
                    </span>
                  )}
                </div>
                <button
                  onClick={openInMaps}
                  className="flex items-center gap-2 text-white/90 hover:text-white mt-2 group"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{getConciseLocation(gym)}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={openInMaps}
                  className="bg-white text-[#0066FF] hover:bg-white/90 rounded-xl font-semibold"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
                {isAdmin && (
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/gym-owner/${gymId}`)}
                    className="border-white/30 text-white hover:bg-white/10 rounded-xl"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Amenities */}
          {gym.amenities?.length > 0 && (
            <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#FAFBFF]">
              <div className="flex flex-wrap gap-2">
                {gym.amenities.map((amenity, i) => (
                  <span key={i} className="bg-white border border-[#E5E7EB] text-[#555555] px-3 py-1 rounded-lg text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="card-premium hover:border-[#0066FF]/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E6FFF5] rounded-xl flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[#00C853]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#111111]">{todayCheckins}</p>
                  <p className="text-[#888888] text-xs">Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium hover:border-[#0066FF]/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E6F0FF] rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#0066FF]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#111111]">{weekCheckins}</p>
                  <p className="text-[#888888] text-xs">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium hover:border-[#0066FF]/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F3E8FF] rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#111111]">{gym.member_count || 0}</p>
                  <p className="text-[#888888] text-xs">Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium hover:border-[#0066FF]/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFF8E6] rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-[#FF9500]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#111111]">{leaderboard.length}</p>
                  <p className="text-[#888888] text-xs">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <Card className="card-premium">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#0066FF]" />
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
                {recentActivity.slice(0, 6).map((activity, i) => (
                  <Link
                    key={activity.id || i}
                    to={`/user/${activity.user_id}`}
                    className="flex flex-col items-center min-w-[70px] group"
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12 border-2 border-[#00C853] group-hover:scale-105 transition-transform">
                        <AvatarImage src={activity.user_picture} />
                        <AvatarFallback className="bg-[#0066FF] text-white text-sm">
                          {(activity.user_name || 'U').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00C853] rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <p className="text-xs text-[#555555] mt-2 truncate w-16 text-center">
                      {activity.user_name?.split(' ')[0] || 'Member'}
                    </p>
                    <p className="text-[10px] text-[#888888]">
                      {formatDistanceToNow(new Date(activity.checked_in_at), { addSuffix: false })}
                    </p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="bg-[#F0F2F5] border border-[#E5E7EB] p-1 rounded-xl w-full">
            <TabsTrigger value="leaderboard" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-[#555555] data-[state=active]:text-[#111111]">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="members" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-[#555555] data-[state=active]:text-[#111111]">
              <Users className="w-4 h-4 mr-2" />
              Members ({members.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="mt-4">
            <Card className="card-premium">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[#111111]">This {period.charAt(0).toUpperCase() + period.slice(1)}'s Champions</CardTitle>
                <div className="flex gap-1 bg-[#F0F2F5] p-1 rounded-lg">
                  {["week", "month", "all"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                        period === p
                          ? "bg-white shadow-sm text-[#0066FF]"
                          : "text-[#555555] hover:text-[#111111]"
                      }`}
                    >
                      {p === "all" ? "All Time" : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {leaderboardLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                        <div className="w-8 h-8 bg-[#E5E7EB] rounded-lg" />
                        <div className="w-10 h-10 bg-[#E5E7EB] rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-[#E5E7EB] rounded w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-12 h-12 text-[#E5E7EB] mx-auto mb-3" />
                    <p className="text-[#555555]">No activity this {period} yet</p>
                    <p className="text-[#888888] text-sm mt-1">Check in to be the first!</p>
                  </div>
                ) : (
                  <>
                    {/* Podium for top 3 */}
                    {leaderboard.length >= 3 && (
                      <Podium leaderboard={leaderboard} currentUserId={user?.user_id} />
                    )}

                    {/* Rest of leaderboard */}
                    <div className="space-y-1">
                      {leaderboard.slice(leaderboard.length >= 3 ? 3 : 0).map((entry) => (
                        <Link
                          key={entry.user_id}
                          to={`/user/${entry.user_id}`}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8F9FA] transition-colors group"
                        >
                          <div className="w-8 h-8 bg-[#F0F2F5] rounded-lg flex items-center justify-center text-[#555555] font-semibold text-sm">
                            {entry.rank}
                          </div>
                          <Avatar className="h-10 w-10 border border-[#E5E7EB]">
                            <AvatarImage src={entry.picture} />
                            <AvatarFallback className="bg-[#0066FF] text-white">
                              {(entry.display_name || entry.name || 'U').charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#111111] font-medium truncate">
                              {entry.display_name || entry.name}
                              {entry.user_id === user?.user_id && (
                                <span className="text-[#0066FF] text-sm ml-1">(You)</span>
                              )}
                            </p>
                            {entry.current_streak > 0 && (
                              <div className="flex items-center gap-1 text-[#888888] text-sm">
                                <Zap className="w-3 h-3 text-[#0066FF]" />
                                <span>{entry.current_streak} week streak</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-[#111111]">{entry.checkin_count}</p>
                            <p className="text-[#888888] text-xs">check-ins</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#CCCCCC] group-hover:text-[#0066FF] transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="mt-4">
            <Card className="card-premium">
              <CardContent className="p-4">
                {membersLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9FA] animate-pulse">
                        <div className="w-10 h-10 bg-[#E5E7EB] rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-[#E5E7EB] rounded w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : members.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-[#E5E7EB] mx-auto mb-3" />
                    <p className="text-[#555555]">No members yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {members.map((member) => (
                      <Link
                        key={member.user_id}
                        to={`/user/${member.user_id}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9FA] hover:bg-[#F0F2F5] transition-colors group"
                      >
                        <Avatar className="h-10 w-10 border border-[#E5E7EB] group-hover:border-[#0066FF] transition-colors">
                          <AvatarImage src={member.picture} />
                          <AvatarFallback className="bg-[#0066FF] text-white">
                            {(member.display_name || member.name || 'U').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#111111] font-medium truncate text-sm">
                            {member.display_name || member.name}
                          </p>
                          {member.current_streak > 0 && (
                            <div className="flex items-center gap-1 text-[#0066FF] text-xs">
                              <Zap className="w-3 h-3" />
                              <span>{member.current_streak}w</span>
                            </div>
                          )}
                        </div>
                      </Link>
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
