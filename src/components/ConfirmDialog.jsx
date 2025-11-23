import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import Button from './Button'

const typeConfig = {
  success: {
    icon: CheckCircle,
    bgGradient: 'from-green-50 to-green-100/50',
    border: 'border-green-200',
    iconBg: 'from-green-500 to-green-600',
    iconColor: 'text-white',
    titleColor: 'text-green-900',
    confirmVariant: 'primary'
  },
  error: {
    icon: XCircle,
    bgGradient: 'from-red-50 to-red-100/50',
    border: 'border-red-200',
    iconBg: 'from-red-500 to-red-600',
    iconColor: 'text-white',
    titleColor: 'text-red-900',
    confirmVariant: 'primary'
  },
  warning: {
    icon: AlertCircle,
    bgGradient: 'from-amber-50 to-amber-100/50',
    border: 'border-amber-200',
    iconBg: 'from-amber-500 to-amber-600',
    iconColor: 'text-white',
    titleColor: 'text-amber-900',
    confirmVariant: 'orange'
  },
  info: {
    icon: Info,
    bgGradient: 'from-blue-50 to-blue-100/50',
    border: 'border-blue-200',
    iconBg: 'from-blue-500 to-blue-600',
    iconColor: 'text-white',
    titleColor: 'text-blue-900',
    confirmVariant: 'primary'
  }
}

export default function ConfirmDialog({
  isOpen,
  type = 'info',
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
  onConfirm,
  onCancel,
  onClose
}) {
  if (!isOpen) return null

  const config = typeConfig[type]
  const Icon = config.icon

  const handleConfirm = () => {
    if (onConfirm) onConfirm()
    if (onClose) onClose()
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
    if (onClose) onClose()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md animate-scaleIn">
        <div className={`
          bg-gradient-to-br ${config.bgGradient}
          border-2 ${config.border}
          rounded-[24px] shadow-2xl
          overflow-hidden
          relative
        `}>
          {/* Close Button */}
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 w-10 h-10 bg-white/50 hover:bg-white/80 rounded-full flex items-center justify-center transition-all z-10"
          >
            <X className="w-5 h-5 text-neutral-gray-dark" />
          </button>

          {/* Icon Header */}
          <div className="flex justify-center pt-8 pb-4">
            <div className={`
              w-20 h-20 
              bg-gradient-to-br ${config.iconBg}
              rounded-[20px] 
              flex items-center justify-center 
              shadow-lg
              animate-float
            `}>
              <Icon className={`w-10 h-10 ${config.iconColor}`} />
            </div>
          </div>

          {/* Content */}
          <div className="px-8 pb-8 text-center">
            <h3 className={`text-2xl font-bold ${config.titleColor} mb-3`}>
              {title}
            </h3>
            
            {message && (
              <p className="text-neutral-gray-dark leading-relaxed whitespace-pre-line">
                {message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="px-8 pb-8 flex items-center justify-center gap-3">
            {showCancel && (
              <Button
                variant="secondary"
                size="md"
                onClick={handleCancel}
                className="flex-1"
              >
                {cancelText}
              </Button>
            )}
            <Button
              variant={config.confirmVariant}
              size="md"
              onClick={handleConfirm}
              className={showCancel ? 'flex-1' : 'min-w-[150px]'}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
