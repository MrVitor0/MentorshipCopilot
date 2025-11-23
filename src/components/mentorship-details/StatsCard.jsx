import Card from '../Card'

export default function StatsCard({ icon: Icon, label, value, variant = 'blue' }) {
  const variants = {
    blue: 'from-blue-50 to-blue-100/50 border-blue-200 text-baires-blue',
    green: 'from-green-50 to-green-100/50 border-green-200 text-green-600',
    purple: 'from-purple-50 to-purple-100/50 border-purple-200 text-purple-600',
    orange: 'from-orange-50 to-blue-100/50 border-orange-200 text-baires-blue'
  }

  return (
    <Card padding="md" className={`bg-gradient-to-br ${variants[variant]} border-2`}>
      <Icon className={`w-8 h-8 mb-2 ${variants[variant].split(' ').pop()}`} />
      <div className="text-xs font-bold uppercase text-neutral-gray-dark mb-1">{label}</div>
      <div className="text-xl font-bold text-neutral-black">{value}</div>
    </Card>
  )
}

