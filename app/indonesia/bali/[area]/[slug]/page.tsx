import { BALI_SITES, AMED_SITES, TULAMBEN_EXTRA_SITES, getSiteBySlug, getAmedSiteBySlug, getTulambExtraSiteBySlug, BALI_AREAS } from '@/lib/data'
import Navbar from '@/components/Navbar'
import DiveSiteTabs from '@/components/DiveSiteTabs'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

// Search all Bali-region datasets
function findSite(slug: string) {
  return getSiteBySlug(slug) || getAmedSiteBySlug(slug) || getTulambExtraSiteBySlug(slug)
}

export async function generateMetadata({ params }: { params: Promise<{ area: string; slug: string }> }) {
  const { slug } = await params
  const site = findSite(slug)
  if (!site) return {}
  return {
    title: `${site.name} Dive Site Guide | ${site.area}, Bali, Indonesia | Dive Spots`,
    description: `Complete diver guide to ${site.name} in ${site.area}, Bali. Depth ${site.minDepth}-${site.maxDepth}m.`,
  }
}

export default async function DiveSitePage({ params }: { params: Promise<{ area: string; slug: string }> }) {
  const { slug, area } = await params
  const site = findSite(slug)
  if (!site) { notFound(); return null }

  // Pick the right sidebar list based on area
  const isAmed = area === 'amed' || site.areaSlug === 'amed'
  const isTulamben = area === 'tulamben' || site.areaSlug === 'tulamben'
  const sidebarSites = isAmed ? AMED_SITES : isTulamben ? [...BALI_SITES.filter(s => s.areaSlug === 'tulamben'), ...TULAMBEN_EXTRA_SITES] : BALI_SITES
  const nearby = [...BALI_SITES, ...AMED_SITES, ...TULAMBEN_EXTRA_SITES]
    .filter(s => s.areaSlug === site.areaSlug && s.slug !== site.slug).slice(0, 3)

  return (
    <main style={{ minHeight: "100vh", background: "#fff" }}>
      <Navbar />
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "calc(100vh - 60px)" }}>
        <aside style={{ background: "#0a1628", borderRight: "1px solid #1e3a5f", overflowY: "auto", maxHeight: "calc(100vh - 60px)", position: "sticky", top: 60 }}>
          <div style={{ padding: "1rem", borderBottom: "1px solid #1e3a5f" }}>
            <div style={{ fontSize: 10, color: "#475569" }}>Indonesia</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>BALI · {site.area.toUpperCase()}</div>
          </div>
          <div style={{ padding: "0.5rem 0" }}>
            {sidebarSites.map(s => (
              <Link key={s.slug} href={`/indonesia/bali/${s.areaSlug}/${s.slug}`}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 14px", borderLeft: s.slug === site.slug ? "3px solid #ef4444" : "3px solid transparent", background: s.slug === site.slug ? "#1e3a5f" : "none", textDecoration: "none" }}>
                <span style={{ fontSize: 11, color: s.slug === site.slug ? "#ef4444" : "#334155", minWidth: 18, fontWeight: 700 }}>{s.rank}</span>
                <span style={{ fontSize: 12, color: s.slug === site.slug ? "#fff" : "#64748b", fontWeight: s.slug === site.slug ? 700 : 400, lineHeight: 1.3 }}>{s.name}</span>
              </Link>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #1e3a5f", padding: "1rem" }}>
            <Link href="/indonesia/bali" style={{ display: "block", fontSize: 12, color: "#60a5fa", marginBottom: "1rem" }}>← All Bali sites</Link>
          </div>
        </aside>

        <div style={{ overflowY: "auto" }}>
          <div style={{ background: "#020d1a", padding: "1.25rem 2rem", borderBottom: "1px solid #1e3a5f" }}>
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>
              <Link href="/" style={{ color: "#475569" }}>Home</Link> › <Link href="/indonesia" style={{ color: "#475569" }}>Indonesia</Link> › <Link href="/indonesia/bali" style={{ color: "#475569" }}>Bali</Link> › {site.area}
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{site.area.toUpperCase()}</div>
          </div>

          <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "0.75rem 2rem", display: "flex", gap: 8, overflowX: "auto" }}>
            {BALI_AREAS.map(a => (
              <Link key={a.slug} href={`/indonesia/bali/areas/${a.slug}`}
                style={{ padding: "6px 12px", background: site.areaSlug === a.slug ? "#0a1628" : "#fff", border: "1px solid " + (site.areaSlug === a.slug ? "#0a1628" : "#e2e8f0"), borderRadius: 8, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", color: site.areaSlug === a.slug ? "#fff" : "#475569", flexShrink: 0, textDecoration: "none" }}>
                {a.name}
              </Link>
            ))}
          </div>

          <div style={{ padding: "1.5rem 2rem", display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", alignItems: "start" }}>
            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 11, padding: "3px 10px", background: "#0a1628", color: "#fff", borderRadius: 4, fontWeight: 700 }}>#{site.rank} in {site.area}</span>
                  <span style={{ fontSize: 11, padding: "3px 10px", background: "#dbeafe", color: "#1d4ed8", borderRadius: 4, fontWeight: 600 }}>Admin verified</span>
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>Indonesia › Bali › {site.area}</div>
                <h1 style={{ fontSize: 32, fontWeight: 900, color: "#0a1628", letterSpacing: -1, marginBottom: 8, textTransform: "uppercase" }}>{site.name}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#f59e0b", fontSize: 18 }}>{"★".repeat(Math.round(site.rating))}</span>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{site.rating}</span>
                  <span style={{ color: "#94a3b8", fontSize: 13 }}>{site.reviews} reviews</span>
                </div>
              </div>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, marginBottom: "1.5rem" }}>{site.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: "1.5rem" }}>
                {([["Dive type", site.type], ["Current", site.current], ["Access", site.access], ["Water temp", site.temp], ["Min depth", site.minDepth + "m"], ["Best time", site.bestTime], ["Max depth", site.maxDepth + "m"], ["Certification", site.minCert], ["Avg depth", site.avgDepth + "m"], ["Visibility", site.visibility], ["Difficulty", site.difficulty], ["Best season", site.bestSeason]] as [string,string][]).map(([k, v]) => (
                  <div key={k} style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: 8, border: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3, textTransform: "uppercase" }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{v}</div>
                  </div>
                ))}
              </div>
              <DiveSiteTabs site={site!} />
            </div>
            <div>
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.25rem", marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 12, letterSpacing: 1 }}>QUICK INFO</div>
                {([["Location", site.area + ", Bali"], ["Type", site.type], ["Access", site.access], ["Depth", site.minDepth + "m – " + site.maxDepth + "m"], ["Visibility", site.visibility], ["Water temp", site.temp], ["Difficulty", site.difficulty], ["Best time", site.bestTime]] as [string,string][]).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f8fafc", fontSize: 12 }}>
                    <span style={{ color: "#94a3b8" }}>{k}</span>
                    <span style={{ color: "#0f172a", fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              {nearby.length > 0 && (
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "1.25rem" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 10 }}>MORE IN {site.area.toUpperCase()}</div>
                  {nearby.map(s => (
                    <Link key={s.slug} href={`/indonesia/bali/${s.areaSlug}/${s.slug}`} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #f8fafc", alignItems: "center", textDecoration: "none" }}>
                      <span style={{ fontSize: 11, color: "#475569" }}>#{s.rank}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: "#0f172a", fontWeight: 600 }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: "#475569" }}>{s.type} · {s.minDepth}-{s.maxDepth}m</div>
                      </div>
                      <span style={{ fontSize: 11, color: "#f59e0b" }}>★ {s.rating}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer style={{ background: "#0a1628", color: "#475569", padding: "2rem", borderTop: "1px solid #1e3a5f" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12 }}>© 2026 Dive Spots. All rights reserved.</span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/about" style={{ fontSize: 12, color: "#475569" }}>About</Link>
            <Link href="/privacy" style={{ fontSize: 12, color: "#475569" }}>Privacy</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
