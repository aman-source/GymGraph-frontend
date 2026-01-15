import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Layout from "@/components/Layout";
import { useAuth } from "@/App";
import { useGym, useGymActivity, useUserProgress, useCreateCheckin, useEconomyInfo, useTodayCheckins } from "@/hooks";
import { toast } from "sonner";
import {
  MapPin,
  Loader2,
  CheckCircle,
  XCircle,
  Building2,
  AlertTriangle,
  Zap,
  Flame,
  Users,
  Settings,
  Coins,
  Trophy,
  Target,
  Crosshair,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Star,
  ArrowRight,
  Dumbbell,
  Heart,
  Activity,
  Swords,
  Waves,
  Info,
  Clock,
} from "lucide-react";

// Haversine distance calculation - accurate for Earth coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Format distance for display
const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

// Distance ring visualization - responsive size
const DistanceRing = ({ distance, isAtGym, checkinRadius }) => {
  const percentage = Math.min(100, Math.max(0, ((checkinRadius - distance) / checkinRadius) * 100));
  const strokeWidth = 10;
  const size = 160; // Smaller for mobile
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.max(0, percentage) / 100) * circumference;

  // Color based on distance relative to checkin radius
  const getColor = () => {
    const ratio = distance / checkinRadius;
    if (ratio <= 0.5) return "#00C853"; // Green - very close
    if (ratio <= 1) return "#00C853"; // Green - within range
    if (ratio <= 1.5) return "#FF9500"; // Orange - getting close
    return "#FF3B30"; // Red - far away
  };

  return (
    <div className="relative flex items-center justify-center touch-none" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F0F2F5"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isAtGym ? (
          <>
            <div className="w-12 h-12 bg-[#00C853] rounded-full flex items-center justify-center mb-1 animate-pulse">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#00C853]">You're here!</span>
          </>
        ) : (
          <>
            <span className="text-3xl sm:text-4xl font-bold text-[#111111]">{formatDistance(distance)}</span>
            <span className="text-xs sm:text-sm font-medium text-[#888888]">away</span>
          </>
        )}
      </div>
    </div>
  );
};

// Workout type card - touch optimized
const WorkoutTypeCard = ({ type, icon: Icon, selected, onClick, color }) => (
  <button
    onClick={onClick}
    data-testid={`workout-type-${type.toLowerCase().replace(/\s+/g, '-')}`}
    className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 active:scale-95 touch-manipulation ${
      selected
        ? 'border-[#0066FF] bg-[#E6F0FF] shadow-md'
        : 'border-[#E5E7EB] bg-white hover:border-[#0066FF]/50 active:bg-[#F8F9FA]'
    }`}
  >
    <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" style={{ color: selected ? '#0066FF' : color }} />
    <span className={`text-[10px] sm:text-xs font-medium ${selected ? 'text-[#0066FF]' : 'text-[#555555]'}`}>
      {type}
    </span>
  </button>
);

// Check-in info badge
const CheckinInfoBadge = ({ todayCount, maxPerDay, coinsPerCheckin }) => {
  const remaining = maxPerDay - todayCount;
  const canEarnCoins = todayCount === 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
        remaining > 0 ? 'bg-[#E6F0FF] text-[#0066FF]' : 'bg-[#FEE2E2] text-[#FF3B30]'
      }`}>
        <Clock className="w-3.5 h-3.5" />
        <span className="font-medium">
          {remaining > 0 ? `${remaining} check-in${remaining !== 1 ? 's' : ''} left today` : 'No check-ins left'}
        </span>
      </div>
      {canEarnCoins && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF8E6] text-[#FF9500]">
          <Coins className="w-3.5 h-3.5" />
          <span className="font-medium">+{coinsPerCheckin} coins</span>
        </div>
      )}
      {!canEarnCoins && todayCount > 0 && remaining > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3F4F6] text-[#888888]">
          <Info className="w-3.5 h-3.5" />
          <span className="font-medium">Streak only</span>
        </div>
      )}
    </div>
  );
};

