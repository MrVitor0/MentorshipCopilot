export default function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  bgGradient = 'bg-gradient-to-br from-blue-50 to-white',
  borderColor = 'border-blue-100',
  iconGradient = 'bg-gradient-to-br from-baires-blue to-blue-600'
}) {
  return (
    <div className={`group p-6 ${bgGradient} rounded-[20px] border ${borderColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
      <div className={`w-14 h-14 ${iconGradient} rounded-[18px] flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h4 className="font-bold text-neutral-black mb-2 text-lg">{title}</h4>
      <p className="text-sm text-neutral-gray-dark leading-relaxed">
        {description}
      </p>
    </div>
  )
}

