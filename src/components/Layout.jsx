import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications, useMarkNotificationRead } from "@/hooks";
import { auth } from "@/lib/supabase";
import {
  LayoutDashboard,
  MapPin,
  Building2,
  Trophy,
  Users,
  Target,
  User,
  Settings,
  LogOut,
  Menu,
  Flame,
  Bell,
  Gift,
  Loader2,
  Shield
} from "lucide-react";
import InstallPWA from "@/components/InstallPWA";

// GymGraph Mountain Logo Component
const GymGraphLogo = ({ className = "w-6 h-6", color = "white" }) => (
  <svg viewBox="0 0 512 512" className={className} fill={color}>
    <polygon points="80,400 220,160 320,400" />
    <polygon points="200,400 340,100 460,400" />
  </svg>
);

export default function Layout({ children, user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // React Query hook - fetches on mount, shares cache with Notifications page
  const { data: notificationData, isLoading: notificationsLoading, refetch } = useNotifications();
  const markReadMutation = useMarkNotificationRead();

  // Derive data from cached query
  const notifications = notificationData?.notifications || [];
  const unreadCount = notificationData?.unread_count || 0;

  // Refetch when popover opens
  const handlePopoverOpen = (open) => {
    if (open) {
      refetch();
    }
  };

  // Mark notification as read when clicked
  const handleNotificationClick = (notif) => {
    if (!notif.read) {
      markReadMutation.mutate(notif.notification_id || notif.id);
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

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: "/checkin", label: "Check In", icon: <MapPin className="w-5 h-5" /> },
    { path: "/gyms", label: "Gyms", icon: <Building2 className="w-5 h-5" /> },
    { path: "/leaderboards", label: "Rankings", icon: <Trophy className="w-5 h-5" /> },
    { path: "/connections", label: "Community", icon: <Users className="w-5 h-5" /> },
    { path: "/challenges", label: "Challenges", icon: <Target className="w-5 h-5" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#F8F9FA] overflow-x-hidden">
      {/* Top Navigation - Fixed */}
      <nav className="fixed top-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-xl border-b border-[#E5E7EB]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-xl flex items-center justify-center shadow-md shadow-[#0066FF]/20 group-hover:shadow-lg group-hover:shadow-[#0066FF]/30 transition-all duration-200">
                <GymGraphLogo className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-[#111111] hidden sm:block">GymGraph</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  data-testid={`nav-${item.path.replace('/', '')}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/20'
                      : 'text-[#555555] hover:text-[#111111] hover:bg-[#F0F2F5]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Streak Badge */}
              {user?.current_streak > 0 && (
                <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#FF6B35]/10 to-[#FF9500]/10 px-3 py-2 rounded-xl border border-[#FF6B35]/20">
                  <Flame className="w-4 h-4 text-[#FF6B35]" />
                  <span className="text-[#FF6B35] font-semibold text-sm">{user.current_streak}w</span>
                </div>
              )}

              {/* Rewards */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/rewards')}
                className="text-[#FFD700] hover:bg-[#FFF8E6] rounded-xl"
              >
                <Gift className="w-5 h-5" />
              </Button>

              {/* Notifications - React Query cached */}
              <Popover onOpenChange={handlePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-[#555555] hover:text-[#0066FF] hover:bg-[#E6F0FF] rounded-xl">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF3B30] text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] sm:w-96 max-w-[400px] p-0 bg-white border-[#E5E7EB] shadow-xl rounded-2xl mx-4 sm:mx-0" align="end" sideOffset={8}>
                  <div className="p-3 sm:p-4 border-b border-[#EEEEEE] flex items-center justify-between">
                    <h3 className="font-semibold text-[#111111] text-sm sm:text-base">Notifications</h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <span className="text-xs text-[#0066FF] font-medium bg-[#E6F0FF] px-2 py-1 rounded-lg">
                          {unreadCount} new
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => refetch()}
                        disabled={notificationsLoading}
                        className="h-8 w-8 text-[#888888] hover:text-[#0066FF] rounded-lg"
                      >
                        <Loader2 className={`w-4 h-4 ${notificationsLoading ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto">
                    {notificationsLoading && notifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <Loader2 className="w-6 h-6 text-[#0066FF] mx-auto mb-2 animate-spin" />
                        <p className="text-[#555555] text-sm">Loading...</p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <Bell className="w-8 h-8 text-[#888888] mx-auto mb-2" />
                        <p className="text-[#555555] text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      <>
                        {notifications.slice(0, 5).map((notif, i) => (
                          <div
                            key={notif.notification_id || notif.id || i}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-3 sm:p-4 border-b border-[#EEEEEE] last:border-0 hover:bg-[#F8F9FA] active:bg-[#F0F2F5] cursor-pointer transition-colors ${
                              !notif.read ? 'bg-[#E6F0FF]/30' : ''
                            }`}
                          >
                            <div className="flex gap-3">
                              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                notif.type === 'gym_announcement' ? 'bg-[#F3E8FF]' : 'bg-[#E6F0FF]'
                              }`}>
                                {notif.type === 'gym_announcement' ? (
                                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#7C3AED]" />
                                ) : (
                                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#0066FF]" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-[#111111] font-medium text-xs sm:text-sm truncate">{notif.title}</p>
                                  {!notif.read && (
                                    <span className="w-2 h-2 bg-[#0066FF] rounded-full flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-[#555555] text-xs sm:text-sm line-clamp-2">{notif.message}</p>
                                {notif.type === 'gym_announcement' && notif.data?.gym_name && (
                                  <p className="text-[#7C3AED] text-xs mt-1">From {notif.data.gym_name}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-2 sm:p-3 border-t border-[#EEEEEE]">
                      <Button
                        variant="ghost"
                        className="w-full text-[#0066FF] hover:bg-[#E6F0FF] active:bg-[#D6E8FF] rounded-xl font-medium text-sm h-10"
                        onClick={() => navigate('/notifications')}
                      >
                        View all notifications
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button data-testid="user-menu" variant="ghost" className="relative h-10 w-10 rounded-full p-0 border-2 border-[#E5E7EB] hover:border-[#0066FF] transition-colors">
                    <Avatar className="h-9 w-9 rounded-full">
                      <AvatarImage src={user?.picture} alt={user?.display_name || user?.name} className="rounded-full object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-[#0066FF] to-[#0052CC] text-white rounded-full font-semibold">
                        {(user?.display_name || user?.name || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border-[#E5E7EB] shadow-xl rounded-2xl p-1" align="end">
                  <div className="px-3 py-2">
                    <p className="font-semibold text-[#111111]">{user?.display_name || user?.name}</p>
                    <p className="text-sm text-[#888888]">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-[#EEEEEE]" />
                  <DropdownMenuItem
                    className="text-[#555555] hover:text-[#0066FF] hover:bg-[#F8F9FA] cursor-pointer rounded-xl mx-1 my-0.5"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-[#555555] hover:text-[#0066FF] hover:bg-[#F8F9FA] cursor-pointer rounded-xl mx-1 my-0.5"
                    onClick={() => navigate('/my-challenges')}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    My Challenges
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-[#555555] hover:text-[#0066FF] hover:bg-[#F8F9FA] cursor-pointer rounded-xl mx-1 my-0.5"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  {user?.role === 'super_admin' && (
                    <>
                      <DropdownMenuSeparator className="bg-[#EEEEEE]" />
                      <DropdownMenuItem
                        className="text-[#8B5CF6] hover:text-[#8B5CF6] hover:bg-[#F3E8FF] cursor-pointer rounded-xl mx-1 my-0.5"
                        onClick={() => navigate('/super-admin')}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-[#EEEEEE]" />
                  <DropdownMenuItem
                    data-testid="logout-button"
                    className="text-[#FF3B30] hover:text-[#FF3B30] hover:bg-red-50 cursor-pointer rounded-xl mx-1 my-0.5"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden text-[#555555] hover:text-[#0066FF] hover:bg-[#E6F0FF] rounded-xl">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] bg-white border-[#E5E7EB] p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-[#EEEEEE]">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-xl flex items-center justify-center shadow-md">
                          <GymGraphLogo className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-[#111111]">GymGraph</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 rounded-full border-2 border-[#E5E7EB]">
                          <AvatarImage src={user?.picture} className="rounded-full object-cover" />
                          <AvatarFallback className="bg-gradient-to-br from-[#0066FF] to-[#0052CC] text-white rounded-full font-semibold">
                            {(user?.display_name || user?.name || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[#111111] font-semibold">{user?.display_name || user?.name}</p>
                          {user?.current_streak > 0 && (
                            <div className="flex items-center gap-1 text-[#FF6B35]">
                              <Flame className="w-4 h-4" />
                              <span className="text-sm font-medium">{user.current_streak}w streak</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                            isActive(item.path)
                              ? 'bg-[#0066FF] text-white shadow-md'
                              : 'text-[#555555] hover:text-[#0066FF] hover:bg-[#F8F9FA]'
                          }`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </nav>

                    <div className="p-4 border-t border-[#EEEEEE] space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#555555] hover:text-[#0066FF] hover:bg-[#F8F9FA] font-medium"
                      >
                        <User className="w-5 h-5" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#555555] hover:text-[#0066FF] hover:bg-[#F8F9FA] font-medium"
                      >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                      </Link>
                      {user?.role === 'super_admin' && (
                        <Link
                          to="/super-admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#8B5CF6] hover:bg-[#F3E8FF] font-medium"
                        >
                          <Shield className="w-5 h-5" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#FF3B30] hover:bg-red-50 font-medium w-full"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - with top padding for fixed header */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-24 lg:pb-8 overflow-x-hidden">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Fixed */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-[#E5E7EB]/50 lg:hidden z-[9999] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16 px-2">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center justify-center flex-1 h-full tap-scale ${
              isActive('/dashboard') ? 'text-[#0066FF]' : 'text-[#888888]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </Link>
          <Link
            to="/checkin"
            className={`flex flex-col items-center justify-center flex-1 h-full tap-scale ${
              isActive('/checkin') ? 'text-[#0066FF]' : 'text-[#888888]'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Check In</span>
          </Link>
          <Link
            to="/challenges"
            className={`flex flex-col items-center justify-center flex-1 h-full tap-scale ${
              isActive('/challenges') || isActive('/my-challenges') ? 'text-[#0066FF]' : 'text-[#888888]'
            }`}
          >
            <Target className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Challenges</span>
          </Link>
          <Link
            to="/leaderboards"
            className={`flex flex-col items-center justify-center flex-1 h-full tap-scale ${
              isActive('/leaderboards') ? 'text-[#0066FF]' : 'text-[#888888]'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Rankings</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center flex-1 h-full tap-scale ${
              isActive('/profile') ? 'text-[#0066FF]' : 'text-[#888888]'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Profile</span>
          </Link>
        </div>
      </nav>

      {/* PWA Install Prompt */}
      <InstallPWA />
    </div>
  );
}
