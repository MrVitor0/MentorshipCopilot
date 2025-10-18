import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
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
  Play
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
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [viewMode, setViewMode] = useState('pm') // 'pm' or 'mentor'
  
  const data = mentorshipData
  const latestSession = data.sessions[data.sessions.length - 1]
  const averageProgress = (data.sessions.reduce((acc, s) => acc + s.progressRating, 0) / data.sessions.length).toFixed(1)
  
  // Determinar status baseado no último log
  const getStatusInfo = () => {
    const rating = latestSession.progressRating
    if (rating >= 4) {
      return { label: 'On Track', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle, iconColor: 'text-green-600' }
    } else if (rating >= 3) {
      return { label: 'Making Progress', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: TrendingUp, iconColor: 'text-blue-600' }
    } else {
      return { label: 'Needs Attention', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: AlertCircle, iconColor: 'text-amber-600' }
    }
  }
  
  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon
  
  // Calcular duração
  const startDate = new Date(data.startDate)
  const now = new Date()
  const weeksDuration = Math.floor((now - startDate) / (1000 * 60 * 60 * 24 * 7))

  return (
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

          {/* View Toggle */}
          <div className="mb-6 flex items-center gap-4">
            <span className="text-sm text-neutral-gray-dark font-semibold">View as:</span>
            <div className="inline-flex rounded-[14px] bg-neutral-100 p-1">
              <button
                onClick={() => setViewMode('pm')}
                className={`px-4 py-2 rounded-[10px] text-sm font-bold transition-all duration-300 ${
                  viewMode === 'pm'
                    ? 'bg-white text-baires-orange shadow-md'
                    : 'text-neutral-gray-dark hover:text-neutral-black'
                }`}
              >
                Project Manager
              </button>
              <button
                onClick={() => setViewMode('mentor')}
                className={`px-4 py-2 rounded-[10px] text-sm font-bold transition-all duration-300 ${
                  viewMode === 'mentor'
                    ? 'bg-white text-baires-orange shadow-md'
                    : 'text-neutral-gray-dark hover:text-neutral-black'
                }`}
              >
                Mentor
              </button>
            </div>
          </div>

          {viewMode === 'pm' ? (
            // ==================== PM VIEW ====================
            <>
              {/* At-a-Glance Header - Outside Grid */}
              <Card padding="lg" className="mb-8 bg-gradient-to-br from-white via-orange-50/30 to-blue-50/30 border-2 border-orange-200/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-black">Mentorship Overview</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Mentee */}
                  <div className="flex items-center gap-4 p-4 bg-white rounded-[16px] border border-blue-200/50">
                    <Avatar src={data.mentee.avatar} size="xl" />
                    <div>
                      <div className="text-xs text-neutral-gray-dark font-semibold mb-1">MENTEE</div>
                      <div className="text-lg font-bold text-neutral-black">{data.mentee.name}</div>
                      <div className="text-sm text-neutral-gray-dark">{data.mentee.role}</div>
                    </div>
                  </div>

                  {/* Mentor */}
                  <div className="flex items-center gap-4 p-4 bg-white rounded-[16px] border border-orange-200/50">
                    <Avatar src={data.mentor.avatar} size="xl" />
                    <div>
                      <div className="text-xs text-neutral-gray-dark font-semibold mb-1">MENTOR</div>
                      <div className="text-lg font-bold text-neutral-black">{data.mentor.name}</div>
                      <div className="text-sm text-neutral-gray-dark">{data.mentor.role}</div>
                    </div>
                  </div>
                </div>

                {/* Original Goal */}
                <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[16px] border border-orange-200/50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[12px] flex items-center justify-center shadow-md flex-shrink-0">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-baires-orange font-bold mb-2 uppercase tracking-wide">Original Goal</div>
                      <p className="text-neutral-black leading-relaxed">{data.originalGoal}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                  {/* AI Insights Card */}
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
                          <div className="font-bold text-green-900 mb-1">Strong Progress Detected</div>
                          <p className="text-sm text-green-800">Sarah's progress rating improved by 150% in the last 3 sessions. Consider discussing more advanced topics.</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[16px] border border-blue-200/50">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-baires-blue flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-blue-900 mb-1">Recommended Action</div>
                          <p className="text-sm text-blue-800">Based on similar mentorships, consider scheduling a mock interview session to assess readiness for production work.</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[16px] border border-orange-200/50">
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-baires-orange flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-orange-900 mb-1">Goal Achievement Forecast</div>
                          <p className="text-sm text-orange-800">AI predicts 92% likelihood of achieving all mentorship goals at current pace. Est. completion: 2 weeks early.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

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
                    <div className="text-xl font-bold text-neutral-black">{data.completedSessions}/{data.totalSessions}</div>
                  </Card>

                  {/* Duration */}
                  <Card padding="md" className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-2 border-purple-200">
                    <Clock className="w-8 h-8 text-purple-600 mb-2" />
                    <div className="text-xs font-bold uppercase text-neutral-gray-dark mb-1">Duration</div>
                    <div className="text-xl font-bold text-neutral-black">{weeksDuration} weeks</div>
                  </Card>

                  {/* Avg Progress */}
                  <Card padding="md" className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-2 border-orange-200">
                    <TrendingUp className="w-8 h-8 text-baires-orange mb-2" />
                    <div className="text-xs font-bold uppercase text-neutral-gray-dark mb-1">Avg Rating</div>
                    <div className="text-xl font-bold text-neutral-black">{averageProgress}/5.0</div>
                  </Card>
                </div>

                {/* Progress Trend Chart */}
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
                      <p className="text-sm text-neutral-gray-dark">{data.sessions.length} sessions completed</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
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
                      <span className="text-lg font-bold text-neutral-black">{data.completedSessions}/{data.totalSessions}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-br from-green-50 to-green-100/50 rounded-[12px]">
                      <span className="text-sm font-semibold text-neutral-gray-dark">Progress</span>
                      <span className="text-lg font-bold text-neutral-black">{data.overallProgress}%</span>
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
                      <Avatar src={data.mentee.avatar} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-neutral-gray-dark mb-0.5">MENTEE</div>
                        <div className="font-bold text-neutral-black text-sm truncate">{data.mentee.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[14px]">
                      <Avatar src={data.mentor.avatar} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-neutral-gray-dark mb-0.5">MENTOR</div>
                        <div className="font-bold text-neutral-black text-sm truncate">{data.mentor.name}</div>
                      </div>
                    </div>
                  </div>
                </Card>
                </div>
              </div>
            </>
          ) : (
            // ==================== MENTOR VIEW ====================
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                {/* AI Assistant for Logging */}
                <Card padding="lg" className="bg-gradient-to-br from-orange-50 via-white to-blue-50 border-2 border-orange-200/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[14px] flex items-center justify-center shadow-lg">
                      <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-black flex items-center gap-2">
                        AI Writing Assistant
                        <Badge variant="orange" className="text-xs">Magic</Badge>
                      </h3>
                      <p className="text-xs text-neutral-gray-dark flex items-center gap-1">
                        <Bot className="w-3 h-3 text-baires-orange" />
                        Let AI help you write better logs
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full text-left p-4 bg-white rounded-[14px] border-2 border-neutral-200 hover:border-orange-400 hover:bg-orange-50/50 transition-all group">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-baires-orange flex-shrink-0 mt-0.5 group-hover:rotate-12 transition-transform" />
                        <div>
                          <div className="font-bold text-neutral-black mb-1">Generate Summary</div>
                          <p className="text-sm text-neutral-gray-dark">AI will create a professional summary based on key points</p>
                        </div>
                      </div>
                    </button>
                    
                    <button className="w-full text-left p-4 bg-white rounded-[14px] border-2 border-neutral-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-baires-blue flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-neutral-black mb-1">Suggest Next Steps</div>
                          <p className="text-sm text-neutral-gray-dark">Get AI recommendations for mentee's next goals</p>
                        </div>
                      </div>
                    </button>

                    <button className="w-full text-left p-4 bg-white rounded-[14px] border-2 border-neutral-200 hover:border-orange-400 hover:bg-orange-50/50 transition-all group">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-baires-orange flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-neutral-black mb-1">Progress Analysis</div>
                          <p className="text-sm text-neutral-gray-dark">AI analyzes progress and provides insights</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </Card>

                {/* Add Log Form */}
                <Card padding="lg" className="bg-gradient-to-br from-orange-50 via-white to-blue-50 border-2 border-orange-200/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[14px] flex items-center justify-center shadow-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-black">Log New Session</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-neutral-black mb-2">Session Date</label>
                    <input type="date" className="w-full px-4 py-3 rounded-[12px] border-2 border-neutral-200 focus:border-baires-orange focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-neutral-black mb-2">Duration (minutes)</label>
                    <input type="number" placeholder="60" className="w-full px-4 py-3 rounded-[12px] border-2 border-neutral-200 focus:border-baires-orange focus:outline-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-neutral-black mb-2">Progress Rating (1-5)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          className="flex-1 py-3 rounded-[12px] border-2 border-neutral-200 hover:border-baires-orange hover:bg-orange-50 transition-all font-bold"
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-bold text-neutral-black">Session Summary</label>
                      <button className="flex items-center gap-1 text-xs font-bold text-baires-orange hover:text-orange-700 transition-colors">
                        <Sparkles className="w-3 h-3" />
                        AI Assist
                      </button>
                    </div>
                    <textarea 
                      rows="4" 
                      placeholder="Describe what was covered in this session... (Try using AI Assist above!)"
                      className="w-full px-4 py-3 rounded-[12px] border-2 border-neutral-200 focus:border-baires-orange focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-bold text-neutral-black">Next Steps</label>
                      <button className="flex items-center gap-1 text-xs font-bold text-baires-orange hover:text-orange-700 transition-colors">
                        <Sparkles className="w-3 h-3" />
                        AI Suggest
                      </button>
                    </div>
                    <textarea 
                      rows="3" 
                      placeholder="What should the mentee focus on next? (AI can suggest based on progress)"
                      className="w-full px-4 py-3 rounded-[12px] border-2 border-neutral-200 focus:border-baires-orange focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-neutral-black mb-2">Recording URL (optional)</label>
                    <input type="url" placeholder="https://..." className="w-full px-4 py-3 rounded-[12px] border-2 border-neutral-200 focus:border-baires-orange focus:outline-none" />
                  </div>

                  <Button variant="orange" className="w-full" icon={<Plus className="w-4 h-4" />}>
                    Save Session Log
                  </Button>
                </div>
              </Card>

                {/* Recent Logs */}
                <Card padding="lg">
                <h3 className="text-xl font-bold text-neutral-black mb-6">Your Recent Logs</h3>
                <div className="space-y-4">
                  {data.sessions.slice(-3).reverse().map((session) => (
                    <Card key={session.id} padding="md" hover className="bg-gradient-to-br from-neutral-50 to-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-neutral-black mb-1">
                            {new Date(session.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-neutral-gray-dark line-clamp-1">{session.summary}</div>
                        </div>
                        <button className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-[12px] font-semibold text-sm transition-colors flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
                </Card>
              </div>

              {/* Mentor Sidebar */}
              <div className="space-y-6 md:space-y-8">
                {/* Mentee Info */}
                <Card padding="lg" className="bg-gradient-to-br from-blue-50 via-white to-blue-100/50 border-2 border-blue-200/50">
                  <div className="text-center">
                    <Avatar src={data.mentee.avatar} size="2xl" className="mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-neutral-black mb-1">{data.mentee.name}</h3>
                    <p className="text-sm text-neutral-gray-dark mb-4">{data.mentee.role}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-white rounded-[10px]">
                        <span className="text-xs text-neutral-gray-dark">Sessions</span>
                        <span className="text-sm font-bold">{data.completedSessions}/{data.totalSessions}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded-[10px]">
                        <span className="text-xs text-neutral-gray-dark">Progress</span>
                        <span className="text-sm font-bold text-green-600">{data.overallProgress}%</span>
                      </div>
                    </div>
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
                      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                        AI Tips for This Session
                      </h3>
                      <div className="space-y-3 text-sm opacity-90">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <p>Focus on practical coding exercises to reinforce concepts</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <p>Consider pair programming for complex topics</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <p>Ask about challenges from previous homework</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs opacity-75 mt-4">
                        <Bot className="w-4 h-4" />
                        <span>Powered by AI CoPilot</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card padding="lg">
                  <h3 className="text-lg font-bold text-neutral-black mb-4">Quick Tools</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-baires-blue to-blue-600 text-white rounded-[14px] font-semibold hover:shadow-lg transition-all">
                      <MessageSquare className="w-5 h-5" />
                      <span>Message {data.mentee.name}</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-[14px] font-semibold hover:shadow-lg transition-all">
                      <Calendar className="w-5 h-5" />
                      <span>Schedule Next Session</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-neutral-100 text-neutral-black rounded-[14px] font-semibold hover:bg-neutral-200 transition-all">
                      <Video className="w-5 h-5" />
                      <span>Upload Recording</span>
                    </button>
                  </div>
                </Card>

                {/* Goal Progress */}
                <Card padding="lg">
                  <h3 className="text-lg font-bold text-neutral-black mb-4">Mentorship Goals</h3>
                  <div className="space-y-3">
                    {data.sessions[0]?.nextSteps.split('. ').slice(0, 3).map((goal, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-[12px]">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-black">{goal}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

