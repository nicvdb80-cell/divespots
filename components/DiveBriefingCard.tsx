import React from 'react'
import { DiveSite, getTemplate, DiagramTemplate } from '@/lib/data'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DIVE SPOTS — OFFICIAL DIVE BRIEFING SYSTEM  v5.0
//  Architecture: Token → Primitive → Template → Renderer
//  9 distinct terrain templates, each visually unique.
//  Data-driven. No invented content. No duplicate-looking diagrams.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── DESIGN TOKENS ──────────────────────────────────────────────────────────
const W = 2048, H = 2048

// Layout heights — must sum to H
const HDR_H = 152, DGM_H = 1108, INF_H = 140, TML_H = 230, TIP_H = 362, FTR_H = 56
// Derived Y positions
const DGM_Y = HDR_H
const INF_Y = DGM_Y + DGM_H
const TML_Y = INF_Y + INF_H
const TIP_Y = TML_Y + TML_H
const FTR_Y = TIP_Y + TIP_H

// Diagram internals
const SKY_H  = 106          // above waterline
const SY     = DGM_Y + SKY_H   // surface y
const BY     = DGM_Y + DGM_H - 44  // seabed y
const PX     = 1508         // right panel left edge
const DW     = PX - 64      // drawable diagram width (excl depth gutter)
const GL     = 64           // gutter left (depth labels)

function dY(depth: number, max: number) {
  return SY + (depth / max) * (BY - SY)
}

const C = {
  bg:'#03101d', bgP:'#05162a', bgC:'#07192c', bgC2:'#091f36',
  bgDk:'#020c16', bgRd:'#1a0508', bgGn:'#041a0e',
  w0:'#14608a', w1:'#0b3a5c', w2:'#040e1c',
  s0:'#68b0d0', s1:'#98cce4',
  tex:'#ffffff', tex2:'#8aaab8', tex3:'#3d5a6e', div:'#101e2c',
  trF:'#0e2016', trS:'#163224', sand:'#b08838', sandL:'#c8a454',
  green:'#16c070', red:'#e53040', orange:'#f07020',
  yellow:'#f0c018', blue:'#2890d0', teal:'#00a8c0',
  route:'#ffffff',
}

// ── PRIMITIVES ─────────────────────────────────────────────────────────────
function Tx({ x,y,sz,fill=C.tex,w='400',a='start',ls='0',children }:{
  x:number;y:number;sz:number;fill?:string;w?:string;a?:string;ls?:string;children:React.ReactNode
}) {
  return <text x={x} y={y} fontSize={sz} fill={fill} fontWeight={w} textAnchor={a}
    letterSpacing={ls} fontFamily="'Inter','Helvetica Neue',system-ui,Arial,sans-serif">{children}</text>
}

function Ln({ x1,y1,x2,y2,color=C.div,width=1.2 }:{x1:number;y1:number;x2:number;y2:number;color?:string;width?:number}) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width}/>
}

// ── SYSTEM COMPONENTS ──────────────────────────────────────────────────────
function Compass({ cx, cy }:{cx:number;cy:number}) {
  const r = 50
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={C.bgC} stroke={C.tex3} strokeWidth="2"/>
      <circle cx={cx} cy={cy} r={r-10} fill="none" stroke={C.div} strokeWidth="1"/>
      {Array.from({length:12}).map((_,i)=>{
        const a=(i*30-90)*Math.PI/180, maj=i%3===0
        const r1=maj?r-20:r-14
        return <line key={i} x1={cx+Math.cos(a)*r1} y1={cy+Math.sin(a)*r1}
          x2={cx+Math.cos(a)*(r-6)} y2={cy+Math.sin(a)*(r-6)}
          stroke={C.tex3} strokeWidth={maj?2:1}/>
      })}
      {(['N','E','S','W'] as const).map((d,i)=>{
        const a=[-90,0,90,180][i]*Math.PI/180
        return <Tx key={d} x={cx+Math.cos(a)*27} y={cy+Math.sin(a)*27+5}
          sz={13} fill={d==='N'?C.orange:C.tex2} w={d==='N'?'800':'500'} a="middle">{d}</Tx>
      })}
      <polygon points={`${cx},${cy-r+18} ${cx+5},${cy+5} ${cx},${cy} ${cx-5},${cy+5}`} fill={C.tex}/>
      <polygon points={`${cx},${cy+r-18} ${cx+5},${cy-5} ${cx},${cy} ${cx-5},${cy-5}`} fill={C.tex3}/>
      <circle cx={cx} cy={cy} r={4} fill={C.bgC} stroke={C.tex} strokeWidth="1.5"/>
    </g>
  )
}

function BoatIcon({ x, y, label }:{x:number;y:number;label:string}) {
  return (
    <g>
      <path d={`M${x-58} ${y+4} Q${x-36} ${y-10} ${x} ${y-12} Q${x+36} ${y-10} ${x+58} ${y+4} Q${x+40} ${y+17} ${x-40} ${y+17} Z`}
        fill={C.tex2} stroke={C.tex3} strokeWidth="2"/>
      <rect x={x-18} y={y-36} width="36" height="24" rx="4" fill={C.tex3} stroke={C.div} strokeWidth="1.5"/>
      <line x1={x+2} y1={y-36} x2={x+2} y2={y-64} stroke={C.tex3} strokeWidth="2.5"/>
      <line x1={x-24} y1={y-52} x2={x+28} y2={y-52} stroke={C.tex3} strokeWidth="1.5"/>
      <rect x={x+2} y={y-66} width="22" height="14" rx="2" fill={C.red} opacity="0.9"/>
      <line x1={x+2} y1={y+17} x2={x-10} y2={SY} stroke={C.tex3} strokeWidth="1.5" strokeDasharray="5,4" opacity="0.55"/>
      <Tx x={x} y={y-88} sz={15} fill={C.tex2} w="700" a="middle" ls="1.5">{label}</Tx>
    </g>
  )
}

function ShoreEntry() {
  return (
    <g>
      <path d={`M0 ${DGM_Y} L0 ${SY-26} Q70 ${SY-42} 148 ${SY-20} Q195 ${SY-8} 240 ${SY} L0 ${SY} Z`}
        fill="#2d5228"/>
      <path d={`M0 ${SY-8} Q90 ${SY-18} 176 ${SY-6} Q210 ${SY-2} 242 ${SY}`}
        fill={C.sandL} opacity="0.7"/>
      <Tx x={120} y={SY-50} sz={15} fill={C.tex2} w="700" a="middle" ls="1.5">SHORE ENTRY</Tx>
    </g>
  )
}

function DepthScale({ max }:{max:number}) {
  const marks:number[]=[]
  for(let d=5;d<=max;d+=5) marks.push(d)
  return (
    <g>
      <Tx x={GL-8} y={SY-8} sz={13} fill={C.tex2} w="600" ls="0.8">SURFACE</Tx>
      <Ln x1={GL} y1={SY} x2={PX} y2={SY} color="#5ab8d8" width={1.8}/>
      {marks.map(d=>{
        const y=dY(d,max)
        if(y>BY+8) return null
        const isMax=d===max
        return (
          <g key={d}>
            <Ln x1={GL} y1={y} x2={PX} y2={y}
              color={isMax?C.red:C.div}
              width={isMax?2:0.8}/>
            <Tx x={GL-7} y={y+5} sz={13} fill={isMax?C.red:'#3a8cb8'} w={isMax?'700':'400'} a="end">{d}m</Tx>
            {isMax&&<>
              <rect x={GL+6} y={y-26} width={196} height={28} rx={5} fill={C.bgRd}/>
              <Tx x={GL+16} y={y-6} sz={15} fill={C.red} w="700" ls="0.3">MAX DEPTH  {d}m</Tx>
            </>}
          </g>
        )
      })}
    </g>
  )
}

function CurrentViz({ x, y, strength }:{x:number;y:number;strength:'weak'|'moderate'|'strong'}) {
  const cfg = {
    weak:     {n:2, col:'#4a9ab8', label:'MILD CURRENT',     dir:'West → East'},
    moderate: {n:3, col:C.teal,   label:'CURRENT',           dir:'West → East'},
    strong:   {n:5, col:C.blue,   label:'STRONG CURRENT',    dir:'West → East'},
  }[strength]
  const aw = 28  // arrow width
  return (
    <g>
      {/* right-pointing filled chevron arrows */}
      {Array.from({length:cfg.n}).map((_,i)=>(
        <polygon key={i}
          points={`${x+i*(aw+10)},${y-12} ${x+i*(aw+10)+aw},${y} ${x+i*(aw+10)},${y+12} ${x+i*(aw+10)+8},${y}`}
          fill={cfg.col} opacity={0.5+i*0.1}/>
      ))}
      <Tx x={x+cfg.n*(aw+10)+12} y={y+5} sz={16} fill={cfg.col} w="700" ls="1">{cfg.label}</Tx>
    </g>
  )
}

function Wp({ x, y, n, ss=false }:{x:number;y:number;n:number;ss?:boolean}) {
  return (
    <g>
      <circle cx={x} cy={y} r={25} fill="rgba(0,0,0,0.28)"/>
      <circle cx={x} cy={y} r={24} fill={ss?C.green:C.bg} stroke={ss?C.green:C.tex} strokeWidth="3.5"/>
      <Tx x={x} y={y+7} sz={19} fill={C.tex} w="800" a="middle">{n}</Tx>
    </g>
  )
}

