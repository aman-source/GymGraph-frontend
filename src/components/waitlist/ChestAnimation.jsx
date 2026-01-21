import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { triggerConfetti } from "./confetti";
import { Sparkles } from "lucide-react";
import Chest3D from "./Chest3D";

const ANIMATION_DURATION = 4500;

export default function ChestAnimation({ onComplete }) {
  const [phase, setPhase] = useState("intro"); // intro -> animating -> burst -> complete
  const [showChest, setShowChest] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => {
        setShowChest(true);
        setPhase("animating");
      }, 500),
      setTimeout(() => setPhase("burst"), 3000),
      setTimeout(() => {
        triggerConfetti();
        setPhase("complete");
      }, 3500),
      setTimeout(onComplete, ANIMATION_DURATION)
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const handleChestAnimationComplete = useCallback(() => {
    // Chest opening animation finished
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/95" />

      {/* Radial glow background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, rgba(0,102,255,0.15) 0%, rgba(255,149,0,0.1) 30%, transparent 60%)"
        }}
        animate={phase !== "intro" ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0.2 }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Light rays when opening */}
      {(phase === "burst" || phase === "complete") && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 h-[200vh] w-3"
              style={{
                background: `linear-gradient(to top, transparent, ${i % 2 === 0 ? 'rgba(255,215,0,0.4)' : 'rgba(0,102,255,0.3)'}, transparent)`,
                transformOrigin: "bottom center",
              }}
              initial={{ opacity: 0, rotate: i * 30, scaleY: 0 }}
              animate={{ opacity: [0, 0.8, 0], scaleY: [0, 1.5, 2] }}
              transition={{ duration: 1.5, delay: i * 0.03 }}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center" style={{ overflow: 'visible' }}>
        {/* Intro text */}
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p className="text-white/70 text-xl font-medium">
                Unlocking your mystery reward...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Chest */}
        {showChest && phase !== "complete" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: phase === "burst" || phase === "complete" ? 0 : 1,
              scale: phase === "burst" ? 0.9 : 1,
              y: phase === "burst" ? 30 : 0
            }}
            transition={{ duration: 0.5 }}
            className="relative"
            style={{ overflow: 'visible' }}
          >
            {/* Glow behind chest */}
            <motion.div
              className="absolute inset-0 -m-20 rounded-full blur-3xl pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(255,149,0,0.4) 0%, rgba(0,102,255,0.2) 50%, transparent 70%)"
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />

            <Chest3D
              isAnimating={phase === "animating" || phase === "burst"}
              onAnimationComplete={handleChestAnimationComplete}
              showParticles={false}
              className="w-[450px] h-[400px]"
            />
          </motion.div>
        )}

        {/* Burst particles */}
        {(phase === "burst" || phase === "complete") && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {[...Array(30)].map((_, i) => {
              const angle = (i / 30) * Math.PI * 2;
              const distance = 150 + Math.random() * 100;
              const size = 6 + Math.random() * 10;
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size,
                    background:
                      i % 4 === 0 ? "#FFD700" :
                      i % 4 === 1 ? "#FF9500" :
                      i % 4 === 2 ? "#0066FF" : "#FFFFFF"
                  }}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance - 30,
                    scale: 0,
                    opacity: 0
                  }}
                  transition={{
                    duration: 0.8 + Math.random() * 0.4,
                    ease: "easeOut"
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Completion text */}
        <AnimatePresence>
          {phase === "complete" && (
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <motion.div
                className="relative mb-6"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                <Sparkles className="w-24 h-24 text-[#FFD700]" />
                {/* Sparkle effects */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-[#FFD700] rounded-full"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15
                    }}
                  />
                ))}
              </motion.div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-3">
                Reward Unlocked!
              </h2>
              <p className="text-white/60 text-lg">
                See what you've won
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
