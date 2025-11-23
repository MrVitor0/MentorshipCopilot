import { BarChart3, TrendingUp } from 'lucide-react'

export default function ProgressChart({ sessions = [] }) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="p-6 bg-gradient-to-br from-neutral-50 to-white rounded-[20px] border border-neutral-200 text-center">
        <div className="py-8">
          <BarChart3 className="w-12 h-12 text-neutral-gray-dark mx-auto mb-3 opacity-50" />
          <h4 className="text-lg font-bold text-neutral-black mb-2">No Session Data Yet</h4>
          <p className="text-sm text-neutral-gray-dark">
            Progress tracking will appear here once sessions are logged
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gradient-to-br from-neutral-50 to-white rounded-[20px] border border-neutral-200">
      <h3 className="text-lg font-bold text-neutral-black mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-baires-blue" />
        Progress Trend Over Time
      </h3>
      
      {/* Simple Line Chart */}
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-neutral-gray-dark font-semibold">
          <span>5</span>
          <span>4</span>
          <span>3</span>
          <span>2</span>
          <span>1</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-8 h-full relative">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute w-full border-t border-neutral-200"
              style={{ top: `${i * 25}%` }}
            ></div>
          ))}
          
          {/* Data points and line */}
          <svg className="w-full h-full">
            {/* Line */}
            <polyline
              points={sessions.map((session, i) => {
                const x = (i / (sessions.length - 1)) * 100
                const y = 100 - ((session.progressRating / 5) * 100)
                return `${x}%,${y}%`
              }).join(' ')}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              className="drop-shadow-md"
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F66135" />
                <stop offset="100%" stopColor="#FBB39E" />
              </linearGradient>
            </defs>
            
            {/* Points */}
            {sessions.map((session, i) => {
              const x = (i / (sessions.length - 1)) * 100
              const y = 100 - ((session.progressRating / 5) * 100)
              return (
                <g key={i}>
                  <circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="6"
                    fill="white"
                    stroke="#F66135"
                    strokeWidth="3"
                    className="cursor-pointer hover:r-8 transition-all"
                  />
                  <title>Session {i + 1}: {session.progressRating}/5</title>
                </g>
              )
            })}
          </svg>
        </div>
        
        {/* X-axis labels */}
        <div className="ml-8 mt-2 flex justify-between text-xs text-neutral-gray-dark font-semibold">
          {sessions.map((_, i) => (
            <span key={i}>S{i + 1}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

