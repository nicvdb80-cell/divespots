import { RAJA_AMPAT_SITES, RAJA_AMPAT_AREAS } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params
  const areaData = RAJA_AMPAT_AREAS.find(a => a.slug === area)
  if (!areaData) return {}
  return {
    title: `${areaData.name} Dive Sites | Raja Ampat, Indonesia | Dive Spots`,
    description: `Dive sites in ${areaData.name}, Raja Ampat. ${areaData.desc}. ${areaData.count} dive sites.`,
  }
}

const AREA_INFO: Record<string,{desc:string;bestFor:string[];conditions:string;season:string;depth:string}> = {
  'kri-island':{desc:'Kri Island is the heartland of Raja Ampat diving and home to Cape Kri — the site that holds the world record for the most fish species counted on a single dive. The reefs surrounding Kri are extraordinarily healthy, with resident wobbegong sharks, pygmy seahorses, and huge schools of fish on every dive.',bestFor:['Reef biodiversity','Macro photography','All levels','Wobbegong sharks'],conditions:'Mild to moderate current, excellent visibility year-round',season:'Oct–Apr, accessible year-round',depth:'3–30m'},
  'dampier-strait':{desc:'The Dampier Strait is the underwater superhighway of Raja Ampat, connecting the Ceram Sea and Seram Sea and funnelling nutrient-rich upwellings past legendary sites like Manta Ridge and Blue Magic. This is where the big stuff happens — oceanic mantas, schooling hammerheads, and whale sharks.',bestFor:['Manta rays','Pelagics','Drift diving','Advanced divers'],conditions:'Strong to very strong current, exceptional visibility',season:'Oct–Apr',depth:'5–40m'},
  'gam-island':{desc:'Gam Island offers extraordinary diversity from the unique swim-through experience of The Passage to excellent macro diving in sheltered bays. The lush mangrove-fringed coastline creates nursery habitats for juvenile fish and rare invertebrates.',bestFor:['Macro diving','Passages','Beginners','Marine life'],conditions:'Variable — sheltered bays are calm, outer reefs have current',season:'Oct–Apr',depth:'1–28m'},
  'wayag':{desc:'Wayag is the iconic image of Raja Ampat — mushroom-shaped karst islands rising from turquoise lagoons. Below the surface, pristine walls and reefs host blacktip reef sharks, sea fans, and schools of fish in almost total seclusion. Accessible only by liveaboard.',bestFor:['Wall diving','Remote diving','Photography','Advanced divers'],conditions:'Moderate current, outstanding visibility',season:'Oct–Apr',depth:'5–40m+'},
  'penemu':{desc:'Penemu is home to some of Raja Ampat\'s most spectacular shallow coral gardens, including the legendary Melissa\'s Garden. The surrounding lagoons offer snorkelling and easy diving in strikingly clear water over a kaleidoscope of hard corals.',bestFor:['Coral gardens','Snorkelling','Beginners','Photography'],conditions:'Calm, excellent visibility',season:'Oct–Apr',depth:'2–18m'},
  'boo-islands':{desc:'The remote Boo Islands offer dramatic limestone wall diving with spectacular arches, swim-throughs, and caverns. The sea fans and black coral covering these walls are among the most pristine in the region.',bestFor:['Wall diving','Arches','Swim-throughs','Photography'],conditions:'Mild to moderate current, excellent visibility',season:'Oct–Apr',depth:'3–40m'},
  'four-kings':{desc:'The Four Kings (Batanta, Salawati, Waigeo, Misool) outer reefs offer deep wall diving with large pelagics, schooling fish, and pristine hard coral structures. A bucket-list area for experienced divers.',bestFor:['Deep walls','Pelagics','Big fish','Advanced divers'],conditions:'Moderate to strong current',season:'Oct–Apr',depth:'10–40m+'},
  'misool':{desc:'Misool in southern Raja Ampat is a marine conservation area with extraordinary soft coral density. Famous for its manta aggregations, healthy reef sharks, and the stunning Rainbow Rock dive site.',bestFor:['Soft coral','Manta rays','Reef sharks','Photography'],conditions:'Mild to moderate current, excellent visibility',season:'Oct–Apr',depth:'5–35m'},
}

export default async function RajaAmpatAreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params
  const areaData = RAJA_AMPAT_AREAS.find(a => a.slug === area)
  if (!areaData) notFound()
  const info = AREA_INFO[area] || {desc:areaData.desc,bestFor:[],conditions:'Check locally',season:'Oct–Apr',depth:'5–30m'}
  const sites = RAJA_AMPAT_SITES.filter(s => s.areaSlug === area)

  return (
    <main style={{minHeight:'100vh',background:'#fff'}}>
      <Navbar/>
      <div style={{background:'linear-gradient(135deg,#0a1628,#1e3a5f)',padding:'3rem 2rem',color:'#fff',borderBottom:'1px solid #1e3a5f'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{fontSize:11,color:'#60a5fa',marginBottom:8}}>
            <Link href="/" style={{color:'#475569'}}>Home</Link> › <Link href="/indonesia" style={{color:'#475569'}}>Indonesia</Link> › <Link href="/indonesia/raja-ampat" style={{color:'#475569'}}>Raja Ampat</Link> › {areaData.name}
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
              <Link key={site.slug} href={`/indonesia/raja-ampat/${site.areaSlug}/${site.slug}`} style={{display:'flex',gap:14,padding:'1.25rem',border:'1px solid #f1f5f9',borderRadius:12,background:'#fff',alignItems:'flex-start',textDecoration:'none'}}>
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
