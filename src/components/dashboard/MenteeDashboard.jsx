import { BookOpen, FileText, Calendar, Video, Download, ExternalLink, Star, TrendingUp, Target, Sparkles, GraduationCap, FileCheck, Users } from 'lucide-react'
import Card from '../Card'
import Button from '../Button'
import Avatar from '../Avatar'
import Badge from '../Badge'
import StatCard from '../StatCard'
import EmptyState from '../EmptyState'

// Recommended courses from Udemy
const recommendedCourses = [
  {
    title: 'Complete React Developer',
    platform: 'Udemy',
    rating: 4.8,
    students: '125K',
    image: '🎓',
    url: 'https://www.udemy.com/topic/react/',
    tag: 'Popular'
  },
  {
    title: 'Node.js Masterclass',
    platform: 'Udemy',
    rating: 4.7,
    students: '98K',
    image: '💻',
    url: 'https://www.udemy.com/topic/nodejs/',
    tag: 'Trending'
  },
  {
    title: 'TypeScript Complete Guide',
    platform: 'Udemy',
    rating: 4.9,
    students: '87K',
    image: '📘',
    url: 'https://www.udemy.com/topic/typescript/',
    tag: 'New'
  }
]

// Support materials
const supportMaterials = [
  {
    title: 'React Best Practices Guide',
    type: 'PDF',
    size: '2.5 MB',
    icon: FileText,
    color: 'red'
  },
  {
    title: 'Node.js Architecture Patterns',
    type: 'PDF',
    size: '1.8 MB',
    icon: FileText,
    color: 'green'
  },
  {
    title: 'JavaScript Cheat Sheet',
    type: 'PDF',
    size: '850 KB',
    icon: FileCheck,
    color: 'yellow'
  },
  {
    title: 'Git Commands Reference',
    type: 'PDF',
    size: '1.2 MB',
    icon: FileText,
    color: 'orange'
  }
]

