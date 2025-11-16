import { useState } from 'react'
import { Clock, Users, UserPlus, CheckCircle, X as XIcon, BarChart3, Calendar, TrendingUp, Target, Sparkles, Bot, FileText, MessageSquare, AlertCircle } from 'lucide-react'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import Avatar from '../../components/Avatar'
import MessageModal from '../../components/MessageModal'
import { StatsCard, SessionHistory, ProgressChart, MaterialsList } from '../../components/mentorship-details'

export default function PMView({ 
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
  setIsGoalWizardOpen,
  customGoals,
  navigate,
  id,
  sessions
}) {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [messageRecipient, setMessageRecipient] = useState(null)
  const isPending = data?.status === 'pending' || data?.status === 'pending_mentor'

  return (
    <>
      {/* Status Banner */}
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

      {/* Mentorship Overview - Simplified for PM */}
      <Card padding="lg" className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-black">Mentorship Overview</h2>
              <p className="text-xs text-neutral-gray-dark">Quick mentorship summary</p>
            </div>
          </div>
          <Badge variant={statusInfo.color.includes('green') ? 'success' : statusInfo.color.includes('amber') ? 'warning' : 'blue'}>
            {formatStatus(data?.status)}
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Mentee */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[12px] border border-blue-200">
            <Avatar 
              src={data.menteeAvatar || data.mentee?.avatar} 
              initials={(data.menteeName || data.mentee?.name)?.substring(0, 2)?.toUpperCase()}
              size="md" 
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-neutral-gray-dark font-semibold">MENTEE</div>
              <div className="font-bold text-neutral-black text-sm truncate">{data.menteeName || data.mentee?.name}</div>
            </div>
          </div>

          {/* Mentor */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[12px] border border-orange-200">
            {data.mentorId || data.mentor ? (
              <>
                <Avatar 
                  src={data.mentorAvatar || data.mentor?.avatar} 
                  initials={(data.mentorName || data.mentor?.name)?.substring(0, 2)?.toUpperCase()}
                  size="md" 
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-neutral-gray-dark font-semibold">MENTOR</div>
                  <div className="font-bold text-neutral-black text-sm truncate">{data.mentorName || data.mentor?.name}</div>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-neutral-gray-dark font-semibold">MENTOR</div>
                  <div className="font-bold text-amber-700 text-sm">Pending Invites</div>
                </div>
              </>
            )}
          </div>

          {/* Duration */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-[12px] border border-purple-200">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-neutral-gray-dark font-semibold">DURATION</div>
              <div className="font-bold text-neutral-black text-sm">{weeksDuration || 0} weeks</div>
            </div>
          </div>
        </div>

        {/* Technologies */}
        {data.technologies && data.technologies.length > 0 && (
          <div className="mt-4 p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[12px] border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-baires-blue" />
              <span className="text-xs font-bold text-neutral-black">Technologies</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {data.technologies.slice(0, 6).map((tech, idx) => (
                <span key={idx} className="text-xs bg-white border border-blue-300 text-blue-700 px-2 py-1 rounded-full font-medium">
                  {typeof tech === 'string' ? tech : tech.name || tech}
                </span>
              ))}
              {data.technologies.length > 6 && (
                <span className="text-xs text-blue-600 px-2 py-1 font-semibold">
                  +{data.technologies.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Invited Mentors */}
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

      {/* Join Requests */}
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
                        &quot;{request.message}&quot;
                      </p>
                    )}
                    <p className="text-xs text-neutral-gray-dark">
                      Requested: {request.createdAt?.toDate?.().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleJoinRequestResponse(request.id, 'accept', request.mentorProfile)}
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
                    onClick={() => handleJoinRequestResponse(request.id, 'decline', request.mentorProfile)}
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
      {!isPending && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* AI Insights */}
            {data?.sessions && data.sessions.length > 0 && (
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
                </div>
              </Card>
            )}


            {/* Progress Goals - Customizable by PM */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-black">Mentorship Goals</h2>
                    <p className="text-sm text-neutral-gray-dark">Define and track custom progress metrics</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsGoalWizardOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-[12px] font-semibold hover:shadow-md transition-all flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  Manage Goals
                </button>
              </div>

              <div className={`grid grid-cols-2 ${(customGoals?.length || 4) > 4 ? 'md:grid-cols-4 lg:grid-cols-5' : 'md:grid-cols-4'} gap-4`}>
                {(customGoals || [
                  { id: 'sessions', name: 'Total Sessions', current: data?.sessionsCompleted || 0, target: 10, variant: 'blue' },
                  { id: 'progress', name: 'Overall Progress', current: data?.progress || 0, target: 100, variant: 'green', unit: '%' },
                  { id: 'duration', name: 'Duration', current: weeksDuration || 0, target: 12, variant: 'purple', unit: 'w' },
                  { id: 'rating', name: 'Avg Rating', current: parseFloat(averageProgress) || 0, target: 5, variant: 'orange', unit: '/5' }
                ]).map((goal) => {
                  // Update current values based on actual mentorship data
                  let currentValue = goal.current || 0
                  if (goal.id === 'sessions') currentValue = data?.sessionsCompleted || 0
                  else if (goal.id === 'progress') currentValue = data?.progress || 0
                  else if (goal.id === 'duration') currentValue = weeksDuration || 0
                  else if (goal.id === 'rating') currentValue = parseFloat(averageProgress) || 0
                  
                  const displayGoal = { ...goal, current: currentValue }
                  const variants = {
                    blue: { icon: BarChart3, color: 'blue' },
                    green: { icon: Target, color: 'green' },
                    purple: { icon: Clock, color: 'purple' },
                    orange: { icon: TrendingUp, color: 'orange' },
                    pink: { icon: Sparkles, color: 'pink' },
                    yellow: { icon: Calendar, color: 'yellow' }
                  }
                  const variantConfig = variants[displayGoal.variant] || variants.blue
                  
                  return (
                    <Card key={displayGoal.id} padding="md" className={`bg-gradient-to-br from-${variantConfig.color}-50 to-${variantConfig.color}-100/50 border-2 border-${variantConfig.color}-200`}>
                      <variantConfig.icon className={`w-8 h-8 text-${variantConfig.color}-600 mb-2`} />
                      <div className="text-xs font-bold uppercase text-neutral-gray-dark mb-1">{displayGoal.name}</div>
                      <div className="text-xl font-bold text-neutral-black">
                        {displayGoal.current}{displayGoal.unit || ''} / {displayGoal.target}{displayGoal.unit || ''}
                      </div>
                    </Card>
                  )
                })}
              </div>

              {!customGoals && (
                <div className="mt-4 p-3 bg-blue-50 rounded-[12px] border border-blue-200">
                  <p className="text-xs text-blue-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Click <strong>"Manage Goals"</strong> to customize these metrics for your mentorship</span>
                  </p>
                </div>
              )}
            </Card>

            <SessionHistory sessions={sessions} />

            {/* Learning Materials */}
            <MaterialsList materials={mockMaterials} description={`${mockMaterials.length} resources shared`} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 md:space-y-8">
        

            <Card padding="lg" className="bg-gradient-to-br from-baires-orange  to-orange-600 text-white border-none shadow-[0_20px_50px_rgb(246,97,53,0.3)]">
              <div className="relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-[18px] flex items-center justify-center mb-4 shadow-lg">
                    <Sparkles className="w-7 h-7 text-white animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    AI Summary
                  </h3>
                  <p className="text-sm  font-bold mb-4 opacity-90 leading-relaxed">
                    &quot;Sarah has shown exceptional growth, progressing from basic React concepts to building production-ready features. Her proactive learning approach and consistent practice have accelerated her development significantly.&quot;
                  </p>
                  <div className="flex items-center gap-2 text-xs opacity-90">
                    <Bot className="w-4 h-4" />
                    <span>Generated by Mentorship Copilot</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <h3 className="text-lg font-bold text-neutral-black mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setMessageRecipient({
                      name: data?.mentorName || 'Mentor',
                      avatar: data?.mentorAvatar,
                      role: 'Mentor'
                    })
                    setIsMessageModalOpen(true)
                  }}
                  disabled={!data?.mentorId}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-baires-blue to-blue-600 text-white rounded-[14px] font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Message Mentor</span>
                </button>
                <button 
                  onClick={() => alert('Session scheduling feature coming soon!\n\nYou will be able to:\n- Schedule review meetings\n- Check progress together\n- Set team objectives\n- Track milestones')}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-[14px] font-semibold hover:shadow-lg transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Review</span>
                </button>
                <button 
                  onClick={() => alert('Report export feature coming soon!\n\nYou will be able to:\n- Export mentorship progress\n- Generate PDF reports\n- Share with stakeholders\n- Track metrics over time')}
                  className="w-full flex items-center gap-3 p-3 bg-neutral-100 text-neutral-black rounded-[14px] font-semibold hover:bg-neutral-200 transition-all"
                >
                  <FileText className="w-5 h-5" />
                  <span>Export Report</span>
                </button>
              </div>
            </Card>
            
            <MessageModal 
              isOpen={isMessageModalOpen}
              onClose={() => {
                setIsMessageModalOpen(false)
                setMessageRecipient(null)
              }}
              recipient={messageRecipient}
            />
          </div>
        </div>
      )}
    </>
  )
}

