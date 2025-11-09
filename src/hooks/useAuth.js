import { useState, useEffect } from 'react'
import { getSession, onAuthStateChange, signIn, signOut } from '../services/authService'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Get initial session
    getSession().then(session => {
      setSession(session)
      setUser(session?.user || null)
      setLoading(false)
    })

    // Listen to auth changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    try {
      const { session } = await signIn(email, password)
      setSession(session)
      setUser(session?.user || null)
      return session
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut()
      setSession(null)
      setUser(null)
    } catch (error) {
      throw error
    }
  }

  return { user, session, loading, login, logout, isAuthenticated: !!user }
}