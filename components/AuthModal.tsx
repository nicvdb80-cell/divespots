'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Mode = 'signin' | 'signup'

export default function AuthModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [mode, setMode] = useState<Mode>('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      })
      if (error) { setError(error.message); setLoading(false); return }
      setMessage('Account created! You now have full access.')
      setTimeout(() => { onSuccess() }, 1500)
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      onSuccess()
    }
    setLoading(false)
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1px solid #e2e8f0', fontSize: 14, outline: 'none',
    background: '#f8fafc', color: '#0f172a', marginTop: 4
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 420, position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94a3b8', lineHeight: 1 }}>×</button>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
          <div style={{ width: 32, height: 32, background: '#ef4444', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#fff' }}>DS</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 14, color: '#0a1628', letterSpacing: 1 }}>DIVE SPOTS</div>
            <div style={{ fontSize: 10, color: '#94a3b8', letterSpacing: 1 }}>EXPLORE · DIVE · DISCOVER</div>
          </div>
        </div>

        {mode === 'signup' ? (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0a1628', marginBottom: 4 }}>Create your free account</h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              You've explored 3 dive sites. Join free to unlock all 1,200+ dive sites, save favourites, and connect with the diver community.
            </p>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0a1628', marginBottom: 4 }}>Welcome back</h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: '1.5rem' }}>Sign in to your Dive Spots account.</p>
          </>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Your name</label>
              <input value={name} onChange={e => setName(e.target.value)} style={inp} placeholder="e.g. Marco Rossi" required/>
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} placeholder="you@email.com" required/>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inp} placeholder="Min. 6 characters" required minLength={6}/>
          </div>

          {error && <div style={{ marginBottom: 12, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13 }}>{error}</div>}
          {message && <div style={{ marginBottom: 12, padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, color: '#16a34a', fontSize: 13 }}>{message}</div>}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#94a3b8' : '#0a1628', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 12 }}>
            {loading ? 'Please wait…' : mode === 'signup' ? 'Create free account' : 'Sign in'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: 13, color: '#64748b' }}>
          {mode === 'signup' ? (
            <>Already have an account? <button onClick={() => { setMode('signin'); setError('') }} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Sign in</button></>
          ) : (
            <>New to Dive Spots? <button onClick={() => { setMode('signup'); setError('') }} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Create free account</button></>
          )}
        </div>

        {mode === 'signup' && (
          <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 12 }}>
            Free forever · No credit card required · Join 2,400+ divers
          </p>
        )}
      </div>
    </div>
  )
}
