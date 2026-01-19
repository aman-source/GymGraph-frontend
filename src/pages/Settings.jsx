import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Layout from "@/components/Layout";
import { useAuth } from "@/App";
import { useSearchGyms, useGym, useUpdateUser, useDeleteUser, useSubmitFeedback } from "@/hooks";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Shield,
  Eye,
  MapPin,
  Trophy,
  Users,
  LogOut,
  Save,
  Building2,
  Trash2,
  AlertTriangle,
  Search,
  Loader2,
  Check,
  X,
  ChevronRight,
  Bell,
  Lock,
  Globe,
  UserX,
  Sparkles,
  MessageSquare,
  Bug,
  Lightbulb,
  Gift,
  ExternalLink,
  Star,
  Heart
} from "lucide-react";

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function Settings() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const submitFeedbackMutation = useSubmitFeedback();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState("feedback");
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Gym search state
  const [gymSearchQuery, setGymSearchQuery] = useState("");
  const [showGymSearch, setShowGymSearch] = useState(false);
  const [selectedGymId, setSelectedGymId] = useState("");

  const debouncedGymSearch = useDebounce(gymSearchQuery, 300);

  // React Query hooks for gym data
  const { data: selectedGymData } = useGym(selectedGymId);
  const {
    data: searchData,
    isLoading: searching,
  } = useSearchGyms(debouncedGymSearch, 10);

  // Flatten paginated search results
  const searchResults = useMemo(() => {
    return searchData?.pages?.flatMap(page => page.gyms) || [];
  }, [searchData]);

  const [settings, setSettings] = useState({
    profile_visibility: "public",
    show_on_nearby: true,
    show_on_leaderboard: true,
    allow_connection_requests: "anyone"
  });

  // Initialize from user
  useEffect(() => {
    if (user) {
      setSelectedGymId(user.primary_gym_id || "");
      if (user.privacy_settings) {
        setSettings({
          profile_visibility: user.privacy_settings.profile_visibility || "public",
          show_on_nearby: user.privacy_settings.show_on_nearby !== false,
          show_on_leaderboard: user.privacy_settings.show_on_leaderboard !== false,
          allow_connection_requests: user.privacy_settings.allow_connection_requests || "anyone"
        });
      }
    }
  }, [user]);

  const handleGymSelect = (gym) => {
    setSelectedGymId(gym.id);
    setShowGymSearch(false);
    setGymSearchQuery("");
  };

  const handleSave = async () => {
    try {
      await updateUserMutation.mutateAsync({
        privacy_settings: settings,
        primary_gym_id: selectedGymId || null
      });
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch {
      // Sign out failed - redirect anyway
    }
    window.location.href = "/";
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    try {
      await deleteUserMutation.mutateAsync();
      toast.success("Account deleted successfully");
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  const openFeedbackModal = (type) => {
    setFeedbackType(type);
    setFeedbackSubject("");
    setFeedbackMessage("");
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackSubject.trim() || feedbackSubject.trim().length < 3) {
      toast.error("Please enter a subject (at least 3 characters)");
      return;
    }
    if (!feedbackMessage.trim() || feedbackMessage.trim().length < 10) {
      toast.error("Please enter a message (at least 10 characters)");
      return;
    }

    try {
      await submitFeedbackMutation.mutateAsync({
        type: feedbackType,
        subject: feedbackSubject.trim(),
        message: feedbackMessage.trim(),
        device_info: `${navigator.userAgent} | ${window.innerWidth}x${window.innerHeight}`
      });
      toast.success("Thank you for your feedback! We'll review it soon.");
      setShowFeedbackModal(false);
      setFeedbackSubject("");
      setFeedbackMessage("");
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  // Get visibility icon
  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case "public": return <Globe className="w-4 h-4" />;
      case "connections_only": return <Users className="w-4 h-4" />;
      case "private": return <Lock className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <Layout user={user}>
      <div className="max-w-2xl mx-auto space-y-6" data-testid="settings-page">
        {/* Header - Blended with background */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111]">Settings</h1>
            <p className="text-[#555555] mt-1">Manage your preferences and account</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={updateUserMutation.isPending}
            className="bg-[#0066FF] hover:bg-[#0052CC] rounded-xl hidden sm:flex"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateUserMutation.isPending ? "Saving..." : "Save All"}
          </Button>
        </div>

        {/* Gym Selection Card */}
        <Card className="card-premium overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-[#0066FF] to-[#0052CC]" />
          <CardHeader className="pb-4">
            <CardTitle className="text-[#111111] flex items-center gap-2">
              <div className="w-10 h-10 bg-[#E6F0FF] rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#0066FF]" />
              </div>
              <div>
                <span className="block">Your Gym</span>
                <span className="text-sm font-normal text-[#888888]">Where you check in</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Current gym display */}
            {selectedGymData && !showGymSearch ? (
              <div className="p-4 bg-gradient-to-r from-[#E6F0FF] to-[#F0F7FF] rounded-xl border border-[#0066FF]/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-[#0066FF] rounded-xl flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#111111] flex items-center gap-2">
                        {selectedGymData.name}
                        {selectedGymData.is_verified && (
                          <Check className="w-4 h-4 text-[#0066FF]" />
                        )}
                      </p>
                      <p className="text-sm text-[#555555] mt-0.5">{selectedGymData.address}</p>
                      <p className="text-sm text-[#888888]">{selectedGymData.city}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGymSearch(true)}
                    className="text-[#0066FF] border-[#0066FF]/30 hover:bg-[#0066FF]/10 rounded-lg"
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                  <Input
                    placeholder="Search gym by name, area, or city..."
                    value={gymSearchQuery}
                    onChange={(e) => setGymSearchQuery(e.target.value)}
                    className="pl-12 pr-12 bg-[#F8F9FA] border-[#E5E7EB] text-[#111111] placeholder:text-[#888888] rounded-xl h-12 focus:border-[#0066FF] focus:ring-[#0066FF]/20"
                    autoFocus={showGymSearch}
                  />
                  {searching && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0066FF] animate-spin" />
                  )}
                </div>

                {/* Search results */}
                {gymSearchQuery.length >= 2 && (
                  <div className="max-h-[240px] overflow-y-auto space-y-2 rounded-xl border border-[#E5E7EB] p-2 bg-white">
                    {searching ? (
                      <div className="text-center py-6 text-[#888888]">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0066FF]" />
                        <p className="text-sm">Searching gyms...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((gym) => (
                        <button
                          key={gym.id}
                          onClick={() => handleGymSelect(gym)}
                          className="w-full p-3 rounded-xl hover:bg-[#E6F0FF] bg-[#F8F9FA] text-left transition-all flex items-start gap-3 group"
                        >
                          <div className="w-10 h-10 bg-[#E6F0FF] group-hover:bg-[#0066FF] rounded-lg flex items-center justify-center shrink-0 transition-colors">
                            <Building2 className="w-5 h-5 text-[#0066FF] group-hover:text-white transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#111111] truncate flex items-center gap-2">
                              {gym.name}
                              {gym.is_verified && <Check className="w-3.5 h-3.5 text-[#0066FF]" />}
                            </p>
                            <p className="text-sm text-[#555555] truncate">{gym.address}</p>
                            <p className="text-sm text-[#888888]">{gym.city}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[#888888] group-hover:text-[#0066FF] shrink-0 mt-2 transition-colors" />
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-[#F0F2F5] rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Building2 className="w-6 h-6 text-[#888888]" />
                        </div>
                        <p className="text-[#555555] text-sm">No gyms found for "{gymSearchQuery}"</p>
                        <p className="text-[#888888] text-xs mt-1">Try a different name or location</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Hint */}
                {gymSearchQuery.length < 2 && (
                  <div className="text-center py-4 bg-[#F8F9FA] rounded-xl">
                    <Search className="w-6 h-6 text-[#888888] mx-auto mb-2" />
                    <p className="text-sm text-[#888888]">
                      Type at least 2 characters to search gyms
                    </p>
                  </div>
                )}

                {/* Cancel button if already had a gym */}
                {selectedGymId && showGymSearch && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowGymSearch(false);
                      setGymSearchQuery("");
                    }}
                    className="w-full border-[#E5E7EB] rounded-xl h-11"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            )}

            {selectedGymId && !showGymSearch && (
              <div className="mt-4 flex items-center gap-2 text-[#00C853] text-sm">
                <MapPin className="w-4 h-4" />
                <span>You can check-in at this gym</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy Settings Card */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="text-[#111111] flex items-center gap-2">
              <div className="w-10 h-10 bg-[#E6F0FF] rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#0066FF]" />
              </div>
              <div>
                <span className="block">Privacy</span>
                <span className="text-sm font-normal text-[#888888]">Control your visibility</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Privacy Status Summary */}
            <div className={`p-3 rounded-xl border ${
              settings.profile_visibility === 'private' || (!settings.show_on_nearby && !settings.show_on_leaderboard)
                ? 'bg-[#FFF5F5] border-[#FFEBEB]'
                : settings.profile_visibility === 'connections_only'
                ? 'bg-[#E6F0FF] border-[#0066FF]/20'
                : 'bg-[#F0FFF4] border-[#00C853]/20'
            }`}>
              <div className="flex items-center gap-2">
                {settings.profile_visibility === 'private' ? (
                  <>
                    <Lock className="w-4 h-4 text-[#FF3B30]" />
                    <span className="text-sm font-medium text-[#FF3B30]">Profile is hidden from everyone</span>
                  </>
                ) : settings.profile_visibility === 'connections_only' ? (
                  <>
                    <Users className="w-4 h-4 text-[#0066FF]" />
                    <span className="text-sm font-medium text-[#0066FF]">Only connections can see your profile</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 text-[#00C853]" />
                    <span className="text-sm font-medium text-[#00C853]">Your profile is visible to everyone</span>
                  </>
                )}
              </div>
            </div>

            {/* Profile Visibility */}
            <div className="p-4 bg-[#F8F9FA] rounded-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    settings.profile_visibility === 'public' ? 'bg-[#E8F5E9]' :
                    settings.profile_visibility === 'connections_only' ? 'bg-[#E6F0FF]' : 'bg-[#FFEBEB]'
                  }`}>
                    {getVisibilityIcon(settings.profile_visibility)}
                  </div>
                  <div>
                    <Label className="text-[#111111] font-medium">Profile Visibility</Label>
                    <p className="text-[#888888] text-sm mt-0.5">Who can see your full profile and stats</p>
                  </div>
                </div>
                <Select
                  value={settings.profile_visibility}
                  onValueChange={(v) => setSettings({ ...settings, profile_visibility: v })}
                >
                  <SelectTrigger className="w-[160px] bg-white border-[#E5E7EB] text-[#111111] rounded-lg h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#E5E7EB] rounded-xl">
                    <SelectItem value="public" className="text-[#111111]">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#00C853]" />
                        Public
                      </div>
                    </SelectItem>
                    <SelectItem value="connections_only" className="text-[#111111]">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#0066FF]" />
                        Connections
                      </div>
                    </SelectItem>
                    <SelectItem value="private" className="text-[#111111]">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#888888]" />
                        Private
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Toggle Settings */}
            <div className="space-y-4">
              {/* Nearby Discovery */}
              <div className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                settings.show_on_nearby ? 'bg-[#F8F9FA]' : 'bg-[#FFF5F5] border border-[#FFEBEB]'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    settings.show_on_nearby ? 'bg-[#E6F0FF]' : 'bg-[#FFEBEB]'
                  }`}>
                    <MapPin className={`w-4 h-4 ${settings.show_on_nearby ? 'text-[#0066FF]' : 'text-[#FF3B30]'}`} />
                  </div>
                  <div>
                    <Label className="text-[#111111] font-medium">Nearby Discovery</Label>
                    <p className="text-[#888888] text-sm mt-0.5">
                      {settings.show_on_nearby
                        ? 'Others can find you in gym members & suggestions'
                        : 'Hidden from gym members & connection suggestions'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.show_on_nearby}
                  onCheckedChange={(v) => setSettings({ ...settings, show_on_nearby: v })}
                />
              </div>

              {/* Leaderboard Visibility */}
              <div className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                settings.show_on_leaderboard ? 'bg-[#F8F9FA]' : 'bg-[#FFF5F5] border border-[#FFEBEB]'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    settings.show_on_leaderboard ? 'bg-[#FFF3E0]' : 'bg-[#FFEBEB]'
                  }`}>
                    <Trophy className={`w-4 h-4 ${settings.show_on_leaderboard ? 'text-[#FF9800]' : 'text-[#FF3B30]'}`} />
                  </div>
                  <div>
                    <Label className="text-[#111111] font-medium">Leaderboard Visibility</Label>
                    <p className="text-[#888888] text-sm mt-0.5">
                      {settings.show_on_leaderboard
                        ? 'You appear on gym & city leaderboards'
                        : 'Hidden from all leaderboards'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.show_on_leaderboard}
                  onCheckedChange={(v) => setSettings({ ...settings, show_on_leaderboard: v })}
                />
              </div>
            </div>

            {/* Connection Requests */}
            <div className={`p-4 rounded-xl transition-colors ${
              settings.allow_connection_requests === 'nobody'
                ? 'bg-[#FFF5F5] border border-[#FFEBEB]'
                : 'bg-[#F8F9FA]'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    settings.allow_connection_requests === 'anyone' ? 'bg-[#E8F5E9]' :
                    settings.allow_connection_requests === 'mutual_gyms' ? 'bg-[#E6F0FF]' : 'bg-[#FFEBEB]'
                  }`}>
                    {settings.allow_connection_requests === 'nobody' ? (
                      <UserX className="w-4 h-4 text-[#FF3B30]" />
                    ) : settings.allow_connection_requests === 'mutual_gyms' ? (
                      <Building2 className="w-4 h-4 text-[#0066FF]" />
                    ) : (
                      <Users className="w-4 h-4 text-[#00C853]" />
                    )}
                  </div>
                  <div>
                    <Label className="text-[#111111] font-medium">Connection Requests</Label>
                    <p className="text-[#888888] text-sm mt-0.5">
                      {settings.allow_connection_requests === 'anyone'
                        ? 'Anyone can send you connection requests'
                        : settings.allow_connection_requests === 'mutual_gyms'
                        ? 'Only members of your gym can connect'
                        : 'No one can send you requests'}
                    </p>
                  </div>
                </div>
                <Select
                  value={settings.allow_connection_requests}
                  onValueChange={(v) => setSettings({ ...settings, allow_connection_requests: v })}
                >
                  <SelectTrigger className="w-[140px] bg-white border-[#E5E7EB] text-[#111111] rounded-lg h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#E5E7EB] rounded-xl">
                    <SelectItem value="anyone" className="text-[#111111]">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#00C853]" />
                        Anyone
                      </div>
                    </SelectItem>
                    <SelectItem value="mutual_gyms" className="text-[#111111]">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#0066FF]" />
                        Same Gym
                      </div>
                    </SelectItem>
                    <SelectItem value="nobody" className="text-[#111111]">
                      <div className="flex items-center gap-2">
                        <UserX className="w-4 h-4 text-[#FF3B30]" />
                        Nobody
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Card */}
        <Card className="card-premium">
          <CardHeader className="pb-4">
            <CardTitle className="text-[#111111] flex items-center gap-2">
              <div className="w-10 h-10 bg-[#F0F2F5] rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-[#555555]" />
              </div>
              <div>
                <span className="block">Account</span>
                <span className="text-sm font-normal text-[#888888]">Manage your account</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start border-[#E5E7EB] text-[#555555] hover:border-[#0066FF] hover:text-[#0066FF] hover:bg-[#E6F0FF] rounded-xl h-12"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(true)}
              className="w-full justify-start border-[#FFEBEB] text-[#FF3B30] hover:border-[#FF3B30] hover:bg-[#FFF5F5] rounded-xl h-12"
            >
              <Trash2 className="w-5 h-5 mr-3" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* Feedback & Support Card */}
        <Card className="card-premium overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-[#FF9800] via-[#FF5722] to-[#E91E63]" />
          <CardHeader className="pb-4">
            <CardTitle className="text-[#111111] flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2] rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#FF5722]" />
              </div>
              <div>
                <span className="block">Feedback & Support</span>
                <span className="text-sm font-normal text-[#888888]">Help us improve GymGraph</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Rewards Banner */}
            <div className="p-4 bg-gradient-to-r from-[#FFF8E1] via-[#FFF3E0] to-[#FFE0B2] rounded-xl border border-[#FFB74D]/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <Gift className="w-5 h-5 text-[#FF9800]" />
                </div>
                <div>
                  <p className="font-semibold text-[#E65100] flex items-center gap-2">
                    Earn Rewards
                    <span className="px-2 py-0.5 bg-[#FF9800] text-white text-xs rounded-full font-medium">Coming Soon</span>
                  </p>
                  <p className="text-sm text-[#F57C00] mt-1">
                    Users who provide valuable feedback, report bugs, or suggest features will be rewarded with coins and exclusive badges!
                  </p>
                </div>
              </div>
            </div>

            {/* Feedback Options */}
            <div className="space-y-3">
              {/* General Feedback */}
              <button
                onClick={() => openFeedbackModal("feedback")}
                className="w-full flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl hover:bg-[#E6F0FF] transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E6F0FF] group-hover:bg-[#0066FF] rounded-xl flex items-center justify-center transition-colors">
                    <MessageSquare className="w-5 h-5 text-[#0066FF] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-medium text-[#111111]">Send Feedback</p>
                    <p className="text-sm text-[#888888]">Share your thoughts and suggestions</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#888888] group-hover:text-[#0066FF] transition-colors" />
              </button>

              {/* Bug Report */}
              <button
                onClick={() => openFeedbackModal("bug")}
                className="w-full flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl hover:bg-[#FFF5F5] transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FFEBEB] group-hover:bg-[#FF3B30] rounded-xl flex items-center justify-center transition-colors">
                    <Bug className="w-5 h-5 text-[#FF3B30] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-medium text-[#111111]">Report a Bug</p>
                    <p className="text-sm text-[#888888]">Found something broken? Let us know</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#888888] group-hover:text-[#FF3B30] transition-colors" />
              </button>

              {/* Feature Request */}
              <button
                onClick={() => openFeedbackModal("feature")}
                className="w-full flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl hover:bg-[#F0FFF4] transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#E8F5E9] group-hover:bg-[#00C853] rounded-xl flex items-center justify-center transition-colors">
                    <Lightbulb className="w-5 h-5 text-[#00C853] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-medium text-[#111111]">Request a Feature</p>
                    <p className="text-sm text-[#888888]">Have an idea? We'd love to hear it</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#888888] group-hover:text-[#00C853] transition-colors" />
              </button>

              {/* Rate Us */}
              <button
                onClick={() => toast.info("App store rating coming soon!")}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#F8F9FA] to-[#FFF8E1] rounded-xl hover:from-[#FFF3E0] hover:to-[#FFE0B2] transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FFF3E0] group-hover:bg-[#FF9800] rounded-xl flex items-center justify-center transition-colors">
                    <Star className="w-5 h-5 text-[#FF9800] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-medium text-[#111111]">Rate GymGraph</p>
                    <p className="text-sm text-[#888888]">Love the app? Give us 5 stars!</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-[#FFB74D] fill-[#FFB74D]" />
                  ))}
                </div>
              </button>
            </div>

            {/* Thank You Note */}
            <div className="text-center pt-2">
              <p className="text-sm text-[#888888]">
                Your feedback helps us build a better fitness community
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Save Button */}
        <div className="sm:hidden">
          <Button
            onClick={handleSave}
            disabled={updateUserMutation.isPending}
            className="w-full bg-[#0066FF] hover:bg-[#0052CC] rounded-xl h-12 text-base"
          >
            <Save className="w-5 h-5 mr-2" />
            {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Version Info */}
        <Card className="card-premium bg-[#F8F9FA]">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#0066FF]" />
              <span className="text-[#111111] font-medium">GymGraph</span>
            </div>
            <p className="text-[#888888] text-sm">Version 1.0.0</p>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-white border-[#E5E7EB] rounded-2xl max-w-md">
          <DialogHeader>
            <div className="w-16 h-16 bg-[#FFEBEB] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-[#FF3B30]" />
            </div>
            <DialogTitle className="text-[#111111] text-xl text-center">
              Delete Your Account?
            </DialogTitle>
            <DialogDescription className="text-[#555555] text-center">
              This action is permanent and cannot be undone. All your data including check-ins, challenges, connections, and coins will be permanently deleted.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="p-4 bg-[#FFF5F5] rounded-xl border border-[#FFEBEB]">
              <p className="text-[#FF3B30] text-sm font-medium mb-2">
                Type DELETE to confirm
              </p>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                placeholder="DELETE"
                className="bg-white border-[#FFEBEB] text-[#111111] rounded-lg font-mono tracking-wider"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmText("");
              }}
              className="flex-1 border-[#E5E7EB] rounded-xl h-11"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== "DELETE" || deleteUserMutation.isPending}
              className="flex-1 bg-[#FF3B30] hover:bg-[#E63329] rounded-xl h-11 disabled:opacity-50"
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="bg-white border-[#E5E7EB] rounded-2xl max-w-md">
          <DialogHeader>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              feedbackType === 'feedback' ? 'bg-[#E6F0FF]' :
              feedbackType === 'bug' ? 'bg-[#FFEBEB]' : 'bg-[#E8F5E9]'
            }`}>
              {feedbackType === 'feedback' ? (
                <MessageSquare className="w-8 h-8 text-[#0066FF]" />
              ) : feedbackType === 'bug' ? (
                <Bug className="w-8 h-8 text-[#FF3B30]" />
              ) : (
                <Lightbulb className="w-8 h-8 text-[#00C853]" />
              )}
            </div>
            <DialogTitle className="text-[#111111] text-xl text-center">
              {feedbackType === 'feedback' ? 'Send Feedback' :
               feedbackType === 'bug' ? 'Report a Bug' : 'Request a Feature'}
            </DialogTitle>
            <DialogDescription className="text-[#555555] text-center">
              {feedbackType === 'feedback' ? 'Share your thoughts and help us improve' :
               feedbackType === 'bug' ? 'Tell us what went wrong so we can fix it' :
               'Suggest a feature you\'d like to see'}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div>
              <Label className="text-[#111111] font-medium mb-2 block">Subject</Label>
              <Input
                value={feedbackSubject}
                onChange={(e) => setFeedbackSubject(e.target.value)}
                placeholder={
                  feedbackType === 'feedback' ? 'e.g., Great app overall!' :
                  feedbackType === 'bug' ? 'e.g., Check-in button not working' :
                  'e.g., Dark mode support'
                }
                className="bg-[#F8F9FA] border-[#E5E7EB] text-[#111111] rounded-xl h-11"
              />
            </div>
            <div>
              <Label className="text-[#111111] font-medium mb-2 block">
                {feedbackType === 'bug' ? 'Describe the issue' : 'Your message'}
              </Label>
              <Textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder={
                  feedbackType === 'feedback' ? 'Tell us what you think...' :
                  feedbackType === 'bug' ? 'What happened? What did you expect to happen? Steps to reproduce...' :
                  'Describe your feature idea and why it would be useful...'
                }
                className="bg-[#F8F9FA] border-[#E5E7EB] text-[#111111] rounded-xl min-h-[120px] resize-none"
              />
            </div>

            {/* Reward hint */}
            <div className="flex items-center gap-2 p-3 bg-[#FFF8E1] rounded-xl">
              <Gift className="w-5 h-5 text-[#FF9800] shrink-0" />
              <p className="text-sm text-[#F57C00]">
                Valuable submissions may be rewarded with coins!
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowFeedbackModal(false)}
              className="flex-1 border-[#E5E7EB] rounded-xl h-11"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitFeedback}
              disabled={submitFeedbackMutation.isPending}
              className={`flex-1 rounded-xl h-11 ${
                feedbackType === 'feedback' ? 'bg-[#0066FF] hover:bg-[#0052CC]' :
                feedbackType === 'bug' ? 'bg-[#FF3B30] hover:bg-[#E63329]' :
                'bg-[#00C853] hover:bg-[#00A843]'
              }`}
            >
              {submitFeedbackMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
