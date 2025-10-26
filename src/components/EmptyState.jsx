import { Sparkles } from 'lucide-react'

export default function EmptyState({ 
  icon: IconComponent = Sparkles, 
  title = "No results yet", 
  description = "When there's data, it will appear here",
  action = null
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-[20px] flex items-center justify-center mb-4">
        <IconComponent className="w-8 h-8 text-neutral-400" />
      </div>
      <h3 className="text-lg font-bold text-neutral-black mb-2">{title}</h3>
      <p className="text-sm text-neutral-gray-dark mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  )
}

