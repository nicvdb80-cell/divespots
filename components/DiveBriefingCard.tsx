import React from 'react'
import { DiveSite } from '@/lib/data'

// ═══════════════════════════════════════════════════════════════════════════
// DIVE SPOTS — OFFICIAL DIVE BRIEFING SYSTEM  v3.0
// Spec: Premium · Editorial · Consistent · Data-driven
// Canvas: 2048 × 2048 square
// ═══════════════════════════════════════════════════════════════════════════

const W = 2048
const H = 2048

// ── Layout zones (all heights must sum to H) ──────────────────────────────
const HDR_Y  = 0
const HDR_H  = 156    // Header
const DGM_Y  = 156    // Diagram start
const DGM_H  = 1072   // Diagram (~52% — "70%" of content below header)
const INF_Y  = 1228   // Info cards
const INF_H  = 148
const TML_Y  = 1376   // Timeline
const TML_H  = 234
const TIP_Y  = 1610   // Safety tips
const TIP_H  = 372
const FTR_Y  = 1982   // Footer
const FTR_H  = 66     // → total = 2048 ✓

// Diagram internals
const SKY_H  = 100    // sky band above water
const SY     = DGM_Y + SKY_H         // surface y
const BY     = DGM_Y + DGM_H - 40    // seabed y
const LP     = 1492   // left edge of right legend panel
const LW     = W - LP // = 556

function dY(depth: number, max: number) {
  return SY + (depth / max) * (BY - SY)
}

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────
const C = {
  // Backgrounds
  bg:         '#03101d',
  bgPanel:    '#061523',
  bgCard:     '#08192a',
  bgCardAlt:  '#0a1f34',
  bgDark:     '#020c16',

  // Ocean water gradient
  sea0:       '#165f8a',   // surface
  sea1:       '#0c3d5e',   // mid
  sea2:       '#040f1e',   // deep

  // Sky
  sky0:       '#7ec8e3',
  sky1:       '#aedcef',

  // Type
  white:      '#ffffff',
  offWhite:   '#e6edf3',
  grey1:      '#8fa8ba',
  grey2:      '#4a657a',
  grey3:      '#1e3346',
  divider:    '#142030',

  // Semantic
  green:      '#18c47a',
  greenBg:    '#082e1a',
  red:        '#e53248',
  redBg:      '#2a0812',
  orange:     '#f07828',
  yellow:     '#f4c418',
  blue:       '#2a96d6',
  teal:       '#00afc2',
  purple:     '#8050c8',
}

// ── TYPOGRAPHY helper ─────────────────────────────────────────────────────
type TProps = {
  x: number; y: number; size: number
  fill?: string; weight?: string; anchor?: string
  spacing?: string; children: React.ReactNode
}
function T({ x, y, size, fill = C.white, weight = '400', anchor = 'start', spacing = '0', children }: TProps) {
  return (
    <text x={x} y={y} fontSize={size} fill={fill} fontWeight={weight}
      textAnchor={anchor} letterSpacing={spacing}
      fontFamily="'Inter','Helvetica Neue',Arial,sans-serif">
      {children}
    </text>
  )
}

// SVG text wrapper that splits long lines
function TWrap({ x, y, size, fill = C.white, weight = '400', maxW, lineH, children }: {
  x: number; y: number; size: number; fill?: string; weight?: string
  maxW: number; lineH: number; children: string
}) {
  const words = children.split(' ')
  const charsPerLine = Math.floor(maxW / (size * 0.52))
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > charsPerLine && cur) {
      lines.push(cur.trim()); cur = w
    } else { cur = (cur + ' ' + w).trim() }
  }
  if (cur) lines.push(cur)
  return (
    <text x={x} y={y} fontSize={size} fill={fill} fontWeight={weight}
      fontFamily="'Inter','Helvetica Neue',Arial,sans-serif">
      {lines.map((l, i) => <tspan key={i} x={x} dy={i === 0 ? 0 : lineH}>{l}</tspan>)}
    </text>
  )
}

// ── FLAT VECTOR ICONS (consistent style) ─────────────────────────────────

function IconBoat({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* hull */}
      <path d="M-70 0 Q-52 -10 0 -12 Q52 -10 70 0 Q46 18 -46 18 Z"
        fill={C.offWhite} stroke={C.grey1} strokeWidth="2.5"/>
      {/* cabin */}
      <rect x="-22" y="-40" width="44" height="30" rx="4" fill={C.grey1} stroke={C.grey2} strokeWidth="2"/>
      {/* mast */}
      <line x1="2" y1="-40" x2="2" y2="-72" stroke={C.grey2} strokeWidth="3"/>
      <line x1="-28" y1="-58" x2="32" y2="-58" stroke={C.grey2} strokeWidth="2"/>
      {/* flag */}
      <rect x="-36" y="-74" width="70" height="12" rx="3" fill={C.orange}/>
      {/* dive flag */}
      <rect x="32" y="-72" width="20" height="14" rx="2" fill={C.red}/>
      <line x1="40" y1="-65" x2="52" y2="-72" stroke={C.white} strokeWidth="1.5"/>
    </g>
  )
}

function IconCompass({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="0" cy="0" r="52" fill={C.bgCard} stroke={C.grey2} strokeWidth="2.5"/>
      <circle cx="0" cy="0" r="44" fill="none" stroke={C.grey3} strokeWidth="1"/>
      {/* tick marks */}
      {Array.from({length:12}).map((_,i) => {
        const a = (i * 30 - 90) * Math.PI / 180
        const r1 = i%3===0 ? 36 : 40; const r2 = 44
        return <line key={i} x1={Math.cos(a)*r1} y1={Math.sin(a)*r1}
          x2={Math.cos(a)*r2} y2={Math.sin(a)*r2} stroke={C.grey2} strokeWidth={i%3===0?2:1}/>
      })}
      {/* N E S W */}
      {(['N','E','S','W'] as const).map((d,i) => {
        const angles = [-90, 0, 90, 180]
        const a = angles[i] * Math.PI / 180
        return <text key={d} x={Math.cos(a)*28} y={Math.sin(a)*28+5}
          fontSize="14" fill={d==='N'?C.orange:C.grey1}
          textAnchor="middle" fontWeight={d==='N'?'800':'600'}
          fontFamily="'Inter',Arial,sans-serif">{d}</text>
      })}
      {/* needle */}
      <polygon points="0,-30 6,8 0,2 -6,8" fill={C.white}/>
      <polygon points="0,30 6,-8 0,-2 -6,-8" fill={C.grey2}/>
      <circle cx="0" cy="0" r="4" fill={C.bgCard} stroke={C.white} strokeWidth="1.5"/>
    </g>
  )
}

