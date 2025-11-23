export default function SystemStructureInfo({ cards = [] }) {
  return (
    <div className="space-y-4 flex flex-col">
      {cards.map((card, index) => (
        <div 
          key={index}
          className={`group p-6 bg-gradient-to-br ${card.bgGradient} rounded-[20px] border ${card.borderColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex-1`}
        >
          <div className={`w-14 h-14 bg-gradient-to-br ${card.iconBg} rounded-[18px] flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
            {card.icon && <card.icon className="w-7 h-7 text-white" />}
          </div>
          <h4 className="font-bold text-neutral-black mb-2 text-lg">{card.title}</h4>
          <p className="text-sm text-neutral-gray-dark leading-relaxed mb-3">
            {card.description}
          </p>
          <div className={`flex items-center gap-2 text-xs ${card.badgeColor} ${card.badgeBg} px-2 py-1 rounded-lg`}>
            {card.badgeIcon && <card.badgeIcon className="w-3 h-3" />}
            <span className="font-medium">{card.badge}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
