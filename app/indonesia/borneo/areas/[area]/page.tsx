import { BORNEO_SITES, BORNEO_AREAS } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default async function BorneoAreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params
  const areaData = BORNEO_AREAS.find(a => a.slug === area)
  if (!areaData) { notFound(); return null }
  const sites = BORNEO_SITES.filter(s => s.areaSlug === area)

  return (
    <main style={{ minHeight:"100vh", background:"#0d1b2e" }}>
      <Navbar />
      <div style={{ background:"#020d1a", padding:"2rem", borderBottom:"1px solid #1e3a5f", color:"#fff" }}>
        <div style={{ fontSize:11,color:"#60a5fa",marginBottom:8 }}>
          <Link href="/indonesia/borneo" style={{ color:"#60a5fa" }}>Borneo</Link> › {areaData.name}
        </div>
        <h1 style={{ fontSize:32,fontWeight:900,marginBottom:6 }}>{areaData.name.toUpperCase()}</h1>
        <p style={{ color:"#64748b",fontSize:13 }}>{areaData.desc} · {sites.length} dive sites</p>
      </div>
      <div style={{ maxWidth:1100,margin:"0 auto",padding:"2rem" }}>
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          {sites.map(site=>(
            <Link key={site.slug} href={`/indonesia/borneo/${site.areaSlug}/${site.slug}`} style={{ display:"flex",alignItems:"center",gap:14,padding:"0.9rem 1.25rem",background:"#0a1628",border:"1px solid #1e3a5f",borderRadius:10,textDecoration:"none" }}>
              <div style={{ width:30,height:30,background:"#0d1b2e",border:"1px solid #1e3a5f",color:"#ef4444",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,flexShrink:0 }}>{site.rank}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700,fontSize:13,color:"#fff" }}>{site.name}</div>
                <div style={{ fontSize:11,color:"#475569" }}>{site.type} · {site.difficulty}</div>
              </div>
              <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                <span style={{ fontSize:11,padding:"2px 8px",background:"#0d1b2e",border:"1px solid #1e3a5f",borderRadius:6,color:"#64748b" }}>{site.minDepth}–{site.maxDepth}m</span>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:12,color:"#f59e0b",fontWeight:700 }}>★ {site.rating}</div>
                  <div style={{ fontSize:10,color:"#475569" }}>{site.reviews} reviews</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <footer style={{ background:"#0a1628",borderTop:"1px solid #1e3a5f",color:"#475569",padding:"2rem",textAlign:"center",fontSize:12 }}>© 2026 Dive Spots. All rights reserved.</footer>
    </main>
  )
}
