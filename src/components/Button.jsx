const variants = {
  primary: 'bg-gradient-to-r from-baires-blue to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-[0_8px_20px_rgb(26,115,232,0.25)] hover:shadow-[0_12px_30px_rgb(26,115,232,0.35)]',
  secondary: 'bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-black hover:from-neutral-200 hover:to-neutral-300 shadow-[0_4px_15px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgb(0,0,0,0.12)]',
  orange: 'bg-gradient-to-r from-baires-orange to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-[0_8px_20px_rgb(246,97,53,0.25)] hover:shadow-[0_12px_30px_rgb(246,97,53,0.35)]',
  outline: 'border-2 border-neutral-200 text-neutral-black hover:border-orange-300 hover:bg-orange-50/30 shadow-sm hover:shadow-md',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon,
  className = '',
  ...props 
}) {
  return (
    <button
      className={`
        cursor-pointer
        inline-flex items-center justify-center gap-2 
        rounded-[16px] font-bold 
        hover:-translate-y-0.5 
        transition-all duration-300 
        group
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="group-hover:scale-110 transition-transform">{icon}</span>}
      {children}
    </button>
  )
}

