import { DiveSite } from '@/lib/data'

export default function DiveDiagram({ site }: { site: DiveSite }) {
  const isWreck = site.type === 'Wreck'
  const isWall = site.type === 'Wall'
  const isDrift = site.type === 'Drift'
  const isMuck = site.type === 'Muck'
  const maxD = site.maxDepth
  const avgD = site.avgDepth
  // Scale: 0m = y:60, maxDepth = y:280 → pixels per metre
  const ppm = 220 / maxD
  const depthY = (d: number) => 60 + d * ppm
  const markerDepths = maxD <= 20 ? [0,5,10,15,20] : maxD <= 30 ? [0,5,10,15,20,25,30] : [0,5,10,15,20,25,30,35]

  return (
    <svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'auto'}}>
      <defs>
        <linearGradient id="dg-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.95"/>
        </linearGradient>
        <linearGradient id="dg-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#92400e"/>
          <stop offset="100%" stopColor="#451a03"/>
        </linearGradient>
        <linearGradient id="dg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd"/>
          <stop offset="100%" stopColor="#7dd3fc"/>
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="560" height="60" fill="url(#dg-sky)"/>
      {/* Compass N */}
      <text x="530" y="20" fontSize="10" fill="#0a1628" fontWeight="700" textAnchor="middle">N</text>
      <line x1="530" y1="22" x2="530" y2="32" stroke="#0a1628" strokeWidth="1.5"/>

      {/* Surface label */}
      <text x="48" y="68" fontSize="9" fill="#94a3b8" textAnchor="end">SURFACE</text>

      {/* Water */}
      <rect x="0" y="60" width="560" height="260" fill="url(#dg-water)"/>
      {/* Surface line */}
      <line x1="0" y1="60" x2="560" y2="60" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="4,3" opacity="0.6"/>

      {/* Depth markers */}
      {markerDepths.map(d => (
        <g key={d}>
          <line x1="55" y1={depthY(d)} x2="560" y2={depthY(d)} stroke="#1e3a5f" strokeWidth="0.5" strokeDasharray="2,4"/>
          <text x="50" y={depthY(d)+4} fontSize="9" fill="#60a5fa" textAnchor="end">{d}m</text>
        </g>
      ))}

      {/* AVG DEPTH line */}
      <line x1="55" y1={depthY(avgD)} x2="400" y2={depthY(avgD)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" opacity="0.8"/>
      <text x="410" y={depthY(avgD)+4} fontSize="9" fill="#f59e0b">AVG DEPTH: {avgD}m</text>

      {isWreck && (
        <>
          {/* Shore entry */}
          <rect x="55" y="35" width="70" height="25" rx="4" fill="#0a1628" opacity="0.8"/>
          <text x="90" y="46" fontSize="9" fill="#94a3b8" textAnchor="middle">SURFACE</text>
          {/* Entry point buoy */}
          <circle cx="120" cy="60" r="6" fill="#3b82f6" opacity="0.9"/>
          <text x="130" y="55" fontSize="9" fill="#e2e8f0" fontWeight="700">BUOY</text>
          <line x1="120" y1="55" x2="120" y2="60" stroke="#3b82f6" strokeWidth="1.5"/>
          {/* Entry arrow */}
          <text x="140" y="75" fontSize="9" fill="#22c55e" fontWeight="700">ENTRY</text>
          <text x="140" y="86" fontSize="8" fill="#64748b">Shore</text>
          <path d="M138 80 L130 80" stroke="#22c55e" strokeWidth="1.5" markerEnd="url(#arrow-green)"/>
          {/* Volcanic stones */}
          {[58,68,78,88,98,108].map(x => <ellipse key={x} cx={x} cy="62" rx="5" ry="3" fill="#374151" opacity="0.6"/>)}
          {/* Wreck body */}
          <rect x="130" y={depthY(5)} width="280" height={depthY(maxD)-depthY(5)-10} rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1.5" opacity="0.9"/>
          {/* Wreck details */}
          <rect x="160" y={depthY(5)+5} width="80" height="20" rx="3" fill="#0f172a"/>
          <rect x="260" y={depthY(5)+5} width="60" height="18" rx="3" fill="#0f172a"/>
          <line x1="195" y1={depthY(5)-30} x2="195" y2={depthY(5)+5} stroke="#475569" strokeWidth="2"/>
          <line x1="170" y1={depthY(5)-18} x2="220" y2={depthY(5)-18} stroke="#475569" strokeWidth="1.5"/>
          <text x="270" y={depthY(15)} fontSize="11" fill="#94a3b8" fontWeight="700" textAnchor="middle">WRECK</text>
          {/* BOW / STERN labels */}
          <text x="145" y={depthY(5)-5} fontSize="9" fill="#60a5fa">BOW</text>
          <text x="390" y={depthY(maxD)-5} fontSize="9" fill="#60a5fa">STERN</text>
          {/* Coral growth */}
          {[145,185,230,280,330,375,405].map((x,i) => (
            <g key={i}>
              <ellipse cx={x} cy={depthY(maxD)-8} rx="14" ry="8" fill="#059669" opacity="0.6"/>
              <path d={`M${x} ${depthY(maxD)-16} Q${x-8} ${depthY(maxD)-28} ${x} ${depthY(maxD)-22} Q${x+8} ${depthY(maxD)-28} ${x} ${depthY(maxD)-16}`} fill="#10b981" opacity="0.7"/>
            </g>
          ))}
          <text x="270" y={depthY(maxD)+12} fontSize="9" fill="#059669" textAnchor="middle">REEF AND CORAL GROWTH</text>
          {/* Sand bottom */}
          <rect x="55" y={depthY(maxD)+5} width="505" height="20" rx="3" fill="#92400e" opacity="0.5"/>
          <text x="270" y={depthY(maxD)+17} fontSize="9" fill="#b45309" textAnchor="middle">SAND BOTTOM</text>
          {/* Main route - red dotted */}
          <path d={`M 125 65 Q 130 ${depthY(5)} 180 ${depthY(8)} Q 260 ${depthY(15)} 330 ${depthY(22)} Q 390 ${depthY(28)} 405 ${depthY(maxD)-15}`}
            stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
          {/* Return route - blue dotted */}
          <path d={`M 405 ${depthY(maxD)-15} Q 340 ${depthY(12)} 250 ${depthY(8)} Q 180 ${depthY(5)} 125 65`}
            stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,4" fill="none" opacity="0.7"/>
          {/* Photo points */}
          {[[230,depthY(14)],[330,depthY(22)]].map(([x,y],i)=>(
            <g key={i}>
              <circle cx={x} cy={y} r="8" fill="#f59e0b" opacity="0.9"/>
              <text x={x} y={y+4} fontSize="8" fill="#fff" textAnchor="middle" fontWeight="700">P</text>
            </g>
          ))}
          {/* Max depth marker */}
          <circle cx="405" cy={depthY(maxD)-15} r="6" fill="#ef4444"/>
          <text x="415" y={depthY(maxD)-10} fontSize="9" fill="#ef4444" fontWeight="700">MAX</text>
          {/* Safety stop */}
          <rect x="420" y={depthY(5)-12} width="120" height="22" rx="5" fill="#15803d" opacity="0.95"/>
          <text x="480" y={depthY(5)-1} fontSize="9" fill="#fff" textAnchor="middle" fontWeight="700">SAFETY STOP 5m / 3 min</text>
          {/* Surge arrow */}
          <text x="80" y={depthY(avgD)+20} fontSize="8" fill="#64748b">surge</text>
          <path d="M80 230 Q100 225 120 230" stroke="#64748b" strokeWidth="1" fill="none"/>
          {/* Safety notes */}
          <text x="70" y={depthY(maxD)+35} fontSize="8" fill="#ef4444">No wreck penetration unless trained</text>
          <text x="70" y={depthY(maxD)+46} fontSize="8" fill="#ef4444">Careful shore entry/exit over volcanic stones</text>
        </>
      )}

      {isWall && (
        <>
          {/* Wall face */}
          <rect x="55" y="60" width="30" height="260" fill="#1e3a5f" stroke="#334155" strokeWidth="1"/>
          {/* Corals on wall */}
          {[80,105,135,165,200,235,265].map((y,i)=>(
            <g key={i}>
              <path d={`M85 ${y} Q70 ${y-18} 60 ${y-12} Q75 ${y-5} 85 ${y}`} fill={i%2===0?'#7c3aed':'#0891b2'} opacity="0.7"/>
              <path d={`M85 ${y+12} Q68 ${y} 58 ${y+6} Q72 ${y+14} 85 ${y+12}`} fill="#10b981" opacity="0.6"/>
            </g>
          ))}
          {/* Sea fans */}
          {[90,140,200].map((y,i)=>(
            <g key={i}>
              <path d={`M85 ${y} Q72 ${y-20} 62 ${y-15} M85 ${y} Q78 ${y-22} 68 ${y-16}`} stroke="#7c3aed" strokeWidth="1.5" fill="none" opacity="0.8"/>
            </g>
          ))}
          {/* Sandy bottom */}
          <path d="M85 290 Q200 280 560 285 L560 310 L85 310 Z" fill="#92400e" opacity="0.4"/>
          {/* Entry buoy */}
          <circle cx="200" cy="58" r="6" fill="#3b82f6"/>
          <text x="210" y="53" fontSize="9" fill="#e2e8f0" fontWeight="700">BUOY</text>
          {/* Diver path */}
          <path d="M200 65 Q190 100 170 140 Q150 180 140 220 Q135 255 145 285" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
          <text x="155" y="75" fontSize="9" fill="#22c55e" fontWeight="700">ENTRY</text>
          {/* Return path */}
          <path d="M145 285 Q200 240 280 200 Q350 165 420 150" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,4" fill="none" opacity="0.7"/>
          {/* Safety stop */}
          <rect x="350" y={depthY(5)-12} width="120" height="22" rx="5" fill="#15803d" opacity="0.95"/>
          <text x="410" y={depthY(5)-1} fontSize="9" fill="#fff" textAnchor="middle" fontWeight="700">SAFETY STOP 5m / 3 min</text>
          {/* Current arrow */}
          <text x="440" y="260" fontSize="8" fill="#64748b">current →</text>
          <path d="M435 265 L465 265" stroke="#64748b" strokeWidth="1.5"/>
          <polygon points="465,262 470,265 465,268" fill="#64748b"/>
          <text x="270" y={depthY(maxD)+15} fontSize="9" fill="#ef4444" textAnchor="middle">Max depth: {maxD}m</text>
        </>
      )}

      {!isWreck && !isWall && (
        <>
          {/* Reef slope */}
          <path d={`M55 ${depthY(maxD*0.4)} Q150 ${depthY(maxD*0.5)} 300 ${depthY(maxD*0.7)} Q400 ${depthY(maxD*0.85)} 560 ${depthY(maxD*0.9)} L560 310 L55 310 Z`} fill="#92400e" opacity="0.5"/>
          {/* Coral bommies */}
          {[80,130,200,280,360,440,510].map((x,i)=>{
            const y = depthY(maxD*(0.35+i*0.08))
            return (
              <g key={i}>
                <ellipse cx={x} cy={y} rx={16} ry={10} fill={i%3===0?'#0891b2':i%3===1?'#10b981':'#7c3aed'} opacity="0.7"/>
                <path d={`M${x} ${y-10} Q${x-10} ${y-22} ${x} ${y-17} Q${x+10} ${y-22} ${x} ${y-10}`} fill="#10b981" opacity="0.8"/>
              </g>
            )
          })}
          {/* Shore/boat entry */}
          <circle cx="100" cy="58" r="6" fill="#3b82f6"/>
          <text x="112" y="53" fontSize="9" fill="#e2e8f0" fontWeight="700">BUOY</text>
          <text x="112" y="73" fontSize="9" fill="#22c55e" fontWeight="700">ENTRY</text>
          <text x="112" y="84" fontSize="8" fill="#64748b">{site.access}</text>
          {/* Main route */}
          <path d={`M100 65 Q110 ${depthY(5)} 140 ${depthY(maxD*0.35)} Q200 ${depthY(maxD*0.5)} 300 ${depthY(maxD*0.65)} Q380 ${depthY(maxD*0.75)} 420 ${depthY(maxD*0.85)}`}
            stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
          {/* Return */}
          <path d={`M420 ${depthY(maxD*0.85)} Q320 ${depthY(maxD*0.4)} 200 ${depthY(maxD*0.25)} Q150 ${depthY(8)} 100 65`}
            stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,4" fill="none" opacity="0.7"/>
          {/* Photo points */}
          {[[200,depthY(maxD*0.5)],[350,depthY(maxD*0.72)]].map(([x,y],i)=>(
            <g key={i}>
              <circle cx={x} cy={y} r="8" fill="#f59e0b" opacity="0.9"/>
              <text x={x} y={y+4} fontSize="8" fill="#fff" textAnchor="middle" fontWeight="700">P</text>
            </g>
          ))}
          {/* Max */}
          <circle cx="420" cy={depthY(maxD*0.85)} r="6" fill="#ef4444"/>
          <text x="430" y={depthY(maxD*0.85)+4} fontSize="9" fill="#ef4444" fontWeight="700">MAX</text>
          {/* Safety stop */}
          <rect x="350" y={depthY(5)-12} width="120" height="22" rx="5" fill="#15803d" opacity="0.95"/>
          <text x="410" y={depthY(5)-1} fontSize="9" fill="#fff" textAnchor="middle" fontWeight="700">SAFETY STOP 5m / 3 min</text>
          {/* Current */}
          <text x="450" y="270" fontSize="8" fill="#64748b">current →</text>
          <path d="M445 275 L475 275" stroke="#64748b" strokeWidth="1.5"/>
          <polygon points="475,272 480,275 475,278" fill="#64748b"/>
        </>
      )}

      {/* Legend */}
      <g transform="translate(60,300)">
        <line x1="0" y1="5" x2="20" y2="5" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2"/>
        <text x="24" y="9" fontSize="8" fill="#94a3b8">Suggested route</text>
        <circle cx="110" cy="5" r="5" fill="#f59e0b"/>
        <text x="118" y="9" fontSize="8" fill="#94a3b8">Photo opportunity</text>
        <line x1="210" y1="5" x2="230" y2="5" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3"/>
        <text x="234" y="9" fontSize="8" fill="#94a3b8">Alternate route</text>
        <circle cx="320" cy="5" r="5" fill="#ef4444"/>
        <text x="328" y="9" fontSize="8" fill="#94a3b8">Max depth</text>
      </g>
    </svg>
  )
}
