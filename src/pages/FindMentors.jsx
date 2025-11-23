import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import usePermissions from '../hooks/usePermissions'
import { getAllMentors } from '../services/firestoreService'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import PageHeader from '../components/PageHeader'
import SEO from '../components/SEO'
import { 
  Sparkles,
  Star,
  Award,
  Users,
  Target,
  Filter,
  Search,
  Loader2,
  TrendingUp,
  Calendar,
  Mail,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react'

export default function FindMentors() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const permissions = usePermissions()
  
  const [allMentors, setAllMentors] = useState([])
  const [filteredMentors, setFilteredMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedRow, setExpandedRow] = useState(null)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAvailability, setFilterAvailability] = useState('all')
  const [filterExperience, setFilterExperience] = useState('all')
  const [sortBy, setSortBy] = useState('name') // name, experience
  const [sortOrder, setSortOrder] = useState('asc')

  // Load mentors data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const mentorsData = await getAllMentors()
        console.log('Loaded mentors:', mentorsData.length)
        setAllMentors(mentorsData)
        setFilteredMentors(mentorsData)
      } catch (error) {
        console.error('Error loading mentors:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Apply filters and sorting
  useEffect(() => {
    if (!allMentors.length) return

    let filtered = [...allMentors]

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

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal
      
      switch (sortBy) {
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
  }, [allMentors, searchQuery, filterAvailability, filterExperience, sortBy, sortOrder])

  const getExperienceBadge = (years) => {
    if (years >= 10) return { label: 'Expert', variant: 'success', icon: Award }
    if (years >= 5) return { label: 'Senior', variant: 'blue', icon: Star }
    if (years >= 3) return { label: 'Mid-Level', variant: 'orange', icon: TrendingUp }
    return { label: 'Junior', variant: 'gray', icon: Target }
  }

  return (
    <>
      <SEO 
        title="Find Mentors"
        description="Browse and discover available mentors in our network"
      />
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/15">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
            <PageHeader 
              title="Find Mentors"
              description="Browse and discover available mentors in our network"
              showActions={false}
            />

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-baires-blue mx-auto mb-4 animate-spin" />
                  <p className="text-neutral-gray-dark">Loading mentors...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Filters */}
                <Card padding="lg" className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-semibold text-neutral-black mb-2">
                        Search
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray-dark" />
                        <input
                          type="text"
                          placeholder="Search by name, bio, or technology..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-[12px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none text-neutral-black placeholder-neutral-gray-dark transition-colors"
                        />
                      </div>
                    </div>

                    {/* Availability Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-neutral-black mb-2">
                        Availability
                      </label>
                      <select
                        value={filterAvailability}
                        onChange={(e) => setFilterAvailability(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-[12px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none text-neutral-black transition-colors"
                      >
                        <option value="all">All</option>
                        <option value="available">Available Only</option>
                      </select>
                    </div>

                    {/* Experience Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-neutral-black mb-2">
                        Experience
                      </label>
                      <select
                        value={filterExperience}
                        onChange={(e) => setFilterExperience(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-[12px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none text-neutral-black transition-colors"
                      >
                        <option value="all">All Levels</option>
                        <option value="junior">Junior (&lt;3 years)</option>
                        <option value="mid">Mid-Level (3-7 years)</option>
                        <option value="senior">Senior (7+ years)</option>
                      </select>
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-neutral-black">Sort by:</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSortBy('name')}
                          className={`px-4 py-2 rounded-[10px] text-sm font-semibold transition-all ${
                            sortBy === 'name'
                              ? 'bg-gradient-to-r from-baires-blue to-blue-600 text-white shadow-md'
                              : 'bg-neutral-100 text-neutral-gray-dark hover:bg-neutral-200'
                          }`}
                        >
                          Name
                        </button>
                        <button
                          onClick={() => setSortBy('experience')}
                          className={`px-4 py-2 rounded-[10px] text-sm font-semibold transition-all ${
                            sortBy === 'experience'
                              ? 'bg-gradient-to-r from-baires-blue to-blue-600 text-white shadow-md'
                              : 'bg-neutral-100 text-neutral-gray-dark hover:bg-neutral-200'
                          }`}
                        >
                          Experience
                        </button>
                        <button
                          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                          className="px-3 py-2 rounded-[10px] bg-neutral-100 hover:bg-neutral-200 text-neutral-gray-dark transition-all"
                          title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                        >
                          {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Results Count */}
                <div className="mb-4">
                  <p className="text-sm text-neutral-gray-dark">
                    Found <span className="font-bold text-neutral-black">{filteredMentors.length}</span> mentors
                  </p>
                </div>

                {/* Mentors Grid */}
                {filteredMentors.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredMentors.map((mentor) => {
                      const experience = getExperienceBadge(mentor.yearsExperience || 0)
                      const ExperienceIcon = experience.icon
                      const isExpanded = expandedRow === mentor.uid
                      
                      return (
                        <Card key={mentor.uid} hover padding="lg" className="group">
                          <div className="flex items-start gap-4 mb-4">
                            <Avatar 
                              src={mentor.photoURL} 
                              initials={mentor.displayName?.substring(0, 2)?.toUpperCase()}
                              size="xl"
                              ring
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-bold text-neutral-black truncate">
                                  {mentor.displayName}
                                </h3>
                                <Badge variant={experience.variant} className="flex items-center gap-1 text-xs flex-shrink-0">
                                  <ExperienceIcon className="w-3 h-3" />
                                  {experience.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-neutral-gray-dark mb-3 line-clamp-2">
                                {mentor.bio || 'Experienced mentor ready to help'}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-neutral-gray-dark">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{mentor.yearsExperience || 0}+ years</span>
                                </div>
                                {mentor.availability && (
                                  <div className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${
                                      mentor.availability === 'available' ? 'bg-green-500' : 'bg-gray-400'
                                    }`}></div>
                                    <span className="capitalize">{mentor.availability}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Technologies */}
                          {mentor.technologies && mentor.technologies.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-2">
                                {mentor.technologies.slice(0, isExpanded ? undefined : 5).map((tech, idx) => (
                                  <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                    {typeof tech === 'string' ? tech : tech.name || tech}
                                  </span>
                                ))}
                                {!isExpanded && mentor.technologies.length > 5 && (
                                  <span className="text-xs bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full font-medium">
                                    +{mentor.technologies.length - 5} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Expanded Details */}
                          {isExpanded && mentor.bio && (
                            <div className="mb-4 p-4 bg-blue-50 rounded-[14px] border border-blue-100">
                              <h4 className="text-sm font-bold text-neutral-black mb-2">About</h4>
                              <p className="text-sm text-neutral-gray-dark leading-relaxed">
                                {mentor.bio}
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => setExpandedRow(isExpanded ? null : mentor.uid)}
                              className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-black px-4 py-2.5 rounded-[12px] font-semibold transition-all flex items-center justify-center gap-2"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  View Details
                                </>
                              )}
                            </button>
                            {permissions.isPM && (
                              <button
                                onClick={() => navigate('/create-mentorship')}
                                className="flex-1 bg-gradient-to-r from-baires-blue to-blue-600 text-white px-4 py-2.5 rounded-[12px] font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Start Mentorship
                              </button>
                            )}
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <Card padding="xl" className="text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-10 h-10 text-neutral-gray-dark" />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-black mb-2">No mentors found</h3>
                      <p className="text-neutral-gray-dark">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
