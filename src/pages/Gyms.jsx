import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  useSearchGyms,
  useNearbyGyms,
  useSmartSearchGyms,
  useRecordGymSelection,
  useSubmitGym,
} from "@/hooks";
import {
  Search,
  CheckCircle,
  Building2,
  Navigation,
  ChevronRight,
  Loader2,
  ChevronDown,
  X,
  MapPin,
  ExternalLink,
  Plus,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

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

// Extract concise location from address (area/locality, city)
const getConciselocation = (gym) => {
  const address = gym.address || "";
  const city = gym.city || "";

  // Try to extract area from address - usually before city or after first comma
  if (address) {
    const parts = address.split(",").map(p => p.trim());
    // Get the second-to-last part (usually area/locality) if there are multiple parts
    if (parts.length >= 2) {
      const area = parts[parts.length - 2] || parts[0];
      // Return area, city if they're different
      if (area.toLowerCase() !== city.toLowerCase()) {
        return `${area}, ${city}`;
      }
    }
  }
  return city;
};

// Generate Google Maps URL for directions
const getGoogleMapsUrl = (gym) => {
  if (gym.latitude && gym.longitude) {
    // Use coordinates for directions - more reliable than place_id which we may not have
    return `https://www.google.com/maps/dir/?api=1&destination=${gym.latitude},${gym.longitude}`;
  }
  // Fallback to search by name and address
  const query = encodeURIComponent(`${gym.name}${gym.address ? `, ${gym.address}` : ""}${gym.city ? `, ${gym.city}` : ""}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

// Gym Card Component with selection tracking
const GymCard = ({ gym, user, onNavigate, onSelect, position, searchQuery, context = "search" }) => {
  const handleMapsClick = (e) => {
    e.stopPropagation();
    window.open(getGoogleMapsUrl(gym), "_blank", "noopener,noreferrer");
  };

  const handleClick = () => {
    // Record selection for learning system
    if (onSelect) {
      onSelect({
        gym_id: gym.id,
        search_query: searchQuery,
        position_shown: position,
        selection_context: context,
      });
    }
    onNavigate(`/gym/${gym.id}`);
  };

  return (
    <Card
      className="card-premium hover:border-[#0066FF]/30 cursor-pointer transition-all group"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-[#E6F0FF] rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-[#0066FF]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[#111111] font-medium truncate">{gym.name}</p>
              {gym.is_verified && (
                <CheckCircle className="w-4 h-4 text-[#0066FF] flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1 text-[#555555] text-sm mt-1">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{getConciselocation(gym)}</span>
            </div>
            {gym.distance_km != null && (
              <p className="text-[#0066FF] text-sm font-medium mt-1">
                {gym.distance_km < 1
                  ? `${Math.round(gym.distance_km * 1000)}m away`
                  : `${gym.distance_km.toFixed(1)}km away`}
              </p>
            )}
            {/* Match quality indicators */}
            {gym._scores && gym._scores.name_match > 0.8 && (
              <div className="flex items-center gap-1 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#E6F0FF] text-[#0066FF] text-xs rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Best match
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#888888] hover:text-[#0066FF] hover:bg-[#E6F0FF]"
              onClick={handleMapsClick}
              title="Open in Google Maps"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <ChevronRight className="w-5 h-5 text-[#888888] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        {user?.primary_gym_id === gym.id && (
          <div className="mt-3 inline-flex items-center gap-1 bg-[#E6FFF5] px-2 py-1 rounded-lg text-[#00C853] text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Your Gym
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// "Can't find your gym?" Component
const CantFindGymDialog = ({ isOpen, onClose, searchQuery, userLocation }) => {
  const submitGym = useSubmitGym();
  const [formData, setFormData] = useState({
    gym_name: searchQuery || "",
    address: "",
    city: "",
    additional_info: "",
  });

  useEffect(() => {
    if (searchQuery) {
      setFormData(prev => ({ ...prev, gym_name: searchQuery }));
    }
  }, [searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await submitGym.mutateAsync({
        ...formData,
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude,
      });

      if (result.success) {
        toast.success(result.message);
        onClose();
        setFormData({ gym_name: "", address: "", city: "", additional_info: "" });
      } else {
        if (result.existing_gym) {
          toast.error(`A similar gym exists: ${result.existing_gym.name}`);
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      toast.error("Failed to submit. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#0066FF]" />
            Submit a Gym
          </DialogTitle>
          <DialogDescription>
            Can't find your gym? Submit it and we'll add it within 24-48 hours.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gym_name">Gym Name *</Label>
            <Input
              id="gym_name"
              value={formData.gym_name}
              onChange={(e) => setFormData({ ...formData, gym_name: e.target.value })}
              placeholder="e.g., Gold's Gym"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g., 123 Main Street, Banjara Hills"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g., Hyderabad"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additional_info">Additional Info</Label>
            <Input
              id="additional_info"
              value={formData.additional_info}
              onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
              placeholder="e.g., Near City Center Mall"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitGym.isPending}>
              {submitGym.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Gym"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function Gyms() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Location state
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  // Dialog state
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Selection tracking
  const recordSelection = useRecordGymSelection();

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationLoading(false);
        },
        () => setLocationLoading(false),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationLoading(false);
    }
  }, []);

  // Use smart search hook when user has location, fallback to basic search
  const {
    data: smartSearchData,
    isLoading: smartSearchLoading,
    isFetchingNextPage: smartSearchingMore,
    hasNextPage: hasMoreSmartSearch,
    fetchNextPage: loadMoreSmartSearch,
  } = useSmartSearchGyms(debouncedSearch, userLocation, {
    enabled: debouncedSearch.length >= 2,
  });

  // Fallback to basic search if no location
  const {
    data: basicSearchData,
    isLoading: basicSearchLoading,
    isFetchingNextPage: basicSearchingMore,
    hasNextPage: hasMoreBasicSearch,
    fetchNextPage: loadMoreBasicSearch,
  } = useSearchGyms(debouncedSearch);

  // Nearby gyms
  const {
    data: nearbyData,
    isLoading: nearbyLoading,
    isFetchingNextPage: loadingMoreNearby,
    hasNextPage: hasMoreNearby,
    fetchNextPage: loadMoreNearby,
  } = useNearbyGyms(userLocation?.latitude, userLocation?.longitude);

  // Determine which search data to use
  const useSmartSearch = userLocation && debouncedSearch.length >= 2;
  const searchData = useSmartSearch ? smartSearchData : basicSearchData;
  const searchLoading = useSmartSearch ? smartSearchLoading : basicSearchLoading;
  const searchingMore = useSmartSearch ? smartSearchingMore : basicSearchingMore;
  const hasMoreSearch = useSmartSearch ? hasMoreSmartSearch : hasMoreBasicSearch;
  const loadMoreSearch = useSmartSearch ? loadMoreSmartSearch : loadMoreBasicSearch;

  // Check if Google search was triggered
  const googleSearchTriggered = searchData?.pages?.[0]?.google_search_triggered;

  // Flatten paginated results
  const searchResults = useMemo(() => {
    return searchData?.pages?.flatMap(page => page.gyms) || [];
  }, [searchData]);

  const nearbyGyms = useMemo(() => {
    return nearbyData?.pages?.flatMap(page => page.gyms) || [];
  }, [nearbyData]);

  const hasSearched = debouncedSearch.length >= 2;
  const isSearching = searchLoading && hasSearched;

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Handle gym selection (for learning system)
  const handleGymSelect = (selectionData) => {
    if (userLocation) {
      recordSelection.mutate({
        ...selectionData,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
    }
  };

  return (
    <Layout user={user}>
      <div className="space-y-6" data-testid="gyms-page">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111]">Gyms</h1>
            <p className="text-[#555555] mt-1">Search gyms by name, locality, or area</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
          <Input
            placeholder="Search by gym name, area, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 bg-white border-[#E5E7EB] text-[#111111] placeholder:text-[#888888] rounded-xl h-12"
            data-testid="gym-search-input"
          />
          {isSearching ? (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0066FF] animate-spin" />
          ) : searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#E5E7EB] hover:bg-[#D1D5DB] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-[#555555]" />
            </button>
          )}
        </div>

        {/* Google search indicator */}
        {hasSearched && googleSearchTriggered && !isSearching && (
          <div className="flex items-center gap-2 text-[#555555] text-sm">
            <AlertCircle className="w-4 h-4 text-[#0066FF]" />
            <span>Searching more gyms... results may expand.</span>
          </div>
        )}

        {/* Quick area buttons when no search and no nearby gyms */}
        {!hasSearched && !locationLoading && nearbyGyms.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {["Madhapur", "Bandra", "Koramangala", "T Nagar", "Connaught Place", "Koregaon Park"].map((area) => (
              <button
                key={area}
                onClick={() => setSearchQuery(area)}
                className="px-3 py-1.5 bg-[#F0F2F5] hover:bg-[#E5E7EB] text-[#555555] text-sm rounded-full transition-colors"
              >
                {area}
              </button>
            ))}
          </div>
        )}

        {/* Search Results */}
        {hasSearched && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#111111]">
                {isSearching ? "Searching..." : `Search Results${searchResults.length > 0 ? ` (${searchResults.length})` : ""}`}
              </h2>
              {searchResults.length > 0 && (
                <button
                  onClick={clearSearch}
                  className="text-[#0066FF] text-sm hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
            {searchResults.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((gym, index) => (
                    <GymCard
                      key={gym.id}
                      gym={gym}
                      user={user}
                      onNavigate={navigate}
                      onSelect={handleGymSelect}
                      position={index}
                      searchQuery={debouncedSearch}
                      context="search"
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMoreSearch && (
                  <div className="text-center mt-6">
                    <Button
                      onClick={() => loadMoreSearch()}
                      disabled={searchingMore}
                      variant="outline"
                      className="border-[#E5E7EB] text-[#555555] hover:border-[#0066FF] hover:text-[#0066FF] rounded-xl"
                    >
                      {searchingMore ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ChevronDown className="w-4 h-4 mr-2" />
                      )}
                      {searchingMore ? "Loading..." : "Show More"}
                    </Button>
                  </div>
                )}

                {/* Can't find your gym? */}
                <div className="text-center py-6 border-t border-[#E5E7EB] mt-6">
                  <p className="text-[#555555] mb-3">Can't find your gym?</p>
                  <Button
                    variant="outline"
                    onClick={() => setShowSubmitDialog(true)}
                    className="border-[#0066FF] text-[#0066FF] hover:bg-[#E6F0FF] rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Submit a Gym
                  </Button>
                </div>
              </>
            ) : !isSearching && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#F0F2F5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-[#888888]" />
                </div>
                <h3 className="text-lg font-semibold text-[#111111] mb-2">No gyms found</h3>
                <p className="text-[#555555] max-w-md mx-auto mb-4">
                  No results for "{searchQuery}". Try a different name, area, or city.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={clearSearch}
                    className="text-[#0066FF] hover:underline"
                  >
                    Clear search
                  </button>
                  <span className="hidden sm:inline text-[#888888]">or</span>
                  <Button
                    variant="outline"
                    onClick={() => setShowSubmitDialog(true)}
                    className="border-[#0066FF] text-[#0066FF] hover:bg-[#E6F0FF] rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Submit this gym
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Nearby Gyms - shown when not searching */}
        {!hasSearched && (
          <div>
            <h2 className="text-lg font-semibold text-[#111111] mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#0066FF]" />
              {locationLoading || nearbyLoading ? "Finding nearby gyms..." : "Nearby Gyms"}
            </h2>

            {locationLoading || nearbyLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="card-premium animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-[#E5E7EB] rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-[#E5E7EB] rounded w-3/4" />
                          <div className="h-3 bg-[#E5E7EB] rounded w-1/2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : nearbyGyms.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nearbyGyms.map((gym, index) => (
                    <GymCard
                      key={gym.id}
                      gym={gym}
                      user={user}
                      onNavigate={navigate}
                      onSelect={handleGymSelect}
                      position={index}
                      context="nearby"
                    />
                  ))}
                </div>

                {/* Load More Nearby */}
                {hasMoreNearby && (
                  <div className="text-center mt-4">
                    <Button
                      onClick={() => loadMoreNearby()}
                      disabled={loadingMoreNearby}
                      variant="outline"
                      className="border-[#E5E7EB] text-[#555555] hover:border-[#0066FF] hover:text-[#0066FF] rounded-xl"
                    >
                      {loadingMoreNearby ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ChevronDown className="w-4 h-4 mr-2" />
                      )}
                      {loadingMoreNearby ? "Loading..." : "Show More"}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#E6F0FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-[#0066FF]" />
                </div>
                <h3 className="text-lg font-semibold text-[#111111] mb-2">Search for Gyms</h3>
                <p className="text-[#555555] max-w-md mx-auto mb-4">
                  {!userLocation
                    ? "Location not available. Search by gym name, area, or city."
                    : "No gyms found nearby. Try searching by name or area."}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Madhapur", "Bandra", "Koramangala", "T Nagar", "Connaught Place", "Koregaon Park"].map((area) => (
                    <button
                      key={area}
                      onClick={() => setSearchQuery(area)}
                      className="px-3 py-1.5 bg-[#F0F2F5] hover:bg-[#E5E7EB] text-[#555555] text-sm rounded-full transition-colors"
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit Gym Dialog */}
      <CantFindGymDialog
        isOpen={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        searchQuery={searchQuery}
        userLocation={userLocation}
      />
    </Layout>
  );
}
