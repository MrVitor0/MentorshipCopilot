const colorVariants = {
  blue: {
    gradient: 'from-blue-300/20 via-blue-200/15 to-transparent',
    text: 'text-baires-blue',
    iconBg: 'bg-gradient-to-br from-baires-blue to-blue-600',
    border: 'border-blue-200/50',
  },
  purple: {
    gradient: 'from-purple-300/20 via-purple-200/15 to-transparent',
    text: 'text-purple-600',
    iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    border: 'border-purple-200/50',
  },
  orange: {
    gradient: 'from-orange-300/20 via-orange-200/15 to-transparent',
    text: 'text-baires-blue',
    iconBg: 'bg-gradient-to-br from-baires-blue-light to-baires-blue',
    border: 'border-orange-200/50',
  },
  yellow: {
    gradient: 'from-amber-300/20 via-amber-200/15 to-transparent',
    text: 'text-amber-700',
    iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600',
    border: 'border-amber-200/50',
  },
  green: {
    gradient: 'from-green-300/20 via-green-200/15 to-transparent',
    text: 'text-green-600',
    iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
    border: 'border-green-200/50',
  },
}

export default function StatCard({ value, label, trend, IconComponent, color = 'blue' }) {
  const isPositive = trend?.startsWith('↑') || trend?.startsWith('+')
  const variant = colorVariants[color] || colorVariants.blue // Fallback to blue if color doesn't exist
  
  return (
    <div className={`
      group relative overflow-hidden
      bg-gradient-to-br ${variant.gradient}
      backdrop-blur-sm
      rounded-[24px] p-5
      border ${variant.border}
      shadow-[0_8px_30px_rgb(0,0,0,0.06)]
      hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)]
      hover:-translate-y-1
      transition-all duration-500 ease-out
    `}>
      {/* Decorative blur circle */}
      <div className={`absolute -top-8 -right-8 w-24 h-24 ${variant.iconBg} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-3xl font-bold ${variant.text}`}>{value}</span>
            {trend && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isPositive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {trend}
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-gray-dark font-medium">{label}</p>
        </div>
        
        {IconComponent && (
          <div className={`
            ${variant.iconBg}
            w-12 h-12 rounded-[16px]
            flex items-center justify-center
            shadow-lg
            group-hover:scale-110 group-hover:rotate-3
            transition-all duration-500
          `}>
            <IconComponent className="w-6 h-6 text-white filter drop-shadow-sm" />
          </div>
        )}
      </div>
    </div>
  )
}

