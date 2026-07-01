'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{background:'#0a1628',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 2rem',position:'sticky',top:0,zIndex:200,borderBottom:'1px solid #1e3a5f'}}>
      <Link href="/" style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
        <div style={{width:32,height:32,background:'#ef4444',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:900,color:'#fff'}}>DS</div>
        <div>
          <div style={{color:'#fff',fontWeight:900,fontSize:14,letterSpacing:1,lineHeight:1}}>DIVE SPOTS</div>
          <div style={{color:'#475569',fontSize:9,letterSpacing:2,textTransform:'uppercase'}}>Explore · Dive · Discover</div>
        </div>
      </Link>
      <div style={{display:'flex',alignItems:'center',gap:2}}>
        {[
          ['Destinations','/'],
          ['Top 20','/indonesia/bali'],
          ['Dive Sites','/dive-sites'],
          ['Marine Life','/'],
          ['Map','/map'],
          ['Community','/submit'],
          ['About','/'],
        ].map(([l,h])=>(
          <Link key={l} href={h} style={{color:'#94a3b8',fontSize:12,padding:'6px 12px',borderRadius:6,fontWeight:500,whiteSpace:'nowrap'}}>{l}</Link>
        ))}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
        <Link href="/submit" style={{fontSize:12,color:'#94a3b8',padding:'6px 12px',border:'1px solid #1e3a5f',borderRadius:6}}>/submit</Link>
        <div style={{width:28,height:28,background:'#ef4444',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:16,cursor:'pointer'}}>+</div>
        <div style={{fontSize:11,color:'#94a3b8',cursor:'pointer'}}>🔔</div>
        <div style={{fontSize:11,color:'#94a3b8',padding:'5px 12px',border:'1px solid #1e3a5f',borderRadius:6,cursor:'pointer'}}>Sign in</div>
      </div>
    </nav>
  )
}
