import { useState } from 'react'
import { Calendar, Clock, TrendingUp, Target, Users, BarChart3, Sparkles, FileText, CheckCircle, Bot, Lightbulb } from 'lucide-react'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Avatar from '../../components/Avatar'
import MessageModal from '../../components/MessageModal'
import ScheduleSessionModal from '../../components/ScheduleSessionModal'
import { MaterialsList, QuickActions } from '../../components/mentorship-details'

export default function MenteeView({
  data,
  statusInfo,
  formatStatus,
  materials
}) {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)

  return (
    <>
      {/* Mentorship Overview */}
      <Card padding="lg" className="mb-8 bg-gradient-to-br from-white via-blue-50/30 to-blue-50/30 border-2 border-blue-200/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-black">Your Learning Journey</h2>
          </div>
          <Badge variant={statusInfo.color.includes('green') ? 'success' : statusInfo.color.includes('amber') ? 'warning' : 'blue'} className="text-sm">
            {formatStatus(data?.status)}
          </Badge>
        </div>

        <div className="flex items-center gap-4 p-5 bg-white rounded-[16px] border border-blue-200/50">
          <Avatar 
            src={data?.mentorAvatar} 
            initials={data?.mentorName?.substring(0, 2)?.toUpperCase()}
            size="xl"
            ring
          />
          <div className="flex-1">
            <div className="text-xs text-neutral-gray-dark font-semibold mb-1">YOUR MENTOR</div>
            <div className="text-xl font-bold text-neutral-black mb-1">{data?.mentorName}</div>
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
      </Card>

      {/* Grid with Quick Actions only (no goals for mentee) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Welcome Card */}
        <div className="lg:col-span-2">
          <Card padding="lg" className="bg-gradient-to-br from-baires-blue via-blue-600 to-blue-700 text-white border-none shadow-[0_20px_50px_rgb(59,130,246,0.3)] h-full">
            <div className="relative h-full flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative flex-1">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-[18px] flex items-center justify-center mb-4 shadow-lg">
                  <Sparkles className="w-7 h-7 text-white animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Welcome to Your Mentorship!</h3>
                <p className="text-base mb-4 opacity-90 leading-relaxed">
                  You're on an exciting learning journey with {data?.mentorName}. Make the most of your sessions, ask questions, and practice regularly to accelerate your growth.
                </p>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <Bot className="w-5 h-5" />
                  <span>Mentorship Copilot</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions
            onMessageClick={() => setIsMessageModalOpen(true)}
            onScheduleClick={() => setIsScheduleModalOpen(true)}
            recipientName={data?.mentorName || 'Mentor'}
          />
        </div>
      </div>

      {/* Learning Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        <div className="lg:col-span-2">
          <Card padding="lg" className="bg-gradient-to-br from-blue-50 via-white to-blue-100/50 border-2 border-blue-200/50 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[16px] flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-black">Your Progress Journey</h2>
                <p className="text-sm text-neutral-gray-dark">Building skills with every session</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-[16px] border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-neutral-black">Stay Engaged</h3>
                </div>
                <p className="text-sm text-neutral-gray-dark">Active participation during sessions leads to better learning outcomes</p>
              </div>
              <div className="p-4 bg-white rounded-[16px] border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-neutral-black">Practice Daily</h3>
                </div>
                <p className="text-sm text-neutral-gray-dark">Regular practice between sessions reinforces what you've learned</p>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card padding="lg" className="bg-gradient-to-br from-baires-blue via-blue-600 to-blue-700 text-white border-none shadow-[0_20px_50px_rgb(59,130,246,0.3)] h-full">
            <div className="relative h-full flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative flex-1">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-[16px] flex items-center justify-center mb-4 shadow-lg">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Learning Tips</h3>
                <div className="space-y-2 text-sm opacity-90">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>Ask questions - no question is too small</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>Review materials after each session</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>Share your progress and challenges</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs opacity-75 mt-4">
                  <Bot className="w-4 h-4" />
                  <span>Mentorship Copilot</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Full Width Row - Materials List only */}
      <div className="space-y-6 md:space-y-8">
        <MaterialsList materials={materials} />
      </div>

      <MessageModal 
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        recipient={{
          name: data?.mentorName,
          avatar: data?.mentorAvatar,
          role: 'Mentor'
        }}
      />
      
      <ScheduleSessionModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        mentee={{
          name: data?.mentorName,
          avatar: data?.mentorAvatar
        }}
      />
    </>
  )
}

