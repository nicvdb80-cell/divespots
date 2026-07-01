'use client'
import { BALI_SITES, getSiteBySlug, BALI_AREAS } from '@/lib/data'
import Navbar from '@/components/Navbar'
import DiveDiagram from '@/components/DiveDiagram'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useState } from 'react'

const freqColor = (f:string) => ({'very common':'#16a34a','common':'#2563eb','occasional':'#d97706','seasonal':'#7c3aed','rare':'#dc2626','Early morning':'#0891b2'}[f]||'#64748b')

const REVIEWS: Record<string,{initials:string;name:string;cert:string;rating:number;date:string;text:string;vis:string;current:string;helpful:number}[]> = {
  'usat-liberty-wreck':[
    {initials:'ME',name:'MarineExplorer',cert:'Advanced Open Water',rating:5,date:'May 12, 2024',text:'Still one of the best wreck dives I have done. Early morning is the way to go for visibility and fewer divers. The turtles are completely unbothered.',vis:'20m+',current:'Mild',helpful:12},
    {initials:'DN',name:'DiveNomad',cert:'Divemaster',rating:5,date:'Apr 30, 2024',text:'Guided my 200th dive here. Saw bumphead parrotfish at dawn and a school of jacks so dense we could barely see through them.',vis:'18m',current:'Mild',helpful:19},
    {initials:'OA',name:'OceanAddict',cert:'Open Water',rating:4,date:'Apr 18, 2024',text:'My first wreck dive. Entry over the stones was challenging but worth it. SMB is needed — the safety stop gets busy mid-morning.',vis:'15m',current:'Moderate',helpful:7},
  ],
}

type TabId = 'diagram'|'details'|'marine'|'safety'|'tips'|'reviews'|'photos'

