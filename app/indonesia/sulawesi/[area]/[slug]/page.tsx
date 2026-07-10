import { SULAWESI_SITES, getSulawesiSiteBySlug } from '@/lib/data'
import Navbar from '@/components/Navbar'
import DiveSiteTabs from '@/components/DiveSiteTabs'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ area: string; slug: string }> }) {
  const { slug } = await params
  const site = getSulawesiSiteBySlug(slug)
  if (!site) return {}
  return {
    title: `${site.name} Dive Site Guide | ${site.area}, Sulawesi, Indonesia | Dive Spots`,
    description: `Complete diver guide to ${site.name} in ${site.area}, Sulawesi. Depth ${site.minDepth}–${site.maxDepth}m. ${site.difficulty}. ${site.description.slice(0, 100)}`,
  }
}

export default async function SulawesiDiveSitePage({ params }: { params: Promise<{ area: string; slug: string }> }) {
  const { slug } = await params
  const site = getSulawesiSiteBySlug(slug)
  if (!site) { notFound(); return null }
  const nearby = SULAWESI_SITES.filter(s => s.areaSlug === site.areaSlug && s.slug !== site.slug).slice(0, 3)

  return (
    <main style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 60px)' }}>

        {/* Sidebar */}
        <aside style={{ background: '#0a1628', borderRight: '1px solid #1e3a5f', overflowY: 'auto', maxHeight: 'calc(100vh - 60px)', position: 'sticky', top: 60 }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #1e3a5f' }}>
            <div style={{ fontSize: 10, color: '#475569' }}>Indonesia</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>SULAWESI</div>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>Top dive sites</div>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {SULAWESI_SITES.map(s => (
              <Link key={s.slug} href={`/indonesia/sulawesi/${s.areaSlug}/${s.slug}`}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px', borderLeft: s.slug === site.slug ? '3px solid #ef4444' : '3px solid transparent', background: s.slug === site.slug ? '#1e3a5f' : 'none', textDecoration: 'none' }}>
                <span style={{ fontSize: 11, color: s.slug === site.slug ? '#ef4444' : '#334155', minWidth: 18, fontWeight: 700 }}>{s.rank}</span>
                <div>
                  <div style={{ fontSize: 12, color: s.slug === site.slug ? '#fff' : '#64748b', fontWeight: s.slug === site.slug ? 700 : 400, lineHeight: 1.3 }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: '#334155' }}>{s.area}</div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #1e3a5f', padding: '1rem' }}>
            <Link href="/indonesia/sulawesi" style={{ display: 'block', fontSize: 12, color: '#60a5fa', marginBottom: '1rem', textDecoration: 'none' }}>View all Sulawesi sites</Link>
            <Link href="/submit-dive-site" style={{ display: 'block', background: '#16a34a', color: '#fff', padding: '7px 10px', borderRadius: 7, fontSize: 11, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>Submit a dive site</Link>
          </div>
        </aside>

        {/* Main content */}
        <div style={{ background: '#0d1b2e' }}>
          {/* Breadcrumb + header */}
          <div style={{ background: '#020d1a', padding: '1.5rem 2rem', borderBottom: '1px solid #1e3a5f' }}>
            <div style={{ fontSize: 11, color: '#475569', marginBottom: 10 }}>
              <Link href="/indonesia" style={{ color: '#475569', textDecoration: 'none' }}>Indonesia</Link>
              {' › '}
              <Link href="/indonesia/sulawesi" style={{ color: '#475569', textDecoration: 'none' }}>Sulawesi</Link>
              {' › '}
              <Link href={`/indonesia/sulawesi/areas/${site.areaSlug}`} style={{ color: '#475569', textDecoration: 'none' }}>{site.area}</Link>
              {' › '}{site.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: '#1e3a5f', color: '#60a5fa', fontWeight: 700 }}>{site.type}</span>
                  <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: '#1e3a5f', color: '#60a5fa', fontWeight: 700 }}>{site.access}</span>
                  <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: '#0f2a1a', color: '#22c55e', fontWeight: 700 }}>✓ Admin Verified</span>
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{site.name}</h1>
                <div style={{ fontSize: 12, color: '#475569' }}>{site.area}, Sulawesi, Indonesia</div>
              </div>
              <div style={{ background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 12, padding: '1rem', minWidth: 180, flexShrink: 0 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#f59e0b' }}>★ {site.rating}</div>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 8 }}>{site.reviews} diver reviews</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {[
                    ['Depth', `${site.minDepth}–${site.maxDepth}m`],
                    ['Visibility', site.visibility],
                    ['Current', site.current],
                    ['Temp', site.temp],
                    ['Level', site.difficulty],
                    ['Cert', site.minCert],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 9, color: '#475569', letterSpacing: 1 }}>{k.toUpperCase()}</div>
                      <div style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ padding: '1.5rem 2rem' }}>
            <DiveSiteTabs site={site!} />

            {/* Nearby sites */}
            {nearby.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 10, letterSpacing: 1 }}>MORE IN {site.area.toUpperCase()}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {nearby.map(n => (
                    <Link key={n.slug} href={`/indonesia/sulawesi/${n.areaSlug}/${n.slug}`} style={{ textDecoration: 'none' }}>
                      <div style={{ background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 8, padding: '0.75rem' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 2 }}>{n.name}</div>
                        <div style={{ fontSize: 10, color: '#475569' }}>{n.type} · {n.minDepth}–{n.maxDepth}m · ★ {n.rating}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
