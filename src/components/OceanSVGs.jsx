/* ─── OceanSVGs.jsx ─────────────────────────────────────────────────
   All inline SVG artwork for the Ocean Depths experience.
   Pure vector = crisp at any DPI, no external assets needed.
─────────────────────────────────────────────────────────────────── */

/* ── SHIP ─────────────────────────────────────────────────────── */
export function ShipSVG({ width = 420 }) {
  return (
    <svg width={width} viewBox="0 0 420 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hull */}
      <path d="M20 120 Q30 145 60 155 L360 155 Q390 145 400 120 Z" fill="#1a2a3a" stroke="#2a4060" strokeWidth="2"/>
      <path d="M60 155 L50 170 Q210 180 360 170 L360 155 Z" fill="#0d1e2e" stroke="#1a3a55" strokeWidth="1.5"/>
      {/* Hull waterline stripe */}
      <path d="M60 155 L360 155" stroke="#e84020" strokeWidth="3" strokeLinecap="round"/>
      {/* Main deck */}
      <rect x="40" y="100" width="340" height="22" rx="3" fill="#22364a" stroke="#2e4a66" strokeWidth="1.5"/>
      {/* Superstructure */}
      <rect x="130" y="60" width="160" height="42" rx="4" fill="#1e3248" stroke="#2a4860" strokeWidth="1.5"/>
      {/* Bridge windows */}
      {[150, 175, 200, 225, 250].map((x, i) => (
        <rect key={i} x={x} y="70" width="16" height="12" rx="2" fill="#00c8ff" opacity="0.7"
          stroke="#00a0d0" strokeWidth="1"/>
      ))}
      {/* Bridge top */}
      <rect x="150" y="45" width="120" height="18" rx="3" fill="#253e52" stroke="#2e4a66" strokeWidth="1.5"/>
      {/* Radar dome */}
      <ellipse cx="210" cy="42" rx="18" ry="8" fill="#1a3040" stroke="#2a4860" strokeWidth="1.5"/>
      {/* Antenna */}
      <line x1="210" y1="34" x2="210" y2="20" stroke="#4a6a88" strokeWidth="2"/>
      <circle cx="210" cy="18" r="4" fill="#00c8ff" opacity="0.9"/>
      {/* Funnel */}
      <rect x="280" y="55" width="28" height="48" rx="4" fill="#1a2e42" stroke="#223d52" strokeWidth="1.5"/>
      <ellipse cx="294" cy="55" rx="14" ry="5" fill="#223d52"/>
      <ellipse cx="294" cy="53" rx="10" ry="3" fill="#333" opacity="0.8"/>
      {/* Smoke */}
      {[0,1,2].map(i => (
        <ellipse key={i} cx={294 + i*5} cy={40 - i*12} rx={5 + i*3} ry={4 + i*2}
          fill="rgba(120,130,140,0.25)" />
      ))}
      {/* Crane arm */}
      <line x1="180" y1="100" x2="200" y2="45" stroke="#3a5a78" strokeWidth="4" strokeLinecap="round"/>
      <line x1="200" y1="45" x2="215" y2="42" stroke="#3a5a78" strokeWidth="3" strokeLinecap="round"/>
      {/* Portholes */}
      {[80,105,320,345].map((x,i) => (
        <circle key={i} cx={x} cy="112" r="6" fill="#00c8ff" opacity="0.5" stroke="#00a8d8" strokeWidth="1"/>
      ))}
      {/* Life rings */}
      <circle cx="100" cy="102" r="7" fill="none" stroke="#e84020" strokeWidth="3"/>
      <circle cx="320" cy="102" r="7" fill="none" stroke="#e84020" strokeWidth="3"/>
      {/* Anchor chain */}
      <path d="M70 155 Q68 160 66 168" stroke="#666" strokeWidth="2" strokeDasharray="4 3"/>
    </svg>
  );
}

