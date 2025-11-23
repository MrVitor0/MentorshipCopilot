import { Users, Target, TrendingUp, Sparkles, FolderKanban, Briefcase, ArrowRight, Search, Plus } from 'lucide-react'
import Button from '../Button'
import ManagementOverviewCard from './ManagementOverviewCard'
import QuickActionsCard from './QuickActionsCard'
import AIChatCard from './AIChatCard'
import ProjectProgressCard from './ProjectProgressCard'
import TeamsProjectsCard from './TeamsProjectsCard'
import WelcomeHeroSection from './WelcomeHeroSection'
import QuickActionsSection from './QuickActionsSection'
import GettingStartedGuide from './GettingStartedGuide'
import SystemStructureInfo from './SystemStructureInfo'
import WhyUseSection from './WhyUseSection'
import ActionItemsCard from './ActionItemsCard'
import UpcomingSessionsCard from './UpcomingSessionsCard'
import LoadingDashboard from './LoadingDashboard'

const opportunities = [
  { title: 'Team Performance', description: 'Review team progress this week.', status: 'Action', icon: 'trending-up' },
  { title: 'Resource Allocation', description: 'Optimize mentor assignments.', status: 'Review', icon: 'users' },
  { title: 'Goal Tracking', description: 'Update quarterly objectives.', status: 'Pending', icon: 'target' },
]

const iconMap = {
  'trending-up': TrendingUp,
  'users': Users,
  'target': Target,
  'sparkles': Sparkles
}

export default function PMDashboard({ user, upcomingSessions, mentorships, loading }) {
  // Calculate PM-specific metrics
  const activeProjects = mentorships.length
  const completedSessions = Math.floor(activeProjects * 0.7) // Mock data
  const pendingReviews = Math.floor(activeProjects * 0.3) // Mock data
  const teamGrowth = activeProjects > 0 ? '+12%' : '0%'
  
  const hasNoMentorships = mentorships.length === 0

  // Loading State - Prevent flashing
  if (loading) {
    return <LoadingDashboard />
  }

  return (
    <div className="space-y-6 md:space-y-8">
        {hasNoMentorships ? (
          <>
          {/* First Row - Hero + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <WelcomeHeroSection 
              title={`Welcome ${user?.displayName || ''}!`}
              primaryAction={{
                icon: Plus,
                label: "Create Your First Mentorship",
                path: "/create-mentorship",
                endIcon: ArrowRight
              }}
              secondaryAction={{
                icon: Search,
                label: "Browse Mentors",
                path: "/mentors"
              }}
            />
            
            <QuickActionsSection 
              actions={[
                {
                  icon: Plus,
                  title: "Create Mentorship",
                  description: "Start with AI matching",
                  path: "/create-mentorship"
                },
                {
                  icon: Search,
                  title: "Browse Mentors",
                  description: "Explore expert pool",
                  path: "/mentors"
                },
                {
                  icon: FolderKanban,
                  title: "My Projects",
                  description: "View all mentorships",
                  path: "/mentorship"
                }
              ]}
            />
          </div>

          {/* Second Row - Getting Started + Features */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <GettingStartedGuide 
              steps={[
                {
                  icon: Plus,
                  title: "Create Request",
                  description: "Select a mentee and describe the challenge or skill they need to develop.",
                  action: {
                    label: "Start Now",
                    path: "/create-mentorship"
                  },
                  footer: {
                    icon: () => <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />,
                    text: "Ready to use"
                  }
                },
                {
                  icon: Sparkles,
                  title: "AI Recommends",
                  description: "Our AI analyzes your team and suggests the 3 best mentor matches with justifications.",
                  badge: "Automated Process",
                  footer: {
                    text: "AI-powered"
                  }
                },
                {
                  icon: TrendingUp,
                  title: "Track Progress",
                  description: "Monitor all mentorship activities from your centralized dashboard.",
                  badge: "Real-time Updates",
                  footer: {
                    text: "Live tracking"
                  }
                }
              ]}
            />

            <SystemStructureInfo 
              cards={[
                {
                  icon: Users,
                  iconBg: "from-indigo-500 to-indigo-600",
                  title: "Teams",
                  description: "Organize your PMs into teams. Each team can manage multiple projects.",
                  badgeIcon: Briefcase,
                  badge: "Admin managed",
                  badgeColor: "text-indigo-600",
                  badgeBg: "bg-indigo-50",
                  bgGradient: "from-indigo-50 to-white",
                  borderColor: "border-indigo-100"
                },
                {
                  icon: FolderKanban,
                  iconBg: "from-baires-blue to-blue-600",
                  title: "Projects",
                  description: "Teams create projects with mentees who need guidance and development.",
                  badgeIcon: Users,
                  badge: "Multiple mentees per project",
                  badgeColor: "text-blue-600",
                  badgeBg: "bg-blue-50",
                  bgGradient: "from-blue-50 to-white",
                  borderColor: "border-blue-100"
                },
                {
                  icon: Target,
                  iconBg: "from-green-500 to-green-600",
                  title: "Mentors",
                  description: "When a mentee needs help, the perfect mentor is temporarily added to the project.",
                  badgeIcon: Sparkles,
                  badge: "AI-matched & dynamic",
                  badgeColor: "text-green-600",
                  badgeBg: "bg-green-50",
                  bgGradient: "from-green-50 to-white",
                  borderColor: "border-green-100"
                }
              ]}
            />
          </div>

          {/* Third Row - Why Use Section Full Width */}
          <WhyUseSection 
            icon={Target}
            benefits={[
              {
                title: "Find Niche Experts",
                description: "Discover hidden talents across your organization, even for specialized technologies"
              },
              {
                title: "Centralized Tracking",
                description: "No more scattered spreadsheets or Slack threads - everything in one place"
              },
              {
                title: "Automated Workflows",
                description: "Reduce manual work and focus on what matters - team development"
              }
            ]}
          />
          </>
        ) : (
          <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Management Overview - Left Side (2 columns) */}
            <ManagementOverviewCard 
              user={user}
              activeProjects={activeProjects}
              completedSessions={completedSessions}
              pendingReviews={pendingReviews}
              upcomingSessions={upcomingSessions.length}
              teamGrowth={teamGrowth}
            />

            {/* Quick Actions - Right Side (1 column) */}
            <QuickActionsCard />
          </div>

          {/* Second Row - 3 Columns: AI Chat + Project Progress + Teams */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* AI Mentorship CoPilot Chat */}
            <AIChatCard />

            {/* Project Progress Overview */}
            <ProjectProgressCard mentorships={mentorships} />

            {/* Teams & Projects Management - Right Column */}
            <TeamsProjectsCard />
          </div>

          {/* Second Row - Action Items + Upcoming Sessions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <ActionItemsCard 
              opportunities={opportunities}
              iconMap={iconMap}
            />

            <UpcomingSessionsCard 
              upcomingSessions={upcomingSessions}
              loading={loading}
              onCancelSession={(sessionId) => {
                // TODO: Implement cancel meeting
                console.log('Cancel meeting:', sessionId)
              }}
              emptyStateAction={
                <Button variant="orange" size="sm" onClick={() => window.location.href = '/mentorship'}>
                  View Projects
                </Button>
              }
            />
          </div>
          </>
        )}
    </div>
  )
}

