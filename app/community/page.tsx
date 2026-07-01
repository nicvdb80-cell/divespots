import Navbar from '@/components/Navbar'
import Link from 'next/link'
export const metadata = { title: 'Community | Dive Spots', description: 'Join the Dive Spots diver community — share experiences, submit corrections, and help build the world\'s best dive site database.' }
export default function CommunityPage() {
  return (
    <main style={{minHeight:'100vh',background:'#fff'}}>
      <Navbar/>
      <div style={{background:'linear-gradient(135deg,#0a1628,#1e3a5f)',padding:'3rem 2rem',color:'#fff',borderBottom:'1px solid #1e3a5f'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <h1 style={{fontSize:36,fontWeight:900,letterSpacing:-1,marginBottom:10}}>COMMUNITY</h1>
          <p style={{color:'#64748b',fontSize:14,lineHeight:1.7,maxWidth:540}}>Help build the world's most accurate dive site database. Every contribution is reviewed by our admin team before going live.</p>
        </div>
      </div>
      <div style={{maxWidth:900,margin:'0 auto',padding:'3rem 2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16,marginBottom:'2rem'}}>
          {[
            {title:'Submit a dive site',desc:'Know a great dive site that\'s not in our database? Submit it for review.',link:'/submit-dive-site',label:'Submit a dive site',color:'#0a1628'},
            {title:'Add your experience',desc:'Share your dive experience, conditions, and tips with the community.',link:'/submit-dive-site',label:'Add experience',color:'#2563eb'},
            {title:'Submit a correction',desc:'Found incorrect information? Help keep our data accurate and safe.',link:'/submit-dive-site',label:'Submit correction',color:'#d97706'},
            {title:'Report safety update',desc:'Hazards, changed conditions, or safety concerns — report them here.',link:'/submit-dive-site',label:'Report safety update',color:'#dc2626'},
          ].map(c=>(
            <div key={c.title} style={{background:'#f8fafc',borderRadius:14,padding:'1.5rem',border:'1px solid #e2e8f0'}}>
              <h3 style={{fontSize:15,fontWeight:700,color:'#0a1628',marginBottom:8}}>{c.title}</h3>
              <p style={{fontSize:13,color:'#64748b',lineHeight:1.6,marginBottom:'1rem'}}>{c.desc}</p>
              <Link href={c.link} style={{display:'inline-block',padding:'8px 18px',background:c.color,color:'#fff',borderRadius:8,fontSize:12,fontWeight:700}}>{c.label} →</Link>
            </div>
          ))}
        </div>
        <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:12,padding:'1.25rem'}}>
          <div style={{fontSize:13,fontWeight:700,color:'#92400e',marginBottom:6}}>All contributions are reviewed</div>
          <p style={{fontSize:13,color:'#78350f',lineHeight:1.6}}>Every submission — new sites, experiences, corrections, and safety updates — is reviewed by our admin team before appearing publicly. This ensures accuracy and safety for all divers.</p>
        </div>
      </div>
      <footer style={{background:'#0a1628',color:'#475569',padding:'2rem',textAlign:'center',fontSize:12,borderTop:'1px solid #1e3a5f'}}>© 2026 Dive Spots. All rights reserved.</footer>
    </main>
  )
}
