import React from 'react'
import { DiveSite } from '@/lib/data'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DIVE SPOTS — OFFICIAL DIVE BRIEFING SYSTEM  v4.0
//  Architecture: Token → Primitive → Component → Template → Renderer
//  Think Google Maps, not an illustration.
//  Canvas: 2048 × 2048  |  Scalable SVG  |  Data-driven only
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─────────────────────────────────────────────────────────────────────────
//  1. DESIGN TOKENS
//  Single source of truth. Change here → changes everywhere.
// ─────────────────────────────────────────────────────────────────────────
const T = {
  // Canvas
  W: 2048,
  H: 2048,

  // Layout (all must sum to H=2048)
  HEADER_H:   152,
  DIAGRAM_H: 1100,   // ~54% of canvas — the largest zone
  CARDS_H:    140,
  TIMELINE_H: 240,
  TIPS_H:     360,
  FOOTER_H:    56,   // 152+1100+140+240+360+56 = 2048 ✓

  // Diagram internals
  SKY_H:      108,   // sky above water surface
  PANEL_W:    520,   // right panel width
  DEPTH_GUTTER: 62,  // left gutter for depth labels

  // Spacing system (4px base)
  S4: 4, S8: 8, S12: 12, S16: 16, S20: 20, S24: 24,
  S32: 32, S40: 40, S48: 48, S64: 64,

  // Colour tokens
  C: {
    // Backgrounds — dark navy scale
    bg:        '#03101d',
    bgPanel:   '#051624',
    bgCard:    '#07192c',
    bgCardHi:  '#091e34',
    bgDark:    '#020c17',
    bgRed:     '#1a0508',
    bgGreen:   '#051a0f',

    // Water gradient stops
    water0:    '#15648a',   // surface
    water1:    '#0b3d62',   // mid-depth
    water2:    '#040f1e',   // deep

    // Sky
    sky0:      '#6ab4d4',
    sky1:      '#9ecfe6',

    // Terrain
    terrainFill:   '#0f2218',
    terrainStroke: '#183424',
    sand:          '#b89040',
    sandFill:      '#c8a458',

    // Type scale
    textPrimary:   '#ffffff',
    textSecondary: '#8aaab8',
    textMuted:     '#3d5a70',
    textDivider:   '#122030',

    // Semantic — all spec-compliant
    green:   '#16c070',
    red:     '#e53040',
    orange:  '#f07020',
    yellow:  '#f0c018',
    blue:    '#2890d0',
    teal:    '#00a8c0',

    // Route
    route:   '#ffffff',
  },

  // Typography scale (px at 2048 canvas)
  F: {
    label:    12,   // CAPS labels
    caption:  14,
    body:     16,
    bodyLg:   18,
    ui:       20,
    subhead:  24,
    head:     32,
    display:  52,
    hero:     68,
  },

  // Radius
  R: { sm:6, md:10, lg:16, pill:999 },
}

// Derived layout positions
const HEADER_Y   = 0
const DIAGRAM_Y  = T.HEADER_H
const CARDS_Y    = DIAGRAM_Y + T.DIAGRAM_H
const TIMELINE_Y = CARDS_Y   + T.CARDS_H
const TIPS_Y     = TIMELINE_Y + T.TIMELINE_H
const FOOTER_Y   = TIPS_Y    + T.TIPS_H

// Diagram-space constants
const SURFACE_Y  = DIAGRAM_Y + T.SKY_H
const SEABED_Y   = DIAGRAM_Y + T.DIAGRAM_H - 48
const PANEL_X    = T.W - T.PANEL_W
const DRAW_W     = PANEL_X - T.DEPTH_GUTTER   // usable diagram width

// Depth-to-Y mapping — linear scale
function dY(depth: number, maxDepth: number): number {
  return SURFACE_Y + (depth / maxDepth) * (SEABED_Y - SURFACE_Y)
}

// ─────────────────────────────────────────────────────────────────────────
//  2. PRIMITIVE COMPONENTS
//  Atomic, reusable, no business logic.
// ─────────────────────────────────────────────────────────────────────────

// Text — consistent font stack
function Txt({ x, y, size, fill = T.C.textPrimary, weight = '400',
  anchor = 'start', spacing = '0', children }: {
  x: number; y: number; size: number; fill?: string; weight?: string
  anchor?: string; spacing?: string; children: React.ReactNode
}) {
  return (
    <text x={x} y={y} fontSize={size} fill={fill} fontWeight={weight}
      textAnchor={anchor} letterSpacing={spacing}
      fontFamily="'Inter','Helvetica Neue',system-ui,Arial,sans-serif">
      {children}
    </text>
  )
}

// Badge — pill-shaped label
function Badge({ x, y, w, h = 44, fill, stroke, children }: {
  x: number; y: number; w: number; h?: number
  fill: string; stroke: string; children: React.ReactNode
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} stroke={stroke} strokeWidth="1.5"/>
      {children}
    </g>
  )
}

// Card — rounded rectangle panel
function Card({ x, y, w, h, fill = T.C.bgCard, stroke = T.C.textDivider, r = T.R.md, children }: {
  x: number; y: number; w: number; h: number
  fill?: string; stroke?: string; r?: number; children?: React.ReactNode
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth="1.2"/>
      {children}
    </g>
  )
}

// Divider line
function Div({ x1, y1, x2, y2, color = T.C.textDivider }: {
  x1:number; y1:number; x2:number; y2:number; color?: string
}) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.2"/>
}

// Section label — always the same treatment
function SectionLabel({ x, y, children }: { x:number; y:number; children:string }) {
  return (
    <Txt x={x} y={y} size={T.F.label} fill={T.C.textSecondary} weight="700" spacing="2.5">
      {children}
    </Txt>
  )
}

// ─────────────────────────────────────────────────────────────────────────
//  3. SYSTEM COMPONENTS
//  Built from primitives. Each has one job.
// ─────────────────────────────────────────────────────────────────────────

// COMPASS — always top-right of header
function Compass({ cx, cy, r = 48 }: { cx:number; cy:number; r?:number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={T.C.bgCard} stroke={T.C.textMuted} strokeWidth="2"/>
      <circle cx={cx} cy={cy} r={r - 10} fill="none" stroke={T.C.textDivider} strokeWidth="1"/>
      {/* tick marks */}
      {Array.from({length: 12}).map((_,i) => {
        const a = (i * 30 - 90) * Math.PI / 180
        const major = i % 3 === 0
        const r1 = major ? r - 18 : r - 13
        return (
          <line key={i}
            x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1}
            x2={cx + Math.cos(a) * (r - 6)} y2={cy + Math.sin(a) * (r - 6)}
            stroke={T.C.textMuted} strokeWidth={major ? 2 : 1}/>
        )
      })}
      {/* cardinal labels */}
      {[['N',-90,T.C.orange],['E',0,T.C.textSecondary],['S',90,T.C.textSecondary],['W',180,T.C.textSecondary]].map(([d,a,c]) => {
        const ang = (Number(a) - 90) * Math.PI / 180
        return (
          <Txt key={String(d)} x={cx + Math.cos(ang)*(r-26)} y={cy + Math.sin(ang)*(r-26)+5}
            size={13} fill={String(c)} weight={d==='N'?'800':'500'} anchor="middle">
            {String(d)}
          </Txt>
        )
      })}
      {/* needle */}
      <polygon points={`${cx},${cy - r + 16} ${cx + 6},${cy + 4} ${cx},${cy} ${cx - 6},${cy + 4}`}
        fill={T.C.textPrimary}/>
      <polygon points={`${cx},${cy + r - 16} ${cx + 6},${cy - 4} ${cx},${cy} ${cx - 6},${cy - 4}`}
        fill={T.C.textMuted}/>
      <circle cx={cx} cy={cy} r="4" fill={T.C.bgCard} stroke={T.C.textPrimary} strokeWidth="1.5"/>
    </g>
  )
}

