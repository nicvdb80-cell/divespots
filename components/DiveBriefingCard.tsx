import { DiveSite } from '@/lib/data'

// ── canvas ──────────────────────────────────────────────────────────────────
const W  = 1080
const H  = 960
const DW = 760   // diagram section width
const RW = W - DW // right panel width = 320
const SY = 140   // surface y
const BY = 560   // diagram bottom y
const TY = 580   // timeline section y
const PT = 760   // pro tips row y

function dY(depth: number, max: number) {
  return SY + (depth / max) * (BY - SY - 10)
}

// ── terrain helpers ──────────────────────────────────────────────────────────
function WreckShape({ md }: { md: number }) {
  const keel  = dY(md * 0.75, md)
  const deck  = dY(md * 0.45, md)
  const bow   = 170
  const stern = 620
  const mid   = (bow + stern) / 2
  return (
    <g opacity="0.92">
      {/* hull */}
      <path d={`M${bow} ${keel} Q${mid} ${keel+18} ${stern} ${keel} L${stern} ${deck+10} Q${mid} ${deck-6} ${bow} ${deck+10} Z`}
        fill="#2a3a28" stroke="#3d5a35" strokeWidth="1.5"/>
      {/* superstructure */}
      <rect x={bow+60} y={deck-32} width="120" height="36" rx="4" fill="#1e2e1c" stroke="#3d5a35" strokeWidth="1"/>
      <rect x={bow+80} y={deck-52} width="60" height="24" rx="3" fill="#182416" stroke="#2d4228" strokeWidth="1"/>
      {/* mast */}
      <line x1={bow+108} y1={deck-52} x2={bow+112} y2={deck-90} stroke="#2d3d2a" strokeWidth="3"/>
      <line x1={bow+80} y1={deck-76} x2={bow+145} y2={deck-76} stroke="#2d3d2a" strokeWidth="1.5"/>
      {/* portholes */}
      {[bow+30,bow+180,bow+240,bow+310,bow+380].map((px,i) => (
        <circle key={i} cx={px} cy={(deck+keel)/2} r="6" fill="none" stroke="#3d5a35" strokeWidth="1.5"/>
      ))}
      {/* coral growth */}
      {[bow+20, bow+90, bow+200, bow+320, bow+480, stern-60].map((cx, i) => (
        <g key={i} transform={`translate(${cx},${keel})`}>
          <ellipse cx="0" cy="-4" rx={8+i%3*3} ry="8" fill={['#1a4a1a','#2d6b1f','#1e5c2d'][i%3]} opacity="0.8"/>
        </g>
      ))}
      {/* sandy slope */}
      <path d={`M0 ${BY} Q${DW/2} ${BY-20} ${DW} ${BY} L${DW} ${BY+15} L0 ${BY+15} Z`} fill="#c8a96e" opacity="0.35"/>
    </g>
  )
}

function WallShape({ md }: { md: number }) {
  return (
    <g>
      {/* cliff wall */}
      <path d={`M165 ${SY} L170 ${BY+10} Q175 ${BY+12} 200 ${BY+10} L210 ${SY}`}
        fill="#1a2e1a" stroke="#2d4a28" strokeWidth="2"/>
      {/* sea fans on wall */}
      {[0.25,0.45,0.62,0.78].map((frac,i) => {
        const fy = dY(md*frac, md)
        return (
          <g key={i} transform={`translate(${175+i*8}, ${fy})`}>
            <line x1="0" y1="0" x2={-30-i*8} y2="-35" stroke={['#e67e22','#8e44ad','#e74c3c','#f39c12'][i]} strokeWidth="1.5" opacity="0.8"/>
            <ellipse cx={-30-i*8} cy="-35" rx={12+i*4} ry="18" fill="none" stroke={['#e67e22','#8e44ad','#e74c3c','#f39c12'][i]} strokeWidth="1" opacity="0.7"/>
          </g>
        )
      })}
      {/* sandy bottom */}
      <path d={`M200 ${BY} Q${DW/2} ${BY-15} ${DW} ${BY} L${DW} ${BY+15} L200 ${BY+15} Z`} fill="#c8a96e" opacity="0.3"/>
    </g>
  )
}

