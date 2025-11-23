import { Sparkles, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../Card'

export default function GettingStartedGuide({ 
  title = "Getting Started",
  subtitle = "Follow these simple steps to launch your first mentorship",
  steps = []
}) {
  const navigate = useNavigate()

  const getGradientColors = (index) => {
    const colors = [
      { 
        bg: 'from-baires-blue to-blue-600', 
        badge: 'from-baires-blue to-blue-600',
        card: 'border-blue-100 hover:border-blue-300 hover:shadow-[0_20px_50px_rgb(26,115,232,0.15)]',
        glow: 'from-blue-100/50',
        shadow: 'shadow-[0_10px_30px_rgb(26,115,232,0.3)]',
        iconBg: 'from-baires-blue to-blue-600',
        badgeBg: 'bg-blue-50 text-blue-600',
        badgeText: 'text-blue-600'
      },
      { 
        bg: 'from-baires-indigo to-indigo-600', 
        badge: 'from-baires-indigo to-indigo-600',
        card: 'border-indigo-100 hover:border-indigo-300 hover:shadow-[0_20px_50px_rgb(79,70,229,0.15)]',
        glow: 'from-indigo-100/50',
        shadow: 'shadow-[0_10px_30px_rgb(79,70,229,0.3)]',
        iconBg: 'from-baires-indigo to-indigo-600',
        badgeBg: 'bg-indigo-50 text-baires-indigo',
        badgeText: 'text-indigo-600'
      },
      { 
        bg: 'from-green-500 to-green-600', 
        badge: 'from-green-500 to-green-600',
        card: 'border-green-100 hover:border-green-300 hover:shadow-[0_20px_50px_rgb(34,197,94,0.15)]',
        glow: 'from-green-100/50',
        shadow: 'shadow-[0_10px_30px_rgb(34,197,94,0.3)]',
        iconBg: 'from-green-500 to-green-600',
        badgeBg: 'bg-green-50 text-green-700',
        badgeText: 'text-green-600'
      }
    ]
    return colors[index % colors.length]
  }

  const handleStepAction = (step) => {
    if (step.action?.onClick) {
      step.action.onClick()
    } else if (step.action?.path) {
      navigate(step.action.path)
    }
  }

  return (
    <Card gradient padding="xl" className="lg:col-span-2 relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-purple-100/50 to-transparent rounded-full blur-2xl"></div>
      
      <div className="relative flex-1 flex flex-col">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-baires-blue px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Quick Start Guide
          </div>
          <h2 className="text-3xl font-bold text-neutral-black mb-3">{title}</h2>
          <p className="text-neutral-gray-dark text-lg leading-relaxed">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1">
          {steps.map((step, index) => {
            const colors = getGradientColors(index)
            
            return (
              <div key={index} className="relative group flex">
                <div className={`absolute -top-3 -left-3 w-14 h-14 bg-gradient-to-br ${colors.badge} rounded-full flex items-center justify-center ${colors.shadow} z-10 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
                <div className={`relative overflow-hidden bg-white p-6 pt-10 rounded-[24px] border-2 ${colors.card} transition-all duration-300 flex-1 flex flex-col group-hover:-translate-y-1`}>
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${colors.glow} to-transparent rounded-full blur-2xl`}></div>
                  
                  <div className="relative flex-1 flex flex-col">
                    <div className={`w-16 h-16 bg-gradient-to-br ${colors.iconBg} rounded-[20px] flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      {step.icon && <step.icon className="w-8 h-8 text-white" />}
                    </div>
                    <h3 className="font-bold text-neutral-black text-xl mb-3">{step.title}</h3>
                    <p className="text-base text-neutral-gray-dark leading-relaxed mb-6 flex-1">
                      {step.description}
                    </p>
                    
                    <div className="mt-auto space-y-4">
                      {step.action ? (
                        <button
                          onClick={() => handleStepAction(step)}
                          className={`text-baires-blue font-bold text-base flex items-center gap-2 hover:gap-3 transition-all group/btn cursor-pointer ${colors.badgeText}`}
                        >
                          <span>{step.action.label}</span>
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      ) : (
                        <div className={`inline-flex items-center gap-2 ${colors.badgeBg} px-4 py-2 rounded-full text-sm font-semibold`}>
                          <div className={`w-2 h-2 ${colors.iconBg.split(' ')[0].replace('from-', 'bg-')} rounded-full`}></div>
                          {step.badge}
                        </div>
                      )}
                      
                      {step.footer && (
                        <div className={`pt-4 border-t ${colors.card.split(' ')[0]}`}>
                          <div className={`flex items-center gap-2 text-sm ${colors.badgeText}`}>
                            {step.footer.icon && <step.footer.icon className="w-4 h-4" />}
                            <span className="font-medium">{step.footer.text}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
