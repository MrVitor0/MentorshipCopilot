import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import usePermissions from '../hooks/usePermissions'
import { getSmartSuggestions, getUpcomingSessions, getUserMentorships } from '../services/firestoreService'
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
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const permissions = usePermissions()

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return
      
      setLoading(true)
      try {
        const [suggestionsData, sessionsData, mentorshipsData] = await Promise.all([
          getSmartSuggestions(user.uid),
          getUpcomingSessions(user.uid),
          getUserMentorships(user.uid)
        ])
        
        setSuggestions(suggestionsData)
        setUpcomingSessions(sessionsData)
        setMentorships(mentorshipsData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Render appropriate dashboard based on user type
  const renderDashboard = () => {
    if (permissions.canViewMentorDashboard) {
      return <MentorDashboard user={user} suggestions={suggestions} upcomingSessions={upcomingSessions} mentorships={mentorships} loading={loading} />
    } else if (permissions.canViewPMDashboard) {
      return <PMDashboard user={user} upcomingSessions={upcomingSessions} mentorships={mentorships} loading={loading} />
    } else if (permissions.canViewMenteeDashboard) {
      return <MenteeDashboard user={user} upcomingSessions={upcomingSessions} mentorships={mentorships} loading={loading} />
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
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-orange-50/15">
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
