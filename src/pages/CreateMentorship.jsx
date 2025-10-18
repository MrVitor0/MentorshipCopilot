import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Rocket,
  Zap,
  Search,
  Code,
  Database,
  Cloud,
  Smartphone,
  Globe,
  Layout,
  Terminal,
  GitBranch,
  Bot,
  Target,
  Users,
  CheckCircle,
  Loader2
} from 'lucide-react'

const technologies = [
  { id: 'react', name: 'React', icon: Layout, color: 'from-blue-400 to-blue-600' },
  { id: 'nodejs', name: 'Node.js', icon: Terminal, color: 'from-green-500 to-green-600' },
  { id: 'python', name: 'Python', icon: Code, color: 'from-yellow-500 to-yellow-600' },
  { id: 'database', name: 'Database Design', icon: Database, color: 'from-purple-500 to-purple-600' },
  { id: 'cloud', name: 'Cloud/AWS', icon: Cloud, color: 'from-cyan-400 to-cyan-600' },
  { id: 'mobile', name: 'Mobile Dev', icon: Smartphone, color: 'from-pink-500 to-pink-600' },
  { id: 'frontend', name: 'Frontend', icon: Globe, color: 'from-baires-orange to-orange-600' },
  { id: 'git', name: 'Git/DevOps', icon: GitBranch, color: 'from-gray-600 to-gray-700' },
]

const employees = [
  { id: 1, name: 'Sarah Johnson', role: 'Junior Developer', avatar: 'https://i.pravatar.cc/150?img=1', skills: ['JavaScript', 'React'] },
  { id: 2, name: 'Michael Chen', role: 'Mid-Level Engineer', avatar: 'https://i.pravatar.cc/150?img=2', skills: ['Python', 'Django'] },
  { id: 3, name: 'Emma Davis', role: 'Senior Developer', avatar: 'https://i.pravatar.cc/150?img=3', skills: ['Node.js', 'AWS'] },
  { id: 4, name: 'James Wilson', role: 'Junior Developer', avatar: 'https://i.pravatar.cc/150?img=4', skills: ['JavaScript', 'Vue'] },
  { id: 5, name: 'Lisa Anderson', role: 'Mid-Level Engineer', avatar: 'https://i.pravatar.cc/150?img=5', skills: ['React', 'TypeScript'] },
  { id: 6, name: 'David Martinez', role: 'Junior Developer', avatar: 'https://i.pravatar.cc/150?img=6', skills: ['Python', 'FastAPI'] },
]

