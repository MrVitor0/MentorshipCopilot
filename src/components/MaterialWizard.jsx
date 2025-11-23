import { useState } from 'react'
import { 
  X as XIcon, 
  FileText, 
  Image, 
  Link as LinkIcon, 
  Video, 
  File,
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  Lightbulb,
  Download
} from 'lucide-react'
import { useConfirm } from '../hooks/useConfirm'
import Card from './Card'
import Button from './Button'

const STEPS = {
  TYPE: 0,
  DETAILS: 1,
  REVIEW: 2
}

const MATERIAL_TYPES = [
  { 
    id: 'pdf', 
    name: 'PDF Document', 
    icon: FileText, 
    color: 'from-red-500 to-red-600',
    bgColor: 'from-red-50 to-red-100/50',
    borderColor: 'border-red-200'
  },
  { 
    id: 'image', 
    name: 'Image', 
    icon: Image, 
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100/50',
    borderColor: 'border-purple-200'
  },
  { 
    id: 'link', 
    name: 'Link/URL', 
    icon: LinkIcon, 
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100/50',
    borderColor: 'border-blue-200'
  },
  { 
    id: 'video', 
    name: 'Video', 
    icon: Video, 
    color: 'from-pink-500 to-pink-600',
    bgColor: 'from-pink-50 to-pink-100/50',
    borderColor: 'border-pink-200'
  },
  { 
    id: 'spreadsheet', 
    name: 'Spreadsheet', 
    icon: File, 
    color: 'from-green-500 to-green-600',
    bgColor: 'from-green-50 to-green-100/50',
    borderColor: 'border-green-200'
  },
  { 
    id: 'other', 
    name: 'Other File', 
    icon: File, 
    color: 'from-neutral-500 to-neutral-600',
    bgColor: 'from-neutral-50 to-neutral-100/50',
    borderColor: 'border-neutral-200'
  }
]

