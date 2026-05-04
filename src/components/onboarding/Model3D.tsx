import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Bounds, Stage } from '@react-three/drei';
import * as THREE from 'three';

// Preload all onboarding models for fast first-paint
useGLTF.preload('/models/tank.glb');
useGLTF.preload('/models/helicopter.glb');
useGLTF.preload('/models/jet.glb');
useGLTF.preload('/models/kid.glb');

interface ModelProps {
  url: string;
  scale?: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
  spin?: 'rotor' | 'propeller' | 'none';
}

const SpinningModel: React.FC<ModelProps> = ({ url, scale = 1, rotation = [0, 0, 0], position = [0, 0, 0], spin = 'none' }) => {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null!);
  const cloned = React.useMemo(() => scene.clone(true), [scene]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    if (spin === 'rotor') ref.current.rotation.y += delta * 30; // helicopter blades feel
    if (spin === 'propeller') ref.current.rotation.z += delta * 25;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive ref={ref} object={cloned} />
    </group>
  );
};

interface Model3DViewProps {
  url: string;
  width: number;
  height: number;
  scale?: number;
  rotation?: [number, number, number];
  spin?: 'rotor' | 'propeller' | 'none';
  cameraPos?: [number, number, number];
  fit?: boolean;
}

/** Compact, transparent 3D viewer for use inside motion.div animations. */
export const Model3DView: React.FC<Model3DViewProps> = ({
  url,
  width,
  height,
  scale = 1,
  rotation = [0, 0, 0],
  spin = 'none',
  cameraPos = [0, 1.2, 4.5],
  fit = true,
}) => {
  return (
    <div style={{ width, height, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: cameraPos, fov: 35 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow={false} />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} />
        <Suspense fallback={null}>
          {fit ? (
            <Bounds fit clip observe margin={1.1}>
              <SpinningModel url={url} scale={scale} rotation={rotation} spin={spin} />
            </Bounds>
          ) : (
            <SpinningModel url={url} scale={scale} rotation={rotation} spin={spin} />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Model3DView;
