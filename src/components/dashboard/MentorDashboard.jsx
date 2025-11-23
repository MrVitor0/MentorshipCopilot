import { Users, MessageSquare, Target, TrendingUp, Calendar, Sparkles, BookOpen, PenSquare, CheckCircle, X, Brain, BarChart3, Zap, ArrowRight, FolderKanban } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateInvitationStatus, updateMeetingStatus } from '../../services/firestoreService'
import { useConfirm } from '../../hooks/useConfirm'
import Card from '../Card'
import Button from '../Button'
import Avatar from '../Avatar'
import Badge from '../Badge'
import MentorshipResume from '../MentorshipResume'
import FeatureCard from './FeatureCard'
import ActionItemsCard from './ActionItemsCard'
import UpcomingSessionsCard from './UpcomingSessionsCard'
import LoadingDashboard from './LoadingDashboard'
import WelcomeHeroSection from './WelcomeHeroSection'
import QuickActionsSection from './QuickActionsSection'

const opportunities = [
  { title: 'AI-Powered Matching', description: 'Smart mentor suggestions ready.', status: 'New', icon: 'sparkles' },
  { title: 'Skill Development', description: 'New learning paths available.', status: 'Active', icon: 'trending-up' },
  { title: 'Team Growth', description: 'Join collaborative sessions.', status: 'Open', icon: 'users' },
]

const iconMap = {
  'sparkles': Sparkles,
  'trending-up': TrendingUp,
  'users': Users,
  'message-square': MessageSquare
}

