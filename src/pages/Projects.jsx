import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import usePermissions from '../hooks/usePermissions'
import {
  getProjectsByPM,
  createProject,
  deleteProject,
  getTeams
} from '../services/firestoreService'
import Sidebar from '../components/Sidebar'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import SEO from '../components/SEO'
import LoadingProjects from '../components/LoadingProjects'
import { FolderOpen, Plus, Trash2, Eye, Users, Calendar, Search, SlidersHorizontal, X, Target } from 'lucide-react'

export default function Projects() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { canManageProjects, canViewProjects, isMentor } = usePermissions()
  const [projects, setProjects] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    teamId: searchParams.get('teamId') || ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterByTeam, setFilterByTeam] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [error, setError] = useState(null)

  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesTeamFilter = 
        filterByTeam === 'all' ||
        (filterByTeam === 'with-team' && project.teamId) ||
        (filterByTeam === 'without-team' && !project.teamId) ||
        (filterByTeam !== 'all' && filterByTeam !== 'with-team' && filterByTeam !== 'without-team' && project.teamId === filterByTeam)
      
      return matchesSearch && matchesTeamFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
        case 'oldest':
          return (a.createdAt?.toMillis?.() || 0) - (b.createdAt?.toMillis?.() || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'mentees':
          return (b.mentees?.length || 0) - (a.mentees?.length || 0)
        default:
          return 0
      }
    })

  useEffect(() => {
    if (!canViewProjects) {
      navigate('/dashboard')
      return
    }
    loadData()
  }, [canViewProjects, navigate])

  const loadData = async () => {
    try {
      setLoading(true)
      const [projectsData, teamsData] = await Promise.all([
        getProjectsByPM(user.uid),
        getTeams()
      ])
      setProjects(projectsData)
      setTeams(teamsData)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    try {
      setError(null)

      if (!newProjectData.name.trim()) {
        setError('Project name is required')
        return
      }

      const projectData = {
        name: newProjectData.name.trim(),
        description: newProjectData.description.trim(),
        teamId: newProjectData.teamId || null,
        pmIds: [user.uid],
        mentees: [],
        mentors: [],
        createdBy: user.uid,
        createdByName: user.displayName
      }

      await createProject(projectData)
      setShowCreateModal(false)
      setNewProjectData({ name: '', description: '', teamId: '' })
      loadData()
    } catch (err) {
      console.error('Error creating project:', err)
      setError('Failed to create project')
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return

    try {
      await deleteProject(projectId)
      loadData()
    } catch (err) {
      console.error('Error deleting project:', err)
      setError('Failed to delete project')
    }
  }

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId)
    return team ? team.name : 'No Team'
  }

  return (
    <>
      <SEO 
        title="Projects"
        description="Manage your projects and assign mentees. Organize teams, track progress, and achieve goals."
      />
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/15">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
            {/* Page Header */}
            <PageHeader 
              title="Projects"
              description="Manage your projects and assign mentees"
              showActions={false}
            />

            {/* Mentor Info Alert */}
            {isMentor && (
              <Card className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-100/50 border-2 border-blue-300/70" padding="md">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-md flex-shrink-0">
                    <FolderOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-blue-800 font-bold mb-1">You're a Mentor</h3>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      You're viewing projects in read-only mode. Project Managers (PMs) are responsible for creating and managing projects. 
                      When a PM adds you to a project as a mentor, it will appear here and in your dashboard.
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
              <LoadingProjects />
            ) : (
              <>
                {/* Stats Header Card */}
                <Card className="mb-6" padding="md" gradient>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[20px] flex items-center justify-center shadow-lg">
                        <FolderOpen className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-neutral-black">
                          {filteredAndSortedProjects.length} {filteredAndSortedProjects.length === 1 ? 'Project' : 'Projects'}
                        </h2>
                        <p className="text-sm text-neutral-gray-dark font-medium">
                          Organize mentees by project
                        </p>
                      </div>
                    </div>

                    {canManageProjects && (
                      <Button
                        variant="orange"
                        size="md"
                        icon={<Plus className="w-5 h-5" />}
                        onClick={() => setShowCreateModal(true)}
                      >
                        Create Project
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
                        placeholder="Search projects..."
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
                            <option value="mentees">Most mentees</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-neutral-gray-dark mb-2">
                            Filter by team
                          </label>
                          <select
                            value={filterByTeam}
                            onChange={(e) => setFilterByTeam(e.target.value)}
                            className="w-full px-4 py-2 rounded-[12px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none text-neutral-black transition-colors"
                          >
                            <option value="all">All projects</option>
                            <option value="with-team">With team</option>
                            <option value="without-team">Without team</option>
                            {teams.map((team) => (
                              <option key={team.id} value={team.id}>
                                {team.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Projects Grid or Empty State */}
                {projects.length === 0 ? (
                  <Card padding="xl" className="text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FolderOpen className="w-10 h-10 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-black mb-2">
                        {isMentor ? 'Not assigned to any projects yet' : 'No projects yet'}
                      </h3>
                      <p className="text-neutral-gray-dark mb-6">
                        {isMentor 
                          ? 'When a Project Manager adds you to a project, it will appear here'
                          : 'Create your first project to organize mentees and mentors'
                        }
                      </p>
                      {canManageProjects && (
                        <Button 
                          variant="orange" 
                          icon={<Plus className="w-4 h-4" />}
                          onClick={() => setShowCreateModal(true)}
                        >
                          Create Project
                        </Button>
                      )}
                    </div>
                  </Card>
                ) : filteredAndSortedProjects.length === 0 ? (
                  <Card padding="xl" className="text-center">
                    <div className="max-w-md mx-auto">
                      <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-10 h-10 text-neutral-gray-dark" />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-black mb-2">No projects found</h3>
                      <p className="text-neutral-gray-dark">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedProjects.map((project) => (
                      <Card key={project.id} hover padding="md" className="group">
                        <div className="flex flex-col h-full">
                          {/* Project Header */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[16px] flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <FolderOpen className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-neutral-black mb-1 truncate">
                                {project.name}
                              </h3>
                              {project.description && (
                                <p className="text-sm text-neutral-gray-dark line-clamp-2">
                                  {project.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Team Badge */}
                          {project.teamId && (
                            <div className="mb-3">
                              <span className="text-xs font-bold text-baires-blue bg-orange-100 px-3 py-1.5 rounded-full border border-orange-200">
                                {getTeamName(project.teamId)}
                              </span>
                            </div>
                          )}

                          {/* Project Stats */}
                          <div className="flex items-center gap-4 mb-4 p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-[14px]">
                            <div className="flex items-center gap-2 text-sm text-neutral-black">
                              <Target className="w-4 h-4 text-purple-600" />
                              <span className="font-semibold">{project.mentees?.length || 0} mentees</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-gray-dark">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {project.createdAt?.toDate?.().toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-auto flex gap-2">
                            <button
                              onClick={() => navigate(`/projects/${project.id}`)}
                              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2.5 rounded-[12px] font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            {canManageProjects && (
                              <button
                                onClick={() => handleDeleteProject(project.id)}
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

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <Card className="max-w-md w-full animate-scaleIn" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[16px] flex items-center justify-center shadow-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-black">Create New Project</h2>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewProjectData({ name: '', description: '', teamId: '' })
                  setError(null)
                }}
                className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5 text-neutral-gray-dark" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral-black mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectData.name}
                  onChange={(e) => setNewProjectData({ ...newProjectData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-[14px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none text-neutral-black placeholder-neutral-gray-dark transition-colors"
                  placeholder="E-commerce Platform"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-black mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newProjectData.description}
                  onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-[14px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none text-neutral-black placeholder-neutral-gray-dark transition-colors resize-none"
                  placeholder="Project description and goals"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-black mb-2">
                  Team (optional)
                </label>
                <select
                  value={newProjectData.teamId}
                  onChange={(e) => setNewProjectData({ ...newProjectData, teamId: e.target.value })}
                  className="w-full px-4 py-3 rounded-[14px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none text-neutral-black transition-colors"
                >
                  <option value="">No team (individual project)</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
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
                    setNewProjectData({ name: '', description: '', teamId: '' })
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
                  Create Project
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  )
}

