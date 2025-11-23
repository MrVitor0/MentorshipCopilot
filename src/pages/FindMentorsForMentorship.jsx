import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useConfirm } from '../hooks/useConfirm'
import usePermissions from '../hooks/usePermissions'
import { 
  getMentorshipById, 
  getAllMentors,
  inviteMentorToMentorship 
} from '../services/firestoreService'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import AIChatModal from '../components/AIChatModal'
import SEO from '../components/SEO'
import { 
  ArrowLeft,
  Sparkles,
  Star,
  Award,
  Users,
  Target,
  CheckCircle,
  Send,
  Filter,
  Bot,
  Search,
  AlertCircle,
  Loader2,
  X as XIcon,
  Check,
  TrendingUp,
  Calendar,
  Mail,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

export default function FindMentorsForMentorship() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const confirm = useConfirm()
  const permissions = usePermissions()
  
  const [mentorship, setMentorship] = useState(null)
  const [allMentors, setAllMentors] = useState([])
  const [filteredMentors, setFilteredMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [expandedRow, setExpandedRow] = useState(null)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAvailability, setFilterAvailability] = useState('all')
  const [filterExperience, setFilterExperience] = useState('all')
  const [filterTechnology, setFilterTechnology] = useState('all')
  const [sortBy, setSortBy] = useState('matchScore') // matchScore, name, experience
  const [sortOrder, setSortOrder] = useState('desc')

  // Check permissions and load data
  useEffect(() => {
    const loadData = async () => {
      // Check if user is PM
      if (!permissions.isPM) {
        navigate('/dashboard')
        return
      }

      setLoading(true)
      try {
        // Load mentorship
        const mentorshipData = await getMentorshipById(id)
        
        if (!mentorshipData) {
          await confirm.error('Mentorship not found', 'Error')
          navigate('/mentorship')
          return
        }

        // Check if status is pending
        if (mentorshipData.status !== 'pending' && mentorshipData.status !== 'pending_mentor') {
          await confirm.info('This mentorship already has a mentor assigned', 'Information')
          navigate(`/mentorship/${id}`)
          return
        }

        // Check if already has a mentor
        if (mentorshipData.mentorId) {
          await confirm.info('This mentorship already has a mentor assigned', 'Information')
          navigate(`/mentorship/${id}`)
          return
        }

        setMentorship(mentorshipData)

        // Load all available mentors
        const mentorsData = await getAllMentors()
        console.log('Loaded mentors:', mentorsData.length)
        setAllMentors(mentorsData)
        setFilteredMentors(mentorsData)
      } catch (error) {
        console.error('Error loading data:', error)
        await confirm.error('Error loading mentors. Please try again.', 'Error')
        navigate('/mentorship')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, permissions.isPM, navigate])

  const calculateMatchScore = (mentor) => {
    if (!mentorship || !mentor) return 0
    
    let score = 50 // Base score
    
    // Technology match
    if (mentorship.technologies && mentor.technologies) {
      const mentorshipTechs = mentorship.technologies.map(t => 
        (typeof t === 'string' ? t : t.name)?.toLowerCase()
      )
      const mentorTechs = mentor.technologies.map(t => 
        (typeof t === 'string' ? t : t.name)?.toLowerCase()
      )
      
      const matches = mentorshipTechs.filter(tech => mentorTechs.includes(tech))
      score += (matches.length / mentorshipTechs.length) * 30
    }
    
    // Experience bonus
    if (mentor.yearsExperience >= 5) score += 10
    if (mentor.yearsExperience >= 10) score += 5
    
    // Availability bonus
    if (mentor.availability === 'available') score += 5
    
    return Math.min(Math.round(score), 99)
  }

  // Apply filters and sorting
  useEffect(() => {
    if (!allMentors.length) return

    let filtered = [...allMentors].map(mentor => ({
      ...mentor,
      matchScore: calculateMatchScore(mentor)
    }))

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(mentor => 
        mentor.displayName?.toLowerCase().includes(query) ||
        mentor.bio?.toLowerCase().includes(query) ||
        mentor.technologies?.some(tech => 
          (typeof tech === 'string' ? tech : tech.name)?.toLowerCase().includes(query)
        )
      )
    }

    // Availability filter
    if (filterAvailability === 'available') {
      filtered = filtered.filter(mentor => mentor.availability === 'available' || !mentor.availability)
    }

    // Experience filter
    if (filterExperience !== 'all') {
      filtered = filtered.filter(mentor => {
        const years = mentor.yearsExperience || 0
        if (filterExperience === 'junior') return years < 3
        if (filterExperience === 'mid') return years >= 3 && years < 7
        if (filterExperience === 'senior') return years >= 7
        return true
      })
    }

    // Technology filter
    if (filterTechnology === 'matching' && mentorship?.technologies) {
      filtered = filtered.filter(mentor => {
        const mentorTechs = mentor.technologies || []
        return mentorTechs.some(tech => {
          const techName = typeof tech === 'string' ? tech : tech.name
          return mentorship.technologies.some(mt => {
            const mtName = typeof mt === 'string' ? mt : mt.name
            return techName?.toLowerCase() === mtName?.toLowerCase()
          })
        })
      })
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal
      
      switch (sortBy) {
        case 'matchScore':
          aVal = a.matchScore || 0
          bVal = b.matchScore || 0
          break
        case 'experience':
          aVal = a.yearsExperience || 0
          bVal = b.yearsExperience || 0
          break
        case 'name':
        default:
          aVal = (a.displayName || '').toLowerCase()
          bVal = (b.displayName || '').toLowerCase()
          break
      }
      
      if (sortOrder === 'desc') {
        return aVal < bVal ? 1 : -1
      }
      return aVal > bVal ? 1 : -1
    })

    setFilteredMentors(filtered)
  }, [allMentors, searchQuery, filterAvailability, filterExperience, filterTechnology, sortBy, sortOrder, mentorship])

  const handleInviteMentor = (mentor) => {
    setSelectedMentor(mentor)
  }

  const confirmInvite = async (message = '') => {
    if (!selectedMentor || !mentorship) return

    setInviting(true)
    try {
      await inviteMentorToMentorship(mentorship.id, selectedMentor.uid, message)
      await confirm.success(
        `Invitation sent to ${selectedMentor.displayName}!`,
        'Invitation Sent'
      )
      navigate(`/mentorship/${id}`)
    } catch (error) {
      console.error('Error inviting mentor:', error)
      await confirm.error(
        error.message || 'Error sending invitation. Please try again.',
        'Error'
      )
    } finally {
      setInviting(false)
      setSelectedMentor(null)
    }
  }

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/15">
        <Sidebar />
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-baires-blue mx-auto mb-4 animate-spin" />
            <p className="text-neutral-gray-dark">Loading mentors...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <>
      <SEO 
        title={`Find Mentors - ${mentorship?.menteeName || 'Mentorship'}`}
        description="Browse and invite mentors for your mentorship. AI-powered recommendations based on skills and experience."
      />
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/15">
        <Sidebar />
        
 
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-[1800px] mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate(`/mentorship/${id}`)}
              className="flex items-center gap-2 text-neutral-gray-dark hover:text-neutral-black mb-6 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Mentorship Details</span>
            </button>

            {/* Header Section */}
            <div className="mb-8">
              <Card padding="lg" className="bg-gradient-to-br from-orange-50 via-white to-blue-50 border-2 border-orange-200/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-baires-blue to-blue-600 text-white px-4 py-2 rounded-full mb-4">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span className="font-semibold text-sm">AI-Powered Matching</span>
                    </div>
                    
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-black to-baires-blue bg-clip-text text-transparent mb-3">
                      Browse Available Mentors
                    </h1>
                    <p className="text-neutral-gray-dark leading-relaxed">
                      Select and invite mentors for <span className="font-bold text-neutral-black">{mentorship?.menteeName}</span>. 
                      All mentors are ranked by AI compatibility score.
                    </p>
                  </div>

                  <div className="hidden lg:block">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-[16px] border border-blue-200/50">
                      <Avatar 
                        src={mentorship?.menteeAvatar} 
                        initials={mentorship?.menteeName?.substring(0, 2)?.toUpperCase()}
                        size="xl" 
                      />
                      <div>
                        <div className="font-bold text-neutral-black">{mentorship?.menteeName}</div>
                        <div className="text-sm text-neutral-gray-dark">Mentee</div>
                        {mentorship?.technologies && mentorship.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {mentorship.technologies.slice(0, 3).map((tech, idx) => (
                              <Badge key={idx} variant="blue" className="text-xs">
                                {typeof tech === 'string' ? tech : tech.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters Bar */}
            <Card padding="lg" className="mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray-dark" />
                  <input
                    type="text"
                    placeholder="Search by name, skills, bio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-[12px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none font-medium"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={filterAvailability}
                    onChange={(e) => setFilterAvailability(e.target.value)}
                    className="px-4 py-3 rounded-[12px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none font-semibold text-sm bg-white cursor-pointer"
                  >
                    <option value="all">All Availability</option>
                    <option value="available">Available Now</option>
                  </select>

                  <select
                    value={filterExperience}
                    onChange={(e) => setFilterExperience(e.target.value)}
                    className="px-4 py-3 rounded-[12px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none font-semibold text-sm bg-white cursor-pointer"
                  >
                    <option value="all">All Experience</option>
                    <option value="junior">Junior (&lt;3y)</option>
                    <option value="mid">Mid-Level (3-7y)</option>
                    <option value="senior">Senior (7y+)</option>
                  </select>

                  <select
                    value={filterTechnology}
                    onChange={(e) => setFilterTechnology(e.target.value)}
                    className="px-4 py-3 rounded-[12px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none font-semibold text-sm bg-white cursor-pointer"
                  >
                    <option value="all">All Technologies</option>
                    <option value="matching">Matching Skills Only</option>
                  </select>

                  {(searchQuery || filterAvailability !== 'all' || filterExperience !== 'all' || filterTechnology !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setFilterAvailability('all')
                        setFilterExperience('all')
                        setFilterTechnology('all')
                      }}
                      className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-[12px] font-semibold text-sm transition-colors flex items-center gap-2"
                    >
                      <XIcon className="w-4 h-4" />
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-neutral-gray-dark">
                  <Filter className="w-4 h-4" />
                  <span>Showing <span className="font-bold text-neutral-black">{filteredMentors.length}</span> mentor{filteredMentors.length !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-neutral-gray-dark">
                  <TrendingUp className="w-4 h-4" />
                  <span>Sorted by: <span className="font-bold text-neutral-black capitalize">{sortBy === 'matchScore' ? 'AI Match' : sortBy}</span></span>
                </div>
              </div>
            </Card>

            {/* Mentors Table */}
            {filteredMentors.length > 0 ? (
              <Card padding="none" className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100 border-b-2 border-neutral-200">
                      <tr>
                        <th className="px-6 py-4 text-left">
                          <button
                            onClick={() => toggleSort('name')}
                            className="flex items-center gap-2 font-bold text-neutral-black hover:text-baires-blue transition-colors"
                          >
                            Mentor
                            {sortBy === 'name' && (
                              sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                            )}
                          </button>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <span className="font-bold text-neutral-black">Technologies</span>
                        </th>
                        <th className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleSort('experience')}
                            className="flex items-center gap-2 font-bold text-neutral-black hover:text-baires-blue transition-colors mx-auto"
                          >
                            Experience
                            {sortBy === 'experience' && (
                              sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                            )}
                          </button>
                        </th>
                        <th className="px-6 py-4 text-center">
                          <span className="font-bold text-neutral-black">Status</span>
                        </th>
                        <th className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleSort('matchScore')}
                            className="flex items-center gap-2 font-bold text-neutral-black hover:text-baires-blue transition-colors mx-auto"
                          >
                            <Sparkles className="w-4 h-4 text-baires-blue" />
                            AI Match
                            {sortBy === 'matchScore' && (
                              sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                            )}
                          </button>
                        </th>
                        <th className="px-6 py-4 text-right">
                          <span className="font-bold text-neutral-black">Action</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMentors.map((mentor, index) => (
                        <MentorRow 
                          key={mentor.uid}
                          mentor={mentor}
                          index={index}
                          isExpanded={expandedRow === mentor.uid}
                          onToggleExpand={() => setExpandedRow(expandedRow === mentor.uid ? null : mentor.uid)}
                          onInvite={() => handleInviteMentor(mentor)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <Card padding="xl" className="text-center">
                <div className="py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-10 h-10 text-baires-blue" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-black mb-2">No Mentors Found</h3>
                  <p className="text-neutral-gray-dark mb-6">
                    {allMentors.length === 0 
                      ? 'No mentors are currently available in the system.'
                      : 'Try adjusting your filters or search query'
                    }
                  </p>
                  {allMentors.length > 0 && (
                    <Button 
                      variant="orange"
                      onClick={() => {
                        setSearchQuery('')
                        setFilterAvailability('all')
                        setFilterExperience('all')
                        setFilterTechnology('all')
                      }}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        </main>

        {/* Invitation Modal */}
        {selectedMentor && (
          <InvitationModal
            mentor={selectedMentor}
            mentorship={mentorship}
            onConfirm={confirmInvite}
            onCancel={() => setSelectedMentor(null)}
            isInviting={inviting}
          />
        )}
      </div>
    </>
  )
}

// Mentor Row Component
function MentorRow({ mentor, index, isExpanded, onToggleExpand, onInvite }) {
  const matchColor = mentor.matchScore >= 80 ? 'from-green-500 to-green-600' : 
                     mentor.matchScore >= 60 ? 'from-blue-500 to-blue-600' : 
                     'from-neutral-400 to-neutral-500'

  return (
    <>
      <tr 
        className={`border-b border-neutral-100 hover:bg-orange-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50/30'}`}
      >
        {/* Mentor Info */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar 
              src={mentor.photoURL} 
              initials={mentor.displayName?.substring(0, 2)?.toUpperCase()}
              size="lg"
              ring
            />
            <div>
              <div className="font-bold text-neutral-black mb-1">{mentor.displayName || 'Unknown Mentor'}</div>
              <div className="text-sm text-neutral-gray-dark line-clamp-1">{mentor.bio?.substring(0, 60) || 'Experienced Mentor'}...</div>
              <button
                onClick={onToggleExpand}
                className="text-xs text-baires-blue hover:text-orange-700 font-semibold mt-1 flex items-center gap-1"
              >
                {isExpanded ? (
                  <>Hide Details <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>Show Details <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
            </div>
          </div>
        </td>

        {/* Technologies */}
        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-1">
            {mentor.technologies && mentor.technologies.length > 0 ? (
              <>
                {mentor.technologies.slice(0, 3).map((tech, idx) => (
                  <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                    {typeof tech === 'string' ? tech : tech.name}
                  </span>
                ))}
                {mentor.technologies.length > 3 && (
                  <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full font-semibold">
                    +{mentor.technologies.length - 3}
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs text-neutral-gray-dark">No technologies listed</span>
            )}
          </div>
        </td>

        {/* Experience */}
        <td className="px-6 py-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-baires-blue" />
            <span className="font-bold text-neutral-black">{mentor.yearsExperience || 0}</span>
            <span className="text-sm text-neutral-gray-dark">years</span>
          </div>
        </td>

        {/* Status */}
        <td className="px-6 py-4">
          <div className="flex justify-center">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
              mentor.availability === 'available' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-amber-100 text-amber-700 border border-amber-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${mentor.availability === 'available' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></div>
              {mentor.availability === 'available' ? 'Available' : 'Limited'}
            </div>
          </div>
        </td>

        {/* AI Match Score */}
        <td className="px-6 py-4">
          <div className="flex justify-center">
            <div className={`bg-gradient-to-r ${matchColor} text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-md`}>
              <Sparkles className="w-4 h-4" />
              {mentor.matchScore}%
            </div>
          </div>
        </td>

        {/* Action */}
        <td className="px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={onInvite}
              className="bg-gradient-to-r from-baires-blue to-blue-600 text-white px-4 py-2 rounded-[12px] font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Invite
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded Details Row */}
      {isExpanded && (
        <tr className="bg-gradient-to-br from-orange-50/50 to-blue-50/30 border-b border-neutral-200">
          <td colSpan="6" className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bio */}
              <div className="md:col-span-2">
                <h4 className="font-bold text-neutral-black mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-baires-blue" />
                  About
                </h4>
                <p className="text-sm text-neutral-gray-dark leading-relaxed">
                  {mentor.bio || 'No bio available'}
                </p>
              </div>

              {/* Stats */}
              <div>
                <h4 className="font-bold text-neutral-black mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-baires-blue" />
                  Statistics
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-xs text-neutral-gray-dark">Active Mentorships</span>
                    <span className="font-bold text-neutral-black">{mentor.activeMentorships || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-xs text-neutral-gray-dark">Completed</span>
                    <span className="font-bold text-neutral-black">{mentor.completedMentorships || 0}</span>
                  </div>
                  {mentor.rating && (
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <span className="text-xs text-neutral-gray-dark">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-neutral-black">{mentor.rating}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// Invitation Modal Component
function InvitationModal({ mentor, mentorship, onConfirm, onCancel, isInviting }) {
  const [message, setMessage] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel}></div>
      
      <Card padding="lg" className="relative max-w-lg w-full animate-scaleIn">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Avatar 
              src={mentor.photoURL} 
              initials={mentor.displayName?.substring(0, 2)?.toUpperCase()}
              size="2xl" 
              ring
            />
          </div>
          <h2 className="text-2xl font-bold text-neutral-black mb-2">
            Send Invitation
          </h2>
          <p className="text-neutral-gray-dark">
            to <span className="font-bold text-baires-blue">{mentor.displayName}</span> for {mentorship.menteeName}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-orange-50 to-blue-100/50 rounded-[16px] border border-orange-200">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-baires-blue flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-neutral-black mb-2 flex items-center gap-2">
                  <span>AI Match Score: {mentor.matchScore}%</span>
                  <Badge variant="orange" className="text-xs">
                    {mentor.matchScore >= 80 ? 'Excellent' : mentor.matchScore >= 60 ? 'Good' : 'Fair'} Match
                  </Badge>
                </div>
                <p className="text-xs text-neutral-gray-dark">
                  This mentor is {mentor.matchScore >= 80 ? 'an excellent' : 'a good'} match for {mentorship.menteeName} based on skill alignment and experience.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-neutral-black mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-baires-blue" />
              Personal Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message to make your invitation more compelling..."
              rows="4"
              className="w-full px-4 py-3 rounded-[12px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none resize-none"
            ></textarea>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isInviting}
            className="flex-1 px-6 py-3 bg-neutral-100 text-neutral-black rounded-[14px] font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(message)}
            disabled={isInviting}
            className="flex-1 bg-gradient-to-r from-baires-blue to-blue-600 text-white px-6 py-3 rounded-[14px] font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isInviting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Invitation
              </>
            )}
          </button>
        </div>
      </Card>
    </div>
  )
}
