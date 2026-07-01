'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const SB_URL = 'https://flhsqerpikhihtirfutu.supabase.co'
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsaHNxZXJwaWtoaWh0aXJmdXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNTg4NTEsImV4cCI6MjA5MjkzNDg1MX0.Q0RO8O_i7fBbDZTS6ZGyQ3NqrraxtRK3UG5PDITGYsU'

async function sb(table: string) {
  const r = await fetch(`${SB_URL}/rest/v1/${table}?order=created_at.desc`, { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } })
  return r.json()
}
async function sbPatch(table: string, id: string, body: object) {
  await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`, { method: 'PATCH', headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(body) })
}

type Tab = 'submissions'|'reviews'|'corrections'
const statusPill = (s: string) => {
  const cfg: Record<string,string> = { pending:'#f59e0b', approved:'#16a34a', rejected:'#dc2626' }
  return <span style={{fontSize:10,padding:'2px 8px',borderRadius:10,fontWeight:700,background:cfg[s]+'22',color:cfg[s]}}>{s}</span>
}
const timeAgo = (ts: string) => { const d = Math.floor((Date.now()-new Date(ts).getTime())/86400000); return d===0?'today':d===1?'yesterday':`${d}d ago` }

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('submissions')
  const [data, setData] = useState<{submissions:any[],reviews:any[],corrections:any[]}>({submissions:[],reviews:[],corrections:[]})
  const [rejectInputs, setRejectInputs] = useState<Record<string,string>>({})
  const [rejectOpen, setRejectOpen] = useState<Record<string,boolean>>({})
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const [s,r,c] = await Promise.all([sb('ds_submissions'),sb('ds_reviews'),sb('ds_corrections')])
    setData({submissions:s,reviews:r,corrections:c})
    setLoading(false)
  }
  useEffect(()=>{load()},[])

  async function approve(table: string, id: string) { await sbPatch(table,id,{status:'approved',reviewed_at:new Date().toISOString()}); load() }
  async function reject(table: string, id: string) { await sbPatch(table,id,{status:'rejected',reviewed_at:new Date().toISOString(),reject_reason:rejectInputs[id]||''}); load() }

  const pending = (arr: any[]) => arr.filter(x=>x.status==='pending').length
  const approved = (arr: any[]) => arr.filter(x=>x.status==='approved').length

  const inp = {flex:1,fontSize:12,padding:'5px 10px',borderRadius:6,border:'1px solid #e2e8f0',outline:'none'} as React.CSSProperties

  return (
    <main style={{minHeight:'100vh',background:'#f8fafc'}}>
      <Navbar/>
      <div style={{background:'linear-gradient(135deg,#0a1628,#1e3a5f)',padding:'1.5rem 2rem',borderBottom:'1px solid #1e3a5f'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:900,color:'#fff',letterSpacing:-0.5}}>ADMIN DASHBOARD</h1>
            <div style={{fontSize:12,color:'#475569',marginTop:2}}>Review and approve community submissions</div>
          </div>
          <div style={{display:'flex',gap:10}}>
            <Link href="/indonesia/bali" style={{fontSize:12,color:'#60a5fa',padding:'6px 14px',border:'1px solid #1e3a5f',borderRadius:6}}>View site →</Link>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'1.5rem 2rem'}}>
        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:'1.5rem'}}>
          {[
            {label:'Pending sites',val:pending(data.submissions),color:'#f59e0b'},
            {label:'Pending reviews',val:pending(data.reviews),color:'#f59e0b'},
            {label:'Pending corrections',val:pending(data.corrections),color:'#f59e0b'},
            {label:'Total approved',val:approved(data.submissions)+approved(data.reviews)+approved(data.corrections),color:'#16a34a'},
          ].map(s=>(
            <div key={s.label} style={{background:'#fff',borderRadius:10,padding:'1rem 1.25rem',border:'1px solid #e2e8f0'}}>
              <div style={{fontSize:11,color:'#94a3b8',marginBottom:4}}>{s.label}</div>
              <div style={{fontSize:28,fontWeight:800,color:s.color}}>{loading?'—':s.val}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:4,marginBottom:'1.25rem'}}>
          {([['submissions','Dive Sites','ds_submissions'],['reviews','Reviews','ds_reviews'],['corrections','Corrections','ds_corrections']] as [Tab,string,string][]).map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:'7px 16px',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',border:'1px solid '+(tab===id?'#0a1628':'#e2e8f0'),background:tab===id?'#0a1628':'#fff',color:tab===id?'#fff':'#64748b',display:'flex',alignItems:'center',gap:6}}>
              {label}
              <span style={{fontSize:10,padding:'1px 6px',borderRadius:10,background:tab===id?'#ef4444':'#f1f5f9',color:tab===id?'#fff':'#94a3b8',fontWeight:700}}>
                {loading?'…':pending(tab==='submissions'?data.submissions:tab==='reviews'?data.reviews:data.corrections)}
              </span>
            </button>
          ))}
        </div>

        {/* Items */}
        {loading ? <div style={{textAlign:'center',padding:'3rem',color:'#94a3b8',fontSize:13}}>Loading…</div> : (
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {(tab==='submissions'?data.submissions:tab==='reviews'?data.reviews:data.corrections).map((item:any)=>(
              <div key={item.id} style={{background:'#fff',borderRadius:12,border:'1px solid #e2e8f0',padding:'1.25rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,color:'#0a1628',marginBottom:3}}>
                      {item.name||item.site_name||item.reviewer_name||'Unnamed'}
                    </div>
                    <div style={{fontSize:12,color:'#64748b'}}>
                      {item.country&&`${item.area?item.area+', ':''}${item.country}`}
                      {item.site_slug&&`Site: ${item.site_slug}`}
                      {item.correction_type&&` · Type: ${item.correction_type}`}
                      {' · '}{timeAgo(item.created_at)}
                    </div>
                  </div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    {statusPill(item.status)}
                    {item.dive_type&&<span style={{fontSize:10,padding:'2px 8px',borderRadius:10,background:'#dbeafe',color:'#1d4ed8'}}>{item.dive_type}</span>}
                    {item.rating&&<span style={{fontSize:11,color:'#f59e0b',fontWeight:700}}>{'★'.repeat(item.rating)}</span>}
                  </div>
                </div>
                {(item.description||item.review_text)&&(
                  <div style={{fontSize:13,color:'#374151',lineHeight:1.6,marginBottom:10,padding:'10px 12px',background:'#f8fafc',borderRadius:8,borderLeft:'3px solid #e2e8f0'}}>
                    {item.description||item.review_text}
                  </div>
                )}
                {item.submitter_name&&<div style={{fontSize:11,color:'#94a3b8',marginBottom:10}}>Submitted by {item.submitter_name}{item.submitter_email&&` · ${item.submitter_email}`}</div>}
                {item.status==='pending'&&(
                  <>
                    <div style={{display:'flex',gap:8}}>
                      <button onClick={()=>approve(tab==='submissions'?'ds_submissions':tab==='reviews'?'ds_reviews':'ds_corrections',item.id)} style={{padding:'6px 14px',borderRadius:7,border:'1px solid #bbf7d0',color:'#16a34a',background:'#f0fdf4',fontSize:12,fontWeight:600,cursor:'pointer'}}>✓ Approve</button>
                      <button onClick={()=>setRejectOpen(p=>({...p,[item.id]:!p[item.id]}))} style={{padding:'6px 14px',borderRadius:7,border:'1px solid #fecaca',color:'#dc2626',background:'#fef2f2',fontSize:12,fontWeight:600,cursor:'pointer'}}>✕ Reject</button>
                      {tab==='submissions'&&<button style={{padding:'6px 14px',borderRadius:7,border:'1px solid #e2e8f0',color:'#64748b',background:'#fff',fontSize:12,cursor:'pointer'}}>Edit</button>}
                      {tab==='submissions'&&<button style={{padding:'6px 14px',borderRadius:7,border:'1px solid #e2e8f0',color:'#64748b',background:'#fff',fontSize:12,cursor:'pointer'}}>Mark verified</button>}
                    </div>
                    {rejectOpen[item.id]&&(
                      <div style={{display:'flex',gap:8,marginTop:8}}>
                        <input style={inp} placeholder="Reason for rejection (optional)" value={rejectInputs[item.id]||''} onChange={e=>setRejectInputs(p=>({...p,[item.id]:e.target.value}))}/>
                        <button onClick={()=>reject(tab==='submissions'?'ds_submissions':tab==='reviews'?'ds_reviews':'ds_corrections',item.id)} style={{padding:'6px 14px',borderRadius:7,border:'none',background:'#dc2626',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer'}}>Confirm reject</button>
                      </div>
                    )}
                  </>
                )}
                {item.status==='rejected'&&item.reject_reason&&<div style={{fontSize:12,color:'#dc2626',marginTop:6}}>Rejected: {item.reject_reason}</div>}
              </div>
            ))}
            {(tab==='submissions'?data.submissions:tab==='reviews'?data.reviews:data.corrections).length===0&&(
              <div style={{textAlign:'center',padding:'3rem',color:'#94a3b8',fontSize:13,background:'#fff',borderRadius:12,border:'1px solid #e2e8f0'}}>No submissions yet</div>
            )}
          </div>
        )}
      </div>
      <footer style={{background:'#0a1628',color:'#475569',padding:'2rem',textAlign:'center',fontSize:12,borderTop:'1px solid #1e3a5f',marginTop:'2rem'}}>© 2026 Dive Spots. All rights reserved.</footer>
    </main>
  )
}