function MuckShape({ md }: { md: number }) {
  return (
    <g>
      {/* black sand slope */}
      <path d={`M0 ${SY+40} Q${DW*0.4} ${BY-60} ${DW} ${BY-20} L${DW} ${BY+15} L0 ${BY+15} Z`}
        fill="#1a1a1e" stroke="#2a2a30" strokeWidth="1"/>
      {/* rubble patches */}
      {[120,220,350,480,590].map((rx,i) => (
        <ellipse key={i} cx={rx} cy={dY(md*(0.3+i*0.1), md)} rx={18+i*6} ry="7" fill="#2a2a35" opacity="0.7"/>
      ))}
      {/* sea grass patches */}
      {[160,280,420,540].map((gx,i) => (
        <g key={i} transform={`translate(${gx}, ${dY(md*(0.5+i*0.08),md)})`}>
          {[-6,-2,2,6].map(ox => (
            <line key={ox} x1={ox} y1="0" x2={ox+2} y2="-14" stroke="#2d5a1f" strokeWidth="1.5" opacity="0.7"/>
          ))}
        </g>
      ))}
    </g>
  )
}

function ReefShape({ md }: { md: number }) {
  return (
    <g>
      {/* reef slope */}
      <path d={`M100 ${SY+10} Q300 ${SY+60} 500 ${BY-80} Q600 ${BY-40} ${DW} ${BY}`}
        fill="#1a3a2a" stroke="#2d5a3d" strokeWidth="1.5" opacity="0.9"/>
      {/* coral heads */}
      {[140,220,310,410,510,590].map((cx,i) => {
        const cy = dY(md*(0.15+i*0.1), md)
        return (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx={16+i*3} ry={10+i*2} fill={['#2d6b1f','#7b3a1a','#1a5c3a','#6b2d7a','#1a4a5c','#5c3a1a'][i]} opacity="0.85"/>
          </g>
        )
      })}
      {/* sandy bottom patches */}
      <path d={`M350 ${BY-10} Q500 ${BY-30} ${DW} ${BY} L${DW} ${BY+15} L350 ${BY+15} Z`} fill="#c8a96e" opacity="0.3"/>
    </g>
  )
}

// ── dive route overlays ──────────────────────────────────────────────────────
function WreckRoute({ md, isBoat }: { md: number; isBoat: boolean }) {
  const keel = dY(md * 0.75, md)
  const deck = dY(md * 0.45, md)
  const entry = isBoat ? 260 : 120
  const pts = isBoat
    ? [[entry, SY+15],[200, deck+8],[350, (deck+keel)/2],[500, keel-5],[620, dY(md*0.25,md)]]
    : [[entry, SY+6],[200, deck+8],[350, (deck+keel)/2],[500, keel-5],[580, dY(md*0.25,md)]]
  return (
    <g>
      {pts.slice(0,-1).map(([x1,y1],i) => {
        const [x2,y2] = pts[i+1]
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="2" strokeDasharray="7,4" opacity="0.85"/>
      })}
      {pts.map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <circle cx="0" cy="0" r="13" fill="#0a1628" stroke="#fff" strokeWidth="2"/>
          <text x="0" y="5" fontSize="11" fill="#fff" textAnchor="middle" fontWeight="900">{i+1}</text>
        </g>
      ))}
      {/* safety stop */}
      <g transform={`translate(${pts[4][0]},${pts[4][1]})`}>
        <rect x="-44" y="-28" width="88" height="22" rx="4" fill="#16a34a" opacity="0.95"/>
        <text x="0" y="-13" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="700">SAFETY STOP  5m / 3 min</text>
      </g>
    </g>
  )
}

function WallRoute({ md, isBoat }: { md: number; isBoat: boolean }) {
  const entry = isBoat ? 300 : 180
  const pts = [
    [entry, SY+15],
    [230, dY(md*0.28, md)],
    [270, dY(md*0.60, md)],
    [310, dY(md*0.85, md)],
    [400, dY(0.18*md, md)],
  ]
  return (
    <g>
      {pts.slice(0,-1).map(([x1,y1],i) => {
        const [x2,y2] = pts[i+1]
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="2" strokeDasharray="7,4" opacity="0.85"/>
      })}
      {pts.map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <circle cx="0" cy="0" r="13" fill="#0a1628" stroke="#fff" strokeWidth="2"/>
          <text x="0" y="5" fontSize="11" fill="#fff" textAnchor="middle" fontWeight="900">{i+1}</text>
        </g>
      ))}
      <g transform={`translate(${pts[4][0]},${pts[4][1]})`}>
        <rect x="-44" y="-28" width="88" height="22" rx="4" fill="#16a34a" opacity="0.95"/>
        <text x="0" y="-13" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="700">SAFETY STOP  5m / 3 min</text>
      </g>
    </g>
  )
}

