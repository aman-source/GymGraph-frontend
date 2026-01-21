import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// GymGraph Theme Colors
const COLORS = {
  primary: "#0066FF",
  primaryDark: "#0052CC",
  primaryDarker: "#003D99",
  gold: "#FFD700",
  goldDark: "#CC8800",
  orange: "#FF9500",
  orangeDark: "#EA580C",
  green: "#00C853",
  greenDark: "#00A843",
  wood: "#6B3E26",
  woodDark: "#4A2511",
};

// Coin Component with Physics - spreads freely without boundaries
function Coin({ index, isActive }) {
  const meshRef = useRef();
  const physics = useRef({
    vx: 0, vy: 0, vz: 0,
    rotX: 0, rotY: 0, rotZ: 0,
    gravity: -12,
    bounce: 0.4,
    friction: 0.92,
    grounded: false,
    started: false,
    opacity: 1,
  });

  useEffect(() => {
    if (isActive && meshRef.current) {
      // Initialize coin position inside chest
      meshRef.current.position.set(
        (Math.random() - 0.5) * 0.5,
        0.8 + Math.random() * 0.3,
        (Math.random() - 0.5) * 0.4
      );
      meshRef.current.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      // Set initial velocity - burst outward in all directions
      const p = physics.current;
      const angle = (Math.random() - 0.5) * Math.PI * 1.5; // Wider spread angle
      const power = 2 + Math.random() * 3;

      p.vx = Math.sin(angle) * power * 1.2;
      p.vy = 5 + Math.random() * 4; // Higher burst
      p.vz = Math.cos(angle) * power * 0.8 + 1.5;
      p.rotX = (Math.random() - 0.5) * 12;
      p.rotY = (Math.random() - 0.5) * 8;
      p.rotZ = (Math.random() - 0.5) * 12;
      p.started = false;
      p.grounded = false;
      p.opacity = 1;

      // Staggered start for cascade effect
      setTimeout(() => {
        p.started = true;
      }, index * 30 + Math.random() * 50);
    }
  }, [isActive, index]);

  useFrame((_, delta) => {
    if (!meshRef.current || !isActive) return;
    const p = physics.current;
    if (!p.started) return;

    const dt = Math.min(delta, 0.033);
    const floorY = -0.5; // Lower floor so coins can spread down

    // Apply gravity
    p.vy += p.gravity * dt;

    // Update position - no boundaries, free spread
    meshRef.current.position.x += p.vx * dt;
    meshRef.current.position.y += p.vy * dt;
    meshRef.current.position.z += p.vz * dt;

    // Update rotation
    meshRef.current.rotation.x += p.rotX * dt;
    meshRef.current.rotation.y += p.rotY * dt;
    meshRef.current.rotation.z += p.rotZ * dt;

    // Floor collision - let coins settle on ground
    if (meshRef.current.position.y < floorY) {
      meshRef.current.position.y = floorY;

      if (Math.abs(p.vy) > 0.8) {
        // Bounce
        p.vy = -p.vy * p.bounce;
        p.vx *= p.friction;
        p.vz *= p.friction;
        p.rotX *= 0.6;
        p.rotZ *= 0.6;
      } else {
        // Settle and slow down
        p.vy = 0;
        p.grounded = true;
        p.rotX *= 0.85;
        p.rotZ *= 0.85;
      }
    }

    // Friction when grounded - coins slow down naturally
    if (p.grounded) {
      p.vx *= 0.92;
      p.vz *= 0.92;
      p.rotY *= 0.95;
    }

    // Fade out coins that go too far (cleanup)
    const dist = Math.sqrt(
      meshRef.current.position.x ** 2 +
      meshRef.current.position.z ** 2
    );
    if (dist > 6) {
      p.opacity = Math.max(0, p.opacity - delta * 0.5);
      meshRef.current.material.opacity = p.opacity;
    }
  });

  if (!isActive) return null;

  return (
    <mesh ref={meshRef} castShadow>
      <cylinderGeometry args={[0.1, 0.1, 0.02, 20]} />
      <meshStandardMaterial
        color={COLORS.gold}
        roughness={0.2}
        metalness={0.9}
        emissive={COLORS.orange}
        emissiveIntensity={0.25}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

// Sparkle Particles
function SparkleParticles({ isActive }) {
  const pointsRef = useRef();
  const particleCount = 150;

  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = [];
    const col = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;

      vel.push({ vx: 0, vy: 0, vz: 0, life: 0, maxLife: 0 });

      // Gold/orange/white colors
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        col[i * 3] = 1; col[i * 3 + 1] = 0.84; col[i * 3 + 2] = 0;
      } else if (colorChoice < 0.8) {
        col[i * 3] = 1; col[i * 3 + 1] = 0.6; col[i * 3 + 2] = 0;
      } else {
        col[i * 3] = 1; col[i * 3 + 1] = 1; col[i * 3 + 2] = 0.8;
      }
    }

    return [pos, vel, col];
  }, []);

  const activeRef = useRef(false);

  useEffect(() => {
    if (isActive && pointsRef.current && !activeRef.current) {
      activeRef.current = true;
      const posAttr = pointsRef.current.geometry.attributes.position;

      for (let i = 0; i < particleCount; i++) {
        // Start from chest opening
        posAttr.array[i * 3] = (Math.random() - 0.5) * 0.8;
        posAttr.array[i * 3 + 1] = 0.8 + Math.random() * 0.3;
        posAttr.array[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

        // Burst outward and upward
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        const upSpeed = 3 + Math.random() * 5;

        velocities[i].vx = Math.cos(angle) * speed;
        velocities[i].vy = upSpeed;
        velocities[i].vz = Math.sin(angle) * speed * 0.7;
        velocities[i].life = 1 + Math.random() * 1;
        velocities[i].maxLife = velocities[i].life;
      }
      posAttr.needsUpdate = true;
    }
  }, [isActive, velocities]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !activeRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    let allDead = true;

    for (let i = 0; i < particleCount; i++) {
      const v = velocities[i];
      if (v.life <= 0) continue;

      allDead = false;
      v.life -= delta;

      posAttr.array[i * 3] += v.vx * delta;
      posAttr.array[i * 3 + 1] += v.vy * delta;
      posAttr.array[i * 3 + 2] += v.vz * delta;

      v.vy -= 3 * delta;
      v.vx *= 0.99;
      v.vz *= 0.99;
    }

    posAttr.needsUpdate = true;
    pointsRef.current.material.opacity = allDead ? 0 : 0.9;
  });

  if (!isActive) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Chest Model Component
