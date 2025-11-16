import { Users, FolderKanban, Briefcase, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../Card'

export default function TeamsProjectsCard() {
  const navigate = useNavigate()

  return (
    <Card padding="none" className="overflow-hidden bg-gradient-to-br from-baires-indigo via-indigo-600 to-blue-600 text-white border-none shadow-[0_20px_50px_rgba(79,70,229,0.4)]">
      <div className="relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
        
        <div className="relative p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-[18px] flex items-center justify-center shadow-lg">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Teams & Projects</h3>
              <p className="text-sm opacity-90">Organize your structure</p>
            </div>
          </div>

          <p className="text-sm mb-6 opacity-90 leading-relaxed">
            Create and manage teams with multiple PMs. Each team can have multiple projects with dedicated mentees and mentors.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-[14px] border border-white/20">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm mb-1">Create Teams</p>
                <p className="text-xs opacity-80">Organize PMs into collaborative teams</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-[14px] border border-white/20">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <FolderKanban className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm mb-1">Launch Projects</p>
                <p className="text-xs opacity-80">Each team manages multiple projects</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-[14px] border border-white/20">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm mb-1">AI-Matched Mentors</p>
                <p className="text-xs opacity-80">Mentors added dynamically as needed</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('/teams')}
              className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-[14px] transition-all duration-300 border border-white/30 hover:scale-105 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span className="text-sm">Teams</span>
            </button>
            <button 
              onClick={() => navigate('/projects')}
              className="w-full bg-white text-baires-indigo hover:bg-white/90 font-semibold py-3 px-4 rounded-[14px] transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <FolderKanban className="w-4 h-4" />
              <span className="text-sm">Projects</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}

