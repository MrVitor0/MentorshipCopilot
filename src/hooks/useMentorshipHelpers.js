import { useMemo } from 'react'
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'

export default function useMentorshipHelpers(data) {
  // Helper to format status text
  const formatStatus = (status) => {
    if (!status) return 'Unknown'
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Get status info with color and icon
  const statusInfo = useMemo(() => {
    const status = data?.status || 'active'
    const latestSession = data?.sessions?.[data.sessions.length - 1]
    
    switch(status) {
      case 'active':
        return { 
          label: 'Active', 
          color: 'bg-green-100 text-green-700 border-green-300', 
          icon: CheckCircle, 
          iconColor: 'text-green-600' 
        }
      case 'pending':
      case 'pending_mentor':
        return { 
          label: 'Pending', 
          color: 'bg-amber-100 text-amber-700 border-amber-300', 
          icon: AlertCircle, 
          iconColor: 'text-amber-600' 
        }
      case 'pending_kickoff':
        return { 
          label: 'Pending Kickoff', 
          color: 'bg-blue-100 text-blue-700 border-blue-300', 
          icon: TrendingUp, 
          iconColor: 'text-blue-600' 
        }
      case 'completed':
        return { 
          label: 'Completed', 
          color: 'bg-neutral-100 text-neutral-700 border-neutral-300', 
          icon: CheckCircle, 
          iconColor: 'text-neutral-600' 
        }
      default:
        if (latestSession?.progressRating) {
          const rating = latestSession.progressRating
          if (rating >= 4) {
            return { 
              label: 'On Track', 
              color: 'bg-green-100 text-green-700 border-green-300', 
              icon: CheckCircle, 
              iconColor: 'text-green-600' 
            }
          } else if (rating >= 3) {
            return { 
              label: 'Making Progress', 
              color: 'bg-blue-100 text-blue-700 border-blue-300', 
              icon: TrendingUp, 
              iconColor: 'text-blue-600' 
            }
          }
        }
        return { 
          label: 'Needs Attention', 
          color: 'bg-amber-100 text-amber-700 border-amber-300', 
          icon: AlertCircle, 
          iconColor: 'text-amber-600' 
        }
    }
  }, [data?.status, data?.sessions])

  // Calculate average progress
  const averageProgress = useMemo(() => {
    if (!data?.sessions || data.sessions.length === 0) return '0'
    return (data.sessions.reduce((acc, s) => acc + s.progressRating, 0) / data.sessions.length).toFixed(1)
  }, [data?.sessions])

  // Calculate weeks duration
  const weeksDuration = useMemo(() => {
    const startDate = data?.startDate ? new Date(data.startDate) : (data?.createdAt?.toDate?.() || new Date())
    const now = new Date()
    return Math.floor((now - startDate) / (1000 * 60 * 60 * 24 * 7))
  }, [data?.startDate, data?.createdAt])

  return {
    formatStatus,
    statusInfo,
    averageProgress,
    weeksDuration
  }
}

