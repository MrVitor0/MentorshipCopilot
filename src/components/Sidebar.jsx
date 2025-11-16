import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import usePermissions from '../hooks/usePermissions'
import Avatar from './Avatar'
import { Lightbulb, Palette, Settings as SettingsIcon, BarChart3, LogOut, ChevronDown } from 'lucide-react'

const menuItems = [
  { 
    name: 'Home', 
    path: '/dashboard',
    permission: null, // Everyone can access
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    )
  },
  { 
    name: 'Mentorship', 
    path: '/mentorship',
    permission: null, // Everyone can access their mentorships
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
      </svg>
    )
  },
]

const teamItems = [
  { name: 'Ideas', color: 'bg-yellow-400', IconComponent: Lightbulb },
  { name: 'Design', color: 'bg-baires-indigo', IconComponent: Palette },
  { name: 'Operations', color: 'bg-yellow-300', IconComponent: SettingsIcon },
  { name: 'Management', color: 'bg-yellow-500', IconComponent: BarChart3 },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const permissions = usePermissions()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <aside className="w-64 bg-gradient-to-b from-white to-neutral-50 h-screen flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-r border-neutral-100">
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Mentorship CoPilot Logo" className="w-10 h-10 rounded-[14px] shadow-lg" />
          <span className="font-bold text-xl bg-gradient-to-r from-neutral-black to-baires-indigo bg-clip-text text-transparent">CoPilot</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          // Check if user has permission to see this menu item
          if (item.permission && !permissions[item.permission]) {
            return null // Don't render if no permission
          }

          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-[16px]
                transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-baires-indigo to-indigo-600 text-white shadow-[0_8px_20px_rgb(79,70,229,0.3)]' 
                  : 'text-neutral-gray-dark hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100/50 hover:text-neutral-black hover:shadow-md'
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
            className="group flex items-center gap-3 px-4 py-3 rounded-[16px] text-neutral-gray-dark hover:bg-gradient-to-r hover:from-indigo-50 hover:to-yellow-50 hover:text-neutral-black hover:shadow-md transition-all duration-300"
          >
            <div className={`w-7 h-7 ${team.color} rounded-[12px] flex items-center justify-center text-sm shadow-md group-hover:scale-110 transition-transform duration-300`}>
              <team.IconComponent className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">{team.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-100 space-y-3">
        {/* Profile Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-100 to-indigo-200/70 rounded-[18px] shadow-sm border border-indigo-200/50 hover:shadow-md transition-all duration-300"
          >
            <div className="relative">
              <Avatar 
                src={user?.photoURL}
                initials={user?.displayName?.substring(0, 2)?.toUpperCase() || 'U'}
                size="lg"
                ring
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="font-bold text-neutral-black text-sm truncate">{user?.displayName || 'User'}</p>
              <p className="text-xs text-neutral-gray-dark truncate">{user?.email || ''}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-neutral-gray-dark transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-[16px] shadow-xl border border-neutral-200 overflow-hidden">
              <Link
                to="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-3 px-4 py-3 text-neutral-gray-dark hover:text-neutral-black hover:bg-neutral-50 transition-all duration-300"
              >
                <SettingsIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">Settings</span>
              </Link>
              <button 
                onClick={() => {
                  setShowProfileMenu(false)
                  handleLogout()
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-neutral-gray-dark hover:text-red-600 hover:bg-red-50 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-semibold">Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

