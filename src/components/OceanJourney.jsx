import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../index.css';
import {
  ShipSVG, SubmarineSVG,
  FishTropical, FishBasic, FishAnglerfish,
  SharkSVG, JellyfishSVG,
  ViperfishSVG, BioSquidSVG,
  TitanicSVG,
  Seaweed, Kelp, Coral, BioPlant
} from './OceanSVGs';

gsap.registerPlugin(ScrollTrigger);

/* ── INFO DATA ──────────────────────────────────────────────── */
const INFO = {
  ship: {
    icon: '🚢', title: 'Research Vessel "Abyssos"',
    meta: 'Surface · 0m depth',
    body: 'The RV Abyssos is equipped with state-of-the-art deep-sea exploration gear, including remotely operated vehicles (ROVs) and multi-beam sonar mapping systems.',
    fact: '"Abyssos" means "bottomless" in Greek — fitting for a ship dedicated to exploring the darkest corners of our ocean.'
  },
  submarine: {
    icon: '🤿', title: 'ROV Manta-7',
    meta: 'Descent Vehicle · Max Depth 6,000m',
    body: 'The Manta-7 is a remotely operated vehicle built to withstand pressures exceeding 600 atmospheres. Its titanium hull and pressure-balanced thrusters allow it to explore trenches beyond human reach.',
    fact: 'The pressure at 6,000m is equivalent to 600 kg pressing on every square centimetre of the hull.'
  },
  shark: {
    icon: '🦈', title: 'Great White Shark',
    meta: 'Sunlight Zone · 0–200m',
    body: 'Carcharodon carcharias — one of the ocean\'s apex predators. Despite their fearsome reputation, sharks are vital to maintaining healthy ocean ecosystems.',
    fact: 'Sharks have been around for over 450 million years, pre-dating even the dinosaurs!'
  },
  tropical: {
    icon: '🐠', title: 'Clownfish',
    meta: 'Sunlight Zone · 0–50m',
    body: 'Amphiprioninae — the iconic coral reef dwellers with their distinctive orange-and-white striping. They live in symbiosis with sea anemones.',
    fact: 'All clownfish are born male. The dominant fish in a group can change sex to become female.'
  },
  jelly1: {
    icon: '🪼', title: 'Moon Jellyfish',
    meta: 'Midnight Zone · 200–1,000m',
    body: 'Aurelia aurita produces its own light through bioluminescence — a chemical reaction involving luciferin proteins. This bluish glow is used to attract prey and confuse predators.',
    fact: 'The Moon Jellyfish has existed for over 500 million years and is 95% water!'
  },
  jelly2: {
    icon: '🪼', title: 'Crystal Jelly',
    meta: 'Deep Sea · 1,000–3,000m',
    body: 'Aequorea victoria — the source of GFP (Green Fluorescent Protein), which revolutionized cell biology. Scientists now use this protein as a marker to study living cells.',
    fact: 'The scientists who discovered GFP\'s use in biology won the 2008 Nobel Prize in Chemistry!'
  },
  viperfish: {
    icon: '🐟', title: 'Pacific Viperfish',
    meta: 'Abyss · 1,000–4,000m',
    body: 'Chauliodus macouni — armed with needle-like teeth so long they don\'t fit inside its mouth. It uses a bioluminescent lure on its dorsal fin to attract prey in total darkness.',
    fact: 'A viperfish can go days, even weeks, without any food in the barren deep sea.'
  },
  squid: {
    icon: '🦑', title: 'Bioluminescent Squid',
    meta: 'Deep Sea · 700–3,000m',
    body: 'Watasenia scintillans — the firefly squid. Its entire body is covered in thousands of tiny light organs called photophores that can produce blue light on demand.',
    fact: 'Firefly squid gather in massive numbers each spring off the coast of Japan, creating a sea of blue light visible from shore.'
  },
  anglerfish: {
    icon: '🎣', title: 'Deep-Sea Anglerfish',
    meta: 'Abyss · 200–2,000m',
    body: 'Melanocetus johnsonii — the deep sea\'s most iconic predator. Females carry a glowing lure above their heads that contains bioluminescent bacteria, drawing prey into their enormous jaws.',
    fact: 'Male anglerfish are tiny parasites that permanently attach to females and share their bloodstream!'
  },
  titanic: {
    icon: '⚓', title: 'The Chronology of the Deep',
    meta: 'RMS Titanic · 1912 – Present',
    body: 'On a cold night in April 1912, the grandest ship ever built vanished into the abyss. But the story didn\'t end there.',
    story: [
      'The "Unsinkable" ship was carrying 2,224 souls on its maiden voyage. When it struck the iceberg at 11:40 PM, most passengers didn\'t even feel the vibration. It was only when the mail room began flooding that the officers realized the grave reality.',
      'As she sank, the ship famously snapped in two between the third and fourth funnels. The bow, more aerodynamic, ploughed into the seafloor at 30 knots, burying itself deep in the sediment. The stern, full of air, imploded as it descended, landing in a twisted heap of steel 600m away.',
      'For decades, her location was a total mystery. It wasn\'t until 1985 that the first images of the haunting bow emerged from the darkness of the North Atlantic. Today, iron-eating bacteria are slowly dissolving her hull, turning the steel into fragile "rusticles" that will eventually return to the sea floor.',
      'She rests now in eternal silence, a solemn graveyard and a reminder of the ocean\'s absolute power.'
    ],
    fact: 'The debris field covers over 15 square miles of the ocean floor, holding items as small as silver spoons and as large as the massive boilers.'
  },

  seaweed:  { icon: '🌿', title: 'Giant Seaweed',  meta: 'Coastal · 0–40m', body: 'Marine macroalgae form the foundation of coastal ecosystems. They produce oxygen, absorb CO₂, and provide habitat for hundreds of species.', fact: 'Seaweed grows up to 60cm per day.' },
  kelp:     { icon: '🌱', title: 'Kelp Forest',    meta: 'Sunlight Zone · 10–40m', body: 'Giant kelp creates towering underwater forests up to 50m tall, supporting thousands of marine species.', fact: 'Kelp forests absorb 20× more CO₂ per acre than land forests.' },
  coral:    { icon: '🪸', title: 'Brain Coral',    meta: 'Sunlight Zone · 1–30m', body: 'Diploria labyrinthiformis — its grooved surface resembles a human brain. Reefs cover <1% of the ocean floor but support 25% of all marine species.', fact: 'Some brain corals live up to 900 years.' },
  bioplant: { icon: '✨', title: 'Bioluminescent Organism', meta: 'Abyss · 2,000–5,000m', body: 'In permanent darkness, photosynthesis is impossible. These organisms derive energy from chemical reactions — chemosynthesis.', fact: '76% of deep-sea organisms produce their own light.' },
};

