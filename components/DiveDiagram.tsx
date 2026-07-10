import { DiveSite } from '@/lib/data'

// ─── canvas constants ───────────────────────────────────────────────────────
const W = 960          // total width
const H = 700          // total height  (taller for breathing room)
const TOP_BAR = 50     // top bar height
const PANEL_RIGHT = 700 // diagram width / right panel start
const SURFACE_Y = 100   // top of water
const BOTTOM_Y = 530    // bottom of diagram / start of footer strip
const TIMELINE_Y = 545  // timeline section start
const FOOTER_H = H - TIMELINE_Y  // 155px

function dY(depth: number, maxDepth: number) {
  return SURFACE_Y + (depth / maxDepth) * (BOTTOM_Y - SURFACE_Y - 10)
}

// ─── small reusable shapes ─────────────────────────────────────────────────
function Compass({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="0" cy="0" r="20" fill="#0d2035" stroke="#2d4a6f" strokeWidth="1.5"/>
      <polygon points="0,-14 4,5 0,2 -4,5" fill="#e2e8f0"/>
      <polygon points="0,14 4,-5 0,-2 -4,-5" fill="#475569"/>
      <text x="0" y="-18" fontSize="9" fill="#60a5fa" textAnchor="middle" fontWeight="800">N</text>
    </g>
  )
}

function SafetyStop({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="118" height="30" rx="6" fill="#15803d"/>
      <text x={x+59} y={y+12} fontSize="9" fill="#fff" textAnchor="middle" fontWeight="800">SAFETY STOP</text>
      <text x={x+59} y={y+24} fontSize="8" fill="#bbf7d0" textAnchor="middle">5m · 3 min</text>
    </g>
  )
}

function Boat({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M-32 0 L32 0 L22 14 L-22 14 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.2"/>
      <path d="M-10 -18 L-10 0" stroke="#94a3b8" strokeWidth="2"/>
      <path d="M-10 -18 L14 -8 L-10 -4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8"/>
    </g>
  )
}

function WaypointCircle({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="12" fill="#0a1628" stroke="#ffffff" strokeWidth="2.5"/>
      <text x={x} y={y+4} fontSize="11" fill="#fff" textAnchor="middle" fontWeight="900">{n}</text>
    </g>
  )
}

function MarineLifeTag({ x, y, name, depthLabel }: { x:number; y:number; name:string; depthLabel:string }) {
  const w = Math.max(name.length * 5.6, 65) + 14
  return (
    <g>
      <rect x={x} y={y} width={w} height="30" rx="4" fill="#0c2340" stroke="#2d4a6f" strokeWidth="1" opacity="0.95"/>
      <text x={x+7} y={y+13} fontSize="8.5" fill="#fbbf24" fontWeight="700">{name}</text>
      <text x={x+7} y={y+24} fontSize="8" fill="#60a5fa">{depthLabel}</text>
    </g>
  )
}

function HazardBadge({ x, y, label }: { x:number; y:number; label:string }) {
  const w = Math.min(label.length * 5.2 + 24, 240)
  return (
    <g>
      <rect x={x} y={y} width={w} height="18" rx="3" fill="#7f1d1d" opacity="0.9"/>
      <text x={x+6} y={y+13} fontSize="8" fill="#fca5a5" fontWeight="700">⚠ {label.slice(0,38)}</text>
    </g>
  )
}

function CurrentArrows({ x, y, label }: { x:number; y:number; label:string }) {
  return (
    <g>
      <text x={x} y={y-10} fontSize="8.5" fill="#60a5fa" fontWeight="600" letterSpacing="0.5">{label}</text>
      <text x={x} y={y+6} fontSize="14" fill="#38bdf8" opacity="0.85" letterSpacing="4" fontWeight="700">›  ›  ›  ›  ›</text>
    </g>
  )
}

// ─── terrain types ─────────────────────────────────────────────────────────

// Large cargo/transport wreck (Liberty style) — long hull parallel to shore
function WreckTerrain({ md }: { md: number }) {
  const wTop = dY(5, md), wBot = dY(md - 3, md)
  const wH = wBot - wTop
  return (
    <g>
      <path d={`M55 ${wBot+18} L${PANEL_RIGHT-10} ${wBot+10} L${PANEL_RIGHT-10} ${BOTTOM_Y+10} L55 ${BOTTOM_Y+10} Z`}
        fill="#78350f" opacity="0.4"/>
      {[110,170,240,310,390,460,530,600].map((cx,i) => (
        <g key={i}>
          <ellipse cx={cx} cy={wBot+16} rx="13" ry="7" fill="#059669" opacity="0.5"/>
          <path d={`M${cx} ${wBot+9} Q${cx-8} ${wBot-4} ${cx} ${wBot+2} Q${cx+8} ${wBot-4} ${cx} ${wBot+9}`} fill="#10b981" opacity="0.65"/>
        </g>
      ))}
      <rect x="100" y={wTop} width="430" height={wH} rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" opacity="0.92"/>
      {[145,205,265,325,385,445,495].map(cx => (
        <circle key={cx} cx={cx} cy={wTop + wH*0.35} r="7" fill="#0a1628" stroke="#475569" strokeWidth="1.5"/>
      ))}
      <rect x="185" y={wTop-32} width="120" height="34" rx="5" fill="#263244" stroke="#334155" strokeWidth="1.5"/>
      <rect x="300" y={wTop-22} width="80" height="24" rx="4" fill="#263244" stroke="#334155" strokeWidth="1"/>
      <line x1="228" y1={wTop-66} x2="228" y2={wTop-32} stroke="#475569" strokeWidth="2.5"/>
      <line x1="200" y1={wTop-50} x2="256" y2={wTop-50} stroke="#475569" strokeWidth="1.5"/>
      <text x="120" y={wTop-8} fontSize="8" fill="#60a5fa" fontWeight="700">BOW</text>
      <text x="502" y={wTop-8} fontSize="8" fill="#60a5fa" fontWeight="700">STERN</text>
      <text x="320" y={wTop+wH*0.55} fontSize="14" fill="#475569" textAnchor="middle" fontWeight="800" opacity="0.5">W R E C K</text>
      {[60,72,84,96,108].map(cx => <ellipse key={cx} cx={cx} cy={SURFACE_Y+5} rx="6" ry="3" fill="#374151" opacity="0.7"/>)}
    </g>
  )
}

