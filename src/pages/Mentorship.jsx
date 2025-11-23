import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useConfirm } from '../hooks/useConfirm'
import usePermissions from '../hooks/usePermissions'
import { getUserMentorships, getPMMentorships, getInvitationsForMentor, updateInvitationStatus } from '../services/firestoreService'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import PageHeader from '../components/PageHeader'
import SEO from '../components/SEO'
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Target, 
  Plus, 
  Search, 
  Filter, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BookOpen,
  MessageSquare,
  Star,
  Bot,
  Loader2,
  X
} from 'lucide-react'

// Removed static data - now using dynamic data from Firestore

const statusConfig = {
  active: { 
    label: 'Active', 
    color: 'bg-green-100 text-green-700 border-green-200',
    dot: 'bg-green-500'
  },
  pending: { 
    label: 'Pending', 
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500'
  },
  pending_mentor: { 
    label: 'Pending Mentor', 
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500'
  },
  pending_kickoff: { 
    label: 'Pending Kickoff', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    dot: 'bg-blue-500'
  },
  completed: { 
    label: 'Completed', 
    color: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    dot: 'bg-neutral-500'
  },
}

export default function Mentorship() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const confirm = useConfirm()
  const permissions = usePermissions()
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [mentorships, setMentorships] = useState([])
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingInvitation, setProcessingInvitation] = useState(null)

  // Fetch mentorships and invitations based on user role
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return
      
      setLoading(true)
      try {
        let mentorshipData = []
        let invitationData = []
        
        if (permissions.isPM) {
          mentorshipData = await getPMMentorships(user.uid)
        } else if (permissions.isMentor) {
          mentorshipData = await getUserMentorships(user.uid)
          // Fetch invitations for mentors
          invitationData = await getInvitationsForMentor(user.uid)
        } else {
          mentorshipData = await getUserMentorships(user.uid)
        }
        
        setMentorships(mentorshipData || [])
        setInvitations(invitationData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setMentorships([])
        setInvitations([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, permissions.isPM, permissions.isMentor])

  // Calculate stats from actual data
  const stats = [
    { 
      label: 'Active Mentorships', 
      value: mentorships.filter(m => m.status === 'active').length.toString(), 
      icon: Users, 
      color: 'blue', 
      trend: '+' + mentorships.filter(m => m.status === 'active').length 
    },
    { 
      label: 'Total Sessions', 
      value: mentorships.reduce((sum, m) => sum + (m.sessionsCompleted || 0), 0).toString(), 
      icon: Calendar, 
      color: 'orange', 
      trend: '+' + mentorships.reduce((sum, m) => sum + (m.sessionsCompleted || 0), 0)
    },
    { 
      label: 'Pending', 
      value: mentorships.filter(m => m.status === 'pending' || m.status === 'pending_kickoff').length.toString(), 
      icon: Target, 
      color: 'yellow', 
      trend: mentorships.filter(m => m.status === 'pending' || m.status === 'pending_kickoff').length.toString() 
    },
    { 
      label: 'Completed', 
      value: mentorships.filter(m => m.status === 'completed').length.toString(), 
      icon: Star, 
      color: 'green', 
      trend: '↑' 
    },
  ]

  // Handle invitation accept/decline
  const handleInvitationResponse = async (invitationId, action) => {
    setProcessingInvitation(invitationId)
    try {
      console.log(`🔄 Processing invitation ${invitationId}, action: ${action}`)
      
      await updateInvitationStatus(
        invitationId, 
        action === 'accept' ? 'accepted' : 'declined',
        action === 'accept' ? user : null
      )
      
      console.log(`✅ Invitation ${action === 'accept' ? 'accepted' : 'declined'} successfully`)
      
      if (action === 'accept') {
        await confirm.success(
          'You are now the mentor for this mentorship.',
          'Mentorship Accepted'
        )
      }
      
      // Refresh data
      window.location.reload()
    } catch (error) {
      console.error('❌ Error handling invitation:', error)
      await confirm.error(
        `${error.message}\n\nPlease try again.`,
        'Error Processing Invitation'
      )
    } finally {
      setProcessingInvitation(null)
    }
  }

  const filteredMentorships = mentorships.filter(m => {
    // Filter logic with support for multiple pending statuses
    let matchesFilter = false
    if (filter === 'all') {
      matchesFilter = true
    } else if (filter === 'pending') {
      // Match all pending statuses
      matchesFilter = m.status === 'pending' || m.status === 'pending_mentor' || m.status === 'pending_kickoff'
    } else {
      matchesFilter = m.status === filter
    }
    
    // Search logic with null safety
    const menteeName = m.menteeName || ''
    const mentorName = m.mentorName || ''
    const technologiesText = (m.technologies || [])
      .map(t => typeof t === 'string' ? t : t.name || t)
      .join(' ')
    const searchText = `${menteeName} ${mentorName} ${technologiesText}`.toLowerCase()
    const matchesSearch = searchText.includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status) => statusConfig[status]
  

  return (
    <>
      <SEO 
        title="My Mentorships"
        description="Manage and track all your mentorship journeys. View active sessions, upcoming meetings, and monitor progress with AI insights."
      />
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/15">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
          {/* Page Header - Reusable component */}
          <PageHeader 
            title="My Mentorships"
            description="Manage and track all your mentorship journeys"
          />


            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-baires-blue mx-auto mb-4 animate-spin" />
                  <p className="text-neutral-gray-dark">Loading your mentorships...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {stats.map((stat, index) => (
                    <Card key={index} hover padding="md" gradient className="group">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-3xl font-bold text-neutral-black">{stat.value}</span>
                            {stat.trend && (
                              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                {stat.trend}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-gray-dark font-medium">{stat.label}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 ${
                          stat.color === 'blue' ? 'bg-gradient-to-br from-baires-blue to-blue-600' :
                          stat.color === 'orange' ? 'bg-gradient-to-br from-baires-blue to-blue-600' :
                          stat.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                          'bg-gradient-to-br from-amber-500 to-amber-600'
                        }`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Mentorship Invitations - Only for Mentors */}
                {permissions.isMentor && invitations.length > 0 && (
                  <Card padding="lg" className="mb-6 bg-gradient-to-br from-orange-50 via-white to-blue-100/50 border-2 border-orange-300/70">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[16px] flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-white animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-neutral-black flex items-center gap-2">
                          Mentorship Invitations
                          <Badge variant="orange">{invitations.length} New</Badge>
                        </h2>
                        <p className="text-sm text-neutral-gray-dark">You have pending mentorship invitations</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {invitations.map((invitation) => (
                        <div key={invitation.id} className="p-5 bg-gradient-to-br from-white to-blue-50/50 rounded-[20px] border-2 border-orange-200/70 shadow-lg hover:shadow-xl transition-all">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-md flex-shrink-0">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-neutral-black text-lg">Mentorship Invitation</h3>
                                <Badge variant="orange" className="text-xs">New</Badge>
                              </div>
                              
                              {/* Mentee Info */}
                              {invitation.menteeName && (
                                <div className="flex items-center gap-2 mb-3 p-3 bg-white rounded-[12px] border border-blue-200/50">
                                  <div>
                                    <p className="text-xs text-neutral-gray-dark font-semibold mb-1">MENTEE</p>
                                    <p className="text-sm font-bold text-neutral-black">{invitation.menteeName}</p>
                                  </div>
                                </div>
                              )}
                              
                              {/* Technologies */}
                              {invitation.technologies && invitation.technologies.length > 0 && (
                                <div className="mb-3">
                                  <p className="text-xs text-neutral-gray-dark font-semibold mb-2">Technologies:</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {invitation.technologies.slice(0, 5).map((tech, idx) => (
                                      <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                        {typeof tech === 'string' ? tech : tech.name || tech}
                                      </span>
                                    ))}
                                    {invitation.technologies.length > 5 && (
                                      <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full font-medium">
                                        +{invitation.technologies.length - 5}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* Message */}
                              {invitation.message && (
                                <div className="mb-3 p-3 bg-blue-50/50 rounded-[12px] border border-blue-100/50">
                                  <p className="text-xs text-neutral-gray-dark font-semibold mb-1">MESSAGE</p>
                                  <p className="text-sm text-neutral-black">{invitation.message}</p>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-3 text-xs text-neutral-gray-dark">
                                <span>From: {invitation.projectManagerName || 'PM'}</span>
                                <span>•</span>
                                <span>{invitation.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleInvitationResponse(invitation.id, 'accept')}
                              disabled={processingInvitation === invitation.id}
                              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-[14px] font-bold hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-2"
                            >
                              {processingInvitation === invitation.id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  Accept & Start
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleInvitationResponse(invitation.id, 'decline')}
                              disabled={processingInvitation === invitation.id}
                              className="flex-1 bg-neutral-200 text-neutral-black px-4 py-3 rounded-[14px] font-bold hover:bg-neutral-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Filters and Search */}
                <Card padding="md">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {['all', 'active', 'pending', 'completed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setFilter(status)}
                          className={`px-4 py-2 rounded-[12px] font-semibold text-sm transition-all duration-300 ${
                            filter === status
                              ? 'bg-gradient-to-r from-baires-blue to-blue-600 text-white shadow-lg'
                              : 'bg-neutral-100 text-neutral-gray-dark hover:bg-neutral-200'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                          {status !== 'all' && (
                            <span className="ml-2 text-xs">
                              ({mentorships.filter(m => m.status === status).length})
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    <div className="relative w-full md:w-auto">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-gray-dark" />
                      <input
                        type="text"
                        placeholder="Search mentorships..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-[12px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none w-full md:w-64 transition-colors"
                      />
                    </div>
                  </div>
                </Card>

          {/* Mentorships Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {filteredMentorships.map((mentorship) => {
              const statusInfo = getStatusColor(mentorship.status) || statusConfig.active
              return (
                <Card 
                  key={mentorship.id} 
                  hover 
                  padding="md" 
                  className="overflow-hidden group cursor-pointer"
                  onClick={() => navigate(`/mentorship/${mentorship.id}`)}
                >
                  <div className="relative">
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusInfo?.color || statusConfig.active.color} border shadow-sm`}>
                        <div className={`w-2 h-2 ${statusInfo?.dot || statusConfig.active.dot} rounded-full animate-pulse`}></div>
                        <span className="text-xs font-bold">{statusInfo?.label || 'Active'}</span>
                      </div>
                    </div>

                    {/* Header */}
                    <div className="bg-gradient-to-br from-orange-50 via-white to-blue-50 p-6 border-b border-neutral-100">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Avatar 
                            src={mentorship.menteeAvatar} 
                            initials={mentorship.menteeName?.substring(0, 2)?.toUpperCase()}
                            size="xl" 
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-neutral-black mb-1">{mentorship.menteeName}</h3>
                          <p className="text-sm text-neutral-gray-dark mb-2">
                            {permissions.isMentor ? 'Mentee' : `Mentor: ${mentorship.mentorName || 'Not assigned yet'}`}
                          </p>
                          {mentorship.technologies && mentorship.technologies.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                              <BookOpen className="w-4 h-4 text-baires-blue" />
                              {mentorship.technologies.slice(0, 3).map((tech, idx) => (
                                <span key={idx} className="text-xs bg-white border border-orange-200 text-neutral-black px-2 py-1 rounded-full font-medium">
                                  {typeof tech === 'string' ? tech : tech.name || tech}
                                </span>
                              ))}
                              {mentorship.technologies.length > 3 && (
                                <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full font-medium">
                                  +{mentorship.technologies.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="p-6 bg-white">
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-neutral-black">Progress</span>
                          <span className="text-sm font-bold text-baires-blue">{mentorship.progress || 0}%</span>
                        </div>
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-baires-blue to-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${mentorship.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[12px]">
                          <Calendar className="w-4 h-4 text-baires-blue mx-auto mb-1" />
                          <div className="text-lg font-bold text-neutral-black">{mentorship.sessionsCompleted || 0}/{mentorship.totalSessions || 0}</div>
                          <div className="text-xs text-neutral-gray-dark">Sessions</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100/50 rounded-[12px]">
                          <Target className="w-4 h-4 text-green-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-neutral-black">{mentorship.technologies?.length || 0}</div>
                          <div className="text-xs text-neutral-gray-dark">Skills</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-blue-100/50 rounded-[12px]">
                          <Clock className="w-4 h-4 text-baires-blue mx-auto mb-1" />
                          <div className="text-lg font-bold text-neutral-black">
                            {mentorship.progress || 0}%
                          </div>
                          <div className="text-xs text-neutral-gray-dark">Progress</div>
                        </div>
                      </div>

                      {/* Challenge Description */}
                      {mentorship.challengeDescription && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-baires-blue" />
                            <span className="text-sm font-semibold text-neutral-black">Challenge</span>
                          </div>
                          <div className="p-3 bg-orange-50/50 rounded-[12px] border border-orange-100/50">
                            <p className="text-xs text-neutral-gray-dark line-clamp-2 leading-relaxed">
                              {mentorship.challengeDescription}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button 
                          className="flex-1 bg-gradient-to-r from-baires-blue to-blue-600 text-white px-4 py-3 rounded-[14px] font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
                </div>

                {/* Empty State */}
                {filteredMentorships.length === 0 && (
                  <Card padding="xl" className="text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-10 h-10 text-neutral-gray-dark" />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-black mb-2">No mentorships found</h3>
                      <p className="text-neutral-gray-dark mb-6">
                        {mentorships.length === 0 
                          ? 'You don\'t have any mentorships yet' 
                          : 'Try adjusting your filters or search query'}
                      </p>
                      {permissions.canCreateMentorship && (
                        <Button 
                          variant="orange" 
                          icon={<Plus className="w-4 h-4" />}
                          onClick={() => navigate('/create-mentorship')}
                        >
                          Start New Mentorship
                        </Button>
                      )}
                    </div>
                  </Card>
                )}
              </>
            )}
        </div>
      </main>
      </div>
    </>
  )
}

