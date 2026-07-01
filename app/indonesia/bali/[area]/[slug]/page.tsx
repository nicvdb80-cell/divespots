import { BALI_SITES, getSiteBySlug } from '@/lib/data'
import Navbar from '@/components/Navbar'
import DiveDiagram from '@/components/DiveDiagram'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return BALI_SITES.map(s => ({ area: s.areaSlug, slug: s.slug }))
}
export async function generateMetadata({ params }: { params: { area: string; slug: string } }) {
  const site = getSiteBySlug(params.slug)
  if (!site) return {}
  return {
    title: `${site.name} Dive Site Guide | ${site.area}, Bali, Indonesia | Dive Spots`,
    description: `Complete diver guide to ${site.name} in ${site.area}, Bali. Depth ${site.minDepth}–${site.maxDepth}m, visibility ${site.visibility}, ${site.access.toLowerCase()} access. Marine life, safety notes, dive briefing diagram, and diver experiences.`,
    keywords: `${site.name}, ${site.area} diving, Bali dive sites, Indonesia scuba, ${site.type.toLowerCase()}`,
  }
}

const freqColor = (f:string) => ({
  'very common':'#16a34a','common':'#2563eb','occasional':'#d97706','seasonal':'#7c3aed','rare':'#dc2626','Early morning':'#0891b2'
}[f]||'#64748b')

const REVIEWS: Record<string, {initials:string;name:string;cert:string;rating:number;date:string;text:string;vis:string;current:string;helpful:number}[]> = {
  'usat-liberty-wreck': [
    {initials:'ME',name:'MarineExplorer',cert:'Advanced Open Water',rating:5,date:'May 12, 2024',text:'Still one of the best wreck dives I have done. Early morning is the way to go for visibility and fewer divers. The turtles are completely unbothered.',vis:'20m+',current:'Mild',helpful:12},
    {initials:'DN',name:'DiveNomad',cert:'Divemaster',rating:5,date:'Apr 30, 2024',text:'Guided my 200th dive here. Saw bumphead parrotfish at dawn and a school of jacks so dense we could barely see through them.',vis:'18m',current:'Mild',helpful:19},
    {initials:'OA',name:'OceanAddict',cert:'Open Water',rating:4,date:'Apr 18, 2024',text:'My first wreck dive. Entry over the stones was challenging but worth it. SMB is needed — the safety stop gets busy mid-morning.',vis:'15m',current:'Moderate',helpful:7},
  ]
}