// BOAT icon — flat vector, minimal
function BoatIcon({ x, y, label }: { x:number; y:number; label:string }) {
  return (
    <g>
      {/* hull */}
      <path d={`M${x-56} ${y+4} Q${x-36} ${y-10} ${x} ${y-12} Q${x+36} ${y-10} ${x+56} ${y+4} Q${x+38} ${y+16} ${x-38} ${y+16} Z`}
        fill={T.C.textSecondary} stroke={T.C.textMuted} strokeWidth="2"/>
      {/* cabin */}
      <rect x={x-18} y={y-34} width="36" height="24" rx="4" fill={T.C.textMuted} stroke={T.C.textDivider} strokeWidth="1.5"/>
      {/* mast */}
      <line x1={x+2} y1={y-34} x2={x+2} y2={y-60} stroke={T.C.textMuted} strokeWidth="2.5"/>
      {/* boom */}
      <line x1={x-24} y1={y-50} x2={x+28} y2={y-50} stroke={T.C.textMuted} strokeWidth="1.5"/>
      {/* dive flag on mast */}
      <rect x={x+2} y={y-62} width="22" height="14" rx="2" fill={T.C.red} opacity="0.9"/>
      <line x1={x+10} y1={y-55} x2={x+24} y2={y-62} stroke={T.C.textPrimary} strokeWidth="1.5"/>
      {/* descent line */}
      <line x1={x} y1={y+16} x2={x-10} y2={SURFACE_Y}
        stroke={T.C.textMuted} strokeWidth="1.5" strokeDasharray="5,4" opacity="0.6"/>
      {/* label */}
      <Txt x={x} y={y-82} size={T.F.caption} fill={T.C.textSecondary} weight="700"
        anchor="middle" spacing="1.5">{label}</Txt>
    </g>
  )
}

// SHORE — land mass at waterline
function ShoreEntry({ entry }: { entry: string }) {
  const lx = T.DEPTH_GUTTER + 10
  return (
    <g>
      {/* land */}
      <path d={`M0 ${DIAGRAM_Y} L0 ${SURFACE_Y - 24}
                Q${lx + 60} ${SURFACE_Y - 40} ${lx + 130} ${SURFACE_Y - 18}
                Q${lx + 180} ${SURFACE_Y - 6} ${lx + 220} ${SURFACE_Y}
                L0 ${SURFACE_Y} Z`}
        fill="#2d5428"/>
      {/* sand/rock at waterline */}
      <path d={`M0 ${SURFACE_Y - 6}
                Q${lx + 80} ${SURFACE_Y - 14} ${lx + 160} ${SURFACE_Y - 4}
                Q${lx + 195} ${SURFACE_Y} ${lx + 224} ${SURFACE_Y}`}
        fill={T.C.sandFill} opacity="0.7"/>
      {/* label */}
      <Txt x={lx + 110} y={SURFACE_Y - 48} size={T.F.caption}
        fill={T.C.textSecondary} weight="700" anchor="middle" spacing="1.5">
        {entry.toUpperCase()} ENTRY
      </Txt>
    </g>
  )
}

// SURFACE LINE
function SurfaceLine() {
  return (
    <g>
      <line x1={T.DEPTH_GUTTER} y1={SURFACE_Y} x2={PANEL_X} y2={SURFACE_Y}
        stroke="#5ab8d8" strokeWidth="1.8" strokeDasharray="12,7" opacity="0.5"/>
      <Txt x={T.DEPTH_GUTTER + 8} y={SURFACE_Y - 8} size={T.F.caption}
        fill={T.C.textSecondary} weight="600" spacing="1">SURFACE</Txt>
    </g>
  )
}

// DEPTH SCALE — every 5m, max depth marked in red
function DepthScale({ maxDepth }: { maxDepth: number }) {
  const marks: number[] = []
  for (let d = 5; d <= maxDepth; d += 5) marks.push(d)
  return (
    <g>
      {marks.map(d => {
        const y = dY(d, maxDepth)
        if (y > SEABED_Y + 8) return null
        const isMax = d === maxDepth
        return (
          <g key={d}>
            {/* grid line */}
            <line x1={T.DEPTH_GUTTER} y1={y} x2={PANEL_X} y2={y}
              stroke={isMax ? T.C.red : T.C.textDivider}
              strokeWidth={isMax ? 1.8 : 0.8}
              strokeDasharray={isMax ? '8,5' : '2,10'}
              opacity={isMax ? 0.9 : 0.7}/>
            {/* depth label */}
            <Txt x={T.DEPTH_GUTTER - 6} y={y + 5} size={T.F.caption}
              fill={isMax ? T.C.red : '#3a8cb8'}
              weight={isMax ? '700' : '400'} anchor="end">
              {d}m
            </Txt>
            {/* max depth marker */}
            {isMax && (
              <g>
                <rect x={T.DEPTH_GUTTER + 6} y={y - 26} width={186} height={28}
                  rx={T.R.sm} fill={T.C.bgRed}/>
                <Txt x={T.DEPTH_GUTTER + 16} y={y - 6} size={T.F.body}
                  fill={T.C.red} weight="700" spacing="0.5">
                  MAX DEPTH  {d}m
                </Txt>
              </g>
            )}
          </g>
        )
      })}
    </g>
  )
}

// CURRENT — elegant directional arrows, 3 strengths
function Current({ x, y, strength }: {
  x: number; y: number; strength: 'weak'|'moderate'|'strong'
}) {
  const cfg = {
    weak:     { n: 2, col: '#4a9ab8', label: 'MILD CURRENT' },
    moderate: { n: 3, col: T.C.teal,  label: 'CURRENT' },
    strong:   { n: 5, col: T.C.blue,  label: 'STRONG CURRENT' },
  }[strength]
  return (
    <g>
      {Array.from({length: cfg.n}).map((_, i) => (
        <g key={i} transform={`translate(${x + i * 44}, ${y})`}>
          {/* chevron arrow — clean, not chunky */}
          <polyline points="-4,-12 12,0 -4,12" fill="none"
            stroke={cfg.col} strokeWidth="2.5" strokeLinecap="round"
            strokeLinejoin="round" opacity={0.55 + i * 0.1}/>
        </g>
      ))}
      <Txt x={x + cfg.n * 44 + 12} y={y + 5} size={T.F.body}
        fill={cfg.col} weight="600" spacing="1.5">{cfg.label}</Txt>
    </g>
  )
}

// WAYPOINT — numbered circle, green for safety stop
function Waypoint({ x, y, n, isSS = false }: {
  x:number; y:number; n:number; isSS?:boolean
}) {
  const r = 24
  const bg = isSS ? T.C.green : T.C.bg
  const st = isSS ? T.C.green : T.C.textPrimary
  return (
    <g>
      <circle cx={x} cy={y} r={r + 1} fill="rgba(0,0,0,0.3)"/> {/* shadow */}
      <circle cx={x} cy={y} r={r} fill={bg} stroke={st} strokeWidth="3"/>
      <Txt x={x} y={y + 7} size={T.F.ui} fill={T.C.textPrimary}
        weight="800" anchor="middle">{n}</Txt>
    </g>
  )
}

// SAFETY STOP BADGE — sits above the last waypoint
function SafetyStopBadge({ x, y }: { x:number; y:number }) {
  const w = 192, h = 46
  return (
    <g>
      <rect x={x - w/2} y={y - h - 12} width={w} height={h} rx={T.R.md}
        fill={T.C.green} opacity="0.96"/>
      <Txt x={x} y={y - h - 12 + 20} size={T.F.body} fill={T.C.textPrimary}
        weight="800" anchor="middle" spacing="0.5">SAFETY STOP</Txt>
      <Txt x={x} y={y - h - 12 + 38} size={T.F.caption}
        fill="rgba(255,255,255,0.7)" anchor="middle">5 metres  ·  3 minutes</Txt>
    </g>
  )
}

