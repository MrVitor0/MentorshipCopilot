import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import usePermissions from '../hooks/usePermissions'
import { 
  getSmartSuggestions, 
  getUpcomingSessions, 
  getUserMentorships, 
  getPMMentorships,
  getInvitationsForMentor,
  getMeetingsByUser,
  getMaterialsForMentee
} from '../services/firestoreService'
import Sidebar from '../components/Sidebar'
import MentorDashboard from '../components/dashboard/MentorDashboard'
import PMDashboard from '../components/dashboard/PMDashboard'
import MenteeDashboard from '../components/dashboard/MenteeDashboard'
import PageHeader from '../components/PageHeader'
import SEO from '../components/SEO'

export default function Dashboard() {
  const [suggestions, setSuggestions] = useState([])
  const [upcomingSessions, setUpcomingSessions] = useState([])
  const [mentorships, setMentorships] = useState([])
  const [invitations, setInvitations] = useState([])
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const permissions = usePermissions()

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return
      
      setLoading(true)
      try {
        const fetchPromises = [
          getSmartSuggestions(user.uid),
          getMeetingsByUser(user.uid),
        ]

        // Fetch PM-specific data
        if (permissions.isPM) {
          fetchPromises.push(getPMMentorships(user.uid))
        } else {
          fetchPromises.push(getUserMentorships(user.uid))
        }

        // Fetch mentor-specific data
        if (permissions.isMentor) {
          fetchPromises.push(getInvitationsForMentor(user.uid))
        }

        // Fetch mentee-specific data (materials from all mentorships)
        if (permissions.isMentee) {
          fetchPromises.push(getMaterialsForMentee(user.uid))
        }
        
        const results = await Promise.all(fetchPromises)
        
        setSuggestions(results[0] || [])
        setUpcomingSessions(results[1] || [])
        setMentorships(results[2] || [])
        
        if (permissions.isMentor && results[3]) {
          setInvitations(results[3])
        }

        if (permissions.isMentee && results[3]) {
          setMaterials(results[3])
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, permissions.isPM, permissions.isMentor, permissions.isMentee])

  // Render appropriate dashboard based on user type
  const renderDashboard = () => {
    if (permissions.canViewMentorDashboard) {
      return (
        <MentorDashboard 
          user={user} 
          suggestions={suggestions} 
          upcomingSessions={upcomingSessions} 
          mentorships={mentorships} 
          loading={loading} 
          invitations={invitations}
        />
      )
    } else if (permissions.canViewPMDashboard) {
      return (
        <PMDashboard 
          user={user} 
          upcomingSessions={upcomingSessions} 
          mentorships={mentorships} 
          loading={loading} 
        />
      )
    } else if (permissions.canViewMenteeDashboard) {
      return (
        <MenteeDashboard 
          user={user} 
          upcomingSessions={upcomingSessions} 
          mentorships={mentorships} 
          loading={loading}
          materials={materials}
        />
      )
    }
    return null
  }

  // Get dashboard title based on user type
  const getDashboardTitle = () => {
    if (permissions.isMentor) return 'Mentor Dashboard'
    if (permissions.isPM) return 'Project Manager Dashboard'
    if (permissions.isMentee) return 'Learning Dashboard'
    return 'Dashboard'
  }

  return (
    <>
      <SEO 
        title="Dashboard"
        description="View your mentorship dashboard with AI-powered insights, track active mentorships, and manage your team's development."
      />
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/15">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
            {/* Page Header - Reusable component */}
            <PageHeader 
              title={getDashboardTitle()}
              description="AI-powered mentorship at your fingertips"
            />
                  
            {/* Render dashboard based on user type */}
            {renderDashboard()}
          </div>
        </main>
      </div>
    </>
  )
}
