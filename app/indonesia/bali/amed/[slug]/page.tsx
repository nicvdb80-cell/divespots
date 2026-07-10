import { AMED_SITES, getAmedSiteBySlug } from '@/lib/data'
import Navbar from '@/components/Navbar'
import DiveSiteTabs from '@/components/DiveSiteTabs'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const site = getAmedSiteBySlug(slug)
  if (!site) return {}
  return {
    title: `${site.name} Dive Site | Amed, Bali | Dive Spots`,
    description: `${site.name} dive guide — ${site.type}, ${site.minDepth}–${site.maxDepth}m, ${site.difficulty}. ${site.description.slice(0, 120)}`,
  }
}

export default async function AmedDiveSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const site = getAmedSiteBySlug(slug)
  if (!site) { notFound(); return null }
  const nearby = AMED_SITES.filter(s => s.slug !== site.slug).slice(0, 4)

  return (
    <main style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 60px)' }}>
        {/* Sidebar */}
        <aside style={{ background: '#0a1628', borderRight: '1px solid #1e3a5f', overflowY: 'auto', maxHeight: 'calc(100vh - 60px)', position: 'sticky', top: 60 }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #1e3a5f' }}>
            <div style={{ fontSize: 10, color: '#475569' }}>Bali · Indonesia</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>AMED</div>
            <Link href="/indonesia/bali/amed" style={{ fontSize: 10, color: '#60a5fa', textDecoration: 'none' }}>← All Amed sites</Link>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {AMED_SITES.map(s => (
              <Link key={s.slug} href={`/indonesia/bali/amed/${s.slug}`}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px', borderLeft: s.slug === site.slug ? '3px solid #ef4444' : '3px solid transparent', background: s.slug === site.slug ? '#1e3a5f' : 'none', textDecoration: 'none' }}>
                <span style={{ fontSize: 11, color: s.slug === site.slug ? '#ef4444' : '#334155', minWidth: 18, fontWeight: 700 }}>{s.rank}</span>
                <div>
                  <div style={{ fontSize: 12, color: s.slug === site.slug ? '#fff' : '#64748b', fontWeight: s.slug === site.slug ? 700 : 400, lineHeight: 1.3 }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: '#334155' }}>{s.type}</div>
                </div>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div style={{ background: '#0d1b2e' }}>
          <div style={{ background: '#020d1a', padding: '1.5rem 2rem', borderBottom: '1px solid #1e3a5f' }}>
            <div style={{ fontSize: 11, color: '#475569', marginBottom: 10 }}>
              <Link href="/indonesia/bali" style={{ color: '#475569', textDecoration: 'none' }}>Bali</Link>
              {' › '}<Link href="/indonesia/bali/amed" style={{ color: '#475569', textDecoration: 'none' }}>Amed</Link>
              {' › '}{site.name}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: '#1e3a5f', color: '#60a5fa', fontWeight: 700 }}>{site.type}</span>
                  <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: '#1e3a5f', color: '#60a5fa', fontWeight: 700 }}>{site.access}</span>
                  <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: '#0f2a1a', color: '#22c55e', fontWeight: 700 }}>✓ Admin Verified</span>
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{site.name}</h1>
                <div style={{ fontSize: 12, color: '#475569' }}>Amed · Bali · Indonesia</div>
              </div>
              <div style={{ background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 12, padding: '1rem', minWidth: 200 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#f59e0b' }}>★ {site.rating}</div>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 8 }}>{site.reviews} diver reviews</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {[['Depth',`${site.minDepth}–${site.maxDepth}m`],['Visibility',site.visibility],['Current',site.current.split('—')[0].trim()],['Temp',site.temp],['Level',site.difficulty],['Cert',site.minCert]].map(([k,v]) => (
                    <div key={k}><div style={{ fontSize: 9, color: '#475569', letterSpacing: 1 }}>{k.toUpperCase()}</div><div style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 600 }}>{v}</div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: '1.5rem 2rem' }}>
            <DiveSiteTabs site={site!} />
            {nearby.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 10, letterSpacing: 2 }}>MORE AMED DIVE SITES</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {nearby.map(n => (
                    <Link key={n.slug} href={`/indonesia/bali/amed/${n.slug}`} style={{ textDecoration: 'none' }}>
                      <div style={{ background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 8, padding: '0.75rem' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 2 }}>{n.name}</div>
                        <div style={{ fontSize: 10, color: '#475569' }}>{n.type} · ★ {n.rating}</div>
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