/* ── SUBMARINE ────────────────────────────────────────────────── */
export function SubmarineSVG({ width = 220 }) {
  return (
    <svg width={width} viewBox="0 0 220 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main body */}
      <ellipse cx="105" cy="58" rx="90" ry="32" fill="#1a3a50" stroke="#2a5a78" strokeWidth="2"/>
      {/* Bow */}
      <path d="M15 58 Q5 58 8 48 Q8 38 20 36 L50 36" stroke="#2a5a78" strokeWidth="2" fill="none"/>
      {/* Top fin (conning tower) */}
      <rect x="90" y="24" width="40" height="28" rx="8" fill="#162e42" stroke="#2a4a66" strokeWidth="1.5"/>
      <rect x="98" y="22" width="24" height="6" rx="3" fill="#1a3848" stroke="#2a5070" strokeWidth="1"/>
      {/* Periscope */}
      <line x1="112" y1="16" x2="112" y2="22" stroke="#3a6080" strokeWidth="3" strokeLinecap="round"/>
      <rect x="106" y="12" width="12" height="6" rx="2" fill="#1a3848" stroke="#2a5070" strokeWidth="1"/>
      {/* Propeller */}
      <circle cx="190" cy="58" r="5" fill="#2a5070"/>
      <ellipse cx="190" cy="47" rx="4" ry="12" fill="#1e4060" stroke="#2a5a78" strokeWidth="1" transform="rotate(-15 190 47)"/>
      <ellipse cx="190" cy="69" rx="4" ry="12" fill="#1e4060" stroke="#2a5a78" strokeWidth="1" transform="rotate(15 190 69)"/>
      {/* Rudder fins */}
      <path d="M185 58 L200 44 L200 50" fill="#162e42" stroke="#2a4a66" strokeWidth="1"/>
      <path d="M185 58 L200 72 L200 66" fill="#162e42" stroke="#2a4a66" strokeWidth="1"/>
      {/* Porthole windows */}
      <circle cx="60" cy="58" r="10" fill="#003a55" stroke="#00c8ff" strokeWidth="2"/>
      <circle cx="60" cy="58" r="7" fill="#004d70" stroke="#00a0d0" strokeWidth="1"/>
      <circle cx="63" cy="55" r="2" fill="rgba(255,255,255,0.4)"/>
      <circle cx="85" cy="58" r="7" fill="#003a55" stroke="#0080aa" strokeWidth="1.5"/>
      <circle cx="88" cy="55" r="1.5" fill="rgba(255,255,255,0.35)"/>
      {/* Headlight */}
      <circle cx="20" cy="55" r="8" fill="#ffee88" opacity="0.9"/>
      <circle cx="20" cy="55" r="5" fill="#ffffff" opacity="0.8"/>
      {/* Hull stripes */}
      <path d="M50 30 L50 85" stroke="#2a5078" strokeWidth="1" opacity="0.5"/>
      <path d="M140 32 L140 84" stroke="#2a5078" strokeWidth="1" opacity="0.5"/>
      {/* Hatch detail */}
      <circle cx="110" cy="24" r="5" fill="#1a3040" stroke="#3a6080" strokeWidth="1.5"/>
    </svg>
  );
}

/* ── FISH (various) ───────────────────────────────────────────── */
export function FishTropical({ width = 90 }) {
  return (
    <svg width={width} viewBox="0 0 90 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="30" rx="32" ry="18" fill="#ff6b35" stroke="#e05020" strokeWidth="1.5"/>
      {/* Stripes */}
      <path d="M30 14 Q28 30 30 46" stroke="rgba(255,255,255,0.6)" strokeWidth="5" strokeLinecap="round"/>
      <path d="M45 13 Q43 30 45 47" stroke="rgba(0,0,0,0.2)" strokeWidth="3" strokeLinecap="round"/>
      {/* Tail */}
      <path d="M72 30 L88 14 L88 46 Z" fill="#ff8040" stroke="#e05020" strokeWidth="1.5"/>
      {/* Fins */}
      <path d="M35 14 Q45 4 55 14" fill="#ff9050" stroke="#e06030" strokeWidth="1"/>
      <path d="M35 46 Q45 56 55 46" fill="#ff9050" stroke="#e06030" strokeWidth="1"/>
      {/* Eye */}
      <circle cx="18" cy="27" r="7" fill="white" stroke="#333" strokeWidth="1"/>
      <circle cx="16" cy="27" r="4" fill="#222"/>
      <circle cx="14" cy="25" r="1.5" fill="white"/>
    </svg>
  );
}

