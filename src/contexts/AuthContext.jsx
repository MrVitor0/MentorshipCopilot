import { createContext, useState, useEffect } from 'react'
import authService from '../services/authService'
import { getUserProfile } from '../services/firestoreService'

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChange(async (authUser) => {
      if (authUser) {
        // Fetch full user profile from Firestore
        const userProfile = await getUserProfile(authUser.uid)
        setUser({ ...authUser, ...userProfile })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const register = async (email, password, displayName) => {
    try {
      setError(null)
      const user = await authService.registerWithEmail(email, password, displayName)
      return user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const user = await authService.signInWithEmail(email, password)
      return user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const loginWithGoogle = async () => {
    try {
      setError(null)
      const result = await authService.signInWithGoogle()
      return result
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await authService.signOut()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const refreshUser = async () => {
    if (user?.uid) {
      const userProfile = await getUserProfile(user.uid)
      setUser({ ...user, ...userProfile })
    }
  }

  const value = {
    user,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    needsOnboarding: user && !user.onboardingCompleted
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

