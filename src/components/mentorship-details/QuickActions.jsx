import { MessageSquare, Calendar } from 'lucide-react'
import Card from '../Card'

export default function QuickActions({ 
  onMessageClick, 
  onScheduleClick,
  recipientName = 'Mentee'
}) {
  return (
    <Card padding="lg" className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/40 to-purple-50/40 border-2 border-blue-200/60 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-neutral-black">Quick Actions</h3>
          <p className="text-xs text-neutral-gray-dark">Connect with your {recipientName.toLowerCase()}</p>
        </div>
      </div>

      <div className="space-y-3">
        <button 
          onClick={onMessageClick}
          className="w-full cursor-pointer group relative overflow-hidden flex items-center gap-3 p-4 bg-gradient-to-r from-baires-blue to-blue-600 text-white rounded-[14px] font-semibold hover:shadow-[0_8px_30px_rgb(59,130,246,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <div className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-[12px] flex items-center justify-center shadow-md">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="relative text-left">
            <div className="font-bold">Send Message</div>
            <div className="text-xs opacity-90">Quick communication</div>
          </div>
        </button>

        <button 
          onClick={onScheduleClick}
          className="w-full cursor-pointer group relative overflow-hidden flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-[14px] font-semibold hover:shadow-[0_8px_30px_rgb(34,197,94,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <div className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-[12px] flex items-center justify-center shadow-md">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="relative text-left">
            <div className="font-bold">Schedule Session</div>
            <div className="text-xs opacity-90">Plan your next meeting</div>
          </div>
        </button>
      </div>

      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl pointer-events-none"></div>
    </Card>
  )
}
