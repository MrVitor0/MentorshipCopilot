import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, ArrowRight, Play, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import SEO from '../components/SEO'

export default function Home() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard')
    }
  }, [user, loading, navigate])

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-orange-50/15">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-baires-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-gray-dark font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  // Only render home page if user is not logged in
  if (user) {
    return null // Will redirect via useEffect
  }

  return (
    <>
      <SEO 
        title="Home"
        description="Transform your mentorship program with AI-powered matching. Connect with perfect mentors and track progress effortlessly."
      />
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-orange-50/20 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-orange-300/25 to-orange-100/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl w-full bg-white/80 backdrop-blur-xl rounded-[40px] shadow-[0_20px_70px_rgb(0,0,0,0.1)] border border-white/60 overflow-hidden relative">
        <div className="grid md:grid-cols-2 gap-12 items-center p-8 md:p-16 lg:p-20">
          {/* Left Content Section */}
          <div className="space-y-8 animate-fadeIn relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-baires-orange to-orange-600 rounded-full px-5 py-2.5 shadow-[0_8px_20px_rgb(246,97,53,0.3)] hover:scale-105 hover:shadow-[0_12px_30px_rgb(246,97,53,0.4)] transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="font-semibold text-white text-sm">AI-Powered Matching</span>
            </div>

            {/* Main Title */}
            <div>
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-neutral-black via-baires-orange to-orange-700 bg-clip-text text-transparent leading-tight mb-4">
                Transform
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-gray-dark">
                Your Mentorship
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-lg text-neutral-gray-dark leading-relaxed max-w-lg">
              Connect with the perfect mentors using intelligent matching. Track progress, manage sessions, and scale your mentorship program effortlessly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/dashboard" 
                className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-baires-orange to-orange-600 text-white px-8 py-4 rounded-[20px] font-semibold shadow-[0_10px_30px_rgb(246,97,53,0.3)] hover:shadow-[0_15px_40px_rgb(246,97,53,0.4)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <Zap className="w-5 h-5" />
                <span className="text-lg">Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <button className="inline-flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm text-neutral-black px-8 py-4 rounded-[20px] font-semibold border-2 border-neutral-200 hover:border-orange-300 hover:bg-white/80 transition-all duration-300">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-neutral-black">250+</div>
                <div className="text-sm text-neutral-gray-dark">Active Mentors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-neutral-black">98%</div>
                <div className="text-sm text-neutral-gray-dark">Match Success</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-neutral-black">1.5k+</div>
                <div className="text-sm text-neutral-gray-dark">Sessions</div>
              </div>
            </div>
          </div>

          {/* Right Illustration Section */}
          <div className="relative h-[500px] md:h-[600px]">
            <div className="relative z-10 h-full flex items-center justify-center">
              {/* 3D Card Stack Effect */}
              <div className="relative w-full max-w-sm">
                {/* Background Cards */}
                <div className="absolute inset-0 bg-gradient-to-br from-baires-orange-light to-orange-300 rounded-[32px] opacity-20 blur-xl transform rotate-6 scale-95"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[32px] opacity-15 blur-xl transform -rotate-6 scale-95"></div>
                
                {/* Main Floating Card */}
                <div className="relative bg-gradient-to-br from-white to-orange-50/50 rounded-[32px] p-8 shadow-[0_30px_60px_rgb(0,0,0,0.15)] border border-white/60 backdrop-blur-sm animate-float">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-baires-orange to-orange-600 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-neutral-black text-lg flex items-center gap-2">
                          AI Matching
                          <Zap className="w-4 h-4 text-baires-orange" />
                        </div>
                        <div className="text-sm text-neutral-gray-dark">Find perfect mentors</div>
                      </div>
                    </div>
                    
                    {/* Progress Bars */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-neutral-gray-dark">Compatibility</span>
                          <span className="font-semibold text-baires-orange">95%</span>
                        </div>
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-baires-orange to-orange-600 rounded-full" style={{width: '95%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-neutral-gray-dark">Skills Match</span>
                          <span className="font-semibold text-baires-blue">88%</span>
                        </div>
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-baires-blue to-blue-600 rounded-full" style={{width: '88%'}}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mentor Cards */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-[16px] shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-baires-orange-light to-baires-orange"></div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-neutral-black">Sarah Johnson</div>
                          <div className="text-xs text-neutral-gray-dark">Senior Engineer</div>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-[16px] shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-baires-blue to-blue-600"></div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-neutral-black">Mike Chen</div>
                          <div className="text-xs text-neutral-gray-dark">Tech Lead</div>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-baires-orange-light to-orange-400 rounded-[20px] opacity-60 blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[20px] opacity-60 blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
