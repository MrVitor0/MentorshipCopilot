import { Link, useLocation } from 'react-router-dom'
import { Lightbulb, Palette, Settings, BarChart3 } from 'lucide-react'

const menuItems = [
  { 
    name: 'Home', 
    path: '/dashboard', 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    )
  },
  { 
    name: 'Mentorship', 
    path: '/mentorship', 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
      </svg>
    )
  },

  { 
    name: 'Feedback', 
    path: '/feedback', 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
      </svg>
    )
  },
]

const teamItems = [
  { name: 'Ideas', color: 'bg-yellow-400', IconComponent: Lightbulb },
  { name: 'Design', color: 'bg-baires-orange', IconComponent: Palette },
  { name: 'Operations', color: 'bg-yellow-300', IconComponent: Settings },
  { name: 'Management', color: 'bg-yellow-500', IconComponent: BarChart3 },
]

export default function Sidebar({ user }) {
  const location = useLocation()

  return (
    <aside className="w-64 bg-gradient-to-b from-white to-neutral-50 h-screen flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-r border-neutral-100">
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Mentorship CoPilot Logo" className="w-10 h-10 rounded-[14px] shadow-lg" />
          <span className="font-bold text-xl bg-gradient-to-r from-neutral-black to-baires-orange bg-clip-text text-transparent">CoPilot</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-[16px]
                transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-baires-orange to-orange-600 text-white shadow-[0_8px_20px_rgb(246,97,53,0.3)]' 
                  : 'text-neutral-gray-dark hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/50 hover:text-neutral-black hover:shadow-md'
                }
              `}
            >
              {item.icon}
              <span className="font-semibold">{item.name}</span>
            </Link>
          )
        })}

        <div className="pt-6 pb-2">
          <h3 className="px-4 text-xs font-bold text-neutral-gray-dark uppercase tracking-wider">
            Teams
          </h3>
        </div>

        {teamItems.map((team) => (
          <Link
            key={team.name}
            to={`/teams/${team.name.toLowerCase()}`}
            className="group flex items-center gap-3 px-4 py-3 rounded-[16px] text-neutral-gray-dark hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:text-neutral-black hover:shadow-md transition-all duration-300"
          >
            <div className={`w-7 h-7 ${team.color} rounded-[12px] flex items-center justify-center text-sm shadow-md group-hover:scale-110 transition-transform duration-300`}>
              <team.IconComponent className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">{team.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-100 space-y-3">
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-100 to-orange-200/70 rounded-[18px] shadow-sm border border-orange-200/50">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white">
            <img 
              src={user?.avatar || 'https://i.pravatar.cc/150?img=33'} 
              alt={user?.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-neutral-black text-sm truncate">{user?.name || 'Alex Smith'}</p>
            <p className="text-xs text-neutral-gray-dark truncate">{user?.email || 'alexsmith@example.io'}</p>
          </div>
        </div>

        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-[14px] text-neutral-gray-dark hover:text-neutral-black hover:bg-neutral-100 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-semibold">Settings</span>
        </Link>

        <button className="flex items-center gap-3 px-4 py-2 rounded-[14px] text-neutral-gray-dark hover:text-neutral-black hover:bg-neutral-100 transition-all duration-300 w-full">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-semibold">Log out</span>
        </button>
      </div>
    </aside>
  )
}

