import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useMemo, type ReactNode } from "react";
import * as THREE from "three";
import type { Mesh, Group, Points } from "three";

// 화면 전체에서 마우스 위치를 -1~1로 추적 (오버레이 위에서도 동작하도록 window 레벨)
function useMouseRef() {
  const mouse = useRef({ x: 0, y: 0 });
  if (typeof window !== "undefined" && !(mouse as { _bound?: boolean })._bound) {
    (mouse as { _bound?: boolean })._bound = true;
    window.addEventListener("pointermove", (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    });
  }
  return mouse;
}

// 씬 전체를 마우스 방향으로 부드럽게 기울이고, 카메라도 살짝 패럴럭스
function Rig({
  mouse,
  children,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  children: ReactNode;
}) {
  const group = useRef<Group>(null);
  const { camera } = useThree();

  useFrame((_, delta) => {
    const m = mouse.current;
    const damp = 1 - Math.pow(0.0001, delta); // 프레임레이트 독립 감쇠

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, m.x * 0.35, damp);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -m.y * 0.22, damp);
    }
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, m.x * 0.8, damp);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -m.y * 0.8, damp);
    camera.lookAt(0, 0, 0);
  });

  return <group ref={group}>{children}</group>;
}

function GlossyShape({
  position,
  color,
  emissive,
  speed,
  scale,
  distort,
}: {
  position: [number, number, number];
  color: string;
  emissive: string;
  speed: number;
  scale: number;
  distort: number;
}) {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.25;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.18;
  });

  return (
    <Float speed={speed} rotationIntensity={0.6} floatIntensity={1.4}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.35}
          metalness={0.9}
          roughness={0.15}
          distort={distort}
          speed={1.6}
        />
      </mesh>
    </Float>
  );
}

// 마우스에 살짝 반응하는 파티클 필드
function ParticleField({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const ref = useRef<Points>(null);
  const count = 600;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.03;
    const damp = 1 - Math.pow(0.001, delta);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, mouse.current.y * 0.15, damp);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#bfdbfe" size={0.045} transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function HeroScene() {
  const mouse = useMouseRef();

  return (
    <div className="absolute inset-0">
      {/* Gradient base (폴백 + 깊이감) */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-600 to-accent-600" />

      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        className="absolute inset-0"
        style={{ position: "absolute" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} color="#ffffff" />
        <pointLight position={[-6, -3, 2]} intensity={2.2} color="#a78bfa" />
        <pointLight position={[6, 4, -2]} intensity={1.8} color="#60a5fa" />

        <Rig mouse={mouse}>
          <GlossyShape position={[-3, 1.4, -2]} color="#3b82f6" emissive="#1d4ed8" speed={1.4} scale={1.8} distort={0.45} />
          <GlossyShape position={[3, -1, -1]} color="#8b5cf6" emissive="#6d28d9" speed={1.1} scale={1.5} distort={0.5} />
          <GlossyShape position={[0, 2.4, -3]} color="#60a5fa" emissive="#2563eb" speed={0.9} scale={2} distort={0.35} />
          <GlossyShape position={[-2, -2, -2]} color="#a78bfa" emissive="#7c3aed" speed={0.7} scale={1.2} distort={0.55} />

          <ParticleField mouse={mouse} />
        </Rig>

        <EffectComposer>
          <Bloom intensity={0.85} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