// HAZARD TAG — consistent warning pill
function HazardTag({ x, y, text }: { x:number; y:number; text:string }) {
  const label = text.length > 26 ? text.slice(0, 25) + '…' : text
  const w = label.length * 10.5 + 54
  return (
    <g>
      <rect x={x} y={y - 20} width={w} height={36} rx={T.R.sm}
        fill={T.C.bgRed} stroke={T.C.red} strokeWidth="1.5"/>
      {/* warning triangle */}
      <polygon points={`${x+14},${y+10} ${x+22},${y-14} ${x+30},${y+10}`}
        fill="none" stroke={T.C.red} strokeWidth="2" strokeLinejoin="round"/>
      <Txt x={x + 22} y={y + 5} size={11} fill={T.C.red} weight="800" anchor="middle">!</Txt>
      <Txt x={x + 42} y={y + 4} size={T.F.body} fill="#f87070" weight="500">{label}</Txt>
    </g>
  )
}

// MARINE LIFE TAG — yellow-accented data pill, depth-positioned
function MLTag({ x, y, name, depth }: { x:number; y:number; name:string; depth:string }) {
  const label = name.length > 20 ? name.slice(0, 19) + '…' : name
  const w = Math.max(label.length * 10.2 + 20, 140)
  return (
    <g>
      <rect x={x} y={y} width={w} height={38} rx={T.R.sm}
        fill="rgba(3,16,29,0.88)" stroke={T.C.yellow} strokeWidth="1.5"/>
      {/* left accent bar */}
      <rect x={x} y={y} width={4} height={38} rx={2} fill={T.C.yellow}/>
      <Txt x={x + 16} y={y + 16} size={T.F.body} fill={T.C.yellow} weight="700">{label}</Txt>
      <Txt x={x + 16} y={y + 32} size={T.F.caption} fill={T.C.textSecondary}>{depth}</Txt>
    </g>
  )
}

// ─────────────────────────────────────────────────────────────────────────
//  4. TERRAIN TEMPLATES
//  Each renders the underwater landscape for one site type.
//  Same visual language, different geometry.
//  Inputs: maxDepth (for scaling), any site-specific flags.
// ─────────────────────────────────────────────────────────────────────────

// Shared seabed textures
function SandBottom({ opacity = 0.22 }: { opacity?:number }) {
  return (
    <path d={`M${T.DEPTH_GUTTER} ${SEABED_Y}
              Q${DRAW_W * 0.3 + T.DEPTH_GUTTER} ${SEABED_Y - 22}
              ${DRAW_W * 0.6 + T.DEPTH_GUTTER} ${SEABED_Y - 10}
              Q${DRAW_W * 0.85 + T.DEPTH_GUTTER} ${SEABED_Y}
              ${PANEL_X} ${SEABED_Y}
              L${PANEL_X} ${SEABED_Y + 50} L${T.DEPTH_GUTTER} ${SEABED_Y + 50} Z`}
      fill={T.C.sand} opacity={opacity}/>
  )
}

// TEMPLATE 1: WRECK
function TplWreck({ md }: { md:number }) {
  const keel = dY(md * 0.74, md)
  const deck = dY(md * 0.44, md)
  const bow  = T.DEPTH_GUTTER + 160
  const stern= T.DEPTH_GUTTER + 820
  const mid  = (bow + stern) / 2
  return (
    <g>
      <SandBottom opacity={0.22}/>
      {/* hull — organic silhouette */}
      <path d={`M${bow} ${keel + 10}
                Q${bow + 80} ${keel + 26} ${mid} ${keel + 18}
                Q${stern - 60} ${keel + 22} ${stern} ${keel - 2}
                L${stern - 8} ${deck + 18}
                Q${mid} ${deck - 8} ${bow + 30} ${deck + 16} Z`}
        fill={T.C.terrainFill} stroke={T.C.terrainStroke} strokeWidth="2.5"/>
      {/* superstructure */}
      <rect x={bow + 100} y={deck - 54} width={150} height={60} rx="6"
        fill="#0e1e14" stroke={T.C.terrainStroke} strokeWidth="2"/>
      <rect x={bow + 132} y={deck - 96} width={78} height={46} rx="5"
        fill="#0a1610" stroke={T.C.terrainStroke} strokeWidth="1.5"/>
      {/* mast */}
      <line x1={bow + 170} y1={deck - 96} x2={bow + 174} y2={deck - 150}
        stroke={T.C.terrainStroke} strokeWidth="4.5"/>
      <line x1={bow + 104} y1={deck - 128} x2={bow + 248} y2={deck - 128}
        stroke={T.C.terrainStroke} strokeWidth="2"/>
      {/* portholes — consistent size and spacing */}
      {[bow+44, bow+210, bow+330, bow+458, bow+588, bow+716].map((px, i) => (
        <circle key={i} cx={px} cy={(deck + keel) / 2 + 4} r="9"
          fill="none" stroke={T.C.terrainStroke} strokeWidth="2"/>
      ))}
      {/* coral growth on hull — organic blobs */}
      {[bow+32, bow+144, bow+282, bow+440, bow+590, bow+730, stern-80].map((cx, i) => (
        <ellipse key={i} cx={cx} cy={keel + 5}
          rx={13 + (i % 4) * 5} ry={12}
          fill={['#163816','#204e1a','#183028','#1e4c16','#163828','#204e1a','#163816'][i % 7]}
          opacity="0.9"/>
      ))}
      {/* anchor chain */}
      <path d={`M${bow + 24} ${deck + 14} Q${bow - 44} ${dY(md*0.58,md)} ${bow - 72} ${keel + 12}`}
        fill="none" stroke={T.C.terrainStroke} strokeWidth="3" strokeDasharray="7,5"/>
    </g>
  )
}