function ReefRoute({ md, isBoat }: { md: number; isBoat: boolean }) {
  const entry = isBoat ? 300 : 150
  const pts = [
    [entry, SY+15],
    [250, dY(md*0.25, md)],
    [380, dY(md*0.55, md)],
    [530, dY(md*0.80, md)],
    [620, dY(0.15*md, md)],
  ]
  return (
    <g>
      {pts.slice(0,-1).map(([x1,y1],i) => {
        const [x2,y2] = pts[i+1]
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="2" strokeDasharray="7,4" opacity="0.85"/>
      })}
      {pts.map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <circle cx="0" cy="0" r="13" fill="#0a1628" stroke="#fff" strokeWidth="2"/>
          <text x="0" y="5" fontSize="11" fill="#fff" textAnchor="middle" fontWeight="900">{i+1}</text>
        </g>
      ))}
      <g transform={`translate(${pts[4][0]},${pts[4][1]})`}>
        <rect x="-44" y="-28" width="88" height="22" rx="4" fill="#16a34a" opacity="0.95"/>
        <text x="0" y="-13" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="700">SAFETY STOP  5m / 3 min</text>
      </g>
    </g>
  )
}

// ── marine life label ────────────────────────────────────────────────────────
function MLTag({ x, y, name, depth, emoji }: { x:number; y:number; name:string; depth:string; emoji:string }) {
  const label = name.length > 18 ? name.slice(0,17)+'…' : name
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-4" y="-10" width={label.length*5.8+36} height="26" rx="5" fill="#0a1628" stroke="#f59e0b" strokeWidth="1.2" opacity="0.92"/>
      <text x="4" y="5" fontSize="10" fill="#f59e0b">{emoji}</text>
      <text x="20" y="5" fontSize="9" fill="#fde68a" fontWeight="600">{label}</text>
      <text x={label.length*5.8+16} y="5" fontSize="8" fill="#64748b"> {depth}</text>
    </g>
  )
}

// ── boat / shore ─────────────────────────────────────────────────────────────
function BoatSVG({ x, y }: { x:number; y:number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M-40 0 Q-30 -6 0 -6 Q30 -6 40 0 Q30 6 -30 6 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1"/>
      <rect x="-12" y="-22" width="24" height="16" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1"/>
      <line x1="0" y1="-22" x2="0" y2="-38" stroke="#94a3b8" strokeWidth="1.5"/>
      <rect x="-18" y="-42" width="36" height="8" rx="2" fill="#ef4444" opacity="0.9"/>
    </g>
  )
}

function getMLEmoji(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('turtle'))         return '🐢'
  if (n.includes('manta'))          return '🦈'
  if (n.includes('shark'))          return '🦈'
  if (n.includes('ray'))            return '🐟'
  if (n.includes('nudibranch') || n.includes('nudi')) return '🐌'
  if (n.includes('frogfish'))       return '🐸'
  if (n.includes('octopus'))        return '🐙'
  if (n.includes('seahorse'))       return '🐴'
  if (n.includes('coral'))          return '🪸'
  if (n.includes('barracuda'))      return '🐡'
  if (n.includes('school') || n.includes('fusilier') || n.includes('jack')) return '🐠'
  if (n.includes('eel'))            return '🐍'
  if (n.includes('cuttlefish'))     return '🦑'
  if (n.includes('dolphin'))        return '🐬'
  if (n.includes('whale'))          return '🐳'
  if (n.includes('clam'))           return '🐚'
  return '🐠'
}

