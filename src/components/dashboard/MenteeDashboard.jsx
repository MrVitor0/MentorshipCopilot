import { BookOpen, FileText, Calendar, Target, Sparkles, GraduationCap, FileCheck, Code, Database, Zap, ArrowRight, Brain, BarChart3, Star } from 'lucide-react'
import Card from '../Card'
import StatCard from '../StatCard'
import WelcomeHeroSection from './WelcomeHeroSection'
import QuickActionsSection from './QuickActionsSection'
import RecommendedCoursesCard from './RecommendedCoursesCard'
import SupportMaterialsCard from './SupportMaterialsCard'
import NextSessionHighlight from './NextSessionHighlight'
import LearningStatsCard from './LearningStatsCard'
import UpcomingSessionsCard from './UpcomingSessionsCard'
import LoadingDashboard from './LoadingDashboard'

// Recommended courses from Udemy
const recommendedCourses = [
  {
    title: 'Complete React Developer',
    platform: 'Udemy',
    rating: 4.8,
    students: '125K',
    icon: Code,
    url: 'https://www.udemy.com/topic/react/',
    tag: 'Popular'
  },
  {
    title: 'Node.js Masterclass',
    platform: 'Udemy',
    rating: 4.7,
    students: '98K',
    icon: Database,
    url: 'https://www.udemy.com/topic/nodejs/',
    tag: 'Trending'
  },
  {
    title: 'TypeScript Complete Guide',
    platform: 'Udemy',
    rating: 4.9,
    students: '87K',
    icon: FileText,
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
    icon: Database,
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
    icon: Code,
    color: 'blue'
  }
]

export default function MenteeDashboard({ user, upcomingSessions, mentorships, loading }) {
  const currentMentorship = mentorships[0] // Mentees typically have one active mentorship
  const progress = currentMentorship?.progress || 0

  // Loading State
  if (loading) {
    return <LoadingDashboard />
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <WelcomeHeroSection 
          title={`Welcome ${user?.displayName || ''}!`}
          subtitle="Your personal learning journey powered by AI matching. Track your progress, engage with mentors, and achieve your professional goals."
          primaryAction={{
            icon: BookOpen,
            label: currentMentorship ? "Continue Learning" : "Start Learning Journey",
            path: currentMentorship ? `/mentorship/${currentMentorship.id}` : "/mentorship",
            endIcon: ArrowRight
          }}
          secondaryAction={{
            icon: Calendar,
            label: "View Sessions",
            path: "/mentorship"
          }}
          features={[
            { icon: Brain, title: "AI-Matched Mentors", description: "Expert guidance" },
            { icon: BarChart3, title: "Track Progress", description: "Monitor growth" },
            { icon: Zap, title: "Quick Resources", description: "Learn faster" }
          ]}
        />
        
        <QuickActionsSection 
          title="Quick Actions"
          description="Everything you need to manage your learning journey"
          actions={[
            {
              icon: BookOpen,
              title: "My Mentorship",
              description: currentMentorship ? `${progress}% complete` : "Not started yet",
              path: currentMentorship ? `/mentorship/${currentMentorship.id}` : "/mentorship"
            },
            {
              icon: Calendar,
              title: "Upcoming Sessions",
              description: `${upcomingSessions.length} sessions scheduled`,
              path: "/mentorship"
            },
            {
              icon: GraduationCap,
              title: "Learning Resources",
              description: "Access courses & materials",
              path: "#resources"
            }
          ]}
        />
      </div>

      {/* Current Mentorship Overview */}
      <div className="space-y-6 md:space-y-8">

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

        {/* Next Session Highlight */}
        {upcomingSessions.length > 0 && (
          <NextSessionHighlight 
            session={upcomingSessions[0]}
            onJoinSession={(session) => {
              console.log('Join session:', session)
              // Add join logic here
            }}
          />
        )}

        {/* All Upcoming Sessions */}
        <UpcomingSessionsCard 
          upcomingSessions={upcomingSessions}
          loading={false}
          onCancelSession={(sessionId) => {
            console.log('Cancel session:', sessionId)
          }}
        />

        {/* Recommended Courses */}
        <RecommendedCoursesCard courses={recommendedCourses} />

        {/* Support Materials */}
        <SupportMaterialsCard materials={supportMaterials} />
      </div>
    </div>
  )
}