export default function MenteeDashboard({ user, upcomingSessions, mentorships, loading }) {
  const currentMentorship = mentorships[0] // Mentees typically have one active mentorship
  const progress = currentMentorship?.progress || 0
  const completedSessions = currentMentorship?.sessionsCompleted || 0
  const hoursSpent = completedSessions * 1.5 // Assuming 1.5 hours per session

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <div className="lg:col-span-2 space-y-6 md:space-y-8">
        {/* Mentee Insights Card */}
        <Card gradient padding="xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <Avatar 
                src={user?.photoURL}
                initials={user?.displayName?.substring(0, 2)?.toUpperCase() || 'U'}
                size="2xl" 
                ring 
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <GraduationCap className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-neutral-black to-purple-600 bg-clip-text text-transparent mb-1">
                Your Learning Journey
              </h2>
              <p className="text-neutral-gray-dark flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600" />
                Track your progress and growth
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            <StatCard value={progress.toString() + '%'} label="Overall Progress" IconComponent={Target} color="purple" />
            <StatCard value={completedSessions.toString()} label="Sessions Done" IconComponent={Calendar} color="blue" />
            <StatCard value={hoursSpent.toString()} label="Hours Learning" IconComponent={BookOpen} color="orange" />
            <StatCard value="4.8" label="Performance" trend="↑ 12%" IconComponent={Star} color="yellow" />
          </div>
        </Card>

        {/* Current Mentorship Overview */}
        <Card padding="none" className="overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 border-2 border-purple-200/50">
          <div className="relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-purple-300/20 to-blue-300/10 rounded-full blur-2xl"></div>
            
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[16px] flex items-center justify-center shadow-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-black flex items-center gap-2">
                        {currentMentorship ? (
                          currentMentorship.menteeName || 'Your Mentorship'
                        ) : (
                          'No Active Mentorship'
                        )}
                        <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
                      </h2>
                      <p className="text-sm text-neutral-gray-dark mt-1">
                        {currentMentorship ? (
                          `Mentor: ${currentMentorship.mentorName || 'Not assigned yet'}`
                        ) : (
                          'No mentorship assigned'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-neutral-black">Progress to Goal</span>
                  <span className="text-lg font-bold text-purple-600">{progress}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    if (currentMentorship) {
                      window.location.href = `/mentorship/${currentMentorship.id}`
                    } else {
                      window.location.href = '/mentorship'
                    }
                  }}
                  className="group relative overflow-hidden bg-gradient-to-br from-white to-purple-50 p-4 rounded-[16px] border-2 border-purple-200/50 hover:border-purple-400/70 hover:shadow-lg transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[12px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-black text-sm">View Details</h3>
                      <p className="text-xs text-neutral-gray-dark">See progress</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    if (currentMentorship) {
                      window.location.href = `/mentorship/${currentMentorship.id}`
                    } else {
                      window.location.href = '/mentorship'
                    }
                  }}
                  className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50 p-4 rounded-[16px] border-2 border-blue-200/50 hover:border-blue-400/70 hover:shadow-lg transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[12px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-black text-sm">Sessions</h3>
                      <p className="text-xs text-neutral-gray-dark">{upcomingSessions.length} upcoming</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Recommended Courses */}
        <Card gradient hover padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-[16px] flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-black">Recommended Courses</h3>
              <p className="text-xs text-neutral-gray-dark flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-orange-500" />
                Personalized for your learning path
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {recommendedCourses.map((course, index) => (
              <a
                key={index}
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 bg-gradient-to-br from-white to-indigo-50/50 rounded-[20px] border border-indigo-100/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-[14px] flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    {course.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-neutral-black group-hover:text-orange-600 transition-colors">{course.title}</h4>
                        <p className="text-xs text-neutral-gray-dark mt-1">{course.platform}</p>
                      </div>
                      <Badge variant="warning" className="text-xs ml-2">{course.tag}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-gray-dark">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{course.students} students</span>
                      </div>
                      <ExternalLink className="w-3 h-3 ml-auto group-hover:text-orange-600 transition-colors" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-200/50">
            <a 
              href="https://www.udemy.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-baires-indigo hover:text-orange-600 font-semibold flex items-center gap-2 transition-colors"
            >
              Explore more courses on Udemy
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </Card>

        {/* Support Materials */}
        <Card gradient hover padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-[16px] flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-black">Support Materials</h3>
              <p className="text-xs text-neutral-gray-dark">Curated resources for your learning</p>
            </div>
          </div>

          <div className="grid gap-3">
            {supportMaterials.map((material, index) => {
              const IconComponent = material.icon
              const colorClasses = {
                red: 'from-red-500 to-red-600',
                green: 'from-green-500 to-green-600',
                yellow: 'from-yellow-500 to-indigo-500',
                orange: 'from-indigo-500 to-indigo-600'
              }
              return (
                <button
                  key={index}
                  className="group flex items-center gap-4 p-4 bg-gradient-to-br from-white to-green-50/50 rounded-[16px] border border-green-100/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-left"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[material.color]} rounded-[12px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-neutral-black text-sm">{material.title}</h4>
                    <p className="text-xs text-neutral-gray-dark mt-0.5">{material.type} • {material.size}</p>
                  </div>
                  <Download className="w-5 h-5 text-neutral-gray group-hover:text-green-600 transition-colors" />
                </button>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="space-y-6 md:space-y-8">
        {/* Next Session */}
        {upcomingSessions.length > 0 && (
          <Card hover padding="lg" className="bg-gradient-to-br from-baires-indigo via-indigo-600 to-indigo-700 text-white border-none shadow-[0_20px_50px_rgb(79,70,229,0.3)]">
            <div className="relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-[18px] flex items-center justify-center mb-4 shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Next Session</h3>
                <p className="text-sm mb-4 opacity-90">Your upcoming mentorship session</p>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-[16px] p-4 mb-4">
                  <p className="font-bold text-lg mb-1">{upcomingSessions[0].participantName || 'Mentor'}</p>
                  <p className="text-sm opacity-90">{upcomingSessions[0].scheduledDate?.toDate?.().toLocaleDateString() || 'Soon'}</p>
                </div>
                
                <button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-[16px] transition-all duration-300 border border-white/30 hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                  <Video className="w-4 h-4" />
                  Join Session
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Upcoming Sessions List */}
        <Card gradient hover padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-baires-blue" />
            <h3 className="text-xl font-bold text-neutral-black">All Sessions</h3>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-baires-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center gap-3 p-3 bg-gradient-to-br from-white to-blue-50/50 rounded-[16px] border border-blue-100/50 hover:shadow-md transition-all">
                  <Avatar src={session.participantPhoto} initials={session.participantName?.substring(0, 2)} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-black text-sm truncate">{session.participantName}</p>
                    <p className="text-xs text-neutral-gray-dark">{session.scheduledDate?.toDate?.().toLocaleDateString()}</p>
                  </div>
                  <Badge variant="blue" className="text-xs">Soon</Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={Calendar}
              title="No sessions yet"
              description="Sessions will appear here when scheduled"
            />
          )}
        </Card>

        {/* Learning Stats */}
        <Card gradient padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="text-xl font-bold text-neutral-black">Your Progress</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-[14px]">
              <span className="text-sm font-semibold text-neutral-black">Sessions Completed</span>
              <span className="text-lg font-bold text-green-600">{completedSessions}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[14px]">
              <span className="text-sm font-semibold text-neutral-black">Hours of Learning</span>
              <span className="text-lg font-bold text-blue-600">{hoursSpent}h</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-[14px]">
              <span className="text-sm font-semibold text-neutral-black">Current Streak</span>
              <span className="text-lg font-bold text-purple-600">🔥 7 days</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

