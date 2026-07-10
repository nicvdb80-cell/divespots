import React from 'react'
import { DiveSite } from '@/lib/data'

// ═══════════════════════════════════════════════════════════════════════════
// DIVE SPOTS  —  OFFICIAL DIVE BRIEFING SYSTEM  v2.0
// Design Language: Premium · Editorial · Trustworthy · Consistent
// Canvas: 2048 × 2048  (1:1 square)
// ═══════════════════════════════════════════════════════════════════════════

const W = 2048
const H = 2048

// ── Layout zones ─────────────────────────────────────────────────────────
const HEADER_H   = 160   // y: 0–160
const DIAGRAM_H  = 980   // y: 160–1140   (~48% of height)
const CARDS_H    = 140   // y: 1140–1280
const TIMELINE_H = 200   // y: 1280–1480
const TIPS_H     = 200   // y: 1480–1680
const FOOTER_H   = 68    // y: 1680–1748  (bottom border)

const DY = HEADER_H                        // diagram top y
const DH = DIAGRAM_H                       // diagram height
const SY = DY + 130                        // surface y within diagram
const BY = DY + DH - 60                    // seabed y

// right legend panel
const LP = 1520   // left edge of legend panel
const LW = W - LP // legend panel width = 528

// depth scale
function dY(depth: number, maxDepth: number): number {
  return SY + ((depth / maxDepth) * (BY - SY))
}

// ── COLOUR TOKENS ────────────────────────────────────────────────────────
const C = {
  // backgrounds
  navy:      '#04111e',
  navyMid:   '#071828',
  navyPanel: '#0a1e30',
  navyCard:  '#0d2438',
  navyDeep:  '#020c15',

  // ocean gradient stops
  seaSurface:'#1a6fa0',
  seaMid:    '#0e4468',
  seaDeep:   '#051525',

  // sky
  skyTop:    '#87ceeb',
  skyBot:    '#b0d8f0',

  // type
  white:     '#ffffff',
  grey1:     '#e8edf2',
  grey2:     '#8fa3b0',
  grey3:     '#3d5a6e',
  grey4:     '#1e3447',

  // semantic
  green:     '#1db87a',
  greenDim:  '#0d6644',
  red:       '#e8334a',
  redDim:    '#7f1d2a',
  orange:    '#f07020',
  yellow:    '#f5c518',
  blue:      '#2d9cdb',
  blueDim:   '#1a5c82',
  teal:      '#00b4cc',

  // route
  routeLine: '#ffffff',
  safePt:    '#1db87a',
}

// ── TYPOGRAPHY HELPERS ───────────────────────────────────────────────────
function T({
  x, y, size, fill = C.white, weight = '400', anchor = 'start',
  letter = '0', children
}: {
  x: number; y: number; size: number; fill?: string; weight?: string
  anchor?: string; letter?: string; children: React.ReactNode
}) {
  return (
    <text
      x={x} y={y}
      fontSize={size}
      fill={fill}
      fontWeight={weight}
      textAnchor={anchor}
      fontFamily="'Inter','Helvetica Neue',Arial,sans-serif"
      letterSpacing={letter}
    >
      {children}
    </text>
  )
}

// ── ICON PRIMITIVES ──────────────────────────────────────────────────────
function IconBoat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-52 4 Q-40 -6 0 -8 Q40 -6 52 4 Q34 14 -34 14 Z" fill={C.grey1} stroke={C.grey2} strokeWidth="2"/>
      <rect x="-16" y="-30" width="32" height="22" rx="3" fill={C.grey2} stroke={C.grey3} strokeWidth="1.5"/>
      <line x1="0" y1="-30" x2="0" y2="-54" stroke={C.grey2} strokeWidth="2.5"/>
      <line x1="-22" y1="-44" x2="22" y2="-44" stroke={C.grey2} strokeWidth="1.5"/>
      <rect x="-28" y="-56" width="56" height="10" rx="3" fill={C.orange} opacity="0.95"/>
    </g>
  )
}

function IconCompass({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx="0" cy="0" r="36" fill={C.navyCard} stroke={C.grey3} strokeWidth="2"/>
      <circle cx="0" cy="0" r="28" fill="none" stroke={C.grey4} strokeWidth="1"/>
      {['N','E','S','W'].map((d,i) => (
        <text key={d}
          x={[0,22,0,-22][i]} y={[-22,6,28,6][i]}
          fontSize="11" fill={d==='N'?C.orange:C.grey2}
          textAnchor="middle" fontWeight={d==='N'?'800':'500'}
          fontFamily="'Inter',Arial,sans-serif">
          {d}
        </text>
      ))}
      <polygon points="0,-20 5,4 0,0 -5,4" fill={C.white}/>
      <polygon points="0,20 5,-4 0,0 -5,-4" fill={C.grey3}/>
    </g>
  )
}

function CurrentArrow({ x, y, strength = 'moderate' }: { x: number; y: number; strength?: string }) {
  const col = strength === 'strong' ? C.blue : strength === 'weak' ? '#5ba8c8' : C.teal
  const count = strength === 'strong' ? 5 : strength === 'weak' ? 2 : 3
  return (
    <g>
      {Array.from({length: count}).map((_,i) => (
        <g key={i} transform={`translate(${x + i * 38}, ${y})`}>
          <path d="M0 -8 L20 0 L0 8 L6 0 Z" fill={col} opacity={0.7 + i*0.06}/>
        </g>
      ))}
      <text x={x + count * 38 + 14} y={y + 5}
        fontSize="20" fill={col} fontWeight="600"
        fontFamily="'Inter',Arial,sans-serif" letterSpacing="1">
        {strength === 'strong' ? 'STRONG CURRENT' : strength === 'weak' ? 'MILD CURRENT' : 'CURRENT'}
      </text>
    </g>
  )
}

function WaypointCircle({ x, y, n, size = 22 }: { x: number; y: number; n: number; size?: number }) {
  const isLast = n === 5
  return (
    <g>
      <circle cx={x} cy={y} r={size} fill={isLast ? C.green : C.navy} stroke={isLast ? C.green : C.white} strokeWidth="3"/>
      <text x={x} y={y + 7} fontSize={size * 0.9} fill={C.white}
        textAnchor="middle" fontWeight="800" fontFamily="'Inter',Arial,sans-serif">{n}</text>
    </g>
  )
}

