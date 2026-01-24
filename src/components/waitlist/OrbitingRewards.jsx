import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Reward items configuration
const REWARDS = [
  {
    id: "tshirt",
    image: "/tshirt.png",
    label: "Premium T-Shirt",
  },
  {
    id: "hoodie",
    image: "/hoodie.png",
    label: "Exclusive Hoodie",
  },
  {
    id: "sipper",
    image: "/sipper.png",
    label: "Gym Sipper",
  },
  {
    id: "sleeveless",
    image: "/sleeveless.png",
    label: "Sleeveless Tank",
  },
];

// Main orbiting rewards component - spotlight carousel style
export default function OrbitingRewards({ isActive = true, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const [positions, setPositions] = useState(
    REWARDS.map((_, i) => ({
      angle: i * 90, // 0, 90, 180, 270
    }))
  );
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isVisible) return;

    startTimeRef.current = Date.now();
    const orbitDuration = 10; // seconds for full rotation

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const degreesPerSecond = 360 / orbitDuration;

      const newPositions = REWARDS.map((_, i) => {
        const baseAngle = i * 90;
        const currentAngle = (baseAngle + elapsed * degreesPerSecond) % 360;
        return { angle: currentAngle };
      });

      setPositions(newPositions);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-visible ${className}`}
    >
      {REWARDS.map((reward, index) => {
        const { angle } = positions[index];
        const radians = (angle * Math.PI) / 180;

        // Orbit parameters
        const orbitRadiusX = 150; // horizontal radius
        const orbitRadiusY = 40;  // vertical radius (creates ellipse/tilt)

        // Calculate position on tilted elliptical orbit
        const x = Math.sin(radians) * orbitRadiusX;
        const y = Math.cos(radians) * orbitRadiusY - 20; // -20 to position above chest

        // Z-depth for layering (cos gives depth: 1 at front, -1 at back)
        const zDepth = Math.cos(radians);

        // Only show items that are in the front half of the orbit
        // Front = angle around 0° (top of orbit), Back = angle around 180°
        const isFront = zDepth > 0;

        // Smooth opacity: fully visible at front (0°), fade out towards sides
        // Using cosine for smooth transition
        const opacity = isFront ? Math.pow(zDepth, 0.5) : 0;

        // Scale: larger at front, smaller at back
        const scale = 0.7 + zDepth * 0.4;

        // Z-index based on depth
        const zIndex = Math.round(zDepth * 100) + 100;

        return (
          <motion.div
            key={reward.id}
            className="absolute bg-transparent"
            style={{
              left: "50%",
              top: "50%",
              zIndex: zIndex,
              background: 'transparent',
              backfaceVisibility: 'hidden',
            }}
            animate={{
              x: x,
              y: y,
              scale: scale,
              opacity: opacity,
            }}
            transition={{
              type: "tween",
              duration: 0.05,
              ease: "linear",
            }}
          >
            {/* Glow effect */}
            {opacity > 0.5 && (
              <div
                className="absolute -inset-4 rounded-full blur-2xl"
                style={{
                  background: `radial-gradient(circle, rgba(255, 215, 0, ${opacity * 0.4}) 0%, rgba(0, 102, 255, ${opacity * 0.2}) 50%, transparent 70%)`,
                }}
              />
            )}

            {/* Reward image */}
            <img
              src={reward.image}
              alt={reward.label}
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain -translate-x-1/2 -translate-y-1/2 bg-transparent"
              style={{
                filter: `drop-shadow(0 8px 24px rgba(0, 0, 0, ${opacity * 0.4}))`,
                background: 'none',
              }}
            />

          </motion.div>
        );
      })}
    </div>
  );
}
