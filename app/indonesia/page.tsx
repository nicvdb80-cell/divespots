import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { BALI_AREAS } from '@/lib/data'
export const metadata = { title: 'Indonesia Dive Sites | Dive Spots', description: 'Explore dive sites in Indonesia — Bali, Raja Ampat, Komodo, Lombok and more.' }
export default function IndonesiaPage() {
  return (
    <main style={{minHeight:'100vh',background:'#fff'}}>
      <Navbar/>
      <div style={{background:'linear-gradient(135deg,#0a1628,#1e3a5f)',padding:'3rem 2rem',color:'#fff',borderBottom:'1px solid #1e3a5f'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{fontSize:11,color:'#60a5fa',marginBottom:8}}><Link href="/destinations" style={{color:'#475569'}}>Destinations</Link> › Indonesia</div>
          <div style={{fontSize:11,letterSpacing:2,color:'#60a5fa',marginBottom:10}}>🇮🇩 INDONESIA</div>
          <h1 style={{fontSize:36,fontWeight:900,letterSpacing:-1,marginBottom:10}}>INDONESIA</h1>
          <p style={{color:'#64748b',fontSize:14,lineHeight:1.7,maxWidth:540}}>Home to the Coral Triangle — the most biodiverse marine region on earth. From Bali's famous wrecks to Raja Ampat's pristine reefs and Komodo's dramatic drift dives.</p>
        </div>
      </div>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'3rem 2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
          {[
            {slug:'bali',name:'Bali',desc:'Wrecks, walls, mantas, and muck diving',sites:'120+',live:true},
            {slug:'raja-ampat',name:'Raja Ampat',desc:'The most biodiverse reef system on earth',sites:'200+',live:true},
            {slug:'komodo',name:'Komodo',desc:'Dramatic drift dives and manta aggregations',sites:'50+',live:false},
          ].map(r=>(
            <div key={r.slug} style={{background:r.live?'linear-gradient(135deg,#0a1628,#1e3a5f)':'#f8fafc',borderRadius:14,padding:'1.5rem',border:r.live?'none':'1px solid #e2e8f0',position:'relative'}}>
              <span style={{position:'absolute',top:12,left:12,fontSize:10,padding:'3px 8px',borderRadius:20,fontWeight:700,background:r.live?'#22c55e':'#e2e8f0',color:r.live?'#fff':'#94a3b8'}}>{r.live?'● Live':'Coming soon'}</span>
              <div style={{marginTop:28}}>
                <div style={{fontSize:18,fontWeight:900,color:r.live?'#fff':'#94a3b8',marginBottom:6}}>{r.name}</div>
                <p style={{fontSize:12,color:r.live?'#94a3b8':'#64748b',marginBottom:10}}>{r.desc}</p>
                {r.live ? <Link href={`/indonesia/${r.slug}`} style={{fontSize:12,color:'#60a5fa',fontWeight:600}}>Explore {r.sites} sites →</Link> : <span style={{fontSize:11,color:'#475569'}}>{r.sites} sites · Coming soon</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer style={{background:'#0a1628',color:'#475569',padding:'2rem',textAlign:'center',fontSize:12,borderTop:'1px solid #1e3a5f'}}>© 2026 Dive Spots. All rights reserved.</footer>
    </main>
  )
}
