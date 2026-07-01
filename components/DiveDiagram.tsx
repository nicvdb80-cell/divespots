import { DiveSite } from '@/lib/data'

export default function DiveDiagram({ site }: { site: DiveSite }) {
  const isWreck = site.diagramType === 'wreck'
  const isWall = site.diagramType === 'wall'
  const isShore = site.diagramType === 'shore' || site.diagramType === 'boat'

  return (
    <svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', borderRadius: 8 }}>
      {/* Background - water */}
      <defs>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.9"/>
        </linearGradient>
        <linearGradient id="seabed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#92400e"/>
          <stop offset="100%" stopColor="#451a03"/>
        </linearGradient>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd"/>
          <stop offset="100%" stopColor="#7dd3fc"/>
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="520" height="55" fill="url(#sky)"/>
      {/* Sun */}
      <circle cx="460" cy="22" r="12" fill="#fbbf24" opacity="0.9"/>
      {/* Waves on surface */}
      <path d="M0 55 Q60 48 120 55 Q180 62 240 55 Q300 48 360 55 Q420 62 480 55 L520 55 L520 65 L0 65 Z" fill="#0ea5e9" opacity="0.5"/>

      {/* Water body */}
      <rect x="0" y="55" width="520" height="215" fill="url(#water)"/>

      {isWreck && (
        <>
          {/* Wreck silhouette */}
          <rect x="120" y="195" width="280" height="40" rx="4" fill="#1e3a5f" stroke="#334155" strokeWidth="1.5"/>
          <rect x="160" y="175" width="100" height="25" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
          <rect x="280" y="180" width="60" height="20" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1"/>
          {/* Mast */}
          <line x1="200" y1="120" x2="200" y2="175" stroke="#475569" strokeWidth="2"/>
          <line x1="170" y1="140" x2="230" y2="140" stroke="#475569" strokeWidth="1.5"/>
          {/* Corals on wreck */}
          {[140,180,240,320,360].map((x,i) => (
            <g key={i}>
              <path d={`M${x} 235 Q${x-8} 218 ${x} 205 Q${x+8} 218 ${x} 235`} fill="#10b981" opacity="0.7"/>
              <path d={`M${x+12} 235 Q${x+4} 220 ${x+12} 208 Q${x+20} 220 ${x+12} 235`} fill="#059669" opacity="0.6"/>
            </g>
          ))}
          {/* Fish */}
          <ellipse cx="340" cy="160" rx="12" ry="6" fill="#fbbf24" opacity="0.8"/>
          <path d="M352 160 L360 155 L360 165 Z" fill="#fbbf24" opacity="0.8"/>
          <ellipse cx="290" cy="145" rx="9" ry="4" fill="#f97316" opacity="0.7"/>
          {/* Entry arrow */}
          <line x1="80" y1="65" x2="160" y2="195" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4"/>
          <polygon points="158,195 168,188 165,200" fill="#ef4444"/>
          <text x="52" y="62" fontSize="10" fill="#1e293b" fontWeight="700">ENTRY</text>
          <text x="42" y="74" fontSize="9" fill="#334155">(Shore or Boat)</text>
          {/* Safety stop */}
          <line x1="80" y1="80" x2="80" y2="110" stroke="#22c55e" strokeWidth="2"/>
          <rect x="60" y="110" width="80" height="22" rx="4" fill="#15803d" opacity="0.9"/>
          <text x="100" y="124" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="600">SAFETY STOP 5m • 3 min</text>
        </>
      )}

      {isWall && (
        <>
          {/* Wall face */}
          <rect x="40" y="55" width="35" height="215" fill="#1e3a5f" stroke="#334155" strokeWidth="1"/>
          {/* Corals on wall */}
          {[80,100,130,160,195,220].map((y,i) => (
            <g key={i}>
              <path d={`M75 ${y} Q60 ${y-15} 50 ${y-10} Q65 ${y-5} 75 ${y}`} fill={i%2===0?'#7c3aed':'#0891b2'} opacity="0.7"/>
              <path d={`M75 ${y+10} Q62 ${y} 52 ${y+5} Q66 ${y+12} 75 ${y+10}`} fill="#10b981" opacity="0.6"/>
            </g>
          ))}
          {/* Sea fans */}
          <path d="M75 90 Q65 75 55 80 M75 90 Q70 72 62 78 M75 90 Q75 70 68 75" stroke="#7c3aed" strokeWidth="1.5" fill="none" opacity="0.8"/>
          {/* Sandy bottom */}
          <path d="M75 265 Q200 255 520 260 L520 270 L75 270 Z" fill="#92400e" opacity="0.5"/>
          {/* Diver path */}
          <path d="M260 70 Q240 90 220 120 Q200 150 190 190 Q185 230 200 255" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
          <text x="265" y="75" fontSize="10" fill="#1e293b" fontWeight="700">BUOY</text>
          <circle cx="260" cy="65" r="5" fill="#ef4444"/>
          {/* Depth markers */}
          {[{d:'0m',y:65},{d:'10m',y:105},{d:'20m',y:150},{d:'30m',y:195},{d:'40m',y:240}].map(m=>(
            <g key={m.d}>
              <line x1="78" x2="95" y1={m.y} y2={m.y} stroke="#475569" strokeWidth="0.5" strokeDasharray="2,2"/>
              <text x="97" y={m.y+4} fontSize="9" fill="#94a3b8">{m.d}</text>
            </g>
          ))}
          {/* Safety stop box */}
          <rect x="300" y="85" width="100" height="22" rx="4" fill="#15803d" opacity="0.9"/>
          <text x="350" y="99" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="600">SAFETY STOP 5m • 3 min</text>
        </>
      )}

      {!isWreck && !isWall && (
        <>
          {/* Reef slope */}
          <path d={`M0 200 Q100 190 200 210 Q300 225 400 215 Q460 210 520 220 L520 270 L0 270 Z`} fill="#92400e" opacity="0.6"/>
          {/* Coral bommies */}
          {[60,130,200,280,360,440].map((x,i)=>(
            <g key={i}>
              <ellipse cx={x} cy={200} rx={18} ry={12} fill={i%3===0?'#0891b2':i%3===1?'#10b981':'#7c3aed'} opacity="0.7"/>
              <path d={`M${x} 188 Q${x-10} 175 ${x} 170 Q${x+10} 175 ${x} 188`} fill="#10b981" opacity="0.8"/>
            </g>
          ))}
          {/* Diver path */}
          <path d="M80 70 Q90 120 100 160 Q130 185 200 195" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" fill="none"/>
          <polygon points="200,192 208,200 194,202" fill="#ef4444"/>
          {/* Entry */}
          <line x1="80" y1="55" x2="80" y2="70" stroke="#334155" strokeWidth="2"/>
          <circle cx="80" cy="58" r="6" fill="#0ea5e9" opacity="0.8"/>
          <text x="60" y="52" fontSize="10" fill="#1e293b" fontWeight="700">ENTRY</text>
          {/* Depth markers */}
          {[{d:'0m',y:65},{d:'5m',y:100},{d:'10m',y:140},{d:'15m',y:180}].map(m=>(
            <g key={m.d}>
              <line x1="0" x2="15" y1={m.y} y2={m.y} stroke="#475569" strokeWidth="0.5"/>
              <text x="17" y={m.y+4} fontSize="9" fill="#94a3b8">{m.d}</text>
            </g>
          ))}
          {/* Safety stop */}
          <rect x="300" y="85" width="100" height="22" rx="4" fill="#15803d" opacity="0.9"/>
          <text x="350" y="99" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="600">SAFETY STOP 5m • 3 min</text>
          {/* Fish */}
          <ellipse cx="320" cy="170" rx="10" ry="5" fill="#fbbf24" opacity="0.8"/>
          <ellipse cx="360" cy="155" rx="8" ry="4" fill="#f97316" opacity="0.7"/>
          <ellipse cx="400" cy="175" rx="12" ry="5" fill="#06b6d4" opacity="0.7"/>
        </>
      )}

      {/* Current arrow */}
      <text x="420" y="245" fontSize="9" fill="#94a3b8">CURRENT →</text>
      <line x1="415" y1="248" x2="445" y2="248" stroke="#94a3b8" strokeWidth="1"/>
      <polygon points="445,245 452,248 445,251" fill="#94a3b8"/>

      {/* Depth label */}
      <text x="480" y="270" fontSize="9" fill="#60a5fa" textAnchor="end">Max depth: {site.maxDepth}m</text>
    </svg>
  )
}
