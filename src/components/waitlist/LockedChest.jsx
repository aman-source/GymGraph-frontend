import { motion } from "framer-motion";
import { CheckCircle2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Chest3D from "./Chest3D";
import OrbitingRewards from "./OrbitingRewards";

export default function LockedChest({ onClick, isUnlocked, userData, inline = false }) {
  if (inline) {
    return (
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!isUnlocked ? (
          <>
            {/* Orbiting rewards + Chest container */}
            <div className="relative w-[340px] sm:w-[400px] h-[340px] sm:h-[400px] flex items-center justify-center">
              {/* Orbiting reward items */}
              <OrbitingRewards isActive={true} />

              {/* Clickable chest area with shake animation */}
              <motion.div
                className="relative cursor-pointer group z-10"
                onClick={onClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  rotate: [0, -2, 2, -2, 2, 0],
                }}
                transition={{
                  rotate: {
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }
                }}
              >
                {/* Subtle glow */}
                <div className="absolute inset-0 -m-8 pointer-events-none">
                  <motion.div
                    className="w-full h-full rounded-full blur-3xl opacity-40"
                    style={{
                      background: "radial-gradient(circle, rgba(0,102,255,0.3) 0%, transparent 70%)"
                    }}
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>

                <Chest3D
                  isUnlocked={false}
                  showParticles={false}
                  className="w-[300px] sm:w-[360px]"
                />

                {/* Hover overlay - text only, no background */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <span className="text-white font-semibold text-lg drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to Open
                  </span>
                </motion.div>
              </motion.div>
            </div>

            {/* CTA Text - reduced gap */}
            <motion.div
              className="-mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={onClick}
                className="text-[#0066FF] font-semibold text-lg hover:text-[#0052CC] transition-colors"
              >
                Tap to claim your reward
              </button>

              <p className="text-sm text-[#888888] mt-1">
                Free premium access, coins & more
              </p>

              {/* Social proof - minimal */}
              <p className="text-xs text-[#AAAAAA] mt-2">
                2,847 rewards claimed
              </p>
            </motion.div>
          </>
        ) : (
          <>
            {/* Unlocked state */}
            <div className="relative">
              <div className="absolute inset-0 -m-6 pointer-events-none">
                <div
                  className="w-full h-full rounded-full blur-2xl opacity-30"
                  style={{ background: "radial-gradient(circle, rgba(0,200,83,0.4) 0%, transparent 70%)" }}
                />
              </div>
              <Chest3D
                isUnlocked={true}
                showParticles={false}
                className="w-[300px] sm:w-[360px]"
              />
            </div>

            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center gap-2 text-[#00C853] font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                <span>{userData?.reward_coins || 0} coins earned</span>
              </div>

              <p className="text-sm text-[#666666] mt-2">
                Referral code: <span className="font-mono font-semibold text-[#0066FF]">{userData?.referral_code}</span>
              </p>

              <Button
                variant="outline"
                size="sm"
                className="mt-4 border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF]/5"
                onClick={(e) => {
                  e.stopPropagation();
                  const url = `${window.location.origin}/?ref=${userData?.referral_code}`;
                  if (navigator.share) {
                    navigator.share({
                      title: 'Join GymGraph',
                      text: `Join GymGraph with my code ${userData?.referral_code}`,
                      url
                    });
                  } else {
                    navigator.clipboard.writeText(url);
                  }
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share & Earn More
              </Button>
            </motion.div>
          </>
        )}
      </motion.div>
    );
  }

  // Full section version
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-[#FAFAFA]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-3">
          {isUnlocked ? "Reward Claimed" : "Claim Your Reward"}
        </h2>
        <p className="text-lg text-[#666666] mb-8">
          {isUnlocked
            ? "Share with friends to earn bonus coins"
            : "Early access perks waiting for you"
          }
        </p>

        {/* Orbiting rewards + Chest container for full section */}
        <div className="relative inline-flex items-center justify-center w-[420px] sm:w-[500px] h-[400px] sm:h-[460px]">
          {/* Orbiting reward items - only show when locked */}
          {!isUnlocked && <OrbitingRewards isActive={true} />}

          <motion.div
            className={`relative ${!isUnlocked ? 'cursor-pointer' : ''} z-10`}
            onClick={!isUnlocked ? onClick : undefined}
            whileHover={!isUnlocked ? { scale: 1.02 } : {}}
            whileTap={!isUnlocked ? { scale: 0.98 } : {}}
            animate={!isUnlocked ? {
              rotate: [0, -2, 2, -2, 2, 0],
            } : {}}
            transition={{
              rotate: {
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
              }
            }}
          >
            <Chest3D
              isUnlocked={isUnlocked}
              showParticles={false}
              className="w-[380px] sm:w-[440px]"
            />
          </motion.div>
        </div>

        {!isUnlocked ? (
          <motion.div className="-mt-2">
            <button
              onClick={onClick}
              className="text-[#0066FF] font-semibold text-lg hover:text-[#0052CC] transition-colors"
            >
              Tap the chest to open
            </button>
            <p className="text-sm text-[#888888] mt-1">
              2,847 rewards claimed
            </p>
          </motion.div>
        ) : (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-center gap-2 text-[#00C853] font-semibold">
              <CheckCircle2 className="w-5 h-5" />
              <span>{userData?.reward_coins || 0} coins earned</span>
            </div>
            <p className="text-sm text-[#666666]">
              Code: <span className="font-mono font-semibold text-[#0066FF]">{userData?.referral_code}</span>
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF]/5"
              onClick={(e) => {
                e.stopPropagation();
                const url = `${window.location.origin}/?ref=${userData?.referral_code}`;
                if (navigator.share) {
                  navigator.share({
                    title: 'Join GymGraph',
                    text: `Join GymGraph with my code ${userData?.referral_code}`,
                    url
                  });
                } else {
                  navigator.clipboard.writeText(url);
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share & Earn More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
