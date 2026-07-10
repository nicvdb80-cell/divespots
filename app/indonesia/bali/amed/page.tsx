import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { AMED_SITES } from '@/lib/data'

export const metadata = {
  title: 'Amed Dive Sites | Bali, Indonesia | Dive Spots',
  description: 'Explore 21 dive sites in Amed, Bali — Japanese Shipwreck, Pyramids, Bunutan drift dive, Lipah Bay turtles, Ghost Bay muck diving, and Gili Selang.',
}

export default function AmedPage() {
  const byType = {
    muck:  AMED_SITES.filter(s => s.type === 'Muck'),
    wall:  AMED_SITES.filter(s => s.type === 'Wall'),
    drift: AMED_SITES.filter(s => s.type === 'Drift'),
    wreck: AMED_SITES.filter(s => s.type === 'Wreck'),
    reef:  AMED_SITES.filter(s => s.type === 'Reef'),
  }
  return (
    <main style={{ minHeight: '100vh', background: '#0d1b2e' }}>
      <Navbar />
      <div style={{ background: '#020d1a', padding: '2.5rem 2rem', borderBottom: '1px solid #1e3a5f' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: '#60a5fa', marginBottom: 8 }}>
            <Link href="/destinations" style={{ color: '#475569', textDecoration: 'none' }}>Destinations</Link>
            {' › '}<Link href="/indonesia" style={{ color: '#475569', textDecoration: 'none' }}>Indonesia</Link>
            {' › '}<Link href="/indonesia/bali" style={{ color: '#475569', textDecoration: 'none' }}>Bali</Link>
            {' › '}Amed
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 10, letterSpacing: -1 }}>AMED DIVE SITES</h1>
          <p style={{ color: '#64748b', maxWidth: 580, fontSize: 13, lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Amed is Bali's most diverse diving region — a 10km stretch of coastline combining shallow muck dives, dramatic walls, thrilling drift dives, colourful wrecks, and world-class macro photography. Shore diving dominates, with jukung boats reaching exposed pelagic sites at the eastern tip.
          </p>
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[['21','Dive sites'],['26–30°C','Water temp'],['5–70m','Depth range'],['Year round','Diving']].map(([n,l]) => (
              <div key={l}><div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{n}</div><div style={{ fontSize: 10, color: '#475569', letterSpacing: 1 }}>{l.toUpperCase()}</div></div>
            ))}
          </div>
        </div>
      </div>

      {/* Type strip */}
      <div style={{ background: '#0a1628', borderBottom: '1px solid #1e3a5f', padding: '0.75rem 2rem', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {[['🤿','All sites', AMED_SITES.length],['🐌','Muck',byType.muck.length],['🪸','Wall',byType.wall.length],['💨','Drift',byType.drift.length],['🚢','Wreck',byType.wreck.length],['🐠','Reef',byType.reef.length]].map(([emoji,label,count]) => (
          <div key={String(label)} style={{ padding: '8px 16px', background: '#0d1b2e', border: '1px solid #1e3a5f', borderRadius: 8, fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>
            {emoji} {label} <span style={{ color: '#475569' }}>({count})</span>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        {/* Quick guide */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: '2.5rem' }}>
          {[
            { title: 'Best for Beginners', sites: ['Lipah Bay', 'Coral Garden', 'Jemeluk Bay'] },
            { title: 'Best Macro / Muck', sites: ['Ghost Bay', 'Melasti Beach', 'Seraya Secrets'] },
            { title: 'Best Drift Dives', sites: ['Bunutan', 'Deep Blue', 'Gili Selang'] },
            { title: 'Best Wrecks', sites: ['Japanese Shipwreck', 'Srikandi Wreck'] },
          ].map(g => (
            <div key={g.title} style={{ background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 10, padding: '1rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#60a5fa', marginBottom: 8, letterSpacing: 1 }}>{g.title.toUpperCase()}</div>
              {g.sites.map(s => <div key={s} style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>· {s}</div>)}
            </div>
          ))}
        </div>

        {/* All sites grid */}
        <h2 style={{ fontSize: 14, fontWeight: 800, color: '#94a3b8', letterSpacing: 2, marginBottom: '1rem' }}>ALL AMED DIVE SITES</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {AMED_SITES.map(site => (
            <Link key={site.slug} href={`/indonesia/bali/amed/${site.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 10, padding: '1rem', display: 'flex', gap: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#1e3a5f', minWidth: 28 }}>#{site.rank}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 2 }}>{site.name}</div>
                  <div style={{ fontSize: 10, color: '#475569', marginBottom: 4 }}>{site.type} · {site.access} · {site.difficulty}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>★ {site.rating}</span>
                    <span style={{ fontSize: 10, color: '#334155' }}>{site.minDepth}–{site.maxDepth}m</span>
                    <span style={{ fontSize: 10, color: '#334155' }}>{site.visibility}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <footer style={{ background: '#0a1628', color: '#475569', padding: '2rem', textAlign: 'center', fontSize: 12, borderTop: '1px solid #1e3a5f', marginTop: '2rem' }}>
        © 2026 Dive Spots · Amed, Bali, Indonesia
      </footer>
    </main>
  )
}
