export default function ProgressBar({ 
  value = 0, 
  max = 100,
  color = 'blue',
  height = 'md',
  label,
  showValue = false,
  className = '' 
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  const colors = {
    blue: 'bg-gradient-to-r from-baires-blue to-blue-600',
    orange: 'bg-gradient-to-r from-baires-blue to-blue-600',
    cyan: 'bg-gradient-to-r from-baires-blue to-blue-500',
    purple: 'bg-gradient-to-r from-baires-blue-light to-baires-blue',
    green: 'bg-gradient-to-r from-green-400 to-green-600',
  }

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-neutral-gray-dark font-medium">{label}</span>
          {showValue && (
            <span className="text-sm font-bold text-neutral-black">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`relative w-full bg-neutral-100 rounded-full overflow-hidden ${heights[height]} shadow-inner`}>
        <div
          className={`${colors[color]} ${heights[height]} rounded-full transition-all duration-700 ease-out shadow-sm`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

