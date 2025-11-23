import { useState } from 'react'
import { Calendar, Clock, TrendingUp, Target, Users, BarChart3, Sparkles, FileText, CheckCircle, Bot, Lightbulb, Plus, FolderOpen, Download, AlertCircle, X, Save } from 'lucide-react'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Avatar from '../../components/Avatar'
import MessageModal from '../../components/MessageModal'
import ScheduleSessionModal from '../../components/ScheduleSessionModal'
import { ActionCTA, MaterialsList, SessionHistory, QuickActions } from '../../components/mentorship-details'
import { updateGoal } from '../../services/firestoreService'

export default function MentorView({
  data,
  statusInfo,
  formatStatus,
  averageProgress,
  weeksDuration,
  materials,
  setIsSessionWizardOpen,
  setIsMaterialWizardOpen,
  customGoals,
  sessions,
  refreshGoals
}) {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleGoalClick = (goal) => {
    setEditingGoal(goal)
    setEditValue(goal.current.toString())
  }

  const handleSaveGoal = async () => {
    if (!editingGoal) return
    
    setIsSaving(true)
    try {
      const newValue = parseFloat(editValue) || 0
      await updateGoal(editingGoal.id, { current: newValue })
      
      // Refresh goals from Firestore
      if (refreshGoals) {
        await refreshGoals()
      }
      
      setEditingGoal(null)
      setEditValue('')
    } catch (error) {
      console.error('Error updating goal:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingGoal(null)
    setEditValue('')
  }
  
  return (
    <>
      {/* Mentorship Overview */}
      <Card padding="lg" className="mb-8 bg-gradient-to-br from-white via-blue-50/30 to-blue-50/30 border-2 border-blue-200/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
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
          <div className="p-5 bg-gradient-to-br from-orange-50 to-blue-100/50 rounded-[16px] border border-orange-200/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[12px] flex items-center justify-center shadow-md flex-shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-baires-blue font-bold mb-2 uppercase tracking-wide">Challenge & Goals</div>
                <p className="text-neutral-black leading-relaxed">{data.challengeDescription}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Grid with Progress Goals and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Progress Overview */}
        <div className="lg:col-span-2">
          <Card padding="lg" className="h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-black">Progress Goals</h2>
                <p className="text-sm text-neutral-gray-dark">Track your mentee's growth</p>
              </div>
            </div>

            {customGoals && customGoals.length > 0 ? (
              <div className={`grid grid-cols-2 ${customGoals.length > 4 ? 'md:grid-cols-4 lg:grid-cols-5' : 'md:grid-cols-4'} gap-4`}>
                {customGoals.map((goal) => {
                  const variants = {
                    blue: { icon: BarChart3, color: 'blue' },
                    green: { icon: Target, color: 'green' },
                    purple: { icon: Clock, color: 'purple' },
                    orange: { icon: TrendingUp, color: 'orange' },
                    pink: { icon: Sparkles, color: 'pink' },
                    yellow: { icon: Calendar, color: 'yellow' }
                  }
                  const variantConfig = variants[goal.variant] || variants.blue
                  
                  return (
                    <Card 
                      key={goal.id} 
                      padding="md" 
                      onClick={() => handleGoalClick(goal)}
                      className={`bg-gradient-to-br from-${variantConfig.color}-50 to-${variantConfig.color}-100/50 border-2 border-${variantConfig.color}-200 cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200`}
                    >
                      <variantConfig.icon className={`w-8 h-8 text-${variantConfig.color}-600 mb-2`} />
                      <div className="text-xs font-bold uppercase text-neutral-gray-dark mb-1">{goal.name}</div>
                      <div className="text-xl font-bold text-neutral-black">
                        {goal.current}{goal.unit} / {goal.target}{goal.unit}
                      </div>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="p-6 bg-amber-50 rounded-[16px] border-2 border-amber-200 text-center">
                <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-amber-900 mb-2">No Goals Defined Yet</h3>
                <p className="text-sm text-amber-800">
                  The Project Manager needs to define the mentorship goals. Once set, you'll be able to track progress here.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions
            onMessageClick={() => setIsMessageModalOpen(true)}
            onScheduleClick={() => setIsScheduleModalOpen(true)}
            recipientName={data?.menteeName || 'Mentee'}
          />
        </div>
      </div>

      {/* Session Logging CTA + AI Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        <div className="lg:col-span-2">
          <ActionCTA
            onClick={() => setIsSessionWizardOpen(true)}
            title="Log New Session"
            description="Document your mentorship progress with our intelligent wizard. Track sessions, rate progress, and set actionable next steps—all in a few simple steps."
            buttonText="Start Session Log Wizard"
            buttonIcon={Plus}
            icon={Plus}
            badge="AI-Powered Session Logging"
            bgGradient="from-baires-blue via-blue-600 to-blue-700"
            buttonTextColor="text-baires-blue"
            features={[
              { icon: Calendar, label: 'Quick & Easy' },
              { icon: Sparkles, label: 'AI Assistance' },
              { icon: FileText, label: 'Auto-Save' }
            ]}
          />
        </div>

        <div>
          <Card padding="lg" className="bg-gradient-to-br from-baires-blue via-blue-600 to-blue-700 text-white border-none shadow-[0_20px_50px_rgb(246,97,53,0.3)] h-full">
            <div className="relative h-full flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative flex-1">
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
                  <span>Mentorship Copilot</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Full Width Row - Materials CTA, Materials List, and Session History */}
      <div className="space-y-6 md:space-y-8">
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

        <MaterialsList materials={materials} />
        
        <SessionHistory sessions={sessions} title="Your Session Logs" showEdit={true} />
      </div>

      <MessageModal 
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        recipient={{
          name: data?.menteeName,
          avatar: data?.menteeAvatar,
          role: 'Mentee'
        }}
      />
      
      <ScheduleSessionModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        mentee={{
          name: data?.menteeName,
          avatar: data?.menteeAvatar
        }}
      />

      {/* Edit Goal Modal */}
      {editingGoal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[24px] shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[16px] flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-black">Update Goal</h3>
                  <p className="text-sm text-neutral-gray-dark">{editingGoal.name}</p>
                </div>
              </div>
              <button
                onClick={handleCancelEdit}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5 text-neutral-gray-dark" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-neutral-black mb-2">
                Current Value
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-[12px] focus:border-baires-blue focus:outline-none transition-colors text-lg font-bold"
                  placeholder="0"
                  autoFocus
                />
                {editingGoal.unit && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-gray-dark font-semibold">
                    {editingGoal.unit}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-gray-dark mt-2">
                Target: {editingGoal.target}{editingGoal.unit}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-neutral-100 text-neutral-black rounded-[12px] font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGoal}
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-baires-blue to-blue-600 text-white rounded-[12px] font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