function CurrentArrows({ x, y, strength }: { x: number; y: number; strength: 'weak'|'moderate'|'strong' }) {
  const counts = { weak:2, moderate:3, strong:5 }
  const cols   = { weak:'#4a9ab8', moderate:C.teal, strong:C.blue }
  const labels = { weak:'MILD CURRENT', moderate:'CURRENT', strong:'STRONG CURRENT' }
  const n = counts[strength]; const col = cols[strength]
  return (
    <g>
      {Array.from({length:n}).map((_,i) => (
        <path key={i} d={`M${x+i*46} ${y-12} L${x+i*46+24} ${y} L${x+i*46} ${y+12} L${x+i*46+8} ${y} Z`}
          fill={col} opacity={0.6+i*0.06}/>
      ))}
      <text x={x+n*46+16} y={y+6} fontSize="22" fill={col} fontWeight="700"
        fontFamily="'Inter',Arial,sans-serif" letterSpacing="1.5">{labels[strength]}</text>
    </g>
  )
}

// Waypoint: numbered circle. Last one = green safety stop.
function Wp({ x, y, n, total }: { x:number; y:number; n:number; total:number }) {
  const isSS = n === total
  const fill = isSS ? C.green : C.bgDark ?? '#03101d'
  const stroke = isSS ? C.green : C.white
  return (
    <g>
      <circle cx={x} cy={y} r="26" fill={fill} stroke={stroke} strokeWidth="3.5"/>
      <text x={x} y={y+8} fontSize="20" fill={C.white} textAnchor="middle" fontWeight="900"
        fontFamily="'Inter',Arial,sans-serif">{n}</text>
    </g>
  )
}

function SafetyBadge({ x, y }: { x:number; y:number }) {
  return (
    <g>
      <rect x={x-96} y={y-26} width="192" height="46" rx="10" fill={C.green} opacity="0.97"/>
      <text x={x} y={y-5} fontSize="16" fill={C.white} textAnchor="middle" fontWeight="800"
        fontFamily="'Inter',Arial,sans-serif" letterSpacing="1">SAFETY STOP</text>
      <text x={x} y={y+14} fontSize="13" fill="rgba(255,255,255,0.75)" textAnchor="middle"
        fontFamily="'Inter',Arial,sans-serif">5 metres  ·  3 minutes</text>
    </g>
  )
}

function HazardTag({ x, y, text }: { x:number; y:number; text:string }) {
  const t = text.length > 28 ? text.slice(0,27)+'…' : text
  const w = t.length * 10.5 + 56
  return (
    <g>
      <rect x={x} y={y-22} width={w} height="38" rx="8" fill={C.redBg} stroke={C.red} strokeWidth="1.8"/>
      {/* warning triangle icon */}
      <polygon points={`${x+14},${y+8} ${x+22},${y-14} ${x+30},${y+8}`}
        fill="none" stroke={C.red} strokeWidth="2" strokeLinejoin="round"/>
      <text x={x+22} y={y+5} fontSize="12" fill={C.red} textAnchor="middle" fontWeight="800"
        fontFamily="'Inter',Arial,sans-serif">!</text>
      <text x={x+42} y={y+4} fontSize="14" fill="#f87171" fontWeight="600"
        fontFamily="'Inter',Arial,sans-serif">{t}</text>
    </g>
  )
}

// ML label: flat vector style — coloured pill with species name + depth
function MLTag({ x, y, name, depth }: { x:number; y:number; name:string; depth:string }) {
  const label = name.length > 22 ? name.slice(0,21)+'…' : name
  const w = label.length * 10 + 24
  return (
    <g>
      <rect x={x} y={y-20} width={w} height="38" rx="8"
        fill="rgba(3,16,29,0.9)" stroke={C.yellow} strokeWidth="1.8"/>
      <rect x={x} y={y-20} width="4" height="38" rx="2" fill={C.yellow}/>
      <text x={x+14} y={y-2} fontSize="14" fill={C.yellow} fontWeight="700"
        fontFamily="'Inter',Arial,sans-serif" letterSpacing="0.3">{label}</text>
      <text x={x+14} y={y+14} fontSize="12" fill={C.grey1}
        fontFamily="'Inter',Arial,sans-serif">{depth}</text>
    </g>
  )
}

// ── TERRAIN TEMPLATES ─────────────────────────────────────────────────────

function TrWreck({ md }: { md:number }) {
  const keel = dY(md*0.76, md)
  const deck = dY(md*0.45, md)
  const bow = 210, stern = 780, mid = (bow+stern)/2
  return (
    <g>
      {/* seabed sand */}
      <path d={`M0 ${BY} Q${LP*0.55} ${BY-28} ${LP} ${BY} L${LP} ${BY+50} L0 ${BY+50} Z`}
        fill="#b8924a" opacity="0.24"/>
      {/* hull — organic shape */}
      <path d={`M${bow} ${keel+8}
                Q${bow+60} ${keel+28} ${mid} ${keel+18} Q${stern-80} ${keel+22} ${stern} ${keel-4}
                L${stern-10} ${deck+16}
                Q${mid} ${deck-10} ${bow+40} ${deck+14} Z`}
        fill="#18271a" stroke="#253c22" strokeWidth="2.5"/>
      {/* superstructure */}
      <rect x={bow+90} y={deck-52} width="160" height="60" rx="6" fill="#111e12" stroke="#1e3020" strokeWidth="2"/>
      <rect x={bow+120} y={deck-94} width="82" height="46" rx="5" fill="#0d170e" stroke="#1e3020" strokeWidth="1.5"/>
      {/* mast */}
      <line x1={bow+160} y1={deck-94} x2={bow+164} y2={deck-148} stroke="#1c2e1e" strokeWidth="5"/>
      <line x1={bow+100} y1={deck-124} x2={bow+240} y2={deck-124} stroke="#1c2e1e" strokeWidth="2.5"/>
      {/* portholes */}
      {[bow+38,bow+200,bow+310,bow+430,bow+560,bow+680].map((px,i) => (
        <circle key={i} cx={px} cy={(deck+keel)/2+4} r="9"
          fill="none" stroke="#253c22" strokeWidth="2"/>
      ))}
      {/* coral growth on hull */}
      {[bow+30,bow+130,bow+260,bow+400,bow+540,bow+670,stern-100].map((cx,i) => (
        <ellipse key={i} cx={cx} cy={keel+4}
          rx={14+(i%4)*5} ry={11}
          fill={['#174a17','#256b1f','#1c5c2c','#245a18','#173c26','#174a17','#1c5c2c'][i%7]}
          opacity="0.92"/>
      ))}
      {/* anchor chain */}
      <path d={`M${bow+22} ${deck+12} Q${bow-40} ${dY(md*0.62,md)} ${bow-70} ${keel+12}`}
        fill="none" stroke="#1e3020" strokeWidth="3.5" strokeDasharray="7,5"/>
      {/* swim-through on bow */}
      <path d={`M${bow+60} ${deck+8} Q${bow+90} ${deck-8} ${bow+130} ${deck+8}`}
        fill="none" stroke="#20401e" strokeWidth="3"/>
    </g>
  )
}

