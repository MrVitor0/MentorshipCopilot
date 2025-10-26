import { Navigate } from 'react-router-dom'
import usePermissions from '../hooks/usePermissions'

/**
 * Route wrapper that checks for specific permission
 * Redirects to dashboard if user doesn't have permission
 */
export const PermissionRoute = ({ children, permission }) => {
  const permissions = usePermissions()

  // Check if user has the required permission
  const hasPermission = permissions[permission]

  if (!hasPermission) {
    // Redirect to dashboard if no permission
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default PermissionRoute

