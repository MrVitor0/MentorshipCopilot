import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Bot
} from 'lucide-react'

const mentorships = [
  {
    id: 1,
    mentee: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Junior Developer'
    },
    topic: 'React & Frontend Development',
    status: 'active',
    progress: 75,
    nextSession: '2024-10-20',
    sessionsCompleted: 6,
    totalSessions: 8,
    startDate: '2024-09-01',
    goals: ['Master React Hooks', 'Build Portfolio', 'Land First Job']
  },
  {
    id: 2,
    mentee: {
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'Mid-Level Engineer'
    },
    topic: 'System Design & Architecture',
    status: 'active',
    progress: 45,
    nextSession: '2024-10-22',
    sessionsCompleted: 3,
    totalSessions: 10,
    startDate: '2024-09-15',
    goals: ['Microservices', 'Scalability Patterns', 'Team Leadership']
  },
  {
    id: 3,
    mentee: {
      name: 'Emma Davis',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'Senior Developer'
    },
    topic: 'Career Growth & Leadership',
    status: 'pending',
    progress: 0,
    nextSession: '2024-10-25',
    sessionsCompleted: 0,
    totalSessions: 6,
    startDate: '2024-10-15',
    goals: ['Management Transition', 'Strategic Thinking', 'Team Building']
  },
  {
    id: 4,
    mentee: {
      name: 'James Wilson',
      avatar: 'https://i.pravatar.cc/150?img=4',
      role: 'Junior Developer'
    },
    topic: 'JavaScript Fundamentals',
    status: 'completed',
    progress: 100,
    nextSession: null,
    sessionsCompleted: 8,
    totalSessions: 8,
    startDate: '2024-07-01',
    goals: ['ES6+ Mastery', 'Async Programming', 'Testing Best Practices']
  },
]

const stats = [
  { label: 'Active Mentorships', value: '2', icon: Users, color: 'blue', trend: '+1' },
  { label: 'Total Sessions', value: '17', icon: Calendar, color: 'orange', trend: '+3' },
  { label: 'Completion Rate', value: '94%', icon: Target, color: 'green', trend: '+5%' },
  { label: 'Avg Rating', value: '4.8', icon: Star, color: 'yellow', trend: '↑' },
]

const statusConfig = {
  active: { 
    label: 'Active', 
    color: 'bg-green-100 text-green-700 border-green-200',
    dot: 'bg-green-500'
  },
  pending: { 
    label: 'Starting Soon', 
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500'
  },
  completed: { 
    label: 'Completed', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    dot: 'bg-blue-500'
  },
}

export default function Mentorship() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMentorships = mentorships.filter(m => {
    const matchesFilter = filter === 'all' || m.status === filter
    const matchesSearch = m.mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.topic.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status) => statusConfig[status]

  return (
    <>
      <SEO 
        title="My Mentorships"
        description="Manage and track all your mentorship journeys. View active sessions, upcoming meetings, and monitor progress with AI insights."
      />
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-orange-50/15">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
          {/* Page Header - Reusable component */}
          <PageHeader 
            title="My Mentorships"
            description="Manage and track all your mentorship journeys"
          />

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
                      stat.color === 'orange' ? 'bg-gradient-to-br from-baires-orange to-orange-600' :
                      stat.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                      'bg-gradient-to-br from-amber-500 to-amber-600'
                    }`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

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
                          ? 'bg-gradient-to-r from-baires-orange to-orange-600 text-white shadow-lg'
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
                    className="pl-10 pr-4 py-2 rounded-[12px] border-2 border-neutral-200 focus:border-baires-orange focus:outline-none w-full md:w-64 transition-colors"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Mentorships Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMentorships.map((mentorship) => {
              const statusInfo = getStatusColor(mentorship.status)
              return (
                <Card key={mentorship.id} hover padding="none" className="overflow-hidden group">
                  <div className="relative">
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusInfo.color} border shadow-sm`}>
                        <div className={`w-2 h-2 ${statusInfo.dot} rounded-full animate-pulse`}></div>
                        <span className="text-xs font-bold">{statusInfo.label}</span>
                      </div>
                    </div>

                    {/* Header */}
                    <div className="bg-gradient-to-br from-orange-50 via-white to-blue-50 p-6 border-b border-neutral-100">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Avatar src={mentorship.mentee.avatar} size="xl" />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-neutral-black mb-1">{mentorship.mentee.name}</h3>
                          <p className="text-sm text-neutral-gray-dark mb-2">{mentorship.mentee.role}</p>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-baires-orange" />
                            <span className="text-sm font-semibold text-neutral-black">{mentorship.topic}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="p-6 bg-white">
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-neutral-black">Progress</span>
                          <span className="text-sm font-bold text-baires-orange">{mentorship.progress}%</span>
                        </div>
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-baires-orange to-orange-600 rounded-full transition-all duration-500"
                            style={{ width: `${mentorship.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[12px]">
                          <Calendar className="w-4 h-4 text-baires-blue mx-auto mb-1" />
                          <div className="text-lg font-bold text-neutral-black">{mentorship.sessionsCompleted}/{mentorship.totalSessions}</div>
                          <div className="text-xs text-neutral-gray-dark">Sessions</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100/50 rounded-[12px]">
                          <Target className="w-4 h-4 text-green-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-neutral-black">{mentorship.goals.length}</div>
                          <div className="text-xs text-neutral-gray-dark">Goals</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[12px]">
                          <Clock className="w-4 h-4 text-baires-orange mx-auto mb-1" />
                          <div className="text-lg font-bold text-neutral-black">
                            {mentorship.nextSession ? new Date(mentorship.nextSession).getDate() : '-'}
                          </div>
                          <div className="text-xs text-neutral-gray-dark">Next</div>
                        </div>
                      </div>

                      {/* Goals Preview */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-baires-orange" />
                          <span className="text-sm font-semibold text-neutral-black">Key Goals</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {mentorship.goals.slice(0, 2).map((goal, idx) => (
                            <span key={idx} className="text-xs bg-neutral-100 text-neutral-gray-dark px-3 py-1 rounded-full">
                              {goal}
                            </span>
                          ))}
                          {mentorship.goals.length > 2 && (
                            <span className="text-xs bg-baires-orange text-white px-3 py-1 rounded-full">
                              +{mentorship.goals.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigate(`/mentorship/${mentorship.id}`)}
                          className="flex-1 bg-gradient-to-r from-baires-orange to-orange-600 text-white px-4 py-3 rounded-[14px] font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button className="px-4 py-3 bg-gradient-to-br from-blue-50 to-blue-100 text-baires-blue rounded-[14px] font-semibold hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                          <MessageSquare className="w-5 h-5" />
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
                  Try adjusting your filters or search query
                </p>
                <Button 
                  variant="orange" 
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => navigate('/create-mentorship')}
                >
                  Start New Mentorship
                </Button>
              </div>
            </Card>
          )}
      </main>
      </div>
    </>
  )
}

