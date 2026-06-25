import { Canvas } from "@react-three/fiber";
import { Html, Float, RoundedBox } from "@react-three/drei";
import type { ReactNode } from "react";

function TabletMesh({ children }: { children: ReactNode }) {
  return (
    <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.45}>
      <group rotation={[0.06, -0.18, 0.02]}>
        {/* 본체 - 알루미늄 */}
        <RoundedBox args={[2.55, 3.55, 0.11]} radius={0.16} smoothness={5}>
          <meshStandardMaterial color="#1c1c1e" metalness={0.88} roughness={0.12} />
        </RoundedBox>
        {/* 화면 테두리 */}
        <RoundedBox args={[2.25, 3.25, 0.018]} radius={0.08} smoothness={4} position={[0, 0, 0.065]}>
          <meshStandardMaterial color="#05050a" />
        </RoundedBox>
        {/* 전면 카메라 */}
        <mesh position={[0, 1.58, 0.068]}>
          <circleGeometry args={[0.055, 24]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        {/* 홈 버튼 */}
        <mesh position={[0, -1.68, 0.068]}>
          <circleGeometry args={[0.09, 32]} />
          <meshStandardMaterial color="#2a2a2c" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* 화면 콘텐츠 */}
        <Html
          transform
          position={[0, 0.02, 0.075]}
          distanceFactor={1.55}
          style={{ width: "178px", height: "264px", overflow: "hidden" }}
          zIndexRange={[10, 20]}
        >
          <div
            style={{
              width: "178px",
              height: "264px",
              overflow: "hidden",
              borderRadius: "3px",
              background: "white",
              userSelect: "none",
            }}
          >
            {children}
          </div>
        </Html>
      </group>
    </Float>
  );
}

export default function TabletScene({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full h-full">
      {/* 뒤쪽 글로우 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-44 h-60 rounded-full opacity-20 blur-3xl bg-blue-400" />
      </div>
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 46 }}
        className="w-full h-full"
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 5, 5]} intensity={1.6} />
        <pointLight position={[-2.5, 2, 4]} intensity={0.7} color="#3b82f6" />
        <pointLight position={[2, -1.5, 3]} intensity={0.35} color="#a78bfa" />
        <TabletMesh>{children}</TabletMesh>
      </Canvas>
    </div>
  );
}
