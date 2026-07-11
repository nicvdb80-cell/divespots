import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { RAJA_AMPAT_SITES, RAJA_AMPAT_AREAS } from '@/lib/data'

export default function RajaAmpatPage() {
  return (
    <main style={{ minHeight:'100vh', background:'#0d1b2e' }}>
      <Navbar />
      <div style={{ background:'#020d1a url(/hero-bg.png) center center / cover no-repeat', padding:'2.5rem 2rem', color:'#fff', borderBottom:'1px solid #1e3a5f' }}>
        <div style={{ fontSize:11,color:'#60a5fa',marginBottom:8 }}>🇮🇩 Indonesia · Raja Ampat</div>
        <h1 style={{ fontSize:36,fontWeight:900,marginBottom:10 }}>RAJA AMPAT DIVE SITES</h1>
        <p style={{ color:'#64748b',maxWidth:560,fontSize:13,lineHeight:1.7,marginBottom:'1.5rem' }}>The world record holder for marine biodiversity. Raja Ampat&apos;s 1,500 islands harbour more fish species than anywhere on earth — manta cleaning stations, world-record reef fish counts, remote limestone karst walls, and pristine coral gardens untouched by mass tourism.</p>
        <div style={{ display:'flex',gap:'2.5rem' }}>
          {[['180+','Dive sites'],['27–30°C','Water temp'],['30m+','Visibility'],['Oct–Apr','Best season']].map(([n,l])=>(
            <div key={l}><div style={{fontSize:20,fontWeight:800}}>{n}</div><div style={{fontSize:10,color:'#475569',letterSpacing:1}}>{l.toUpperCase()}</div></div>
          ))}
        </div>
      </div>

      {/* Area strip */}
      <div style={{ background:'#0a1628',borderBottom:'1px solid #1e3a5f',padding:'0.75rem 2rem',display:'flex',gap:8,overflowX:'auto' }}>
        {RAJA_AMPAT_AREAS.map(a=>(
          <div key={a.slug} style={{ padding:'8px 16px',background:'#0d1b2e',border:'1px solid #1e3a5f',borderRadius:8,fontSize:11,fontWeight:600,color:'#94a3b8',whiteSpace:'nowrap',flexShrink:0 }}>
            <div style={{color:'#e2e8f0'}}>{a.name}</div>
            <div style={{color:'#475569',fontSize:10}}>{a.count} dive sites</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth:1100,margin:'0 auto',padding:'2rem',display:'grid',gridTemplateColumns:'240px 1fr',gap:'2rem' }}>
        <div>
          <div style={{ background:'#0a1628',border:'1px solid #1e3a5f',borderRadius:12,padding:'1.25rem',marginBottom:12 }}>
            <div style={{ fontSize:11,fontWeight:700,color:'#475569',marginBottom:12,letterSpacing:1 }}>DIVE AREAS</div>
            {RAJA_AMPAT_AREAS.map(a=>(
              <Link key={a.slug} href={`/indonesia/raja-ampat/areas/${a.slug}`} style={{ padding:'8px 0',borderBottom:'1px solid #1e3a5f',display:'flex',justifyContent:'space-between',alignItems:'center',textDecoration:'none',cursor:'pointer' }}>
                <div>
                  <div style={{ fontSize:13,color:'#e2e8f0',fontWeight:500 }}>{a.name}</div>
                  <div style={{ fontSize:11,color:'#475569' }}>{a.desc}</div>
                </div>
                <span style={{ fontSize:11,color:'#475569' }}>{a.count}</span>
              </Link>
            ))}
          </div>
          <div style={{ background:'#001a0a',border:'1px solid #14532d',borderRadius:12,padding:'1rem' }}>
            <div style={{ fontWeight:700,color:'#22c55e',fontSize:13,marginBottom:6 }}>Know a site we&apos;re missing?</div>
            <p style={{ fontSize:12,color:'#166534',marginBottom:10 }}>Help fellow divers by contributing.</p>
            <Link href="/submit" style={{ display:'block',background:'#16a34a',color:'#fff',padding:'8px 12px',borderRadius:8,fontSize:12,fontWeight:700,textAlign:'center' }}>Submit a dive site →</Link>
          </div>
        </div>
        <div>
          <h2 style={{ fontSize:18,fontWeight:800,color:'#fff',marginBottom:'1.25rem' }}>TOP 10 DIVE SITES IN RAJA AMPAT</h2>
          <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
            {RAJA_AMPAT_SITES.map(site=>(
              <Link key={site.slug} href={`/indonesia/raja-ampat/${site.areaSlug}/${site.slug}`} style={{ display:'flex',alignItems:'center',gap:14,padding:'0.9rem 1.25rem',background:'#0a1628',border:'1px solid #1e3a5f',borderRadius:10, textDecoration:'none' }}>
                <div style={{ width:30,height:30,background:'#0d1b2e',border:'1px solid #1e3a5f',color:'#ef4444',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:12,flexShrink:0 }}>{site.rank}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700,fontSize:13,color:'#fff' }}>{site.name}</div>
                  <div style={{ fontSize:11,color:'#475569' }}>{site.area} · {site.type} · {site.difficulty}</div>
                </div>
                <div style={{ display:'flex',gap:8,alignItems:'center' }}>
                  <span style={{ fontSize:11,padding:'2px 8px',background:'#0d1b2e',border:'1px solid #1e3a5f',borderRadius:6,color:'#64748b' }}>{site.minDepth}–{site.maxDepth}m</span>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:12,color:'#f59e0b',fontWeight:700 }}>★ {site.rating}</div>
                    <div style={{ fontSize:10,color:'#475569' }}>{site.reviews} reviews</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <footer style={{ background:'#0a1628',borderTop:'1px solid #1e3a5f',color:'#475569',padding:'2rem',textAlign:'center',fontSize:12 }}>© 2026 Dive Spots. All rights reserved.</footer>
    </main>
  )
}
