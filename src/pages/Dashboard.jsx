import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import StatCard from '../components/StatCard'
import ActivityItem from '../components/ActivityItem'
import ProgressBar from '../components/ProgressBar'

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
    title: 'Mentorship',
    description: 'is working on new initiatives.',
    status: 'Active',
    icon: '🎯'
  },
  {
    title: 'Development',
    description: 'is adding new programs.',
    status: 'Planning',
    icon: '📚'
  },
  {
    title: 'Mentorship',
    description: 'welcoming new members.',
    status: 'Open',
    icon: '👥'
  },
]

const upcomingMentorships = [
  { name: 'John Doe', status: 'In Progress', badge: 'New Mentee' },
  { name: 'Jane Smith', status: 'Starting Soon', badge: 'Experienced' },
]

const feedbackItems = [
  { team: 'Mentorship team', feedback: 'Q3 Feedback Summary', icon: '💬' },
]

const results = [
  { label: 'Are mentors meeting your expectations?', value: 85 },
  { label: 'Rate the effectiveness of your mentor:', value: 72 },
  { label: 'Is the program helping you achieve your goals?', value: 90 },
]

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-purple-50/20">
      <Sidebar user={{ name: 'Alex Smith', email: 'alexsmith@example.io' }} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              <Card gradient hover padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-neutral-black">Recent Activity</h2>
                      <p className="text-sm text-neutral-gray-dark">New mentorship requests</p>
                    </div>
                    <Badge variant="gray">3</Badge>
                  </div>
                  <Button size="sm" variant="outline">+ New</Button>
                </div>
                
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <ActivityItem key={index} {...activity} />
                  ))}
                </div>
              </Card>

              <Card gradient padding="xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <Avatar size="2xl" initials="AS" ring />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-neutral-black to-purple-900 bg-clip-text text-transparent mb-1">
                      Overview
                    </h2>
                    <p className="text-neutral-gray-dark">Your mentorship insights</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                  <StatCard 
                    value="4.5"
                    label="Active Mentors"
                    trend="↑ 12%"
                    icon="👨‍🏫"
                    color="blue"
                  />
                  <StatCard 
                    value="4.2"
                    label="Avg Rating"
                    trend="↓ 3%"
                    icon="⭐"
                    color="purple"
                  />
                  <StatCard 
                    value="4.8"
                    label="Completion"
                    icon="✓"
                    color="orange"
                  />
                  <StatCard 
                    value="5.0"
                    label="Goals Met"
                    trend="↑ 8%"
                    icon="🎯"
                    color="yellow"
                  />
                </div>
              </Card>

              <Card gradient hover padding="lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-[16px] flex items-center justify-center shadow-lg">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-black">Latest Feedback</h3>
                </div>
                
                {feedbackItems.map((item, index) => (
                  <div key={index} className="p-5 bg-gradient-to-br from-orange-50 to-pink-50 rounded-[20px] border border-orange-100/50 hover:shadow-md transition-all duration-300">
                    <p className="font-semibold text-neutral-black mb-2">{item.team}</p>
                    <p className="text-sm text-neutral-gray-dark">{item.feedback}</p>
                  </div>
                ))}
              </Card>

              <Card gradient padding="lg">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-[16px] flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-black">Performance Metrics</h3>
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
              <Card gradient hover padding="lg">
                <h3 className="text-xl font-bold text-neutral-black mb-6">Opportunities</h3>
                <div className="space-y-4">
                  {opportunities.map((opp, index) => (
                    <div key={index} className="group p-5 bg-gradient-to-br from-white to-purple-50/50 rounded-[20px] border border-purple-100/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-[14px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                          <span className="text-2xl">{opp.icon}</span>
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
                  ))}
                </div>
              </Card>

              <Card gradient hover padding="lg">
                <h3 className="text-xl font-bold text-neutral-black mb-6">Upcoming Sessions</h3>
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

              <Card hover padding="lg" className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 text-white border-none shadow-[0_20px_50px_rgb(124,58,237,0.3)]">
                <div className="relative">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                  
                  <div className="relative">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-[18px] flex items-center justify-center mb-4 shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Need Assistance?</h3>
                    <p className="text-sm mb-6 opacity-90 leading-relaxed">Our support team is ready to help you succeed.</p>
                    <button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-[16px] transition-all duration-300 border border-white/30 hover:scale-105 shadow-lg">
                      Contact Support
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