/* ── NARRATIVE LOG ────────────────────────────────────────── */
const NARRATIVE = [
  { p: 0.00, text: "Zero depth. The sunlight is blinding, the ocean surface a brilliant turquoise. Our descent begins now." },
  { p: 0.08, text: "Passing 200m. The color is shifting to a deeper navy. The pressure is mounting on the Manta-7's hull." },
  { p: 0.22, text: "Twilight Zone. The last rays of sun vanish. It is cold. Strange shadows flicker at the edge of our lights." },
  { p: 0.45, text: "Passing 1,000m. True darkness. The only light here comes from the creatures themselves. Bioluminescence is the only map." },
  { p: 0.76, text: "Abyssal depth. We are beyond the reach of human intuition. The silence here is heavy, prehistoric." },
  { p: 0.94, text: "There she is. A massive iron shadow in the murk. After 4,000 metres, we have finally found the Titanic." },
];

/* ── STABLE RANDOM DATA (memoised, never changes on re-render) ── */
// Mid-size bubbles
const BUBBLES = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  left: `${(i * 2.86) % 100}%`,
  size: 6 + (i * 0.7) % 16,
  dur: `${6 + (i * 0.44) % 10}s`,
  delay: `${-(i * 0.41) % 14}s`,
  drift: `${((i % 5) - 2) * 20}px`,
}));

