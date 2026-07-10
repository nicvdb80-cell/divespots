import { DiveSite } from '@/lib/data'

// ─── helpers ───────────────────────────────────────────────────────────────
const W = 900, H = 620
const PANEL_LEFT = 0, PANEL_RIGHT = 660
const DIAGRAM_W = 660, DIAGRAM_H = 440
const SURFACE_Y = 90
const BOTTOM_Y = SURFACE_Y + DIAGRAM_H - 30  // ~500

function dY(depth: number, maxDepth: number) {
  return SURFACE_Y + (depth / maxDepth) * (BOTTOM_Y - SURFACE_Y)
}

// ─── sub-components ────────────────────────────────────────────────────────
function Compass({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="0" cy="0" r="18" fill="#0d2035" stroke="#1e3a5f" strokeWidth="1.5"/>
      <polygon points="0,-13 4,4 0,1 -4,4" fill="#e2e8f0"/>
      <polygon points="0,13 4,-4 0,-1 -4,-4" fill="#475569"/>
      <text x="0" y="-16" fontSize="8" fill="#60a5fa" textAnchor="middle" fontWeight="800">N</text>
    </g>
  )
}

function SafetyStop({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="110" height="26" rx="5" fill="#15803d" opacity="0.95"/>
      <text x={x + 55} y={y + 11} fontSize="8" fill="#fff" textAnchor="middle" fontWeight="700">SAFETY STOP</text>
      <text x={x + 55} y={y + 21} fontSize="8" fill="#bbf7d0" textAnchor="middle">5m · 3 min</text>
    </g>
  )
}

function Boat({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M-28 0 L28 0 L20 12 L-20 12 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1"/>
      <path d="M-8 -16 L-8 0" stroke="#94a3b8" strokeWidth="1.5"/>
      <path d="M-8 -16 L12 -8 L-8 -4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8"/>
      <text x="0" y="22" fontSize="8" fill="#94a3b8" textAnchor="middle" fontWeight="700">BOAT</text>
    </g>
  )
}

function CurrentArrows({ x, y, dir = 'right', label }: { x: number; y: number; dir?: string; label?: string }) {
  const arrows = dir === 'right' ? '›  ›  ›  ›  ›' : dir === 'down' ? '↓  ↓  ↓' : '↑  ↑  ↑'
  return (
    <g>
      <text x={x} y={y} fontSize="12" fill="#38bdf8" opacity="0.8" letterSpacing="2" fontWeight="700">{arrows}</text>
      {label && <text x={x} y={y - 10} fontSize="8" fill="#60a5fa" fontWeight="600">{label}</text>}
    </g>
  )
}

function WaypointCircle({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="11" fill="#0a1628" stroke="#fff" strokeWidth="2"/>
      <text x={x} y={y + 4} fontSize="10" fill="#fff" textAnchor="middle" fontWeight="800">{n}</text>
    </g>
  )
}

function HazardBadge({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x - 4} y={y - 12} width={label.length * 5.5 + 20} height="16" rx="3" fill="#7f1d1d" opacity="0.85"/>
      <text x={x + 6} y={y - 2} fontSize="8" fill="#fca5a5" fontWeight="700">⚠ {label}</text>
    </g>
  )
}

function MarineLifeTag({ x, y, name, depth }: { x: number; y: number; name: string; depth: string }) {
  return (
    <g>
      <rect x={x - 4} y={y - 12} width={Math.max(name.length * 5.4, 60) + 8} height="28" rx="4" fill="#0c2340" stroke="#1e3a5f" strokeWidth="1" opacity="0.92"/>
      <text x={x + 2} y={y - 1} fontSize="8" fill="#fbbf24" fontWeight="700">{name}</text>
      <text x={x + 2} y={y + 11} fontSize="7.5" fill="#60a5fa">{depth}</text>
    </g>
  )
}

