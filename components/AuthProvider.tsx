'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type AuthCtx = {
  user: User | null
  loading: boolean
  showModal: boolean
  setShowModal: (v: boolean) => void
  signOut: () => void
  checkAccess: () => boolean // returns true if allowed, false if should show modal
}

const Ctx = createContext<AuthCtx>({ user: null, loading: true, showModal: false, setShowModal: () => {}, signOut: () => {}, checkAccess: () => true })

export function useAuth() { return useContext(Ctx) }

const FREE_LIMIT = 3
const STORAGE_KEY = 'ds_viewed_sites'

function getViewed(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function addViewed(slug: string) {
  const v = getViewed()
  if (!v.includes(slug)) { v.push(slug); localStorage.setItem(STORAGE_KEY, JSON.stringify(v)) }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) setShowModal(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  function checkAccess(slug?: string): boolean {
    if (user) return true
    const viewed = getViewed()
    if (slug && !viewed.includes(slug)) {
      if (viewed.length >= FREE_LIMIT) {
        setShowModal(true)
        return false
      }
      addViewed(slug)
    } else if (!slug && viewed.length >= FREE_LIMIT) {
      setShowModal(true)
      return false
    }
    return true
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <Ctx.Provider value={{ user, loading, showModal, setShowModal, signOut, checkAccess }}>
      {children}
    </Ctx.Provider>
  )
}