function SafetyStopBadge({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 80} y={y - 22} width="160" height="38" rx="8" fill={C.green} opacity="0.95"/>
      <text x={x} y={y - 4} fontSize="13" fill={C.white} textAnchor="middle" fontWeight="800"
        fontFamily="'Inter',Arial,sans-serif" letterSpacing="0.5">SAFETY STOP</text>
      <text x={x} y={y + 12} fontSize="11" fill="rgba(255,255,255,0.8)" textAnchor="middle"
        fontFamily="'Inter',Arial,sans-serif">5m · 3 minutes</text>
    </g>
  )
}

function HazardBadge({ x, y, label }: { x: number; y: number; label: string }) {
  const short = label.length > 22 ? label.slice(0,21)+'…' : label
  return (
    <g>
      <rect x={x - 6} y={y - 20} width={short.length * 9.5 + 40} height="34" rx="6"
        fill={C.redDim} stroke={C.red} strokeWidth="1.5" opacity="0.92"/>
      <text x={x + 8} y={y - 1} fontSize="12" fill={C.red} fontWeight="700"
        fontFamily="'Inter',Arial,sans-serif">⚠</text>
      <text x={x + 28} y={y - 1} fontSize="11" fill="#fca5a5" fontFamily="'Inter',Arial,sans-serif">{short}</text>
    </g>
  )
}

function MLLabel({ x, y, name, depth, emoji }: { x: number; y: number; name: string; depth: string; emoji: string }) {
  const label = name.length > 20 ? name.slice(0,19)+'…' : name
  const w = label.length * 9.8 + 72
  return (
    <g>
      <rect x={x} y={y - 20} width={w} height="36" rx="7"
        fill="rgba(4,17,30,0.85)" stroke={C.yellow} strokeWidth="1.5"/>
      <text x={x + 12} y={y + 3} fontSize="18">{emoji}</text>
      <text x={x + 38} y={y - 4} fontSize="11" fill={C.yellow} fontWeight="700"
        fontFamily="'Inter',Arial,sans-serif" letterSpacing="0.3">{label}</text>
      <text x={x + 38} y={y + 11} fontSize="10" fill={C.grey2}
        fontFamily="'Inter',Arial,sans-serif">{depth}</text>
    </g>
  )
}

// ── TERRAIN TEMPLATES ─────────────────────────────────────────────────────

function TerrainWreck({ md }: { md: number }) {
  const keel  = dY(md * 0.78, md)
  const deck  = dY(md * 0.48, md)
  const bow   = 200
  const stern = 700
  const mid   = (bow + stern) / 2
  return (
    <g>
      {/* sandy seabed */}
      <path d={`M0 ${BY} Q${LP/2} ${BY - 30} ${LP} ${BY} L${LP} ${BY + 40} L0 ${BY + 40} Z`}
        fill="#c8a870" opacity="0.28"/>
      {/* hull silhouette */}
      <path d={`M${bow} ${keel} Q${mid} ${keel + 22} ${stern} ${keel - 8}
                L${stern} ${deck + 14} Q${mid} ${deck - 8} ${bow} ${deck + 12} Z`}
        fill="#1e2c1a" stroke="#2d4228" strokeWidth="2"/>
      {/* upper deck structures */}
      <rect x={bow + 80} y={deck - 44} width="140" height="48" rx="5" fill="#182416" stroke="#2a3c22" strokeWidth="1.5"/>
      <rect x={bow + 110} y={deck - 78} width="70" height="38" rx="4" fill="#101c0e" stroke="#2a3c22" strokeWidth="1.2"/>
      {/* mast */}
      <line x1={bow + 144} y1={deck - 78} x2={bow + 148} y2={deck - 130} stroke="#243020" strokeWidth="4"/>
      <line x1={bow + 90} y1={deck - 108} x2={bow + 210} y2={deck - 108} stroke="#243020" strokeWidth="2"/>
      {/* portholes */}
      {[bow+38, bow+200, bow+290, bow+390, bow+490].map((px, i) => (
        <circle key={i} cx={px} cy={(deck + keel) / 2} r="8" fill="none" stroke="#2d4228" strokeWidth="2"/>
      ))}
      {/* coral encrustation */}
      {[bow + 20, bow + 120, bow + 240, bow + 380, bow + 510, stern - 80].map((cx, i) => (
        <ellipse key={i} cx={cx} cy={keel} rx={12 + (i % 3) * 5} ry={10}
          fill={['#1a4a1a','#2d6b1f','#1e5c2d','#2a5a18','#183c28','#1a4a1a'][i]} opacity="0.9"/>
      ))}
      {/* anchor chain */}
      <path d={`M${bow + 20} ${deck + 10} Q${bow - 30} ${dY(md*0.6,md)} ${bow - 60} ${keel + 10}`}
        fill="none" stroke="#2a3a28" strokeWidth="3" strokeDasharray="6,4"/>
    </g>
  )
}

function TerrainWall({ md }: { md: number }) {
  return (
    <g>
      {/* main wall face */}
      <path d={`M200 ${SY} L195 ${BY + 40} L260 ${BY + 40} L270 ${SY}`}
        fill="#152b1a" stroke="#1e4028" strokeWidth="2"/>
      {/* wall texture — rock layers */}
      {[0.15, 0.3, 0.48, 0.63, 0.78, 0.91].map((f, i) => (
        <path key={i}
          d={`M195 ${dY(md*f,md)} Q220 ${dY(md*f,md) + 6} 255 ${dY(md*f,md) - 4}`}
          fill="none" stroke="#1e4028" strokeWidth="1" opacity="0.7"/>
      ))}
      {/* sea fans on wall */}
      {[0.18, 0.35, 0.55, 0.72, 0.86].map((f, i) => {
        const fy = dY(md * f, md)
        const colours = [C.orange, '#8b45c8', C.red, '#f0a020', '#45a8c8']
        const col = colours[i % colours.length]
        const w = 50 + i * 18
        return (
          <g key={i} transform={`translate(200, ${fy})`}>
            <line x1="0" y1="0" x2={-w} y2={-w * 0.7}
              stroke={col} strokeWidth="2.5" opacity="0.8"/>
            <ellipse cx={-w} cy={-w * 0.7} rx={w * 0.45} ry={w * 0.28}
              fill="none" stroke={col} strokeWidth="1.8" opacity="0.6"/>
            {/* branch sub-fans */}
            <line x1={-w * 0.45} y1={-w * 0.32} x2={-w * 0.7} y2={-w * 0.55}
              stroke={col} strokeWidth="1.5" opacity="0.5"/>
          </g>
        )
      })}
      {/* black coral */}
      {[0.42, 0.67, 0.84].map((f, i) => {
        const fy = dY(md * f, md)
        return (
          <g key={i} transform={`translate(220, ${fy})`}>
            <line x1="0" y1="0" x2={-35} y2={-55} stroke="#1a1a1a" strokeWidth="3"/>
            {[-35,-20,-10].map((bx, bi) => (
              <line key={bi} x1={bx} y1={-bx*1.5 - 10}
                x2={bx - 15} y2={-bx*1.5 - 30}
                stroke="#1a1a1a" strokeWidth="1.5"/>
            ))}
          </g>
        )
      })}
      {/* sandy bottom on right */}
      <path d={`M260 ${BY} Q${LP * 0.5} ${BY - 20} ${LP} ${BY} L${LP} ${BY + 40} L260 ${BY + 40} Z`}
        fill="#c8a870" opacity="0.25"/>
    </g>
  )
}

