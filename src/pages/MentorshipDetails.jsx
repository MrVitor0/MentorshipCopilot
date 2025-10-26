import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import usePermissions from '../hooks/usePermissions'
import { 
  getMentorshipById, 
  getJoinRequestsForMentorship, 
  updateJoinRequestStatus, 
  getUserProfile,
  getInvitationsForMentorship
} from '../services/firestoreService'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import SEO from '../components/SEO'
import { Lightbulb } from 'lucide-react'

import AIChatModal from '../components/AIChatModal'
import { 
  ArrowLeft,
  Calendar,
  Clock,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Video,
  Plus,
  Edit,
  BarChart3,
  Users,
  Sparkles,
  Bot,
  FileText,
  Play,
  UserPlus,
  X as XIcon,
  Code,
  Loader2
} from 'lucide-react'

// Mock data - em produção viria de uma API
const mentorshipData = {
  id: 1,
  mentee: {
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'Junior Developer',
    email: 'sarah.johnson@company.com'
  },
  mentor: {
    name: 'Alex Smith',
    avatar: 'https://i.pravatar.cc/150?img=33',
    role: 'Senior Engineer',
    email: 'alex.smith@company.com'
  },
  originalGoal: 'Improve performance in React development and strengthen communication skills with stakeholders',
  topic: 'React & Frontend Development',
  status: 'active',
  startDate: '2024-09-01',
  totalSessions: 8,
  completedSessions: 6,
  currentWeek: 4,
  overallProgress: 75,
  
  // Dados das sessões para o gráfico de progresso
  sessions: [
    {
      id: 1,
      date: '2024-09-05',
      duration: 60,
      progressRating: 2,
      summary: 'Initial assessment. Sarah showed good understanding of JavaScript fundamentals but needs more practice with React Hooks. We discussed her learning goals and created a roadmap.',
      nextSteps: 'Study useState and useEffect hooks. Complete 2 practice exercises.',
      recordingUrl: 'https://example.com/recording/1',
      mentorNotes: 'Enthusiastic learner, good questions'
    },
    {
      id: 2,
      date: '2024-09-12',
      duration: 60,
      progressRating: 3,
      summary: 'Reviewed React Hooks exercises. Sarah completed both assignments and showed good grasp of useState. Introduced useEffect and lifecycle concepts.',
      nextSteps: 'Build a small counter app using hooks. Read about component lifecycle.',
      recordingUrl: 'https://example.com/recording/2',
      mentorNotes: 'Making steady progress, completed all homework'
    },
    {
      id: 3,
      date: '2024-09-19',
      duration: 60,
      progressRating: 3,
      summary: 'Code review of counter app - good implementation. Discussed state management patterns and when to lift state up. Introduced basic routing concepts.',
      nextSteps: 'Start building a todo app with multiple components. Implement routing.',
      recordingUrl: null,
      mentorNotes: 'Code quality improving, asking advanced questions'
    },
    {
      id: 4,
      date: '2024-09-26',
      duration: 60,
      progressRating: 4,
      summary: 'Excellent progress on todo app! Clean component structure and proper state management. Discussed API integration and async operations. Introduced error handling patterns.',
      nextSteps: 'Integrate a REST API into the todo app. Implement error boundaries.',
      recordingUrl: 'https://example.com/recording/4',
      mentorNotes: 'Significant improvement, ready for more complex topics'
    },
    {
      id: 5,
      date: '2024-10-03',
      duration: 60,
      progressRating: 4,
      summary: 'Reviewed API integration - well implemented with proper error handling. Discussed performance optimization and React.memo. Started covering testing basics with Jest.',
      nextSteps: 'Write unit tests for main components. Optimize re-renders in todo app.',
      recordingUrl: 'https://example.com/recording/5',
      mentorNotes: 'Strong technical growth, testing mindset developing'
    },
    {
      id: 6,
      date: '2024-10-10',
      duration: 60,
      progressRating: 5,
      summary: 'Outstanding session! Sarah presented her portfolio project - impressive work with advanced patterns. Great code organization and test coverage. Ready to contribute to team projects.',
      nextSteps: 'Start shadowing on team sprint. Pair programming sessions scheduled.',
      recordingUrl: 'https://example.com/recording/6',
      mentorNotes: 'Exceeded expectations, ready for production work'
    }
  ]
}

