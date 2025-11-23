import { Sparkles, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../Card'

export default function QuickActionsSection({ 
  title = "Quick Actions",
  description = "Everything you need to get started with your mentorship program",
  actions = []
}) {
  const navigate = useNavigate()

  const handleActionClick = (action) => {
    if (action.onClick) {
      action.onClick()
    } else if (action.path) {
      navigate(action.path)
    }
  }

  return (
    <Card padding="xl" className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 border-none shadow-[0_20px_60px_rgb(59,130,246,0.3)] text-white h-full flex flex-col">
      <div className="relative flex-1 flex flex-col">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/30 to-transparent rounded-full blur-xl"></div>
        
        <div className="relative flex-1 flex flex-col">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-[18px] flex items-center justify-center mb-4 shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-sm mb-6 opacity-90 leading-relaxed">
            {description}
          </p>
          
          <div className="space-y-3 mt-auto">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                className="group w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 p-4 rounded-[16px] transition-all duration-300 border border-white/30 hover:scale-105 shadow-lg text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-[12px] flex items-center justify-center group-hover:scale-110 transition-transform">
                    {action.icon && <action.icon className="w-5 h-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm">{action.title}</h4>
                    <p className="text-xs text-white/80">{action.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
