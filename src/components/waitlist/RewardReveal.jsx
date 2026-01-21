import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
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
  Star
} from "lucide-react";

// Reward configurations
const REWARDS = {
  founding_member: {
    title: "Founding Member",
    subtitle: "You're among the first 100!",
    icon: Crown,
    color: "#FFD700",
    benefits: [
      "Lifetime Founding Member badge",
      "Early access to all features",
      "Direct line to founders",
      "Priority support forever"
    ]
  },
  early_bird: {
    title: "Early Bird",
    subtitle: "Welcome to the inner circle!",
    icon: Award,
    color: "#FF9500",
    benefits: [
      "Early Bird badge",
      "Priority feature access",
      "Exclusive community access",
      "Beta testing invites"
    ]
  },
  supporter: {
    title: "Supporter",
    subtitle: "Thanks for joining early!",
    icon: Gift,
    color: "#0066FF",
    benefits: [
      "Supporter badge",
      "Early access queue priority",
      "Special launch perks",
      "Community membership"
    ]
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
  const shareMessage = `I just unlocked my ${reward.title} reward on GymGraph! Join with my code ${userData.referral_code} and get exclusive perks too! ${referralLink}`;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(userData.referral_code);
      setCopied(true);
      toast.success("Referral code copied!");
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
          title: 'Join GymGraph',
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white border-0 rounded-3xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Animated header */}
        <motion.div
          className="relative p-8 text-center overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${reward.color}20, ${reward.color}40)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: reward.color,
                  left: `${20 + i * 15}%`,
                  top: `${10 + (i % 3) * 30}%`
                }}
                animate={{
                  y: [-5, 5, -5],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>

          {/* Lucky winner badge */}
          {userData.is_lucky && (
            <motion.div
              className="absolute top-4 right-4 px-3 py-1 bg-[#FFD700] rounded-full text-sm font-bold text-black flex items-center gap-1"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
            >
              <Star className="w-4 h-4" />
              JACKPOT!
            </motion.div>
          )}

          {/* Icon */}
          <motion.div
            className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ background: reward.color }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
          >
            <RewardIcon className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h2
            className="text-2xl font-bold text-[#111111] mb-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {reward.title}
          </motion.h2>
          <motion.p
            className="text-[#555555]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {reward.subtitle}
          </motion.p>

          {/* Position badge */}
          {!userData.already_exists && (
            <motion.div
              className="absolute top-4 left-4 px-3 py-1 bg-white/80 rounded-full text-sm font-semibold"
              style={{ color: reward.color }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              #{userData.position} in queue
            </motion.div>
          )}
        </motion.div>

        {/* Coins display */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#FFD700]/10 to-[#FF9500]/10 border-y border-[#FFD700]/20">
          <motion.div
            className="flex items-center justify-center gap-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <Coins className="w-8 h-8 text-[#FFD700]" />
            <span className="text-3xl font-bold text-[#111111]">{userData.reward_coins}</span>
            <span className="text-lg text-[#555555]">coins locked in!</span>
          </motion.div>
          <p className="text-center text-sm text-[#888888] mt-1">
            + {userData.premium_days} days premium trial at launch
          </p>
        </div>

        {/* Benefits list */}
        <div className="px-6 py-4">
          <h3 className="text-sm font-semibold text-[#888888] uppercase tracking-wide mb-3">
            Your Perks
          </h3>
          <ul className="space-y-2">
            {reward.benefits.map((benefit, i) => (
              <motion.li
                key={i}
                className="flex items-center gap-3 text-[#333333]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: `${reward.color}20` }}
                >
                  <Check className="w-4 h-4" style={{ color: reward.color }} />
                </div>
                {benefit}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Referral section */}
        <div className="px-6 py-4 bg-[#F8F9FA] border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#555555]">
              Share & Earn More
            </h3>
            <span className="text-xs text-[#888888]">
              +10-15 coins per friend
            </span>
          </div>

          {/* Referral code display */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 px-4 py-3 bg-white rounded-xl border-2 border-dashed border-[#E5E7EB]">
              <p className="text-lg font-bold font-mono tracking-widest text-center">
                {userData.referral_code}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={copyCode}
              className="h-12 w-12 rounded-xl border-[#E5E7EB] hover:border-[#0066FF]"
            >
              {copied ? (
                <Check className="w-5 h-5 text-[#00C853]" />
              ) : (
                <Copy className="w-5 h-5 text-[#555555]" />
              )}
            </Button>
          </div>

          {/* Share buttons */}
          <div className="flex gap-2">
            <Button
              onClick={shareViaWhatsApp}
              className="flex-1 h-12 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl"
            >
              <WhatsAppIcon className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>
            <Button
              onClick={shareNative}
              className="flex-1 h-12 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E5E7EB]">
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full h-12 text-[#555555] hover:text-[#111111] hover:bg-[#F8F9FA] rounded-xl"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
