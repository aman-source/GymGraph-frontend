import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, auth } from "@/lib/supabase";
import { Check, AlertCircle, Loader2, User, Sparkles } from "lucide-react";

// GymGraph Mountain Logo Component
const GymGraphLogo = ({ className = "w-6 h-6", color = "white" }) => (
  <svg viewBox="0 0 512 512" className={className} fill={color}>
    <polygon points="80,400 220,160 320,400" />
    <polygon points="200,400 340,100 460,400" />
  </svg>
);

// Animated logo component
const AnimatedLogo = () => (
  <div className="relative">
    <div className="w-20 h-20 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#0066FF]/30">
      <GymGraphLogo className="w-12 h-12" />
    </div>
    {/* Pulse ring animation */}
    <div className="absolute inset-0 rounded-3xl border-2 border-[#0066FF] animate-ping opacity-20" />
    <div className="absolute inset-0 rounded-3xl border-2 border-[#0066FF] animate-pulse opacity-30" />
  </div>
);

// Progress step component
const ProgressStep = ({ icon: Icon, label, status, delay }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return (
    <div className={`flex items-center gap-3 transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
        status === 'complete' ? 'bg-[#00C853] text-white' :
        status === 'active' ? 'bg-[#0066FF] text-white' :
        status === 'error' ? 'bg-[#FF3B30] text-white' :
        'bg-[#F0F2F5] text-[#888888]'
      }`}>
        {status === 'complete' ? (
          <Check className="w-4 h-4" />
        ) : status === 'active' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : status === 'error' ? (
          <AlertCircle className="w-4 h-4" />
        ) : (
          <Icon className="w-4 h-4" />
        )}
      </div>
      <span className={`text-sm font-medium transition-colors ${
        status === 'complete' ? 'text-[#00C853]' :
        status === 'active' ? 'text-[#0066FF]' :
        status === 'error' ? 'text-[#FF3B30]' :
        'text-[#888888]'
      }`}>
        {label}
      </span>
    </div>
  );
};

export default function AuthCallback() {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);
  const subscriptionRef = useRef(null);
  const timeoutRef = useRef(null);
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your credentials...");
  const [progress, setProgress] = useState([
    { id: 1, icon: Check, label: "Authentication verified", status: "pending" },
    { id: 2, icon: User, label: "Loading your profile", status: "pending" },
    { id: 3, icon: Sparkles, label: "Preparing your dashboard", status: "pending" },
  ]);

  const updateProgress = (stepId, newStatus) => {
    setProgress(prev => prev.map(step =>
      step.id === stepId ? { ...step, status: newStatus } : step
    ));
  };

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        // Step 1: Verify authentication
        updateProgress(1, "active");
        setMessage("Verifying your credentials...");

        // Check for URL errors
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const errorDescription = hashParams.get('error_description');
        if (errorDescription) {
          setStatus("error");
          setMessage("Authentication failed. Redirecting...");
          updateProgress(1, "error");
          setTimeout(() => navigate("/", { replace: true }), 2500);
          return;
        }

        // Get session
        const { session, error } = await auth.getSession();

        if (error) {
          setStatus("error");
          setMessage("Authentication failed. Redirecting...");
          updateProgress(1, "error");
          setTimeout(() => navigate("/", { replace: true }), 2500);
          return;
        }

        if (!session) {
          setMessage("Waiting for authentication...");

          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (event === 'SIGNED_IN' && session) {
                // Clear timeout since we got a session
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                  timeoutRef.current = null;
                }
                subscription.unsubscribe();
                subscriptionRef.current = null;
                await handleSession(session);
              } else if (event === 'SIGNED_OUT') {
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                  timeoutRef.current = null;
                }
                subscription.unsubscribe();
                subscriptionRef.current = null;
                navigate("/", { replace: true });
              }
            }
          );

          // Store subscription ref for cleanup
          subscriptionRef.current = subscription;

          // Timeout fallback
          timeoutRef.current = setTimeout(() => {
            if (subscriptionRef.current) {
              subscriptionRef.current.unsubscribe();
              subscriptionRef.current = null;
            }
            setStatus("error");
            setMessage("Session timeout. Redirecting...");
            updateProgress(1, "error");
            setTimeout(() => navigate("/", { replace: true }), 1500);
          }, 10000);

          return;
        }

        await handleSession(session);
      } catch (error) {
        setStatus("error");
        setMessage("Something went wrong. Redirecting...");
        updateProgress(1, "error");
        setTimeout(() => navigate("/", { replace: true }), 2500);
      }
    };

    const handleSession = async (session) => {
      try {
        // Complete step 1
        updateProgress(1, "complete");
        await new Promise(r => setTimeout(r, 300));

        // Step 2: Load profile
        updateProgress(2, "active");
        setMessage("Loading your profile...");

        let profile = null;
        let retryCount = 0;
        const maxRetries = 5;

        while (!profile && retryCount < maxRetries) {
          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', session.user.id)
            .single();

          if (data) {
            profile = data;
            break;
          }

          if (profileError) {
            retryCount++;
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 800));
            }
          }
        }

        updateProgress(2, "complete");
        await new Promise(r => setTimeout(r, 300));

        // Step 3: Prepare dashboard
        updateProgress(3, "active");
        setMessage("Preparing your experience...");
        await new Promise(r => setTimeout(r, 500));

        updateProgress(3, "complete");
        setStatus("success");

        if (profile?.onboarding_completed) {
          setMessage("Welcome back! Redirecting to dashboard...");
          await new Promise(r => setTimeout(r, 600));
          navigate("/dashboard", { replace: true });
        } else {
          setMessage("Let's complete your profile!");
          await new Promise(r => setTimeout(r, 600));
          navigate("/onboarding", { replace: true });
        }
      } catch (error) {
        navigate("/onboarding", { replace: true });
      }
    };

    processSession();

    // Cleanup function to prevent memory leaks
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#E6F0FF] flex items-center justify-center" data-testid="auth-callback">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0066FF]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#00C853]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center px-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <AnimatedLogo />
        </div>

        {/* Brand */}
        <h1 className="text-2xl font-bold text-[#111111] mb-2">GymGraph</h1>

        {/* Status message */}
        <p className={`text-lg mb-8 transition-all duration-300 ${
          status === 'error' ? 'text-[#FF3B30]' :
          status === 'success' ? 'text-[#00C853]' :
          'text-[#555555]'
        }`}>
          {message}
        </p>

        {/* Progress steps */}
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-[#E5E7EB]/50 p-6 max-w-xs mx-auto">
          <div className="space-y-4">
            {progress.map((step, index) => (
              <ProgressStep
                key={step.id}
                icon={step.icon}
                label={step.label}
                status={step.status}
                delay={index * 200}
              />
            ))}
          </div>
        </div>

        {/* Error message */}
        {status === 'error' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl max-w-xs mx-auto">
            <p className="text-red-600 text-sm">
              Something went wrong. You'll be redirected shortly.
            </p>
          </div>
        )}

        {/* Success animation */}
        {status === 'success' && (
          <div className="mt-6 flex justify-center">
            <div className="w-12 h-12 bg-[#00C853] rounded-full flex items-center justify-center animate-bounce">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