export default function MentorshipDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const permissions = usePermissions()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [mentorship, setMentorship] = useState(null)
  const [joinRequests, setJoinRequests] = useState([])
  const [joinRequestsWithProfiles, setJoinRequestsWithProfiles] = useState([])
  const [invitations, setInvitations] = useState([])
  const [invitationsWithProfiles, setInvitationsWithProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingRequest, setProcessingRequest] = useState(null)
  
  // Load mentorship, join requests and invitations
  useEffect(() => {
    const fetchMentorshipData = async () => {
      if (!id) return
      
      setLoading(true)
      try {
        const mentorshipData = await getMentorshipById(id)
        setMentorship(mentorshipData)
        
        // Fetch invitations (mentors who were invited by PM)
        const invites = await getInvitationsForMentorship(id)
        setInvitations(invites)
        
        // Fetch mentor profiles for invitations
        if (invites.length > 0) {
          const inviteProfiles = await Promise.all(
            invites.map(async (inv) => {
              const profile = await getUserProfile(inv.mentorId)
              return { ...inv, mentorProfile: profile }
            })
          )
          setInvitationsWithProfiles(inviteProfiles)
        }
        
        // Only fetch join requests if there's no mentor assigned
        if (!mentorshipData?.mentorId) {
          const requests = await getJoinRequestsForMentorship(id)
          setJoinRequests(requests)
          
          // Fetch mentor profiles for join requests
          if (requests.length > 0) {
            const profiles = await Promise.all(
              requests.map(async (req) => {
                const profile = await getUserProfile(req.mentorId)
                return { ...req, mentorProfile: profile }
              })
            )
            setJoinRequestsWithProfiles(profiles)
          }
        }
      } catch (error) {
        console.error('Error fetching mentorship:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMentorshipData()
  }, [id])

  const handleJoinRequestResponse = async (requestId, action) => {
    setProcessingRequest(requestId)
    try {
      await updateJoinRequestStatus(requestId, action === 'accept' ? 'accepted' : 'declined')
      // Refresh data
      window.location.reload()
    } catch (error) {
      console.error('Error handling join request:', error)
      alert('Error processing request. Please try again.')
    } finally {
      setProcessingRequest(null)
    }
  }
  
  // Use real or mock data - prefer real data from Firestore
  const data = mentorship || mentorshipData
  const latestSession = data?.sessions?.[data.sessions.length - 1]
  const averageProgress = data?.sessions ? 
    (data.sessions.reduce((acc, s) => acc + s.progressRating, 0) / data.sessions.length).toFixed(1) : 
    '0'
  
  // Helper to format status text
  const formatStatus = (status) => {
    if (!status) return 'Unknown'
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }
  
  // Determinar status baseado no último log ou status da mentoria
  const getStatusInfo = () => {
    const status = data?.status || 'active'
    
    switch(status) {
      case 'active':
        return { label: 'Active', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle, iconColor: 'text-green-600' }
      case 'pending':
        return { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: AlertCircle, iconColor: 'text-amber-600' }
      case 'pending_kickoff':
        return { label: 'Pending Kickoff', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: TrendingUp, iconColor: 'text-blue-600' }
      case 'completed':
        return { label: 'Completed', color: 'bg-neutral-100 text-neutral-700 border-neutral-300', icon: CheckCircle, iconColor: 'text-neutral-600' }
      default:
        if (latestSession?.progressRating) {
          const rating = latestSession.progressRating
          if (rating >= 4) {
            return { label: 'On Track', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle, iconColor: 'text-green-600' }
          } else if (rating >= 3) {
            return { label: 'Making Progress', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: TrendingUp, iconColor: 'text-blue-600' }
          }
        }
        return { label: 'Needs Attention', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: AlertCircle, iconColor: 'text-amber-600' }
    }
  }
  
  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon
  
  // Calcular duração
  const startDate = data?.startDate ? new Date(data.startDate) : (data?.createdAt?.toDate?.() || new Date())
  const now = new Date()
  const weeksDuration = Math.floor((now - startDate) / (1000 * 60 * 60 * 24 * 7))

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
          {/* Back Button */}
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
            // ==================== PM VIEW ====================
            <>
              {/* Invited Mentors Section - Show pending invitations (PM ONLY) */}
              {!data?.mentorId && invitationsWithProfiles.length > 0 && (
                <Card padding="lg" className="mb-8 bg-gradient-to-br from-blue-50 via-white to-blue-100/50 border-2 border-blue-300/70">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[16px] flex items-center justify-center shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-black flex items-center gap-2">
                        Invited Mentors
                        <Badge variant="blue">{invitationsWithProfiles.filter(inv => inv.status === 'pending').length} Pending</Badge>
                      </h2>
                      <p className="text-sm text-neutral-gray-dark">Mentors invited to this mentorship</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {invitationsWithProfiles.map((invitation) => {
                      const statusColor = invitation.status === 'pending' ? 'warning' : invitation.status === 'accepted' ? 'success' : 'gray'
                      const statusText = invitation.status === 'pending' ? 'Pending Response' : invitation.status === 'accepted' ? 'Accepted' : 'Declined'
                      
                      return (
                        <Card key={invitation.id} padding="md" className="bg-white">
                          <div className="flex items-start gap-4">
                            <Avatar 
                              src={invitation.mentorProfile?.photoURL || invitation.mentorAvatar} 
                              initials={(invitation.mentorProfile?.displayName || invitation.mentorName)?.substring(0, 2)?.toUpperCase()}
                              size="xl"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-neutral-black">
                                  {invitation.mentorProfile?.displayName || invitation.mentorName || 'Unknown Mentor'}
                                </h3>
                                <Badge variant={statusColor} className="text-xs">
                                  {statusText}
                                </Badge>
                              </div>
                              <p className="text-sm text-neutral-gray-dark mb-3">
                                {invitation.mentorProfile?.bio || 'Experienced mentor'}
                              </p>
                              {invitation.mentorProfile?.technologies && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {invitation.mentorProfile.technologies.slice(0, 3).map((tech, idx) => (
                                    <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                      {typeof tech === 'string' ? tech : tech.name || tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <p className="text-xs text-neutral-gray-dark">
                                Invited: {invitation.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}
                              </p>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </Card>
              )}
              
              {/* Join Requests Section - Show if no mentor assigned */}
              {!data?.mentorId && joinRequestsWithProfiles.length > 0 && (
                <Card padding="lg" className="mb-8 bg-gradient-to-br from-orange-50 via-white to-orange-100/50 border-2 border-orange-300/70">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[16px] flex items-center justify-center shadow-lg">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-black flex items-center gap-2">
                        Mentor Join Requests
                        <Badge variant="orange">{joinRequestsWithProfiles.length} Pending</Badge>
                      </h2>
                      <p className="text-sm text-neutral-gray-dark">Mentors who requested to join this mentorship</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {joinRequestsWithProfiles.map((request) => (
                      <Card key={request.id} padding="md" className="bg-white">
                        <div className="flex items-start gap-4 mb-4">
                          <Avatar 
                            src={request.mentorProfile?.photoURL} 
                            initials={request.mentorProfile?.displayName?.substring(0, 2)?.toUpperCase()}
                            size="xl"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-neutral-black mb-1">
                              {request.mentorProfile?.displayName || 'Unknown Mentor'}
                            </h3>
                            <p className="text-sm text-neutral-gray-dark mb-3">
                              {request.mentorProfile?.bio || 'Experienced mentor'}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {request.mentorProfile?.technologies?.slice(0, 3).map((tech, idx) => (
                                <Badge key={idx} variant="blue" className="text-xs">
                                  {tech.name || tech}
                                </Badge>
                              ))}
                            </div>
                            {request.message && (
                              <p className="text-xs text-neutral-gray-dark italic mb-3">
                                "{request.message}"
                              </p>
                            )}
                            <p className="text-xs text-neutral-gray-dark">
                              Requested: {request.createdAt?.toDate?.().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleJoinRequestResponse(request.id, 'accept')}
                            disabled={processingRequest === request.id}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-[14px] font-bold hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                          >
                            {processingRequest === request.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Accept
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleJoinRequestResponse(request.id, 'decline')}
                            disabled={processingRequest === request.id}
                            className="flex-1 bg-neutral-200 text-neutral-black px-4 py-3 rounded-[14px] font-bold hover:bg-neutral-300 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                          >
                            <XIcon className="w-4 h-4" />
                            Decline
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}

              {/* No Mentor Warning */}
              {!data?.mentorId && joinRequestsWithProfiles.length === 0 && (
                <Card padding="lg" className="mb-8 bg-gradient-to-br from-amber-50 to-amber-100/50 border-2 border-amber-300/70">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-[16px] flex items-center justify-center shadow-lg">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-amber-900 mb-1">No Mentor Assigned Yet</h3>
                      <p className="text-sm text-amber-800">
                        This mentorship is waiting for a mentor. Join requests from interested mentors will appear here.
                      </p>
                    </div>
                    <Button 
                      variant="orange" 
                      onClick={() => navigate('/find-mentors')}
                      icon={<Users className="w-4 h-4" />}
                    >
                      Find Mentors
                    </Button>
                  </div>
                </Card>
              )}

              {/* At-a-Glance Header - Outside Grid */}
              <Card padding="lg" className="mb-8 bg-gradient-to-br from-white via-orange-50/30 to-blue-50/30 border-2 border-orange-200/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-black">Mentorship Overview</h2>
                  </div>
                  <Badge variant={statusInfo.color.includes('green') ? 'success' : statusInfo.color.includes('amber') ? 'warning' : 'blue'} className="text-sm">
                    {formatStatus(data?.status)}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Mentee */}
                  <div className="flex items-center gap-4 p-4 bg-white rounded-[16px] border border-blue-200/50">
                    <Avatar 
                      src={data.menteeAvatar || data.mentee?.avatar} 
                      initials={(data.menteeName || data.mentee?.name)?.substring(0, 2)?.toUpperCase()}
                      size="xl" 
                    />
                    <div>
                      <div className="text-xs text-neutral-gray-dark font-semibold mb-1">MENTEE</div>
                      <div className="text-lg font-bold text-neutral-black">{data.menteeName || data.mentee?.name}</div>
                      <div className="text-sm text-neutral-gray-dark">{data.mentee?.role || 'Team Member'}</div>
                    </div>
                  </div>

                  {/* Mentor */}
                  <div className="flex items-center gap-4 p-4 bg-white rounded-[16px] border border-orange-200/50">
                    {data.mentorId || data.mentor ? (
                      <>
                        <Avatar 
                          src={data.mentorAvatar || data.mentor?.avatar} 
                          initials={(data.mentorName || data.mentor?.name)?.substring(0, 2)?.toUpperCase()}
                          size="xl" 
                        />
                        <div>
                          <div className="text-xs text-neutral-gray-dark font-semibold mb-1">MENTOR</div>
                          <div className="text-lg font-bold text-neutral-black">{data.mentorName || data.mentor?.name}</div>
                          <div className="text-sm text-neutral-gray-dark">{data.mentor?.role || 'Expert Mentor'}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-8 h-8 text-amber-600" />
                        </div>
                        <div>
                          <div className="text-xs text-neutral-gray-dark font-semibold mb-1">MENTOR</div>
                          <div className="text-lg font-bold text-amber-700">Not Assigned Yet</div>
                          <div className="text-sm text-neutral-gray-dark">Waiting for acceptance</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Technologies */}
                {data.technologies && data.technologies.length > 0 && (
                  <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[16px] border border-blue-200/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Code className="w-4 h-4 text-baires-blue" />
                      <span className="text-sm font-bold text-neutral-black">Technologies & Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.technologies.map((tech, idx) => (
                        <span key={idx} className="text-xs bg-white border border-blue-300 text-blue-700 px-3 py-1.5 rounded-full font-semibold">
                          {typeof tech === 'string' ? tech : tech.name || tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Challenge Description or Original Goal */}
                {(data.challengeDescription || data.originalGoal) && (
                  <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[16px] border border-orange-200/50">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[12px] flex items-center justify-center shadow-md flex-shrink-0">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-baires-orange font-bold mb-2 uppercase tracking-wide">
                          {data.challengeDescription ? 'Challenge & Goals' : 'Original Goal'}
                        </div>
                        <p className="text-neutral-black leading-relaxed">{data.challengeDescription || data.originalGoal}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                  {/* AI Insights Card - Only show if there are sessions */}
                  {data?.sessions && data.sessions.length > 0 ? (
                    <Card padding="lg" className="bg-gradient-to-br from-orange-50 via-white to-blue-50 border-2 border-orange-200/50">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[16px] flex items-center justify-center shadow-lg">
                          <Sparkles className="w-6 h-6 text-white animate-pulse" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-neutral-black flex items-center gap-2">
                            AI Magic Insights
                            <Badge variant="orange" className="text-xs">AI</Badge>
                          </h2>
                          <p className="text-sm text-neutral-gray-dark flex items-center gap-1">
                            <Bot className="w-3 h-3 text-baires-orange" />
                            Smart recommendations powered by AI
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* AI Suggestion Cards */}
                        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-[16px] border border-green-200/50">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold text-green-900 mb-1">Mentorship In Progress</div>
                              <p className="text-sm text-green-800">This mentorship is actively progressing. Keep up the good work with regular sessions and feedback.</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[16px] border border-blue-200/50">
                          <div className="flex items-start gap-3">
                            <TrendingUp className="w-5 h-5 text-baires-blue flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold text-blue-900 mb-1">Recommended Action</div>
                              <p className="text-sm text-blue-800">Regular check-ins help maintain momentum. Consider scheduling recurring sessions for consistency.</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[16px] border border-orange-200/50">
                          <div className="flex items-start gap-3">
                            <Target className="w-5 h-5 text-baires-orange flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold text-orange-900 mb-1">Goal Tracking</div>
                              <p className="text-sm text-orange-800">Set clear milestones and track progress regularly to maximize mentorship effectiveness.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ) : null}

                {/* Progress Panel */}
                <Card padding="lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[14px] flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-black">Progress Analytics</h2>
                    <p className="text-sm text-neutral-gray-dark flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-baires-orange" />
                      Data-driven insights
                    </p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  {/* Status */}
                  <Card padding="md" className={`${statusInfo.color} border-2`}>
                    <StatusIcon className={`w-8 h-8 ${statusInfo.iconColor} mb-2`} />
                    <div className="text-xs font-bold uppercase mb-1">Current Status</div>
                    <div className="text-xl font-bold">{statusInfo.label}</div>
                  </Card>

                  {/* Sessions */}
                  <Card padding="md" className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200">
                    <Calendar className="w-8 h-8 text-baires-blue mb-2" />
                    <div className="text-xs font-bold uppercase text-neutral-gray-dark mb-1">Sessions</div>
                    <div className="text-xl font-bold text-neutral-black">
                      {data?.completedSessions || data?.sessionsCompleted || 0}/{data?.totalSessions || 0}
                    </div>
                  </Card>

                  {/* Duration */}
                  <Card padding="md" className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-200">
                    <Clock className="w-8 h-8 text-purple-600 mb-2" />
                    <div className="text-xs font-bold uppercase text-neutral-gray-dark mb-1">Duration</div>
                    <div className="text-xl font-bold text-neutral-black">{weeksDuration || 0} weeks</div>
                  </Card>

                  {/* Avg Progress */}
                  <Card padding="md" className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-2 border-orange-200">
                    <TrendingUp className="w-8 h-8 text-baires-orange mb-2" />
                    <div className="text-xs font-bold uppercase text-neutral-gray-dark mb-1">Avg Rating</div>
                    <div className="text-xl font-bold text-neutral-black">{averageProgress}/5.0</div>
                  </Card>
                </div>

                {/* Progress Trend Chart */}
                {data?.sessions && data.sessions.length > 0 ? (
                  <div className="p-6 bg-gradient-to-br from-neutral-50 to-white rounded-[20px] border border-neutral-200">
                    <h3 className="text-lg font-bold text-neutral-black mb-6 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-baires-orange" />
                      Progress Trend Over Time
                    </h3>
                    
                    {/* Simple Line Chart */}
                    <div className="relative h-64">
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-neutral-gray-dark font-semibold">
                        <span>5</span>
                        <span>4</span>
                        <span>3</span>
                        <span>2</span>
                        <span>1</span>
                      </div>
                      
                      {/* Chart area */}
                      <div className="ml-8 h-full relative">
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="absolute w-full border-t border-neutral-200"
                            style={{ top: `${i * 25}%` }}
                          ></div>
                        ))}
                        
                        {/* Data points and line */}
                        <svg className="w-full h-full">
                          {/* Line */}
                          <polyline
                            points={data.sessions.map((session, i) => {
                              const x = (i / (data.sessions.length - 1)) * 100
                              const y = 100 - ((session.progressRating / 5) * 100)
                              return `${x}%,${y}%`
                            }).join(' ')}
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="3"
                            className="drop-shadow-md"
                          />
                          
                          {/* Gradient definition */}
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#F66135" />
                              <stop offset="100%" stopColor="#FBB39E" />
                            </linearGradient>
                          </defs>
                          
                          {/* Points */}
                          {data.sessions.map((session, i) => {
                            const x = (i / (data.sessions.length - 1)) * 100
                            const y = 100 - ((session.progressRating / 5) * 100)
                            return (
                              <g key={i}>
                                <circle
                                  cx={`${x}%`}
                                  cy={`${y}%`}
                                  r="6"
                                  fill="white"
                                  stroke="#F66135"
                                  strokeWidth="3"
                                  className="cursor-pointer hover:r-8 transition-all"
                                />
                                <title>Session {i + 1}: {session.progressRating}/5</title>
                              </g>
                            )
                          })}
                        </svg>
                      </div>
                      
                      {/* X-axis labels */}
                      <div className="ml-8 mt-2 flex justify-between text-xs text-neutral-gray-dark font-semibold">
                        {data.sessions.map((session, i) => (
                          <span key={i}>S{i + 1}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-gradient-to-br from-neutral-50 to-white rounded-[20px] border border-neutral-200 text-center">
                    <div className="py-8">
                      <BarChart3 className="w-12 h-12 text-neutral-gray-dark mx-auto mb-3 opacity-50" />
                      <h4 className="text-lg font-bold text-neutral-black mb-2">No Session Data Yet</h4>
                      <p className="text-sm text-neutral-gray-dark">
                        Progress tracking will appear here once sessions are logged
                      </p>
                    </div>
                  </div>
                )}
              </Card>

                {/* Session Reports Feed */}
                <Card padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-black">Session History & Reports</h2>
                      <p className="text-sm text-neutral-gray-dark">{data?.sessions?.length || 0} sessions completed</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                {data?.sessions && data.sessions.length > 0 ? (
                  <div className="space-y-6">
                    {[...data.sessions].reverse().map((session, index) => (
                    <div key={session.id} className="relative">
                      {index !== data.sessions.length - 1 && (
                        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-neutral-200"></div>
                      )}
                      
                      <Card hover padding="lg" className="relative bg-gradient-to-br from-white to-neutral-50">
                        <div className="flex gap-6">
                          {/* Date Circle */}
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-baires-orange to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-sm">{data.sessions.length - index}</span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="text-lg font-bold text-neutral-black">
                                    Session #{data.sessions.length - index}
                                  </h3>
                                  <Badge variant="blue" className="text-xs">
                                    {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-neutral-gray-dark">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {session.duration} min
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    Progress: {session.progressRating}/5
                                  </span>
                                </div>
                              </div>
                              
                              {/* Recording Button */}
                              {session.recordingUrl && (
                                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-baires-blue to-blue-600 text-white rounded-[12px] font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                                  <Play className="w-4 h-4" />
                                  Watch Recording
                                </button>
                              )}
                            </div>

                            {/* Summary */}
                            <div className="mb-4">
                              <h4 className="text-sm font-bold text-neutral-black mb-2 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-baires-orange" />
                                Mentor's Summary
                              </h4>
                              <p className="text-neutral-gray-dark leading-relaxed">{session.summary}</p>
                            </div>

                            {/* Next Steps */}
                            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[12px] border border-orange-200/50">
                              <h4 className="text-sm font-bold text-baires-orange mb-2">Next Steps</h4>
                              <p className="text-neutral-black text-sm">{session.nextSteps}</p>
                            </div>

                            {/* Mentor Notes */}
                            {session.mentorNotes && (
                              <div className="mt-3 text-xs text-neutral-gray-dark italic">
                                Note: {session.mentorNotes}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-neutral-gray-dark" />
                    </div>
                    <h4 className="text-lg font-bold text-neutral-black mb-2">No Sessions Logged Yet</h4>
                    <p className="text-sm text-neutral-gray-dark mb-4">
                      Session reports will appear here once the mentor logs them
                    </p>
                  </div>
                )}
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6 md:space-y-8">
                {/* Quick Stats */}
                <Card padding="lg">
                  <h3 className="text-lg font-bold text-neutral-black mb-4">Quick Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[12px]">
                      <span className="text-sm font-semibold text-neutral-gray-dark">Sessions</span>
                      <span className="text-lg font-bold text-neutral-black">{data?.completedSessions || data?.sessionsCompleted || 0}/{data?.totalSessions || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-br from-green-50 to-green-100/50 rounded-[12px]">
                      <span className="text-sm font-semibold text-neutral-gray-dark">Progress</span>
                      <span className="text-lg font-bold text-neutral-black">{data?.overallProgress || data?.progress || 0}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[12px]">
                      <span className="text-sm font-semibold text-neutral-gray-dark">Avg Rating</span>
                      <span className="text-lg font-bold text-neutral-black">{averageProgress}/5</span>
                    </div>
                  </div>
                </Card>

                {/* AI Summary */}
                <Card padding="lg" className="bg-gradient-to-br from-baires-orange via-orange-600 to-orange-700 text-white border-none shadow-[0_20px_50px_rgb(246,97,53,0.3)]">
                  <div className="relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-[18px] flex items-center justify-center mb-4 shadow-lg">
                        <Sparkles className="w-7 h-7 text-white animate-pulse" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        AI Summary
                      </h3>
                      <p className="text-sm mb-4 opacity-90 leading-relaxed">
                        "Sarah has shown exceptional growth, progressing from basic React concepts to building production-ready features. Her proactive learning approach and consistent practice have accelerated her development significantly."
                      </p>
                      <div className="flex items-center gap-2 text-xs opacity-90">
                        <Bot className="w-4 h-4" />
                        <span>Generated by AI CoPilot</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card padding="lg">
                  <h3 className="text-lg font-bold text-neutral-black mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-baires-blue to-blue-600 text-white rounded-[14px] font-semibold hover:shadow-lg transition-all">
                      <MessageSquare className="w-5 h-5" />
                      <span>Message Mentor</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-[14px] font-semibold hover:shadow-lg transition-all">
                      <Calendar className="w-5 h-5" />
                      <span>Schedule Review</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-neutral-100 text-neutral-black rounded-[14px] font-semibold hover:bg-neutral-200 transition-all">
                      <FileText className="w-5 h-5" />
                      <span>Export Report</span>
                    </button>
                  </div>
                </Card>

                {/* Participants Info */}
                <Card padding="lg">
                  <h3 className="text-lg font-bold text-neutral-black mb-4">Participants</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[14px]">
                      <Avatar 
                        src={data?.menteeAvatar || data?.mentee?.avatar} 
                        initials={(data?.menteeName || data?.mentee?.name)?.substring(0, 2)?.toUpperCase()}
                        size="md" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-neutral-gray-dark mb-0.5">MENTEE</div>
                        <div className="font-bold text-neutral-black text-sm truncate">{data?.menteeName || data?.mentee?.name || 'Unknown'}</div>
                      </div>
                    </div>
                    {(data?.mentorId || data?.mentor) && (
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[14px]">
                        <Avatar 
                          src={data?.mentorAvatar || data?.mentor?.avatar} 
                          initials={(data?.mentorName || data?.mentor?.name)?.substring(0, 2)?.toUpperCase()}
                          size="md" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-neutral-gray-dark mb-0.5">MENTOR</div>
                          <div className="font-bold text-neutral-black text-sm truncate">{data?.mentorName || data?.mentor?.name || 'Unknown'}</div>
                        </div>
                      </div>
                    )}
                    {data?.projectManagerName && (
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-[14px]">
                        <Avatar 
                          src={data?.projectManagerAvatar} 
                          initials={data?.projectManagerName?.substring(0, 2)?.toUpperCase()}
                          size="md" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-neutral-gray-dark mb-0.5">PROJECT MANAGER</div>
                          <div className="font-bold text-neutral-black text-sm truncate">{data?.projectManagerName}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      </div>
    </>
  )
}

