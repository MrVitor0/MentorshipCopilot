import { Brain, BarChart3, Zap } from 'lucide-react'
import Card from '../Card'
import FeatureCard from './FeatureCard'

export default function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: 'Smart Matching',
      description: 'AI analyzes your team to suggest the 3 most compatible mentors, even for niche technologies.',
      bgGradient: 'bg-gradient-to-br from-blue-50 to-white',
      borderColor: 'border-blue-100',
      iconGradient: 'bg-gradient-to-br from-baires-blue to-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Centralized Tracking',
      description: 'No more scattered spreadsheets. Track all mentorship progress from one unified dashboard.',
      bgGradient: 'bg-gradient-to-br from-indigo-50 to-white',
      borderColor: 'border-indigo-100',
      iconGradient: 'bg-gradient-to-br from-baires-indigo to-indigo-600'
    },
    {
      icon: Zap,
      title: 'Fast & Efficient',
      description: 'Create mentorships in minutes. Automate admin work and focus on team development.',
      bgGradient: 'bg-gradient-to-br from-purple-50 to-white',
      borderColor: 'border-purple-100',
      iconGradient: 'bg-gradient-to-br from-purple-500 to-purple-600'
    }
  ]

  return (
    <Card gradient padding="xl">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-neutral-black mb-2">Why Use Mentorship CoPilot?</h3>
        <p className="text-neutral-gray-dark">Built to solve real PM challenges</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            bgGradient={feature.bgGradient}
            borderColor={feature.borderColor}
            iconGradient={feature.iconGradient}
          />
        ))}
      </div>
    </Card>
  )
}

