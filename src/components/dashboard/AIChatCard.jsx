import { Sparkles, BarChart3, Users, Target, ArrowRight } from 'lucide-react'
import Card from '../Card'

const quickActions = [
  {
    id: 1,
    icon: BarChart3,
    text: 'Show team performance',
    gradient: 'from-white to-blue-50 hover:to-blue-100',
    border: 'border-blue-100 hover:border-blue-300',
    iconColor: 'text-baires-blue'
  },
  {
    id: 2,
    icon: Users,
    text: 'Find mentor for React',
    gradient: 'from-white to-purple-50 hover:to-purple-100',
    border: 'border-purple-100 hover:border-purple-300',
    iconColor: 'text-purple-600'
  },
  {
    id: 3,
    icon: Target,
    text: 'Get recommendations',
    gradient: 'from-white to-indigo-50 hover:to-indigo-100',
    border: 'border-indigo-100 hover:border-indigo-300',
    iconColor: 'text-baires-indigo'
  }
]

export default function AIChatCard({ onQuickActionClick }) {
  return (
    <Card padding="none" className="overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 border-2 border-indigo-100 shadow-[0_20px_50px_rgba(79,70,229,0.15)]">
      <div className="relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-baires-indigo/10 to-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-400/10 to-indigo-400/5 rounded-full blur-2xl"></div>
        
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-indigo-100">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-baires-indigo to-indigo-600 rounded-[12px] flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-black flex items-center gap-2">
                Mentorship CoPilot
                <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-200 font-medium">Online</span>
              </h3>
              <p className="text-xs text-neutral-gray-dark">Your AI assistant</p>
            </div>
          </div>

          {/* Chat Message */}
          <div className="mb-6 space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-baires-indigo to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex-1 bg-white border border-indigo-100 rounded-[14px] rounded-tl-none p-3 shadow-sm">
                <p className="text-sm text-neutral-black leading-relaxed">
                  Hello! I can help you analyze your mentorship progress, find the best mentors, or answer questions about your projects.
                </p>
                <span className="text-xs text-neutral-gray-dark mt-1.5 block">Just now</span>
              </div>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="mb-4">
            <p className="text-xs font-bold text-neutral-gray-dark uppercase tracking-wider mb-2">Quick Actions</p>
            <div className="grid grid-cols-1 gap-1.5">
              {quickActions.map((action) => (
                <button 
                  key={action.id}
                  onClick={() => onQuickActionClick?.(action.text)}
                  className={`group w-full text-left px-3 py-2 bg-gradient-to-br ${action.gradient} border ${action.border} rounded-[10px] transition-all duration-300 cursor-pointer`}
                >
                  <div className="flex items-center gap-2">
                    <action.icon className={`w-3.5 h-3.5 ${action.iconColor} flex-shrink-0`} />
                    <span className="text-xs text-neutral-black font-medium">{action.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="w-full bg-white border-2 border-indigo-200 text-neutral-black placeholder-neutral-gray-dark px-3 py-2.5 pr-11 rounded-[12px] focus:outline-none focus:border-baires-indigo transition-all duration-300 text-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-gradient-to-br from-baires-indigo to-indigo-600 rounded-[8px] flex items-center justify-center hover:scale-110 transition-transform shadow-md cursor-pointer">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}