function SSBadge({ x, y }:{x:number;y:number}) {
  // Badge sits above the waypoint circle — 24px radius + 12px gap = start at y-36
  return (
    <g>
      <rect x={x-100} y={y-98} width={200} height={48} rx={10} fill={C.green} opacity="0.97"/>
      <Tx x={x} y={y-73} sz={15} fill={C.tex} w="800" a="middle" ls="0.5">SAFETY STOP</Tx>
      <Tx x={x} y={y-55} sz={13} fill="rgba(255,255,255,0.72)" a="middle">5 metres  ·  3 minutes</Tx>
      {/* connector line from badge to circle */}
      <line x1={x} y1={y-50} x2={x} y2={y-26} stroke={C.green} strokeWidth="2" opacity="0.7"/>
    </g>
  )
}

function HazardTag({ x, y, text }:{x:number;y:number;text:string}) {
  const t=text.length>28?text.slice(0,27)+'…':text
  const w=t.length*10.2+54
  return (
    <g>
      <rect x={x} y={y-20} width={w} height={36} rx={6} fill={C.bgRd} stroke={C.red} strokeWidth="1.5"/>
      <polygon points={`${x+14},${y+10} ${x+22},${y-14} ${x+30},${y+10}`} fill="none" stroke={C.red} strokeWidth="2" strokeLinejoin="round"/>
      <Tx x={x+22} y={y+5} sz={10} fill={C.red} w="800" a="middle">!</Tx>
      <Tx x={x+42} y={y+4} sz={14} fill="#f47070" w="500">{t}</Tx>
    </g>
  )
}

function MLTag({ x, y, name, depth }:{x:number;y:number;name:string;depth:string}) {
  const label=name.length>22?name.slice(0,21)+'…':name
  const w=Math.max(label.length*10.4+24,180)
  return (
    <g>
      <rect x={x} y={y} width={w} height={38} rx={6} fill="rgba(3,16,29,0.9)" stroke={C.yellow} strokeWidth="1.5"/>
      <rect x={x} y={y} width={4} height={38} rx={2} fill={C.yellow}/>
      <Tx x={x+16} y={y+15} sz={14} fill={C.yellow} w="700">{label}</Tx>
      <Tx x={x+16} y={y+31} sz={12} fill={C.tex2}>{depth}</Tx>
    </g>
  )
}

// ── TERRAIN TEMPLATES — 9 DISTINCT TYPES ──────────────────────────────────

// Shared: sandy bottom band
function Sand({ opacity=0.2 }:{opacity?:number}) {
  return <path d={`M${GL} ${BY} Q${DW*0.35+GL} ${BY-24} ${DW*0.7+GL} ${BY-10} Q${DW*0.9+GL} ${BY} ${PX} ${BY} L${PX} ${BY+50} L${GL} ${BY+50} Z`}
    fill={C.sand} opacity={opacity}/>
}

// 1. WRECK — long hull silhouette, bow-to-stern
function TplWreck({ md }:{md:number}) {
  const keel=dY(md*0.73,md), deck=dY(md*0.43,md)
  const bow=GL+160, stern=GL+850, mid=(bow+stern)/2
  return (
    <g>
      <Sand/>
      {/* hull */}
      <path d={`M${bow} ${keel+10} Q${bow+90} ${keel+28} ${mid} ${keel+18} Q${stern-70} ${keel+22} ${stern} ${keel-2} L${stern-8} ${deck+18} Q${mid} ${deck-10} ${bow+30} ${deck+16} Z`}
        fill={C.trF} stroke={C.trS} strokeWidth="2.5"/>
      {/* superstructure */}
      <rect x={bow+106} y={deck-56} width={154} height={62} rx="6" fill="#0d1c12" stroke={C.trS} strokeWidth="2"/>
      <rect x={bow+136} y={deck-98} width={80} height={48} rx="5" fill="#0a1510" stroke={C.trS} strokeWidth="1.5"/>
      {/* mast */}
      <line x1={bow+175} y1={deck-98} x2={bow+179} y2={deck-154} stroke={C.trS} strokeWidth="4.5"/>
      <line x1={bow+108} y1={deck-132} x2={bow+256} y2={deck-132} stroke={C.trS} strokeWidth="2"/>
      {/* portholes */}
      {[bow+46,bow+216,bow+342,bow+474,bow+606,bow+734].map((px,i)=>(
        <circle key={i} cx={px} cy={(deck+keel)/2+5} r="9" fill="none" stroke={C.trS} strokeWidth="2"/>
      ))}
      {/* coral on hull */}
      {[bow+34,bow+148,bow+290,bow+452,bow+606,bow+748,stern-82].map((cx,i)=>(
        <ellipse key={i} cx={cx} cy={keel+5} rx={14+(i%4)*5} ry={12}
          fill={['#163816','#1e4a18','#163028','#1c4814','#163828','#1e4a18','#163816'][i%7]} opacity="0.9"/>
      ))}
      {/* anchor chain */}
      <path d={`M${bow+26} ${deck+14} Q${bow-46} ${dY(md*0.58,md)} ${bow-74} ${keel+12}`}
        fill="none" stroke={C.trS} strokeWidth="3" strokeDasharray="7,5"/>
    </g>
  )
}

// 2. WALL — vertical face with sea fans, drops to abyss
function TplWall({ md }:{md:number}) {
  const wx=GL+196
  return (
    <g>
      <Sand opacity={0.15}/>
      {/* wall body — organic face */}
      <path d={`M${wx-68} ${SY} Q${wx-16} ${dY(md*.10,md)} ${wx+16} ${dY(md*.22,md)} Q${wx-10} ${dY(md*.36,md)} ${wx+18} ${dY(md*.50,md)} Q${wx-8} ${dY(md*.65,md)} ${wx+14} ${dY(md*.78,md)} Q${wx+20} ${dY(md*.92,md)} ${wx+24} ${BY+50} L${wx-88} ${BY+50} L${wx-88} ${SY} Z`}
        fill={C.trF} stroke={C.trS} strokeWidth="2.2"/>
      {/* strata */}
      {[.16,.30,.46,.60,.74,.88].map((f,i)=>(
        <path key={i} d={`M${wx-68} ${dY(md*f,md)} Q${wx} ${dY(md*f,md)+(i%2?7:-7)} ${wx+18} ${dY(md*f,md)+(i%2?-4:4)}`}
          fill="none" stroke={C.trS} strokeWidth="1.2" opacity="0.8"/>
      ))}
      {/* sea fans */}
      {[{f:.14,xo:-74,col:C.orange,sz:90},{f:.30,xo:-48,col:'#9055cc',sz:68},{f:.48,xo:-100,col:'#e04040',sz:108},{f:.64,xo:-60,col:'#e89820',sz:80},{f:.80,xo:-86,col:'#38a0c0',sz:94}].map(({f,xo,col,sz},i)=>{
        const fy=dY(md*f,md)
        return (
          <g key={i}>
            <line x1={wx+18} y1={fy} x2={wx+18+xo*.44} y2={fy-sz*.52} stroke={col} strokeWidth="2.8" strokeLinecap="round" opacity="0.9"/>
            <ellipse cx={wx+18+xo*.78} cy={fy-sz*.68} rx={sz*.40} ry={sz*.24}
              fill="none" stroke={col} strokeWidth="1.8" opacity="0.6"
              transform={`rotate(${-14+i*8},${wx+18+xo*.78},${fy-sz*.68})`}/>
            <line x1={wx+18+xo*.28} y1={fy-sz*.28} x2={wx+18+xo*.90} y2={fy-sz*.54} stroke={col} strokeWidth="1.5" opacity="0.4"/>
          </g>
        )
      })}
      {/* black coral */}
      {[.36,.60,.82].map((f,i)=>{
        const fy=dY(md*f,md)
        return <g key={i}>
          <line x1={wx+16} y1={fy} x2={wx-36} y2={fy-54} stroke="#0e0e10" strokeWidth="3.5"/>
          <line x1={wx-10} y1={fy-22} x2={wx-48} y2={fy-46} stroke="#0e0e10" strokeWidth="2"/>
          <line x1={wx-24} y1={fy-38} x2={wx-54} y2={fy-60} stroke="#0e0e10" strokeWidth="1.5"/>
        </g>
      })}
    </g>
  )
}

