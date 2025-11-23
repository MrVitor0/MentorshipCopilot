import { Target } from 'lucide-react'
import Card from '../Card'
import Badge from '../Badge'

const getIconComponent = (iconName, iconMap) => {
  return iconMap[iconName] || null
}

export default function ActionItemsCard({ 
  opportunities = [],
  iconMap = {}
}) {
  return (
    <Card gradient hover padding="lg">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-baires-blue" />
        <h3 className="text-xl font-bold text-neutral-black">Action Items</h3>
      </div>
      <div className="space-y-4">
        {opportunities.map((opp, index) => {
          const IconComponent = getIconComponent(opp.icon, iconMap)
          return (
            <div key={index} className="group p-5 bg-gradient-to-br from-white to-blue-50/50 rounded-[20px] border border-blue-100/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
              <div className="flex items-start gap-4">
                {IconComponent && (
                  <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-neutral-black">{opp.title}</h4>
                    <Badge variant="warning" className="text-xs">{opp.status}</Badge>
                  </div>
                  <p className="text-sm text-neutral-gray-dark leading-relaxed">{opp.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
