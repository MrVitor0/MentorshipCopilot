const sizes = {
  xs: 'w-8 h-8 text-xs',
  sm: 'w-10 h-10 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-3xl',
  '2xl': 'w-32 h-32 text-5xl',
  '3xl': 'w-40 h-40 text-6xl',
}

export default function Avatar({ 
  src, 
  alt = 'Avatar', 
  size = 'md',
  initials,
  ring = false,
  className = '' 
}) {
  return (
    <div className={`relative ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`
            ${sizes[size]} 
            rounded-full 
            object-cover
            ${ring ? 'ring-4 ring-baires-orange ring-offset-4' : ''}
          `}
        />
      ) : (
        <div
          className={`
            ${sizes[size]} 
            rounded-full 
            bg-gradient-to-br from-baires-orange to-baires-blue
            flex items-center justify-center
            font-bold text-neutral-white
            ${ring ? 'ring-4 ring-baires-orange ring-offset-4' : ''}
          `}
        >
          {initials || 'ME'}
        </div>
      )}
    </div>
  )
}