function ChestModel({ isUnlocked, isAnimating, onAnimationComplete }) {
  const groupRef = useRef();
  const chestBaseRef = useRef();
  const lidPivotRef = useRef();
  const glowLightRef = useRef();
  const innerGlowRef = useRef();

  const [lidAngle, setLidAngle] = useState(0);
  const [coinsActive, setCoinsActive] = useState(false);
  const [sparklesActive, setSparklesActive] = useState(false);
  const animationRef = useRef({ startTime: null, phase: "idle" });

  // Materials
  const woodMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: COLORS.wood,
    roughness: 0.65,
    metalness: 0.05,
  }), []);

  const darkWoodMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: COLORS.woodDark,
    roughness: 0.75,
    metalness: 0.02,
  }), []);

  const goldMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: COLORS.gold,
    roughness: 0.2,
    metalness: 0.9,
    emissive: COLORS.goldDark,
    emissiveIntensity: 0.15,
  }), []);

  const lockMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0xDAA520,
    roughness: 0.25,
    metalness: 0.95,
  }), []);

  // Animation logic
  useEffect(() => {
    if (isAnimating) {
      animationRef.current = { startTime: Date.now(), phase: "shake" };
    }
  }, [isAnimating]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (isAnimating && animationRef.current.startTime) {
      const elapsed = (Date.now() - animationRef.current.startTime) / 1000;

      // Phase 1: Shake (0-1.2s)
      if (elapsed < 1.2) {
        const progress = elapsed / 1.2;
        const intensity = Math.sin(progress * Math.PI) * 0.025;
        const freq = 20 + progress * 30;

        if (chestBaseRef.current) {
          chestBaseRef.current.rotation.z = Math.sin(elapsed * freq) * intensity;
          chestBaseRef.current.position.x = Math.sin(elapsed * freq * 1.3) * intensity * 0.4;
          chestBaseRef.current.position.y = Math.abs(Math.sin(elapsed * freq * 0.7)) * intensity * 0.3;
        }
        if (lidPivotRef.current) {
          lidPivotRef.current.rotation.x = Math.sin(elapsed * freq * 0.8) * intensity * 0.5;
        }
        if (glowLightRef.current) {
          glowLightRef.current.intensity = 1 + progress * 2;
        }
      }
      // Phase 2: Open lid (1.2-1.8s)
      else if (elapsed < 1.8) {
        if (chestBaseRef.current) {
          chestBaseRef.current.rotation.z = 0;
          chestBaseRef.current.position.x = 0;
          chestBaseRef.current.position.y = 0;
        }

        const openProgress = (elapsed - 1.2) / 0.6;
        // Elastic easing
        const elastic = openProgress < 1
          ? 1 - Math.pow(2, -10 * openProgress) * Math.cos((openProgress * 10 - 0.75) * (2 * Math.PI) / 3)
          : 1;

        const targetAngle = -Math.PI * 0.75;
        setLidAngle(elastic * targetAngle);

        // Light burst at start of opening
        if (openProgress < 0.3 && glowLightRef.current && innerGlowRef.current) {
          innerGlowRef.current.intensity = 8 * (1 - openProgress / 0.3) + 2;
          glowLightRef.current.intensity = 5 * (1 - openProgress / 0.3) + 1.5;
        }
      }
      // Phase 3: Particles and coins (1.8s+)
      else if (elapsed >= 1.8 && animationRef.current.phase !== "particles") {
        animationRef.current.phase = "particles";
        setSparklesActive(true);
        setTimeout(() => setCoinsActive(true), 200);
      }
      // Phase 4: Complete (3.5s+)
      else if (elapsed >= 3.5 && animationRef.current.phase !== "complete") {
        animationRef.current.phase = "complete";
        if (onAnimationComplete) onAnimationComplete();
      }
    }
    // Idle floating animation
    else if (!isUnlocked && chestBaseRef.current && lidPivotRef.current) {
      chestBaseRef.current.position.y = Math.sin(time * 1.8) * 0.06;
      chestBaseRef.current.rotation.y = Math.sin(time * 0.7) * 0.06;
      lidPivotRef.current.position.y = 1.2 + Math.sin(time * 1.8) * 0.06;

      if (glowLightRef.current) {
        glowLightRef.current.intensity = 0.8 + Math.sin(time * 2.5) * 0.4;
      }
    }
    // Unlocked state - slightly open
    else if (isUnlocked && !isAnimating) {
      setLidAngle(-Math.PI * 0.25);
      if (innerGlowRef.current) innerGlowRef.current.intensity = 2;
    }
  });

  // Generate coins
  const coinIndices = useMemo(() => Array.from({ length: 40 }, (_, i) => i), []);

  return (
    <group ref={groupRef}>
      {/* Chest Base */}
      <group ref={chestBaseRef}>
        {/* Main body */}
        <mesh position={[0, 0.6, 0]} material={woodMaterial} castShadow receiveShadow>
          <boxGeometry args={[2.4, 1.2, 1.5]} />
        </mesh>

        {/* Front/back dark panels */}
        {[0.78, -0.78].map((z, i) => (
          <mesh key={`panel-${i}`} position={[0, 0.6, z]} material={darkWoodMaterial}>
            <boxGeometry args={[1.8, 0.9, 0.08]} />
          </mesh>
        ))}

        {/* Side panels */}
        {[-1.18, 1.18].map((x, i) => (
          <mesh key={`side-${i}`} position={[x, 0.6, 0]} material={darkWoodMaterial}>
            <boxGeometry args={[0.08, 0.9, 1.1]} />
          </mesh>
        ))}

        {/* Gold horizontal bands */}
        {[0.08, 1.12].map((y, i) => (
          <mesh key={`band-${i}`} position={[0, y, 0]} material={goldMaterial}>
            <boxGeometry args={[2.5, 0.12, 1.6]} />
          </mesh>
        ))}

        {/* Gold corners */}
        {[[-1.15, 0.6, 0.7], [1.15, 0.6, 0.7], [-1.15, 0.6, -0.7], [1.15, 0.6, -0.7]].map((pos, i) => (
          <mesh key={`corner-${i}`} position={pos} material={goldMaterial}>
            <boxGeometry args={[0.14, 1.3, 0.14]} />
          </mesh>
        ))}

        {/* Corner caps */}
        {[
          [-1.15, 1.22, 0.7], [1.15, 1.22, 0.7], [-1.15, 1.22, -0.7], [1.15, 1.22, -0.7],
          [-1.15, 0.08, 0.7], [1.15, 0.08, 0.7], [-1.15, 0.08, -0.7], [1.15, 0.08, -0.7]
        ].map((pos, i) => (
          <mesh key={`cap-${i}`} position={pos} material={goldMaterial}>
            <sphereGeometry args={[0.1, 16, 16]} />
          </mesh>
        ))}

        {/* Lock plate */}
        <mesh position={[0, 0.9, 0.83]} material={lockMaterial}>
          <boxGeometry args={[0.5, 0.65, 0.15]} />
        </mesh>

        {/* Lock detail */}
        <mesh position={[0, 0.92, 0.92]} material={darkWoodMaterial}>
          <boxGeometry args={[0.35, 0.45, 0.05]} />
        </mesh>

        {/* Keyhole */}
        <mesh position={[0, 0.95, 0.96]}>
          <circleGeometry args={[0.07, 16]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0, 0.85, 0.96]}>
          <planeGeometry args={[0.04, 0.12]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>

        {/* Lock ring */}
        <mesh position={[0, 0.62, 0.9]} rotation={[Math.PI / 2, 0, 0]} material={lockMaterial}>
          <torusGeometry args={[0.1, 0.025, 12, 24]} />
        </mesh>
      </group>

      {/* Lid Pivot */}
      <group ref={lidPivotRef} position={[0, 1.2, -0.75]} rotation={[lidAngle, 0, 0]}>
        {/* Lid body - curved shape approximation */}
        <mesh position={[0, 0.35, 0.75]} material={woodMaterial} castShadow>
          <boxGeometry args={[2.4, 0.7, 1.5]} />
        </mesh>

        {/* Lid curve top */}
        <mesh position={[0, 0.75, 0.75]} rotation={[0, 0, Math.PI / 2]} material={woodMaterial} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 2.4, 16, 1, false, 0, Math.PI]} />
        </mesh>

        {/* Lid gold band */}
        <mesh position={[0, 0.02, 0.75]} material={goldMaterial}>
          <boxGeometry args={[2.5, 0.1, 1.6]} />
        </mesh>

        {/* Lid center band */}
        <mesh position={[0, 0.42, 0.75]} material={goldMaterial}>
          <boxGeometry args={[0.2, 0.65, 1.6]} />
        </mesh>

        {/* Lid front panel */}
        <mesh position={[0, 0.35, 1.53]} material={darkWoodMaterial}>
          <boxGeometry args={[1.8, 0.5, 0.08]} />
        </mesh>
      </group>

      {/* Lights */}
      <pointLight ref={glowLightRef} position={[0, 0.8, 0]} color={COLORS.orange} intensity={0.8} distance={6} />
      <pointLight ref={innerGlowRef} position={[0, 0.5, 0]} color={COLORS.gold} intensity={0} distance={4} />

      {/* Coins */}
      {coinIndices.map((i) => (
        <Coin key={i} index={i} isActive={coinsActive} />
      ))}

      {/* Sparkle Particles */}
      <SparkleParticles isActive={sparklesActive} />
    </group>
  );
}

