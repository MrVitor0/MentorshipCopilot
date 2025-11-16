import { Briefcase, BarChart3, FolderKanban, CheckCircle, Clock, Calendar } from 'lucide-react'
import Card from '../Card'
import Avatar from '../Avatar'
import StatCard from '../StatCard'

export default function ManagementOverviewCard({ user, activeProjects, completedSessions, pendingReviews, upcomingSessions, teamGrowth }) {
  return (
    <Card gradient padding="xl" className="lg:col-span-2">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <Avatar 
            src={user?.photoURL}
            initials={user?.displayName?.substring(0, 2)?.toUpperCase() || 'PM'}
            size="2xl" 
            ring 
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <Briefcase className="w-3 h-3 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-neutral-black to-baires-blue bg-clip-text text-transparent mb-1">
            Management Overview
          </h2>
          <p className="text-neutral-gray-dark flex items-center gap-1">
            <BarChart3 className="w-3 h-3 text-baires-blue" />
            Project insights & analytics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        <StatCard value={activeProjects.toString()} label="Active Projects" trend={teamGrowth} IconComponent={FolderKanban} color="blue" />
        <StatCard value={completedSessions.toString()} label="Completed Sessions" IconComponent={CheckCircle} color="green" />
        <StatCard value={pendingReviews.toString()} label="Pending Reviews" IconComponent={Clock} color="orange" />
        <StatCard value={upcomingSessions.toString()} label="Upcoming Sessions" IconComponent={Calendar} color="purple" />
      </div>
    </Card>
  )
}