function TrWall({ md }: { md:number }) {
  const wallX = 210
  return (
    <g>
      {/* main wall body — irregular face */}
      <path d={`M${wallX-30} ${SY}
                Q${wallX-10} ${dY(md*0.12,md)} ${wallX+8} ${dY(md*0.25,md)}
                Q${wallX-18} ${dY(md*0.40,md)} ${wallX+12} ${dY(md*0.55,md)}
                Q${wallX-8} ${dY(md*0.70,md)} ${wallX+6} ${dY(md*0.85,md)}
                Q${wallX+14} ${dY(md*0.95,md)} ${wallX+20} ${BY+50}
                L${wallX-80} ${BY+50} L${wallX-80} ${SY} Z`}
        fill="#122818" stroke="#1c3e24" strokeWidth="2"/>
      {/* rock strata lines */}
      {[0.18,0.32,0.48,0.62,0.76,0.90].map((f,i) => (
        <path key={i}
          d={`M${wallX-60} ${dY(md*f,md)} Q${wallX} ${dY(md*f,md)+(i%2?6:-6)} ${wallX+14} ${dY(md*f,md)+(i%2?-4:4)}`}
          fill="none" stroke="#1c3e24" strokeWidth="1.2" opacity="0.8"/>
      ))}
      {/* sea fans — organic */}
      {[
        {f:0.15, xo:-80, col:C.orange,  sz:90},
        {f:0.30, xo:-50, col:'#9055d0', sz:70},
        {f:0.47, xo:-100,col:C.red,     sz:110},
        {f:0.63, xo:-60, col:'#f0a820', sz:80},
        {f:0.80, xo:-90, col:'#40a8c8', sz:95},
      ].map(({f,xo,col,sz},i) => {
        const fy = dY(md*f, md)
        return (
          <g key={i} transform={`translate(${wallX+14},${fy})`}>
            {/* stem */}
            <line x1="0" y1="0" x2={xo*0.4} y2={-sz*0.5} stroke={col} strokeWidth="3" opacity="0.85"/>
            {/* fan body — ellipse outline */}
            <ellipse cx={xo*0.7} cy={-sz*0.65}
              rx={sz*0.42} ry={sz*0.26}
              fill="none" stroke={col} strokeWidth="2" opacity="0.65"
              transform={`rotate(${-20+i*10},${xo*0.7},${-sz*0.65})`}/>
            {/* branch */}
            <line x1={xo*0.3} y1={-sz*0.3} x2={xo*0.85} y2={-sz*0.55}
              stroke={col} strokeWidth="1.5" opacity="0.5"/>
          </g>
        )
      })}
      {/* black coral clusters */}
      {[0.38,0.62,0.82].map((f,i) => {
        const fy = dY(md*f, md)
        return (
          <g key={i} transform={`translate(${wallX-10},${fy})`}>
            {[[-40,-60],[-20,-45],[-60,-42]].map(([bx,by],bi) => (
              <line key={bi} x1="0" y1="0" x2={bx} y2={by}
                stroke="#111" strokeWidth={3-bi*0.6}/>
            ))}
          </g>
        )
      })}
      {/* sandy base */}
      <path d={`M${wallX+20} ${BY} Q${LP*0.55} ${BY-22} ${LP} ${BY} L${LP} ${BY+50} L${wallX+20} ${BY+50} Z`}
        fill="#b8924a" opacity="0.22"/>
    </g>
  )
}

function TrReef({ md }: { md:number }) {
  return (
    <g>
      {/* reef slope — natural organic curve */}
      <path d={`M120 ${SY+28}
                Q260 ${SY+110} 420 ${dY(md*0.38,md)}
                Q580 ${dY(md*0.56,md)} 780 ${dY(md*0.70,md)}
                Q960 ${dY(md*0.80,md)} ${LP} ${BY}`}
        fill="#122818" stroke="#1c3e24" strokeWidth="2.5" opacity="0.92"/>
      {/* coral heads — varied sizes */}
      {[
        {x:180, f:0.11, r:34, col:'#256b1f'},
        {x:290, f:0.20, r:28, col:'#6b2818'},
        {x:400, f:0.31, r:38, col:'#1a5c3a'},
        {x:510, f:0.42, r:24, col:'#502888'},
        {x:630, f:0.52, r:30, col:'#185068'},
        {x:760, f:0.62, r:26, col:'#5c3418'},
        {x:880, f:0.70, r:20, col:'#256b1f'},
        {x:990, f:0.75, r:28, col:'#38185c'},
        {x:1100,f:0.78, r:22, col:'#186048'},
      ].map((c,i) => (
        <ellipse key={i} cx={c.x} cy={dY(md*c.f,md)} rx={c.r} ry={c.r*0.55} fill={c.col} opacity="0.90"/>
      ))}
      {/* soft coral branches */}
      {[200,360,540,720,900,1060].map((cx,i) => {
        const cy = dY(md*(0.14+i*0.10),md)
        const cols = ['#d4a0e0','#e8d084','#88c8e0','#e89090','#90d8a0','#c0a8f0']
        return (
          <g key={i}>
            {[-14,-6,2,10,18].map(ox => (
              <line key={ox} x1={cx+ox} y1={cy} x2={cx+ox+4} y2={cy-26}
                stroke={cols[i%6]} strokeWidth="3" opacity="0.7"/>
            ))}
          </g>
        )
      })}
      {/* sand patches */}
      <ellipse cx="850" cy={BY-18} rx="180" ry="22" fill="#b8924a" opacity="0.28"/>
      <ellipse cx="1200" cy={BY-10} rx="140" ry="16" fill="#b8924a" opacity="0.22"/>
    </g>
  )
}