function TerrainReef({ md }: { md: number }) {
  return (
    <g>
      {/* reef slope */}
      <path d={`M130 ${SY + 20} Q300 ${SY + 90} 520 ${dY(md*0.55,md)}
                Q640 ${dY(md*0.72,md)} ${LP} ${BY}`}
        fill="#152b18" stroke="#1e4028" strokeWidth="2" opacity="0.9"/>
      {/* coral heads */}
      {[
        {x:180, f:0.12, r:28, col:'#2d6b1f'},
        {x:280, f:0.22, r:24, col:'#6b2d1a'},
        {x:380, f:0.33, r:32, col:'#1a5c3a'},
        {x:490, f:0.44, r:20, col:'#5c2d8a'},
        {x:590, f:0.55, r:26, col:'#1a4a5c'},
        {x:700, f:0.66, r:22, col:'#5c3a1a'},
        {x:820, f:0.72, r:18, col:'#2d6b1f'},
        {x:920, f:0.76, r:24, col:'#3a1a5c'},
      ].map((c, i) => (
        <ellipse key={i} cx={c.x} cy={dY(md * c.f, md)} rx={c.r} ry={c.r * 0.6} fill={c.col} opacity="0.88"/>
      ))}
      {/* soft coral clusters */}
      {[220, 440, 660, 880].map((cx, i) => {
        const cy = dY(md * (0.18 + i * 0.14), md)
        return (
          <g key={i}>
            {[-12,-4,4,12].map(ox => (
              <line key={ox} x1={cx + ox} y1={cy} x2={cx + ox + 3} y2={cy - 22}
                stroke={['#d4a0e0','#e0d4a0','#a0d4e0','#e0a0a0'][i]} strokeWidth="2.5" opacity="0.7"/>
            ))}
          </g>
        )
      })}
      {/* sandy patches */}
      <ellipse cx="720" cy={BY - 14} rx="160" ry="20" fill="#c8a870" opacity="0.3"/>
      <ellipse cx="1100" cy={BY - 8} rx="120" ry="14" fill="#c8a870" opacity="0.25"/>
    </g>
  )
}

function TerrainMuck({ md }: { md: number }) {
  return (
    <g>
      {/* black sand slope */}
      <path d={`M0 ${SY + 60} Q400 ${BY - 80} ${LP} ${BY - 20} L${LP} ${BY + 40} L0 ${BY + 40} Z`}
        fill="#141420" stroke="#1e1e2c" strokeWidth="1.5"/>
      {/* rubble patches */}
      {[180, 320, 480, 620, 780, 960, 1120].map((rx, i) => (
        <ellipse key={i} cx={rx} cy={dY(md * (0.28 + i * 0.08), md)}
          rx={24 + (i % 4) * 8} ry="9" fill="#22222e" opacity="0.8"/>
      ))}
      {/* sea grass tufts */}
      {[240, 440, 640, 860, 1080].map((gx, i) => {
        const gy = dY(md * (0.38 + i * 0.07), md)
        return (
          <g key={i}>
            {[-10,-4,2,8,14].map(ox => (
              <line key={ox} x1={gx + ox} y1={gy} x2={gx + ox + 3} y2={gy - 18}
                stroke="#2d5a1f" strokeWidth="2" opacity="0.7"/>
            ))}
          </g>
        )
      })}
    </g>
  )
}

function TerrainPinnacle({ md }: { md: number }) {
  const peakX = LP * 0.45
  const peakY = dY(md * 0.08, md)
  return (
    <g>
      {/* main pinnacle */}
      <path d={`M${peakX - 180} ${BY} Q${peakX - 90} ${peakY + 80} ${peakX} ${peakY}
                Q${peakX + 90} ${peakY + 80} ${peakX + 180} ${BY} Z`}
        fill="#152b18" stroke="#1e4028" strokeWidth="2"/>
      {/* secondary pinnacle */}
      <path d={`M${peakX + 220} ${BY} Q${peakX + 300} ${peakY + 200} ${peakX + 360} ${peakY + 120}
                Q${peakX + 420} ${peakY + 200} ${peakX + 480} ${BY} Z`}
        fill="#101e12" stroke="#1a3020" strokeWidth="1.5" opacity="0.8"/>
      {/* coral on pinnacle sides */}
      {[-100,-40,40,100].map((ox, i) => {
        const py = dY(md * (0.2 + i * 0.12), md)
        return (
          <ellipse key={i} cx={peakX + ox} cy={py}
            rx="18" ry="10" fill={['#2d6b1f','#6b2d1a','#1a5c3a','#5c2d8a'][i]} opacity="0.85"/>
        )
      })}
      {/* sandy bottom */}
      <path d={`M0 ${BY} L${LP} ${BY} L${LP} ${BY + 40} L0 ${BY + 40} Z`}
        fill="#c8a870" opacity="0.28"/>
    </g>
  )
}