export default function DiveSitePage({ params }: { params: { area: string; slug: string } }) {
  const site = getSiteBySlug(params.slug)
  if (!site) notFound()
  const [activeTab, setActiveTab] = useState<TabId>('diagram')
  const nearby = BALI_SITES.filter(s => s.areaSlug === site.areaSlug && s.slug !== site.slug).slice(0,3)
  const reviews = REVIEWS[site.slug] || []

  const tabs: {id:TabId;label:string}[] = [
    {id:'diagram',label:'Dive Site Diagram'},
    {id:'details',label:'Details'},
    {id:'marine',label:'Marine Life'},
    {id:'safety',label:'Safety'},
    {id:'tips',label:'Tips'},
    {id:'reviews',label:'Reviews'},
    {id:'photos',label:'Photos'},
  ]

  return (
    <main style={{minHeight:'100vh',background:'#fff'}}>
      <Navbar/>
      <div style={{display:'grid',gridTemplateColumns:'240px 1fr',minHeight:'calc(100vh - 60px)'}}>

        {/* Sidebar */}
        <aside style={{background:'#0a1628',borderRight:'1px solid #1e3a5f',overflowY:'auto',maxHeight:'calc(100vh - 60px)',position:'sticky',top:60}}>
          <div style={{padding:'1rem',borderBottom:'1px solid #1e3a5f'}}>
            <div style={{fontSize:10,color:'#475569',marginBottom:2}}>Indonesia</div>
            <div style={{fontSize:15,fontWeight:800,color:'#fff'}}>BALI 🇮🇩</div>
            <div style={{fontSize:10,color:'#475569',marginTop:2}}>Top 20 dive sites to explore in Bali</div>
          </div>
          <div style={{padding:'0.5rem 0'}}>
            {BALI_SITES.map(s=>(
              <Link key={s.slug} href={`/indonesia/bali/${s.areaSlug}/${s.slug}`} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 14px',borderLeft:s.slug===site.slug?'3px solid #ef4444':'3px solid transparent',background:s.slug===site.slug?'#1e3a5f':'none'}}>
                <span style={{fontSize:11,color:s.slug===site.slug?'#ef4444':'#334155',minWidth:18,fontWeight:700}}>{s.rank}</span>
                <span style={{fontSize:12,color:s.slug===site.slug?'#fff':'#64748b',fontWeight:s.slug===site.slug?700:400,lineHeight:1.3}}>{s.name}</span>
                {s.slug===site.slug&&<span style={{marginLeft:'auto',fontSize:11,color:'#ef4444'}}>★</span>}
              </Link>
            ))}
          </div>
          <div style={{borderTop:'1px solid #1e3a5f',padding:'1rem'}}>
            <Link href="/indonesia/bali" style={{display:'block',fontSize:12,color:'#60a5fa',marginBottom:'1rem'}}>View all sites in Bali →</Link>
            <div style={{background:'#0d1b2e',borderRadius:10,padding:'0.875rem'}}>
              <div style={{fontSize:12,fontWeight:700,color:'#fff',marginBottom:4}}>Know a dive site we're missing?</div>
              <p style={{fontSize:11,color:'#475569',marginBottom:8,lineHeight:1.5}}>All submissions are reviewed by admin before publishing.</p>
              <Link href="/submit-dive-site" style={{display:'block',background:'#16a34a',color:'#fff',padding:'7px 10px',borderRadius:7,fontSize:11,fontWeight:700,textAlign:'center'}}>Submit a dive site</Link>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div style={{overflowY:'auto'}}>
          {/* Bali bar */}
          <div style={{background:'linear-gradient(135deg,#0a1628,#1e3a5f)',padding:'1.25rem 2rem',borderBottom:'1px solid #e2e8f0'}}>
            <div style={{fontSize:11,color:'#94a3b8',marginBottom:4}}>
              <Link href="/" style={{color:'#475569'}}>Home</Link> › <Link href="/indonesia" style={{color:'#475569'}}>Indonesia</Link> › <Link href="/indonesia/bali" style={{color:'#475569'}}>Bali</Link>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:20,fontWeight:900,color:'#fff'}}>BALI</div>
                <div style={{fontSize:11,color:'#60a5fa',marginTop:2}}>🇮🇩 Indonesia</div>
              </div>
              <div style={{fontSize:12,color:'#94a3b8',maxWidth:380,lineHeight:1.5}}>Bali offers world-class diving for every level — from historic wrecks to manta rays and Mola mola.</div>
            </div>
            <div style={{display:'flex',gap:'2rem',marginTop:'1rem'}}>
              {[['120+','Dive sites'],['27–29°C','Water temp'],['15–40m+','Max depth'],['10–30m','Visibility'],['Apr – Nov','Best season']].map(([n,l])=>(
                <div key={l}><div style={{fontSize:15,fontWeight:800,color:'#fff'}}>{n}</div><div style={{fontSize:10,color:'#475569',textTransform:'uppercase',letterSpacing:1}}>{l}</div></div>
              ))}
            </div>
          </div>

          {/* Area strip */}
          <div style={{background:'#f8fafc',borderBottom:'1px solid #e2e8f0',padding:'0.75rem 2rem',display:'flex',gap:8,overflowX:'auto'}}>
            {BALI_AREAS.map(a=>(
              <Link key={a.slug} href={`/indonesia/bali/${a.slug}`} style={{padding:'6px 12px',background:site.areaSlug===a.slug?'#0a1628':'#fff',border:'1px solid '+(site.areaSlug===a.slug?'#0a1628':'#e2e8f0'),borderRadius:8,fontSize:11,fontWeight:600,whiteSpace:'nowrap',color:site.areaSlug===a.slug?'#fff':'#475569',flexShrink:0,display:'flex',flexDirection:'column',gap:2}}>
                <span>{a.name}</span>
                <span style={{fontSize:9,color:site.areaSlug===a.slug?'#60a5fa':'#94a3b8',fontWeight:400}}>{a.count} dive sites</span>
              </Link>
            ))}
          </div>

          <div style={{padding:'1.5rem 2rem',display:'grid',gridTemplateColumns:'1fr 300px',gap:'1.5rem',alignItems:'start'}}>
            {/* Left */}
            <div>
              {/* Badges + title */}
              <div style={{marginBottom:'1.5rem'}}>
                <div style={{display:'flex',gap:8,marginBottom:10}}>
                  <span style={{fontSize:11,padding:'3px 10px',background:'#0a1628',color:'#fff',borderRadius:4,fontWeight:700}}>#{site.rank} in Bali</span>
                  <span style={{fontSize:11,padding:'3px 10px',background:'#dbeafe',color:'#1d4ed8',borderRadius:4,fontWeight:600}}>Admin verified</span>
                  <button style={{fontSize:11,padding:'3px 10px',border:'1px solid #e2e8f0',color:'#64748b',borderRadius:4,background:'none',cursor:'pointer',marginLeft:'auto',display:'flex',alignItems:'center',gap:4}}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    Save dive site
                  </button>
                </div>
                <div style={{fontSize:11,color:'#94a3b8',marginBottom:6}}>Indonesia › Bali › {site.area} › {site.name}</div>
                <h1 style={{fontSize:32,fontWeight:900,color:'#0a1628',letterSpacing:-1,marginBottom:8,textTransform:'uppercase'}}>{site.name}</h1>
                <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap',marginBottom:8}}>
                  <span style={{fontSize:13,color:'#64748b'}}>📍 {site.area}, Bali, Indonesia</span>
                  <span style={{fontSize:13,color:'#64748b'}}>✈ {Math.abs(site.lat).toFixed(4)}° S {site.lng.toFixed(4)}° E</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{color:'#f59e0b',fontSize:18}}>{'★'.repeat(Math.round(site.rating))}</span>
                  <span style={{fontWeight:700,fontSize:15}}>{site.rating}</span>
                  <span style={{color:'#94a3b8',fontSize:13}}>{site.reviews} reviews</span>
                </div>
              </div>

              <p style={{fontSize:14,color:'#374151',lineHeight:1.8,marginBottom:'1.5rem'}}>{site.description}</p>

              {/* Stats grid */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:'1.5rem'}}>
                {[['Dive type',site.type],['Current',site.current],['Access',site.access],['Water temp',site.temp],['Min depth',site.minDepth+'m'],['Best time',site.bestTime],['Max depth',site.maxDepth+'m'],['Certification',site.minCert],['Avg depth',site.avgDepth+'m'],['Visibility',site.visibility],['Difficulty',site.difficulty],['Best season',site.bestSeason]].map(([k,v])=>(
                  <div key={k} style={{padding:'10px 12px',background:'#f8fafc',borderRadius:8,border:'1px solid #f1f5f9'}}>
                    <div style={{fontSize:10,color:'#94a3b8',marginBottom:3,textTransform:'uppercase',letterSpacing:0.5}}>{k}</div>
                    <div style={{fontSize:13,fontWeight:600,color:'#0f172a'}}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Contribute */}
              <div style={{marginBottom:'1.5rem'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:10,letterSpacing:1}}>CONTRIBUTE TO THIS DIVE SITE</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {[['Add your experience','experience'],['Submit correction','correction'],['Report safety update','safety'],['Add marine life sighting','marine']].map(([a,t])=>(
                    <Link key={a} href={`/submit-dive-site`} style={{fontSize:12,padding:'7px 14px',border:'1px solid #e2e8f0',borderRadius:8,color:'#2563eb',fontWeight:500}}>+ {a}</Link>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div style={{borderBottom:'2px solid #f1f5f9',display:'flex',gap:0,marginBottom:'1.5rem',overflowX:'auto'}}>
                {tabs.map(t=>(
                  <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{padding:'10px 16px',fontSize:12,fontWeight:700,cursor:'pointer',color:activeTab===t.id?'#0a1628':'#94a3b8',borderBottom:activeTab===t.id?'2px solid #ef4444':'2px solid transparent',borderTop:'none',borderLeft:'none',borderRight:'none',background:'none',whiteSpace:'nowrap',outline:'none'}}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab==='diagram'&&(
                <div style={{background:'#0a1628',borderRadius:12,overflow:'hidden',marginBottom:'1.5rem'}}>
                  <div style={{padding:'10px 14px',borderBottom:'1px solid #1e3a5f'}}>
                    <span style={{fontSize:12,fontWeight:700,color:'#94a3b8'}}>Dive Site Diagram</span>
                    <span style={{fontSize:10,color:'#475569',marginLeft:10}}>· {site.access} access · {site.minDepth}–{site.maxDepth}m</span>
                  </div>
                  <DiveDiagram site={site}/>
                </div>
              )}

              {activeTab==='details'&&(
                <div style={{marginBottom:'1.5rem'}}>
                  <div style={{marginBottom:'1.25rem'}}>
                    <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:10,letterSpacing:1}}>GOOD FOR</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:6}}>{site.goodFor.map(g=><span key={g} style={{fontSize:12,padding:'4px 12px',background:'#f1f5f9',borderRadius:20,color:'#374151'}}>{g}</span>)}</div>
                  </div>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:10,letterSpacing:1}}>FACILITIES</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:6}}>{site.facilities.map(f=><span key={f} style={{fontSize:12,padding:'4px 12px',background:'#f1f5f9',borderRadius:20,color:'#374151'}}>{f}</span>)}</div>
                  </div>
                </div>
              )}

              {activeTab==='marine'&&(
                <div style={{marginBottom:'1.5rem'}}>
                  <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:12,letterSpacing:1}}>MARINE LIFE YOU MAY SEE</div>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {site.marineLife.map(m=>(
                      <div key={m.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',background:'#f8fafc',borderRadius:8,border:'1px solid #f1f5f9'}}>
                        <span style={{fontSize:13,color:'#0f172a',fontWeight:500}}>{m.name}</span>
                        <span style={{fontSize:11,fontWeight:700,color:freqColor(m.frequency)}}>{m.frequency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab==='safety'&&(
                <div style={{marginBottom:'1.5rem'}}>
                  <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:12,padding:'1.25rem',marginBottom:12}}>
                    <div style={{fontSize:13,fontWeight:700,color:'#92400e',marginBottom:10}}>Safety notes</div>
                    {site.safetyNotes.map(n=><div key={n} style={{fontSize:13,color:'#78350f',marginBottom:6,paddingLeft:12}}>· {n}</div>)}
                    <div style={{fontSize:12,color:'#92400e',marginTop:10,paddingTop:8,borderTop:'1px solid #fde68a'}}>{site.emergencyContact}</div>
                  </div>
                  <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:12,padding:'1.25rem'}}>
                    <div style={{fontSize:13,fontWeight:700,color:'#1d4ed8',marginBottom:10}}>Dive briefing</div>
                    <p style={{fontSize:13,color:'#1e40af',lineHeight:1.7}}>{site.briefing}</p>
                  </div>
                </div>
              )}

              {activeTab==='tips'&&(
                <div style={{marginBottom:'1.5rem',background:'#f8fafc',borderRadius:12,padding:'1.25rem',border:'1px solid #e2e8f0'}}>
                  <div style={{fontSize:13,fontWeight:700,color:'#0a1628',marginBottom:10}}>Diver tips</div>
                  <ul style={{paddingLeft:16}}>
                    {[`Best time: ${site.bestTime}`,`Best season: ${site.bestSeason}`,`Certification required: ${site.minCert}`,`Max depth: ${site.maxDepth}m — plan your dive accordingly`,`Always carry an SMB`,`Dive with a local guide for first visits`].map(t=>(
                      <li key={t} style={{fontSize:13,color:'#374151',lineHeight:1.8}}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab==='reviews'&&(
                <div style={{marginBottom:'1.5rem'}}>
                  <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:12,letterSpacing:1}}>DIVER EXPERIENCES ({site.reviews})</div>
                  {reviews.length>0 ? reviews.map((r,i)=>(
                    <div key={i} style={{border:'1px solid #f1f5f9',borderRadius:12,padding:'1.25rem',marginBottom:10}}>
                      <div style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:8}}>
                        <div style={{width:36,height:36,background:'#0a1628',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'#fff',flexShrink:0}}>{r.initials}</div>
                        <div style={{flex:1}}>
                          <div style={{display:'flex',justifyContent:'space-between'}}>
                            <div style={{fontWeight:700,fontSize:13}}>{r.name}</div>
                            <span style={{fontSize:13,color:'#f59e0b'}}>{'★'.repeat(r.rating)}</span>
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
                  )) : (
                    <div style={{padding:'2rem',background:'#f8fafc',borderRadius:12,textAlign:'center',color:'#64748b',fontSize:13}}>
                      No reviews yet. <Link href="/submit-dive-site" style={{color:'#2563eb'}}>Be the first to share your experience →</Link>
                    </div>
                  )}
                  <Link href="/submit-dive-site" style={{display:'block',textAlign:'center',padding:'10px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:12,color:'#2563eb',marginTop:8}}>+ Add your experience</Link>
                </div>
              )}

              {activeTab==='photos'&&(
                <div style={{marginBottom:'1.5rem'}}>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
                    {[...Array(6)].map((_,i)=>(
                      <div key={i} style={{background:`linear-gradient(135deg,#0a1628,${['#1e3a5f','#0d2845','#0c4a6e','#1e3a5f','#0d2845','#0c4a6e'][i]})`,borderRadius:10,aspectRatio:'4/3',display:'flex',alignItems:'center',justifyContent:'center',color:'#475569',fontSize:11}}>
                        Photo {i+1} coming soon
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:10,textAlign:'center'}}>
                    <Link href="/submit-dive-site" style={{fontSize:12,color:'#2563eb'}}>Submit a photo →</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right col */}
            <div>
              {/* Map */}
              <div style={{background:'linear-gradient(135deg,#0a1628,#1e3a5f)',borderRadius:12,height:140,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12,position:'relative',overflow:'hidden'}}>
                <div style={{textAlign:'center',color:'#475569'}}>
                  <div style={{fontSize:11,color:'#60a5fa',marginBottom:4}}>{site.area} — {site.lat.toFixed(4)}° S</div>
                  <div style={{display:'flex',gap:10,justifyContent:'center'}}>
                    <Link href="/map" style={{fontSize:11,color:'#60a5fa',fontWeight:500}}>View on map</Link>
                    <span style={{color:'#1e3a5f'}}>·</span>
                    <span style={{fontSize:11,color:'#60a5fa',cursor:'pointer'}}>Get directions</span>
                  </div>
                </div>
              </div>

              {/* Quick info */}
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:12,padding:'1.25rem',marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:12,letterSpacing:1}}>QUICK INFO</div>
                {[['Location',`${site.area}, Bali`],['Type',site.type],['Access',site.access],['Depth',`${site.minDepth}m – ${site.maxDepth}m`],['Avg depth',`${site.avgDepth}m`],['Visibility',site.visibility],['Water temp',site.temp],['Difficulty',site.difficulty],['Best time',site.bestTime],['Currents',site.current]].map(([k,v])=>(
                  <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #f8fafc',fontSize:12}}>
                    <span style={{color:'#94a3b8'}}>{k}</span>
                    <span style={{color:'#0f172a',fontWeight:600,textAlign:'right'}}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Info status */}
              <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:12,padding:'1.25rem',marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:'#15803d',marginBottom:8}}>INFORMATION STATUS</div>
                <div style={{fontSize:12,color:'#166534',marginBottom:3}}>Status: <strong>Admin reviewed</strong></div>
                <div style={{fontSize:12,color:'#166534',marginBottom:3}}>Verified by: Local dive professionals, {site.area}</div>
                <div style={{fontSize:12,color:'#166534',marginBottom:10}}>Last updated: July 2026</div>
                <Link href="/submit-dive-site" style={{fontSize:11,color:'#16a34a',fontWeight:600}}>Submit correction →</Link>
              </div>

              {/* Reviews snapshot */}
              <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:12,padding:'1.25rem',marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:12,letterSpacing:1}}>REVIEWS SNAPSHOT</div>
                <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}>
                  <div style={{fontSize:36,fontWeight:900,color:'#0a1628'}}>{site.rating}</div>
                  <div>
                    <div style={{color:'#f59e0b',fontSize:18}}>{'★'.repeat(Math.round(site.rating))}</div>
                    <div style={{fontSize:11,color:'#94a3b8'}}>Based on {site.reviews} reviews</div>
                  </div>
                </div>
                {[5,4,3,2,1].map(n=>(
                  <div key={n} style={{display:'flex',gap:8,alignItems:'center',marginBottom:4}}>
                    <span style={{fontSize:11,color:'#94a3b8',minWidth:8}}>{n}</span>
                    <div style={{flex:1,height:6,background:'#f1f5f9',borderRadius:3}}>
                      <div style={{height:6,background:'#f59e0b',borderRadius:3,width:n===5?'80%':n===4?'15%':'0%'}}/>
                    </div>
                    <span style={{fontSize:11,color:'#94a3b8',minWidth:16}}>{n===5?Math.round(site.reviews*0.8):n===4?Math.round(site.reviews*0.15):0}</span>
                  </div>
                ))}
                <button onClick={()=>setActiveTab('reviews')} style={{display:'block',width:'100%',marginTop:10,padding:'7px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:12,color:'#2563eb',background:'none',cursor:'pointer',textAlign:'center'}}>Read all reviews →</button>
              </div>

              {/* Nearby */}
              {nearby.length>0&&(
                <div style={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:12,padding:'1.25rem'}}>
                  <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:10,letterSpacing:1}}>MORE IN {site.area.toUpperCase()}</div>
                  {nearby.map(s=>(
                    <Link key={s.slug} href={`/indonesia/bali/${s.areaSlug}/${s.slug}`} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:'1px solid #f8fafc',alignItems:'center'}}>
                      <span style={{fontSize:11,color:'#475569',minWidth:16}}>#{s.rank}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,color:'#0f172a',fontWeight:600}}>{s.name}</div>
                        <div style={{fontSize:11,color:'#475569'}}>{s.type} · {s.minDepth}–{s.maxDepth}m</div>
                      </div>
                      <span style={{fontSize:11,color:'#f59e0b'}}>★ {s.rating}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer style={{background:'#0a1628',color:'#475569',padding:'2rem',borderTop:'1px solid #1e3a5f'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between'}}>
          <span style={{fontSize:12}}>© 2026 Dive Spots. All rights reserved.</span>
          <div style={{display:'flex',gap:'1.5rem'}}>
            {[['About','/about'],['Privacy','/privacy'],['Contact','/contact']].map(([l,h])=><Link key={l} href={h} style={{fontSize:12,color:'#475569'}}>{l}</Link>)}
          </div>
        </div>
      </footer>
    </main>
  )
}