export default function CreateMentorship() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTechs, setSelectedTechs] = useState([])
  const [selectedMentee, setSelectedMentee] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [problemDescription, setProblemDescription] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleTech = (techId) => {
    setSelectedTechs(prev => 
      prev.includes(techId) 
        ? prev.filter(id => id !== techId)
        : [...prev, techId]
    )
  }

  const handleNext = () => {
    if (currentStep === 4) {
      setIsProcessing(true)
      setTimeout(() => {
        navigate('/find-mentors', { 
          state: { 
            mentee: selectedMentee,
            technologies: selectedTechs,
            problem: problemDescription 
          }
        })
      }, 3000)
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const canProceed = () => {
    if (currentStep === 1) return true
    if (currentStep === 2) return selectedTechs.length > 0
    if (currentStep === 3) return selectedMentee !== null
    if (currentStep === 4) return problemDescription.trim().length > 20
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-orange-50/20 p-4 md:p-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-orange-300/25 to-orange-100/20 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-black to-baires-orange bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-baires-orange animate-pulse" />
              Create Mentorship
            </h1>
            <Badge variant="orange" className="flex items-center gap-1">
              <Bot className="w-3 h-3" />
              AI-Powered
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                  step <= currentStep 
                    ? 'bg-gradient-to-r from-baires-orange to-orange-600' 
                    : 'bg-neutral-200'
                }`}></div>
                {step < 4 && <div className="w-2"></div>}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-semibold text-neutral-gray-dark">
            <span className={currentStep === 1 ? 'text-baires-orange' : ''}>Intro</span>
            <span className={currentStep === 2 ? 'text-baires-orange' : ''}>Skills</span>
            <span className={currentStep === 3 ? 'text-baires-orange' : ''}>Mentee</span>
            <span className={currentStep === 4 ? 'text-baires-orange' : ''}>Details</span>
          </div>
        </div>

        {/* Step Content */}
        <Card padding="none" className="overflow-hidden animate-scaleIn">
          {/* Step 1: Introduction */}
          {currentStep === 1 && (
            <div className="p-8 md:p-12 text-center bg-gradient-to-br from-orange-50 via-white to-blue-50">
              <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[24px] flex items-center justify-center shadow-2xl mx-auto mb-6 animate-float">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-4xl font-bold text-neutral-black mb-4">
                  Let's Find the Perfect Mentor
                </h2>
                
                <p className="text-lg text-neutral-gray-dark mb-8 leading-relaxed">
                  Our <span className="font-bold text-baires-orange">AI-powered matching system</span> will analyze your team member's needs and suggest the <span className="font-bold">top 3 most compatible mentors</span> from our entire talent pool.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="p-6 bg-white rounded-[20px] border-2 border-orange-200/50 hover:shadow-lg transition-all">
                    <Sparkles className="w-8 h-8 text-baires-orange mx-auto mb-3" />
                    <h3 className="font-bold text-neutral-black mb-2">AI Analysis</h3>
                    <p className="text-sm text-neutral-gray-dark">Smart skill matching</p>
                  </div>
                  <div className="p-6 bg-white rounded-[20px] border-2 border-blue-200/50 hover:shadow-lg transition-all">
                    <Users className="w-8 h-8 text-baires-blue mx-auto mb-3" />
                    <h3 className="font-bold text-neutral-black mb-2">Hidden Talent</h3>
                    <p className="text-sm text-neutral-gray-dark">Find niche experts</p>
                  </div>
                  <div className="p-6 bg-white rounded-[20px] border-2 border-green-200/50 hover:shadow-lg transition-all">
                    <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-bold text-neutral-black mb-2">Best Match</h3>
                    <p className="text-sm text-neutral-gray-dark">Top 3 suggestions</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-orange-100 text-baires-orange px-4 py-2 rounded-full text-sm font-semibold">
                  <Zap className="w-4 h-4" />
                  Takes only 2 minutes
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Select Technologies */}
          {currentStep === 2 && (
            <div className="p-8 md:p-12 bg-gradient-to-br from-white to-orange-50/30">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-baires-orange to-orange-600 text-white px-4 py-2 rounded-full mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold text-sm">AI will analyze these skills</span>
                  </div>
                  <h2 className="text-3xl font-bold text-neutral-black mb-3">
                    Which skills need improvement?
                  </h2>
                  <p className="text-neutral-gray-dark">
                    Select all technologies where the team member needs guidance
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {technologies.map((tech) => {
                    const isSelected = selectedTechs.includes(tech.id)
                    const TechIcon = tech.icon
                    
                    return (
                      <button
                        key={tech.id}
                        onClick={() => toggleTech(tech.id)}
                        className={`group relative p-6 rounded-[20px] border-2 transition-all duration-300 ${
                          isSelected
                            ? 'border-baires-orange bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg scale-105'
                            : 'border-neutral-200 bg-white hover:border-orange-300 hover:shadow-md hover:scale-105'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-baires-orange to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                        
                        <div className={`w-12 h-12 bg-gradient-to-br ${tech.color} rounded-[14px] flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                          <TechIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className={`font-bold text-sm ${isSelected ? 'text-baires-orange' : 'text-neutral-black'}`}>
                          {tech.name}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {selectedTechs.length > 0 && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-[16px] border border-green-200 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-green-900">
                      {selectedTechs.length} skill{selectedTechs.length > 1 ? 's' : ''} selected - AI will find specialists in these areas
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Select Mentee */}
          {currentStep === 3 && (
            <div className="p-8 md:p-12 bg-gradient-to-br from-white to-blue-50/30">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-baires-blue to-blue-600 text-white px-4 py-2 rounded-full mb-4">
                    <Users className="w-4 h-4" />
                    <span className="font-semibold text-sm">AI-powered search</span>
                  </div>
                  <h2 className="text-3xl font-bold text-neutral-black mb-3">
                    Who needs mentorship?
                  </h2>
                  <p className="text-neutral-gray-dark mb-6">
                    Search for the team member who will be mentored
                  </p>

                  {/* Search Input */}
                  <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray-dark" />
                    <input
                      type="text"
                      placeholder="Type name or role..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-[16px] border-2 border-neutral-200 focus:border-baires-orange focus:outline-none text-lg shadow-lg"
                    />
                  </div>
                </div>

                {/* Employee Cards Carousel */}
                <div className="relative">
                  <div className="overflow-x-auto pb-4 -mx-4 px-4">
                    <div className="flex gap-4 min-w-max">
                      {filteredEmployees.map((employee) => {
                        const isSelected = selectedMentee?.id === employee.id
                        
                        return (
                          <button
                            key={employee.id}
                            onClick={() => setSelectedMentee(employee)}
                            className={`group relative w-64 p-6 rounded-[24px] border-2 transition-all duration-300 flex-shrink-0 ${
                              isSelected
                                ? 'border-baires-orange bg-gradient-to-br from-orange-50 to-orange-100 shadow-xl scale-105'
                                : 'border-neutral-200 bg-white hover:border-orange-300 hover:shadow-lg hover:scale-105'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-baires-orange to-orange-600 rounded-full flex items-center justify-center shadow-lg animate-scaleIn">
                                <CheckCircle className="w-5 h-5 text-white" />
                              </div>
                            )}
                            
                            <div className="text-center">
                              <div className="relative inline-block mb-4">
                                <Avatar src={employee.avatar} size="2xl" />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                              </div>
                              
                              <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-baires-orange' : 'text-neutral-black'}`}>
                                {employee.name}
                              </h3>
                              <p className="text-sm text-neutral-gray-dark mb-4">{employee.role}</p>
                              
                              <div className="flex flex-wrap gap-2 justify-center">
                                {employee.skills.map((skill, idx) => (
                                  <span key={idx} className="text-xs bg-neutral-100 text-neutral-gray-dark px-2 py-1 rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  
                  {filteredEmployees.length > 3 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white via-white to-transparent w-20 h-full flex items-center justify-end pointer-events-none">
                      <ArrowRight className="w-6 h-6 text-baires-orange animate-pulse" />
                    </div>
                  )}
                </div>

                {selectedMentee && (
                  <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-[20px] border-2 border-blue-300 flex items-center gap-4">
                    <CheckCircle className="w-6 h-6 text-baires-blue" />
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-blue-900">
                        Selected: <span className="text-neutral-black">{selectedMentee.name}</span>
                      </span>
                      <p className="text-xs text-blue-800">AI will find the best mentors for {selectedMentee.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Problem Description */}
          {currentStep === 4 && !isProcessing && (
            <div className="p-8 md:p-12 bg-gradient-to-br from-white to-orange-50/30">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-baires-orange to-orange-600 text-white px-4 py-2 rounded-full mb-4">
                    <Bot className="w-4 h-4" />
                    <span className="font-semibold text-sm">AI will analyze this</span>
                  </div>
                  <h2 className="text-3xl font-bold text-neutral-black mb-3">
                    Describe the Challenge
                  </h2>
                  <p className="text-neutral-gray-dark">
                    Tell us what {selectedMentee?.name} needs help with. Be specific - our AI will use this to find the perfect match.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[20px] border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar src={selectedMentee?.avatar} size="md" />
                    <div>
                      <div className="font-bold text-neutral-black">{selectedMentee?.name}</div>
                      <div className="text-sm text-neutral-gray-dark">{selectedMentee?.role}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-neutral-gray-dark font-semibold">Focus areas:</span>
                    {selectedTechs.map(techId => {
                      const tech = technologies.find(t => t.id === techId)
                      return (
                        <Badge key={techId} variant="orange" className="text-xs">
                          {tech?.name}
                        </Badge>
                      )
                    })}
                  </div>
                </div>

                {/* Text Area */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-bold text-neutral-black mb-3">
                    <Target className="w-4 h-4 text-baires-orange" />
                    What's the main challenge or goal?
                  </label>
                  <textarea
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder={`Example: "${selectedMentee?.name} is struggling with React state management in complex applications. They need guidance on best practices, performance optimization, and when to use different state solutions like Context API vs Redux."`}
                    rows="6"
                    className="w-full px-6 py-4 rounded-[20px] border-2 border-neutral-200 focus:border-baires-orange focus:outline-none resize-none text-neutral-black leading-relaxed shadow-lg"
                  ></textarea>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-neutral-gray-dark">
                      {problemDescription.length} characters (minimum 20)
                    </p>
                    {problemDescription.length >= 20 && (
                      <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        Ready for AI analysis
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Preview */}
                {problemDescription.length >= 20 && (
                  <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[20px] border border-orange-200 animate-slideInUp">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[12px] flex items-center justify-center shadow-md flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white animate-pulse" />
                      </div>
                      <div>
                        <div className="font-bold text-neutral-black mb-2 flex items-center gap-2">
                          AI Preview
                          <Badge variant="orange" className="text-xs">Live</Badge>
                        </div>
                        <p className="text-sm text-neutral-gray-dark leading-relaxed">
                          Our AI has identified key topics: <span className="font-semibold text-neutral-black">state management, performance optimization, architecture patterns</span>. We'll prioritize mentors with expertise in these areas.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Processing */}
          {currentStep === 4 && isProcessing && (
            <div className="p-8 md:p-12 text-center bg-gradient-to-br from-orange-50 via-white to-blue-50 min-h-[500px] flex items-center justify-center">
              <div className="max-w-xl mx-auto">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-baires-orange to-orange-600 rounded-full flex items-center justify-center shadow-2xl mx-auto animate-pulse">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-4 border-baires-orange border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-neutral-black mb-4 flex items-center justify-center gap-2">
                  <Bot className="w-8 h-8 text-baires-orange" />
                  AI is Working Magic
                </h2>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-[16px] border border-green-200 animate-slideInUp">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-neutral-gray-dark">Analyzing skill requirements...</span>
                    <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-[16px] border border-blue-200 animate-slideInUp" style={{animationDelay: '0.5s'}}>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-neutral-gray-dark">Scanning mentor database...</span>
                    <Loader2 className="w-4 h-4 text-baires-blue ml-auto animate-spin" />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-[16px] border border-orange-200 animate-slideInUp" style={{animationDelay: '1s'}}>
                    <div className="w-2 h-2 bg-baires-orange rounded-full animate-pulse"></div>
                    <span className="text-sm text-neutral-gray-dark">Finding hidden talent...</span>
                    <Loader2 className="w-4 h-4 text-baires-orange ml-auto animate-spin" />
                  </div>
                </div>

                <p className="text-sm text-neutral-gray-dark italic">
                  Our AI is analyzing over 250+ mentors to find the perfect match...
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="border-t border-neutral-200 p-6 bg-gradient-to-r from-neutral-50 to-white flex items-center justify-between">
            <div>
              {currentStep > 1 && !isProcessing && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex items-center gap-2 text-neutral-gray-dark hover:text-neutral-black font-semibold transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 text-neutral-gray-dark hover:text-neutral-black font-semibold transition-colors"
              >
                Cancel
              </button>
              
              {!isProcessing && (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`group inline-flex items-center gap-2 px-8 py-3 rounded-[16px] font-bold transition-all duration-300 ${
                    canProceed()
                      ? 'bg-gradient-to-r from-baires-orange to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-neutral-200 text-neutral-gray-dark cursor-not-allowed'
                  }`}
                >
                  {currentStep === 4 ? (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Find Mentors with AI</span>
                      <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

