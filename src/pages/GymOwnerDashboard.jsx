import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout";
import {
  useCurrentUser,
  useGymOwnerDashboard,
  useRegenerateQR,
  useGymAuthorization,
} from "@/hooks";
import { toast } from "sonner";
import {
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Trophy,
  Calendar,
  QrCode,
  RefreshCw,
  ArrowLeft,
  ChevronRight,
  Search,
  Flame,
  Crown,
  Download,
  Share2,
  Target,
  Clock,
  CheckCircle,
  Copy,
  Eye,
  BarChart3,
  Activity,
  Zap,
  Medal,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { format, subDays, isToday, isYesterday } from "date-fns";

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, subValue, trend, trendUp, color, onClick }) => (
  <Card
    className={`card-premium border-${color}/20 hover:shadow-md transition-all ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
  >
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center`}
          style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trendUp ? 'text-[#00C853]' : 'text-[#FF3B30]'}`}>
            {trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {trend}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-[#111111]">{value}</p>
        <p className="text-sm text-[#555555] mt-1">{label}</p>
        {subValue && <p className="text-xs text-[#888888] mt-0.5">{subValue}</p>}
      </div>
    </CardContent>
  </Card>
);

// Member Card Component
const MemberCard = ({ member, rank, isAtRisk }) => (
  <Link
    to={`/user/${member.user_id}`}
    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
      isAtRisk
        ? 'bg-gradient-to-r from-[#FFF5F5] to-white hover:from-[#FFE6E6]'
        : 'bg-[#F8F9FA] hover:bg-[#F0F2F5]'
    }`}
  >
    {rank && (
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
        rank === 1 ? 'bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-white' :
        rank === 2 ? 'bg-gradient-to-br from-[#C0C0C0] to-[#A0A0A0] text-white' :
        rank === 3 ? 'bg-gradient-to-br from-[#CD7F32] to-[#B87333] text-white' :
        'bg-[#E5E7EB] text-[#555555]'
      }`}>
        {rank <= 3 ? <Crown className="w-4 h-4" /> : `#${rank}`}
      </div>
    )}
    <Avatar className="h-10 w-10 border border-[#E5E7EB]">
      <AvatarImage src={member.picture} />
      <AvatarFallback className="bg-[#0066FF] text-white font-semibold">
        {(member.display_name || member.name || 'U').charAt(0)}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <p className="text-[#111111] font-medium truncate">{member.display_name || member.name}</p>
      {isAtRisk ? (
        <p className="text-[#FF3B30] text-sm flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Inactive 14+ days
        </p>
      ) : member.current_streak > 0 ? (
        <p className="text-[#FF6B35] text-sm flex items-center gap-1">
          <Flame className="w-3 h-3" />
          {member.current_streak}w streak
        </p>
      ) : null}
    </div>
    {member.checkin_count !== undefined && (
      <div className="text-right">
        <p className="text-[#111111] font-bold text-lg">{member.checkin_count}</p>
        <p className="text-[#888888] text-xs">check-ins</p>
      </div>
    )}
    <ChevronRight className="w-5 h-5 text-[#888888]" />
  </Link>
);

