import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import usePermissions from '../hooks/usePermissions'
import useMentorshipData from '../hooks/useMentorshipData'
import useMentorshipHelpers from '../hooks/useMentorshipHelpers'
import { updateJoinRequestStatus } from '../services/firestoreService'

// Components
import Sidebar from '../components/Sidebar'
import SEO from '../components/SEO'
import SessionLogWizard from '../components/SessionLogWizard'
import MaterialWizard from '../components/MaterialWizard'
import GoalWizard from '../components/GoalWizard'
import AIChatModal from '../components/AIChatModal'
import { 
  MaterialsList, 
  ActionCTA, 
  MentorshipOverview,
  StatsCard,
  SessionHistory,
  ProgressChart
} from '../components/mentorship-details'

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

import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Avatar from '../components/Avatar'

export default function MentorshipDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: _user } = useAuth()
  const permissions = usePermissions()
  
  // State
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isSessionWizardOpen, setIsSessionWizardOpen] = useState(false)
  const [isMaterialWizardOpen, setIsMaterialWizardOpen] = useState(false)
  const [isGoalWizardOpen, setIsGoalWizardOpen] = useState(false)
  const [processingRequest, setProcessingRequest] = useState(null)
  const [customGoals, setCustomGoals] = useState(null)
  
  // Custom hooks
  const {
    mentorship,
    joinRequestsWithProfiles,
    invitationsWithProfiles,
    loading
  } = useMentorshipData(id)
  
  const data = mentorship || mockMentorshipData
  const { formatStatus, statusInfo, averageProgress, weeksDuration } = useMentorshipHelpers(data)

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
    console.log('Session log submitted:', sessionData)
    alert('Session logged successfully! (Note: Backend integration pending)')
  }

  const handleMaterialSubmit = async (materialData) => {
    console.log('Material submitted:', materialData)
    alert('Material added successfully! (Note: Backend integration pending)')
  }

  const handleGoalSubmit = async (goalsData) => {
    console.log('Goals submitted:', goalsData)
    setCustomGoals(goalsData)
    alert('Goals saved successfully! (Note: Backend integration pending)')
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
    id
  }

  return (
    <>
      <SEO 
        title={`Mentorship: ${data?.menteeName || data?.mentee?.name || 'Details'}`}
        description={`View detailed progress and analytics for this mentorship. Track sessions, ratings, and AI-powered insights.`}
      />
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-orange-50/15">
        <Sidebar user={{ name: 'Alex Smith', email: 'alexsmith@example.io' }} />
        
        <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-baires-orange via-orange-600 to-orange-700 text-white rounded-full shadow-[0_10px_40px_rgb(246,97,53,0.4)] hover:shadow-[0_15px_50px_rgb(246,97,53,0.5)] hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 group"
        >
          <Bot className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        </button>
        
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
      </div>
    </>
  )
}

