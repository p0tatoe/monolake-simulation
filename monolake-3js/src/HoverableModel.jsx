// HoverableModel.jsx
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useA11y } from '@react-three/a11y';

export default function HoverableModel({
  modelPath,
  position = [0, 0, 0],
  scale = 1,
  isNearby = false,
}) {
  const modelRef = useRef();
  const groupRef = useRef();
  const [pulsePhase, setPulsePhase] = useState(0);
  const a11y = useA11y();

  const { scene } = useGLTF(modelPath);

  // Derived "active" state: either pointer hover, keyboard focus, or proximity
  const isActive = a11y.hover || a11y.focus || isNearby;

  // Animate floating + pulsing
  useFrame((_, delta) => {
    setPulsePhase(prev => prev + delta * 2);

    if (modelRef.current) {
      modelRef.current.position.y = Math.sin(pulsePhase) * 0.1;
      const baseScale = isActive ? scale * 1.5 : scale;

      const pulseScale = 1 + Math.sin(pulsePhase * 1.5) * 0.05;
      modelRef.current.scale.setScalar(baseScale * pulseScale);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
    >
      <primitive ref={modelRef} object={scene} scale={isActive ? scale * 1.5 : scale} />

      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
        <ringGeometry args={[0.4, 0.5, 32]} />
        <meshBasicMaterial
          color={isActive ? "#60a5fa" : "#3b82f6"}
          transparent
          opacity={isActive ? 0.8 : 0.4 + Math.sin(pulsePhase * 3) * 0.2}
        />
      </mesh>
    </group>
  );
}