function TrMuck({ md }: { md:number }) {
  return (
    <g>
      {/* black sand slope */}
      <path d={`M0 ${SY+80}
                Q350 ${BY-100} 750 ${BY-50}
                Q1050 ${BY-20} ${LP} ${BY+10}
                L${LP} ${BY+50} L0 ${BY+50} Z`}
        fill="#12121e" stroke="#1c1c2c" strokeWidth="1.5"/>
      {/* debris / rubble */}
      {[160,300,460,620,780,940,1100,1280].map((rx,i) => (
        <ellipse key={i} cx={rx} cy={dY(md*(0.25+i*0.07),md)}
          rx={28+(i%4)*9} ry="10"
          fill={i%2?'#1e1e2e':'#1a1a28'} opacity="0.85"/>
      ))}
      {/* sea grass */}
      {[220,400,580,780,980,1160].map((gx,i) => {
        const gy = dY(md*(0.34+i*0.07),md)
        return (
          <g key={i}>
            {[-12,-5,2,9,16,23].map(ox => (
              <line key={ox} x1={gx+ox} y1={gy}
                x2={gx+ox+(i%2?3:-3)} y2={gy-22}
                stroke="#285c1e" strokeWidth="2.2" opacity="0.72"/>
            ))}
          </g>
        )
      })}
      {/* hydroids */}
      {[340,700,1080].map((hx,i) => {
        const hy = dY(md*(0.42+i*0.10),md)
        return (
          <g key={i}>
            {[-8,-2,4,10].map(ox => (
              <g key={ox}>
                <line x1={hx+ox} y1={hy} x2={hx+ox} y2={hy-16} stroke="#3a3a50" strokeWidth="1.5"/>
                {[-4,0,4].map(tx => (
                  <line key={tx} x1={hx+ox+tx} y1={hy-16}
                    x2={hx+ox+tx+(tx>0?4:tx<0?-4:0)} y2={hy-24}
                    stroke="#4a4a64" strokeWidth="1"/>
                ))}
              </g>
            ))}
          </g>
        )
      })}
    </g>
  )
}

function TrPinnacle({ md }: { md:number }) {
  const px = LP*0.42, py = dY(md*0.06,md)
  return (
    <g>
      {/* primary pinnacle */}
      <path d={`M${px-200} ${BY}
                Q${px-110} ${py+120} ${px-30} ${py+30}
                Q${px} ${py} ${px+30} ${py+30}
                Q${px+110} ${py+120} ${px+200} ${BY} Z`}
        fill="#122818" stroke="#1c3e24" strokeWidth="2.5"/>
      {/* secondary */}
      <path d={`M${px+240} ${BY}
                Q${px+320} ${py+220} ${px+400} ${py+140}
                Q${px+460} ${py+220} ${px+540} ${BY} Z`}
        fill="#0e1e12" stroke="#182c1e" strokeWidth="1.5" opacity="0.85"/>
      {/* coral on sides */}
      {[-140,-60,60,140].map((ox,i) => {
        const cpy = dY(md*(0.18+i*0.12),md)
        return <ellipse key={i} cx={px+ox} cy={cpy} rx="22" ry="12"
          fill={['#256b1f','#6b2818','#1a5c3a','#502888'][i]} opacity="0.9"/>
      })}
      {/* sandy basin */}
      <path d={`M0 ${BY} L${LP} ${BY} L${LP} ${BY+50} L0 ${BY+50} Z`}
        fill="#b8924a" opacity="0.26"/>
    </g>
  )
}

function TrDrift({ md }: { md:number }) {
  return (
    <g>
      {/* left reef wall */}
      <path d={`M0 ${SY+50}
                Q180 ${dY(md*0.28,md)} 380 ${dY(md*0.52,md)}
                Q500 ${dY(md*0.72,md)} ${LP*0.4} ${BY}`}
        fill="#122818" stroke="#1c3e24" strokeWidth="2.5"/>
      {/* right reef */}
      <path d={`M0 ${dY(md*0.14,md)}
                Q160 ${dY(md*0.36,md)} 340 ${dY(md*0.54,md)}
                Q480 ${BY-30} 660 ${BY}`}
        fill="#0e1e12" stroke="#182c1e" strokeWidth="1.5" opacity="0.75"/>
      {/* strong current visual — animated feel via layered arrows */}
      {[SY+90,SY+170,SY+250,SY+330].map((cy,ri) => (
        Array.from({length:7}).map((_,i) => (
          <path key={`${ri}-${i}`}
            d={`M${80+i*200} ${cy-14} L${80+i*200+28} ${cy} L${80+i*200} ${cy+14} L${80+i*200+10} ${cy} Z`}
            fill={C.teal} opacity={0.35+ri*0.07}/>
        ))
      ))}
      {/* channel sand bottom */}
      <ellipse cx={LP*0.5} cy={BY-14} rx="340" ry="20" fill="#b8924a" opacity="0.28"/>
    </g>
  )
}

// Template selector
function Terrain({ site }: { site:DiveSite }) {
  const md = site.maxDepth
  const n = site.name.toLowerCase()
  if (site.diagramType === 'wreck') return <TrWreck md={md}/>
  if (site.diagramType === 'wall')  return <TrWall  md={md}/>
  if (site.type === 'Muck')         return <TrMuck  md={md}/>
  if (site.type === 'Drift')        return <TrDrift md={md}/>
  if (n.includes('pinnacle')||n.includes('magic')||n.includes('mount')||n.includes('seamount'))
                                    return <TrPinnacle md={md}/>
  return <TrReef md={md}/>
}

// ── DIVE ROUTES ───────────────────────────────────────────────────────────

function DiveRoute({ pts }: { pts:[number,number][] }) {
  const n = pts.length
  const d = pts.map(([x,y],i)=>`${i===0?'M':'L'}${x} ${y}`).join(' ')
  return (
    <g>
      {/* subtle glow behind line */}
      <path d={d} fill="none" stroke="rgba(255,255,255,0.15)"
        strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
      {/* main route */}
      <path d={d} fill="none" stroke={C.white}
        strokeWidth="3.5" strokeDasharray="16,9" strokeLinecap="round" strokeLinejoin="round" opacity="0.92"/>
      {/* waypoints */}
      {pts.map(([x,y],i) => <Wp key={i} x={x} y={y} n={i+1} total={n}/>)}
      {/* safety stop badge above last point */}
      <SafetyBadge x={pts[n-1][0]} y={pts[n-1][1]-62}/>
    </g>
  )
}

function RouteWreck({ md, isBoat }: { md:number; isBoat:boolean }) {
  const keel = dY(md*0.76,md), deck = dY(md*0.45,md)
  const pts: [number,number][] = isBoat
    ? [[350,SY+22],[240,deck+16],[420,(deck+keel)/2+8],[620,keel-8],[820,dY(md*0.20,md)]]
    : [[160,SY+12],[240,deck+16],[420,(deck+keel)/2+8],[620,keel-8],[780,dY(md*0.20,md)]]
  return <DiveRoute pts={pts}/>
}

