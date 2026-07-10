'use client'
import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import AuthModal from './AuthModal'
import Link from 'next/link'
import DiveDiagram from './DiveDiagram'
import { DiveSite } from '@/lib/data'

const freqColor = (f:string) => ({'very common':'#16a34a','common':'#2563eb','occasional':'#d97706','seasonal':'#7c3aed','rare':'#dc2626','Early morning':'#0891b2'}[f]||'#64748b')

const REVIEWS: Record<string,{initials:string;name:string;cert:string;rating:number;date:string;text:string;vis:string;current:string;helpful:number}[]> = {
  'usat-liberty-wreck':[
    {initials:'ME',name:'MarineExplorer',cert:'Advanced Open Water',rating:5,date:'May 12, 2024',text:'Still one of the best wreck dives I have done. Early morning is the way to go for visibility and fewer divers. The turtles are completely unbothered.',vis:'20m+',current:'Mild',helpful:12},
    {initials:'DN',name:'DiveNomad',cert:'Divemaster',rating:5,date:'Apr 30, 2024',text:'Guided my 200th dive here. Saw bumphead parrotfish at dawn and a school of jacks so dense we could barely see through them.',vis:'18m',current:'Mild',helpful:19},
    {initials:'OA',name:'OceanAddict',cert:'Open Water',rating:4,date:'Apr 18, 2024',text:'My first wreck dive. Entry over the stones was challenging but worth it. SMB is needed — the safety stop gets busy mid-morning.',vis:'15m',current:'Moderate',helpful:7},
  ],
}

type TabId = 'diagram'|'details'|'marine'|'safety'|'tips'|'reviews'|'photos'

export default function DiveSiteTabs({ site }: { site: DiveSite }) {
  const [activeTab, setActiveTab] = useState<TabId>('diagram')
  const { user } = useAuth()
  const [blocked, setBlocked] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (user) { setBlocked(false); return }
    const FREE_LIMIT = 9999
    const STORAGE_KEY = 'ds_viewed_sites'
    try {
      const viewed: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      if (viewed.includes(site.slug)) return // already visited
      if (viewed.length >= FREE_LIMIT) { setBlocked(true); setShowAuthModal(true); return }
      viewed.push(site.slug)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewed))
    } catch {}
  }, [user, site.slug])
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

  if (blocked && !user) return (
    <div style={{ padding: '3rem 0', textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, background: '#0a1628', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: 24 }}>🤿</div>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0a1628', marginBottom: 8 }}>You have explored 3 dive sites</h2>
      <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>
        Create a free Dive Spots account to unlock all 1,200+ dive sites, save favourites, and join the diver community.
      </p>
      <button onClick={() => setShowAuthModal(true)} style={{ padding: '12px 32px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 12, display: 'block', margin: '0 auto 12px' }}>
        Create free account
      </button>
      <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 12 }}>
        Already a member? <button onClick={() => setShowAuthModal(true)} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Sign in</button>
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
        {['1,200+ dive sites', 'Save favourites', 'Free forever'].map(f => (
          <div key={f} style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#16a34a' }}>✓</span> {f}
          </div>
        ))}
      </div>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={() => { setShowAuthModal(false); setBlocked(false) }} />}
    </div>
  )

  return (
    <>
      {/* Contribute */}
      <div style={{marginBottom:'1.5rem'}}>
        <div style={{fontSize:11,fontWeight:700,color:'#94a3b8',marginBottom:10,letterSpacing:1}}>CONTRIBUTE TO THIS DIVE SITE</div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {['Add your experience','Submit correction','Report safety update','Add marine life sighting'].map(a=>(
            <Link key={a} href="/submit-dive-site" style={{fontSize:12,padding:'7px 14px',border:'1px solid #e2e8f0',borderRadius:8,color:'#2563eb',fontWeight:500}}>+ {a}</Link>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{borderBottom:'2px solid #f1f5f9',display:'flex',gap:0,marginBottom:'1.5rem',overflowX:'auto'}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{padding:'10px 16px',fontSize:12,fontWeight:700,cursor:'pointer',color:activeTab===t.id?'#0a1628':'#94a3b8',borderTop:'none',borderLeft:'none',borderRight:'none',borderBottom:activeTab===t.id?'2px solid #ef4444':'2px solid transparent',background:'none',whiteSpace:'nowrap',outline:'none',marginBottom:-2}}>
            {t.label}
          </button>
        ))}
      </div>

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
              No reviews yet. <Link href="/submit-dive-site" style={{color:'#2563eb'}}>Be the first →</Link>
            </div>
          )}
          <Link href="/submit-dive-site" style={{display:'block',textAlign:'center',padding:'10px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:12,color:'#2563eb',marginTop:8}}>+ Add your experience</Link>
        </div>
      )}

      {activeTab==='photos'&&(
        <div style={{marginBottom:'1.5rem'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
            {[...Array(6)].map((_,i)=>(
              <div key={i} style={{background:`linear-gradient(135deg,#0a1628,#0c4a6e)`,borderRadius:10,aspectRatio:'4/3',display:'flex',alignItems:'center',justifyContent:'center',color:'#475569',fontSize:11}}>
                Photo {i+1} coming soon
              </div>
            ))}
          </div>
          <div style={{marginTop:10,textAlign:'center'}}>
            <Link href="/submit-dive-site" style={{fontSize:12,color:'#2563eb'}}>Submit a photo →</Link>
          </div>
        </div>
      )}
    </>
  )
}