export function FishAnglerfish({ width = 100 }) {
  return (
    <svg width={width} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="50" cy="45" rx="36" ry="26" fill="#1a0a2a" stroke="#2a0a40" strokeWidth="2"/>
      {/* Bioluminescent lure */}
      <path d="M50 20 Q42 5 38 -5" stroke="#2a1040" strokeWidth="2"/>
      <circle cx="37" cy="-7" r="6" fill="#00ff88" opacity="0.9"/>
      <circle cx="37" cy="-7" r="10" fill="rgba(0,255,136,0.2)"/>
      {/* Mouth */}
      <path d="M16 50 Q25 65 50 65 Q75 65 84 50" fill="#0a0015" stroke="#1a0030" strokeWidth="1.5"/>
      {/* Teeth */}
      {[25, 33, 42, 51, 60, 70, 78].map((x, i) => (
        <path key={i} d={`M${x} ${52 + (i%2)*4} L${x+3} ${62} L${x+6} ${52 + (i%2)*4}`}
          fill="rgba(255,255,255,0.7)" />
      ))}
      {/* Eyes */}
      <circle cx="28" cy="40" r="9" fill="#1a1a00" stroke="#3a3a00" strokeWidth="1.5"/>
      <circle cx="25" cy="39" r="6" fill="#ccaa00" opacity="0.8"/>
      <circle cx="23" cy="37" r="2" fill="#000"/>
      {/* Fins */}
      <path d="M60 25 Q75 18 80 32" fill="#150825" stroke="#2a1040" strokeWidth="1"/>
      <path d="M60 65 Q75 72 80 58" fill="#150825" stroke="#2a1040" strokeWidth="1"/>
      {/* Tail */}
      <path d="M86 45 L100 30 L100 60 Z" fill="#100820" stroke="#2a1040" strokeWidth="1.5"/>
    </svg>
  );
}

export function FishBasic({ width = 70, color = "#4488ff" }) {
  return (
    <svg width={width} viewBox="0 0 70 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="22" rx="24" ry="14" fill={color}/>
      <path d="M54 22 L70 10 L70 34 Z" fill={color} opacity="0.8"/>
      <path d="M20 10 Q30 5 40 10" fill={color} opacity="0.6"/>
      <circle cx="12" cy="20" r="5" fill="white" stroke="#333" strokeWidth="0.5"/>
      <circle cx="11" cy="20" r="3" fill="#111"/>
      <circle cx="10" cy="19" r="1" fill="white"/>
    </svg>
  );
}

/* ── SHARK ────────────────────────────────────────────────────── */
export function SharkSVG({ width = 280 }) {
  return (
    <svg width={width} viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <path d="M10 65 Q30 30 100 40 Q160 48 230 60 Q260 65 270 70 Q260 80 230 80 Q160 78 100 70 Q30 72 10 65 Z"
        fill="#4a6a88" stroke="#3a5a78" strokeWidth="1.5"/>
      {/* White belly */}
      <path d="M30 65 Q80 72 160 70 Q220 70 255 68 Q255 76 220 76 Q160 76 80 74 Q40 72 30 65 Z"
        fill="rgba(220,240,255,0.7)"/>
      {/* Dorsal fin */}
      <path d="M130 40 L155 10 L170 40 Z" fill="#3a5a70" stroke="#2a4a60" strokeWidth="1.5"/>
      {/* Pectoral fin */}
      <path d="M100 65 L80 95 L130 75 Z" fill="#3a5a70" stroke="#2a4a60" strokeWidth="1"/>
      {/* Caudal (tail) fin */}
      <path d="M250 62 L275 40 L272 68 L275 90 L250 75 Z" fill="#3a5a70" stroke="#2a4a60" strokeWidth="1.5"/>
      {/* Gills */}
      {[85, 95, 105].map((x, i) => (
        <path key={i} d={`M${x} 48 Q${x+2} 62 ${x} 72`} stroke="#2a4a60" strokeWidth="2" fill="none" opacity="0.7"/>
      ))}
      {/* Eye */}
      <circle cx="35" cy="58" r="8" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1"/>
      <circle cx="33" cy="57" r="5" fill="#111"/>
      <circle cx="31" cy="55" r="2" fill="rgba(255,255,255,0.3)"/>
      {/* Mouth */}
      <path d="M8 68 Q18 80 40 74" stroke="#2a3a4a" strokeWidth="2" fill="none"/>
      {/* Teeth */}
      {[14, 20, 27, 34].map((x, i) => (
        <path key={i} d={`M${x} ${71+i} L${x+2} ${78} L${x+5} ${71+i}`} fill="rgba(255,255,255,0.8)"/>
      ))}
    </svg>
  );
}

