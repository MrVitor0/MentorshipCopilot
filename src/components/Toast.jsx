import { useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const variants = {
  success: {
    icon: CheckCircle,
    bgGradient: 'from-green-50 to-green-100/50',
    border: 'border-green-200',
    iconBg: 'from-green-500 to-green-600',
    iconColor: 'text-white',
    textColor: 'text-green-900',
    descColor: 'text-green-700'
  },
  error: {
    icon: XCircle,
    bgGradient: 'from-red-50 to-red-100/50',
    border: 'border-red-200',
    iconBg: 'from-red-500 to-red-600',
    iconColor: 'text-white',
    textColor: 'text-red-900',
    descColor: 'text-red-700'
  },
  warning: {
    icon: AlertCircle,
    bgGradient: 'from-amber-50 to-amber-100/50',
    border: 'border-amber-200',
    iconBg: 'from-amber-500 to-amber-600',
    iconColor: 'text-white',
    textColor: 'text-amber-900',
    descColor: 'text-amber-700'
  },
  info: {
    icon: Info,
    bgGradient: 'from-blue-50 to-blue-100/50',
    border: 'border-blue-200',
    iconBg: 'from-blue-500 to-blue-600',
    iconColor: 'text-white',
    textColor: 'text-blue-900',
    descColor: 'text-blue-700'
  }
}

export default function Toast({ 
  variant = 'info', 
  title, 
  description, 
  onClose, 
  duration = 5000,
  show = false 
}) {
  const variantConfig = variants[variant]
  const Icon = variantConfig.icon

  useEffect(() => {
    if (show && duration && onClose) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration, onClose])

  if (!show) return null

  return (
    <div className="fixed top-6 right-6 z-[100] animate-slideInRight">
      <div className={`
        bg-gradient-to-br ${variantConfig.bgGradient}
        border-2 ${variantConfig.border}
        rounded-[16px] shadow-2xl
        p-5 pr-12
        max-w-md
        relative
        backdrop-blur-sm
      `}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 bg-white/50 hover:bg-white/80 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-neutral-gray-dark" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`
            w-12 h-12 
            bg-gradient-to-br ${variantConfig.iconBg}
            rounded-[14px] 
            flex items-center justify-center 
            shadow-lg
            flex-shrink-0
          `}>
            <Icon className={`w-6 h-6 ${variantConfig.iconColor}`} />
          </div>

          <div className="flex-1 pt-1">
            <h4 className={`text-lg font-bold ${variantConfig.textColor} mb-1`}>
              {title}
            </h4>
            {description && (
              <p className={`text-sm ${variantConfig.descColor} leading-relaxed`}>
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-b-[16px] overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${variantConfig.iconBg}`}
            style={{
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slideInRight {
          animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  )
}

