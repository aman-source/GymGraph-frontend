import { useState, useEffect, createContext, useContext } from "react";
import { Zap } from "lucide-react";

// Create context for loading state
const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      {isLoading && <PageLoader />}
    </LoadingContext.Provider>
  );
};

// Modern full page loader with branding
export const PageLoader = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-white via-[#F8F9FA] to-[#E6F0FF] z-[9999] flex items-center justify-center">
    <div className="flex flex-col items-center gap-6">
      {/* Logo with pulse animation */}
      <div className="relative">
        <div className="w-16 h-16 bg-[#0066FF] rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-[#0066FF]/30">
          <Zap className="w-8 h-8 text-white" />
        </div>
        {/* Ripple effect */}
        <div className="absolute inset-0 w-16 h-16 bg-[#0066FF]/20 rounded-2xl animate-ping"></div>
      </div>
      
      {/* Progress bar */}
      <div className="w-48 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#0066FF] to-[#00C853] rounded-full animate-loading-bar"></div>
      </div>
      
      {/* Brand text */}
      <div className="text-center">
        <p className="text-[#111111] font-semibold text-lg">GymGraph</p>
        <p className="text-[#888888] text-sm mt-1">Loading your fitness journey...</p>
      </div>
    </div>
  </div>
);

// Route transition loader - subtle top progress bar
export const RouteTransitionLoader = ({ isVisible }) => (
  <div className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
    {/* Top progress bar */}
    <div className="h-1 bg-[#E5E7EB]">
      <div className="h-full bg-gradient-to-r from-[#0066FF] via-[#00C853] to-[#0066FF] rounded-r-full animate-route-progress"></div>
    </div>
    {/* Subtle overlay */}
    <div className="fixed inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-[#E5E7EB]">
        <div className="w-10 h-10 bg-[#0066FF] rounded-xl flex items-center justify-center animate-pulse">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="text-[#555555] font-medium text-sm">Loading...</span>
      </div>
    </div>
  </div>
);

// Tab loading overlay (for use inside tabs)
export const TabLoader = () => (
  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl min-h-[200px]">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 bg-[#0066FF] rounded-xl flex items-center justify-center animate-pulse">
          <Zap className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#555555] font-medium">Loading</span>
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </span>
      </div>
    </div>
  </div>
);

// Content Skeleton loaders - Dashboard style
export const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-2xl border border-[#E5E7EB] p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-3">
        <div className="h-3 w-20 bg-gradient-to-r from-[#E5E7EB] to-[#F0F2F5] rounded-lg"></div>
        <div className="h-8 w-16 bg-gradient-to-r from-[#E5E7EB] to-[#F0F2F5] rounded-lg"></div>
      </div>
      <div className="w-12 h-12 bg-gradient-to-br from-[#E5E7EB] to-[#F0F2F5] rounded-xl"></div>
    </div>
  </div>
);

export const SkeletonTable = () => (
  <div className="animate-pulse space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className={`h-14 rounded-xl ${i % 2 === 0 ? 'bg-[#F8F9FA]' : 'bg-[#F0F2F5]'}`}></div>
    ))}
  </div>
);

export const SkeletonList = () => (
  <div className="animate-pulse space-y-3">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-[#F8F9FA] rounded-xl">
        <div className="w-12 h-12 bg-gradient-to-br from-[#E5E7EB] to-[#F0F2F5] rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-gradient-to-r from-[#E5E7EB] to-[#F0F2F5] rounded-lg"></div>
          <div className="h-3 w-48 bg-gradient-to-r from-[#E5E7EB] to-[#F0F2F5] rounded-lg"></div>
        </div>
      </div>
    ))}
  </div>
);

// Challenge card skeleton
export const SkeletonChallengeCard = () => (
  <div className="animate-pulse bg-white rounded-2xl border border-[#E5E7EB] p-6">
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-5 w-48 bg-gradient-to-r from-[#E5E7EB] to-[#F0F2F5] rounded-lg"></div>
          <div className="h-3 w-64 bg-gradient-to-r from-[#E5E7EB] to-[#F0F2F5] rounded-lg"></div>
        </div>
        <div className="w-20 h-8 bg-gradient-to-r from-[#E5E7EB] to-[#F0F2F5] rounded-lg"></div>
      </div>
      <div className="h-2 bg-[#E5E7EB] rounded-full"></div>
      <div className="flex gap-4">
        <div className="h-4 w-20 bg-[#E5E7EB] rounded"></div>
        <div className="h-4 w-20 bg-[#E5E7EB] rounded"></div>
        <div className="h-4 w-20 bg-[#E5E7EB] rounded"></div>
      </div>
    </div>
  </div>
);

export default PageLoader;
