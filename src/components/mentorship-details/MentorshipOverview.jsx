import { Users, Target, Code, Clock, AlertCircle, Sparkles, Bot, CheckCircle, TrendingUp } from 'lucide-react'
import Card from '../Card'
import Avatar from '../Avatar'
import Badge from '../Badge'

export default function MentorshipOverview({ 
  data, 
  statusInfo, 
  formatStatus,
  invitationsWithProfiles = []
}) {
  return (
    <Card padding="lg" className="mb-8 bg-gradient-to-br from-white via-orange-50/30 to-blue-50/30 border-2 border-orange-200/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-black">Mentorship Overview</h2>
        </div>
        <Badge variant={statusInfo.color.includes('green') ? 'success' : statusInfo.color.includes('amber') ? 'warning' : 'blue'} className="text-sm">
          {formatStatus(data?.status)}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Mentee */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-[16px] border border-blue-200/50">
          <Avatar 
            src={data.menteeAvatar || data.mentee?.avatar} 
            initials={(data.menteeName || data.mentee?.name)?.substring(0, 2)?.toUpperCase()}
            size="xl" 
          />
          <div>
            <div className="text-xs text-neutral-gray-dark font-semibold mb-1">MENTEE</div>
            <div className="text-lg font-bold text-neutral-black">{data.menteeName || data.mentee?.name}</div>
            <div className="text-sm text-neutral-gray-dark">{data.mentee?.role || 'Team Member'}</div>
          </div>
        </div>

        {/* Mentor */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-[16px] border border-orange-200/50">
          {data.mentorId || data.mentor ? (
            <>
              <Avatar 
                src={data.mentorAvatar || data.mentor?.avatar} 
                initials={(data.mentorName || data.mentor?.name)?.substring(0, 2)?.toUpperCase()}
                size="xl" 
              />
              <div>
                <div className="text-xs text-neutral-gray-dark font-semibold mb-1">MENTOR</div>
                <div className="text-lg font-bold text-neutral-black">{data.mentorName || data.mentor?.name}</div>
                <div className="text-sm text-neutral-gray-dark">{data.mentor?.role || 'Expert Mentor'}</div>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center animate-pulse">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <div className="text-xs text-neutral-gray-dark font-semibold mb-1">MENTOR</div>
                <div className="text-lg font-bold text-amber-700">Awaiting Selection</div>
                <div className="text-sm text-amber-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Pending assignment
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Technologies */}
      {data.technologies && data.technologies.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[16px] border border-blue-200/50">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-4 h-4 text-baires-blue" />
            <span className="text-sm font-bold text-neutral-black">Technologies & Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.technologies.map((tech, idx) => (
              <span key={idx} className="text-xs bg-white border border-blue-300 text-blue-700 px-3 py-1.5 rounded-full font-semibold">
                {typeof tech === 'string' ? tech : tech.name || tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Challenge Description or Original Goal */}
      {(data.challengeDescription || data.originalGoal) && (
        <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[16px] border border-orange-200/50 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[12px] flex items-center justify-center shadow-md flex-shrink-0">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-baires-orange font-bold mb-2 uppercase tracking-wide">
                {data.challengeDescription ? 'Challenge & Goals' : 'Original Goal'}
              </div>
              <p className="text-neutral-black leading-relaxed">{data.challengeDescription || data.originalGoal}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Feedback Section */}
      <div className="p-5 bg-gradient-to-br from-purple-50 via-purple-100/50 to-blue-50 rounded-[16px] border-2 border-purple-200/70">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[12px] flex items-center justify-center shadow-md flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wide">AI Feedback & Analysis</h3>
              <Badge variant="purple" className="text-xs">
                <Bot className="w-3 h-3 inline mr-1" />
                AI Powered
              </Badge>
            </div>
            <p className="text-xs text-purple-700 mb-3">Intelligent insights generated by our Mentorship Copilot</p>
          </div>
        </div>

        {!data?.mentorId ? (
          <div className="space-y-3">
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-[12px] border border-purple-200/50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-neutral-black mb-1">Awaiting Mentor Selection</p>
                  <p className="text-xs text-neutral-gray-dark leading-relaxed">
                    This mentorship is currently in the setup phase. Once a mentor is assigned, our AI will begin analyzing 
                    the match quality, skill alignment, and provide personalized recommendations for maximizing the mentorship success.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-[12px] border border-purple-200/50">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-neutral-black mb-1">Preparation Tips</p>
                  <p className="text-xs text-neutral-gray-dark leading-relaxed">
                    Based on the selected technologies ({data.technologies?.slice(0, 3).map(t => typeof t === 'string' ? t : t.name).join(', ')}), 
                    we recommend finding mentors with proven expertise in these areas and experience in guiding junior developers through 
                    similar learning paths.
                  </p>
                </div>
              </div>
            </div>

            {invitationsWithProfiles.length > 0 && (
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[12px] border border-blue-200/50">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-neutral-black mb-1">Action Pending</p>
                    <p className="text-xs text-neutral-gray-dark leading-relaxed">
                      You have {invitationsWithProfiles.filter(inv => inv.status === 'pending').length} pending mentor 
                      invitation{invitationsWithProfiles.filter(inv => inv.status === 'pending').length !== 1 ? 's' : ''}. 
                      Review the invited mentors below and track their responses to move forward with the mentorship.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-white/80 backdrop-blur-sm rounded-[12px] border border-purple-200/50">
            <div className="flex items-start gap-3">
              <Bot className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-neutral-black mb-2">Mentorship Analysis</p>
                <p className="text-xs text-neutral-gray-dark leading-relaxed mb-3">
                  This mentorship shows a strong foundation with well-defined goals and appropriate technology selection. 
                  The mentor-mentee pairing appears well-suited based on skill requirements and expertise areas.
                </p>
                <div className="flex items-center gap-2 text-xs text-purple-700">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">Match Quality: High</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

