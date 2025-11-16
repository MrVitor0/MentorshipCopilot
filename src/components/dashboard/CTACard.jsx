import { ArrowRight } from 'lucide-react'

export default function CTACard({ 
  title, 
  description, 
  icon: Icon, 
  tags = [], 
  gradient = 'from-baires-indigo via-indigo-500 to-indigo-600',
  shadowColor = 'rgb(249,115,22,0.3)',
  shadowColorHover = 'rgb(249,115,22,0.4)',
  onClick 
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden bg-gradient-to-br ${gradient} rounded-[24px] p-8 border-none transition-all duration-500 hover:-translate-y-2 text-left w-full`}
      style={{
        boxShadow: `0 20px 50px ${shadowColor}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 30px 60px ${shadowColorHover}`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 20px 50px ${shadowColor}`
      }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-[20px] flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
          {title}
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
        </h3>
        <p className="text-white/90 text-base mb-6 leading-relaxed">
          {description}
        </p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm text-white/90 font-medium">Ready to start</span>
        </div>
      </div>
    </button>
  )
}