// 3. CLEANING STATION — flat sandy plateau, coral bommies, open water above
function TplCleaningStation({ md }:{md:number}) {
  const plateauY=dY(md*0.38,md)
  const plateauW=700
  const plateauX=GL+280
  return (
    <g>
      {/* open sandy plateau */}
      <path d={`M${plateauX-40} ${plateauY} Q${plateauX+plateauW/2} ${plateauY-18} ${plateauX+plateauW+40} ${plateauY} L${plateauX+plateauW+40} ${plateauY+36} Q${plateauX+plateauW/2} ${plateauY+48} ${plateauX-40} ${plateauY+36} Z`}
        fill={C.trF} stroke={C.trS} strokeWidth="2"/>
      {/* rocky bommies on plateau — 3 cleaning stations */}
      {[plateauX+100, plateauX+360, plateauX+620].map((bx,i)=>(
        <g key={i}>
          <ellipse cx={bx} cy={plateauY} rx={55+i*10} ry={22} fill="#122a18" stroke={C.trS} strokeWidth="1.5"/>
          {/* soft coral on bommie */}
          {[-24,-8,8,24].map(ox=>(
            <line key={ox} x1={bx+ox} y1={plateauY} x2={bx+ox+ox/8} y2={plateauY-20}
              stroke={['#d0a0e0','#e0c878','#88c8e0'][i%3]} strokeWidth="2.8" strokeLinecap="round" opacity="0.72"/>
          ))}
        </g>
      ))}
      {/* deeper reef slope below the plateau */}
      <path d={`M${plateauX-40} ${plateauY+36} Q${plateauX+100} ${dY(md*0.6,md)} ${plateauX+260} ${dY(md*0.72,md)} Q${plateauX+440} ${dY(md*0.82,md)} ${plateauX+plateauW+40} ${dY(md*0.76,md)} L${plateauX+plateauW+40} ${BY+50} L${plateauX-40} ${BY+50} Z`}
        fill={C.trF} stroke={C.trS} strokeWidth="1.5" opacity="0.7"/>
      {/* sand patches */}
      <ellipse cx={plateauX+280} cy={BY-18} rx={220} ry={22} fill={C.sand} opacity="0.22"/>
      {/* down-current indicator */}
      {[plateauX+160, plateauX+320, plateauX+480].map((cx,i)=>(
        <g key={i}>
          <polyline points={`${cx},${SY+60} ${cx},${SY+80}`} stroke={C.teal} strokeWidth="2" strokeLinecap="round"/>
          <polyline points={`${cx-8},${SY+70} ${cx},${SY+82} ${cx+8},${SY+70}`} fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
      ))}
    </g>
  )
}

// 4. BAY / DROP-OFF — sheltered bay topography: shallow plateau then drop
function TplBayDropoff({ md }:{md:number}) {
  const shallowY=dY(md*0.20,md)
  const dropX=GL+520
  return (
    <g>
      {/* shallow bay plateau on left */}
      <path d={`M${GL+100} ${SY+20} Q${GL+220} ${shallowY-10} ${dropX-20} ${shallowY} L${dropX-20} ${BY+50} L${GL+100} ${BY+50} Z`}
        fill={C.trF} stroke={C.trS} strokeWidth="2"/>
      {/* sand on plateau */}
      <path d={`M${GL+100} ${shallowY} Q${dropX*0.5} ${shallowY+18} ${dropX-20} ${shallowY+10} L${dropX-20} ${shallowY+40} Q${dropX*0.5} ${shallowY+36} ${GL+100} ${shallowY+28} Z`}
        fill={C.sandL} opacity="0.28"/>
      {/* drop-off wall */}
      <path d={`M${dropX-20} ${shallowY} Q${dropX+10} ${dY(md*0.35,md)} ${dropX+18} ${dY(md*0.58,md)} Q${dropX+24} ${dY(md*0.78,md)} ${dropX+20} ${BY+50} L${dropX-20} ${BY+50} Z`}
        fill={C.trF} stroke={C.trS} strokeWidth="2.5"/>
      {/* coral on shallow plateau */}
      {[GL+160,GL+270,GL+380,GL+460].map((cx,i)=>(
        <ellipse key={i} cx={cx} cy={shallowY} rx={26+i*6} ry={12}
          fill={['#1e5a18','#5a2212','#163430','#402068'][i%4]} opacity="0.9"/>
      ))}
      {/* sea fans on drop-off */}
      {[.28,.50,.70,.86].map((f,i)=>{
        const fy=dY(md*f,md)
        return <g key={i}>
          <line x1={dropX+20} y1={fy} x2={dropX-30-i*18} y2={fy-52-i*10} stroke={[C.orange,'#9055cc',C.red,'#38a0c0'][i]} strokeWidth="2.5" opacity="0.85"/>
          <ellipse cx={dropX-40-i*18} cy={fy-62-i*10} rx={26+i*8} ry={16+i*4} fill="none" stroke={[C.orange,'#9055cc',C.red,'#38a0c0'][i]} strokeWidth="1.8" opacity="0.6"/>
        </g>
      })}
      {/* deeper sand */}
      <ellipse cx={dropX+300} cy={BY-16} rx={160} ry={18} fill={C.sand} opacity="0.2"/>
    </g>
  )
}

// 5. PINNACLE / SEAMOUNT — rises from depth, open water all around
function TplPinnacle({ md }:{md:number}) {
  const pcx=GL+DW*0.43, pcy=dY(md*0.07,md)
  return (
    <g>
      <Sand opacity="0.18"/>
      {/* primary pinnacle */}
      <path d={`M${pcx-220} ${BY} Q${pcx-118} ${pcy+140} ${pcx-28} ${pcy+30} Q${pcx} ${pcy} ${pcx+28} ${pcy+30} Q${pcx+118} ${pcy+140} ${pcx+220} ${BY} Z`}
        fill={C.trF} stroke={C.trS} strokeWidth="2.5"/>
      {/* secondary */}
      <path d={`M${pcx+258} ${BY} Q${pcx+336} ${pcy+240} ${pcx+420} ${pcy+148} Q${pcx+486} ${pcy+240} ${pcx+566} ${BY} Z`}
        fill="#0c1c10" stroke="#162a18" strokeWidth="1.8" opacity="0.84"/>
      {/* schooling fish near top */}
      {[-48,-24,0,24,48,-38,38,-56,56].map((ox,i)=>(
        <ellipse key={i} cx={pcx+ox} cy={pcy+50+i%3*22} rx={6} ry={3} fill={C.tex2} opacity={0.5+i%3*0.15} transform={`rotate(-20,${pcx+ox},${pcy+50+i%3*22})`}/>
      ))}
      {/* coral on pinnacle sides */}
      {[-156,-68,68,156].map((ox,i)=>{
        const cy2=dY(md*(0.18+i*0.12),md)
        return <ellipse key={i} cx={pcx+ox} cy={cy2} rx={24} ry={13}
          fill={['#1e5a18','#5a2012','#163c2c','#402068'][i%4]} opacity="0.92"/>
      })}
    </g>
  )
}

// 6. DRIFT / CHANNEL — channel walls, strong layered current arrows
function TplDrift({ md }:{md:number}) {
  return (
    <g>
      {/* left reef */}
      <path d={`M0 ${SY+58} Q${GL+160} ${dY(md*.28,md)} ${GL+380} ${dY(md*.52,md)} Q${GL+500} ${dY(md*.72,md)} ${GL+DW*0.42} ${BY} L${GL} ${BY} Z`}
        fill={C.trF} stroke={C.trS} strokeWidth="2.2"/>
      {/* right reef */}
      <path d={`M0 ${dY(md*.14,md)} Q${GL+140} ${dY(md*.34,md)} ${GL+330} ${dY(md*.54,md)} Q${GL+470} ${BY-28} ${GL+660} ${BY}`}
        fill="#0c1c10" stroke="#162a18" strokeWidth="1.6" opacity="0.78"/>
      {/* current — 4 rows of chevrons */}
      {[SY+80,SY+158,SY+238,SY+318].map((cy,ri)=>(
        Array.from({length:6}).map((_,i)=>(
          <polyline key={`${ri}-${i}`}
            points={`${GL+54+i*210},${cy-14} ${GL+76+i*210},${cy} ${GL+54+i*210},${cy+14}`}
            fill="none" stroke={C.teal} strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" opacity={0.28+ri*.08}/>
        ))
      ))}
      <Sand opacity="0.18"/>
    </g>
  )
}

// 7. MUCK — black sand slope, rubble, sea grass, hydroids
function TplMuck({ md }:{md:number}) {
  return (
    <g>
      {/* black sand */}
      <path d={`M0 ${SY+92} Q${GL+310} ${BY-108} ${GL+740} ${BY-52} Q${GL+1020} ${BY-18} ${PX} ${BY+10} L${PX} ${BY+50} L0 ${BY+50} Z`}
        fill="#101018" stroke="#18182a" strokeWidth="1.5"/>
      {/* rubble */}
      {[GL+178,GL+328,GL+498,GL+666,GL+838,GL+1012,GL+1192].map((rx,i)=>(
        <ellipse key={i} cx={rx} cy={dY(md*(.24+i*.07),md)} rx={28+(i%4)*9} ry={10} fill={i%2?'#181828':'#141422'} opacity="0.9"/>
      ))}
      {/* sea grass */}
      {[GL+220,GL+422,GL+632,GL+848,GL+1058].map((gx,i)=>{
        const gy=dY(md*(.32+i*.07),md)
        return <g key={i}>{[-14,-6,2,10,18,26].map(x2=>(
          <line key={x2} x1={gx+x2} y1={gy} x2={gx+x2+(i%2?3:-3)} y2={gy-22}
            stroke="#245818" strokeWidth="2.2" strokeLinecap="round" opacity="0.7"/>
        ))}</g>
      })}
      {/* hydroids */}
      {[GL+360,GL+728,GL+1096].map((hx,i)=>{
        const hy=dY(md*(.40+i*.10),md)
        return <g key={i}>{[-9,-2,5,12].map(x2=>(
          <g key={x2}>
            <line x1={hx+x2} y1={hy} x2={hx+x2} y2={hy-18} stroke="#303048" strokeWidth="1.8"/>
            {[-4,0,4].map(tx=>(
              <line key={tx} x1={hx+x2+tx} y1={hy-18} x2={hx+x2+tx+(tx>0?5:tx<0?-5:0)} y2={hy-27} stroke="#404060" strokeWidth="1"/>
            ))}
          </g>
        ))}</g>
      })}
    </g>
  )
}