// ─── terrain generators ────────────────────────────────────────────────────
function WreckTerrain({ maxDepth }: { maxDepth: number }) {
  const wTop = dY(5, maxDepth), wBot = dY(maxDepth - 2, maxDepth)
  const wH = wBot - wTop
  return (
    <g>
      {/* sandy bottom */}
      <path d={`M55 ${wBot + 20} L${DIAGRAM_W - 10} ${wBot + 10} L${DIAGRAM_W - 10} ${BOTTOM_Y + 20} L55 ${BOTTOM_Y + 20} Z`}
        fill="#78350f" opacity="0.45"/>
      <text x="370" y={wBot + 40} fontSize="8" fill="#b45309" textAnchor="middle">SANDY BOTTOM</text>
      {/* coral growth on bottom */}
      {[120,170,230,290,350,420,490,540].map((cx, i) => (
        <g key={i}>
          <ellipse cx={cx} cy={wBot + 18} rx="12" ry="7" fill="#059669" opacity="0.55"/>
          <path d={`M${cx} ${wBot + 11} Q${cx - 7} ${wBot - 2} ${cx} ${wBot + 4} Q${cx + 7} ${wBot - 2} ${cx} ${wBot + 11}`} fill="#10b981" opacity="0.7"/>
        </g>
      ))}
      {/* wreck hull */}
      <rect x="110" y={wTop} width="390" height={wH} rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" opacity="0.92"/>
      {/* portholes */}
      {[150, 210, 270, 330, 390, 440].map(cx => (
        <circle key={cx} cx={cx} cy={wTop + wH * 0.35} r="6" fill="#0a1628" stroke="#475569" strokeWidth="1.5"/>
      ))}
      {/* superstructure */}
      <rect x="180" y={wTop - 28} width="110" height="30" rx="5" fill="#263244" stroke="#334155" strokeWidth="1.5"/>
      <rect x="280" y={wTop - 18} width="70" height="20" rx="4" fill="#263244" stroke="#334155" strokeWidth="1"/>
      {/* mast */}
      <line x1="220" y1={wTop - 60} x2="220" y2={wTop - 28} stroke="#475569" strokeWidth="2.5"/>
      <line x1="195" y1={wTop - 46} x2="245" y2={wTop - 46} stroke="#475569" strokeWidth="1.5"/>
      {/* bow / stern labels */}
      <text x="125" y={wTop - 10} fontSize="8" fill="#60a5fa" fontWeight="700">BOW</text>
      <text x="475" y={wTop - 6} fontSize="8" fill="#60a5fa" fontWeight="700">STERN</text>
      <text x="310" y={wTop + wH * 0.55} fontSize="13" fill="#475569" textAnchor="middle" fontWeight="800" opacity="0.6">W R E C K</text>
      {/* shore entry stones */}
      {[60,70,80,90,100].map(cx => <ellipse key={cx} cx={cx} cy={SURFACE_Y + 4} rx="5" ry="3" fill="#374151" opacity="0.7"/>)}
    </g>
  )
}

function WallTerrain({ maxDepth }: { maxDepth: number }) {
  return (
    <g>
      {/* vertical wall face */}
      <rect x="75" y={SURFACE_Y} width="38" height={BOTTOM_Y - SURFACE_Y} fill="#162032" stroke="#1e3a5f" strokeWidth="1.5"/>
      {/* sea fans */}
      {[SURFACE_Y+30, SURFACE_Y+80, SURFACE_Y+140, SURFACE_Y+200, SURFACE_Y+260, SURFACE_Y+320, SURFACE_Y+370].map((wy, i) => (
        <g key={i}>
          <path d={`M75 ${wy} Q58 ${wy - 22} 48 ${wy - 14} M75 ${wy} Q62 ${wy - 26} 52 ${wy - 17}`}
            stroke={i % 2 === 0 ? '#7c3aed' : '#0891b2'} strokeWidth="1.8" fill="none" opacity="0.8"/>
          <path d={`M75 ${wy + 14} Q55 ${wy + 4} 44 ${wy + 10} Q60 ${wy + 18} 75 ${wy + 14}`}
            fill="#10b981" opacity="0.55"/>
        </g>
      ))}
      {/* sandy bottom slope */}
      <path d={`M113 ${BOTTOM_Y - 10} Q240 ${BOTTOM_Y + 5} ${DIAGRAM_W - 10} ${BOTTOM_Y} L${DIAGRAM_W - 10} ${BOTTOM_Y + 25} L113 ${BOTTOM_Y + 25} Z`}
        fill="#78350f" opacity="0.4"/>
      <text x="370" y={BOTTOM_Y + 18} fontSize="8" fill="#b45309" textAnchor="middle">SANDY SLOPE</text>
      {/* drop-off label */}
      <text x="55" y={dY(maxDepth * 0.6, maxDepth)} fontSize="8" fill="#475569" textAnchor="middle"
        transform={`rotate(-90, 40, ${dY(maxDepth * 0.6, maxDepth)})`}>DROP-OFF</text>
    </g>
  )
}

