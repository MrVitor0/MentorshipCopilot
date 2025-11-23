import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import usePermissions from '../hooks/usePermissions'
import { getTeamsByMember, createTeam, deleteTeam } from '../services/firestoreService'
import Sidebar from '../components/Sidebar'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import SEO from '../components/SEO'
import { Users, Plus, Trash2, Eye, Calendar, Search, SlidersHorizontal, Loader2, X } from 'lucide-react'

export default function Teams() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { canManageTeams, canViewTeams, isMentor } = usePermissions()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTeamData, setNewTeamData] = useState({
    name: '',
    description: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [error, setError] = useState(null)

  const filteredAndSortedTeams = teams
    .filter(team => 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
        case 'oldest':
          return (a.createdAt?.toMillis?.() || 0) - (b.createdAt?.toMillis?.() || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'members':
          return (b.members?.length || 0) - (a.members?.length || 0)
        default:
          return 0
      }
    })

  useEffect(() => {
    if (!canViewTeams) {
      navigate('/dashboard')
      return
    }
    loadTeams()
  }, [canViewTeams, navigate])

  const loadTeams = async () => {
    try {
      setLoading(true)
      const data = await getTeamsByMember(user.uid)
      setTeams(data)
    } catch (err) {
      console.error('Error loading teams:', err)
      setError('Failed to load teams')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      
      if (!newTeamData.name.trim()) {
        setError('Team name is required')
        return
      }

      const teamData = {
        name: newTeamData.name.trim(),
        description: newTeamData.description.trim(),
        members: [user.uid],
        createdBy: user.uid,
        createdByName: user.displayName
      }

      await createTeam(teamData)
      setShowCreateModal(false)
      setNewTeamData({ name: '', description: '' })
      loadTeams()
    } catch (err) {
      console.error('Error creating team:', err)
      setError('Failed to create team')
    }
  }

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return
    
    try {
      await deleteTeam(teamId)
      loadTeams()
    } catch (err) {
      console.error('Error deleting team:', err)
      setError('Failed to delete team')
    }
  }

  return (
    <>
      <SEO 
        title="Teams"
        description="Manage your project teams and members. Create teams, organize projects, and collaborate effectively."
      />
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/15">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <PageHeader 
              title="Teams"
              description="Manage your project teams and members"
              showActions={false}
            />

            {/* Mentor Info Alert */}
            {isMentor && (
              <Card className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-100/50 border-2 border-blue-300/70" padding="md">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-md flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-blue-800 font-bold mb-1">You're a Mentor</h3>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      You're viewing teams in read-only mode. Project Managers (PMs) are responsible for creating and managing teams. 
                      When a PM adds you to a team, it will appear here and you'll be able to collaborate with team members.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Error Alert */}
            {error && (
              <Card className="mb-6 bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-300/70" padding="md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-[14px] flex items-center justify-center shadow-md">
                    <X className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </Card>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-baires-blue mx-auto mb-4 animate-spin" />
                  <p className="text-neutral-gray-dark">Loading teams...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Stats Header Card */}
                <Card className="mb-6" padding="md" gradient>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[20px] flex items-center justify-center shadow-lg">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-neutral-black">
                          {filteredAndSortedTeams.length} {filteredAndSortedTeams.length === 1 ? 'Team' : 'Teams'}
                        </h2>
                        <p className="text-sm text-neutral-gray-dark font-medium">
                          Manage your project management teams
                        </p>
                      </div>
                    </div>

                    {canManageTeams && (
                      <Button
                        variant="orange"
                        size="md"
                        icon={<Plus className="w-5 h-5" />}
                        onClick={() => setShowCreateModal(true)}
                      >
                        Create Team
                      </Button>
                    )}
                  </div>
                </Card>

                {/* Search and Filters */}
                <Card padding="md" className="mb-6">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-gray-dark" />
                      <input
                        type="text"
                        placeholder="Search teams..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-[14px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none text-neutral-black placeholder-neutral-gray-dark transition-colors"
                      />
                    </div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-5 py-3 rounded-[14px] border-2 transition-all font-semibold ${
                        showFilters
                          ? 'bg-gradient-to-r from-baires-blue to-blue-600 border-baires-blue text-white shadow-lg'
                          : 'bg-white border-neutral-200 text-neutral-gray-dark hover:border-baires-blue hover:text-baires-blue'
                      }`}
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Expandable Filters */}
                  {showFilters && (
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <h3 className="text-sm font-bold text-neutral-black mb-3">Sort & Filter</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-neutral-gray-dark mb-2">
                            Sort by
                          </label>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-2 rounded-[12px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none text-neutral-black transition-colors"
                          >
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                            <option value="name">Name (A-Z)</option>
                            <option value="members">Most members</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Teams Grid or Empty State */}
                {teams.length === 0 ? (
                  <Card padding="xl" className="text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-10 h-10 text-baires-blue" />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-black mb-2">
                        {isMentor ? 'Not assigned to any teams yet' : 'No teams yet'}
                      </h3>
                      <p className="text-neutral-gray-dark mb-6">
                        {isMentor 
                          ? 'When a Project Manager adds you to a team, it will appear here'
                          : 'Create your first team to organize your projects and members'
                        }
                      </p>
                      {canManageTeams && (
                        <Button 
                          variant="orange" 
                          icon={<Plus className="w-4 h-4" />}
                          onClick={() => setShowCreateModal(true)}
                        >
                          Create Team
                        </Button>
                      )}
                    </div>
                  </Card>
                ) : filteredAndSortedTeams.length === 0 ? (
                  <Card padding="xl" className="text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-10 h-10 text-neutral-gray-dark" />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-black mb-2">No teams found</h3>
                      <p className="text-neutral-gray-dark">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedTeams.map((team) => (
                      <Card key={team.id} hover padding="md" className="group">
                        <div className="flex flex-col h-full">
                          {/* Team Header */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[16px] flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <Users className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-neutral-black mb-1 truncate">
                                {team.name}
                              </h3>
                              {team.description && (
                                <p className="text-sm text-neutral-gray-dark line-clamp-2">
                                  {team.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Team Stats */}
                          <div className="flex items-center gap-4 mb-4 p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[14px]">
                            <div className="flex items-center gap-2 text-sm text-neutral-black">
                              <Users className="w-4 h-4 text-baires-blue" />
                              <span className="font-semibold">{team.members?.length || 0} members</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-gray-dark">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {team.createdAt?.toDate?.().toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-auto flex gap-2">
                            <button
                              onClick={() => navigate(`/teams/${team.id}`)}
                              className="flex-1 bg-gradient-to-r from-baires-blue to-blue-600 text-white px-4 py-2.5 rounded-[12px] font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            {canManageTeams && (
                              <button
                                onClick={() => handleDeleteTeam(team.id)}
                                className="px-4 py-2.5 bg-gradient-to-r from-red-100 to-red-200 text-red-700 rounded-[12px] font-semibold hover:from-red-500 hover:to-red-600 hover:text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <Card className="max-w-md w-full animate-scaleIn" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[16px] flex items-center justify-center shadow-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-black">Create New Team</h2>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewTeamData({ name: '', description: '' })
                  setError(null)
                }}
                className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5 text-neutral-gray-dark" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral-black mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  value={newTeamData.name}
                  onChange={(e) => setNewTeamData({ ...newTeamData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-[14px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none text-neutral-black placeholder-neutral-gray-dark transition-colors"
                  placeholder="Engineering Team Alpha"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-black mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newTeamData.description}
                  onChange={(e) => setNewTeamData({ ...newTeamData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-[14px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none text-neutral-black placeholder-neutral-gray-dark transition-colors resize-none"
                  placeholder="Description of the team's purpose and responsibilities"
                  rows={3}
                />
              </div>

              {error && (
                <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-300/70" padding="sm">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </Card>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewTeamData({ name: '', description: '' })
                    setError(null)
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="orange"
                  size="md"
                  className="flex-1"
                  icon={<Plus className="w-4 h-4" />}
                >
                  Create Team
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  )
}

