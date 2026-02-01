import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Switch } from "@/components/ui/switch";
import {
  useCurrentUser,
  useAdminAnalytics,
  useAdminUsers,
  useAdminGyms,
  useAdminChallenges,
  useAdminConfig,
  useAdminTransactions,
  useAdminBadges,
  useAdminAuditLogs,
  useBanUser,
  useUnbanUser,
  useUpdateUserRole,
  useDeleteAdminUser,
  useCreateAdminGym,
  useVerifyGym,
  useDeleteAdminGym,
  useSetGymOwner,
  useCreateAdminChallenge,
  useCancelChallenge,
  useRefundChallenge,
  useUpdateConfig,
  useAdminFeedback,
  useAdminFeedbackStats,
  useUpdateFeedback,
  useDeleteFeedback,
} from "@/hooks";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminLogin } from "@/components/admin/AdminLogin";
import {
  Users,
  Building2,
  Trophy,
  Settings,
  BarChart3,
  DollarSign,
  Shield,
  LogOut,
  Search,
  Ban,
  UserCog,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Zap,
  Loader2,
  TrendingUp,
  Crown,
  ChevronRight,
  Activity,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Mail,
  MapPin,
  Globe,
  ToggleLeft,
  Award,
  Coins,
  FileText,
  Clock,
  MessageSquare,
  Bug,
  Lightbulb,
  Gift,
} from "lucide-react";
import { auth } from "@/lib/supabase";

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, subValue, trend, trendUp, color, gradient }) => (
  <Card className="card-premium hover:shadow-lg transition-all">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: gradient || `${color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color: gradient ? 'white' : color }} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full ${
            trendUp ? 'bg-[#E6FFF5] text-[#00C853]' : 'bg-[#FFF5F5] text-[#FF3B30]'
          }`}>
            {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend}
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