function RouteWall({ md, isBoat }: { md:number; isBoat:boolean }) {
  const pts: [number,number][] = [
    [isBoat?400:260, SY+22],
    [290, dY(md*0.26,md)],
    [310, dY(md*0.55,md)],
    [330, dY(md*0.84,md)],
    [600, dY(md*0.16,md)],
  ]
  return <DiveRoute pts={pts}/>
}

function RouteReef({ md, isBoat }: { md:number; isBoat:boolean }) {
  const pts: [number,number][] = [
    [isBoat?400:180, SY+22],
    [310, dY(md*0.24,md)],
    [500, dY(md*0.52,md)],
    [740, dY(md*0.80,md)],
    [920, dY(md*0.16,md)],
  ]
  return <DiveRoute pts={pts}/>
}

function RouteMuck({ md }: { md:number }) {
  const pts: [number,number][] = [
    [240, SY+22],
    [380, dY(md*0.30,md)],
    [560, dY(md*0.52,md)],
    [760, dY(md*0.70,md)],
    [920, dY(md*0.20,md)],
  ]
  return <DiveRoute pts={pts}/>
}

function Route({ site }: { site:DiveSite }) {
  const md = site.maxDepth, isBoat = site.access==='Boat'
  if (site.diagramType==='wreck') return <RouteWreck md={md} isBoat={isBoat}/>
  if (site.diagramType==='wall')  return <RouteWall  md={md} isBoat={isBoat}/>
  if (site.type==='Muck')         return <RouteMuck  md={md}/>
  return <RouteReef md={md} isBoat={isBoat}/>
}

// ── MARINE LIFE POSITIONS ─────────────────────────────────────────────────
function mlPositions(site: DiveSite): [number,number][] {
  const md = site.maxDepth
  if (site.diagramType==='wreck') return [
    [860, dY(md*0.16,md)],
    [920, dY(md*0.34,md)],
    [870, dY(md*0.54,md)],
    [940, dY(md*0.68,md)],
    [860, dY(md*0.44,md)],
  ]
  if (site.diagramType==='wall') return [
    [400, dY(md*0.20,md)],
    [460, dY(md*0.38,md)],
    [500, dY(md*0.58,md)],
    [440, dY(md*0.74,md)],
    [700, dY(md*0.30,md)],
  ]
  if (site.type==='Muck') return [
    [560, dY(md*0.26,md)-52],
    [750, dY(md*0.44,md)-52],
    [900, dY(md*0.60,md)-52],
    [660, dY(md*0.74,md)-52],
    [440, dY(md*0.50,md)-52],
  ]
  return [
    [980, dY(md*0.18,md)],
    [860, dY(md*0.38,md)],
    [1000,dY(md*0.56,md)],
    [880, dY(md*0.72,md)],
    [960, dY(md*0.28,md)],
  ]
}

// ── TIMELINE DATA ─────────────────────────────────────────────────────────
type TLStep = { time:string; phase:string; sub:string }
function getTimeline(site: DiveSite): TLStep[] {
  const { diagramType, type, access, maxDepth:md } = site
  const exit = access==='Boat' ? 'By boat' : 'Shore exit'
  if (diagramType==='wreck') return [
    {time:'0–5 min',  phase:'DESCEND',     sub:'Mooring line to wreck'},
    {time:'5–15 min', phase:'BOW SECTION', sub:'Explore bow & photos'},
    {time:'15–25 min',phase:'MID SHIP',    sub:'Engine room & cargo'},
    {time:'25–35 min',phase:'STERN',       sub:`Propeller · ${md}m max`},
    {time:'35–40 min',phase:'RETURN',      sub:'Sandy slope ascent'},
    {time:'40–48 min',phase:'SAFETY STOP', sub:'5m · 3 min'},
    {time:'48–50 min',phase:'EXIT',        sub:exit},
  ]
  if (diagramType==='wall') return [
    {time:'0–5 min',  phase:'DESCEND',     sub:'Entry & descent'},
    {time:'5–15 min', phase:'UPPER WALL',  sub:'Coral · fans · fish life'},
    {time:'15–25 min',phase:'MID WALL',    sub:`~${Math.round(md*0.55)}m section`},
    {time:'25–35 min',phase:'DEEP SECTION',sub:`Max ${md}m · turn`},
    {time:'35–42 min',phase:'ASCENT',      sub:'Return up the wall'},
    {time:'42–48 min',phase:'SAFETY STOP', sub:'5m · 3 min'},
    {time:'48–50 min',phase:'EXIT',        sub:exit},
  ]
  if (type==='Muck') return [
    {time:'0–5 min',  phase:'ENTRY',       sub:'Slow controlled descent'},
    {time:'5–20 min', phase:'SAND ZONE 1', sub:'Systematic grid search'},
    {time:'20–35 min',phase:'RUBBLE ZONE', sub:'Macro critters & rare finds'},
    {time:'35–45 min',phase:'RETURN',      sub:'Retrace route slowly'},
    {time:'45–50 min',phase:'ASCENT',      sub:'Slow & controlled'},
    {time:'50–53 min',phase:'SAFETY STOP', sub:'5m · 3 min'},
    {time:'53–55 min',phase:'EXIT',        sub:exit},
  ]
  return [
    {time:'0–5 min',  phase:'DESCEND',     sub:'Entry & descent'},
    {time:'5–15 min', phase:'SHALLOW REEF',sub:`~${Math.round(md*0.25)}m`},
    {time:'15–25 min',phase:'MAIN REEF',   sub:`~${Math.round(md*0.55)}m`},
    {time:'25–35 min',phase:'DEEP POINT',  sub:`Max ${md}m · turn`},
    {time:'35–42 min',phase:'RETURN',      sub:'Ascend reef slope'},
    {time:'42–48 min',phase:'SAFETY STOP', sub:'5m · 3 min'},
    {time:'48–50 min',phase:'EXIT',        sub:exit},
  ]
}

// ── WAYPOINT LABELS ───────────────────────────────────────────────────────
function getWaypoints(site: DiveSite): string[] {
  const { diagramType, type, access } = site
  const e = access==='Boat' ? 'Boat entry & descent' : 'Shore entry & descend'
  if (diagramType==='wreck') return [e,'Wreck bow — explore','Mid-ship · engine room','Stern · max depth','Safety stop · exit']
  if (diagramType==='wall')  return [e,'Upper wall · corals & fans','Mid-wall section',`Max depth · turn`,'Safety stop · exit']
  if (type==='Muck')         return ['Entry — slow descent','Sand zone 1 · grid search','Rubble zone · critters','Return route','Safety stop · exit']
  return [e,'Shallow reef · photos','Main reef · highlights','Deep point · turn','Safety stop · exit']
}