export default function DiveSitePage({ params }: { params: { area: string; slug: string } }) {
  const site = getSiteBySlug(params.slug)
  if (!site) notFound()
  const nearby = BALI_SITES.filter(s => s.areaSlug === site.areaSlug && s.slug !== site.slug).slice(0,3)
  const reviews = REVIEWS[site.slug] || []

  return (
    <main style={{minHeight:'100vh',background:'#fff'}}>
      <Navbar />
      <div style={{display:'grid',gridTemplateColumns:'240px 1fr',minHeight:'calc(100vh - 60px)'}}>

        {/* Sidebar */}
        <aside style={{background:'#0a1628',borderRight:'1px solid #1e3a5f',overflowY:'auto',maxHeight:'calc(100vh - 60px)',position:'sticky',top:60}}>
          <div style={{padding:'1rem',borderBottom:'1px solid #1e3a5f'}}>
            <div style={{fontSize:10,color:'#475569',marginBottom:2}}>Indonesia</div>
            <div style={{fontSize:15,fontWeight:800,color:'#fff'}}>BALI🇮🇩</div>
            <div style={{fontSize:10,color:'#475569',marginTop:2}}>Top 20 dive sites to explore in Bali</div>
          </div>
          <div style={{padding:'0.5rem 0'}}>
            {BALI_SITES.map(s=>(
              <Link key={s.slug} href={`/indonesia/bali/${s.areaSlug}/${s.slug}`} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 14px',borderLeft:s.slug===site.slug?'3px solid #ef4444':'3px solid transparent',background:s.slug===site.slug?'#1e3a5f':'none'}}>
                <span style={{fontSize:11,color:s.slug===site.slug?'#ef4444':'#334155',minWidth:18,fontWeight:700}}>{s.rank}</span>
                <span style={{fontSize:12,color:s.slug===site.slug?'#fff':'#64748b',fontWeight:s.slug===site.slug?700:400,lineHeight:1.3}}>{s.name}</span>
              </Link>
            ))}
          </div>
          <div style={{borderTop:'1px solid #1e3a5f',padding:'1rem'}}>
            <Link href="/indonesia/bali" style={{display:'block',fontSize:12,color:'#60a5fa',marginBottom:'1rem'}}>View all sites in Bali →</Link>
            <div style={{background:'#0d1b2e',borderRadius:10,padding:'0.875rem'}}>
              <div style={{fontSize:12,fontWeight:700,color:'#fff',marginBottom:4}}>Know a dive site we're missing?</div>
              <p style={{fontSize:11,color:'#475569',marginBottom:8,lineHeight:1.5}}>Help fellow divers by contributing. All submissions are reviewed by admin before publishing.</p>
              <Link href="/submit" style={{display:'block',background:'#16a34a',color:'#fff',padding:'7px 10px',borderRadius:7,fontSize:11,fontWeight:700,textAlign:'center'}}>Submit a dive site</Link>
              <div style={{fontSize:10,color:'#334155',marginTop:6,textAlign:'center'}}>Reviewed by admin before publishing</div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div style={{overflowY:'auto'}}>
          {/* Bali hero bar */}
          <div style={{background:'linear-gradient(135deg,#0a1628,#1e3a5f)',padding:'1.25rem 2rem',borderBottom:'1px solid #e2e8f0'}}>
            <div style={{fontSize:11,color:'#94a3b8',marginBottom:4}}>Home › Indonesia › Bali</div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:20,fontWeight:900,color:'#fff',letterSpacing:-0.5}}>BALI</div>
                <div style={{fontSize:11,color:'#60a5fa',marginTop:2}}>🇮🇩 Indonesia</div>
              </div>
              <div style={{fontSize:12,color:'#94a3b8',maxWidth:400,lineHeight:1.5}}>Bali offers world-class diving for every level — from historic wrecks and volcanic reefs to manta rays, drift dives, macro life, and beginner-friendly bays.</div>
            </div>
            <div style={{display:'flex',gap:'2rem',marginTop:'1rem'}}>
              {[['120+','Dive sites'],['27–29°C','Water temp'],['15–40m+','Max depth'],['10–30m','Visibility'],['Apr – Nov','Best season']].map(([n,l])=>(
                <div key={l}><div style={{fontSize:16,fontWeight:800,color:'#fff'}}>{n}</div><div style={{fontSize:10,color:'#475569',textTransform:'uppercase',letterSpacing:1}}>{l}</div></div>
              ))}
            </div>
          </div>

          {/* Area strip */}
          <div style={{background:'#f8fafc',borderBottom:'1px solid #e2e8f0',padding:'0.75rem 2rem',display:'flex',gap:8,overflowX:'auto'}}>
            <div style={{fontSize:11,color:'#94a3b8',marginRight:4,whiteSpace:'nowrap',alignSelf:'center'}}>Explore dive areas in Bali</div>
            {[['tulamben','Tulamben','23'],['amed','Amed','19'],['nusa-penida','Nusa Penida','28'],['nusa-lembongan','Nusa Lembongan','12'],['padang-bai','Padang Bai','15'],['menjangan','Menjangan','18'],['pemuteran','Pemuteran','9'],['gilimanuk','Secret Bay','7'],['candidasa','Candidasa','11']].map(([slug,name,count])=>(
              <Link key={slug} href={`/indonesia/bali/${slug}`} style={{padding:'6px 12px',background:site.areaSlug===slug?'#0a1628':'#fff',border:'1px solid '+(site.areaSlug===slug?'#0a1628':'#e2e8f0'),borderRadius:8,fontSize:11,fontWeight:600,whiteSpace:'nowrap',color:site.areaSlug===slug?'#fff':'#475569',flexShrink:0}}>
                {name}<span style={{display:'block',fontSize:10,color:site.areaSlug===slug?'#60a5fa':'#94a3b8',fontWeight:400}}>{count} dive sites</span>
              </Link>
            ))}
          </div>

          <div style={{padding:'1.5rem 2rem',display:'grid',gridTemplateColumns:'1fr 300px',gap:'1.5rem',alignItems:'start'}}>
            {/* Left col */}
            <div>
              {/* Site header */}
              <div style={{marginBottom:'1.5rem'}}>
                <div style={{display:'flex',gap:8,marginBottom:10}}>
                  <span style={{fontSize:11,padding:'3px 10px',background:'#0a1628',color:'#fff',borderRadius:4,fontWeight:700}}>#{site.rank} in Bali</span>
                  <span style={{fontSize:11,padding:'3px 10px',background:'#dbeafe',color:'#1d4ed8',borderRadius:4,fontWeight:600}}>Admin verified</span>
                  <button style={{fontSize:11,padding:'3px 10px',border:'1px solid #e2e8f0',color:'#64748b',borderRadius:4,background:'none',cursor:'pointer',marginLeft:'auto'}}>Save dive site</button>
                </div>
                <div style={{fontSize:11,color:'#94a3b8',marginBottom:6}}>Indonesia › Bali › {site.area} › {site.name}</div>
                <h1 style={{fontSize:32,fontWeight:900,color:'#0a1628',letterSpacing:-1,marginBottom:8,textTransform:'uppercase'}}>{site.name}</h1>
                <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap',marginBottom:8}}>
                  <span style={{fontSize:13,color:'#64748b'}}>📍 {site.area}, Bali, Indonesia</span>
                  <span style={{fontSize:13,color:'#64748b'}}>✈ {Math.abs(site.lat).toFixed(4)}° S {site.lng.toFixed(4)}° E</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{color:'#f59e0b',fontSize:16}}>{'★'.repeat(Math.round(site.rating))}</span>
                  <span style={{fontWeight:700,fontSize:15}}>{site.rating}</span>
                  <span style={{color:'#94a3b8',fontSize:13}}>{site.reviews} reviews</span>
                </div>
              </div>

              <p style={{fontSize:14,color:'#374151',lineHeight:1.8,marginBottom:'1.5rem'}}>{site.description}</p>

              {/* Quick stats grid */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:'1.5rem'}}>
                {[['Dive type',site.type],['Current',site.current],['Access',site.access],['Water temp',site.temp],['Min depth',site.minDepth+'m'],['Best time',site.bestTime],['Max depth',site.maxDepth+'m'],['Certification',site.minCert],['Avg depth',site.avgDepth+'m'],['Visibility',site.visibility],['Difficulty',site.difficulty],['Best season',site.bestSeason]].map(([k,v])=>(
                  <div key={k} style={{padding:'10px 12px',background:'#f8fafc',borderRadius:8,border:'1px solid #f1f5f9'}}>
                    <div style={{fontSize:10,color:'#94a3b8',marginBottom:3,textTransform:'uppercase',letterSpacing:0.5}}>{k}</div>
                    <div style={{fontSize:13,fontWeight:600,color:'#0f172a'}}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Good for */}
              <div style={{marginBottom:'1.5rem'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:8,letterSpacing:1}}>GOOD FOR</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {site.goodFor.map(g=><span key={g} style={{fontSize:12,padding:'4px 12px',background:'#f1f5f9',borderRadius:20,color:'#374151'}}>{g}</span>)}
                </div>
              </div>

              {/* Facilities */}
              <div style={{marginBottom:'1.5rem'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:8,letterSpacing:1}}>FACILITIES</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {site.facilities.map(f=><span key={f} style={{fontSize:12,padding:'4px 12px',background:'#f1f5f9',borderRadius:20,color:'#374151'}}>{f}</span>)}
                </div>
              </div>

              {/* Marine life */}
              <div style={{marginBottom:'1.5rem'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:10,letterSpacing:1}}>MARINE LIFE YOU MAY SEE</div>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  {site.marineLife.map(m=>(
                    <div key={m.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',background:'#f8fafc',borderRadius:8,border:'1px solid #f1f5f9'}}>
                      <span style={{fontSize:13,color:'#0f172a'}}>{m.name}</span>
                      <span style={{fontSize:11,fontWeight:700,color:freqColor(m.frequency)}}>{m.frequency}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety */}
              <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:12,padding:'1.25rem',marginBottom:'1.5rem'}}>
                <div style={{fontSize:13,fontWeight:700,color:'#92400e',marginBottom:10}}>Safety notes</div>
                {site.safetyNotes.map(n=><div key={n} style={{fontSize:13,color:'#78350f',marginBottom:6,paddingLeft:12,position:'relative'}}>· {n}</div>)}
                <div style={{fontSize:12,color:'#92400e',marginTop:10,paddingTop:8,borderTop:'1px solid #fde68a'}}>{site.emergencyContact}</div>
              </div>

              {/* Briefing */}
              <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:12,padding:'1.25rem',marginBottom:'1.5rem'}}>
                <div style={{fontSize:13,fontWeight:700,color:'#1d4ed8',marginBottom:10}}>Dive briefing</div>
                <p style={{fontSize:13,color:'#1e40af',lineHeight:1.7}}>{site.briefing}</p>
              </div>

              {/* Contribute */}
              <div style={{marginBottom:'1.5rem'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:10,letterSpacing:1}}>CONTRIBUTE TO THIS DIVE SITE</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {['Add your experience','Submit correction','Report safety update','Add marine life sighting'].map(a=>(
                    <Link key={a} href="/submit" style={{fontSize:12,padding:'7px 14px',border:'1px solid #e2e8f0',borderRadius:8,color:'#2563eb',fontWeight:500}}>+ {a}</Link>
                  ))}
                </div>
              </div>

              {/* Tabs + Diagram */}
              <div style={{marginBottom:'1.5rem'}}>
                <div style={{borderBottom:'2px solid #f1f5f9',display:'flex',gap:0,marginBottom:'1.5rem'}}>
                  {['Dive site diagram','Details','Tips','Reviews','Photos'].map((t,i)=>(
                    <div key={t} style={{padding:'10px 16px',fontSize:12,fontWeight:700,cursor:'pointer',color:i===0?'#0a1628':'#94a3b8',borderBottom:i===0?'2px solid #0a1628':'none',marginBottom:-2}}>{t}</div>
                  ))}
                </div>
                <div style={{background:'#0a1628',borderRadius:12,overflow:'hidden',marginBottom:'1rem'}}>
                  <DiveDiagram site={site}/>
                </div>
              </div>

              {/* Reviews */}
              {reviews.length > 0 && (
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:12,letterSpacing:1}}>DIVER EXPERIENCES ({site.reviews})</div>
                  {reviews.map((r,i)=>(
                    <div key={i} style={{border:'1px solid #f1f5f9',borderRadius:12,padding:'1.25rem',marginBottom:10}}>
                      <div style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:8}}>
                        <div style={{width:36,height:36,background:'#0a1628',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'#fff',flexShrink:0}}>{r.initials}</div>
                        <div style={{flex:1}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                            <div style={{fontWeight:700,fontSize:13}}>{r.name}</div>
                            <span style={{fontSize:11,color:'#f59e0b'}}>{'★'.repeat(r.rating)}</span>
                          </div>
                          <div style={{fontSize:11,color:'#94a3b8'}}>{r.date} · {r.cert}</div>
                        </div>
                      </div>
                      <p style={{fontSize:13,color:'#374151',lineHeight:1.6,marginBottom:8}}>{r.text}</p>
                      <div style={{display:'flex',gap:12}}>
                        <span style={{fontSize:11,color:'#64748b'}}>Visibility: {r.vis}</span>
                        <span style={{fontSize:11,color:'#64748b'}}>Current: {r.current}</span>
                        <span style={{fontSize:11,color:'#94a3b8',marginLeft:'auto'}}>Helpful ({r.helpful})</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right col */}
            <div>
              {/* Map placeholder */}
              <div style={{background:'#f1f5f9',borderRadius:12,height:140,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12,border:'1px solid #e2e8f0',color:'#94a3b8',fontSize:12,flexDirection:'column',gap:6}}>
                <span>🗺️</span>
                <div style={{display:'flex',gap:8}}>
                  <Link href="/map" style={{fontSize:11,color:'#2563eb',fontWeight:500}}>View on map</Link>
                  <span style={{color:'#e2e8f0'}}>·</span>
                  <span style={{fontSize:11,color:'#2563eb',cursor:'pointer'}}>Get directions</span>
                </div>
              </div>

              {/* Quick info */}
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:12,padding:'1.25rem',marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:12,letterSpacing:1}}>QUICK INFO</div>
                {[['Location',`${site.area}, Bali`],['Type',site.type],['Access',site.access],['Depth',`${site.minDepth}m – ${site.maxDepth}m`],['Avg depth',`${site.avgDepth}m`],['Visibility',site.visibility],['Water temp',site.temp],['Difficulty',site.difficulty],['Best time',site.bestTime],['Currents',site.current]].map(([k,v])=>(
                  <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #f8fafc',fontSize:12}}>
                    <span style={{color:'#94a3b8'}}>{k}</span>
                    <span style={{color:'#0f172a',fontWeight:600,textAlign:'right',maxWidth:160}}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Info status */}
              <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:12,padding:'1.25rem',marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:'#15803d',marginBottom:8}}>INFORMATION STATUS</div>
                <div style={{fontSize:12,color:'#166534',marginBottom:4}}>Status: <strong>Admin reviewed</strong></div>
                <div style={{fontSize:12,color:'#166534',marginBottom:4}}>Verified by: Local dive professionals, {site.area}</div>
                <div style={{fontSize:12,color:'#166534',marginBottom:10}}>Last updated: July 2026</div>
                <Link href="/submit" style={{fontSize:11,color:'#16a34a',fontWeight:600}}>Submit correction →</Link>
              </div>

              {/* Reviews snapshot */}
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:12,padding:'1.25rem'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:12,letterSpacing:1}}>REVIEWS SNAPSHOT</div>
                <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}>
                  <div style={{fontSize:36,fontWeight:900,color:'#0a1628'}}>{site.rating}</div>
                  <div>
                    <div style={{color:'#f59e0b',fontSize:16}}>{'★'.repeat(Math.round(site.rating))}</div>
                    <div style={{fontSize:11,color:'#94a3b8'}}>Based on {site.reviews} reviews</div>
                  </div>
                </div>
                {[5,4,3,2,1].map(s=>(
                  <div key={s} style={{display:'flex',gap:8,alignItems:'center',marginBottom:4}}>
                    <span style={{fontSize:11,color:'#94a3b8',minWidth:8}}>{s}</span>
                    <div style={{flex:1,height:6,background:'#f1f5f9',borderRadius:3}}>
                      <div style={{height:6,background:'#f59e0b',borderRadius:3,width:s===5?'80%':s===4?'15%':'0%'}}/>
                    </div>
                    <span style={{fontSize:11,color:'#94a3b8',minWidth:12}}>{s===5?Math.round(site.reviews*0.8):s===4?Math.round(site.reviews*0.15):0}</span>
                  </div>
                ))}
                <Link href="/submit" style={{display:'block',marginTop:12,fontSize:12,color:'#2563eb',fontWeight:500}}>Read all reviews →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer style={{background:'#0a1628',color:'#475569',padding:'2rem',borderTop:'1px solid #1e3a5f'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'2rem',marginBottom:'1.5rem'}}>
          {[['Explore dive sites worldwide','Country by country'],['Share diver experiences','Help the dive community'],['Accurate information','Updated by divers, reviewed by admins'],['Safety first','Dive smart, dive safe']].map(([t,s])=>(
            <div key={t}><div style={{fontSize:12,fontWeight:600,color:'#94a3b8',marginBottom:3}}>{t}</div><div style={{fontSize:11}}>{s}</div></div>
          ))}
        </div>
        <div style={{borderTop:'1px solid #1e3a5f',paddingTop:'1rem',display:'flex',justifyContent:'space-between'}}>
          <span style={{fontSize:12}}>© 2026 Dive Spots. All rights reserved.</span>
          <div style={{display:'flex',gap:'1rem'}}>
            {['About','Privacy','Contact'].map(l=><Link key={l} href="/" style={{fontSize:12,color:'#475569'}}>{l}</Link>)}
          </div>
        </div>
      </footer>
    </main>
  )
}
