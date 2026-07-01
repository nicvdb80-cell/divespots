import { BALI_SITES, BALI_AREAS } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return BALI_AREAS.map(a => ({ area: a.slug }))
}

export async function generateMetadata({ params }: { params: { area: string } }) {
  const area = BALI_AREAS.find(a => a.slug === params.area)
  if (!area) return {}
  return {
    title: `${area.name} Dive Sites | Bali, Indonesia | Dive Spots`,
    description: `Explore ${area.count} dive sites in ${area.name}, Bali. ${area.desc}`,
  }
}

const AREA_INFO: Record<string, { hero: string; desc: string; bestFor: string[]; conditions: string; season: string; depth: string }> = {
  'tulamben': { hero: 'Tulamben', desc: 'Tulamben is home to the famous USAT Liberty Wreck — one of the most accessible wreck dives in the world. The black volcanic beach, calm waters, and diverse marine life make it a must-dive destination for all levels.', bestFor: ['Wreck diving', 'Night diving', 'Macro photography', 'All levels'], conditions: 'Calm, mild current, excellent visibility', season: 'Year round, best Apr–Nov', depth: '3–30m' },
  'amed': { hero: 'Amed', desc: 'Amed is a laid-back fishing village with a string of beautiful bays and excellent diving. Wall dives, reef slopes, and good macro life make Amed a favourite for experienced divers.', bestFor: ['Wall diving', 'Reef diving', 'Macro life', 'Intermediate divers'], conditions: 'Mild current, good visibility', season: 'Apr–Nov', depth: '3–40m' },
  'nusa-penida': { hero: 'Nusa Penida', desc: 'Nusa Penida offers some of the most exhilarating diving in Southeast Asia. Famous for manta rays at Manta Point and Mola mola (ocean sunfish) at Crystal Bay, with strong currents and big pelagics.', bestFor: ['Manta rays', 'Mola mola', 'Big fish', 'Advanced divers'], conditions: 'Strong current, cold thermoclines, excellent visibility', season: 'Apr–Oct', depth: '5–40m' },
  'nusa-lembongan': { hero: 'Nusa Lembongan', desc: 'Nusa Lembongan offers a mix of reef and drift diving in a relaxed island setting. Close to Nusa Penida but generally calmer, with good marine life and colourful reefs.', bestFor: ['Reef diving', 'Drift diving', 'Marine life', 'Intermediate divers'], conditions: 'Moderate current', season: 'Apr–Oct', depth: '5–30m' },
  'padang-bai': { hero: 'Padang Bai', desc: 'Padang Bai is Bali\'s eastern ferry port with excellent dive sites nearby. Blue Lagoon is a top beginner site, while deeper sites offer reef sharks and turtles.', bestFor: ['Beginners', 'Reef diving', 'Turtles', 'Snorkelling'], conditions: 'Calm, mild current', season: 'Year round', depth: '2–25m' },
  'menjangan': { hero: 'Menjangan', desc: 'Menjangan Island in West Bali National Park is famous for its pristine vertical walls draped in sea fans and black coral. Crystal-clear water and mild conditions make it ideal for photographers.', bestFor: ['Wall diving', 'Photography', 'Marine life', 'All levels'], conditions: 'Mild current, crystal clear water', season: 'Apr–Nov', depth: '3–40m' },
  'pemuteran': { hero: 'Pemuteran', desc: 'Pemuteran is home to the world\'s largest Biorock reef restoration project. Calm conditions and rich marine life make it an excellent choice for beginners and divers interested in reef conservation.', bestFor: ['Beginners', 'Conservation diving', 'Training', 'Photography'], conditions: 'Calm, mild', season: 'Year round', depth: '3–18m' },
  'gilimanuk': { hero: 'Secret Bay', desc: 'Gilimanuk\'s Secret Bay is one of Asia\'s finest muck diving sites. The silty sandy bottom hides extraordinary critters — hairy frogfish, ghost pipefish, blue-ringed octopus, and mantis shrimp.', bestFor: ['Muck diving', 'Macro photography', 'Critters', 'All levels'], conditions: 'Calm, mild', season: 'Year round', depth: '2–15m' },
  'candidasa': { hero: 'Candidasa', desc: 'Candidasa offers reef and rock diving with reliable sightings of reef sharks, turtles, and schools of fish. A quieter alternative to the more popular east Bali sites.', bestFor: ['Reef diving', 'Marine life', 'Intermediate divers'], conditions: 'Moderate current', season: 'Apr–Nov', depth: '5–25m' },
}

