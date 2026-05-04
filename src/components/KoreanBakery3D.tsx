import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Bounds, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/korean_bakery.glb');

const BakeryModel: React.FC<{ autoRotate?: boolean }> = ({ autoRotate = true }) => {
  const { scene } = useGLTF('/models/korean_bakery.glb');
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (autoRotate && ref.current) ref.current.rotation.y += delta * 0.25;
  });
  return <primitive ref={ref} object={scene} />;
};

interface KoreanBakery3DProps {
  className?: string;
  height?: number | string;
  enableControls?: boolean;
}

const KoreanBakery3D: React.FC<KoreanBakery3DProps> = ({
  className = '',
  height = 380,
  enableControls = true,
}) => {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl ${className}`}
      style={{
        height,
        background: 'linear-gradient(135deg, hsla(340,80%,95%,0.6), hsla(35,95%,92%,0.5), hsla(220,85%,95%,0.5))',
        boxShadow: '0 25px 50px -12px hsla(340,75%,55%,0.15), 0 0 0 1px hsla(220,30%,90%,0.5)',
      }}
    >
      <Canvas
        camera={{ position: [4, 2.5, 5], fov: 38 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.75]}
        shadows
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 8, 4]} intensity={1.4} castShadow />
        <directionalLight position={[-4, 4, -4]} intensity={0.6} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.15}>
            <BakeryModel autoRotate={!enableControls ? true : false} />
          </Bounds>
          <ContactShadows position={[0, -1.4, 0]} opacity={0.35} scale={10} blur={2.4} />
          <Environment preset="city" />
        </Suspense>
        {enableControls && (
          <OrbitControls
            enablePan={false}
            enableZoom
            minDistance={3}
            maxDistance={10}
            autoRotate
            autoRotateSpeed={0.7}
            maxPolarAngle={Math.PI / 2.05}
          />
        )}
      </Canvas>
      {/* Soft gradient overlay edges */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/40" />
    </div>
  );
};

export default KoreanBakery3D;
