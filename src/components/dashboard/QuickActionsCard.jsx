import { Zap, Plus, Search, FolderKanban, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../Card'

const actions = [
  {
    id: 1,
    title: 'New Mentorship',
    description: 'Create a new mentorship request',
    icon: Plus,
    path: '/create-mentorship',
    gradient: 'from-white to-indigo-50',
    border: 'border-indigo-200 hover:border-indigo-400',
    shadow: 'hover:shadow-[0_10px_30px_rgba(79,70,229,0.2)]',
    iconGradient: 'from-baires-indigo to-indigo-600',
    hoverColor: 'group-hover:text-baires-indigo',
    arrowHover: 'group-hover:text-baires-indigo'
  },
  {
    id: 2,
    title: 'Find Mentor',
    description: 'Browse available mentors',
    icon: Search,
    path: '/mentors',
    gradient: 'from-white to-blue-50',
    border: 'border-blue-200 hover:border-blue-400',
    shadow: 'hover:shadow-[0_10px_30px_rgba(26,115,232,0.2)]',
    iconGradient: 'from-baires-blue to-blue-600',
    hoverColor: 'group-hover:text-baires-blue',
    arrowHover: 'group-hover:text-baires-blue'
  },
  {
    id: 3,
    title: 'View All Projects',
    description: 'Manage all mentorships',
    icon: FolderKanban,
    path: '/mentorship',
    gradient: 'from-white to-purple-50',
    border: 'border-purple-200 hover:border-purple-400',
    shadow: 'hover:shadow-[0_10px_30px_rgba(168,85,247,0.2)]',
    iconGradient: 'from-purple-500 to-purple-600',
    hoverColor: 'group-hover:text-purple-600',
    arrowHover: 'group-hover:text-purple-600'
  }
]

export default function QuickActionsCard() {
  const navigate = useNavigate()

  return (
    <Card padding="lg" className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 border-2 border-indigo-100 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-baires-indigo to-indigo-600 rounded-[14px] flex items-center justify-center shadow-lg">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-neutral-black">Quick Actions</h3>
          <p className="text-xs text-neutral-gray-dark">Shortcuts to common tasks</p>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {actions.map((action) => (
          <button 
            key={action.id}
            onClick={() => navigate(action.path)}
            className={`group w-full p-5 bg-gradient-to-br ${action.gradient} rounded-[16px] border-2 ${action.border} ${action.shadow} transition-all duration-300 hover:-translate-y-1 text-left cursor-pointer`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${action.iconGradient} rounded-[14px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-neutral-black mb-1 ${action.hoverColor} transition-colors`}>{action.title}</h4>
                <p className="text-xs text-neutral-gray-dark">{action.description}</p>
              </div>
              <ArrowRight className={`w-5 h-5 text-neutral-gray-dark ${action.arrowHover} group-hover:translate-x-1 transition-all`} />
            </div>
          </button>
        ))}
      </div>
    </Card>
  )
}