// Small compact wreck — WWII patrol boat / fishing vessel sitting upright on sandy slope
function SmallWreckTerrain({ md }: { md: number }) {
  const sandY  = dY(md - 1, md)          // sandy bottom
  const hullY  = dY(md - 5, md)          // hull base sits here
  const hullH  = sandY - hullY           // hull height ~4m worth
  const hullW  = 180                     // compact — patrol boat
  const hullX  = 240                     // centred in diagram

  return (
    <g>
      {/* flat sandy bottom */}
      <path d={`M55 ${sandY} L${PANEL_RIGHT-10} ${sandY-6} L${PANEL_RIGHT-10} ${BOTTOM_Y+12} L55 ${BOTTOM_Y+12} Z`}
        fill="#78350f" opacity="0.38"/>
      <text x="420" y={sandY+20} fontSize="8" fill="#b45309" textAnchor="middle">FLAT SANDY BOTTOM</text>

      {/* sand ripples */}
      {[130,200,280,360,450,540,620].map((cx,i) => (
        <path key={i} d={`M${cx} ${sandY+4} Q${cx+18} ${sandY+1} ${cx+36} ${sandY+4}`}
          stroke="#92400e" strokeWidth="0.8" fill="none" opacity="0.5"/>
      ))}

      {/* coral growth around wreck base */}
      {[hullX-30, hullX+hullW+10, hullX+60, hullX+120].map((cx,i) => (
        <g key={i}>
          <ellipse cx={cx} cy={sandY} rx="14" ry="7" fill="#059669" opacity="0.55"/>
          <path d={`M${cx} ${sandY-7} Q${cx-8} ${sandY-20} ${cx} ${sandY-14} Q${cx+8} ${sandY-20} ${cx} ${sandY-7}`}
            fill="#10b981" opacity="0.7"/>
        </g>
      ))}

      {/* HULL — upright, compact */}
      {/* main hull body */}
      <path d={`M${hullX} ${hullY+hullH} L${hullX} ${hullY+6} Q${hullX+8} ${hullY} ${hullX+20} ${hullY} L${hullX+hullW-20} ${hullY} Q${hullX+hullW} ${hullY} ${hullX+hullW} ${hullY+8} L${hullX+hullW} ${hullY+hullH} Z`}
        fill="#1e293b" stroke="#334155" strokeWidth="2" opacity="0.94"/>

      {/* deck line */}
      <line x1={hullX} y1={hullY+10} x2={hullX+hullW} y2={hullY+10} stroke="#334155" strokeWidth="1" opacity="0.7"/>

      {/* wheelhouse / bridge — small, off-centre */}
      <rect x={hullX+35} y={hullY-28} width="60" height="30" rx="3" fill="#263244" stroke="#475569" strokeWidth="1.5"/>
      {/* windows on wheelhouse */}
      {[hullX+42, hullX+58, hullX+74].map(wx => (
        <rect key={wx} x={wx} y={hullY-22} width="8" height="6" rx="1" fill="#0a1628" stroke="#475569" strokeWidth="0.8"/>
      ))}

      {/* gun mount suggestion on bow */}
      <circle cx={hullX+22} cy={hullY+4} r="6" fill="#0f172a" stroke="#475569" strokeWidth="1"/>
      <line x1={hullX+22} y1={hullY+4} x2={hullX+10} y2={hullY-8} stroke="#475569" strokeWidth="2"/>

      {/* mast */}
      <line x1={hullX+60} y1={hullY-28} x2={hullX+62} y2={hullY-70} stroke="#475569" strokeWidth="1.5"/>
      <line x1={hullX+44} y1={hullY-52} x2={hullX+80} y2={hullY-52} stroke="#475569" strokeWidth="1"/>

      {/* portholes — fewer, smaller */}
      {[hullX+20, hullX+55, hullX+90, hullX+130, hullX+160].map((px,i) => (
        <circle key={i} cx={px} cy={hullY+hullH*0.45} r="5" fill="#0a1628" stroke="#475569" strokeWidth="1.2"/>
      ))}

      {/* coral/encrustation on hull */}
      {[hullX+10, hullX+80, hullX+150, hullX+170].map((cx,i) => (
        <path key={i} d={`M${cx} ${hullY+hullH} Q${cx-5} ${hullY+hullH-12} ${cx} ${hullY+hullH-8} Q${cx+5} ${hullY+hullH-12} ${cx} ${hullY+hullH}`}
          fill={i%2===0?'#10b981':'#0891b2'} opacity="0.6"/>
      ))}

      {/* glassfish swarm around wreck */}
      {Array.from({length:18}).map((_,i) => {
        const gx = hullX + 20 + (i*11)%160
        const gy = hullY - 10 + (i*7)%40
        return <ellipse key={i} cx={gx} cy={gy} rx="2" ry="1" fill="#e2e8f0" opacity="0.5"/>
      })}
      <text x={hullX+30} y={hullY-78} fontSize="7.5" fill="#94a3b8">GLASSFISH SCHOOL</text>

      {/* labels */}
      <text x={hullX+8} y={hullY-6} fontSize="8" fill="#60a5fa" fontWeight="700">BOW</text>
      <text x={hullX+hullW-26} y={hullY-6} fontSize="8" fill="#60a5fa" fontWeight="700">STERN</text>
      <text x={hullX+hullW/2} y={hullY+hullH*0.7} fontSize="10" fill="#475569" textAnchor="middle" fontWeight="800" opacity="0.6">PATROL BOAT</text>
    </g>
  )
}

