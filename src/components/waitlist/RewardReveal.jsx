import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Copy,
  Check,
  Gift,
  Award,
  Coins,
  Crown,
  Share2,
  Sparkles,
  Star,
  Users,
  X
} from "lucide-react";

// Reward configurations
const REWARDS = {
  founding_member: {
    title: "Founding Member",
    subtitle: "You're among the first 100!",
    icon: Crown,
    color: "#FFD700",
    gradient: "from-[#FFD700] to-[#FFA500]"
  },
  early_bird: {
    title: "Early Bird",
    subtitle: "Welcome to the inner circle!",
    icon: Award,
    color: "#FF9500",
    gradient: "from-[#FF9500] to-[#FF6B00]"
  },
  supporter: {
    title: "Supporter",
    subtitle: "Thanks for joining early!",
    icon: Gift,
    color: "#0066FF",
    gradient: "from-[#0066FF] to-[#0052CC]"
  }
};

// WhatsApp icon
const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function RewardReveal({ open, onClose, userData }) {
  const [copied, setCopied] = useState(false);

  if (!userData) return null;

  const reward = REWARDS[userData.reward_type] || REWARDS.supporter;
  const RewardIcon = reward.icon;

  const referralLink = `${window.location.origin}/?ref=${userData.referral_code}`;
  const shareMessage = `🎁 I just unlocked ${userData.reward_coins} coins on GymGraph!\n\nJoin with my code: ${userData.referral_code}\nWe both get bonus coins! 💰\n\n${referralLink}`;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join GymGraph - Get Free Coins!',
          text: shareMessage,
          url: referralLink,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyCode();
        }
      }
    } else {
      copyCode();
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
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

          {/* Modal */}
          <motion.div
            className="relative w-full sm:max-w-[420px] bg-white rounded-t-[28px] sm:rounded-[28px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 text-[#555555] hover:bg-black/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hero Header with Reward */}
            <div className="relative px-6 pt-8 pb-6 text-center overflow-hidden">
              {/* Background gradient */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${reward.color} 0%, transparent 70%)`
                }}
              />

              {/* Confetti particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#0066FF" : "#FF9500",
                      left: `${10 + (i * 7)}%`,
                      top: "-10%"
                    }}
                    animate={{
                      y: ["0vh", "100vh"],
                      x: [0, (i % 2 === 0 ? 1 : -1) * 30],
                      rotate: [0, 360],
                      opacity: [1, 0]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "linear"
                    }}
                  />
                ))}
              </div>

              {/* Lucky winner badge */}
              {userData.is_lucky && (
                <motion.div
                  className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full text-sm font-bold text-black flex items-center gap-1 shadow-lg"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
                >
                  <Star className="w-4 h-4" />
                  JACKPOT!
                </motion.div>
              )}

              {/* Badge icon */}
              <motion.div
                className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${reward.gradient} flex items-center justify-center shadow-lg`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <RewardIcon className="w-10 h-10 text-white" />
              </motion.div>

              <motion.h2
                className="text-2xl font-bold text-[#111111] mb-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {reward.title}
              </motion.h2>
              <motion.p
                className="text-[#666666]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {reward.subtitle}
              </motion.p>

              {/* Position badge */}
              {userData.position && (
                <motion.div
                  className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-[#F8F9FA] rounded-full text-sm font-medium text-[#555555]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  #{userData.position} in line
                </motion.div>
              )}
            </div>

            {/* Coins earned - big highlight */}
            <motion.div
              className="mx-6 p-5 bg-gradient-to-br from-[#FFD700]/15 via-[#FF9500]/10 to-[#FFD700]/15 rounded-2xl border border-[#FFD700]/30"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Coins className="w-10 h-10 text-[#CC8800]" />
                </motion.div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#111111]">{userData.reward_coins}</p>
                  <p className="text-sm text-[#666666]">coins locked in</p>
                </div>
              </div>
              <p className="text-center text-xs text-[#888888] mt-2">
                + {userData.premium_days} days premium at launch
              </p>
            </motion.div>

            {/* Share section - THE MAIN CTA */}
            <div className="px-6 py-6">
              <motion.div
                className="p-4 bg-gradient-to-br from-[#0066FF]/5 to-[#0066FF]/10 rounded-2xl border-2 border-dashed border-[#0066FF]/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {/* Earn more header */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#0066FF]/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-[#0066FF]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#111111]">Want more coins?</p>
                    <p className="text-xs text-[#666666]">Earn +15 coins for each friend who joins</p>
                  </div>
                </div>

                {/* Referral code display */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0066FF] to-[#0052CC] rounded-xl opacity-10" />
                  <div className="relative flex items-center bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                    <div className="flex-1 px-4 py-3">
                      <p className="text-xs text-[#888888] mb-0.5">Your invite link</p>
                      <p className="font-mono text-sm font-semibold text-[#0066FF] truncate">
                        {referralLink}
                      </p>
                    </div>
                    <button
                      onClick={copyCode}
                      className="h-full px-4 bg-[#F8F9FA] border-l border-[#E5E7EB] hover:bg-[#E5E7EB] transition-colors"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-[#00C853]" />
                      ) : (
                        <Copy className="w-5 h-5 text-[#555555]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Share buttons - prominent */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={shareViaWhatsApp}
                    className="h-12 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl font-semibold shadow-md active:scale-[0.98] transition-all"
                  >
                    <WhatsAppIcon className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={shareNative}
                    className="h-12 bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:from-[#0052CC] hover:to-[#003D99] text-white rounded-xl font-semibold shadow-md active:scale-[0.98] transition-all"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>

                {/* Incentive reminder */}
                <motion.div
                  className="mt-4 flex items-center justify-center gap-2 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Sparkles className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-[#666666]">Your friends get</span>
                  <span className="font-bold text-[#0066FF]">+20 bonus coins</span>
                  <span className="text-[#666666]">too!</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Done button */}
            <div className="px-6 pb-6">
              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full h-12 text-[#555555] hover:text-[#111111] hover:bg-[#F8F9FA] rounded-xl font-medium"
              >
                Done
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
