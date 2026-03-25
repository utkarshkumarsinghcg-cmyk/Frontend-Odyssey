import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, Scroll } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// =========================================================
// SIMPLEX NOISE (embedded GLSL - no external deps)
// =========================================================
const SIMPLEX_GLSL = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.7928429-0.8537347*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

// =========================================================
// WATER SURFACE — custom vertex + fragment shader
// =========================================================
const waterVert = /* glsl */`
${SIMPLEX_GLSL}
uniform float uTime;
uniform float uDepth; // 0 = surface, 1 = abyss (from scroll)
varying vec3 vWorldPos;
varying vec3 vNormal;
varying float vElevation;

float getElevation(vec2 xz, float t){
  float e = 0.0;
  e += snoise(vec3(xz * 0.3, t * 0.4)) * 0.8;
  e += snoise(vec3(xz * 0.8, t * 0.6)) * 0.3;
  e += snoise(vec3(xz * 2.0, t * 1.0)) * 0.1;
  // Flatten waves as we go deeper (no waves in abyss)
  return e * (1.0 - uDepth * 0.95);
}

void main(){
  vec3 pos = position;
  float elev = getElevation(pos.xz, uTime);
  pos.y += elev;
  vElevation = elev;

  // Compute approximated normal from neighbors
  float d = 0.15;
  vec3 pA = vec3(position.x+d, getElevation(vec2(position.x+d, position.z), uTime), position.z);
  vec3 pB = vec3(position.x,   getElevation(vec2(position.x,   position.z+d), uTime), position.z+d);
  vNormal = normalize(cross(normalize(pB - pos), normalize(pA - pos)));

  vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
}`;

const waterFrag = /* glsl */`
uniform float uTime;
uniform float uDepth;
uniform vec3  uSunDir;
varying vec3  vWorldPos;
varying vec3  vNormal;
varying float vElevation;

// Depth-based color palette — no images needed!
vec3 depthColor(float depth){
  // 0=surface (bright), 1=abyss (black)
  vec3 surface   = vec3(0.10, 0.62, 0.88); // bright cyan
  vec3 midWater  = vec3(0.04, 0.28, 0.56); // ocean blue
  vec3 twilight  = vec3(0.02, 0.10, 0.26); // deep navy
  vec3 midnight  = vec3(0.01, 0.03, 0.10); // near black
  vec3 abyss     = vec3(0.00, 0.00, 0.02); // void

  if(depth < 0.25) return mix(surface,  midWater, depth/0.25);
  if(depth < 0.5 ) return mix(midWater, twilight, (depth-0.25)/0.25);
  if(depth < 0.75) return mix(twilight, midnight, (depth-0.5)/0.25);
  return mix(midnight, abyss, (depth-0.75)/0.25);
}

void main(){
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  vec3 base = depthColor(uDepth);

  // Wave crest brightening — peaks catch more light
  float crestFactor = smoothstep(-0.3, 0.6, vElevation);
  base = mix(base, base * 1.6, crestFactor * (1.0 - uDepth));

  // Blinn-Phong sun specular
  vec3 h = normalize(uSunDir + viewDir);
  float spec = pow(max(dot(vNormal, h), 0.0), 120.0) * (1.0 - uDepth * 0.95);
  vec3 sunColor = vec3(1.0, 0.92, 0.76);
  base += sunColor * spec * 2.5;

  // Fresnel rim — edges look glassy
  float fres = pow(1.0 - abs(dot(viewDir, vNormal)), 3.5);
  base += vec3(0.3, 0.7, 1.0) * fres * 0.4 * (1.0 - uDepth);

  // Distance fog (horizon haze)
  float dist = length(cameraPosition - vWorldPos);
  vec3 fogColor = depthColor(uDepth) * 0.5;
  float fog = smoothstep(15.0, 80.0, dist);
  base = mix(base, fogColor, fog);

  // Slight transparency — lets us see particles beneath
  float alpha = mix(0.92, 0.98, uDepth);
  gl_FragColor = vec4(base, alpha);
}`;

