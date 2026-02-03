import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Custom shader for the energy orb
const orbVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float time;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const orbFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float time;
  uniform vec3 color1;
  uniform vec3 color2;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);

    float wave = sin(vPosition.y * 5.0 + time * 3.0) * 0.5 + 0.5;
    vec3 color = mix(color1, color2, wave);

    float glow = fresnel * 1.5;
    color += vec3(glow * 0.0, glow * 0.4, glow * 1.0);

    gl_FragColor = vec4(color, 0.9 + fresnel * 0.1);
  }
`;

const glowFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float time;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);

    gl_FragColor = vec4(0.0, 0.4, 1.0, fresnel * 0.4);
  }
`;

function Orb({ interaction }) {
  const orbRef = useRef();
  const glowRef = useRef();
  const particlesRef = useRef();
  const groupRef = useRef();

  const orbMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: orbVertexShader,
    fragmentShader: orbFragmentShader,
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color(0x0066FF) },
      color2: { value: new THREE.Color(0x00D4AA) }
    },
    transparent: true,
    side: THREE.DoubleSide
  }), []);

  const glowMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: orbVertexShader,
    fragmentShader: glowFragmentShader,
    uniforms: {
      time: { value: 0 }
    },
    transparent: true,
    side: THREE.BackSide
  }), []);

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 2 + Math.random() * 2.5;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    orbMaterial.uniforms.time.value = time;
    glowMaterial.uniforms.time.value = time;

    if (orbRef.current) {
      orbRef.current.rotation.y = time * 0.3;
      orbRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
      orbRef.current.position.x = interaction.x * 0.8;
      orbRef.current.position.y = interaction.y * 0.5;
    }

    if (glowRef.current) {
      glowRef.current.rotation.y = time * 0.2;
      glowRef.current.rotation.x = Math.cos(time * 0.25) * 0.2;
      glowRef.current.position.x = interaction.x * 0.8;
      glowRef.current.position.y = interaction.y * 0.5;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.15;
      particlesRef.current.rotation.x = interaction.y * 0.3;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y += (interaction.x * 0.5 - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-interaction.y * 0.3 - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={orbRef} material={orbMaterial}>
        <sphereGeometry args={[1.5, 64, 64]} />
      </mesh>

      <mesh ref={glowRef} material={glowMaterial}>
        <sphereGeometry args={[1.9, 32, 32]} />
      </mesh>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={300}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={0x0066FF}
          size={0.06}
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.7, 64]} />
        <meshBasicMaterial color={0x00D4AA} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <ringGeometry args={[1.8, 1.85, 64]} />
        <meshBasicMaterial color={0x0066FF} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Scene({ interaction }) {
  const { camera, size } = useThree();
  const groupRef = useRef();

  // Responsive scale based on screen width
  const scale = size.width < 640 ? 0.65 : size.width < 1024 ? 0.8 : 1;

  useFrame(() => {
    camera.position.x = interaction.x * 0.5;
    camera.position.y = interaction.y * 0.3;
    camera.lookAt(0, 0, 0);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color={0x0066FF} />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color={0x00D4AA} />
      <Orb interaction={interaction} />
    </group>
  );
}

// Check if device is mobile/touch
const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export default function EnergyOrb({ className = "" }) {
  const containerRef = useRef(null);
  const [interaction, setInteraction] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Smooth animation for auto-rotation on mobile
  const autoRotationRef = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    setIsMobile(isTouchDevice());
  }, []);

  // Mouse movement handler (desktop)
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || isMobile) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    setInteraction({ x, y });
  }, [isMobile]);

  // Touch movement handler (mobile)
  const handleTouchMove = useCallback((e) => {
    if (!containerRef.current) return;

    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

    setInteraction({ x, y });
  }, []);

  // Device orientation handler (mobile gyroscope)
  const handleOrientation = useCallback((e) => {
    if (!isMobile) return;

    const x = (e.gamma || 0) / 45; // Left/right tilt (-1 to 1)
    const y = (e.beta || 0) / 45 - 1; // Front/back tilt (-1 to 1)

    setInteraction({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y))
    });
  }, [isMobile]);

  // Auto-animation for mobile when not interacting
  useEffect(() => {
    if (!isMobile) return;

    let animationId;
    const animate = () => {
      autoRotationRef.current.time += 0.01;
      const t = autoRotationRef.current.time;

      // Gentle automatic movement when not touching
      setInteraction(prev => ({
        x: prev.x * 0.95 + Math.sin(t) * 0.3 * 0.05,
        y: prev.y * 0.95 + Math.cos(t * 0.7) * 0.2 * 0.05
      }));

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [isMobile]);

  useEffect(() => {
    // Desktop: mouse events
    window.addEventListener('mousemove', handleMouseMove);

    // Mobile: touch and device orientation
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Try to enable device orientation (requires user gesture on iOS)
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ requires permission
      const requestPermission = async () => {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch (e) {
          console.log('Device orientation permission denied');
        }
      };
      // Permission will be requested on first touch
      const onFirstTouch = () => {
        requestPermission();
        window.removeEventListener('touchstart', onFirstTouch);
      };
      window.addEventListener('touchstart', onFirstTouch, { once: true });
    } else {
      // Non-iOS devices
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [handleMouseMove, handleTouchMove, handleOrientation]);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        // Enable touch events on canvas
        onTouchMove={handleTouchMove}
      >
        <Scene interaction={interaction} />
      </Canvas>
    </div>
  );
}
