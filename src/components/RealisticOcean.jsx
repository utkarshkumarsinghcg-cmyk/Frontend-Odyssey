import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sky, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
uniform float uTime;
varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

float getElevation(vec2 pos, float time) {
    float elevation = 0.0;
    float frequency = 0.5;
    float amplitude = 1.5;
    for(int i = 0; i < 4; i++) {
        elevation += snoise(vec3(pos * frequency + time * 0.2, time * 0.1)) * amplitude;
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return elevation * 0.15;
}

void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Calculate elevation
    float elevation = getElevation(pos.xz, uTime);
    pos.y += elevation;
    vElevation = elevation;
    vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

    // Calculate normal using neighbors
    float d = 0.1;
    vec3 pA = vec3(position.x + d, position.y, position.z);
    vec3 pB = vec3(position.x, position.y, position.z + d);
    pA.y += getElevation(pA.xz, uTime);
    pB.y += getElevation(pB.xz, uTime);
    
    vec3 tangentX = normalize(pA - pos);
    vec3 tangentZ = normalize(pB - pos);
    vNormal = normalize(cross(tangentZ, tangentX));

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform vec3 uSunPosition;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;

varying vec2 vUv;
varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    // Distance from camera to fragment for Horizon Soft Fog
    float dist = length(cameraPosition - vPosition);
    float fogFactor = smoothstep(uFogNear, uFogFar, dist);

    // Color gradient based on wave height
    float mixRatio = smoothstep(-0.2, 0.2, vElevation);
    vec3 waterColor = mix(uDepthColor, uSurfaceColor, mixRatio);

    // Sunlight reflection (Specular)
    vec3 viewDir = normalize(cameraPosition - vPosition);
    vec3 sunDir = normalize(uSunPosition);
    vec3 halfVector = normalize(sunDir + viewDir);
    
    // Blinn-Phong specular
    float specAmount = pow(max(dot(vNormal, halfVector), 0.0), 100.0);
    vec3 highlight = vec3(1.0, 0.9, 0.8) * specAmount * 1.5; // Warm sun reflection

    // Fresnel effect
    float fresnel = dot(viewDir, vNormal);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 3.0);
    
    vec3 finalColor = waterColor + highlight + (vec3(0.5, 0.7, 0.9) * fresnel * 0.5);
    finalColor = mix(finalColor, uFogColor, fogFactor);

    // Make water deeply transparent so particles and fish below are visible
    gl_FragColor = vec4(finalColor, 0.88);
}
`;

const particleVertex = `
uniform float uTime;
attribute vec3 customOffset;
varying float vDistance;
void main() {
    // Drift movement using sine waves
    vec3 pos = position + customOffset;
    pos.x += sin(uTime * 0.2 + customOffset.y) * 2.0;
    pos.y += cos(uTime * 0.15 + customOffset.x) * 1.5;
    pos.z += sin(uTime * 0.1 + customOffset.z) * 2.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDistance = -mvPosition.z; // Depth away from camera
    gl_Position = projectionMatrix * mvPosition;
    
    // Depth-based size logic (closer particles appear much sharper and larger)
    gl_PointSize = (40.0 / vDistance);
}
`;

const particleFragment = `
varying float vDistance;
void main() {
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    if (r > 1.0) discard;

    // Depth-based blur: Adjust edge hardness based on depth
    float edgeHardness = mix(0.8, -0.5, clamp(vDistance / 25.0, 0.0, 1.0));
    float alpha = smoothstep(1.0, edgeHardness, r);
    
    // Fade out far away to simulate water thickness visibility loss
    float depthFade = smoothstep(35.0, 5.0, vDistance);
    
    gl_FragColor = vec4(0.4, 0.8, 1.0, alpha * depthFade * 0.8);
}
`;

function ParticleSystem() {
  const pointsRef = useRef();
  
  const particleCount = 2000;
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        // Spread particles out in a wide 3D underwater volume
        arr[i * 3 + 0] = (Math.random() - 0.5) * 80;
        arr[i * 3 + 1] = (Math.random() - 1.0) * 30 - 2; // Under the water (y < 0)
        arr[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return arr;
  }, []);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
      if (pointsRef.current) {
          pointsRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
      }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={new Float32Array(particleCount * 3)} itemSize={3} />
        <bufferAttribute attach="attributes-customOffset" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial 
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Subtle animated fish system using Drei Instances
function FishSchool() {
  const fishCount = 15;
  const groupRef = useRef();

  useFrame((state) => {
     const t = state.clock.elapsedTime;
     if (groupRef.current) {
         groupRef.current.children.forEach((fish, i) => {
             // Subtle swimming math
             fish.position.z += Math.cos(t * 0.5 + i) * 0.02;
             fish.position.x += Math.sin(t * 0.3 + i) * 0.02;
             fish.position.y += Math.sin(t * 0.2 + i * 2) * 0.005;
             
             // Gentle rotation wiggle to mimic fish tails/bodies
             fish.rotation.y = Math.sin(t * 1.5 + i) * 0.1;
         });
     }
  });

  return (
    <group ref={groupRef} position={[0, -5, -15]}>
      {[...Array(fishCount)].map((_, i) => (
         <group 
           key={i} 
           position={[(Math.random()-0.5)*30, (Math.random()-0.5)*10, (Math.random()-0.5)*20]}
           rotation={[0, Math.random()*Math.PI*2, 0]}
         >
           {/* Abstract minimalist fish geometry */}
           <mesh position={[0, 0, -0.2]} rotation={[Math.PI/2, 0, 0]}>
             <coneGeometry args={[0.2, 0.8, 4]} />
             <meshStandardMaterial color="#3080ff" emissive="#051535" opacity={0.8} transparent />
           </mesh>
         </group>
      ))}
    </group>
  );
}

const WaterPlane = () => {
  const meshRef = useRef();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uDepthColor: { value: new THREE.Color('#0b2a54') }, 
    uSurfaceColor: { value: new THREE.Color('#3884b8') }, 
    uSunPosition: { value: new THREE.Vector3(100, 50, -100) },
    uFogColor: { value: new THREE.Color('#94bcd1') }, 
    uFogNear: { value: 10.0 },
    uFogFar: { value: 90.0 }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[200, 200, 256, 256]} />
      <shaderMaterial 
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true} // Allows us to see the underwater elements!
      />
    </mesh>
  );
};

const CameraController = () => {
    useFrame((state) => {
        const t = state.clock.elapsedTime;
        // Camera slightly floats ABOVE water simulating a gentle boat ride
        state.camera.position.y = 1.0 + Math.sin(t * 1.2) * 0.15;
        state.camera.position.x = Math.cos(t * 0.4) * 0.1;
        state.camera.lookAt(0, -2, -20); // Looking slightly downward into the depths
    });
    return null;
}

export default function RealisticOcean() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#94bcd1', overflow:'hidden' }}>
      <Canvas camera={{ position: [0, 1.0, 5], fov: 60 }}>
        <fog attach="fog" args={['#94bcd1', 10, 80]} />
        <Sky sunPosition={[100, 50, -100]} turbidity={0.1} rayleigh={0.5} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[100, 50, -100]} intensity={1.5} color="#fff1e0" />

        <WaterPlane />
        <ParticleSystem />
        <FishSchool />
        
        <CameraController />
      </Canvas>
    </div>
  );
}
