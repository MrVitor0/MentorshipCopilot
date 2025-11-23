import Avatar from './Avatar'
import Badge from './Badge'

export default function ActivityItem({ user, action, subject, badges = [], time, avatar }) {
  return (
    <div className="group flex gap-4 p-4 rounded-[18px] bg-gradient-to-r from-white to-neutral-50/50 hover:from-orange-50/30 hover:to-blue-100/20 border border-neutral-100 hover:border-orange-200/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
      <Avatar src={avatar} size="md" initials={user?.substring(0, 2).toUpperCase()} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-sm leading-relaxed">
            <span className="font-bold text-neutral-black">{user}</span>
            {' '}
            <span className="text-neutral-gray-dark">{action}</span>
            {' '}
            <span className="font-semibold text-neutral-black">{subject}</span>
          </p>
          <span className="text-xs text-neutral-gray-dark whitespace-nowrap font-medium">{time}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <Badge key={index} variant={badge.variant || 'orange'}>
              {badge.text}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

