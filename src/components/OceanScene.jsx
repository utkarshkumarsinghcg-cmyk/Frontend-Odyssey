import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, Sparkles, Image, Float } from '@react-three/drei';
import * as THREE from 'three';
const SCROLL_DISTANCE = 60; // Extend scroll distance to fit 5 pages mapped to 5 zones

export default function OceanScene() {
  const scroll = useScroll();
  const sceneRef = useRef();
  const { viewport } = useThree();

  // Dark colors for realistic lighting blending
  const surfaceColor = new THREE.Color('#3A8ECA');
  const twilightColor = new THREE.Color('#0F396B');
  const midnightColor = new THREE.Color('#010A16');
  const abyssalColor = new THREE.Color('#000000');

  const imageWidth = viewport.width;
  const imageHeight = viewport.height;
  useFrame((state) => {
    const p = scroll.offset; // 0 to 1
    
    // Smooth camera descent mapping to the 5 zones
    const targetY = -p * SCROLL_DISTANCE;
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);

    // Dynamic Fog & Background color to ensure realism
    let currentColor = surfaceColor.clone();
    if (p < 0.25) {
      currentColor.lerpColors(surfaceColor, twilightColor, p / 0.25);
    } else if (p < 0.5) {
      currentColor.lerpColors(twilightColor, midnightColor, (p - 0.25) / 0.25);
    } else {
      currentColor.lerpColors(midnightColor, abyssalColor, (p - 0.5) / 0.5);
    }
    
    state.scene.background = currentColor;
    if (state.scene.fog) {
      state.scene.fog.color.copy(currentColor);
      state.scene.fog.density = THREE.MathUtils.lerp(0.01, 0.12, p);
    }
  });

  return (
    <group ref={sceneRef}>
      
      {/* 
        Zone 1: Hero - Surface & Ship (Y = 0)
      */}
      <group position={[0, 0, -2]}>
        <Image 
          url="/images/surface.png" 
          scale={[imageWidth * 1.5, imageHeight * 1.5]}
          position={[0, 0, 0]}
          opacity={1}
          transparent={true}
        />
        <Sparkles count={200} scale={[imageWidth, imageHeight, 5]} size={3} color="#ffffff" opacity={0.6} speed={0.5} position={[0, -2, 1]} />
      </group>

      {/* 
        Zone 2: Introduction - Descending into the blue (Y = -15)
        No image here, just procedural particles/fog
      */}
      <group position={[0, -15, -2]}>
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
           <Sparkles count={500} scale={[imageWidth, imageHeight, 8]} size={2} color="#80d0ff" opacity={0.5} speed={0.8} />
        </Float>
      </group>

      {/* 
        Zone 3: Exploration - Twilight Predators / Sharks (Y = -30)
      */}
      <group position={[0, -30, -2]}>
        <Image 
          url="/images/shark.png" 
          scale={[imageWidth * 1.5, imageHeight * 1.5]}
          position={[0, 0, 0]}
          transparent={true}
        />
        <Sparkles count={300} scale={[imageWidth, imageHeight, 8]} size={4} color="#a0e0ff" opacity={0.4} speed={0.3} position={[0, 0, 1]} />
      </group>

      {/* 
        Zone 4: Insight - Midnight Zone (Y = -45)
      */}
      <group position={[0, -45, -2]}>
        <Float speed={0.5} rotationIntensity={0.2} floatIntensity={2}>
           <Sparkles count={100} scale={[imageWidth, imageHeight, 10]} size={6} color="#00ff88" opacity={0.3} speed={0.1} position={[0, 0, 1]} />
           <Sparkles count={50} scale={[imageWidth, imageHeight, 10]} size={8} color="#ff3366" opacity={0.3} speed={0.1} position={[0, 0, 1]} />
        </Float>
      </group>

      {/* 
        Zone 5: Conclusion - Abyssal, Whales, Submarine (Y = -60)
      */}
      <group position={[0, -60, -2]}>
        <Image 
          url="/images/whale.png" 
          scale={[imageWidth * 1.5, imageHeight * 1.5]}
          position={[0, 0, 0]}
          transparent={true}
        />
        <Sparkles count={150} scale={[imageWidth, imageHeight, 10]} size={6} color="#00ff88" opacity={0.5} speed={0.1} position={[0, 0, 1]} />
      </group>
      
    </group>
  );
}