// ── PRO TIPS ──────────────────────────────────────────────────────────────
type Tip = { icon:string; label:string; text:string }
function getTips(site: DiveSite): Tip[] {
  const { diagramType, type, current, marineLife, area } = site
  const ml0 = marineLife[0]?.name ?? 'marine life'
  const strong = current.toLowerCase().includes('strong') || current.toLowerCase().includes('very')
  const tips: Tip[] = []
  if (diagramType==='wreck')
    tips.push({icon:'📷',label:'PHOTOGRAPHY',text:`Wide-angle for the hull, macro lens for critters and nudibranchs on the sandy slope`})
  else if (type==='Muck')
    tips.push({icon:'🔍',label:'CRITTER TIP',text:`Move at a crawl — your divemaster will spot for you. Never touch or disturb the substrate`})
  else if (diagramType==='wall')
    tips.push({icon:'🔭',label:'LOOK CLOSELY',text:`Inspect every sea fan for pygmy seahorses. Check crevices and overhangs on the ascent`})
  else
    tips.push({icon:'🌅',label:'BEST TIMING',text:`Morning dives offer best visibility and the most active ${ml0} encounters of the day`})
  tips.push({icon:'👥',label:'FOLLOW GUIDE',  text:'Stay with your buddy and follow the planned route and guide at all times underwater'})
  tips.push({icon:'🚫',label:"DON'T TOUCH",   text:'Respect all reef, wreck, and marine life. Hands off everything — always'})
  tips.push({icon:'🎯',label:'MONITOR AIR',   text:'Check your pressure regularly. Signal your guide at 100 bar. Never push limits'})
  if (strong)
    tips.push({icon:'⚠️',label:'CURRENT ALERT',text:'Carry SMB at all times. Enter only at planned tide. Stay close to guide and reef'})
  else
    tips.push({icon:'❤️',label:'ENJOY THE DIVE',text:`One of ${area}'s most iconic and memorable dive experiences — savour every moment`})
  return tips
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function DiveBriefingCard({ site }: { site:DiveSite }) {
  const {
    maxDepth:md, minDepth, visibility, temp, difficulty, minCert,
    bestTime, bestSeason, type, access, current, name, area,
    marineLife, safetyNotes, rank, rating, reviews,
  } = site

  const isBoat    = access==='Boat'
  const hasStrong = current.toLowerCase().includes('strong')||current.toLowerCase().includes('very')
  const curStr    = hasStrong ? 'strong' : (current.toLowerCase().includes('mild')||current.toLowerCase().includes('weak')) ? 'weak' : 'moderate'
  const id        = site.slug.replace(/[^a-z0-9]/g,'-')

  // depth markers every 5m
  const dMarks: number[] = []
  for (let d=0; d<=md; d+=5) dMarks.push(d)

  const ml   = marineLife.slice(0,5)
  const mlP  = mlPositions(site)
  const haz  = safetyNotes.slice(0,3)
  const tl   = getTimeline(site)
  const wpts = getWaypoints(site)
  const tips = getTips(site)

  // truncate long site name
  const displayName = name.length > 28 ? name.slice(0,26).toUpperCase()+'…' : name.toUpperCase()

  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
      style={{width:'100%',height:'auto',display:'block',borderRadius:14,
              fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif"}}>

      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.sky0}/>
          <stop offset="100%" stopColor={C.sky1}/>
        </linearGradient>
        <linearGradient id={`sea-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={C.sea0} stopOpacity="0.65"/>
          <stop offset="45%"  stopColor={C.sea1} stopOpacity="0.88"/>
          <stop offset="100%" stopColor={C.sea2} stopOpacity="1"/>
        </linearGradient>
        <linearGradient id={`hdr-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#071828"/>
          <stop offset="100%" stopColor="#030f1c"/>
        </linearGradient>
        <linearGradient id={`dgm-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={C.bgPanel}/>
          <stop offset="100%" stopColor={C.bg}/>
        </linearGradient>
      </defs>

      {/* ── BASE ── */}
      <rect width={W} height={H} fill={C.bg} rx="14"/>

      {/* ━━━ HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <rect x="0" y={HDR_Y} width={W} height={HDR_H} fill={`url(#hdr-${id})`} rx="14"/>
      <rect x="0" y={HDR_H-14} width={W} height="14" fill={`url(#hdr-${id})`}/>
      <line x1="0" y1={HDR_H} x2={W} y2={HDR_H} stroke={C.grey3} strokeWidth="1.5"/>

      {/* DIVE BRIEFING label */}
      <T x="44" y="48" size="17" fill={C.orange} weight="800" spacing="3">DIVE BRIEFING</T>

      {/* site name — large */}
      <T x="44" y="108" size="54" fill={C.white} weight="900" spacing="-1">{displayName}</T>

      {/* breadcrumb */}
      <T x="46" y="140" size="20" fill={C.grey1} spacing="0.3">📍 {area}  ·  Indonesia</T>

      {/* rank badge */}
      <rect x={W-580} y="30" width="196" height="48" rx="24" fill={C.bgCard} stroke={C.grey2} strokeWidth="1.5"/>
      <T x={W-482} y="62" size="19" fill={C.blue} weight="700" anchor="middle">#{rank} in {area}</T>

      {/* verified badge */}
      <rect x={W-374} y="30" width="330" height="48" rx="24" fill={C.greenBg} stroke={C.green} strokeWidth="1.5"/>
      <T x={W-366} y="62" size="19" fill={C.green} weight="700">✓  Verified by local experts</T>

      {/* compass */}
      <IconCompass x={W-62} y={HDR_H/2+6}/>

      {/* ━━━ DIAGRAM ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* sky band */}
      <rect x="0" y={DGM_Y} width={LP} height={SKY_H} fill={`url(#sky-${id})`}/>

      {/* water */}
      <rect x="0" y={SY} width={LP} height={DGM_Y+DGM_H-SY} fill={`url(#sea-${id})`}/>

      {/* BOAT or SHORE */}
      {isBoat ? (
        <g>
          <IconBoat x={340} y={SY-54}/>
          <T x="258" y={SY-122} size="18" fill={C.grey1} weight="700" spacing="1.5">BOAT DROP</T>
          <line x1="340" y1={SY-14} x2="310" y2={SY+2}
            stroke={C.grey1} strokeWidth="2.5" strokeDasharray="5,4" opacity="0.65"/>
          <IconBoat x={1000} y={SY-54}/>
          <T x="916" y={SY-122} size="18" fill={C.grey1} weight="700" spacing="1.5">PICK UP</T>
        </g>
      ) : (
        <g>
          {/* land */}
          <path d={`M0 ${DGM_Y+10} L0 ${SY-30}
                    Q70 ${SY-44} 140 ${SY-24} Q190 ${SY-10} 240 ${SY}
                    L0 ${SY} Z`} fill="#3d6e36"/>
          {/* beach */}
          <path d={`M0 ${SY-8} Q90 ${SY-18} 180 ${SY-6} Q210 ${SY-2} 244 ${SY}`}
            fill="#c8a460"/>
          <T x="100" y={SY-52} size="18" fill={C.grey1} weight="700" anchor="middle" spacing="1.5">SHORE ENTRY</T>
        </g>
      )}

      {/* surface line */}
      <line x1="0" y1={SY} x2={LP} y2={SY}
        stroke="#7dd3fc" strokeWidth="2" strokeDasharray="14,8" opacity="0.55"/>
      <T x="16" y={SY-10} size="16" fill={C.grey1} weight="600" spacing="1">SURFACE  0m</T>

      {/* depth markers */}
      {dMarks.map(d => {
        const y = dY(d,md)
        if (y > BY+8) return null
        const isMax = d===md
        return (
          <g key={d}>
            <line x1="58" y1={y} x2={LP-4} y2={y}
              stroke={isMax?C.red:C.grey3}
              strokeWidth={isMax?2.2:0.8}
              strokeDasharray={isMax?'9,4':'3,12'}
              opacity={isMax?0.98:0.65}/>
            <T x="50" y={y+6} size="16" fill={isMax?C.red:'#4a9cda'} weight={isMax?'800':'400'} anchor="end">{d}m</T>
            {isMax && (
              <g>
                <rect x="62" y={y-28} width="218" height="32" rx="6" fill={C.redBg} opacity="0.9"/>
                <T x="74" y={y-7} size="16" fill={C.red} weight="800">MAX DEPTH  {d}m</T>
              </g>
            )}
          </g>
        )
      })}

      {/* terrain */}
      <Terrain site={site}/>

      {/* route */}
      <Route site={site}/>

      {/* current */}
      <CurrentArrows x={isBoat?560:400} y={SY+52} strength={curStr as 'weak'|'moderate'|'strong'}/>

      {/* marine life labels */}
      {ml.map((m,i) => {
        const [mx,my] = mlP[i] ?? mlP[mlP.length-1]
        const d1 = Math.round(md*(0.14+i*0.16))
        const d2 = Math.round(md*(0.28+i*0.16))
        return <MLTag key={i} x={mx} y={my} name={m.name} depth={`${d1}–${d2}m`}/>
      })}

      {/* hazard badges */}
      {haz.map((h,i) => {
        const hx = [220, 640, 980][i] ?? 220
        const hy = BY - 30 - i*54
        return <HazardTag key={i} x={hx} y={hy} text={h}/>
      })}

      {/* diagram divider */}
      <line x1="0" y1={DGM_Y+DGM_H} x2={LP} y2={DGM_Y+DGM_H} stroke={C.grey3} strokeWidth="1.5"/>

      {/* ── RIGHT LEGEND PANEL ─────────────────────────────────────────── */}
      <rect x={LP} y={DGM_Y} width={LW} height={DGM_H} fill={C.bgPanel}/>
      <line x1={LP} y1={DGM_Y} x2={LP} y2={DGM_Y+DGM_H} stroke={C.grey3} strokeWidth="1.5"/>

      {/* LEGEND card */}
      <rect x={LP+22} y={DGM_Y+22} width={LW-44} height="296" rx="10"
        fill={C.bgCard} stroke={C.grey3} strokeWidth="1"/>
      <T x={LP+40} y={DGM_Y+52} size="14" fill={C.grey1} weight="800" spacing="2.5">LEGEND</T>
      {([
        ['━ ━',C.white,  'Entry / Descent'],
        ['╌ ╌',C.white,  'Route'],
        ['●',  C.green,  'Safety Stop'],
        ['▲',  C.blue,   'Pick Up / Exit'],
        ['▶',  C.teal,   'Current Direction'],
        ['█',  C.yellow, 'Marine Life'],
        ['▲',  C.red,    'Hazard'],
        ['📷', C.orange, 'Photo Opportunity'],
      ] as [string,string,string][]).map(([sym,col,lbl],i) => (
        <g key={i} transform={`translate(${LP+40},${DGM_Y+70+i*28})`}>
          <text x="0" y="0" fontSize="19" fill={col} fontWeight="700"
            fontFamily="'Inter',Arial,sans-serif">{sym}</text>
          <text x="46" y="1" fontSize="15" fill={C.offWhite}
            fontFamily="'Inter',Arial,sans-serif">{lbl}</text>
        </g>
      ))}

      {/* SITE HAZARDS card */}
      <rect x={LP+22} y={DGM_Y+338} width={LW-44} height={haz.length*54+52} rx="10"
        fill={C.redBg} stroke={C.red} strokeWidth="1.5" opacity="0.9"/>
      <T x={LP+40} y={DGM_Y+368} size="14" fill={C.red} weight="800" spacing="2.5">SITE HAZARDS</T>
      {haz.map((h,i) => (
        <g key={i} transform={`translate(${LP+40},${DGM_Y+392+i*54})`}>
          <polygon points="14,0 22,-24 30,0" fill="none" stroke={C.red} strokeWidth="2" strokeLinejoin="round"/>
          <text x="22" y="-7" fontSize="13" fill={C.red} textAnchor="middle" fontWeight="800"
            fontFamily="'Inter',Arial,sans-serif">!</text>
          <text x="44" y="-4" fontSize="14" fill="#f87171"
            fontFamily="'Inter',Arial,sans-serif">
            {h.length>32?h.slice(0,31)+'…':h}
          </text>
        </g>
      ))}

      {/* WAYPOINTS card */}
      {(()=>{
        const wy = DGM_Y+338+haz.length*54+62
        return (
          <g>
            <rect x={LP+22} y={wy} width={LW-44} height={wpts.length*48+52} rx="10"
              fill={C.bgCard} stroke={C.grey3} strokeWidth="1"/>
            <T x={LP+40} y={wy+30} size="14" fill={C.grey1} weight="800" spacing="2.5">ROUTE WAYPOINTS</T>
            {wpts.map((lbl,i) => (
              <g key={i} transform={`translate(${LP+40},${wy+54+i*48})`}>
                <circle cx="16" cy="-10" r="16"
                  fill={i===wpts.length-1?C.green:C.bg} stroke={C.white} strokeWidth="2.5"/>
                <text x="16" y="-4" fontSize="14" fill={C.white} textAnchor="middle" fontWeight="800"
                  fontFamily="'Inter',Arial,sans-serif">{i+1}</text>
                <text x="44" y="-4" fontSize="14" fill={C.offWhite}
                  fontFamily="'Inter',Arial,sans-serif">{lbl}</text>
              </g>
            ))}
          </g>
        )
      })()}

      {/* SITE RATING card */}
      {(()=>{
        const ry = DGM_Y+DGM_H-192
        return (
          <g>
            <rect x={LP+22} y={ry} width={LW-44} height="170" rx="10"
              fill={C.bgCard} stroke={C.grey3} strokeWidth="1"/>
            <T x={LP+40} y={ry+32} size="14" fill={C.grey1} weight="800" spacing="2.5">SITE RATING</T>
            <T x={LP+40} y={ry+100} size="58" fill={C.yellow} weight="900">★ {rating}</T>
            <T x={LP+40} y={ry+132} size="15" fill={C.grey1}>{reviews} verified diver reviews</T>
            <T x={LP+40} y={ry+156} size="13" fill={C.grey2}>🔒 Admin verified · Dive Spots</T>
          </g>
        )
      })()}

      {/* ━━━ INFO CARDS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <rect x="0" y={INF_Y} width={W} height={INF_H} fill={C.bgDark}/>
      <line x1="0" y1={INF_Y} x2={W} y2={INF_Y} stroke={C.grey3} strokeWidth="1.5"/>
      {([
        ['DIVE TYPE',     type,       ''],
        ['DIFFICULTY',    difficulty, ''],
        ['CERTIFICATION', minCert,    ''],
        ['ACCESS',        access,     ''],
        ['DEPTH RANGE',   `${minDepth}–${md}m`, ''],
        ['VISIBILITY',    visibility, ''],
        ['WATER TEMP',    temp,       ''],
        ['BEST TIME',     bestTime,   bestSeason],
      ] as [string,string,string][]).map(([k,v,sub],i) => {
        const cw = W/8, cx = i*cw
        return (
          <g key={k}>
            {i>0 && <line x1={cx} y1={INF_Y+16} x2={cx} y2={INF_Y+INF_H-16} stroke={C.grey3} strokeWidth="1" opacity="0.6"/>}
            <T x={cx+cw/2} y={INF_Y+34} size="13" fill={C.grey1} weight="700" anchor="middle" spacing="0.8">{k}</T>
            <T x={cx+cw/2} y={INF_Y+92} size="22" fill={C.white} weight="800" anchor="middle">{v}</T>
            {sub && <T x={cx+cw/2} y={INF_Y+118} size="12" fill={C.grey2} anchor="middle">{sub}</T>}
          </g>
        )
      })}

      {/* ━━━ TIMELINE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <rect x="0" y={TML_Y} width={W} height={TML_H} fill={C.bgPanel}/>
      <line x1="0" y1={TML_Y} x2={W} y2={TML_Y} stroke={C.grey3} strokeWidth="1.5"/>
      <T x="44" y={TML_Y+42} size="16" fill={C.blue} weight="800" spacing="2">
        DIVE TIMELINE  ·  APPROX. 45–55 MINUTES
      </T>

      {tl.map((s,i) => {
        const cw = (W-88)/tl.length, cx = 44+i*cw
        const isLast = i===tl.length-1
        return (
          <g key={i}>
            <rect x={cx} y={TML_Y+56} width={cw-12} height={TML_H-70} rx="8"
              fill={isLast?C.greenBg:C.bgCard}
              stroke={isLast?C.green:C.grey3} strokeWidth="1"/>
            <T x={cx+(cw-12)/2} y={TML_Y+84} size="13" fill={isLast?C.green:C.blue}
              weight="700" anchor="middle" spacing="0.5">{s.time}</T>
            <T x={cx+(cw-12)/2} y={TML_Y+120} size="17" fill={C.white}
              weight="900" anchor="middle">{s.phase}</T>
            <T x={cx+(cw-12)/2} y={TML_Y+148} size="12" fill={C.grey1}
              anchor="middle">{s.sub}</T>
            {i<tl.length-1 && (
              <text x={cx+cw-2} y={TML_Y+126} fontSize="26" fill={C.grey2}
                textAnchor="middle" fontFamily="'Inter',Arial,sans-serif">›</text>
            )}
          </g>
        )
      })}

      {/* ━━━ SAFETY TIPS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <rect x="0" y={TIP_Y} width={W} height={TIP_H} fill={C.bg}/>
      <line x1="0" y1={TIP_Y} x2={W} y2={TIP_Y} stroke={C.grey3} strokeWidth="1.5"/>
      <T x="44" y={TIP_Y+42} size="16" fill={C.grey1} weight="800" spacing="2">
        DIVE TIPS  ·  SAFETY REMINDERS
      </T>

      {tips.map((tip,i) => {
        const cw = W/tips.length, cx = i*cw
        const maxTextW = cw - 56
        return (
          <g key={i}>
            {i>0 && <line x1={cx} y1={TIP_Y+20} x2={cx} y2={TIP_Y+TIP_H-20}
              stroke={C.grey3} strokeWidth="1" opacity="0.45"/>}
            {/* icon circle */}
            <circle cx={cx+40} cy={TIP_Y+96} r="30" fill={C.bgCard} stroke={C.grey3} strokeWidth="1.5"/>
            <text x={cx+40} y={TIP_Y+106} fontSize="26" textAnchor="middle"
              fontFamily="'Inter',Arial,sans-serif">{tip.icon}</text>
            {/* label */}
            <T x={cx+82} y={TIP_Y+86} size="14" fill={C.blue} weight="800" spacing="0.5">{tip.label}</T>
            {/* text — SVG tspan wrap */}
            <TWrap x={cx+18} y={TIP_Y+120} size="14" fill={C.grey1}
              maxW={maxTextW} lineH={20}>{tip.text}</TWrap>
          </g>
        )
      })}

      {/* ━━━ FOOTER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <rect x="0" y={FTR_Y} width={W} height={FTR_H} fill={C.bgDark} rx="0"/>
      <line x1="0" y1={FTR_Y} x2={W} y2={FTR_Y} stroke={C.grey3} strokeWidth="1.5"/>
      <T x="44" y={FTR_Y+38} size="16" fill={C.grey2}>dive-spots.com</T>
      <T x={W/2} y={FTR_Y+38} size="15" fill={C.grey2} anchor="middle">
        Always follow your dive guide&apos;s briefing. Never dive beyond your certification level.
      </T>
      <T x={W-44} y={FTR_Y+38} size="15" fill={C.grey2} anchor="end">© 2026 Dive Spots</T>

    </svg>
  )
}
