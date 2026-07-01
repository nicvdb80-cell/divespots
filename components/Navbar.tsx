'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const path = usePathname()
  const links = [
    ['Destinations', '/destinations'],
    ['Top 20', '/indonesia/bali/top-20-dive-sites'],
    ['Dive Sites', '/dive-sites'],
    ['Marine Life', '/marine-life'],
    ['Map', '/map'],
    ['Community', '/community'],
    ['About', '/about'],
  ]
  return (
    <nav style={{background:'#0a1628',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 2rem',position:'sticky',top:0,zIndex:200,borderBottom:'1px solid #1e3a5f'}}>
      <Link href="/" style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
        <div style={{width:32,height:32,background:'#ef4444',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#fff',letterSpacing:-0.5}}>DS</div>
        <div>
          <div style={{color:'#fff',fontWeight:900,fontSize:14,letterSpacing:1,lineHeight:1}}>DIVE SPOTS</div>
          <div style={{color:'#475569',fontSize:9,letterSpacing:2,textTransform:'uppercase'}}>Explore · Dive · Discover</div>
        </div>
      </Link>
      <div style={{display:'flex',alignItems:'center',gap:0}}>
        {links.map(([l,h])=>(
          <Link key={l} href={h} style={{color:path===h?'#fff':'#94a3b8',fontSize:12,padding:'6px 12px',borderRadius:6,fontWeight:500,whiteSpace:'nowrap',background:path===h?'#1e3a5f':'none'}}>{l}</Link>
        ))}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
        <div style={{background:'#1e3a5f',borderRadius:20,padding:'5px 14px',display:'flex',alignItems:'center',gap:6,cursor:'text'}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <span style={{fontSize:12,color:'#475569'}}>Search dive sites…</span>
        </div>
        <Link href="/submit-dive-site" style={{width:28,height:28,background:'#ef4444',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:18,fontWeight:300,flexShrink:0}}>+</Link>
        <Link href="/admin" style={{fontSize:11,color:'#94a3b8',padding:'5px 12px',border:'1px solid #1e3a5f',borderRadius:6}}>Admin</Link>
        <div style={{fontSize:11,color:'#94a3b8',padding:'5px 12px',border:'1px solid #1e3a5f',borderRadius:6,cursor:'pointer'}}>Sign in</div>
      </div>
    </nav>
  )
}
