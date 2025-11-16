import { Users, MessageSquare, Target, Calendar, TrendingUp, Sparkles, FolderKanban, BarChart3, CheckCircle, Clock, AlertTriangle, Briefcase, ArrowRight, Search, Plus, Brain, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../Card'
import Button from '../Button'
import Avatar from '../Avatar'
import Badge from '../Badge'
import StatCard from '../StatCard'
import EmptyState from '../EmptyState'

const opportunities = [
  { title: 'Team Performance', description: 'Review team progress this week.', status: 'Action', icon: 'trending-up' },
  { title: 'Resource Allocation', description: 'Optimize mentor assignments.', status: 'Review', icon: 'users' },
  { title: 'Goal Tracking', description: 'Update quarterly objectives.', status: 'Pending', icon: 'target' },
]

const getIconComponent = (iconName) => {
  const icons = { 'trending-up': TrendingUp, 'users': Users, 'target': Target, 'sparkles': Sparkles }
  return icons[iconName] || Sparkles
}

export default function PMDashboard({ user, upcomingSessions, mentorships, loading }) {
  const navigate = useNavigate()
  
  // Calculate PM-specific metrics
  const activeProjects = mentorships.length
  const completedSessions = Math.floor(activeProjects * 0.7) // Mock data
  const pendingReviews = Math.floor(activeProjects * 0.3) // Mock data
  const teamGrowth = activeProjects > 0 ? '+12%' : '0%'
  
  const hasNoMentorships = mentorships.length === 0

  return (
    <div className="space-y-6 md:space-y-8">
        {hasNoMentorships ? (
          <>
          {/* First Row - Hero + Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Hero Section with Primary Action */}
            <Card padding="none" className="lg:col-span-2 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 border-none shadow-[0_20px_60px_rgb(59,130,246,0.3)] h-full">
              <div className="relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-400/30 to-transparent rounded-full blur-2xl"></div>
                
                <div className="relative p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-[18px] flex items-center justify-center shadow-lg">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white/90 text-sm font-semibold uppercase tracking-wider">AI-Powered Platform</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    Welcome to Mentorship CoPilot
                  </h1>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
                    Transform your team's growth with intelligent mentorship matching. Find the perfect mentor for any technology and track progress in real-time.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-8">
                    <button
                      onClick={() => navigate('/create-mentorship')}
                      className="group bg-white text-baires-blue px-8 py-4 rounded-[16px] font-bold text-lg hover:shadow-[0_20px_50px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 flex items-center gap-3 cursor-pointer"
                    >
                      <Plus className="w-6 h-6" />
                      <span>Create Your First Mentorship</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <button
                      onClick={() => navigate('/mentors')}
                      className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-[16px] font-bold text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center gap-3 cursor-pointer"
                    >
                      <Search className="w-6 h-6" />
                      <span>Browse Mentors</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-[14px] flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">AI Matching</p>
                        <p className="text-xs text-white/80">Smart recommendations</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-[14px] flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">Centralized Hub</p>
                        <p className="text-xs text-white/80">All progress tracked</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-[14px] flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">Fast Setup</p>
                        <p className="text-xs text-white/80">Ready in minutes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions Card - Right Column, Same Height as Hero */}
            <Card padding="xl" className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 border-none shadow-[0_20px_60px_rgb(59,130,246,0.3)] text-white h-full flex flex-col">
              <div className="relative flex-1 flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/30 to-transparent rounded-full blur-xl"></div>
                
                <div className="relative flex-1 flex flex-col">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-[18px] flex items-center justify-center mb-4 shadow-lg">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Quick Actions</h3>
                  <p className="text-sm mb-6 opacity-90 leading-relaxed">
                    Everything you need to get started with your mentorship program
                  </p>
                  
                  <div className="space-y-3 mt-auto">
                    <button
                      onClick={() => navigate('/create-mentorship')}
                      className="group w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 p-4 rounded-[16px] transition-all duration-300 border border-white/30 hover:scale-105 shadow-lg text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-[12px] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-sm">Create Mentorship</h4>
                          <p className="text-xs text-white/80">Start with AI matching</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    <button
                      onClick={() => navigate('/mentors')}
                      className="group w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 p-4 rounded-[16px] transition-all duration-300 border border-white/30 hover:scale-105 shadow-lg text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-[12px] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Search className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-sm">Browse Mentors</h4>
                          <p className="text-xs text-white/80">Explore expert pool</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    <button
                      onClick={() => navigate('/mentorship')}
                      className="group w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 p-4 rounded-[16px] transition-all duration-300 border border-white/30 hover:scale-105 shadow-lg text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-[12px] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FolderKanban className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-sm">My Projects</h4>
                          <p className="text-xs text-white/80">View all mentorships</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Second Row - Getting Started + Features */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Getting Started Guide */}
            <Card gradient padding="xl" className="lg:col-span-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-purple-100/50 to-transparent rounded-full blur-2xl"></div>
              
              <div className="relative">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-baires-blue px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    <Sparkles className="w-4 h-4" />
                    Quick Start Guide
                  </div>
                  <h2 className="text-3xl font-bold text-neutral-black mb-3">Getting Started</h2>
                  <p className="text-neutral-gray-dark text-lg">Follow these simple steps to launch your first mentorship</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="relative group">
                    <div className="absolute -top-3 -left-3 w-14 h-14 bg-gradient-to-br from-baires-blue to-blue-600 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgb(26,115,232,0.3)] z-10 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-xl">1</span>
                    </div>
                    <div className="relative overflow-hidden bg-white p-6 pt-10 rounded-[24px] border-2 border-blue-100 hover:border-blue-300 hover:shadow-[0_20px_50px_rgb(26,115,232,0.15)] transition-all duration-300 h-full group-hover:-translate-y-1">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full blur-2xl"></div>
                      
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[20px] flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          <Plus className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-neutral-black text-xl mb-3">Create Request</h3>
                        <p className="text-sm text-neutral-gray-dark leading-relaxed mb-5">
                          Select a mentee and describe the challenge or skill they need to develop.
                        </p>
                        <button
                          onClick={() => navigate('/create-mentorship')}
                          className="text-baires-blue font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all group/btn cursor-pointer"
                        >
                          <span>Start Now</span>
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        
                        <div className="mt-4 pt-4 border-t border-blue-100">
                          <div className="flex items-center gap-2 text-xs text-blue-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="font-medium">Ready to use</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute -top-3 -left-3 w-14 h-14 bg-gradient-to-br from-baires-orange to-orange-600 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgb(249,115,22,0.3)] z-10 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-xl">2</span>
                    </div>
                    <div className="relative overflow-hidden bg-white p-6 pt-10 rounded-[24px] border-2 border-orange-100 hover:border-orange-300 hover:shadow-[0_20px_50px_rgb(249,115,22,0.15)] transition-all duration-300 h-full group-hover:-translate-y-1">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100/50 to-transparent rounded-full blur-2xl"></div>
                      
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[20px] flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-neutral-black text-xl mb-3">AI Recommends</h3>
                        <p className="text-sm text-neutral-gray-dark leading-relaxed mb-5">
                          Our AI analyzes your team and suggests the 3 best mentor matches with justifications.
                        </p>
                        <div className="inline-flex items-center gap-2 bg-orange-50 text-baires-orange px-3 py-1.5 rounded-full text-xs font-semibold">
                          <div className="w-1.5 h-1.5 bg-baires-orange rounded-full"></div>
                          Automated Process
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-orange-100">
                          <div className="flex items-center gap-2 text-xs text-orange-600">
                            <Brain className="w-4 h-4" />
                            <span className="font-medium">AI-powered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute -top-3 -left-3 w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgb(34,197,94,0.3)] z-10 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-xl">3</span>
                    </div>
                    <div className="relative overflow-hidden bg-white p-6 pt-10 rounded-[24px] border-2 border-green-100 hover:border-green-300 hover:shadow-[0_20px_50px_rgb(34,197,94,0.15)] transition-all duration-300 h-full group-hover:-translate-y-1">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100/50 to-transparent rounded-full blur-2xl"></div>
                      
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-[20px] flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                          <BarChart3 className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-neutral-black text-xl mb-3">Track Progress</h3>
                        <p className="text-sm text-neutral-gray-dark leading-relaxed mb-5">
                          Monitor all mentorship activities from your centralized dashboard.
                        </p>
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          Real-time Updates
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-green-100">
                          <div className="flex items-center gap-2 text-xs text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-medium">Live tracking</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* System Structure Cards - Right Column, Same Height as Getting Started */}
            <div className="space-y-4 flex flex-col">
              <div className="group p-6 bg-gradient-to-br from-indigo-50 to-white rounded-[20px] border border-indigo-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-[18px] flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-neutral-black mb-2 text-lg">Teams</h4>
                <p className="text-sm text-neutral-gray-dark leading-relaxed mb-3">
                  Organize your PMs into teams. Each team can manage multiple projects.
                </p>
                <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                  <Briefcase className="w-3 h-3" />
                  <span className="font-medium">Admin managed</span>
                </div>
              </div>

              <div className="group p-6 bg-gradient-to-br from-blue-50 to-white rounded-[20px] border border-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[18px] flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <FolderKanban className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-neutral-black mb-2 text-lg">Projects</h4>
                <p className="text-sm text-neutral-gray-dark leading-relaxed mb-3">
                  Teams create projects with mentees who need guidance and development.
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                  <Users className="w-3 h-3" />
                  <span className="font-medium">Multiple mentees per project</span>
                </div>
              </div>

              <div className="group p-6 bg-gradient-to-br from-green-50 to-white rounded-[20px] border border-green-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-[18px] flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-neutral-black mb-2 text-lg">Mentors</h4>
                <p className="text-sm text-neutral-gray-dark leading-relaxed mb-3">
                  When a mentee needs help, the perfect mentor is temporarily added to the project.
                </p>
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  <Sparkles className="w-3 h-3" />
                  <span className="font-medium">AI-matched & dynamic</span>
                </div>
              </div>
            </div>
          </div>

          {/* Third Row - Why Use Section Full Width */}
          <Card padding="xl" className="bg-gradient-to-br from-purple-50 via-white to-blue-50 border-2 border-purple-100/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[18px] flex items-center justify-center shadow-lg flex-shrink-0">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-black mb-2">Solve Real PM Challenges</h3>
                  <p className="text-neutral-gray-dark text-sm leading-relaxed">
                    Built specifically to address the pain points Project Managers face daily
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-black text-sm mb-1">Find Niche Experts</p>
                    <p className="text-xs text-neutral-gray-dark leading-relaxed">
                      Discover hidden talents across your organization, even for specialized technologies
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-black text-sm mb-1">Centralized Tracking</p>
                    <p className="text-xs text-neutral-gray-dark leading-relaxed">
                      No more scattered spreadsheets or Slack threads - everything in one place
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-black text-sm mb-1">Automated Workflows</p>
                    <p className="text-xs text-neutral-gray-dark leading-relaxed">
                      Reduce manual work and focus on what matters - team development
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <Card gradient padding="xl" className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                  <Avatar 
                    src={user?.photoURL}
                    initials={user?.displayName?.substring(0, 2)?.toUpperCase() || 'PM'}
                    size="2xl" 
                    ring 
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <Briefcase className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-neutral-black to-baires-blue bg-clip-text text-transparent mb-1">
                    Management Overview
                  </h2>
                  <p className="text-neutral-gray-dark flex items-center gap-1">
                    <BarChart3 className="w-3 h-3 text-baires-blue" />
                    Project insights & analytics
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                <StatCard value={activeProjects.toString()} label="Active Projects" trend={teamGrowth} IconComponent={FolderKanban} color="blue" />
                <StatCard value={completedSessions.toString()} label="Completed Sessions" IconComponent={CheckCircle} color="green" />
                <StatCard value={pendingReviews.toString()} label="Pending Reviews" IconComponent={Clock} color="orange" />
                <StatCard value={upcomingSessions.length.toString()} label="Upcoming Sessions" IconComponent={Calendar} color="purple" />
              </div>
            </Card>

            {/* Project Management CTA - Only show when has mentorships */}
            <Card padding="none" className="overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-200/50">
          <div className="relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-baires-blue/10 to-purple-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-300/20 to-purple-300/10 rounded-full blur-2xl"></div>
            
            <div className="relative p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[16px] flex items-center justify-center shadow-lg">
                      <FolderKanban className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-black flex items-center gap-2">
                        Project Management
                        <Sparkles className="w-5 h-5 text-baires-blue animate-pulse" />
                      </h2>
                      <p className="text-sm text-neutral-gray-dark mt-1">Manage all your mentorship projects</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => window.location.href = '/mentorship'}
                  className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50 p-6 rounded-[20px] border-2 border-blue-200/50 hover:border-blue-400/70 hover:shadow-[0_20px_40px_rgb(26,115,232,0.15)] transition-all duration-300 hover:-translate-y-1 text-left"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-baires-blue/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[12px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                        <FolderKanban className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-neutral-black group-hover:text-baires-blue transition-colors">My Projects</h3>
                    </div>
                    <p className="text-sm text-neutral-gray-dark">View and manage all mentorship projects</p>
                  </div>
                </button>

                <button 
                  onClick={() => window.location.href = '/create-mentorship'}
                  className="group relative overflow-hidden bg-gradient-to-br from-white to-purple-50 p-6 rounded-[20px] border-2 border-purple-200/50 hover:border-purple-400/70 hover:shadow-[0_20px_40px_rgb(168,85,247,0.15)] transition-all duration-300 hover:-translate-y-1 text-left"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[12px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-neutral-black group-hover:text-purple-600 transition-colors">Analytics</h3>
                    </div>
                    <p className="text-sm text-neutral-gray-dark">View performance metrics and reports</p>
                  </div>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-200/50 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-neutral-gray-dark">
                      <span className="text-neutral-black font-bold">{completedSessions}</span> completed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-neutral-gray-dark">
                      <span className="text-neutral-black font-bold">{pendingReviews}</span> need review
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-baires-blue">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold">{teamGrowth} Growth</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

            {/* Project Progress Overview - Only show when has mentorships */}
            <Card gradient hover padding="lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-[16px] flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-black">Project Progress</h3>
                    <p className="text-xs text-neutral-gray-dark">Your mentorship projects</p>
                  </div>
                </div>
                {mentorships.length > 3 && (
                  <button 
                    onClick={() => navigate('/mentorship')}
                    className="text-sm font-semibold text-baires-orange hover:text-orange-700 flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {mentorships.length > 0 ? (
                <div className="space-y-4">
                  {mentorships.slice(0, 3).map((mentorship) => {
                // Helper function to format status
                const formatStatus = (status) => {
                  if (!status) return 'Unknown'
                  return status
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ')
                }
                
                const statusColors = {
                  'active': 'success',
                  'pending': 'warning',
                  'pending_mentor': 'warning',
                  'pending_kickoff': 'blue',
                  'completed': 'gray'
                }
                
                const getStatusColor = (status) => {
                  return statusColors[status] || 'gray'
                }
                
                return (
                  <div
                    key={mentorship.id}
                    className="w-full p-5 bg-gradient-to-br from-white to-green-50/50 rounded-[20px] border border-green-100/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar 
                          src={mentorship.menteeAvatar} 
                          initials={mentorship.menteeName?.substring(0, 2)?.toUpperCase()}
                          size="md"
                          ring
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-neutral-black mb-1">{mentorship.menteeName}</h4>
                          <p className="text-xs text-neutral-gray-dark mb-2">
                            Mentor: {mentorship.mentorName || 'Not assigned yet'}
                          </p>
                          {/* Technologies */}
                          {mentorship.technologies && mentorship.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {mentorship.technologies.slice(0, 3).map((tech, idx) => (
                                <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                  {typeof tech === 'string' ? tech : tech.name || tech}
                                </span>
                              ))}
                              {mentorship.technologies.length > 3 && (
                                <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full font-medium">
                                  +{mentorship.technologies.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant={getStatusColor(mentorship.status)} className="text-xs flex-shrink-0">
                        {formatStatus(mentorship.status)}
                      </Badge>
                    </div>
                    
                    {/* Challenge Description Summary */}
                    {mentorship.challengeDescription && (
                      <div className="mb-3 p-3 bg-orange-50/50 rounded-[12px] border border-orange-100/50">
                        <p className="text-xs text-neutral-gray-dark line-clamp-2 leading-relaxed">
                          {mentorship.challengeDescription}
                        </p>
                      </div>
                    )}
                    
                    {/* Invited Mentors Count for Pending Status */}
                    {mentorship.status === 'pending' && mentorship.invitedMentorIds && (
                      <div className="mb-3 flex items-center gap-2 text-xs">
                        <Users className="w-4 h-4 text-baires-orange" />
                        <span className="text-neutral-gray-dark">
                          <span className="font-bold text-neutral-black">{mentorship.invitedMentorIds.length}</span> mentor{mentorship.invitedMentorIds.length !== 1 ? 's' : ''} invited
                        </span>
                      </div>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-gray-dark font-medium">Progress</span>
                        <span className="font-bold text-neutral-black">{mentorship.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-300" 
                          style={{ width: `${mentorship.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* View Details Button */}
                    <button
                      onClick={() => navigate(`/mentorship/${mentorship.id}`)}
                      className="w-full bg-gradient-to-r from-baires-orange to-orange-600 text-white px-4 py-2.5 rounded-[14px] font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )
              })}
                </div>
              ) : (
                <EmptyState 
                  icon={FolderKanban}
                  title="No projects yet"
                  description="Start managing mentorship projects"
                  action={
                    <Button variant="orange" size="sm" onClick={() => navigate('/create-mentorship')}>
                      Create Project
                    </Button>
                  }
                />
              )}
            </Card>

            {/* Action Required - Right Column */}
            <Card hover padding="lg" className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white border-none shadow-[0_20px_50px_rgb(168,85,247,0.3)]">
          <div className="relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="relative">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-[18px] flex items-center justify-center mb-4 shadow-lg">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                Action Required
                <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">{pendingReviews}</span>
              </h3>
              <p className="text-sm mb-6 opacity-90 leading-relaxed">You have pending reviews and tasks that need attention.</p>
              
              <button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-[16px] transition-all duration-300 border border-white/30 hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Review Now
              </button>
            </div>
          </div>
        </Card>
          </div>

          {/* Second Row - Action Items + Upcoming Sessions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Action Opportunities */}
        <Card gradient hover padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-baires-blue" />
            <h3 className="text-xl font-bold text-neutral-black">Action Items</h3>
          </div>
          <div className="space-y-4">
            {opportunities.map((opp, index) => {
              const IconComponent = getIconComponent(opp.icon)
              return (
                <div key={index} className="group p-5 bg-gradient-to-br from-white to-blue-50/50 rounded-[20px] border border-blue-100/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-neutral-black">{opp.title}</h4>
                        <Badge variant="warning" className="text-xs">{opp.status}</Badge>
                      </div>
                      <p className="text-sm text-neutral-gray-dark leading-relaxed">{opp.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Upcoming Sessions */}
        <Card gradient hover padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-baires-orange" />
            <h3 className="text-xl font-bold text-neutral-black">Upcoming Sessions</h3>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-baires-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : upcomingSessions.length > 0 ? (
            <div className="space-y-4">
              {upcomingSessions.map((session) => {
                const isKickoff = session.type === 'kickoff'
                const isPending = session.status === 'pending_acceptance'
                
                return (
                  <div key={session.id} className="group flex items-center gap-4 p-4 bg-gradient-to-br from-white to-orange-50/50 rounded-[20px] border border-orange-100/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <div className="relative">
                      <Avatar 
                        src={session.participantPhoto} 
                        initials={session.participantName?.substring(0, 2)?.toUpperCase()} 
                        size="lg" 
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-neutral-black mb-1">
                        {isKickoff ? 'Kickoff Meeting: ' : ''}{session.participantName}
                      </p>
                      <p className="text-xs text-neutral-gray-dark mb-2">
                        {session.scheduledDate?.toDate?.().toLocaleString()}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {isPending && (
                          <Badge variant="warning" className="text-xs">Pending Acceptance</Badge>
                        )}
                        {!isPending && (
                          <Badge variant="success" className="text-xs">Confirmed</Badge>
                        )}
                        {isKickoff && (
                          <Badge variant="blue" className="text-xs">Kickoff</Badge>
                        )}
                      </div>
                    </div>
                    {isPending && (
                      <button 
                        className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-[12px] transition-colors"
                        onClick={() => {
                          if (confirm('Cancel this meeting?')) {
                            // TODO: Implement cancel meeting
                            console.log('Cancel meeting:', session.id)
                          }
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState 
              icon={Calendar}
              title="No scheduled sessions"
              description="No upcoming sessions at the moment"
              action={
                <Button variant="orange" size="sm" onClick={() => window.location.href = '/mentorship'}>
                  View Projects
                </Button>
              }
            />
          )}
        </Card>
          </div>
          </>
        )}
    </div>
  )
}

