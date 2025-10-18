import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import AIChatModal from '../components/AIChatModal'
import SEO from '../components/SEO'
import { 
  ArrowLeft,
  Sparkles,
  Star,
  MessageSquare,
  Calendar,
  Award,
  TrendingUp,
  Users,
  Target,
  CheckCircle,
  Send,
  Filter,
  Bot,
  Zap
} from 'lucide-react'

const mentors = [
  {
    id: 1,
    name: 'Maria Garcia',
    avatar: 'https://i.pravatar.cc/150?img=10',
    role: 'Staff Engineer',
    expertise: ['React', 'TypeScript', 'Architecture'],
    rating: 4.9,
    totalMentees: 12,
    successRate: 96,
    yearsExperience: 8,
    aiScore: 98,
    aiReasons: [
      'Perfect match for React expertise',
      'Proven track record with junior developers',
      'Available in your timezone'
    ],
    availability: 'Available now',
    languages: ['English', 'Spanish'],
    bio: 'Passionate about helping developers grow. Specialized in React ecosystem and modern frontend architecture.'
  },
  {
    id: 2,
    name: 'John Anderson',
    avatar: 'https://i.pravatar.cc/150?img=11',
    role: 'Principal Engineer',
    expertise: ['React', 'Performance', 'State Management'],
    rating: 4.8,
    totalMentees: 15,
    successRate: 94,
    yearsExperience: 10,
    aiScore: 95,
    aiReasons: [
      'Expert in performance optimization',
      'Strong communication skills',
      'Experience with similar cases'
    ],
    availability: 'Available from next week',
    languages: ['English'],
    bio: 'Tech lead with a passion for teaching. Focus on scalable frontend solutions and mentoring.'
  },
  {
    id: 3,
    name: 'Priya Patel',
    avatar: 'https://i.pravatar.cc/150?img=12',
    role: 'Senior Frontend Engineer',
    expertise: ['React', 'Next.js', 'UI/UX'],
    rating: 5.0,
    totalMentees: 8,
    successRate: 98,
    yearsExperience: 6,
    aiScore: 92,
    aiReasons: [
      'Recent success with similar mentee profile',
      'Excellent teaching methodology',
      'Active in React community'
    ],
    availability: 'Available now',
    languages: ['English', 'Hindi'],
    bio: 'Senior engineer focused on modern React patterns and best practices. Love making complex concepts simple.'
  },
  {
    id: 4,
    name: 'Carlos Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=13',
    role: 'Tech Lead',
    expertise: ['Full Stack', 'React', 'Node.js'],
    rating: 4.7,
    totalMentees: 10,
    successRate: 91,
    yearsExperience: 7,
    aiScore: 87,
    aiReasons: [
      'Broad technical knowledge',
      'Patient teaching style',
      'Good availability match'
    ],
    availability: 'Limited slots',
    languages: ['English', 'Spanish', 'Portuguese'],
    bio: 'Full-stack engineer with passion for mentoring. Helping developers become well-rounded engineers.'
  },
]

