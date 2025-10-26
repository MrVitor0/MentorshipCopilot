import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-orange-50/15">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-baires-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-neutral-gray-dark font-semibold">Loading...</p>
    </div>
  </div>
)

export const ProtectedRoute = ({ children }) => {
  const { user, loading, needsOnboarding } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

export const PublicRoute = ({ children }) => {
  const { user, loading, needsOnboarding } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (user && !needsOnboarding) {
    return <Navigate to="/dashboard" replace />
  }

  if (user && needsOnboarding) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

