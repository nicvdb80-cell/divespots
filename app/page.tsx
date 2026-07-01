import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { BALI_SITES } from '@/lib/data'
export const metadata = { title: 'Dive Spots — World Dive Site Database', description: 'Professional dive site guides for divers and divemasters. Verified information, divemaster diagrams, marine life data, and diver experiences — country by country.' }
const countries = [
  {slug:'indonesia',name:'INDONESIA',sub:'Bali · Raja Ampat · Komodo',desc:'Home to the Coral Triangle and some of the most diverse marine life on earth.',count:'600+',live:true},
  {slug:'philippines',name:'PHILIPPINES',sub:'Tubbataha · Coron · Apo Island',desc:'World-class wrecks, walls, and whale sharks across 7,600 islands.',count:'500+',live:false},
  {slug:'thailand',name:'THAILAND',sub:'Similan Islands · Koh Tao · Richelieu Rock',desc:'Whale sharks, manta rays, and pristine reefs in the Andaman Sea.',count:'200+',live:false},
  {slug:'maldives',name:'MALDIVES',sub:'North Malé · Baa Atoll · Ari Atoll',desc:'Mantas, whale sharks, and drift diving across pristine atolls.',count:'300+',live:false},
  {slug:'australia',name:'AUSTRALIA',sub:'Great Barrier Reef · Coral Sea · Ningaloo',desc:'The Great Barrier Reef and world-class liveaboard destinations.',count:'400+',live:false},
  {slug:'egypt',name:'EGYPT',sub:'Ras Mohammed · Brothers · Daedalus',desc:'Red Sea wrecks, hammerheads, and walls in crystal-clear water.',count:'150+',live:false},
]
const featured = ['usat-liberty-wreck','manta-point','crystal-bay','menjangan-wall','secret-bay-gilimanuk']
export default function Home() {
  const featuredSites = BALI_SITES.filter(s=>featured.includes(s.slug))
  return (
    <main style={{minHeight:'100vh',background:'#fff'}}>
      <Navbar/>
      <div style={{background:'linear-gradient(135deg,#0a1628 0%,#0d2845 50%,#0a1628 100%)',padding:'6rem 2rem 5rem',color:'#fff',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,opacity:0.03,backgroundImage:'radial-gradient(#fff 1px,transparent 1px)',backgroundSize:'32px 32px'}}/>
        <div style={{maxWidth:1100,margin:'0 auto',position:'relative'}}>
          <p style={{fontSize:11,letterSpacing:3,color:'#60a5fa',marginBottom:20,textTransform:'uppercase'}}>World dive site database</p>
          <h1 style={{fontSize:64,fontWeight:900,letterSpacing:-2,marginBottom:20,lineHeight:1,textTransform:'uppercase'}}>EXPLORE THE OCEAN</h1>
          <p style={{fontSize:16,color:'#94a3b8',maxWidth:560,marginBottom:'2.5rem',lineHeight:1.7}}>Professional dive site guides for divers and divemasters. Verified information, divemaster diagrams, marine life data, and diver experiences — country by country.</p>
          <div style={{display:'flex',gap:12,marginBottom:'4rem'}}>
            <Link href="/indonesia/bali" style={{padding:'14px 32px',background:'#ef4444',color:'#fff',borderRadius:8,fontWeight:800,fontSize:14,letterSpacing:0.5,textTransform:'uppercase'}}>Explore Bali</Link>
            <Link href="/map" style={{padding:'14px 32px',border:'2px solid #1e3a5f',color:'#94a3b8',borderRadius:8,fontWeight:700,fontSize:14}}>View dive map</Link>
            <Link href="/submit-dive-site" style={{padding:'14px 32px',border:'2px solid #1e3a5f',color:'#94a3b8',borderRadius:8,fontWeight:700,fontSize:14}}>Submit dive site</Link>
          </div>
          <div style={{display:'flex',gap:'4rem'}}>
            {[['1,200+','Dive sites'],['6','Countries'],['400+','Marine species'],['20','Expert dive guides']].map(([n,l])=>(
              <div key={l}><div style={{fontSize:32,fontWeight:900}}>{n}</div><div style={{fontSize:11,color:'#475569',letterSpacing:2,textTransform:'uppercase',marginTop:2}}>{l}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:'#f8fafc',padding:'4rem 2rem'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'2rem'}}>
            <div>
              <p style={{fontSize:11,letterSpacing:2,color:'#94a3b8',marginBottom:6,textTransform:'uppercase'}}>Dive destinations</p>
              <h2 style={{fontSize:28,fontWeight:900,color:'#0a1628',letterSpacing:-0.5}}>EXPLORE BY COUNTRY</h2>
            </div>
            <Link href="/destinations" style={{fontSize:13,color:'#2563eb',fontWeight:500}}>View all on map →</Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {countries.map(c=>(
              <Link key={c.slug} href={c.live?`/${c.slug}`:`/destinations`} style={{background:c.live?'linear-gradient(135deg,#0a1628,#1e3a5f)':'#fff',borderRadius:16,padding:'1.75rem',color:c.live?'#fff':'#0a1628',border:c.live?'none':'1px solid #e2e8f0',display:'block',position:'relative',overflow:'hidden'}}>
                <span style={{position:'absolute',top:12,left:12,fontSize:10,padding:'3px 10px',borderRadius:20,fontWeight:700,background:c.live?'#22c55e':'#e2e8f0',color:c.live?'#fff':'#94a3b8'}}>{c.live?'● Live':'Coming soon'}</span>
                <div style={{marginTop:28}}>
                  <div style={{fontSize:10,letterSpacing:2,color:c.live?'#60a5fa':'#94a3b8',marginBottom:4,textTransform:'uppercase'}}>{c.sub}</div>
                  <div style={{fontSize:20,fontWeight:900,marginBottom:8}}>{c.name}</div>
                  <p style={{fontSize:12,color:c.live?'#94a3b8':'#64748b',lineHeight:1.6,marginBottom:12}}>{c.desc}</p>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:11,color:c.live?'#475569':'#94a3b8'}}>{c.count} dive sites</span>
                    <span style={{fontSize:12,color:c.live?'#60a5fa':'#475569',fontWeight:600}}>{c.live?'Explore →':'Learn more →'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:'#fff',padding:'4rem 2rem'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{marginBottom:'2rem'}}>
            <p style={{fontSize:11,letterSpacing:2,color:'#94a3b8',marginBottom:6,textTransform:'uppercase'}}>Top-rated sites</p>
            <h2 style={{fontSize:28,fontWeight:900,color:'#0a1628',letterSpacing:-0.5}}>FEATURED DIVE SITES</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:'2rem'}}>
            {featuredSites.map(site=>(
              <Link key={site.slug} href={`/indonesia/bali/${site.areaSlug}/${site.slug}`} style={{background:'linear-gradient(135deg,#0a1628,#1e3a5f)',borderRadius:12,padding:'1.25rem',color:'#fff',display:'block'}}>
                <div style={{fontSize:10,padding:'2px 8px',background:'rgba(255,255,255,0.08)',borderRadius:10,color:'#94a3b8',display:'inline-block',marginBottom:8}}>{site.type}</div>
                <div style={{fontSize:14,fontWeight:700,marginBottom:4,lineHeight:1.3}}>{site.name}</div>
                <div style={{fontSize:11,color:'#60a5fa',marginBottom:8}}>{site.area}, Bali</div>
                <div style={{fontSize:12,color:'#f59e0b'}}>{'★'.repeat(Math.round(site.rating))} {site.rating}</div>
              </Link>
            ))}
          </div>
          <div style={{textAlign:'center'}}>
            <Link href="/indonesia/bali/top-20-dive-sites" style={{display:'inline-block',padding:'10px 28px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:13,color:'#0a1628',fontWeight:600}}>View Top 20 Bali dive sites →</Link>
          </div>
        </div>
      </div>

      <footer style={{background:'#0a1628',color:'#475569',padding:'2rem 2rem'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'2rem',marginBottom:'1.5rem'}}>
            {[['Explore dive sites worldwide','Country by country'],['Share diver experiences','Help the dive community'],['Accurate information','Updated by divers, reviewed by admins'],['Safety first','Dive smart, dive safe']].map(([t,s])=>(
              <div key={t}><div style={{fontSize:13,fontWeight:600,color:'#94a3b8',marginBottom:4}}>{t}</div><div style={{fontSize:12,color:'#475569'}}>{s}</div></div>
            ))}
          </div>
          <div style={{borderTop:'1px solid #1e3a5f',paddingTop:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:12}}>© 2026 Dive Spots. All rights reserved.</span>
            <div style={{display:'flex',gap:'1.5rem'}}>
              {[['About','/about'],['Privacy','/privacy'],['Contact','/contact']].map(([l,h])=><Link key={l} href={h} style={{fontSize:12,color:'#475569'}}>{l}</Link>)}
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
