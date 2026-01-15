import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useAuth } from "@/App";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from "@/hooks";
import {
  Bell,
  CheckCircle,
  Trophy,
  Target,
  Users,
  Gift,
  Building2,
  Megaphone,
  Clock,
  CheckCheck,
  Trash2,
  RefreshCw
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Get icon based on notification type
const getNotificationIcon = (type) => {
  switch (type) {
    case "gym_announcement":
      return <Megaphone className="w-5 h-5 text-[#7C3AED]" />;
    case "challenge_joined":
      return <Target className="w-5 h-5 text-[#0066FF]" />;
    case "challenge_won":
      return <Trophy className="w-5 h-5 text-[#FFD700]" />;
    case "credits_earned":
      return <Gift className="w-5 h-5 text-[#00C853]" />;
    case "connection_request":
      return <Users className="w-5 h-5 text-[#FF9500]" />;
    case "badge_earned":
      return <CheckCircle className="w-5 h-5 text-[#00C853]" />;
    default:
      return <Bell className="w-5 h-5 text-[#0066FF]" />;
  }
};

// Get style based on notification type
const getNotificationStyle = (type) => {
  switch (type) {
    case "gym_announcement":
      return "bg-[#F3E8FF] border-[#7C3AED]/20";
    case "challenge_won":
      return "bg-[#FFF8E6] border-[#FFD700]/30";
    case "credits_earned":
      return "bg-[#E6FFF5] border-[#00C853]/20";
    default:
      return "bg-[#F8F9FA] border-[#E5E7EB]";
  }
};

// Notification Card Component
const NotificationCard = ({ notification, onMarkAsRead, onDelete }) => {
  const isAnnouncement = notification.type === "gym_announcement";
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });

  return (
    <Card
      className={`card-premium transition-all cursor-pointer hover:border-[#0066FF]/30 ${
        !notification.read ? 'ring-2 ring-[#0066FF]/20' : ''
      }`}
      onClick={() => !notification.read && onMarkAsRead(notification.notification_id)}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationStyle(notification.type)}`}>
            {getNotificationIcon(notification.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-[#111111]">{notification.title}</h3>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-[#0066FF] rounded-full flex-shrink-0" />
                  )}
                  {isAnnouncement && (
                    <Badge className="bg-[#F3E8FF] text-[#7C3AED] border-[#7C3AED]/20 border text-xs">
                      <Building2 className="w-3 h-3 mr-1" />
                      {notification.data?.gym_name || "Your Gym"}
                    </Badge>
                  )}
                </div>
                <p className="text-[#555555] text-sm mt-1">{notification.message}</p>

                {isAnnouncement && notification.data?.posted_by && (
                  <p className="text-[#888888] text-xs mt-2">
                    Posted by {notification.data.posted_by}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-[#888888] text-xs whitespace-nowrap">{timeAgo}</span>
                {notification.type !== "gym_announcement" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#888888] hover:text-[#FF3B30]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(notification.notification_id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Notification Group Component
const NotificationGroup = ({ title, notifications, icon, onMarkAsRead, onDelete }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[#555555]">
        {icon}
        <h3 className="font-medium text-sm">{title}</h3>
        <span className="text-[#888888] text-xs">({notifications.length})</span>
      </div>
      <div className="space-y-2">
        {notifications.map((notif) => (
          <NotificationCard
            key={notif.notification_id}
            notification={notif}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // React Query hooks for data fetching with caching
  const { data, isLoading, isFetching, refetch } = useNotifications();

  // Mutation hooks with optimistic updates
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotification();

  // Derive data from cached query
  const notifications = data?.notifications || [];
  const grouped = data?.grouped || {};
  const unreadCount = data?.unread_count || 0;

  const loading = isLoading;
  const refreshing = isFetching && !isLoading;

  const handleRefresh = () => {
    refetch();
  };

  const markAsRead = (notificationId) => {
    markReadMutation.mutate(notificationId);
  };

  const markAllAsRead = () => {
    markAllReadMutation.mutate();
  };

  const deleteNotification = (notificationId) => {
    deleteMutation.mutate(notificationId);
  };

  if (loading) {
    return (
      <Layout user={user}>
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-[#E5E7EB] rounded-lg" />
            <div className="h-24 bg-[#E5E7EB] rounded-xl" />
            <div className="h-24 bg-[#E5E7EB] rounded-xl" />
            <div className="h-24 bg-[#E5E7EB] rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="max-w-3xl mx-auto space-y-6" data-testid="notifications-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111]">Notifications</h1>
            <p className="text-[#555555] mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="border-[#E5E7EB] text-[#555555] hover:border-[#0066FF] hover:text-[#0066FF] rounded-xl"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                disabled={markAllReadMutation.isPending}
                variant="outline"
                className="border-[#E5E7EB] text-[#555555] hover:border-[#0066FF] hover:text-[#0066FF] rounded-xl"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                {markAllReadMutation.isPending ? "Marking..." : "Mark all read"}
              </Button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <Card className="card-premium">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-[#F0F2F5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-[#888888]" />
              </div>
              <h2 className="text-xl font-semibold text-[#111111] mb-2">No Notifications</h2>
              <p className="text-[#555555]">You&apos;re all caught up! Check back later for updates.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <NotificationGroup
              title="Last Hour"
              notifications={grouped.last_hour}
              icon={<Clock className="w-4 h-4" />}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
            <NotificationGroup
              title="Today"
              notifications={grouped.today}
              icon={<Clock className="w-4 h-4" />}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
            <NotificationGroup
              title="Yesterday"
              notifications={grouped.yesterday}
              icon={<Clock className="w-4 h-4" />}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
            <NotificationGroup
              title="This Week"
              notifications={grouped.this_week}
              icon={<Clock className="w-4 h-4" />}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
            <NotificationGroup
              title="Older"
              notifications={grouped.older}
              icon={<Clock className="w-4 h-4" />}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