// 8. JETTY — pilings from surface to seabed, flat sandy bottom
function TplJetty({ md }:{md:number}) {
  const pilings=[GL+160,GL+310,GL+460,GL+610,GL+760]
  return (
    <g>
      {/* flat sandy bottom */}
      <path d={`M0 ${BY} L${PX} ${BY} L${PX} ${BY+50} L0 ${BY+50} Z`} fill={C.sand} opacity="0.22"/>
      {/* jetty deck at surface */}
      <rect x={GL+100} y={SY-22} width={750} height={20} rx="3" fill={C.tex3} stroke={C.div} strokeWidth="1.5"/>
      <rect x={GL+98} y={SY-30} width={754} height={10} rx="3" fill={C.tex2} opacity="0.6"/>
      {/* pilings */}
      {pilings.map((px,i)=>(
        <g key={i}>
          <rect x={px-8} y={SY-24} width={16} height={BY-SY+24} rx="3" fill="#1a2a18" stroke={C.trS} strokeWidth="1.5"/>
          {/* barnacles/growth at waterline */}
          <ellipse cx={px} cy={SY+30} rx={14} ry={6} fill="#1e3a1c" opacity="0.9"/>
          {/* coral growth lower third */}
          <ellipse cx={px} cy={BY-120} rx={18} ry={8} fill="#1e4a1a" opacity="0.8"/>
          <ellipse cx={px} cy={BY-60} rx={22} ry={10} fill="#163c28" opacity="0.85"/>
        </g>
      ))}
      {/* rope between pilings */}
      {pilings.slice(0,-1).map((px,i)=>(
        <path key={i} d={`M${px+8} ${SY+8} Q${(px+pilings[i+1])/2} ${SY+24} ${pilings[i+1]-8} ${SY+8}`}
          fill="none" stroke={C.tex3} strokeWidth="2" opacity="0.5"/>
      ))}
      {/* rubble on sand */}
      {[GL+200,GL+380,GL+540,GL+700].map((rx,i)=>(
        <ellipse key={i} cx={rx} cy={BY-12} rx={20+i*5} ry={8} fill="#181828" opacity="0.7"/>
      ))}
    </g>
  )
}

// 9. REEF SLOPE — generic, varied coral density
function TplReefSlope({ md }:{md:number}) {
  return (
    <g>
      <Sand/>
      <path d={`M${GL+98} ${SY+34} Q${GL+238} ${SY+102} ${GL+420} ${dY(md*.36,md)} Q${GL+592} ${dY(md*.54,md)} ${GL+800} ${dY(md*.70,md)} Q${GL+980} ${dY(md*.80,md)} ${PX} ${BY} L${PX} ${BY+50} L${GL+98} ${BY+50} Z`}
        fill={C.trF} stroke={C.trS} strokeWidth="2.2" opacity="0.94"/>
      {[{x:GL+178,f:.10,r:34},{x:GL+294,f:.20,r:28},{x:GL+420,f:.31,r:38},{x:GL+542,f:.42,r:24},{x:GL+670,f:.52,r:30},{x:GL+802,f:.62,r:26},{x:GL+918,f:.70,r:20},{x:GL+1042,f:.75,r:28},{x:GL+1162,f:.78,r:22}].map(({x,f,r},i)=>{
        const cols=['#1e5a18','#5a2214','#143c2c','#401e70','#12385c','#482c10','#1e5a18','#2e1258','#12384a']
        return <ellipse key={i} cx={x} cy={dY(md*f,md)} rx={r} ry={r*.55} fill={cols[i%9]} opacity="0.92"/>
      })}
      {[GL+178,GL+360,GL+560,GL+760,GL+960].map((x,i)=>{
        const cy=dY(md*(.12+i*.10),md)
        const cols=['#c898dc','#e4cc7a','#80c0d8','#dc8888','#88d098']
        return <g key={i}>{[-16,-8,0,8,16].map(ox=>(
          <line key={ox} x1={x+ox} y1={cy} x2={x+ox+3} y2={cy-24} stroke={cols[i%5]} strokeWidth="2.8" strokeLinecap="round" opacity="0.68"/>
        ))}</g>
      })}
    </g>
  )
}

// Template selector
function Terrain({ template, md }:{template:DiagramTemplate;md:number}) {
  switch(template) {
    case 'wreck':            return <TplWreck md={md}/>
    case 'wall':             return <TplWall md={md}/>
    case 'cleaning-station': return <TplCleaningStation md={md}/>
    case 'bay-dropoff':      return <TplBayDropoff md={md}/>
    case 'pinnacle':         return <TplPinnacle md={md}/>
    case 'drift':            return <TplDrift md={md}/>
    case 'muck':             return <TplMuck md={md}/>
    case 'jetty':            return <TplJetty md={md}/>
    default:                 return <TplReefSlope md={md}/>
  }
}

// ── ROUTE SYSTEM ───────────────────────────────────────────────────────────
function DiveRoute({ pts }:{pts:[number,number][]}) {
  const n=pts.length
  const d=pts.map(([x,y],i)=>`${i===0?'M':'L'}${x} ${y}`).join(' ')
  return (
    <g>
      <path d={d} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
      <path d={d} fill="none" stroke={C.route} strokeWidth="3.5" strokeDasharray="16,9" strokeLinecap="round" strokeLinejoin="round" opacity="0.94"/>
      {pts.map(([x,y],i)=><Wp key={i} x={x} y={y} n={i+1} ss={i===n-1}/>)}
      <SSBadge x={pts[n-1][0]} y={pts[n-1][1]}/>
    </g>
  )
}

function getRoutePoints(template:DiagramTemplate, md:number, isBoat:boolean, ee?:EntryExit):[number,number][] {
  // Entry x — boat uses drop position, shore uses left edge
  const entryX = isBoat ? (ee?.boatDropX ?? GL+320) : GL+150
  // Safety stop / exit x:
  //   Shore dives → return to near shore (left side, 5m depth)
  //   Boat dives  → SMB ascent right side for pickup
  //   Drift       → exit right (current carried them there)
  const isDrift = template === 'drift'
  const ssX = isBoat
    ? (isDrift ? GL+DW-80 : GL+DW*0.62)  // boat: right side for pickup
    : GL+200                               // shore: back near entry/shore
  const ssY = dY(5, md)                   // safety stop always at 5m

  switch(template) {
    case 'wreck': {
      const keel=dY(md*.73,md), deck=dY(md*.43,md)
      // Waypoints sit just above/on the wreck structure, clearly on the hull
      const bowX   = GL+240
      const midX   = GL+460
      const sternX = GL+680
      const deckY  = deck + 8   // just below deck level = on the wreck
      const midY   = deck + (keel-deck)*0.45  // between deck and keel
      const sternY = deck + (keel-deck)*0.72  // deeper — near keel at stern
      const returnX= isBoat ? GL+DW*0.58 : GL+260
      return [
        [entryX,  SY+24],       // 1 entry (shore waterline or boat drop)
        [bowX,    deckY],        // 2 bow — on deck
        [midX,    midY],         // 3 midship engine room — mid hull
        [sternX,  sternY],       // 4 stern propeller — deep
        [returnX, dY(8,md)],     // 5 ascend sandy slope (between entry and stern)
        [ssX,     ssY],          // 6 safety stop at 5m near shore/pickup
      ]
    }
    case 'wall': {
      // Wall face is at x≈GL+196. Route descends along wall, ascends same wall.
      const wallX = GL+260  // just in front of wall face
      return [
        [entryX,   SY+24],           // 1 entry / descent at wall top
        [wallX,    dY(md*.25,md)],   // 2 upper wall section
        [wallX+24, dY(md*.52,md)],   // 3 mid wall
        [wallX+36, dY(md*.84,md)],   // 4 max depth — turn point
        [wallX,    dY(md*.25,md)],   // 5 ascend back up wall (same path)
        [ssX,      ssY],             // 6 safety stop at wall top / pickup
      ]
    }
    case 'cleaning-station': {
      // Circuit: entry → station 1 → station 2 → station 3 → return to entry side → SS
      const pY=dY(md*.38,md)
      return [
        [entryX,    SY+24],    // 1 entry
        [GL+380,    pY-16],    // 2 station 1
        [GL+610,    pY-12],    // 3 station 2 (main)
        [GL+860,    pY-16],    // 4 station 3
        [GL+440,    pY-8],     // 5 return across plateau
        [ssX,       ssY],      // 6 safety stop
      ]
    }
    case 'bay-dropoff': {
      // Shallow plateau → drop-off edge → deep point → back across plateau → SS
      const shY=dY(md*.20,md), dropX=GL+520
      return [
        [entryX,      SY+24],              // 1 entry
        [GL+300,      shY+10],             // 2 shallow plateau
        [dropX+20,    dY(md*.38,md)],      // 3 drop-off edge
        [dropX+60,    dY(md*.76,md)],      // 4 max depth
        [GL+320,      dY(md*.22,md)],      // 5 return across plateau
        [ssX,         ssY],                // 6 safety stop
      ]
    }
    case 'pinnacle': {
      // Descend → top → circuit → deep side → ascend → SS
      const pcx=GL+DW*.43, pcy=dY(md*.07,md)
      const circX = isBoat ? GL+DW*0.62 : GL+DW*0.45
      return [
        [entryX,     SY+24],          // 1 entry
        [pcx,        pcy+28],         // 2 pinnacle top
        [pcx+160,    dY(md*.32,md)],  // 3 circuit one side
        [pcx+220,    dY(md*.64,md)],  // 4 deep side / pelagics
        [circX,      dY(md*.22,md)],  // 5 return / ascent
        [ssX,        ssY],            // 6 safety stop
      ]
    }
    case 'drift':
      // Always left→right, no return — exit is where current took you
      return [
        [GL+220,       SY+24],          // 1 entry (upcurrent)
        [GL+400,       dY(md*.28,md)],  // 2 drift 1
        [GL+580,       dY(md*.50,md)],  // 3 drift 2
        [GL+800,       dY(md*.68,md)],  // 4 deepest drift
        [GL+DW-80,     dY(md*.22,md)],  // 5 peel off / ascent
        [GL+DW-40,     ssY],            // 6 SMB / surface pickup
      ]
    case 'muck': {
      const farX = isBoat ? GL+800 : GL+760
      return [
        [entryX,  SY+24],           // 1 entry
        [GL+360,  dY(md*.28,md)],   // 2 zone 1
        [GL+560,  dY(md*.50,md)],   // 3 zone 2
        [farX,    dY(md*.70,md)],   // 4 deepest / turn
        [GL+320,  dY(md*.30,md)],   // 5 return route — back toward entry
        [ssX,     ssY],             // 6 safety stop near shore
      ]
    }
    case 'jetty': {
      // Along pilings and back
      const p=[GL+160,GL+310,GL+460,GL+610,GL+760]
      return [
        [p[0],   SY+24],           // 1 entry under jetty
        [p[1],   dY(md*.30,md)],   // 2 pilings
        [p[2],   dY(md*.55,md)],   // 3 sand bottom
        [p[3],   dY(md*.72,md)],   // 4 rubble zone
        [p[1],   dY(md*.28,md)],   // 5 return toward entry
        [ssX,    ssY],             // 6 safety stop
      ]
    }
    default: {
      // Reef slope: descend → explore → deep point → RETURN up slope → SS
      // Return (5) must be clearly left of deep point (4) to show direction change
      return [
        [entryX,  SY+24],           // 1 entry
        [GL+310,  dY(md*.22,md)],   // 2 shallow reef
        [GL+530,  dY(md*.50,md)],   // 3 main reef
        [GL+760,  dY(md*.78,md)],   // 4 deep point / turn
        [GL+340,  dY(md*.25,md)],   // 5 return up slope (left = shallower)
        [ssX,     ssY],             // 6 safety stop near shore
      ]
    }
  }
}