// Main Chest3D Component
export default function Chest3D({
  isUnlocked = false,
  isAnimating = false,
  onAnimationComplete,
  showParticles = true,
  className = "",
}) {
  return (
    <div
      className={`w-full h-[300px] bg-transparent ${className}`}
      style={{ overflow: 'visible' }}
    >
      <Canvas
        camera={{ position: [0, 2.5, 6], fov: 55 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ overflow: 'visible', background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          {/* No fog - cleaner look */}

          {/* Lighting */}
          <ambientLight intensity={0.5} color={0x505070} />
          <directionalLight
            position={[3, 8, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={1}
            shadow-camera-far={25}
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-8}
            shadow-bias={-0.001}
          />
          <directionalLight position={[-4, 4, -3]} intensity={0.4} color={0x4a6fa5} />
          <directionalLight position={[0, 2, -5]} intensity={0.5} color={COLORS.orange} />

          {/* Extra light for coins */}
          <pointLight position={[0, 3, 2]} intensity={0.8} color={COLORS.gold} distance={10} />

          {/* Larger floor for coin shadows to spread */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[25, 25]} />
            <shadowMaterial opacity={0.3} />
          </mesh>

          {/* Chest */}
          <Float
            speed={isAnimating || isUnlocked ? 0 : 1.5}
            rotationIntensity={isAnimating || isUnlocked ? 0 : 0.1}
            floatIntensity={isAnimating || isUnlocked ? 0 : 0.2}
          >
            <ChestModel
              isUnlocked={isUnlocked}
              isAnimating={isAnimating}
              onAnimationComplete={onAnimationComplete}
            />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
