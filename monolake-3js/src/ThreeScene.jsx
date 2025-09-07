import React from "react";
import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Terrain({ colorSrc, heightSrc }) {
  const colorMap = useLoader(THREE.TextureLoader, colorSrc);
  const heightMap = useLoader(THREE.TextureLoader, heightSrc);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      {/* dense geometry for displacement */}
      <planeGeometry args={[10, 10, 256, 256]} />
      <meshStandardMaterial
        map={colorMap}                // image texture
        displacementMap={heightMap}   // heightmap
        displacementScale={0.5}         // exaggeration factor
      />
    </mesh>
  );
}

function Water({ level }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, level, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial
        color="skyblue"
        transparent
        opacity={0.5}
        depthWrite={false} // prevents water from "blocking" terrain behind
      />
    </mesh>
  );
}

export default function App() {
  const [waterLevel, setWaterLevel] = React.useState(0);

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 3D Scene */}
      <div style={{ flex: 1 }}>
        <Canvas camera={{ position: [0, 6, 10], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          <Terrain
            colorSrc="/assets/geminimono.png"
            heightSrc="/assets/monomerge.png"
          />

          <Water level={waterLevel} />

          <OrbitControls />
        </Canvas>
      </div>

      {/* UI */}
      <div style={{ padding: "10px", background: "#222", color: "#fff" }}>
        <label>
          Water Level: {waterLevel.toFixed(1)}
          <input
            type="range"
            min={-2}
            max={2}
            step={0.1}
            value={waterLevel}
            onChange={(e) => setWaterLevel(parseFloat(e.target.value))}
            style={{ width: "300px", marginLeft: "10px" }}
          />
        </label>
      </div>
    </div>
  );
}