import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { BALI_SITES } from '@/lib/data'
export default function MapPage() {
  return (
    <main style={{minHeight:'100vh',background:'#0d1b2e'}}>
      <Navbar />
      <div style={{maxWidth:1100,margin:'0 auto',padding:'2rem'}}>
        <h1 style={{fontSize:24,fontWeight:800,color:'#fff',marginBottom:'1.5rem'}}>DIVE SITE MAP — BALI</h1>
        <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:'1.5rem'}}>
          <div style={{background:'#0a1628',border:'1px solid #1e3a5f',borderRadius:12,height:500,display:'flex',alignItems:'center',justifyContent:'center',color:'#475569',fontSize:13}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:32,marginBottom:8}}>🗺️</div>
              <div>Interactive map coming soon</div>
              <div style={{fontSize:11,color:'#1e3a5f',marginTop:4}}>Google Maps API integration</div>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:6,maxHeight:500,overflowY:'auto'}}>
            {BALI_SITES.map(site=>(
              <Link key={site.slug} href={`/indonesia/bali/${site.areaSlug}/${site.slug}`} style={{padding:'10px 12px',background:'#0a1628',border:'1px solid #1e3a5f',borderRadius:8,display:'flex',gap:10,alignItems:'center'}}>
                <div style={{width:24,height:24,background:'#0d1b2e',border:'1px solid #1e3a5f',color:'#ef4444',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,flexShrink:0}}>{site.rank}</div>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:'#e2e8f0'}}>{site.name}</div>
                  <div style={{fontSize:10,color:'#475569'}}>{site.area} · {site.type}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
