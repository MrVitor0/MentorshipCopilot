import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import usePermissions from '../hooks/usePermissions'
import useMentorshipData from '../hooks/useMentorshipData'
import useMentorshipHelpers from '../hooks/useMentorshipHelpers'
import { 
  updateJoinRequestStatus,
  getGoalsByMentorship,
  createGoal,
  updateGoal,
  deleteGoal,
  createSession,
  getSessionsByMentorship
} from '../services/firestoreService'

// Components
import Sidebar from '../components/Sidebar'
import SEO from '../components/SEO'
import SessionLogWizard from '../components/SessionLogWizard'
import MaterialWizard from '../components/MaterialWizard'
import GoalWizard from '../components/GoalWizard'
import Toast from '../components/Toast'

// Icons
import { 
  ArrowLeft, Calendar, Clock, TrendingUp, Target, AlertCircle,
  Users, Bot, FileText, Plus, FolderOpen, Loader2, BarChart3,
  UserPlus, CheckCircle, X as XIcon, Sparkles, MessageSquare,
  Edit, Lightbulb
} from 'lucide-react'

// Data
import { mockMentorshipData, mockMaterials } from '../data/mockMentorshipData'

// View Components
import PMView from './mentorship-views/PMView'
import MentorView from './mentorship-views/MentorView'
import DefaultView from './mentorship-views/DefaultView'

