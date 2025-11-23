import { useState } from 'react'
import { X, Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useConfirm } from '../hooks/useConfirm'
import Card from './Card'
import Button from './Button'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00'
]

export default function ScheduleSessionModal({ isOpen, onClose, mentee }) {
  const confirm = useConfirm()
  const [step, setStep] = useState('date') // 'date' or 'time'
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [scheduling, setScheduling] = useState(false)

  if (!isOpen) return null

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  const isDateDisabled = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDateSelect = (day) => {
    const date = new Date(currentYear, currentMonth, day)
    if (!isDateDisabled(date)) {
      setSelectedDate(date)
      setStep('time')
    }
  }

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) return
    
    setScheduling(true)
    
    const formattedDate = selectedDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    
    setTimeout(async () => {
      await confirm.success(
        `Session scheduled successfully!\n\n${formattedDate}\n ${selectedTime}\n ${mentee?.name}\n\nA calendar invite will be sent to both participants.`,
        'Session Scheduled'
      )
      setScheduling(false)
      handleClose()
    }, 1000)
  }

  const handleClose = () => {
    setStep('date')
    setSelectedDate(null)
    setSelectedTime(null)
    onClose()
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const disabled = isDateDisabled(date)
      const isSelected = selectedDate?.getDate() === day && 
                        selectedDate?.getMonth() === currentMonth &&
                        selectedDate?.getFullYear() === currentYear
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          disabled={disabled}
          className={`
            w-11 h-11 rounded-[10px] flex items-center justify-center text-sm font-semibold
            transition-all relative
            ${disabled 
              ? 'text-neutral-300 cursor-not-allowed' 
              : 'text-neutral-black hover:bg-baires-blue/10 hover:scale-105 cursor-pointer'
            }
            ${isSelected 
              ? 'bg-gradient-to-br from-baires-blue to-blue-600 text-white shadow-lg scale-105' 
              : ''
            }
          `}
        >
          {day}
          {isSelected && (
            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </button>
      )
    }

    return days
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl">
        <Card padding="none" className="overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-baires-blue to-blue-600 text-white p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-[12px] flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Schedule Session</h2>
                  <p className="text-xs opacity-90">
                    {step === 'date' ? 'Select a date' : 'Choose a time'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-[12px] flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mentee Info */}
            {mentee && (
              <div className="flex items-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-[14px]">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
                  {mentee.name?.substring(0, 2)?.toUpperCase()}
                </div>
                <div>
                  <div className="text-xs opacity-75 font-semibold uppercase">With:</div>
                  <div className="font-semibold text-sm">{mentee.name}</div>
                </div>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-5">
            {step === 'date' ? (
              <div>
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePrevMonth}
                    className="w-9 h-9 rounded-[10px] bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h3 className="text-lg font-bold text-neutral-black">
                    {MONTHS[currentMonth]} {currentYear}
                  </h3>
                  <button
                    onClick={handleNextMonth}
                    className="w-9 h-9 rounded-[10px] bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div>
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1.5 mb-2">
                    {DAYS.map(day => (
                      <div key={day} className="text-center text-xs font-bold text-neutral-500 w-11">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1.5 justify-items-center">
                    {renderCalendar()}
                  </div>
                </div>

                {selectedDate && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-[12px] border border-blue-200">
                    <p className="text-xs text-blue-800 font-semibold">
                      Selected: {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* Back Button */}
                <button
                  onClick={() => setStep('date')}
                  className="flex items-center gap-2 text-baires-blue hover:text-blue-700 font-semibold mb-3 transition-colors text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Change Date
                </button>

                {/* Selected Date Display */}
                <div className="mb-4 p-3 bg-blue-50 rounded-[12px] border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-800">
                    <CalendarIcon className="w-4 h-4" />
                    <p className="font-semibold text-sm">
                      {selectedDate?.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-bold text-neutral-black mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Select Time
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[280px] overflow-y-auto p-2 border border-neutral-200 rounded-[12px] bg-neutral-50">
                    {TIME_SLOTS.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`
                          py-2 px-3 rounded-[10px] font-semibold text-xs transition-all
                          ${selectedTime === time
                            ? 'bg-gradient-to-br from-baires-blue to-blue-600 text-white shadow-lg scale-105'
                            : 'bg-white text-neutral-black hover:bg-blue-50 hover:scale-105 border border-neutral-200'
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={scheduling}
            >
              Cancel
            </Button>
            {step === 'time' && (
              <Button
                variant="primary"
                onClick={handleSchedule}
                disabled={!selectedDate || !selectedTime || scheduling}
                icon={<Check className="w-4 h-4" />}
              >
                {scheduling ? 'Scheduling...' : 'Schedule Session'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
