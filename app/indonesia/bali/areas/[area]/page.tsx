import { BALI_SITES, BALI_AREAS } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

const AREA_INFO: Record<string,{desc:string;bestFor:string[];conditions:string;season:string;depth:string}> = {
  'tulamben':{desc:'Tulamben is home to the famous USAT Liberty Wreck — one of the most accessible wreck dives in the world. The black volcanic beach, calm waters, and diverse marine life make it a must-dive destination for all levels.',bestFor:['Wreck diving','Night diving','Macro photography','All levels'],conditions:'Calm, mild current, excellent visibility',season:'Year round, best Apr–Nov',depth:'3–30m'},
  'amed':{desc:'Amed is a laid-back fishing village with beautiful bays and excellent diving. Wall dives, reef slopes, and good macro life make Amed a favourite.',bestFor:['Wall diving','Reef diving','Macro life','Intermediate divers'],conditions:'Mild current, good visibility',season:'Apr–Nov',depth:'3–40m'},
  'nusa-penida':{desc:'Nusa Penida offers some of the most exhilarating diving in Southeast Asia. Famous for manta rays at Manta Point and Mola mola at Crystal Bay.',bestFor:['Manta rays','Mola mola','Big fish','Advanced divers'],conditions:'Strong current, cold thermoclines, excellent visibility',season:'Apr–Oct',depth:'5–40m'},
  'nusa-lembongan':{desc:'Nusa Lembongan offers a mix of reef and drift diving in a relaxed island setting. Close to Nusa Penida but generally calmer.',bestFor:['Reef diving','Drift diving','Marine life','Intermediate divers'],conditions:'Moderate current',season:'Apr–Oct',depth:'5–30m'},
  'padang-bai':{desc:'Padang Bai is Bali\'s eastern ferry port with excellent dive sites nearby. Blue Lagoon is a top beginner site.',bestFor:['Beginners','Reef diving','Turtles','Snorkelling'],conditions:'Calm, mild current',season:'Year round',depth:'2–25m'},
  'menjangan':{desc:'Menjangan Island in West Bali National Park is famous for its pristine vertical walls draped in sea fans and black coral.',bestFor:['Wall diving','Photography','Marine life','All levels'],conditions:'Mild current, crystal clear water',season:'Apr–Nov',depth:'3–40m'},
  'pemuteran':{desc:'Pemuteran is home to the world\'s largest Biorock reef restoration project.',bestFor:['Beginners','Conservation diving','Training'],conditions:'Calm, mild',season:'Year round',depth:'3–18m'},
  'gilimanuk':{desc:'Gilimanuk\'s Secret Bay is one of Asia\'s finest muck diving sites hiding hairy frogfish, ghost pipefish, and blue-ringed octopus.',bestFor:['Muck diving','Macro photography','Critters'],conditions:'Calm, mild',season:'Year round',depth:'2–15m'},
  'candidasa':{desc:'Candidasa offers reef and rock diving with reliable sightings of reef sharks, turtles, and schools of fish.',bestFor:['Reef diving','Marine life','Intermediate divers'],conditions:'Moderate current',season:'Apr–Nov',depth:'5–25m'},
}

export default async function AreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params
  const areaData = BALI_AREAS.find(a => a.slug === area)
  if (!areaData) notFound()
  const info = AREA_INFO[area] || {desc:areaData.desc,bestFor:[],conditions:'Check locally',season:'Apr–Nov',depth:'5–30m'}
  const sites = BALI_SITES.filter(s => s.areaSlug === area)
  return (
    <main style={{minHeight:'100vh',background:'#fff'}}>
      <Navbar/>
      <div style={{background:'linear-gradient(135deg,#0a1628,#1e3a5f)',padding:'3rem 2rem',color:'#fff',borderBottom:'1px solid #1e3a5f'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{fontSize:11,color:'#60a5fa',marginBottom:8}}>
            <Link href="/" style={{color:'#475569'}}>Home</Link> › <Link href="/indonesia" style={{color:'#475569'}}>Indonesia</Link> › <Link href="/indonesia/bali" style={{color:'#475569'}}>Bali</Link> › {areaData.name}
          </div>
          <h1 style={{fontSize:36,fontWeight:900,letterSpacing:-1,marginBottom:10}}>{areaData.name.toUpperCase()}</h1>
          <p style={{color:'#94a3b8',fontSize:14,lineHeight:1.7,maxWidth:600,marginBottom:'1.5rem'}}>{info.desc}</p>
          <div style={{display:'flex',gap:'2.5rem'}}>
            {[['Depth',info.depth],['Season',info.season],['Sites',`${areaData.count} dive sites`]].map(([k,v])=>(
              <div key={k}><div style={{fontSize:14,fontWeight:800}}>{v}</div><div style={{fontSize:10,color:'#475569',textTransform:'uppercase',letterSpacing:1}}>{k}</div></div>
            ))}
          </div>
        </div>
      </div>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'2rem'}}>
        <div style={{marginBottom:'2rem'}}>
          <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:10,letterSpacing:1}}>BEST FOR</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{info.bestFor.map(b=><span key={b} style={{fontSize:12,padding:'5px 14px',background:'#f1f5f9',borderRadius:20,color:'#374151'}}>{b}</span>)}</div>
        </div>
        <h2 style={{fontSize:20,fontWeight:900,color:'#0a1628',marginBottom:'1.25rem'}}>DIVE SITES IN {areaData.name.toUpperCase()}</h2>
        {sites.length>0 ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14}}>
            {sites.map(site=>(
              <Link key={site.slug} href={`/indonesia/bali/${site.areaSlug}/${site.slug}`} style={{display:'flex',gap:14,padding:'1.25rem',border:'1px solid #f1f5f9',borderRadius:12,background:'#fff',alignItems:'flex-start'}}>
                <div style={{width:36,height:36,background:'#0a1628',color:'#ef4444',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13,flexShrink:0}}>{site.rank}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,color:'#0a1628',marginBottom:4}}>{site.name}</div>
                  <div style={{fontSize:12,color:'#64748b',marginBottom:6}}>{site.type} · {site.minDepth}–{site.maxDepth}m · {site.difficulty}</div>
                  <div style={{display:'flex',gap:6}}>
                    <span style={{fontSize:10,padding:'2px 8px',background:'#f1f5f9',borderRadius:10,color:'#64748b'}}>{site.access}</span>
                    <span style={{fontSize:10,padding:'2px 8px',background:'#f1f5f9',borderRadius:10,color:'#64748b'}}>{site.minCert}</span>
                  </div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontSize:13,color:'#f59e0b',fontWeight:700}}>★ {site.rating}</div>
                  <div style={{fontSize:11,color:'#94a3b8'}}>{site.reviews} reviews</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{padding:'2rem',background:'#f8fafc',borderRadius:12,textAlign:'center',color:'#64748b'}}>More sites coming soon. <Link href="/submit-dive-site" style={{color:'#2563eb'}}>Submit one →</Link></div>
        )}
      </div>
      <footer style={{background:'#0a1628',color:'#475569',padding:'2rem',textAlign:'center',fontSize:12,marginTop:'2rem',borderTop:'1px solid #1e3a5f'}}>© 2026 Dive Spots. All rights reserved.</footer>
    </main>
  )
}
