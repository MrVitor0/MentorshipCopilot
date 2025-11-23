import { BarChart3, ArrowRight, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../Card'
import Avatar from '../Avatar'
import Badge from '../Badge'
import Button from '../Button'
import EmptyState from '../EmptyState'
import { FolderKanban } from 'lucide-react'

export default function ProjectProgressCard({ mentorships = [] }) {
  const navigate = useNavigate()

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

  return (
    <Card gradient hover padding="lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[16px] flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-black">Project Progress</h3>
            <p className="text-xs text-neutral-gray-dark">Your mentorship projects</p>
          </div>
        </div>
        {mentorships.length > 3 && (
          <button 
            onClick={() => navigate('/mentorship')}
            className="text-sm font-semibold text-baires-indigo hover:text-indigo-700 flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {mentorships.length > 0 ? (
        <div className="space-y-4">
          {mentorships.slice(0, 3).map((mentorship) => (
            <div
              key={mentorship.id}
              className="w-full p-5 bg-gradient-to-br from-white to-blue-50/50 rounded-[20px] border border-blue-100/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar 
                    src={mentorship.menteeAvatar} 
                    initials={mentorship.menteeName?.substring(0, 2)?.toUpperCase()}
                    size="md"
                    ring
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-neutral-black mb-1">{mentorship.menteeName}</h4>
                    <p className="text-xs text-neutral-gray-dark mb-2">
                      Mentor: {mentorship.mentorName || 'Not assigned yet'}
                    </p>
                    {/* Technologies */}
                    {mentorship.technologies && mentorship.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {mentorship.technologies.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            {typeof tech === 'string' ? tech : tech.name || tech}
                          </span>
                        ))}
                        {mentorship.technologies.length > 3 && (
                          <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full font-medium">
                            +{mentorship.technologies.length - 3}
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
              
              {/* Challenge Description Summary */}
              {mentorship.challengeDescription && (
                <div className="mb-3 p-3 bg-indigo-50/50 rounded-[12px] border border-indigo-100/50">
                  <p className="text-xs text-neutral-gray-dark line-clamp-2 leading-relaxed">
                    {mentorship.challengeDescription}
                  </p>
                </div>
              )}
              
              {/* Invited Mentors Count for Pending Status */}
              {mentorship.status === 'pending' && mentorship.invitedMentorIds && (
                <div className="mb-3 flex items-center gap-2 text-xs">
                  <Users className="w-4 h-4 text-baires-indigo" />
                  <span className="text-neutral-gray-dark">
                    <span className="font-bold text-neutral-black">{mentorship.invitedMentorIds.length}</span> mentor{mentorship.invitedMentorIds.length !== 1 ? 's' : ''} invited
                  </span>
                </div>
              )}
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-gray-dark font-medium">Progress</span>
                  <span className="font-bold text-neutral-black">{mentorship.progress || 0}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-baires-blue to-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${mentorship.progress || 0}%` }}
                  ></div>
                </div>
              </div>
              
              {/* View Details Button */}
              <button
                onClick={() => navigate(`/mentorship/${mentorship.id}`)}
                className="w-full cursor-pointer bg-gradient-to-r from-baires-indigo to-indigo-600 text-white px-4 py-2.5 rounded-[14px] font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>View Details</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={FolderKanban}
          title="No projects yet"
          description="Start managing mentorship projects"
          action={
            <Button variant="blue" size="sm" onClick={() => navigate('/create-mentorship')}>
              Create Project
            </Button>
          }
        />
      )}
    </Card>
  )
}

