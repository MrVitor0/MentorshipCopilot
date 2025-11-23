import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  getUserNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../services/firestoreService'
import { Bell, X, Check, CheckCheck, FolderOpen, Users, Award } from 'lucide-react'
import Card from './Card'

export default function NotificationBell() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showPanel, setShowPanel] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadNotifications()
      loadUnreadCount()
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        loadUnreadCount()
      }, 30000)
      
      return () => clearInterval(interval)
    }
  }, [user])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await getUserNotifications(user.uid, 20)
      setNotifications(data.filter(n => !n.deleted))
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadNotificationsCount(user.uid)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await markNotificationAsRead(notification.id)
        loadUnreadCount()
        loadNotifications()
      }
      
      // Navigate to relevant page
      if (notification.projectId) {
        navigate(`/projects/${notification.projectId}`)
        setShowPanel(false)
      } else if (notification.teamId) {
        navigate(`/teams/${notification.teamId}`)
        setShowPanel(false)
      }
    } catch (error) {
      console.error('Error handling notification click:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(user.uid)
      loadUnreadCount()
      loadNotifications()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'mentor_assigned':
        return <Award className="w-5 h-5 text-baires-blue" />
      case 'mentor_removed':
        return <Award className="w-5 h-5 text-neutral-400" />
      case 'project_created':
        return <FolderOpen className="w-5 h-5 text-purple-500" />
      case 'team_created':
        return <Users className="w-5 h-5 text-blue-500" />
      default:
        return <Bell className="w-5 h-5 text-neutral-400" />
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp?.toDate) return ''
    
    const date = timestamp.toDate()
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="relative">
      <button
        className="relative p-2 hover:bg-neutral-100 rounded-xl transition-colors"
      >
        <Bell className="w-5 h-5 text-neutral-gray-dark" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-baires-blue rounded-full animate-pulse" />
        )}
      </button>

      {showPanel && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowPanel(false)}
          />
          
          <div className="absolute right-0 top-full mt-2 w-96 max-h-[500px] overflow-hidden z-50">
            <Card className="shadow-2xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-700">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-baires-blue text-white rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setShowPanel(false)}
                    className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[400px] -mx-6 px-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-baires-blue border-r-transparent"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                    <p className="text-neutral-400">No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          notification.read
                            ? 'bg-neutral-800/30 hover:bg-neutral-800/50'
                            : 'bg-baires-blue/10 hover:bg-baires-blue/20 border border-baires-blue/20'
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className={`font-semibold text-sm ${
                                notification.read ? 'text-neutral-300' : 'text-white'
                              }`}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-baires-blue rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className={`text-sm ${
                              notification.read ? 'text-neutral-500' : 'text-neutral-400'
                            }`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-neutral-600 mt-1">
                              {formatTimestamp(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="mt-3 pt-3 border-t border-neutral-700 text-center">
                  <button
                    onClick={() => {
                      navigate('/notifications')
                      setShowPanel(false)
                    }}
                    className="text-sm text-baires-blue hover:text-baires-blue/80 font-semibold transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

