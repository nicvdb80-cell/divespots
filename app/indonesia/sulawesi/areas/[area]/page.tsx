import { SULAWESI_SITES, SULAWESI_AREAS, getSulawesiSiteBySlug } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params
  const areaData = SULAWESI_AREAS.find(a => a.slug === area)
  if (!areaData) return {}
  return {
    title: `${areaData.name} Dive Sites | Sulawesi, Indonesia | Dive Spots`,
    description: `Dive sites in ${areaData.name}, Sulawesi. ${areaData.desc}. Explore all ${areaData.count} dive sites.`,
  }
}

export default async function SulawesiAreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params
  const areaData = SULAWESI_AREAS.find(a => a.slug === area)
  if (!areaData) notFound()
  const sites = SULAWESI_SITES.filter(s => s.areaSlug === area)

  return (
    <main style={{ minHeight: '100vh', background: '#0d1b2e' }}>
      <Navbar />
      <div style={{ background: '#020d1a', padding: '2rem', borderBottom: '1px solid #1e3a5f' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: '#475569', marginBottom: 8 }}>
            <Link href="/indonesia" style={{ color: '#475569', textDecoration: 'none' }}>Indonesia</Link>
            {' › '}
            <Link href="/indonesia/sulawesi" style={{ color: '#475569', textDecoration: 'none' }}>Sulawesi</Link>
            {' › '}{areaData.name}
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#fff', marginBottom: 6 }}>{areaData.name.toUpperCase()}</h1>
          <p style={{ color: '#64748b', fontSize: 13 }}>{areaData.desc} · {areaData.count} dive sites</p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        {sites.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {sites.map(site => (
              <Link key={site.slug} href={`/indonesia/sulawesi/${site.areaSlug}/${site.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 12, padding: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: '#1e3a5f', color: '#60a5fa', fontWeight: 700 }}>{site.type}</span>
                    <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: '#1e3a5f', color: '#60a5fa', fontWeight: 700 }}>{site.difficulty}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#e2e8f0', marginBottom: 4 }}>{site.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5, marginBottom: 10 }}>{site.description.slice(0, 100)}…</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>★ {site.rating}</span>
                    <span style={{ fontSize: 10, color: '#475569' }}>{site.minDepth}–{site.maxDepth}m</span>
                    <span style={{ fontSize: 10, color: '#60a5fa' }}>{site.minCert}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🤿</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>More sites coming soon</div>
            <p style={{ fontSize: 12, maxWidth: 300, margin: '0 auto' }}>We're adding more dive sites to {areaData.name}. Check back soon or submit a site you know!</p>
            <Link href="/submit-dive-site" style={{ display: 'inline-block', marginTop: 16, background: '#ef4444', color: '#fff', padding: '8px 20px', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>Submit a site</Link>
          </div>
        )}
      </div>

      <footer style={{ background: '#0a1628', color: '#475569', padding: '2rem', textAlign: 'center', fontSize: 12, borderTop: '1px solid #1e3a5f', marginTop: '2rem' }}>
        © 2026 Dive Spots. All rights reserved.
      </footer>
    </main>
  )
}
