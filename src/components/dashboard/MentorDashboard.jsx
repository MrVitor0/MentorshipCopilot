import { Users, MessageSquare, Target, Star, TrendingUp, Lightbulb, Calendar, Search, Plus, Sparkles, BookOpen, PenSquare, Rocket, CheckCircle, X, Clock } from 'lucide-react'
import { useState } from 'react'
import { updateInvitationStatus, updateMeetingStatus } from '../../services/firestoreService'
import Card from '../Card'
import Button from '../Button'
import Avatar from '../Avatar'
import Badge from '../Badge'
import StatCard from '../StatCard'
import EmptyState from '../EmptyState'
import MentorshipResume from '../MentorshipResume'

const opportunities = [
  { title: 'AI-Powered Matching', description: 'Smart mentor suggestions ready.', status: 'New', icon: 'sparkles' },
  { title: 'Skill Development', description: 'New learning paths available.', status: 'Active', icon: 'trending-up' },
  { title: 'Team Growth', description: 'Join collaborative sessions.', status: 'Open', icon: 'users' },
]

const feedbackItems = [
  { team: 'Mentorship Team', feedback: 'AI-Generated insights from latest sessions', icon: 'message-square' },
]

const getIconComponent = (iconName) => {
  const icons = { 'sparkles': Sparkles, 'trending-up': TrendingUp, 'users': Users, 'message-square': MessageSquare }
  return icons[iconName] || Sparkles
}