// =========================================================
// GOD RAYS — screen space additive cones from above
// =========================================================
const godRayVert = /* glsl */`
uniform float uTime;
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const godRayFrag = /* glsl */`
uniform float uTime;
uniform float uIntensity;
varying vec2 vUv;
void main(){
  // Radiate from top-center
  vec2 center = vec2(0.5, 1.0);
  float angle = atan(vUv.x - center.x, vUv.y - center.y) * 15.0;
  float rays = (sin(angle + uTime * 0.2) * 0.5 + 0.5);
  rays = pow(rays, 6.0);
  // Fall off from top
  float falloff = pow(1.0 - vUv.y, 1.5);
  float alpha = rays * falloff * uIntensity * 0.35;
  gl_FragColor = vec4(0.5, 0.85, 1.0, alpha);
}`;

// =========================================================
// PARTICLE SHADER — plankton/dust instanced
// =========================================================
const particleVert = /* glsl */`
uniform float uTime;
attribute vec3 aOffset;
attribute float aSpeed;
varying float vDist;
void main(){
  vec3 pos = position + aOffset;
  pos.x += sin(uTime * aSpeed * 0.3 + aOffset.y * 1.5) * 2.0;
  pos.y += cos(uTime * aSpeed * 0.2 + aOffset.x * 2.0) * 1.5;
  pos.z += sin(uTime * aSpeed * 0.15 + aOffset.z) * 1.5;
  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  vDist = -mvPos.z;
  gl_PointSize = clamp(60.0 / vDist, 1.0, 12.0);
  gl_Position = projectionMatrix * mvPos;
}`;

const particleFrag = /* glsl */`
uniform vec3 uColor;
varying float vDist;
void main(){
  vec2 c = 2.0 * gl_PointCoord - 1.0;
  float r = dot(c, c);
  if(r > 1.0) discard;
  // Edge blur = depth-based softness
  float edgeSoftness = mix(0.6, -0.3, clamp(vDist / 30.0, 0.0, 1.0));
  float alpha = smoothstep(1.0, edgeSoftness, r) * smoothstep(40.0, 4.0, vDist) * 0.85;
  gl_FragColor = vec4(uColor, alpha);
}`;

// =========================================================
// WATER PLANE COMPONENT
// =========================================================
function Ocean({ scrollDepth }) {
  const ref = useRef();
  const uniforms = useMemo(() => ({
    uTime:   { value: 0 },
    uDepth:  { value: 0 },
    uSunDir: { value: new THREE.Vector3(0.4, 0.8, -0.4).normalize() },
  }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value  = clock.elapsedTime;
    uniforms.uDepth.value = scrollDepth.current;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[300, 300, 256, 256]} />
      <shaderMaterial
        vertexShader={waterVert}
        fragmentShader={waterFrag}
        uniforms={uniforms}
        transparent
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

// =========================================================
// GOD RAYS (fullscreen quad, additive)
// =========================================================
function GodRays({ scrollDepth }) {
  const ref = useRef();
  const uniforms = useMemo(() => ({
    uTime:      { value: 0 },
    uIntensity: { value: 1.0 },
  }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value      = clock.elapsedTime;
    uniforms.uIntensity.value = Math.max(0, 1.0 - scrollDepth.current * 2.5);
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
      <planeGeometry args={[300, 300]} />
      <shaderMaterial
        vertexShader={godRayVert}
        fragmentShader={godRayFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// =========================================================
// PLANKTON PARTICLE SYSTEM
// =========================================================
function Plankton() {
  const ref    = useRef();
  const count  = 3500;
  const dummy  = useMemo(() => new THREE.Object3D(), []);

  const { positions, offsets, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const offsets   = new Float32Array(count * 3);
    const speeds    = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i*3+0] = 0;
      positions[i*3+1] = 0;
      positions[i*3+2] = 0;
      offsets[i*3+0] = (Math.random() - 0.5) * 100;
      offsets[i*3+1] = (Math.random() - 1.0) * 120;
      offsets[i*3+2] = (Math.random() - 0.5) * 60 - 10;
      speeds[i] = 0.3 + Math.random() * 0.7;
    }
    return { positions, offsets, speeds };
  }, []);

  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uColor: { value: new THREE.Color(0.4, 0.85, 1.0) },
  }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aOffset"  args={[offsets,    3]} />
        <bufferAttribute attach="attributes-aSpeed"   args={[speeds,     1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={particleVert}
        fragmentShader={particleFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// =========================================================
// PROCEDURAL FISH — no images needed
// =========================================================
function FishSchool() {
  const groupRef = useRef();
  const fish = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      x: (Math.random() - 0.5) * 50,
      y: -8 - Math.random() * 20,
      z: -10 - Math.random() * 20,
      speed: 0.3 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      scale: 0.4 + Math.random() * 0.6,
    })), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!groupRef.current) return;
    groupRef.current.children.forEach((f, i) => {
      const d = fish[i];
      f.position.x = d.x + Math.sin(t * d.speed + d.phase) * 8;
      f.position.y = d.y + Math.sin(t * d.speed * 0.6 + d.phase) * 1.5;
      f.position.z = d.z + Math.cos(t * d.speed * 0.4) * 4;
      f.rotation.y = Math.atan2(
        Math.cos(t * d.speed + d.phase) * 8,
        Math.sin(t * d.speed * 0.4) * 4
      );
    });
  });

  return (
    <group ref={groupRef}>
      {fish.map((f, i) => (
        <group key={i} scale={f.scale}>
          {/* Body */}
          <mesh>
            <coneGeometry args={[0.15, 0.7, 4]} />
            <meshStandardMaterial
              color={new THREE.Color(0.1, 0.7, 0.9)}
              emissive={new THREE.Color(0.0, 0.2, 0.3)}
              metalness={0.3} roughness={0.4}
            />
          </mesh>
          {/* Tail */}
          <mesh position={[0, -0.38, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[0.1, 0.22, 3]} />
            <meshStandardMaterial color={new THREE.Color(0.05, 0.5, 0.7)} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// =========================================================
// SUNKEN TITANIC — procedural geometry silhouette
// =========================================================
function SunkenShip() {
  return (
    <group position={[5, -95, -15]} rotation={[0, 0.3, 0.05]}>
      {/* Hull */}
      <mesh>
        <boxGeometry args={[18, 2.5, 4]} />
        <meshStandardMaterial color="#111820" emissive="#001018" roughness={1} metalness={0.2} />
      </mesh>
      {/* Superstructure */}
      <mesh position={[-2, 2, 0]}>
        <boxGeometry args={[7, 3, 3]} />
        <meshStandardMaterial color="#0a1018" emissive="#000810" roughness={1} />
      </mesh>
      {/* Funnels */}
      {[-1, 1].map((x, i) => (
        <mesh key={i} position={[x * 1.5, 3.5, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
          <meshStandardMaterial color="#080f16" roughness={1} />
        </mesh>
      ))}
      {/* Mast */}
      <mesh position={[6, 3, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 6, 6]} />
        <meshStandardMaterial color="#0a1520" roughness={1} />
      </mesh>
    </group>
  );
}

// =========================================================
// SCENE BACKGROUND — deep gradient quad
// =========================================================
const bgVert = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,1.0,1.0); }`;
const bgFrag = /* glsl */`
uniform float uDepth;
varying vec2 vUv;
void main(){
  float y = vUv.y + uDepth * 0.5; // shift palette as camera dives
  vec3 top    = vec3(0.53, 0.81, 0.98); // sky
  vec3 surf   = vec3(0.08, 0.50, 0.82); // surface water
  vec3 mid    = vec3(0.03, 0.18, 0.45); // mid depth
  vec3 deep   = vec3(0.01, 0.05, 0.16); // twilight
  vec3 abyss  = vec3(0.0,  0.01, 0.04); // abyss
  vec3 void_  = vec3(0.0,  0.0,  0.0 ); // void
  vec3 col;
  if(y > 0.85)       col = mix(surf, top, (y-0.85)/0.15);
  else if(y > 0.65)  col = mix(mid,  surf, (y-0.65)/0.2);
  else if(y > 0.40)  col = mix(deep, mid,  (y-0.40)/0.25);
  else if(y > 0.18)  col = mix(abyss,deep, (y-0.18)/0.22);
  else               col = mix(void_, abyss, y/0.18);
  gl_FragColor = vec4(col, 1.0);
}`;

