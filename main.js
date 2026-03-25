import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * THREE.JS SETUP
 */
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 2; // Looking slightly down originally

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true // Important for seeing CSS bg behind if needed
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const pointLight = new THREE.PointLight(0xffffff, 2, 100);
pointLight.position.set(10, 10, 10);
const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(-50, 20, 10);
scene.add(ambientLight, pointLight, sunLight);

/**
 * OBJECTS CREATION (No external images)
 */

// 1. Starfield (Particles)
const starGeometry = new THREE.BufferGeometry();
const starCount = 5000;
const posArray = new Float32Array(starCount * 3);

for(let i = 0; i < starCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 200;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
});
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// 2. The Abstract Earth/Launchpad (Sriharikota)
// We'll create a low-poly terrain representation
const earthGeometry = new THREE.IcosahedronGeometry(15, 2);
const earthMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1E3A8A, // ISRO Blue Oceans
    flatShading: true,
    wireframe: false
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(0, -18, -10); // Placed below
scene.add(earth);

// Abstract India/Structures on top
const structureGeom = new THREE.BoxGeometry(1, 4, 1);
const structureMat = new THREE.MeshStandardMaterial({ color: 0xFF9933 }); // Saffron
const launchTower = new THREE.Mesh(structureGeom, structureMat);
launchTower.position.set(0, -3, -5);
scene.add(launchTower);

// PSLV/Abstract Rocket
const rocketGeom = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
const rocketMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF }); // White body
const rocket = new THREE.Mesh(rocketGeom, rocketMat);
rocket.position.set(0.8, -3.5, -4.5);
scene.add(rocket);

// 3. Mars (Mangal)
const marsGeometry = new THREE.SphereGeometry(10, 64, 64);
// Procedural red planet using colors to simulate texture
const marsMaterial = new THREE.MeshStandardMaterial({
    color: 0xC1440E,
    roughness: 0.8,
    metalness: 0.1
});
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
mars.position.set(0, 0, -80); // Far away
scene.add(mars);

// Mangalyaan (Abstract Box/Panel)
const momGroup = new THREE.Group();
const momBody = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), new THREE.MeshStandardMaterial({color: 0xFFD700})); // Gold foil
const momPanel = new THREE.Mesh(new THREE.BoxGeometry(3, 0.1, 1), new THREE.MeshStandardMaterial({color: 0x1E3A8A})); // Solar panels
momPanel.position.x = 0;
momGroup.add(momBody, momPanel);
momGroup.position.set(-6, 0, -70); // Orbiting distance
scene.add(momGroup);

/**
 * ANIMATION LOOP & SCROLL TRIGGER GSAP
 */

// We map scroll progress to an object's properties or camera position
let scrollProgress = { value: 0 };

gsap.to(scrollProgress, {
    value: 1,
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    }
});

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate stars slowly
    stars.rotation.y += 0.0005;
    
    // Earth rotates slowly
    earth.rotation.y += 0.001;

    // Based on scrollProgress value (0 to 1)
    const p = scrollProgress.value;

    // 1. Camera Animation (moving from Earth to Mars)
    // Journey from z=5 to z=-65
    camera.position.z = gsap.utils.interpolate(5, -60, p);
    camera.position.y = gsap.utils.interpolate(2, 0, p);
    
    // Look ahead slightly but smoothly transition to look at Mars
    camera.lookAt(0, 0, camera.position.z - 10);

    // 2. Rocket Launch Phase (p = 0 to 0.2)
    if (p < 0.2) {
        // Map 0-0.2 to 0-1
        const launchP = p / 0.2;
        rocket.position.y = gsap.utils.interpolate(-3.5, 20, launchP);
        // Add subtle vibration
        rocket.position.x = 0.8 + (Math.random() - 0.5) * 0.05 * (1 - launchP);
    } else {
        // disappear from view
        rocket.position.y = 50;
    }

    // 3. Mangalyaan Orbit Phase
    if (p > 0.6) {
        // Rotate Mangalyaan around Mars
        const rad = Date.now() * 0.001;
        momGroup.position.x = Math.sin(rad) * 14;
        momGroup.position.z = -80 + Math.cos(rad) * 14;
        momGroup.lookAt(mars.position);
    }

    // Mars minimal rotation
    mars.rotation.y += 0.001;

    renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

/**
 * DOM UI & HUD LOGIC
 */

const altitudeValue = document.getElementById('altitude-value');
const speedValue = document.getElementById('speed-value');
const stageEl = document.getElementById('stage');
const progressBar = document.getElementById('progressBar');

// HUD State
let hudState = { altitude: 0, speed: 0 };

gsap.to(progressBar, {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
    }
});

const stages = [
    { title: 'SRIHARIKOTA', alt: 0, speed: 0, color: '#FF9933' },
    { title: 'ATMOSPHERIC ASCENT', alt: 500, speed: 7.9, color: '#FFFFFF' },
    { title: 'HELIOCENTRIC PHASE', alt: 225000000, speed: 32.8, color: '#138808' },
    { title: 'MARTIAN SPHERE OF INFLUENCE', alt: 224900000, speed: 22.1, color: '#E27B58' },
    { title: 'MANGALYAAN INSERTION', alt: 421, speed: 4.3, color: '#1E3A8A' }
];

const mainSections = document.querySelectorAll('.mission-section');

mainSections.forEach((section, index) => {
    const stage = stages[index];
    
    ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => updateHUD(stage),
        onEnterBack: () => updateHUD(stage)
    });

    const reveals = section.querySelectorAll('.reveal-text');
    gsap.to(reveals, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
        }
    });
});

function updateHUD(stage) {
    stageEl.innerText = `STAGE: ${stage.title}`;
    const hudItems = document.querySelectorAll('.hud-item');
    hudItems.forEach(item => item.style.borderColor = stage.color);
    
    gsap.to(hudState, {
        altitude: stage.alt,
        speed: stage.speed,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
            altitudeValue.textContent = Math.floor(hudState.altitude).toLocaleString();
            speedValue.textContent = hudState.speed.toFixed(1);
        }
    });
}

// Interactivity for Hotspots
const hotspots = document.querySelectorAll('.hotspot');
const tooltip = document.getElementById('tooltip');

hotspots.forEach(hotspot => {
    hotspot.addEventListener('mouseenter', (e) => {
        const info = hotspot.getAttribute('data-info');
        tooltip.innerText = info;
        tooltip.classList.add('visible');
        
        const updatePos = (e) => {
            tooltip.style.left = `${e.clientX + 20}px`;
            tooltip.style.top = `${e.clientY + 20}px`;
        };
        
        updatePos(e);
        window.addEventListener('mousemove', updatePos);
        hotspot._updatePos = updatePos;
    });

    hotspot.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
        window.removeEventListener('mousemove', hotspot._updatePos);
    });
});
