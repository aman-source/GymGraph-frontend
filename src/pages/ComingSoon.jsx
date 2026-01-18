import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// GymGraph Mountain Logo Component
const GymGraphLogo = ({ className = "w-6 h-6", color = "white" }) => (
  <svg viewBox="0 0 512 512" className={className} fill={color}>
    <polygon points="80,400 220,160 320,400" />
    <polygon points="200,400 340,100 460,400" />
  </svg>
);

export default function ComingSoon() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-6 max-w-md">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#0066FF]/20">
          <GymGraphLogo className="w-11 h-11" />
        </div>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-full px-4 py-2 mb-6">
          <Flame className="w-4 h-4 text-[#FF6B00]" />
          <span className="text-[#FF6B00] font-semibold text-sm">Launching Very Soon</span>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-[#111111] mb-4">
          We're Almost Ready!
        </h1>
        <p className="text-[#555555] mb-8 leading-relaxed">
          The response has been incredible. We're working hard to launch GymGraph. Become a Founding Member and be first in line.
        </p>

        {/* CTA Button */}
        <Button
          onClick={() => navigate("/", { replace: true })}
          className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold px-8 py-6 rounded-xl shadow-lg shadow-[#0066FF]/25 transition-all duration-200 hover:-translate-y-0.5"
        >
          Become a Founding Member
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {/* Redirect Notice */}
        <p className="text-[#888888] text-sm mt-8">
          Redirecting to home page in a few seconds...
        </p>

        {/* Loading Animation */}
        <div className="flex justify-center gap-1 mt-4">
          <div className="w-2 h-2 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