/* ── JELLYFISH ────────────────────────────────────────────────── */
export function JellyfishSVG({ width = 120, color = "#aa44ff" }) {
  const r = color === "#aa44ff" ? "170,80,255" : "0,200,180";
  return (
    <svg width={width} viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bell */}
      <path d="M10 60 Q10 10 60 10 Q110 10 110 60 Q110 80 104 90 Q88 100 60 100 Q32 100 16 90 Q10 80 10 60 Z"
        fill={`rgba(${r},0.35)`} stroke={`rgba(${r},0.8)`} strokeWidth="1.5"/>
      {/* Inner glow */}
      <ellipse cx="60" cy="55" rx="30" ry="28" fill={`rgba(${r},0.15)`}/>
      <ellipse cx="60" cy="50" rx="15" ry="15" fill={`rgba(${r},0.2)`}/>
      {/* Oral arms */}
      {[30, 45, 60, 75, 90].map((x, i) => (
        <path key={i}
          d={`M${x} 95 Q${x + (i%2===0?-12:12)} ${120 + i*8} ${x + (i%2===0?6:-6)} ${155 + i*5} Q${x+(i%2===0?-8:8)} ${165} ${x+(i%2===0?4:-4)} ${170}`}
          stroke={`rgba(${r},0.7)`} strokeWidth={2-i*0.2} fill="none"
          strokeLinecap="round"
        />
      ))}
      {/* Tentacles */}
      {[20, 35, 50, 65, 80, 95, 110].map((x, i) => (
        <path key={i}
          d={`M${x} 90 Q${x+(i%2===0?-15:15)} ${115} ${x+(i%2===0?5:-5)} ${140}`}
          stroke={`rgba(${r},0.5)`} strokeWidth="1" fill="none" strokeLinecap="round"
        />
      ))}
      {/* Bioluminescent spots */}
      {[[45,40],[65,35],[55,55],[75,50],[40,60]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill={`rgba(${r},0.8)`}
          style={{filter:`drop-shadow(0 0 4px rgba(${r},1))`}}/>
      ))}
    </svg>
  );
}

/* ── DEEP SEA CREATURE: Viperfish ─────────────────────────────── */
export function ViperfishSVG({ width = 140 }) {
  return (
    <svg width={width} viewBox="0 0 140 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <path d="M5 45 Q20 20 60 30 Q100 38 130 42 Q138 44 138 46 Q138 48 130 50 Q100 54 60 56 Q20 62 5 45 Z"
        fill="#050515" stroke="#1a0a30" strokeWidth="1.5"/>
      {/* Photophores (light organs) */}
      {[30,45,60,75,90,105,120].map((x, i) => (
        <circle key={i} cx={x} cy={46 + (i%2)*3} r="2.5" fill="#00ffaa"
          style={{filter:'drop-shadow(0 0 4px #00ffaa)'}}/>
      ))}
      {/* Dorsal spine */}
      <path d="M40 30 Q50 20 55 15 Q60 25 65 30" stroke="#1a0a30" strokeWidth="1.5" fill="none"/>
      {/* Eye */}
      <circle cx="15" cy="43" r="9" fill="#002210" stroke="#00ff88" strokeWidth="1"/>
      <circle cx="13" cy="43" r="6" fill="#00ff66" opacity="0.8"/>
      <circle cx="12" cy="42" r="3" fill="#000"/>
      <circle cx="11" cy="41" r="1" fill="rgba(255,255,255,0.5)"/>
      {/* Mouth & fangs */}
      <path d="M3 46 Q8 55 20 52" stroke="#1a0a30" strokeWidth="1.5" fill="none"/>
      {[6,10,14,18].map((y,i) => (
        <path key={i} d={`M${5+i*4} ${46} L${6+i*4} ${54} L${8+i*4} ${46}`} fill="rgba(200,255,200,0.7)"/>
      ))}
      {/* Tail */}
      <path d="M130 46 L140 34 L140 58 Z" fill="#050515" stroke="#1a0a30" strokeWidth="1"/>
    </svg>
  );
}

