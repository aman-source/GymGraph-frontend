import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Check if device is mobile/touch
const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Rank sprite component using canvas texture
function RankSprite({ rank, position }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 256, 256);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 120px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`#${rank}`, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [rank]);

  return (
    <sprite position={position} scale={[1.2, 1.2, 1]}>
      <spriteMaterial map={texture} transparent />
    </sprite>
  );
}

// Podium shader
const podiumVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const podiumFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform vec3 baseColor;
  uniform vec3 lightPosition;
  uniform float time;

  void main() {
    vec3 lightDir = normalize(lightPosition - vPosition);
    vec3 viewDir = normalize(cameraPosition - vPosition);
    vec3 halfDir = normalize(lightDir + viewDir);

    float diff = max(dot(vNormal, lightDir), 0.0);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 32.0);
    float shine = sin(vPosition.y * 5.0 + time) * 0.2 + 0.8;

    vec3 color = baseColor * (0.3 + diff * 0.7) * shine;
    color += spec * 0.8;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function Podium({ position, height, color, rank }) {
  const meshRef = useRef();
  const baseY = height / 2;

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: podiumVertexShader,
    fragmentShader: podiumFragmentShader,
    uniforms: {
      baseColor: { value: color },
      lightPosition: { value: new THREE.Vector3(0, 8, 5) },
      time: { value: 0 }
    }
  }), [color]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    material.uniforms.time.value = time;

    if (meshRef.current) {
      if (rank === 1) {
        meshRef.current.position.y = baseY + Math.sin(time * 2) * 0.1;
      }
      meshRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;
    }
  });

  return (
    <group position={[position, 0, 0]}>
      <mesh ref={meshRef} position={[0, baseY, 0]} material={material}>
        <boxGeometry args={[1.5, height, 1.5]} />
      </mesh>

      <lineSegments position={[0, baseY, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.5, height, 1.5)]} />
        <lineBasicMaterial color={color} transparent opacity={0.8} />
      </lineSegments>

      <RankSprite rank={rank} position={[0, height + 0.6, 0]} />

      <mesh position={[0, height + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function SpotlightBeam({ position, color, intensity }) {
  const ref = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.intensity = intensity + Math.sin(time * 3) * 0.5;
    }
  });

  return (
    <spotLight
      ref={ref}
      position={[position, 8, 3]}
      angle={Math.PI / 8}
      penumbra={0.5}
      intensity={intensity}
      color={color}
    />
  );
}

function Particles() {
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = Math.random() * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = time * 0.05;
      const posArray = ref.current.geometry.attributes.position.array;
      for (let i = 0; i < 100; i++) {
        posArray[i * 3 + 1] += Math.sin(time + i) * 0.002;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={100}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={0x00D4AA}
        size={0.05}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({ interaction }) {
  const { camera } = useThree();
  const groupRef = useRef();

  const podiums = [
    { position: 0, height: 2.5, color: new THREE.Color(0x0066FF), rank: 1 },
    { position: -2.5, height: 1.8, color: new THREE.Color(0x00D4AA), rank: 2 },
    { position: 2.5, height: 1.3, color: new THREE.Color(0x4488FF), rank: 3 }
  ];

  useFrame(() => {
    camera.position.x = interaction.x * 3;
    camera.position.y = 3.5 + interaction.y * 1.5;
    camera.lookAt(0, 1, 0);

    if (groupRef.current) {
      groupRef.current.rotation.y += (interaction.x * 0.3 - groupRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 8, 5]} intensity={1.5} color={0xffffff} />

      {podiums.map((p, i) => (
        <SpotlightBeam key={i} position={p.position} color={p.color} intensity={2} />
      ))}

      <group ref={groupRef}>
        {podiums.map((p, i) => (
          <Podium key={i} {...p} />
        ))}

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial
            color={0x0066FF}
            transparent
            opacity={0.1}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      <Particles />
    </>
  );
}

export default function Leaderboard3D({ className = "" }) {
  const containerRef = useRef(null);
  const [interaction, setInteraction] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const autoRotationRef = useRef({ time: 0 });

  useEffect(() => {
    setIsMobile(isTouchDevice());
  }, []);

  // Mouse handler (desktop)
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || isMobile) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    setInteraction({ x, y });
  }, [isMobile]);

  // Touch handler (mobile)
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

    const x = (e.gamma || 0) / 45;
    const y = (e.beta || 0) / 45 - 1;

    setInteraction({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y))
    });
  }, [isMobile]);

  // Auto-animation for mobile
  useEffect(() => {
    if (!isMobile) return;

    let animationId;
    const animate = () => {
      autoRotationRef.current.time += 0.008;
      const t = autoRotationRef.current.time;

      setInteraction(prev => ({
        x: prev.x * 0.95 + Math.sin(t) * 0.4 * 0.05,
        y: prev.y * 0.95 + Math.cos(t * 0.7) * 0.2 * 0.05
      }));

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [isMobile]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Device orientation for mobile
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      const onFirstTouch = async () => {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch (e) {
          console.log('Device orientation permission denied');
        }
      };
      window.addEventListener('touchstart', onFirstTouch, { once: true });
    } else {
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
        camera={{ position: [0, 3.5, 8], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        onTouchMove={handleTouchMove}
      >
        <Scene interaction={interaction} />
      </Canvas>
    </div>
  );
}
