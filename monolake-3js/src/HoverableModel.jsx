import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function HoverableModel({ 
  modelPath,
  position = [0, 0, 0], 
  scale = 1, 
  onClick = () => {} }) 
{
  const modelRef = useRef();
  const groupRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);

  // Load the GLB model
  const { scene } = useGLTF(modelPath);

  // Pulse animation for glowing ring and floating model
  useFrame((_, delta) => {
    setPulsePhase(prev => prev + delta * 2);

    // Floating effect
    if (modelRef.current) {
      modelRef.current.position.y = Math.sin(pulsePhase) * 0.1;

      // Slight pulsing scale
      const baseScale = isHovered ? scale * 1.1 : scale;
      const pulseScale = 1 + Math.sin(pulsePhase * 1.5) * 0.05;
      modelRef.current.scale.setScalar(baseScale * pulseScale);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerEnter={() => {
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setIsHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* The 3d model */}
      <primitive ref={modelRef} object={scene} scale={isHovered ? scale * 1.1 : scale} />

      {/* Glowing pulsing circle under the model */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
        <ringGeometry args={[0.4, 0.5, 32]} />
        <meshBasicMaterial
          color={isHovered ? "#60a5fa" : "#3b82f6"}
          transparent
          opacity={isHovered ? 0.8 : 0.4 + Math.sin(pulsePhase * 3) * 0.2}
        />
      </mesh>
    </group>
  );
}

