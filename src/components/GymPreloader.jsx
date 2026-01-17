import { useEffect } from 'react';
import { usePreloadNearbyGyms } from '@/hooks/useGym';

/**
 * Invisible component that preloads nearby gyms on app mount
 * Uses geohash-based caching for fast subsequent access
 * Place in Layout.jsx or App.jsx near the root
 */
export function GymPreloader({ userLocation }) {
  const { data, isLoading, error } = usePreloadNearbyGyms(
    userLocation?.latitude,
    userLocation?.longitude
  );

  useEffect(() => {
    if (data?.gyms) {
      console.log(`[GymPreloader] Preloaded ${data.gyms.length} nearby gyms (cache: ${data.from_cache})`);
    }
    if (error) {
      console.warn('[GymPreloader] Failed to preload gyms:', error);
    }
  }, [data, error]);

  // This component renders nothing - it's purely for side effects
  return null;
}

export default GymPreloader;
