import { Users, MessageSquare, Target, Calendar, TrendingUp, Sparkles, FolderKanban, BarChart3, CheckCircle, Clock, AlertTriangle, Briefcase, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../Card'
import Button from '../Button'
import Avatar from '../Avatar'
import Badge from '../Badge'
import StatCard from '../StatCard'
import EmptyState from '../EmptyState'

const opportunities = [
  { title: 'Team Performance', description: 'Review team progress this week.', status: 'Action', icon: 'trending-up' },
  { title: 'Resource Allocation', description: 'Optimize mentor assignments.', status: 'Review', icon: 'users' },
  { title: 'Goal Tracking', description: 'Update quarterly objectives.', status: 'Pending', icon: 'target' },
]

const getIconComponent = (iconName) => {
  const icons = { 'trending-up': TrendingUp, 'users': Users, 'target': Target, 'sparkles': Sparkles }
  return icons[iconName] || Sparkles
}

export default function PMDashboard({ user, upcomingSessions, mentorships, loading }) {
  const navigate = useNavigate()
  
  // Calculate PM-specific metrics
  const activeProjects = mentorships.length
  const completedSessions = Math.floor(activeProjects * 0.7) // Mock data
  const pendingReviews = Math.floor(activeProjects * 0.3) // Mock data
  const teamGrowth = activeProjects > 0 ? '+12%' : '0%'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <div className="lg:col-span-2 space-y-6 md:space-y-8">
        {/* PM Insights Card */}
        <Card gradient padding="xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <Avatar 
                src={user?.photoURL}
                initials={user?.displayName?.substring(0, 2)?.toUpperCase() || 'PM'}
                size="2xl" 
                ring 
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <Briefcase className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-neutral-black to-baires-blue bg-clip-text text-transparent mb-1">
                Management Overview
              </h2>
              <p className="text-neutral-gray-dark flex items-center gap-1">
                <BarChart3 className="w-3 h-3 text-baires-blue" />
                Project insights & analytics
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            <StatCard value={activeProjects.toString()} label="Active Projects" trend={teamGrowth} IconComponent={FolderKanban} color="blue" />
            <StatCard value={completedSessions.toString()} label="Completed Sessions" IconComponent={CheckCircle} color="green" />
            <StatCard value={pendingReviews.toString()} label="Pending Reviews" IconComponent={Clock} color="orange" />
            <StatCard value={upcomingSessions.length.toString()} label="Upcoming Sessions" IconComponent={Calendar} color="purple" />
          </div>
        </Card>

        {/* Project Management CTA */}
        <Card padding="none" className="overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-200/50">
          <div className="relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-baires-blue/10 to-purple-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-300/20 to-purple-300/10 rounded-full blur-2xl"></div>
            
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[16px] flex items-center justify-center shadow-lg">
                      <FolderKanban className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-black flex items-center gap-2">
                        Project Management
                        <Sparkles className="w-5 h-5 text-baires-blue animate-pulse" />
                      </h2>
                      <p className="text-sm text-neutral-gray-dark mt-1">Manage all your mentorship projects</p>
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
                        <FolderKanban className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-neutral-black group-hover:text-baires-blue transition-colors">My Projects</h3>
                    </div>
                    <p className="text-sm text-neutral-gray-dark">View and manage all mentorship projects</p>
                  </div>
                </button>

                <button 
                  onClick={() => window.location.href = '/create-mentorship'}
                  className="group relative overflow-hidden bg-gradient-to-br from-white to-purple-50 p-6 rounded-[20px] border-2 border-purple-200/50 hover:border-purple-400/70 hover:shadow-[0_20px_40px_rgb(168,85,247,0.15)] transition-all duration-300 hover:-translate-y-1 text-left"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[12px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-neutral-black group-hover:text-purple-600 transition-colors">Analytics</h3>
                    </div>
                    <p className="text-sm text-neutral-gray-dark">View performance metrics and reports</p>
                  </div>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-200/50 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-neutral-gray-dark">
                      <span className="text-neutral-black font-bold">{completedSessions}</span> completed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-neutral-gray-dark">
                      <span className="text-neutral-black font-bold">{pendingReviews}</span> need review
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-baires-blue">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold">{teamGrowth} Growth</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Project Progress Overview */}
        <Card gradient hover padding="lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-[16px] flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-black">Project Progress</h3>
                <p className="text-xs text-neutral-gray-dark">Your mentorship projects</p>
              </div>
            </div>
            {mentorships.length > 3 && (
              <button 
                onClick={() => navigate('/mentorship')}
                className="text-sm font-semibold text-baires-orange hover:text-orange-700 flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {mentorships.length > 0 ? (
            <div className="space-y-4">
              {mentorships.slice(0, 3).map((mentorship) => {
                // Helper function to format status
                const formatStatus = (status) => {
                  if (!status) return 'Unknown'
                  return status
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ')
                }
                
                const statusColors = {
                  'active': 'success',
                  'pending': 'warning',
                  'pending_mentor': 'warning',
                  'pending_kickoff': 'blue',
                  'completed': 'gray'
                }
                
                const getStatusColor = (status) => {
                  return statusColors[status] || 'gray'
                }
                
                return (
                  <div
                    key={mentorship.id}
                    className="w-full p-5 bg-gradient-to-br from-white to-green-50/50 rounded-[20px] border border-green-100/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar 
                          src={mentorship.menteeAvatar} 
                          initials={mentorship.menteeName?.substring(0, 2)?.toUpperCase()}
                          size="md"
                          ring
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-neutral-black mb-1">{mentorship.menteeName}</h4>
                          <p className="text-xs text-neutral-gray-dark mb-2">
                            Mentor: {mentorship.mentorName || 'Not assigned yet'}
                          </p>
                          {/* Technologies */}
                          {mentorship.technologies && mentorship.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {mentorship.technologies.slice(0, 3).map((tech, idx) => (
                                <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
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
                      <Badge variant={getStatusColor(mentorship.status)} className="text-xs flex-shrink-0">
                        {formatStatus(mentorship.status)}
                      </Badge>
                    </div>
                    
                    {/* Challenge Description Summary */}
                    {mentorship.challengeDescription && (
                      <div className="mb-3 p-3 bg-orange-50/50 rounded-[12px] border border-orange-100/50">
                        <p className="text-xs text-neutral-gray-dark line-clamp-2 leading-relaxed">
                          {mentorship.challengeDescription}
                        </p>
                      </div>
                    )}
                    
                    {/* Invited Mentors Count for Pending Status */}
                    {mentorship.status === 'pending' && mentorship.invitedMentorIds && (
                      <div className="mb-3 flex items-center gap-2 text-xs">
                        <Users className="w-4 h-4 text-baires-orange" />
                        <span className="text-neutral-gray-dark">
                          <span className="font-bold text-neutral-black">{mentorship.invitedMentorIds.length}</span> mentor{mentorship.invitedMentorIds.length !== 1 ? 's' : ''} invited
                        </span>
                      </div>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-gray-dark font-medium">Progress</span>
                        <span className="font-bold text-neutral-black">{mentorship.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-300" 
                          style={{ width: `${mentorship.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* View Details Button */}
                    <button
                      onClick={() => navigate(`/mentorship/${mentorship.id}`)}
                      className="w-full bg-gradient-to-r from-baires-orange to-orange-600 text-white px-4 py-2.5 rounded-[14px] font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState 
              icon={FolderKanban}
              title="No projects yet"
              description="Start managing mentorship projects"
              action={
                <Button variant="orange" size="sm" onClick={() => navigate('/create-mentorship')}>
                  Create Project
                </Button>
              }
            />
          )}
        </Card>
      </div>

      <div className="space-y-6 md:space-y-8">
        {/* Action Items */}
        <Card hover padding="lg" className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white border-none shadow-[0_20px_50px_rgb(168,85,247,0.3)]">
          <div className="relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="relative">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-[18px] flex items-center justify-center mb-4 shadow-lg">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                Action Required
                <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">{pendingReviews}</span>
              </h3>
              <p className="text-sm mb-6 opacity-90 leading-relaxed">You have pending reviews and tasks that need attention.</p>
              
              <button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-[16px] transition-all duration-300 border border-white/30 hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Review Now
              </button>
            </div>
          </div>
        </Card>

        {/* Action Opportunities */}
        <Card gradient hover padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-baires-blue" />
            <h3 className="text-xl font-bold text-neutral-black">Action Items</h3>
          </div>
          <div className="space-y-4">
            {opportunities.map((opp, index) => {
              const IconComponent = getIconComponent(opp.icon)
              return (
                <div key={index} className="group p-5 bg-gradient-to-br from-white to-blue-50/50 rounded-[20px] border border-blue-100/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
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
            <Calendar className="w-5 h-5 text-baires-orange" />
            <h3 className="text-xl font-bold text-neutral-black">Upcoming Sessions</h3>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-baires-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : upcomingSessions.length > 0 ? (
            <div className="space-y-4">
              {upcomingSessions.map((session) => {
                const isKickoff = session.type === 'kickoff'
                const isPending = session.status === 'pending_acceptance'
                
                return (
                  <div key={session.id} className="group flex items-center gap-4 p-4 bg-gradient-to-br from-white to-orange-50/50 rounded-[20px] border border-orange-100/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
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
                        {isKickoff ? 'Kickoff Meeting: ' : ''}{session.participantName}
                      </p>
                      <p className="text-xs text-neutral-gray-dark mb-2">
                        {session.scheduledDate?.toDate?.().toLocaleString()}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {isPending && (
                          <Badge variant="warning" className="text-xs">Pending Acceptance</Badge>
                        )}
                        {!isPending && (
                          <Badge variant="success" className="text-xs">Confirmed</Badge>
                        )}
                        {isKickoff && (
                          <Badge variant="blue" className="text-xs">Kickoff</Badge>
                        )}
                      </div>
                    </div>
                    {isPending && (
                      <button 
                        className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-[12px] transition-colors"
                        onClick={() => {
                          if (confirm('Cancel this meeting?')) {
                            // TODO: Implement cancel meeting
                            console.log('Cancel meeting:', session.id)
                          }
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState 
              icon={Calendar}
              title="No scheduled sessions"
              description="No upcoming sessions at the moment"
              action={
                <Button variant="orange" size="sm" onClick={() => window.location.href = '/mentorship'}>
                  View Projects
                </Button>
              }
            />
          )}
        </Card>
      </div>
    </div>
  )
}

