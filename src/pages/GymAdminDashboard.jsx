import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/App";
import {
  useGymAdminDashboard,
  useGymAdminMembers,
  useGymAdminMemberHistory,
  useGymAdminChallenges,
  useGymAdminAnnouncements,
  useCreateGymChallenge,
  useSendGymAnnouncement,
  useDeleteGymAnnouncement,
  useUpdateGymSettings,
} from "@/hooks";
import { auth } from "@/lib/supabase";
import { toast } from "sonner";
import { AdminLogin } from "@/components/admin/AdminLogin";
import {
  Users,
  Building2,
  Trophy,
  Settings,
  BarChart3,
  LogOut,
  Search,
  QrCode,
  Calendar,
  Activity,
  Plus,
  Eye,
  Zap,
  Loader2,
  TrendingUp,
  Clock,
  Save,
  Download,
  Megaphone,
  Send,
  Trash2
} from "lucide-react";

export default function GymAdminDashboard() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Search and filter states
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  // Modal states
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // Form states
  const [gymSettings, setGymSettings] = useState({ name: "", address: "", description: "" });
  const [challengeForm, setChallengeForm] = useState({
    name: "", description: "", entry_fee: 100, goal_count: 12, duration: "month"
  });
  const [announcementForm, setAnnouncementForm] = useState({
    title: "", message: "", type: "general"
  });

  // Data hooks
  const { data: dashboardData, isLoading: dashboardLoading } = useGymAdminDashboard();
  const { data: membersData, isLoading: membersLoading } = useGymAdminMembers({ search: memberSearch });
  const { data: memberHistory, isLoading: historyLoading } = useGymAdminMemberHistory(selectedMemberId);
  const { data: challenges, isLoading: challengesLoading } = useGymAdminChallenges();
  const { data: announcements, isLoading: announcementsLoading } = useGymAdminAnnouncements();

  // Mutation hooks
  const createChallenge = useCreateGymChallenge();
  const sendAnnouncement = useSendGymAnnouncement();
  const deleteAnnouncement = useDeleteGymAnnouncement();
  const updateSettings = useUpdateGymSettings();

  // Initialize gym settings from dashboard data
  useMemo(() => {
    if (dashboardData?.gym && !gymSettings.name) {
      setGymSettings({
        name: dashboardData.gym.name || "",
        address: dashboardData.gym.address || "",
        description: dashboardData.gym.description || ""
      });
    }
  }, [dashboardData?.gym]);

  // Check authorization
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-[#00C853] rounded-2xl flex items-center justify-center animate-pulse">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-[#00C853] animate-spin" />
            <span className="text-[#555555]">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <AdminLogin title="Gym Admin" subtitle="Sign in to access the Gym Admin dashboard" />;
  }

  // Check role permissions
  if (user.role !== 'gym_admin' && user.role !== 'super_admin') {
    toast.error("You don't have permission to access this page");
    navigate("/");
    return null;
  }

  // Check gym assignment for gym_admin role
  if (user.role === 'gym_admin' && !user.managed_gym_id) {
    toast.error("No gym assigned to your account");
    navigate("/");
    return null;
  }

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  const handleViewMemberHistory = (member) => {
    setSelectedMemberId(member.user_id || member.id);
    setShowHistoryModal(true);
  };

  const handleSaveSettings = () => {
    updateSettings.mutate(gymSettings);
  };

  const handleCreateChallenge = () => {
    if (!challengeForm.name || !challengeForm.description) {
      toast.error("Name and description are required");
      return;
    }

    const startDate = new Date();
    let endDate = new Date();
    if (challengeForm.duration === "week") endDate.setDate(endDate.getDate() + 7);
    else if (challengeForm.duration === "2weeks") endDate.setDate(endDate.getDate() + 14);
    else endDate.setMonth(endDate.getMonth() + 1);

    createChallenge.mutate({
      name: challengeForm.name,
      description: challengeForm.description,
      entry_fee: challengeForm.entry_fee,
      goal_count: challengeForm.goal_count,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      min_participants: 5,
      max_participants: 50
    }, {
      onSuccess: () => {
        setShowChallengeModal(false);
        setChallengeForm({ name: "", description: "", entry_fee: 100, goal_count: 12, duration: "month" });
      }
    });
  };

  const handleSendAnnouncement = () => {
    if (!announcementForm.title || !announcementForm.message) {
      toast.error("Title and message are required");
      return;
    }

    sendAnnouncement.mutate(announcementForm, {
      onSuccess: () => {
        setShowAnnouncementModal(false);
        setAnnouncementForm({ title: "", message: "", type: "general" });
      }
    });
  };

  const handleDeleteAnnouncement = (announcementId) => {
    deleteAnnouncement.mutate(announcementId);
  };

  // Filter members based on search
  const members = membersData?.members || [];
  const filteredMembers = useMemo(() => {
    if (!memberSearch) return members;
    const search = memberSearch.toLowerCase();
    return members.filter(m =>
      m.name?.toLowerCase().includes(search) ||
      m.display_name?.toLowerCase().includes(search) ||
      m.email?.toLowerCase().includes(search)
    );
  }, [members, memberSearch]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const gym = dashboardData?.gym;
  const stats = dashboardData?.stats;
  const topMembers = dashboardData?.top_members || [];

  // Loading state for initial dashboard
  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-[#00C853] rounded-2xl flex items-center justify-center animate-pulse">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-[#00C853] animate-spin" />
            <span className="text-[#555555]">Loading gym dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00C853] rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#111111]">{gym?.name || "Gym Admin"}</h1>
                <p className="text-xs text-[#888888]">{gym?.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowQRModal(true)} className="rounded-lg border-[#E5E7EB]">
                <QrCode className="w-4 h-4 mr-2" />
                QR Code
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="text-[#FF3B30] hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-[#E5E7EB] mb-6 p-1 rounded-xl">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#00C853] data-[state=active]:text-white rounded-lg px-4">
              <BarChart3 className="w-4 h-4 mr-2" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-[#00C853] data-[state=active]:text-white rounded-lg px-4">
              <Users className="w-4 h-4 mr-2" /> Members
            </TabsTrigger>
            <TabsTrigger value="announcements" className="data-[state=active]:bg-[#00C853] data-[state=active]:text-white rounded-lg px-4">
              <Megaphone className="w-4 h-4 mr-2" /> Announcements
            </TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-[#00C853] data-[state=active]:text-white rounded-lg px-4">
              <Trophy className="w-4 h-4 mr-2" /> Challenges
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#00C853] data-[state=active]:text-white rounded-lg px-4">
              <Settings className="w-4 h-4 mr-2" /> Manage Gym
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white border-[#E5E7EB] hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#888888]">Total Members</p>
                        <p className="text-3xl font-bold text-[#111111]">{stats?.total_members || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-[#E6F0FF] rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-[#0066FF]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-[#E5E7EB] hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#888888]">Check-ins Today</p>
                        <p className="text-3xl font-bold text-[#111111]">{stats?.checkins_today || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-[#E6F7ED] rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-[#00C853]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-[#E5E7EB] hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#888888]">This Week</p>
                        <p className="text-3xl font-bold text-[#111111]">{stats?.checkins_week || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-[#FFF4E6] rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-[#FF9500]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-[#E5E7EB] hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#888888]">Active Members</p>
                        <p className="text-3xl font-bold text-[#00C853]">{stats?.active_members || 0}</p>
                        <p className="text-xs text-[#FF3B30]">{stats?.inactive_members || 0} inactive</p>
                      </div>
                      <div className="w-12 h-12 bg-[#F0E6FF] rounded-xl flex items-center justify-center">
                        <Activity className="w-6 h-6 text-[#8B5CF6]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border-[#E5E7EB]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-[#111111] text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#00C853]" />
                      Top Members This Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topMembers.length > 0 ? (
                        topMembers.map((m, i) => (
                          <div key={m.user_id} className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-lg hover:bg-[#F0F2F5] transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                i === 0 ? "bg-[#FFD700]" : i === 1 ? "bg-[#C0C0C0]" : i === 2 ? "bg-[#CD7F32]" : "bg-[#0066FF]"
                              }`}>
                                {i + 1}
                              </div>
                              <p className="font-medium text-[#111111]">{m.display_name || m.name}</p>
                            </div>
                            <Badge variant="secondary">{m.checkin_count} check-ins</Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-[#888888] py-6">No check-ins this month yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-[#E5E7EB]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-[#111111] text-lg flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-[#FF9500]" />
                      Active Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {challenges?.filter(c => c.status === "active" || c.status === "upcoming").length > 0 ? (
                        challenges.filter(c => c.status === "active" || c.status === "upcoming").slice(0, 5).map((c) => (
                          <div key={c.challenge_id} className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-lg hover:bg-[#F0F2F5] transition-colors">
                            <div>
                              <p className="font-medium text-[#111111]">{c.name}</p>
                              <p className="text-sm text-[#888888]">{c.entry_fee} coins • {c.participant_count || c.current_participants || 0} joined</p>
                            </div>
                            <Badge variant={c.status === "active" ? "default" : "secondary"}>
                              {c.status}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-[#888888] mb-3">No active challenges</p>
                          <Button onClick={() => setShowChallengeModal(true)} className="bg-[#00C853] hover:bg-[#00A844] rounded-lg">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Challenge
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            <Card className="bg-white border-[#E5E7EB]">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <CardTitle className="text-[#111111]">Gym Members ({members.length})</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                    <Input
                      placeholder="Search members..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="pl-9 w-[250px] bg-[#F8F9FA] border-[#E5E7EB] rounded-lg"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {membersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#00C853] animate-spin" />
                  </div>
                ) : (
                  <div className="rounded-lg border border-[#E5E7EB] overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#F8F9FA]">
                          <TableHead>Member</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Streak</TableHead>
                          <TableHead>Total Sessions</TableHead>
                          <TableHead>Last Check-in</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMembers.map((m) => (
                          <TableRow key={m.user_id || m.id} className="hover:bg-[#F8F9FA]">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#0066FF] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                  {(m.name || "U").charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium">{m.display_name || m.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-[#555555]">{m.email}</TableCell>
                            <TableCell>
                              {m.current_streak > 0 ? (
                                <div className="flex items-center gap-1 text-[#FF9500]">
                                  <Zap className="w-4 h-4" />
                                  <span className="font-medium">{m.current_streak}w</span>
                                </div>
                              ) : (
                                <span className="text-[#888888]">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-[#555555]">{m.total_sessions || 0}</TableCell>
                            <TableCell className="text-[#555555]">
                              {m.last_checkin ? (
                                <div>
                                  <p>{formatDate(m.last_checkin)}</p>
                                  <p className="text-xs text-[#888888]">{formatTime(m.last_checkin)}</p>
                                </div>
                              ) : (
                                <span className="text-[#888888]">Never</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="ghost" onClick={() => handleViewMemberHistory(m)} className="text-[#0066FF]">
                                <Eye className="w-4 h-4 mr-1" /> History
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredMembers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-[#888888] py-8">
                              No members found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges">
            <Card className="bg-white border-[#E5E7EB]">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="text-[#111111]">Gym Challenges ({challenges?.length || 0})</CardTitle>
                  <Button onClick={() => setShowChallengeModal(true)} className="bg-[#00C853] hover:bg-[#00A844] rounded-lg">
                    <Plus className="w-4 h-4 mr-2" /> Create Challenge
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {challengesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#00C853] animate-spin" />
                  </div>
                ) : challenges?.length > 0 ? (
                  <div className="rounded-lg border border-[#E5E7EB] overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#F8F9FA]">
                          <TableHead>Challenge</TableHead>
                          <TableHead>Entry Fee</TableHead>
                          <TableHead>Pool</TableHead>
                          <TableHead>Participants</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {challenges.map((c) => (
                          <TableRow key={c.challenge_id || c.id} className="hover:bg-[#F8F9FA]">
                            <TableCell>
                              <div>
                                <p className="font-medium">{c.name}</p>
                                <p className="text-sm text-[#888888] truncate max-w-[200px]">{c.description}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-[#555555]">{c.entry_fee} coins</TableCell>
                            <TableCell className="text-[#00C853] font-medium">{c.total_pool || 0} coins</TableCell>
                            <TableCell className="text-[#555555]">{c.participant_count || c.current_participants || 0}/{c.max_participants}</TableCell>
                            <TableCell>
                              <Badge variant={c.status === "active" ? "default" : c.status === "upcoming" ? "secondary" : "outline"}>
                                {c.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Trophy className="w-12 h-12 text-[#888888] mx-auto mb-4" />
                    <p className="text-[#888888] mb-4">No challenges yet. Create your first challenge!</p>
                    <Button onClick={() => setShowChallengeModal(true)} className="bg-[#00C853] hover:bg-[#00A844] rounded-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Challenge
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <Card className="bg-white border-[#E5E7EB]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-[#111111]">Gym Announcements</CardTitle>
                    <p className="text-sm text-[#888888] mt-1">
                      Send announcements to all your gym members
                    </p>
                  </div>
                  <Button onClick={() => setShowAnnouncementModal(true)} className="bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg">
                    <Send className="w-4 h-4 mr-2" /> New Announcement
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {announcementsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#7C3AED] animate-spin" />
                  </div>
                ) : announcements?.length > 0 ? (
                  <div className="space-y-4">
                    {announcements.map((ann) => (
                      <div key={ann.announcement_id || ann.id} className="p-4 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3 flex-1">
                            <div className="w-10 h-10 bg-[#F3E8FF] rounded-lg flex items-center justify-center flex-shrink-0">
                              <Megaphone className="w-5 h-5 text-[#7C3AED]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-[#111111]">{ann.title}</h3>
                                <Badge className={`text-xs ${
                                  ann.announcement_type === 'important' ? 'bg-[#FF3B30]/10 text-[#FF3B30]' :
                                  ann.announcement_type === 'event' ? 'bg-[#0066FF]/10 text-[#0066FF]' :
                                  ann.announcement_type === 'promo' ? 'bg-[#00C853]/10 text-[#00C853]' :
                                  'bg-[#888888]/10 text-[#888888]'
                                }`}>
                                  {ann.announcement_type || 'general'}
                                </Badge>
                              </div>
                              <p className="text-[#555555] text-sm mt-1">{ann.message}</p>
                              <p className="text-[#888888] text-xs mt-2">
                                Posted {formatDate(ann.created_at)} by {ann.posted_by_name || 'Admin'}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#888888] hover:text-[#FF3B30] flex-shrink-0"
                            onClick={() => handleDeleteAnnouncement(ann.announcement_id || ann.id)}
                            disabled={deleteAnnouncement.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Megaphone className="w-12 h-12 text-[#888888] mx-auto mb-4" />
                    <p className="text-[#888888] mb-4">No announcements yet. Send your first announcement!</p>
                    <Button onClick={() => setShowAnnouncementModal(true)} className="bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg">
                      <Send className="w-4 h-4 mr-2" />
                      Send Announcement
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab (Manage Gym) */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-[#E5E7EB]">
                <CardHeader>
                  <CardTitle className="text-[#111111]">Gym Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-[#111111]">Gym Name</Label>
                    <Input
                      value={gymSettings.name}
                      onChange={(e) => setGymSettings({ ...gymSettings, name: e.target.value })}
                      className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-[#111111]">Address</Label>
                    <Input
                      value={gymSettings.address}
                      onChange={(e) => setGymSettings({ ...gymSettings, address: e.target.value })}
                      className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-[#111111]">Description</Label>
                    <Textarea
                      value={gymSettings.description}
                      onChange={(e) => setGymSettings({ ...gymSettings, description: e.target.value })}
                      className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2"
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleSaveSettings} disabled={updateSettings.isPending} className="w-full bg-[#00C853] hover:bg-[#00A844] rounded-lg">
                    {updateSettings.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E5E7EB]">
                <CardHeader>
                  <CardTitle className="text-[#111111]">Gym Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-[#F8F9FA] rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#555555]">City</span>
                      <span className="font-medium text-[#111111]">{gym?.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#555555]">QR Code</span>
                      <span className="font-mono text-[#0066FF]">{gym?.qr_code?.slice(0, 12)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#555555]">Verified</span>
                      <Badge variant={gym?.is_verified ? "default" : "secondary"}>
                        {gym?.is_verified ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#555555]">Members</span>
                      <span className="font-medium text-[#111111]">{stats?.total_members}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#555555]">This Month</span>
                      <span className="font-medium text-[#00C853]">{stats?.checkins_month} check-ins</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#111111]">Amenities</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {gym?.amenities?.map((a, i) => (
                        <Badge key={i} variant="secondary">{a}</Badge>
                      ))}
                      {(!gym?.amenities || gym.amenities.length === 0) && (
                        <p className="text-[#888888] text-sm">No amenities listed</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Member History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="bg-white rounded-xl max-w-lg">
          <DialogHeader>
            <DialogTitle>Check-in History</DialogTitle>
            <DialogDescription>
              Member's check-in history at your gym
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {historyLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 text-[#00C853] animate-spin" />
              </div>
            ) : memberHistory?.length > 0 ? (
              memberHistory.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#888888]" />
                    <div>
                      <p className="font-medium text-[#111111]">{formatDate(h.checked_in_at)}</p>
                      <p className="text-sm text-[#888888]">{formatTime(h.checked_in_at)}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{h.workout_type || "General"}</Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-[#888888] py-4">No check-ins found</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowHistoryModal(false); setSelectedMemberId(null); }} className="rounded-lg">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle>Gym QR Code</DialogTitle>
            <DialogDescription>Display at your gym for members to check in</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-48 h-48 bg-[#F8F9FA] border-2 border-dashed border-[#E5E7EB] rounded-xl flex items-center justify-center">
              <div className="text-center">
                <QrCode className="w-16 h-16 text-[#888888] mx-auto mb-2" />
                <p className="text-xs text-[#888888] font-mono">{gym?.qr_code}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-[#555555]">{gym?.name}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQRModal(false)} className="rounded-lg">Close</Button>
            <Button className="bg-[#0066FF] hover:bg-[#0052CC] rounded-lg">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Challenge Modal */}
      <Dialog open={showChallengeModal} onOpenChange={setShowChallengeModal}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle>Create Gym Challenge</DialogTitle>
            <DialogDescription>This challenge will only be for members of {gym?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Challenge Name *</Label>
              <Input
                value={challengeForm.name}
                onChange={(e) => setChallengeForm({ ...challengeForm, name: e.target.value })}
                placeholder="e.g., Weekly Warriors"
                className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2"
              />
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                value={challengeForm.description}
                onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
                placeholder="Describe the challenge..."
                className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Entry Fee</Label>
                <Select value={challengeForm.entry_fee.toString()} onValueChange={(v) => setChallengeForm({ ...challengeForm, entry_fee: parseInt(v) })}>
                  <SelectTrigger className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 coins</SelectItem>
                    <SelectItem value="200">200 coins</SelectItem>
                    <SelectItem value="500">500 coins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Goal</Label>
                <Select value={challengeForm.goal_count.toString()} onValueChange={(v) => setChallengeForm({ ...challengeForm, goal_count: parseInt(v) })}>
                  <SelectTrigger className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 check-ins</SelectItem>
                    <SelectItem value="8">8 check-ins</SelectItem>
                    <SelectItem value="12">12 check-ins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Duration</Label>
                <Select value={challengeForm.duration} onValueChange={(v) => setChallengeForm({ ...challengeForm, duration: v })}>
                  <SelectTrigger className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">1 Week</SelectItem>
                    <SelectItem value="2weeks">2 Weeks</SelectItem>
                    <SelectItem value="month">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChallengeModal(false)} className="rounded-lg">Cancel</Button>
            <Button onClick={handleCreateChallenge} disabled={createChallenge.isPending} className="bg-[#00C853] hover:bg-[#00A844] rounded-lg">
              {createChallenge.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Challenge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Announcement Modal */}
      <Dialog open={showAnnouncementModal} onOpenChange={setShowAnnouncementModal}>
        <DialogContent className="bg-white border-[#E5E7EB] rounded-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#111111]">
              <Megaphone className="w-5 h-5 text-[#7C3AED]" />
              New Announcement
            </DialogTitle>
            <DialogDescription className="text-[#555555]">
              This announcement will be visible to all members registered at your gym.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-[#111111]">Title *</Label>
              <Input
                placeholder="e.g., New Year Special Offer!"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2"
              />
            </div>
            <div>
              <Label className="text-[#111111]">Message *</Label>
              <Textarea
                placeholder="Write your announcement message..."
                value={announcementForm.message}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2 min-h-[100px]"
              />
            </div>
            <div>
              <Label className="text-[#111111]">Type</Label>
              <Select
                value={announcementForm.type}
                onValueChange={(v) => setAnnouncementForm({ ...announcementForm, type: v })}
              >
                <SelectTrigger className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="promo">Promotion</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAnnouncementModal(false)} className="rounded-lg">
              Cancel
            </Button>
            <Button
              onClick={handleSendAnnouncement}
              disabled={sendAnnouncement.isPending}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg"
            >
              {sendAnnouncement.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Announcement
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
