import { useState, useEffect } from 'react'
import { getAllMentors } from '../services/firestoreService'
import Card from './Card'
import Avatar from './Avatar'
import Badge from './Badge'
import { 
  Sparkles, 
  Star, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Search,
  ChevronLeft,
  ChevronRight,
  Award,
  Target,
  Calendar,
  Filter,
  X,
  Send,
  Loader2
} from 'lucide-react'

/**
 * MentorSelectionStep - Step 5 of mentorship creation wizard
 * Displays ALL available mentors first, then AI recommendations as secondary option
 */
export default function MentorSelectionStep({
  selectedMentee,
  recommendedMentors = { topMentors: [], otherMentors: [] },
  selectedMentors = [],
  onMentorSelect = () => {}
}) {
  // State for all mentors
  const [allMentors, setAllMentors] = useState([])
  const [loading, setLoading] = useState(true)
  
  // State for pagination and filtering
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('displayName')
  const [sortOrder, setSortOrder] = useState('asc')

  const pageSize = 15

  // Load all mentors on mount
  useEffect(() => {
    const loadAllMentors = async () => {
      setLoading(true)
      try {
        const mentors = await getAllMentors()
        console.log('📋 Loaded all mentors:', mentors.length)
        setAllMentors(mentors)
      } catch (error) {
        console.error('❌ Error loading mentors:', error)
      } finally {
        setLoading(false)
      }
    }
    loadAllMentors()
  }, [])

  // Process all mentors with filtering and pagination
  const processAllMentors = () => {
    let mentors = [...allMentors]
    console.log('🔍 Processing all mentors:', mentors.length, mentors)
    
    // Apply search filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase()
      mentors = mentors.filter(mentor => 
        mentor.displayName?.toLowerCase().includes(lowerQuery) ||
        mentor.bio?.toLowerCase().includes(lowerQuery) ||
        mentor.role?.toLowerCase().includes(lowerQuery) ||
        mentor.technologies?.some(tech => 
          (typeof tech === 'string' ? tech : tech.name)?.toLowerCase().includes(lowerQuery)
        )
      )
    }
    
    // Sort mentors
    mentors.sort((a, b) => {
      let aVal, bVal
      
      switch (sortBy) {
        case 'rating':
          aVal = a.rating || 0
          bVal = b.rating || 0
          break
        case 'experience':
          aVal = a.yearsExperience || 0
          bVal = b.yearsExperience || 0
          break
        case 'displayName':
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
    
    return mentors
  }

  const filteredMentors = processAllMentors()
  const totalCount = filteredMentors.length
  const totalPages = Math.ceil(totalCount / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedMentors = filteredMentors.slice(startIndex, endIndex)

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, sortBy, sortOrder])

  const isMentorSelected = (mentorUid) => {
    return selectedMentors.some(m => m.uid === mentorUid || m.id === mentorUid)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setCurrentPage(1) // Reset to first page on sort change
  }

  if (loading) {
    return (
      <div className="p-8 md:p-12 bg-gradient-to-br from-white to-indigo-50/20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-baires-indigo mx-auto mb-4 animate-spin" />
          <p className="text-neutral-gray-dark font-medium">Loading mentors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 md:p-12 bg-gradient-to-br from-white to-indigo-50/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-baires-indigo to-indigo-600 text-white px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="font-semibold text-sm">AI-Powered Recommendations</span>
          </div>
          <h2 className="text-3xl font-bold text-neutral-black mb-3">
            Invite Mentors to Your Mentorship
          </h2>
          <p className="text-neutral-gray-dark">
            Select one or more mentors to invite. Our AI has ranked the top matches for <b>{selectedMentee?.displayName}</b>
          </p>
        </div>

        {/* AI Top Recommendations - PRIMARY FOCUS */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-baires-indigo to-indigo-600 rounded-[14px] flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-neutral-black">AI Top Recommendations</h3>
              <p className="text-sm text-neutral-gray-dark">Best matches based on skills, experience, and success rate</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {recommendedMentors.topMentors.map((mentor, index) => {
              console.log(`🎯 AI Mentor ${index + 1}:`, {
                name: mentor.displayName,
                matchPercentage: mentor.matchPercentage,
                aiScore: mentor.aiScore
              })
              
              const isSelected = isMentorSelected(mentor.uid || mentor.id)
              
              // Generate a color from the palette if no photo
              const colors = [
                'from-baires-indigo to-indigo-600',
                'from-baires-blue to-blue-600',
                'from-indigo-500 to-indigo-700',
                'from-blue-500 to-blue-700',
                'from-sky-500 to-sky-600'
              ]
              const colorIndex = (mentor.displayName?.charCodeAt(0) || 0) % colors.length
              const bannerColor = colors[colorIndex]
              
              // Dynamic match percentage colors
              const matchPercentage = mentor.matchPercentage || mentor.aiScore || 95
              const matchColor = matchPercentage >= 90 
                ? 'text-green-600 border-green-300 bg-green-50/95' 
                : matchPercentage >= 85 
                ? 'text-baires-indigo border-indigo-300 bg-indigo-50/95'
                : 'text-yellow-600 border-yellow-300 bg-yellow-50/95'
              
              return (
                <div
                  key={mentor.uid || mentor.id}
                  onClick={() => onMentorSelect(mentor)}
                  className={`relative group cursor-pointer transition-all duration-500 rounded-[24px] ${
                    isSelected 
                      ? 'ring-4 ring-baires-indigo ring-offset-4 shadow-2xl scale-105' 
                      : 'hover:shadow-2xl hover:scale-105'
                  }`}
                >
                  <Card
                    padding="none"
                    className="bg-white overflow-hidden rounded-[24px] h-full flex flex-col"
                  >
                    {/* Compact Banner with Badge */}
                    <div className="relative h-20 overflow-hidden rounded-t-[24px]">
                      {mentor.photoURL ? (
                        <>
                          <img 
                            src={mentor.photoURL} 
                            alt="" 
                            className="w-full h-full object-cover scale-150 blur-2xl opacity-60"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
                        </>
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${bannerColor} opacity-80`}></div>
                      )}
                      
                      {/* AI Score Badge - Smaller */}
                      <div className={`absolute top-2 right-2 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 border ${matchColor}`}>
                        <Sparkles className="w-3 h-3 animate-pulse" />
                        {matchPercentage}%
                      </div>

                      {/* Rank Badge - Smaller */}
                      <div className="absolute top-2 left-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-sm border-2 border-white">
                        {index + 1}
                      </div>
                    </div>

                    {/* Profile Photo - Smaller */}
                    <div className="flex justify-center -mt-10 mb-3">
                      <div className="relative inline-block">
                        {mentor.photoURL ? (
                          <img
                            src={mentor.photoURL}
                            alt={mentor.displayName}
                            className="w-20 h-20 rounded-full object-cover shadow-xl border-4 border-white"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-baires-indigo to-baires-blue flex items-center justify-center font-bold text-neutral-white text-2xl shadow-xl border-4 border-white">
                            {mentor.displayName?.substring(0, 2)?.toUpperCase()}
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-baires-indigo to-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-scaleIn border-2 border-white">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content - More Compact */}
                    <div className="px-4 pb-4 flex-1 flex flex-col">
                      <div className="text-center mb-3">
                        <h4 className={`font-bold text-lg mb-0.5 transition-colors ${isSelected ? 'text-baires-indigo' : 'text-neutral-black'}`}>
                          {mentor.displayName}
                        </h4>
                        <p className="text-xs text-neutral-gray-dark font-medium mb-2">{mentor.role || 'Senior Engineer'}</p>
                        
                        <div className="flex flex-wrap gap-1 justify-center mb-3 max-h-[40px] overflow-hidden">
                          {(mentor.technologies || []).slice(0, 3).map((tech, idx) => (
                            <span key={idx} className="text-xs bg-gradient-to-r from-indigo-100 to-indigo-200 text-baires-indigo px-2 py-0.5 rounded-full font-semibold border border-indigo-300 whitespace-nowrap">
                              {typeof tech === 'string' ? tech : tech.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* AI Insight - More Compact */}
                      <div className="mb-3 p-3 bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 rounded-[12px] border border-indigo-200 relative overflow-hidden">
                        <div className="relative">
                          <div className="flex items-center gap-1 mb-1">
                            <Sparkles className="w-3 h-3 text-baires-indigo" />
                            <span className="text-xs font-bold text-indigo-900 uppercase">AI Insight</span>
                          </div>
                          <p className="text-xs text-neutral-black leading-snug line-clamp-3">
                            {mentor.aiInsight || mentor.aiMagicReason || "Perfect match for your requirements. Strong expertise and proven track record."}
                          </p>
                        </div>
                      </div>

                      {/* Stats - Inline & Compact */}
                      <div className="flex items-center justify-around mb-3 py-2 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-[10px] border border-indigo-200">
                        <div className="text-center">
                          <div className="flex items-center gap-1 justify-center">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-sm font-bold text-neutral-black">{mentor.rating || 4.8}</span>
                          </div>
                          <div className="text-xs text-neutral-gray-dark">Rating</div>
                        </div>
                        <div className="w-px h-8 bg-indigo-200"></div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 justify-center">
                            <Users className="w-3 h-3 text-baires-indigo" />
                            <span className="text-sm font-bold text-neutral-black">{mentor.totalMentees || 0}</span>
                          </div>
                          <div className="text-xs text-neutral-gray-dark">Mentees</div>
                        </div>
                        <div className="w-px h-8 bg-indigo-200"></div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 justify-center">
                            <TrendingUp className="w-3 h-3 text-green-600" />
                            <span className="text-sm font-bold text-neutral-black">{mentor.successRate || 95}%</span>
                          </div>
                          <div className="text-xs text-neutral-gray-dark">Success</div>
                        </div>
                      </div>

                      {/* Invite Button - Compact */}
                      <div className="mt-auto">
                        <button
                          className={`w-full py-2 rounded-[10px] font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                            isSelected
                              ? 'bg-gradient-to-r from-baires-indigo to-indigo-600 text-white shadow-md ring-2 ring-baires-indigo ring-offset-2'
                              : 'bg-gradient-to-r from-baires-indigo to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span>Invited</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Invite</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>

          {recommendedMentors.topMentors.length === 0 && (
            <Card padding="xl" className="text-center">
              <Sparkles className="w-12 h-12 text-neutral-gray-dark mx-auto mb-4 opacity-50" />
              <p className="text-neutral-gray-dark">Loading AI recommendations...</p>
            </Card>
          )}
        </div>

        {/* All Available Mentors - PLAN B (Secondary Option) */}
        <div className="border-t-2 border-neutral-200 pt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-neutral-400 to-neutral-600 rounded-[14px] flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-black">Browse All Mentors</h3>
                <p className="text-sm text-neutral-gray-dark">Alternative options if you want to explore other mentors ({totalCount} available)</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-gray-dark" />
                <input
                  type="text"
                  placeholder="Search mentors..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10 pr-4 py-2 rounded-[12px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none w-64 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray-dark hover:text-neutral-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100 border-b-2 border-neutral-200">
                  <tr>
                    <th className="text-left p-4 text-sm font-bold text-neutral-black">
                      <button
                        onClick={() => handleSort('displayName')}
                        className="flex items-center gap-2 hover:text-baires-indigo transition-colors"
                      >
                        Mentor
                        {sortBy === 'displayName' && (
                          <span className="text-baires-indigo">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th className="text-left p-4 text-sm font-bold text-neutral-black">Role & Skills</th>
                    <th className="text-center p-4 text-sm font-bold text-neutral-black">
                      <button
                        onClick={() => handleSort('rating')}
                        className="flex items-center gap-2 hover:text-baires-indigo transition-colors mx-auto"
                      >
                        Rating
                        {sortBy === 'rating' && (
                          <span className="text-baires-indigo">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th className="text-center p-4 text-sm font-bold text-neutral-black">
                      <button
                        onClick={() => handleSort('experience')}
                        className="flex items-center gap-2 hover:text-baires-indigo transition-colors mx-auto"
                      >
                        Experience
                        {sortBy === 'experience' && (
                          <span className="text-baires-indigo">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th className="text-center p-4 text-sm font-bold text-neutral-black">Mentees</th>
                    <th className="text-center p-4 text-sm font-bold text-neutral-black">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMentors.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-12 text-center">
                        <Search className="w-12 h-12 text-neutral-gray-dark mx-auto mb-3 opacity-50" />
                        <p className="text-neutral-gray-dark">
                          {searchQuery ? `No mentors found matching "${searchQuery}"` : 'No other mentors available'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedMentors.map((mentor) => {
                      const isSelected = isMentorSelected(mentor.uid)
                      
                      return (
                        <tr
                          key={mentor.uid}
                          className={`border-b border-neutral-100 hover:bg-indigo-50/50 transition-colors ${
                            isSelected ? 'bg-indigo-50' : ''
                          }`}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar 
                                src={mentor.photoURL} 
                                initials={mentor.displayName?.substring(0, 2)?.toUpperCase()}
                                size="md" 
                              />
                              <div>
                                <div className={`font-bold ${isSelected ? 'text-baires-indigo' : 'text-neutral-black'}`}>
                                  {mentor.displayName}
                                </div>
                                <div className="text-xs text-neutral-gray-dark">{mentor.bio?.substring(0, 50) || 'No bio available'}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-neutral-gray-dark mb-1">{mentor.role || 'Engineer'}</div>
                            <div className="flex flex-wrap gap-1">
                              {(mentor.technologies || []).slice(0, 3).map((tech, idx) => (
                                <span key={idx} className="text-xs bg-neutral-100 text-neutral-gray-dark px-2 py-0.5 rounded">
                                  {typeof tech === 'string' ? tech : tech.name}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-bold text-neutral-black">{mentor.rating || 4.5}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="orange" className="text-xs">
                              {mentor.yearsExperience || 5} years
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-bold text-neutral-black">{mentor.totalMentees || 0}</span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => onMentorSelect(mentor)}
                              className={`px-4 py-2 rounded-[10px] font-semibold text-sm transition-all ${
                                isSelected
                                  ? 'bg-gradient-to-r from-baires-indigo to-indigo-600 text-white shadow-md hover:shadow-lg ring-2 ring-baires-indigo ring-offset-2'
                                  : 'bg-gradient-to-r from-baires-indigo to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105'
                              }`}
                            >
                              {isSelected ? (
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" />
                                  Invited
                                </span>
                              ) : (
                                'Invite'
                              )}
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-neutral-200 p-4 bg-neutral-50 flex items-center justify-between">
                <div className="text-sm text-neutral-gray-dark">
                  Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} mentors
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-[10px] border-2 border-neutral-200 hover:border-baires-indigo hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-[10px] font-semibold text-sm transition-all ${
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-baires-indigo to-indigo-600 text-white shadow-md'
                              : 'border-2 border-neutral-200 text-neutral-gray-dark hover:border-baires-indigo hover:bg-indigo-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-[10px] border-2 border-neutral-200 hover:border-baires-indigo hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

