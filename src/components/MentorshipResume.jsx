import { Target, Calendar, Users, ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from './Card'
import Avatar from './Avatar'
import Badge from './Badge'

/**
 * MentorshipResume Component
 * 
 * Reusable component to display active mentorships with progress
 * Follows DRY principle and component reusability
 * 
 * @param {Array} mentorships - Array of mentorship objects
 * @param {string} title - Section title
 * @param {string} emptyMessage - Message when no mentorships
 * @param {string} userRole - 'mentor' or 'pm' for role-specific display
 */
export default function MentorshipResume({ mentorships = [], title = "Active Mentorships", emptyMessage = "No active mentorships", userRole = 'mentor' }) {
  const navigate = useNavigate()
  
  // Helper function to format status
  const formatStatus = (status) => {
    if (!status) return 'Unknown'
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }
  
  const statusColors = {
    'active': 'success',
    'pending': 'warning',
    'pending_mentor': 'warning',
    'pending_kickoff': 'blue',
    'completed': 'gray'
  }
  
  const getStatusColor = (status) => {
    return statusColors[status] || 'gray'
  }
  
  if (mentorships.length === 0) {
    return (
      <Card padding="lg" className="text-center">
        <div className="py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-neutral-gray-dark" />
          </div>
          <p className="text-neutral-gray-dark">{emptyMessage}</p>
        </div>
      </Card>
    )
  }
  
  return (
    <Card gradient hover padding="lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-black">{title}</h2>
            <p className="text-sm text-neutral-gray-dark">{mentorships.length} active</p>
          </div>
        </div>
        {mentorships.length > 3 && (
          <button 
            onClick={() => navigate('/mentorship')}
            className="text-sm font-semibold text-baires-blue hover:text-orange-700 flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {mentorships.slice(0, 3).map((mentorship) => {
          // Determine who to display based on user role
          const displayPerson = userRole === 'mentor' 
            ? { name: mentorship.menteeName, avatar: mentorship.menteeAvatar, role: 'Mentee' }
            : { name: mentorship.mentorName || mentorship.menteeName, avatar: mentorship.mentorAvatar || mentorship.menteeAvatar, role: mentorship.mentorName ? 'Mentor' : 'Mentee' }
          
          return (
            <div
              key={mentorship.id}
              className="p-4 bg-gradient-to-br from-white to-blue-50/50 rounded-[20px] border border-orange-100/50 hover:shadow-md transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/mentorship/${mentorship.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar 
                    src={displayPerson.avatar} 
                    initials={displayPerson.name?.substring(0, 2)?.toUpperCase()}
                    size="md"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-neutral-black text-sm mb-1">{displayPerson.name}</h4>
                    <p className="text-xs text-neutral-gray-dark mb-2">{displayPerson.role}</p>
                    {/* Technologies */}
                    {mentorship.technologies && mentorship.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {mentorship.technologies.slice(0, 2).map((tech, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            {typeof tech === 'string' ? tech : tech.name || tech}
                          </span>
                        ))}
                        {mentorship.technologies.length > 2 && (
                          <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium">
                            +{mentorship.technologies.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant={getStatusColor(mentorship.status)} className="text-xs flex-shrink-0">
                  {formatStatus(mentorship.status)}
                </Badge>
              </div>
              
              {/* Summary */}
              {mentorship.challengeDescription && (
                <div className="mb-3 p-2 bg-orange-50/50 rounded-[10px]">
                  <p className="text-xs text-neutral-gray-dark line-clamp-1">
                    {mentorship.challengeDescription}
                  </p>
                </div>
              )}
              
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-gray-dark font-medium">Progress</span>
                  <span className="font-bold text-neutral-black">{mentorship.progress || 0}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-baires-blue to-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${mentorship.progress || 0}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Stats Row */}
              <div className="mt-3 pt-3 border-t border-neutral-200/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-neutral-gray-dark">
                  <Calendar className="w-3 h-3" />
                  <span>{mentorship.sessionsCompleted || 0} sessions</span>
                </div>
                <div className="flex items-center gap-1 text-baires-blue">
                  <Target className="w-3 h-3" />
                  <span className="font-semibold">View Details</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