function ReefSlopeTerrain({ maxDepth }: { maxDepth: number }) {
  const p1y = dY(maxDepth * 0.28, maxDepth)
  const p2y = dY(maxDepth * 0.52, maxDepth)
  const p3y = dY(maxDepth * 0.7, maxDepth)
  const p4y = dY(maxDepth * 0.85, maxDepth)
  return (
    <g>
      <path d={`M55 ${p1y} Q160 ${p1y + 20} 280 ${p2y} Q400 ${p3y} 560 ${p4y} L${DIAGRAM_W - 10} ${BOTTOM_Y + 20} L55 ${BOTTOM_Y + 20} Z`}
        fill="#1a3a2a" opacity="0.8"/>
      {/* coral bommies */}
      {[
        [80, p1y - 2], [130, p1y + 18], [190, p2y - 12], [250, p2y + 8],
        [320, p3y - 10], [390, p3y + 6], [460, p4y - 8], [530, p4y + 2]
      ].map(([cx, cy], i) => (
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx="18" ry="11" fill={i % 3 === 0 ? '#0e4f3a' : i % 3 === 1 ? '#164e63' : '#2d1b69'} opacity="0.9"/>
          <path d={`M${cx} ${cy - 11} Q${cx - 10} ${cy - 26} ${cx} ${cy - 20} Q${cx + 10} ${cy - 26} ${cx} ${cy - 11}`}
            fill="#10b981" opacity="0.75"/>
          <path d={`M${cx - 8} ${cy - 5} Q${cx - 18} ${cy - 18} ${cx - 12} ${cy - 13}`}
            stroke="#059669" strokeWidth="1.2" fill="none"/>
        </g>
      ))}
      {/* sand patches */}
      <ellipse cx="430" cy={p4y + 22} rx="60" ry="10" fill="#78350f" opacity="0.35"/>
      <text x="430" y={p4y + 27} fontSize="7" fill="#b45309" textAnchor="middle">SANDY SLOPE</text>
    </g>
  )
}

function PinnacleTerrain({ maxDepth }: { maxDepth: number }) {
  const peak = dY(5, maxDepth)
  return (
    <g>
      {/* background deep */}
      <path d={`M55 ${SURFACE_Y} L${DIAGRAM_W - 10} ${SURFACE_Y} L${DIAGRAM_W - 10} ${BOTTOM_Y + 20} L55 ${BOTTOM_Y + 20} Z`}
        fill="#0a1628" opacity="0.3"/>
      {/* seamount shape */}
      <path d={`M55 ${BOTTOM_Y} Q180 ${BOTTOM_Y - 20} 260 ${peak + 20} Q300 ${peak} 340 ${peak + 20} Q420 ${BOTTOM_Y - 20} ${DIAGRAM_W - 10} ${BOTTOM_Y} L${DIAGRAM_W - 10} ${BOTTOM_Y + 20} L55 ${BOTTOM_Y + 20} Z`}
        fill="#1a3a2a" opacity="0.85"/>
      {/* coral on pinnacle */}
      {[220, 260, 300, 340, 380].map((cx, i) => {
        const cy = i === 2 ? peak + 5 : i === 0 || i === 4 ? peak + 60 : peak + 25
        return (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx="15" ry="9" fill="#0e4f3a" opacity="0.9"/>
            <path d={`M${cx} ${cy - 9} Q${cx - 9} ${cy - 22} ${cx} ${cy - 16} Q${cx + 9} ${cy - 22} ${cx} ${cy - 9}`}
              fill="#10b981" opacity="0.8"/>
          </g>
        )
      })}
      <text x="300" y={peak - 10} fontSize="8" fill="#34d399" textAnchor="middle" fontWeight="700">PINNACLE / SEAMOUNT</text>
    </g>
  )
}

function MuckTerrain({ maxDepth }: { maxDepth: number }) {
  return (
    <g>
      {/* flat silty bottom */}
      <path d={`M55 ${dY(maxDepth * 0.85, maxDepth)} Q300 ${dY(maxDepth * 0.88, maxDepth)} ${DIAGRAM_W - 10} ${dY(maxDepth * 0.85, maxDepth)} L${DIAGRAM_W - 10} ${BOTTOM_Y + 20} L55 ${BOTTOM_Y + 20} Z`}
        fill="#3b2a1a" opacity="0.65"/>
      <text x="300" y={dY(maxDepth * 0.95, maxDepth)} fontSize="8" fill="#92400e" textAnchor="middle">SILTY MUCK BOTTOM</text>
      {/* debris / rubble */}
      {[100, 160, 220, 310, 390, 470, 540].map((cx, i) => (
        <ellipse key={i} cx={cx} cy={dY(maxDepth * 0.85, maxDepth) + 6} rx="10" ry="5" fill="#4a3728" opacity="0.7"/>
      ))}
    </g>
  )
}