// TEMPLATE 2: WALL
function TplWall({ md }: { md:number }) {
  const wx = T.DEPTH_GUTTER + 188
  return (
    <g>
      <SandBottom opacity={0.18}/>
      {/* wall face — organic irregular surface */}
      <path d={`M${wx - 60} ${SURFACE_Y}
                Q${wx - 18} ${dY(md*0.10,md)} ${wx + 14} ${dY(md*0.22,md)}
                Q${wx - 12} ${dY(md*0.36,md)} ${wx + 18} ${dY(md*0.50,md)}
                Q${wx - 8}  ${dY(md*0.65,md)} ${wx + 12} ${dY(md*0.78,md)}
                Q${wx + 18} ${dY(md*0.92,md)} ${wx + 22} ${SEABED_Y + 50}
                L${wx - 80} ${SEABED_Y + 50} L${wx - 80} ${SURFACE_Y} Z`}
        fill={T.C.terrainFill} stroke={T.C.terrainStroke} strokeWidth="2.2"/>
      {/* rock strata */}
      {[0.16, 0.30, 0.46, 0.60, 0.74, 0.88].map((f, i) => (
        <path key={i}
          d={`M${wx - 60} ${dY(md*f,md)} Q${wx} ${dY(md*f,md) + (i%2?7:-7)} ${wx + 16} ${dY(md*f,md) + (i%2?-4:4)}`}
          fill="none" stroke={T.C.terrainStroke} strokeWidth="1.2" opacity="0.8"/>
      ))}
      {/* sea fans — 5 types, each unique but consistent style */}
      {[
        {f:0.14, xo:-72, col:T.C.orange, sz:88},
        {f:0.30, xo:-46, col:'#9055cc', sz:68},
        {f:0.48, xo:-96, col:T.C.red,   sz:106},
        {f:0.64, xo:-58, col:'#e89820', sz:78},
        {f:0.80, xo:-84, col:'#38a0c0', sz:92},
      ].map(({f, xo, col, sz}, i) => {
        const fy = dY(md * f, md)
        const tx = wx + 18, ty = fy
        return (
          <g key={i}>
            {/* stem */}
            <line x1={tx} y1={ty} x2={tx + xo * 0.45} y2={ty - sz * 0.52}
              stroke={col} strokeWidth="2.8" strokeLinecap="round" opacity="0.9"/>
            {/* fan ellipse */}
            <ellipse cx={tx + xo * 0.78} cy={ty - sz * 0.68}
              rx={sz * 0.40} ry={sz * 0.24}
              fill="none" stroke={col} strokeWidth="1.8" opacity="0.60"
              transform={`rotate(${-15 + i * 8}, ${tx + xo * 0.78}, ${ty - sz * 0.68})`}/>
            {/* branch */}
            <line x1={tx + xo * 0.28} y1={ty - sz * 0.28}
              x2={tx + xo * 0.90} y2={ty - sz * 0.54}
              stroke={col} strokeWidth="1.5" opacity="0.45"/>
          </g>
        )
      })}
      {/* black coral sprigs */}
      {[0.36, 0.60, 0.82].map((f, i) => {
        const fy = dY(md * f, md)
        return (
          <g key={i}>
            <line x1={wx + 14} y1={fy} x2={wx - 36} y2={fy - 52}
              stroke="#0e0e10" strokeWidth="3.5"/>
            <line x1={wx - 12} y1={fy - 22} x2={wx - 48} y2={fy - 44}
              stroke="#0e0e10" strokeWidth="2"/>
            <line x1={wx - 24} y1={fy - 36} x2={wx - 52} y2={fy - 58}
              stroke="#0e0e10" strokeWidth="1.5"/>
          </g>
        )
      })}
    </g>
  )
}

// TEMPLATE 3: REEF SLOPE
function TplReef({ md }: { md:number }) {
  const ox = T.DEPTH_GUTTER
  return (
    <g>
      <SandBottom/>
      {/* reef slope — smooth natural curve */}
      <path d={`M${ox + 100} ${SURFACE_Y + 32}
                Q${ox + 240} ${SURFACE_Y + 100} ${ox + 420} ${dY(md*0.36,md)}
                Q${ox + 590} ${dY(md*0.54,md)} ${ox + 800} ${dY(md*0.70,md)}
                Q${ox + 980} ${dY(md*0.80,md)} ${PANEL_X} ${SEABED_Y}
                L${PANEL_X} ${SEABED_Y + 50} L${ox + 100} ${SEABED_Y + 50} Z`}
        fill={T.C.terrainFill} stroke={T.C.terrainStroke} strokeWidth="2.2" opacity="0.94"/>
      {/* coral heads — varied size, depth-accurate placement */}
      {[
        {x:180, f:0.10, r:34}, {x:295, f:0.20, r:28}, {x:420, f:0.31, r:38},
        {x:540, f:0.42, r:24}, {x:668, f:0.52, r:30}, {x:800, f:0.62, r:26},
        {x:916, f:0.70, r:20}, {x:1040,f:0.75, r:28}, {x:1160,f:0.78, r:22},
      ].map(({x,f,r}, i) => {
        const cols = ['#20601a','#5c2414','#163c2c','#402070','#143c58',
                      '#4a2c12','#20601a','#301258','#143c38']
        return (
          <ellipse key={i} cx={ox + x} cy={dY(md*f,md)} rx={r} ry={r*0.55}
            fill={cols[i % cols.length]} opacity="0.92"/>
        )
      })}
      {/* soft coral branches */}
      {[180, 360, 560, 760, 960].map((x, i) => {
        const cy = dY(md * (0.12 + i * 0.10), md)
        const cols = ['#c898dc','#e4cc7a','#80c0d8','#dc8888','#88d098','#b8a0ec']
        return (
          <g key={i}>
            {[-16,-8,0,8,16].map(ox2 => (
              <line key={ox2} x1={ox+x+ox2} y1={cy} x2={ox+x+ox2+3} y2={cy-24}
                stroke={cols[i%6]} strokeWidth="2.8" strokeLinecap="round" opacity="0.68"/>
            ))}
          </g>
        )
      })}
    </g>
  )
}

// TEMPLATE 4: MUCK
function TplMuck({ md }: { md:number }) {
  const ox = T.DEPTH_GUTTER
  return (
    <g>
      {/* black sand slope */}
      <path d={`M0 ${SURFACE_Y + 90}
                Q${ox + 300} ${SEABED_Y - 110} ${ox + 720} ${SEABED_Y - 52}
                Q${ox + 1000} ${SEABED_Y - 20} ${PANEL_X} ${SEABED_Y + 8}
                L${PANEL_X} ${SEABED_Y + 50} L0 ${SEABED_Y + 50} Z`}
        fill="#101018" stroke="#18182a" strokeWidth="1.5"/>
      {/* rubble patches — irregular */}
      {[180, 328, 498, 662, 832, 1008, 1188].map((rx, i) => (
        <ellipse key={i}
          cx={ox + rx} cy={dY(md*(0.24 + i*0.07), md)}
          rx={26 + (i%4)*9} ry={10}
          fill={i%2 ? '#181828' : '#141422'} opacity="0.88"/>
      ))}
      {/* sea grass patches */}
      {[220, 420, 630, 840, 1050].map((gx, i) => {
        const gy = dY(md*(0.32 + i*0.07), md)
        return (
          <g key={i}>
            {[-14,-6,2,10,18,26].map(x2 => (
              <line key={x2} x1={ox+gx+x2} y1={gy}
                x2={ox+gx+x2+(i%2?3:-3)} y2={gy-22}
                stroke="#245818" strokeWidth="2.2" strokeLinecap="round" opacity="0.70"/>
            ))}
          </g>
        )
      })}
      {/* hydroid colonies */}
      {[360, 728, 1096].map((hx, i) => {
        const hy = dY(md*(0.40 + i*0.10), md)
        return (
          <g key={i}>
            {[-9,-2,5,12].map(x2 => (
              <g key={x2}>
                <line x1={ox+hx+x2} y1={hy} x2={ox+hx+x2} y2={hy-18}
                  stroke="#303048" strokeWidth="1.8"/>
                {[-4,0,4].map(tx => (
                  <line key={tx} x1={ox+hx+x2+tx} y1={hy-18}
                    x2={ox+hx+x2+tx+(tx>0?5:tx<0?-5:0)} y2={hy-27}
                    stroke="#404060" strokeWidth="1"/>
                ))}
              </g>
            ))}
          </g>
        )
      })}
    </g>
  )
}

// TEMPLATE 5: PINNACLE / SEAMOUNT
function TplPinnacle({ md }: { md:number }) {
  const cx = T.DEPTH_GUTTER + DRAW_W * 0.42
  const py = dY(md * 0.06, md)
  return (
    <g>
      <SandBottom opacity={0.20}/>
      {/* primary pinnacle */}
      <path d={`M${cx - 210} ${SEABED_Y}
                Q${cx - 110} ${py + 130} ${cx - 28} ${py + 32}
                Q${cx} ${py} ${cx + 28} ${py + 32}
                Q${cx + 110} ${py + 130} ${cx + 210} ${SEABED_Y} Z`}
        fill={T.C.terrainFill} stroke={T.C.terrainStroke} strokeWidth="2.5"/>
      {/* secondary pinnacle */}
      <path d={`M${cx + 250} ${SEABED_Y}
                Q${cx + 330} ${py + 230} ${cx + 412} ${py + 145}
                Q${cx + 478} ${py + 230} ${cx + 560} ${SEABED_Y} Z`}
        fill="#0c1c10" stroke="#162a18" strokeWidth="1.8" opacity="0.85"/>
      {/* coral on pinnacle */}
      {[-148,-60,60,148].map((ox, i) => {
        const cpy = dY(md*(0.17 + i*0.12), md)
        const cols = ['#206018','#5c2014','#163c2c','#402068']
        return <ellipse key={i} cx={cx+ox} cy={cpy} rx={24} ry={13}
          fill={cols[i%4]} opacity="0.92"/>
      })}
    </g>
  )
}

