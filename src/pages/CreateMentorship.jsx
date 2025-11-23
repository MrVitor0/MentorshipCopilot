import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useConfirm } from '../hooks/useConfirm'
import { getMentees, createMentorshipWithDetails, createMentorshipInvitation } from '../services/firestoreService'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../config/firebase'
import Card from '../components/Card'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import SEO from '../components/SEO'
import MentorSelectionStep from '../components/MentorSelectionStep'
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
  Loader2,
  Plus,
  X,
  Send,
  UserPlus
} from 'lucide-react'

const technologies = [
  { id: 'react', name: 'React', icon: Layout, color: 'from-blue-400 to-blue-600' },
  { id: 'nodejs', name: 'Node.js', icon: Terminal, color: 'from-green-500 to-green-600' },
  { id: 'python', name: 'Python', icon: Code, color: 'from-yellow-500 to-yellow-600' },
  { id: 'database', name: 'Database Design', icon: Database, color: 'from-purple-500 to-purple-600' },
  { id: 'cloud', name: 'Cloud/AWS', icon: Cloud, color: 'from-cyan-400 to-cyan-600' },
  { id: 'mobile', name: 'Mobile Dev', icon: Smartphone, color: 'from-pink-500 to-pink-600' },
  { id: 'frontend', name: 'Frontend', icon: Globe, color: 'from-baires-indigo to-indigo-600' },
  { id: 'git', name: 'Git/DevOps', icon: GitBranch, color: 'from-gray-600 to-gray-700' },
]