function TerrainDrift({ md }: { md: number }) {
  return (
    <g>
      {/* channel walls */}
      <path d={`M0 ${SY + 40} Q200 ${dY(md*0.3,md)} 400 ${dY(md*0.55,md)}
                Q500 ${BY - 40} ${LP} ${BY}`}
        fill="#152b18" stroke="#1e4028" strokeWidth="2"/>
      {/* right channel wall */}
      <path d={`M0 ${dY(md*0.15,md)} Q200 ${dY(md*0.4,md)} 400 ${dY(md*0.6,md)}
                Q600 ${BY - 20} 800 ${BY}`}
        fill="#101e12" stroke="#1a3020" strokeWidth="1.5" opacity="0.7"/>
      {/* strong current arrows — 3 rows */}
      {[SY+100, SY+180, SY+260].map((cy, ri) => (
        <g key={ri}>
          {Array.from({length:6}).map((_,i) => (
            <path key={i}
              d={`M${100 + i*190} ${cy} L${130 + i*190} ${cy - 10} L${130 + i*190} ${cy + 10} Z`}
              fill={C.teal} opacity="0.55"/>
          ))}
        </g>
      ))}
      {/* sand channel bottom */}
      <ellipse cx={LP * 0.5} cy={BY - 10} rx="320" ry="18" fill="#c8a870" opacity="0.3"/>
    </g>
  )
}

// ── TERRAIN SELECTOR ─────────────────────────────────────────────────────
function Terrain({ site }: { site: DiveSite }) {
  const { diagramType, type } = site
  const md = site.maxDepth
  if (diagramType === 'wreck') return <TerrainWreck md={md}/>
  if (diagramType === 'wall')  return <TerrainWall  md={md}/>
  if (type === 'Muck')         return <TerrainMuck  md={md}/>
  if (type === 'Drift')        return <TerrainDrift md={md}/>
  const isPinnacle = site.name.toLowerCase().includes('magic') ||
                     site.name.toLowerCase().includes('pinnacle') ||
                     site.name.toLowerCase().includes('mount') ||
                     site.name.toLowerCase().includes('seamount')
  if (isPinnacle)              return <TerrainPinnacle md={md}/>
  return <TerrainReef md={md}/>
}

// ── DIVE ROUTES ──────────────────────────────────────────────────────────
function RouteWreck({ md, isBoat }: { md: number; isBoat: boolean }) {
  const keel = dY(md * 0.78, md)
  const deck = dY(md * 0.48, md)
  const pts: [number,number][] = isBoat
    ? [[310, SY+20],[220, deck+14],[390, (deck+keel)/2],[590, keel-8],[720, dY(md*0.22,md)]]
    : [[160, SY+10],[220, deck+14],[390, (deck+keel)/2],[590, keel-8],[680, dY(md*0.22,md)]]
  return <DiveRoute pts={pts} md={md}/>
}

function RouteWall({ md, isBoat }: { md: number; isBoat: boolean }) {
  const pts: [number,number][] = [
    [isBoat?380:230, SY+20],
    [260, dY(md*0.28, md)],
    [280, dY(md*0.58, md)],
    [300, dY(md*0.85, md)],
    [520, dY(md*0.18, md)],
  ]
  return <DiveRoute pts={pts} md={md}/>
}

function RouteReef({ md, isBoat }: { md: number; isBoat: boolean }) {
  const pts: [number,number][] = [
    [isBoat?380:180, SY+20],
    [290, dY(md*0.26, md)],
    [460, dY(md*0.54, md)],
    [680, dY(md*0.82, md)],
    [860, dY(md*0.18, md)],
  ]
  return <DiveRoute pts={pts} md={md}/>
}

function RouteMuck({ md }: { md: number }) {
  const pts: [number,number][] = [
    [260, SY+20],
    [340, dY(md*0.32, md)],
    [500, dY(md*0.52, md)],
    [700, dY(md*0.72, md)],
    [860, dY(md*0.22, md)],
  ]
  return <DiveRoute pts={pts} md={md}/>
}

function DiveRoute({ pts, md }: { pts: [number,number][]; md: number }) {
  const ssIdx = pts.length - 1
  const path = pts.map((p, i) => `${i===0?'M':'L'}${p[0]} ${p[1]}`).join(' ')
  return (
    <g>
      {/* dashed route */}
      <path d={path} fill="none" stroke={C.white} strokeWidth="3.5" strokeDasharray="14,8" opacity="0.9"
        strokeLinecap="round" strokeLinejoin="round"/>
      {/* waypoint circles */}
      {pts.map(([x,y],i) => (
        <WaypointCircle key={i} x={x} y={y} n={i+1}/>
      ))}
      {/* safety stop badge at last waypoint */}
      <SafetyStopBadge x={pts[ssIdx][0]} y={pts[ssIdx][1] - 52}/>
    </g>
  )
}

function Route({ site }: { site: DiveSite }) {
  const { diagramType, type, access } = site
  const isBoat = access === 'Boat'
  const md = site.maxDepth
  if (diagramType === 'wreck') return <RouteWreck md={md} isBoat={isBoat}/>
  if (diagramType === 'wall')  return <RouteWall  md={md} isBoat={isBoat}/>
  if (type === 'Muck')         return <RouteMuck  md={md}/>
  return <RouteReef md={md} isBoat={isBoat}/>
}

// ── MARINE LIFE EMOJI MAP ────────────────────────────────────────────────
function mlEmoji(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('turtle'))              return '🐢'
  if (n.includes('manta'))               return '🦈'
  if (n.includes('shark'))               return '🦈'
  if (n.includes('ray'))                 return '🐟'
  if (n.includes('nudi'))                return '🐌'
  if (n.includes('frogfish'))            return '🐸'
  if (n.includes('octopus'))             return '🐙'
  if (n.includes('seahorse'))            return '🐴'
  if (n.includes('barracuda'))           return '🐡'
  if (n.includes('jack') || n.includes('trevally') || n.includes('school') || n.includes('fusilier')) return '🐠'
  if (n.includes('eel'))                 return '🐍'
  if (n.includes('cuttlefish'))          return '🦑'
  if (n.includes('dolphin'))             return '🐬'
  if (n.includes('whale'))               return '🐳'
  if (n.includes('clam'))                return '🐚'
  if (n.includes('coral') || n.includes('fan') || n.includes('sponge')) return '🪸'
  if (n.includes('pipefish') || n.includes('ghost')) return '🐠'
  if (n.includes('crab') || n.includes('shrimp'))    return '🦐'
  return '🐠'
}