// TEMPLATE 6: DRIFT / CHANNEL
function TplDrift({ md }: { md:number }) {
  const ox = T.DEPTH_GUTTER
  return (
    <g>
      {/* left reef wall */}
      <path d={`M0 ${SURFACE_Y + 56}
                Q${ox+160} ${dY(md*0.28,md)} ${ox+370} ${dY(md*0.52,md)}
                Q${ox+490} ${dY(md*0.72,md)} ${ox+DRAW_W*0.42} ${SEABED_Y}
                L${T.DEPTH_GUTTER} ${SEABED_Y} Z`}
        fill={T.C.terrainFill} stroke={T.C.terrainStroke} strokeWidth="2.2"/>
      {/* right reef wall */}
      <path d={`M0 ${dY(md*0.14,md)}
                Q${ox+140} ${dY(md*0.34,md)} ${ox+320} ${dY(md*0.54,md)}
                Q${ox+460} ${SEABED_Y - 28} ${ox+650} ${SEABED_Y}`}
        fill="#0c1c10" stroke="#162a18" strokeWidth="1.6" opacity="0.78"/>
      {/* channel current — layered chevrons */}
      {[SURFACE_Y+80, SURFACE_Y+160, SURFACE_Y+240, SURFACE_Y+320].map((cy, ri) => (
        Array.from({length: 6}).map((_, i) => (
          <polyline key={`${ri}-${i}`}
            points={`${ox+60+i*210},${cy-14} ${ox+82+i*210},${cy} ${ox+60+i*210},${cy+14}`}
            fill="none" stroke={T.C.teal}
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            opacity={0.28 + ri * 0.08}/>
        ))
      ))}
      <SandBottom opacity={0.20}/>
    </g>
  )
}

// Template selector — maps site data to correct template
function Terrain({ site }: { site: DiveSite }) {
  const md = site.maxDepth
  const n  = site.name.toLowerCase()
  const isPinnacle = n.includes('pinnacle')||n.includes('magic')||n.includes('mount')||n.includes('blue magic')
  if (site.diagramType === 'wreck') return <TplWreck md={md}/>
  if (site.diagramType === 'wall')  return <TplWall  md={md}/>
  if (site.type === 'Muck')         return <TplMuck  md={md}/>
  if (site.type === 'Drift')        return <TplDrift md={md}/>
  if (isPinnacle)                   return <TplPinnacle md={md}/>
  return <TplReef md={md}/>
}

// ─────────────────────────────────────────────────────────────────────────
//  5. ROUTE SYSTEM
//  Each template has a matching route. Points are terrain-aware.
// ─────────────────────────────────────────────────────────────────────────

function DiveRouteLine({ pts, total }: { pts:[number,number][]; total:number }) {
  const d = pts.map(([x,y],i) => `${i===0?'M':'L'}${x} ${y}`).join(' ')
  return (
    <g>
      {/* route glow — increases legibility over terrain */}
      <path d={d} fill="none" stroke="rgba(255,255,255,0.12)"
        strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
      {/* route line */}
      <path d={d} fill="none" stroke={T.C.route}
        strokeWidth="3.5" strokeDasharray="16,9"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.94"/>
      {/* waypoints */}
      {pts.map(([x,y],i) => (
        <Waypoint key={i} x={x} y={y} n={i+1} isSS={i===total-1}/>
      ))}
      {/* safety stop badge */}
      <SafetyStopBadge x={pts[total-1][0]} y={pts[total-1][1]}/>
    </g>
  )
}

function getRoutePoints(site: DiveSite): [number,number][] {
  const { maxDepth:md, diagramType, type, access } = site
  const boat = access === 'Boat'
  const ox = T.DEPTH_GUTTER
  const ex = boat ? ox + 320 : ox + 140  // entry x

  if (diagramType === 'wreck') {
    const keel = dY(md*0.74,md), deck = dY(md*0.44,md)
    return [
      [ex,             SURFACE_Y+22],
      [ox + 240,       deck+18],
      [ox + 420,       (deck+keel)/2+8],
      [ox + 640,       keel-8],
      [ox + 860,       dY(md*0.20,md)],
    ]
  }
  if (diagramType === 'wall') return [
    [boat?ox+380:ox+240, SURFACE_Y+22],
    [ox + 270,           dY(md*0.26,md)],
    [ox + 292,           dY(md*0.54,md)],
    [ox + 314,           dY(md*0.84,md)],
    [ox + 580,           dY(md*0.18,md)],
  ]
  if (type === 'Muck') return [
    [ox + 220,  SURFACE_Y+22],
    [ox + 370,  dY(md*0.30,md)],
    [ox + 560,  dY(md*0.52,md)],
    [ox + 760,  dY(md*0.70,md)],
    [ox + 940,  dY(md*0.20,md)],
  ]
  // Reef / default
  return [
    [ex,         SURFACE_Y+22],
    [ox + 300,   dY(md*0.24,md)],
    [ox + 500,   dY(md*0.52,md)],
    [ox + 740,   dY(md*0.80,md)],
    [ox + 940,   dY(md*0.18,md)],
  ]
}

// ─────────────────────────────────────────────────────────────────────────
//  6. MARINE LIFE POSITIONING
//  Each template has its own placement grid — never random.
// ─────────────────────────────────────────────────────────────────────────

function getMLPositions(site: DiveSite): [number,number][] {
  const md = site.maxDepth
  const ox = T.DEPTH_GUTTER
  if (site.diagramType === 'wreck') return [
    [ox+880, dY(md*0.15,md)], [ox+940, dY(md*0.34,md)],
    [ox+870, dY(md*0.54,md)], [ox+950, dY(md*0.66,md)],
    [ox+880, dY(md*0.44,md)],
  ]
  if (site.diagramType === 'wall') return [
    [ox+390, dY(md*0.20,md)], [ox+440, dY(md*0.38,md)],
    [ox+480, dY(md*0.58,md)], [ox+420, dY(md*0.74,md)],
    [ox+700, dY(md*0.30,md)],
  ]
  if (site.type === 'Muck') return [
    [ox+560, dY(md*0.26,md)-52], [ox+754, dY(md*0.44,md)-52],
    [ox+900, dY(md*0.60,md)-52], [ox+660, dY(md*0.74,md)-52],
    [ox+440, dY(md*0.50,md)-52],
  ]
  return [
    [ox+980, dY(md*0.17,md)], [ox+860, dY(md*0.37,md)],
    [ox+1000,dY(md*0.55,md)], [ox+880, dY(md*0.70,md)],
    [ox+960, dY(md*0.27,md)],
  ]
}

// ─────────────────────────────────────────────────────────────────────────
//  7. DATA FUNCTIONS
//  Generate timeline, waypoints, tips from site data. No hardcoding.
// ─────────────────────────────────────────────────────────────────────────

type TLStep = { time:string; phase:string; sub:string }

