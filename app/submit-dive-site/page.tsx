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
  const tabs = [{id:'site' as Tab,label:'Submit a dive site',icon:'+'},{id:'experience' as Tab,label:'Add diver experience',icon:'★'},{id:'correction' as Tab,label:'Submit correction',icon:'✎'},{id:'safety' as Tab,label:'Report safety update',icon:'!'},{id:'marine' as Tab,label:'Add marine life sighting',icon:'~'}]
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError(''); setSuccess(false)
    const fd = new FormData(e.currentTarget); const data: Record<string,string> = {}
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
  const inp = {width:'100%',padding:'9px 12px',borderRadius:8,border:'1px solid #e2e8f0',background:'#fff',color:'#0f172a',fontSize:13,outline:'none'} as React.CSSProperties
  const sel = {...inp}
  return (
    <main style={{minHeight:'100vh',background:'#f8fafc'}}>
      <Navbar/>
      <div style={{background:'linear-gradient(135deg,#0a1628,#1e3a5f)',padding:'2.5rem 2rem',color:'#fff',borderBottom:'1px solid #1e3a5f'}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <h1 style={{fontSize:28,fontWeight:900,marginBottom:6}}>CONTRIBUTE TO DIVE SPOTS</h1>
          <p style={{color:'#64748b',fontSize:13}}>All submissions are reviewed by our admin team before appearing publicly.</p>
        </div>
      </div>
      <div style={{maxWidth:700,margin:'0 auto',padding:'2.5rem 1.5rem'}}>
        <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:'2rem'}}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);setSuccess(false);setError('')}} style={{textAlign:'left',padding:'12px 16px',borderRadius:10,cursor:'pointer',fontSize:13,fontWeight:500,border:tab===t.id?'2px solid #0a1628':'1px solid #e2e8f0',background:tab===t.id?'#0a1628':'#fff',color:tab===t.id?'#fff':'#374151',display:'flex',alignItems:'center',gap:10}}>
              <span style={{width:24,height:24,background:tab===t.id?'#ef4444':'#f1f5f9',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:tab===t.id?'#fff':'#64748b',flexShrink:0}}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{background:'#fff',borderRadius:14,border:'1px solid #e2e8f0',padding:'2rem',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
          {success ? (
            <div style={{textAlign:'center',padding:'2rem'}}>
              <div style={{width:56,height:56,background:'#dcfce7',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:24}}>✓</div>
              <h2 style={{fontSize:18,fontWeight:700,color:'#0a1628',marginBottom:8}}>Submitted — thank you!</h2>
              <p style={{color:'#64748b',fontSize:13,marginBottom:'1.5rem'}}>Your submission is <strong style={{color:'#f59e0b'}}>pending review</strong> and will appear publicly once approved by our admin team.</p>
              <button onClick={()=>setSuccess(false)} style={{padding:'8px 20px',borderRadius:8,border:'1px solid #0a1628',color:'#0a1628',background:'none',cursor:'pointer',fontSize:13}}>Submit another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {tab==='site' && <>
                <h2 style={{fontSize:16,fontWeight:700,color:'#0a1628',marginBottom:'1.25rem'}}>Submit a new dive site</h2>
                <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Dive site name *</label><input name="name" required style={inp} placeholder="e.g. Shark Point"/></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                  <div><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Country *</label><input name="country" required style={inp} placeholder="e.g. Indonesia"/></div>
                  <div><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Region / Island</label><input name="region" style={inp} placeholder="e.g. Bali"/></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                  <div><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Area / Village</label><input name="area" style={inp} placeholder="e.g. Tulamben"/></div>
                  <div><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Max depth (m)</label><input name="max_depth" type="number" style={inp} placeholder="e.g. 30"/></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                  <div><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Dive type</label><select name="dive_type" style={sel}><option value="">Select…</option>{['Wreck','Wall','Reef','Drift','Muck','Pinnacle'].map(t=><option key={t}>{t}</option>)}</select></div>
                  <div><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Access</label><select name="access" style={sel}><option value="">Select…</option>{['Shore','Boat','Shore or Boat'].map(t=><option key={t}>{t}</option>)}</select></div>
                </div>
                <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Min. certification</label><select name="min_cert" style={sel}><option value="">Select…</option>{['Open Water','Advanced Open Water','Rescue Diver','Divemaster'].map(t=><option key={t}>{t}</option>)}</select></div>
                <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Description</label><textarea name="description" rows={4} style={{...inp,resize:'vertical'}} placeholder="Describe the dive site — what makes it special, what to expect…"/></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Your name</label><input name="submitter_name" style={inp} placeholder="Optional"/></div>
                  <div><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Your email</label><input name="submitter_email" type="email" style={inp} placeholder="Optional"/></div>
                </div>
              </>}
              {tab==='experience' && <>
                <h2 style={{fontSize:16,fontWeight:700,color:'#0a1628',marginBottom:'1.25rem'}}>Add your diver experience</h2>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                  <div><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Dive site name *</label><input name="site_name" required style={inp} placeholder="e.g. USAT Liberty Wreck"/></div>
                  <div><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Site slug</label><input name="site_slug" style={inp} placeholder="e.g. usat-liberty-wreck"/></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:12}}>
                  <div><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Star rating *</label><select name="rating" required style={sel}>{['5','4','3','2','1'].map(v=><option key={v}>{v}</option>)}</select></div>
                  <div><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Visibility (m)</label><input name="visibility_m" type="number" style={inp} placeholder="e.g. 20"/></div>
                  <div><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Current</label><select name="current" style={sel}><option>None</option><option>Mild</option><option>Moderate</option><option>Strong</option></select></div>
                </div>
                <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Certification</label><select name="certification" style={sel}><option value="">Select…</option>{['Open Water','Advanced Open Water','Rescue Diver','Divemaster','Instructor'].map(t=><option key={t}>{t}</option>)}</select></div>
                <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Your experience *</label><textarea name="review_text" required rows={5} style={{...inp,resize:'vertical'}} placeholder="Describe your dive — what you saw, conditions, tips for other divers…"/></div>
                <div><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Your name</label><input name="reviewer_name" style={inp} placeholder="Displayed publicly"/></div>
              </>}
              {['correction','safety','marine'].includes(tab) && <>
                <h2 style={{fontSize:16,fontWeight:700,color:'#0a1628',marginBottom:'1.25rem'}}>{tab==='correction'?'Submit a correction':tab==='safety'?'Report a safety update':'Add a marine life sighting'}</h2>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
                  <div><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Dive site name</label><input name="site_name" style={inp} placeholder="e.g. Blue Lagoon"/></div>
                  <div><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Your name</label><input name="submitter_name" style={inp} placeholder="Optional"/></div>
                </div>
                <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Description *</label><textarea name="description" required rows={5} style={{...inp,resize:'vertical'}} placeholder={tab==='marine'?'What did you see? Include species, depth, date if known…':tab==='safety'?'Describe the safety concern or update needed…':'What needs to be corrected?'}/></div>
                <div><label style={{fontSize:12,fontWeight:500,color:'#374151',display:'block',marginBottom:4}}>Your email</label><input name="submitter_email" type="email" style={inp} placeholder="Optional — we may contact you for more info"/></div>
              </>}
              {error && <div style={{marginTop:12,padding:'10px 14px',background:'#fef2f2',border:'1px solid #fecaca',borderRadius:8,color:'#dc2626',fontSize:13}}>{error}</div>}
              <div style={{marginTop:'1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',borderTop:'1px solid #f1f5f9',paddingTop:'1.25rem'}}>
                <p style={{fontSize:11,color:'#94a3b8'}}>Pending review before publishing</p>
                <button type="submit" disabled={loading} style={{padding:'10px 28px',borderRadius:8,background:loading?'#94a3b8':'#0a1628',color:'#fff',border:'none',fontSize:13,fontWeight:700,cursor:loading?'not-allowed':'pointer'}}>{loading?'Submitting…':'Submit for review'}</button>
              </div>
            </form>
          )}
        </div>
      </div>
      <footer style={{background:'#0a1628',color:'#475569',padding:'2rem',textAlign:'center',fontSize:12,borderTop:'1px solid #1e3a5f'}}>© 2026 Dive Spots. All rights reserved.</footer>
    </main>
  )
}