function SmallWreckRoute({ md, shore }: { md: number; shore?: boolean }) {
  const sandY  = dY(md - 1, md)
  const hullY  = dY(md - 5, md)
  const hullX  = 240
  const hullW  = 180
  const y5     = dY(5, md)

  if (shore) {
    // ① beach → ② descend to wreck bow → ③ along deck to stern → ④ sandy bottom →
    // ⑤ ascend back toward shore, safety stop near beach → exit
    return (
      <g>
        {/* ① entry at waterline */}
        <WaypointCircle x={118} y={SURFACE_Y + 10} n={1}/>
        {/* swim out and descend to wreck */}
        <path d={`M118 ${SURFACE_Y+10} Q180 ${dY(md*0.3,md)} 230 ${hullY+4}`}
          stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
        {/* ② bow */}
        <WaypointCircle x={hullX} y={hullY+4} n={2}/>
        {/* along deck */}
        <path d={`M${hullX} ${hullY+4} L${hullX+hullW} ${hullY+6}`}
          stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
        {/* ③ stern */}
        <WaypointCircle x={hullX+hullW} y={hullY+6} n={3}/>
        {/* drop to sandy bottom */}
        <path d={`M${hullX+hullW} ${hullY+6} Q${hullX+hullW+30} ${sandY-6} ${hullX+hullW+50} ${sandY}`}
          stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
        {/* ④ sandy bottom */}
        <WaypointCircle x={hullX+hullW+50} y={sandY-4} n={4}/>
        {/* ascend back toward shore */}
        <path d={`M${hullX+hullW+50} ${sandY} Q${hullX+60} ${dY(md*0.4,md)} 200 ${y5}`}
          stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
        {/* ⑤ safety stop near shore */}
        <WaypointCircle x={200} y={y5} n={5}/>
        <SafetyStop x={212} y={y5-36}/>
        {/* exit to beach */}
        <path d={`M200 ${y5} Q155 ${SURFACE_Y+8} 118 ${SURFACE_Y+10}`}
          stroke="#fff" strokeWidth="1.5" strokeDasharray="4,4" fill="none" opacity="0.5"/>
        <text x="150" y={SURFACE_Y-4} fontSize="7.5" fill="#22c55e" fontWeight="700">EXIT</text>
      </g>
    )
  }

  // boat small wreck
  return (
    <g>
      <path d={`M350 ${SURFACE_Y} Q340 ${y5} 330 ${hullY-20}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={350} y={SURFACE_Y+8} n={1}/>
      <path d={`M330 ${hullY-20} Q300 ${hullY-6} ${hullX+hullW/2} ${hullY+4}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={hullX+hullW/2} y={hullY+4} n={2}/>
      <path d={`M${hullX+hullW/2} ${hullY+4} L${hullX+hullW} ${hullY+6}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={hullX+hullW} y={hullY+6} n={3}/>
      <path d={`M${hullX+hullW} ${hullY+6} Q${hullX+hullW+30} ${sandY-6} ${hullX+hullW+50} ${sandY}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={hullX+hullW+50} y={sandY-4} n={4}/>
      <path d={`M${hullX+hullW+50} ${sandY} Q${hullX+hullW+100} ${dY(md*0.3,md)} ${hullX+hullW+120} ${y5}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={hullX+hullW+120} y={y5} n={5}/>
      <SafetyStop x={hullX+hullW+132} y={y5-36}/>
    </g>
  )
}

function WallTerrain({ md }: { md: number }) {
  return (
    <g>
      <rect x="65" y={SURFACE_Y} width="42" height={BOTTOM_Y - SURFACE_Y} fill="#162032" stroke="#1e3a5f" strokeWidth="1.5"/>
      {[SURFACE_Y+25, SURFACE_Y+75, SURFACE_Y+130, SURFACE_Y+190, SURFACE_Y+250, SURFACE_Y+310, SURFACE_Y+365, SURFACE_Y+410].map((wy,i) => (
        <g key={i}>
          <path d={`M65 ${wy} Q48 ${wy-24} 36 ${wy-15} M65 ${wy} Q54 ${wy-28} 44 ${wy-18}`}
            stroke={i%2===0?'#7c3aed':'#0891b2'} strokeWidth="1.8" fill="none" opacity="0.85"/>
          <path d={`M65 ${wy+16} Q44 ${wy+5} 33 ${wy+12} Q50 ${wy+20} 65 ${wy+16}`} fill="#10b981" opacity="0.5"/>
        </g>
      ))}
      <path d={`M107 ${BOTTOM_Y-12} Q280 ${BOTTOM_Y+4} ${PANEL_RIGHT-10} ${BOTTOM_Y-2} L${PANEL_RIGHT-10} ${BOTTOM_Y+12} L107 ${BOTTOM_Y+12} Z`}
        fill="#78350f" opacity="0.38"/>
      <text x="400" y={BOTTOM_Y+6} fontSize="8" fill="#b45309" textAnchor="middle">SANDY SLOPE</text>
      <text x="42" y={dY(md*0.5,md)} fontSize="8" fill="#475569" textAnchor="middle"
        transform={`rotate(-90,36,${dY(md*0.5,md)})`}>DROP-OFF</text>
    </g>
  )
}

function ReefSlopeTerrain({ md }: { md: number }) {
  const p1y=dY(md*0.25,md), p2y=dY(md*0.5,md), p3y=dY(md*0.68,md), p4y=dY(md*0.82,md)
  return (
    <g>
      <path d={`M55 ${p1y} Q180 ${p1y+18} 310 ${p2y} Q440 ${p3y} 610 ${p4y} L${PANEL_RIGHT-10} ${BOTTOM_Y+12} L55 ${BOTTOM_Y+12} Z`}
        fill="#1a3a2a" opacity="0.82"/>
      {[[75,p1y-4],[140,p1y+16],[210,p2y-14],[290,p2y+7],[370,p3y-12],[450,p3y+4],[540,p4y-10],[620,p4y]].map(([cx,cy],i) => (
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx="20" ry="12" fill={i%3===0?'#0e4f3a':i%3===1?'#164e63':'#2d1b69'} opacity="0.88"/>
          <path d={`M${cx} ${cy-12} Q${cx-11} ${cy-28} ${cx} ${cy-21} Q${cx+11} ${cy-28} ${cx} ${cy-12}`} fill="#10b981" opacity="0.72"/>
        </g>
      ))}
      <ellipse cx="480" cy={p4y+24} rx="70" ry="11" fill="#78350f" opacity="0.32"/>
      <text x="480" y={p4y+29} fontSize="7.5" fill="#b45309" textAnchor="middle">SANDY SLOPE</text>
    </g>
  )
}

function PinnacleTerrain({ md }: { md: number }) {
  const peak = dY(6, md)
  return (
    <g>
      <path d={`M55 ${BOTTOM_Y} Q200 ${BOTTOM_Y-22} 300 ${peak+22} Q345 ${peak} 390 ${peak+22} Q490 ${BOTTOM_Y-22} ${PANEL_RIGHT-10} ${BOTTOM_Y} L${PANEL_RIGHT-10} ${BOTTOM_Y+12} L55 ${BOTTOM_Y+12} Z`}
        fill="#1a3a2a" opacity="0.88"/>
      {[240,285,340,395,450].map((cx,i) => {
        const cy = i===2 ? peak+6 : (i===0||i===4) ? peak+68 : peak+28
        return (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx="17" ry="10" fill="#0e4f3a" opacity="0.88"/>
            <path d={`M${cx} ${cy-10} Q${cx-10} ${cy-25} ${cx} ${cy-18} Q${cx+10} ${cy-25} ${cx} ${cy-10}`} fill="#10b981" opacity="0.78"/>
          </g>
        )
      })}
      <text x="345" y={peak-8} fontSize="8" fill="#34d399" textAnchor="middle" fontWeight="700">PINNACLE / SEAMOUNT</text>
    </g>
  )
}

function MuckTerrain({ md }: { md: number }) {
  const flatY = dY(md*0.82, md)
  return (
    <g>
      <path d={`M55 ${flatY} Q350 ${flatY+10} ${PANEL_RIGHT-10} ${flatY} L${PANEL_RIGHT-10} ${BOTTOM_Y+12} L55 ${BOTTOM_Y+12} Z`}
        fill="#3b2a1a" opacity="0.65"/>
      <text x="350" y={flatY+30} fontSize="8" fill="#92400e" textAnchor="middle">SILTY MUCK BOTTOM</text>
      {[100,170,240,330,420,510,590].map((cx,i) => (
        <ellipse key={i} cx={cx} cy={flatY+8} rx="12" ry="6" fill="#4a3728" opacity="0.7"/>
      ))}
    </g>
  )
}

function BoatReefTerrain({ md }: { md: number }) {
  const rtop = dY(md*0.28, md)
  return (
    <g>
      <path d={`M100 ${rtop} Q260 ${rtop-16} 400 ${rtop+10} Q510 ${rtop+34} ${PANEL_RIGHT-10} ${dY(md*0.55,md)} L${PANEL_RIGHT-10} ${BOTTOM_Y+12} L100 ${BOTTOM_Y+12} Z`}
        fill="#1a3a2a" opacity="0.82"/>
      {[140,210,290,380,470,560,630].map((cx,i) => {
        const cy = dY(md*(0.26+i*0.04), md)
        return (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx="22" ry="13" fill={i%2===0?'#0c4a6e':'#064e3b'} opacity="0.88"/>
            <path d={`M${cx} ${cy-13} Q${cx-13} ${cy-30} ${cx} ${cy-23} Q${cx+13} ${cy-30} ${cx} ${cy-13}`} fill="#10b981" opacity="0.72"/>
          </g>
        )
      })}
      <ellipse cx="330" cy={dY(md*0.38,md)} rx="42" ry="20" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7"/>
      <text x="330" y={dY(md*0.38,md)+5} fontSize="8" fill="#fbbf24" textAnchor="middle" fontWeight="700">CLEANING STATION</text>
    </g>
  )
}

// ─── dive routes ────────────────────────────────────────────────────────────

// Shore U-shape: entry beach left → swim out & descend → deep point right → return toward shore at 5m → safety stop near shore → exit beach
// Boat out-and-back: drop right-of-centre → descend → deep → ascend → safety stop → SMB pickup

function WreckRoute({ md, shore }: { md: number; shore?: boolean }) {
  const y5 = dY(5, md), yMax = dY(md - 4, md)

  if (shore) {
    // ① beach entry → ② descend to wreck bow (mid-distance) → ③ along wreck to stern (far) →
    // ④ turn & begin ascent → ⑤ safety stop back near shore
    return (
      <g>
        {/* ① entry at waterline */}
        <WaypointCircle x={118} y={SURFACE_Y + 10} n={1}/>
        {/* descend */}
        <path d={`M118 ${SURFACE_Y+10} Q160 ${y5+10} 200 ${dY(md*0.25,md)} Q240 ${dY(md*0.5,md)} 280 ${y5+12}`}
          stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
        {/* ② wreck bow */}
        <WaypointCircle x={280} y={y5+12} n={2}/>
        {/* along wreck deck to stern */}
        <path d={`M280 ${y5+12} Q390 ${y5+6} 480 ${yMax}`}
          stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
        {/* ③ deepest point / stern */}
        <WaypointCircle x={480} y={yMax} n={3}/>
        {/* turn — ascend back toward shore */}
        <path d={`M480 ${yMax} Q420 ${dY(md*0.5,md)} 320 ${dY(md*0.3,md)} Q240 ${y5+6} 180 ${y5}`}
          stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
        {/* ④ ascending, mid-way back */}
        <WaypointCircle x={310} y={dY(md*0.28,md)} n={4}/>
        {/* ⑤ safety stop close to shore */}
        <WaypointCircle x={180} y={y5} n={5}/>
        <SafetyStop x={192} y={y5-36}/>
        {/* exit arrow back to beach */}
        <path d={`M180 ${y5} Q148 ${SURFACE_Y+8} 118 ${SURFACE_Y+10}`}
          stroke="#fff" strokeWidth="1.5" strokeDasharray="4,4" fill="none" opacity="0.5"/>
        <text x="140" y={SURFACE_Y-4} fontSize="7.5" fill="#22c55e" fontWeight="700">EXIT</text>
      </g>
    )
  }

  // boat wreck
  return (
    <g>
      <path d={`M300 ${SURFACE_Y} Q290 ${y5-4} 280 ${y5+14}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={300} y={SURFACE_Y+8} n={1}/>
      <path d={`M280 ${y5+14} Q360 ${y5-2} 440 ${y5+12}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={360} y={y5+8} n={2}/>
      <path d={`M440 ${y5+12} Q490 ${dY(md*0.58,md)} 520 ${yMax}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={480} y={dY(md*0.56,md)} n={3}/>
      <WaypointCircle x={520} y={yMax} n={4}/>
      <path d={`M520 ${yMax} Q540 ${dY(10,md)} 550 ${y5}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={550} y={y5} n={5}/>
      <SafetyStop x={562} y={y5-36}/>
    </g>
  )
}

function WallRoute({ md, shore }: { md: number; shore?: boolean }) {
  const y5 = dY(5, md), yMax = dY(md - 4, md)

  if (shore) {
    // ① beach → ② top of wall shallow → ③ deepest point along wall →
    // ④ start return ascent along wall → ⑤ safety stop back near shore → exit
    return (
      <g>
        {/* ① entry */}
        <WaypointCircle x={118} y={SURFACE_Y + 10} n={1}/>
        {/* swim out and descend to wall top */}
        <path d={`M118 ${SURFACE_Y+10} Q150 ${y5+4} 165 ${dY(md*0.2,md)}`}
          stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
        {/* ② top of wall */}
        <WaypointCircle x={165} y={dY(md*0.18,md)} n={2}/>
        {/* descend along wall face */}
        <path d={`M165 ${dY(md*0.18,md)} Q172 ${dY(md*0.5,md)} 178 ${yMax-14}`}
          stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
        {/* ③ deepest point */}
        <WaypointCircle x={178} y={yMax-14} n={3}/>
        {/* swim along wall at depth then begin ascending toward shore */}
        <path d={`M178 ${yMax-14} Q260 ${dY(md*0.55,md)} 300 ${dY(md*0.35,md)} Q280 ${y5+8} 210 ${y5}`}
          stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
        {/* ④ mid-ascent */}
        <WaypointCircle x={280} y={dY(md*0.32,md)} n={4}/>
        {/* ⑤ safety stop near shore */}
        <WaypointCircle x={210} y={y5} n={5}/>
        <SafetyStop x={222} y={y5-36}/>
        {/* exit back to beach */}
        <path d={`M210 ${y5} Q160 ${SURFACE_Y+8} 118 ${SURFACE_Y+10}`}
          stroke="#fff" strokeWidth="1.5" strokeDasharray="4,4" fill="none" opacity="0.5"/>
        <text x="155" y={SURFACE_Y-4} fontSize="7.5" fill="#22c55e" fontWeight="700">EXIT</text>
      </g>
    )
  }

  // boat wall
  return (
    <g>
      <path d={`M380 ${SURFACE_Y} Q350 ${y5} 310 ${dY(16,md)}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={380} y={SURFACE_Y+10} n={1}/>
      <path d={`M310 ${dY(16,md)} Q280 ${dY(md*0.45,md)} 265 ${yMax-18}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={295} y={dY(md*0.38,md)} n={2}/>
      <WaypointCircle x={265} y={yMax-18} n={3}/>
      <path d={`M265 ${yMax-18} Q340 ${dY(md*0.38,md)} 490 ${dY(18,md)} Q550 ${y5+10} 570 ${y5}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={470} y={dY(18,md)} n={4}/>
      <WaypointCircle x={570} y={y5} n={5}/>
      <SafetyStop x={582} y={y5-36}/>
    </g>
  )
}

function ReefRoute({ md, shore }: { md: number; shore?: boolean }) {
  const y5 = dY(5, md), yMax = dY(md * 0.82, md)

  if (shore) {
    // ① beach → swim out descending → ② mid reef → ③ deepest point (far out) →
    // ④ turn & head back toward shore ascending → ⑤ safety stop near shore → exit
    return (
      <g>
        {/* ① entry */}
        <WaypointCircle x={118} y={SURFACE_Y + 10} n={1}/>
        {/* swim out, descend along slope */}
        <path d={`M118 ${SURFACE_Y+10} Q180 ${dY(md*0.18,md)} 240 ${dY(md*0.38,md)}`}
          stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
        {/* ② mid reef */}
        <WaypointCircle x={240} y={dY(md*0.36,md)} n={2}/>
        {/* continue out to deepest */}
        <path d={`M240 ${dY(md*0.38,md)} Q340 ${dY(md*0.6,md)} 430 ${yMax}`}
          stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
        {/* ③ deepest / turn point */}
        <WaypointCircle x={430} y={yMax} n={3}/>
        {/* return toward shore, ascending */}
        <path d={`M430 ${yMax} Q370 ${dY(md*0.5,md)} 290 ${dY(md*0.28,md)} Q230 ${y5+10} 190 ${y5}`}
          stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
        {/* ④ ascending, heading home */}
        <WaypointCircle x={290} y={dY(md*0.26,md)} n={4}/>
        {/* ⑤ safety stop near shore */}
        <WaypointCircle x={190} y={y5} n={5}/>
        <SafetyStop x={202} y={y5-36}/>
        {/* exit arrow to beach */}
        <path d={`M190 ${y5} Q150 ${SURFACE_Y+8} 118 ${SURFACE_Y+10}`}
          stroke="#fff" strokeWidth="1.5" strokeDasharray="4,4" fill="none" opacity="0.5"/>
        <text x="148" y={SURFACE_Y-4} fontSize="7.5" fill="#22c55e" fontWeight="700">EXIT</text>
      </g>
    )
  }

  // boat reef
  const startX = 240
  return (
    <g>
      <path d={`M${startX} ${SURFACE_Y} Q${startX+20} ${y5+8} ${startX+40} ${dY(md*0.28,md)}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={startX+4} y={SURFACE_Y+10} n={1}/>
      <path d={`M${startX+40} ${dY(md*0.28,md)} Q${startX+120} ${dY(md*0.46,md)} ${startX+180} ${dY(md*0.54,md)}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={startX+110} y={dY(md*0.44,md)} n={2}/>
      <path d={`M${startX+180} ${dY(md*0.54,md)} Q${startX+240} ${dY(md*0.7,md)} ${startX+290} ${yMax}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={startX+220} y={dY(md*0.66,md)} n={3}/>
      <WaypointCircle x={startX+290} y={yMax} n={4}/>
      <path d={`M${startX+290} ${yMax} Q${startX+330} ${dY(md*0.28,md)} ${startX+360} ${y5}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={startX+360} y={y5} n={5}/>
      <SafetyStop x={startX+372} y={y5-36}/>
    </g>
  )
}

function DriftRoute({ md }: { md: number }) {
  const y5=dY(5,md), yMid=dY(md*0.5,md)
  return (
    <g>
      <path d={`M90 ${SURFACE_Y} Q100 ${y5} 110 ${dY(md*0.28,md)}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={92} y={SURFACE_Y+10} n={1}/>
      <path d={`M110 ${dY(md*0.28,md)} Q230 ${yMid-8} 370 ${dY(md*0.54,md)} Q480 ${yMid+8} 590 ${dY(md*0.38,md)}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={230} y={yMid} n={2}/>
      <WaypointCircle x={380} y={dY(md*0.54,md)} n={3}/>
      <path d={`M590 ${dY(md*0.38,md)} Q620 ${dY(md*0.18,md)} 635 ${y5}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={590} y={dY(md*0.38,md)} n={4}/>
      <WaypointCircle x={635} y={y5} n={5}/>
      <SafetyStop x={520} y={y5-36}/>
    </g>
  )
}

// ─── main component ────────────────────────────────────────────────────────
export default function DiveDiagram({ site }: { site: DiveSite }) {
  const { maxDepth:md, minDepth, avgDepth, diagramType, name, area,
          current, access, visibility, temp, difficulty, minCert,
          bestTime, type, marineLife, safetyNotes, bestSeason } = site

  const depthMarkers: number[] = []
  const step = md <= 20 ? 5 : md <= 40 ? 5 : 10
  for (let d = 0; d <= md; d += step) depthMarkers.push(d)

  const isWreck      = diagramType === 'wreck'
  const isSmallWreck = diagramType === 'smallwreck'
  const isWall     = diagramType === 'wall'
  const isDrift    = type === 'Drift'
  const isPinnacle = name.toLowerCase().includes('magic') || name.toLowerCase().includes('pinnacle') || name.toLowerCase().includes('mount')
  const isMuck     = type === 'Muck'
  const isBoat     = access === 'Boat'
  const hasStrong  = current.toLowerCase().includes('strong') || current.toLowerCase().includes('very')
  const ml = marineLife.slice(0, 3)
  const hazards = safetyNotes.slice(0, 3)

  // right panel y positions
  const LEG_Y   = TOP_BAR + 10
  const HAZ_Y   = LEG_Y + 180
  const WPT_Y   = HAZ_Y + hazards.length * 24 + 42

  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
      style={{ width:'100%', height:'auto', display:'block',
               fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif" }}>
      <defs>
        <linearGradient id={`w-${site.slug}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0369a1" stopOpacity="0.5"/>
          <stop offset="45%"  stopColor="#075985" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#020d1a" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id={`s-${site.slug}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#bae6fd"/>
          <stop offset="100%" stopColor="#93c5fd"/>
        </linearGradient>
        <linearGradient id={`n-${site.slug}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#070f1c"/>
          <stop offset="100%" stopColor="#0d1f36"/>
        </linearGradient>
      </defs>

      {/* ── BASE ── */}
      <rect width={W} height={H} fill="#060e1c"/>

      {/* ── TOP BAR ── */}
      <rect x="0" y="0" width={W} height={TOP_BAR} fill={`url(#n-${site.slug})`}/>
      <rect x="0" y={TOP_BAR-1} width={W} height="1" fill="#1e3a5f"/>

      <rect x="12" y="10" width="118" height="28" rx="5" fill="#ef4444"/>
      <text x="71" y="28" fontSize="11" fill="#fff" textAnchor="middle" fontWeight="900" letterSpacing="0.5">DIVE BRIEFING</text>

      <text x="144" y="22" fontSize="17" fill="#ffffff" fontWeight="900" letterSpacing="-0.3">{name.toUpperCase()}</text>
      <text x="144" y="40" fontSize="9"  fill="#60a5fa">{area}  ·  Indonesia</text>

      <rect x={W-284} y="11" width="110" height="26" rx="13" fill="#0d1f36" stroke="#3b82f6" strokeWidth="1"/>
      <text x={W-229} y="28" fontSize="9" fill="#60a5fa" textAnchor="middle" fontWeight="700">#{site.rank} in {area}</text>

      <rect x={W-168} y="11" width="156" height="26" rx="13" fill="#052e16" stroke="#16a34a" strokeWidth="1"/>
      <text x={W-162} y="28" fontSize="9" fill="#22c55e" fontWeight="700">✓  Admin Verified</text>

      {/* ── SKY ── */}
      <rect x="0" y={TOP_BAR} width={PANEL_RIGHT} height={SURFACE_Y - TOP_BAR} fill={`url(#s-${site.slug})`}/>

      {/* ── WATER ── */}
      <rect x="0" y={SURFACE_Y} width={PANEL_RIGHT} height={BOTTOM_Y - SURFACE_Y + 15} fill={`url(#w-${site.slug})`}/>

      {/* surface line */}
      <line x1="0" y1={SURFACE_Y} x2={PANEL_RIGHT} y2={SURFACE_Y} stroke="#7dd3fc" strokeWidth="1.2" strokeDasharray="7,4" opacity="0.65"/>
      <text x="68" y={SURFACE_Y - 5} fontSize="8.5" fill="#94a3b8" fontWeight="600">SURFACE</text>

      {/* depth grid */}
      {depthMarkers.map(d => {
        const y = dY(d, md)
        if (y > BOTTOM_Y + 8) return null
        const isMax = d === md
        return (
          <g key={d}>
            <line x1="68" y1={y} x2={PANEL_RIGHT - 4} y2={y}
              stroke={isMax ? '#ef4444' : '#1e3a5f'}
              strokeWidth={isMax ? 1.2 : 0.5}
              strokeDasharray={isMax ? '5,3' : '2,7'}
              opacity={isMax ? 0.9 : 0.65}/>
            <text x="62" y={y+4} fontSize="8.5" fill={isMax ? '#ef4444' : '#60a5fa'}
              textAnchor="end" fontWeight={isMax ? '800' : '400'}>{d}m</text>
            {isMax && (
              <text x="75" y={y-6} fontSize="8" fill="#ef4444" fontWeight="800">MAX DEPTH {d}m</text>
            )}
          </g>
        )
      })}

      {/* avg depth */}
      <line x1="68" y1={dY(avgDepth,md)} x2={PANEL_RIGHT*0.62} y2={dY(avgDepth,md)}
        stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,4" opacity="0.7"/>
      <text x={PANEL_RIGHT*0.63} y={dY(avgDepth,md)+4} fontSize="7.5" fill="#f59e0b">AVG {avgDepth}m</text>

      {/* ── TERRAIN ── */}
      {isWreck      && <WreckTerrain md={md}/>}
      {isSmallWreck && <SmallWreckTerrain md={md}/>}
      {isWall     && <WallTerrain  md={md}/>}
      {isDrift    && <ReefSlopeTerrain md={md}/>}
      {isPinnacle && !isWreck && !isWall && <PinnacleTerrain md={md}/>}
      {isMuck     && <MuckTerrain  md={md}/>}
      {!isWreck && !isSmallWreck && !isWall && !isDrift && !isPinnacle && !isMuck && (
        isBoat ? <BoatReefTerrain md={md}/> : <ReefSlopeTerrain md={md}/>
      )}

      {/* ── BOAT / SHORE ── */}
      {isBoat ? (
        <g>
          <Boat x={200} y={SURFACE_Y - 24}/>
          <line x1="200" y1={SURFACE_Y - 10} x2="148" y2={SURFACE_Y} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" opacity="0.7"/>
          <text x="120" y={SURFACE_Y - 22} fontSize="8" fill="#94a3b8" fontWeight="600">BOAT DROP</text>
          <text x="120" y={SURFACE_Y - 11} fontSize="7"  fill="#475569">Not to scale</text>
        </g>
      ) : (
        <g>
          {/* ── LAND above water ── */}
          {/* sky continues behind land */}
          <rect x="0" y={TOP_BAR} width="130" height={SURFACE_Y - TOP_BAR} fill={`url(#s-${site.slug})`}/>

          {/* land mass — rises from left edge, slopes down to waterline at ~x=130 */}
          <path d={`M0 ${TOP_BAR} L0 ${SURFACE_Y - 18} Q30 ${SURFACE_Y - 22} 60 ${SURFACE_Y - 14} Q90 ${SURFACE_Y - 6} 130 ${SURFACE_Y} L0 ${SURFACE_Y} Z`}
            fill="#5c4a32"/>
          {/* grass / vegetation on top */}
          <path d={`M0 ${TOP_BAR} L0 ${SURFACE_Y - 20} Q30 ${SURFACE_Y - 25} 60 ${SURFACE_Y - 16} Q90 ${SURFACE_Y - 8} 130 ${SURFACE_Y}`}
            fill="none" stroke="#3d6b35" strokeWidth="3" opacity="0.7"/>
          {/* palm tree suggestion */}
          <line x1="28" y1={SURFACE_Y - 18} x2="24" y2={TOP_BAR + 10} stroke="#5c4a32" strokeWidth="3"/>
          <ellipse cx="22" cy={TOP_BAR + 10} rx="18" ry="8" fill="#3d6b35" opacity="0.8"/>
          <ellipse cx="36" cy={TOP_BAR + 14} rx="14" ry="6" fill="#4a7a40" opacity="0.7"/>

          {/* ── volcanic rocks / beach at waterline ── */}
          {isWreck ? (
            // Tulamben = black volcanic pebble beach
            <g>
              <path d={`M0 ${SURFACE_Y - 4} Q40 ${SURFACE_Y - 8} 90 ${SURFACE_Y - 2} Q110 ${SURFACE_Y} 130 ${SURFACE_Y + 2}`}
                fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="1"/>
              {[8,20,32,44,56,68,80,95,110].map((cx,i) => (
                <ellipse key={i} cx={cx} cy={SURFACE_Y - 2 + (i%2)*3} rx={5+i%3} ry="3" fill={i%2===0?'#1c1c1c':'#333'} opacity="0.9"/>
              ))}
              <text x="50" y={SURFACE_Y - 12} fontSize="7.5" fill="#6b7280" textAnchor="middle" fontWeight="600">VOLCANIC BEACH</text>
            </g>
          ) : (
            // Sandy beach entry
            <g>
              <path d={`M0 ${SURFACE_Y - 6} Q50 ${SURFACE_Y - 10} 100 ${SURFACE_Y - 4} Q115 ${SURFACE_Y - 1} 130 ${SURFACE_Y + 1}`}
                fill="#c9a96e" stroke="#b8935a" strokeWidth="1"/>
              <text x="55" y={SURFACE_Y - 14} fontSize="7.5" fill="#b8935a" textAnchor="middle" fontWeight="600">SANDY BEACH</text>
            </g>
          )}

          {/* ── underwater slope from shore ── */}
          {/* beach continues underwater as shallow slope before dropping */}
          <path d={`M0 ${SURFACE_Y} Q40 ${SURFACE_Y + 8} 90 ${SURFACE_Y + 18} Q110 ${SURFACE_Y + 22} 130 ${dY(2, md)}`}
            fill={isWreck ? '#2a2a2a' : '#c9a96e'} opacity="0.55"/>

          {/* SHORE ENTRY label with arrow */}
          <rect x="68" y={SURFACE_Y + 30} width="76" height="18" rx="3" fill="#15803d" opacity="0.92"/>
          <text x="106" y={SURFACE_Y + 43} fontSize="8" fill="#fff" textAnchor="middle" fontWeight="700">▶ SHORE ENTRY</text>

          {/* diver silhouette walking in */}
          <g transform={`translate(108, ${SURFACE_Y - 4})`} opacity="0.75">
            {/* body */}
            <circle cx="0" cy="-14" r="5" fill="#334155"/>
            <line x1="0" y1="-9" x2="0" y2="2" stroke="#334155" strokeWidth="3"/>
            {/* arms */}
            <line x1="0" y1="-6" x2="-7" y2="-1" stroke="#334155" strokeWidth="2"/>
            <line x1="0" y1="-6" x2="7"  y2="-1" stroke="#334155" strokeWidth="2"/>
            {/* legs in water */}
            <line x1="0" y1="2" x2="-5" y2="10" stroke="#334155" strokeWidth="2.5"/>
            <line x1="0" y1="2" x2="5"  y2="8"  stroke="#334155" strokeWidth="2.5"/>
            {/* fins suggestion */}
            <ellipse cx="-6" cy="11" rx="6" ry="2.5" fill="#1d4ed8" opacity="0.8"/>
            <ellipse cx="5"  cy="9"  rx="6" ry="2.5" fill="#1d4ed8" opacity="0.8"/>
          </g>
        </g>
      )}

      {/* ── CURRENT ── */}
      <CurrentArrows
        x={240} y={SURFACE_Y + 26}
        label={hasStrong ? `STRONG CURRENT  ·  ${current.toUpperCase()}` : `CURRENT  ·  ${current.toUpperCase()}`}
      />

      {/* ── COMPASS ── */}
      <Compass x={PANEL_RIGHT - 26} y={SURFACE_Y - 26}/>

      {/* ── ROUTES ── */}
      {isWreck      && <WreckRoute      md={md} shore={!isBoat}/>}
      {isSmallWreck && <SmallWreckRoute md={md} shore={!isBoat}/>}
      {isWall  && <WallRoute  md={md} shore={!isBoat}/>}
      {isDrift && <DriftRoute md={md}/>}
      {!isWreck && !isSmallWreck && !isWall && !isDrift && <ReefRoute md={md} shore={!isBoat}/>}

      {/* ── MARINE LIFE TAGS ── */}
      {ml[0] && <MarineLifeTag x={isWall?(isBoat?170:185):(!isBoat?220:210)} y={dY(md*0.32,md)-32} name={ml[0].name} depthLabel={`~${Math.round(md*0.3)}m`}/>}
      {ml[1] && <MarineLifeTag x={isWall?(isBoat?205:220):(!isBoat?350:330)} y={dY(md*0.54,md)-32} name={ml[1].name} depthLabel={`~${Math.round(md*0.52)}m`}/>}
      {ml[2] && <MarineLifeTag x={isWall?(isBoat?240:255):(!isBoat?470:450)} y={dY(md*0.74,md)-32} name={ml[2].name} depthLabel={`~${Math.round(md*0.72)}m`}/>}

      {/* ── HAZARD BADGES ── */}
      {hazards[0] && <HazardBadge x={isWall?300:150} y={dY(md*0.88,md)-4} label={hazards[0]}/>}

      {/* ── DIAGRAM BOTTOM LINE ── */}
      <rect x="0" y={BOTTOM_Y + 12} width={PANEL_RIGHT} height="1" fill="#1e3a5f"/>

      {/* ── RIGHT PANEL ── */}
      <rect x={PANEL_RIGHT} y={TOP_BAR} width={W - PANEL_RIGHT} height={H - TOP_BAR} fill="#060e1c"/>
      <rect x={PANEL_RIGHT} y={TOP_BAR} width="1" height={H - TOP_BAR} fill="#1e3a5f"/>

      {/* LEGEND card */}
      <rect x={PANEL_RIGHT+8} y={LEG_Y} width={W-PANEL_RIGHT-16} height="172" rx="6" fill="#0d2035" stroke="#1e3a5f" strokeWidth="1"/>
      <text x={PANEL_RIGHT+14} y={LEG_Y+16} fontSize="9" fill="#94a3b8" fontWeight="800" letterSpacing="1">LEGEND</text>
      {([
        ['─ ─','#ffffff','Entry / Descent'],
        ['─ ─','#ffffff','Route'],
        ['●',  '#22c55e','Safety stop'],
        ['●',  '#3b82f6','Pick up'],
        ['›',  '#38bdf8','Current'],
        ['★',  '#fbbf24','Marine life'],
        ['⚠',  '#f87171','Hazard'],
      ] as [string,string,string][]).map(([sym,col,lbl],i) => (
        <g key={i} transform={`translate(${PANEL_RIGHT+14},${LEG_Y+32+i*20})`}>
          <text x="0" y="0" fontSize="11" fill={col}>{sym}</text>
          <text x="22" y="1" fontSize="9"  fill="#94a3b8">{lbl}</text>
        </g>
      ))}

      {/* SITE HAZARDS card */}
      <rect x={PANEL_RIGHT+8} y={HAZ_Y} width={W-PANEL_RIGHT-16} height={hazards.length*26+32} rx="6" fill="#12080a" stroke="#7f1d1d" strokeWidth="1"/>
      <text x={PANEL_RIGHT+14} y={HAZ_Y+16} fontSize="9" fill="#f87171" fontWeight="800" letterSpacing="1">SITE HAZARDS</text>
      {hazards.map((n,i) => (
        <text key={i} x={PANEL_RIGHT+14} y={HAZ_Y+32+i*24} fontSize="8" fill="#fca5a5">
          ⚠ {n.length>28 ? n.slice(0,28)+'…' : n}
        </text>
      ))}

      {/* ROUTE WAYPOINTS card */}
      <rect x={PANEL_RIGHT+8} y={WPT_Y} width={W-PANEL_RIGHT-16} height="116" rx="6" fill="#0d2035" stroke="#1e3a5f" strokeWidth="1"/>
      <text x={PANEL_RIGHT+14} y={WPT_Y+16} fontSize="9" fill="#94a3b8" fontWeight="800" letterSpacing="1">ROUTE WAYPOINTS</text>
      {([
        [1, isBoat ? 'Entry / Descent'   : 'Shore entry & descend'],
        [2, isBoat ? 'Main reef/feature'  : 'Main reef / feature'],
        [3,'Deepest point / turn'],
        [4, isBoat ? 'Turn & ascent'      : 'Return toward shore'],
        [5,'Safety stop & exit'],
      ] as [number,string][]).map(([n,lbl],i) => (
        <g key={n} transform={`translate(${PANEL_RIGHT+14},${WPT_Y+30+i*18})`}>
          <circle cx="8" cy="-5" r="8" fill="#0a1628" stroke="#fff" strokeWidth="1.5"/>
          <text x="8" y="-1" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="800">{n}</text>
          <text x="22" y="0" fontSize="8.5" fill="#94a3b8">{lbl}</text>
        </g>
      ))}

      {/* ── FOOTER / TIMELINE ── */}
      <rect x="0" y={TIMELINE_Y} width={W} height={FOOTER_H} fill="#070d1a"/>
      <rect x="0" y={TIMELINE_Y} width={W} height="1" fill="#1e3a5f"/>

      {/* timeline label */}
      <text x="12" y={TIMELINE_Y+18} fontSize="9" fill="#60a5fa" fontWeight="800" letterSpacing="1">DIVE TIMELINE · APPROX. 50 MIN</text>

      {/* 6 timeline cards */}
      {([
        ['0–5 MIN',  'DESCEND',       'Follow entry line'],
        ['5–15 MIN', 'EXPLORE',       'Main reef / feature'],
        ['15–25 MIN','DEEPEST POINT', `Max ${md}m`],
        ['25–35 MIN','ASCEND',        'Return shallower'],
        ['35–45 MIN','SAFETY STOP',   '5m · 3 min'],
        ['45–50 MIN','PICK UP',       isBoat ? 'By boat' : 'Shore exit'],
      ] as [string,string,string][]).map(([time,phase,sub],i) => (
        <g key={i} transform={`translate(${12 + i * 112},${TIMELINE_Y + 26})`}>
          <rect x="0" y="0" width="106" height="58" rx="5" fill="#0d2035" stroke="#1e3a5f" strokeWidth="1"/>
          <text x="53" y="14" fontSize="7"   fill="#60a5fa" textAnchor="middle" fontWeight="700">{time}</text>
          <text x="53" y="30" fontSize="9.5" fill="#e2e8f0" textAnchor="middle" fontWeight="800">{phase}</text>
          <text x="53" y="46" fontSize="8"   fill="#64748b" textAnchor="middle">{sub}</text>
          {i < 5 && <text x="112" y="33" fontSize="12" fill="#334155" textAnchor="middle">›</text>}
        </g>
      ))}

      {/* 6 info cards — 2 columns × 3 rows on the right */}
      {([
        ['DEPTH',      `${minDepth}–${md}m`],
        ['VISIBILITY', visibility],
        ['WATER TEMP', temp],
        ['BEST TIME',  bestTime],
        ['CERT',       minCert],
        ['DIFFICULTY', difficulty],
      ] as [string,string][]).map(([k,v],i) => (
        <g key={k} transform={`translate(${686 + (i%2)*133},${TIMELINE_Y + 24 + Math.floor(i/2)*44})`}>
          <rect x="0" y="0" width="128" height="38" rx="5" fill="#0d2035" stroke="#1e3a5f" strokeWidth="1"/>
          <text x="10" y="14" fontSize="7.5" fill="#60a5fa" fontWeight="700">{k}</text>
          <text x="10" y="30" fontSize="10"  fill="#e2e8f0" fontWeight="700">{v}</text>
        </g>
      ))}

    </svg>
  )
}
