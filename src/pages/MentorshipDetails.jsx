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
import SessionLogWizard from '../components/SessionLogWizard'
import MaterialWizard from '../components/MaterialWizard'
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
  Loader2,
  ArrowRight,
  FolderOpen,
  Download,
  ExternalLink,
  Image as ImageIcon,
  Link as LinkIcon
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
  const { user: _user } = useAuth()
  const permissions = usePermissions()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isSessionWizardOpen, setIsSessionWizardOpen] = useState(false)
  const [isMaterialWizardOpen, setIsMaterialWizardOpen] = useState(false)
  const [mentorship, setMentorship] = useState(null)
  const [_joinRequests, setJoinRequests] = useState([])
  const [joinRequestsWithProfiles, setJoinRequestsWithProfiles] = useState([])
  const [_invitations, setInvitations] = useState([])
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

  const handleSessionLogSubmit = async (sessionData) => {
    console.log('Session log submitted:', sessionData)
    // TODO: Implement session log save to Firestore
    alert('Session logged successfully! (Note: Backend integration pending)')
    // Refresh the page to show the new session
    // window.location.reload()
  }

  const handleMaterialSubmit = async (materialData) => {
    console.log('Material submitted:', materialData)
    // TODO: Implement material save to Firestore
    alert('Material added successfully! (Note: Backend integration pending)')
    // Refresh the page to show the new material
    // window.location.reload()
  }

  // Mock materials data
  const mockMaterials = [
    {
      id: 1,
      type: 'pdf',
      title: 'React Best Practices Guide',
      description: 'Comprehensive guide covering modern React patterns and best practices',
      url: 'https://example.com/react-guide.pdf',
      addedBy: 'Mentor',
      addedAt: new Date('2024-01-15'),
      downloads: 12
    },
    {
      id: 2,
      type: 'link',
      title: 'Official React Documentation',
      description: 'The official React docs - great reference material',
      url: 'https://react.dev',
      addedBy: 'Mentor',
      addedAt: new Date('2024-01-10'),
      downloads: 25
    },
    {
      id: 3,
      type: 'video',
      title: 'React Hooks Deep Dive',
      description: 'Video tutorial covering all React hooks in depth',
      url: 'https://youtube.com/watch?v=example',
      addedBy: 'Mentor',
      addedAt: new Date('2024-01-20'),
      downloads: 8
    }
  ]
  
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
            
              {/* Status Banner - Show when waiting for mentor */}
              {!data?.mentorId && (
                <Card padding="lg" className="mb-8 bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50 border-2 border-amber-300/70 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-[16px] flex items-center justify-center shadow-lg">
                        <Clock className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-ping"></div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-amber-900 mb-1 flex items-center gap-2">
                        Awaiting Mentor Assignment
                        <Badge variant="warning" className="text-xs animate-pulse">Action Required</Badge>
                      </h3>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        {invitationsWithProfiles.length > 0 
                          ? `${invitationsWithProfiles.filter(inv => inv.status === 'pending').length} mentor invitation(s) pending response. You can also browse and invite more mentors, or wait for join requests.`
                          : joinRequestsWithProfiles.length > 0
                          ? `${joinRequestsWithProfiles.length} mentor(s) have requested to join. Review and accept the best match below.`
                          : 'No mentors have been invited yet. Browse available mentors and send invitations, or wait for mentors to request joining this mentorship.'
                        }
                      </p>
                    </div>
                    <Button 
                      variant="orange" 
                      onClick={() => navigate(`/mentorship/${id}/find-mentors`)}
                      icon={<Users className="w-5 h-5" />}
                      className="shadow-lg hover:shadow-xl"
                    >
                      Browse Mentors
                    </Button>
                  </div>
                </Card>
              )}
              {/* Mentorship Overview - MOVED TO TOP */}
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
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center animate-pulse">
                          <AlertCircle className="w-8 h-8 text-amber-600" />
                        </div>
                        <div>
                          <div className="text-xs text-neutral-gray-dark font-semibold mb-1">MENTOR</div>
                          <div className="text-lg font-bold text-amber-700">Awaiting Selection</div>
                          <div className="text-sm text-amber-600 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending assignment
                          </div>
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
                  <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[16px] border border-orange-200/50 mb-6">
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

                {/* AI Feedback Section */}
                <div className="p-5 bg-gradient-to-br from-purple-50 via-purple-100/50 to-blue-50 rounded-[16px] border-2 border-purple-200/70">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[12px] flex items-center justify-center shadow-md flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wide">AI Feedback & Analysis</h3>
                        <Badge variant="purple" className="text-xs">
                          <Bot className="w-3 h-3 inline mr-1" />
                          AI Powered
                        </Badge>
                      </div>
                      <p className="text-xs text-purple-700 mb-3">Intelligent insights generated by our AI copilot</p>
                    </div>
                  </div>

                  {!data?.mentorId ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-white/80 backdrop-blur-sm rounded-[12px] border border-purple-200/50">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-neutral-black mb-1">Awaiting Mentor Selection</p>
                            <p className="text-xs text-neutral-gray-dark leading-relaxed">
                              This mentorship is currently in the setup phase. Once a mentor is assigned, our AI will begin analyzing 
                              the match quality, skill alignment, and provide personalized recommendations for maximizing the mentorship success.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-white/80 backdrop-blur-sm rounded-[12px] border border-purple-200/50">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-neutral-black mb-1">Preparation Tips</p>
                            <p className="text-xs text-neutral-gray-dark leading-relaxed">
                              Based on the selected technologies ({data.technologies?.slice(0, 3).map(t => typeof t === 'string' ? t : t.name).join(', ')}), 
                              we recommend finding mentors with proven expertise in these areas and experience in guiding junior developers through 
                              similar learning paths.
                            </p>
                          </div>
                        </div>
                      </div>

                      {invitationsWithProfiles.length > 0 && (
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[12px] border border-blue-200/50">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-neutral-black mb-1">Action Pending</p>
                              <p className="text-xs text-neutral-gray-dark leading-relaxed">
                                You have {invitationsWithProfiles.filter(inv => inv.status === 'pending').length} pending mentor 
                                invitation{invitationsWithProfiles.filter(inv => inv.status === 'pending').length !== 1 ? 's' : ''}. 
                                Review the invited mentors below and track their responses to move forward with the mentorship.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-white/80 backdrop-blur-sm rounded-[12px] border border-purple-200/50">
                      <div className="flex items-start gap-3">
                        <Bot className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-neutral-black mb-2">Mentorship Analysis</p>
                          <p className="text-xs text-neutral-gray-dark leading-relaxed mb-3">
                            This mentorship shows a strong foundation with well-defined goals and appropriate technology selection. 
                            The mentor-mentee pairing appears well-suited based on skill requirements and expertise areas.
                          </p>
                          <div className="flex items-center gap-2 text-xs text-purple-700">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-semibold">Match Quality: High</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>


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

              {/* Grid Layout - Only show if not pending */}
              {data?.status !== 'pending' && data?.status !== 'pending_mentor' && (
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

                {/* Materials List for PM */}
                <Card padding="lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
                      <FolderOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-black">Learning Materials</h2>
                      <p className="text-sm text-neutral-gray-dark">{mockMaterials.length} resources shared</p>
                    </div>
                  </div>

                  {mockMaterials.length > 0 ? (
                    <div className="space-y-3">
                      {mockMaterials.map((material) => {
                        const getIcon = () => {
                          switch (material.type) {
                            case 'pdf': return FileText
                            case 'image': return ImageIcon
                            case 'link': return LinkIcon
                            case 'video': return Video
                            default: return FileText
                          }
                        }
                        const Icon = getIcon()
                        
                        const getColor = () => {
                          switch (material.type) {
                            case 'pdf': return 'from-red-500 to-red-600'
                            case 'image': return 'from-purple-500 to-purple-600'
                            case 'link': return 'from-blue-500 to-blue-600'
                            case 'video': return 'from-pink-500 to-pink-600'
                            default: return 'from-neutral-500 to-neutral-600'
                          }
                        }

                        return (
                          <Card key={material.id} padding="md" hover className="bg-gradient-to-br from-white to-neutral-50">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-[12px] bg-gradient-to-br ${getColor()} flex items-center justify-center flex-shrink-0 shadow-md`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-neutral-black mb-1">{material.title}</h3>
                                {material.description && (
                                  <p className="text-sm text-neutral-gray-dark mb-2 line-clamp-2">{material.description}</p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-neutral-gray-dark">
                                  <span>Added by {material.addedBy}</span>
                                  <span>•</span>
                                  <span>{material.addedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                  {material.downloads > 0 && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <Download className="w-3 h-3" />
                                        {material.downloads}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <a
                                href={material.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-[12px] font-semibold hover:shadow-md transition-all flex items-center gap-2 flex-shrink-0"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Open
                              </a>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FolderOpen className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-bold text-neutral-black mb-2">No Materials Yet</h4>
                      <p className="text-sm text-neutral-gray-dark mb-4">
                        The mentor will share learning materials here
                      </p>
                    </div>
                  )}
                </Card>
                </div>
              </div>
              )}
            </>
          ) : permissions.isMentor ? (
            // ==================== MENTOR VIEW ====================
            <>
              {/* Mentorship Overview for Mentor */}
              <Card padding="lg" className="mb-8 bg-gradient-to-br from-white via-blue-50/30 to-orange-50/30 border-2 border-blue-200/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[14px] flex items-center justify-center shadow-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-black">Your Mentorship</h2>
                  </div>
                  <Badge variant={statusInfo.color.includes('green') ? 'success' : statusInfo.color.includes('amber') ? 'warning' : 'blue'} className="text-sm">
                    {formatStatus(data?.status)}
                  </Badge>
                </div>

                {/* Mentee Information */}
                <div className="flex items-center gap-4 p-5 bg-white rounded-[16px] border border-blue-200/50 mb-6">
                  <Avatar 
                    src={data?.menteeAvatar} 
                    initials={data?.menteeName?.substring(0, 2)?.toUpperCase()}
                    size="xl"
                    ring
                  />
                  <div className="flex-1">
                    <div className="text-xs text-neutral-gray-dark font-semibold mb-1">YOUR MENTEE</div>
                    <div className="text-xl font-bold text-neutral-black mb-1">{data?.menteeName}</div>
                    {data?.technologies && data.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {data.technologies.slice(0, 4).map((tech, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            {typeof tech === 'string' ? tech : tech.name || tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Challenge/Goals */}
                {data?.challengeDescription && (
                  <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[16px] border border-orange-200/50">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[12px] flex items-center justify-center shadow-md flex-shrink-0">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-baires-orange font-bold mb-2 uppercase tracking-wide">Challenge & Goals</div>
                        <p className="text-neutral-black leading-relaxed">{data.challengeDescription}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Grid Layout for Mentor */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                  {/* Progress Overview */}
                  <Card padding="lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-neutral-black">Progress Overview</h2>
                        <p className="text-sm text-neutral-gray-dark">Track your mentee's growth</p>
                      </div>
                    </div>

                    {/* Progress Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <Card padding="md" className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200">
                        <Calendar className="w-8 h-8 text-baires-blue mb-2" />
                        <div className="text-xs font-bold uppercase text-neutral-gray-dark mb-1">Sessions</div>
                        <div className="text-xl font-bold text-neutral-black">
                          {data?.sessionsCompleted || 0}
                        </div>
                      </Card>

                      <Card padding="md" className="bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200">
                        <Target className="w-8 h-8 text-green-600 mb-2" />
                        <div className="text-xs font-bold uppercase text-neutral-gray-dark mb-1">Progress</div>
                        <div className="text-xl font-bold text-neutral-black">
                          {data?.progress || 0}%
                        </div>
                      </Card>

                      <Card padding="md" className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-200">
                        <Clock className="w-8 h-8 text-purple-600 mb-2" />
                        <div className="text-xs font-bold uppercase text-neutral-gray-dark mb-1">Duration</div>
                        <div className="text-xl font-bold text-neutral-black">{weeksDuration || 0}w</div>
                      </Card>

                      <Card padding="md" className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-2 border-orange-200">
                        <TrendingUp className="w-8 h-8 text-baires-orange mb-2" />
                        <div className="text-xs font-bold uppercase text-neutral-gray-dark mb-1">Rating</div>
                        <div className="text-xl font-bold text-neutral-black">{averageProgress}/5</div>
                      </Card>
                    </div>
                  </Card>

                  {/* Session Logging CTA */}
                  <Card padding="none" className="overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300" onClick={() => setIsSessionWizardOpen(true)}>
                    <div className="relative bg-gradient-to-br from-baires-orange via-orange-600 to-orange-700 p-8">
                      {/* Animated Background Elements */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                              <Sparkles className="w-4 h-4 text-white animate-pulse" />
                              <span className="text-white font-bold text-sm">AI-Powered Session Logging</span>
                            </div>
                            
                            <h3 className="text-3xl font-bold text-white mb-3">
                              Log New Session
                            </h3>
                            <p className="text-orange-100 leading-relaxed mb-6">
                              Document your mentorship progress with our intelligent wizard. Track sessions, rate progress, and set actionable next steps—all in a few simple steps.
                            </p>

                            <div className="flex flex-wrap gap-3 mb-6">
                              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <Calendar className="w-4 h-4 text-white" />
                                <span className="text-white text-sm font-semibold">Quick & Easy</span>
                              </div>
                              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <Sparkles className="w-4 h-4 text-white" />
                                <span className="text-white text-sm font-semibold">AI Assistance</span>
                              </div>
                              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <FileText className="w-4 h-4 text-white" />
                                <span className="text-white text-sm font-semibold">Auto-Save</span>
                              </div>
                            </div>

                            <button className="bg-white cursor-pointer text-baires-orange px-8 py-4 rounded-[16px] font-bold text-lg shadow-2xl hover:scale-105 hover:shadow-3xl transition-all duration-300 flex items-center gap-3 group-hover:gap-4">
                              <Plus className="w-6 h-6" />
                              Start Session Log Wizard
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>

                          <div className="hidden lg:block ml-6">
                            <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-[24px] flex items-center justify-center group-hover:rotate-6 transition-transform duration-500">
                              <Plus className="w-16 h-16 text-white group-hover:rotate-90 transition-transform duration-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Materials CTA */}
                  <Card padding="none" className="overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300" onClick={() => setIsMaterialWizardOpen(true)}>
                    <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-8">
                      {/* Animated Background Elements */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                              <Sparkles className="w-4 h-4 text-white animate-pulse" />
                              <span className="text-white font-bold text-sm">Resource Library</span>
                            </div>
                            
                            <h3 className="text-3xl font-bold text-white mb-3">
                              Add New Material
                            </h3>
                            <p className="text-blue-100 leading-relaxed mb-6">
                              Share PDFs, images, links, videos, spreadsheets, and other learning materials with your mentee. Build a comprehensive resource library.
                            </p>

                            <div className="flex flex-wrap gap-3 mb-6">
                              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <FileText className="w-4 h-4 text-white" />
                                <span className="text-white text-sm font-semibold">Multiple Types</span>
                              </div>
                              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <FolderOpen className="w-4 h-4 text-white" />
                                <span className="text-white text-sm font-semibold">Organized</span>
                              </div>
                              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <Download className="w-4 h-4 text-white" />
                                <span className="text-white text-sm font-semibold">Easy Access</span>
                              </div>
                            </div>

                            <button className="bg-white text-blue-600 px-8 py-4 rounded-[16px] font-bold text-lg shadow-2xl hover:scale-105 hover:shadow-3xl transition-all duration-300 flex items-center gap-3 group-hover:gap-4">
                              <FolderOpen className="w-6 h-6" />
                              Add Material Wizard
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>

                          <div className="hidden lg:block ml-6">
                            <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-[24px] flex items-center justify-center group-hover:rotate-6 transition-transform duration-500">
                              <FolderOpen className="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Materials List */}
                  <Card padding="lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
                        <FolderOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-neutral-black">Learning Materials</h2>
                        <p className="text-sm text-neutral-gray-dark">{mockMaterials.length} resources available</p>
                      </div>
                    </div>

                    {mockMaterials.length > 0 ? (
                      <div className="space-y-3">
                        {mockMaterials.map((material) => {
                          const getIcon = () => {
                            switch (material.type) {
                              case 'pdf': return FileText
                              case 'image': return ImageIcon
                              case 'link': return LinkIcon
                              case 'video': return Video
                              default: return FileText
                            }
                          }
                          const Icon = getIcon()
                          
                          const getColor = () => {
                            switch (material.type) {
                              case 'pdf': return 'from-red-500 to-red-600'
                              case 'image': return 'from-purple-500 to-purple-600'
                              case 'link': return 'from-blue-500 to-blue-600'
                              case 'video': return 'from-pink-500 to-pink-600'
                              default: return 'from-neutral-500 to-neutral-600'
                            }
                          }

                          return (
                            <Card key={material.id} padding="md" hover className="bg-gradient-to-br from-white to-neutral-50">
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-[12px] bg-gradient-to-br ${getColor()} flex items-center justify-center flex-shrink-0 shadow-md`}>
                                  <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-neutral-black mb-1">{material.title}</h3>
                                  {material.description && (
                                    <p className="text-sm text-neutral-gray-dark mb-2 line-clamp-2">{material.description}</p>
                                  )}
                                  <div className="flex items-center gap-4 text-xs text-neutral-gray-dark">
                                    <span>Added by {material.addedBy}</span>
                                    <span>•</span>
                                    <span>{material.addedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    {material.downloads > 0 && (
                                      <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                          <Download className="w-3 h-3" />
                                          {material.downloads}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <a
                                  href={material.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-[12px] font-semibold hover:shadow-md transition-all flex items-center gap-2 flex-shrink-0"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Open
                                </a>
                              </div>
                            </Card>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FolderOpen className="w-8 h-8 text-blue-600" />
                        </div>
                        <h4 className="text-lg font-bold text-neutral-black mb-2">No Materials Yet</h4>
                        <p className="text-sm text-neutral-gray-dark mb-4">
                          Start building your resource library by adding materials
                        </p>
                      </div>
                    )}
                  </Card>

                  {/* Session History */}
                  {data?.sessions && data.sessions.length > 0 && (
                    <Card padding="lg">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-neutral-black">Your Session Logs</h2>
                          <p className="text-sm text-neutral-gray-dark">{data.sessions.length} sessions completed</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[...data.sessions].reverse().slice(0, 5).map((session) => (
                          <Card key={session.id} padding="md" hover className="bg-gradient-to-br from-neutral-50 to-white">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-full flex items-center justify-center shadow-md">
                                  <span className="text-white font-bold text-sm">{session.progressRating}</span>
                                </div>
                                <div>
                                  <div className="font-bold text-neutral-black">
                                    {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </div>
                                  <div className="text-xs text-neutral-gray-dark">{session.duration} min session</div>
                                </div>
                              </div>
                              <button className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-[12px] font-semibold text-sm transition-colors flex items-center gap-2">
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                            </div>
                            <p className="text-sm text-neutral-gray-dark line-clamp-2 mb-2">{session.summary}</p>
                            {session.nextSteps && (
                              <div className="p-2 bg-orange-50/50 rounded-[8px] border border-orange-100/50">
                                <p className="text-xs text-neutral-gray-dark"><strong>Next:</strong> {session.nextSteps}</p>
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>

                {/* Mentor Sidebar */}
                <div className="space-y-6 md:space-y-8">
                  {/* Quick Stats */}
                  <Card padding="lg">
                    <h3 className="text-lg font-bold text-neutral-black mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[12px]">
                        <span className="text-sm font-semibold text-neutral-gray-dark">Sessions Logged</span>
                        <span className="text-lg font-bold text-neutral-black">{data?.sessionsCompleted || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gradient-to-br from-green-50 to-green-100/50 rounded-[12px]">
                        <span className="text-sm font-semibold text-neutral-gray-dark">Progress</span>
                        <span className="text-lg font-bold text-green-600">{data?.progress || 0}%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[12px]">
                        <span className="text-sm font-semibold text-neutral-gray-dark">Avg Rating</span>
                        <span className="text-lg font-bold text-neutral-black">{averageProgress}/5</span>
                      </div>
                    </div>
                  </Card>

                  {/* AI Assistant Tools */}
                  <Card padding="lg" className="bg-gradient-to-br from-orange-50 via-white to-blue-50 border-2 border-orange-200/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[14px] flex items-center justify-center shadow-lg">
                        <Sparkles className="w-5 h-5 text-white animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-neutral-black flex items-center gap-2">
                          AI Tools
                          <Badge variant="orange" className="text-xs">Magic</Badge>
                        </h3>
                        <p className="text-xs text-neutral-gray-dark">Let AI help you</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <button className="w-full text-left p-3 bg-white rounded-[12px] border-2 border-neutral-200 hover:border-orange-400 hover:bg-orange-50/50 transition-all group">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-4 h-4 text-baires-orange group-hover:rotate-12 transition-transform" />
                          <span className="text-sm font-bold text-neutral-black">Generate Summary</span>
                        </div>
                      </button>
                      
                      <button className="w-full text-left p-3 bg-white rounded-[12px] border-2 border-neutral-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
                        <div className="flex items-center gap-3">
                          <Target className="w-4 h-4 text-baires-blue" />
                          <span className="text-sm font-bold text-neutral-black">Suggest Next Steps</span>
                        </div>
                      </button>

                      <button className="w-full text-left p-3 bg-white rounded-[12px] border-2 border-neutral-200 hover:border-orange-400 hover:bg-orange-50/50 transition-all group">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-4 h-4 text-baires-orange" />
                          <span className="text-sm font-bold text-neutral-black">Analyze Progress</span>
                        </div>
                      </button>
                    </div>
                  </Card>

                  {/* Quick Actions */}
                  <Card padding="lg">
                    <h3 className="text-lg font-bold text-neutral-black mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-baires-blue to-blue-600 text-white rounded-[14px] font-semibold hover:shadow-lg transition-all">
                        <MessageSquare className="w-5 h-5" />
                        <span>Message Mentee</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-[14px] font-semibold hover:shadow-lg transition-all">
                        <Calendar className="w-5 h-5" />
                        <span>Schedule Session</span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 bg-neutral-100 text-neutral-black rounded-[14px] font-semibold hover:bg-neutral-200 transition-all">
                        <FileText className="w-5 h-5" />
                        <span>View All Logs</span>
                      </button>
                    </div>
                  </Card>

                  {/* AI Tips */}
                  <Card padding="lg" className="bg-gradient-to-br from-baires-orange via-orange-600 to-orange-700 text-white border-none shadow-[0_20px_50px_rgb(246,97,53,0.3)]">
                    <div className="relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                      <div className="relative">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-[16px] flex items-center justify-center mb-4 shadow-lg">
                          <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">AI Tips</h3>
                        <div className="space-y-2 text-sm opacity-90">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <p>Focus on practical coding exercises</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <p>Encourage questions and active learning</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <p>Regular feedback accelerates growth</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs opacity-75 mt-4">
                          <Bot className="w-4 h-4" />
                          <span>AI CoPilot</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            // ==================== DEFAULT VIEW ====================
            <Card padding="xl" className="text-center">
              <div className="py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-10 h-10 text-neutral-gray-dark" />
                </div>
                <h3 className="text-xl font-bold text-neutral-black mb-2">Access Denied</h3>
                <p className="text-neutral-gray-dark mb-6">
                  You don't have permission to view this mentorship
                </p>
                <Button variant="orange" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Session Log Wizard Modal */}
      <SessionLogWizard
        isOpen={isSessionWizardOpen}
        onClose={() => setIsSessionWizardOpen(false)}
        onSubmit={handleSessionLogSubmit}
        mentee={{ name: data?.menteeName }}
      />

      {/* Material Wizard Modal */}
      <MaterialWizard
        isOpen={isMaterialWizardOpen}
        onClose={() => setIsMaterialWizardOpen(false)}
        onSubmit={handleMaterialSubmit}
      />
      </div>
    </>
  )
}

