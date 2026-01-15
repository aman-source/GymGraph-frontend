import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { useAuth } from "@/App";
import { toast } from "sonner";
import {
  User,
  Target,
  Building2,
  ChevronRight,
  ChevronLeft,
  Check,
  Search,
  Loader2,
  Sparkles,
  MapPin,
  Flame,
  Dumbbell,
  Heart,
  Trophy,
  Timer,
  Activity,
  Gift,
  Coins,
} from "lucide-react";

// GymGraph Mountain Logo Component
const GymGraphLogo = ({ className = "w-6 h-6", color = "white" }) => (
  <svg viewBox="0 0 512 512" className={className} fill={color}>
    <polygon points="80,400 220,160 320,400" />
    <polygon points="200,400 340,100 460,400" />
  </svg>
);

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

// Animated step indicator
const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all duration-500 ${
            index < currentStep
              ? 'w-8 bg-[#0066FF]'
              : index === currentStep
              ? 'w-8 bg-[#0066FF]'
              : 'w-2 bg-[#E5E7EB]'
          }`}
        />
      ))}
    </div>
  );
};

// Fitness goal card with icon
const GoalCard = ({ goal, selected, onClick }) => {
  const goalIcons = {
    "Build Muscle": <Dumbbell className="w-6 h-6" />,
    "Lose Weight": <Flame className="w-6 h-6" />,
    "Stay Fit": <Heart className="w-6 h-6" />,
    "Improve Strength": <Trophy className="w-6 h-6" />,
    "Train for Competition": <Timer className="w-6 h-6" />,
    "General Health": <Activity className="w-6 h-6" />,
  };

  return (
    <button
      onClick={onClick}
      className={`relative p-5 rounded-2xl border-2 transition-all duration-300 text-left group ${
        selected
          ? 'border-[#0066FF] bg-gradient-to-br from-[#E6F0FF] to-white shadow-lg shadow-[#0066FF]/10'
          : 'border-[#E5E7EB] bg-white hover:border-[#0066FF]/30 hover:shadow-md'
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-[#0066FF] rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
        selected ? 'bg-[#0066FF] text-white' : 'bg-[#F8F9FA] text-[#555555] group-hover:bg-[#E6F0FF] group-hover:text-[#0066FF]'
      }`}>
        {goalIcons[goal] || <Target className="w-6 h-6" />}
      </div>
      <p className={`font-semibold transition-colors ${selected ? 'text-[#0066FF]' : 'text-[#111111]'}`}>
        {goal}
      </p>
    </button>
  );
};

// Gym card component
const GymCard = ({ gym, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
      selected
        ? 'border-[#0066FF] bg-gradient-to-br from-[#E6F0FF] to-white shadow-lg shadow-[#0066FF]/10'
        : 'border-[#E5E7EB] hover:border-[#0066FF]/40 bg-white hover:shadow-md'
    }`}
  >
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        selected ? 'bg-[#0066FF] text-white' : 'bg-[#F8F9FA] text-[#555555]'
      }`}>
        <Building2 className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold truncate ${selected ? 'text-[#0066FF]' : 'text-[#111111]'}`}>
          {gym.name}
        </p>
        <p className="text-[#555555] text-sm truncate">{gym.address}</p>
        <p className="text-[#888888] text-sm flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3" />
          {gym.city}
        </p>
      </div>
      {selected && (
        <div className="w-6 h-6 bg-[#0066FF] rounded-full flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  </button>
);

export default function Onboarding() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [gyms, setGyms] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGym, setSelectedGym] = useState(null);
  const [slideDirection, setSlideDirection] = useState('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    fitness_goal: "",
    primary_gym_id: "",
    referral_code: ""
  });
  const [referralApplying, setReferralApplying] = useState(false);
  const [referralApplied, setReferralApplied] = useState(false);
  const [referralFromLink, setReferralFromLink] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Auto-fill referral code from localStorage (set by Landing page from ?ref= URL)
  useEffect(() => {
    const storedReferral = localStorage.getItem('gymgraph_referral_code');
    if (storedReferral && !formData.referral_code) {
      setFormData(prev => ({ ...prev, referral_code: storedReferral }));
      setReferralFromLink(true);
    }
  }, []);

  // Search gyms when debounced search changes
  useEffect(() => {
    const searchGyms = async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) {
        setGyms([]);
        return;
      }

      setSearching(true);
      try {
        const response = await api.get('/gyms', {
          params: { search: debouncedSearch, limit: 20 }
        });
        setGyms(response.data.gyms || []);
      } catch {
        // Search failed - gyms array remains empty
      } finally {
        setSearching(false);
      }
    };

    searchGyms();
  }, [debouncedSearch]);

  const handleGymSelect = (gym) => {
    if (formData.primary_gym_id === gym.id) {
      setFormData({ ...formData, primary_gym_id: "" });
      setSelectedGym(null);
    } else {
      setFormData({ ...formData, primary_gym_id: gym.id });
      setSelectedGym(gym);
    }
  };

  const goToStep = (newStep) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDirection(newStep > step ? 'right' : 'left');
    setTimeout(() => {
      setStep(newStep);
      setIsAnimating(false);
    }, 150);
  };

  const handleSubmit = async () => {
    // Validate display name
    const displayName = formData.display_name.trim();
    if (!displayName) {
      toast.error("Please enter your display name");
      return;
    }
    if (displayName.length < 2) {
      toast.error("Display name must be at least 2 characters");
      return;
    }
    if (displayName.length > 50) {
      toast.error("Display name must be less than 50 characters");
      return;
    }
    if (!formData.primary_gym_id) {
      toast.error("Please select your gym");
      return;
    }

    setLoading(true);

    try {
      // Submit onboarding data (without referral_code - that's handled separately)
      const { referral_code, ...onboardingData } = formData;
      const response = await api.post('/users/onboarding', onboardingData);

      if (response.data?.onboarding_completed) {
        // Apply referral code if provided
        if (referral_code && referral_code.length >= 6) {
          try {
            await api.post('/coins/referral/apply', { referral_code });
            // Clear stored referral code after successful application
            localStorage.removeItem('gymgraph_referral_code');
            toast.success("Welcome to GymGraph! You both earned 100 coins!");
          } catch {
            // Referral failed but onboarding succeeded - still continue
            localStorage.removeItem('gymgraph_referral_code');
            toast.success("Welcome to GymGraph!");
          }
        } else {
          toast.success("Welcome to GymGraph!");
        }
        await refreshUser();
        navigate("/dashboard", { replace: true });
      } else {
        toast.error("Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to complete setup");
      setLoading(false);
    }
  };

  const fitnessGoals = [
    "Build Muscle",
    "Lose Weight",
    "Stay Fit",
    "Improve Strength",
    "Train for Competition",
    "General Health"
  ];

  const popularAreas = ["Madhapur", "Bandra", "Koramangala", "T Nagar", "Connaught Place", "Andheri"];

  const steps = [
    { title: "What should we call you?", subtitle: "Let's personalize your experience" },
    { title: "What's your fitness goal?", subtitle: "This helps us tailor your experience" },
    { title: "Find your gym", subtitle: "We have 6000+ verified gyms across India" },
  ];

  const canProceed = () => {
    if (step === 0) {
      const name = formData.display_name.trim();
      return name.length >= 2 && name.length <= 50;
    }
    if (step === 1) return formData.fitness_goal.length > 0;
    if (step === 2) return formData.primary_gym_id.length > 0;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#E6F0FF]" data-testid="onboarding-page">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#0066FF]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#00C853]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-lg mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0066FF]/20">
              <GymGraphLogo className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold text-[#111111]">GymGraph</span>
          </div>
          <StepIndicator currentStep={step} totalSteps={3} />
        </div>

        {/* Main Card */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-[#E5E7EB]/50 flex-1 flex flex-col overflow-hidden">
            {/* Step Header */}
            <div className="p-6 pb-0 text-center">
              <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                <h1 className="text-2xl font-bold text-[#111111] mb-2">{steps[step].title}</h1>
                <p className="text-[#555555]">{steps[step].subtitle}</p>
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className={`transition-all duration-300 ${isAnimating ? `opacity-0 ${slideDirection === 'right' ? '-translate-x-4' : 'translate-x-4'}` : 'opacity-100 translate-x-0'}`}>
                {/* Step 1: Name & Bio */}
                {step === 0 && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-semibold text-[#111111] mb-2 block">Display Name *</label>
                      <Input
                        placeholder="e.g., Fitness Warrior"
                        value={formData.display_name}
                        onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                        className="h-14 bg-[#F8F9FA] border-[#E5E7EB] text-[#111111] placeholder:text-[#888888] rounded-xl text-lg focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20"
                        data-testid="display-name-input"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#111111] mb-2 block">
                        Bio <span className="font-normal text-[#888888]">(Optional)</span>
                      </label>
                      <Textarea
                        placeholder="Share a bit about your fitness journey..."
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value.slice(0, 150) })}
                        className="bg-[#F8F9FA] border-[#E5E7EB] text-[#111111] placeholder:text-[#888888] min-h-[100px] rounded-xl resize-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20"
                        data-testid="bio-input"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-[#888888] text-sm">{formData.bio.length}/150 characters</p>
                        {formData.bio.length > 0 && (
                          <p className="text-[#00C853] text-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Looking good!
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Referral Code */}
                    <div className={`p-4 rounded-2xl border transition-all ${
                      referralFromLink && formData.referral_code
                        ? 'bg-gradient-to-r from-[#E6FFF5] to-[#F0FFF4] border-[#00C853]/30'
                        : 'bg-gradient-to-r from-[#FFF8E6] to-[#FFFBF0] border-[#FFD700]/30'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          referralFromLink && formData.referral_code ? 'bg-[#00C853]/20' : 'bg-[#FFD700]/20'
                        }`}>
                          <Gift className={`w-5 h-5 ${referralFromLink && formData.referral_code ? 'text-[#00C853]' : 'text-[#FFD700]'}`} />
                        </div>
                        <div className="flex-1">
                          {referralFromLink && formData.referral_code ? (
                            <>
                              <p className="text-[#00C853] font-semibold text-sm">Referral code applied!</p>
                              <p className="text-[#555555] text-xs">You'll both get 100 coins after signup</p>
                            </>
                          ) : (
                            <>
                              <p className="text-[#111111] font-semibold text-sm">Have a referral code?</p>
                              <p className="text-[#888888] text-xs">Get bonus coins when you sign up!</p>
                            </>
                          )}
                        </div>
                        {referralFromLink && formData.referral_code && (
                          <div className="w-8 h-8 bg-[#00C853] rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter referral code"
                          value={formData.referral_code}
                          onChange={(e) => {
                            setFormData({ ...formData, referral_code: e.target.value.toUpperCase() });
                            setReferralFromLink(false);
                          }}
                          disabled={referralApplied}
                          className={`h-12 bg-white border-[#E5E7EB] text-[#111111] placeholder:text-[#888888] rounded-xl font-mono uppercase tracking-wider ${
                            referralFromLink && formData.referral_code
                              ? 'focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/20'
                              : 'focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20'
                          }`}
                          maxLength={8}
                        />
                        {referralApplied ? (
                          <div className="h-12 px-4 bg-[#00C853] text-white rounded-xl flex items-center gap-2 font-semibold">
                            <Check className="w-5 h-5" />
                            Applied
                          </div>
                        ) : null}
                      </div>
                      {formData.referral_code && !referralApplied && !referralFromLink && (
                        <p className="text-[#888888] text-xs mt-2 flex items-center gap-1">
                          <Coins className="w-3 h-3" />
                          Code will be applied after setup
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Fitness Goals */}
                {step === 1 && (
                  <div className="grid grid-cols-2 gap-4">
                    {fitnessGoals.map((goal) => (
                      <GoalCard
                        key={goal}
                        goal={goal}
                        selected={formData.fitness_goal === goal}
                        onClick={() => setFormData({ ...formData, fitness_goal: goal })}
                      />
                    ))}
                  </div>
                )}

                {/* Step 3: Find Gym */}
                {step === 2 && (
                  <div className="space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                      <Input
                        placeholder="Search by gym name, area, or city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-12 h-14 bg-[#F8F9FA] border-[#E5E7EB] text-[#111111] placeholder:text-[#888888] rounded-xl text-lg focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20"
                        data-testid="gym-search-input"
                        autoFocus
                      />
                      {searching && (
                        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0066FF] animate-spin" />
                      )}
                    </div>

                    {/* Selected Gym */}
                    {selectedGym && !searchQuery && (
                      <div className="p-4 bg-gradient-to-r from-[#E6F0FF] to-white rounded-2xl border border-[#0066FF]/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#0066FF] rounded-xl flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-[#0066FF]">{selectedGym.name}</p>
                            <p className="text-sm text-[#555555]">{selectedGym.address}, {selectedGym.city}</p>
                          </div>
                          <button
                            onClick={() => { setSelectedGym(null); setFormData({ ...formData, primary_gym_id: "" }); }}
                            className="text-[#FF3B30] text-sm font-medium"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Popular Areas */}
                    {!searchQuery && !selectedGym && (
                      <div>
                        <p className="text-sm font-medium text-[#555555] mb-3">Popular areas</p>
                        <div className="flex flex-wrap gap-2">
                          {popularAreas.map((area) => (
                            <button
                              key={area}
                              onClick={() => setSearchQuery(area)}
                              className="px-4 py-2 bg-[#F8F9FA] hover:bg-[#E6F0FF] hover:text-[#0066FF] text-[#555555] text-sm font-medium rounded-full transition-all duration-200"
                            >
                              {area}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Search Results */}
                    {searchQuery.length >= 2 && (
                      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                        {searching ? (
                          <div className="text-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#0066FF]" />
                            <p className="text-[#555555]">Searching gyms...</p>
                          </div>
                        ) : gyms.length > 0 ? (
                          gyms.map((gym) => (
                            <GymCard
                              key={gym.id}
                              gym={gym}
                              selected={formData.primary_gym_id === gym.id}
                              onClick={() => handleGymSelect(gym)}
                            />
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-14 h-14 bg-[#F8F9FA] rounded-2xl flex items-center justify-center mx-auto mb-3">
                              <Building2 className="w-7 h-7 text-[#888888]" />
                            </div>
                            <p className="text-[#555555] font-medium">No gyms found</p>
                            <p className="text-[#888888] text-sm mt-1">Try a different search term</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Prompt */}
                    {!searchQuery && !selectedGym && (
                      <div className="text-center py-6 mt-4 bg-[#F8F9FA] rounded-2xl">
                        <Search className="w-10 h-10 mx-auto mb-3 text-[#888888]" />
                        <p className="text-[#555555] font-medium">Search for your gym</p>
                        <p className="text-[#888888] text-sm mt-1">Type at least 2 characters</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="p-6 pt-0 border-t border-[#F0F2F5] bg-white">
              <div className="flex justify-between items-center">
                {step > 0 ? (
                  <Button
                    variant="ghost"
                    onClick={() => goToStep(step - 1)}
                    disabled={isAnimating}
                    className="text-[#555555] hover:text-[#0066FF] hover:bg-[#E6F0FF] rounded-xl h-12 px-5"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {step < 2 ? (
                  <Button
                    onClick={() => goToStep(step + 1)}
                    disabled={!canProceed() || isAnimating}
                    className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl h-12 px-8 font-semibold shadow-lg shadow-[#0066FF]/20 disabled:opacity-50 disabled:shadow-none transition-all duration-200"
                    data-testid="next-button"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !canProceed()}
                    className="bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:from-[#0052CC] hover:to-[#003D99] text-white rounded-xl h-12 px-8 font-semibold shadow-lg shadow-[#0066FF]/20 disabled:opacity-50 disabled:shadow-none transition-all duration-200"
                    data-testid="complete-button"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Complete Setup
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Skip option for optional step */}
          {step === 1 && !formData.fitness_goal && (
            <button
              onClick={() => goToStep(step + 1)}
              className="text-center text-[#888888] text-sm mt-4 hover:text-[#0066FF] transition-colors"
            >
              Skip for now
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-[#888888] text-sm">
            Step {step + 1} of 3
          </p>
        </div>
      </div>
    </div>
  );
}
