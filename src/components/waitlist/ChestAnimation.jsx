import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { triggerConfetti } from "./confetti";

const ANIMATION_DURATION = 3500; // Total animation time in ms

export default function ChestAnimation({ onComplete }) {
  const [phase, setPhase] = useState("waiting"); // waiting -> shake -> open -> burst -> complete

  useEffect(() => {
    // Start shake after a brief pause
    const timers = [
      setTimeout(() => setPhase("shake"), 300),
      setTimeout(() => setPhase("open"), 1100),
      setTimeout(() => setPhase("burst"), 1800),
      setTimeout(() => {
        triggerConfetti();
        setPhase("complete");
      }, 2500),
      setTimeout(onComplete, ANIMATION_DURATION)
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-[#FF9500]/20 via-transparent to-transparent" />

      {/* Tap instruction */}
      {phase === "waiting" && (
        <motion.p
          className="absolute top-1/3 text-white/80 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Get ready...
        </motion.p>
      )}

      {/* Animated chest */}
      <div className="relative">
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 -m-20 bg-[#FFD700]/30 rounded-full blur-3xl"
          animate={phase === "burst" || phase === "complete" ? { scale: [1, 2], opacity: [0.5, 0] } : {}}
          transition={{ duration: 0.8 }}
        />

        {/* Chest container */}
        <motion.div
          className="relative w-64 h-64"
          animate={
            phase === "shake"
              ? { rotate: [-5, 5, -5, 5, 0], x: [-10, 10, -10, 10, 0] }
              : phase === "open"
              ? { scale: [1, 1.1, 1] }
              : phase === "burst"
              ? { scale: [1, 1.3], y: -50 }
              : {}
          }
          transition={{
            duration: phase === "shake" ? 0.6 : 0.5,
            ease: "easeInOut"
          }}
        >
          {/* Chest base */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#8B4513] to-[#654321] shadow-2xl overflow-hidden"
            animate={phase === "burst" || phase === "complete" ? { opacity: 0 } : {}}
          >
            <div className="absolute inset-4 border-4 border-[#D4A574]/30 rounded-xl" />

            {/* Chest lid (opens) */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#A0522D] to-[#8B4513] rounded-t-2xl origin-bottom"
              style={{ transformStyle: "preserve-3d" }}
              animate={
                phase === "open" || phase === "burst" || phase === "complete"
                  ? { rotateX: -120, y: -20 }
                  : {}
              }
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Lock on lid */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-[#FFD700] rounded-md shadow-lg" />
            </motion.div>

            {/* Inner glow when opening */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-[#FFD700] via-[#FF9500] to-transparent"
              initial={{ opacity: 0 }}
              animate={phase === "open" || phase === "burst" || phase === "complete" ? { opacity: 1 } : {}}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Burst particles */}
          {(phase === "burst" || phase === "complete") && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full"
                  style={{
                    background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#FF9500' : '#0066FF'
                  }}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x: Math.cos(i * 30 * Math.PI / 180) * 200,
                    y: Math.sin(i * 30 * Math.PI / 180) * 200 - 100,
                    scale: 0,
                    opacity: 0
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              ))}
            </>
          )}
        </motion.div>

        {/* Text overlay */}
        <AnimatePresence>
          {phase === "complete" && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <div className="text-center">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  🎉
                </motion.div>
                <h2 className="text-3xl font-bold text-white">Unlocked!</h2>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