function getTimelineSteps(site: DiveSite): [string,string,string][] {
  const { diagramType, type, access, maxDepth } = site
  const isBoat = access === 'Boat'
  if (diagramType === 'wreck') return [
    ['0–5 MIN','DESCEND','Mooring line to wreck'],
    ['5–15 MIN','BOW SECTION','Explore bow & photos'],
    ['15–25 MIN','MID SHIP','Engine room & cargo'],
    ['25–35 MIN','STERN SECTION',`Propeller & deck`],
    ['35–40 MIN','RETURN','Swim back along slope'],
    ['40–45 MIN','SAFETY STOP','5m / 3 min'],
    ['45–50 MIN','PICK UP',isBoat ? 'By boat' : 'Shore exit'],
  ]
  if (diagramType === 'wall') return [
    ['0–5 MIN','DESCEND','Entry & descent'],
    ['5–15 MIN','UPPER WALL','Coral & fan zone'],
    ['15–25 MIN','MID WALL',`~${Math.round(maxDepth*0.6)}m`],
    ['25–35 MIN','DEEP WALL',`Max ${maxDepth}m`],
    ['35–42 MIN','ASCENT','Return up wall'],
    ['42–48 MIN','SAFETY STOP','5m / 3 min'],
    ['48–55 MIN','PICK UP',isBoat ? 'By boat' : 'Shore exit'],
  ]
  if (type === 'Muck') return [
    ['0–5 MIN','ENTRY','Slow descent'],
    ['5–20 MIN','SAND ZONE 1','Grid search'],
    ['20–35 MIN','RUBBLE ZONE','Macro critters'],
    ['35–45 MIN','SAND ZONE 2','Return route'],
    ['45–50 MIN','ASCENT','Slow & controlled'],
    ['50–53 MIN','SAFETY STOP','5m / 3 min'],
    ['53–55 MIN','EXIT',isBoat ? 'By boat' : 'Shore'],
  ]
  return [
    ['0–5 MIN','DESCEND','Entry line'],
    ['5–15 MIN','SHALLOW REEF',`~${Math.round(maxDepth*0.25)}m`],
    ['15–25 MIN','MAIN REEF',`~${Math.round(maxDepth*0.55)}m`],
    ['25–35 MIN','DEEP POINT',`Max ${maxDepth}m`],
    ['35–42 MIN','RETURN','Ascend reef slope'],
    ['42–47 MIN','SAFETY STOP','5m / 3 min'],
    ['47–50 MIN','PICK UP',isBoat ? 'By boat' : 'Shore exit'],
  ]
}

function getWaypointLabels(site: DiveSite): string[] {
  const { diagramType, type, access } = site
  const isBoat = access === 'Boat'
  if (diagramType === 'wreck') return [
    isBoat ? 'Boat entry & descent' : 'Shore entry & descend',
    'Wreck bow exploration',
    'Mid-ship & engine room',
    'Stern & propeller',
    'Safety stop & exit',
  ]
  if (diagramType === 'wall') return [
    isBoat ? 'Boat entry' : 'Shore entry',
    'Upper wall (corals & fans)',
    'Mid wall section',
    'Maximum depth / turn',
    'Safety stop & exit',
  ]
  if (type === 'Muck') return [
    'Entry — slow descent',
    'Sand search zone 1',
    'Rubble / critter zone',
    'Return sand zone',
    'Safety stop & exit',
  ]
  return [
    isBoat ? 'Boat entry & descent' : 'Shore entry',
    'Shallow reef (photos)',
    'Main reef / deepest',
    'Turn & begin ascent',
    'Safety stop & exit',
  ]
}

function getProTips(site: DiveSite): [string,string,string][] {
  const { type, diagramType, current, marineLife, access } = site
  const topML = marineLife[0]?.name ?? 'marine life'
  const strongCurrent = current.toLowerCase().includes('strong') || current.toLowerCase().includes('very')
  const tips: [string,string,string][] = []
  if (diagramType === 'wreck') tips.push(['💡','PRO TIP','Bring wide-angle for the wreck & macro lens for critters on the sandy slope.'])
  else if (type === 'Muck')    tips.push(['💡','PRO TIP',`Move at a crawl — your divemaster will spot ${topML} for you. Never touch the sand.`])
  else if (diagramType === 'wall') tips.push(['💡','PRO TIP','Look into every sea fan for pygmy seahorses. Check crevices on the way up.'])
  else                             tips.push(['💡','PRO TIP',`Morning dives are best for visibility and active ${topML} encounters.`])
  tips.push(['👤','FOLLOW YOUR GUIDE','Stay with your buddy and follow the planned route.'])
  tips.push(['🚫','DON\'T TOUCH','Respect the reef and marine life — hands off everything.'])
  tips.push(['🎯','CHECK AIR','Monitor your air and depth throughout the dive.'])
  if (strongCurrent) tips.push(['⚠️','STRONG CURRENT','Always carry SMB. Dive only at the planned tide. Stay close to your guide.'])
  else               tips.push(['❤️','ENJOY THE DIVE',`One of ${site.area}'s most iconic underwater experiences!`])
  return tips
}

