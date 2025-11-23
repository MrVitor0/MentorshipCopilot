import { useState } from 'react'
import { X as XIcon, Calendar, Clock, Star, FileText, Lightbulb, Sparkles, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { useConfirm } from '../hooks/useConfirm'
import Card from './Card'
import Button from './Button'

const STEPS = {
  DATE_TIME: 0,
  RATING: 1,
  SUMMARY: 2,
  NEXT_STEPS: 3,
  REVIEW: 4
}

export default function SessionLogWizard({ isOpen, onClose, onSubmit, mentee }) {
  const confirm = useConfirm()
  const [currentStep, setCurrentStep] = useState(STEPS.DATE_TIME)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '60',
    progressRating: null,
    summary: '',
    nextSteps: '',
    recordingUrl: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleNext = () => {
    if (currentStep < STEPS.REVIEW) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > STEPS.DATE_TIME) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      handleClose()
    } catch (error) {
      console.error('Error submitting session:', error)
      await confirm.error(
        'Error saving session. Please try again.',
        'Error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setCurrentStep(STEPS.DATE_TIME)
    setFormData({
      date: new Date().toISOString().split('T')[0],
      duration: '60',
      progressRating: null,
      summary: '',
      nextSteps: '',
      recordingUrl: ''
    })
    onClose()
  }

  const isStepValid = () => {
    switch (currentStep) {
      case STEPS.DATE_TIME:
        return formData.date && formData.duration
      case STEPS.RATING:
        return formData.progressRating !== null
      case STEPS.SUMMARY:
        return formData.summary.trim().length > 0
      case STEPS.NEXT_STEPS:
        return formData.nextSteps.trim().length > 0
      default:
        return true
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case STEPS.DATE_TIME:
        return 'Session Details'
      case STEPS.RATING:
        return 'Progress Rating'
      case STEPS.SUMMARY:
        return 'Session Summary'
      case STEPS.NEXT_STEPS:
        return 'Next Steps'
      case STEPS.REVIEW:
        return 'Review & Confirm'
      default:
        return ''
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case STEPS.DATE_TIME:
        return 'When did this session take place?'
      case STEPS.RATING:
        return `How would you rate ${mentee?.name || "the mentee's"} progress?`
      case STEPS.SUMMARY:
        return 'What did you cover in this session?'
      case STEPS.NEXT_STEPS:
        return 'What should the mentee focus on next?'
      case STEPS.REVIEW:
        return 'Please review your session log before submitting'
      default:
        return ''
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>
      
      <Card padding="none" className="relative max-w-3xl w-full animate-scaleIn overflow-hidden">
        {/* Header with Progress */}
        <div className="bg-gradient-to-r from-baires-blue via-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">{getStepTitle()}</h2>
              <p className="text-orange-100 text-sm">{getStepDescription()}</p>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {[0, 1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step < currentStep 
                    ? 'bg-white text-baires-blue' 
                    : step === currentStep 
                    ? 'bg-white text-baires-blue scale-110' 
                    : 'bg-white/30 text-white'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step + 1}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                    step < currentStep ? 'bg-white' : 'bg-white/30'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step: Date & Time */}
          {currentStep === STEPS.DATE_TIME && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-neutral-black mb-3">
                  <Calendar className="w-4 h-4 text-baires-blue" />
                  Session Date
                </label>
                <input
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-4 rounded-[14px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none text-lg font-semibold"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-neutral-black mb-3">
                  <Clock className="w-4 h-4 text-baires-blue" />
                  Duration (minutes)
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[30, 45, 60, 90].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setFormData({ ...formData, duration: duration.toString() })}
                      className={`py-4 rounded-[14px] font-bold text-lg transition-all ${
                        formData.duration === duration.toString()
                          ? 'bg-gradient-to-r from-baires-blue to-blue-600 text-white shadow-lg scale-105'
                          : 'bg-neutral-100 text-neutral-black hover:bg-neutral-200'
                      }`}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Custom duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full mt-3 px-4 py-4 rounded-[14px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none text-lg"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-neutral-black mb-3">
                  <FileText className="w-4 h-4 text-baires-blue" />
                  Recording URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.recordingUrl}
                  onChange={(e) => setFormData({ ...formData, recordingUrl: e.target.value })}
                  className="w-full px-4 py-4 rounded-[14px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none text-lg"
                />
              </div>
            </div>
          )}

          {/* Step: Rating */}
          {currentStep === STEPS.RATING && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-blue-200 text-baires-blue px-4 py-2 rounded-full mb-4">
                  <Star className="w-4 h-4" />
                  <span className="font-bold text-sm">Rate the session progress</span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFormData({ ...formData, progressRating: rating })}
                    className={`aspect-square rounded-[20px] flex flex-col items-center justify-center gap-3 font-bold transition-all ${
                      formData.progressRating === rating
                        ? 'bg-gradient-to-br from-baires-blue to-blue-600 text-white shadow-2xl scale-110'
                        : 'bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-black hover:scale-105 hover:shadow-lg'
                    }`}
                  >
                    <span className="text-4xl">{rating}</span>
                    <Star className={`w-6 h-6 ${formData.progressRating === rating ? 'fill-white' : ''}`} />
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-4 text-center text-xs text-neutral-gray-dark font-semibold">
                <span>Needs<br/>Work</span>
                <span>Below<br/>Expected</span>
                <span>Meeting<br/>Goals</span>
                <span>Exceeding<br/>Goals</span>
                <span>Outstanding<br/>Progress</span>
              </div>
            </div>
          )}

          {/* Step: Summary */}
          {currentStep === STEPS.SUMMARY && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 text-sm font-bold text-neutral-black">
                  <FileText className="w-4 h-4 text-baires-blue" />
                  What happened in this session?
                </label>
                <button className="flex items-center gap-1 text-xs font-bold text-baires-blue hover:text-orange-700 transition-colors px-3 py-1.5 bg-orange-50 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  AI Assist
                </button>
              </div>
              
              <textarea
                rows="8"
                placeholder="Describe what topics were covered, skills practiced, challenges faced, and progress made during this session..."
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-4 py-4 rounded-[14px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none resize-none text-base leading-relaxed"
              ></textarea>

              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[14px] border border-blue-200">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-blue-900 text-sm mb-1">Pro Tip</div>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Be specific about what was covered and include any breakthroughs or challenges. This helps track progress over time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Next Steps */}
          {currentStep === STEPS.NEXT_STEPS && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 text-sm font-bold text-neutral-black">
                  <ArrowRight className="w-4 h-4 text-baires-blue" />
                  What should happen next?
                </label>
                <button className="flex items-center gap-1 text-xs font-bold text-baires-blue hover:text-orange-700 transition-colors px-3 py-1.5 bg-orange-50 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  AI Suggest
                </button>
              </div>
              
              <textarea
                rows="6"
                placeholder="Define clear action items, homework, resources to review, or skills to practice before the next session..."
                value={formData.nextSteps}
                onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                className="w-full px-4 py-4 rounded-[14px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none resize-none text-base leading-relaxed"
              ></textarea>

              <div className="p-4 bg-gradient-to-br from-orange-50 to-blue-100/50 rounded-[14px] border border-orange-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-baires-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-orange-900 text-sm mb-1">Best Practice</div>
                    <p className="text-xs text-orange-800 leading-relaxed">
                      Set clear, actionable goals that can be completed before the next session. This keeps momentum going!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Review */}
          {currentStep === STEPS.REVIEW && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-4">
                {/* Date & Duration */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[14px] border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-baires-blue" />
                      <span className="font-bold text-neutral-black text-sm">Session Info</span>
                    </div>
                    <button
                      onClick={() => setCurrentStep(STEPS.DATE_TIME)}
                      className="text-xs text-baires-blue hover:text-blue-700 font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-neutral-gray-dark">Date:</span>{' '}
                      <span className="font-semibold text-neutral-black">
                        {new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-gray-dark">Duration:</span>{' '}
                      <span className="font-semibold text-neutral-black">{formData.duration} min</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="p-4 bg-gradient-to-br from-orange-50 to-blue-100/50 rounded-[14px] border border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-baires-blue" />
                      <span className="font-bold text-neutral-black text-sm">Progress Rating</span>
                    </div>
                    <button
                      onClick={() => setCurrentStep(STEPS.RATING)}
                      className="text-xs text-baires-blue hover:text-orange-700 font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < formData.progressRating ? 'fill-baires-blue text-baires-blue' : 'text-neutral-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-neutral-black">{formData.progressRating}/5</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-[14px] border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="font-bold text-neutral-black text-sm">Session Summary</span>
                    </div>
                    <button
                      onClick={() => setCurrentStep(STEPS.SUMMARY)}
                      className="text-xs text-green-600 hover:text-green-700 font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-neutral-gray-dark leading-relaxed line-clamp-3">{formData.summary}</p>
                </div>

                {/* Next Steps */}
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-[14px] border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-purple-600" />
                      <span className="font-bold text-neutral-black text-sm">Next Steps</span>
                    </div>
                    <button
                      onClick={() => setCurrentStep(STEPS.NEXT_STEPS)}
                      className="text-xs text-purple-600 hover:text-purple-700 font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-neutral-gray-dark leading-relaxed line-clamp-3">{formData.nextSteps}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gradient-to-r from-neutral-50 to-neutral-100 border-t-2 border-neutral-200 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === STEPS.DATE_TIME}
            className="px-6 py-3 bg-white border-2 border-neutral-200 text-neutral-black rounded-[14px] font-semibold hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep < STEPS.REVIEW ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="px-8 py-3 bg-gradient-to-r from-baires-blue to-blue-600 text-white rounded-[14px] font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-[14px] font-bold hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Save Session Log
                </>
              )}
            </button>
          )}
        </div>
      </Card>
    </div>
  )
}