function BoatReefTerrain({ maxDepth }: { maxDepth: number }) {
  // cleaning station / open water reef
  const reefTop = dY(maxDepth * 0.3, maxDepth)
  return (
    <g>
      <path d={`M120 ${reefTop} Q250 ${reefTop - 15} 380 ${reefTop + 10} Q480 ${reefTop + 30} 560 ${dY(maxDepth * 0.55, maxDepth)} L${DIAGRAM_W - 10} ${BOTTOM_Y + 20} L120 ${BOTTOM_Y + 20} Z`}
        fill="#1a3a2a" opacity="0.8"/>
      {/* patch reef / bommies */}
      {[150, 220, 300, 380, 460, 530].map((cx, i) => {
        const cy = dY(maxDepth * (0.28 + i * 0.04), maxDepth)
        return (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx="20" ry="12" fill={i % 2 === 0 ? '#0c4a6e' : '#064e3b'} opacity="0.9"/>
            <path d={`M${cx} ${cy - 12} Q${cx - 12} ${cy - 28} ${cx} ${cy - 21} Q${cx + 12} ${cy - 28} ${cx} ${cy - 12}`}
              fill="#10b981" opacity="0.75"/>
          </g>
        )
      })}
      {/* cleaning station marker */}
      <ellipse cx="300" cy={dY(maxDepth * 0.4, maxDepth)} rx="35" ry="18" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7"/>
      <text x="300" y={dY(maxDepth * 0.4, maxDepth) + 4} fontSize="8" fill="#fbbf24" textAnchor="middle" fontWeight="700">CLEANING STATION</text>
    </g>
  )
}

// ─── dive routes ────────────────────────────────────────────────────────────
function WreckRoute({ maxDepth }: { maxDepth: number }) {
  const y5 = dY(5, maxDepth), yMax = dY(maxDepth - 4, maxDepth)
  return (
    <g>
      {/* entry descent */}
      <path d={`M90 ${SURFACE_Y} Q100 ${y5 - 20} 120 ${y5 + 10}`} stroke="#fff" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
      <WaypointCircle x={120} y={y5 + 10} n={1}/>
      {/* along wreck top */}
      <path d={`M120 ${y5 + 10} Q220 ${y5 - 5} 310 ${y5 + 8}`} stroke="#fff" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
      <WaypointCircle x={220} y={y5 + 5} n={2}/>
      {/* down to stern */}
      <path d={`M310 ${y5 + 8} Q380 ${dY(maxDepth * 0.6, maxDepth)} 450 ${yMax}`} stroke="#fff" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
      <WaypointCircle x={380} y={dY(maxDepth * 0.6, maxDepth)} n={3}/>
      {/* ascent */}
      <path d={`M450 ${yMax} Q480 ${dY(12, maxDepth)} 500 ${y5}`} stroke="#fff" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
      <WaypointCircle x={450} y={yMax} n={4}/>
      <WaypointCircle x={500} y={y5} n={5}/>
      <SafetyStop x={510} y={y5 - 34}/>
    </g>
  )
}

function WallRoute({ maxDepth }: { maxDepth: number }) {
  const y5 = dY(5, maxDepth), y15 = dY(15, maxDepth), yMax = dY(maxDepth - 4, maxDepth)
  return (
    <g>
      <path d={`M260 ${SURFACE_Y} Q230 ${y5} 200 ${y15}`} stroke="#fff" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
      <WaypointCircle x={260} y={SURFACE_Y + 8} n={1}/>
      <path d={`M200 ${y15} Q180 ${dY(maxDepth * 0.5, maxDepth)} 165 ${yMax - 20}`} stroke="#fff" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
      <WaypointCircle x={190} y={dY(maxDepth * 0.4, maxDepth)} n={2}/>
      <WaypointCircle x={168} y={yMax - 20} n={3}/>
      <path d={`M165 ${yMax - 20} Q200 ${dY(maxDepth * 0.4, maxDepth)} 350 ${dY(18, maxDepth)} Q430 ${y15} 490 ${y5}`}
        stroke="#fff" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
      <WaypointCircle x={350} y={dY(18, maxDepth)} n={4}/>
      <WaypointCircle x={490} y={y5} n={5}/>
      <SafetyStop x={500} y={y5 - 34}/>
    </g>
  )
}