export default function FindMentors() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [filterAvailability, setFilterAvailability] = useState('all')
  
  const { mentee, technologies, problem } = location.state || {}

  const topThree = mentors.slice(0, 3)
  const otherMentors = mentors.slice(3)

  const filteredOthers = otherMentors.filter(mentor => {
    if (filterAvailability === 'all') return true
    if (filterAvailability === 'available') return mentor.availability.includes('Available now')
    return true
  })

  return (
    <>
      <SEO 
        title="Find Mentors"
        description="AI-powered mentor recommendations. Browse top-matched mentors based on skills, experience, and compatibility. Find the perfect match for your team."
      />
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
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-neutral-gray-dark hover:text-neutral-black mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Dashboard</span>
          </button>

          {/* Hero Section */}
          <div className="mb-8">
            <Card padding="lg" className="bg-gradient-to-br from-orange-50 via-white to-blue-50 border-2 border-orange-200/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-baires-orange to-orange-600 text-white px-4 py-2 rounded-full mb-4">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="font-semibold text-sm">AI-Powered Matching Complete</span>
                  </div>
                  
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-black to-baires-orange bg-clip-text text-transparent mb-3">
                    Perfect Mentors Found!
                  </h1>
                  <p className="text-neutral-gray-dark mb-6 leading-relaxed">
                    Our AI analyzed <span className="font-bold text-neutral-black">250+ mentors</span> and found the <span className="font-bold text-baires-orange">top 3 matches</span> for <span className="font-bold text-neutral-black">{mentee?.name || 'your team member'}</span>
                  </p>

                  {/* Request Summary */}
                  {mentee && (
                    <div className="flex items-center gap-4 p-4 bg-white rounded-[16px] border border-blue-200/50">
                      <Avatar src={mentee.avatar} size="lg" />
                      <div className="flex-1">
                        <div className="font-bold text-neutral-black">{mentee.name}</div>
                        <div className="text-sm text-neutral-gray-dark">{mentee.role}</div>
                      </div>
                      {technologies && (
                        <div className="flex flex-wrap gap-2">
                          {technologies.slice(0, 2).map(techId => {
                            const tech = [
                              { id: 'react', name: 'React' },
                              { id: 'nodejs', name: 'Node.js' },
                              { id: 'python', name: 'Python' },
                            ].find(t => t.id === techId)
                            return tech && (
                              <Badge key={techId} variant="blue" className="text-xs">
                                {tech.name}
                              </Badge>
                            )
                          })}
                          {technologies.length > 2 && (
                            <Badge variant="gray" className="text-xs">+{technologies.length - 2}</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* AI Top 3 Recommendations */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[14px] flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-black flex items-center gap-2">
                  AI Top Recommendations
                  <Badge variant="orange">Magic Match</Badge>
                </h2>
                <p className="text-sm text-neutral-gray-dark flex items-center gap-1">
                  <Bot className="w-3 h-3 text-baires-orange" />
                  Ranked by compatibility score
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {topThree.map((mentor, index) => (
                <Card key={mentor.id} hover padding="none" className="overflow-hidden relative group">
                  {/* AI Score Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex flex-col items-end gap-1">
                      <div className="bg-gradient-to-r from-baires-orange to-orange-600 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span className="font-bold text-sm">{mentor.aiScore}% Match</span>
                      </div>
                      {index === 0 && (
                        <Badge variant="orange" className="text-xs flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Best Match
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Header */}
                  <div className="bg-gradient-to-br from-orange-50 via-white to-blue-50 p-6 border-b border-neutral-100">
                    <div className="text-center mb-4">
                      <Avatar src={mentor.avatar} size="2xl" className="mx-auto mb-4" ring />
                      <h3 className="text-xl font-bold text-neutral-black mb-1">{mentor.name}</h3>
                      <p className="text-sm text-neutral-gray-dark mb-3">{mentor.role}</p>
                      
                      {/* Rating */}
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(mentor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`} />
                          ))}
                        </div>
                        <span className="font-bold text-neutral-black">{mentor.rating}</span>
                      </div>

                      {/* Availability */}
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                        mentor.availability.includes('now') 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${mentor.availability.includes('now') ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></div>
                        {mentor.availability}
                      </div>
                    </div>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {mentor.expertise.map((skill, idx) => (
                        <span key={idx} className="text-xs bg-white border border-orange-200 text-neutral-black px-3 py-1 rounded-full font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 bg-white">
                    {/* AI Reasons */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Bot className="w-4 h-4 text-baires-orange" />
                        <h4 className="text-sm font-bold text-neutral-black">Why AI recommends:</h4>
                      </div>
                      <div className="space-y-2">
                        {mentor.aiReasons.map((reason, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-neutral-gray-dark">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[12px]">
                        <Users className="w-4 h-4 text-baires-blue mx-auto mb-1" />
                        <div className="text-lg font-bold text-neutral-black">{mentor.totalMentees}</div>
                        <div className="text-xs text-neutral-gray-dark">Mentees</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100/50 rounded-[12px]">
                        <Target className="w-4 h-4 text-green-600 mx-auto mb-1" />
                        <div className="text-lg font-bold text-neutral-black">{mentor.successRate}%</div>
                        <div className="text-xs text-neutral-gray-dark">Success</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[12px]">
                        <Award className="w-4 h-4 text-baires-orange mx-auto mb-1" />
                        <div className="text-lg font-bold text-neutral-black">{mentor.yearsExperience}y</div>
                        <div className="text-xs text-neutral-gray-dark">Exp.</div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-neutral-gray-dark mb-6 line-clamp-2">
                      {mentor.bio}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedMentor(mentor)}
                        className="flex-1 bg-gradient-to-r from-baires-orange to-orange-600 text-white px-4 py-3 rounded-[14px] font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Request</span>
                      </button>
                      <button className="px-4 py-3 bg-gradient-to-br from-blue-50 to-blue-100 text-baires-blue rounded-[14px] font-semibold hover:shadow-md transition-all">
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Other Available Mentors */}
          {otherMentors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-black">Other Available Mentors</h2>
                  <p className="text-sm text-neutral-gray-dark">Additional options you might consider</p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterAvailability('all')}
                    className={`px-4 py-2 rounded-[12px] font-semibold text-sm transition-all ${
                      filterAvailability === 'all'
                        ? 'bg-gradient-to-r from-baires-orange to-orange-600 text-white'
                        : 'bg-neutral-100 text-neutral-gray-dark hover:bg-neutral-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterAvailability('available')}
                    className={`px-4 py-2 rounded-[12px] font-semibold text-sm transition-all ${
                      filterAvailability === 'available'
                        ? 'bg-gradient-to-r from-baires-orange to-orange-600 text-white'
                        : 'bg-neutral-100 text-neutral-gray-dark hover:bg-neutral-200'
                    }`}
                  >
                    Available Now
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOthers.map((mentor) => (
                  <Card key={mentor.id} hover padding="md" className="bg-gradient-to-br from-white to-neutral-50">
                    <div className="flex gap-4">
                      <Avatar src={mentor.avatar} size="xl" />
                      <div className="flex-1">
                        <h3 className="font-bold text-neutral-black mb-1">{mentor.name}</h3>
                        <p className="text-sm text-neutral-gray-dark mb-3">{mentor.role}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {mentor.expertise.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="text-xs bg-orange-100 text-baires-orange px-2 py-1 rounded-full font-semibold">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-neutral-gray-dark mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{mentor.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{mentor.totalMentees} mentees</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedMentor(mentor)}
                          className="w-full bg-gradient-to-r from-baires-blue to-blue-600 text-white px-4 py-2 rounded-[12px] font-semibold hover:shadow-md transition-all text-sm flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Send Request
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Request Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedMentor(null)}></div>
          
          <Card padding="lg" className="relative max-w-lg w-full animate-scaleIn">
            <div className="text-center mb-6">
              <Avatar src={selectedMentor.avatar} size="2xl" className="mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-black mb-2">
                Send Mentorship Request
              </h2>
              <p className="text-neutral-gray-dark">
                to <span className="font-bold text-baires-orange">{selectedMentor.name}</span>
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[16px] border border-orange-200">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-baires-orange flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-neutral-black mb-2">AI Match Score: {selectedMentor.aiScore}%</div>
                    <div className="space-y-1">
                      {selectedMentor.aiReasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-neutral-gray-dark">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <textarea
                placeholder="Add a personal message (optional)..."
                rows="4"
                className="w-full px-4 py-3 rounded-[12px] border-2 border-neutral-200 focus:border-baires-orange focus:outline-none resize-none"
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedMentor(null)}
                className="flex-1 px-6 py-3 bg-neutral-100 text-neutral-black rounded-[14px] font-semibold hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSelectedMentor(null)
                  navigate('/mentorship')
                }}
                className="flex-1 bg-gradient-to-r from-baires-orange to-orange-600 text-white px-6 py-3 rounded-[14px] font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Request
              </button>
            </div>
          </Card>
        </div>
      )}
      </div>
    </>
  )
}

