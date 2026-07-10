import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { SULAWESI_SITES, SULAWESI_AREAS } from '@/lib/data'

export const metadata = {
  title: 'Sulawesi Dive Sites | Bunaken, Lembeh Strait, Manado | Dive Spots',
  description: 'Explore dive sites in Sulawesi, Indonesia — legendary walls of Bunaken, world-famous muck diving in Lembeh Strait, and pelagic action off Bangka Island.',
}

export default function SulawesiPage() {
  const topSites = SULAWESI_SITES.slice(0, 12)
  return (
    <main style={{ minHeight: '100vh', background: '#0d1b2e' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: '#020d1a', padding: '2.5rem 2rem', color: '#fff', borderBottom: '1px solid #1e3a5f' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: '#60a5fa', marginBottom: 8 }}>
            <Link href="/destinations" style={{ color: '#475569', textDecoration: 'none' }}>Destinations</Link>
            {' › '}
            <Link href="/indonesia" style={{ color: '#475569', textDecoration: 'none' }}>Indonesia</Link>
            {' › '}Sulawesi
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 10, letterSpacing: -1 }}>SULAWESI DIVE SITES</h1>
          <p style={{ color: '#64748b', maxWidth: 580, fontSize: 13, lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Sulawesi is a diver's world in itself — from the legendary vertical walls of Bunaken teeming with turtles, to the black sand of Lembeh Strait, the world capital of muck diving. Add pelagic seamounts off Bangka Island and you have one of the most diverse dive destinations on the planet.
          </p>
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[['150+','Dive sites'],['27–30°C','Water temp'],['40m+','Visibility'],['Year round','Diving']].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{n}</div>
                <div style={{ fontSize: 10, color: '#475569', letterSpacing: 1 }}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Area strip */}
      <div style={{ background: '#0a1628', borderBottom: '1px solid #1e3a5f', padding: '0.75rem 2rem', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {SULAWESI_AREAS.map(a => (
          <Link key={a.slug} href={`/indonesia/sulawesi/areas/${a.slug}`}
            style={{ padding: '8px 16px', background: '#0d1b2e', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 11, fontWeight: 600, color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0, textDecoration: 'none' }}>
            <div style={{ color: '#e2e8f0' }}>{a.name}</div>
            <div style={{ color: '#475569', fontSize: 10 }}>{a.count} dive sites</div>
          </Link>
        ))}
      </div>

      {/* Region highlights */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#e2e8f0', marginBottom: '1rem', letterSpacing: 1 }}>DIVE REGIONS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: '2.5rem' }}>
          {[
            { slug: 'bunaken', name: 'Bunaken National Marine Park', emoji: '🐢', desc: 'World-famous vertical walls dropping to 40m+ with guaranteed turtle encounters and exceptional fish life. Protected since 1991.', highlight: 'Legendary walls & turtles', best: 'May–Oct' },
            { slug: 'lembeh-strait', name: 'Lembeh Strait', emoji: '🐙', desc: 'The undisputed world capital of muck diving. Black sand slopes hiding mimic octopus, frogfish, nudibranch, and species seen nowhere else on earth.', highlight: 'World\'s best muck diving', best: 'Year round' },
            { slug: 'bangka-island', name: 'Bangka Island', emoji: '🦈', desc: 'Remote island northwest of Manado with pristine walls, excellent reef diving, and pelagic seamounts attracting hammerheads and schooling jacks.', highlight: 'Pelagics & pristine reefs', best: 'May–Oct' },
            { slug: 'manado-bay', name: 'Manado Bay', emoji: '🐟', desc: 'City-accessible diving from North Sulawesi\'s capital with reef walls, sloping reefs, and the iconic Manado Tua volcanic island.', highlight: 'Easy access from city', best: 'May–Oct' },
          ].map(r => (
            <Link key={r.slug} href={`/indonesia/sulawesi/areas/${r.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 12, padding: '1.25rem', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{r.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#e2e8f0', marginBottom: 4 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: '#60a5fa', fontWeight: 600, marginBottom: 8 }}>{r.highlight}</div>
                <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6, marginBottom: 8 }}>{r.desc}</p>
                <div style={{ fontSize: 10, color: '#334155' }}>Best season: {r.best}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Top sites grid */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#e2e8f0', letterSpacing: 1 }}>TOP DIVE SITES</h2>
          <Link href="/indonesia/sulawesi/top-dive-sites" style={{ fontSize: 12, color: '#60a5fa' }}>View all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {topSites.map(site => (
            <Link key={site.slug} href={`/indonesia/sulawesi/${site.areaSlug}/${site.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 10, padding: '1rem', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#1e3a5f', minWidth: 28 }}>#{site.rank}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 2 }}>{site.name}</div>
                  <div style={{ fontSize: 10, color: '#475569', marginBottom: 4 }}>{site.area} · {site.type} · {site.difficulty}</div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>★ {site.rating}</span>
                    <span style={{ fontSize: 10, color: '#334155' }}>{site.reviews} reviews</span>
                    <span style={{ fontSize: 10, color: '#334155' }}>{site.minDepth}–{site.maxDepth}m</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer style={{ background: '#0a1628', color: '#475569', padding: '2rem', textAlign: 'center', fontSize: 12, borderTop: '1px solid #1e3a5f', marginTop: '2rem' }}>
        © 2026 Dive Spots. All rights reserved.
      </footer>
    </main>
  )
}