function BackgroundGradient({ scrollDepth }) {
  const uniforms = useMemo(() => ({ uDepth: { value: 0 } }), []);
  useFrame(() => { uniforms.uDepth.value = scrollDepth.current; });
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={bgVert}
        fragmentShader={bgFrag}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

// =========================================================
// CAMERA RIG — dives on scroll + gentle float + mouse
// =========================================================
function CameraRig({ scrollDepth }) {
  const { camera } = useThree();
  const scroll = useScroll();
  const mouse  = useRef([0, 0]);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = [
        (e.clientX / window.innerWidth  - 0.5) * 2,
        (e.clientY / window.innerHeight - 0.5) * 2,
      ];
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const p = scroll.offset; // 0 → 1
    scrollDepth.current = p;

    // Dive: surface y=1.5 → abyss y=-95
    const targetY = THREE.MathUtils.lerp(1.5, -95, p);

    // Gentle float at surface, still in abyss
    const wobble = (1 - p * p) * 0.2;
    const floatY = Math.sin(t * 1.3) * wobble;
    const floatX = Math.cos(t * 0.7) * wobble * 0.5;

    // Mouse parallax
    const [mx, my] = mouse.current;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, floatX + mx * 1.5, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY + floatY, 0.08);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 5 - my * 0.5, 0.05);

    camera.lookAt(
      camera.position.x * 0.2,
      targetY - 3,
      -20
    );
  });

  return null;
}

