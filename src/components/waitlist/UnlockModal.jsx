import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Gift, Sparkles, X } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Rotating reward hints
const REWARD_HINTS = [
  "Free Gym Tee",
  "Premium Shaker",
  "Gym Membership",
  "Protein Pack",
  "Mystery Coins",
  "Premium Access",
];

export default function UnlockModal({ open, onClose, onSuccess, referralCode }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentHint, setCurrentHint] = useState(0);

  // Rotate reward hints
  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setCurrentHint((prev) => (prev + 1) % REWARD_HINTS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const urlParams = new URLSearchParams(window.location.search);

      const response = await fetch(`${BACKEND_URL}/api/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
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

      onSuccess({ ...data, email: email.toLowerCase().trim() });
    } catch (err) {
      if (err.message?.includes('409') || err.message?.includes('already')) {
        setError("You're already on the list!");
      } else {
        setError(err.message || "Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal - hide scrollbar */}
          <motion.div
            className="relative w-full max-w-[400px] bg-white rounded-[28px] overflow-hidden shadow-2xl max-h-[85vh]"
            style={{
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Hide webkit scrollbar */}
            <style>{`
              .modal-scroll::-webkit-scrollbar { display: none; }
            `}</style>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hero Header */}
            <div className="relative bg-gradient-to-br from-[#0066FF] via-[#0052CC] to-[#003D99] px-6 pt-8 pb-10 text-white overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#FFD700]/20 rounded-full blur-2xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />
                {/* Floating sparkles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${10 + i * 16}%`,
                      top: `${15 + (i % 3) * 25}%`,
                    }}
                    animate={{
                      y: [-5, 5, -5],
                      opacity: [0.4, 1, 0.4],
                      scale: [0.8, 1.1, 0.8],
                    }}
                    transition={{
                      duration: 2 + i * 0.2,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-[#FFD700]" />
                  </motion.div>
                ))}
              </div>

              {/* Content */}
              <div className="relative text-center">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                >
                  <Gift className="w-8 h-8 text-white" />
                </motion.div>

                <motion.h2
                  className="text-2xl font-bold mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Mystery Reward Inside
                </motion.h2>

                <motion.p
                  className="text-white/80 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Early members get exclusive perks
                </motion.p>

                {/* Referral bonus badge */}
                {referralCode && (
                  <motion.div
                    className="mt-4 inline-flex items-center gap-2 bg-[#FFD700] text-black px-4 py-2 rounded-full text-sm font-semibold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.4 }}
                  >
                    <Sparkles className="w-4 h-4" />
                    +20 Bonus Coins!
                  </motion.div>
                )}
              </div>
            </div>

            {/* Possible rewards showcase */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#FFD700]/10 to-[#FF9500]/10 border-b border-[#FFD700]/20">
              <p className="text-center text-xs text-[#888888] mb-2">You could win</p>
              <div className="flex items-center justify-center gap-2 h-7 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentHint}
                    className="text-lg font-bold text-[#0066FF]"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {REWARD_HINTS[currentHint]}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="flex justify-center gap-1 mt-2">
                {REWARD_HINTS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === currentHint ? 'bg-[#0066FF]' : 'bg-[#E5E7EB]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="text-sm font-medium text-[#333333] mb-2 block">
                  Enter your email to unlock
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full h-14 px-4 bg-[#F8F9FA] border-2 border-[#E5E7EB] rounded-2xl text-base text-[#111111] placeholder:text-[#999999] focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 outline-none transition-all"
                />
              </motion.div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    className="mt-3 text-center text-sm font-medium text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit button - THE BIG CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-4"
              >
                <motion.button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="relative w-full overflow-hidden bg-gradient-to-r from-[#0066FF] to-[#0052CC] text-white rounded-2xl font-semibold shadow-lg shadow-[#0066FF]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />

                  <div className="relative py-4 px-6">
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-lg">Tap to Unlock</span>
                        <span className="text-xs text-white/70 mt-0.5">
                          Free Tee • Shaker • Premium & More
                        </span>
                      </div>
                    )}
                  </div>
                </motion.button>

                {/* Pulsing indicator */}
                {!loading && email.trim() && (
                  <motion.div
                    className="flex justify-center mt-3"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="text-xs text-[#0066FF] font-medium">
                      ↑ Tap the button above ↑
                    </span>
                  </motion.div>
                )}
              </motion.div>

              {/* Trust badges */}
              <motion.div
                className="mt-4 flex items-center justify-center gap-4 text-xs text-[#888888]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#00C853] rounded-full" />
                  No spam
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#00C853] rounded-full" />
                  100% Free
                </span>
              </motion.div>
            </form>

            {/* Social proof footer */}
            <motion.div
              className="px-6 py-4 bg-[#F8F9FA] border-t border-[#E5E7EB]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3">
                {/* Live indicator */}
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C853] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C853]"></span>
                  </span>
                  <span className="text-xs text-[#666666]">
                    <span className="font-semibold text-[#0066FF]">47</span> people unlocking now
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
