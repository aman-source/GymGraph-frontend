import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/supabase";
import { Loader2, Shield, LogIn, UserPlus } from "lucide-react";

// GymGraph Mountain Logo Component
const GymGraphLogo = ({ className = "w-6 h-6", color = "white" }) => (
  <svg viewBox="0 0 512 512" className={className} fill={color}>
    <polygon points="80,400 220,160 320,400" />
    <polygon points="200,400 340,100 460,400" />
  </svg>
);

export function AdminLogin({ title = "Admin Login", subtitle = "Sign in to access the admin dashboard" }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation for sign up
    if (isSignUp) {
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
    }

    try {
      if (isSignUp) {
        // Sign up - use correct method name from supabase.js
        const { data, error: authError } = await auth.signUpWithEmail(
          email.trim(),
          password
        );

        if (authError) {
          setError(authError.message);
          return;
        }

        // Check if email confirmation is required
        if (data?.user && !data?.session) {
          setSuccess("Account created! Please check your email to confirm, then sign in.");
          setIsSignUp(false);
          setPassword("");
          setConfirmPassword("");
        }
        // If session exists, user is logged in automatically
      } else {
        // Sign in - use correct method name from supabase.js
        const { data, error: authError } = await auth.signInWithEmail(
          email.trim(),
          password
        );

        if (authError) {
          setError(authError.message);
          return;
        }
        // Auth state change will trigger re-render via useAuth
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#0066FF]/20">
            <GymGraphLogo className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-bold text-[#111111]">{title}</h1>
          <p className="text-[#555555] mt-2">{subtitle}</p>
        </div>

        {/* Login/Signup Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#E5E7EB]">
            <Shield className="w-5 h-5 text-[#0066FF]" />
            <span className="font-medium text-[#111111]">
              {isSignUp ? "Create Admin Account" : "Secure Admin Access"}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#333333]">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@gymgraph.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 border-[#E5E7EB] focus:border-[#0066FF] focus:ring-[#0066FF]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#333333]">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder={isSignUp ? "Create a password (min 6 chars)" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={isSignUp ? 6 : undefined}
                className="h-12 border-[#E5E7EB] focus:border-[#0066FF] focus:ring-[#0066FF]/20"
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#333333]">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-12 border-[#E5E7EB] focus:border-[#0066FF] focus:ring-[#0066FF]/20"
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                {success}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-xl shadow-lg shadow-[#0066FF]/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </>
              ) : (
                <>
                  {isSignUp ? (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Create Account
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In
                    </>
                  )}
                </>
              )}
            </Button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="mt-6 pt-4 border-t border-[#E5E7EB] text-center">
            <p className="text-[#555555] text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-2 text-[#0066FF] font-medium hover:underline"
              >
                {isSignUp ? "Sign In" : "Create Account"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[#888888] text-sm mt-6">
          GymGraph Admin Portal
        </p>
      </div>
    </div>
  );
}
