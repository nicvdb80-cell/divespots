'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

type Tab = 'site'|'experience'|'correction'|'safety'|'marine'

export default function SubmitPage() {
  const [tab, setTab] = useState<Tab>('site')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const tabs = [
    {id:'site' as Tab,label:'Submit a dive site',icon:'🗺️'},
    {id:'experience' as Tab,label:'Add diver experience',icon:'⭐'},
    {id:'correction' as Tab,label:'Submit correction',icon:'✏️'},
    {id:'safety' as Tab,label:'Report safety update',icon:'⚠️'},
    {id:'marine' as Tab,label:'Add marine life sighting',icon:'🐠'},
  ]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError(''); setSuccess(false)
    const fd = new FormData(e.currentTarget)
    const data: Record<string,string> = {}
    fd.forEach((v,k)=>{data[k]=v as string})
    let endpoint = '/api/submit'
    if (tab==='experience') endpoint='/api/reviews'
    else if (['correction','safety','marine'].includes(tab)) { endpoint='/api/corrections'; data.correction_type=tab==='safety'?'safety':tab==='marine'?'marine_life':'correction' }
    try {
      const res = await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
      const json = await res.json()
      if (!res.ok) throw new Error(json.error||'Failed')
      setSuccess(true); (e.target as HTMLFormElement).reset()
    } catch(err:any){setError(err.message)} finally{setLoading(false)}
  }

  const inp = {width:'100%',padding:'9px 12px',borderRadius:8,border:'1px solid #1e3a5f',background:'#0d1b2e',color:'#e2e8f0',fontSize:13,outline:'none'} as React.CSSProperties

  return (
    <main style={{minHeight:'100vh',background:'#0d1b2e'}}>
      <Navbar />
      <div style={{maxWidth:700,margin:'0 auto',padding:'3rem 1.5rem'}}>
        <h1 style={{fontSize:26,fontWeight:900,color:'#fff',marginBottom:6}}>CONTRIBUTE TO DIVE SPOTS</h1>
        <p style={{color:'#475569',marginBottom:'2rem',fontSize:13}}>All submissions are reviewed by our admin team before going live.</p>
        <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:'2rem'}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);setSuccess(false);setError('')}} style={{textAlign:'left',padding:'12px 16px',borderRadius:8,cursor:'pointer',fontSize:13,fontWeight:500,border:tab===t.id?'2px solid #3b82f6':'1px solid #1e3a5f',background:tab===t.id?'#1e3a5f':'#0a1628',color:tab===t.id?'#fff':'#64748b'}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div style={{background:'#0a1628',borderRadius:12,border:'1px solid #1e3a5f',padding:'2rem'}}>
          {success ? (
            <div style={{textAlign:'center',padding:'2rem'}}>
              <div style={{fontSize:48,marginBottom:12}}>✅</div>
              <h2 style={{fontSize:18,fontWeight:700,color:'#fff',marginBottom:8}}>Submitted — thank you!</h2>
              <p style={{color:'#475569',fontSize:13,marginBottom:'1.5rem'}}>Your submission is <strong style={{color:'#f59e0b'}}>Pending review</strong> and will appear publicly once approved.</p>
              <button onClick={()=>setSuccess(false)} style={{padding:'8px 20px',borderRadius:8,border:'1px solid #3b82f6',color:'#60a5fa',background:'none',cursor:'pointer',fontSize:13}}>Submit another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {tab==='site' && <>
                <h2 style={{fontSize:16,fontWeight:700,color:'#fff',marginBottom:'1.25rem'}}>Submit a new dive site</h2>
                <div style={{marginBottom:12}}><label style={{fontSize:12,color:'#64748b'}}>Site name *</label><input name="name" required style={inp} placeholder="e.g. Shark Point"/></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                  <div><label style={{fontSize:12,color:'#64748b'}}>Country *</label><input name="country" required style={inp} placeholder="e.g. Indonesia"/></div>
                  <div><label style={{fontSize:12,color:'#64748b'}}>Region</label><input name="region" style={inp} placeholder="e.g. Bali"/></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                  <div><label style={{fontSize:12,color:'#64748b'}}>Area</label><input name="area" style={inp} placeholder="e.g. Tulamben"/></div>
                  <div><label style={{fontSize:12,color:'#64748b'}}>Max depth (m)</label><input name="max_depth" type="number" style={inp} placeholder="e.g. 30"/></div>
                </div>
                <div style={{marginBottom:12}}><label style={{fontSize:12,color:'#64748b'}}>Description</label><textarea name="description" rows={4} style={{...inp,resize:'vertical'}} placeholder="Describe the dive site…"/></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div><label style={{fontSize:12,color:'#64748b'}}>Your name</label><input name="submitter_name" style={inp}/></div>
                  <div><label style={{fontSize:12,color:'#64748b'}}>Your email</label><input name="submitter_email" type="email" style={inp}/></div>
                </div>
              </>}
              {tab==='experience' && <>
                <h2 style={{fontSize:16,fontWeight:700,color:'#fff',marginBottom:'1.25rem'}}>Add your diver experience</h2>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                  <div><label style={{fontSize:12,color:'#64748b'}}>Dive site name *</label><input name="site_name" required style={inp} placeholder="e.g. USAT Liberty Wreck"/></div>
                  <div><label style={{fontSize:12,color:'#64748b'}}>Site slug</label><input name="site_slug" style={inp} placeholder="e.g. usat-liberty-wreck"/></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:12}}>
                  <div><label style={{fontSize:12,color:'#64748b'}}>Star rating</label><select name="rating" style={inp}><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></div>
                  <div><label style={{fontSize:12,color:'#64748b'}}>Visibility (m)</label><input name="visibility_m" type="number" style={inp} placeholder="e.g. 20"/></div>
                  <div><label style={{fontSize:12,color:'#64748b'}}>Your name</label><input name="reviewer_name" style={inp}/></div>
                </div>
                <div style={{marginBottom:12}}><label style={{fontSize:12,color:'#64748b'}}>Your experience *</label><textarea name="review_text" required rows={5} style={{...inp,resize:'vertical'}} placeholder="Describe your dive — what you saw, conditions, tips for other divers…"/></div>
              </>}
              {['correction','safety','marine'].includes(tab) && <>
                <h2 style={{fontSize:16,fontWeight:700,color:'#fff',marginBottom:'1.25rem'}}>{tab==='correction'?'Submit a correction':tab==='safety'?'Report a safety update':'Add a marine life sighting'}</h2>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                  <div><label style={{fontSize:12,color:'#64748b'}}>Dive site name</label><input name="site_name" style={inp} placeholder="e.g. Blue Lagoon"/></div>
                  <div><label style={{fontSize:12,color:'#64748b'}}>Your name</label><input name="submitter_name" style={inp}/></div>
                </div>
                <div style={{marginBottom:12}}><label style={{fontSize:12,color:'#64748b'}}>Description *</label><textarea name="description" required rows={5} style={{...inp,resize:'vertical'}} placeholder="Describe the correction, safety update, or marine life sighting…"/></div>
                <div><label style={{fontSize:12,color:'#64748b'}}>Your email</label><input name="submitter_email" type="email" style={inp}/></div>
              </>}
              {error && <div style={{marginTop:12,padding:'10px 14px',background:'#1c0a00',border:'1px solid #78350f',borderRadius:8,color:'#fca5a5',fontSize:13}}>{error}</div>}
              <div style={{marginTop:'1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <p style={{fontSize:11,color:'#475569'}}>Submissions are <strong style={{color:'#f59e0b'}}>Pending</strong> until reviewed by admin.</p>
                <button type="submit" disabled={loading} style={{padding:'10px 24px',borderRadius:8,background:loading?'#1e3a5f':'#2563eb',color:'#fff',border:'none',fontSize:13,fontWeight:700,cursor:loading?'not-allowed':'pointer'}}>
                  {loading?'Submitting…':'Submit for review'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
