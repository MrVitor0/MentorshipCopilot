import { Rocket, Sparkles, Brain, BarChart3, Zap } from 'lucide-react'
import Card from '../Card'

export default function WelcomeHero() {
  return (
    <Card padding="none" className="overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 border-none shadow-[0_20px_60px_rgb(59,130,246,0.25)]">
      <div className="relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-400/30 to-transparent rounded-full blur-2xl"></div>
        
        <div className="relative p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-[20px] flex items-center justify-center shadow-lg">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-[20px] flex items-center justify-center shadow-lg animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Welcome to Mentorship CoPilot
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl leading-relaxed">
            Transform your team's growth with AI-powered mentorship matching. Find the perfect mentor for any technology, track progress in real-time, and scale your mentorship program effortlessly.
          </p>
          
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-bold">AI Matching</p>
                <p className="text-sm text-white/80">Smart mentor recommendations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-bold">Centralized Hub</p>
                <p className="text-sm text-white/80">All progress in one place</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-bold">Fast Workflow</p>
                <p className="text-sm text-white/80">Create mentorships in minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

