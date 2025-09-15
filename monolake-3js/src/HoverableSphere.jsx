import React, { useState, useRef } from 'react';
import { Html } from '@react-three/drei';

const HoverableSphere = ({ position = [2, 1, 0] }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  return (
    <group>
      {/* 3D Sphere */}
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial 
          color={hovered ? "#60a5fa" : "#3b82f6"}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* HTML Tooltip */}
      {hovered && (
        <Html
          position={[position[0], position[1] + 1, position[2]]}
          center
          distanceFactor={10}
          occlude={false}
        >
          <div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl pointer-events-none">
            <div className="text-sm font-medium whitespace-nowrap">Interactive Sphere</div>
            <div className="text-xs text-gray-300 mt-1 whitespace-nowrap">
              Click and drag to explore
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

export default HoverableSphere;