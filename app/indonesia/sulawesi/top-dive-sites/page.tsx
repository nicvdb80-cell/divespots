import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { SULAWESI_SITES } from '@/lib/data'

export const metadata = {
  title: 'Top 20 Sulawesi Dive Sites | Bunaken & Lembeh | Dive Spots',
  description: 'The top 20 dive sites in Sulawesi, Indonesia — from the legendary walls of Bunaken to the world-famous muck diving of Lembeh Strait.',
}

export default function SulawesiTopSitesPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0d1b2e' }}>
      <Navbar />
      <div style={{ background: '#020d1a', padding: '2rem', borderBottom: '1px solid #1e3a5f' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: '#475569', marginBottom: 8 }}>
            <Link href="/indonesia/sulawesi" style={{ color: '#475569', textDecoration: 'none' }}>Sulawesi</Link> › Top dive sites
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 6 }}>TOP SULAWESI DIVE SITES</h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>Ranked by rating across Bunaken, Lembeh Strait, Bangka Island and Manado Bay.</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
        {SULAWESI_SITES.map((site, i) => (
          <Link key={site.slug} href={`/indonesia/sulawesi/${site.areaSlug}/${site.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 12, padding: '1.25rem', marginBottom: 10 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: i < 3 ? '#f59e0b' : '#1e3a5f', minWidth: 36 }}>#{site.rank}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: '#1e3a5f', color: '#60a5fa', fontWeight: 700 }}>{site.type}</span>
                  <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: '#1e3a5f', color: '#60a5fa', fontWeight: 700 }}>{site.area}</span>
                  <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: '#1e3a5f', color: '#60a5fa', fontWeight: 700 }}>{site.difficulty}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#e2e8f0', marginBottom: 4 }}>{site.name}</div>
                <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5, marginBottom: 8 }}>{site.description.slice(0, 130)}…</div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>★ {site.rating}</span>
                  <span style={{ fontSize: 10, color: '#475569' }}>{site.reviews} reviews</span>
                  <span style={{ fontSize: 10, color: '#475569' }}>{site.minDepth}–{site.maxDepth}m</span>
                  <span style={{ fontSize: 10, color: '#475569' }}>{site.visibility} vis</span>
                  <span style={{ fontSize: 10, color: '#475569' }}>{site.minCert}</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#60a5fa', fontWeight: 600, flexShrink: 0 }}>View →</div>
            </div>
          </Link>
        ))}
      </div>

      <footer style={{ background: '#0a1628', color: '#475569', padding: '2rem', textAlign: 'center', fontSize: 12, borderTop: '1px solid #1e3a5f' }}>
        © 2026 Dive Spots. All rights reserved.
      </footer>
    </main>
  )
}