// ML tag positions — per template, never overlapping route
function getMLPositions(template:DiagramTemplate, md:number):[number,number][] {
  switch(template) {
    case 'wreck':
      // ML tags on right of diagram — route now returns left so these don't overlap
      return [[GL+900,dY(md*.14,md)],[GL+950,dY(md*.32,md)],[GL+890,dY(md*.52,md)],[GL+960,dY(md*.65,md)],[GL+910,dY(md*.42,md)]]
    case 'wall':
      // ML tags to right of wall route (route stays left side of diagram)
      return [[GL+440,dY(md*.18,md)],[GL+490,dY(md*.36,md)],[GL+520,dY(md*.56,md)],[GL+460,dY(md*.72,md)],[GL+730,dY(md*.28,md)]]
    case 'cleaning-station':
      // ML tags above and below the plateau, away from the circuit route
      return [[GL+220,dY(md*.14,md)],[GL+1080,dY(md*.28,md)],[GL+240,dY(md*.50,md)],[GL+1040,dY(md*.42,md)],[GL+260,dY(md*.36,md)]]
    case 'bay-dropoff':
      // ML tags on shallow plateau (left) and deeper right — away from return route at GL+320
      return [[GL+180,dY(md*.12,md)],[GL+640,dY(md*.33,md)],[GL+700,dY(md*.54,md)],[GL+660,dY(md*.70,md)],[GL+180,dY(md*.28,md)]]
    case 'pinnacle':
      // ML tags in open water to the right of the pinnacle
      return [[GL+DW*.43+260,dY(md*.08,md)],[GL+DW*.43+290,dY(md*.28,md)],[GL+DW*.43+270,dY(md*.50,md)],[GL+DW*.43+250,dY(md*.66,md)],[GL+DW*.43-360,dY(md*.20,md)]]
    case 'drift':
      // ML tags below the drift route
      return [[GL+880,dY(md*.20,md)],[GL+840,dY(md*.40,md)],[GL+900,dY(md*.58,md)],[GL+860,dY(md*.72,md)],[GL+820,dY(md*.30,md)]]
    case 'muck':
      // ML tags above the muck route (route is lower on the slope)
      return [[GL+540,dY(md*.24,md)-52],[GL+740,dY(md*.42,md)-52],[GL+880,dY(md*.58,md)-52],[GL+640,dY(md*.72,md)-52],[GL+420,dY(md*.48,md)-52]]
    case 'jetty':
      // ML tags in open water to right of jetty pilings
      return [[GL+860,dY(md*.18,md)],[GL+880,dY(md*.38,md)],[GL+840,dY(md*.56,md)],[GL+900,dY(md*.70,md)],[GL+820,dY(md*.28,md)]]
    default:
      // Reef slope: ML tags on right side — return route goes up the left/middle
      return [[GL+980,dY(md*.15,md)],[GL+860,dY(md*.35,md)],[GL+1000,dY(md*.53,md)],[GL+880,dY(md*.68,md)],[GL+960,dY(md*.25,md)]]
  }
}

// ── TIMELINE / WAYPOINTS / TIPS ────────────────────────────────────────────
type TLStep={time:string;phase:string;sub:string}
function buildTimeline(template:DiagramTemplate, md:number, isBoat:boolean):TLStep[] {
  const exit=isBoat?'By boat':'Shore exit'
  switch(template) {
    case 'wreck': return [
      {time:'0–5 min',phase:'DESCEND',sub:'Mooring line to wreck'},
      {time:'5–15 min',phase:'BOW',sub:'Explore bow & take photos'},
      {time:'15–25 min',phase:'MID SHIP',sub:'Engine room & cargo'},
      {time:'25–35 min',phase:'STERN',sub:`Propeller · max ${md}m`},
      {time:'35–40 min',phase:'RETURN',sub:'Sandy slope ascent'},
      {time:'40–48 min',phase:'SAFETY STOP',sub:'5m · 3 minutes'},
      {time:'48–50 min',phase:'EXIT',sub:exit},
    ]
    case 'wall': return [
      {time:'0–5 min',phase:'DESCEND',sub:'Entry & descent'},
      {time:'5–15 min',phase:'UPPER WALL',sub:'Corals · fans · fish life'},
      {time:'15–25 min',phase:'MID WALL',sub:`~${Math.round(md*.55)}m`},
      {time:'25–35 min',phase:'DEEP WALL',sub:`Max ${md}m · turn`},
      {time:'35–42 min',phase:'ASCENT',sub:'Return up wall'},
      {time:'42–48 min',phase:'SAFETY STOP',sub:'5m · 3 minutes'},
      {time:'48–50 min',phase:'EXIT',sub:exit},
    ]
    case 'cleaning-station': return [
      {time:'0–5 min',phase:'DESCEND',sub:'Descend to plateau'},
      {time:'5–20 min',phase:'STATION 1',sub:'First cleaning rock'},
      {time:'20–35 min',phase:'STATION 2',sub:'Main cleaning station'},
      {time:'35–40 min',phase:'STATION 3',sub:'Third station · turn'},
      {time:'40–45 min',phase:'ASCENT',sub:'Slow ascent'},
      {time:'45–48 min',phase:'SAFETY STOP',sub:'5m · 3 minutes'},
      {time:'48–50 min',phase:'EXIT',sub:exit},
    ]
    case 'bay-dropoff': return [
      {time:'0–5 min',phase:'DESCEND',sub:'Shallow bay plateau'},
      {time:'5–15 min',phase:'PLATEAU',sub:`~${Math.round(md*.20)}m · explore`},
      {time:'15–25 min',phase:'DROP-OFF',sub:'Wall / slope edge'},
      {time:'25–35 min',phase:'DEEP POINT',sub:`Max ${md}m · turn`},
      {time:'35–42 min',phase:'RETURN',sub:'Back across plateau'},
      {time:'42–48 min',phase:'SAFETY STOP',sub:'5m · 3 minutes'},
      {time:'48–50 min',phase:'EXIT',sub:exit},
    ]
    case 'pinnacle': return [
      {time:'0–5 min',phase:'DESCEND',sub:'Drop to pinnacle top'},
      {time:'5–15 min',phase:'PEAK',sub:'Top of pinnacle · fish life'},
      {time:'15–28 min',phase:'CIRCUIT',sub:'Circle the pinnacle'},
      {time:'28–36 min',phase:'DEEP SIDE',sub:`Max ${md}m · pelagics`},
      {time:'36–44 min',phase:'ASCENT',sub:'Return to blue water'},
      {time:'44–48 min',phase:'SAFETY STOP',sub:'5m · 3 minutes'},
      {time:'48–50 min',phase:'EXIT',sub:exit},
    ]
    case 'drift': return [
      {time:'0–5 min',phase:'ENTRY',sub:'Drop upcurrent'},
      {time:'5–18 min',phase:'DRIFT 1',sub:'Follow reef · left side'},
      {time:'18–30 min',phase:'DRIFT 2',sub:`~${Math.round(md*.55)}m · fish life`},
      {time:'30–40 min',phase:'DEEP DRIFT',sub:`Max ${md}m section`},
      {time:'40–45 min',phase:'ASCENT',sub:'Peel off current'},
      {time:'45–48 min',phase:'SAFETY STOP',sub:'5m · 3 minutes'},
      {time:'48–50 min',phase:'PICK UP',sub:'SMB · boat collects'},
    ]
    case 'muck': return [
      {time:'0–5 min',phase:'ENTRY',sub:'Slow controlled descent'},
      {time:'5–20 min',phase:'GRID SEARCH',sub:'Sand zone · systematic'},
      {time:'20–35 min',phase:'RUBBLE ZONE',sub:'Macro critters & finds'},
      {time:'35–45 min',phase:'RETURN',sub:'Retrace route slowly'},
      {time:'45–50 min',phase:'ASCENT',sub:'Slow & controlled'},
      {time:'50–53 min',phase:'SAFETY STOP',sub:'5m · 3 minutes'},
      {time:'53–55 min',phase:'EXIT',sub:exit},
    ]
    case 'jetty': return [
      {time:'0–5 min',phase:'ENTRY',sub:'Under jetty pilings'},
      {time:'5–15 min',phase:'PILINGS',sub:'Search each piling'},
      {time:'15–28 min',phase:'SAND',sub:'Search sandy bottom'},
      {time:'28–38 min',phase:'RUBBLE',sub:'Debris zone critters'},
      {time:'38–44 min',phase:'RETURN',sub:'Back toward entry'},
      {time:'44–48 min',phase:'SAFETY STOP',sub:'5m · 3 minutes'},
      {time:'48–50 min',phase:'EXIT',sub:exit},
    ]
    default: return [
      {time:'0–5 min',phase:'DESCEND',sub:'Entry & descent'},
      {time:'5–15 min',phase:'SHALLOW REEF',sub:`~${Math.round(md*.25)}m`},
      {time:'15–25 min',phase:'MAIN REEF',sub:`~${Math.round(md*.55)}m`},
      {time:'25–35 min',phase:'DEEP POINT',sub:`Max ${md}m · turn`},
      {time:'35–42 min',phase:'RETURN',sub:'Ascend reef slope'},
      {time:'42–48 min',phase:'SAFETY STOP',sub:'5m · 3 minutes'},
      {time:'48–50 min',phase:'EXIT',sub:exit},
    ]
  }
}

