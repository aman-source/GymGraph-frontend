import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/supabase";
import { Loader2, Shield, LogIn } from "lucide-react";

// GymGraph Mountain Logo Component
const GymGraphLogo = ({ className = "w-6 h-6", color = "white" }) => (
  <svg viewBox="0 0 512 512" className={className} fill={color}>
    <polygon points="80,400 220,160 320,400" />
    <polygon points="200,400 340,100 460,400" />
  </svg>
);

export function AdminLogin({ title = "Admin Login", subtitle = "Sign in to access the admin dashboard" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      // Auth state change will trigger re-render via useAuth
      // The dashboard component will handle role verification
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#E5E7EB]">
            <Shield className="w-5 h-5 text-[#0066FF]" />
            <span className="font-medium text-[#111111]">Secure Admin Access</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 border-[#E5E7EB] focus:border-[#0066FF] focus:ring-[#0066FF]/20"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
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
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[#888888] text-sm mt-6">
          GymGraph Admin Portal
        </p>
      </div>
    </div>
  );
}
