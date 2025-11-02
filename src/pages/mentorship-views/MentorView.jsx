import { Calendar, Clock, TrendingUp, Target, Users, BarChart3, Sparkles, MessageSquare, FileText, CheckCircle, Bot, Lightbulb, Plus, FolderOpen, Download } from 'lucide-react'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Avatar from '../../components/Avatar'
import { ActionCTA, StatsCard, MaterialsList, SessionHistory } from '../../components/mentorship-details'

export default function MentorView({ 
  data, 
  statusInfo, 
  formatStatus, 
  averageProgress, 
  weeksDuration,
  mockMaterials,
  setIsSessionWizardOpen,
  setIsMaterialWizardOpen
}) {
  return (
    <>
      {/* Mentorship Overview */}
      <Card padding="lg" className="mb-8 bg-gradient-to-br from-white via-blue-50/30 to-orange-50/30 border-2 border-blue-200/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[14px] flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-black">Your Mentorship</h2>
          </div>
          <Badge variant={statusInfo.color.includes('green') ? 'success' : statusInfo.color.includes('amber') ? 'warning' : 'blue'} className="text-sm">
            {formatStatus(data?.status)}
          </Badge>
        </div>

        <div className="flex items-center gap-4 p-5 bg-white rounded-[16px] border border-blue-200/50 mb-6">
          <Avatar 
            src={data?.menteeAvatar} 
            initials={data?.menteeName?.substring(0, 2)?.toUpperCase()}
            size="xl"
            ring
          />
          <div className="flex-1">
            <div className="text-xs text-neutral-gray-dark font-semibold mb-1">YOUR MENTEE</div>
            <div className="text-xl font-bold text-neutral-black mb-1">{data?.menteeName}</div>
            {data?.technologies && data.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.technologies.slice(0, 4).map((tech, idx) => (
                  <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                    {typeof tech === 'string' ? tech : tech.name || tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {data?.challengeDescription && (
          <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[16px] border border-orange-200/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[12px] flex items-center justify-center shadow-md flex-shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-baires-orange font-bold mb-2 uppercase tracking-wide">Challenge & Goals</div>
                <p className="text-neutral-black leading-relaxed">{data.challengeDescription}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Progress Overview */}
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-black">Progress Overview</h2>
                <p className="text-sm text-neutral-gray-dark">Track your mentee's growth</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatsCard icon={Calendar} label="Sessions" value={data?.sessionsCompleted || 0} variant="blue" />
              <StatsCard icon={Target} label="Progress" value={`${data?.progress || 0}%`} variant="green" />
              <StatsCard icon={Clock} label="Duration" value={`${weeksDuration || 0}w`} variant="purple" />
              <StatsCard icon={TrendingUp} label="Rating" value={`${averageProgress}/5`} variant="orange" />
            </div>
          </Card>

          {/* Session Logging CTA */}
          <ActionCTA
            onClick={() => setIsSessionWizardOpen(true)}
            title="Log New Session"
            description="Document your mentorship progress with our intelligent wizard. Track sessions, rate progress, and set actionable next steps—all in a few simple steps."
            buttonText="Start Session Log Wizard"
            buttonIcon={Plus}
            icon={Plus}
            badge="AI-Powered Session Logging"
            bgGradient="from-baires-orange via-orange-600 to-orange-700"
            buttonTextColor="text-baires-orange"
            features={[
              { icon: Calendar, label: 'Quick & Easy' },
              { icon: Sparkles, label: 'AI Assistance' },
              { icon: FileText, label: 'Auto-Save' }
            ]}
          />

          {/* Materials CTA */}
          <ActionCTA
            onClick={() => setIsMaterialWizardOpen(true)}
            title="Add New Material"
            description="Share PDFs, images, links, videos, spreadsheets, and other learning materials with your mentee. Build a comprehensive resource library."
            buttonText="Add Material Wizard"
            buttonIcon={FolderOpen}
            icon={FolderOpen}
            badge="Resource Library"
            bgGradient="from-blue-500 via-blue-600 to-blue-700"
            buttonTextColor="text-blue-600"
            features={[
              { icon: FileText, label: 'Multiple Types' },
              { icon: FolderOpen, label: 'Organized' },
              { icon: Download, label: 'Easy Access' }
            ]}
          />

          <MaterialsList materials={mockMaterials} />
          
          <SessionHistory sessions={data?.sessions} title="Your Session Logs" showEdit={true} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6 md:space-y-8">
          <Card padding="lg">
            <h3 className="text-lg font-bold text-neutral-black mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[12px]">
                <span className="text-sm font-semibold text-neutral-gray-dark">Sessions Logged</span>
                <span className="text-lg font-bold text-neutral-black">{data?.sessionsCompleted || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-br from-green-50 to-green-100/50 rounded-[12px]">
                <span className="text-sm font-semibold text-neutral-gray-dark">Progress</span>
                <span className="text-lg font-bold text-green-600">{data?.progress || 0}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[12px]">
                <span className="text-sm font-semibold text-neutral-gray-dark">Avg Rating</span>
                <span className="text-lg font-bold text-neutral-black">{averageProgress}/5</span>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-orange-50 via-white to-blue-50 border-2 border-orange-200/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[14px] flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-black flex items-center gap-2">
                  AI Tools
                  <Badge variant="orange" className="text-xs">Magic</Badge>
                </h3>
                <p className="text-xs text-neutral-gray-dark">Let AI help you</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-white rounded-[12px] border-2 border-neutral-200 hover:border-orange-400 hover:bg-orange-50/50 transition-all group">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-baires-orange group-hover:rotate-12 transition-transform" />
                  <span className="text-sm font-bold text-neutral-black">Generate Summary</span>
                </div>
              </button>
              
              <button className="w-full text-left p-3 bg-white rounded-[12px] border-2 border-neutral-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
                <div className="flex items-center gap-3">
                  <Target className="w-4 h-4 text-baires-blue" />
                  <span className="text-sm font-bold text-neutral-black">Suggest Next Steps</span>
                </div>
              </button>

              <button className="w-full text-left p-3 bg-white rounded-[12px] border-2 border-neutral-200 hover:border-orange-400 hover:bg-orange-50/50 transition-all group">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-baires-orange" />
                  <span className="text-sm font-bold text-neutral-black">Analyze Progress</span>
                </div>
              </button>
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="text-lg font-bold text-neutral-black mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-baires-blue to-blue-600 text-white rounded-[14px] font-semibold hover:shadow-lg transition-all">
                <MessageSquare className="w-5 h-5" />
                <span>Message Mentee</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-[14px] font-semibold hover:shadow-lg transition-all">
                <Calendar className="w-5 h-5" />
                <span>Schedule Session</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-neutral-100 text-neutral-black rounded-[14px] font-semibold hover:bg-neutral-200 transition-all">
                <FileText className="w-5 h-5" />
                <span>View All Logs</span>
              </button>
            </div>
          </Card>

          <Card padding="lg" className="bg-gradient-to-br from-baires-orange via-orange-600 to-orange-700 text-white border-none shadow-[0_20px_50px_rgb(246,97,53,0.3)]">
            <div className="relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-[16px] flex items-center justify-center mb-4 shadow-lg">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">AI Tips</h3>
                <div className="space-y-2 text-sm opacity-90">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>Focus on practical coding exercises</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>Encourage questions and active learning</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>Regular feedback accelerates growth</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs opacity-75 mt-4">
                  <Bot className="w-4 h-4" />
                  <span>AI CoPilot</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