function buildWaypoints(template:DiagramTemplate, isBoat:boolean):string[] {
  const entry = isBoat ? 'Boat entry & descent' : 'Shore entry & descend'
  const exit  = isBoat ? 'Safety stop · SMB pickup' : 'Safety stop · shore exit'
  switch(template) {
    case 'wreck':   return [entry,'Wreck bow — explore','Mid-ship · engine room','Stern · max depth','Ascend sandy slope',exit]
    case 'wall':    return [entry,'Upper wall · corals & fans','Mid-wall section','Max depth · turn point','Ascend wall',exit]
    case 'cleaning-station': return [entry,'Cleaning station 1','Main station · hover','Station 3 · turn','Return across plateau',exit]
    case 'bay-dropoff': return [entry,'Shallow plateau · explore','Drop-off edge','Max depth · turn','Return across plateau',exit]
    case 'pinnacle': return [entry,'Pinnacle top · fish life','Circuit — one side','Deep side · pelagics','Ascent to blue water',exit]
    case 'drift':   return ['Entry upcurrent','Drift zone 1','Drift zone 2','Deepest section','Peel off · ascent','SMB surface · boat collects']
    case 'muck':    return [entry,'Sand zone 1 · search','Zone 2 · rubble & critters','Deepest point · turn','Return route · search again',exit]
    case 'jetty':   return ['Enter under jetty','Pilings · search','Sandy bottom zone','Rubble zone · deepest','Return toward entry',exit]
    default:        return [entry,'Shallow reef · photos','Main reef · highlights','Deep point · turn','Return up slope',exit]
  }
}

type Tip={icon:string;label:string;text:string}
function buildTips(template:DiagramTemplate, site:DiveSite):Tip[] {
  const ml0=site.marineLife[0]?.name??'marine life'
  const strong=/strong|very/i.test(site.current)
  const t1:Tip = {
    'wreck':            {icon:'📷',label:'PHOTOGRAPHY',   text:`Wide-angle for the hull. Macro for critters on the sandy slope.`},
    'wall':             {icon:'🔭',label:'LOOK CLOSELY',  text:`Check every sea fan for pygmy seahorses. Inspect crevices on ascent.`},
    'cleaning-station': {icon:'🤿',label:'MANTA ETIQUETTE',text:'Hover low and still. Never position above. No touching. No chasing.'},
    'bay-dropoff':      {icon:'🌊',label:'WATCH CURRENT', text:`Downcurrent possible at the drop-off edge. Stay close to the reef.`},
    'pinnacle':         {icon:'🦈',label:'SCAN THE BLUE', text:`Look into open water regularly for pelagics approaching the pinnacle.`},
    'drift':            {icon:'💨',label:'DRIFT TIPS',    text:'Enter upcurrent. Maintain depth. SMB ready for pick-up.'},
    'muck':             {icon:'🔍',label:'CRITTER TIP',   text:'Move at a crawl. Your divemaster spots first. Never touch the substrate.'},
    'jetty':            {icon:'🌙',label:'NIGHT DIVING',  text:'Jetty dives are spectacular at night. Torch and backup light essential.'},
  }[template] ?? {icon:'🌅',label:'BEST TIMING',text:`Morning for best visibility and active ${ml0}.`}
  return [
    t1,
    {icon:'👥',label:'FOLLOW GUIDE',    text:'Stay with your buddy. Follow the planned route at all times.'},
    {icon:'🚫',label:"DON'T TOUCH",     text:'Respect all reef, wreck, and marine life. Hands off everything.'},
    {icon:'🎯',label:'MONITOR AIR',     text:'Check pressure at every waypoint. Signal guide at 100 bar.'},
    strong
      ? {icon:'⚠️',label:'CURRENT ALERT',text:`Carry SMB. Enter at planned tide only. Stay close to guide.`}
      : {icon:'❤️',label:'ENJOY THE DIVE',text:`One of ${site.area}'s most iconic dive experiences.`},
  ]
}

// ── RIGHT PANEL ──────────────────────────────────────────────────────────
const LEGEND=[
  ['╌',C.tex,  'Route'],
  ['●',C.green,'Safety Stop'],
  ['▲',C.blue, 'Pick Up / Exit'],
  ['▶',C.teal, 'Current'],
  ['█',C.yellow,'Marine Life'],
  ['▲',C.red,  'Hazard'],
  ['📷',C.orange,'Photo Spot'],
] as [string,string,string][]

function RightPanel({site,hazards,waypoints}:{site:DiveSite;hazards:string[];waypoints:string[]}) {
  const px=PX+22, pw=W-PX-44
  let cy=DGM_Y+22

  const legH=LEGEND.length*28+52
  const hazH=hazards.length?hazards.length*52+52:0
  const wptH=waypoints.length*46+52

  return (
    <g>
      <rect x={PX} y={DGM_Y} width={W-PX} height={DGM_H} fill={C.bgP}/>
      <Ln x1={PX} y1={DGM_Y} x2={PX} y2={DGM_Y+DGM_H}/>

      {/* LEGEND */}
      <rect x={px} y={cy} width={pw} height={legH} rx={10} fill={C.bgC} stroke={C.div} strokeWidth="1.2"/>
      <Tx x={px+16} y={cy+32} sz={12} fill={C.tex2} w="700" ls="2.5">LEGEND</Tx>
      {LEGEND.map(([sym,col,lbl],i)=>(
        <g key={i} transform={`translate(${px+16},${cy+50+i*28})`}>
          <text fontSize="18" fill={col} fontWeight="700" fontFamily="'Inter',Arial,sans-serif">{sym}</text>
          <Tx x={40} y={1} sz={14} fill={C.tex2}>{lbl}</Tx>
        </g>
      ))}
      {(cy+=legH+16)}

      {/* HAZARDS */}
      {hazards.length>0&&<>
        <rect x={px} y={cy} width={pw} height={hazH} rx={10} fill={C.bgRd} stroke={C.red} strokeWidth="1.5"/>
        <Tx x={px+16} y={cy+32} sz={12} fill={C.red} w="700" ls="2.5">SITE HAZARDS</Tx>
        {hazards.map((h,i)=>(
          <g key={i} transform={`translate(${px+16},${cy+50+i*52})`}>
            <polygon points="14,12 22,-10 30,12" fill="none" stroke={C.red} strokeWidth="2" strokeLinejoin="round"/>
            <Tx x={14} y={6} sz={10} fill={C.red} w="800" a="middle">!</Tx>
            <Tx x={44} y={6} sz={14} fill="#f47070" w="500">{h.length>30?h.slice(0,29)+'…':h}</Tx>
          </g>
        ))}
        {(cy+=hazH+16)}
      </>}

      {/* WAYPOINTS */}
      <rect x={px} y={cy} width={pw} height={wptH} rx={10} fill={C.bgC} stroke={C.div} strokeWidth="1.2"/>
      <Tx x={px+16} y={cy+32} sz={12} fill={C.tex2} w="700" ls="2.5">ROUTE WAYPOINTS</Tx>
      {waypoints.map((lbl,i)=>(
        <g key={i} transform={`translate(${px+16},${cy+50+i*46})`}>
          <circle cx={16} cy={-8} r={16} fill={i===waypoints.length-1?C.green:C.bg} stroke={C.tex} strokeWidth="2.5"/>
          <Tx x={16} y={-2} sz={13} fill={C.tex} w="800" a="middle">{i+1}</Tx>
          <Tx x={44} y={-2} sz={14} fill={C.tex2}>{lbl}</Tx>
        </g>
      ))}
      {(cy+=wptH+16)}

      {/* RATING */}
      <rect x={px} y={DGM_Y+DGM_H-172} width={pw} height={152} rx={10} fill={C.bgC} stroke={C.div} strokeWidth="1.2"/>
      <Tx x={px+16} y={DGM_Y+DGM_H-140} sz={12} fill={C.tex2} w="700" ls="2.5">SITE RATING</Tx>
      <Tx x={px+16} y={DGM_Y+DGM_H-76} sz={54} fill={C.yellow} w="900">★ {site.rating}</Tx>
      <Tx x={px+16} y={DGM_Y+DGM_H-44} sz={14} fill={C.tex2}>{site.reviews} verified diver reviews</Tx>
    </g>
  )
}

