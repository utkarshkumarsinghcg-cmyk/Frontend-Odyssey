import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural Fish School using InstancedMesh
export function FishSchool({ count = 50, position = [0, 0, 0] }) {
  const meshRef = useRef();
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Random positions, phases, and rotations
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 20;
        const speed = 0.5 + Math.random();
        const offset = Math.random() * Math.PI * 2;
        temp.push({ x, y, z, speed, offset });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    particles.forEach((p, i) => {
      // Swimming motion logic
      const swimX = p.x + Math.sin(time * p.speed + p.offset) * 2;
      const swimY = p.y + Math.cos(time * p.speed * 0.5 + p.offset) * 0.5;
      
      dummy.position.set(swimX, swimY, p.z);
      // Wiggle effect
      dummy.rotation.y = Math.sin(time * p.speed * 2) * 0.2;
      dummy.updateMatrix();
      
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} position={position}>
      <coneGeometry args={[0.2, 0.8, 4]} />
      <meshStandardMaterial color="#c2ebff" />
    </instancedMesh>
  );
}

// Procedural Glowing Jellyfish
export function Jellyfish({ position = [0,0,0], scale = 1, color = "#00f0ff" }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Pulsating motion
    const scaleAnim = 1 + Math.sin(time * 2) * 0.1;
    groupRef.current.scale.set(scaleAnim * scale, scaleAnim * scale, scaleAnim * scale);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Bell of the jellyfish */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={0.5}
            transparent 
            opacity={0.6}
            roughness={0.1}
            transmission={0.9}
        />
      </mesh>
      
      {/* Tentacles */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[
            Math.sin((i / 6) * Math.PI * 2) * 0.5,
            0,
            Math.cos((i / 6) * Math.PI * 2) * 0.5
        ]}>
          <cylinderGeometry args={[0.05, 0.01, 3, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      ))}
      {/* Internal Glow light component */}
      <pointLight color={color} intensity={2} distance={10} position={[0, 0.5, 0]} />
    </group>
  );
}

// Deep sea creature (e.g., Anglerfish essence)
export function BioluminescentCreature({ position, color, scale = 1 }) {
    const lightRef = useRef();
    
    useFrame((state) => {
        // Flicker effect for realism
        lightRef.current.intensity = 2 + Math.sin(state.clock.getElapsedTime() * 5) * 1;
    });

    return (
        <group position={position} scale={scale}>
            {/* Dark Body */}
            <mesh>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshStandardMaterial color="#050505" roughness={0.9} />
            </mesh>
            {/* Lure/Glow */}
            <mesh position={[0, 1, 2]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color={color} />
                <pointLight ref={lightRef} color={color} distance={15} decay={2} />
            </mesh>
        </group>
    );
}