// ml tag positions per template
function mlPositions(site: DiveSite): Array<[number,number]> {
  const { diagramType, type } = site
  const md = site.maxDepth
  if (diagramType === 'wreck') return [
    [800, dY(md*0.18, md)],
    [700, dY(md*0.35, md)],
    [860, dY(md*0.55, md)],
    [720, dY(md*0.70, md)],
    [860, dY(md*0.28, md)],
  ]
  if (diagramType === 'wall') return [
    [340, dY(md*0.22, md)],
    [380, dY(md*0.42, md)],
    [420, dY(md*0.62, md)],
    [360, dY(md*0.78, md)],
    [600, dY(md*0.32, md)],
  ]
  if (type === 'Muck') return [
    [500, dY(md*0.28, md) - 50],
    [700, dY(md*0.45, md) - 50],
    [850, dY(md*0.62, md) - 50],
    [600, dY(md*0.76, md) - 50],
    [400, dY(md*0.52, md) - 50],
  ]
  return [
    [900, dY(md*0.20, md)],
    [780, dY(md*0.40, md)],
    [920, dY(md*0.58, md)],
    [750, dY(md*0.72, md)],
    [820, dY(md*0.32, md)],
  ]
}

// ── TIMELINE DATA ────────────────────────────────────────────────────────
function getTimeline(site: DiveSite): Array<{time:string; phase:string; sub:string}> {
  const { diagramType, type, access, maxDepth: md } = site
  const exit = access === 'Boat' ? 'By boat' : 'Shore exit'
  if (diagramType === 'wreck') return [
    {time:'0–5 min',   phase:'DESCEND',       sub:'Mooring line to wreck'},
    {time:'5–15 min',  phase:'BOW SECTION',   sub:'Explore bow · photos'},
    {time:'15–25 min', phase:'MID SHIP',       sub:'Engine room · cargo holds'},
    {time:'25–35 min', phase:'STERN',          sub:`Propeller · ${md}m max`},
    {time:'35–40 min', phase:'RETURN',         sub:'Sandy slope return'},
    {time:'40–47 min', phase:'SAFETY STOP',    sub:'5 metres · 3 minutes'},
    {time:'47–50 min', phase:'EXIT',           sub:exit},
  ]
  if (diagramType === 'wall') return [
    {time:'0–5 min',   phase:'DESCEND',        sub:'Entry & descent'},
    {time:'5–15 min',  phase:'UPPER WALL',     sub:'Corals · fans · fish life'},
    {time:'15–25 min', phase:'MID WALL',       sub:`${Math.round(md*0.55)}m section`},
    {time:'25–35 min', phase:'DEEP SECTION',   sub:`Max ${md}m`},
    {time:'35–42 min', phase:'ASCENT',         sub:'Return up the wall'},
    {time:'42–47 min', phase:'SAFETY STOP',    sub:'5 metres · 3 minutes'},
    {time:'47–50 min', phase:'EXIT',           sub:exit},
  ]
  if (type === 'Muck') return [
    {time:'0–5 min',   phase:'ENTRY',          sub:'Slow controlled descent'},
    {time:'5–20 min',  phase:'SAND ZONE 1',    sub:'Grid search pattern'},
    {time:'20–35 min', phase:'RUBBLE ZONE',    sub:'Macro critters · rare finds'},
    {time:'35–45 min', phase:'RETURN',         sub:'Systematic return route'},
    {time:'45–50 min', phase:'ASCENT',         sub:'Slow · controlled'},
    {time:'50–53 min', phase:'SAFETY STOP',    sub:'5 metres · 3 minutes'},
    {time:'53–55 min', phase:'EXIT',           sub:exit},
  ]
  return [
    {time:'0–5 min',   phase:'DESCEND',        sub:'Entry & descent'},
    {time:'5–15 min',  phase:'SHALLOW REEF',   sub:`${Math.round(md*0.25)}m · photos`},
    {time:'15–25 min', phase:'MAIN REEF',      sub:`${Math.round(md*0.55)}m section`},
    {time:'25–35 min', phase:'DEEP SECTION',   sub:`Max ${md}m`},
    {time:'35–42 min', phase:'RETURN',         sub:'Ascend reef slope'},
    {time:'42–47 min', phase:'SAFETY STOP',    sub:'5 metres · 3 minutes'},
    {time:'47–50 min', phase:'EXIT',           sub:exit},
  ]
}

// ── WAYPOINT LABELS ──────────────────────────────────────────────────────
function getWaypoints(site: DiveSite): string[] {
  const { diagramType, type, access } = site
  const entry = access === 'Boat' ? 'Boat entry & descent' : 'Shore entry & descend'
  if (diagramType === 'wreck') return [entry,'Wreck bow — explore','Mid-ship · engine room','Stern · propeller','Safety stop · exit']
  if (diagramType === 'wall')  return [entry,'Upper wall section','Mid wall section',`Max depth · turn`,'Safety stop · exit']
  if (type === 'Muck')         return ['Entry — slow descent','Sand search zone 1','Rubble critter zone','Return sand zone','Safety stop · exit']
  return [entry,'Shallow reef · photos','Main reef section','Deep point · turn','Safety stop · exit']
}

