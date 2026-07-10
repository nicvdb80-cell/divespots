'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import AuthModal from './AuthModal'
import { BALI_SITES, RAJA_AMPAT_SITES } from '@/lib/data'

const ALL_SITES = [
  ...BALI_SITES.map(s => ({ ...s, region: 'bali', regionLabel: 'Bali' })),
  ...RAJA_AMPAT_SITES.map(s => ({ ...s, region: 'raja-ampat', regionLabel: 'Raja Ampat' })),
]

export default function Navbar() {
  const path = usePathname()
  const router = useRouter()
  const { user, signOut, setShowModal, showModal } = useAuth()
  const [userMenu, setUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const searchResults = searchQuery.trim().length > 1
    ? ALL_SITES.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 7)
    : []

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(site: typeof ALL_SITES[0]) {
    setSearchQuery('')
    setSearchOpen(false)
    router.push(`/indonesia/${site.region}/${site.areaSlug}/${site.slug}`)
  }

  const links = [
    ['Destinations', '/destinations'],
    ['Top 20', '/indonesia/bali/top-20-dive-sites'],
    ['Dive Sites', '/dive-sites'],
    ['Marine Life', '/marine-life'],
    ['Map', '/map'],
    ['Community', '/community'],
    ['About', '/about'],
  ]

  return (
    <>
      <nav style={{ background: '#0a1628', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 200, borderBottom: '1px solid #1e3a5f' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, background: '#ef4444', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>DS</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 14, letterSpacing: 1, lineHeight: 1 }}>DIVE SPOTS</div>
            <div style={{ color: '#475569', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' }}>Explore · Dive · Discover</div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {links.map(([l, h]) => (
            <Link key={l} href={h} style={{ color: path === h ? '#fff' : '#94a3b8', fontSize: 12, padding: '6px 12px', borderRadius: 6, fontWeight: 500, whiteSpace: 'nowrap', background: path === h ? '#1e3a5f' : 'none' }}>{l}</Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div ref={searchRef} style={{ position: 'relative' }}>
            <div style={{ background: '#1e3a5f', borderRadius: 20, padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true) }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search dive sites…"
                style={{ fontSize: 12, color: '#e2e8f0', background: 'transparent', border: 'none', outline: 'none', width: 160 }}
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setSearchOpen(false) }} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
              )}
            </div>
            {searchOpen && searchResults.length > 0 && (
              <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#0f2340', border: '1px solid #1e3a5f', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 400, overflow: 'hidden', minWidth: 280 }}>
                {searchResults.map(site => (
                  <button
                    key={site.slug + site.region}
                    onClick={() => handleSelect(site)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid #1e3a5f' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#1e3a5f')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <div style={{ width: 28, height: 28, background: '#0a1628', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                      {site.type === 'Wreck' ? '🚢' : site.type === 'Wall' ? '🪸' : site.type === 'Drift' ? '🌊' : site.type === 'Muck' ? '🐙' : '🐠'}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{site.name}</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>{site.area} · {site.regionLabel} · {site.difficulty}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>★ {site.rating}</div>
                  </button>
                ))}
              </div>
            )}
            {searchOpen && searchQuery.trim().length > 1 && searchResults.length === 0 && (
              <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#0f2340', border: '1px solid #1e3a5f', borderRadius: 10, padding: '12px 14px', zIndex: 400 }}>
                <div style={{ fontSize: 12, color: '#475569' }}>No sites found for "{searchQuery}"</div>
              </div>
            )}
          </div>
          <Link href="/submit-dive-site" style={{ width: 28, height: 28, background: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 300, flexShrink: 0 }}>+</Link>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setUserMenu(!userMenu)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1e3a5f', border: '1px solid #334155', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', color: '#fff' }}>
                <div style={{ width: 22, height: 22, background: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                  {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 12, color: '#e2e8f0', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </button>
              {userMenu && (
                <div style={{ position: 'absolute', top: '110%', right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '0.5rem', minWidth: 180, zIndex: 300 }}>
                  <div style={{ padding: '8px 12px', fontSize: 12, color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>{user.email}</div>
                  <Link href="/profile" onClick={() => setUserMenu(false)} style={{ display: 'block', padding: '8px 12px', fontSize: 13, color: '#374151', borderRadius: 6 }}>My profile</Link>
                  <Link href="/submit-dive-site" onClick={() => setUserMenu(false)} style={{ display: 'block', padding: '8px 12px', fontSize: 13, color: '#374151', borderRadius: 6 }}>Submit a dive site</Link>
                  <button onClick={() => { signOut(); setUserMenu(false) }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 13, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6 }}>Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setShowModal(true)} style={{ fontSize: 12, color: '#e2e8f0', padding: '6px 14px', border: '1px solid #334155', borderRadius: 8, background: 'none', cursor: 'pointer', fontWeight: 500 }}>
              Sign in
            </button>
          )}
        </div>
      </nav>

      {showModal && <AuthModal onClose={() => setShowModal(false)} onSuccess={() => setShowModal(false)} />}
    </>
  )
}
