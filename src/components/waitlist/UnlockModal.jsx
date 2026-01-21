import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Gift, Lock, Sparkles, Phone } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function UnlockModal({ open, onClose, onSuccess, referralCode }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [interestType, setInterestType] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get UTM params from URL
      const urlParams = new URLSearchParams(window.location.search);

      const response = await fetch(`${BACKEND_URL}/api/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          name: name.trim() || null,
          phone: phone.trim() || null,
          city: city.trim() || null,
          interest_type: interestType,
          referred_by_code: referralCode || null,
          utm_source: urlParams.get('utm_source'),
          utm_medium: urlParams.get('utm_medium'),
          utm_campaign: urlParams.get('utm_campaign'),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to join waitlist');
      }

      // Pass email to success handler for localStorage
      onSuccess({ ...data, email: email.toLowerCase().trim() });
    } catch (err) {
      if (err.message?.includes('409') || err.message?.includes('already')) {
        setError("You're already on the waitlist! Check your email for your referral code.");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 rounded-3xl p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-[#FF9500] to-[#E68600] p-6 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              Unlock Your Reward
            </DialogTitle>
          </DialogHeader>
          <p className="text-white/90 text-sm mt-2">
            Enter your email to reveal your exclusive mystery reward!
          </p>

          {referralCode && (
            <motion.div
              className="mt-3 inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Gift className="w-4 h-4" />
              <span className="text-sm">Invited by a friend - bonus reward!</span>
            </motion.div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-[#555555] mb-1.5 block">
              Email Address *
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="h-12 bg-[#F8F9FA] border-[#E5E7EB] rounded-xl focus:border-[#FF9500] focus:ring-[#FF9500]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-[#555555] mb-1.5 block">
                Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-12 bg-[#F8F9FA] border-[#E5E7EB] rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#555555] mb-1.5 block">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="h-12 bg-[#F8F9FA] border-[#E5E7EB] rounded-xl pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[#555555] mb-1.5 block">
              City
            </label>
            <Input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Mumbai, Delhi, Bangalore..."
              className="h-12 bg-[#F8F9FA] border-[#E5E7EB] rounded-xl"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#555555] mb-2 block">I am a...</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'user', label: 'Fitness Enthusiast' },
                { value: 'gym_owner', label: 'Gym Owner' },
                { value: 'partner', label: 'Brand Partner' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setInterestType(option.value)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    interestType === option.value
                      ? 'bg-[#FF9500] text-white'
                      : 'bg-[#F8F9FA] text-[#555555] hover:bg-[#E5E7EB]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-amber-50 border border-amber-200 rounded-xl"
              >
                <p className="text-amber-700 text-sm text-center">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            disabled={loading || !email}
            className="w-full h-14 bg-[#FF9500] hover:bg-[#E68600] text-white rounded-xl font-semibold text-lg shadow-lg shadow-[#FF9500]/30 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Unlock My Reward
              </>
            )}
          </Button>

          <p className="text-center text-xs text-[#888888]">
            We'll only email you when we launch. No spam, ever.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