// User Row Component
const UserRow = ({ user, onBan, onUnban, onChangeRole, onDelete, gyms }) => (
  <div className="flex items-center gap-4 p-4 bg-[#F8F9FA] rounded-xl hover:bg-[#F0F2F5] transition-colors">
    <Avatar className="h-10 w-10 border border-[#E5E7EB]">
      <AvatarImage src={user.picture} />
      <AvatarFallback className="bg-[#0066FF] text-white font-semibold">
        {(user.name || 'U').charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="font-medium text-[#111111] truncate">{user.display_name || user.name || 'Unknown'}</p>
        {user.role === 'super_admin' && (
          <Crown className="w-4 h-4 text-[#FFD700]" />
        )}
      </div>
      <p className="text-sm text-[#888888] truncate">{user.email}</p>
    </div>
    <div className="hidden sm:block text-right min-w-[100px]">
      <p className="text-sm text-[#555555]">{user.gym_name || '-'}</p>
    </div>
    <div className="min-w-[80px]">
      <Badge variant={user.role === 'super_admin' ? 'destructive' : user.role === 'gym_admin' ? 'default' : 'secondary'}>
        {user.role}
      </Badge>
    </div>
    <div className="min-w-[70px]">
      {user.is_banned ? (
        <Badge variant="destructive">Banned</Badge>
      ) : (
        <Badge variant="outline" className="text-[#00C853] border-[#00C853]">Active</Badge>
      )}
    </div>
    {user.role !== 'super_admin' && (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" onClick={() => onChangeRole(user)} className="h-8 w-8 p-0" title="Change Role">
          <UserCog className="w-4 h-4 text-[#555555]" />
        </Button>
        {user.is_banned ? (
          <Button size="sm" variant="ghost" onClick={() => onUnban(user.user_id)} className="h-8 w-8 p-0" title="Unban">
            <CheckCircle className="w-4 h-4 text-[#00C853]" />
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => onBan(user)} className="h-8 w-8 p-0" title="Ban">
            <Ban className="w-4 h-4 text-[#FF9500]" />
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => onDelete(user.user_id)} className="h-8 w-8 p-0" title="Delete">
          <Trash2 className="w-4 h-4 text-[#FF3B30]" />
        </Button>
      </div>
    )}
  </div>
);

// Gym Row Component
const GymRow = ({ gym, owner, onVerify, onSetOwner, onDelete }) => (
  <div className="flex items-center gap-4 p-4 bg-[#F8F9FA] rounded-xl hover:bg-[#F0F2F5] transition-colors">
    <div className="w-10 h-10 bg-[#E6F0FF] rounded-xl flex items-center justify-center">
      <Building2 className="w-5 h-5 text-[#0066FF]" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-[#111111] truncate">{gym.name}</p>
      <p className="text-sm text-[#888888] flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        {gym.city}
      </p>
    </div>
    <div className="hidden md:block text-right min-w-[80px]">
      <p className="text-sm font-medium text-[#111111]">{gym.member_count || 0}</p>
      <p className="text-xs text-[#888888]">members</p>
    </div>
    <div className="min-w-[120px]">
      {owner ? (
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-[#FFD700]" />
          <span className="text-sm text-[#555555] truncate">{owner.display_name || owner.name || owner.email}</span>
        </div>
      ) : (
        <span className="text-sm text-[#888888]">No owner</span>
      )}
    </div>
    <div className="min-w-[80px]">
      {gym.is_verified ? (
        <Badge variant="outline" className="text-[#00C853] border-[#00C853]">Verified</Badge>
      ) : (
        <Badge variant="secondary">Unverified</Badge>
      )}
    </div>
    <div className="flex gap-1">
      <Button size="sm" variant="ghost" onClick={() => onSetOwner(gym)} className="h-8 w-8 p-0" title="Set Owner">
        <Crown className="w-4 h-4 text-[#FFD700]" />
      </Button>
      {gym.is_verified ? (
        <Button size="sm" variant="ghost" onClick={() => onVerify(gym.id, false)} className="h-8 w-8 p-0" title="Unverify">
          <XCircle className="w-4 h-4 text-[#FF9500]" />
        </Button>
      ) : (
        <Button size="sm" variant="ghost" onClick={() => onVerify(gym.id, true)} className="h-8 w-8 p-0" title="Verify">
          <CheckCircle className="w-4 h-4 text-[#00C853]" />
        </Button>
      )}
      <Button size="sm" variant="ghost" onClick={() => onDelete(gym.id)} className="h-8 w-8 p-0" title="Delete">
        <Trash2 className="w-4 h-4 text-[#FF3B30]" />
      </Button>
    </div>
  </div>
);

const ITEMS_PER_PAGE = 10;

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Filter states
  const [userSearch, setUserSearch] = useState("");
  const [gymSearch, setGymSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [challengeStatusFilter, setChallengeStatusFilter] = useState("all");

  // Pagination states
  const [usersPage, setUsersPage] = useState(1);
  const [gymsPage, setGymsPage] = useState(1);
  const [challengesPage, setChallengesPage] = useState(1);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [auditPage, setAuditPage] = useState(1);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [feedbackTypeFilter, setFeedbackTypeFilter] = useState("all");
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState("all");

  // Modal states
  const [showBanModal, setShowBanModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showGymModal, setShowGymModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGym, setSelectedGym] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [assignGymId, setAssignGymId] = useState("");
  const [assignOwnerId, setAssignOwnerId] = useState("");

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
    variant: "default",
    isLoading: false,
  });

  // Form states
  const [gymForm, setGymForm] = useState({
    name: "", address: "", city: "", latitude: "", longitude: "", amenities: []
  });
  const [challengeForm, setChallengeForm] = useState({
    name: "", description: "", entry_fee: 100, goal_count: 12, duration: "month",
    start_date: "" // User selects future start date
  });

  // Helper to calculate end date from start date + duration
  const getEndDate = (startDate, duration) => {
    if (!startDate) return null;
    const end = new Date(startDate);
    if (duration === "week") end.setDate(end.getDate() + 7);
    else if (duration === "2weeks") end.setDate(end.getDate() + 14);
    else end.setMonth(end.getMonth() + 1);
    return end;
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Format date for display
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format short date (for list display)
  const formatShortDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calculate days until/since a date
  const getDaysUntil = (dateStr) => {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const [configForm, setConfigForm] = useState(null);
  const [newCity, setNewCity] = useState("");

  // React Query hooks
  const { user, isLoading: userLoading, isAuthenticated } = useCurrentUser();
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();
  const {
    data: usersData,
    isLoading: usersLoading,
    isFetching: usersFetching
  } = useAdminUsers({
    limit: ITEMS_PER_PAGE,
    skip: (usersPage - 1) * ITEMS_PER_PAGE,
    search: userSearch,
    role: selectedRole !== "all" ? selectedRole : undefined,
  });
  const {
    data: gymsData,
    isLoading: gymsLoading,
    isFetching: gymsFetching
  } = useAdminGyms({
    limit: ITEMS_PER_PAGE,
    skip: (gymsPage - 1) * ITEMS_PER_PAGE,
    search: gymSearch,
  });
  const {
    data: challengesData,
    isLoading: challengesLoading,
    isFetching: challengesFetching
  } = useAdminChallenges({
    limit: ITEMS_PER_PAGE,
    skip: (challengesPage - 1) * ITEMS_PER_PAGE,
    status: challengeStatusFilter !== "all" ? challengeStatusFilter : "",
  });
  const { data: config, isLoading: configLoading } = useAdminConfig();
  const {
    data: transactionsData,
    isFetching: transactionsFetching
  } = useAdminTransactions({
    limit: ITEMS_PER_PAGE,
    skip: (transactionsPage - 1) * ITEMS_PER_PAGE,
  });
  const { data: badges = [] } = useAdminBadges();
  const {
    data: auditData,
    isLoading: auditLoading,
    isFetching: auditFetching,
  } = useAdminAuditLogs({
    limit: ITEMS_PER_PAGE,
    skip: (auditPage - 1) * ITEMS_PER_PAGE,
  });
  const {
    data: feedbackData,
    isLoading: feedbackLoading,
    isFetching: feedbackFetching,
  } = useAdminFeedback({
    limit: ITEMS_PER_PAGE,
    skip: (feedbackPage - 1) * ITEMS_PER_PAGE,
    type: feedbackTypeFilter !== "all" ? feedbackTypeFilter : undefined,
    status: feedbackStatusFilter !== "all" ? feedbackStatusFilter : undefined,
  });
  const { data: feedbackStats } = useAdminFeedbackStats();

  // Extract data and totals from paginated responses
  const users = usersData?.users || usersData || [];
  const usersTotal = usersData?.total || users.length;
  const gyms = gymsData?.gyms || gymsData || [];
  const gymsTotal = gymsData?.total || gyms.length;
  const challenges = challengesData?.challenges || challengesData || [];
  const challengesTotal = challengesData?.total || challenges.length;
  const transactions = transactionsData?.transactions || transactionsData || [];
  const transactionsTotal = transactionsData?.total || transactions.length;
  const auditLogs = auditData?.logs || auditData || [];
  const auditTotal = auditData?.total || auditLogs.length;
  const feedbackList = feedbackData?.feedback || [];
  const feedbackTotal = feedbackData?.total || feedbackList.length;

  // Mutations
  const banUser = useBanUser();
  const unbanUser = useUnbanUser();
  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteAdminUser();
  const createGym = useCreateAdminGym();
  const verifyGym = useVerifyGym();
  const deleteGym = useDeleteAdminGym();
  const setGymOwner = useSetGymOwner();
  const createChallenge = useCreateAdminChallenge();
  const cancelChallenge = useCancelChallenge();
  const refundChallenge = useRefundChallenge();
  const updateConfig = useUpdateConfig();
  const updateFeedback = useUpdateFeedback();
  const deleteFeedback = useDeleteFeedback();

  // Initialize config form when config loads
  useEffect(() => {
    if (config && !configForm) {
      setConfigForm({
        platform_fee_percentage: config.platform_fee_percentage || 10,
        cities: config.cities || [],
        feature_flags: config.feature_flags || {}
      });
    }
  }, [config, configForm]);

  // Reset pagination when filters change
  useEffect(() => {
    setUsersPage(1);
  }, [userSearch, selectedRole]);

  useEffect(() => {
    setGymsPage(1);
  }, [gymSearch]);

  const isLoading = userLoading || analyticsLoading;

  // Check if user is super_admin - redirect unauthorized users
  useEffect(() => {
    if (!userLoading && user && user.role !== 'super_admin') {
      toast.error('Access denied. Super admin only.');
      navigate('/');
    }
  }, [userLoading, user, navigate]);

  // Show loading while checking auth
  if (userLoading || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-[#8B5CF6] animate-spin" />
            <span className="text-[#555555] font-medium">Checking authorization...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (isAuthenticated === false) {
    return <AdminLogin title="Super Admin" subtitle="Sign in to access the Super Admin dashboard" />;
  }

  // Still loading user profile
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-[#8B5CF6] animate-spin" />
            <span className="text-[#555555] font-medium">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if wrong role (useEffect will redirect)
  if (user.role !== 'super_admin') {
    return null;
  }

  // Handlers
  const handleBanUser = () => {
    if (!selectedUser || !banReason) return;
    banUser.mutate({ userId: selectedUser.user_id, reason: banReason }, {
      onSuccess: () => {
        setShowBanModal(false);
        setBanReason("");
        setSelectedUser(null);
      }
    });
  };

  const handleUnbanUser = (userId) => unbanUser.mutate(userId);

  const handleUpdateRole = () => {
    if (!selectedUser) return;
    updateRole.mutate({
      userId: selectedUser.user_id,
      role: newRole,
      managedGymId: newRole === "gym_admin" ? assignGymId : null
    }, {
      onSuccess: () => {
        setShowRoleModal(false);
        setNewRole("user");
        setAssignGymId("");
        setSelectedUser(null);
      }
    });
  };

  const handleDeleteUser = (userId) => {
    setConfirmDialog({
      open: true,
      title: "Delete User",
      description: "Are you sure you want to delete this user permanently? This action cannot be undone.",
      variant: "destructive",
      isLoading: false,
      onConfirm: () => {
        setConfirmDialog(prev => ({ ...prev, isLoading: true }));
        deleteUser.mutate(userId, {
          onSuccess: () => setConfirmDialog(prev => ({ ...prev, open: false })),
          onError: () => setConfirmDialog(prev => ({ ...prev, isLoading: false })),
        });
      },
    });
  };

  const handleCreateGym = () => {
    if (!gymForm.name || !gymForm.city) {
      toast.error("Name and city are required");
      return;
    }
    const lat = parseFloat(gymForm.latitude);
    const lng = parseFloat(gymForm.longitude);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error("Valid latitude (-90 to 90) and longitude (-180 to 180) are required");
      return;
    }
    createGym.mutate({
      ...gymForm,
      latitude: lat,
      longitude: lng
    }, {
      onSuccess: () => {
        setShowGymModal(false);
        setGymForm({ name: "", address: "", city: "", latitude: "", longitude: "", amenities: [] });
      }
    });
  };

  const handleVerifyGym = (gymId, verify) => verifyGym.mutate({ gymId, verify });

  const handleDeleteGym = (gymId) => {
    setConfirmDialog({
      open: true,
      title: "Delete Gym",
      description: "Are you sure you want to delete this gym? All associated data will be removed.",
      variant: "destructive",
      isLoading: false,
      onConfirm: () => {
        setConfirmDialog(prev => ({ ...prev, isLoading: true }));
        deleteGym.mutate(gymId, {
          onSuccess: () => setConfirmDialog(prev => ({ ...prev, open: false })),
          onError: () => setConfirmDialog(prev => ({ ...prev, isLoading: false })),
        });
      },
    });
  };

  const handleSetGymOwner = () => {
    if (!selectedGym) return;
    setGymOwner.mutate({ gymId: selectedGym.id, ownerId: assignOwnerId || null }, {
      onSuccess: () => {
        setShowOwnerModal(false);
        setSelectedGym(null);
        setAssignOwnerId("");
      }
    });
  };

  const handleCreateChallenge = () => {
    if (!challengeForm.name || !challengeForm.description) {
      toast.error("Name and description are required");
      return;
    }
    if (!challengeForm.start_date) {
      toast.error("Start date is required");
      return;
    }

    const startDate = new Date(challengeForm.start_date);
    const endDate = getEndDate(challengeForm.start_date, challengeForm.duration);

    // Only send fields the backend expects (AdminChallengeCreate model)
    const challengePayload = {
      name: challengeForm.name,
      description: challengeForm.description,
      entry_fee: challengeForm.entry_fee,
      goal_count: challengeForm.goal_count,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      min_participants: 5,
      max_participants: 100
    };

    createChallenge.mutate(challengePayload, {
      onSuccess: () => {
        setShowChallengeModal(false);
        setChallengeForm({ name: "", description: "", entry_fee: 100, goal_count: 12, duration: "month", start_date: "" });
      }
    });
  };

  const handleCancelChallenge = (challengeId) => {
    setConfirmDialog({
      open: true,
      title: "Cancel Challenge",
      description: "Are you sure you want to cancel this challenge? Participants will need to be refunded separately.",
      variant: "destructive",
      isLoading: false,
      onConfirm: () => {
        setConfirmDialog(prev => ({ ...prev, isLoading: true }));
        cancelChallenge.mutate(challengeId, {
          onSuccess: () => setConfirmDialog(prev => ({ ...prev, open: false })),
          onError: () => setConfirmDialog(prev => ({ ...prev, isLoading: false })),
        });
      },
    });
  };

  const handleRefundChallenge = (challengeId) => {
    setConfirmDialog({
      open: true,
      title: "Refund Participants",
      description: "Are you sure you want to refund all participants? This will return coins to their accounts.",
      variant: "default",
      isLoading: false,
      onConfirm: () => {
        setConfirmDialog(prev => ({ ...prev, isLoading: true }));
        refundChallenge.mutate(challengeId, {
          onSuccess: () => setConfirmDialog(prev => ({ ...prev, open: false })),
          onError: () => setConfirmDialog(prev => ({ ...prev, isLoading: false })),
        });
      },
    });
  };

  const handleSaveConfig = () => {
    if (!configForm) return;
    updateConfig.mutate(configForm);
  };

  const handleAddCity = () => {
    if (newCity && configForm && !configForm.cities.includes(newCity)) {
      setConfigForm({ ...configForm, cities: [...configForm.cities, newCity] });
      setNewCity("");
    }
  };

  const handleRemoveCity = (city) => {
    if (configForm) {
      setConfigForm({ ...configForm, cities: configForm.cities.filter(c => c !== city) });
    }
  };

  const toggleFeatureFlag = (key) => {
    if (configForm) {
      setConfigForm({
        ...configForm,
        feature_flags: { ...configForm.feature_flags, [key]: !configForm.feature_flags[key] }
      });
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-[#8B5CF6] animate-spin" />
            <span className="text-[#555555] font-medium">Loading admin dashboard...</span>
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
              <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#111111]">Super Admin</h1>
                <p className="text-xs text-[#888888]">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate('/')} className="border-[#E5E7EB] rounded-xl hidden sm:flex">
                <Eye className="w-4 h-4 mr-2" />
                View App
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="text-[#FF3B30] hover:bg-red-50 rounded-xl">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <TabsList className="bg-white border border-[#E5E7EB] p-1 rounded-xl inline-flex min-w-max">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white rounded-lg px-4">
                <BarChart3 className="w-4 h-4 mr-2" /> Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white rounded-lg px-4">
                <Users className="w-4 h-4 mr-2" /> Users
              </TabsTrigger>
              <TabsTrigger value="gyms" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white rounded-lg px-4">
                <Building2 className="w-4 h-4 mr-2" /> Gyms
              </TabsTrigger>
              <TabsTrigger value="challenges" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white rounded-lg px-4">
                <Trophy className="w-4 h-4 mr-2" /> Challenges
              </TabsTrigger>
              <TabsTrigger value="finance" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white rounded-lg px-4">
                <Coins className="w-4 h-4 mr-2" /> Coins
              </TabsTrigger>
              <TabsTrigger value="config" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white rounded-lg px-4">
                <Settings className="w-4 h-4 mr-2" /> Config
              </TabsTrigger>
              <TabsTrigger value="audit" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white rounded-lg px-4">
                <FileText className="w-4 h-4 mr-2" /> Audit Log
              </TabsTrigger>
              <TabsTrigger value="feedback" className="data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white rounded-lg px-4">
                <MessageSquare className="w-4 h-4 mr-2" /> Feedback
                {feedbackStats?.by_status?.pending > 0 && (
                  <span className="ml-1 bg-[#FF3B30] text-white text-xs px-1.5 py-0.5 rounded-full">
                    {feedbackStats.by_status.pending}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Users}
                label="Total Users"
                value={analytics?.users?.total || 0}
                subValue={`+${analytics?.users?.new_7d || 0} this week`}
                trend={`+${analytics?.users?.new_7d || 0}`}
                trendUp={true}
                gradient="linear-gradient(135deg, #0066FF, #0052CC)"
              />
              <StatCard
                icon={Activity}
                label="Active Users"
                value={analytics?.users?.active_30d || 0}
                subValue={`${analytics?.users?.total > 0 ? Math.round((analytics?.users?.active_30d / analytics?.users?.total) * 100) : 0}% of total`}
                color="#00C853"
              />
              <StatCard
                icon={Zap}
                label="Today's Check-ins"
                value={analytics?.checkins?.today || 0}
                subValue={`${analytics?.checkins?.last_7d || 0} this week`}
                color="#FF9500"
              />
              <StatCard
                icon={Trophy}
                label="Scheduled Challenges"
                value={(analytics?.challenges?.upcoming || 0) + (analytics?.challenges?.active || 0)}
                subValue={`${analytics?.challenges?.upcoming || 0} upcoming • ${analytics?.challenges?.active || 0} active`}
                gradient="linear-gradient(135deg, #8B5CF6, #7C3AED)"
              />
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-r from-[#FFB80010] to-[#FFB80005] border border-[#FFB80030] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Coins className="w-4 h-4 text-[#FFB800]" />
                  <span className="text-sm text-[#888888]">Coins in Circulation</span>
                </div>
                <p className="text-xl font-bold text-[#111111]">{(analytics?.coins?.in_circulation || 0).toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-[#8B5CF610] to-[#8B5CF605] border border-[#8B5CF630] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="text-sm text-[#888888]">Reserve Pool</span>
                </div>
                <p className="text-xl font-bold text-[#111111]">{(analytics?.coins?.reserve_pool || 0).toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-[#00C85310] to-[#00C85305] border border-[#00C85330] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-[#00C853]" />
                  <span className="text-sm text-[#888888]">Verified Gyms</span>
                </div>
                <p className="text-xl font-bold text-[#111111]">{analytics?.gyms?.verified || 0} / {analytics?.gyms?.total || 0}</p>
              </div>
              <div className="bg-gradient-to-r from-[#0066FF10] to-[#0066FF05] border border-[#0066FF30] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4 text-[#0066FF]" />
                  <span className="text-sm text-[#888888]">Total Participations</span>
                </div>
                <p className="text-xl font-bold text-[#111111]">{(analytics?.challenges?.total_participants || 0).toLocaleString()}</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="card-premium">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-[#111111]">Recent Users</h2>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('users')} className="text-[#8B5CF6]">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((u) => (
                      <div key={u.user_id} className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-xl">
                        <Avatar className="h-10 w-10 border border-[#E5E7EB]">
                          <AvatarImage src={u.picture} />
                          <AvatarFallback className="bg-[#0066FF] text-white font-semibold">
                            {(u.name || "U").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#111111] truncate">{u.display_name || u.name}</p>
                          <p className="text-sm text-[#888888] truncate">{u.email}</p>
                        </div>
                        <Badge variant={u.role === "super_admin" ? "destructive" : u.role === "gym_admin" ? "default" : "secondary"}>
                          {u.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-premium">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-[#111111]">Active Challenges</h2>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('challenges')} className="text-[#8B5CF6]">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {challenges.filter(c => c.status === 'active').slice(0, 5).map((c) => (
                      <div key={c.challenge_id} className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FF9500] rounded-xl flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-[#111111]">{c.name}</p>
                            <p className="text-sm text-[#888888]">{c.entry_fee} coins • {c.current_participants} joined</p>
                          </div>
                        </div>
                        <p className="text-[#00C853] font-semibold">{c.total_pool} coins</p>
                      </div>
                    ))}
                    {challenges.filter(c => c.status === 'active').length === 0 && (
                      <p className="text-center text-[#888888] py-8">No active challenges</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="card-premium cursor-pointer hover:shadow-md transition-all group" onClick={() => setShowGymModal(true)}>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-[#E6F0FF] rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#0066FF] transition-colors">
                    <Building2 className="w-6 h-6 text-[#0066FF] group-hover:text-white transition-colors" />
                  </div>
                  <p className="font-medium text-[#111111]">Add Gym</p>
                </CardContent>
              </Card>
              <Card className="card-premium cursor-pointer hover:shadow-md transition-all group" onClick={() => setShowChallengeModal(true)}>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-[#FFF8E6] rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#FFB800] transition-colors">
                    <Trophy className="w-6 h-6 text-[#FFB800] group-hover:text-white transition-colors" />
                  </div>
                  <p className="font-medium text-[#111111]">Create Challenge</p>
                </CardContent>
              </Card>
              <Card className="card-premium cursor-pointer hover:shadow-md transition-all group" onClick={() => setActiveTab('users')}>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-[#E6FFF5] rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#00C853] transition-colors">
                    <Users className="w-6 h-6 text-[#00C853] group-hover:text-white transition-colors" />
                  </div>
                  <p className="font-medium text-[#111111]">Manage Users</p>
                </CardContent>
              </Card>
              <Card className="card-premium cursor-pointer hover:shadow-md transition-all group" onClick={() => setActiveTab('config')}>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-[#F0E6FF] rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#8B5CF6] transition-colors">
                    <Settings className="w-6 h-6 text-[#8B5CF6] group-hover:text-white transition-colors" />
                  </div>
                  <p className="font-medium text-[#111111]">Settings</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <Card className="card-premium">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  <h2 className="text-lg font-semibold text-[#111111]">User Management ({usersTotal})</h2>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                      <Input
                        placeholder="Search..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-9 w-[180px] bg-[#F8F9FA] border-[#E5E7EB] rounded-lg"
                      />
                    </div>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-[130px] bg-[#F8F9FA] border-[#E5E7EB] rounded-lg">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="gym_admin">Gym Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  {usersLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 text-[#8B5CF6] animate-spin" />
                    </div>
                  ) : users.length === 0 ? (
                    <p className="text-center text-[#888888] py-8">No users found</p>
                  ) : (
                    users.map((u) => (
                      <UserRow
                        key={u.user_id}
                        user={u}
                        gyms={gyms}
                        onBan={(user) => { setSelectedUser(user); setShowBanModal(true); }}
                        onUnban={handleUnbanUser}
                        onChangeRole={(user) => { setSelectedUser(user); setNewRole(user.role); setAssignGymId(user.managed_gym_id || ""); setShowRoleModal(true); }}
                        onDelete={handleDeleteUser}
                      />
                    ))
                  )}
                </div>
                {usersTotal > ITEMS_PER_PAGE && (
                  <div className="mt-4">
                    <AdminPagination
                      currentPage={usersPage}
                      totalPages={Math.ceil(usersTotal / ITEMS_PER_PAGE)}
                      totalItems={usersTotal}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setUsersPage}
                      isLoading={usersFetching}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gyms Tab */}
          <TabsContent value="gyms" className="mt-6">
            <Card className="card-premium">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  <h2 className="text-lg font-semibold text-[#111111]">Gym Management ({gymsTotal})</h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                      <Input
                        placeholder="Search gyms..."
                        value={gymSearch}
                        onChange={(e) => setGymSearch(e.target.value)}
                        className="pl-9 w-[180px] bg-[#F8F9FA] border-[#E5E7EB] rounded-lg"
                      />
                    </div>
                    <Button onClick={() => setShowGymModal(true)} className="bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl">
                      <Plus className="w-4 h-4 mr-2" /> Add Gym
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {gymsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 text-[#8B5CF6] animate-spin" />
                    </div>
                  ) : gyms.length === 0 ? (
                    <p className="text-center text-[#888888] py-8">No gyms found</p>
                  ) : (
                    gyms.map((g) => {
                      const owner = g.owner_id ? users.find(u => u.user_id === g.owner_id || u.id === g.owner_id) : null;
                      return (
                        <GymRow
                          key={g.id}
                          gym={g}
                          owner={owner}
                          onVerify={handleVerifyGym}
                          onSetOwner={(gym) => { setSelectedGym(gym); setAssignOwnerId(gym.owner_id || ""); setShowOwnerModal(true); }}
                          onDelete={handleDeleteGym}
                        />
                      );
                    })
                  )}
                </div>
                {gymsTotal > ITEMS_PER_PAGE && (
                  <div className="mt-4">
                    <AdminPagination
                      currentPage={gymsPage}
                      totalPages={Math.ceil(gymsTotal / ITEMS_PER_PAGE)}
                      totalItems={gymsTotal}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setGymsPage}
                      isLoading={gymsFetching}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="mt-6">
            <Card className="card-premium">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-lg font-semibold text-[#111111]">Challenge Management ({challengesTotal})</h2>
                  <Button onClick={() => setShowChallengeModal(true)} className="bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl">
                    <Plus className="w-4 h-4 mr-2" /> Create Global Challenge
                  </Button>
                </div>
                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { value: "all", label: "All" },
                    { value: "upcoming", label: "Upcoming", color: "#0066FF" },
                    { value: "active", label: "Active", color: "#FFB800" },
                    { value: "completed", label: "Completed", color: "#00C853" },
                    { value: "cancelled", label: "Cancelled", color: "#FF3B30" },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => {
                        setChallengeStatusFilter(filter.value);
                        setChallengesPage(1); // Reset to page 1 when filter changes
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        challengeStatusFilter === filter.value
                          ? filter.color
                            ? `bg-[${filter.color}] text-white`
                            : "bg-[#111111] text-white"
                          : "bg-[#F0F2F5] text-[#555555] hover:bg-[#E5E7EB]"
                      }`}
                      style={challengeStatusFilter === filter.value && filter.color ? { backgroundColor: filter.color } : {}}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  {challengesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 text-[#8B5CF6] animate-spin" />
                    </div>
                  ) : challenges.length === 0 ? (
                    <p className="text-center text-[#888888] py-8">No challenges found</p>
                  ) : (
                    challenges.map((c) => {
                      const daysUntilStart = getDaysUntil(c.start_date);
                      const daysUntilEnd = getDaysUntil(c.end_date);
                      return (
                        <div key={c.challenge_id} className="flex items-center gap-4 p-4 bg-[#F8F9FA] rounded-xl hover:bg-[#F0F2F5] transition-colors">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            c.status === 'active' ? 'bg-gradient-to-br from-[#FFD700] to-[#FF9500]' :
                            c.status === 'completed' ? 'bg-[#00C853]' : 'bg-[#E5E7EB]'
                          }`}>
                            <Trophy className={`w-5 h-5 ${c.status === 'active' || c.status === 'completed' ? 'text-white' : 'text-[#888888]'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#111111]">{c.name}</p>
                            <div className="flex items-center gap-2 text-sm text-[#888888]">
                              <span className="truncate max-w-[200px]">{c.description}</span>
                              {c.start_date && (
                                <span className="flex items-center gap-1 text-xs shrink-0">
                                  <Calendar className="w-3 h-3" />
                                  {formatShortDate(c.start_date)} - {formatShortDate(c.end_date)}
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Countdown/Status Indicator */}
                          <div className="hidden md:block text-center min-w-[80px]">
                            {c.status === 'upcoming' && daysUntilStart !== null && (
                              <div className="text-xs">
                                <p className="font-semibold text-[#0066FF]">
                                  {daysUntilStart <= 0 ? 'Starting...' : `${daysUntilStart}d`}
                                </p>
                                <p className="text-[#888888]">{daysUntilStart > 0 ? 'to start' : ''}</p>
                              </div>
                            )}
                            {c.status === 'active' && daysUntilEnd !== null && (
                              <div className="text-xs">
                                <p className="font-semibold text-[#FF9500]">
                                  {daysUntilEnd <= 0 ? 'Ending...' : `${daysUntilEnd}d`}
                                </p>
                                <p className="text-[#888888]">{daysUntilEnd > 0 ? 'remaining' : ''}</p>
                              </div>
                            )}
                          </div>
                          <div className="hidden sm:block text-right">
                            <Badge variant={c.gym_id ? "secondary" : "outline"}>{c.gym_id ? "Gym" : "Global"}</Badge>
                          </div>
                          <div className="text-right min-w-[90px]">
                            <p className="font-medium text-[#111111] flex items-center justify-end gap-1">
                              <Coins className="w-3.5 h-3.5 text-[#FFB800]" />
                              {c.entry_fee}
                            </p>
                            <p className="text-xs text-[#888888]">{c.current_participants} joined</p>
                          </div>
                          <div className="text-right min-w-[90px]">
                            <p className="font-semibold text-[#00C853] flex items-center justify-end gap-1">
                              <Coins className="w-3.5 h-3.5" />
                              {c.total_pool}
                            </p>
                            <p className="text-xs text-[#888888]">pool</p>
                          </div>
                          <Badge variant={c.status === "active" ? "default" : c.status === "upcoming" ? "secondary" : c.status === "cancelled" ? "destructive" : "outline"}>
                            {c.status}
                          </Badge>
                          {c.status !== "cancelled" && c.status !== "completed" && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleCancelChallenge(c.challenge_id)} className="h-8 w-8 p-0" title="Cancel">
                                <XCircle className="w-4 h-4 text-[#FF9500]" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleRefundChallenge(c.challenge_id)} className="h-8 w-8 p-0" title="Refund">
                                <RefreshCw className="w-4 h-4 text-[#0066FF]" />
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
                {challengesTotal > ITEMS_PER_PAGE && (
                  <div className="mt-4">
                    <AdminPagination
                      currentPage={challengesPage}
                      totalPages={Math.ceil(challengesTotal / ITEMS_PER_PAGE)}
                      totalItems={challengesTotal}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setChallengesPage}
                      isLoading={challengesFetching}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coins Economy Tab (renamed from Finance) */}
          <TabsContent value="finance" className="mt-6 space-y-6">
            {/* Coins Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Coins}
                label="Total Staked"
                value={analytics?.challenges?.total_pool || 0}
                subValue="coins in active challenges"
                gradient="linear-gradient(135deg, #FFB800, #FF9500)"
              />
              <StatCard
                icon={Trophy}
                label="Active Challenges"
                value={analytics?.challenges?.active || 0}
                subValue={`${analytics?.challenges?.total || 0} total created`}
                color="#8B5CF6"
              />
              <StatCard
                icon={Users}
                label="Challenge Participants"
                value={transactionsTotal || 0}
                subValue="total participations"
                color="#0066FF"
              />
              <StatCard
                icon={Target}
                label="Avg Entry Fee"
                value={challenges.length > 0 ? Math.round(challenges.reduce((acc, c) => acc + (c.entry_fee || 0), 0) / challenges.length) : 0}
                subValue="coins per challenge"
                color="#00C853"
              />
            </div>

            {/* Challenge Participation History */}
            <Card className="card-premium">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#111111]">
                    Challenge Participations {transactionsTotal > 0 && `(${transactionsTotal})`}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-[#888888]">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#00C853]"></div>
                      Completed
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#0066FF]"></div>
                      Refunded
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#888888]"></div>
                      Pending
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {transactions.length === 0 ? (
                    <div className="text-center py-12">
                      <Coins className="w-12 h-12 text-[#E5E7EB] mx-auto mb-3" />
                      <p className="text-[#888888]">No challenge participations yet</p>
                      <p className="text-sm text-[#AAAAAA]">When users join challenges, their activity will appear here</p>
                    </div>
                  ) : (
                    transactions.map((t) => (
                      <div key={t.participant_id} className="flex items-center gap-4 p-4 bg-[#F8F9FA] rounded-xl hover:bg-[#F0F2F5] transition-colors">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          t.payout_status === 'completed' ? 'bg-[#E6FFF5]' :
                          t.payout_status === 'refunded' ? 'bg-[#E6F0FF]' : 'bg-[#F0F2F5]'
                        }`}>
                          <Coins className={`w-5 h-5 ${
                            t.payout_status === 'completed' ? 'text-[#00C853]' :
                            t.payout_status === 'refunded' ? 'text-[#0066FF]' : 'text-[#888888]'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#111111]">{t.user?.display_name || t.user?.name || "Unknown"}</p>
                          <p className="text-sm text-[#888888] truncate">{t.challenge_name}</p>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <p className="text-[#555555] flex items-center justify-end gap-1">
                            <Coins className="w-3 h-3 text-[#FFB800]" />
                            {t.entry_fee}
                          </p>
                          <p className="text-xs text-[#888888]">staked</p>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <p className={`font-medium flex items-center justify-end gap-1 ${
                            t.payout_amount > 0 ? 'text-[#00C853]' : 'text-[#888888]'
                          }`}>
                            {t.payout_amount > 0 && <Coins className="w-3 h-3" />}
                            {t.payout_amount || '-'}
                          </p>
                          <p className="text-xs text-[#888888]">payout</p>
                        </div>
                        <Badge variant={t.payout_status === "completed" ? "default" : t.payout_status === "refunded" ? "secondary" : "outline"}>
                          {t.payout_status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
                {transactionsTotal > ITEMS_PER_PAGE && (
                  <div className="mt-4">
                    <AdminPagination
                      currentPage={transactionsPage}
                      totalPages={Math.ceil(transactionsTotal / ITEMS_PER_PAGE)}
                      totalItems={transactionsTotal}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setTransactionsPage}
                      isLoading={transactionsFetching}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Platform Settings */}
              <div className="space-y-6">
                <Card className="card-premium">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-semibold text-[#111111] mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-[#8B5CF6]" />
                      Challenge Settings
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-[#111111]">Winner Fee Percentage</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            type="number"
                            min="0"
                            max="50"
                            value={configForm?.platform_fee_percentage || 10}
                            onChange={(e) => setConfigForm({ ...configForm, platform_fee_percentage: parseFloat(e.target.value) })}
                            className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg"
                          />
                          <span className="flex items-center text-[#888888]">%</span>
                        </div>
                        <p className="text-xs text-[#888888] mt-1">
                          Percentage deducted from winners' share (0-50%)
                        </p>
                      </div>

                      <div className="bg-[#F8F9FA] rounded-xl p-4">
                        <h3 className="font-medium text-[#111111] mb-2">Challenge Defaults</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-[#888888]">Min Participants</p>
                            <p className="font-medium text-[#111111]">5 users</p>
                          </div>
                          <div>
                            <p className="text-[#888888]">Max Participants</p>
                            <p className="font-medium text-[#111111]">100 users</p>
                          </div>
                          <div>
                            <p className="text-[#888888]">Default Duration</p>
                            <p className="font-medium text-[#111111]">1 Month</p>
                          </div>
                          <div>
                            <p className="text-[#888888]">Check-in Cooldown</p>
                            <p className="font-medium text-[#111111]">4 hours</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-premium">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-semibold text-[#111111] mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#00C853]" />
                      Supported Cities
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {configForm?.cities?.map((city) => (
                        <Badge key={city} variant="secondary" className="px-3 py-1.5 text-sm">
                          {city}
                          <button onClick={() => handleRemoveCity(city)} className="ml-2 text-[#FF3B30] hover:text-[#E63329] font-bold">×</button>
                        </Badge>
                      ))}
                      {(!configForm?.cities || configForm.cities.length === 0) && (
                        <p className="text-sm text-[#888888]">No cities configured</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add city..."
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCity()}
                      />
                      <Button onClick={handleAddCity} variant="outline" className="rounded-lg px-4">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleSaveConfig}
                  disabled={updateConfig.isPending}
                  className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl h-12"
                >
                  {updateConfig.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Save All Settings
                </Button>
              </div>

              {/* Feature Flags & Badges */}
              <div className="space-y-6">
                <Card className="card-premium">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-semibold text-[#111111] mb-4 flex items-center gap-2">
                      <ToggleLeft className="w-5 h-5 text-[#0066FF]" />
                      Feature Flags
                    </h2>
                    <div className="space-y-3">
                      {Object.entries(configForm?.feature_flags || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl">
                          <div>
                            <p className="text-[#111111] font-medium capitalize">{key.replace(/_/g, " ")}</p>
                            <p className="text-xs text-[#888888]">{value ? "Currently enabled" : "Currently disabled"}</p>
                          </div>
                          <Switch checked={value} onCheckedChange={() => toggleFeatureFlag(key)} />
                        </div>
                      ))}
                      {Object.keys(configForm?.feature_flags || {}).length === 0 && (
                        <div className="text-center py-8">
                          <ToggleLeft className="w-10 h-10 text-[#E5E7EB] mx-auto mb-2" />
                          <p className="text-[#888888]">No feature flags configured</p>
                          <p className="text-xs text-[#AAAAAA]">Add flags in the database to control features</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-premium">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-semibold text-[#111111] mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#FFB800]" />
                      Badges ({badges.length})
                    </h2>
                    <div className="space-y-3 max-h-[350px] overflow-y-auto">
                      {badges.length === 0 ? (
                        <div className="text-center py-8">
                          <Award className="w-10 h-10 text-[#E5E7EB] mx-auto mb-2" />
                          <p className="text-[#888888]">No badges configured</p>
                        </div>
                      ) : (
                        badges.map((badge) => (
                          <div key={badge.badge_id} className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-xl hover:bg-[#F0F2F5] transition-colors">
                            <span className="text-2xl">{badge.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-[#111111]">{badge.name}</p>
                              <p className="text-xs text-[#888888] truncate">{badge.description}</p>
                            </div>
                            <Badge variant={badge.is_active ? "default" : "secondary"}>
                              {badge.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="card-premium bg-gradient-to-br from-[#F8F9FA] to-white">
                  <CardContent className="p-5">
                    <h2 className="text-lg font-semibold text-[#111111] mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[#FF9500]" />
                      Platform Stats
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                        <p className="text-2xl font-bold text-[#111111]">{analytics?.users?.total || 0}</p>
                        <p className="text-sm text-[#888888]">Total Users</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                        <p className="text-2xl font-bold text-[#111111]">{analytics?.gyms?.total || 0}</p>
                        <p className="text-sm text-[#888888]">Total Gyms</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                        <p className="text-2xl font-bold text-[#111111]">{analytics?.challenges?.active || 0}</p>
                        <p className="text-sm text-[#888888]">Active Challenges</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
                        <p className="text-2xl font-bold text-[#111111]">{analytics?.checkins?.total || 0}</p>
                        <p className="text-sm text-[#888888]">Total Check-ins</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit" className="mt-6">
            <Card className="card-premium">
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-[#111111]">
                    Audit Log {auditTotal > 0 && `(${auditTotal})`}
                  </h2>
                </div>
                <div className="space-y-3">
                  {auditLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 text-[#8B5CF6] animate-spin" />
                    </div>
                  ) : auditLogs.length === 0 ? (
                    <p className="text-center text-[#888888] py-8">No audit logs yet</p>
                  ) : (
                    auditLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-4 p-4 bg-[#F8F9FA] rounded-xl">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          log.action.includes('delete') ? 'bg-red-100' :
                          log.action.includes('ban') ? 'bg-orange-100' :
                          log.action.includes('create') ? 'bg-green-100' :
                          'bg-blue-100'
                        }`}>
                          <FileText className={`w-5 h-5 ${
                            log.action.includes('delete') ? 'text-[#FF3B30]' :
                            log.action.includes('ban') ? 'text-[#FF9500]' :
                            log.action.includes('create') ? 'text-[#00C853]' :
                            'text-[#0066FF]'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-[#111111]">
                              {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                            <Badge variant="outline">{log.entity_type}</Badge>
                          </div>
                          <p className="text-sm text-[#888888] mt-1">
                            by {log.admin_email}
                          </p>
                          {log.entity_id && (
                            <p className="text-xs text-[#888888] mt-1 font-mono truncate">
                              ID: {log.entity_id}
                            </p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center gap-1 text-sm text-[#888888]">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(log.created_at).toLocaleDateString()}
                          </div>
                          <p className="text-xs text-[#888888]">
                            {new Date(log.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {auditTotal > ITEMS_PER_PAGE && (
                  <div className="mt-4">
                    <AdminPagination
                      currentPage={auditPage}
                      totalPages={Math.ceil(auditTotal / ITEMS_PER_PAGE)}
                      totalItems={auditTotal}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setAuditPage}
                      isLoading={auditFetching}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="mt-6 space-y-6">
            {/* Feedback Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-[#E6F0FF] rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-[#0066FF]" />
                  </div>
                  <span className="text-sm text-[#888888]">Feedback</span>
                </div>
                <p className="text-2xl font-bold text-[#111111]">{feedbackStats?.by_type?.feedback || 0}</p>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-[#FFEBEB] rounded-lg flex items-center justify-center">
                    <Bug className="w-4 h-4 text-[#FF3B30]" />
                  </div>
                  <span className="text-sm text-[#888888]">Bug Reports</span>
                </div>
                <p className="text-2xl font-bold text-[#111111]">{feedbackStats?.by_type?.bug || 0}</p>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-[#E8F5E9] rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-[#00C853]" />
                  </div>
                  <span className="text-sm text-[#888888]">Feature Requests</span>
                </div>
                <p className="text-2xl font-bold text-[#111111]">{feedbackStats?.by_type?.feature || 0}</p>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-[#FFF3E0] rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[#FF9800]" />
                  </div>
                  <span className="text-sm text-[#888888]">Pending</span>
                </div>
                <p className="text-2xl font-bold text-[#FF9800]">{feedbackStats?.by_status?.pending || 0}</p>
              </div>
            </div>

            {/* Feedback List */}
            <Card className="card-premium">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-lg font-semibold text-[#111111]">
                    User Feedback {feedbackTotal > 0 && `(${feedbackTotal})`}
                  </h2>
                  <div className="flex gap-2">
                    <Select value={feedbackTypeFilter} onValueChange={setFeedbackTypeFilter}>
                      <SelectTrigger className="w-[130px] h-9 bg-[#F8F9FA] border-[#E5E7EB] rounded-lg text-sm">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={feedbackStatusFilter} onValueChange={setFeedbackStatusFilter}>
                      <SelectTrigger className="w-[130px] h-9 bg-[#F8F9FA] border-[#E5E7EB] rounded-lg text-sm">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  {feedbackLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 text-[#8B5CF6] animate-spin" />
                    </div>
                  ) : feedbackList.length === 0 ? (
                    <p className="text-center text-[#888888] py-8">No feedback yet</p>
                  ) : (
                    feedbackList.map((fb) => (
                      <div key={fb.id} className="p-4 bg-[#F8F9FA] rounded-xl hover:bg-[#F0F2F5] transition-colors">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            fb.type === 'feedback' ? 'bg-[#E6F0FF]' :
                            fb.type === 'bug' ? 'bg-[#FFEBEB]' : 'bg-[#E8F5E9]'
                          }`}>
                            {fb.type === 'feedback' ? <MessageSquare className="w-5 h-5 text-[#0066FF]" /> :
                             fb.type === 'bug' ? <Bug className="w-5 h-5 text-[#FF3B30]" /> :
                             <Lightbulb className="w-5 h-5 text-[#00C853]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-medium text-[#111111]">{fb.subject}</p>
                              <Badge variant={
                                fb.status === 'pending' ? 'outline' :
                                fb.status === 'reviewed' ? 'default' :
                                fb.status === 'resolved' ? 'secondary' : 'outline'
                              } className={
                                fb.status === 'pending' ? 'text-[#FF9800] border-[#FF9800]' :
                                fb.status === 'resolved' ? 'bg-[#00C853] text-white' : ''
                              }>
                                {fb.status}
                              </Badge>
                              {fb.reward_coins > 0 && (
                                <Badge className="bg-[#FFB800] text-white">
                                  <Gift className="w-3 h-3 mr-1" /> {fb.reward_coins} coins
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-[#555555] line-clamp-2">{fb.message}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-[#888888]">
                              <span>{fb.user_name || fb.user_email}</span>
                              <span>{new Date(fb.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            {fb.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                title="Mark as Reviewed"
                                onClick={() => {
                                  updateFeedback.mutate(
                                    { feedbackId: fb.id, updateData: { status: 'reviewed' } },
                                    { onSuccess: () => toast.success('Marked as reviewed') }
                                  );
                                }}
                              >
                                <Eye className="w-4 h-4 text-[#0066FF]" />
                              </Button>
                            )}
                            {fb.status !== 'resolved' && !fb.reward_coins && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                title="Reward 50 coins"
                                onClick={() => {
                                  updateFeedback.mutate(
                                    { feedbackId: fb.id, updateData: { status: 'resolved', reward_coins: 50 } },
                                    { onSuccess: () => toast.success('Rewarded user with 50 coins!') }
                                  );
                                }}
                              >
                                <Gift className="w-4 h-4 text-[#FFB800]" />
                              </Button>
                            )}
                            {fb.status !== 'resolved' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                title="Mark as Resolved"
                                onClick={() => {
                                  updateFeedback.mutate(
                                    { feedbackId: fb.id, updateData: { status: 'resolved' } },
                                    { onSuccess: () => toast.success('Marked as resolved') }
                                  );
                                }}
                              >
                                <CheckCircle className="w-4 h-4 text-[#00C853]" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              title="Delete"
                              onClick={() => {
                                if (confirm('Delete this feedback?')) {
                                  deleteFeedback.mutate(fb.id, {
                                    onSuccess: () => toast.success('Feedback deleted')
                                  });
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-[#FF3B30]" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {feedbackTotal > ITEMS_PER_PAGE && (
                  <div className="mt-4">
                    <AdminPagination
                      currentPage={feedbackPage}
                      totalPages={Math.ceil(feedbackTotal / ITEMS_PER_PAGE)}
                      totalItems={feedbackTotal}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setFeedbackPage}
                      isLoading={feedbackFetching}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Ban Modal */}
      <Dialog open={showBanModal} onOpenChange={setShowBanModal}>
        <DialogContent className="bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#FF3B30] flex items-center gap-2">
              <Ban className="w-5 h-5" />
              Ban User
            </DialogTitle>
            <DialogDescription>
              Ban {selectedUser?.name}? They will be logged out immediately.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label>Reason</Label>
            <Textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Enter reason for ban..."
              className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBanModal(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleBanUser} disabled={banUser.isPending} className="bg-[#FF3B30] hover:bg-[#E63329] rounded-xl">
              {banUser.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Ban User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Modal */}
      <Dialog open={showRoleModal} onOpenChange={setShowRoleModal}>
        <DialogContent className="bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5 text-[#8B5CF6]" />
              Update Role
            </DialogTitle>
            <DialogDescription>Change role for {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="gym_admin">Gym Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newRole === "gym_admin" && (
              <div>
                <Label>Assign to Gym</Label>
                <Select value={assignGymId} onValueChange={setAssignGymId}>
                  <SelectTrigger className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2">
                    <SelectValue placeholder="Select gym" />
                  </SelectTrigger>
                  <SelectContent>
                    {gyms.map((g) => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleModal(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleUpdateRole} disabled={updateRole.isPending} className="bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl">
              {updateRole.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Gym Modal */}
      <Dialog open={showGymModal} onOpenChange={setShowGymModal}>
        <DialogContent className="bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0066FF]" />
              Add New Gym
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Gym Name *</Label>
              <Input
                value={gymForm.name}
                onChange={(e) => setGymForm({ ...gymForm, name: e.target.value })}
                className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2"
              />
            </div>
            <div>
              <Label>City *</Label>
              <Select value={gymForm.city} onValueChange={(v) => setGymForm({ ...gymForm, city: v })}>
                <SelectTrigger className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {config?.cities?.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Address</Label>
              <Input
                value={gymForm.address}
                onChange={(e) => setGymForm({ ...gymForm, address: e.target.value })}
                className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Latitude</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={gymForm.latitude}
                  onChange={(e) => setGymForm({ ...gymForm, latitude: e.target.value })}
                  className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2"
                />
              </div>
              <div>
                <Label>Longitude</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={gymForm.longitude}
                  onChange={(e) => setGymForm({ ...gymForm, longitude: e.target.value })}
                  className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGymModal(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleCreateGym} disabled={createGym.isPending} className="bg-[#0066FF] hover:bg-[#0052CC] rounded-xl">
              {createGym.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Gym
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Challenge Modal */}
      <Dialog open={showChallengeModal} onOpenChange={setShowChallengeModal}>
        <DialogContent className="bg-white rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#FFB800]" />
              Create Global Challenge
            </DialogTitle>
            <DialogDescription>This challenge will be available to all users platform-wide</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Challenge Name *</Label>
              <Input
                value={challengeForm.name}
                onChange={(e) => setChallengeForm({ ...challengeForm, name: e.target.value })}
                placeholder="e.g., January Fitness Challenge"
                className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2"
              />
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                value={challengeForm.description}
                onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
                placeholder="Describe the challenge goal and rules..."
                className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-[#FFB800]" />
                  Entry Fee (coins)
                </Label>
                <Select value={challengeForm.entry_fee.toString()} onValueChange={(v) => setChallengeForm({ ...challengeForm, entry_fee: parseInt(v) })}>
                  <SelectTrigger className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 coins</SelectItem>
                    <SelectItem value="75">75 coins</SelectItem>
                    <SelectItem value="100">100 coins</SelectItem>
                    <SelectItem value="150">150 coins</SelectItem>
                    <SelectItem value="200">200 coins</SelectItem>
                    <SelectItem value="500">500 coins</SelectItem>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#0066FF]" />
                  Start Date *
                </Label>
                <Input
                  type="date"
                  min={getMinDate()}
                  value={challengeForm.start_date}
                  onChange={(e) => setChallengeForm({ ...challengeForm, start_date: e.target.value })}
                  className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2"
                />
              </div>
              <div>
                <Label>Check-in Goal</Label>
                <Select value={challengeForm.goal_count.toString()} onValueChange={(v) => setChallengeForm({ ...challengeForm, goal_count: parseInt(v) })}>
                  <SelectTrigger className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 check-ins (easy)</SelectItem>
                    <SelectItem value="8">8 check-ins (moderate)</SelectItem>
                    <SelectItem value="12">12 check-ins (challenging)</SelectItem>
                    <SelectItem value="16">16 check-ins (hard)</SelectItem>
                    <SelectItem value="20">20 check-ins (extreme)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Challenge Schedule Preview */}
            {challengeForm.start_date && (
              <div className="bg-gradient-to-r from-[#0066FF10] to-[#8B5CF610] rounded-xl p-4 border border-[#0066FF20]">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-[#0066FF]" />
                  <span className="font-medium text-[#111111]">Challenge Schedule</span>
                </div>
                <p className="text-sm text-[#555555]">
                  <span className="font-medium">Starts:</span> {formatDateDisplay(challengeForm.start_date)}
                  <span className="mx-2">→</span>
                  <span className="font-medium">Ends:</span> {formatDateDisplay(getEndDate(challengeForm.start_date, challengeForm.duration)?.toISOString())}
                </p>
                <p className="text-xs text-[#888888] mt-1">
                  Users can join until the start date. Challenge becomes active automatically.
                </p>
              </div>
            )}
            <div className="bg-[#F8F9FA] rounded-xl p-4">
              <p className="text-sm text-[#555555]">
                <strong>How it works:</strong> Users pay the entry fee in coins to join before the start date. Those who complete {challengeForm.goal_count} check-ins split the prize pool.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChallengeModal(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleCreateChallenge} disabled={createChallenge.isPending} className="bg-[#FFB800] hover:bg-[#E6A600] text-[#111111] rounded-xl">
              {createChallenge.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Trophy className="w-4 h-4 mr-2" />
              Create Challenge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Gym Owner Modal */}
      <Dialog open={showOwnerModal} onOpenChange={setShowOwnerModal}>
        <DialogContent className="bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#FFD700]" />
              Set Gym Owner
            </DialogTitle>
            <DialogDescription>
              Assign an owner to {selectedGym?.name}. Owners can access the gym dashboard.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label>Select Owner</Label>
            <Select value={assignOwnerId} onValueChange={setAssignOwnerId}>
              <SelectTrigger className="bg-[#F8F9FA] border-[#E5E7EB] rounded-lg mt-2">
                <SelectValue placeholder="Select a user as owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No owner (remove)</SelectItem>
                {users.filter(u => u.role !== 'super_admin').map((u) => (
                  <SelectItem key={u.user_id || u.id} value={u.user_id || u.id}>
                    {u.display_name || u.name || u.email} ({u.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-[#888888] mt-2">
              The selected user will become the owner and can access the owner dashboard.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowOwnerModal(false); setSelectedGym(null); setAssignOwnerId(""); }} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleSetGymOwner} disabled={setGymOwner.isPending} className="bg-[#FFD700] hover:bg-[#E6C200] text-[#111111] rounded-xl">
              {setGymOwner.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Crown className="w-4 h-4 mr-2" />
              {assignOwnerId ? "Assign Owner" : "Remove Owner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        isLoading={confirmDialog.isLoading}
        variant={confirmDialog.variant}
      />
    </div>
  );
}