// ── main component ───────────────────────────────────────────────────────────
export default function DiveBriefingCard({ site }: { site: DiveSite }) {
  const { maxDepth: md, minDepth, visibility, temp, difficulty, minCert,
          bestTime, type, access, current, diagramType, name, area,
          marineLife, safetyNotes, rank } = site

  const isBoat   = access === 'Boat'
  const isWreck  = diagramType === 'wreck'
  const isWall   = diagramType === 'wall'
  const isMuck   = type === 'Muck'
  const isDrift  = type === 'Drift'
  const hasStrong = current.toLowerCase().includes('strong') || current.toLowerCase().includes('very')

  const depthSteps: number[] = []
  const step = md <= 20 ? 5 : 5
  for (let d = 0; d <= md + 2; d += step) depthSteps.push(d)

  const ml    = marineLife.slice(0, 5)
  const haz   = safetyNotes.slice(0, 4)
  const steps = getTimelineSteps(site)
  const wpts  = getWaypointLabels(site)
  const tips  = getProTips(site)
  const id    = site.slug.replace(/[^a-z0-9]/g,'-')

  // marine life y positions (spread across depth)
  const mlPositions = [
    { x: isWall ? 240 : 230, y: dY(md * 0.22, md) - 36 },
    { x: isWall ? 290 : 380, y: dY(md * 0.45, md) - 36 },
    { x: isWall ? 330 : 500, y: dY(md * 0.65, md) - 36 },
    { x: isWall ? 380 : 420, y: dY(md * 0.80, md) + 14  },
    { x: isWall ? 420 : 570, y: dY(md * 0.35, md) + 14  },
  ]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
      style={{ width:'100%', height:'auto', display:'block', fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif", borderRadius: 12 }}>

      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#bfdbfe"/>
          <stop offset="100%" stopColor="#93c5fd"/>
        </linearGradient>
        <linearGradient id={`water-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#0369a1" stopOpacity="0.55"/>
          <stop offset="50%" stopColor="#075985" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#020d1a" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id={`panel-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070f1c"/>
          <stop offset="100%" stopColor="#0a1628"/>
        </linearGradient>
        <linearGradient id={`footer-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060d1a"/>
          <stop offset="100%" stopColor="#040b16"/>
        </linearGradient>
      </defs>

      {/* ── background ── */}
      <rect width={W} height={H} fill="#060e1c" rx="12"/>

      {/* ── HEADER ── */}
      <rect x="0" y="0" width={W} height="110" rx="12" fill={`url(#panel-${id})`}/>
      <rect x="0" y="98" width={W} height="12" fill={`url(#panel-${id})`}/>
      <rect x="0" y="108" width={W} height="1" fill="#1e3a5f"/>

      {/* orange DIVE BRIEFING label */}
      <text x="28" y="38" fontSize="11" fill="#f97316" fontWeight="800" letterSpacing="1.5">DIVE BRIEFING</text>
      {/* site name */}
      <text x="28" y="70" fontSize="30" fill="#ffffff" fontWeight="900" letterSpacing="-0.5">{name.toUpperCase()}</text>
      {/* location breadcrumb */}
      <text x="30" y="95" fontSize="11" fill="#64748b">📍 {area}  ›  Indonesia</text>

      {/* rank badge */}
      <rect x={W-320} y="22" width="130" height="30" rx="15" fill="#0d1f36" stroke="#3b82f6" strokeWidth="1.2"/>
      <text x={W-255} y="41" fontSize="10" fill="#60a5fa" textAnchor="middle" fontWeight="700">#{rank} in {area}</text>

      {/* verified badge */}
      <rect x={W-180} y="22" width="152" height="30" rx="15" fill="#052e16" stroke="#16a34a" strokeWidth="1.2"/>
      <text x={W-174} y="41" fontSize="10" fill="#22c55e" fontWeight="700">✓  Verified by local experts</text>

      {/* ── DIAGRAM SECTION ── */}
      {/* sky */}
      <rect x="0" y="110" width={DW} height={SY - 110} fill={`url(#sky-${id})`}/>
      {/* water */}
      <rect x="0" y={SY} width={DW} height={BY - SY + 20} fill={`url(#water-${id})`}/>

      {/* boat or shore */}
      {isBoat ? (
        <g>
          <BoatSVG x={isWall ? 320 : 280} y={SY - 28}/>
          <line x1={isWall?320:280} y1={SY-8} x2={isWall?280:250} y2={SY+2} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,3" opacity="0.7"/>
          <text x={isWall?240:210} y={SY-38} fontSize="9" fill="#94a3b8" fontWeight="700">BOAT DROP</text>
          {/* PICK UP boat on right */}
          <BoatSVG x={660} y={SY - 28}/>
          <text x={640} y={SY-42} fontSize="9" fill="#94a3b8" fontWeight="700">PICK UP</text>
        </g>
      ) : (
        <g>
          {/* land */}
          <path d={`M0 110 L0 ${SY-16} Q40 ${SY-22} 80 ${SY-14} Q110 ${SY-6} 140 ${SY} L0 ${SY} Z`} fill="#4a7c42"/>
          <path d={`M0 110 L0 ${SY-18} Q40 ${SY-26} 80 ${SY-16}`} fill="none" stroke="#3a6a32" strokeWidth="2"/>
          {/* beach */}
          <path d={`M0 ${SY-6} Q60 ${SY-10} 120 ${SY-3} Q135 ${SY} 150 ${SY+1}`} fill="#c8a96e"/>
          <text x="68" y={SY-22} fontSize="8" fill="#94a3b8" textAnchor="middle">SHORE ENTRY</text>
        </g>
      )}

      {/* surface line */}
      <line x1="0" y1={SY} x2={DW} y2={SY} stroke="#7dd3fc" strokeWidth="1.2" strokeDasharray="8,5" opacity="0.6"/>
      <text x="10" y={SY-6} fontSize="9" fill="#94a3b8" fontWeight="600" letterSpacing="0.5">SURFACE</text>

      {/* depth markers */}
      {depthSteps.map(d => {
        const y = dY(d, md)
        if (y > BY + 12) return null
        const isMax = d === md
        return (
          <g key={d}>
            <line x1="56" y1={y} x2={DW-4} y2={y}
              stroke={isMax ? '#ef4444' : '#1e3a5f'}
              strokeWidth={isMax ? 1.4 : 0.6}
              strokeDasharray={isMax ? '6,3' : '2,8'}
              opacity={isMax ? 0.95 : 0.6}/>
            <text x="50" y={y+4} fontSize="9" fill={isMax ? '#ef4444' : '#60a5fa'} textAnchor="end" fontWeight={isMax?'800':'400'}>{d}m</text>
            {isMax && <text x="62" y={y-7} fontSize="8.5" fill="#ef4444" fontWeight="800">MAX DEPTH {d}m</text>}
          </g>
        )
      })}

      {/* terrain */}
      {isWreck && <WreckShape md={md}/>}
      {isWall  && <WallShape  md={md}/>}
      {isMuck  && <MuckShape  md={md}/>}
      {!isWreck && !isWall && !isMuck && <ReefShape md={md}/>}

      {/* dive route */}
      {isWreck && <WreckRoute md={md} isBoat={isBoat}/>}
      {isWall  && <WallRoute  md={md} isBoat={isBoat}/>}
      {!isWreck && !isWall && <ReefRoute md={md} isBoat={isBoat}/>}

      {/* current arrows */}
      <g transform={`translate(${isWall?330:290}, ${SY + 30})`}>
        {[0,16,32,48,64].map(ox => (
          <path key={ox} d={`M${ox} 0 L${ox+10} -5 L${ox+10} 5 Z`} fill="#38bdf8" opacity="0.75"/>
        ))}
        <text x="80" y="5" fontSize="9" fill="#38bdf8" fontWeight="600">CURRENT  {hasStrong ? '— STRONG' : ''}</text>
      </g>

      {/* compass */}
      <g transform={`translate(${DW-32}, ${SY - 32})`}>
        <circle cx="0" cy="0" r="22" fill="#0d1f36" stroke="#1e3a5f" strokeWidth="1.5"/>
        <polygon points="0,-15 4,6 0,2 -4,6" fill="#e2e8f0"/>
        <polygon points="0,15 4,-6 0,-2 -4,-6" fill="#475569"/>
        <text x="0" y="-19" fontSize="9" fill="#60a5fa" textAnchor="middle" fontWeight="800">N</text>
      </g>

      {/* marine life tags */}
      {ml.map((m, i) => {
        const pos = mlPositions[i] ?? mlPositions[mlPositions.length-1]
        const depth = `${Math.round(md*(0.2+i*0.15))}–${Math.round(md*(0.35+i*0.15))}m`
        return <MLTag key={i} x={pos.x} y={pos.y} name={m.name} depth={depth} emoji={getMLEmoji(m.name)}/>
      })}

      {/* bottom divider */}
      <rect x="0" y={BY+18} width={DW} height="1" fill="#1e3a5f"/>

      {/* ── RIGHT PANEL ── */}
      <rect x={DW} y="110" width={RW} height={TY - 110} fill="#060e1c"/>
      <rect x={DW} y="110" width="1" height={TY - 110} fill="#1e3a5f"/>

      {/* LEGEND */}
      <rect x={DW+12} y="118" width={RW-24} height="170" rx="8" fill="#0d2035" stroke="#1e3a5f" strokeWidth="1"/>
      <text x={DW+22} y="138" fontSize="10" fill="#94a3b8" fontWeight="800" letterSpacing="1.5">LEGEND</text>
      {([
        ['╌ ╌','#ffffff','Entry / Descent'],
        ['╌ ╌','#ffffff','Route'],
        ['●',  '#22c55e','Safety Stop'],
        ['▲',  '#3b82f6','Pick Up'],
        ['›',  '#38bdf8','Current'],
        ['★',  '#fbbf24','Marine Life'],
        ['⚠',  '#f87171','Hazard'],
      ] as [string,string,string][]).map(([sym,col,lbl],i) => (
        <g key={i} transform={`translate(${DW+22},${154+i*20})`}>
          <text x="0" y="0" fontSize="12" fill={col} fontWeight="700">{sym}</text>
          <text x="26" y="1" fontSize="10" fill="#94a3b8">{lbl}</text>
        </g>
      ))}

      {/* SITE HAZARDS */}
      <rect x={DW+12} y="298" width={RW-24} height={haz.length*28+34} rx="8" fill="#12080a" stroke="#7f1d1d" strokeWidth="1"/>
      <text x={DW+22} y="316" fontSize="10" fill="#f87171" fontWeight="800" letterSpacing="1.5">SITE HAZARDS</text>
      {haz.map((n,i) => (
        <text key={i} x={DW+22} y={334+i*26} fontSize="9" fill="#fca5a5">
          ⚠  {n.length > 30 ? n.slice(0,29)+'…' : n}
        </text>
      ))}

      {/* WAYPOINTS */}
      {(() => {
        const wy = 298 + haz.length * 28 + 44
        return (
          <g>
            <rect x={DW+12} y={wy} width={RW-24} height={wpts.length*24+34} rx="8" fill="#0d2035" stroke="#1e3a5f" strokeWidth="1"/>
            <text x={DW+22} y={wy+18} fontSize="10" fill="#94a3b8" fontWeight="800" letterSpacing="1.5">ROUTE WAYPOINTS</text>
            {wpts.map((lbl,i) => (
              <g key={i} transform={`translate(${DW+22},${wy+36+i*24})`}>
                <circle cx="10" cy="-6" r="9" fill="#0a1628" stroke="#fff" strokeWidth="1.5"/>
                <text x="10" y="-2" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="800">{i+1}</text>
                <text x="26" y="-1" fontSize="9" fill="#94a3b8">{lbl}</text>
              </g>
            ))}
          </g>
        )
      })()}

      {/* ── INFO BAR ── */}
      <rect x="0" y={TY} width={W} height="60" fill="#04090f"/>
      <rect x="0" y={TY} width={W} height="1" fill="#1e3a5f"/>
      {([
        ['DIVE TYPE',    type],
        ['DIFFICULTY',   difficulty],
        ['CERTIFICATION',minCert],
        ['ACCESS',       access],
        ['DEPTH RANGE',  `${minDepth}–${md}m`],
        ['VISIBILITY',   visibility],
        ['WATER TEMP',   temp],
        ['BEST TIME',    bestTime],
      ] as [string,string][]).map(([k,v],i) => (
        <g key={k} transform={`translate(${18 + i * (W/8)}, ${TY+12})`}>
          <text x="0" y="0"  fontSize="7.5" fill="#475569" fontWeight="700" letterSpacing="0.5">{k}</text>
          <text x="0" y="16" fontSize="10"  fill="#e2e8f0" fontWeight="700">{v}</text>
          {i < 7 && <line x1={W/8-10} y1="-2" x2={W/8-10} y2="28" stroke="#1e3a5f" strokeWidth="1" opacity="0.6"/>}
        </g>
      ))}

      {/* ── TIMELINE ── */}
      <rect x="0" y={TY+60} width={W} height="120" fill={`url(#footer-${id})`}/>
      <rect x="0" y={TY+60} width={W} height="1" fill="#1e3a5f"/>
      <text x="20" y={TY+80} fontSize="10" fill="#60a5fa" fontWeight="800" letterSpacing="1.5">DIVE TIMELINE (APPROX. 45–55 MIN)</text>

      {steps.map(([time,phase,sub],i) => {
        const cardW = (W - 36) / steps.length
        const cx = 18 + i * cardW
        return (
          <g key={i} transform={`translate(${cx},${TY+88})`}>
            <rect x="0" y="0" width={cardW-8} height="60" rx="6" fill="#0d2035" stroke="#1e3a5f" strokeWidth="1"/>
            <text x={(cardW-8)/2} y="16" fontSize="7.5" fill="#60a5fa" textAnchor="middle" fontWeight="700">{time}</text>
            <text x={(cardW-8)/2} y="35" fontSize="10"  fill="#e2e8f0" textAnchor="middle" fontWeight="800">{phase}</text>
            <text x={(cardW-8)/2} y="51" fontSize="8"   fill="#64748b" textAnchor="middle">{sub}</text>
            {i < steps.length-1 && <text x={cardW-2} y="34" fontSize="14" fill="#334155" textAnchor="middle">›</text>}
          </g>
        )
      })}

      {/* ── PRO TIPS ROW ── */}
      <rect x="0" y={PT} width={W} height="110" fill="#040b16"/>
      <rect x="0" y={PT} width={W} height="1" fill="#1e3a5f"/>
      {tips.map(([icon,label,text],i) => {
        const colW = W / tips.length
        return (
          <g key={i} transform={`translate(${i*colW + 18}, ${PT+14})`}>
            <text x="0" y="0" fontSize="16">{icon}</text>
            <text x="28" y="2"  fontSize="9"  fill="#60a5fa" fontWeight="800">{label}</text>
            <text x="0"  y="18" fontSize="8.5" fill="#64748b" style={{wordSpacing: '-0.5px'}}>
              {text.length > 42
                ? <><tspan x="0" dy="0">{text.slice(0,42)}</tspan><tspan x="0" dy="13">{text.slice(42,80)}{text.length>80?'…':''}</tspan></>
                : text}
            </text>
            {i < tips.length-1 && <line x1={colW-16} y1="-8" x2={colW-16} y2="82" stroke="#1e3a5f" strokeWidth="1" opacity="0.5"/>}
          </g>
        )
      })}

      {/* bottom bar */}
      <rect x="0" y={H-26} width={W} height="26" fill="#020810" rx="0"/>
      <rect x="0" y={H-26} width={W} height="1" fill="#1e3a5f"/>
      <text x="20" y={H-10} fontSize="9" fill="#334155">dive-spots.com</text>
      <text x={W/2} y={H-10} fontSize="9" fill="#334155" textAnchor="middle">Always follow your dive guide&apos;s briefing.</text>
      <text x={W-20} y={H-10} fontSize="9" fill="#334155" textAnchor="end">© 2026 Dive Spots</text>
    </svg>
  )
}