/* ── DEEP SEA CREATURE: Bioluminescent Squid ─────────────────── */
export function BioSquidSVG({ width = 110 }) {
  return (
    <svg width={width} viewBox="0 0 110 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Mantle */}
      <path d="M30 80 Q20 40 55 15 Q90 40 80 80 Q80 100 55 110 Q30 100 30 80 Z"
        fill="rgba(0,180,220,0.2)" stroke="rgba(0,245,255,0.8)" strokeWidth="1.5"/>
      {/* Fin tips */}
      <path d="M30 80 L10 65 L25 85 Z" fill="rgba(0,180,220,0.3)" stroke="rgba(0,245,255,0.6)" strokeWidth="1"/>
      <path d="M80 80 L100 65 L85 85 Z" fill="rgba(0,180,220,0.3)" stroke="rgba(0,245,255,0.6)" strokeWidth="1"/>
      {/* Inner glow */}
      <ellipse cx="55" cy="55" rx="18" ry="25" fill="rgba(0,245,255,0.1)"/>
      {/* Eyes */}
      <circle cx="40" cy="72" r="8" fill="rgba(0,50,80,0.8)" stroke="rgba(0,245,255,0.9)" strokeWidth="1.5"/>
      <circle cx="38" cy="72" r="5" fill="#000"/>
      <circle cx="36" cy="70" r="2" fill="rgba(0,245,255,0.8)"/>
      <circle cx="70" cy="72" r="8" fill="rgba(0,50,80,0.8)" stroke="rgba(0,245,255,0.9)" strokeWidth="1.5"/>
      <circle cx="68" cy="72" r="5" fill="#000"/>
      <circle cx="66" cy="70" r="2" fill="rgba(0,245,255,0.8)"/>
      {/* Tentacles */}
      {[35,40,45,50,55,60,65,70].map((x, i) => (
        <path key={i}
          d={`M${x} 108 Q${x + (i%2===0?-10:10)} ${128} ${x+(i%2===0?-5:5)} ${145} Q${x+(i%2===0?-12:12)} ${150} ${x+(i%2===0?-8:8)} ${155}`}
          stroke="rgba(0,245,255,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round"
        />
      ))}
      {/* Chromatophores */}
      {[[40,40],[55,30],[70,42],[50,60],[62,70]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="3.5" fill={`rgba(0,${180+i*15},${200+i*10},0.7)`}
          style={{filter:'drop-shadow(0 0 5px rgba(0,245,255,0.8))'}}/>
      ))}
      {/* Iridescent stripe */}
      <path d="M38 35 Q55 28 72 35" stroke="rgba(0,245,255,0.5)" strokeWidth="2" fill="none"/>
    </svg>
  );
}

