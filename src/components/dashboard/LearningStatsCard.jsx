import { TrendingUp, Calendar, Clock, Flame } from 'lucide-react'
import Card from '../Card'

export default function LearningStatsCard({ 
  completedSessions = 0,
  hoursSpent = 0,
  currentStreak = 0
}) {
  return (
    <Card gradient padding="lg">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-green-500" />
        <h3 className="text-xl font-bold text-neutral-black">Your Progress</h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-[14px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-[12px] flex items-center justify-center shadow-md">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-neutral-black">Sessions Completed</span>
          </div>
          <span className="text-lg font-bold text-green-600">{completedSessions}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[14px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-[12px] flex items-center justify-center shadow-md">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-neutral-black">Hours of Learning</span>
          </div>
          <span className="text-lg font-bold text-blue-600">{hoursSpent}h</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-[14px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[12px] flex items-center justify-center shadow-md">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-neutral-black">Current Streak</span>
          </div>
          <span className="text-lg font-bold text-purple-600">{currentStreak} days</span>
        </div>
      </div>
    </Card>
  )
}
