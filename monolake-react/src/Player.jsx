import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

export default function Player({ heightMapPath, targetPosition, models, onProximityChange }) {
  const meshRef = useRef();
  const [keys, setKeys] = useState({ ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false });
  const [heightData, setHeightData] = useState(null);

  // Load model and animations
  const { scene, animations } = useGLTF(import.meta.env.BASE_URL + 'Adventurer.glb');
  const { actions } = useAnimations(animations, meshRef);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setKeys((prev) => ({ ...prev, [e.key]: true }));
      }
    };
    const handleKeyUp = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setKeys((prev) => ({ ...prev, [e.key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!heightMapPath) return;

    const img = new Image();
    img.src = heightMapPath;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHeightData({
        data: imageData.data,
        width: canvas.width,
        height: canvas.height
      });
    };
  }, [heightMapPath]);

  // Teleport when targetPosition changes
  useEffect(() => {
    if (targetPosition && meshRef.current) {
      meshRef.current.position.x = targetPosition[0];
      meshRef.current.position.z = targetPosition[2];
    }
  }, [targetPosition]);

  // Animation logic
  useEffect(() => {
    const isMoving = Object.values(keys).some((k) => k);
    const runAction = actions['CharacterArmature|Run'];
    const idleAction = actions['CharacterArmature|Idle'] || actions['Idle'];

    if (isMoving) {
      if (runAction) {
        runAction.reset().fadeIn(0.2).play();
      }
      if (idleAction) idleAction.fadeOut(0.2);
    } else {
      if (runAction) runAction.fadeOut(0.2);
      if (idleAction) {
        idleAction.reset().fadeIn(0.2).play();
      }
    }

    return () => { }
  }, [keys, actions]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const speed = 5;
    const moveDistance = speed * delta;
    const mapSize = 10;
    const halfMap = mapSize / 2;

    let newX = meshRef.current.position.x;
    let newZ = meshRef.current.position.z;

    let moveX = 0;
    let moveZ = 0;

    if (keys.ArrowUp) moveZ -= 1;
    if (keys.ArrowDown) moveZ += 1;
    if (keys.ArrowLeft) moveX -= 1;
    if (keys.ArrowRight) moveX += 1;

    // Normalize diagonal movement
    if (moveX !== 0 || moveZ !== 0) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= length;
      moveZ /= length;

      newX += moveX * moveDistance;
      newZ += moveZ * moveDistance;

      // Rotate character to face movement direction
      const angle = Math.atan2(moveX, moveZ);
      meshRef.current.rotation.y = angle;
    }

    // Clamp to map boundaries
    newX = Math.max(-halfMap, Math.min(halfMap, newX));
    newZ = Math.max(-halfMap, Math.min(halfMap, newZ));

    meshRef.current.position.x = newX;
    meshRef.current.position.z = newZ;

    // Heightmap following
    if (heightData) {
      const u = (newX + halfMap) / mapSize;
      const v = (newZ + halfMap) / mapSize;

      const px = Math.floor(u * (heightData.width - 1));
      const py = Math.floor(v * (heightData.height - 1));

      if (px >= 0 && px < heightData.width && py >= 0 && py < heightData.height) {
        const index = (py * heightData.width + px) * 4;
        const r = heightData.data[index];
        const displacementScale = 0.5;
        const terrainHeight = (r / 255) * displacementScale;
        meshRef.current.position.y = terrainHeight;
      }
    }

    // Proximity check
    if (models && onProximityChange) {
      let closestKey = null;
      let minDistance = 3; // Threshold distance

      const playerPos = meshRef.current.position;

      for (const [key, config] of Object.entries(models)) {
        const modelPos = new THREE.Vector3(...config.position);
        const distance = playerPos.distanceTo(modelPos);

        if (distance < minDistance) {
          closestKey = key;
          minDistance = distance;
        }
      }

      onProximityChange(closestKey);
    }
  });

  return (
    <group ref={meshRef} position={[0, 0.5, 0]}>
      <primitive object={scene} scale={0.5} />
    </group>
  );
}
