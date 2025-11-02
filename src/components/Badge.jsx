const variants = {
  orange: 'bg-gradient-to-r from-orange-100 to-orange-200/70 text-baires-orange border-orange-200',
  blue: 'bg-gradient-to-r from-blue-100 to-blue-200/70 text-baires-blue border-blue-200',
  gray: 'bg-gradient-to-r from-neutral-100 to-neutral-200/70 text-neutral-gray-dark border-neutral-200',
  success: 'bg-gradient-to-r from-green-100 to-green-200/70 text-green-700 border-green-200',
  warning: 'bg-gradient-to-r from-yellow-100 to-yellow-200/70 text-yellow-700 border-yellow-200',
  purple: 'bg-gradient-to-r from-purple-100 to-purple-200/70 text-purple-700 border-purple-200',
}

export default function Badge({ 
  children, 
  variant = 'orange',
  className = '',
  ...props 
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-3 py-1.5
        rounded-full
        text-xs font-bold
        border
        shadow-sm
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  )
}