// ── PRO TIPS ─────────────────────────────────────────────────────────────
function getProTips(site: DiveSite): Array<{icon:string; label:string; text:string}> {
  const { diagramType, type, current, marineLife } = site
  const topML = marineLife[0]?.name ?? 'marine life'
  const strong = current.toLowerCase().includes('strong') || current.toLowerCase().includes('very')
  const tips = []
  if (diagramType === 'wreck')
    tips.push({icon:'📷', label:'PHOTOGRAPHY', text:`Wide-angle for the wreck hull, macro for critters on the sandy slope`})
  else if (type === 'Muck')
    tips.push({icon:'🔍', label:'CRITTER TIP', text:`Move at a crawl. Your divemaster spots for you. Never touch the substrate`})
  else if (diagramType === 'wall')
    tips.push({icon:'🔭', label:'LOOK CLOSELY', text:`Check every sea fan for pygmy seahorses. Inspect crevices on ascent`})
  else
    tips.push({icon:'🌅', label:'BEST TIMING', text:`Morning dives offer best visibility and most active ${topML} encounters`})
  tips.push({icon:'👥', label:'FOLLOW GUIDE', text:'Stay with your buddy. Follow the planned route and your guide at all times'})
  tips.push({icon:'🚫', label:"DON'T TOUCH",  text:'Respect all reef and marine life. Hands off everything underwater'})
  tips.push({icon:'🎯', label:'MONITOR AIR',  text:'Check your pressure regularly. Signal your guide at 100 bar'})
  if (strong)
    tips.push({icon:'⚠️', label:'STRONG CURRENT', text:'Always carry SMB. Dive at planned tide only. Stay close to your guide'})
  else
    tips.push({icon:'❤️', label:'ENJOY THE DIVE', text:`One of ${site.area}'s most iconic and memorable underwater experiences`})
  return tips
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────
export default function DiveBriefingCard({ site }: { site: DiveSite }) {
  const {
    maxDepth: md, minDepth, visibility, temp, difficulty, minCert,
    bestTime, bestSeason, type, access, current, diagramType, name, area,
    marineLife, safetyNotes, rank, rating, reviews, description
  } = site

  const isBoat    = access === 'Boat'
  const hasStrong = current.toLowerCase().includes('strong') || current.toLowerCase().includes('very')
  const currentStrength = hasStrong ? 'strong' : current.toLowerCase().includes('mild') || current.toLowerCase().includes('weak') ? 'weak' : 'moderate'
  const id = site.slug.replace(/[^a-z0-9]/g, '-')

  // depth markers
  const depthStep = md <= 20 ? 5 : 5
  const depthMarks: number[] = []
  for (let d = 0; d <= md; d += depthStep) depthMarks.push(d)

  const ml    = marineLife.slice(0, 5)
  const mlPos = mlPositions(site)
  const haz   = safetyNotes.slice(0, 4)
  const tl    = getTimeline(site)
  const wpts  = getWaypoints(site)
  const tips  = getProTips(site)

  const CARD_Y = DY + DH + 20         // info cards y
  const TL_Y   = CARD_Y + CARDS_H + 20 // timeline y
  const TIP_Y  = TL_Y + TIMELINE_H + 20
  const FT_Y   = TIP_Y + TIPS_H + 10   // footer y

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 16,
               fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif" }}
    >
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor={C.skyTop}/>
          <stop offset="100%" stopColor={C.skyBot}/>
        </linearGradient>
        <linearGradient id={`sea-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={C.seaSurface} stopOpacity="0.6"/>
          <stop offset="40%"  stopColor={C.seaMid}     stopOpacity="0.85"/>
          <stop offset="100%" stopColor={C.seaDeep}    stopOpacity="1"/>
        </linearGradient>
        <linearGradient id={`hdr-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#071828"/>
          <stop offset="100%" stopColor="#04101a"/>
        </linearGradient>
        <linearGradient id={`fp-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.navyPanel}/>
          <stop offset="100%" stopColor={C.navy}/>
        </linearGradient>
      </defs>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          BASE
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <rect width={W} height={H} fill={C.navy} rx="16"/>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HEADER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <rect x="0" y="0" width={W} height={HEADER_H} fill={`url(#hdr-${id})`} rx="16"/>
      <rect x="0" y={HEADER_H - 12} width={W} height="12" fill={`url(#hdr-${id})`}/>
      <line x1="0" y1={HEADER_H} x2={W} y2={HEADER_H} stroke={C.grey4} strokeWidth="1.5"/>

      {/* DIVE BRIEFING label */}
      <T x="40" y="50" size="18" fill={C.orange} weight="800" letter="3">{`DIVE BRIEFING`}</T>

      {/* site name */}
      <T x="40" y="106" size="52" fill={C.white} weight="900" letter="-1">{name.toUpperCase()}</T>

      {/* breadcrumb */}
      <T x="42" y="140" size="20" fill={C.grey2} weight="400" letter="0.5">
        📍 {area}  ·  Indonesia
      </T>

      {/* rank badge */}
      <rect x={W - 520} y="30" width="180" height="46" rx="23" fill={C.navyCard} stroke={C.blueDim} strokeWidth="2"/>
      <T x={W - 430} y="61" size="18" fill={C.blue} weight="700" anchor="middle">#{rank} in {area}</T>

      {/* verified badge */}
      <rect x={W - 328} y="30" width="288" height="46" rx="23" fill={C.greenDim} stroke={C.green} strokeWidth="2"/>
      <T x={W - 320} y="61" size="18" fill={C.green} weight="700">✓  Verified by local experts</T>

      {/* compass */}
      <IconCompass x={W - 60} y={HEADER_H / 2 + 10}/>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          DIAGRAM SECTION
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* sky */}
      <rect x="0" y={DY} width={LP} height={SY - DY} fill={`url(#sky-${id})`}/>

      {/* water */}
      <rect x="0" y={SY} width={LP} height={BY - SY + 50} fill={`url(#sea-${id})`}/>

      {/* BOAT or SHORE */}
      {isBoat ? (
        <g>
          <IconBoat x={310} y={SY - 52} s={1.4}/>
          <text x="230" y={SY - 112} fontSize="18" fill={C.grey2} fontWeight="700"
            fontFamily="'Inter',Arial,sans-serif" letterSpacing="1">BOAT DROP</text>
          <line x1="310" y1={SY - 14} x2="280" y2={SY + 2}
            stroke={C.grey2} strokeWidth="2" strokeDasharray="5,4" opacity="0.7"/>
          {/* pick up boat */}
          <IconBoat x={900} y={SY - 52} s={1.4}/>
          <text x="820" y={SY - 112} fontSize="18" fill={C.grey2} fontWeight="700"
            fontFamily="'Inter',Arial,sans-serif" letterSpacing="1">PICK UP</text>
        </g>
      ) : (
        <g>
          {/* land mass */}
          <rect x="0" y={DY} width="220" height={SY - DY} fill={`url(#sky-${id})`}/>
          <path d={`M0 ${DY + 20} L0 ${SY - 24} Q60 ${SY - 36} 120 ${SY - 20}
                    Q170 ${SY - 10} 220 ${SY} L0 ${SY} Z`} fill="#4a7c42"/>
          <path d={`M0 ${SY - 6} Q80 ${SY - 16} 160 ${SY - 5} Q190 ${SY - 1} 220 ${SY}`}
            fill="#c8a870"/>
          <text x="110" y={SY - 44} fontSize="16" fill={C.grey2} fontWeight="700"
            textAnchor="middle" fontFamily="'Inter',Arial,sans-serif">SHORE ENTRY</text>
        </g>
      )}

      {/* surface line */}
      <line x1="0" y1={SY} x2={LP} y2={SY}
        stroke="#7dd3fc" strokeWidth="2" strokeDasharray="12,7" opacity="0.55"/>
      <text x="20" y={SY - 10} fontSize="16" fill={C.grey2} fontWeight="600"
        fontFamily="'Inter',Arial,sans-serif" letterSpacing="1">SURFACE  0m</text>

      {/* depth markers */}
      {depthMarks.map(d => {
        const y = dY(d, md)
        if (y > BY + 10) return null
        const isMax = d === md
        return (
          <g key={d}>
            <line x1="56" y1={y} x2={LP - 4} y2={y}
              stroke={isMax ? C.red : C.grey4}
              strokeWidth={isMax ? 2 : 0.8}
              strokeDasharray={isMax ? '8,4' : '3,10'}
              opacity={isMax ? 0.95 : 0.65}/>
            <text x="48" y={y + 6} fontSize="15" textAnchor="end" fontWeight={isMax?'800':'400'}
              fill={isMax ? C.red : '#60a5fa'} fontFamily="'Inter',Arial,sans-serif">{d}m</text>
            {isMax && (
              <g>
                <rect x="60" y={y - 26} width="200" height="28" rx="5" fill={C.redDim} opacity="0.85"/>
                <text x="70" y={y - 7} fontSize="14" fill={C.red} fontWeight="800"
                  fontFamily="'Inter',Arial,sans-serif">MAX DEPTH  {d}m</text>
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
      <CurrentArrow x={isBoat ? 500 : 360} y={SY + 50} strength={currentStrength}/>

      {/* marine life labels */}
      {ml.map((m, i) => {
        const pos = mlPos[i] ?? mlPos[mlPos.length - 1]
        const depth = `${Math.round(md*(0.18+i*0.16))}–${Math.round(md*(0.30+i*0.16))}m`
        return <MLLabel key={i} x={pos[0]} y={pos[1]} name={m.name} depth={depth} emoji={mlEmoji(m.name)}/>
      })}

      {/* hazard badges */}
      {haz.slice(0, 2).map((h, i) => {
        const hx = [200, 560][i] ?? 200
        const hy = BY - 40 + i * 50
        return <HazardBadge key={i} x={hx} y={hy} label={h}/>
      })}

      {/* diagram bottom border */}
      <line x1="0" y1={DY + DH} x2={LP} y2={DY + DH} stroke={C.grey4} strokeWidth="1.5"/>

      {/* ── RIGHT PANEL ──────────────────────────────────────────────── */}
      <rect x={LP} y={DY} width={LW} height={DH} fill={C.navyMid}/>
      <line x1={LP} y1={DY} x2={LP} y2={DY + DH} stroke={C.grey4} strokeWidth="1.5"/>

      {/* LEGEND card */}
      <rect x={LP + 20} y={DY + 20} width={LW - 40} height="296" rx="10" fill={C.navyCard} stroke={C.grey4} strokeWidth="1"/>
      <T x={LP + 36} y={DY + 52} size="14" fill={C.grey2} weight="800" letter="2">LEGEND</T>
      {([
        ['━ ━', C.white,  'Entry / Descent'],
        ['╌ ╌', C.white,  'Route'],
        ['●',   C.green,  'Safety Stop'],
        ['▲',   C.blue,   'Pick Up / Exit'],
        ['▶',   C.teal,   'Current'],
        ['★',   C.yellow, 'Marine Life'],
        ['⚠',   C.red,    'Hazard'],
        ['📷',  C.orange, 'Photo Opportunity'],
      ] as [string,string,string][]).map(([sym,col,lbl],i) => (
        <g key={i} transform={`translate(${LP+36},${DY+72+i*26})`}>
          <text x="0" y="0" fontSize="18" fill={col} fontWeight="700"
            fontFamily="'Inter',Arial,sans-serif">{sym}</text>
          <text x="42" y="1" fontSize="14" fill={C.grey1}
            fontFamily="'Inter',Arial,sans-serif">{lbl}</text>
        </g>
      ))}

      {/* HAZARDS card */}
      <rect x={LP+20} y={DY+336} width={LW-40} height={haz.length*46+52} rx="10" fill="#0e0608" stroke={C.redDim} strokeWidth="1.5"/>
      <T x={LP+36} y={DY+366} size="14" fill={C.red} weight="800" letter="2">SITE HAZARDS</T>
      {haz.map((h, i) => (
        <g key={i} transform={`translate(${LP+36},${DY+388+i*46})`}>
          <text x="0" y="0" fontSize="18" fill={C.red}>⚠</text>
          <text x="32" y="0" fontSize="13" fill="#fca5a5"
            fontFamily="'Inter',Arial,sans-serif">
            {h.length > 34 ? h.slice(0,33)+'…' : h}
          </text>
        </g>
      ))}

      {/* WAYPOINTS card */}
      {(() => {
        const wy = DY + 336 + haz.length * 46 + 64
        return (
          <g>
            <rect x={LP+20} y={wy} width={LW-40} height={wpts.length*44+48} rx="10" fill={C.navyCard} stroke={C.grey4} strokeWidth="1"/>
            <T x={LP+36} y={wy+30} size="14" fill={C.grey2} weight="800" letter="2">ROUTE WAYPOINTS</T>
            {wpts.map((lbl,i) => (
              <g key={i} transform={`translate(${LP+36},${wy+52+i*44})`}>
                <circle cx="14" cy="-8" r="14" fill={i===wpts.length-1?C.green:C.navy} stroke={C.white} strokeWidth="2"/>
                <text x="14" y="-3" fontSize="12" fill={C.white} textAnchor="middle" fontWeight="800"
                  fontFamily="'Inter',Arial,sans-serif">{i+1}</text>
                <text x="38" y="-2" fontSize="13" fill={C.grey1}
                  fontFamily="'Inter',Arial,sans-serif">{lbl}</text>
              </g>
            ))}
          </g>
        )
      })()}

      {/* SITE RATING card */}
      {(() => {
        const ry = DY + DH - 180
        return (
          <g>
            <rect x={LP+20} y={ry} width={LW-40} height="160" rx="10" fill={C.navyCard} stroke={C.grey4} strokeWidth="1"/>
            <T x={LP+36} y={ry+30} size="14" fill={C.grey2} weight="800" letter="2">SITE RATING</T>
            <T x={LP+36} y={ry+90} size="52" fill={C.yellow} weight="900">★ {rating}</T>
            <T x={LP+36} y={ry+120} size="14" fill={C.grey2}>{reviews} verified diver reviews</T>
            <T x={LP+36} y={ry+146} size="13" fill={C.grey3}>🔒 Admin verified · Dive Spots</T>
          </g>
        )
      })()}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          QUICK INFO CARDS  (8 cards, full width)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <rect x="0" y={CARD_Y} width={W} height={CARDS_H} fill={C.navyDeep}/>
      <line x1="0" y1={CARD_Y} x2={W} y2={CARD_Y} stroke={C.grey4} strokeWidth="1.5"/>
      {([
        ['DIVE TYPE',      type],
        ['DIFFICULTY',     difficulty],
        ['CERTIFICATION',  minCert],
        ['ACCESS',         access],
        ['DEPTH RANGE',    `${minDepth}–${md}m`],
        ['VISIBILITY',     visibility],
        ['WATER TEMP',     temp],
        ['BEST TIME',      bestTime],
      ] as [string,string][]).map(([k,v],i) => {
        const cardW = W / 8
        const cx = i * cardW
        return (
          <g key={k}>
            {i > 0 && <line x1={cx} y1={CARD_Y+20} x2={cx} y2={CARD_Y+CARDS_H-20} stroke={C.grey4} strokeWidth="1" opacity="0.5"/>}
            <text x={cx + cardW/2} y={CARD_Y+38} fontSize="13" fill={C.grey2} fontWeight="700"
              textAnchor="middle" fontFamily="'Inter',Arial,sans-serif" letterSpacing="0.8">{k}</text>
            <text x={cx + cardW/2} y={CARD_Y+90} fontSize="22" fill={C.white} fontWeight="800"
              textAnchor="middle" fontFamily="'Inter',Arial,sans-serif">{v}</text>
            <text x={cx + cardW/2} y={CARD_Y+118} fontSize="12" fill={C.grey3}
              textAnchor="middle" fontFamily="'Inter',Arial,sans-serif">{bestSeason}</text>
          </g>
        )
      })}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          DIVE TIMELINE
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <rect x="0" y={TL_Y} width={W} height={TIMELINE_H} fill={C.navyPanel}/>
      <line x1="0" y1={TL_Y} x2={W} y2={TL_Y} stroke={C.grey4} strokeWidth="1.5"/>
      <T x="40" y={TL_Y+44} size="16" fill={C.blue} weight="800" letter="2">
        DIVE TIMELINE  ·  APPROX. 45–55 MINUTES
      </T>

      {tl.map((step, i) => {
        const cardW = (W - 80) / tl.length
        const cx = 40 + i * cardW
        return (
          <g key={i}>
            <rect x={cx} y={TL_Y+58} width={cardW-12} height={TIMELINE_H-74} rx="8" fill={C.navyCard} stroke={C.grey4} strokeWidth="1"/>
            <text x={cx + (cardW-12)/2} y={TL_Y+86} fontSize="13" fill={C.blue} fontWeight="700"
              textAnchor="middle" fontFamily="'Inter',Arial,sans-serif" letterSpacing="0.5">{step.time}</text>
            <text x={cx + (cardW-12)/2} y={TL_Y+120} fontSize="17" fill={C.white} fontWeight="900"
              textAnchor="middle" fontFamily="'Inter',Arial,sans-serif">{step.phase}</text>
            <text x={cx + (cardW-12)/2} y={TL_Y+146} fontSize="12" fill={C.grey2}
              textAnchor="middle" fontFamily="'Inter',Arial,sans-serif">{step.sub}</text>
            {i < tl.length - 1 && (
              <text x={cx + cardW - 4} y={TL_Y + 126} fontSize="24" fill={C.grey3}
                textAnchor="middle" fontFamily="'Inter',Arial,sans-serif">›</text>
            )}
          </g>
        )
      })}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PRO TIPS / SAFETY ROW
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <rect x="0" y={TIP_Y} width={W} height={TIPS_H} fill={C.navy}/>
      <line x1="0" y1={TIP_Y} x2={W} y2={TIP_Y} stroke={C.grey4} strokeWidth="1.5"/>

      {tips.map((tip, i) => {
        const colW = W / tips.length
        const cx = i * colW
        return (
          <g key={i}>
            {i > 0 && <line x1={cx} y1={TIP_Y+20} x2={cx} y2={TIP_Y+TIPS_H-20} stroke={C.grey4} strokeWidth="1" opacity="0.4"/>}
            <text x={cx + 32} y={TIP_Y + 56} fontSize="30" fontFamily="'Inter',Arial,sans-serif">{tip.icon}</text>
            <text x={cx + 76} y={TIP_Y + 52} fontSize="14" fill={C.blue} fontWeight="800"
              fontFamily="'Inter',Arial,sans-serif" letterSpacing="0.5">{tip.label}</text>
            <foreignObject x={cx+28} y={TIP_Y+66} width={colW-44} height="110">
              <div
                style={{
                  fontSize: '13px',
                  color: C.grey2,
                  lineHeight: '1.55',
                  fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif",
                  wordWrap: 'break-word'
                }}
              >
                {tip.text}
              </div>
            </foreignObject>
          </g>
        )
      })}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FOOTER
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <rect x="0" y={FT_Y} width={W} height={FOOTER_H} fill={C.navyDeep}/>
      <line x1="0" y1={FT_Y} x2={W} y2={FT_Y} stroke={C.grey4} strokeWidth="1.5"/>
      <T x="40" y={FT_Y + 38} size="16" fill={C.grey3}>dive-spots.com</T>
      <T x={W/2} y={FT_Y + 38} size="15" fill={C.grey3} anchor="middle">
        Always follow your dive guide&apos;s briefing. Never dive beyond your training level.
      </T>
      <T x={W - 40} y={FT_Y + 38} size="15" fill={C.grey3} anchor="end">© 2026 Dive Spots</T>

    </svg>
  )
}