export default function MentorshipDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: _user } = useAuth()
  const permissions = usePermissions()
  
  // State
  const [isSessionWizardOpen, setIsSessionWizardOpen] = useState(false)
  const [isMaterialWizardOpen, setIsMaterialWizardOpen] = useState(false)
  const [isGoalWizardOpen, setIsGoalWizardOpen] = useState(false)
  const [processingRequest, setProcessingRequest] = useState(null)
  const [customGoals, setCustomGoals] = useState(null)
  const [setLoadingGoals] = useState(true)
  const [sessions, setSessions] = useState([])
  const [toast, setToast] = useState({ show: false, variant: 'info', title: '', description: '' })
  
  // Custom hooks
  const {
    mentorship,
    joinRequestsWithProfiles,
    invitationsWithProfiles,
    loading
  } = useMentorshipData(id)
  
  const data = mentorship || mockMentorshipData
  const { formatStatus, statusInfo, averageProgress, weeksDuration } = useMentorshipHelpers(data)

  // Fetch goals from Firestore
  useEffect(() => {
    const fetchGoals = async () => {
      if (!id) return
      
      setLoadingGoals(true)
      try {
        const goals = await getGoalsByMentorship(id)
        // Filter out deleted goals
        const activeGoals = goals.filter(g => !g.deleted)
        setCustomGoals(activeGoals.length > 0 ? activeGoals : null)
      } catch (error) {
        console.error('Error fetching goals:', error)
      } finally {
        setLoadingGoals(false)
      }
    }

    fetchGoals()
  }, [id])

  // Fetch sessions from Firestore
  useEffect(() => {
    const fetchSessions = async () => {
      if (!id) return
      
      try {
        const sessionData = await getSessionsByMentorship(id)
        setSessions(sessionData)
      } catch (error) {
        console.error('Error fetching sessions:', error)
      }
    }

    fetchSessions()
  }, [id])

  // Handlers
  const handleJoinRequestResponse = async (requestId, action) => {
    setProcessingRequest(requestId)
    try {
      await updateJoinRequestStatus(requestId, action === 'accept' ? 'accepted' : 'declined')
      window.location.reload()
    } catch (error) {
      console.error('Error handling join request:', error)
      alert('Error processing request. Please try again.')
    } finally {
      setProcessingRequest(null)
    }
  }

  const handleSessionLogSubmit = async (sessionData) => {
    try {
      // Create session with mentorshipId
      const newSession = await createSession({
        ...sessionData,
        mentorshipId: id,
        mentorId: data?.mentorId,
        menteeId: data?.menteeId
      })

      // Refresh sessions list
      const updatedSessions = await getSessionsByMentorship(id)
      setSessions(updatedSessions)

      // Show success toast
      setToast({
        show: true,
        variant: 'success',
        title: 'Session Logged Successfully!',
        description: 'Your session has been saved and will appear in the history.'
      })

      setIsSessionWizardOpen(false)
    } catch (error) {
      console.error('Error saving session:', error)
      
      // Show error toast
      setToast({
        show: true,
        variant: 'error',
        title: 'Error Saving Session',
        description: 'There was a problem saving your session. Please try again.'
      })
    }
  }

  const handleMaterialSubmit = async (materialData) => {
    console.log('Material submitted:', materialData)
    alert('Material added successfully! (Note: Backend integration pending)')
  }

  const handleGoalSubmit = async (goalsData) => {
    try {
      // Get existing goals from Firestore
      const existingGoals = await getGoalsByMentorship(id)
      const existingGoalIds = existingGoals.filter(g => !g.deleted).map(g => g.id)
      
      // Separate new goals from existing ones
      const goalsToProcess = goalsData || []
      
      for (const goal of goalsToProcess) {
        // Check if goal has a Firestore ID (starts with goal_ means it's new from wizard)
        const isNewGoal = goal.id.startsWith('goal_') || !existingGoalIds.includes(goal.id)
        
        if (isNewGoal) {
          // Create new goal in Firestore
          const { id: tempId, ...goalDataWithoutId } = goal
          await createGoal({
            ...goalDataWithoutId,
            mentorshipId: id
          })
        } else {
          // Update existing goal
          const { id: goalId, createdAt, updatedAt, ...updates } = goal
          await updateGoal(goalId, updates)
        }
      }
      
      // Mark deleted goals (goals that were in DB but not in new data)
      const newGoalIds = goalsToProcess.map(g => g.id)
      const deletedGoalIds = existingGoalIds.filter(id => !newGoalIds.includes(id))
      
      for (const goalId of deletedGoalIds) {
        await deleteGoal(goalId)
      }
      
      // Refresh goals from Firestore
      const updatedGoals = await getGoalsByMentorship(id)
      const activeGoals = updatedGoals.filter(g => !g.deleted)
      setCustomGoals(activeGoals.length > 0 ? activeGoals : null)
      
    } catch (error) {
      console.error('Error saving goals:', error)
      throw error
    }
  }

  const viewProps = {
    data,
    statusInfo,
    formatStatus,
    averageProgress,
    weeksDuration,
    mockMaterials,
    joinRequestsWithProfiles,
    invitationsWithProfiles,
    processingRequest,
    handleJoinRequestResponse,
    setIsSessionWizardOpen,
    setIsMaterialWizardOpen,
    setIsGoalWizardOpen,
    customGoals,
    navigate,
    id,
    sessions
  }

  return (
    <>
      <SEO 
        title={`Mentorship: ${data?.menteeName || data?.mentee?.name || 'Details'}`}
        description={`View detailed progress and analytics for this mentorship. Track sessions, ratings, and AI-powered insights.`}
      />
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-orange-50/15">
        <Sidebar user={{ name: 'Alex Smith', email: 'alexsmith@example.io' }} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
            <button
              onClick={() => navigate('/mentorship')}
              className="flex items-center gap-2 text-neutral-gray-dark hover:text-neutral-black mb-6 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Mentorships</span>
            </button>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-baires-orange mx-auto mb-4 animate-spin" />
                  <p className="text-neutral-gray-dark">Loading mentorship details...</p>
                </div>
              </div>
            ) : permissions.isPM ? (
              <PMView {...viewProps} />
            ) : permissions.isMentor ? (
              <MentorView {...viewProps} />
            ) : (
              <DefaultView navigate={navigate} />
            )}
          </div>
        </main>

        <SessionLogWizard
          isOpen={isSessionWizardOpen}
          onClose={() => setIsSessionWizardOpen(false)}
          onSubmit={handleSessionLogSubmit}
          mentee={{ name: data?.menteeName }}
        />

        <MaterialWizard
          isOpen={isMaterialWizardOpen}
          onClose={() => setIsMaterialWizardOpen(false)}
          onSubmit={handleMaterialSubmit}
        />

        <GoalWizard
          isOpen={isGoalWizardOpen}
          onClose={() => setIsGoalWizardOpen(false)}
          onSubmit={handleGoalSubmit}
          initialGoals={customGoals}
        />

        <Toast
          variant={toast.variant}
          title={toast.title}
          description={toast.description}
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          duration={5000}
        />
      </div>
    </>
  )
}