export default function GymOwnerDashboard() {
  const { gymId } = useParams();
  const navigate = useNavigate();
  const [memberSearch, setMemberSearch] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);

  // React Query hooks
  const { user, isLoading: userLoading } = useCurrentUser();
  const { data: authData, isLoading: authLoading } = useGymAuthorization(gymId, user);
  const { data: dashboard, isLoading: dashboardLoading } = useGymOwnerDashboard(gymId);
  const regenerateQR = useRegenerateQR();

  const isLoading = userLoading || authLoading || dashboardLoading;

  // Prepare chart data
  const getChartData = () => {
    if (!dashboard?.daily_checkins) return [];
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateKey = format(date, "yyyy-MM-dd");
      data.push({
        date: format(date, "MMM d"),
        checkins: dashboard.daily_checkins[dateKey] || 0,
      });
    }
    return data;
  };

  // Filter top members
  const filteredTopMembers = dashboard?.top_members?.filter(m =>
    !memberSearch || (m.display_name || m.name || '').toLowerCase().includes(memberSearch.toLowerCase())
  ) || [];

  // Copy QR code to clipboard
  const copyQRCode = () => {
    navigator.clipboard.writeText(dashboard?.gym?.qr_code || '');
    toast.success('QR code copied to clipboard');
  };

  // Handle regenerate QR
  const handleRegenerateQR = () => {
    if (confirm('Regenerate QR code? Old code will stop working.')) {
      regenerateQR.mutate(gymId);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-[#0066FF] rounded-2xl flex items-center justify-center animate-pulse">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#555555]">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  // Check authorization
  if (!authData?.isAuthorized) {
    toast.error("You don't have permission to access this dashboard");
    navigate(`/gym/${gymId}`);
    return null;
  }

  const chartData = getChartData();
  const todayCheckins = dashboard?.daily_checkins?.[format(new Date(), "yyyy-MM-dd")] || 0;
  const yesterdayCheckins = dashboard?.daily_checkins?.[format(subDays(new Date(), 1), "yyyy-MM-dd")] || 0;
  const checkinTrend = yesterdayCheckins > 0
    ? Math.round(((todayCheckins - yesterdayCheckins) / yesterdayCheckins) * 100)
    : todayCheckins > 0 ? 100 : 0;

  return (
    <Layout user={user}>
      <div className="space-y-6" data-testid="gym-owner-dashboard">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/gym/${gymId}`)}
              className="text-[#555555] hover:text-[#0066FF] rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-14 h-14 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111111]">{dashboard?.gym?.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#555555] text-sm">Owner Dashboard</span>
                {authData?.isOwner && (
                  <span className="px-2 py-0.5 bg-[#FFD700]/20 text-[#B8860B] text-xs font-medium rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Owner
                  </span>
                )}
                {authData?.isSuperAdmin && (
                  <span className="px-2 py-0.5 bg-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-medium rounded-full">
                    Super Admin
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowQRCode(!showQRCode)}
              className="border-[#E5E7EB] text-[#555555] hover:border-[#0066FF] hover:text-[#0066FF] rounded-xl"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
          </div>
        </div>

        {/* QR Code Panel */}
        {showQRCode && (
          <Card className="card-premium bg-gradient-to-br from-[#F8F9FA] to-white border-[#0066FF]/10">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
                  <div className="w-40 h-40 flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-[#111111]" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-semibold text-[#111111] text-lg mb-2">Gym Check-in QR Code</h3>
                  <p className="text-[#555555] text-sm mb-4">
                    Display this QR code at your gym entrance. Members scan it to check in and earn rewards.
                  </p>
                  <div className="bg-[#F0F2F5] px-4 py-3 rounded-xl flex items-center gap-3 mb-4">
                    <code className="text-[#111111] font-mono flex-1 truncate">{dashboard?.gym?.qr_code}</code>
                    <Button size="sm" variant="ghost" onClick={copyQRCode} className="shrink-0">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={handleRegenerateQR}
                      disabled={regenerateQR.isPending}
                      variant="outline"
                      className="border-[#E5E7EB] text-[#555555] hover:border-[#FF9500] hover:text-[#FF9500] rounded-xl"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${regenerateQR.isPending ? 'animate-spin' : ''}`} />
                      {regenerateQR.isPending ? "Regenerating..." : "Regenerate"}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#E5E7EB] text-[#555555] rounded-xl"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Members"
            value={dashboard?.total_members || 0}
            subValue="All-time registrations"
            color="#0066FF"
          />
          <StatCard
            icon={Activity}
            label="Active Members"
            value={dashboard?.active_members_30d || 0}
            subValue="Checked in last 30 days"
            trend={dashboard?.active_members_30d > 0 ? Math.round((dashboard?.active_members_30d / (dashboard?.total_members || 1)) * 100) : 0}
            trendUp={true}
            color="#00C853"
          />
          <StatCard
            icon={Zap}
            label="Check-ins (30d)"
            value={dashboard?.total_checkins_30d || 0}
            subValue={`${todayCheckins} today`}
            trend={Math.abs(checkinTrend)}
            trendUp={checkinTrend >= 0}
            color="#FF9500"
          />
          <StatCard
            icon={AlertTriangle}
            label="At Risk"
            value={dashboard?.at_risk_members?.length || 0}
            subValue="14+ days inactive"
            color="#FF3B30"
            onClick={() => document.getElementById('at-risk-section')?.scrollIntoView({ behavior: 'smooth' })}
          />
        </div>

        {/* Charts Section */}
        <Card className="card-premium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-[#111111] text-lg">Check-in Trends</h2>
                <p className="text-[#555555] text-sm">Last 30 days activity</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#0066FF] rounded-full" />
                  <span className="text-sm text-[#555555]">Daily check-ins</span>
                </div>
              </div>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCheckins" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066FF" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    tick={{ fill: '#555555', fontSize: 11 }}
                    interval={4}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    tick={{ fill: '#555555', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
                    }}
                    labelStyle={{ color: '#111111', fontWeight: 600 }}
                    itemStyle={{ color: '#0066FF' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="checkins"
                    stroke="#0066FF"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCheckins)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Members Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Members */}
          <Card className="card-premium">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FF9500] rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[#111111]">Top Members</h2>
                    <p className="text-xs text-[#888888]">Last 30 days</p>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                  <Input
                    placeholder="Search..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="pl-9 w-40 h-9 bg-[#F8F9FA] border-[#E5E7EB] rounded-lg text-sm"
                  />
                </div>
              </div>

              {filteredTopMembers.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 bg-[#F0F2F5] rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-7 h-7 text-[#888888]" />
                  </div>
                  <p className="text-[#555555] font-medium">No activity yet</p>
                  <p className="text-[#888888] text-sm mt-1">Members will appear here once they check in</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {filteredTopMembers.map((member, index) => (
                    <MemberCard
                      key={member.user_id}
                      member={member}
                      rank={index + 1}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* At Risk Members */}
          <Card className="card-premium" id="at-risk-section">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF3B30] to-[#FF6B35] rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#111111]">At Risk Members</h2>
                  <p className="text-xs text-[#888888]">14+ days inactive</p>
                </div>
              </div>

              {dashboard?.at_risk_members?.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 bg-[#E6FFF5] rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-7 h-7 text-[#00C853]" />
                  </div>
                  <p className="text-[#00C853] font-semibold">All members are active!</p>
                  <p className="text-[#555555] text-sm mt-1">Great job keeping everyone engaged</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {dashboard?.at_risk_members?.map((member) => (
                    <MemberCard
                      key={member.user_id}
                      member={member}
                      isAtRisk
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active Challenges */}
        <Card className="card-premium">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#111111]">Active Challenges</h2>
                  <p className="text-xs text-[#888888]">Gym challenges in progress</p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/challenges')}
                className="bg-[#0066FF] hover:bg-[#0052CC] rounded-xl"
              >
                Create Challenge
              </Button>
            </div>

            {dashboard?.active_challenges?.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-[#F0F2F5] rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-7 h-7 text-[#888888]" />
                </div>
                <p className="text-[#555555] font-medium">No active challenges</p>
                <p className="text-[#888888] text-sm mt-1">Create a challenge to boost member engagement</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboard?.active_challenges?.map((challenge) => (
                  <Link
                    key={challenge.challenge_id}
                    to={`/challenge/${challenge.challenge_id}`}
                    className="bg-gradient-to-br from-[#F8F9FA] to-white p-4 rounded-xl border border-[#E5E7EB] hover:border-[#0066FF]/30 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#FFD700] to-[#FF9500] rounded-lg flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        challenge.status === 'active'
                          ? 'bg-[#E6FFF5] text-[#00C853]'
                          : 'bg-[#FFF8E6] text-[#FF9500]'
                      }`}>
                        {challenge.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-[#111111] group-hover:text-[#0066FF] transition-colors">{challenge.name}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-[#555555]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {challenge.current_participants}
                      </span>
                      <span className="flex items-center gap-1 text-[#00C853]">
                        ₹{challenge.total_pool} pool
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="card-premium bg-gradient-to-br from-[#E6F0FF] to-white border-[#0066FF]/10">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center">
                {dashboard?.gym?.is_verified ? (
                  <CheckCircle className="w-8 h-8 text-[#0066FF]" />
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-[#E5E7EB]" />
                )}
              </div>
              <p className="text-sm text-[#555555] mt-1">Verified Gym</p>
            </CardContent>
          </Card>
          <Card className="card-premium bg-gradient-to-br from-[#FFF8E6] to-white border-[#FF9500]/10">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-[#FF9500]">{dashboard?.active_challenges?.length || 0}</p>
              <p className="text-sm text-[#555555] mt-1">Active Challenges</p>
            </CardContent>
          </Card>
          <Card className="card-premium bg-gradient-to-br from-[#E6FFF5] to-white border-[#00C853]/10">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-[#00C853]">
                {dashboard?.total_members > 0
                  ? Math.round((dashboard?.active_members_30d / dashboard?.total_members) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-[#555555] mt-1">Active Rate</p>
            </CardContent>
          </Card>
          <Card className="card-premium bg-gradient-to-br from-[#F0E6FF] to-white border-[#8B5CF6]/10">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-[#8B5CF6]">
                {dashboard?.total_checkins_30d > 0 && dashboard?.active_members_30d > 0
                  ? (dashboard?.total_checkins_30d / dashboard?.active_members_30d).toFixed(1)
                  : 0}
              </p>
              <p className="text-sm text-[#555555] mt-1">Avg Check-ins/Member</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