// Confetti celebration
const Confetti = () => {
  const colors = ['#0066FF', '#00C853', '#FF9500', '#8B5CF6', '#FF3B30', '#FFD700'];

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden" style={{ maxWidth: '100vw' }}>
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${Math.random() * 2 + 2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default function CheckIn() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const watchIdRef = useRef(null);
  const bestLocationRef = useRef(null);
  const locationHistoryRef = useRef([]);
  const timeoutIdsRef = useRef([]);

  // Hooks
  const { data: gym } = useGym(user?.primary_gym_id);
  const { data: gymActivity } = useGymActivity(user?.primary_gym_id);
  const { data: progress } = useUserProgress();
  const { mutate: createCheckin, isPending: checking } = useCreateCheckin();
  const { data: economyInfo } = useEconomyInfo();
  const { data: todayCheckins } = useTodayCheckins();

  // Get check-in settings from config
  const checkinRadius = economyInfo?.checkin_radius_meters || 500;
  const maxCheckinsPerDay = economyInfo?.max_checkins_per_day || 2;
  const coinsPerCheckin = economyInfo?.earning?.checkin?.amount || 10;

  // Calculate today's check-in count
  const todayCount = todayCheckins?.length || progress?.today_checkins || 0;
  const canCheckInToday = todayCount < maxCheckinsPerDay;

  // State
  const [location, setLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [workoutType, setWorkoutType] = useState("");
  const [success, setSuccess] = useState(false);
  const [distance, setDistance] = useState(null);
  const [checkinResult, setCheckinResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const workoutTypes = [
    { type: "Weights", icon: Dumbbell, color: "#0066FF" },
    { type: "Cardio", icon: Heart, color: "#FF3B30" },
    { type: "HIIT", icon: Zap, color: "#FF9500" },
    { type: "CrossFit", icon: Activity, color: "#00C853" },
    { type: "Yoga", icon: Sparkles, color: "#8B5CF6" },
    { type: "Boxing", icon: Swords, color: "#FF6B35" },
    { type: "Swimming", icon: Waves, color: "#00BCD4" },
    { type: "Class", icon: Users, color: "#7C3AED" },
  ];

  // Improved location accuracy - use median of recent readings
  const getStableLocation = useCallback((newLat, newLon, newAccuracy) => {
    const history = locationHistoryRef.current;

    // Add to history (keep last 5 readings)
    history.push({ lat: newLat, lon: newLon, accuracy: newAccuracy, timestamp: Date.now() });
    if (history.length > 5) history.shift();

    // Filter out old readings (older than 30 seconds)
    const recentHistory = history.filter(h => Date.now() - h.timestamp < 30000);

    if (recentHistory.length === 0) {
      return { lat: newLat, lon: newLon, accuracy: newAccuracy };
    }

    // Use the most accurate reading from recent history
    const bestReading = recentHistory.reduce((best, current) =>
      current.accuracy < best.accuracy ? current : best
    );

    return bestReading;
  }, []);

  // Update location with stability check
  const updateLocation = useCallback((newLat, newLon, newAccuracy) => {
    const stable = getStableLocation(newLat, newLon, newAccuracy);
    const current = bestLocationRef.current;

    // Always accept if no current location or if new reading is significantly better
    if (!current || stable.accuracy < current.accuracy - 5) {
      bestLocationRef.current = stable;
      setLocation({ latitude: stable.lat, longitude: stable.lon });
      setAccuracy(Math.round(stable.accuracy));
    } else if (current) {
      // Check if user moved significantly
      const moved = calculateDistance(current.lat, current.lon, stable.lat, stable.lon);
      if (moved > 15 && stable.accuracy < 50) {
        bestLocationRef.current = stable;
        setLocation({ latitude: stable.lat, longitude: stable.lon });
        setAccuracy(Math.round(stable.accuracy));
      }
    }
  }, [getStableLocation]);

  // Real-time location tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      setLocationLoading(false);
      return;
    }

    let isMounted = true;

    const getLocation = () => {
      if (!isMounted) return;
      setLocationLoading(true);

      const successHandler = (position) => {
        if (!isMounted) return;
        updateLocation(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.accuracy
        );
        setLocationError(null);
        setLocationLoading(false);
      };

      const errorHandler = (error, isRetry = false) => {
        if (!isMounted) return;

        // Retry with low accuracy if first attempt fails
        if (!isRetry) {
          navigator.geolocation.getCurrentPosition(
            successHandler,
            (retryError) => errorHandler(retryError, true),
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
          );
          return;
        }

        let message = "Location error";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Please enable location access in your browser settings";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location unavailable. Try moving to an open area.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out. Tap refresh to try again.";
            break;
        }
        setLocationError(message);
        setLocationLoading(false);
      };

      // First: Try to get ANY cached position quickly (within 5 seconds)
      navigator.geolocation.getCurrentPosition(
        successHandler,
        () => {
          // No cached position - try with low accuracy first (faster)
          navigator.geolocation.getCurrentPosition(
            successHandler,
            errorHandler,
            { enableHighAccuracy: false, timeout: 8000, maximumAge: 30000 }
          );
        },
        { enableHighAccuracy: false, timeout: 3000, maximumAge: 60000 }
      );
    };

    getLocation();

    // Watch position - start with low accuracy for speed, will improve over time
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        if (!isMounted) return;
        updateLocation(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.accuracy
        );
        setLocationError(null);
        setLocationLoading(false);
      },
      () => {},
      {
        enableHighAccuracy: true, // Will gradually improve accuracy
        timeout: 15000,
        maximumAge: 5000,
      }
    );

    return () => {
      isMounted = false;
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [updateLocation]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach(id => clearTimeout(id));
      timeoutIdsRef.current = [];
    };
  }, []);

  // Calculate distance when location or gym changes
  useEffect(() => {
    if (location && gym?.latitude && gym?.longitude) {
      const dist = calculateDistance(
        location.latitude,
        location.longitude,
        parseFloat(gym.latitude),
        parseFloat(gym.longitude)
      );
      setDistance(dist);
    }
  }, [location, gym]);

  // Refresh location manually - optimized for speed
  const refreshLocation = useCallback(() => {
    setLocationLoading(true);
    setLocationError(null);

    // Try to get a quick cached position first (shows something immediately)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Got quick position - update immediately
        bestLocationRef.current = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setAccuracy(Math.round(position.coords.accuracy));
        setLocationError(null);
        setLocationLoading(false);

        // If accuracy is poor, try to get better in background
        if (position.coords.accuracy > 100) {
          navigator.geolocation.getCurrentPosition(
            (betterPos) => {
              if (betterPos.coords.accuracy < position.coords.accuracy) {
                bestLocationRef.current = {
                  lat: betterPos.coords.latitude,
                  lon: betterPos.coords.longitude,
                  accuracy: betterPos.coords.accuracy
                };
                setLocation({
                  latitude: betterPos.coords.latitude,
                  longitude: betterPos.coords.longitude,
                });
                setAccuracy(Math.round(betterPos.coords.accuracy));
                toast.success("Location improved");
              }
            },
            () => {}, // Ignore errors for background improvement
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        }
        toast.success("Location updated");
      },
      () => {
        // Quick position failed - try with any accuracy
        navigator.geolocation.getCurrentPosition(
          (position) => {
            bestLocationRef.current = {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              accuracy: position.coords.accuracy
            };
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setAccuracy(Math.round(position.coords.accuracy));
            setLocationError(null);
            setLocationLoading(false);
            toast.success("Location updated");
          },
          () => {
            setLocationError("Failed to get location. Check GPS settings.");
            setLocationLoading(false);
            toast.error("Could not get location");
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 30000 } // Quick first attempt
    );
  }, []);

  const handleCheckIn = () => {
    if (!location) {
      toast.error("Location is required for check-in");
      return;
    }

    if (!gym) {
      toast.error("Please select a gym first");
      return;
    }

    if (!canCheckInToday) {
      toast.error("You've reached your daily check-in limit");
      return;
    }

    createCheckin(
      {
        gym_id: gym.id,
        latitude: location.latitude,
        longitude: location.longitude,
        verification_type: "gps",
        workout_type: workoutType || null,
      },
      {
        onSuccess: (data) => {
          setCheckinResult(data);
          setSuccess(true);
          setShowConfetti(true);

          // Clear any previous timeouts
          timeoutIdsRef.current.forEach(id => clearTimeout(id));
          timeoutIdsRef.current = [];

          // Show streak bonus toasts
          if (data.streak?.bonuses?.length > 0) {
            data.streak.bonuses.forEach((bonus) => {
              toast.success(`${bonus.milestone}-day streak bonus: +${bonus.coins} coins!`);
            });
          }

          // Show badge unlock celebrations with delay for stagger effect
          if (data.badges_earned?.length > 0) {
            data.badges_earned.forEach((badge, index) => {
              const timeoutId = setTimeout(() => {
                toast.success(
                  `Badge Unlocked: ${badge.badge_name}!`,
                  {
                    icon: '🏆',
                    duration: 5000,
                    description: `You earned the ${badge.badge_name} badge!`
                  }
                );
              }, 1000 + (index * 800)); // Stagger badge notifications
              timeoutIdsRef.current.push(timeoutId);
            });
          }

          const confettiTimeout = setTimeout(() => setShowConfetti(false), 4000);
          const navigateTimeout = setTimeout(() => navigate("/dashboard"), data.badges_earned?.length > 0 ? 6000 : 4000);
          timeoutIdsRef.current.push(confettiTimeout, navigateTimeout);
        },
        onError: (error) => {
          const message = error.response?.data?.detail || "Check-in failed";
          toast.error(message);
        },
      }
    );
  };

  const isAtGym = distance !== null && distance <= checkinRadius;
  const canCheckIn = !checking && !locationLoading && !locationError && gym && isAtGym && canCheckInToday;

  // Success Screen
  if (success) {
    return (
      <Layout user={user}>
        {showConfetti && <Confetti />}
        <style>{`
          @keyframes confetti {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          .animate-confetti {
            animation: confetti 3s ease-out forwards;
          }
        `}</style>

        <div className="flex items-center justify-center min-h-[70vh] px-4" data-testid="checkin-success">
          <div className="max-w-sm w-full">
            {/* Success Animation */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#00C853] to-[#00A843] rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-[#00C853]/30">
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 sm:w-10 sm:h-10 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            </div>

            <Card className="border-[#00C853]/30 overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-[#00C853] to-[#00A843] p-5 sm:p-6 text-center text-white">
                <h2 className="text-xl sm:text-2xl font-bold mb-1">Check-in Complete!</h2>
                <p className="text-white/80 text-sm sm:text-base">{gym?.name}</p>
                {workoutType && (
                  <span className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs sm:text-sm font-medium mt-3">
                    {(() => {
                      const WorkoutIcon = workoutTypes.find(w => w.type === workoutType)?.icon;
                      return WorkoutIcon ? <WorkoutIcon className="w-4 h-4" /> : null;
                    })()}
                    {workoutType}
                  </span>
                )}
              </div>

              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {/* Coins Earned */}
                <div data-testid="coins-earned" className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-[#FFF8E6] to-[#FFFBF0] rounded-xl border border-[#FFD700]/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#FFD700] to-[#FF9500] rounded-xl flex items-center justify-center">
                      <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-[#888888]">Coins Earned</p>
                      <p className="text-lg sm:text-xl font-bold text-[#FF9500]">+{checkinResult?.coins_earned || 0}</p>
                    </div>
                  </div>
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFD700] fill-current" />
                </div>

                {/* Streak Info */}
                {checkinResult?.streak && (
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-[#FFF0F5] to-[#FFF5F8] rounded-xl border border-[#FF6B35]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF9500] rounded-xl flex items-center justify-center">
                        <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-[#888888]">Current Streak</p>
                        <p className="text-lg sm:text-xl font-bold text-[#FF6B35]">{checkinResult.streak.current} days</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] sm:text-xs text-[#888888]">Best</p>
                      <p className="text-sm font-semibold text-[#555555]">{checkinResult.streak.longest}</p>
                    </div>
                  </div>
                )}

                {/* Milestone Bonuses */}
                {checkinResult?.streak?.bonuses?.length > 0 && (
                  <div className="p-3 sm:p-4 bg-gradient-to-r from-[#8B5CF6]/10 to-[#7C3AED]/10 rounded-xl border border-[#8B5CF6]/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5CF6]" />
                      <span className="font-semibold text-sm sm:text-base text-[#8B5CF6]">Milestone Bonus!</span>
                    </div>
                    {checkinResult.streak.bonuses.map((bonus, i) => (
                      <p key={i} className="text-xs sm:text-sm text-[#555555]">
                        {bonus.milestone}-day streak: <span className="font-semibold text-[#8B5CF6]">+{bonus.coins} coins</span>
                      </p>
                    ))}
                  </div>
                )}

                {/* Streak Protected */}
                <div className="flex items-center justify-center gap-2 py-2 sm:py-3 text-[#00C853]">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold text-sm sm:text-base">Streak Protected!</span>
                </div>
              </CardContent>
            </Card>

            <p className="text-center text-[#888888] text-xs sm:text-sm mt-4 sm:mt-6 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // No Gym Registered
  if (!gym && user) {
    return (
      <Layout user={user}>
        <div className="max-w-sm mx-auto py-8 sm:py-12 px-4" data-testid="checkin-page">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#FF9500] to-[#FF6B00] rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl shadow-[#FF9500]/20">
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-2">No Gym Selected</h2>
            <p className="text-sm sm:text-base text-[#555555]">
              Select your gym in settings to start checking in and earning rewards.
            </p>
          </div>

          <Button
            onClick={() => navigate("/settings")}
            className="w-full bg-[#0066FF] hover:bg-[#0052CC] active:bg-[#0044AA] text-white py-5 sm:py-6 rounded-xl font-semibold text-base sm:text-lg shadow-lg shadow-[#0066FF]/20 touch-manipulation"
          >
            <Settings className="w-5 h-5 mr-2" />
            Go to Settings
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="max-w-lg mx-auto space-y-4 sm:space-y-6 pb-6 sm:pb-8 overflow-x-hidden" data-testid="checkin-page">
        {/* Header - Compact on mobile */}
        <div className="text-center pt-2">
          <h1 className="text-xl sm:text-2xl font-bold text-[#111111] mb-1">Check In</h1>
          <p className="text-sm sm:text-base text-[#555555]">
            {isAtGym ? "You're at the gym! Ready to go." : "Get closer to your gym"}
          </p>
        </div>

        {/* Check-in Info */}
        <CheckinInfoBadge
          todayCount={todayCount}
          maxPerDay={maxCheckinsPerDay}
          coinsPerCheckin={coinsPerCheckin}
        />

        {/* Streak Warning */}
        {progress?.streak_at_risk && (
          <Card className="bg-gradient-to-r from-[#FF3B30] to-[#FF6B35] border-0 overflow-hidden">
            <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm sm:text-base">Streak at risk!</p>
                <p className="text-white/80 text-xs sm:text-sm truncate">{progress.streak_warning}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Distance Ring */}
        <Card className="shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-center">
              {locationLoading ? (
                <div className="flex flex-col items-center py-6 sm:py-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#0066FF]/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 text-[#0066FF] animate-spin" />
                  </div>
                  <p className="text-sm sm:text-base text-[#555555] font-medium">Finding your location...</p>
                  <p className="text-xs sm:text-sm text-[#888888] mt-1">This may take a few seconds</p>
                </div>
              ) : locationError ? (
                <div className="flex flex-col items-center py-6 sm:py-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FF3B30]/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <XCircle className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF3B30]" />
                  </div>
                  <p className="text-sm sm:text-base text-[#FF3B30] font-medium text-center px-4">{locationError}</p>
                  <Button
                    onClick={refreshLocation}
                    variant="outline"
                    className="mt-4 border-[#0066FF] text-[#0066FF] hover:bg-[#E6F0FF] active:bg-[#D6E6FF] rounded-xl touch-manipulation"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : distance !== null ? (
                <>
                  <DistanceRing
                    distance={distance}
                    isAtGym={isAtGym}
                    checkinRadius={checkinRadius}
                  />

                  {/* Accuracy Badge */}
                  {accuracy && (
                    <div className="flex items-center gap-2 mt-3 sm:mt-4 px-3 py-1.5 bg-[#F8F9FA] rounded-full">
                      <Crosshair className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#888888]" />
                      <span className="text-[10px] sm:text-xs text-[#888888]">
                        GPS accuracy: ±{accuracy}m
                      </span>
                      <button
                        onClick={refreshLocation}
                        className="ml-1 p-1 rounded-full active:bg-[#E5E7EB] touch-manipulation"
                        disabled={locationLoading}
                      >
                        <RefreshCw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0066FF] ${locationLoading ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-6 sm:py-8 text-center">
                  <p className="text-sm sm:text-base text-[#555555]">Unable to calculate distance</p>
                  <Button
                    onClick={refreshLocation}
                    variant="outline"
                    className="mt-4 border-[#0066FF] text-[#0066FF] hover:bg-[#E6F0FF] rounded-xl touch-manipulation"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Location
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gym Card */}
        {gym && (
          <Card className={`transition-all duration-300 shadow-sm ${
            isAtGym
              ? 'border-[#00C853] bg-gradient-to-r from-[#F6FFF9] to-[#E6FFF5]'
              : 'border-[#E5E7EB]'
          }`}>
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 ${
                  isAtGym ? 'bg-[#00C853]' : 'bg-[#0066FF]'
                }`}>
                  <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] sm:text-xs font-semibold text-[#0066FF] uppercase tracking-wide mb-0.5">Your Gym</p>
                  <p className="font-bold text-[#111111] text-base sm:text-lg truncate">{gym.name}</p>
                  <p className="text-xs sm:text-sm text-[#555555] truncate">{gym.address}</p>
                </div>
                {isAtGym && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#00C853]/20 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#00C853]" />
                  </div>
                )}
              </div>

              {distance !== null && distance > checkinRadius && (
                <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 bg-[#FFF8E6] p-2.5 sm:p-3 rounded-xl">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF9500] shrink-0" />
                  <p className="text-xs sm:text-sm text-[#FF9500] font-medium">
                    Move {formatDistance(distance - checkinRadius)} closer to check in
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Social Proof */}
        {gymActivity && gymActivity.display_today_checkins > 0 && (
          <Card className="border-[#0066FF]/20 bg-gradient-to-r from-[#F8FAFF] to-[#F0F4FF] shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {gymActivity.recent_checkins?.slice(0, 3).map((checkin, i) => (
                    <Avatar key={i} className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-white">
                      <AvatarImage src={checkin.user?.picture} />
                      <AvatarFallback className="bg-[#0066FF] text-white text-[10px] sm:text-xs">
                        {(checkin.user?.display_name || 'U').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {gymActivity.display_today_checkins > 3 && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#111111] rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] sm:text-xs font-medium">
                      +{gymActivity.display_today_checkins - 3}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-[#111111]">
                    {gymActivity.display_today_checkins} checked in today
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#0066FF]">Join them!</p>
                </div>
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#0066FF]" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workout Type Selection */}
        <div>
          <p className="text-xs sm:text-sm font-semibold text-[#555555] mb-2 sm:mb-3">What are you training today?</p>
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {workoutTypes.map((w) => (
              <WorkoutTypeCard
                key={w.type}
                type={w.type}
                icon={w.icon}
                color={w.color}
                selected={workoutType === w.type}
                onClick={() => setWorkoutType(workoutType === w.type ? "" : w.type)}
              />
            ))}
          </div>
        </div>

        {/* Check-in Button */}
        <div className="pt-2 sm:pt-4">
          <div className="relative">
            {canCheckIn && (
              <div className="absolute inset-0 bg-[#00C853] rounded-xl animate-ping opacity-20" />
            )}
            <Button
              onClick={handleCheckIn}
              disabled={!canCheckIn}
              className={`w-full py-6 sm:py-7 text-base sm:text-lg rounded-xl font-bold shadow-xl transition-all duration-300 relative z-10 touch-manipulation active:scale-[0.98] ${
                canCheckIn
                  ? 'bg-gradient-to-r from-[#00C853] to-[#00A843] hover:from-[#00B548] hover:to-[#009940] shadow-[#00C853]/30'
                  : 'bg-[#E5E7EB] text-[#888888] cursor-not-allowed'
              }`}
              data-testid="submit-checkin-button"
            >
              {checking ? (
                <>
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : !canCheckInToday ? (
                <>
                  <XCircle className="w-5 h-5 mr-2" />
                  Daily Limit Reached
                </>
              ) : canCheckIn ? (
                <>
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  CHECK IN NOW
                </>
              ) : locationLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Getting Location...
                </>
              ) : locationError ? (
                <>
                  <XCircle className="w-5 h-5 mr-2" />
                  Location Required
                </>
              ) : distance !== null && distance > checkinRadius ? (
                <>
                  <MapPin className="w-5 h-5 mr-2" />
                  Get Closer ({formatDistance(distance - checkinRadius)})
                </>
              ) : (
                <>
                  <MapPin className="w-5 h-5 mr-2" />
                  Check In
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-[#888888] text-[10px] sm:text-xs mt-3 sm:mt-4">
            GPS verified • Within {formatDistance(checkinRadius)} of gym • {maxCheckinsPerDay} check-ins/day
          </p>
        </div>

        {/* Change Gym Link */}
        {gym && (
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center justify-center gap-2 text-[#0066FF] text-xs sm:text-sm font-medium hover:underline py-2 touch-manipulation active:opacity-70"
          >
            Change gym
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </Layout>
  );
}