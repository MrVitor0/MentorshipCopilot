import { FileText, Clock, TrendingUp, MessageSquare, Play, Edit } from 'lucide-react'
import Card from '../Card'
import Badge from '../Badge'

export default function SessionHistory({ sessions = [], title = "Session History & Reports", showEdit = false }) {
  if (!sessions || sessions.length === 0) {
    return (
      <Card padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-black">{title}</h2>
            <p className="text-sm text-neutral-gray-dark">0 sessions completed</p>
          </div>
        </div>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-neutral-gray-dark" />
          </div>
          <h4 className="text-lg font-bold text-neutral-black mb-2">No Sessions Logged Yet</h4>
          <p className="text-sm text-neutral-gray-dark mb-4">
            Session reports will appear here once logged
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-black">{title}</h2>
            <p className="text-sm text-neutral-gray-dark">{sessions.length} session{sessions.length !== 1 ? 's' : ''} completed</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {[...sessions].reverse().map((session, index) => {
          // Handle both string dates and Firebase Timestamps
          const sessionDate = session.date 
            ? typeof session.date === 'string' 
              ? new Date(session.date)
              : session.date.toDate?.() || new Date(session.date)
            : new Date()
          
          return (
            <div key={session.id} className="relative">
              {index !== sessions.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-neutral-200"></div>
              )}
              
              <Card hover padding="lg" className="relative bg-gradient-to-br from-white to-neutral-50">
                <div className="flex gap-6">
                  {/* Date Circle */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">{sessions.length - index}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-neutral-black">
                            Session #{sessions.length - index}
                          </h3>
                          <Badge variant="blue" className="text-xs">
                            {sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Badge>
                        </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-gray-dark">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {session.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          Progress: {session.progressRating}/5
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Recording Button */}
                      {session.recordingUrl && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-baires-blue to-blue-600 text-white rounded-[12px] font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                          <Play className="w-4 h-4" />
                          Watch
                        </button>
                      )}
                      
                      {/* Edit Button */}
                      {showEdit && (
                        <button className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-[12px] font-semibold text-sm transition-colors flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-neutral-black mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-baires-blue" />
                      {showEdit ? 'Your Summary' : "Mentor's Summary"}
                    </h4>
                    <p className="text-neutral-gray-dark leading-relaxed">{session.summary}</p>
                  </div>

                  {/* Next Steps */}
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-blue-100/50 rounded-[12px] border border-orange-200/50">
                    <h4 className="text-sm font-bold text-baires-blue mb-2">Next Steps</h4>
                    <p className="text-neutral-black text-sm">{session.nextSteps}</p>
                  </div>

                  {/* Mentor Notes */}
                  {session.mentorNotes && (
                    <div className="mt-3 text-xs text-neutral-gray-dark italic">
                      Note: {session.mentorNotes}
                    </div>
                  )}
                  </div>
                </div>
              </Card>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

