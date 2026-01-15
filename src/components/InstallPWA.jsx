import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Share, Plus, ChevronDown } from "lucide-react";

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
const SHOW_DELAY = 5000; // 5 seconds after page load

export default function InstallPWA() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [platform, setPlatform] = useState(null); // 'ios' | 'android' | null
  const [showIOSSteps, setShowIOSSteps] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
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
  }, []);

  // Show prompt after short delay when ready
  useEffect(() => {
    if (isReady && !showPrompt) {
      timeoutRef.current = setTimeout(() => {
        setShowPrompt(true);
      }, SHOW_DELAY);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isReady, showPrompt]);

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

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 z-[9998] animate-slide-up">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0066FF] to-[#0052CC] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Get the App</h3>
              <p className="text-white/80 text-xs">Full experience on your phone</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {platform === "android" && deferredPrompt ? (
            // Android with install prompt available
            <div className="space-y-3">
              <p className="text-[#555555] text-sm">
                Install GymGraph for quick access, offline features, and a full-screen experience.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleInstall}
                  className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl h-11 font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install App
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  className="text-[#888888] hover:text-[#555555] rounded-xl"
                >
                  Not now
                </Button>
              </div>
            </div>
          ) : platform === "ios" ? (
            // iOS instructions
            <div className="space-y-3">
              <p className="text-[#555555] text-sm">
                Add GymGraph to your home screen for the best experience.
              </p>

              {/* Expandable steps */}
              <button
                onClick={() => setShowIOSSteps(!showIOSSteps)}
                className="w-full flex items-center justify-between p-3 bg-[#F8F9FA] rounded-xl text-left hover:bg-[#F0F2F5] transition-colors"
              >
                <span className="text-[#111111] font-medium text-sm">How to install</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#888888] transition-transform ${
                    showIOSSteps ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showIOSSteps && (
                <div className="space-y-3 pt-1">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="text-[#111111] text-sm font-medium">
                        Tap the Share button
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-8 h-8 bg-[#F0F2F5] rounded-lg flex items-center justify-center">
                          <Share className="w-4 h-4 text-[#0066FF]" />
                        </div>
                        <span className="text-[#888888] text-xs">
                          at the bottom of Safari
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="text-[#111111] text-sm font-medium">
                        Scroll and tap "Add to Home Screen"
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-8 h-8 bg-[#F0F2F5] rounded-lg flex items-center justify-center">
                          <Plus className="w-4 h-4 text-[#555555]" />
                        </div>
                        <span className="text-[#888888] text-xs">
                          in the share menu
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="text-[#111111] text-sm font-medium">
                        Tap "Add" to confirm
                      </p>
                      <span className="text-[#888888] text-xs">
                        GymGraph will appear on your home screen
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleDismiss}
                variant="ghost"
                className="w-full text-[#888888] hover:text-[#555555] rounded-xl"
              >
                Got it
              </Button>
            </div>
          ) : platform === "android" ? (
            // Android without prompt (fallback instructions)
            <div className="space-y-3">
              <p className="text-[#555555] text-sm">
                Add GymGraph to your home screen for quick access.
              </p>
              <div className="p-3 bg-[#F8F9FA] rounded-xl">
                <p className="text-[#111111] text-sm">
                  Tap the <span className="font-medium">menu icon</span> (three dots) in your browser and select{" "}
                  <span className="font-medium">"Add to Home Screen"</span> or{" "}
                  <span className="font-medium">"Install App"</span>
                </p>
              </div>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                className="w-full text-[#888888] hover:text-[#555555] rounded-xl"
              >
                Got it
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