function ReefRoute({ maxDepth }: { maxDepth: number }) {
  const y5 = dY(5, maxDepth), yAvg = dY(maxDepth * 0.55, maxDepth), yMax = dY(maxDepth * 0.82, maxDepth)
  return (
    <g>
      <path d={`M120 ${SURFACE_Y} Q130 ${y5 + 10} 160 ${dY(maxDepth * 0.3, maxDepth)}`} stroke="#fff" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
      <WaypointCircle x={120} y={SURFACE_Y + 6} n={1}/>
      <path d={`M160 ${dY(maxDepth * 0.3, maxDepth)} Q240 ${yAvg - 20} 300 ${yAvg}`} stroke="#fff" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
      <WaypointCircle x={230} y={dY(maxDepth * 0.45, maxDepth)} n={2}/>
      <path d={`M300 ${yAvg} Q370 ${yMax - 10} 420 ${yMax}`} stroke="#fff" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
      <WaypointCircle x={340} y={dY(maxDepth * 0.68, maxDepth)} n={3}/>
      <WaypointCircle x={420} y={yMax} n={4}/>
      <path d={`M420 ${yMax} Q480 ${dY(maxDepth * 0.3, maxDepth)} 510 ${y5}`} stroke="#fff" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
      <WaypointCircle x={510} y={y5} n={5}/>
      <SafetyStop x={510} y={y5 - 34}/>
    </g>
  )
}

function DriftRoute({ maxDepth }: { maxDepth: number }) {
  const y5 = dY(5, maxDepth), yAvg = dY(maxDepth * 0.5, maxDepth)
  return (
    <g>
      {/* drifts left to right */}
      <path d={`M80 ${SURFACE_Y} Q90 ${y5} 100 ${dY(maxDepth * 0.3, maxDepth)}`} stroke="#fff" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
      <WaypointCircle x={80} y={SURFACE_Y + 6} n={1}/>
      <path d={`M100 ${dY(maxDepth * 0.3, maxDepth)} Q200 ${yAvg} 320 ${dY(maxDepth * 0.55, maxDepth)} Q440 ${yAvg + 10} 540 ${dY(maxDepth * 0.4, maxDepth)}`}
        stroke="#fff" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
      <WaypointCircle x={200} y={yAvg} n={2}/>
      <WaypointCircle x={350} y={dY(maxDepth * 0.55, maxDepth)} n={3}/>
      <path d={`M540 ${dY(maxDepth * 0.4, maxDepth)} Q570 ${dY(maxDepth * 0.2, maxDepth)} 590 ${y5}`}
        stroke="#fff" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
      <WaypointCircle x={545} y={dY(maxDepth * 0.38, maxDepth)} n={4}/>
      <WaypointCircle x={590} y={y5} n={5}/>
      <SafetyStop x={490} y={y5 - 34}/>
    </g>
  )
}

