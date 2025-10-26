import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { completeOnboarding } from '../services/firestoreService'
import Button from '../components/Button'
import SEO from '../components/SEO'
import { 
  User, 
  FileText, 
  Users, 
  Code, 
  Star, 
  Camera, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Sparkles,
  Briefcase,
  Target,
  Plus
} from 'lucide-react'

const USER_TYPES = [
  { 
    id: 'mentor', 
    label: 'Mentor', 
    icon: Users,
    description: 'I want to share knowledge and guide others'
  },
  { 
    id: 'pm', 
    label: 'Product Manager', 
    icon: Briefcase,
    description: 'I manage products and teams'
  },
  { 
    id: 'mentee', 
    label: 'Mentee', 
    icon: Target,
    description: 'I seek guidance and professional growth'
  }
]

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [techInput, setTechInput] = useState('')
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    userType: '',
    technologies: [],
    techLevels: {},
    project: '',
    photoURL: ''
  })

  const { user, refreshUser, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Redirect if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-orange-50/15">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-baires-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-gray-dark font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    navigate('/login')
    return null
  }

  // Calculate total steps based on user type
  const getTotalSteps = () => {
    if (formData.userType === 'mentee') return 4 // Name, Bio, Type, Tech/Project
    if (formData.userType === 'pm') return 3 // Name, Bio, Type (no tech)
    return 5 // Mentor: Name, Bio, Type, Tech, Levels
  }
  
  const totalSteps = getTotalSteps()

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTechnology = () => {
    const tech = techInput.trim()
    if (tech) {
      // Capitalize first letter of each word
      const capitalizedTech = tech
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
      
      // Check if already exists (case-insensitive)
      const exists = formData.technologies.some(
        t => t.toLowerCase() === capitalizedTech.toLowerCase()
      )
      
      if (!exists) {
        setFormData(prev => ({
          ...prev,
          technologies: [...prev.technologies, capitalizedTech],
          techLevels: { ...prev.techLevels, [capitalizedTech]: 3 } // Default level 3
        }))
        setTechInput('')
      } else {
        // Clear input if duplicate
        setTechInput('')
      }
    }
  }

  const removeTechnology = (tech) => {
    setFormData(prev => {
      const newTechLevels = { ...prev.techLevels }
      delete newTechLevels[tech]
      return {
        ...prev,
        technologies: prev.technologies.filter(t => t !== tech),
        techLevels: newTechLevels
      }
    })
  }

  const setTechLevel = (tech, level) => {
    setFormData(prev => ({
      ...prev,
      techLevels: { ...prev.techLevels, [tech]: level }
    }))
  }

  const handleTechInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTechnology()
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const onboardingData = {
        displayName: formData.displayName || user.displayName || '',
        bio: formData.bio,
        userType: formData.userType,
        photoURL: formData.photoURL || user.photoURL || ''
      }

      // Only add technologies for mentors and mentees
      if (formData.userType === 'mentor') {
        onboardingData.technologies = formData.technologies.map(tech => ({
          name: tech,
          level: formData.techLevels[tech] || 3
        }))
      } else if (formData.userType === 'mentee') {
        onboardingData.technologies = formData.technologies.map(tech => ({
          name: tech,
          level: 0 // Mentees don't have levels
        }))
        onboardingData.project = formData.project || ''
      }
      // PMs don't have technologies

      await completeOnboarding(user.uid, onboardingData)
      await refreshUser()
      navigate('/dashboard')
    } catch (error) {
      console.error('Error completing onboarding:', error)
      alert('Error completing onboarding. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.displayName.trim().length > 0
      case 2:
        return formData.bio.trim().length > 0
      case 3:
        return formData.userType !== ''
      case 4:
        // PM: ready to finish (no tech needed)
        if (formData.userType === 'pm') return true
        // Mentee: can proceed without tech (optional)
        if (formData.userType === 'mentee') return true
        // Mentor: needs at least one tech
        return formData.technologies.length > 0
      case 5:
        // Only mentors reach step 5 (tech levels)
        return formData.technologies.length > 0
      default:
        return true
    }
  }

  return (
    <>
      <SEO title="Complete your profile" description="Set up your account to get started" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-orange-50/15 p-4">
        <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-neutral-black">
                Step {step} of {totalSteps}
              </span>
              <span className="text-sm font-semibold text-baires-orange">
                {Math.round((step / totalSteps) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-baires-orange to-orange-600 transition-all duration-300 rounded-full"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-[24px] shadow-xl border border-neutral-200/50 p-8">
            {/* Step 1: Name */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[20px] shadow-lg mb-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-black mb-2">What should we call you?</h2>
                  <p className="text-neutral-gray-dark">This will be your display name on the platform</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-black mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => handleChange('displayName', e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-baires-orange focus:border-transparent transition-all"
                    placeholder="Your full name"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Bio */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[20px] shadow-lg mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-black mb-2">Tell us about yourself</h2>
                  <p className="text-neutral-gray-dark">A brief description of your professional profile</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-black mb-2">
                    Profile Description
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    rows={5}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-baires-orange focus:border-transparent transition-all resize-none"
                    placeholder="Ex: Full Stack Developer with 5 years of experience in React and Node.js..."
                  />
                  <p className="text-xs text-neutral-gray-dark mt-2">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: User Type */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[20px] shadow-lg mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-black mb-2">What's your role?</h2>
                  <p className="text-neutral-gray-dark">Select the option that best describes you</p>
                </div>

                <div className="grid gap-4">
                  {USER_TYPES.map((type) => {
                    const Icon = type.icon
                    const isSelected = formData.userType === type.id
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleChange('userType', type.id)}
                        className={`p-6 rounded-[20px] border-2 transition-all text-left ${
                          isSelected
                            ? 'border-baires-orange bg-orange-50 shadow-lg'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'bg-gradient-to-br from-baires-orange to-orange-600 text-white'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-neutral-black mb-1 flex items-center gap-2">
                              {type.label}
                              {isSelected && <Check className="w-5 h-5 text-baires-orange" />}
                            </h3>
                            <p className="text-sm text-neutral-gray-dark">{type.description}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Technologies and Project (not for PMs) */}
            {step === 4 && formData.userType !== 'pm' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[20px] shadow-lg mb-4">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-black mb-2">
                    {formData.userType === 'mentor' ? 'What technologies do you master?' : 'What are you working with?'}
                  </h2>
                  <p className="text-neutral-gray-dark">
                    {formData.userType === 'mentor' 
                      ? 'Add technologies you can mentor others in' 
                      : 'Tell us about your project and technologies'}
                  </p>
                </div>

                {formData.userType === 'mentee' && (
                  <div>
                    <label className="block text-sm font-semibold text-neutral-black mb-2">
                      Current Project <span className="text-neutral-gray-dark font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.project}
                      onChange={(e) => handleChange('project', e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-baires-orange focus:border-transparent transition-all"
                      placeholder="e.g., Sales Management System"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-neutral-black mb-2">
                    Technologies
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={handleTechInputKeyPress}
                      className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-baires-orange focus:border-transparent transition-all"
                      placeholder="Type a technology and press Enter (e.g., React, Python, AWS)"
                    />
                    <Button
                      type="button"
                      variant="orange"
                      onClick={addTechnology}
                      icon={<Plus className="w-4 h-4" />}
                      disabled={!techInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-gray-dark mt-2">
                    Press Enter or click Add to add each technology
                  </p>
                </div>

                {formData.technologies.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-neutral-black mb-2">
                      Added Technologies ({formData.technologies.length})
                    </label>
                    <div className="flex flex-wrap gap-2 p-4 bg-neutral-50 rounded-[14px] min-h-[80px]">
                      {formData.technologies.map((tech) => (
                        <div
                          key={tech}
                          className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-baires-orange to-orange-600 text-white rounded-[10px] shadow-md"
                        >
                          <span className="font-semibold">{tech}</span>
                          <button
                            type="button"
                            onClick={() => removeTechnology(tech)}
                            className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                          >
                            <span className="text-white text-sm">×</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Tech Levels (only for mentors) */}
            {step === 5 && formData.userType === 'mentor' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-[20px] shadow-lg mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-black mb-2">Rate your expertise level</h2>
                  <p className="text-neutral-gray-dark">Rate your knowledge from 1 to 5 stars for each technology</p>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {formData.technologies.map((tech) => (
                    <div key={tech} className="p-4 bg-neutral-50 rounded-[14px] hover:bg-neutral-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-neutral-black">{tech}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => setTechLevel(tech, level)}
                              className="group"
                              title={`${level} ${level === 1 ? 'star' : 'stars'}`}
                            >
                              <Star
                                className={`w-6 h-6 transition-all ${
                                  level <= (formData.techLevels[tech] || 3)
                                    ? 'fill-baires-orange text-baires-orange'
                                    : 'text-neutral-300 group-hover:text-baires-orange'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-neutral-gray-dark mt-1">
                        {formData.techLevels[tech] === 1 && 'Beginner'}
                        {formData.techLevels[tech] === 2 && 'Elementary'}
                        {formData.techLevels[tech] === 3 && 'Intermediate'}
                        {formData.techLevels[tech] === 4 && 'Advanced'}
                        {formData.techLevels[tech] === 5 && 'Expert'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  icon={<ArrowLeft className="w-4 h-4" />}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              
              {step < totalSteps ? (
                <Button
                  variant="orange"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  className="flex-1"
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="orange"
                  onClick={handleComplete}
                  disabled={!canProceed() || loading}
                  icon={<Check className="w-4 h-4" />}
                  iconPosition="right"
                  className="flex-1"
                >
                  {loading ? 'Completing...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

