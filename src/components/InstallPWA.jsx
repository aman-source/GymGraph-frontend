import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Share, Plus, ChevronDown, Smartphone } from "lucide-react";

// Detect platform
const isIOS = () => {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

const isAndroid = () => {
  if (typeof window === "undefined") return false;
  return /Android/.test(navigator.userAgent);
};

const isStandalone = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
};

const DISMISS_KEY = "gymgraph-pwa-dismissed";
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const SHOW_DELAY = 30000; // 30 seconds after page load

// Routes where we should NOT show the install prompt
const EXCLUDED_ROUTES = ["/", "/auth/callback", "/onboarding"];

export default function InstallPWA() {
  const location = useLocation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [platform, setPlatform] = useState(null); // 'ios' | 'android' | null
  const [showIOSSteps, setShowIOSSteps] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const timeoutRef = useRef(null);

  // Don't show on excluded routes (auth pages)
  const isExcludedRoute = EXCLUDED_ROUTES.includes(location.pathname);

  useEffect(() => {
    // Don't show if on excluded route
    if (isExcludedRoute) return;

    // Don't show if already installed
    if (isStandalone()) return;

    // Check if user recently dismissed
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - parseInt(dismissedAt) < DISMISS_DURATION) {
      return;
    }

    // Detect platform
    if (isIOS()) {
      setPlatform("ios");
      setIsReady(true);
    } else if (isAndroid()) {
      setPlatform("android");
    }

    // Listen for Android install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform("android");
      setIsReady(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Hide prompt if app gets installed
    window.addEventListener("appinstalled", () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isExcludedRoute]);

  // Show prompt after delay when ready
  useEffect(() => {
    // Don't show on excluded routes
    if (isExcludedRoute) {
      setShowPrompt(false);
      return;
    }

    if (isReady && !showPrompt) {
      timeoutRef.current = setTimeout(() => {
        setShowPrompt(true);
      }, SHOW_DELAY);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isReady, showPrompt, isExcludedRoute]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt || isExcludedRoute) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 z-[9998] animate-slide-up">
      <div className="max-w-md mx-auto bg-[#111111] rounded-2xl overflow-hidden border border-[#333333]">
        {/* Slim Banner Design - looks like part of the app, not an ad */}
        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* App Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#0066FF]/20">
              <Smartphone className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm">Add GymGraph to Home</h3>
              <p className="text-[#888888] text-xs mt-0.5">Quick access & offline workouts</p>
            </div>

            {/* Actions */}
            {platform === "android" && deferredPrompt ? (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  onClick={handleInstall}
                  size="sm"
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg h-9 px-4 font-medium text-sm"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Install
                </Button>
                <button
                  onClick={handleDismiss}
                  className="text-[#666666] hover:text-[#888888] text-sm font-medium px-2 py-1"
                >
                  Later
                </button>
              </div>
            ) : (
              <button
                onClick={handleDismiss}
                className="text-[#666666] hover:text-[#888888] text-sm font-medium px-2 py-1 flex-shrink-0"
              >
                Later
              </button>
            )}
          </div>

          {/* iOS Instructions - Expandable */}
          {platform === "ios" && (
            <div className="mt-4">
              <button
                onClick={() => setShowIOSSteps(!showIOSSteps)}
                className="w-full flex items-center justify-between p-3 bg-[#1A1A1A] rounded-xl text-left hover:bg-[#222222] transition-colors"
              >
                <span className="text-white font-medium text-sm">How to install</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#888888] transition-transform ${
                    showIOSSteps ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showIOSSteps && (
                <div className="space-y-3 pt-3">
                  {/* Step 1 */}
                  <div className="flex items-center gap-3 bg-[#1A1A1A] rounded-xl p-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0066FF] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Share className="w-4 h-4 text-[#0066FF]" />
                      <span className="text-white text-sm">Tap Share in Safari</span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center gap-3 bg-[#1A1A1A] rounded-xl p-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0066FF] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <Plus className="w-4 h-4 text-[#888888]" />
                      <span className="text-white text-sm">Add to Home Screen</span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center gap-3 bg-[#1A1A1A] rounded-xl p-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0066FF] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <span className="text-white text-sm flex-1">Tap Add to confirm</span>
                  </div>

                  {/* Note about re-login */}
                  <p className="text-[#666666] text-xs px-1">
                    You may need to sign in once when opening the app.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Android without install prompt - fallback */}
          {platform === "android" && !deferredPrompt && (
            <div className="mt-3 p-3 bg-[#1A1A1A] rounded-xl">
              <p className="text-[#888888] text-sm">
                Tap the <span className="text-white font-medium">menu</span> (three dots) and select{" "}
                <span className="text-white font-medium">"Install App"</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
