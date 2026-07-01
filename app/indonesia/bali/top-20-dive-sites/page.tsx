import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { BALI_SITES } from '@/lib/data'
export const metadata = { title: 'Top 20 Bali Dive Sites | Dive Spots', description: 'The definitive guide to the top 20 dive sites in Bali, Indonesia — ranked by our expert team and diver community.' }
export default function Top20Page() {
  return (
    <main style={{minHeight:'100vh',background:'#fff'}}>
      <Navbar/>
      <div style={{background:'linear-gradient(135deg,#0a1628,#1e3a5f)',padding:'3rem 2rem',color:'#fff',borderBottom:'1px solid #1e3a5f'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{fontSize:11,color:'#60a5fa',marginBottom:8}}><Link href="/destinations" style={{color:'#475569'}}>Destinations</Link> › <Link href="/indonesia" style={{color:'#475569'}}>Indonesia</Link> › <Link href="/indonesia/bali" style={{color:'#475569'}}>Bali</Link> › Top 20</div>
          <h1 style={{fontSize:36,fontWeight:900,letterSpacing:-1,marginBottom:10}}>TOP 20 BALI DIVE SITES</h1>
          <p style={{color:'#64748b',fontSize:14,lineHeight:1.7,maxWidth:540}}>The definitive ranking of Bali's best dive sites — selected and verified by our expert team and diver community.</p>
        </div>
      </div>
      <div style={{maxWidth:900,margin:'0 auto',padding:'2.5rem 2rem'}}>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {BALI_SITES.map(site=>(
            <Link key={site.slug} href={`/indonesia/bali/${site.areaSlug}/${site.slug}`}
              style={{display:'flex',alignItems:'center',gap:16,padding:'1.25rem 1.5rem',border:'1px solid #f1f5f9',borderRadius:12,background:'#fff'}}>
              <div style={{width:40,height:40,background:site.rank<=3?'#ef4444':'#0a1628',color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:15,flexShrink:0}}>{site.rank}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:15,color:'#0a1628',marginBottom:3}}>{site.name}</div>
                <div style={{fontSize:12,color:'#64748b'}}>{site.area} · {site.type} · {site.minDepth}–{site.maxDepth}m · {site.difficulty}</div>
              </div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <span style={{fontSize:11,padding:'3px 10px',background:'#f1f5f9',borderRadius:10,color:'#64748b'}}>{site.minCert}</span>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:14,color:'#f59e0b',fontWeight:700}}>★ {site.rating}</div>
                  <div style={{fontSize:11,color:'#94a3b8'}}>{site.reviews} reviews</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <footer style={{background:'#0a1628',color:'#475569',padding:'2rem',textAlign:'center',fontSize:12,borderTop:'1px solid #1e3a5f'}}>© 2026 Dive Spots. All rights reserved.</footer>
    </main>
  )
}