function buildTimeline(site: DiveSite): TLStep[] {
  const { diagramType, type, access, maxDepth:md } = site
  const exit = access === 'Boat' ? 'By boat' : 'Shore exit'
  if (diagramType === 'wreck') return [
    {time:'0–5 min',  phase:'DESCEND',      sub:'Mooring line to wreck'},
    {time:'5–15 min', phase:'BOW',          sub:'Explore bow & take photos'},
    {time:'15–25 min',phase:'MID SHIP',     sub:'Engine room & cargo holds'},
    {time:'25–35 min',phase:'STERN',        sub:`Propeller · max ${md}m`},
    {time:'35–40 min',phase:'RETURN',       sub:'Sandy slope ascent'},
    {time:'40–48 min',phase:'SAFETY STOP',  sub:'5m · 3 minutes'},
    {time:'48–50 min',phase:'EXIT',         sub:exit},
  ]
  if (diagramType === 'wall') return [
    {time:'0–5 min',  phase:'DESCEND',      sub:'Entry & descent'},
    {time:'5–15 min', phase:'UPPER WALL',   sub:'Corals · fans · fish life'},
    {time:'15–25 min',phase:'MID WALL',     sub:`~${Math.round(md*.55)}m`},
    {time:'25–35 min',phase:'DEEP WALL',    sub:`Max ${md}m · turn`},
    {time:'35–42 min',phase:'ASCENT',       sub:'Return up wall'},
    {time:'42–48 min',phase:'SAFETY STOP',  sub:'5m · 3 minutes'},
    {time:'48–50 min',phase:'EXIT',         sub:exit},
  ]
  if (type === 'Muck') return [
    {time:'0–5 min',  phase:'ENTRY',        sub:'Slow controlled descent'},
    {time:'5–20 min', phase:'GRID SEARCH',  sub:'Sand zone systematic'},
    {time:'20–35 min',phase:'RUBBLE ZONE',  sub:'Macro critters & rare finds'},
    {time:'35–45 min',phase:'RETURN',       sub:'Retrace route slowly'},
    {time:'45–50 min',phase:'ASCENT',       sub:'Slow & controlled'},
    {time:'50–53 min',phase:'SAFETY STOP',  sub:'5m · 3 minutes'},
    {time:'53–55 min',phase:'EXIT',         sub:exit},
  ]
  return [
    {time:'0–5 min',  phase:'DESCEND',      sub:'Entry & descent'},
    {time:'5–15 min', phase:'SHALLOW REEF', sub:`~${Math.round(md*.25)}m`},
    {time:'15–25 min',phase:'MAIN REEF',    sub:`~${Math.round(md*.55)}m`},
    {time:'25–35 min',phase:'DEEP POINT',   sub:`Max ${md}m · turn`},
    {time:'35–42 min',phase:'RETURN',       sub:'Ascend reef slope'},
    {time:'42–48 min',phase:'SAFETY STOP',  sub:'5m · 3 minutes'},
    {time:'48–50 min',phase:'EXIT',         sub:exit},
  ]
}

function buildWaypoints(site: DiveSite): string[] {
  const { diagramType, type, access } = site
  const e = access === 'Boat' ? 'Boat entry & descent' : 'Shore entry & descend'
  if (diagramType === 'wreck') return [e,'Wreck bow — explore','Mid-ship · engine room','Stern · max depth','Safety stop · exit']
  if (diagramType === 'wall')  return [e,'Upper wall · corals','Mid-wall section','Max depth · turn','Safety stop · exit']
  if (type === 'Muck')         return ['Entry — slow descent','Sand zone · grid search','Rubble zone · critters','Return route','Safety stop · exit']
  return [e,'Shallow reef · photos','Main reef · highlights','Deep point · turn','Safety stop · exit']
}

type Tip = {icon:string; label:string; text:string}
function buildTips(site: DiveSite): Tip[] {
  const { diagramType, type, current, marineLife, area } = site
  const ml0 = marineLife[0]?.name ?? 'marine life'
  const strong = /strong|very/i.test(current)
  const t1: Tip = diagramType === 'wreck'
    ? {icon:'📷',label:'PHOTOGRAPHY',  text:'Wide-angle for the hull. Macro lens for critters on the sandy slope.'}
    : type === 'Muck'
    ? {icon:'🔍',label:'CRITTER TIP',  text:'Move at a crawl. Your divemaster spots. Never touch the substrate.'}
    : diagramType === 'wall'
    ? {icon:'🔭',label:'LOOK CLOSELY', text:'Check every sea fan for pygmy seahorses. Inspect crevices on ascent.'}
    : {icon:'🌅',label:'BEST TIMING',  text:`Morning for best visibility and active ${ml0}.`}
  return [
    t1,
    {icon:'👥',label:'FOLLOW GUIDE',   text:'Stay with your buddy. Follow the planned route at all times.'},
    {icon:'🚫',label:"DON'T TOUCH",    text:'Respect all reef and marine life. Hands off everything underwater.'},
    {icon:'🎯',label:'MONITOR AIR',    text:'Check pressure regularly. Signal guide at 100 bar. No limits.'},
    strong
      ? {icon:'⚠️',label:'CURRENT ALERT', text:`Carry SMB. Enter only at planned tide. Stay close to guide.`}
      : {icon:'❤️',label:'ENJOY THE DIVE',text:`One of ${area}'s most iconic dive experiences.`},
  ]
}

// ─────────────────────────────────────────────────────────────────────────
//  8. RIGHT PANEL — LEGEND + HAZARDS + WAYPOINTS + RATING
// ─────────────────────────────────────────────────────────────────────────

const LEGEND_ITEMS: [string, string, string][] = [
  ['╌', T.C.textPrimary, 'Route'],
  ['●', T.C.green,       'Safety Stop'],
  ['▲', T.C.blue,        'Pick Up / Exit'],
  ['▶', T.C.teal,        'Current'],
  ['█', T.C.yellow,      'Marine Life'],
  ['▲', T.C.red,         'Hazard'],
  ['📷',T.C.orange,      'Photo Opportunity'],
]

function RightPanel({ site, hazards, waypoints }: {
  site: DiveSite; hazards: string[]; waypoints: string[]
}) {
  const px = PANEL_X + T.S24
  const pw = T.PANEL_W - T.S48
  let cy = DIAGRAM_Y + T.S24

  // LEGEND card
  const legH = LEGEND_ITEMS.length * 28 + 52
  return (
    <g>
      {/* panel bg */}
      <rect x={PANEL_X} y={DIAGRAM_Y} width={T.PANEL_W} height={T.DIAGRAM_H}
        fill={T.C.bgPanel}/>
      <Div x1={PANEL_X} y1={DIAGRAM_Y} x2={PANEL_X} y2={DIAGRAM_Y+T.DIAGRAM_H}/>

      {/* LEGEND */}
      <Card x={px} y={cy} w={pw} h={legH}/>
      <SectionLabel x={px+T.S16} y={cy+T.S32}>LEGEND</SectionLabel>
      {LEGEND_ITEMS.map(([sym,col,lbl],i) => (
        <g key={i} transform={`translate(${px+T.S16},${cy+50+i*28})`}>
          <text fontSize="18" fill={col} fontWeight="700"
            fontFamily="'Inter',Arial,sans-serif">{sym}</text>
          <Txt x={40} y={1} size={T.F.body} fill={T.C.textSecondary}>{lbl}</Txt>
        </g>
      ))}
      {(cy += legH + T.S16) && null}

      {/* HAZARDS */}
      {hazards.length > 0 && (() => {
        const h = hazards.length * 52 + 52
        return (
          <g>
            <Card x={px} y={cy} w={pw} h={h} fill={T.C.bgRed} stroke={T.C.red}/>
            <SectionLabel x={px+T.S16} y={cy+T.S32}>SITE HAZARDS</SectionLabel>
            {hazards.map((hz,i) => (
              <g key={i} transform={`translate(${px+T.S16},${cy+50+i*52})`}>
                <polygon points="14,12 22,-10 30,12" fill="none"
                  stroke={T.C.red} strokeWidth="2" strokeLinejoin="round"/>
                <Txt x={14} y={6} size={10} fill={T.C.red} weight="800" anchor="middle">!</Txt>
                <Txt x={44} y={6} size={T.F.body} fill="#f47070" weight="500">
                  {hz.length>30?hz.slice(0,29)+'…':hz}
                </Txt>
              </g>
            ))}
            {(cy += h + T.S16) && null}
          </g>
        )
      })()}

      {/* WAYPOINTS */}
      {(() => {
        const h = waypoints.length * 46 + 52
        return (
          <g>
            <Card x={px} y={cy} w={pw} h={h}/>
            <SectionLabel x={px+T.S16} y={cy+T.S32}>ROUTE WAYPOINTS</SectionLabel>
            {waypoints.map((lbl,i) => (
              <g key={i} transform={`translate(${px+T.S16},${cy+50+i*46})`}>
                <circle cx={16} cy={-8} r={16}
                  fill={i===waypoints.length-1?T.C.green:T.C.bg}
                  stroke={T.C.textPrimary} strokeWidth="2.5"/>
                <Txt x={16} y={-2} size={13} fill={T.C.textPrimary} weight="800" anchor="middle">{i+1}</Txt>
                <Txt x={44} y={-2} size={T.F.body} fill={T.C.textSecondary}>{lbl}</Txt>
              </g>
            ))}
            {(cy += h + T.S16) && null}
          </g>
        )
      })()}

      {/* RATING */}
      {(() => {
        const ry = DIAGRAM_Y + T.DIAGRAM_H - 172
        return (
          <g>
            <Card x={px} y={ry} w={pw} h={152}/>
            <SectionLabel x={px+T.S16} y={ry+T.S32}>SITE RATING</SectionLabel>
            <Txt x={px+T.S16} y={ry+100} size={54} fill={T.C.yellow} weight="900">
              ★ {site.rating}
            </Txt>
            <Txt x={px+T.S16} y={ry+128} size={T.F.body} fill={T.C.textSecondary}>
              {site.reviews} verified diver reviews
            </Txt>
          </g>
        )
      })()}
    </g>
  )
}

