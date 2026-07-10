import Navbar from '@/components/Navbar'
import Link from 'next/link'
export const metadata = { title: 'Dive Destinations | Dive Spots', description: 'Explore dive destinations worldwide — Indonesia, Philippines, Thailand, Maldives, Australia, Egypt and more.' }
const countries = [
  {slug:'indonesia',name:'Indonesia',sub:'Bali · Raja Ampat · Komodo',desc:'Home to the Coral Triangle and the most diverse marine life on earth.',count:'600+',live:true},
  {slug:'philippines',name:'Philippines',sub:'Tubbataha · Coron · Apo Island',desc:'World-class wrecks, walls, and whale sharks across 7,600 islands.',count:'500+',live:false},
  {slug:'thailand',name:'Thailand',sub:'Similan Islands · Koh Tao · Richelieu Rock',desc:'Whale sharks, manta rays, and pristine reefs in the Andaman Sea.',count:'200+',live:false},
  {slug:'maldives',name:'Maldives',sub:'North Malé · Baa Atoll · Ari Atoll',desc:'Mantas, whale sharks, and drift diving across pristine atolls.',count:'300+',live:false},
  {slug:'australia',name:'Australia',sub:'Great Barrier Reef · Coral Sea · Ningaloo',desc:'The Great Barrier Reef and world-class liveaboard destinations.',count:'400+',live:false},
  {slug:'egypt',name:'Egypt',sub:'Ras Mohammed · Brothers · Daedalus',desc:'Red Sea wrecks, hammerheads, and walls in crystal-clear water.',count:'150+',live:false},
]
export default function DestinationsPage() {
  return (
    <main style={{minHeight:'100vh',background:'#fff'}}>
      <Navbar/>
      <div style={{background:'#020d1a url(/hero-bg.png) center center / cover no-repeat',padding:'3rem 2rem',color:'#fff',borderBottom:'1px solid #1e3a5f'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <p style={{fontSize:11,letterSpacing:3,color:'#60a5fa',marginBottom:10,textTransform:'uppercase'}}>Dive Destinations</p>
          <h1 style={{fontSize:36,fontWeight:900,letterSpacing:-1,marginBottom:10}}>EXPLORE BY COUNTRY</h1>
          <p style={{color:'#64748b',fontSize:14,lineHeight:1.7,maxWidth:540}}>Professional dive site guides for every destination — updated by divers, reviewed by our admin team.</p>
        </div>
      </div>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'3rem 2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
          {countries.map(c=>(
            <div key={c.slug} style={{background:c.live?'linear-gradient(135deg,#0a1628,#1e3a5f)':'#f8fafc',borderRadius:16,padding:'1.75rem',border:c.live?'none':'1px solid #e2e8f0',position:'relative',overflow:'hidden'}}>
              <span style={{position:'absolute',top:12,left:12,fontSize:10,padding:'3px 10px',borderRadius:20,fontWeight:700,background:c.live?'#22c55e':'#e2e8f0',color:c.live?'#fff':'#94a3b8'}}>{c.live?'● Live':'Coming soon'}</span>
              <div style={{marginTop:28}}>
                <div style={{fontSize:10,letterSpacing:2,color:c.live?'#60a5fa':'#94a3b8',marginBottom:4,textTransform:'uppercase'}}>{c.sub}</div>
                <div style={{fontSize:20,fontWeight:900,color:c.live?'#fff':'#cbd5e1',marginBottom:8}}>{c.name.toUpperCase()}</div>
                <p style={{fontSize:12,color:c.live?'#94a3b8':'#64748b',lineHeight:1.6,marginBottom:12}}>{c.desc}</p>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:11,color:c.live?'#475569':'#94a3b8'}}>{c.count} dive sites</span>
                  {c.live ? <Link href={`/${c.slug}`} style={{fontSize:12,color:'#60a5fa',fontWeight:600}}>Explore →</Link> : <span style={{fontSize:12,color:'#475569'}}>Coming soon</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer style={{background:'#0a1628',color:'#475569',padding:'2rem',textAlign:'center',fontSize:12,borderTop:'1px solid #1e3a5f'}}>© 2026 Dive Spots. All rights reserved.</footer>
    </main>
  )
}