export default function MentorDashboard({ user, upcomingSessions, mentorships, loading, invitations = [] }) {
  const [processingInvitation, setProcessingInvitation] = useState(null)
  const confirm = useConfirm()
  const navigate = useNavigate()

  // Loading State
  if (loading) {
    return <LoadingDashboard />
  }

  const handleInvitationResponse = async (invitationId, action) => {
    setProcessingInvitation(invitationId)
    try {
      console.log(`🔄 Processing invitation ${invitationId}, action: ${action}`)
      
      // Get the mentorship ID from the invitation before updating
      const invitation = invitations.find(inv => inv.id === invitationId)
      const mentorshipId = invitation?.mentorshipId
      
      await updateInvitationStatus(
        invitationId, 
        action === 'accept' ? 'accepted' : 'declined',
        action === 'accept' ? user : null
      )
      
      console.log(`✅ Invitation ${action === 'accept' ? 'accepted' : 'declined'} successfully`)
      
      if (action === 'accept') {
        await confirm.success(
          'You are now the mentor for this mentorship. Redirecting...',
          'Mentorship Accepted'
        )
        
        // Navigate directly to the mentorship details page
        if (mentorshipId) {
          navigate(`/mentorship/${mentorshipId}`)
        } else {
          window.location.reload()
        }
      } else {
        // Refresh data for declined invitations
        window.location.reload()
      }
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

  const handleMeetingResponse = async (meetingId, action) => {
    try {
      if (action === 'accept') {
        await updateMeetingStatus(meetingId, 'confirmed')
        window.location.reload()
      } else if (action === 'reschedule') {
        await confirm.info(
          'Reschedule functionality coming soon!',
          'Coming Soon'
        )
      }
    } catch (error) {
      console.error('Error handling meeting:', error)
      await confirm.error(
        'Error processing meeting. Please try again.',
        'Error'
      )
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <WelcomeHeroSection 
          title={`Welcome ${user?.displayName || ''}!`}
          subtitle="Share your expertise and guide team members to success. Track your mentorship impact and grow together."
          primaryAction={{
            icon: BookOpen,
            label: mentorships.length > 0 ? "My Mentorships" : "View Available Opportunities",
            path: "/mentorship",
            endIcon: ArrowRight
          }}
          secondaryAction={{
            icon: PenSquare,
            label: "Log Session",
            path: "/create-mentorship"
          }}
          features={[
            { icon: Brain, title: "AI Matching", description: "Smart recommendations" },
            { icon: BarChart3, title: "Track Impact", description: "Monitor progress" },
            { icon: Zap, title: "Quick Logging", description: "Fast session entry" }
          ]}
        />
        
        <QuickActionsSection 
          title="Quick Actions"
          description="Everything you need to manage your mentorships effectively"
          actions={[
            {
              icon: BookOpen,
              title: "My Mentorships",
              description: `${mentorships.length} active sessions`,
              path: "/mentorship"
            },
            {
              icon: PenSquare,
              title: "Log Session",
              description: "Record progress & insights",
              path: "/create-mentorship"
            },
            {
              icon: FolderKanban,
              title: "Browse Opportunities",
              description: invitations.length > 0 ? `${invitations.length} new invitations` : "Explore mentees",
              path: "/mentors"
            }
          ]}
        />
      </div>

      {/* Active Mentorships Resume */}
      {mentorships.length > 0 && (
        <MentorshipResume 
          mentorships={mentorships}
          title="Active Mentorships Overview"
          emptyMessage="No active mentorships yet"
          userRole="mentor"
        />
      )}

      {/* Mentorship Invitations - Priority Section */}
      {invitations.length > 0 && (
        <Card gradient padding="xl" className="border-2 border-orange-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[18px] flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-black flex items-center gap-2">
                  New Mentorship Invitations
                  <Badge variant="orange" className="text-base">{invitations.length}</Badge>
                </h2>
                <p className="text-neutral-gray-dark mt-1">Review and accept mentorship opportunities</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-5">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="p-6 bg-gradient-to-br from-white to-orange-50 rounded-[24px] border-2 border-orange-200 hover:border-orange-300 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-md flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-neutral-black">Mentorship Invitation</h3>
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
                    
                    <p className="text-sm text-neutral-gray-dark mb-2">
                      {invitation.message || 'You have been invited to mentor a team member'}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-neutral-gray-dark">
                      <span>From: {invitation.projectManagerName || 'PM'}</span>
                      <span>•</span>
                      <span>{invitation.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleInvitationResponse(invitation.id, 'accept')}
                    disabled={processingInvitation === invitation.id}
                    className="flex-1 bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 text-white px-6 py-4 rounded-[16px] font-bold hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-base"
                  >
                    {processingInvitation === invitation.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Accept & Start Mentoring
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleInvitationResponse(invitation.id, 'decline')}
                    disabled={processingInvitation === invitation.id}
                    className="px-6 py-4 bg-white border-2 border-neutral-200 text-neutral-700 rounded-[16px] font-bold hover:bg-neutral-50 hover:border-neutral-300 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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

      {/* Platform Features */}
      <Card gradient padding="xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-black mb-2">Platform Features</h2>
          <p className="text-neutral-gray-dark">Tools to enhance your mentorship experience</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={Brain}
            title="AI Matching"
            description="Get intelligent mentor-mentee pairing based on skills and needs"
            bgGradient="bg-gradient-to-br from-blue-50 to-white"
            borderColor="border-blue-100"
            iconGradient="bg-gradient-to-br from-baires-blue to-blue-600"
          />
          <FeatureCard 
            icon={BarChart3}
            title="Progress Tracking"
            description="Monitor mentorship outcomes and team member development"
            bgGradient="bg-gradient-to-br from-purple-50 to-white"
            borderColor="border-purple-100"
            iconGradient="bg-gradient-to-br from-baires-indigo to-indigo-600"
          />
          <FeatureCard 
            icon={Zap}
            title="Quick Actions"
            description="Fast session logging and goal management at your fingertips"
            bgGradient="bg-gradient-to-br from-orange-50 to-white"
            borderColor="border-orange-100"
            iconGradient="bg-gradient-to-br from-baires-blue to-blue-600"
          />
        </div>
      </Card>

      {/* Bottom Grid: Action Items + Upcoming Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActionItemsCard 
          opportunities={opportunities}
          iconMap={iconMap}
        />

        <UpcomingSessionsCard 
          upcomingSessions={upcomingSessions}
          loading={false}
          onCancelSession={(sessionId) => handleMeetingResponse(sessionId, 'reschedule')}
          emptyStateAction={
            <Button variant="orange" size="sm" onClick={() => window.location.href = '/create-mentorship'}>
              Schedule Session
            </Button>
          }
        />
      </div>
    </div>
  )
}
