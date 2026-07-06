import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { seedAdminIfMissing } from '../lib/seedAdmin'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    seedAdminIfMissing()
  }, [])

  useEffect(() => {
    let unsubscribeProfile = null

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (unsubscribeProfile) {
        unsubscribeProfile()
        unsubscribeProfile = null
      }

      setUser(firebaseUser)

      if (!firebaseUser) {
        setRole(null)
        setLoading(false)
        return
      }

      unsubscribeProfile = onSnapshot(
        doc(db, 'users', firebaseUser.uid),
        (snap) => {
          const data = snap.exists() ? snap.data() : null
          if (data?.disabled) {
            setAuthError('Tu cuenta fue deshabilitada por un administrador.')
            signOut(auth)
            return
          }
          setRole(data?.role ?? null)
          setLoading(false)
        },
        () => {
          setRole(null)
          setLoading(false)
        },
      )
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeProfile) unsubscribeProfile()
    }
  }, [])

  const value = {
    user,
    role,
    loading,
    authError,
    clearAuthError: () => setAuthError(''),
    logout: () => signOut(auth),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
