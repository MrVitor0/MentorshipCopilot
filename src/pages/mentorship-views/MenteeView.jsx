import { useState } from 'react'
import { Calendar, Clock, TrendingUp, Target, Users, BarChart3, Sparkles, MessageSquare, FileText, CheckCircle, Bot, Lightbulb, BookOpen, Download, Video, Star, Award } from 'lucide-react'
import { useConfirm } from '../../hooks/useConfirm'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Avatar from '../../components/Avatar'
import Button from '../../components/Button'
import MessageModal from '../../components/MessageModal'
import { StatsCard, MaterialsList, SessionHistory } from '../../components/mentorship-details'

const DEFAULT_GOALS = [
  { id: 'sessions', name: 'Total Sessions', description: 'Number of sessions completed', current: 0, target: 10, variant: 'blue' },
  { id: 'progress', name: 'Overall Progress', description: 'Overall completion percentage', current: 0, target: 100, variant: 'green', unit: '%' },
  { id: 'duration', name: 'Duration', description: 'Weeks since mentorship started', current: 0, target: 12, variant: 'purple', unit: 'w' },
  { id: 'rating', name: 'Your Performance', description: 'Average session rating', current: 0, target: 5, variant: 'orange', unit: '/5' }
]

export default function MenteeView({ 
  data, 
  statusInfo, 
  formatStatus, 
  averageProgress, 
  weeksDuration,
  mockMaterials,
  customGoals,
  sessions,
  navigate
}) {
  const confirm = useConfirm()
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  
  const displayGoals = customGoals || DEFAULT_GOALS.map(goal => {
    if (goal.id === 'sessions') return { ...goal, current: data?.sessionsCompleted || 0 }
    if (goal.id === 'progress') return { ...goal, current: data?.progress || 0 }
    if (goal.id === 'duration') return { ...goal, current: weeksDuration || 0 }
    if (goal.id === 'rating') return { ...goal, current: parseFloat(averageProgress) || 0 }
    return goal
  })

  return (
    <>
      {/* Mentorship Overview */}
      <Card padding="lg" className="mb-8 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 border-2 border-purple-200/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[14px] flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-black">Your Learning Journey</h2>
          </div>
          <Badge variant={statusInfo.color.includes('green') ? 'success' : statusInfo.color.includes('amber') ? 'warning' : 'blue'} className="text-sm">
            {formatStatus(data?.status)}
          </Badge>
        </div>

        <div className="flex items-center gap-4 p-5 bg-white rounded-[16px] border border-purple-200/50 mb-6">
          <Avatar 
            src={data?.mentorAvatar} 
            initials={data?.mentorName?.substring(0, 2)?.toUpperCase()}
            size="xl"
            ring
          />
          <div className="flex-1">
            <div className="text-xs text-neutral-gray-dark font-semibold mb-1">YOUR MENTOR</div>
            <div className="text-xl font-bold text-neutral-black mb-1">
              {data?.mentorName || 'Mentor not assigned yet'}
            </div>
            {data?.technologies && data.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.technologies.slice(0, 4).map((tech, idx) => (
                  <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                    {typeof tech === 'string' ? tech : tech.name || tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {data?.challengeDescription && (
          <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-[16px] border border-purple-200/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[12px] flex items-center justify-center shadow-md flex-shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-purple-600 font-bold mb-2 uppercase tracking-wide">Your Learning Goals</div>
                <p className="text-neutral-black leading-relaxed">{data.challengeDescription}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Progress Overview */}
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[14px] flex items-center justify-center shadow-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-black">Your Progress</h2>
                <p className="text-sm text-neutral-gray-dark">Track your learning journey</p>
              </div>
            </div>

            <div className={`grid grid-cols-2 ${displayGoals.length > 4 ? 'md:grid-cols-4 lg:grid-cols-5' : 'md:grid-cols-4'} gap-4 mb-6`}>
              {displayGoals.map((goal) => {
                const variants = {
                  blue: { icon: BarChart3, color: 'blue' },
                  green: { icon: Target, color: 'green' },
                  purple: { icon: Clock, color: 'purple' },
                  orange: { icon: TrendingUp, color: 'orange' },
                  pink: { icon: Sparkles, color: 'pink' },
                  yellow: { icon: Calendar, color: 'yellow' }
                }
                const variantConfig = variants[goal.variant] || variants.blue
                
                return (
                  <Card key={goal.id} padding="md" className={`bg-gradient-to-br from-${variantConfig.color}-50 to-${variantConfig.color}-100/50 border-2 border-${variantConfig.color}-200`}>
                    <variantConfig.icon className={`w-8 h-8 text-${variantConfig.color}-600 mb-2`} />
                    <div className="text-xs font-bold uppercase text-neutral-gray-dark mb-1">{goal.name}</div>
                    <div className="text-xl font-bold text-neutral-black">
                      {goal.current}{goal.unit} / {goal.target}{goal.unit}
                    </div>
                  </Card>
                )
              })}
            </div>
          </Card>

          {/* Session History */}
          <SessionHistory sessions={sessions} title="Your Session History" showEdit={false} />

          {/* Learning Materials */}
          <MaterialsList materials={mockMaterials} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6 md:space-y-8">
          {/* Next Session Highlight */}
          {sessions.length > 0 && (
            <Card hover padding="lg" className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white border-none shadow-[0_20px_50px_rgb(168,85,247,0.3)]">
              <div className="relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                
                <div className="relative">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-[18px] flex items-center justify-center mb-4 shadow-lg">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Next Session</h3>
                  <p className="text-sm mb-4 opacity-90">Upcoming mentorship session</p>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-[16px] p-4 mb-4">
                    <p className="font-bold text-lg mb-1">With {data?.mentorName || 'Your Mentor'}</p>
                    <p className="text-sm opacity-90">Schedule coming soon</p>
                  </div>
                  
                  <button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-[16px] transition-all duration-300 border border-white/30 hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                    <Video className="w-4 h-4" />
                    Join Session
                  </button>
                </div>
              </div>
            </Card>
          )}

          <Card padding="lg" className="bg-gradient-to-br from-purple-50 via-white to-blue-50 border-2 border-purple-200/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[14px] flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-black flex items-center gap-2">
                  Learning Resources
                  <Badge variant="purple" className="text-xs">New</Badge>
                </h3>
                <p className="text-xs text-neutral-gray-dark">Curated for you</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-white rounded-[12px] border-2 border-neutral-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all group">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-neutral-black">Course Materials</span>
                </div>
              </button>
              
              <button className="w-full text-left p-3 bg-white rounded-[12px] border-2 border-neutral-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-baires-blue" />
                  <span className="text-sm font-bold text-neutral-black">Study Guides</span>
                </div>
              </button>

              <button className="w-full text-left p-3 bg-white rounded-[12px] border-2 border-neutral-200 hover:border-orange-400 hover:bg-orange-50/50 transition-all group">
                <div className="flex items-center gap-3">
                  <Video className="w-4 h-4 text-baires-blue" />
                  <span className="text-sm font-bold text-neutral-black">Video Tutorials</span>
                </div>
              </button>
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="text-lg font-bold text-neutral-black mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setIsMessageModalOpen(true)}
                disabled={!data?.mentorId}
                className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-baires-blue to-blue-600 text-white rounded-[14px] font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Message Mentor</span>
              </button>
              <button 
                onClick={() => confirm.info(
                  'Session request feature coming soon!\n\nYou will be able to:\n- Request sessions with your mentor\n- Propose meeting times\n- Add session topics\n- Get confirmations',
                  'Coming Soon'
                )}
                className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-[14px] font-semibold hover:shadow-lg transition-all"
              >
                <Calendar className="w-5 h-5" />
                <span>Request Session</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-neutral-100 text-neutral-black rounded-[14px] font-semibold hover:bg-neutral-200 transition-all">
                <FileText className="w-5 h-5" />
                <span>View Resources</span>
              </button>
            </div>
          </Card>
          
          <MessageModal 
            isOpen={isMessageModalOpen}
            onClose={() => setIsMessageModalOpen(false)}
            recipient={{
              name: data?.mentorName,
              avatar: data?.mentorAvatar,
              role: 'Mentor'
            }}
          />

          <Card padding="lg" className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white border-none shadow-[0_20px_50px_rgb(168,85,247,0.3)]">
            <div className="relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-[16px] flex items-center justify-center mb-4 shadow-lg">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Learning Tips</h3>
                <div className="space-y-2 text-sm opacity-90">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>Practice regularly between sessions</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>Ask questions when you are stuck</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>Review materials after each session</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs opacity-75 mt-4">
                  <Bot className="w-4 h-4" />
                  <span>Mentorship Copilot</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

