import { useState, useEffect } from 'react'
import { 
  X as XIcon, 
  Target, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  TrendingUp,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react'
import { useConfirm } from '../hooks/useConfirm'
import Card from './Card'
import Button from './Button'

const STEPS = {
  LIST: 0,
  FORM: 1,
  REVIEW: 2
}

const DEFAULT_GOALS = [
  { id: 'sessions', name: 'Total Sessions', description: 'Number of mentorship sessions completed', current: 0, target: 10, variant: 'blue' },
  { id: 'progress', name: 'Overall Progress', description: 'Overall mentorship completion percentage', current: 0, target: 100, variant: 'green', unit: '%' },
  { id: 'duration', name: 'Duration', description: 'Weeks since mentorship started', current: 0, target: 12, variant: 'purple', unit: 'w' },
  { id: 'rating', name: 'Avg Rating', description: 'Average session rating', current: 0, target: 5, variant: 'orange', unit: '/5' }
]

const VARIANTS = [
  { id: 'blue', label: 'Blue', color: 'from-blue-500 to-blue-600' },
  { id: 'green', label: 'Green', color: 'from-green-500 to-green-600' },
  { id: 'purple', label: 'Purple', color: 'from-purple-500 to-purple-600' },
  { id: 'orange', label: 'Orange', color: 'from-orange-500 to-blue-600' },
  { id: 'pink', label: 'Pink', color: 'from-pink-500 to-pink-600' },
  { id: 'yellow', label: 'Yellow', color: 'from-yellow-500 to-yellow-600' }
]

export default function GoalWizard({ isOpen, onClose, onSubmit, initialGoals }) {
  const [currentStep, setCurrentStep] = useState(STEPS.LIST)
  const [goals, setGoals] = useState(initialGoals || [])
  const [editingGoal, setEditingGoal] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    current: 0,
    target: 0,
    variant: 'blue',
    unit: ''
  })

  // Sync goals when initialGoals changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setGoals(initialGoals || [])
    }
  }, [isOpen, initialGoals])

  if (!isOpen) return null

  const handleClose = () => {
    setCurrentStep(STEPS.LIST)
    setEditingGoal(null)
    setFormData({
      name: '',
      description: '',
      current: 0,
      target: 0,
      variant: 'blue',
      unit: ''
    })
    onClose()
  }

  const handleAddNew = () => {
    setEditingGoal(null)
    setFormData({
      name: '',
      description: '',
      current: 0,
      target: 0,
      variant: 'blue',
      unit: ''
    })
    setCurrentStep(STEPS.FORM)
  }

  const handleEdit = (goal) => {
    setEditingGoal(goal)
    setFormData({
      name: goal.name,
      description: goal.description,
      current: goal.current,
      target: goal.target,
      variant: goal.variant || 'blue',
      unit: goal.unit || ''
    })
    setCurrentStep(STEPS.FORM)
  }

  const handleDelete = (goalId) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      setGoals((goals || []).filter(g => g.id !== goalId))
    }
  }

  const handleFormSubmit = () => {
    if (editingGoal) {
      // Update existing goal
      setGoals((goals || []).map(g => g.id === editingGoal.id ? { ...editingGoal, ...formData } : g))
    } else {
      // Add new goal
      const newGoal = {
        id: `goal_${Date.now()}`,
        ...formData
      }
      setGoals([...(goals || []), newGoal])
    }
    setCurrentStep(STEPS.REVIEW)
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(goals)
      handleClose()
    } catch (error) {
      console.error('Error submitting goals:', error)
      await confirm.error(
        'Error saving goals. Please try again.',
        'Error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return formData.name.trim() && formData.target > 0
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case STEPS.LIST:
        return 'Manage Progress Goals'
      case STEPS.FORM:
        return editingGoal ? 'Edit Goal' : 'Create New Goal'
      case STEPS.REVIEW:
        return 'Review Goals'
      default:
        return ''
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>
      
      <Card padding="none" className="relative max-w-4xl w-full animate-scaleIn overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold mb-1">{getStepTitle()}</h2>
              <p className="text-orange-100 text-sm">
                {currentStep === STEPS.LIST && 'Customize your mentorship progress metrics'}
                {currentStep === STEPS.FORM && 'Define your goal details'}
                {currentStep === STEPS.REVIEW && 'Review and confirm your goals'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Step: List */}
          {currentStep === STEPS.LIST && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <p className="text-neutral-gray-dark">
                  Current Goals: <span className="font-bold text-neutral-black">{goals?.length || 0}</span>
                </p>
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-[12px] font-semibold hover:shadow-md transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Goal
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(goals || []).map((goal) => {
                  const variant = VARIANTS.find(v => v.id === goal.variant) || VARIANTS[0]
                  return (
                    <Card key={goal.id} padding="md" className="bg-gradient-to-br from-white to-neutral-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className={`inline-block px-2 py-1 rounded-full bg-gradient-to-r ${variant.color} text-white text-xs font-bold mb-2`}>
                            {variant.label}
                          </div>
                          <h3 className="font-bold text-neutral-black text-lg mb-1">{goal.name}</h3>
                          <p className="text-sm text-neutral-gray-dark mb-3">{goal.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-neutral-black">
                              {goal.current}{goal.unit}
                            </span>
                            <span className="text-neutral-gray-dark">/</span>
                            <span className="text-xl font-semibold text-neutral-gray-dark">
                              {goal.target}{goal.unit}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-3">
                          <button
                            onClick={() => handleEdit(goal)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(goal.id)}
                            className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>

              {(!goals || goals.length === 0) && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-orange-600" />
                  </div>
                  <h4 className="text-lg font-bold text-neutral-black mb-2">No Custom Goals Yet</h4>
                  <p className="text-sm text-neutral-gray-dark mb-4">
                    Add your first custom goal to start tracking specific progress metrics.<br/>
                    If you don't add custom goals, default goals will be displayed.
                  </p>
                  <button
                    onClick={handleAddNew}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-[14px] font-semibold hover:shadow-md transition-all flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Add Your First Goal
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step: Form */}
          {currentStep === STEPS.FORM && (
            <div className="space-y-6 animate-fadeIn">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-neutral-black mb-3">
                  <Target className="w-4 h-4 text-orange-600" />
                  Goal Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Total Sessions, Code Reviews"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-4 rounded-[14px] border-2 border-neutral-200 focus:border-orange-500 focus:outline-none text-lg font-semibold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-neutral-black mb-3">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe what this goal measures..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-4 rounded-[14px] border-2 border-neutral-200 focus:border-orange-500 focus:outline-none resize-none"
                ></textarea>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-neutral-black mb-3">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    Current Value
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-4 rounded-[14px] border-2 border-neutral-200 focus:border-orange-500 focus:outline-none text-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-neutral-black mb-3">
                    <Target className="w-4 h-4 text-orange-600" />
                    Target Value *
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-4 rounded-[14px] border-2 border-neutral-200 focus:border-orange-500 focus:outline-none text-lg font-semibold"
                  />
                </div>
              </div>

              {/* Unit */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-neutral-black mb-3">
                  Unit (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., %, /5, hrs, sessions"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-4 rounded-[14px] border-2 border-neutral-200 focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Color Variant */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-neutral-black mb-3">
                  Color Theme
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {VARIANTS.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setFormData({ ...formData, variant: variant.id })}
                      className={`p-4 rounded-[12px] border-2 transition-all ${
                        formData.variant === variant.id
                          ? 'border-orange-500 shadow-lg scale-105'
                          : 'border-neutral-200 hover:border-orange-300'
                      }`}
                    >
                      <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${variant.color} mb-2`}></div>
                      <p className="text-xs font-semibold text-neutral-black">{variant.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step: Review */}
          {currentStep === STEPS.REVIEW && (
            <div className="space-y-6 animate-fadeIn">
              <div className={`p-4 bg-gradient-to-br rounded-[14px] border ${
                goals && goals.length > 0 
                  ? 'from-green-50 to-green-100/50 border-green-200' 
                  : 'from-blue-50 to-blue-100/50 border-blue-200'
              }`}>
                <div className="flex items-start gap-3">
                  <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    goals && goals.length > 0 ? 'text-green-600' : 'text-blue-600'
                  }`} />
                  <div>
                    <p className="text-sm font-semibold text-neutral-black mb-1">
                      {goals && goals.length > 0 ? 'Goals Configured' : 'Using Default Goals'}
                    </p>
                    <p className="text-xs text-neutral-gray-dark leading-relaxed">
                      {goals && goals.length > 0 
                        ? `You have ${goals.length} custom goal${goals.length !== 1 ? 's' : ''} configured. These will be displayed in your Progress Analytics section.`
                        : 'No custom goals configured. Default goals (Total Sessions, Overall Progress, Duration, Avg Rating) will be displayed. You can add custom goals anytime.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {goals && goals.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goals.map((goal) => {
                    const variant = VARIANTS.find(v => v.id === goal.variant) || VARIANTS[0]
                    return (
                      <Card key={goal.id} padding="md" className="bg-gradient-to-br from-white to-neutral-50">
                        <div className={`inline-block px-2 py-1 rounded-full bg-gradient-to-r ${variant.color} text-white text-xs font-bold mb-2`}>
                          {variant.label}
                        </div>
                        <h3 className="font-bold text-neutral-black text-lg mb-1">{goal.name}</h3>
                        <p className="text-sm text-neutral-gray-dark mb-3">{goal.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-neutral-black">
                            {goal.current}{goal.unit || ''}
                          </span>
                          <span className="text-neutral-gray-dark">/</span>
                          <span className="text-xl font-semibold text-neutral-gray-dark">
                            {goal.target}{goal.unit || ''}
                          </span>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gradient-to-r from-neutral-50 to-neutral-100 border-t-2 border-neutral-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (currentStep === STEPS.FORM) {
                setCurrentStep(STEPS.LIST)
              } else if (currentStep === STEPS.REVIEW) {
                setCurrentStep(STEPS.LIST)
              } else {
                handleClose()
              }
            }}
            className="px-6 py-3 bg-white border-2 border-neutral-200 text-neutral-black rounded-[14px] font-semibold hover:bg-neutral-50 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === STEPS.LIST ? 'Cancel' : 'Back'}
          </button>

          {currentStep === STEPS.LIST ? (
            <button
              onClick={() => setCurrentStep(STEPS.REVIEW)}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-[14px] font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              {goals && goals.length > 0 ? 'Review & Save' : 'Save (Use Defaults)'}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : currentStep === STEPS.FORM ? (
            <button
              onClick={handleFormSubmit}
              disabled={!isFormValid()}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-[14px] font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {editingGoal ? 'Update' : 'Add'} Goal
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
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
                  Save Goals
                </>
              )}
            </button>
          )}
        </div>
      </Card>
    </div>
  )
}