/* ── TITANIC WRECK ────────────────────────────────────────────── */
export function TitanicSVG({ width = 800 }) {
  return (
    <svg width={width} viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ocean floor sediment */}
      <ellipse cx="400" cy="285" rx="380" ry="18" fill="rgba(40,55,30,0.7)"/>
      <ellipse cx="200" cy="290" rx="180" ry="12" fill="rgba(30,45,20,0.6)"/>
      <ellipse cx="620" cy="288" rx="160" ry="10" fill="rgba(30,45,20,0.5)"/>

      {/* === MAIN HULL (bow section, more intact) === */}
      {/* Hull bottom */}
      <path d="M60 220 Q80 250 120 260 L480 260 Q510 250 530 230 L530 180 L60 180 Z"
        fill="#3a2818" stroke="#4a3828" strokeWidth="1.5"/>
      {/* Hull side panels */}
      <path d="M60 180 L60 235 Q80 252 120 258" stroke="#4a3828" strokeWidth="1" fill="none"/>
      <path d="M530 180 L530 228 Q510 248 480 258" stroke="#4a3828" strokeWidth="1" fill="none"/>
      {/* Deck 1 */}
      <rect x="55" y="145" width="480" height="38" rx="2" fill="#2e2010" stroke="#3e3020" strokeWidth="1.5"/>
      {/* Deck 2 */}
      <rect x="80" y="115" width="380" height="34" rx="2" fill="#281c0a" stroke="#382c1a" strokeWidth="1.5"/>
      {/* Superstructure */}
      <rect x="100" y="80" width="280" height="40" rx="2" fill="#241808" stroke="#342818" strokeWidth="1.5"/>
      {/* Bridge */}
      <rect x="130" y="55" width="160" height="30" rx="2" fill="#201408" stroke="#302418" strokeWidth="1.5"/>

      {/* FUNNELS — all toppled/bent */}
      {/* Funnel 1 (mostly upright, top broken) */}
      <rect x="165" y="30" width="35" height="28" rx="3" fill="#281808" transform="rotate(-8 165 58)"/>
      <path d="M158 28 Q182 15 188 25" stroke="#281808" strokeWidth="2" fill="none"/>
      {/* Funnel 2 (fallen) */}
      <rect x="220" y="58" width="40" height="28" rx="3" fill="#241608" transform="rotate(45 220 58)"/>
      {/* Funnel 3 (completely toppled) */}
      <rect x="270" y="75" width="35" height="25" rx="3" fill="#241608" transform="rotate(80 270 75)"/>

      {/* Davits (lifeboat holders, bent) */}
      {[95, 145, 410, 460].map((x, i) => (
        <path key={i} d={`M${x} 145 Q${x+5} ${130+i*3} ${x+12} ${128}`}
          stroke="#181408" strokeWidth="2" fill="none"/>
      ))}

      {/* Portholes */}
      {[85, 115, 145, 175, 210, 250, 290, 340, 390, 430, 470, 505].map((x, i) => (
        <circle key={i} cx={x} cy={168} r="5" fill="#060504" stroke="#1a1608" strokeWidth="1"/>
      ))}
      {[95, 130, 165, 205, 250, 295, 340, 390, 430].map((x, i) => (
        <circle key={i} cx={x} cy={134} r="4" fill="#060504" stroke="#181408" strokeWidth="1"/>
      ))}

      {/* === STERN SECTION (broken off, tilted) === */}
      <path d="M580 190 Q590 240 620 255 L760 250 Q790 240 800 200 L800 160 L580 160 Z"
        fill="#382818" stroke="#483828" strokeWidth="1.5" transform="rotate(-15 580 200)"/>
      <rect x="590" y="130" width="180" height="32" rx="2" fill="#2e2010" stroke="#3e3020" strokeWidth="1.5"
        transform="rotate(-15 590 146)"/>

      {/* DEBRIS field between bow & stern */}
      {[530,550,565,572,578].map((x,i) => (
        <rect key={i} x={x} y={180+i*8} width={20+i*5} height={6+i} rx="1"
          fill="#302010" stroke="#403020" strokeWidth="1"
          transform={`rotate(${-20+i*8} ${x} ${184+i*8})`}/>
      ))}

      {/* ALGAE/SEAWEED growing on wreck */}
      {[90,140,200,280,360,430,500].map((x, i) => (
        <g key={i}>
          <path d={`M${x} 145 Q${x+8} ${128} ${x+3} ${110} Q${x-5} ${95} ${x+5} ${82}`}
            stroke={`rgba(${20+i*5},${80+i*8},${20+i*3},0.8)`} strokeWidth="3"
            strokeLinecap="round" fill="none"
            className="sway" style={{'--sway-dur':`${2+i*0.3}s`,'--sway-start':'-3deg','--sway-end':'3deg'}}/>
          <path d={`M${x-10} 145 Q${x-2} ${125} ${x-8} ${108} Q${x-15} ${92} ${x-6} ${80}`}
            stroke={`rgba(${15+i*4},${70+i*6},${15+i*3},0.7)`} strokeWidth="2.5"
            strokeLinecap="round" fill="none"
            className="sway" style={{'--sway-dur':`${2.5+i*0.2}s`,'--sway-start':'-4deg','--sway-end':'4deg'}}/>
        </g>
      ))}

      {/* RUST STREAKS */}
      {[120,160,230,310,400,460].map((x,i) => (
        <path key={i} d={`M${x} 145 Q${x+3} ${175} ${x+1} ${200}`}
          stroke="rgba(100,40,10,0.4)" strokeWidth="1.5" fill="none"/>
      ))}

      {/* BARNACLES */}
      {[100,150,200,250,320,380,440].map((x,i) => (
        <ellipse key={i} cx={x} cy={205} rx="4" ry="3" fill="rgba(60,55,40,0.8)" stroke="rgba(80,70,50,0.6)" strokeWidth="0.5"/>
      ))}

      {/* Deep-sea glowing organisms on the hull */}
      {[115, 195, 295, 385, 465].map((x, i) => (
        <circle key={i} cx={x} cy={160} r="2" fill="rgba(0,255,100,0.7)"
          style={{filter:'drop-shadow(0 0 4px #00ff64)'}}/>
      ))}
    </svg>
  );
}

