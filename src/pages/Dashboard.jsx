import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import StatCard from '../components/StatCard'
import ActivityItem from '../components/ActivityItem'
import ProgressBar from '../components/ProgressBar'
import AIChatModal from '../components/AIChatModal'
import { Users, MessageSquare, Target, Star, TrendingUp, Lightbulb, Calendar, Search, Plus, Sparkles, BookOpen, PenSquare, Rocket, Bot } from 'lucide-react'

const recentActivities = [
  {
    user: 'Anonymous',
    action: 'requested mentorship for',
    subject: 'Career Growth',
    badges: [
      { text: 'Leadership', variant: 'orange' },
      { text: 'Strategy', variant: 'warning' },
      { text: 'Career', variant: 'gray' }
    ],
    time: '9h ago',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    user: 'Anonymous',
    action: 'requested mentorship for',
    subject: 'Team Mentor',
    badges: [
      { text: 'Leadership', variant: 'orange' },
      { text: 'Team', variant: 'blue' },
      { text: 'Mentor', variant: 'success' }
    ],
    time: '2h ago',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    user: 'Anonymous',
    action: 'requested mentorship for',
    subject: 'Skill Development',
    badges: [
      { text: 'Technical', variant: 'blue' },
      { text: 'Growth', variant: 'success' }
    ],
    time: '1d ago',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
]

const opportunities = [
  {
    title: 'AI-Powered Matching',
    description: 'Smart mentor suggestions ready.',
    status: 'New',
    icon: 'sparkles'
  },
  {
    title: 'Skill Development',
    description: 'New learning paths available.',
    status: 'Active',
    icon: 'trending-up'
  },
  {
    title: 'Team Growth',
    description: 'Join collaborative sessions.',
    status: 'Open',
    icon: 'users'
  },
]

const upcomingMentorships = [
  { name: 'John Doe', status: 'In Progress', badge: 'New Mentee' },
  { name: 'Jane Smith', status: 'Starting Soon', badge: 'Experienced' },
]

const feedbackItems = [
  { team: 'Mentorship Team', feedback: 'AI-Generated insights from latest sessions', icon: 'message-square' },
]

const results = [
  { label: 'Are mentors meeting your expectations?', value: 85 },
  { label: 'Rate the effectiveness of your mentor:', value: 72 },
  { label: 'Is the program helping you achieve your goals?', value: 90 },
]

const getIconComponent = (iconName) => {
  const icons = {
    'sparkles': Sparkles,
    'trending-up': TrendingUp,
    'users': Users,
    'message-square': MessageSquare,
  }
  return icons[iconName] || Sparkles
}

export default function Dashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-orange-50/15">
      <Sidebar user={{ name: 'Alex Smith', email: 'alexsmith@example.io' }} />
      
      {/* AI Chat Modal */}
      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Floating AI Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-baires-orange via-orange-600 to-orange-700 text-white rounded-full shadow-[0_10px_40px_rgb(246,97,53,0.4)] hover:shadow-[0_15px_50px_rgb(246,97,53,0.5)] hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 group"
      >
        <Bot className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-neutral-black text-white text-sm font-semibold rounded-[12px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with AI CoPilot
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-black"></div>
        </div>
      </button>
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
          {/* Hero Section with CTA */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-black to-baires-orange bg-clip-text text-transparent mb-2">
                  Mentor Dashboard
                </h1>
                <p className="text-neutral-gray-dark flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-baires-orange" />
                  AI-powered mentorship at your fingertips
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-baires-orange to-orange-600 text-white px-5 py-2.5 rounded-[14px] font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>Ask AI CoPilot</span>
                </button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={<Search className="w-4 h-4" />}
                  onClick={() => window.location.href = '/find-mentors'}
                >
                  Find Mentor
                </Button>
                <Button 
                  variant="orange" 
                  size="sm" 
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => window.location.href = '/create-mentorship'}
                >
                  New Mentorship
                </Button>
              </div>
                  </div>
                </div>
                
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* Insights Card - Moved to top */}
              <Card gradient padding="xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <Avatar size="2xl" initials="AS" ring />
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
                  <StatCard 
                    value="4.5"
                    label="Active Mentors"
                    trend="↑ 12%"
                    IconComponent={Users}
                    color="blue"
                  />
                  <StatCard 
                    value="4.2"
                    label="Avg Rating"
                    trend="↓ 3%"
                    IconComponent={Star}
                    color="purple"
                  />
                  <StatCard 
                    value="4.8"
                    label="Completion"
                    IconComponent={Target}
                    color="orange"
                  />
                  <StatCard 
                    value="5.0"
                    label="Goals Met"
                    trend="↑ 8%"
                    IconComponent={TrendingUp}
                    color="yellow"
                  />
                </div>
              </Card>

              {/* What's Next Card - Hero Action Card */}
              <Card padding="none" className="overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 border-2 border-orange-200/50">
                <div className="relative">
                  {/* Decorative background elements */}
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
                            <p className="text-sm text-neutral-gray-dark mt-1">
                              Let's make an impact together
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Mentorias Button */}
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
                            <h3 className="text-lg font-bold text-neutral-black group-hover:text-baires-blue transition-colors">
                              My Mentorships
                            </h3>
                          </div>
                          <p className="text-sm text-neutral-gray-dark">
                            View and manage your active mentorship sessions
                          </p>
                        </div>
                      </button>

                      {/* Registrar Mentoria Button */}
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
                            <h3 className="text-lg font-bold text-neutral-black group-hover:text-baires-orange transition-colors">
                              Log Session
                            </h3>
                          </div>
                          <p className="text-sm text-neutral-gray-dark">
                            Record a new mentorship session and track progress
                          </p>
                        </div>
                      </button>
                    </div>

                    {/* Quick Stats Footer */}
                    <div className="mt-6 pt-6 border-t border-neutral-200/50 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-neutral-gray-dark">
                            <span className="text-neutral-black font-bold">3</span> active today
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-baires-orange" />
                          <span className="text-sm font-medium text-neutral-gray-dark">
                            <span className="text-neutral-black font-bold">2</span> upcoming this week
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

              {/* AI Suggestions Card */}
              <Card gradient hover padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[14px] flex items-center justify-center shadow-lg">
                      <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-neutral-black">Magic Suggestions</h2>
                      <p className="text-sm text-neutral-gray-dark">AI-powered recommendations</p>
                    </div>
                    <Badge variant="orange">AI</Badge>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => window.location.href = '/create-mentorship'}
                  >
                    New Request
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <ActivityItem key={index} {...activity} />
                  ))}
                </div>
              </Card>

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

              <Card gradient padding="lg">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[16px] flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-black">Performance Metrics</h3>
                    <p className="text-xs text-neutral-gray-dark">Real-time analytics</p>
                  </div>
                </div>
                <div className="space-y-6">
                  {results.map((result, index) => (
                    <ProgressBar
                      key={index}
                      label={result.label}
                      value={result.value}
                      color={index === 0 ? 'cyan' : index === 1 ? 'blue' : 'purple'}
                      showValue
                    />
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-6 md:space-y-8">
              {/* Quick Actions Card - Moved to sidebar */}
              <Card hover padding="lg" className="bg-gradient-to-br from-baires-orange via-orange-600 to-orange-700 text-white border-none shadow-[0_20px_50px_rgb(246,97,53,0.3)]">
                <div className="relative">
                  {/* Decorative elements */}
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

              <Card gradient hover padding="lg">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-baires-blue" />
                  <h3 className="text-xl font-bold text-neutral-black">Upcoming Sessions</h3>
                </div>
                <div className="space-y-4">
                  {upcomingMentorships.map((mentorship, index) => (
                    <div key={index} className="group flex items-center gap-4 p-4 bg-gradient-to-br from-white to-blue-50/50 rounded-[20px] border border-blue-100/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                      <div className="relative">
                      <Avatar 
                        src={`https://i.pravatar.cc/150?img=${index + 10}`}
                          size="lg" 
                      />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-neutral-black mb-2">{mentorship.name}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="orange" className="text-xs">{mentorship.status}</Badge>
                          <Badge variant="gray" className="text-xs">{mentorship.badge}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

