import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Layout from "@/components/Layout";
import VideoBadge, { VideoBadgeModal } from "@/components/VideoBadge";
import { useAuth } from "@/App";
import { useGym, useMyCheckins, useUpdateUser } from "@/hooks";
import { toast } from "sonner";
import {
  Zap,
  Trophy,
  Calendar,
  TrendingUp,
  Edit2,
  Share2,
  Building2,
  Target,
  MapPin,
  CheckCircle,
  Download,
  Copy,
  Flame,
  Award,
  Star,
  Clock,
  Dumbbell,
  Activity,
  Heart,
  Sparkles,
  Swords,
  Crown,
  Footprints,
  Gem,
  Hash,
  Medal,
  Users,
  Waves,
  Brain,
  Lock,
} from "lucide-react";
import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek, isThisMonth, startOfDay } from "date-fns";

// Fitness goal options
const fitnessGoals = [
  { value: "weight_loss", label: "Weight Loss", icon: Flame, color: "#FF6B35" },
  { value: "muscle_gain", label: "Muscle Gain", icon: Dumbbell, color: "#0066FF" },
  { value: "strength", label: "Build Strength", icon: Activity, color: "#8B5CF6" },
  { value: "endurance", label: "Improve Endurance", icon: Heart, color: "#FF3B30" },
  { value: "flexibility", label: "Flexibility", icon: Sparkles, color: "#00BCD4" },
  { value: "general_fitness", label: "General Fitness", icon: Zap, color: "#FF9500" },
  { value: "sports_performance", label: "Sports Performance", icon: Target, color: "#00C853" },
  { value: "mental_health", label: "Mental Wellness", icon: Brain, color: "#9B59B6" },
];

// Badge data - matches backend badge_service.py BADGE_REQUIREMENTS
const badgeData = {
  // Session-based badges (with video for gamification)
  badge_first_checkin: { name: "First Steps", icon: Footprints, video: "/badges/first-steps.mp4", desc: "Complete your first check-in", color: "#FFB800", requirement: 1, type: "total_sessions" },
  badge_week_warrior: { name: "Week Warrior", icon: Swords, video: "/badges/spartan-week-warrior.mp4", desc: "Check in 7 times", color: "#FF6B35", requirement: 7, type: "total_sessions" },
  badge_month_master: { name: "Month Master", icon: Calendar, desc: "Check in 30 times", color: "#0066FF", requirement: 30, type: "total_sessions" },
  badge_lion: { name: "Lion Heart", icon: Flame, video: "/badges/Lion.mp4", desc: "Reach 50 total check-ins", color: "#FF9500", requirement: 50, type: "total_sessions" },
  badge_century: { name: "Century Club", icon: Hash, video: "/badges/century.mp4", desc: "Reach 100 total check-ins", color: "#00C853", requirement: 100, type: "total_sessions" },
  // Streak-based badges (with video for gamification)
  badge_streak_starter: { name: "Streak Starter", icon: Flame, video: "/badges/fist-shield.mp4", desc: "Maintain a 4-week streak", color: "#FF9500", requirement: 4, type: "current_streak" },
  badge_streak_10: { name: "10 Week Streak", icon: Flame, video: "/badges/sword-10-week.mp4", desc: "Maintain a 10-week streak", color: "#FF3B30", requirement: 10, type: "current_streak" },
  badge_consistency_king: { name: "Consistency King", icon: Crown, desc: "Maintain a 12-week streak", color: "#8B5CF6", requirement: 12, type: "current_streak" },
  badge_streak_25: { name: "25 Week Legend", icon: Gem, desc: "Maintain a 25-week streak", color: "#9B59B6", requirement: 25, type: "current_streak" },
  badge_streak_52: { name: "Year Legend", icon: Crown, desc: "52-week streak - a full year!", color: "#FFD700", requirement: 52, type: "current_streak" },
  // Challenge-based badges
  badge_challenge_winner: { name: "Challenge Champion", icon: Trophy, desc: "Win your first challenge", color: "#FFB800", requirement: 1, type: "challenges_won" },
  badge_challenge_master: { name: "Challenge Master", icon: Medal, desc: "Win 5 challenges", color: "#FF9500", requirement: 5, type: "challenges_won" },
  badge_challenge_legend: { name: "Challenge Legend", icon: Trophy, desc: "Win 10 challenges", color: "#FFD700", requirement: 10, type: "challenges_won" },
};