// Large foreground bubbles
const BUBBLES_LG = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${10 + (i * 8.5) % 82}%`,
  size: 28 + (i * 4) % 30,
  dur: `${16 + (i * 1.2) % 12}s`,
  delay: `${-(i * 1.8) % 20}s`,
  drift: `${((i % 3) - 1) * 25}px`,
}));

// Tiny background particles
const BUBBLES_SM = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  left: `${(i * 1.82) % 100}%`,
  size: 1.5 + (i * 0.09) % 3,
  dur: `${4 + (i * 0.28) % 8}s`,
  delay: `${-(i * 0.33) % 12}s`,
  drift: `${((i % 7) - 3) * 10}px`,
}));

// Sub spotlight particles
const SUB_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i, size: 1 + (i % 3),
  dur: `${3 + (i * 0.5) % 4}s`,
  delay: `${-(i * 0.4) % 5}s`,
  dx: `${-20 - (i * 8) % 60}px`,
  dy: `${((i % 5) - 2) * 15}px`,
}));

/* ── PLANT CONFIGS ── */
const SHALLOW_PLANTS = [
  [2,'seaweed',0,120],  [6,'kelp',1,160],   [10,'seaweed',2,90],
  [15,'coral','red',0], [19,'seaweed',3,110],[23,'kelp',4,150],
  [27,'coral','pink',5],[31,'seaweed',6,100],[35,'kelp',7,170],
  [39,'coral','org',8], [43,'seaweed',9,95], [47,'kelp',10,145],
  [51,'seaweed',11,115],[55,'coral','red',12],[59,'kelp',13,165],
  [63,'seaweed',14,105],[67,'coral','pink',15],[71,'kelp',16,155],
  [75,'seaweed',17,98], [79,'coral','org',18],[83,'seaweed',19,112],
  [87,'kelp',20,142],   [91,'seaweed',21,108],[95,'coral','red',22]
];

const DEEP_PLANTS = Array.from({length:22},(_,i) => ({ left:`${i*4.7+1}%`, id:i }));

/* ── ZONE MARKERS ── */
const ZONE_MARKERS = [
  { pct: 0,    label: '0m · SURFACE',   top: '2%' },
  { pct: 0.05, label: '200m · SUNLIGHT',top: '18%' },
  { pct: 0.25, label: '1,000m · TWILIGHT',top:'36%' },
  { pct: 0.55, label: '2,000m · MIDNIGHT',top:'56%' },
  { pct: 0.80, label: '4,000m · ABYSS',   top:'78%' },
];

export default function OceanJourney() {
  const [loading,       setLoading]       = useState(true);
  const [card,           setCard]         = useState(null);
  const [activeCreature, setActiveCreature] = useState(null);

  const wrapperRef         = useRef(null);
  const spotRef            = useRef(null);
  const fogRef             = useRef(null);
  const twilightFogRef     = useRef(null);
  const maxDescentRef      = useRef(0); 
  const depthTextRef       = useRef(null);
  const hudDepthFillRef    = useRef(null);
  const hudProgressFillRef = useRef(null);
  const logTextRef         = useRef(null);
  const cableRef           = useRef(null);
  const subWrapRef         = useRef(null);
  const particlesWrapRef   = useRef(null);


  /* -- Loading -- */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  /* -- Compute max cable descent once DOM is ready -- */
  useEffect(() => {
    if (loading || !wrapperRef.current) return;
    // Give React one frame to paint, then measure total page height
    requestAnimationFrame(() => {
      const pageH = wrapperRef.current.scrollHeight;
      // Ship sits at 1.8% of page + 172px, submarine should reach ~94% of page
      const shipBottomPx = pageH * 0.018 + 172;
      maxDescentRef.current = pageH * 0.93 - shipBottomPx;
    });
  }, [loading]);

  /* -- GSAP ScrollTrigger -- */
  useEffect(() => {
    if (loading || !wrapperRef.current) return;

    const scrollProxy = { p: 0 };

    ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2, // Smooth viscous interpolation
      animation: gsap.to(scrollProxy, {
        p: 1,
        ease: 'none',
        onUpdate: () => {
          const p = scrollProxy.p;
          
          if (depthTextRef.current) {
            depthTextRef.current.innerText = Math.round(p * 4000) + 'm';
          }

          const maxDesc = maxDescentRef.current || window.innerHeight * 7.2;
          const newCable = 80 + p * (maxDesc - 80);

          if (cableRef.current) {
            cableRef.current.style.transform = `scaleY(${newCable})`;
          }
          if (subWrapRef.current) {
            subWrapRef.current.style.transform = `translate3d(-50%, ${newCable}px, 0)`;
          }

          const screenPos = Math.min(
            window.innerHeight * 0.82,
            Math.max(80, 180 + p * window.innerHeight * 0.62)
          );

          if (spotRef.current) {
            spotRef.current.style.transform = `translate3d(-50%, ${screenPos}px, 0)`;
            spotRef.current.style.opacity = Math.min(1, p * 10).toString();
          }

          if (particlesWrapRef.current) {
            particlesWrapRef.current.style.transform = `translate3d(0, ${screenPos}px, 0)`;
            particlesWrapRef.current.style.opacity = Math.min(0.7, p * 8).toString();
          }

          if (fogRef.current) {
            const fogOpacity = Math.max(0, (p - 0.3) * 0.7);
            fogRef.current.style.background = `radial-gradient(ellipse at 50% 80%, rgba(0,2,8,0) 0%, rgba(0,2,8,${(fogOpacity * 0.4).toFixed(3)}) 50%, rgba(0,2,8,${fogOpacity.toFixed(3)}) 100%)`;
          }

          if (twilightFogRef.current) {
            const tFogOpacity = Math.max(0, (p - 0.25) * 0.9);
            twilightFogRef.current.style.background = `linear-gradient(to bottom, transparent 0%, rgba(0,5,18,${tFogOpacity * 0.4}) 50%, rgba(0,5,18,${tFogOpacity * 0.7}) 100%)`;
          }

          if (hudDepthFillRef.current) {
            hudDepthFillRef.current.style.transform = `scaleY(${p})`;
          }
          if (hudProgressFillRef.current) {
            hudProgressFillRef.current.style.transform = `scaleY(${p})`;
          }

          const activeBeat = [...NARRATIVE].reverse().find(beat => p >= beat.p);
          if (activeBeat && logTextRef.current && logTextRef.current.innerText !== activeBeat.text) {
            logTextRef.current.innerText = activeBeat.text;
            logTextRef.current.style.animation = 'none';
            void logTextRef.current.offsetWidth;
            logTextRef.current.style.animation = 'logTextFade 0.5s ease forwards';
          }
        }
      })
    });

    // Reveal animations
    gsap.utils.toArray('.reveal-text').forEach(el => {
      gsap.set(el, { opacity: 0, y: 36 });
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: {
          trigger: el, start: 'top 92%',
          toggleActions: 'play none none none',
        }
      });
    });

    // Parallax background layers
    gsap.utils.toArray('.parallax-bg').forEach(el => {
      gsap.to(el, { yPercent: 20, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [loading]);

  /* -- Card open/close -- */
  const openCard  = useCallback((key, e) => { if (e) e.stopPropagation(); setCard(key); setActiveCreature(key); }, []);
  const closeCard = useCallback(() => { setCard(null); setActiveCreature(null); }, []);
  const plantKey  = (type) => type === 'seaweed' ? 'seaweed' : type === 'kelp' ? 'kelp' : 'coral';

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-orb"/>
        <div className="loading-bubbles">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="loading-bubble"
              style={{ animationDelay: `${i*0.28}s`, width: 10+i*3, height: 10+i*3 }}/>
          ))}
        </div>
        <div className="loading-text">Preparing Descent…</div>
      </div>
    );
  }

  const info = card ? INFO[card] : null;

  return (
    <>
      {/* ── FIXED ATMOSPHERE LAYERS ─── */}
      <div className="vignette"/>
      <div className="depth-fog-overlay" ref={fogRef}/>
      <div className="parallax-bg-haze"/>

      {/* ── FIXED HUD ─────────────────── */}
      <div className="hud-depth">
        <div className="hud-depth-label">Depth</div>
        <div className="hud-depth-value" ref={depthTextRef}>0m</div>
        <div className="hud-depth-bar">
          <div className="hud-depth-fill" ref={hudDepthFillRef} style={{ transformOrigin: 'top center', transform: 'scaleY(0)' }}/>
          {/* Zone markers */}
          {ZONE_MARKERS.map((m, i) => (
            <div key={i} className="hud-zone-marker" style={{ top: m.top }}>
              {m.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── EXPLORER'S LOG (Narrative) ── */}
      <div className="explorer-log">
        <div className="log-header">EXPLORER'S LOG · CH-01</div>
        <div className="log-content" ref={logTextRef}>{NARRATIVE[0].text}</div>
      </div>

      <div className="hud-progress">

        <div className="hud-progress-fill" ref={hudProgressFillRef} style={{ transformOrigin: 'top center', transform: 'scaleY(0)' }}/>
      </div>

      {/* ── SUBMARINE SPOTLIGHT (fixed, tracks sub) ── */}
      <div className="submarine-spotlight" ref={spotRef}
        style={{ width: 380, height: 380, top: 0, left: 'calc(50% - 120px)' }}/>

      {/* ── SPOTLIGHT PARTICLES ── */}
      <div ref={particlesWrapRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', pointerEvents: 'none', zIndex:101 }}>
      {SUB_PARTICLES.map(p => (
        <div key={p.id} className="sub-particle" style={{
          position: 'absolute',
          width: p.size, height: p.size,
          top: parseInt(p.dy)||0,
          left: `calc(50vw - 80px + ${parseInt(p.dx)||0}px)`,
          '--dur': p.dur, '--delay': p.delay,
          '--dx': p.dx, '--dy': p.dy,
        }}/>
      ))}
      </div>

      {/* ── INFO CARD MODAL ─── */}
      {info && (
        <div className="info-card" onClick={closeCard}>
          <div className="info-card-inner story-mode" onClick={e => e.stopPropagation()}>
            <button className="info-card-close" onClick={closeCard}>✕</button>
            <span className="info-card-icon">{info.icon}</span>
            <div className="info-card-title">{info.title}</div>
            <div className="info-card-meta">{info.meta}</div>
            <div className="info-card-body">{info.body}</div>
            {info.story && (
              <div className="info-card-story">
                {info.story.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            )}
            <div className="info-card-fact">💡 {info.fact}</div>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════════════════
          OCEAN WORLD
          ══════════════════════════════════════════════════════ */}
      <div className="ocean-world" ref={wrapperRef}>

        {/* ── LAYERED BUBBLE SYSTEM ─────────────────────────── */}

        {/* Background tiny particles (fixed) */}
        <div className="bubble-field" style={{position:'fixed', zIndex:2}}>
          {BUBBLES_SM.map(b => (
            <div key={b.id} className="css-bubble-sm" style={{
              left: b.left, bottom: 0,
              width: b.size, height: b.size,
              '--dur': b.dur, '--delay': b.delay, '--drift': b.drift,
            }}/>
          ))}
        </div>

        {/* Mid bubbles (fixed) */}
        <div className="bubble-field" style={{position:'fixed', zIndex:4}}>
          {BUBBLES.map(b => (
            <div key={b.id} className="css-bubble" style={{
              left: b.left, bottom: 0,
              width: b.size, height: b.size,
              '--dur': b.dur, '--delay': b.delay, '--drift': b.drift,
            }}/>
          ))}
        </div>

        {/* Large foreground blurred bubbles (fixed) */}
        <div className="bubble-field" style={{position:'fixed', zIndex:5}}>
          {BUBBLES_LG.map(b => (
            <div key={b.id} className="css-bubble-lg" style={{
              left: b.left, bottom: 0,
              width: b.size, height: b.size,
              '--dur': b.dur, '--delay': b.delay, '--drift': b.drift,
            }}/>
          ))}
        </div>

        {/* ── SHIP + CABLE + SUBMARINE (page-level, all sections) ── */}
        <div style={{
          position:'absolute', top:0, left:0,
          width:'100%', height:'100%',
          pointerEvents:'none', zIndex:50,
        }}>
          {/* Ship */}
          <div style={{
            position:'absolute', top:'1.8%', left:'50%',
            transform:'translateX(-50%)',
            zIndex:52, pointerEvents:'auto',
          }}>
            <div className="ship-svg-wrap" onClick={e => openCard('ship', e)}
              style={{cursor:'pointer'}} title="Click to learn more">
              <ShipSVG width={420}/>
            </div>
          </div>

          {/* Cable — grows with scroll */}
          <div ref={cableRef} style={{
            position:'absolute',
            top: 'calc(1.8% + 172px)',
            left:'50%',
            marginLeft: '-1.5px',
            width:'3px',
            height: '1px',
            transformOrigin: 'top center',
            transform: 'scaleY(80)',
            willChange: 'transform',
            background:'linear-gradient(to bottom, #aaa 0%, #666 40%, #333 100%)',
            borderRadius:'2px',
            boxShadow:'0 0 6px rgba(0,0,0,0.6)',
            zIndex:51,
            pointerEvents:'none',
          }}/>

          {/* Submarine */}
          <div ref={subWrapRef} style={{
              position:'absolute',
              top: 'calc(1.8% + 172px)',
              left:'50%',
              zIndex:55,
              pointerEvents:'auto',
              willChange: 'transform',
              transform: 'translate3d(-50%, 80px, 0)'
            }}>
            <div className="submarine-wrapper float-anim" onClick={e => openCard('submarine', e)}>

            <SubmarineSVG width={210}/>
            <div className="sub-light-cone"/>
            {[0,1,2,3,4].map(i => (
              <div key={i} className="sub-trail-bubble" style={{
                position:'absolute', left: 14, top: '42%',
                width: 5+i*3, height: 5+i*3,
                '--dur': `${1.0+i*0.35}s`,
                '--delay': `${i*0.2}s`,
                '--dx': `-${12+i*9}px`,
               '--dy': `-${25+i*14}px`,
              }}/>
            ))}
            <div className="creature-label">ROV Manta-7</div>
            </div>
          </div>
        </div>

        {/* ── SECTION 1: HERO ─────────────────────────────── */}
        <section className="ocean-section sec-hero" style={{minHeight:'120vh'}}>
          {/* Caustic light patterns */}
          <div className="caustics"/>
          {/* Sun rays */}
          <div className="sun-rays"/>
          {/* Water surface */}
          <div className="water-surface">
            <div className="surface-waves"/>
            <div className="surface-waves" style={{top:'18%', opacity:0.45, animationDelay:'4s'}}/>
          </div>

          {/* Hero text */}
          <div className="hero-text-block">
            <div className="hero-eyebrow reveal-text">An Immersive Deep-Sea Experience</div>
            <h1 className="hero-title reveal-text">
              Journey to the<br/><em>Ocean Depths</em>
            </h1>
            <p className="hero-subtitle reveal-text">
              Descend 4,000 metres into the unknown. Discover life where light has never reached.
            </p>
            <div className="scroll-cue reveal-text">
              <span>Scroll to Dive</span>
              <div className="scroll-arrow"/>
            </div>
          </div>

          {/* Shallow plants bottom of hero */}
          <div className="plants-layer" style={{height:'38%',bottom:0,zIndex:6}}>
            {SHALLOW_PLANTS.slice(0,8).map(([left,type,variant,h],i) => (
              <div key={i} className="plant-svg-wrap"
                style={{
                  left:`${left}%`, zIndex: 5+i%3,
                  '--sway-delay': `${i*0.35}s`,
                  '--sway-dur': `${2.5+i*0.3}s`,
                }}
                onClick={e => openCard(plantKey(type), e)}>
                {type==='seaweed' && <Seaweed height={h} id={i} color={['#1a7a3a','#1a6a30','#258a40'][i%3]}/>}
                {type==='kelp'    && <Kelp height={h} id={i}/>}
                {type==='coral'   && <Coral width={70} color={variant==='red'?'#dd2222':variant==='pink'?'#ff66aa':'#ff8820'} id={i}/>}
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 2: SUNLIGHT ZONE ─────────────────────── */}
        <section className="ocean-section" style={{minHeight:'120vh',alignItems:'flex-start',paddingTop:'10vh'}}>
          {/* Dense coral garden */}
          <div className="plants-layer" style={{height:'52%',zIndex:6}}>
            {SHALLOW_PLANTS.map(([left,type,variant,h],i) => (
              <div key={i} className="plant-svg-wrap"
                style={{
                  left:`${left}%`, zIndex:5+i%3,
                  '--sway-delay': `${i*0.28}s`,
                  '--sway-dur': `${2.2+i*0.25}s`,
                }}
                onClick={e => openCard(plantKey(type),e)}>
                {type==='seaweed' && <Seaweed height={h} id={i+8} color={['#1a7a3a','#158832','#22993a'][i%3]}/>}
                {type==='kelp'    && <Kelp height={h+20} id={i+8}/>}
                {type==='coral'   && <Coral width={75} color={variant==='red'?'#ff2222':variant==='pink'?'#ff44aa':'#ff7700'} id={i+8}/>}
              </div>
            ))}
          </div>

          {/* Clownfish */}
          <div className="creature-wrapper fish-swim-r creature-drift"
            style={{top:'22%','--dur':'14s','--delay':'0s','--drift-dur':'5s','--drift-delay':'0s',zIndex:15}}
            onClick={e => openCard('tropical',e)}>
            <FishTropical width={90}/>
            <div className="creature-label">Clownfish</div>
          </div>
          <div className="creature-wrapper fish-swim-l creature-drift"
            style={{top:'38%','--dur':'18s','--delay':'5s','--drift-dur':'7s','--drift-delay':'2s',zIndex:15}}
            onClick={e => openCard('tropical',e)}>
            <FishTropical width={65}/>
            <div className="creature-label">Clownfish</div>
          </div>

          {[
            {top:'16%',color:'#44aaff',dur:'11s',delay:'2s',dd:'6s',ddd:'1s'},
            {top:'52%',color:'#44ffaa',dur:'16s',delay:'7s',dd:'8s',ddd:'3s'},
            {top:'72%',color:'#ffaa44',dur:'10s',delay:'1s',dd:'5s',ddd:'0s'},
          ].map((f,i) => (
            <div key={i} className="creature-wrapper fish-swim-r creature-drift"
              style={{top:f.top,'--dur':f.dur,'--delay':f.delay,'--drift-dur':f.dd,'--drift-delay':f.ddd,zIndex:14}}
              onClick={e => openCard('tropical',e)}>
              <FishBasic width={52} color={f.color}/>
              <div className="creature-label">Reef Fish</div>
            </div>
          ))}

          {/* Shark */}
          <div className={`creature-wrapper shark-drift ${activeCreature==='shark'?'creature-glow-active':''}`}
            style={{top:'58%', zIndex:13}} onClick={e => openCard('shark',e)}>
            <SharkSVG width={270}/>
            <div className="creature-label">Great White Shark</div>
          </div>

          {/* Section panel */}
          <div className="section-content right" style={{marginTop:'5vh',zIndex:20}}>
            <div className="glass-panel">
              <div className="zone-label reveal-text">Zone 1</div>
              <div className="zone-depth reveal-text">0 – 200m</div>
              <h2 className="zone-title reveal-text">Sunlight Zone</h2>
              <p className="zone-desc reveal-text">
                The epipelagic zone bursts with colour and life. Sunlight penetrates the water,
                driving photosynthesis and fuelling coral reef ecosystems — the rainforests of the sea.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: TWILIGHT ZONE ─────────────────────── */}
        <section className="ocean-section" style={{minHeight:'110vh'}}>
          {/* Sparse, darker plants */}
          <div className="plants-layer" style={{height:'32%',zIndex:5}}>
            {SHALLOW_PLANTS.filter((_,i) => i%3===0).map(([left,type,,h],i) => (
              <div key={i} className="plant-svg-wrap"
                style={{left:`${left}%`, opacity:0.65,'--sway-delay':`${i*0.5}s`}}
                onClick={e => openCard(plantKey(type),e)}>
                {type==='seaweed' && <Seaweed height={h*0.72} id={i+30} color={`rgba(${8+i*2},${55+i*4},${8+i*2},0.8)`}/>}
                {type==='kelp'    && <Kelp height={(h||140)*0.72} id={i+30}/>}
              </div>
            ))}
          </div>

          {/* Depth fog layer */}
          <div ref={twilightFogRef} style={{
            position:'absolute', inset:0, pointerEvents:'none', zIndex:2,
            background:`linear-gradient(to bottom, transparent 0%, rgba(0,5,18,0) 50%, rgba(0,5,18,0) 100%)`,
          }}/>

          <div className="section-content left" style={{zIndex:20}}>
            <div className="glass-panel">
              <div className="zone-label reveal-text">Zone 2</div>
              <div className="zone-depth reveal-text">200 – 1,000m</div>
              <h2 className="zone-title reveal-text">Twilight Zone</h2>
              <p className="zone-desc reveal-text">
                Sunlight fades to a dim blue twilight. Strange creatures equipped with huge eyes
                and light-producing organs navigate this shadowy in-between world.
                Temperature drops sharply to just 4°C.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: MIDNIGHT / JELLYFISH ─────────────── */}
        <section className="ocean-section" style={{minHeight:'120vh'}}>

          {/* Jellyfish 1 — purple, large */}
          <div className={`creature-wrapper jelly-float bio-pulse ${activeCreature==='jelly1'?'creature-glow-active':''}`}
            style={{top:'8%', left:'10%', zIndex:15, '--jelly-dur':'7s', '--jelly-delay':'0s'}}
            onClick={e => openCard('jelly1',e)}>
            <JellyfishSVG width={155} color="#aa44ff"/>
            <div className="creature-label">Moon Jellyfish</div>
          </div>

          {/* Jellyfish 2 — teal, smaller */}
          <div className={`creature-wrapper jelly-float bio-pulse ${activeCreature==='jelly2'?'creature-glow-active':''}`}
            style={{top:'28%', right:'8%', zIndex:15, '--jelly-dur':'9s', '--jelly-delay':'3s'}}
            onClick={e => openCard('jelly2',e)}>
            <JellyfishSVG width={115} color="#00c8aa"/>
            <div className="creature-label">Crystal Jelly</div>
          </div>

          {/* Jellyfish 3 — pink accent, top right */}
          <div className="creature-wrapper jelly-float bio-pulse"
            style={{top:'5%', right:'28%', zIndex:14, '--jelly-dur':'8s', '--jelly-delay':'5s'}}
            onClick={e => openCard('jelly1',e)}>
            <JellyfishSVG width={80} color="#ff44aa"/>
            <div className="creature-label">Deep-Sea Jelly</div>
          </div>

          {/* Viperfish */}
          <div className={`creature-wrapper fish-swim-r bio-pulse ${activeCreature==='viperfish'?'creature-glow-active':''}`}
            style={{top:'55%','--dur':'22s','--delay':'3s',zIndex:14}}
            onClick={e => openCard('viperfish',e)}>
            <ViperfishSVG width={135}/>
            <div className="creature-label">Pacific Viperfish</div>
          </div>

          {/* Firefly Squid */}
          <div className={`creature-wrapper jelly-float bio-pulse ${activeCreature==='squid'?'creature-glow-active':''}`}
            style={{top:'70%',left:'62%','--jelly-delay':'2s',zIndex:14}}
            onClick={e => openCard('squid',e)}>
            <BioSquidSVG width={105}/>
            <div className="creature-label">Firefly Squid</div>
          </div>

          {/* Section panel */}
          <div className="section-content" style={{zIndex:20,textAlign:'center'}}>
            <div className="glass-panel">
              <div className="zone-label reveal-text">Zone 3</div>
              <div className="zone-depth reveal-text">1,000 – 4,000m</div>
              <h2 className="zone-title reveal-text">Midnight Zone</h2>
              <p className="zone-desc reveal-text">
                Total, absolute darkness. No sunlight has ever reached here. Creatures generate
                their own light through bioluminescence. Click any creature to discover its secrets.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: DEEP ABYSS ────────────────────────── */}
        <section className="ocean-section" style={{minHeight:'120vh'}}>
          {/* Bioluminescent floor plants */}
          <div className="plants-layer" style={{height:'52%',zIndex:6}}>
            {DEEP_PLANTS.map(({left,id},i) => (
              <div key={i} className="plant-svg-wrap bioglow"
                style={{left, opacity:0.88, '--sway-delay':`${i*0.4}s`}}
                onClick={e => openCard('bioplant',e)}>
                <BioPlant height={55+(i%5)*15} id={id}/>
              </div>
            ))}
          </div>

          {/* Anglerfish */}
          <div className={`creature-wrapper fish-swim-l bio-pulse ${activeCreature==='anglerfish'?'creature-glow-active':''}`}
            style={{top:'28%','--dur':'30s','--delay':'0s',zIndex:15}}
            onClick={e => openCard('anglerfish',e)}>
            <FishAnglerfish width={115}/>
            <div className="creature-label">Deep-Sea Anglerfish</div>
          </div>

          {/* Extra jellyfish */}
          <div className="creature-wrapper jelly-float bio-pulse"
            style={{top:'12%',right:'18%','--jelly-delay':'4s',zIndex:14}}
            onClick={e => openCard('jelly1',e)}>
            <JellyfishSVG width={88} color="#ff44aa"/>
            <div className="creature-label">Deep-Sea Jelly</div>
          </div>

          {/* Floating deep particles */}
          {Array.from({length:28},(_,i) => (
            <div key={i} className="dust-particle" style={{
              position:'absolute',
              left:`${(i*3.57)%100}%`,
              top:`${(i*3.33)%100}%`,
              '--dur': `${8+(i*0.55)%12}s`,
              '--delay': `${-(i*0.68)%15}s`,
              '--dx': `${((i%7)-3)*20}px`,
              '--dy': `${((i%5)-2)*25}px`,
            }}/>
          ))}

          <div className="section-content right" style={{zIndex:20}}>
            <div className="glass-panel">
              <div className="zone-label reveal-text">Zone 4</div>
              <div className="zone-depth reveal-text">4,000 – 6,000m</div>
              <h2 className="zone-title reveal-text">The Abyss</h2>
              <p className="zone-desc reveal-text">
                Pressure here exceeds 600 atmospheres. Temperatures hover near freezing.
                Yet life persists — alien, ancient, and extraordinary. Only bioluminescence
                breaks the eternal darkness.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: TITANIC ──────────────────────────── */}
        <section className="ocean-section" style={{minHeight:'135vh',alignItems:'flex-start',paddingTop:'7vh'}}>

          {/* Section header */}
          <div className="section-content" style={{textAlign:'center',zIndex:20}}>
            <div className="zone-label reveal-text">Final Destination</div>
            <div className="zone-depth reveal-text">3,810m · North Atlantic · 1912</div>
            <h2 className="zone-title reveal-text"
              style={{fontSize:'clamp(3rem,6vw,5.5rem)',fontFamily:'var(--font-title)'}}>
              RMS Titanic
            </h2>
            <p className="zone-desc reveal-text" style={{margin:'0 auto 2rem',maxWidth:'600px'}}>
              At 3,810 metres, the silent wreck rests in permanent darkness.
              Click the wreck to reveal its story.
            </p>
          </div>

          {/* Dense bioluminescent floor plants with extra glow */}
          <div className="plants-layer" style={{height:'56%',zIndex:12}}>
            {Array.from({length:32},(_,i) => (
              <div key={i} className="plant-svg-wrap bioglow"
                style={{
                  left:`${i*3.2}%`, opacity:0.92,
                  '--sway-delay':`${i*0.38}s`,
                }}
                onClick={e => openCard('bioplant',e)}>
                <BioPlant height={45+Math.abs(Math.sin(i)*35)} id={i+40}/>
              </div>
            ))}
          </div>

          {/* Titanic wreck */}
          <div
            className={`titanic-wrapper ${activeCreature==='titanic'?'active':''}`}
            style={{bottom:'7vh', zIndex:11}}
            onClick={e => openCard('titanic',e)}>
            {/* Atmospheric fog around the wreck */}
            <div className="titanic-fog"/>
            <div className="titanic-glow">
              <TitanicSVG width={Math.min(820, typeof window!=='undefined'?window.innerWidth*0.86:820)}/>
            </div>
            <div className="creature-label" style={{
              bottom:'108%', left:'50%', transform:'translateX(-50%)',
              fontSize:'0.72rem', letterSpacing:'5px',
              opacity: activeCreature==='titanic' ? 1 : undefined,
            }}>RMS TITANIC · 1912</div>
          </div>

          {/* Ocean floor sediment */}
          <div style={{
            position:'absolute', bottom:0, left:0, right:0, height:'10vh',
            background:'linear-gradient(to bottom, transparent, rgba(0,2,5,0.95))',
            zIndex:9,
          }}/>

          {/* Floor particles */}
          {Array.from({length:35},(_,i) => (
            <div key={i} className="dust-particle" style={{
              position:'absolute',
              left:`${(i*2.86)%100}%`,
              top:`${50+(i*1.43)%50}%`,
              '--dur': `${10+(i*0.55)%15}s`,
              '--delay': `${-(i*0.57)%20}s`,
              '--dx': `${((i%6)-2.5)*18}px`,
              '--dy': `${((i%4)-1.5)*18}px`,
            }}/>
          ))}
        </section>

        {/* ── FOOTER ─────────────────────────────────────── */}
        <footer style={{
          textAlign:'center', padding:'5rem 2rem 4rem',
          fontFamily:'var(--font-ui)', fontSize:'0.6rem',
          letterSpacing:'5px', color:'rgba(0,245,255,0.2)',
          zIndex:20, position:'relative',
        }}>
          <div style={{marginBottom:'0.6rem', color: 'rgba(0,245,255,0.3)'}}>JOURNEY TO THE OCEAN DEPTHS</div>
          <div>4,000m · 5 ZONES · INFINITE WONDER</div>
        </footer>
      </div>
    </>
  );
}
