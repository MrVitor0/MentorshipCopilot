import { Calendar, Video } from 'lucide-react'
import Card from '../Card'

export default function NextSessionHighlight({ 
  session,
  onJoinSession
}) {
  if (!session) return null

  return (
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
            <p className="font-bold text-lg mb-1">{session.participantName || 'Mentor'}</p>
            <p className="text-sm opacity-90">
              {session.scheduledDate?.toDate?.().toLocaleDateString() || 'Soon'}
            </p>
          </div>
          
          <button 
            onClick={() => onJoinSession?.(session)}
            className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-[16px] transition-all duration-300 border border-white/30 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <Video className="w-4 h-4" />
            Join Session
          </button>
        </div>
      </div>
    </Card>
  )
}