/* ── PLANTS ───────────────────────────────────────────────────── */
export function Seaweed({ height = 120, color = "#1a7a3a", id }) {
  const c2 = color.replace("1a7a", "0d5a");
  return (
    <svg height={height} viewBox={`0 0 40 ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg"
      className="sway" style={{'--sway-dur': `${2.5 + (id||0)*0.4}s`, '--sway-start':'-5deg','--sway-end':'5deg'}}>
      <path d={`M20 ${height} Q28 ${height*0.75} 18 ${height*0.55} Q10 ${height*0.38} 22 ${height*0.2} Q30 ${height*0.08} 20 0`}
        stroke={color} strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d={`M20 ${height*0.8} Q8 ${height*0.68} 12 ${height*0.55}`}
        stroke={c2} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d={`M18 ${height*0.55} Q32 ${height*0.43} 26 ${height*0.32}`}
        stroke={c2} strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export function Kelp({ height = 180, id }) {
  return (
    <svg height={height} viewBox={`0 0 35 ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg"
      className="sway" style={{'--sway-dur': `${3.5 + (id||0)*0.3}s`, '--sway-start':'-4deg','--sway-end':'4deg'}}>
      {/* Main stipe */}
      <path d={`M17 ${height} Q24 ${height*0.78} 15 ${height*0.6} Q8 ${height*0.42} 20 ${height*0.25} Q28 ${height*0.1} 17 0`}
        stroke="#4a8020" strokeWidth="4" strokeLinecap="round" fill="none"/>
      {/* Blades */}
      {[0.7, 0.5, 0.32, 0.16].map((frac, i) => (
        <ellipse key={i}
          cx={i%2===0 ? 8 : 26} cy={height*frac}
          rx="9" ry="5"
          fill={`rgba(${30+i*8},${100+i*15},${10+i*5},0.75)`}
          stroke="#2a6010" strokeWidth="0.5"
          transform={`rotate(${i%2===0?-25:25} ${i%2===0?8:26} ${height*frac})`}
        />
      ))}
    </svg>
  );
}

export function Coral({ width = 80, color = "#ff4444", id }) {
  const branches = [[20,80,10,40],[30,80,20,30],[40,80,40,20],[40,80,55,40],[50,80,60,30],[60,80,70,40]];
  return (
    <svg width={width} viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="sway" style={{'--sway-dur': `${4 + (id||0)*0.2}s`, '--sway-start':'-2deg','--sway-end':'2deg'}}>
      {branches.map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color} strokeWidth={3 - i*0.2} strokeLinecap="round"/>
      ))}
      {/* Polyp tips */}
      {[[10,40],[20,30],[40,20],[55,38],[60,29],[70,39]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="4"
          fill={color.replace('44','88')} stroke={color} strokeWidth="0.5"/>
      ))}
      <line x1="40" y1="80" x2="40" y2="90" stroke="#553300" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}

export function BioPlant({ height = 90, id }) {
  return (
    <svg height={height} viewBox={`0 0 50 ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg"
      className="bioglow sway"
      style={{'--sway-dur': `${2 + (id||0)*0.35}s`, '--sway-start':'-6deg','--sway-end':'6deg'}}>
      <path d={`M25 ${height} Q32 ${height*0.7} 23 ${height*0.48} Q16 ${height*0.28} 28 ${height*0.12} Q36 ${height*0.04} 25 0`}
        stroke="rgba(0,255,150,0.8)" strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Glowing nodes */}
      {[0.75, 0.5, 0.28, 0.1].map((f, i) => (
        <circle key={i} cx={i%2===0?28:22} cy={height*f} r="4.5"
          fill={`rgba(0,${200+i*14},${130+i*18},0.7)`}
          style={{filter:'drop-shadow(0 0 6px rgba(0,255,150,0.9))'}}/>
      ))}
    </svg>
  );
}
