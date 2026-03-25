import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Image, Instance, Instances } from '@react-three/drei';
import * as THREE from 'three';
import '../index.css';

/* ---- SHADERS FOR WATER SURFACE ---- */
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
    float amplitude = 1.0;
    for(int i = 0; i < 4; i++) {
        elevation += snoise(vec3(pos * frequency + time * 0.2, time * 0.1)) * amplitude;
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return elevation * 0.2;
}

void main() {
    vUv = uv;
    vec3 pos = position;
    float elevation = getElevation(pos.xz, uTime);
    pos.y += elevation;
    vElevation = elevation;
    vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

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
    float dist = length(cameraPosition - vPosition);
    float fogFactor = smoothstep(uFogNear, uFogFar, dist);

    float mixRatio = smoothstep(-0.2, 0.2, vElevation);
    vec3 waterColor = mix(uDepthColor, uSurfaceColor, mixRatio);

    vec3 viewDir = normalize(cameraPosition - vPosition);
    vec3 sunDir = normalize(uSunPosition);
    vec3 halfVector = normalize(sunDir + viewDir);
    
    float specAmount = pow(max(dot(vNormal, halfVector), 0.0), 100.0);
    vec3 highlight = vec3(1.0, 0.9, 0.8) * specAmount * 1.5;

    float fresnel = dot(viewDir, vNormal);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 3.0);
    
    vec3 finalColor = waterColor + highlight + (vec3(0.5, 0.7, 0.9) * fresnel * 0.5);
    finalColor = mix(finalColor, uFogColor, fogFactor);

    gl_FragColor = vec4(finalColor, 0.85);
}
`;

// Water Surface
const WaterPlane = () => {
  const meshRef = useRef();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uDepthColor: { value: new THREE.Color('#012a44') }, 
    uSurfaceColor: { value: new THREE.Color('#1f70a9') }, 
    uSunPosition: { value: new THREE.Vector3(100, 50, -100) },
    uFogColor: { value: new THREE.Color('#011a2e') }, 
    uFogNear: { value: 10.0 },
    uFogFar: { value: 90.0 }
  }), []);

  useFrame((state) => {
    if (meshRef.current) meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[200, 200, 256, 256]} />
      <shaderMaterial 
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
};

// Procedural Plankton Particles (Instanced)
const PlanktonParticles = () => {
  const particleCount = 3000;
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Create randomized bases
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map(() => ({
      x: (Math.random() - 0.5) * 80,
      y: (Math.random() - 1.0) * 100, // Deep spread mapped to Y = 0 to -100
      z: (Math.random() - 0.5) * 60 - 15,
      speed: 0.1 + Math.random() * 0.4,
      offset: Math.random() * Math.PI * 2,
      scale: 0.1 + Math.random() * 0.3
    }));
  }, []);

  const texture = useMemo(() => new THREE.TextureLoader().load('/images/particle.png'), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      // Procedural drift
      const px = p.x + Math.sin(t * p.speed + p.offset) * 2.0;
      const py = p.y + Math.cos(t * p.speed * 0.8 + p.offset) * 1.5 + t * 0.2; // Slow rise
      const pz = p.z + Math.sin(t * p.speed * 0.5) * 1.0;
      
      dummy.position.set(px, py % 10 - 100 * (Math.abs(p.y)/100), pz); // Loop vertically
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, particleCount]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial 
        map={texture} 
        transparent={true} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={0.6}
        color="#88ddff"
      />
    </instancedMesh>
  );
};

// Procedural Fish Silhouette School
const FishSchool = () => {
    const groupRef = useRef();
    const fishTex = useMemo(() => new THREE.TextureLoader().load('/images/fish.png'), []);

    useFrame((state) => {
       const t = state.clock.elapsedTime;
       if (groupRef.current) {
           groupRef.current.children.forEach((fish, i) => {
               fish.position.z += Math.cos(t * 0.5 + i) * 0.04;
               fish.position.x += Math.sin(t * 0.3 + i) * 0.04;
               fish.position.y += Math.sin(t * 0.2 + i * 2) * 0.01;
           });
       }
    });
  
    return (
      <group ref={groupRef} position={[0, -25, -20]}>
        {[...Array(20)].map((_, i) => (
           <group 
             key={i} 
             position={[(Math.random()-0.5)*40, (Math.random()-0.5)*15, (Math.random()-0.5)*20]}
           >
             <sprite scale={[4, 2, 1]}>
               <spriteMaterial map={fishTex} transparent={true} opacity={0.8} blending={THREE.AdditiveBlending} color="#a0ffff" />
             </sprite>
           </group>
        ))}
      </group>
    );
}

// Master RIG controlling Scroll-Linked Journey
const EnvironmentRig = () => {
  const scroll = useScroll();
  const { camera, scene } = useThree();
  const lightRef = useRef();
  
  // Horizon/Fog Colors mapped by depth
  const surfaceColor = new THREE.Color('#3884b8');
  const midColor = new THREE.Color('#011a2e');
  const deepColor = new THREE.Color('#00050a');

  useFrame((state) => {
    const p = scroll.offset; // 0 to 1
    const t = state.clock.elapsedTime;

    // 1. Camera Dive & Float
    // p=0 -> y=2.0 (surface). p=1 -> y=-90 (abyss)
    const baseCameraY = THREE.MathUtils.lerp(2.0, -90, p);
    
    // Add floating wobble if near surface, steady deep down
    const wobbleIntensity = 1.0 - p;
    camera.position.y = baseCameraY + (Math.sin(t * 1.5) * 0.2 * wobbleIntensity);
    camera.position.x = Math.cos(t * 0.5) * 0.1 * wobbleIntensity + (state.pointer.x * 2.5); // Add Mouse Parallax
    camera.position.z = 5 + (state.pointer.y * 1.0); // Mild back/forth parallax
    camera.lookAt(camera.position.x * 0.5, baseCameraY - 2, 0);

    // 2. Dynamic Lighting & Fog Blending
    let envColor = surfaceColor.clone();
    if (p < 0.5) {
      envColor.lerpColors(surfaceColor, midColor, p * 2);
    } else {
      envColor.lerpColors(midColor, deepColor, (p - 0.5) * 2);
    }
    
    scene.background = envColor;
    if (scene.fog) scene.fog.color.copy(envColor);

    // Fade primary light as we dive
    if (lightRef.current) {
        lightRef.current.intensity = Math.max(0, 1.5 - (p * 2));
    }
  });

  return (
    <>
      <directionalLight ref={lightRef} position={[0, 50, -50]} intensity={1.5} color="#fff1e0" />
      <ambientLight intensity={0.2} />
      <fog attach="fog" args={['#3884b8', 5, 40]} />
    </>
  );
};

export default function HackathonJourney() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 60 }} dpr={[1, 2]}>
        
        {/* Core Control wraps the whole scene! */}
        <ScrollControls pages={5} damping={0.2}>
          
          <EnvironmentRig />

          <group>
             <WaterPlane />
             <PlanktonParticles />
             <FishSchool />

             {/* Background Layers anchored globally (Not attached to scroll! Camera moves PAST them) */}
             
             {/* SURFACE HERO */}
             <Image url="/images/hero_bg.png" scale={[90, 45]} position={[0, -5, -40]} transparent opacity={0.6} />
             
             {/* MID DEPTH */}
             <Image url="/images/mid_bg.png" scale={[100, 50]} position={[0, -35, -40]} transparent opacity={0.4} blending={THREE.AdditiveBlending} />
             
             {/* DEEP ABYSS */}
             <Image url="/images/deep_bg.png" scale={[120, 60]} position={[0, -75, -40]} transparent opacity={0.8} />

             {/* SUNKEN SHIP SILHOUETTE */}
             <Image url="/images/ship.png" scale={[50, 25]} position={[0, -90, -20]} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
          </group>

          {/* HTML UI OVERLAYS - Automatically syncs with scroll */}
          <Scroll html style={{ width: '100vw' }}>
            
            {/* Page 1: Hero */}
            <div className="hq-ui-container" style={{ top: '15vh' }}>
              <h1 className="glowing-title">Dive Into The Depths</h1>
              <p className="glass-panel">An interactive cinematic journey into the unknown.</p>
              <div className="scroll-hint-anim">Scroll Down ↓</div>
            </div>

            {/* Page 2: Twilight */}
            <div className="hq-ui-container" style={{ top: '130vh', marginLeft:'10vw' }}>
              <div className="glass-panel">
                 <h2>The Twilight Zone</h2>
                 <p>Sunlight rapidly fades. Plankton and glowing fish navigate the darkening blue.</p>
              </div>
            </div>

            {/* Page 3: Midnight */}
            <div className="hq-ui-container" style={{ top: '250vh', marginLeft:'50vw' }}>
              <div className="glass-panel dark-glass">
                 <h2>The Midnight Void</h2>
                 <p>Pressure immense. Complete darkness. Life here generates its own light.</p>
              </div>
            </div>

            {/* Page 4: Abyss */}
            <div className="hq-ui-container" style={{ top: '380vh', textAlign:'center', marginLeft:'25vw' }}>
               <h1 className="glowing-title abyss-mode">The Abyss</h1>
               <div className="glass-panel dark-glass">
                  <p>A forgotten world. Sunken silhouettes lost to the ocean floor.</p>
               </div>
            </div>
            
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