// ── MAIN RENDERER ──────────────────────────────────────────────────────────
// ── ENTRY / EXIT CLASSIFIER ──────────────────────────────────────────────
// Reads the actual site data — not just access:'Boat'|'Shore'
// Returns structured entry/exit info used by the renderer.
type EntryExit = {
  entryType: 'boat'|'shore-sand'|'shore-pebble'|'shore-black-sand'|'jetty'
  exitType:  'boat-pickup'|'shore-same'|'shore-drift-end'|'smb-open-water'
  boatDropX: number   // x position of boat drop (if boat entry)
  pickupX:   number   // x position of pickup boat (if boat exit)
  entryLabel: string
  exitLabel:  string
}

function classifyEntryExit(site: DiveSite, template: DiagramTemplate): EntryExit {
  const { access, diagramType, type, description, name } = site
  const desc = description.toLowerCase()
  const nm   = name.toLowerCase()
  const isBoat = access === 'Boat'

  // Muck dives always enter from shore/sand even when reached by boat
  const isMuckDive = type === 'Muck' || template === 'muck'
  const isJetty    = template === 'jetty'

  // Entry type
  let entryType: EntryExit['entryType'] = 'shore-sand'
  if (isBoat && !isMuckDive) {
    entryType = 'boat'
  } else if (isJetty) {
    entryType = 'jetty'
  } else if (desc.includes('black') || desc.includes('volcanic') || desc.includes('pebble') ||
             desc.includes('black sand') || site.slug.includes('seraya') || site.slug.includes('lembeh')) {
    entryType = 'shore-black-sand'
  } else if (desc.includes('sand') || desc.includes('sandy')) {
    entryType = 'shore-sand'
  } else {
    entryType = 'shore-pebble'
  }

  // Exit type
  // Muck and jetty: always return to shore
  // Drift: exit by SMB
  // Boat non-drift: pickup near entry
  let exitType: EntryExit['exitType'] = isBoat && !isMuckDive ? 'boat-pickup' : 'shore-same'
  if (template === 'drift') {
    exitType = isBoat ? 'smb-open-water' : 'shore-drift-end'
  }

  // Boat positions — drift sites: drop left, pickup right; circuit/reef: drop & pickup near entry
  const isDrift = template === 'drift' || type === 'Drift'
  const boatDropX = isBoat ? (isDrift ? GL + 240 : GL + 320) : 0
  const pickupX   = isBoat
    ? (isDrift ? GL + DW - 120 : (exitType === 'smb-open-water' ? GL + DW - 80 : GL + 320))
    : 0

  const entryLabel = isBoat
    ? (isDrift ? 'BOAT DROP' : 'BOAT ENTRY')
    : (template === 'jetty' ? 'JETTY ENTRY' : 'SHORE ENTRY')
  const exitLabel = exitType === 'boat-pickup' ? 'PICK UP'
    : exitType === 'smb-open-water' ? 'SMB PICK UP'
    : exitType === 'shore-drift-end' ? 'SHORE EXIT'
    : 'SHORE EXIT'

  return { entryType, exitType, boatDropX, pickupX, entryLabel, exitLabel }
}

// ── ENTRY VISUALS ─────────────────────────────────────────────────────────

function EntryVisual({ ee }: { ee: EntryExit }) {
  if (ee.entryType === 'boat') {
    return (
      <g>
        <BoatIcon x={ee.boatDropX} y={SY - 62} label={ee.entryLabel}/>
        {/* descent line from boat */}
        <Ln x1={ee.boatDropX} y1={SY-14} x2={ee.boatDropX-16} y2={SY+2} color={C.tex3} width={1.5}/>
      </g>
    )
  }
  if (ee.entryType === 'jetty') {
    // Jetty: vertical pilings from surface, platform at waterline
    return (
      <g>
        <rect x={0} y={SY-22} width={280} height={16} rx="3" fill={C.tex3} stroke={C.div} strokeWidth="1.5"/>
        {[60,110,160,210,260].map(px => (
          <rect key={px} x={px-5} y={SY-6} width={10} height={40} rx="2" fill="#1a2a18" stroke={C.trS} strokeWidth="1"/>
        ))}
        <Tx x={140} y={SY-34} sz={15} fill={C.tex2} w="700" a="middle" ls="1.5">JETTY ENTRY</Tx>
      </g>
    )
  }
  // Shore entries — different beach textures
  const beachFill = ee.entryType === 'shore-black-sand' ? '#1a1a1e'
    : ee.entryType === 'shore-pebble' ? '#5a5a5a'
    : C.sandL
  const landFill = ee.entryType === 'shore-black-sand' ? '#2d2d2a' : '#2d5228'
  const beachLabel = ee.entryType === 'shore-black-sand' ? 'BLACK SAND'
    : ee.entryType === 'shore-pebble' ? 'PEBBLE BEACH'
    : 'SHORE ENTRY'
  return (
    <g>
      <path d={`M0 ${DGM_Y} L0 ${SY-26} Q70 ${SY-42} 148 ${SY-20} Q195 ${SY-8} 240 ${SY} L0 ${SY} Z`}
        fill={landFill}/>
      <path d={`M0 ${SY-8} Q90 ${SY-18} 176 ${SY-6} Q210 ${SY-2} 242 ${SY}`}
        fill={beachFill} opacity={ee.entryType === 'shore-black-sand' ? 0.9 : 0.7}/>
      <Tx x={120} y={SY-50} sz={15} fill={C.tex2} w="700" a="middle" ls="1.5">{beachLabel}</Tx>
    </g>
  )
}

function ExitVisual({ ee, routeEndX, routeEndY }: { ee: EntryExit; routeEndX: number; routeEndY: number }) {
  if (ee.exitType === 'boat-pickup' || ee.exitType === 'smb-open-water') {
    const px = ee.pickupX
    // Only show pickup boat if it's in a meaningfully different position from entry
    const showPickup = Math.abs(px - ee.boatDropX) > 200 || ee.exitType === 'smb-open-water'
    return showPickup ? (
      <g>
        <BoatIcon x={px} y={SY - 62} label={ee.exitLabel}/>
        {/* SMB line from safety stop up to surface */}
        <line x1={routeEndX} y1={routeEndY - 20} x2={px} y2={SY - 14}
          stroke={C.green} strokeWidth="2" strokeDasharray="6,4" opacity="0.7"/>
        {/* SMB balloon */}
        <ellipse cx={routeEndX} cy={routeEndY - 36} rx="8" ry="12" fill={C.orange} opacity="0.9"/>
      </g>
    ) : null
  }
  // Shore exit — arrow pointing back to shore
  if (ee.exitType === 'shore-same' || ee.exitType === 'shore-drift-end') {
    const exitX = ee.exitType === 'shore-drift-end' ? GL + 180 : GL + 100
    return (
      <g>
        <rect x={exitX - 60} y={SY - 32} width={120} height={26} rx="6" fill={C.bgGn} opacity="0.9"/>
        <Tx x={exitX} y={SY - 14} sz={13} fill={C.green} w="700" a="middle" ls="0.5">▶ SHORE EXIT</Tx>
      </g>
    )
  }
  return null
}

