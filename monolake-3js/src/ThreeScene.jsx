import React from "react";
import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ColorMapPath from './assets/geminimono.png';
import HeightMapPath from './assets/monomerge.png';
import Sidebar from './Sidebar'
import HoverableSphere from "./HoverableSphere";


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
  const [waterLevel, setWaterLevel] = React.useState(0.17);
  const [uiOpen, setUiOpen] = React.useState(true);

  return (
    <div className="w-screen h-screen relative">
      {/* === 3D Scene === */}
      <Canvas camera={{ position: [0, 6, 10], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <Terrain colorSrc={ColorMapPath} heightSrc={HeightMapPath} />
        <Water level={waterLevel} />

        <HoverableSphere position={[0, 1, 0]}/>


        <OrbitControls />

      </Canvas>

      <Sidebar
      isOpen={uiOpen}
      onClose={() => setUiOpen(false)}
      onOpen={() => setUiOpen(true)}
      waterLevel={waterLevel}
      onWaterLevelChange={setWaterLevel}
      />
    </div>

  );
}