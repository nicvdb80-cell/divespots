'use client'
import { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import AuthModal from './AuthModal'

const FREE_LIMIT = 3
const STORAGE_KEY = 'ds_viewed_sites'

function getViewed(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function addViewed(slug: string) {
  const v = getViewed()
  if (!v.includes(slug)) { v.push(slug); localStorage.setItem(STORAGE_KEY, JSON.stringify(v)) }
}

export default function AccessGate({ slug, children }: { slug: string; children: React.ReactNode }) {
  const { user } = useAuth()
  const [blocked, setBlocked] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (user) { setChecked(true); return }
    const viewed = getViewed()
    if (viewed.includes(slug)) {
      // Already viewed this site — always allow
      setChecked(true)
    } else if (viewed.length >= FREE_LIMIT) {
      // New site, over limit
      setBlocked(true)
      setShowModal(true)
      setChecked(true)
    } else {
      // Under limit — add and allow
      addViewed(slug)
      setChecked(true)
    }
  }, [user, slug])

  if (!checked) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <div style={{ color: '#94a3b8', fontSize: 14 }}>Loading…</div>
    </div>
  )

  if (blocked && !user) return (
    <>
      {/* Blurred preview */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.4 }}>
          {children}
        </div>
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.95) 30%)' }}>
          <div style={{ textAlign: 'center', padding: '2rem', maxWidth: 440 }}>
            <div style={{ width: 56, height: 56, background: '#0a1628', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: 24 }}>🤿</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0a1628', marginBottom: 8 }}>You've explored 3 dive sites</h2>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Create a free Dive Spots account to unlock all 1,200+ dive sites, save favourites, and join the diver community.
            </p>
            <button onClick={() => setShowModal(true)} style={{ padding: '12px 32px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}>
              Create free account
            </button>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>
              Already a member? <button onClick={() => setShowModal(true)} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Sign in</button>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem' }}>
              {['1,200+ dive sites', 'Save favourites', 'Free forever'].map(f => (
                <div key={f} style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: '#16a34a' }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showModal && <AuthModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); setBlocked(false) }} />}
    </>
  )

  return <>{children}</>
}