// ─────────────────────────────────────────────────────────────────────────
//  9. MAIN RENDERER
// ─────────────────────────────────────────────────────────────────────────

export default function DiveBriefingCard({ site }: { site: DiveSite }) {
  const { maxDepth:md, minDepth, visibility, temp, difficulty, minCert,
          bestTime, bestSeason, type, access, current, name, area,
          marineLife, safetyNotes, rank, rating } = site

  const id       = site.slug.replace(/[^a-z0-9]/g, '-')
  const isBoat   = access === 'Boat'
  const hasStr   = /strong|very/i.test(current)
  const curStr   = hasStr ? 'strong' : /mild|weak/i.test(current) ? 'weak' : 'moderate'
  const dispName = name.length > 30 ? name.slice(0,28).toUpperCase() + '…' : name.toUpperCase()

  const routePts  = getRoutePoints(site)
  const mlPos     = getMLPositions(site)
  const ml        = marineLife.slice(0, 5)
  const hazards   = safetyNotes.slice(0, 3)
  const waypoints = buildWaypoints(site)
  const timeline  = buildTimeline(site)
  const tips      = buildTips(site)

  // Info card data — uses only site data, no invented values
  const infoCards: [string,string,string][] = [
    ['DIVE TYPE',    type,                    ''],
    ['DIFFICULTY',   difficulty,              ''],
    ['CERTIFICATION',minCert,                 ''],
    ['ACCESS',       access,                  ''],
    ['DEPTH',        `${minDepth}–${md}m`,    'depth range'],
    ['VISIBILITY',   visibility,              ''],
    ['WATER TEMP',   temp,                    ''],
    ['BEST TIME',    bestTime,                bestSeason],
  ]

  return (
    <svg viewBox={`0 0 ${T.W} ${T.H}`} xmlns="http://www.w3.org/2000/svg"
      style={{width:'100%',height:'auto',display:'block',borderRadius:14,
              fontFamily:"'Inter','Helvetica Neue',system-ui,Arial,sans-serif"}}>

      <defs>
        {/* Sky gradient */}
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor={T.C.sky0}/>
          <stop offset="100%" stopColor={T.C.sky1}/>
        </linearGradient>
        {/* Water gradient — darkens with depth */}
        <linearGradient id={`sea-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={T.C.water0} stopOpacity="0.68"/>
          <stop offset="40%"  stopColor={T.C.water1} stopOpacity="0.88"/>
          <stop offset="100%" stopColor={T.C.water2} stopOpacity="1.00"/>
        </linearGradient>
        {/* Header gradient */}
        <linearGradient id={`hdr-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#071a2c"/>
          <stop offset="100%" stopColor="#030e1c"/>
        </linearGradient>
      </defs>

      {/* ══════════════════════════════════════════════════════════════
          BASE
      ══════════════════════════════════════════════════════════════ */}
      <rect width={T.W} height={T.H} fill={T.C.bg} rx="14"/>

      {/* ══════════════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════════════ */}
      <rect x="0" y={HEADER_Y} width={T.W} height={T.HEADER_H}
        fill={`url(#hdr-${id})`} rx="14"/>
      {/* bottom fill to square off rx */}
      <rect x="0" y={T.HEADER_H - 14} width={T.W} height="14" fill="#030e1c"/>
      <Div x1={0} y1={T.HEADER_H} x2={T.W} y2={T.HEADER_H}/>

      {/* DIVE BRIEFING eyebrow */}
      <Txt x={T.S48} y={46} size={T.F.label} fill={T.C.orange} weight="800" spacing="3">
        DIVE BRIEFING
      </Txt>
      {/* Site name */}
      <Txt x={T.S48} y={106} size={T.F.hero} fill={T.C.textPrimary} weight="900" spacing="-1">
        {dispName}
      </Txt>
      {/* Breadcrumb */}
      <Txt x={T.S48 + 2} y={140} size={T.F.bodyLg} fill={T.C.textSecondary} spacing="0.3">
        {area}  ·  Indonesia
      </Txt>

      {/* Rank badge */}
      <Badge x={T.W - 560} y={30} w={186} fill={T.C.bgCard} stroke={T.C.textMuted}>
        <Txt x={T.W - 560 + 93} y={62} size={T.F.ui} fill={T.C.blue}
          weight="700" anchor="middle">#{rank} in {area}</Txt>
      </Badge>

      {/* Verified badge */}
      <Badge x={T.W - 362} y={30} w={310} fill={T.C.bgGreen} stroke={T.C.green}>
        <Txt x={T.W - 362 + 22} y={62} size={T.F.ui} fill={T.C.green} weight="700">
          ✓  Verified by local experts
        </Txt>
      </Badge>

      {/* Compass */}
      <Compass cx={T.W - 62} cy={T.HEADER_H / 2 + 8} r={48}/>

      {/* ══════════════════════════════════════════════════════════════
          DIAGRAM
      ══════════════════════════════════════════════════════════════ */}

      {/* Sky band */}
      <rect x="0" y={DIAGRAM_Y} width={PANEL_X} height={T.SKY_H}
        fill={`url(#sky-${id})`}/>

      {/* Water */}
      <rect x="0" y={SURFACE_Y} width={PANEL_X} height={DIAGRAM_Y+T.DIAGRAM_H-SURFACE_Y}
        fill={`url(#sea-${id})`}/>

      {/* Entry — boat or shore */}
      {isBoat ? (
        <g>
          <BoatIcon x={320} y={SURFACE_Y - 58} label="BOAT DROP"/>
          <BoatIcon x={960} y={SURFACE_Y - 58} label="PICK UP"/>
        </g>
      ) : (
        <ShoreEntry entry={access}/>
      )}

      {/* Surface line */}
      <SurfaceLine/>

      {/* Depth scale */}
      <DepthScale maxDepth={md}/>

      {/* Terrain template */}
      <Terrain site={site}/>

      {/* Dive route */}
      <DiveRouteLine pts={routePts} total={routePts.length}/>

      {/* Current indicator */}
      <Current
        x={isBoat ? DRAW_W * 0.36 + T.DEPTH_GUTTER : DRAW_W * 0.28 + T.DEPTH_GUTTER}
        y={SURFACE_Y + 56}
        strength={curStr as 'weak'|'moderate'|'strong'}/>

      {/* Marine life tags — depth-accurate positions */}
      {ml.map((m, i) => {
        const [mx, my] = mlPos[i] ?? mlPos[mlPos.length-1]
        const d1 = Math.round(md * (0.13 + i * 0.15))
        const d2 = Math.round(md * (0.28 + i * 0.15))
        return <MLTag key={i} x={mx} y={my} name={m.name} depth={`${d1}–${d2}m`}/>
      })}

      {/* Hazard tags — bottom of diagram */}
      {hazards.map((h, i) => {
        const hx = [T.DEPTH_GUTTER + 200, T.DEPTH_GUTTER + 600, T.DEPTH_GUTTER + 1000][i]
        return <HazardTag key={i} x={hx} y={SEABED_Y - 28 - i * 52} text={h}/>
      })}

      {/* Diagram bottom line */}
      <Div x1={0} y1={DIAGRAM_Y+T.DIAGRAM_H} x2={PANEL_X} y2={DIAGRAM_Y+T.DIAGRAM_H}/>

      {/* Right panel */}
      <RightPanel site={site} hazards={hazards} waypoints={waypoints}/>

      {/* ══════════════════════════════════════════════════════════════
          QUICK INFO CARDS
      ══════════════════════════════════════════════════════════════ */}
      <rect x="0" y={CARDS_Y} width={T.W} height={T.CARDS_H} fill={T.C.bgDark}/>
      <Div x1={0} y1={CARDS_Y} x2={T.W} y2={CARDS_Y}/>

      {infoCards.map(([label, value, sub], i) => {
        const cw = T.W / 8
        const cx = i * cw
        return (
          <g key={label}>
            {i > 0 && <Div x1={cx} y1={CARDS_Y+16} x2={cx} y2={CARDS_Y+T.CARDS_H-16}/>}
            <Txt x={cx + cw/2} y={CARDS_Y + 36} size={T.F.label}
              fill={T.C.textSecondary} weight="700" anchor="middle" spacing="1">
              {label}
            </Txt>
            <Txt x={cx + cw/2} y={CARDS_Y + 92} size={22}
              fill={T.C.textPrimary} weight="800" anchor="middle">
              {value}
            </Txt>
            {sub && (
              <Txt x={cx + cw/2} y={CARDS_Y + 116} size={T.F.caption}
                fill={T.C.textMuted} anchor="middle">{sub}</Txt>
            )}
          </g>
        )
      })}

      {/* ══════════════════════════════════════════════════════════════
          TIMELINE
      ══════════════════════════════════════════════════════════════ */}
      <rect x="0" y={TIMELINE_Y} width={T.W} height={T.TIMELINE_H} fill={T.C.bgPanel}/>
      <Div x1={0} y1={TIMELINE_Y} x2={T.W} y2={TIMELINE_Y}/>

      <SectionLabel x={T.S48} y={TIMELINE_Y + 40}>
        DIVE TIMELINE  ·  APPROX. 45–55 MINUTES
      </SectionLabel>

      {timeline.map((step, i) => {
        const cw  = (T.W - T.S48 * 2) / timeline.length
        const cx  = T.S48 + i * cw
        const isExit = i === timeline.length - 1
        return (
          <g key={i}>
            <Card x={cx} y={TIMELINE_Y + 56} w={cw - 10} h={T.TIMELINE_H - 72}
              fill={isExit ? T.C.bgGreen : T.C.bgCard}
              stroke={isExit ? T.C.green : T.C.textDivider}/>
            <Txt x={cx + (cw-10)/2} y={TIMELINE_Y + 84} size={T.F.caption}
              fill={isExit ? T.C.green : T.C.blue}
              weight="700" anchor="middle" spacing="0.5">{step.time}</Txt>
            <Txt x={cx + (cw-10)/2} y={TIMELINE_Y + 120} size={T.F.subhead}
              fill={T.C.textPrimary} weight="900" anchor="middle">{step.phase}</Txt>
            <Txt x={cx + (cw-10)/2} y={TIMELINE_Y + 150} size={T.F.caption}
              fill={T.C.textSecondary} anchor="middle">{step.sub}</Txt>
            {i < timeline.length - 1 && (
              <Txt x={cx + cw - 2} y={TIMELINE_Y + 126} size={28}
                fill={T.C.textMuted} anchor="middle">›</Txt>
            )}
          </g>
        )
      })}

      {/* ══════════════════════════════════════════════════════════════
          TIPS & SAFETY REMINDERS
      ══════════════════════════════════════════════════════════════ */}
      <rect x="0" y={TIPS_Y} width={T.W} height={T.TIPS_H} fill={T.C.bg}/>
      <Div x1={0} y1={TIPS_Y} x2={T.W} y2={TIPS_Y}/>
      <SectionLabel x={T.S48} y={TIPS_Y + 40}>DIVE TIPS  ·  SAFETY REMINDERS</SectionLabel>

      {tips.map((tip, i) => {
        const cw = T.W / tips.length
        const cx = i * cw
        const maxCharsPerLine = Math.floor((cw - 56) / (T.F.body * 0.58))
        // Build text lines manually (no foreignObject)
        const words = tip.text.split(' ')
        const lines: string[] = []
        let cur = ''
        for (const w of words) {
          if ((cur + ' ' + w).trim().length > maxCharsPerLine && cur) {
            lines.push(cur.trim()); cur = w
          } else {
            cur = (cur + ' ' + w).trim()
          }
        }
        if (cur) lines.push(cur)

        return (
          <g key={i}>
            {i > 0 && <Div x1={cx} y1={TIPS_Y+20} x2={cx} y2={TIPS_Y+T.TIPS_H-20}/>}
            {/* icon circle */}
            <circle cx={cx + 44} cy={TIPS_Y + 102} r={34}
              fill={T.C.bgCard} stroke={T.C.textDivider} strokeWidth="1.5"/>
            <text x={cx+44} y={TIPS_Y+116} fontSize="30" textAnchor="middle"
              fontFamily="'Inter',Arial,sans-serif">{tip.icon}</text>
            {/* label */}
            <Txt x={cx+90} y={TIPS_Y+94} size={T.F.body} fill={T.C.blue}
              weight="800" spacing="0.8">{tip.label}</Txt>
            {/* text lines */}
            {lines.map((line, li) => (
              <Txt key={li} x={cx+22} y={TIPS_Y+128+li*22} size={T.F.body} fill={T.C.textSecondary}>
                {line}
              </Txt>
            ))}
          </g>
        )
      })}

      {/* ══════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════ */}
      <rect x="0" y={FOOTER_Y} width={T.W} height={T.FOOTER_H} fill={T.C.bgDark}/>
      <Div x1={0} y1={FOOTER_Y} x2={T.W} y2={FOOTER_Y}/>
      <Txt x={T.S48} y={FOOTER_Y + 36} size={T.F.body} fill={T.C.textMuted}>
        dive-spots.com
      </Txt>
      <Txt x={T.W/2} y={FOOTER_Y+36} size={T.F.body} fill={T.C.textMuted} anchor="middle">
        Always follow your dive guide&apos;s briefing. Never dive beyond your certification level.
      </Txt>
      <Txt x={T.W - T.S48} y={FOOTER_Y+36} size={T.F.body} fill={T.C.textMuted} anchor="end">
        © 2026 Dive Spots
      </Txt>

    </svg>
  )
}
