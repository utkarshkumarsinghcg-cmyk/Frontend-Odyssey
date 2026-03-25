import React, { useRef } from 'react';
import { Scroll, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function UIOverlay() {
  const scroll = useScroll();
  const fillRef = useRef();
  const depthTextRef = useRef();

  useFrame(() => {
    if (fillRef.current && depthTextRef.current) {
        // Update depth meter UI based on scroll progress
        const p = scroll.offset;
        fillRef.current.style.height = `${p * 100}%`;
        
        // Map 0-1 to 0-10,994 meters depth (Mariana Trench depth max)
        const depthMeters = Math.floor(p * 10994); 
        depthTextRef.current.innerText = `${depthMeters}m`;
    }
  });

  return (
    <Scroll html style={{ width: '100vw' }}>
      <div className="html-container">
        
        {/* Animated SVG wave at the top */}
        <svg className="svg-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" 
                d="M0,160 C320,300,420,0,740,160 C1060,320,1120,40,1440,160" />
        </svg>

        {/* Dynamic Static HUD element - Interactive Tracking */}
        <div className="depth-nav">
          <div className="depth-meter">
            <div className="depth-fill" ref={fillRef}></div>
          </div>
          <div className="depth-label" ref={depthTextRef}>0m</div>
        </div>

        {/* Section 1: Hero (Ocean Surface) */}
        <section>
          <div className="content">
            <h1 style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>Ocean Depths</h1>
            <p style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)', color: 'white' }}>
               A colossal exploratory vessel sits atop the water, bridging the gap between the infinite sky and the profound depths.
            </p>
            <div className="scroll-indicator">
              <div className="mouse">
                <div className="wheel"></div>
              </div>
              <small style={{textShadow: '1px 1px 2px black'}}>DIVE DEEPER</small>
            </div>
          </div>
        </section>

        {/* Section 2: Introduction (Sunlight Zone) */}
        <section>
          <div className="content" style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <h2 style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>Sunlight Zone</h2>
            <p style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)', color: 'white' }}>
               Epipelagic Zone. As we begin our descent, sunlight dances through the water. Drifting deeper, we leave the warmth behind to face the unknown.
            </p>
            <div className="glass-card" onClick={() => alert("Fun Fact: Plankton here produce 50% of Earth's oxygen.")}>
              <h3>Marine Nursery</h3>
              <p>Click to discover surface ecology.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Exploration (Twilight Zone / Sharks) */}
        <section>
          <div className="content">
            <h2 style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>Twilight Predators</h2>
            <p style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)', color: 'white' }}>
               Mesopelagic Zone. As sunlight fades entirely, powerful predators like the Great White Shark dominate the ecosystem. Precision, power, and instinct rule here.
            </p>
            <div className="glass-card" onClick={() => alert("Fact: Great Whites can sense the electromagnetic field of their prey.")}>
              <h3>Apex Hunter</h3>
              <p>Click to discover their sensory adaptions.</p>
            </div>
          </div>
        </section>

        {/* Section 4: Insight (Midnight Zone) */}
        <section>
          <div className="content" style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <h2 style={{ color: '#00ff88', textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>The Midnight Void</h2>
            <p style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)', color: 'lightgray' }}>
               Bathypelagic Zone. Pitch black and freezing. The only light comes from the creatures themselves. Bioluminescence flickers in the overwhelming darkness.
            </p>
          </div>
        </section>

        {/* Section 5: Conclusion (Abyssal Zone / Whales & Subs) */}
        <section>
          <div className="content">
            <h2 style={{ color: '#00f0ff', textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>The Abyssal Encounter</h2>
            <p style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)', color: 'lightgray' }}>
               Abyssopelagic Zone. Deep-sea submersibles rely on intense volumetric lighting to pierce the pitch black. Here, they discover the impossible: gigantic deep-sea leviathans navigating extreme pressure in total darkness.
            </p>
            <p style={{ fontStyle: 'italic', color: 'gray', marginTop: '1rem' }}>The ocean remains our greatest mystery.</p>
          </div>
        </section>

      </div>
    </Scroll>
  );
}
