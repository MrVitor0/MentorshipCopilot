import { Link } from 'react-router-dom'
import usePermissions from '../hooks/usePermissions'

/**
 * Protected link component that only renders if user has permission
 * Follows Open/Closed Principle - open for extension, closed for modification
 */
export const ProtectedLink = ({ 
  to, 
  children, 
  permission, 
  className = '',
  ...props 
}) => {
  const permissions = usePermissions()

  // If no permission specified, always render
  if (!permission) {
    return <Link to={to} className={className} {...props}>{children}</Link>
  }

  // Check if user has the required permission
  const hasPermission = permissions[permission]

  // Don't render if no permission
  if (!hasPermission) {
    return null
  }

  return (
    <Link to={to} className={className} {...props}>
      {children}
    </Link>
  )
}

/**
 * Protected button component
 */
export const ProtectedButton = ({ 
  children, 
  permission, 
  onClick,
  className = '',
  ...props 
}) => {
  const permissions = usePermissions()

  // If no permission specified, always render
  if (!permission) {
    return (
      <button onClick={onClick} className={className} {...props}>
        {children}
      </button>
    )
  }

  // Check if user has the required permission
  const hasPermission = permissions[permission]

  // Don't render if no permission
  if (!hasPermission) {
    return null
  }

  return (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  )
}

/**
 * Protected element wrapper - renders children only if permission granted
 */
export const Protected = ({ children, permission }) => {
  const permissions = usePermissions()

  if (!permission) {
    return children
  }

  const hasPermission = permissions[permission]

  if (!hasPermission) {
    return null
  }

  return children
}

export default ProtectedLink

