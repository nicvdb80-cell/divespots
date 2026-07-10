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
function WreckRoute({ md }: { md: number }) {
  const y5=dY(5,md), yMax=dY(md-4,md)
  return (
    <g>
      <path d={`M90 ${SURFACE_Y} Q105 ${y5-10} 125 ${y5+12}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={92} y={SURFACE_Y+8} n={1}/>
      <path d={`M125 ${y5+12} Q235 ${y5-4} 340 ${y5+10}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={235} y={y5+8} n={2}/>
      <path d={`M340 ${y5+10} Q410 ${dY(md*0.58,md)} 470 ${yMax}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={400} y={dY(md*0.58,md)} n={3}/>
      <WaypointCircle x={470} y={yMax} n={4}/>
      <path d={`M470 ${yMax} Q510 ${dY(10,md)} 530 ${y5}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={530} y={y5} n={5}/>
      <SafetyStop x={548} y={y5-36}/>
    </g>
  )
}

function WallRoute({ md }: { md: number }) {
  const y5=dY(5,md), yMax=dY(md-4,md)
  return (
    <g>
      <path d={`M280 ${SURFACE_Y} Q250 ${y5} 220 ${dY(16,md)}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={280} y={SURFACE_Y+10} n={1}/>
      <path d={`M220 ${dY(16,md)} Q195 ${dY(md*0.45,md)} 180 ${yMax-18}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={208} y={dY(md*0.38,md)} n={2}/>
      <WaypointCircle x={182} y={yMax-18} n={3}/>
      <path d={`M182 ${yMax-18} Q240 ${dY(md*0.38,md)} 390 ${dY(18,md)} Q460 ${y5+14} 520 ${y5}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={380} y={dY(18,md)} n={4}/>
      <WaypointCircle x={520} y={y5} n={5}/>
      <SafetyStop x={538} y={y5-36}/>
    </g>
  )
}

function ReefRoute({ md }: { md: number }) {
  const y5=dY(5,md), yMax=dY(md*0.82,md)
  return (
    <g>
      <path d={`M140 ${SURFACE_Y} Q150 ${y5+8} 175 ${dY(md*0.28,md)}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={142} y={SURFACE_Y+10} n={1}/>
      <path d={`M175 ${dY(md*0.28,md)} Q265 ${dY(md*0.46,md)} 330 ${dY(md*0.54,md)}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={255} y={dY(md*0.44,md)} n={2}/>
      <path d={`M330 ${dY(md*0.54,md)} Q395 ${dY(md*0.7,md)} 445 ${yMax}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={370} y={dY(md*0.66,md)} n={3}/>
      <WaypointCircle x={445} y={yMax} n={4}/>
      <path d={`M445 ${yMax} Q510 ${dY(md*0.28,md)} 540 ${y5}`} stroke="#fff" strokeWidth="2.2" strokeDasharray="7,4" fill="none"/>
      <WaypointCircle x={540} y={y5} n={5}/>
      <SafetyStop x={558} y={y5-36}/>
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

  const isWreck    = diagramType === 'wreck'
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
      {isWreck    && <WreckTerrain md={md}/>}
      {isWall     && <WallTerrain  md={md}/>}
      {isDrift    && <ReefSlopeTerrain md={md}/>}
      {isPinnacle && !isWreck && !isWall && <PinnacleTerrain md={md}/>}
      {isMuck     && <MuckTerrain  md={md}/>}
      {!isWreck && !isWall && !isDrift && !isPinnacle && !isMuck && (
        isBoat ? <BoatReefTerrain md={md}/> : <ReefSlopeTerrain md={md}/>
      )}

      {/* ── BOAT / SHORE ── */}
      {isBoat ? (
        <g>
          <Boat x={200} y={SURFACE_Y - 24}/>
          <line x1="200" y1={SURFACE_Y - 10} x2="148" y2={SURFACE_Y} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" opacity="0.7"/>
          <text x="106" y={SURFACE_Y - 20} fontSize="8" fill="#94a3b8" fontWeight="600">BOAT DROP</text>
          <text x="106" y={SURFACE_Y - 9}  fontSize="7" fill="#475569">Not to scale</text>
        </g>
      ) : (
        <g>
          <rect x="0" y={SURFACE_Y - 2} width="58" height={BOTTOM_Y - SURFACE_Y + 17} fill="#78350f" opacity="0.38"/>
          <text x="29" y={SURFACE_Y + 32} fontSize="7.5" fill="#b45309" textAnchor="middle"
            transform={`rotate(-90,29,${SURFACE_Y + 42})`}>SHORE</text>
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
      {isWreck && <WreckRoute md={md}/>}
      {isWall  && <WallRoute  md={md}/>}
      {isDrift && <DriftRoute md={md}/>}
      {!isWreck && !isWall && !isDrift && <ReefRoute md={md}/>}

      {/* ── MARINE LIFE TAGS ── */}
      {ml[0] && <MarineLifeTag x={isWall?170:210} y={dY(md*0.32,md)-32} name={ml[0].name} depthLabel={`~${Math.round(md*0.3)}m`}/>}
      {ml[1] && <MarineLifeTag x={isWall?205:330} y={dY(md*0.54,md)-32} name={ml[1].name} depthLabel={`~${Math.round(md*0.52)}m`}/>}
      {ml[2] && <MarineLifeTag x={isWall?240:450} y={dY(md*0.74,md)-32} name={ml[2].name} depthLabel={`~${Math.round(md*0.72)}m`}/>}

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
        [1,'Entry / Descent'],
        [2,'Main reef / attraction'],
        [3,'Deepest point'],
        [4,'Turn & ascent'],
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
