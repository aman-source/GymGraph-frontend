import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { useAuth } from "@/App";
import { useSearchGyms, useNearbyGyms } from "@/hooks";
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
  ExternalLink
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
    return `https://www.google.com/maps/dir/?api=1&destination=${gym.latitude},${gym.longitude}&destination_place_id=${encodeURIComponent(gym.name)}`;
  }
  // Fallback to search by name and address
  const query = encodeURIComponent(`${gym.name}, ${gym.address}, ${gym.city}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

// Gym Card Component
const GymCard = ({ gym, user, onNavigate }) => {
  const handleMapsClick = (e) => {
    e.stopPropagation();
    window.open(getGoogleMapsUrl(gym), "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      className="card-premium hover:border-[#0066FF]/30 cursor-pointer transition-all group"
      onClick={() => onNavigate(`/gym/${gym.id}`)}
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

export default function Gyms() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Location state
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

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

  // React Query hooks for data fetching
  const {
    data: searchData,
    isLoading: searchLoading,
    isFetchingNextPage: searchingMore,
    hasNextPage: hasMoreSearch,
    fetchNextPage: loadMoreSearch,
  } = useSearchGyms(debouncedSearch);

  const {
    data: nearbyData,
    isLoading: nearbyLoading,
    isFetchingNextPage: loadingMoreNearby,
    hasNextPage: hasMoreNearby,
    fetchNextPage: loadMoreNearby,
  } = useNearbyGyms(userLocation?.latitude, userLocation?.longitude);

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
                  {searchResults.map((gym) => (
                    <GymCard key={gym.id} gym={gym} user={user} onNavigate={navigate} />
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
              </>
            ) : !isSearching && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#F0F2F5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-[#888888]" />
                </div>
                <h3 className="text-lg font-semibold text-[#111111] mb-2">No gyms found</h3>
                <p className="text-[#555555] max-w-md mx-auto">
                  No results for "{searchQuery}". Try a different name, area, or city.
                </p>
                <button
                  onClick={clearSearch}
                  className="mt-4 text-[#0066FF] hover:underline"
                >
                  Clear search
                </button>
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
                  {nearbyGyms.map((gym) => (
                    <GymCard key={gym.id} gym={gym} user={user} onNavigate={navigate} />
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
    </Layout>
  );
}