// =========================================================
// AMBIENT BIOLUMINESCENCE dots (deep only)
// =========================================================
function Biolum() {
  const count = 80;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for(let i=0;i<count;i++){
      p[i*3]   = (Math.random()-0.5)*60;
      p[i*3+1] = -40 - Math.random()*60;
      p[i*3+2] = (Math.random()-0.5)*40 - 10;
    }
    return p;
  },[]);

  const uniforms = useMemo(()=>({ uTime:{value:0}, uColor:{value: new THREE.Color(0,1,0.6)} }),[]);
  useFrame(({clock})=>{ uniforms.uTime.value = clock.elapsedTime; });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions,3]}/>
        <bufferAttribute attach="attributes-aOffset"  args={[positions,3]}/>
        <bufferAttribute attach="attributes-aSpeed"   args={[new Float32Array(count).fill(0.1),1]}/>
      </bufferGeometry>
      <shaderMaterial
        vertexShader={particleVert}
        fragmentShader={particleFrag}
        uniforms={uniforms}
        transparent depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// =========================================================
// SCENE ASSEMBLER
// =========================================================
function OceanScene({ scrollDepth }) {
  return (
    <>
      <BackgroundGradient scrollDepth={scrollDepth} />
      <CameraRig         scrollDepth={scrollDepth} />

      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 30, -20]} intensity={1.8} color="#fff4d6" />
      <pointLight position={[0, -55, -10]} intensity={5} color="#007acc" distance={40} />

      <Ocean    scrollDepth={scrollDepth} />
      <GodRays  scrollDepth={scrollDepth} />
      <Plankton />
      <FishSchool />
      <Biolum />
      <SunkenShip />
    </>
  );
}

// =========================================================
// HTML OVERLAY — scroll-synced text
// =========================================================
function HtmlOverlay() {
  const heroRef  = useRef();
  const depthRef = useRef();

  useEffect(()=>{
    // Fade hero text out as user scrolls
    gsap.to(heroRef.current, {
      opacity: 0,
      y: -60,
      ease: 'power2.in',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: '15% top',
        scrub: true,
      }
    });
  },[]);

  return (
    <>
      {/* Hero title */}
      <div ref={heroRef} style={{
        position:'fixed', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        textAlign:'center', zIndex:20, pointerEvents:'none',
        fontFamily:"'Poppins',sans-serif",
      }}>
        <h1 style={{
          fontSize:'clamp(2.5rem,7vw,6rem)', fontWeight:900,
          color:'#fff', letterSpacing:'6px', textTransform:'uppercase',
          textShadow:'0 0 30px rgba(0,220,255,0.8), 0 0 60px rgba(0,100,200,0.5)',
        }}>
          Dive Into The Depths
        </h1>
        <p style={{
          fontSize:'1.1rem', color:'rgba(180,230,255,0.8)',
          letterSpacing:'4px', marginTop:'1rem',
          textShadow:'0 0 10px rgba(0,200,255,0.4)',
        }}>
          OCEAN DEPTHS — A JOURNEY INTO THE DEEP
        </p>
        <div style={{ marginTop:'3rem', color:'rgba(0,220,255,0.7)', letterSpacing:'3px', fontSize:'0.9rem', animation:'bounce 2s infinite' }}>
          SCROLL DOWN ↓
        </div>
      </div>

      {/* Depth cards */}
      {[
        { pct:'15%', depth:'200m', zone:'Sunlight Zone', desc:'Solar energy powers extraordinary life here.', align:'left', ml:'8vw' },
        { pct:'35%', depth:'800m', zone:'Twilight Zone', desc:'Pressure mounts. Light becomes a memory.', align:'right', ml:'55vw' },
        { pct:'55%', depth:'2000m',zone:'Midnight Zone', desc:'Bioluminescence replaces sunlight entirely.', align:'left', ml:'8vw' },
        { pct:'78%', depth:'4000m',zone:'The Abyss',     desc:'The Titanic lies silent here. Pressure: 600 atm.', align:'right', ml:'52vw' },
      ].map(({ pct, depth, zone, desc, align, ml }) => (
        <div key={zone} style={{
          position:'absolute', top:pct, left:ml,
          fontFamily:"'Poppins',sans-serif",
          background:'rgba(5,20,45,0.55)',
          backdropFilter:'blur(14px)',
          border:'1px solid rgba(0,180,255,0.2)',
          borderRadius:'16px', padding:'1.5rem 2rem',
          maxWidth:'340px', zIndex:20,
          boxShadow:'0 8px 32px rgba(0,0,0,0.6)',
        }}>
          <div style={{ fontSize:'0.75rem', color:'#00ccff', letterSpacing:'3px', marginBottom:'0.4rem' }}>
            ▼ {depth}
          </div>
          <h2 style={{ fontSize:'1.5rem', fontWeight:700, color:'#fff', marginBottom:'0.5rem' }}>{zone}</h2>
          <p style={{ color:'rgba(180,220,255,0.8)', fontSize:'0.95rem', lineHeight:1.6 }}>{desc}</p>
        </div>
      ))}
    </>
  );
}