export default function MentorDashboard({ user, suggestions, upcomingSessions, mentorships, loading, invitations = [] }) {
  const [processingInvitation, setProcessingInvitation] = useState(null)
  const [processingMeeting, setProcessingMeeting] = useState(null)

  const handleInvitationResponse = async (invitationId, action) => {
    setProcessingInvitation(invitationId)
    try {
      console.log(`🔄 Processing invitation ${invitationId}, action: ${action}`)
      
      // Pass user data when accepting to assign mentor properly
      await updateInvitationStatus(
        invitationId, 
        action === 'accept' ? 'accepted' : 'declined',
        action === 'accept' ? user : null
      )
      
      console.log(`✅ Invitation ${action === 'accept' ? 'accepted' : 'declined'} successfully`)
      
      if (action === 'accept') {
        // Show success message
        alert('🎉 Mentorship accepted! You are now the mentor for this mentorship. Redirecting...')
      }
      
      // Refresh data to show the new mentorship in "My Active Mentorships"
      window.location.reload()
    } catch (error) {
      console.error('❌ Error handling invitation:', error)
      alert(`Error processing invitation: ${error.message}\n\nPlease try again.`)
    } finally {
      setProcessingInvitation(null)
    }
  }

  const handleMeetingResponse = async (meetingId, action) => {
    setProcessingMeeting(meetingId)
    try {
      if (action === 'accept') {
        await updateMeetingStatus(meetingId, 'confirmed')
      } else if (action === 'reschedule') {
        // In a real app, open a modal to reschedule
        alert('Reschedule functionality coming soon!')
        return
      }
      window.location.reload()
    } catch (error) {
      console.error('Error handling meeting:', error)
      alert('Error processing meeting. Please try again.')
    } finally {
      setProcessingMeeting(null)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <div className="lg:col-span-2 space-y-6 md:space-y-8">
        {/* Insights Card */}
        <Card gradient padding="xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <Avatar 
                src={user?.photoURL}
                initials={user?.displayName?.substring(0, 2)?.toUpperCase() || 'U'}
                size="2xl" 
                ring 
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-4 border-white shadow-lg"></div>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-neutral-black to-baires-orange bg-clip-text text-transparent mb-1">
                Your Insights
              </h2>
              <p className="text-neutral-gray-dark flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-baires-orange" />
                AI-powered analytics
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            <StatCard value={mentorships.length.toString()} label="Active Mentorships" IconComponent={Users} color="blue" />
            <StatCard value={upcomingSessions.length.toString()} label="Upcoming Sessions" IconComponent={Calendar} color="purple" />
            <StatCard value={suggestions.length.toString()} label="Suggestions" IconComponent={Sparkles} color="orange" />
            <StatCard value={user?.technologies?.length?.toString() || "0"} label="Technologies" IconComponent={Target} color="yellow" />
          </div>
        </Card>

        {/* What's Next Card */}
        <Card padding="none" className="overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 border-2 border-orange-200/50">
          <div className="relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-baires-orange/10 to-blue-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-baires-orange-light/20 to-orange-300/10 rounded-full blur-2xl"></div>
            
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[16px] flex items-center justify-center shadow-lg">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-black flex items-center gap-2">
                        What's next today?
                        <Sparkles className="w-5 h-5 text-baires-orange animate-pulse" />
                      </h2>
                      <p className="text-sm text-neutral-gray-dark mt-1">Let's make an impact together</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => window.location.href = '/mentorship'}
                  className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50 p-6 rounded-[20px] border-2 border-blue-200/50 hover:border-blue-400/70 hover:shadow-[0_20px_40px_rgb(26,115,232,0.15)] transition-all duration-300 hover:-translate-y-1 text-left"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-baires-blue/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[12px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-neutral-black group-hover:text-baires-blue transition-colors">My Mentorships</h3>
                    </div>
                    <p className="text-sm text-neutral-gray-dark">View and manage your active mentorship sessions</p>
                  </div>
                </button>

                <button 
                  onClick={() => window.location.href = '/create-mentorship'}
                  className="group relative overflow-hidden bg-gradient-to-br from-white to-orange-50 p-6 rounded-[20px] border-2 border-orange-200/50 hover:border-orange-400/70 hover:shadow-[0_20px_40px_rgb(246,97,53,0.15)] transition-all duration-300 hover:-translate-y-1 text-left"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-baires-orange/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[12px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                        <PenSquare className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-neutral-black group-hover:text-baires-orange transition-colors">Log Session</h3>
                    </div>
                    <p className="text-sm text-neutral-gray-dark">Record a new mentorship session and track progress</p>
                  </div>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-200/50 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-neutral-gray-dark">
                      <span className="text-neutral-black font-bold">{mentorships.length}</span> active today
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-baires-orange" />
                    <span className="text-sm font-medium text-neutral-gray-dark">
                      <span className="text-neutral-black font-bold">{upcomingSessions.length}</span> upcoming this week
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-baires-orange">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold">AI-Powered</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Mentorships Resume */}
        {mentorships.length > 0 && (
          <MentorshipResume 
            mentorships={mentorships}
            title="My Active Mentorships"
            emptyMessage="No active mentorships yet"
            userRole="mentor"
          />
        )}

        {/* Magic Suggestions - Mentorship Invitations */}
        <Card gradient hover padding="lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[14px] flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-black">Magic Suggestions</h2>
                <p className="text-sm text-neutral-gray-dark">Mentorship invitations & recommendations</p>
              </div>
              {invitations.length > 0 && (
                <Badge variant="orange">{invitations.length} New</Badge>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-baires-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : invitations.length > 0 ? (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[20px] border-2 border-orange-200/70 shadow-lg">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[14px] flex items-center justify-center shadow-md flex-shrink-0">
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
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleInvitationResponse(invitation.id, 'accept')}
                      disabled={processingInvitation === invitation.id}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-[14px] font-bold hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
                      className="flex-1 bg-neutral-200 text-neutral-black px-4 py-3 rounded-[14px] font-bold hover:bg-neutral-300 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
              
              {/* AI Suggestions below invitations */}
              {suggestions.length > 0 && (
                <div className="pt-4 border-t border-neutral-200">
                  <h3 className="text-sm font-bold text-neutral-gray-dark mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-baires-orange" />
                    Recommended for You
                  </h3>
                  <div className="space-y-3">
                    {suggestions.slice(0, 2).map((suggestion) => (
                      <div key={suggestion.uid} className="p-4 bg-gradient-to-br from-white to-blue-50/50 rounded-[16px] border border-blue-100/50 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          <Avatar src={suggestion.photoURL} initials={suggestion.displayName?.substring(0, 2)?.toUpperCase()} size="md" />
                          <div className="flex-1">
                            <h4 className="font-bold text-neutral-black text-sm mb-1">{suggestion.displayName}</h4>
                            <p className="text-xs text-neutral-gray-dark line-clamp-1">{suggestion.bio}</p>
                          </div>
                          <button className="px-3 py-2 bg-baires-blue text-white rounded-[10px] text-xs font-bold hover:shadow-md transition-all">
                            Request
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <div key={suggestion.uid} className="p-4 bg-gradient-to-br from-white to-orange-50/50 rounded-[20px] border border-orange-100/50 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Avatar src={suggestion.photoURL} initials={suggestion.displayName?.substring(0, 2)?.toUpperCase()} size="lg" ring />
                    <div className="flex-1">
                      <h3 className="font-bold text-neutral-black mb-1">{suggestion.displayName}</h3>
                      <p className="text-sm text-neutral-gray-dark mb-2 line-clamp-1">{suggestion.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestion.technologies?.slice(0, 3).map((tech) => (
                          <Badge key={tech.name} variant="blue" className="text-xs">{tech.name}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={Users} 
              title="No invitations yet" 
              description="Mentorship invitations will appear here" 
            />
          )}
        </Card>

        {/* Smart Insights */}
        <Card gradient hover padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[16px] flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-black">Smart Insights</h3>
              <p className="text-xs text-neutral-gray-dark flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-baires-orange" />
                Powered by AI
              </p>
            </div>
          </div>
          
          {feedbackItems.map((item, index) => {
            const IconComponent = getIconComponent(item.icon)
            return (
              <div key={index} className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[20px] border border-blue-100/50 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[12px] flex items-center justify-center shadow-md flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-neutral-black mb-2">{item.team}</p>
                    <p className="text-sm text-neutral-gray-dark">{item.feedback}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </Card>
      </div>

      <div className="space-y-6 md:space-y-8">
        {/* Need Assistance Card */}
        <Card hover padding="lg" className="bg-gradient-to-br from-baires-orange via-orange-600 to-orange-700 text-white border-none shadow-[0_20px_50px_rgb(246,97,53,0.3)]">
          <div className="relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="relative">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-[18px] flex items-center justify-center mb-4 shadow-lg">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                Need Assistance?
                <Sparkles className="w-5 h-5" />
              </h3>
              <p className="text-sm mb-6 opacity-90 leading-relaxed">Get AI-powered help and smart recommendations instantly.</p>
              
              <button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-[16px] transition-all duration-300 border border-white/30 hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Contact Support
              </button>
            </div>
          </div>
        </Card>

        {/* AI Opportunities */}
        <Card gradient hover padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-baires-orange" />
            <h3 className="text-xl font-bold text-neutral-black">AI Opportunities</h3>
          </div>
          <div className="space-y-4">
            {opportunities.map((opp, index) => {
              const IconComponent = getIconComponent(opp.icon)
              return (
                <div key={index} className="group p-5 bg-gradient-to-br from-white to-orange-50/50 rounded-[20px] border border-orange-100/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-baires-orange-light to-baires-orange rounded-[14px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-neutral-black">{opp.title}</h4>
                        <Badge variant="warning" className="text-xs">{opp.status}</Badge>
                      </div>
                      <p className="text-sm text-neutral-gray-dark leading-relaxed">{opp.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Upcoming Sessions */}
        <Card gradient hover padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-baires-blue" />
            <h3 className="text-xl font-bold text-neutral-black">Upcoming Sessions</h3>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-baires-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : upcomingSessions.length > 0 ? (
            <div className="space-y-4">
              {upcomingSessions.map((session) => {
                const isPending = session.status === 'pending_acceptance'
                const isKickoff = session.type === 'kickoff'
                
                return (
                  <div key={session.id} className="group p-4 bg-gradient-to-br from-white to-blue-50/50 rounded-[20px] border border-blue-100/50 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="relative">
                        <Avatar 
                          src={session.participantPhoto} 
                          initials={session.participantName?.substring(0, 2)?.toUpperCase()} 
                          size="lg" 
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-neutral-black mb-1">
                          {isKickoff ? 'Kickoff: ' : ''}{session.participantName}
                        </p>
                        <p className="text-xs text-neutral-gray-dark mb-2">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {session.scheduledDate?.toDate?.().toLocaleString()}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {isPending ? (
                            <Badge variant="warning" className="text-xs">Pending Response</Badge>
                          ) : (
                            <Badge variant="success" className="text-xs">Confirmed</Badge>
                          )}
                          {isKickoff && (
                            <Badge variant="blue" className="text-xs">Kickoff</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {isPending && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-neutral-200">
                        <button
                          onClick={() => handleMeetingResponse(session.id, 'accept')}
                          disabled={processingMeeting === session.id}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-[12px] font-bold text-sm hover:shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                          {processingMeeting === session.id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Accept
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleMeetingResponse(session.id, 'reschedule')}
                          disabled={processingMeeting === session.id}
                          className="flex-1 bg-baires-blue text-white px-4 py-2 rounded-[12px] font-bold text-sm hover:shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          Reschedule
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState icon={Calendar} title="No scheduled sessions" description="You don't have any scheduled sessions at the moment" action={
              <Button variant="orange" size="sm" onClick={() => window.location.href = '/create-mentorship'}>Schedule Session</Button>
            } />
          )}
        </Card>
      </div>
    </div>
  )
}

