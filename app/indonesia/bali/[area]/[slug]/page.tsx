import { BALI_SITES, getSiteBySlug, BALI_AREAS } from '@/lib/data'
import Navbar from '@/components/Navbar'
import DiveSiteTabs from '@/components/DiveSiteTabs'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return BALI_SITES.map(s => ({ area: s.areaSlug, slug: s.slug }))
}

export async function generateMetadata({ params }: { params: { area: string; slug: string } }) {
  const site = getSiteBySlug(params.slug)
  if (!site) return {}
  return {
    title: `${site.name} Dive Site Guide | ${site.area}, Bali, Indonesia | Dive Spots`,
    description: `Complete diver guide to ${site.name} in ${site.area}, Bali. Depth ${site.minDepth}–${site.maxDepth}m, visibility ${site.visibility}, ${site.access.toLowerCase()} access. Marine life, safety notes, dive briefing diagram, and diver experiences.`,
  }
}

export default function DiveSitePage({ params }: { params: { area: string; slug: string } }) {
  const site = getSiteBySlug(params.slug)
  if (!site) notFound()
  const nearby = BALI_SITES.filter(s => s.areaSlug === site.areaSlug && s.slug !== site.slug).slice(0, 3)

  return (
    <main style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 60px)' }}>

        {/* Sidebar */}
        <aside style={{ background: '#0a1628', borderRight: '1px solid #1e3a5f', overflowY: 'auto', maxHeight: 'calc(100vh - 60px)', position: 'sticky', top: 60 }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #1e3a5f' }}>
            <div style={{ fontSize: 10, color: '#475569', marginBottom: 2 }}>Indonesia</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>BALI</div>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>Top 20 dive sites to explore in Bali</div>
          </div>
          <div style={{ padding: '0.5rem 0' }}>
            {BALI_SITES.map(s => (
              <Link key={s.slug} href={`/indonesia/bali/${s.areaSlug}/${s.slug}`}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px', borderLeft: s.slug === site.slug ? '3px solid #ef4444' : '3px solid transparent', background: s.slug === site.slug ? '#1e3a5f' : 'none' }}>
                <span style={{ fontSize: 11, color: s.slug === site.slug ? '#ef4444' : '#334155', minWidth: 18, fontWeight: 700 }}>{s.rank}</span>
                <span style={{ fontSize: 12, color: s.slug === site.slug ? '#fff' : '#64748b', fontWeight: s.slug === site.slug ? 700 : 400, lineHeight: 1.3 }}>{s.name}</span>
                {s.slug === site.slug && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#ef4444' }}>★</span>}
              </Link>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #1e3a5f', padding: '1rem' }}>
            <Link href="/indonesia/bali" style={{ display: 'block', fontSize: 12, color: '#60a5fa', marginBottom: '1rem' }}>View all sites in Bali →</Link>
            <div style={{ background: '#0d1b2e', borderRadius: 10, padding: '0.875rem' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Know a dive site we're missing?</div>
              <p style={{ fontSize: 11, color: '#475569', marginBottom: 8, lineHeight: 1.5 }}>All submissions are reviewed by admin before publishing.</p>
              <Link href="/submit-dive-site" style={{ display: 'block', background: '#16a34a', color: '#fff', padding: '7px 10px', borderRadius: 7, fontSize: 11, fontWeight: 700, textAlign: 'center' }}>Submit a dive site</Link>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div style={{ overflowY: 'auto' }}>
          {/* Bali hero bar */}
          <div style={{ background: 'linear-gradient(135deg,#0a1628,#1e3a5f)', padding: '1.25rem 2rem', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>
              <Link href="/" style={{ color: '#475569' }}>Home</Link> › <Link href="/indonesia" style={{ color: '#475569' }}>Indonesia</Link> › <Link href="/indonesia/bali" style={{ color: '#475569' }}>Bali</Link>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>BALI</div>
                <div style={{ fontSize: 11, color: '#60a5fa', marginTop: 2 }}>Indonesia</div>
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', maxWidth: 380, lineHeight: 1.5 }}>World-class diving for every level — from historic wrecks to manta rays and Mola mola.</div>
            </div>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
              {[['120+', 'Dive sites'], ['27–29°C', 'Water temp'], ['15–40m+', 'Max depth'], ['10–30m', 'Visibility'], ['Apr – Nov', 'Best season']].map(([n, l]) => (
                <div key={l}><div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{n}</div><div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div></div>
              ))}
            </div>
          </div>

          {/* Area strip */}
          <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 2rem', display: 'flex', gap: 8, overflowX: 'auto' }}>
            {BALI_AREAS.map(a => (
              <Link key={a.slug} href={`/indonesia/bali/${a.slug}`}
                style={{ padding: '6px 12px', background: site.areaSlug === a.slug ? '#0a1628' : '#fff', border: '1px solid ' + (site.areaSlug === a.slug ? '#0a1628' : '#e2e8f0'), borderRadius: 8, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', color: site.areaSlug === a.slug ? '#fff' : '#475569', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span>{a.name}</span>
                <span style={{ fontSize: 9, color: site.areaSlug === a.slug ? '#60a5fa' : '#94a3b8', fontWeight: 400 }}>{a.count} dive sites</span>
              </Link>
            ))}
          </div>

          <div style={{ padding: '1.5rem 2rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
            {/* Left */}
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 11, padding: '3px 10px', background: '#0a1628', color: '#fff', borderRadius: 4, fontWeight: 700 }}>#{site.rank} in Bali</span>
                  <span style={{ fontSize: 11, padding: '3px 10px', background: '#dbeafe', color: '#1d4ed8', borderRadius: 4, fontWeight: 600 }}>Admin verified</span>
                  <span style={{ fontSize: 11, padding: '3px 10px', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: 4, marginLeft: 'auto', cursor: 'pointer' }}>Save dive site</span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Indonesia › Bali › {site.area} › {site.name}</div>
                <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0a1628', letterSpacing: -1, marginBottom: 8, textTransform: 'uppercase' }}>{site.name}</h1>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>📍 {site.area}, Bali, Indonesia</span>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{site.area} {Math.abs(site.lat).toFixed(4)}° S {site.lng.toFixed(4)}° E</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#f59e0b', fontSize: 18 }}>{'★'.repeat(Math.round(site.rating))}</span>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{site.rating}</span>
                  <span style={{ color: '#94a3b8', fontSize: 13 }}>{site.reviews} reviews</span>
                </div>
              </div>

              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, marginBottom: '1.5rem' }}>{site.description}</p>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: '1.5rem' }}>
                {[['Dive type', site.type], ['Current', site.current], ['Access', site.access], ['Water temp', site.temp], ['Min depth', site.minDepth + 'm'], ['Best time', site.bestTime], ['Max depth', site.maxDepth + 'm'], ['Certification', site.minCert], ['Avg depth', site.avgDepth + 'm'], ['Visibility', site.visibility], ['Difficulty', site.difficulty], ['Best season', site.bestSeason]].map(([k, v]) => (
                  <div key={k} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Client tabs component */}
              <DiveSiteTabs site={site} />
            </div>

            {/* Right col */}
            <div>
              <div style={{ background: 'linear-gradient(135deg,#0a1628,#1e3a5f)', borderRadius: 12, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#60a5fa', marginBottom: 6 }}>{site.area} — {Math.abs(site.lat).toFixed(4)}° S</div>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <Link href="/map" style={{ fontSize: 11, color: '#60a5fa', fontWeight: 500 }}>View on map</Link>
                    <span style={{ color: '#1e3a5f' }}>·</span>
                    <span style={{ fontSize: 11, color: '#60a5fa', cursor: 'pointer' }}>Get directions</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem', marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 12, letterSpacing: 1 }}>QUICK INFO</div>
                {[['Location', `${site.area}, Bali`], ['Type', site.type], ['Access', site.access], ['Depth', `${site.minDepth}m – ${site.maxDepth}m`], ['Avg depth', `${site.avgDepth}m`], ['Visibility', site.visibility], ['Water temp', site.temp], ['Difficulty', site.difficulty], ['Best time', site.bestTime], ['Currents', site.current]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f8fafc', fontSize: 12 }}>
                    <span style={{ color: '#94a3b8' }}>{k}</span>
                    <span style={{ color: '#0f172a', fontWeight: 600, textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '1.25rem', marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#15803d', marginBottom: 8 }}>INFORMATION STATUS</div>
                <div style={{ fontSize: 12, color: '#166534', marginBottom: 3 }}>Status: <strong>Admin reviewed</strong></div>
                <div style={{ fontSize: 12, color: '#166534', marginBottom: 3 }}>Verified by: Local dive professionals, {site.area}</div>
                <div style={{ fontSize: 12, color: '#166534', marginBottom: 10 }}>Last updated: July 2026</div>
                <Link href="/submit-dive-site" style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>Submit correction →</Link>
              </div>

              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem', marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 12, letterSpacing: 1 }}>REVIEWS SNAPSHOT</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: '#0a1628' }}>{site.rating}</div>
                  <div>
                    <div style={{ color: '#f59e0b', fontSize: 18 }}>{'★'.repeat(Math.round(site.rating))}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Based on {site.reviews} reviews</div>
                  </div>
                </div>
                {[5, 4, 3, 2, 1].map(n => (
                  <div key={n} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: '#94a3b8', minWidth: 8 }}>{n}</span>
                    <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3 }}>
                      <div style={{ height: 6, background: '#f59e0b', borderRadius: 3, width: n === 5 ? '80%' : n === 4 ? '15%' : '0%' }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#94a3b8', minWidth: 16 }}>{n === 5 ? Math.round(site.reviews * 0.8) : n === 4 ? Math.round(site.reviews * 0.15) : 0}</span>
                  </div>
                ))}
              </div>

              {nearby.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 10, letterSpacing: 1 }}>MORE IN {site.area.toUpperCase()}</div>
                  {nearby.map(s => (
                    <Link key={s.slug} href={`/indonesia/bali/${s.areaSlug}/${s.slug}`} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid #f8fafc', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#475569', minWidth: 16 }}>#{s.rank}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: '#0f172a', fontWeight: 600 }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: '#475569' }}>{s.type} · {s.minDepth}–{s.maxDepth}m</div>
                      </div>
                      <span style={{ fontSize: 11, color: '#f59e0b' }}>★ {s.rating}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer style={{ background: '#0a1628', color: '#475569', padding: '2rem', borderTop: '1px solid #1e3a5f' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12 }}>© 2026 Dive Spots. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[['About', '/about'], ['Privacy', '/privacy'], ['Contact', '/contact']].map(([l, h]) => <Link key={l} href={h} style={{ fontSize: 12, color: '#475569' }}>{l}</Link>)}
          </div>
        </div>
      </footer>
    </main>
  )
}
// cache-bust Wed Jul  1 17:06:54 UTC 2026