export default function MaterialWizard({ isOpen, onClose, onSubmit }) {
  const confirm = useConfirm()
  const [currentStep, setCurrentStep] = useState(STEPS.TYPE)
  const [formData, setFormData] = useState({
    type: null,
    title: '',
    description: '',
    url: '',
    file: null,
    tags: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleNext = () => {
    if (currentStep < STEPS.REVIEW) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > STEPS.TYPE) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      handleClose()
    } catch (error) {
      console.error('Error submitting material:', error)
      await confirm.error(
        'Error adding material. Please try again.',
        'Error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setCurrentStep(STEPS.TYPE)
    setFormData({
      type: null,
      title: '',
      description: '',
      url: '',
      file: null,
      tags: []
    })
    onClose()
  }

  const selectedType = MATERIAL_TYPES.find(t => t.id === formData.type)

  const isStepValid = () => {
    switch (currentStep) {
      case STEPS.TYPE:
        return formData.type !== null
      case STEPS.DETAILS:
        if (formData.type === 'link') {
          return formData.title.trim() && formData.url.trim()
        }
        return formData.title.trim() && (formData.file || formData.url.trim())
      default:
        return true
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case STEPS.TYPE:
        return 'Choose Material Type'
      case STEPS.DETAILS:
        return 'Material Details'
      case STEPS.REVIEW:
        return 'Review & Confirm'
      default:
        return ''
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case STEPS.TYPE:
        return 'What type of material are you adding?'
      case STEPS.DETAILS:
        return 'Provide information about this material'
      case STEPS.REVIEW:
        return 'Please review your material before adding'
      default:
        return ''
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>
      
      <Card padding="none" className="relative max-w-3xl w-full animate-scaleIn overflow-hidden">
        {/* Header with Progress */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">{getStepTitle()}</h2>
              <p className="text-blue-100 text-sm">{getStepDescription()}</p>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[0, 1, 2].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step < currentStep 
                    ? 'bg-white text-blue-600' 
                    : step === currentStep 
                    ? 'bg-white text-blue-600 scale-110' 
                    : 'bg-white/30 text-white'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step + 1}
                </div>
                {step < 2 && (
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
          {/* Step: Type Selection */}
          {currentStep === STEPS.TYPE && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {MATERIAL_TYPES.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, type: type.id })}
                      className={`p-6 rounded-[16px] border-2 transition-all ${
                        formData.type === type.id
                          ? `bg-gradient-to-br ${type.bgColor} ${type.borderColor} shadow-lg scale-105`
                          : 'bg-white border-neutral-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-[12px] bg-gradient-to-br ${type.color} flex items-center justify-center mb-3 mx-auto`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-center font-bold text-neutral-black text-sm">
                        {type.name}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[14px] border border-blue-200">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-blue-900 text-sm mb-1">Tip</div>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Choose the type that best matches your material. You can add links to external files or upload documents directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Details */}
          {currentStep === STEPS.DETAILS && selectedType && (
            <div className="space-y-6 animate-fadeIn">
              {/* Title */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-neutral-black mb-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., React Best Practices Guide"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-4 rounded-[14px] border-2 border-neutral-200 focus:border-blue-500 focus:outline-none text-lg font-semibold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-neutral-black mb-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Description (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe what this material covers..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-4 rounded-[14px] border-2 border-neutral-200 focus:border-blue-500 focus:outline-none resize-none"
                ></textarea>
              </div>

              {/* URL or File Upload */}
              {formData.type === 'link' ? (
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-neutral-black mb-3">
                    <LinkIcon className="w-4 h-4 text-blue-600" />
                    URL *
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-4 py-4 rounded-[14px] border-2 border-neutral-200 focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-black mb-3">
                      <LinkIcon className="w-4 h-4 text-blue-600" />
                      External URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://... (e.g., Google Drive link)"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full px-4 py-4 rounded-[14px] border-2 border-neutral-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="text-center text-neutral-gray-dark font-semibold text-sm">OR</div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-black mb-3">
                      <Upload className="w-4 h-4 text-blue-600" />
                      Upload File
                    </label>
                    <div className="border-2 border-dashed border-neutral-300 rounded-[14px] p-8 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-neutral-gray-dark mx-auto mb-3" />
                        {formData.file ? (
                          <div>
                            <p className="font-bold text-neutral-black mb-1">{formData.file.name}</p>
                            <p className="text-xs text-neutral-gray-dark">
                              {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <>
                            <p className="font-bold text-neutral-black mb-1">Click to upload</p>
                            <p className="text-xs text-neutral-gray-dark">or drag and drop</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-[14px] border border-green-200">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-green-900 text-sm mb-1">Pro Tip</div>
                    <p className="text-xs text-green-800 leading-relaxed">
                      Add clear titles and descriptions to help your mentee understand what each material is for and when to use it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Review */}
          {currentStep === STEPS.REVIEW && selectedType && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-4">
                {/* Type */}
                <div className={`p-4 bg-gradient-to-br ${selectedType.bgColor} rounded-[14px] border ${selectedType.borderColor}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <selectedType.icon className="w-4 h-4 text-neutral-black" />
                      <span className="font-bold text-neutral-black text-sm">Material Type</span>
                    </div>
                    <button
                      onClick={() => setCurrentStep(STEPS.TYPE)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedType.color} flex items-center justify-center`}>
                      <selectedType.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-neutral-black">{selectedType.name}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[14px] border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-neutral-black text-sm">Details</span>
                    </div>
                    <button
                      onClick={() => setCurrentStep(STEPS.DETAILS)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-neutral-gray-dark">Title:</span>{' '}
                      <span className="font-semibold text-neutral-black">{formData.title}</span>
                    </div>
                    {formData.description && (
                      <div>
                        <span className="text-xs text-neutral-gray-dark">Description:</span>{' '}
                        <p className="text-sm text-neutral-black mt-1">{formData.description}</p>
                      </div>
                    )}
                    {formData.url && (
                      <div>
                        <span className="text-xs text-neutral-gray-dark">URL:</span>{' '}
                        <a href={formData.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                          {formData.url}
                        </a>
                      </div>
                    )}
                    {formData.file && (
                      <div>
                        <span className="text-xs text-neutral-gray-dark">File:</span>{' '}
                        <span className="text-sm font-semibold text-neutral-black">{formData.file.name}</span>
                        <span className="text-xs text-neutral-gray-dark ml-2">
                          ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gradient-to-r from-neutral-50 to-neutral-100 border-t-2 border-neutral-200 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === STEPS.TYPE}
            className="px-6 py-3 bg-white border-2 border-neutral-200 text-neutral-black rounded-[14px] font-semibold hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep < STEPS.REVIEW ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-[14px] font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
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
                  Adding...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Add Material
                </>
              )}
            </button>
          )}
        </div>
      </Card>
    </div>
  )
}

