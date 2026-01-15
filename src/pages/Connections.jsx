import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import {
  useCurrentUser,
  useConnectionsData,
  useAcceptConnection,
  useDeclineConnection,
  useRemoveConnection,
  useSendConnectionRequest,
} from "@/hooks";
import {
  Users,
  UserPlus,
  UserCheck,
  Zap,
  Dumbbell,
  X,
  Check,
  Eye,
  Target,
  Trophy,
  Calendar,
  MapPin,
} from "lucide-react";

// Tab content loading component
const TabLoader = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="relative mb-4">
      <div className="w-12 h-12 rounded-full border-4 border-[#E5E7EB]"></div>
      <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-[#0066FF] animate-spin"></div>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-[#555555] font-medium">Loading</span>
      <span className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </span>
    </div>
  </div>
);

export default function Connections() {
  const [activeTab, setActiveTab] = useState("suggestions");

  // Use React Query hooks instead of manual fetching
  const { user } = useCurrentUser();
  const { connections, pending, suggestions, isLoading } = useConnectionsData();

  // Mutations with optimistic updates - no refetch needed!
  const acceptMutation = useAcceptConnection();
  const declineMutation = useDeclineConnection();
  const removeMutation = useRemoveConnection();
  const sendRequestMutation = useSendConnectionRequest();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Action handlers now use mutations (with optimistic updates)
  const acceptRequest = (connectionId) => acceptMutation.mutate(connectionId);
  const declineRequest = (connectionId) => declineMutation.mutate(connectionId);
  const removeConnection = (connectionId) => removeMutation.mutate(connectionId);
  const sendRequest = (userId) => sendRequestMutation.mutate(userId);

  if (isLoading) {
    return (
      <Layout user={user}>
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-8 w-36 bg-[#E5E7EB] rounded-lg animate-shimmer" />
              <div className="h-4 w-48 bg-[#E5E7EB] rounded animate-shimmer" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-1 animate-shimmer">
            <div className="h-10 bg-[#F0F2F5] rounded-lg" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 animate-shimmer">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#F0F2F5] rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-32 bg-[#F0F2F5] rounded" />
                    <div className="h-4 w-24 bg-[#F0F2F5] rounded" />
                    <div className="h-3 w-20 bg-[#F0F2F5] rounded" />
                  </div>
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
      <div className="max-w-4xl mx-auto space-y-6" data-testid="connections-page">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111]">Community</h1>
            <p className="text-[#555555] mt-1">Build your fitness network</p>
          </div>
          {pending.length > 0 && (
            <Badge className="bg-[#FF3B30] text-white px-3 py-1">
              {pending.length} pending
            </Badge>
          )}
        </div>

        {/* Why Connect Banner - Show to users with few connections */}
        {connections.length < 3 && (
          <Card className="card-premium border-[#0066FF]/20 bg-gradient-to-r from-[#FAFBFF] to-[#F0F4FF]">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#111111] mb-4">Why Connect with Gym Members?</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#E6F0FF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 text-[#0066FF]" />
                  </div>
                  <div>
                    <p className="text-[#111111] font-medium">Accountability Partner</p>
                    <p className="text-[#555555] text-sm">See when they check in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#FFF8E6] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-[#FF9500]" />
                  </div>
                  <div>
                    <p className="text-[#111111] font-medium">Direct Challenges</p>
                    <p className="text-[#555555] text-sm">Compete head-to-head</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#E6FFF5] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 text-[#00C853]" />
                  </div>
                  <div>
                    <p className="text-[#111111] font-medium">Friends Leaderboard</p>
                    <p className="text-[#555555] text-sm">Compare streaks with friends</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Suggestions Preview - Always visible */}
        {suggestions.length > 0 && activeTab !== "suggestions" && (
          <Card className="card-premium border-[#00C853]/20 bg-gradient-to-r from-[#F6FFF9] to-[#E6FFF5]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#00C853]" />
                  <p className="text-[#111111] font-semibold">{suggestions.length} people you may know</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTabChange("suggestions")}
                  className="text-[#00C853] hover:text-[#00B548]"
                >
                  View All
                </Button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {suggestions.slice(0, 4).map((suggestion) => (
                  <div key={suggestion.user_id} className="flex-shrink-0 text-center">
                    <Avatar className="w-12 h-12 mx-auto rounded-full border-2 border-[#00C853]/30">
                      <AvatarImage src={suggestion.picture} />
                      <AvatarFallback className="bg-[#0066FF] text-white rounded-full">
                        {(suggestion.display_name || suggestion.name || 'U').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-[#555555] mt-1 truncate w-16">{suggestion.display_name || suggestion.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-[#F0F2F5] border border-[#E5E7EB] w-full grid grid-cols-3 p-1 rounded-xl">
            <TabsTrigger value="suggestions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-[#555555] data-[state=active]:text-[#111111]">
              <Users className="w-4 h-4 mr-2" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="connections" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-[#555555] data-[state=active]:text-[#111111]">
              <UserCheck className="w-4 h-4 mr-2" />
              Friends ({connections.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-[#555555] data-[state=active]:text-[#111111] relative">
              <UserPlus className="w-4 h-4 mr-2" />
              Requests
              {pending.length > 0 && (
                <span className="ml-1 w-5 h-5 bg-[#FF3B30] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {pending.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Discover/Suggestions Tab */}
          <TabsContent value="suggestions" className="mt-4">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="text-[#111111] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#0066FF]" />
                  People You May Know
                </CardTitle>
                <p className="text-[#555555] text-sm">Based on your gym, distance, and mutual connections</p>
              </CardHeader>
              <CardContent>
                {suggestions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 bg-[#F0F2F5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-7 h-7 text-[#888888]" />
                    </div>
                    <p className="text-[#555555] font-medium">No suggestions available</p>
                    <p className="text-[#888888] text-sm mt-1">Check back later for new suggestions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.user_id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-[#F8F9FA] hover:bg-[#F0F2F5] transition-colors border border-transparent hover:border-[#0066FF]/20"
                      >
                        <Link to={`/user/${suggestion.user_id}`}>
                          <Avatar className="h-14 w-14 rounded-full border-2 border-[#E5E7EB]">
                            <AvatarImage src={suggestion.picture} className="rounded-full" />
                            <AvatarFallback className="bg-[#0066FF] text-white font-semibold text-lg rounded-full">
                              {(suggestion.display_name || suggestion.name || 'U').charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/user/${suggestion.user_id}`} className="hover:text-[#0066FF]">
                            <p className="text-[#111111] font-semibold truncate">{suggestion.display_name || suggestion.name}</p>
                          </Link>

                          {/* Streak info */}
                          {suggestion.current_streak > 0 && (
                            <p className="text-[#0066FF] text-sm font-medium mt-1">
                              <Zap className="w-3 h-3 inline mr-1" />
                              {suggestion.current_streak} week streak
                            </p>
                          )}

                          {/* Why suggested badges */}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {suggestion.suggestion_type === 'same_gym' && (
                              <span className="bg-[#E6F0FF] text-[#0066FF] text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                                <Dumbbell className="w-3 h-3" />
                                Same Gym
                              </span>
                            )}
                            {suggestion.mutual_count > 0 && (
                              <span className="bg-[#F3E8FF] text-[#7C3AED] text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {suggestion.mutual_count} mutual
                              </span>
                            )}
                            {suggestion.distance && (
                              <span className="bg-[#E6FFF5] text-[#00C853] text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {suggestion.distance < 1000 ? `${suggestion.distance}m` : `${(suggestion.distance/1000).toFixed(1)}km`}
                              </span>
                            )}
                            {suggestion.week_checkins > 0 && (
                              <span className="bg-[#FFF8E6] text-[#FF9500] text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {suggestion.week_checkins}x this week
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => sendRequest(suggestion.user_id)}
                          disabled={sendRequestMutation.isPending}
                          className="bg-[#0066FF] hover:bg-[#0052CC] rounded-xl flex-shrink-0"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections" className="mt-4">
            <Card className="card-premium">
              <CardContent className="p-6">
                {connections.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 bg-[#F0F2F5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-7 h-7 text-[#888888]" />
                    </div>
                    <p className="text-[#555555] font-medium">No connections yet</p>
                    <p className="text-[#888888] text-sm mt-1">Find gym members in the Discover tab</p>
                    <Button
                      onClick={() => handleTabChange("suggestions")}
                      className="mt-4 bg-[#0066FF] hover:bg-[#0052CC] rounded-xl"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Discover People
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {connections.map((conn) => (
                      <div
                        key={conn.connection_id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-[#F8F9FA] hover:bg-[#F0F2F5] transition-colors"
                      >
                        <Link to={`/user/${conn.user.user_id || conn.user.id}`}>
                          <Avatar className="h-12 w-12 rounded-full border border-[#E5E7EB]">
                            <AvatarImage src={conn.user.picture} className="rounded-full" />
                            <AvatarFallback className="bg-[#0066FF] text-white font-semibold rounded-full">
                              {(conn.user.display_name || conn.user.name || 'U').charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/user/${conn.user.user_id || conn.user.id}`} className="hover:text-[#0066FF]">
                            <p className="text-[#111111] font-medium truncate">{conn.user.display_name || conn.user.name}</p>
                          </Link>
                          {conn.user.gym_name && (
                            <div className="flex items-center gap-1 text-[#555555] text-sm">
                              <Dumbbell className="w-3 h-3" />
                              <span className="truncate">{conn.user.gym_name}</span>
                            </div>
                          )}
                          {conn.user.current_streak > 0 && (
                            <div className="flex items-center gap-1 text-[#0066FF] text-sm">
                              <Zap className="w-3 h-3" />
                              <span>{conn.user.current_streak} week streak</span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeConnection(conn.connection_id)}
                          disabled={removeMutation.isPending}
                          className="text-[#888888] hover:text-[#FF3B30] hover:bg-red-50 flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="mt-4">
            <Card className="card-premium">
              <CardContent className="p-6">
                {pending.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 bg-[#F0F2F5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <UserPlus className="w-7 h-7 text-[#888888]" />
                    </div>
                    <p className="text-[#555555] font-medium">No pending requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pending.map((request) => (
                      <div
                        key={request.connection_id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-[#FAFBFF] border border-[#0066FF]/20"
                      >
                        <Link to={`/user/${request.user.user_id || request.user.id}`}>
                          <Avatar className="h-12 w-12 rounded-full border border-[#E5E7EB]">
                            <AvatarImage src={request.user.picture} className="rounded-full" />
                            <AvatarFallback className="bg-[#0066FF] text-white font-semibold rounded-full">
                              {(request.user.display_name || request.user.name || 'U').charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/user/${request.user.user_id || request.user.id}`} className="hover:text-[#0066FF]">
                            <p className="text-[#111111] font-medium truncate">{request.user.display_name || request.user.name}</p>
                          </Link>
                          <p className="text-[#0066FF] text-sm font-medium">wants to connect</p>
                          {request.user.gym_name && (
                            <div className="flex items-center gap-1 text-[#555555] text-sm">
                              <Dumbbell className="w-3 h-3" />
                              <span className="truncate">{request.user.gym_name}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            onClick={() => acceptRequest(request.connection_id)}
                            disabled={acceptMutation.isPending}
                            className="bg-[#00C853] hover:bg-[#00B548] rounded-xl"
                            size="sm"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            onClick={() => declineRequest(request.connection_id)}
                            disabled={declineMutation.isPending}
                            variant="outline"
                            className="border-[#E5E7EB] text-[#555555] hover:bg-red-50 hover:text-[#FF3B30] hover:border-[#FF3B30]/50 rounded-xl"
                            size="sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
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
