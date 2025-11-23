import { Sparkles, ArrowRight } from 'lucide-react'
import Card from '../Card'

export default function ActionCTA({ 
  onClick, 
  title, 
  description, 
  buttonText, 
  buttonIcon: ButtonIcon, // eslint-disable-line no-unused-vars
  icon: Icon, // eslint-disable-line no-unused-vars
  badge,
  features = [],
  bgGradient = 'from-baires-blue via-blue-600 to-blue-700',
  buttonTextColor = 'text-baires-blue'
}) {
  return (
    <Card padding="none" className="overflow-hidden group  hover:shadow-2xl transition-all duration-300" >
      <div className={`relative bg-gradient-to-br ${bgGradient} p-8`}>
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <span className="text-white font-bold text-sm">{badge}</span>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-3">
                {title}
              </h3>
              <p className="text-white/90 leading-relaxed mb-6">
                {description}
              </p>

              {features.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <feature.icon className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-semibold">{feature.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={onClick} className={`bg-white cursor-pointer ${buttonTextColor} px-8 py-4 rounded-[16px] font-bold text-lg shadow-2xl hover:scale-105 hover:shadow-3xl transition-all duration-300 flex items-center gap-3 group-hover:gap-4`}>
                <ButtonIcon className="w-6 h-6" />
                {buttonText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="hidden lg:block ml-6">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-[24px] flex items-center justify-center group-hover:rotate-6 transition-transform duration-500">
                <Icon className="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