export default function DiveBriefingCard({site}:{site:DiveSite}) {
  const {maxDepth:md,minDepth,visibility,temp,difficulty,minCert,
         bestTime,bestSeason,type,access,current,name,area,
         marineLife,safetyNotes,rank}=site

  const template = getTemplate(site)
  const id       = site.slug.replace(/[^a-z0-9]/g,'-')
  const ee       = classifyEntryExit(site, template)
  const isBoat   = access==='Boat'
  const hasStr   = /strong|very/i.test(current)
  const curStr   = hasStr?'strong':/mild|weak/i.test(current)?'weak':'moderate'
  const dispName = name.length>30?name.slice(0,28).toUpperCase()+'..':name.toUpperCase()

  const routePts = getRoutePoints(template,md,isBoat,ee)
  const mlPos    = getMLPositions(template,md)
  const ml       = marineLife.slice(0,5)
  const hazards  = safetyNotes.slice(0,3)
  const waypoints= buildWaypoints(template,isBoat)
  const timeline = buildTimeline(template,md,isBoat)
  const tips     = buildTips(template,site)

  const lastPt   = routePts[routePts.length-1]

  const infoCards:[string,string,string][]=[
    ['DIVE TYPE',type,''],['DIFFICULTY',difficulty,''],['CERTIFICATION',minCert,''],
    ['ACCESS',access,''],['DEPTH',`${minDepth}–${md}m`,'depth range'],
    ['VISIBILITY',visibility,''],['WATER TEMP',temp,''],['BEST TIME',bestTime,bestSeason],
  ]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
      style={{width:'100%',height:'auto',display:'block',borderRadius:14,
              fontFamily:"'Inter','Helvetica Neue',system-ui,Arial,sans-serif"}}>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.s0}/><stop offset="100%" stopColor={C.s1}/>
        </linearGradient>
        <linearGradient id={`sea-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={C.w0} stopOpacity="0.68"/>
          <stop offset="40%"  stopColor={C.w1} stopOpacity="0.88"/>
          <stop offset="100%" stopColor={C.w2} stopOpacity="1"/>
        </linearGradient>
        <linearGradient id={`hdr-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#071a2c"/><stop offset="100%" stopColor="#030e1c"/>
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill={C.bg} rx="14"/>

      {/* HEADER */}
      <rect x="0" y="0" width={W} height={HDR_H} fill={`url(#hdr-${id})`} rx="14"/>
      <rect x="0" y={HDR_H-14} width={W} height="14" fill="#030e1c"/>
      <Ln x1={0} y1={HDR_H} x2={W} y2={HDR_H}/>
      <Tx x={48} y={46}  sz={12} fill={C.orange} w="800" ls="3">DIVE BRIEFING</Tx>
      <Tx x={48} y={106} sz={64} fill={C.tex}    w="900" ls="-1">{dispName}</Tx>
      <Tx x={50} y={138} sz={18} fill={C.tex2}   ls="0.3">{area}  ·  Indonesia</Tx>
      {/* Rank */}
      <rect x={W-570} y={32} width={192} height={46} rx={23} fill={C.bgC} stroke={C.tex3} strokeWidth="1.5"/>
      <Tx x={W-570+96} y={63} sz={19} fill={C.blue} w="700" a="middle">#{rank} in {area}</Tx>
      {/* Verified */}
      <rect x={W-366} y={32} width={316} height={46} rx={23} fill={C.bgGn} stroke={C.green} strokeWidth="1.5"/>
      <Tx x={W-366+22} y={63} sz={19} fill={C.green} w="700">✓  Verified by local experts</Tx>
      <Compass cx={W-62} cy={HDR_H/2+8}/>

      {/* DIAGRAM */}
      <rect x="0" y={DGM_Y} width={PX} height={SKY_H} fill={`url(#sky-${id})`}/>
      <rect x="0" y={SY}    width={PX} height={DGM_Y+DGM_H-SY} fill={`url(#sea-${id})`}/>
      {/* Entry */}<EntryVisual ee={ee}/>
      <DepthScale max={md}/>
      <Terrain template={template} md={md}/>
      <DiveRoute pts={routePts}/>
      <ExitVisual ee={ee} routeEndX={lastPt[0]} routeEndY={lastPt[1]}/>
      <CurrentViz x={GL+380} y={SY+54} strength={curStr as 'weak'|'moderate'|'strong'}/>
      {ml.map((m,i)=>{
        const [mx,my]=mlPos[i]??mlPos[mlPos.length-1]
        const d1=Math.round(md*(.13+i*.15)), d2=Math.round(md*(.28+i*.15))
        return <MLTag key={i} x={mx} y={my} name={m.name} depth={`${d1}-${d2}m`}/>
      })}
      {hazards.map((h,i)=>{
        const hx=[GL+196,GL+598,GL+998][i]
        return <HazardTag key={i} x={hx} y={BY-28-i*52} text={h}/>
      })}
      <Ln x1={0} y1={DGM_Y+DGM_H} x2={PX} y2={DGM_Y+DGM_H}/>
      <RightPanel site={site} hazards={hazards} waypoints={waypoints}/>

      {/* INFO CARDS */}
      <rect x="0" y={INF_Y} width={W} height={INF_H} fill={C.bgDk}/>
      <Ln x1={0} y1={INF_Y} x2={W} y2={INF_Y}/>
      {infoCards.map(([label,value,sub],i)=>{
        const cw=W/8, cx=i*cw
        return (
          <g key={label}>
            {i>0&&<Ln x1={cx} y1={INF_Y+16} x2={cx} y2={INF_Y+INF_H-16}/>}
            <Tx x={cx+cw/2} y={INF_Y+36} sz={12} fill={C.tex2} w="700" a="middle" ls="1">{label}</Tx>
            <Tx x={cx+cw/2} y={INF_Y+90} sz={22} fill={C.tex}  w="800" a="middle">{value}</Tx>
            {sub&&<Tx x={cx+cw/2} y={INF_Y+116} sz={12} fill={C.tex3} a="middle">{sub}</Tx>}
          </g>
        )
      })}

      {/* TIMELINE */}
      <rect x="0" y={TML_Y} width={W} height={TML_H} fill={C.bgP}/>
      <Ln x1={0} y1={TML_Y} x2={W} y2={TML_Y}/>
      <Tx x={48} y={TML_Y+40} sz={12} fill={C.tex2} w="700" ls="2.5">DIVE TIMELINE  ·  APPROX. 45–55 MINUTES</Tx>
      {timeline.map((s,i)=>{
        const cw=(W-96)/timeline.length, cx=48+i*cw
        const isExit=i===timeline.length-1
        return (
          <g key={i}>
            <rect x={cx} y={TML_Y+54} width={cw-10} height={TML_H-68} rx={8}
              fill={isExit?C.bgGn:C.bgC} stroke={isExit?C.green:C.div} strokeWidth="1.2"/>
            <Tx x={cx+(cw-10)/2} y={TML_Y+82}  sz={12} fill={isExit?C.green:C.blue} w="700" a="middle" ls="0.5">{s.time}</Tx>
            <Tx x={cx+(cw-10)/2} y={TML_Y+118} sz={18} fill={C.tex} w="900" a="middle">{s.phase}</Tx>
            <Tx x={cx+(cw-10)/2} y={TML_Y+146} sz={12} fill={C.tex2} a="middle">{s.sub}</Tx>
            {i<timeline.length-1&&<Tx x={cx+cw-2} y={TML_Y+124} sz={26} fill={C.tex3} a="middle">›</Tx>}
          </g>
        )
      })}

      {/* TIPS */}
      <rect x="0" y={TIP_Y} width={W} height={TIP_H} fill={C.bg}/>
      <Ln x1={0} y1={TIP_Y} x2={W} y2={TIP_Y}/>
      <Tx x={48} y={TIP_Y+40} sz={12} fill={C.tex2} w="700" ls="2.5">DIVE TIPS  ·  SAFETY REMINDERS</Tx>
      {tips.map((tip,i)=>{
        const cw=W/tips.length, cx=i*cw
        const maxCh=Math.floor((cw-58)/(14*.58))
        const words=tip.text.split(' ')
        const lines:string[]=[]
        let cur=''
        for(const w of words){
          if((cur+' '+w).trim().length>maxCh&&cur){lines.push(cur.trim());cur=w}
          else{cur=(cur+' '+w).trim()}
        }
        if(cur) lines.push(cur)
        return (
          <g key={i}>
            {i>0&&<Ln x1={cx} y1={TIP_Y+20} x2={cx} y2={TIP_Y+TIP_H-20}/>}
            <circle cx={cx+44} cy={TIP_Y+100} r={34} fill={C.bgC} stroke={C.div} strokeWidth="1.5"/>
            <text x={cx+44} y={TIP_Y+114} fontSize="28" textAnchor="middle" fontFamily="'Inter',Arial,sans-serif">{tip.icon}</text>
            <Tx x={cx+90} y={TIP_Y+90} sz={14} fill={C.blue} w="800" ls="0.8">{tip.label}</Tx>
            {lines.map((line,li)=>(
              <Tx key={li} x={cx+22} y={TIP_Y+122+li*22} sz={14} fill={C.tex2}>{line}</Tx>
            ))}
          </g>
        )
      })}

      {/* FOOTER */}
      <rect x="0" y={FTR_Y} width={W} height={FTR_H} fill={C.bgDk}/>
      <Ln x1={0} y1={FTR_Y} x2={W} y2={FTR_Y}/>
      <Tx x={48} y={FTR_Y+36} sz={15} fill={C.tex3}>dive-spots.com</Tx>
      <Tx x={W/2} y={FTR_Y+36} sz={14} fill={C.tex3} a="middle">Always follow your dive guide&apos;s briefing. Never dive beyond your certification level.</Tx>
      <Tx x={W-48} y={FTR_Y+36} sz={14} fill={C.tex3} a="end">© 2026 Dive Spots</Tx>
    </svg>
  )
}
// Deploy trigger Fri Jul 10 17:18:21 UTC 2026