// ─── main component ────────────────────────────────────────────────────────
export default function DiveDiagram({ site }: { site: DiveSite }) {
  const { maxDepth, minDepth, avgDepth, diagramType, name, area, current, access,
          visibility, temp, difficulty, minCert, bestTime, type, marineLife, safetyNotes } = site

  const depthMarkers: number[] = []
  const step = maxDepth <= 20 ? 5 : maxDepth <= 35 ? 5 : 10
  for (let d = 0; d <= maxDepth; d += step) depthMarkers.push(d)

  const isWreck = diagramType === 'wreck'
  const isWall  = diagramType === 'wall'
  const isDrift = type === 'Drift'
  const isPinnacle = type === 'Reef' && (name.toLowerCase().includes('magic') || name.toLowerCase().includes('pinnacle') || name.toLowerCase().includes('mount'))
  const isMuck  = type === 'Muck'

  // pick top 3 marine life for placement
  const ml = marineLife.slice(0, 3)

  // hazard from safety notes
  const hazard = safetyNotes[0] || ''

  // access mode
  const isBoat = access === 'Boat'

  // current label
  const hasCurrentStrong = current.toLowerCase().includes('strong') || current.toLowerCase().includes('very')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block', fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif" }}>
      <defs>
        {/* water gradient — shallow to deep */}
        <linearGradient id={`dg-water-${site.slug}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0369a1" stopOpacity="0.45"/>
          <stop offset="40%"  stopColor="#075985" stopOpacity="0.75"/>
          <stop offset="100%" stopColor="#0a1628" stopOpacity="0.98"/>
        </linearGradient>
        {/* sky gradient */}
        <linearGradient id={`dg-sky-${site.slug}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#bae6fd"/>
          <stop offset="100%" stopColor="#7dd3fc"/>
        </linearGradient>
        <linearGradient id={`dg-nav-${site.slug}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#0a1628"/>
          <stop offset="100%" stopColor="#0d2035"/>
        </linearGradient>
      </defs>

      {/* ── background ── */}
      <rect width={W} height={H} fill="#0a1628"/>

      {/* ── TOP BAR ── */}
      <rect x="0" y="0" width={W} height="48" fill={`url(#dg-nav-${site.slug})`}/>
      <rect x="0" y="47" width={W} height="1" fill="#1e3a5f"/>

      {/* DIVE BRIEFING badge */}
      <rect x="12" y="10" width="110" height="26" rx="5" fill="#ef4444"/>
      <text x="67" y="27" fontSize="10" fill="#fff" textAnchor="middle" fontWeight="800" letterSpacing="0.5">DIVE BRIEFING</text>

      {/* site name */}
      <text x="138" y="20" fontSize="16" fill="#fff" fontWeight="900" letterSpacing="-0.3">{name.toUpperCase()}</text>
      <text x="138" y="38" fontSize="9" fill="#60a5fa">{area}  ·  Indonesia</text>

      {/* rank badge */}
      <rect x={W - 265} y="10" width="100" height="26" rx="13" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1"/>
      <text x={W - 215} y="27" fontSize="9" fill="#60a5fa" textAnchor="middle" fontWeight="700">#{site.rank} in {area}</text>

      {/* verified badge */}
      <rect x={W - 158} y="10" width="146" height="26" rx="13" fill="#052e16" stroke="#16a34a" strokeWidth="1"/>
      <text x={W - 149} y="27" fontSize="9" fill="#22c55e" fontWeight="700">✓ Admin Verified</text>

      {/* ── DIAGRAM AREA ── */}
      {/* sky */}
      <rect x="0" y="48" width={DIAGRAM_W} height={SURFACE_Y - 48}
        fill={`url(#dg-sky-${site.slug})`}/>
      {/* water */}
      <rect x="0" y={SURFACE_Y} width={DIAGRAM_W} height={BOTTOM_Y - SURFACE_Y + 30}
        fill={`url(#dg-water-${site.slug})`}/>

      {/* surface line */}
      <line x1="0" y1={SURFACE_Y} x2={DIAGRAM_W} y2={SURFACE_Y} stroke="#7dd3fc" strokeWidth="1.2" strokeDasharray="6,3" opacity="0.7"/>
      <text x="60" y={SURFACE_Y - 4} fontSize="8" fill="#94a3b8" fontWeight="600">SURFACE</text>

      {/* depth grid lines + markers */}
      {depthMarkers.map(d => {
        const y = dY(d, maxDepth)
        if (y > BOTTOM_Y + 10) return null
        return (
          <g key={d}>
            <line x1="62" y1={y} x2={DIAGRAM_W - 5} y2={y}
              stroke={d === maxDepth ? '#ef4444' : '#1e3a5f'}
              strokeWidth={d === maxDepth ? 1 : 0.5}
              strokeDasharray={d === maxDepth ? '4,3' : '2,6'}
              opacity={d === maxDepth ? 0.9 : 0.7}/>
            <text x="57" y={y + 4} fontSize="8" fill={d === maxDepth ? '#ef4444' : '#60a5fa'}
              textAnchor="end" fontWeight={d === maxDepth ? '700' : '400'}>{d}m</text>
            {d === maxDepth && (
              <text x="72" y={y - 4} fontSize="8" fill="#ef4444" fontWeight="700">MAX DEPTH {d}m</text>
            )}
          </g>
        )
      })}

      {/* avg depth dashed line */}
      <line x1="62" y1={dY(avgDepth, maxDepth)} x2={DIAGRAM_W * 0.65} y2={dY(avgDepth, maxDepth)}
        stroke="#f59e0b" strokeWidth="1" strokeDasharray="5,4" opacity="0.7"/>
      <text x={DIAGRAM_W * 0.66} y={dY(avgDepth, maxDepth) + 4}
        fontSize="7.5" fill="#f59e0b">AVG {avgDepth}m</text>

      {/* ── TERRAIN ── */}
      {isWreck    && <WreckTerrain maxDepth={maxDepth}/>}
      {isWall     && <WallTerrain maxDepth={maxDepth}/>}
      {isDrift    && <ReefSlopeTerrain maxDepth={maxDepth}/>}
      {isPinnacle && <PinnacleTerrain maxDepth={maxDepth}/>}
      {isMuck     && <MuckTerrain maxDepth={maxDepth}/>}
      {!isWreck && !isWall && !isDrift && !isPinnacle && !isMuck && (
        type === 'Reef' && access === 'Boat'
          ? <BoatReefTerrain maxDepth={maxDepth}/>
          : <ReefSlopeTerrain maxDepth={maxDepth}/>
      )}

      {/* ── BOAT ── */}
      {isBoat && <Boat x={180} y={SURFACE_Y - 22}/>}
      {isBoat && (
        <>
          <line x1="180" y1={SURFACE_Y - 10} x2="140" y2={SURFACE_Y}
            stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,2" opacity="0.7"/>
          <text x="98" y={SURFACE_Y - 18} fontSize="8" fill="#94a3b8" fontWeight="600">BOAT DROP</text>
          <text x="98" y={SURFACE_Y - 8}  fontSize="7" fill="#475569">Not to scale</text>
        </>
      )}
      {!isBoat && (
        <g>
          {/* shore marker */}
          <rect x="0" y={SURFACE_Y - 12} width="55" height={BOTTOM_Y - SURFACE_Y + 42} fill="#78350f" opacity="0.4"/>
          <text x="27" y={SURFACE_Y + 20} fontSize="7" fill="#b45309" textAnchor="middle"
            transform={`rotate(-90,27,${SURFACE_Y + 30})`}>SHORE</text>
        </g>
      )}

      {/* ── CURRENT ARROWS ── */}
      {hasCurrentStrong
        ? <CurrentArrows x={220} y={SURFACE_Y + 22} dir="right" label={`STRONG CURRENT · ${current.toUpperCase()}`}/>
        : <CurrentArrows x={220} y={SURFACE_Y + 22} dir="right" label={`CURRENT · ${current.toUpperCase()}`}/>
      }

      {/* ── DIVE ROUTE ── */}
      {isWreck    && <WreckRoute maxDepth={maxDepth}/>}
      {isWall     && <WallRoute  maxDepth={maxDepth}/>}
      {isDrift    && <DriftRoute maxDepth={maxDepth}/>}
      {!isWreck && !isWall && !isDrift && <ReefRoute maxDepth={maxDepth}/>}

      {/* ── MARINE LIFE TAGS ── */}
      {ml[0] && <MarineLifeTag x={isWall ? 160 : 200} y={dY(maxDepth * 0.38, maxDepth) - 10} name={ml[0].name} depth={`~${Math.round(maxDepth * 0.35)}m`}/>}
      {ml[1] && <MarineLifeTag x={isWall ? 200 : 310} y={dY(maxDepth * 0.58, maxDepth) - 10} name={ml[1].name} depth={`~${Math.round(maxDepth * 0.55)}m`}/>}
      {ml[2] && <MarineLifeTag x={isWall ? 250 : 420} y={dY(maxDepth * 0.76, maxDepth) - 10} name={ml[2].name} depth={`~${Math.round(maxDepth * 0.72)}m`}/>}

      {/* ── HAZARD BADGE ── */}
      {hazard && <HazardBadge x={isWall ? 320 : 200} y={dY(maxDepth * 0.85, maxDepth)} label={hazard.slice(0, 32)}/>}

      {/* ── COMPASS ── */}
      <Compass x={DIAGRAM_W - 24} y={SURFACE_Y - 28}/>

      {/* ── RIGHT PANEL ── */}
      <rect x={PANEL_RIGHT} y="48" width={W - PANEL_RIGHT} height={H - 48} fill="#0a1628"/>
      <rect x={PANEL_RIGHT} y="48" width="1" height={H - 48} fill="#1e3a5f"/>

      {/* LEGEND */}
      <rect x={PANEL_RIGHT + 8} y="56" width={W - PANEL_RIGHT - 16} height="180" rx="6" fill="#0d2035" stroke="#1e3a5f" strokeWidth="1"/>
      <text x={PANEL_RIGHT + 14} y="72" fontSize="9" fill="#94a3b8" fontWeight="800" letterSpacing="1">LEGEND</text>

      {([
        ['─ ─', '#fff',    'Entry / Descent'],
        ['─ ─', '#fff',    'Route'],
        ['●',   '#22c55e', 'Safety stop'],
        ['●',   '#3b82f6', 'Pick up'],
        ['›',   '#38bdf8', 'Current'],
        ['★',   '#fbbf24', 'Marine life'],
        ['⚠',   '#f87171', 'Hazard / Caution'],
      ] as [string, string, string][]).map(([sym, col, label], i) => (
        <g key={i} transform={`translate(${PANEL_RIGHT + 14}, ${84 + i * 19})`}>
          <text x="0" y="0" fontSize="10" fill={col}>{sym}</text>
          <text x="20" y="0" fontSize="9" fill="#94a3b8">{label}</text>
        </g>
      ))}

      {/* SITE HAZARDS */}
      <rect x={PANEL_RIGHT + 8} y="244" width={W - PANEL_RIGHT - 16} height={safetyNotes.length * 24 + 28} rx="6" fill="#130a0a" stroke="#7f1d1d" strokeWidth="1"/>
      <text x={PANEL_RIGHT + 14} y="260" fontSize="9" fill="#f87171" fontWeight="800" letterSpacing="1">SITE HAZARDS</text>
      {safetyNotes.slice(0, 3).map((n, i) => (
        <text key={i} x={PANEL_RIGHT + 14} y={276 + i * 22} fontSize="8" fill="#fca5a5">
          {'⚠ '}{n.length > 26 ? n.slice(0, 26) + '…' : n}
        </text>
      ))}

      {/* WAYPOINT KEY */}
      <rect x={PANEL_RIGHT + 8} y={358} width={W - PANEL_RIGHT - 16} height="106" rx="6" fill="#0d2035" stroke="#1e3a5f" strokeWidth="1"/>
      <text x={PANEL_RIGHT + 14} y={374} fontSize="9" fill="#94a3b8" fontWeight="800" letterSpacing="1">ROUTE WAYPOINTS</text>
      {([
        [1,'Entry / Descent'],
        [2,'Main reef / attraction'],
        [3,'Deepest point'],
        [4,'Turn & ascent'],
        [5,'Safety stop & exit'],
      ] as [number, string][]).map(([n, label], i) => (
        <g key={n} transform={`translate(${PANEL_RIGHT + 14}, ${388 + i * 17})`}>
          <circle cx="7" cy="-4" r="7" fill="#0a1628" stroke="#fff" strokeWidth="1.5"/>
          <text x="7" y="0" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="700">{n}</text>
          <text x="20" y="0" fontSize="8" fill="#94a3b8">{label}</text>
        </g>
      ))}

      {/* ── BOTTOM SECTION ── */}
      {/* divider */}
      <rect x="0" y={BOTTOM_Y + 30} width={W} height="1" fill="#1e3a5f"/>

      {/* DIVE TIMELINE */}
      <rect x="0" y={BOTTOM_Y + 31} width={PANEL_RIGHT} height={H - BOTTOM_Y - 31} fill="#0a1628"/>
      <text x="12" y={BOTTOM_Y + 47} fontSize="9" fill="#94a3b8" fontWeight="800" letterSpacing="1">DIVE TIMELINE · APPROX. 50 MIN</text>

      {([
        ['0–5m',  'DESCEND',        'Follow entry line'],
        ['5–15m', 'EXPLORE',        'Main reef / feature'],
        ['15–25m','DEEPEST POINT',  `Max ${maxDepth}m`],
        ['25–35m','ASCEND',         'Return shallower'],
        ['35–45m','SAFETY STOP',    '5m · 3 min'],
        ['45–50m','PICK UP',        isBoat ? 'By boat' : 'Shore exit'],
      ] as [string,string,string][]).map(([time, phase, sub], i) => (
        <g key={i} transform={`translate(${10 + i * 108}, ${BOTTOM_Y + 56})`}>
          <rect x="0" y="0" width="100" height="50" rx="5" fill="#0d2035" stroke="#1e3a5f" strokeWidth="1"/>
          <text x="50" y="13" fontSize="7" fill="#60a5fa" textAnchor="middle" fontWeight="700">{time}</text>
          <text x="50" y="26" fontSize="8.5" fill="#e2e8f0" textAnchor="middle" fontWeight="800">{phase}</text>
          <text x="50" y="38" fontSize="7.5" fill="#64748b" textAnchor="middle">{sub}</text>
          {i < 5 && <text x="107" y="28" fontSize="10" fill="#1e3a5f" textAnchor="middle">›</text>}
        </g>
      ))}

      {/* ── INFO CARDS (right of timeline) ── */}
      <rect x={PANEL_RIGHT} y={BOTTOM_Y + 31} width={W - PANEL_RIGHT} height={H - BOTTOM_Y - 31} fill="#0a1628"/>
      {([
        ['Depth', `${minDepth}–${maxDepth}m`],
        ['Visibility', visibility],
        ['Water', temp],
        ['Best time', bestTime],
        ['Cert', minCert],
        ['Difficulty', difficulty],
      ] as [string,string][]).map(([k, v], i) => (
        <g key={k} transform={`translate(${PANEL_RIGHT + 8 + (i % 2) * 122}, ${BOTTOM_Y + 36 + Math.floor(i / 2) * 42})`}>
          <rect x="0" y="0" width="118" height="34" rx="5" fill="#0d2035" stroke="#1e3a5f" strokeWidth="1"/>
          <text x="8" y="13" fontSize="7.5" fill="#60a5fa" fontWeight="700">{k.toUpperCase()}</text>
          <text x="8" y="27" fontSize="9" fill="#e2e8f0" fontWeight="700">{v}</text>
        </g>
      ))}

    </svg>
  )
}
