import React, { useState } from 'react';
import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import ColorMapPath from './assets/geminimono.png';
import HeightMapPath from './assets/monomerge.png';
import Sidebar from './Sidebar'
import HoverableModel from "./HoverableModel";
import TooltipCard from "./TooltipCard";
import InstructionsOverlay from './InstructionsOverlay';
import CitationsModal from './CitationsModal';

const MODELS = {
  grebe: {
    modelPath: import.meta.env.BASE_URL + 'blackduck.glb',
    position: [0.5, 0.5, -3],
    scale: 1.5,
    data: {
      title: "Eared Grebe",
      description: `If it looks like a duck... it might just be an eared grebe instead.
        Around 1-2 million grebes stop at Mono Lake in the fall,
        making them the lake's most common bird. They feed on the brine shrimp
        and alkali flies before migrating south for the winter.`,
      image: import.meta.env.BASE_URL + "/grebe.jpg",
      imageAlt: "Eared Grebe swimming"
    }
  },
  nest: {
    modelPath: import.meta.env.BASE_URL + 'Birds nest.glb',
    position: [-0.5, 1, -1.1],
    scale: 0.4,
    data: {
      title: "California Gull Nest",
      description: `
      Mono Lake is home to one of the largest nesting grounds for California Gulls.
      Around 50,000 California Gulls nest at Mono Lake each summer.
      Many Gulls choose to nest near Negit Island, the small triangular island below.
      Try lowering the water level to see what happens to these nests.
      `,
      image: import.meta.env.BASE_URL + "/gulls.jpg",
      imageAlt: "A flock of seagulls nesting at Mono Lake"
    }
  },
  sandpiper: {
    modelPath: import.meta.env.BASE_URL + 'Cactus wren.glb',
    position: [2.2, 0.5, 1],
    scale: 0.5,
    data: {
      title: "Wilson's Phalarope",
      description: `The Wilson's phalarope is a small migratory bird that feeds on brine shrimp and alkali flies.
      These birds like to swim in small circles, creating whirlpools that suck in their prey. 
      Late in the summer, tens of thousands of Wilson's phalaropes arrive at Mono Lake to feed.
      These birds will migrate 3000 miles to South America for the winter.
      Since these birds do not stop for breaks, the long journey only takes three days. 
      `,
      image: import.meta.env.BASE_URL + "/phalarope.jpg",
      imageAlt: "Phalarope swimming"
    }
  },
  fly: {
    modelPath: import.meta.env.BASE_URL + 'Fly.glb',
    position: [2.6, 0.5, -2.6],
    scale: 0.1,
    data: {
      title: "Alkali Fly",
      description: `
        Alkali Flies dive underwater to feed on algae and to lay eggs.  
        These flies can dive without getting wet on account of thin hairs 
        that trap a layer of air around them when they dive.
        Alkali flies hatch and pupate underwater, only emerging when they begin their adult lifcycle.
        In the summer, these alkali flies cover the Mono Lake shoreline like a layer of grime. 
        The massive population of alkali flies is a critical food source that draws millions of birds to Mono Lake. 
      `,
      image: import.meta.env.BASE_URL + "/alkalifly.jpg",
      imageAlt: "An Alkali Fly diving in an air bubble"
    }
  },
  osprey: {
    modelPath: import.meta.env.BASE_URL + 'Osprey.glb',
    position: [0, 1, 4],
    scale: 0.075,
    data: {
      title: "Osprey",
      description: `The briny waters of Mono Lake are too salty for fish to survive.
      Despite having no food for ospreys, dozens of these birds nest in the tufa towers of Mono Lake,
      to protect their eggs from predators. They fly to nearby freshwater lakes to hunt for fish. 
      `,
      image: import.meta.env.BASE_URL + "/osprey.jpg",
      imageAlt: "Two ospreys nesting on a tufa tower"
    }
  },
  shrimp: {
    modelPath: import.meta.env.BASE_URL + 'shrimp.glb',
    position: [-2, 0.5, 0.4],
    scale: 0.01,
    data: {
      title: "Brine Shrimp",
      description: `
        Mono Lake is home to the brine shrimp species, Artemia monica, which is only found at Mono Lake. 
        Trillions of these small crustaceans inhabit the lake's open water,
        where they filter-feed on microscopic algae, forming the base of the lake's food web. 
        Changes in the lake's salinity reduce the shrimp's ability to grow and reproduce, placing the entire ecosystem at risk.
        `,
      image: import.meta.env.BASE_URL + "/brineshrimp.jpg",
      imageAlt: "A close up of a brine shrimp"
    }
  },
  coyote: {
    modelPath: import.meta.env.BASE_URL + 'Wolf.glb',
    position: [-0.5, 2, -1.1],
    scale: 0.5,
    data: {
      title: "Coyote",
      description: `when a land bridge appears, coyotes feast on gull eggs`,
      image: import.meta.env.BASE_URL + "/coyote.jpg",
      imageAlt: "Coyote walking along the shore of Mono Lake"
    }
  },

};

function Terrain({ colorSrc, heightSrc }) {
  const colorMap = useLoader(THREE.TextureLoader, colorSrc);
  const heightMap = useLoader(THREE.TextureLoader, heightSrc);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      {/* load in the map */}
      <planeGeometry args={[10, 10, 256, 256]} />
      <meshStandardMaterial
        map={colorMap}           
        displacementMap={heightMap}
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
        color="cadetblue"
        transparent
        opacity={0.8}
        depthWrite={false} // prevents water from "blocking" terrain behind
      />
    </mesh>
  );
}

export default function App() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [waterLevel, setWaterLevel] = React.useState(0.17);
  const [uiOpen, setUiOpen] = React.useState(true);
  const [showCitations, setShowCitations] = useState(false);
  const [instructionsDismissed, setInstructionsDismissed] = useState(false);

  const handleModelClick = (modelData) => {
    setSelectedModel(modelData);
  };

  return (
    <div className="w-screen h-screen relative">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 6, 10], fov: 45 }}>
        <Sky 
          distance={450000}
          inclination={0.7}
          azimuth={0.25}
          mieCoefficient={0.001}
          mieDirectionalG={0.8}
          rayleigh={10}
          turbidity={2}
        />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <Terrain colorSrc={ColorMapPath} heightSrc={HeightMapPath} />
        <Water level={waterLevel} />

        {/* Render all models dynamically */}
        {Object.entries(MODELS).map(([key, config]) => (
          <HoverableModel
            key={key}
            modelPath={config.modelPath}
            position={config.position}
            scale={config.scale}
            onClick={() => handleModelClick(config.data)}
          />
        ))}

        {!instructionsDismissed && (
          <InstructionsOverlay onDismiss={() => setInstructionsDismissed(true)} />
        )}

        <OrbitControls />

      </Canvas>

      {/* Tooltip */}
      {selectedModel && (
        <TooltipCard 
          data={selectedModel} 
          onClose={() => setSelectedModel(null)} 
        />
      )}

      <Sidebar
      isOpen={uiOpen}
      onClose={() => setUiOpen(false)}
      onOpen={() => setUiOpen(true)}
      waterLevel={waterLevel}
      onWaterLevelChange={setWaterLevel}
      onShowCitations={() => setShowCitations(true)}
      />

      {showCitations && (
        <CitationsModal onClose={() => setShowCitations(false)} />
      )}

    </div>

  );
}