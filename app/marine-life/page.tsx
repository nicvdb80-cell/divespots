import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { BALI_SITES } from '@/lib/data'
export const metadata = { title: 'Marine Life | Dive Spots', description: 'Discover the marine life you can encounter at dive sites in Bali and across Indonesia.' }
const species = [
  {name:'Reef Manta Ray',sites:'Manta Point, Manta Bay',freq:'Very common',depth:'10–20m',season:'Apr–Oct',category:'Rays'},
  {name:'Mola Mola (Ocean Sunfish)',sites:'Crystal Bay',freq:'Seasonal',depth:'20–40m',season:'Jul–Sep',category:'Pelagics'},
  {name:'Green Sea Turtle',sites:'Multiple sites',freq:'Common',depth:'5–25m',season:'Year round',category:'Turtles'},
  {name:'Bumphead Parrotfish',sites:'USAT Liberty Wreck',freq:'Common',depth:'5–15m',season:'Apr–Nov',category:'Fish'},
  {name:'Pygmy Seahorse',sites:'Tulamben Drop Off, Amed Wall',freq:'Rare',depth:'20–35m',season:'Year round',category:'Macro'},
  {name:'Mimic Octopus',sites:'Seraya Secrets',freq:'Occasional',depth:'5–15m',season:'Year round',category:'Macro'},
  {name:'Blue-ringed Octopus',sites:'Seraya Secrets',freq:'Rare',depth:'5–15m',season:'Year round',category:'Macro'},
  {name:'Flamboyant Cuttlefish',sites:'Seraya Secrets, Secret Bay',freq:'Occasional',depth:'5–15m',season:'Year round',category:'Macro'},
  {name:'Whitetip Reef Shark',sites:'Multiple sites',freq:'Occasional',depth:'10–30m',season:'Year round',category:'Sharks'},
  {name:'Hammerhead Shark',sites:'Drift Dive Nusa Penida',freq:'Seasonal',depth:'20–35m',season:'May–Sep',category:'Sharks'},
  {name:'Hairy Frogfish',sites:'Secret Bay',freq:'Occasional',depth:'2–12m',season:'Year round',category:'Macro'},
  {name:'Ghost Pipefish',sites:'Secret Bay, Seraya Secrets',freq:'Occasional',depth:'5–15m',season:'Year round',category:'Macro'},
]
const freqColor = (f:string) => ({'Very common':'#16a34a','Common':'#2563eb','Occasional':'#d97706','Seasonal':'#7c3aed','Rare':'#dc2626'}[f]||'#64748b')
export default function MarineLifePage() {
  return (
    <main style={{minHeight:'100vh',background:'#fff'}}>
      <Navbar/>
      <div style={{background:'linear-gradient(135deg,#0a1628,#1e3a5f)',padding:'3rem 2rem',color:'#fff',borderBottom:'1px solid #1e3a5f'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <h1 style={{fontSize:36,fontWeight:900,letterSpacing:-1,marginBottom:10}}>MARINE LIFE</h1>
          <p style={{color:'#64748b',fontSize:14,lineHeight:1.7,maxWidth:540}}>A guide to the marine species you may encounter at dive sites in Bali and Indonesia. Updated by our diver community.</p>
        </div>
      </div>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'2.5rem 2rem'}}>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {species.map(s=>(
            <div key={s.name} style={{display:'flex',alignItems:'center',gap:16,padding:'1rem 1.25rem',border:'1px solid #f1f5f9',borderRadius:10,background:'#fff'}}>
              <div style={{width:40,height:40,background:'#f1f5f9',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>🐠</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:'#0a1628',marginBottom:2}}>{s.name}</div>
                <div style={{fontSize:12,color:'#64748b'}}>{s.sites} · {s.depth}</div>
              </div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <span style={{fontSize:10,padding:'3px 10px',background:'#f1f5f9',borderRadius:10,color:'#64748b'}}>{s.season}</span>
                <span style={{fontSize:10,padding:'3px 10px',background:'#f1f5f9',borderRadius:10,color:'#64748b'}}>{s.category}</span>
                <span style={{fontSize:11,fontWeight:700,color:freqColor(s.freq),minWidth:80,textAlign:'right'}}>{s.freq}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:'2rem',padding:'1.5rem',background:'#f8fafc',borderRadius:12,border:'1px solid #e2e8f0',textAlign:'center'}}>
          <div style={{fontWeight:700,fontSize:14,color:'#0a1628',marginBottom:4}}>Spotted something not on this list?</div>
          <Link href="/submit-dive-site" style={{fontSize:13,color:'#2563eb',fontWeight:500}}>Submit a marine life sighting →</Link>
        </div>
      </div>
      <footer style={{background:'#0a1628',color:'#475569',padding:'2rem',textAlign:'center',fontSize:12,borderTop:'1px solid #1e3a5f'}}>© 2026 Dive Spots. All rights reserved.</footer>
    </main>
  )
}
