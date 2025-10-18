import { Link } from 'react-router-dom'
import { Bot, TrendingUp, Calendar, BarChart3, CheckCircle, Sparkles } from 'lucide-react'
import SEO from '../components/SEO'

export default function About() {
  return (
    <>
      <SEO 
        title="About"
        description="Learn about Mentorship CoPilot - an AI-powered platform designed to streamline the BairesDev mentorship program through intelligent matching and centralized tracking."
      />
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-orange-50/20 py-12 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-orange-100/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-baires-orange-light/30 to-orange-300/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-neutral-black via-baires-orange to-orange-700 bg-clip-text text-transparent mb-4">
            About MentorshipCopilot
          </h1>
          <p className="text-xl text-neutral-gray-dark">Transforming mentorship through AI</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_20px_70px_rgb(0,0,0,0.1)] border border-white/60 p-8 md:p-12 space-y-8 animate-slideInUp">
          <div className="space-y-4">
            <p className="text-lg text-neutral-gray-dark leading-relaxed">
              MentorshipCopilot is an AI-powered platform designed to streamline 
              the BairesDev mentorship program, making it more efficient, scalable, and results-driven.
            </p>
            <p className="text-lg text-neutral-gray-dark leading-relaxed">
              We solve critical pain points in the mentorship process through intelligent automation and centralized tracking.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-neutral-black mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[14px] flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              Key Features
              <Sparkles className="w-5 h-5 text-baires-orange" />
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { IconComponent: Bot, title: 'Smart AI Matching', desc: 'Find perfect mentors using intelligent algorithms', color: 'from-baires-orange to-orange-600' },
                { IconComponent: TrendingUp, title: 'Progress Tracking', desc: 'Centralized dashboard for all mentorship activities', color: 'from-baires-blue to-blue-600' },
                { IconComponent: Calendar, title: 'Session Management', desc: 'Automated scheduling and session logs', color: 'from-green-500 to-green-600' },
                { IconComponent: BarChart3, title: 'Analytics', desc: 'Performance insights and success metrics', color: 'from-amber-500 to-amber-600' }
              ].map((feature, index) => (
                <div key={index} className="group p-6 bg-gradient-to-br from-white to-orange-50/50 rounded-[24px] border border-orange-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-[16px] flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-black mb-2 flex items-center gap-2">
                    {feature.title}
                    {index === 0 && <Sparkles className="w-4 h-4 text-baires-orange" />}
                  </h3>
                  <p className="text-sm text-neutral-gray-dark">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-baires-blue to-blue-600 text-white px-8 py-4 rounded-[20px] font-bold shadow-[0_10px_30px_rgb(26,115,232,0.3)] hover:shadow-[0_15px_40px_rgb(26,115,232,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </Link>
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-baires-orange to-orange-600 text-white px-8 py-4 rounded-[20px] font-bold shadow-[0_10px_30px_rgb(246,97,53,0.3)] hover:shadow-[0_15px_40px_rgb(246,97,53,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>Go to Dashboard</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