export default function AreaPage({ params }: { params: { area: string } }) {
  const areaData = BALI_AREAS.find(a => a.slug === params.area)
  if (!areaData) notFound()
  const info = AREA_INFO[params.area] || { hero: areaData.name, desc: areaData.desc, bestFor: [], conditions: 'Check locally', season: 'Apr–Nov', depth: '5–30m' }
  const sites = BALI_SITES.filter(s => s.areaSlug === params.area)

  return (
    <main style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#0a1628,#1e3a5f)', padding: '3rem 2rem', color: '#fff', borderBottom: '1px solid #1e3a5f' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: '#60a5fa', marginBottom: 8 }}>
            <Link href="/" style={{ color: '#475569' }}>Home</Link> › <Link href="/indonesia" style={{ color: '#475569' }}>Indonesia</Link> › <Link href="/indonesia/bali" style={{ color: '#475569' }}>Bali</Link> › <span style={{ color: '#60a5fa' }}>{areaData.name}</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, marginBottom: 10 }}>{areaData.name.toUpperCase()}</h1>
          <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, maxWidth: 600, marginBottom: '1.5rem' }}>{info.desc}</p>
          <div style={{ display: 'flex', gap: '2.5rem' }}>
            {[['Depth', info.depth], ['Season', info.season], ['Conditions', info.conditions], ['Sites', `${areaData.count} dive sites`]].map(([k, v]) => (
              <div key={k}><div style={{ fontSize: 14, fontWeight: 800 }}>{v}</div><div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1 }}>{k}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        {/* Best for */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 10, letterSpacing: 1 }}>BEST FOR</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {info.bestFor.map(b => <span key={b} style={{ fontSize: 12, padding: '5px 14px', background: '#f1f5f9', borderRadius: 20, color: '#374151', fontWeight: 500 }}>{b}</span>)}
          </div>
        </div>

        {/* Map placeholder */}
        <div style={{ background: 'linear-gradient(135deg,#0a1628,#1e3a5f)', borderRadius: 12, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ textAlign: 'center', color: '#475569' }}>
            <div style={{ fontSize: 13, color: '#60a5fa', marginBottom: 4 }}>{areaData.name} — {sites.length} dive sites mapped</div>
            <div style={{ fontSize: 11, color: '#334155' }}>Interactive map coming soon</div>
          </div>
          {/* Fake site dots */}
          {sites.slice(0, 5).map((s, i) => (
            <div key={s.slug} style={{ position: 'absolute', width: 10, height: 10, background: '#ef4444', borderRadius: '50%', left: `${20 + i * 15}%`, top: `${30 + (i % 3) * 20}%`, border: '2px solid #fff' }} />
          ))}
        </div>

        {/* Dive site cards */}
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0a1628', marginBottom: '1.25rem' }}>DIVE SITES IN {areaData.name.toUpperCase()}</h2>
        {sites.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
            {sites.map(site => (
              <Link key={site.slug} href={`/indonesia/bali/${site.areaSlug}/${site.slug}`}
                style={{ display: 'flex', gap: 14, padding: '1.25rem', border: '1px solid #f1f5f9', borderRadius: 12, background: '#fff', alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, background: '#0a1628', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{site.rank}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0a1628', marginBottom: 4 }}>{site.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{site.type} · {site.minDepth}–{site.maxDepth}m · {site.difficulty}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 10, padding: '2px 8px', background: '#f1f5f9', borderRadius: 10, color: '#64748b' }}>{site.access}</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', background: '#f1f5f9', borderRadius: 10, color: '#64748b' }}>{site.minCert}</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', background: '#f1f5f9', borderRadius: 10, color: '#64748b' }}>{site.visibility}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 13, color: '#f59e0b', fontWeight: 700 }}>★ {site.rating}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{site.reviews} reviews</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: 12, textAlign: 'center', color: '#64748b', fontSize: 14 }}>
            More sites in {areaData.name} coming soon. <Link href="/submit-dive-site" style={{ color: '#2563eb' }}>Submit a dive site →</Link>
          </div>
        )}
      </div>
      <footer style={{ background: '#0a1628', color: '#475569', padding: '2rem', textAlign: 'center', fontSize: 12, marginTop: '3rem', borderTop: '1px solid #1e3a5f' }}>
        © 2026 Dive Spots. All rights reserved.
      </footer>
    </main>
  )
}
