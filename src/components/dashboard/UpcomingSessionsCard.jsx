import { Calendar } from 'lucide-react'
import Card from '../Card'
import Button from '../Button'
import Avatar from '../Avatar'
import Badge from '../Badge'
import EmptyState from '../EmptyState'

export default function UpcomingSessionsCard({ 
  upcomingSessions = [],
  loading = false,
  onCancelSession,
  emptyStateAction
}) {
  return (
    <Card gradient hover padding="lg">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-baires-indigo" />
        <h3 className="text-xl font-bold text-neutral-black">Upcoming Sessions</h3>
      </div>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-baires-indigo border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : upcomingSessions.length > 0 ? (
        <div className="space-y-4">
          {upcomingSessions.map((session) => {
            const isKickoff = session.type === 'kickoff'
            const isPending = session.status === 'pending_acceptance'
            
            return (
              <div key={session.id} className="group flex items-center gap-4 p-4 bg-gradient-to-br from-white to-indigo-50/50 rounded-[20px] border border-indigo-100/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="relative">
                  <Avatar 
                    src={session.participantPhoto} 
                    initials={session.participantName?.substring(0, 2)?.toUpperCase()} 
                    size="lg" 
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-neutral-black mb-1">
                    {isKickoff ? 'Kickoff Meeting: ' : ''}{session.participantName}
                  </p>
                  <p className="text-xs text-neutral-gray-dark mb-2">
                    {session.scheduledDate?.toDate?.().toLocaleString()}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {isPending && (
                      <Badge variant="warning" className="text-xs">Pending Acceptance</Badge>
                    )}
                    {!isPending && (
                      <Badge variant="success" className="text-xs">Confirmed</Badge>
                    )}
                    {isKickoff && (
                      <Badge variant="blue" className="text-xs">Kickoff</Badge>
                    )}
                  </div>
                </div>
                {isPending && onCancelSession && (
                  <button 
                    className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-[12px] transition-colors"
                    onClick={() => {
                      if (confirm('Cancel this meeting?')) {
                        onCancelSession(session.id)
                      }
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState 
          icon={Calendar}
          title="No scheduled sessions"
          description="No upcoming sessions at the moment"
          action={emptyStateAction}
        />
      )}
    </Card>
  )
}
