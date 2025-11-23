import { Sparkles, Brain, BarChart3, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../Card'

export default function WelcomeHeroSection({ 
  title = "Welcome to Mentorship CoPilot",
  subtitle = "Transform your team's growth with intelligent mentorship matching. Find the perfect mentor for any technology and track progress in real-time.",
  primaryAction,
  secondaryAction,
  features = [
    { icon: Brain, title: "AI Matching", description: "Smart recommendations" },
    { icon: BarChart3, title: "Centralized Hub", description: "All progress tracked" },
    { icon: Zap, title: "Fast Setup", description: "Ready in minutes" }
  ]
}) {
  const navigate = useNavigate()

  const handlePrimaryClick = () => {
    if (primaryAction?.onClick) {
      primaryAction.onClick()
    } else if (primaryAction?.path) {
      navigate(primaryAction.path)
    }
  }

  const handleSecondaryClick = () => {
    if (secondaryAction?.onClick) {
      secondaryAction.onClick()
    } else if (secondaryAction?.path) {
      navigate(secondaryAction.path)
    }
  }

  return (
    <Card padding="none" className="lg:col-span-2 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 border-none shadow-[0_20px_60px_rgb(59,130,246,0.3)] h-full">
      <div className="relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-400/30 to-transparent rounded-full blur-2xl"></div>
        
        <div className="relative p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-[18px] flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-white/90 text-sm font-semibold uppercase tracking-wider">AI-Powered Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
          
          <div className="flex flex-wrap gap-4 mb-8">
            {primaryAction && (
              <button
                onClick={handlePrimaryClick}
                className="group bg-white text-baires-blue px-8 py-4 rounded-[16px] font-bold text-lg hover:shadow-[0_20px_50px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 flex items-center gap-3 cursor-pointer"
              >
                {primaryAction.icon && <primaryAction.icon className="w-6 h-6" />}
                <span>{primaryAction.label}</span>
                {primaryAction.endIcon && <primaryAction.endIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            )}
            
            {secondaryAction && (
              <button
                onClick={handleSecondaryClick}
                className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-[16px] font-bold text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center gap-3 cursor-pointer"
              >
                {secondaryAction.icon && <secondaryAction.icon className="w-6 h-6" />}
                <span>{secondaryAction.label}</span>
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/20">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-[14px] flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{feature.title}</p>
                  <p className="text-xs text-white/80">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