// =========================================================
// ROOT EXPORT
// =========================================================
export default function ImmersiveOcean() {
  const scrollDepth = useRef(0);

  return (
    <div style={{ width:'100vw', height:'100vh', background:'#000', overflow:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700;900&display=swap');
        * { box-sizing: border-box; margin:0; padding:0; }
        body { background:#000; overflow-x:hidden; }
        @keyframes bounce {
          0%,100%{ transform:translateY(0); opacity:1; }
          50%    { transform:translateY(10px); opacity:0.4; }
        }
      `}</style>

      <Canvas
        camera={{ position:[0, 1.5, 5], fov:60, near:0.1, far:500 }}
        gl={{ antialias:true, alpha:false, powerPreference:'high-performance' }}
        dpr={[1, Math.min(window.devicePixelRatio, 2)]}
      >
        <ScrollControls pages={6} damping={0.25}>
          <OceanScene scrollDepth={scrollDepth} />

          <Scroll html style={{ width:'100%' }}>
            {/* Inline scroll HTML cards */}
            <div style={{ height:'600vh', position:'relative', width:'100vw' }}>
              {[
                { top:'18%', ml:'6vw',  depth:'200m',  zone:'Sunlight Zone',  desc:'Solar energy powers extraordinary life here.' },
                { top:'34%', ml:'54vw', depth:'800m',  zone:'Twilight Zone',  desc:'Pressure mounts. Light becomes a memory.' },
                { top:'52%', ml:'6vw',  depth:'2000m', zone:'Midnight Zone',  desc:'Bioluminescence replaces sunlight entirely.' },
                { top:'72%', ml:'52vw', depth:'4000m', zone:'The Abyss',      desc:'The Titanic lies silent. Pressure: 600 atm.' },
              ].map(({ top, ml, depth, zone, desc }) => (
                <div key={zone} style={{
                  position:'absolute', top, left:ml,
                  fontFamily:"'Poppins',sans-serif",
                  background:'rgba(5,20,45,0.55)',
                  backdropFilter:'blur(14px)',
                  border:'1px solid rgba(0,180,255,0.2)',
                  borderRadius:'16px', padding:'1.5rem 2rem',
                  maxWidth:'320px', zIndex:20,
                  boxShadow:'0 8px 32px rgba(0,0,0,0.6)',
                }}>
                  <div style={{ fontSize:'0.75rem', color:'#00ccff', letterSpacing:'3px', marginBottom:'0.4rem' }}>
                    ▼ {depth}
                  </div>
                  <h2 style={{ fontSize:'1.4rem', fontWeight:700, color:'#fff', marginBottom:'0.5rem' }}>{zone}</h2>
                  <p style={{ color:'rgba(180,220,255,0.8)', fontSize:'0.9rem', lineHeight:1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </Scroll>
        </ScrollControls>
      </Canvas>

      {/* Fixed hero — sits above Canvas */}
      <div id="hero-overlay" style={{
        position:'fixed', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        textAlign:'center', zIndex:50, pointerEvents:'none',
        fontFamily:"'Poppins',sans-serif",
      }}>
        <h1 style={{
          fontSize:'clamp(2rem,6vw,5.5rem)', fontWeight:900,
          color:'#fff', letterSpacing:'6px', textTransform:'uppercase',
          textShadow:'0 0 40px rgba(0,220,255,0.9), 0 4px 20px rgba(0,0,0,0.5)',
        }}>
          Dive Into The Depths
        </h1>
        <p style={{
          fontSize:'1rem', color:'rgba(180,230,255,0.8)',
          letterSpacing:'4px', marginTop:'1rem',
          textShadow:'0 0 14px rgba(0,200,255,0.5)',
        }}>
          OCEAN DEPTHS — A JOURNEY INTO THE DEEP
        </p>
        <div style={{
          marginTop:'3rem', color:'rgba(0,220,255,0.7)',
          letterSpacing:'3px', fontSize:'0.85rem',
          animation:'bounce 2s infinite',
        }}>
          SCROLL DOWN ↓
        </div>
      </div>
    </div>
  );
}
