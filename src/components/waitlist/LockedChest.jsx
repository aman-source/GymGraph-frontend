import { motion } from "framer-motion";
import { Lock, Gift, Sparkles, CheckCircle2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LockedChest({ onClick, isUnlocked, userData }) {
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-white to-[#F8F9FA] relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF9500]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#FF9500]/10 border border-[#FF9500]/30 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#FF9500]" />
            <span className="text-[#FF9500] font-semibold text-sm">
              {isUnlocked ? "Reward Claimed!" : "Exclusive Mystery Reward"}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-3">
            {isUnlocked ? "Welcome, Founding Member!" : "Unlock Your Mystery Reward"}
          </h2>
          <p className="text-lg text-[#555555] max-w-xl mx-auto">
            {isUnlocked
              ? "Your exclusive rewards are locked in. Share with friends to earn bonus coins!"
              : "Join the waitlist to reveal what's inside. Early members get the best rewards."
            }
          </p>
        </div>

        {/* Chest Visual */}
        <motion.div
          className="relative inline-block cursor-pointer"
          onClick={!isUnlocked ? onClick : undefined}
          whileHover={!isUnlocked ? { scale: 1.05 } : {}}
          whileTap={!isUnlocked ? { scale: 0.98 } : {}}
        >
          {/* Chest Container */}
          <div className={`relative w-48 h-48 sm:w-56 sm:h-56 mx-auto ${!isUnlocked ? 'animate-float' : ''}`}>
            {/* Chest Body */}
            <div className={`absolute inset-0 rounded-2xl ${
              isUnlocked
                ? 'bg-gradient-to-br from-[#00C853] to-[#00A843]'
                : 'bg-gradient-to-br from-[#8B4513] to-[#654321]'
            } shadow-2xl`}>
              {/* Chest Details */}
              <div className="absolute inset-4 border-4 border-[#D4A574]/30 rounded-xl" />

              {/* Lock or Check Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                {isUnlocked ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <CheckCircle2 className="w-20 h-20 text-white drop-shadow-lg" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                      rotate: [-2, 2, -2]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Lock className="w-16 h-16 text-[#FFD700] drop-shadow-lg" />
                  </motion.div>
                )}
              </div>

              {/* Glow effect for locked state */}
              {!isUnlocked && (
                <div className="absolute -inset-4 bg-[#FFD700]/20 rounded-3xl blur-xl animate-pulse" />
              )}
            </div>

            {/* Floating particles */}
            {!isUnlocked && (
              <>
                <motion.div
                  className="absolute -top-4 -right-4 w-3 h-3 bg-[#FFD700] rounded-full"
                  animate={{ y: [-10, 10], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-2 -left-6 w-2 h-2 bg-[#FF9500] rounded-full"
                  animate={{ y: [10, -10], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div
                  className="absolute top-1/2 -right-8 w-2 h-2 bg-[#0066FF] rounded-full"
                  animate={{ x: [-5, 5], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
                />
              </>
            )}
          </div>

          {/* CTA Button */}
          {!isUnlocked ? (
            <motion.div
              className="mt-8"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Button
                size="lg"
                className="bg-[#FF9500] hover:bg-[#E68600] text-white text-lg px-8 py-6 rounded-xl font-semibold shadow-lg shadow-[#FF9500]/30"
              >
                <Gift className="w-5 h-5 mr-2" />
                Unlock My Box
              </Button>
            </motion.div>
          ) : (
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-center gap-2 text-[#00C853] font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                <span>{userData?.reward_coins || 0} coins locked in!</span>
              </div>
              <p className="text-sm text-[#888888]">
                Your code: <span className="font-mono font-bold text-[#0066FF]">{userData?.referral_code}</span>
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (navigator.share) {
                    navigator.share({
                      title: 'Join GymGraph',
                      text: `I just unlocked my mystery reward on GymGraph! Join with my code ${userData?.referral_code} and get exclusive perks!`,
                      url: `${window.location.origin}/?ref=${userData?.referral_code}`
                    });
                  } else {
                    navigator.clipboard.writeText(`${window.location.origin}/?ref=${userData?.referral_code}`);
                  }
                }}
                className="border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF]/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share & Earn More
              </Button>
            </div>
          )}
        </motion.div>

        {/* Social Proof */}
        {!isUnlocked && (
          <motion.p
            className="mt-6 text-[#888888] text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-[#0066FF] font-semibold">2,847</span> people already unlocked their rewards
          </motion.p>
        )}
      </div>
    </section>
  );
}
