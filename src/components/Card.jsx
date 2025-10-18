export default function Card({ 
  children, 
  className = '',
  hover = false,
  padding = 'md',
  gradient = false,
  ...props 
}) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
    none: '',
  }

  return (
    <div
      className={`
        ${gradient ? 'bg-gradient-to-br from-white to-neutral-50' : 'bg-neutral-white'}
        rounded-[28px] 
        shadow-[0_8px_30px_rgb(0,0,0,0.08)]
        border border-neutral-100
        backdrop-blur-sm
        ${hover ? 'hover:shadow-[0_20px_50px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500 ease-out' : 'transition-shadow duration-300'}
        ${paddings[padding]}
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
      }}
      {...props}
    >
      {children}
    </div>
  )
}

