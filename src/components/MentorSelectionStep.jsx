import { useState, useEffect } from 'react'
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
  Send
} from 'lucide-react'

/**
 * MentorSelectionStep - Step 5 of mentorship creation wizard
 * Displays AI-recommended top mentors and paginated table of other available mentors
 */
export default function MentorSelectionStep({
  selectedMentee,
  recommendedMentors = { topMentors: [], otherMentors: [] },
  selectedMentors = [],
  onMentorSelect = () => {}
}) {
  // State for other mentors pagination and filtering
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('displayName')
  const [sortOrder, setSortOrder] = useState('asc')

  const pageSize = 10

  // Process other mentors from AI recommendations with local filtering and pagination
  const processOtherMentors = () => {
    let mentors = [...(recommendedMentors.otherMentors || [])]
    console.log('🔍 Processing other mentors:', mentors.length, mentors)
    
    // Apply search filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase()
      mentors = mentors.filter(mentor => 
        mentor.displayName?.toLowerCase().includes(lowerQuery) ||
        mentor.bio?.toLowerCase().includes(lowerQuery) ||
        mentor.role?.toLowerCase().includes(lowerQuery)
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

  const filteredMentors = processOtherMentors()
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

  return (
    <div className="p-8 md:p-12 bg-gradient-to-br from-white to-orange-50/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-baires-orange to-orange-600 text-white px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold text-sm">AI-Powered Recommendations</span>
          </div>
          <h2 className="text-3xl font-bold text-neutral-black mb-3">
            Invite Mentors to Your Mentorship
          </h2>
          <p className="text-neutral-gray-dark">
            Select one or more mentors to invite. Our AI has ranked the top matches for <b>{selectedMentee?.displayName}</b>
          </p>
        </div>

        {/* AI Top 3 Recommendations */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[14px] flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-neutral-black">AI Top Recommendations</h3>
              <p className="text-sm text-neutral-gray-dark">Best matches based on skills, experience, and success rate</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {recommendedMentors.topMentors.map((mentor, index) => {
              const isSelected = isMentorSelected(mentor.uid || mentor.id)
              
              // Generate a color from the palette if no photo
              const colors = [
                'from-baires-orange to-orange-600',
                'from-baires-blue to-blue-600',
                'from-purple-500 to-purple-600',
                'from-green-500 to-green-600',
                'from-pink-500 to-pink-600'
              ]
              const colorIndex = (mentor.displayName?.charCodeAt(0) || 0) % colors.length
              const bannerColor = colors[colorIndex]
              
              return (
                <div
                  key={mentor.uid || mentor.id}
                  onClick={() => onMentorSelect(mentor)}
                  className={`relative group cursor-pointer transition-all duration-500 rounded-[24px] ${
                    isSelected 
                      ? 'ring-4 ring-baires-orange ring-offset-4 shadow-2xl scale-105' 
                      : 'hover:shadow-2xl hover:scale-105'
                  }`}
                >
                  <Card
                    padding="none"
                    className="bg-white overflow-hidden rounded-[24px] h-full flex flex-col"
                  >
                    {/* Banner Background - Blurred Photo or Gradient */}
                    <div className="relative h-32 overflow-hidden rounded-t-[24px]">
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
                      
                      {/* AI Score Badge */}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-baires-orange px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 border-2 border-orange-200">
                        <Sparkles className="w-3 h-3 animate-pulse" />
                        {mentor.aiScore || 95}% Match
                      </div>

                      {/* Rank Badge */}
                      <div className="absolute top-4 left-4 w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold shadow-xl text-lg border-2 border-white">
                        {index + 1}
                      </div>
                    </div>

                    {/* Profile Photo - Overlapping Banner */}
                    <div className="flex justify-center -mt-16 mb-4">
                      <div className="relative inline-block">
                        {mentor.photoURL ? (
                          <img
                            src={mentor.photoURL}
                            alt={mentor.displayName}
                            className="w-40 h-40 rounded-full object-cover shadow-2xl"
                          />
                        ) : (
                          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-baires-orange to-baires-blue flex items-center justify-center font-bold text-neutral-white text-6xl shadow-2xl">
                            {mentor.displayName?.substring(0, 2)?.toUpperCase()}
                          </div>
                        )}
                        {/* Selected Check - Floating */}
                        {isSelected && (
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-full flex items-center justify-center shadow-xl animate-scaleIn border-4 border-white z-10">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-6 flex-1 flex flex-col">
                      {/* Name and Role */}
                      <div className="text-center mb-4">
                        <h4 className={`font-bold text-xl mb-1 transition-colors ${isSelected ? 'text-baires-orange' : 'text-neutral-black'}`}>
                          {mentor.displayName}
                        </h4>
                        <p className="text-sm text-neutral-gray-dark font-medium mb-2">{mentor.role || 'Senior Engineer'}</p>
                        
                        {/* Technologies Pills - Fixed Height */}
                        <div className="flex flex-wrap gap-1.5 justify-center mb-4 min-h-[32px] max-h-[64px] overflow-hidden">
                          {(mentor.technologies || []).slice(0, 4).map((tech, idx) => (
                            <span key={idx} className="text-xs bg-gradient-to-r from-orange-100 to-orange-200 text-baires-orange px-3 py-1 rounded-full font-semibold border border-orange-300 whitespace-nowrap">
                              {typeof tech === 'string' ? tech : tech.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* AI Magic Description - Fixed Height */}
                        <div className="mb-4 p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-[16px] border-2 border-purple-200 relative overflow-hidden h-[120px] flex flex-col">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
                          <div className="relative flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-xs font-bold text-purple-900 uppercase tracking-wide">AI Insight</span>
                            </div>
                            <p className="text-sm text-neutral-black leading-relaxed font-medium line-clamp-3">
                              {mentor.aiMagicReason}
                            </p>
                          </div>
                        </div>

                      {/* Stats Grid - Compact */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-[12px] border border-orange-200">
                          <Star className="w-5 h-5 text-baires-orange mx-auto mb-1" />
                          <div className="text-lg font-bold text-neutral-black">{mentor.rating || 4.8}</div>
                          <div className="text-xs text-neutral-gray-dark font-medium">Rating</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-[12px] border border-orange-200">
                          <Users className="w-5 h-5 text-baires-orange mx-auto mb-1" />
                          <div className="text-lg font-bold text-neutral-black">{mentor.totalMentees || 0}</div>
                          <div className="text-xs text-neutral-gray-dark font-medium">Mentees</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-[12px] border border-orange-200">
                          <TrendingUp className="w-5 h-5 text-baires-orange mx-auto mb-1" />
                          <div className="text-lg font-bold text-neutral-black">{mentor.successRate || 95}%</div>
                          <div className="text-xs text-neutral-gray-dark font-medium">Success</div>
                        </div>
                      </div>

                      {/* Key Reasons - List - Fixed Height */}
                      <div className="mb-4 flex-1">
                        {mentor.aiReasons && mentor.aiReasons.length > 0 && (
                          <div className="space-y-2 h-full max-h-[180px] overflow-hidden">
                            {mentor.aiReasons.slice(0, 3).map((reason, idx) => (
                              <div key={idx} className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                                <CheckCircle className="w-4 h-4 text-baires-orange mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-neutral-black font-medium leading-relaxed line-clamp-2">{reason}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Invite Button - Always at bottom */}
                      <div className="mt-auto">
                        <button
                          className={`w-full py-3 rounded-[14px] font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                            isSelected
                              ? 'bg-gradient-to-r from-baires-orange to-orange-600 text-white shadow-lg ring-2 ring-baires-orange ring-offset-2'
                              : 'bg-gradient-to-r from-baires-orange to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              <span>Invited</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
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
              <p className="text-neutral-gray-dark">No AI recommendations available</p>
            </Card>
          )}
        </div>

        {/* Other Available Mentors - Table View */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[14px] flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-black">Other Available Mentors</h3>
                <p className="text-sm text-neutral-gray-dark">{totalCount} mentors match your criteria</p>
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
                        className="flex items-center gap-2 hover:text-baires-orange transition-colors"
                      >
                        Mentor
                        {sortBy === 'displayName' && (
                          <span className="text-baires-orange">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th className="text-left p-4 text-sm font-bold text-neutral-black">Role & Skills</th>
                    <th className="text-center p-4 text-sm font-bold text-neutral-black">
                      <button
                        onClick={() => handleSort('rating')}
                        className="flex items-center gap-2 hover:text-baires-orange transition-colors mx-auto"
                      >
                        Rating
                        {sortBy === 'rating' && (
                          <span className="text-baires-orange">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th className="text-center p-4 text-sm font-bold text-neutral-black">
                      <button
                        onClick={() => handleSort('experience')}
                        className="flex items-center gap-2 hover:text-baires-orange transition-colors mx-auto"
                      >
                        Experience
                        {sortBy === 'experience' && (
                          <span className="text-baires-orange">{sortOrder === 'asc' ? '↑' : '↓'}</span>
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
                          className={`border-b border-neutral-100 hover:bg-orange-50/50 transition-colors ${
                            isSelected ? 'bg-orange-50' : ''
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
                                <div className={`font-bold ${isSelected ? 'text-baires-orange' : 'text-neutral-black'}`}>
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
                                  ? 'bg-gradient-to-r from-baires-orange to-orange-600 text-white shadow-md hover:shadow-lg ring-2 ring-baires-orange ring-offset-2'
                                  : 'bg-gradient-to-r from-baires-orange to-orange-600 text-white shadow-md hover:shadow-lg hover:scale-105'
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
                    className="px-3 py-2 rounded-[10px] border-2 border-neutral-200 hover:border-baires-orange hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                              ? 'bg-gradient-to-r from-baires-orange to-orange-600 text-white shadow-md'
                              : 'border-2 border-neutral-200 text-neutral-gray-dark hover:border-baires-orange hover:bg-orange-50'
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
                    className="px-3 py-2 rounded-[10px] border-2 border-neutral-200 hover:border-baires-orange hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

