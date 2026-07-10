'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { BALI_SITES, BALI_AREAS, RAJA_AMPAT_SITES, RAJA_AMPAT_AREAS } from '@/lib/data'

export default function DiveSitesPage() {
  const [baliArea, setBaliArea] = useState('all')
  const [rajaArea, setRajaArea] = useState('all')

  const filteredBali = baliArea === 'all' ? BALI_SITES : BALI_SITES.filter(s => s.areaSlug === baliArea)
  const filteredRaja = rajaArea === 'all' ? RAJA_AMPAT_SITES : RAJA_AMPAT_SITES.filter(s => s.areaSlug === rajaArea)

  return (
    <main style={{minHeight:'100vh',background:'#fff'}}>
      <Navbar />
      <div style={{background:'linear-gradient(135deg,#0a1628,#1e3a5f)',padding:'3rem 2rem',color:'#fff',borderBottom:'1px solid #1e3a5f'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <p style={{fontSize:11,letterSpacing:3,color:'#60a5fa',marginBottom:10,textTransform:'uppercase'}}>Dive Sites</p>
          <h1 style={{fontSize:36,fontWeight:900,letterSpacing:-1,marginBottom:10}}>ALL DIVE SITES</h1>
          <p style={{color:'#64748b',fontSize:14,lineHeight:1.7,maxWidth:560}}>Browse all verified dive sites by country, area, type, and difficulty. Currently featuring Bali and Raja Ampat, Indonesia.</p>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'2.5rem 2rem'}}>

        {/* ── BALI ── */}
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1.25rem'}}>
          <span style={{fontSize:24}}>🇮🇩</span>
          <div>
            <div style={{fontSize:11,color:'#94a3b8',letterSpacing:2,textTransform:'uppercase'}}>Indonesia</div>
            <div style={{fontSize:22,fontWeight:900,color:'#0a1628'}}>BALI</div>
          </div>
          <span style={{fontSize:11,padding:'3px 10px',background:'#dcfce7',color:'#16a34a',borderRadius:20,fontWeight:700,marginLeft:8}}>● Live</span>
        </div>

        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:'1.5rem'}}>
          {[{slug:'all',name:'All areas'},...BALI_AREAS].map(a=>(
            <button key={a.slug} onClick={()=>setBaliArea(a.slug)}
              style={{padding:'6px 14px',background:baliArea===a.slug?'#0a1628':'#fff',color:baliArea===a.slug?'#fff':'#64748b',border:'1px solid '+(baliArea===a.slug?'#0a1628':'#e2e8f0'),borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer'}}>
              {a.name}{'count' in a ? <span style={{opacity:.6,fontSize:11}}> ({a.count})</span> : ''}
            </button>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,marginBottom:'3rem'}}>
          {filteredBali.map(site=>(
            <Link key={site.slug} href={`/indonesia/bali/${site.areaSlug}/${site.slug}`}
              style={{display:'flex',gap:14,padding:'1.25rem',border:'1px solid #f1f5f9',borderRadius:12,background:'#fff',alignItems:'flex-start',textDecoration:'none'}}>
              <div style={{width:36,height:36,background:'#0a1628',color:'#ef4444',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13,flexShrink:0}}>{site.rank}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:'#0a1628',marginBottom:3}}>{site.name}</div>
                <div style={{fontSize:12,color:'#64748b',marginBottom:6}}>{site.area} · {site.type} · {site.minDepth}–{site.maxDepth}m</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  <span style={{fontSize:10,padding:'2px 8px',background:'#f1f5f9',borderRadius:10,color:'#64748b'}}>{site.difficulty}</span>
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

        {/* ── RAJA AMPAT ── */}
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1.25rem'}}>
          <span style={{fontSize:24}}>🇮🇩</span>
          <div>
            <div style={{fontSize:11,color:'#94a3b8',letterSpacing:2,textTransform:'uppercase'}}>Indonesia · West Papua</div>
            <div style={{fontSize:22,fontWeight:900,color:'#0a1628'}}>RAJA AMPAT</div>
          </div>
          <span style={{fontSize:11,padding:'3px 10px',background:'#dcfce7',color:'#16a34a',borderRadius:20,fontWeight:700,marginLeft:8}}>● Live</span>
        </div>

        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:'1.5rem'}}>
          {[{slug:'all',name:'All areas'},...RAJA_AMPAT_AREAS].map(a=>(
            <button key={a.slug} onClick={()=>setRajaArea(a.slug)}
              style={{padding:'6px 14px',background:rajaArea===a.slug?'#0a1628':'#fff',color:rajaArea===a.slug?'#fff':'#64748b',border:'1px solid '+(rajaArea===a.slug?'#0a1628':'#e2e8f0'),borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer'}}>
              {a.name}{'count' in a ? <span style={{opacity:.6,fontSize:11}}> ({a.count})</span> : ''}
            </button>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,marginBottom:'3rem'}}>
          {filteredRaja.map(site=>(
            <Link key={site.slug} href={`/indonesia/raja-ampat/${site.areaSlug}/${site.slug}`}
              style={{display:'flex',gap:14,padding:'1.25rem',border:'1px solid #f1f5f9',borderRadius:12,background:'#fff',alignItems:'flex-start',textDecoration:'none'}}>
              <div style={{width:36,height:36,background:'#0a1628',color:'#ef4444',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13,flexShrink:0}}>{site.rank}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:'#0a1628',marginBottom:3}}>{site.name}</div>
                <div style={{fontSize:12,color:'#64748b',marginBottom:6}}>{site.area} · {site.type} · {site.minDepth}–{site.maxDepth}m</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  <span style={{fontSize:10,padding:'2px 8px',background:'#f1f5f9',borderRadius:10,color:'#64748b'}}>{site.difficulty}</span>
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

        <div style={{padding:'1.5rem',background:'#f8fafc',borderRadius:12,border:'1px solid #e2e8f0',textAlign:'center'}}>
          <div style={{fontWeight:700,fontSize:14,color:'#0a1628',marginBottom:4}}>Philippines, Thailand, Maldives & more coming soon</div>
          <p style={{fontSize:13,color:'#64748b',marginBottom:12}}>Know a dive site we&apos;re missing? Help the community.</p>
          <Link href="/submit" style={{display:'inline-block',padding:'8px 20px',background:'#0a1628',color:'#fff',borderRadius:8,fontSize:13,fontWeight:700}}>Submit a dive site →</Link>
        </div>
      </div>

      <footer style={{background:'#0a1628',color:'#475569',padding:'2rem',borderTop:'1px solid #1e3a5f',textAlign:'center',fontSize:12}}>
        © 2026 Dive Spots. All rights reserved.
      </footer>
    </main>
  )
}