export default function CreateMentorship() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const confirm = useConfirm()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTechs, setSelectedTechs] = useState([])
  const [customSkill, setCustomSkill] = useState('')
  const [customSkills, setCustomSkills] = useState([])
  const [selectedMentee, setSelectedMentee] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [problemDescription, setProblemDescription] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // State for mentees and mentors
  const [mentees, setMentees] = useState([])
  const [loadingMentees, setLoadingMentees] = useState(false)
  const [recommendedMentors, setRecommendedMentors] = useState({ topMentors: [], otherMentors: [] })
  const [selectedMentors, setSelectedMentors] = useState([]) // Changed to array for multiple selection
  
  // State to control FindMentors integration
  const [showFindMentors, setShowFindMentors] = useState(false)
  
  // State for drag to scroll functionality
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // Load mentees when component mounts
  useEffect(() => {
    const loadMentees = async () => {
      setLoadingMentees(true)
      try {
        const fetchedMentees = await getMentees()
        setMentees(fetchedMentees)
      } catch (error) {
        console.error('Error loading mentees:', error)
      } finally {
        setLoadingMentees(false)
      }
    }
    loadMentees()
  }, [])

  const filteredMentees = mentees.filter(emp => 
    emp.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleTech = (techId) => {
    setSelectedTechs(prev => 
      prev.includes(techId) 
        ? prev.filter(id => id !== techId)
        : [...prev, techId]
    )
  }

  const addCustomSkill = () => {
    if (customSkill.trim() && !customSkills.includes(customSkill.trim())) {
      setCustomSkills(prev => [...prev, customSkill.trim()])
      setCustomSkill('')
    }
  }

  const removeCustomSkill = (skill) => {
    setCustomSkills(prev => prev.filter(s => s !== skill))
  }

  const handleCustomSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCustomSkill()
    }
  }

  const handleNext = async () => {
    if (currentStep === 4) {
      // Process AI recommendations and show FindMentors page
      setIsProcessing(true)
      
      try {
        console.log('🔍 Starting AI mentor recommendations...')
        console.log('📋 Request data:', {
          menteeId: selectedMentee.uid,
          technologies: [...selectedTechs, ...customSkills],
          challengeDescription: problemDescription
        })
        
        const getAIMentorRecommendations = httpsCallable(functions, 'getAIMentorRecommendations')
        const result = await getAIMentorRecommendations({
          menteeId: selectedMentee.uid,
          technologies: [...selectedTechs, ...customSkills],
          challengeDescription: problemDescription
        })
        
        console.log('✅ AI recommendations received:', result.data)
        
        // Validate that we have data
        if (!result.data || (!result.data.topMentors && !result.data.otherMentors)) {
          console.warn('⚠️ No mentor recommendations received, using empty arrays')
          setRecommendedMentors({ topMentors: [], otherMentors: [] })
        } else {
          // Ensure the structure is correct
          const recommendations = {
            topMentors: result.data.topMentors || [],
            otherMentors: result.data.otherMentors || []
          }
          console.log('📊 Processed recommendations:', recommendations)
          console.log('🎯 Match percentages:', recommendations.topMentors.map(m => ({
            name: m.displayName,
            matchPercentage: m.matchPercentage,
            aiScore: m.aiScore
          })))
          setRecommendedMentors(recommendations)
        }
        
        // Small delay to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Then transition to next step
        setCurrentStep(5)
        setShowFindMentors(true)
        setIsProcessing(false)
        
        console.log('✅ Transitioned to step 5, showing FindMentors')
      } catch (error) {
        console.error('❌ Error getting recommendations:', error)
        setIsProcessing(false)
        
        // Show more detailed error message
        const errorMessage = error.message || 'Unknown error occurred'
        await confirm.error(
          `Error getting mentor recommendations: ${errorMessage}\n\nPlease try again or contact support.`,
          'Error'
        )
      }
    } else if (currentStep === 5) {
      // Create mentorship and send invitations to selected mentors
      await createMentorshipWithInvitations()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  /**
   * Create mentorship with invitations to multiple mentors
   * Follows Single Responsibility Principle - only creates mentorship and sends invitations
   */
  const createMentorshipWithInvitations = async () => {
    try {
      // Create mentorship with pending status
      const mentorshipData = {
        projectManagerId: user.uid,
        projectManagerName: user.displayName,
        projectManagerAvatar: user.photoURL,
        menteeId: selectedMentee.uid,
        menteeName: selectedMentee.displayName,
        menteeAvatar: selectedMentee.photoURL,
        technologies: [...selectedTechs, ...customSkills],
        challengeDescription: problemDescription,
        status: 'pending', // Pending until a mentor accepts
        mentorId: null,
        mentorName: null,
        mentorAvatar: null,
        invitedMentorIds: selectedMentors.map(m => m.uid) // Track invited mentors
      }

      const createdMentorship = await createMentorshipWithDetails(mentorshipData)
      console.log('Mentorship created:', createdMentorship)
      
      // Send invitations to all selected mentors
      const invitationPromises = selectedMentors.map(mentor => 
        createMentorshipInvitation({
          mentorshipId: createdMentorship.id,
          mentorId: mentor.uid,
          mentorName: mentor.displayName,
          mentorAvatar: mentor.photoURL || null,
          projectManagerId: user.uid,
          projectManagerName: user.displayName,
          menteeName: selectedMentee.displayName,
          menteeId: selectedMentee.uid,
          technologies: [...selectedTechs, ...customSkills],
          message: `You've been invited to mentor ${selectedMentee.displayName} in ${[...selectedTechs, ...customSkills].join(', ')}`
        })
      )
      
      await Promise.all(invitationPromises)
      
      // Navigate directly to the mentorship details page
      navigate(`/mentorship/${createdMentorship.id}`)
    } catch (error) {
      console.error('Error creating mentorship with invitations:', error)
      await confirm.error(
        'Error creating mentorship. Please try again.',
        'Error'
      )
    }
  }

  const canProceed = () => {
    if (currentStep === 1) return true
    if (currentStep === 2) return selectedMentee !== null // Step 2: Select Mentee
    if (currentStep === 3) return selectedTechs.length > 0 || customSkills.length > 0 // Step 3: Skills
    if (currentStep === 4) return true // Problem description is optional
    if (currentStep === 5) return selectedMentors.length > 0 // Must select at least one mentor
    return false
  }

  const totalSteps = 5 // Fixed number of steps
  
  /**
   * Handle mentor selection from FindMentors component
   * Supports multiple mentor selection
   */
  const handleMentorSelect = (mentor) => {
    setSelectedMentors(prev => {
      const isAlreadySelected = prev.some(m => m.uid === mentor.uid)
      if (isAlreadySelected) {
        return prev.filter(m => m.uid !== mentor.uid)
      } else {
        return [...prev, mentor]
      }
    })
  }
  
  /**
   * Handle mouse down for drag scroll
   */
  const handleMouseDown = (e) => {
    // Don't start drag if clicking on a button/card
    if (e.target.closest('button')) return
    
    const slider = e.currentTarget
    setIsDragging(true)
    setStartX(e.pageX - slider.offsetLeft)
    setScrollLeft(slider.scrollLeft)
  }

  /**
   * Handle mouse leave/up for drag scroll
   */
  const handleMouseLeaveOrUp = () => {
    setIsDragging(false)
  }

  /**
   * Handle mouse move for drag scroll
   */
  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const slider = e.currentTarget
    const x = e.pageX - slider.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    slider.scrollLeft = scrollLeft - walk
  }

  return (
    <>
      <SEO 
        title="Create Mentorship"
        description="Use our AI-powered wizard to create a new mentorship. Select skills, choose a mentee, and let AI find the perfect mentor match."
      />
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-indigo-50/20 p-4 md:p-8 relative overflow-hidden">
      {/* Enhanced Decorative elements - Large Blurs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-indigo-300/35 to-indigo-100/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-baires-indigo/20 to-indigo-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Additional Glow Effects */}
      <div className="absolute top-40 left-1/4 w-48 h-48 bg-gradient-to-br from-blue-300/20 to-baires-blue/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      <div className="absolute bottom-40 right-1/4 w-56 h-56 bg-gradient-to-br from-indigo-200/25 to-baires-indigo-light/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Floating Icons */}
      <div className="absolute top-32 left-32 animate-float">
        <Sparkles className="w-8 h-8 text-baires-indigo/30" />
      </div>
      <div className="absolute bottom-32 right-32 animate-float" style={{ animationDelay: '1.5s' }}>
        <Zap className="w-10 h-10 text-blue-400/30" />
      </div>
      <div className="absolute top-1/3 right-20 animate-float" style={{ animationDelay: '3s' }}>
        <Bot className="w-7 h-7 text-indigo-400/30" />
      </div>
      <div className="absolute bottom-1/3 left-20 animate-float" style={{ animationDelay: '2.5s' }}>
        <Target className="w-6 h-6 text-baires-blue/30" />
      </div>
      <div className="absolute top-1/4 right-1/2 animate-float" style={{ animationDelay: '1s' }}>
        <Rocket className="w-6 h-6 text-indigo-300/30" />
      </div>
      <div className="absolute bottom-1/4 left-1/3 animate-float" style={{ animationDelay: '2s' }}>
        <Code className="w-5 h-5 text-baires-indigo/30" />
      </div>
      
      {/* Small Floating Dots */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-baires-indigo/40 rounded-full animate-pulse"></div>
      <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-blue-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/2 left-1/2 w-4 h-4 bg-indigo-300/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-baires-blue/40 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      <div className={`${currentStep === 5 ? 'max-w-full' : 'max-w-4xl'} mx-auto relative z-10 pb-32 transition-all duration-500`}>
        {/* Progress Indicator */}
        <div className={`mb-8 ${currentStep === 5 ? 'max-w-7xl mx-auto' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-black to-baires-indigo bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-baires-indigo animate-pulse" />
              Create Mentorship
            </h1>
            <Badge variant="orange" className="flex items-center gap-1">
              <Bot className="w-3 h-3" />
              AI-Powered
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                  step <= currentStep 
                    ? 'bg-gradient-to-r from-baires-indigo to-indigo-600' 
                    : 'bg-neutral-200'
                }`}></div>
                {step < 5 && <div className="w-2"></div>}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-semibold text-neutral-gray-dark">
            <span className={currentStep === 1 ? 'text-baires-indigo' : ''}>Intro</span>
            <span className={currentStep === 2 ? 'text-baires-indigo' : ''}>Mentee</span>
            <span className={currentStep === 3 ? 'text-baires-indigo' : ''}>Skills</span>
            <span className={currentStep === 4 ? 'text-baires-indigo' : ''}>Details</span>
            <span className={currentStep === 5 ? 'text-baires-indigo' : ''}>Invite Mentors</span>
          </div>
        </div>

        {/* Step Content */}
        <Card padding="none" className="overflow-hidden animate-scaleIn">
          {/* Step 1: Introduction */}
          {currentStep === 1 && (
            <div className="p-8 md:p-12 text-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
              <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-baires-indigo to-indigo-600 rounded-[24px] flex items-center justify-center shadow-2xl mx-auto mb-6 animate-float">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-4xl font-bold text-neutral-black mb-4">
                  Let's Find the Perfect Mentor
                </h2>
                
                <p className="text-lg text-neutral-gray-dark mb-8 leading-relaxed">
                  Our <span className="font-bold text-baires-indigo">AI-powered matching system</span> will analyze your team member's needs and suggest the <span className="font-bold">top 3 most compatible mentors</span> from our entire talent pool.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="p-6 bg-white rounded-[20px] border-2 border-indigo-200/50 hover:shadow-lg transition-all">
                    <Sparkles className="w-8 h-8 text-baires-indigo mx-auto mb-3" />
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

                <div className="inline-flex items-center gap-2 bg-indigo-100 text-baires-indigo px-4 py-2 rounded-full text-sm font-semibold">
                  <Zap className="w-4 h-4" />
                  Takes only 3 minutes
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Select Mentee */}
          {currentStep === 2 && (
            <div className="p-8 md:p-12 bg-gradient-to-br from-white to-blue-50/30">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-baires-blue to-blue-600 text-white px-4 py-2 rounded-full mb-4">
                    <Users className="w-4 h-4" />
                    <span className="font-semibold text-sm">Real-time search</span>
                  </div>
                  <h2 className="text-3xl font-bold text-neutral-black mb-3">
                    Who needs mentorship?
                  </h2>
                  <p className="text-neutral-gray-dark mb-6">
                    Search for the team member who will be mentored
                  </p>

                  {/* Enhanced Search Input */}
                  <div className="relative max-w-xl mx-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-baires-indigo via-indigo-400 to-blue-500 rounded-[20px] blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-baires-indigo" />
                      <input
                        type="text"
                        placeholder="Start typing to search team members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 rounded-[18px] border-2 border-indigo-200 focus:border-baires-indigo focus:outline-none text-lg font-semibold shadow-xl bg-white placeholder:font-normal placeholder:text-neutral-gray-dark"
                        autoFocus
                      />
                      {searchQuery && (
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            <Sparkles className="w-3 h-3" />
                            {filteredMentees.length} found
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!searchQuery && !loadingMentees && (
                    <p className="text-center text-neutral-gray-dark text-sm mt-4 italic flex items-center justify-center gap-2">
                      <Bot className="w-4 h-4 text-baires-indigo" />
                      {mentees.length} mentees available in database
                    </p>
                  )}
                </div>

                {/* Loading State */}
                {loadingMentees && (
                  <div className="flex justify-center py-12">
                    <div className="w-12 h-12 border-4 border-baires-indigo border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Mentee Cards */}
                {!loadingMentees && searchQuery && (
                  <div className="relative animate-slideInUp">
                    {/* Drag instruction hint */}
                    <div className="text-center mb-4">
                      <p className="text-xs text-neutral-gray-dark flex items-center justify-center gap-2">
                        <span className="inline-flex items-center gap-1 bg-indigo-100 text-baires-indigo px-3 py-1 rounded-full font-semibold">
                          💡 Click cards to select • Drag empty space to scroll
                        </span>
                      </p>
                    </div>
                    
                    <div 
                      className="overflow-x-auto overflow-y-visible pb-8 pt-4 -mx-4 px-4 scrollbar-hide"
                      style={{ 
                        scrollbarWidth: 'none', 
                        msOverflowStyle: 'none',
                        cursor: isDragging ? 'grabbing' : 'default'
                      }}
                      onMouseDown={handleMouseDown}
                      onMouseLeave={handleMouseLeaveOrUp}
                      onMouseUp={handleMouseLeaveOrUp}
                      onMouseMove={handleMouseMove}
                    >
                      <div className="flex gap-6 min-w-max py-2">
                        {filteredMentees.map((mentee) => {
                          const isSelected = selectedMentee?.uid === mentee.uid
                          
                          return (
                            <button
                              key={mentee.uid}
                              onClick={() => setSelectedMentee(mentee)}
                              className={`group relative w-64 p-6 rounded-[24px] border-2 transition-all duration-300 flex-shrink-0 cursor-pointer ${
                                isSelected
                                  ? 'border-baires-indigo bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-xl'
                                  : 'border-neutral-200 bg-white hover:border-indigo-300 hover:shadow-lg hover:scale-[1.02]'
                              }`}
                              style={{
                                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                margin: isSelected ? '0 8px' : '0'
                              }}
                            >
                              {isSelected && (
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-baires-indigo to-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-scaleIn z-10">
                                  <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                              )}
                              
                              <div className="text-center">
                                <div className="relative inline-block mb-4">
                                  <Avatar 
                                    src={mentee.photoURL} 
                                    initials={mentee.displayName?.substring(0, 2)?.toUpperCase()}
                                    size="2xl" 
                                  />
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                                </div>
                                
                                <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-baires-indigo' : 'text-neutral-black'}`}>
                                  {mentee.displayName}
                                </h3>
                                <p className="text-sm text-neutral-gray-dark mb-4">{mentee.bio || 'Mentee'}</p>
                                
                                <div className="flex flex-wrap gap-2 justify-center">
                                  {mentee.technologies?.slice(0, 3).map((tech, idx) => (
                                    <span key={idx} className="text-xs bg-neutral-100 text-neutral-gray-dark px-2 py-1 rounded-full">
                                      {tech.name || tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    
                    {filteredMentees.length === 0 && (
                      <div className="text-center py-8">
                        <Search className="w-12 h-12 text-neutral-gray-dark mx-auto mb-3 opacity-50" />
                        <p className="text-neutral-gray-dark">No mentees found matching "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                )}

             
              </div>
            </div>
          )}

          {/* Step 3: Select Technologies */}
          {currentStep === 3 && (
            <div className="p-8 md:p-12 bg-gradient-to-br from-white to-indigo-50/30">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-baires-indigo to-indigo-600 text-white px-4 py-2 rounded-full mb-4">
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

                {/* Custom Skill Input - Highlighted */}
                <div className="mb-6 p-6 bg-gradient-to-br from-indigo-50 via-white to-indigo-100/50 rounded-[24px] border-2 border-indigo-300/70 shadow-[0_10px_40px_rgb(246,97,53,0.15)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-baires-indigo to-indigo-600 rounded-[14px] flex items-center justify-center shadow-lg">
                      <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-black">Need something specific?</h3>
                      <p className="text-xs text-neutral-gray-dark">Type any skill and we'll find the expert</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        onKeyPress={handleCustomSkillKeyPress}
                        placeholder="e.g., TeamSpeak, Kafka, GraphQL..."
                        className="w-full pl-10 pr-4 py-3 rounded-[14px] border-2 border-indigo-200 focus:border-baires-indigo focus:outline-none font-semibold placeholder:font-normal"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-baires-indigo" />
                    </div>
                    <button
                      onClick={addCustomSkill}
                      disabled={!customSkill.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-baires-indigo to-indigo-600 text-white rounded-[14px] font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  
                  {/* Custom Skills Display */}
                  {customSkills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {customSkills.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gradient-to-r from-baires-indigo to-indigo-600 text-white px-3 py-2 rounded-full font-semibold text-sm shadow-md group">
                          <span>{skill}</span>
                          <button
                            onClick={() => removeCustomSkill(skill)}
                            className="w-5 h-5 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Preset Technologies */}
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-neutral-gray-dark mb-3 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Or choose from popular technologies:
                  </h3>
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
                            ? 'border-baires-indigo bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-lg scale-105'
                            : 'border-neutral-200 bg-white hover:border-indigo-300 hover:shadow-md hover:scale-105'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-baires-indigo to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                        
                        <div className={`w-12 h-12 bg-gradient-to-br ${tech.color} rounded-[14px] flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                          <TechIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className={`font-bold text-sm ${isSelected ? 'text-baires-indigo' : 'text-neutral-black'}`}>
                          {tech.name}
                        </div>
                      </button>
                    )
                  })}
                </div>

             
              </div>
            </div>
          )}

          {/* Step 4: Problem Description */}
          {currentStep === 4 && !isProcessing && (
            <div className="p-8 md:p-12 bg-gradient-to-br from-white to-indigo-50/30">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-baires-indigo to-indigo-600 text-white px-4 py-2 rounded-full mb-4">
                    <Bot className="w-4 h-4" />
                    <span className="font-semibold text-sm">AI will analyze this</span>
                  </div>
                  <h2 className="text-3xl font-bold text-neutral-black mb-3">
                    Describe the Challenge
                  </h2>
                  <p className="text-neutral-gray-dark">
                    Tell us what {selectedMentee?.displayName} needs help with. Be specific - our AI will use this to find the perfect match.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[20px] border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar 
                      src={selectedMentee?.photoURL} 
                      initials={selectedMentee?.displayName?.substring(0, 2)?.toUpperCase()}
                      size="md" 
                    />
                    <div>
                      <div className="font-bold text-neutral-black">{selectedMentee?.displayName}</div>
                      <div className="text-sm text-neutral-gray-dark">{selectedMentee?.bio || 'Mentee'}</div>
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
                    {customSkills.map(skill => (
                      <Badge key={skill} variant="blue" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Text Area */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-bold text-neutral-black mb-3">
                    <Target className="w-4 h-4 text-baires-indigo" />
                    What's the main challenge or goal? (Optional)
                  </label>
                  <textarea
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder={`Example: "${selectedMentee?.displayName} is struggling with React state management in complex applications. They need guidance on best practices, performance optimization, and when to use different state solutions like Context API vs Redux."`}
                    rows="6"
                    className="w-full px-6 py-4 rounded-[20px] border-2 border-neutral-200 focus:border-baires-indigo focus:outline-none resize-none text-neutral-black leading-relaxed shadow-lg"
                  ></textarea>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-neutral-gray-dark">
                      {problemDescription.length} characters
                    </p>
                    {problemDescription.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        Will help AI find better matches
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Preview */}
                {problemDescription.length > 0 && (
                  <div className="p-5 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-[20px] border border-indigo-200 animate-slideInUp">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-baires-indigo to-indigo-600 rounded-[12px] flex items-center justify-center shadow-md flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white animate-pulse" />
                      </div>
                      <div>
                        <div className="font-bold text-neutral-black mb-2 flex items-center gap-2">
                          AI Preview
                          <Badge variant="orange" className="text-xs">Live</Badge>
                        </div>
                        <p className="text-sm text-neutral-gray-dark leading-relaxed">
                          Our AI will analyze your description and match with mentors who have proven expertise in these specific areas. Ready to find the perfect match!
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
            <div className="p-8 md:p-12 text-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 min-h-[500px] flex items-center justify-center">
              <div className="max-w-xl mx-auto">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-baires-indigo to-indigo-600 rounded-full flex items-center justify-center shadow-2xl mx-auto animate-pulse">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-4 border-baires-indigo border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-neutral-black mb-4 flex items-center justify-center gap-2">
                  <Bot className="w-8 h-8 text-baires-indigo" />
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
                  <div className="flex items-center gap-3 p-4 bg-white rounded-[16px] border border-indigo-200 animate-slideInUp" style={{animationDelay: '1s'}}>
                    <div className="w-2 h-2 bg-baires-indigo rounded-full animate-pulse"></div>
                    <span className="text-sm text-neutral-gray-dark">Finding perfect matches...</span>
                    <Loader2 className="w-4 h-4 text-baires-indigo ml-auto animate-spin" />
                  </div>
                </div>

                <p className="text-sm text-neutral-gray-dark italic">
                  Our AI is analyzing mentors to find the perfect match...
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Invite Mentors - Full width mentor selection */}
          {currentStep === 5 && showFindMentors && !isProcessing && (
            <div className="p-0">
              <MentorSelectionStep
                selectedMentee={selectedMentee}
                technologies={[...selectedTechs, ...customSkills]}
                problemDescription={problemDescription}
                recommendedMentors={recommendedMentors}
                selectedMentors={selectedMentors}
                onMentorSelect={handleMentorSelect}
              />
            </div>
          )}

        </Card>

        {/* Fixed Floating Footer Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t-2 border-neutral-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          {/* Selected Mentors Summary Bar - Only on Step 5 */}
          {currentStep === 5 && selectedMentors.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-300 px-6 py-3">
              <div className="max-w-7xl mx-auto flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-green-900">
                  {selectedMentors.length} {selectedMentors.length === 1 ? 'mentor' : 'mentors'} selected:
                </span>
                <div className="flex flex-wrap gap-2 flex-1">
                  {selectedMentors.slice(0, 3).map(mentor => (
                    <span key={mentor.uid} className="text-xs bg-white text-neutral-black px-2 py-1 rounded-full border border-green-200 font-medium">
                      {mentor.displayName}
                    </span>
                  ))}
                  {selectedMentors.length > 3 && (
                    <span className="text-xs bg-white text-neutral-black px-2 py-1 rounded-full border border-green-200 font-medium">
                      +{selectedMentors.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className={`${currentStep === 5 ? 'max-w-7xl' : 'max-w-4xl'} mx-auto px-6 py-4 flex items-center justify-between`}>
            {/* Left: Back Button */}
            <div className="flex-1">
              {currentStep === 1 && !isProcessing ? (
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 bg-gradient-to-r from-neutral-100 to-neutral-200 hover:from-neutral-200 hover:to-neutral-300 text-neutral-black font-bold transition-all group hover:gap-3 px-5 py-2.5 rounded-[12px] border-2 border-neutral-300 hover:border-neutral-400 shadow-md hover:shadow-lg"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Home</span>
                </button>
              ) : currentStep > 1 && !isProcessing ? (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex items-center gap-2 text-neutral-gray-dark hover:text-neutral-black font-semibold transition-all group hover:gap-3 px-4 py-2 rounded-[12px] hover:bg-neutral-100"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span>Back</span>
                </button>
              ) : (
                <div></div>
              )}
            </div>

            {/* Center: Step Indicator */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-full border border-indigo-200">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      step === currentStep
                        ? 'bg-baires-indigo w-6'
                        : step < currentStep
                        ? 'bg-green-500'
                        : 'bg-neutral-300'
                    }`}
                  ></div>
                ))}
              </div>
              <span className="text-sm font-bold text-neutral-black ml-2">
                Step {currentStep} of {totalSteps}
              </span>
            </div>

            {/* Right: Cancel & Continue Buttons */}
            <div className="flex-1 flex items-center justify-end gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 text-neutral-gray-dark hover:text-neutral-black font-semibold transition-all hover:bg-neutral-100 rounded-[12px]"
              >
                Cancel
              </button>
              
              {!isProcessing && (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`group cursor-pointer hover:opacity-80 inline-flex items-center gap-2 px-6 py-2.5 rounded-[14px] font-bold transition-all duration-300 ${
                    canProceed()
                      ? 'bg-gradient-to-r from-baires-indigo to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-neutral-200 text-neutral-gray-dark cursor-not-allowed'
                  }`}
                >
                  {currentStep === 4 ? (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Find Mentors</span>
                      <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </>
                  ) : currentStep === 5 ? (
                    <>
                      <Send className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Send Invitations</span>
                      <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
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
        </div>
      </div>
      </div>
    </>
  )
}
