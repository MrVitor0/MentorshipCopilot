import { CheckCircle } from 'lucide-react'
import Card from '../Card'

export default function WhyUseSection({ 
  icon: Icon,
  title = "Solve Real PM Challenges",
  subtitle = "Built specifically to address the pain points Project Managers face daily",
  benefits = []
}) {
  return (
    <Card padding="xl" className="bg-gradient-to-br from-purple-50 via-white to-blue-50 border-2 border-purple-100/50">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-[18px] flex items-center justify-center shadow-lg flex-shrink-0">
          {Icon && <Icon className="w-8 h-8 text-white" />}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-neutral-black mb-2">{title}</h3>
          <p className="text-neutral-gray-dark text-sm leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-neutral-black text-sm mb-1">{benefit.title}</p>
              <p className="text-xs text-neutral-gray-dark leading-relaxed">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