// Badge progress ring component - properly centered
const BadgeProgressRing = ({ progress, size = 56, strokeWidth = 3, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      width={size}
      height={size}
      style={{ transform: 'translate(-50%, -50%) rotate(-90deg)' }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#E5E7EB"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
};

// Helper to check if badge should be shown as earned (based on actual progress)
const isBadgeEarned = (badgeId, badge, user, earnedBadgesArray) => {
  // First check if explicitly in the earned badges array
  if (earnedBadgesArray.includes(badgeId)) return true;

  // Fallback: check if user meets the requirement (for badges earned before system was implemented)
  let current = 0;
  if (badge.type === 'total_sessions') current = user?.total_sessions || 0;
  else if (badge.type === 'current_streak') current = user?.current_streak || 0;
  else if (badge.type === 'challenges_won') current = user?.challenges_won || 0;

  return current >= badge.requirement;
};

// Workout type icons
const workoutIcons = {
  "Weights": { icon: Dumbbell, color: "#0066FF" },
  "Cardio": { icon: Heart, color: "#FF3B30" },
  "CrossFit": { icon: Activity, color: "#00C853" },
  "Yoga": { icon: Sparkles, color: "#8B5CF6" },
  "Swimming": { icon: Waves, color: "#00BCD4" },
  "HIIT": { icon: Zap, color: "#FF9500" },
  "Cycling": { icon: Activity, color: "#00C853" },
  "Boxing": { icon: Swords, color: "#FF6B35" },
  "Pilates": { icon: Sparkles, color: "#9B59B6" },
  "Class": { icon: Users, color: "#7C3AED" },
  "default": { icon: Dumbbell, color: "#0066FF" }
};

// Streak Ring Component
const StreakRing = ({ current, best, size = 120 }) => {
  const progress = best > 0 ? Math.min((current / best) * 100, 100) : 0;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F0F2F5"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#streakGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="100%" stopColor="#FF9500" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Flame className="w-6 h-6 text-[#FF6B35] mb-1" />
        <span className="text-3xl font-bold text-[#111111]">{current}</span>
        <span className="text-xs text-[#888888] uppercase tracking-wide">weeks</span>
      </div>
    </div>
  );
};

// Group checkins by date
const groupCheckinsByDate = (checkins) => {
  const groups = {};

  checkins.forEach(checkin => {
    const date = new Date(checkin.checked_in_at);
    let label;

    if (isToday(date)) {
      label = "Today";
    } else if (isYesterday(date)) {
      label = "Yesterday";
    } else if (isThisWeek(date)) {
      label = format(date, "EEEE"); // Day name
    } else if (isThisMonth(date)) {
      label = format(date, "MMMM d");
    } else {
      label = format(date, "MMMM d, yyyy");
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(checkin);
  });

  return groups;
};

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: gym } = useGym(user?.primary_gym_id);
  const { data: checkinsData, isLoading: checkinsLoading } = useMyCheckins(50);
  const updateUserMutation = useUpdateUser();

  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");
  const [selectedBadge, setSelectedBadge] = useState(null); // For badge modal
  const [editData, setEditData] = useState({
    display_name: "",
    bio: "",
    fitness_goal: ""
  });

  useEffect(() => {
    if (user) {
      setEditData({
        display_name: user.display_name || user.name || "",
        bio: user.bio || "",
        fitness_goal: user.fitness_goal || ""
      });
    }
  }, [user]);

  const checkins = checkinsData?.checkins || [];
  const groupedCheckins = useMemo(() => groupCheckinsByDate(checkins), [checkins]);

  const handleSave = async () => {
    try {
      await updateUserMutation.mutateAsync(editData);
      setEditOpen(false);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/user/${user?.user_id || user?.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${user?.display_name || user?.name} on GymGraph`,
          text: `Check out my fitness journey on GymGraph!`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Profile link copied!");
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Profile link copied!");
      }
    }
  };

  const downloadShareCard = useCallback(async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 540;
    const height = 720;
    canvas.width = width;
    canvas.height = height;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0066FF');
    gradient.addColorStop(1, '#003D99');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(30, 30, width - 60, height - 60, 24);
    ctx.fill();

    ctx.fillStyle = '#0066FF';
    ctx.beginPath();
    ctx.arc(width / 2, 130, 50, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((user?.display_name || user?.name || 'U').charAt(0).toUpperCase(), width / 2, 145);

    ctx.fillStyle = '#111111';
    ctx.font = 'bold 28px Inter, system-ui, sans-serif';
    ctx.fillText(user?.display_name || user?.name || 'GymGraph User', width / 2, 220);

    ctx.fillStyle = '#555555';
    ctx.font = '16px Inter, system-ui, sans-serif';
    ctx.fillText(gym?.name || 'GymGraph Member', width / 2, 250);

    const statsY = 320;
    const stats = [
      { value: user?.total_sessions || 0, label: 'Sessions' },
      { value: `${user?.current_streak || 0}w`, label: 'Streak' },
      { value: user?.challenges_won || 0, label: 'Wins' },
    ];

    stats.forEach((stat, i) => {
      const x = 90 + (i * 150);
      ctx.fillStyle = '#F8F9FA';
      ctx.beginPath();
      ctx.roundRect(x - 55, statsY - 30, 110, 80, 12);
      ctx.fill();

      ctx.fillStyle = '#111111';
      ctx.font = 'bold 28px Inter, system-ui, sans-serif';
      ctx.fillText(String(stat.value), x, statsY + 10);
      ctx.fillStyle = '#888888';
      ctx.font = '12px Inter, system-ui, sans-serif';
      ctx.fillText(stat.label, x, statsY + 35);
    });

    if (user?.current_streak > 0) {
      ctx.fillStyle = '#FF6B35';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 70, 440, 140, 36, 18);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px Inter, system-ui, sans-serif';
      ctx.fillText(`${user.current_streak} Week Streak`, width / 2, 463);
    }

    ctx.fillStyle = '#0066FF';
    ctx.font = 'bold 18px Inter, system-ui, sans-serif';
    ctx.fillText('GymGraph', width / 2, height - 80);
    ctx.fillStyle = '#888888';
    ctx.font = '14px Inter, system-ui, sans-serif';
    ctx.fillText('gymgraph.app', width / 2, height - 55);

    const link = document.createElement('a');
    link.download = `gymgraph-${user?.display_name || 'profile'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success("Share card downloaded!");
  }, [user, gym]);

  if (!user) {
    return (
      <Layout user={user}>
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-[#F0F2F5] rounded-2xl" />
              <div className="space-y-2">
                <div className="h-6 w-32 bg-[#F0F2F5] rounded" />
                <div className="h-4 w-48 bg-[#F0F2F5] rounded" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const earnedBadges = user?.badges || [];
  const fitnessGoalData = fitnessGoals.find(g => g.value === user?.fitness_goal);

  return (
    <Layout user={user}>
      <div className="max-w-2xl mx-auto space-y-6" data-testid="profile-page">
        {/* Profile Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 rounded-2xl border-2 border-[#E5E7EB]">
              <AvatarImage src={user?.picture} className="rounded-xl" />
              <AvatarFallback className="bg-[#0066FF] text-white text-2xl rounded-xl font-bold">
                {(user?.display_name || user?.name || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold text-[#111111]">
                {user?.display_name || user?.name}
              </h1>
              {gym?.name && (
                <div className="flex items-center gap-1.5 text-[#555555] text-sm mt-1">
                  <Building2 className="w-4 h-4" />
                  <span>{gym.name}</span>
                </div>
              )}
              {user?.bio && (
                <p className="text-[#555555] text-sm mt-2 max-w-xs">{user.bio}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-xl border-[#E5E7EB] text-[#555555]">
                  <Edit2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-2xl max-w-sm">
                <DialogHeader>
                  <DialogTitle className="text-[#111111]">Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-5 mt-4">
                  <div>
                    <label className="text-sm font-medium text-[#333333] mb-2 block">Display Name</label>
                    <Input
                      value={editData.display_name}
                      onChange={(e) => setEditData({ ...editData, display_name: e.target.value })}
                      className="rounded-xl h-12 border-[#E5E7EB] focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#333333] mb-2 block">Bio</label>
                    <Textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value.slice(0, 120) })}
                      placeholder="Tell us about yourself..."
                      className="rounded-xl min-h-[100px] resize-none border-[#E5E7EB] focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all"
                    />
                    <p className="text-[#888888] text-xs mt-1.5 text-right">{editData.bio.length}/120</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#333333] mb-2 block">Fitness Goal</label>
                    <Select
                      value={editData.fitness_goal}
                      onValueChange={(v) => setEditData({ ...editData, fitness_goal: v })}
                    >
                      <SelectTrigger className="rounded-xl h-12 border-[#E5E7EB] focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20">
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#E5E7EB] shadow-lg p-1">
                        {fitnessGoals.map((goal) => (
                          <SelectItem
                            key={goal.value}
                            value={goal.value}
                            className="rounded-lg cursor-pointer focus:bg-[#F0F4FF] data-[state=checked]:bg-[#E6F0FF]"
                          >
                            <span className="flex items-center gap-3 py-0.5">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${goal.color}15` }}>
                                <goal.icon className="w-4 h-4" style={{ color: goal.color }} />
                              </div>
                              <span className="font-medium text-[#333333]">{goal.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={updateUserMutation.isPending}
                    className="w-full bg-[#0066FF] hover:bg-[#0052CC] rounded-xl h-12 font-semibold shadow-md shadow-[#0066FF]/20 transition-all"
                  >
                    {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={handleShare} size="sm" className="rounded-xl bg-[#0066FF] hover:bg-[#0052CC]">
              <Share2 className="w-4 h-4 mr-1.5" />
              Share
            </Button>
          </div>
        </div>

        {/* Fitness Goal Badge */}
        {fitnessGoalData && (
          <div className="inline-flex items-center gap-2 bg-[#F0F2F5] px-4 py-2 rounded-full">
            <fitnessGoalData.icon className="w-5 h-5" style={{ color: fitnessGoalData.color }} />
            <span className="text-sm font-medium text-[#555555]">{fitnessGoalData.label}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-[#F8F9FA] border-0 shadow-none">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-[#111111]">{user?.total_sessions || 0}</p>
              <p className="text-sm text-[#555555] mt-1">Sessions</p>
            </CardContent>
          </Card>
          <Card className="bg-[#F8F9FA] border-0 shadow-none">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-[#111111]">{user?.longest_streak || 0}<span className="text-lg">w</span></p>
              <p className="text-sm text-[#555555] mt-1">Best Streak</p>
            </CardContent>
          </Card>
          <Card className="bg-[#F8F9FA] border-0 shadow-none">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-[#111111]">{user?.challenges_won || 0}</p>
              <p className="text-sm text-[#555555] mt-1">Wins</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Streak */}
        <Card className="card-premium overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#888888] uppercase tracking-wide mb-1">Current Streak</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#111111]">{user?.current_streak || 0}</span>
                  <span className="text-lg text-[#555555]">weeks</span>
                </div>
                {user?.current_streak > 0 && (
                  <p className="text-sm text-[#00C853] mt-2 flex items-center gap-1">
                    <Flame className="w-4 h-4" />
                    {user.current_streak >= user?.longest_streak ? "Personal best!" : `${user.longest_streak - user.current_streak}w to beat your record`}
                  </p>
                )}
                {user?.current_streak === 0 && (
                  <p className="text-sm text-[#888888] mt-2">Check in this week to start a streak</p>
                )}
              </div>
              <StreakRing current={user?.current_streak || 0} best={user?.longest_streak || 1} />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[#F0F2F5] rounded-xl">
          {[
            { id: "feed", label: "My Feed", icon: Activity },
            { id: "badges", label: "Badges", icon: Award },
            { id: "stats", label: "Stats", icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-white text-[#111111] shadow-sm"
                  : "text-[#555555] hover:text-[#111111]"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* My Feed Tab */}
        {activeTab === "feed" && (
          <div className="space-y-4">
            {checkinsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="card-premium">
                    <CardContent className="p-4">
                      <div className="animate-pulse flex items-start gap-3">
                        <div className="w-12 h-12 bg-[#F0F2F5] rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-[#F0F2F5] rounded w-3/4" />
                          <div className="h-3 bg-[#F0F2F5] rounded w-1/2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : checkins.length === 0 ? (
              <Card className="card-premium">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-[#E6F0FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Dumbbell className="w-8 h-8 text-[#0066FF]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#111111] mb-2">Start Your Journey</h3>
                  <p className="text-[#555555] text-sm mb-4 max-w-xs mx-auto">
                    Your workout feed is empty. Check in at your gym to start tracking your progress!
                  </p>
                  <Button
                    onClick={() => navigate('/checkin')}
                    className="bg-[#0066FF] hover:bg-[#0052CC] rounded-xl"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Check In Now
                  </Button>
                </CardContent>
              </Card>
            ) : (
              Object.entries(groupedCheckins).map(([dateLabel, dateCheckins]) => (
                <div key={dateLabel}>
                  {/* Date Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-semibold text-[#111111]">{dateLabel}</span>
                    <div className="flex-1 h-px bg-[#E5E7EB]" />
                    <span className="text-xs text-[#888888]">{dateCheckins.length} workout{dateCheckins.length > 1 ? 's' : ''}</span>
                  </div>

                  {/* Checkin Cards */}
                  <div className="space-y-3">
                    {dateCheckins.map((checkin, index) => {
                      const workoutData = workoutIcons[checkin.workout_type] || workoutIcons.default;
                      const WorkoutIcon = workoutData.icon;
                      return (
                        <Card key={checkin.checkin_id || index} className="card-premium hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              {/* Workout Icon */}
                              <div className="w-12 h-12 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-xl flex items-center justify-center shrink-0">
                                <WorkoutIcon className="w-6 h-6 text-white" />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="font-semibold text-[#111111]">
                                      {checkin.workout_type || "Workout"}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-[#555555] text-sm mt-0.5">
                                      <Building2 className="w-3.5 h-3.5" />
                                      <span className="truncate">{checkin.gym_name}</span>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-sm text-[#555555]">
                                      {format(new Date(checkin.checked_in_at), "h:mm a")}
                                    </p>
                                  </div>
                                </div>

                                {/* Tags */}
                                <div className="flex items-center gap-2 mt-3">
                                  <span className="inline-flex items-center gap-1 text-xs bg-[#E6FFF5] text-[#00C853] px-2 py-1 rounded-lg font-medium">
                                    <CheckCircle className="w-3 h-3" />
                                    Verified
                                  </span>
                                  {checkin.verification_type && (
                                    <span className="text-xs bg-[#F0F2F5] text-[#555555] px-2 py-1 rounded-lg">
                                      {checkin.verification_type.toUpperCase()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === "badges" && (() => {
          // Calculate actual earned badges count using the helper
          const actualEarnedCount = Object.entries(badgeData).filter(
            ([id, badge]) => isBadgeEarned(id, badge, user, earnedBadges)
          ).length;

          return (
          <div className="space-y-4">
            {/* Badge Progress Summary */}
            <Card className="card-premium overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#111111]">Your Badges</h3>
                    <p className="text-sm text-[#555555]">
                      {actualEarnedCount} of {Object.keys(badgeData).length} unlocked
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-[#FFB800]/20 to-[#FF6B35]/20 px-3 py-1.5 rounded-full">
                    <Award className="w-4 h-4 text-[#FFB800]" />
                    <span className="text-sm font-semibold text-[#111111]">{actualEarnedCount}</span>
                  </div>
                </div>
                <div className="w-full bg-[#F0F2F5] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0066FF] to-[#00C853] rounded-full transition-all duration-700"
                    style={{ width: `${(actualEarnedCount / Object.keys(badgeData).length) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Next Badge to Earn */}
            {(() => {
              // Find the closest badge to earn (that user hasn't earned yet)
              const unearned = Object.entries(badgeData).filter(
                ([id, badge]) => !isBadgeEarned(id, badge, user, earnedBadges)
              );
              const nextBadge = unearned.reduce((closest, [id, badge]) => {
                let current = 0;
                if (badge.type === 'total_sessions') current = user?.total_sessions || 0;
                else if (badge.type === 'current_streak') current = user?.current_streak || 0;
                else if (badge.type === 'challenges_won') current = user?.challenges_won || 0;

                const progress = Math.min(100, (current / badge.requirement) * 100);

                if (!closest || progress > closest.progress) {
                  return { id, badge, progress, current };
                }
                return closest;
              }, null);

              if (nextBadge && nextBadge.progress < 100) {
                const NextIcon = nextBadge.badge.icon;
                return (
                  <Card className="card-premium border-2 border-dashed border-[#0066FF]/30 bg-gradient-to-br from-[#E6F0FF] to-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 flex-shrink-0">
                          <BadgeProgressRing
                            progress={nextBadge.progress}
                            color={nextBadge.badge.color}
                            size={56}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <NextIcon className="w-6 h-6" style={{ color: nextBadge.badge.color }} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#0066FF] uppercase tracking-wide mb-0.5">Next Badge</p>
                          <p className="font-semibold text-[#111111] truncate">{nextBadge.badge.name}</p>
                          <p className="text-sm text-[#555555]">
                            {nextBadge.current}/{nextBadge.badge.requirement} - {nextBadge.badge.desc}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-[#0066FF]">{Math.round(nextBadge.progress)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
              return null;
            })()}

            {/* All Badges Grid */}
            <Card className="card-premium">
              <CardContent className="p-5">
                <h4 className="text-sm font-semibold text-[#555555] uppercase tracking-wide mb-4">All Badges</h4>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {Object.entries(badgeData).map(([id, badge]) => {
                    const earned = isBadgeEarned(id, badge, user, earnedBadges);
                    const BadgeIcon = badge.icon;

                    // Calculate progress for unearned badges
                    let progress = 0;
                    if (!earned) {
                      let current = 0;
                      if (badge.type === 'total_sessions') current = user?.total_sessions || 0;
                      else if (badge.type === 'current_streak') current = user?.current_streak || 0;
                      else if (badge.type === 'challenges_won') current = user?.challenges_won || 0;
                      progress = Math.min((current / badge.requirement) * 100, 99);
                    }

                    // Use VideoBadge for badges with video
                    if (badge.video) {
                      return (
                        <div key={id} className="flex flex-col items-center gap-1.5">
                          <VideoBadge
                            src={badge.video}
                            name={badge.name}
                            earned={earned}
                            size={52}
                            progress={progress}
                            onClick={() => earned && setSelectedBadge({ ...badge, id })}
                          />
                          <p className={`text-[10px] font-medium text-center leading-tight line-clamp-2 ${
                            earned ? "text-[#111111]" : "text-[#999]"
                          }`}>
                            {badge.name}
                          </p>
                        </div>
                      );
                    }

                    // Fallback to icon-based badge
                    return (
                      <div key={id} className="flex flex-col items-center gap-1.5">
                        <div
                          className={`relative w-[52px] h-[52px] rounded-xl flex items-center justify-center transition-all ${
                            earned
                              ? "bg-gradient-to-br from-[#0066FF] to-[#0052CC] shadow-md cursor-pointer hover:scale-105"
                              : "bg-[#F5F5F5]"
                          }`}
                          title={badge.desc}
                        >
                          <BadgeIcon
                            className={`w-5 h-5 ${earned ? "" : "opacity-50"}`}
                            style={{ color: earned ? 'white' : '#9CA3AF' }}
                          />
                          {!earned && (
                            <div className="absolute bottom-1 right-1 w-4 h-4 bg-black/50 rounded-full flex items-center justify-center">
                              <Lock className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <p className={`text-[10px] font-medium text-center leading-tight line-clamp-2 ${
                          earned ? "text-[#111111]" : "text-[#999]"
                        }`}>
                          {badge.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Badge Modal */}
            <VideoBadgeModal
              isOpen={!!selectedBadge}
              onClose={() => setSelectedBadge(null)}
              badge={selectedBadge ? {
                src: selectedBadge.video,
                name: selectedBadge.name,
                description: selectedBadge.desc,
                color: selectedBadge.color,
              } : null}
            />

            {/* Empty State */}
            {actualEarnedCount === 0 && (
              <Card className="card-premium">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FFB800]/20 to-[#FF6B35]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-[#FFB800]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#111111] mb-2">Start Earning Badges!</h3>
                  <p className="text-[#555555] text-sm max-w-xs mx-auto">
                    Check in at your gym to unlock your first badge. Keep up the consistency to earn more!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          );
        })()}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="space-y-4">
            <Card className="card-premium">
              <CardContent className="p-5">
                <h3 className="font-semibold text-[#111111] mb-4">Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E6F0FF] rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-[#0066FF]" />
                      </div>
                      <span className="text-[#555555]">Consistency Score</span>
                    </div>
                    <span className="text-lg font-semibold text-[#111111]">{Math.round(user?.consistency_score || 0)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FFF0EB] rounded-xl flex items-center justify-center">
                        <Flame className="w-5 h-5 text-[#FF6B35]" />
                      </div>
                      <span className="text-[#555555]">Current Streak</span>
                    </div>
                    <span className="text-lg font-semibold text-[#111111]">{user?.current_streak || 0} weeks</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E6FFF5] rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#00C853]" />
                      </div>
                      <span className="text-[#555555]">Total Sessions</span>
                    </div>
                    <span className="text-lg font-semibold text-[#111111]">{user?.total_sessions || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardContent className="p-5">
                <h3 className="font-semibold text-[#111111] mb-4">Achievements</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FFF8E6] rounded-xl flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-[#FFB800]" />
                      </div>
                      <span className="text-[#555555]">Challenges Won</span>
                    </div>
                    <span className="text-lg font-semibold text-[#111111]">{user?.challenges_won || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F0F2F5] rounded-xl flex items-center justify-center">
                        <Target className="w-5 h-5 text-[#555555]" />
                      </div>
                      <span className="text-[#555555]">Challenges Joined</span>
                    </div>
                    <span className="text-lg font-semibold text-[#111111]">{user?.challenges_joined || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E6F0FF] rounded-xl flex items-center justify-center">
                        <Award className="w-5 h-5 text-[#0066FF]" />
                      </div>
                      <span className="text-[#555555]">Badges Earned</span>
                    </div>
                    <span className="text-lg font-semibold text-[#111111]">{earnedBadges.length} / {Object.keys(badgeData).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </Layout>
  );
}
