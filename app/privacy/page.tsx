import Navbar from '@/components/Navbar'
export default function Page() {
  return (
    <main style={{minHeight:'100vh',background:'#fff'}}>
      <Navbar/>
      <div style={{background:'linear-gradient(135deg,#0a1628,#1e3a5f)',padding:'3rem 2rem',color:'#fff',borderBottom:'1px solid #1e3a5f'}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <h1 style={{fontSize:32,fontWeight:900,letterSpacing:-1}}>Privacy</h1>
        </div>
      </div>
      <div style={{maxWidth:800,margin:'0 auto',padding:'3rem 2rem'}}>
        <p style={{fontSize:14,color:'#374151',lineHeight:1.8}}>This page is coming soon. For enquiries contact us at hello@divespots.com.</p>
      </div>
      <footer style={{background:'#0a1628',color:'#475569',padding:'2rem',textAlign:'center',fontSize:12,borderTop:'1px solid #1e3a5f'}}>© 2026 Dive Spots. All rights reserved.</footer>
    </main>
  )
}
