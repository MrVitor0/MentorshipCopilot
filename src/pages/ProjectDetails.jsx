import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import usePermissions from '../hooks/usePermissions'
import {
  getProjectById,
  updateProject,
  addProjectMentee,
  removeProjectMentee,
  addProjectMentor,
  removeProjectMentor,
  getMentees,
  getMentors,
  getUserProfile,
  getTeamById,
  getProjectMentorHistory,
  getMentorshipsByProject
} from '../services/firestoreService'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import EmptyState from '../components/EmptyState'
import SEO from '../components/SEO'
import { Users, UserPlus, X, Trash2, FolderOpen, Award, History, Clock, Edit2, CalendarDays, Target, TrendingUp, ArrowLeft } from 'lucide-react'

export default function ProjectDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { canManageProjects } = usePermissions()
  const [project, setProject] = useState(null)
  const [team, setTeam] = useState(null)
  const [mentees, setMentees] = useState([])
  const [mentors, setMentors] = useState([])
  const [mentorHistory, setMentorHistory] = useState([])
  const [mentorships, setMentorships] = useState([])
  const [availableMentees, setAvailableMentees] = useState([])
  const [availableMentors, setAvailableMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddMenteeModal, setShowAddMenteeModal] = useState(false)
  const [showAddMentorModal, setShowAddMentorModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [selectedMentee, setSelectedMentee] = useState('')
  const [selectedMentor, setSelectedMentor] = useState('')
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({ name: '', description: '' })

  useEffect(() => {
    if (!canManageProjects) {
      navigate('/dashboard')
      return
    }
    loadProjectData()
  }, [id, canManageProjects, navigate])

  const loadProjectData = async () => {
    try {
      setLoading(true)
      const projectData = await getProjectById(id)
      if (!projectData) {
        navigate('/projects')
        return
      }

      setProject(projectData)
      setEditData({ name: projectData.name, description: projectData.description || '' })

      if (projectData.teamId) {
        const teamData = await getTeamById(projectData.teamId)
        setTeam(teamData)
      }

      const menteeDetails = await Promise.all(
        (projectData.mentees || []).map(menteeId => getUserProfile(menteeId))
      )
      setMentees(menteeDetails.filter(Boolean))

      const mentorDetails = await Promise.all(
        (projectData.mentors || []).map(mentorId => getUserProfile(mentorId))
      )
      setMentors(mentorDetails.filter(Boolean))

      const [allMentees, allMentors] = await Promise.all([
        getMentees(),
        getMentors()
      ])

      setAvailableMentees(
        allMentees.filter(m => !projectData.mentees?.includes(m.uid))
      )
      setAvailableMentors(
        allMentors.filter(m => !projectData.mentors?.includes(m.uid))
      )

      // Load mentor history
      const history = await getProjectMentorHistory(id)
      setMentorHistory(history)

      // Load associated mentorships
      const projectMentorships = await getMentorshipsByProject(id)
      setMentorships(projectMentorships)
    } catch (err) {
      console.error('Error loading project data:', err)
      setError('Failed to load project data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProject = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      await updateProject(id, editData)
      setEditMode(false)
      loadProjectData()
    } catch (err) {
      console.error('Error updating project:', err)
      setError('Failed to update project')
    }
  }

  const handleAddMentee = async () => {
    if (!selectedMentee) return

    try {
      setError(null)
      await addProjectMentee(id, selectedMentee)
      setShowAddMenteeModal(false)
      setSelectedMentee('')
      loadProjectData()
    } catch (err) {
      console.error('Error adding mentee:', err)
      setError(err.message || 'Failed to add mentee')
    }
  }

  const handleRemoveMentee = async (menteeId) => {
    if (!window.confirm('Remove this mentee from the project?')) return

    try {
      await removeProjectMentee(id, menteeId)
      loadProjectData()
    } catch (err) {
      console.error('Error removing mentee:', err)
      setError('Failed to remove mentee')
    }
  }

  const handleAddMentor = async () => {
    if (!selectedMentor) return

    try {
      setError(null)
      await addProjectMentor(id, selectedMentor)
      setShowAddMentorModal(false)
      setSelectedMentor('')
      loadProjectData()
    } catch (err) {
      console.error('Error adding mentor:', err)
      setError(err.message || 'Failed to add mentor')
    }
  }

  const handleRemoveMentor = async (mentorId) => {
    if (!window.confirm('Remove this mentor from the project?')) return

    try {
      await removeProjectMentor(id, mentorId)
      loadProjectData()
    } catch (err) {
      console.error('Error removing mentor:', err)
      setError('Failed to remove mentor')
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/15">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-baires-blue border-r-transparent"></div>
            <p className="text-lg text-neutral-gray-dark font-medium">Loading project...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/15">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="max-w-md w-full text-center" padding="xl">
            <EmptyState
              title="Project not found"
              description="The project you're looking for doesn't exist"
              action={{ label: 'Back to Projects', onClick: () => navigate('/projects') }}
            />
          </Card>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO 
        title={`${project.name} - Project Details`}
        description={`Manage ${project.name} project details, mentees, and mentors`}
      />
      
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/15 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2 text-neutral-gray-dark hover:text-neutral-black mb-6 transition-colors group font-semibold"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </button>

            <div className="space-y-6">
              {error && (
                <Card className="bg-red-50 border-red-200 animate-fadeIn" padding="md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <X className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
                </Card>
              )}

              {/* Header Section */}
              <Card hover gradient className="animate-fadeIn">
                {editMode ? (
                  <form onSubmit={handleUpdateProject} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-neutral-black mb-3">
                          Project Name
                        </label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full px-5 py-3.5 bg-white border-2 border-neutral-200 rounded-[16px] text-neutral-black placeholder-neutral-gray-light focus:outline-none focus:border-baires-blue focus:ring-4 focus:ring-orange-100 transition-all"
                          placeholder="Enter project name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-neutral-black mb-3">
                          Description
                        </label>
                        <textarea
                          value={editData.description}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          className="w-full px-5 py-3.5 bg-white border-2 border-neutral-200 rounded-[16px] text-neutral-black placeholder-neutral-gray-light focus:outline-none focus:border-baires-blue focus:ring-4 focus:ring-orange-100 transition-all resize-none"
                          placeholder="Project description (optional)"
                          rows={4}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={() => {
                          setEditMode(false)
                          setEditData({ name: project.name, description: project.description || '' })
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1" icon={<Edit2 className="w-4 h-4" />}>
                        Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
                      <div className="flex-1 min-w-0">
                        <h1 className="text-4xl font-black text-neutral-black mb-3 leading-tight">
                          {project.name}
                        </h1>
                        {project.description && (
                          <p className="text-lg text-neutral-gray-dark leading-relaxed mb-4">
                            {project.description}
                          </p>
                        )}
                        {team && (
                          <Link
                            to={`/teams/${team.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 rounded-[14px] text-baires-blue font-semibold transition-all hover:scale-105 hover:shadow-md"
                          >
                            <FolderOpen className="w-4 h-4" />
                            Team: {team.name}
                          </Link>
                        )}
                      </div>
                      <Button 
                        variant="secondary" 
                        onClick={() => setEditMode(true)}
                        icon={<Edit2 className="w-4 h-4" />}
                        className="flex-shrink-0"
                      >
                        Edit Project
                      </Button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[20px] p-5 border-2 border-blue-200/50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="text-sm font-bold text-blue-900/60">Mentees</span>
                        </div>
                        <p className="text-3xl font-black text-blue-900">{mentees.length}</p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-[20px] p-5 border-2 border-purple-200/50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Award className="w-5 h-5 text-purple-600" />
                          </div>
                          <span className="text-sm font-bold text-purple-900/60">Mentors</span>
                        </div>
                        <p className="text-3xl font-black text-purple-900">{mentors.length}</p>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-[20px] p-5 border-2 border-green-200/50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          </div>
                          <span className="text-sm font-bold text-green-900/60">Active</span>
                        </div>
                        <p className="text-3xl font-black text-green-900">{mentorships.length}</p>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-blue-100/50 rounded-[20px] p-5 border-2 border-orange-200/50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                            <CalendarDays className="w-5 h-5 text-orange-600" />
                          </div>
                          <span className="text-sm font-bold text-orange-900/60">Created</span>
                        </div>
                        <p className="text-sm font-bold text-orange-900">
                          {project.createdAt?.toDate?.().toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </Card>

              {/* Active Mentorships Section */}
              {mentorships.length > 0 && (
                <Card hover gradient className="animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-neutral-black">Active Mentorships</h2>
                      <p className="text-sm text-neutral-gray-dark">{mentorships.length} ongoing sessions</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {mentorships.map((mentorship) => (
                      <Link
                        key={mentorship.id}
                        to={`/mentorship/${mentorship.id}`}
                        className="block p-5 bg-gradient-to-br from-white to-neutral-50 rounded-[20px] border-2 border-neutral-100 hover:border-baires-blue hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-lg font-bold text-neutral-black mb-1 group-hover:text-baires-blue transition-colors">
                              {mentorship.topic || 'Mentorship'}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                mentorship.status === 'active' 
                                  ? 'bg-green-100 text-green-700'
                                  : mentorship.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {mentorship.status}
                              </span>
                              <span className="text-sm text-neutral-gray-dark">
                                {mentorship.createdAt?.toDate?.().toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-baires-blue group-hover:scale-110 transition-all">
                            <FolderOpen className="w-5 h-5 text-baires-blue group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}

              {/* Mentees and Mentors Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mentees Card */}
                <Card hover gradient className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-neutral-black">Mentees</h2>
                        <p className="text-xs text-neutral-gray-dark">{mentees.length} total</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setShowAddMenteeModal(true)}
                      icon={<UserPlus className="w-4 h-4" />}
                    >
                      Add
                    </Button>
                  </div>

                  {mentees.length === 0 ? (
                    <EmptyState
                      title="No mentees yet"
                      description="Add mentees to this project"
                    />
                  ) : (
                    <div className="space-y-3">
                      {mentees.map((mentee) => (
                        <div
                          key={mentee.uid}
                          className="flex items-center justify-between p-4 bg-gradient-to-br from-white to-neutral-50 rounded-[18px] border-2 border-neutral-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Avatar
                              src={mentee.photoURL}
                              alt={mentee.displayName}
                              size="md"
                              className="ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-neutral-black truncate">{mentee.displayName}</p>
                              <p className="text-xs text-neutral-gray-dark truncate">{mentee.email}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveMentee(mentee.uid)}
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 text-neutral-gray-light hover:text-red-600 transition-all hover:scale-110 flex-shrink-0"
                            title="Remove mentee"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Mentors Card */}
                <Card hover gradient className="animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-neutral-black">Mentors</h2>
                        <p className="text-xs text-neutral-gray-dark">{mentors.length} assigned</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setShowHistoryModal(true)}
                        icon={<History className="w-4 h-4" />}
                      >
                        History
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setShowAddMentorModal(true)}
                        icon={<UserPlus className="w-4 h-4" />}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {mentors.length === 0 ? (
                    <EmptyState
                      title="No mentors yet"
                      description="Add mentors when needed for specific mentees"
                    />
                  ) : (
                    <div className="space-y-3">
                      {mentors.map((mentor) => (
                        <div
                          key={mentor.uid}
                          className="flex items-center justify-between p-4 bg-gradient-to-br from-white to-neutral-50 rounded-[18px] border-2 border-neutral-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Avatar
                              src={mentor.photoURL}
                              alt={mentor.displayName}
                              size="md"
                              className="ring-2 ring-purple-100 group-hover:ring-purple-300 transition-all"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-neutral-black truncate">{mentor.displayName}</p>
                              <p className="text-xs text-neutral-gray-dark truncate mb-1">{mentor.email}</p>
                              {mentor.technologies && mentor.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {mentor.technologies.slice(0, 3).map((tech, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs font-semibold text-baires-blue bg-orange-50 px-2 py-0.5 rounded-full"
                                    >
                                      {tech.name || tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveMentor(mentor.uid)}
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 text-neutral-gray-light hover:text-red-600 transition-all hover:scale-110 flex-shrink-0"
                            title="Remove mentor"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showAddMenteeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <Card className="max-w-md w-full animate-scaleIn" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-neutral-black">Add Mentee</h2>
              </div>
              <button
                onClick={() => {
                  setShowAddMenteeModal(false)
                  setSelectedMentee('')
                }}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-gray-light hover:text-neutral-black transition-all hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-neutral-black mb-3">
                  Select Mentee
                </label>
                <select
                  value={selectedMentee}
                  onChange={(e) => setSelectedMentee(e.target.value)}
                  className="w-full px-5 py-3.5 bg-white border-2 border-neutral-200 rounded-[16px] text-neutral-black focus:outline-none focus:border-baires-blue focus:ring-4 focus:ring-orange-100 transition-all"
                >
                  <option value="">Choose a mentee...</option>
                  {availableMentees.map((mentee) => (
                    <option key={mentee.uid} value={mentee.uid}>
                      {mentee.displayName} ({mentee.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowAddMenteeModal(false)
                    setSelectedMentee('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleAddMentee}
                  disabled={!selectedMentee}
                  icon={<UserPlus className="w-4 h-4" />}
                >
                  Add Mentee
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-scaleIn" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <History className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-neutral-black">Mentor History</h2>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-gray-light hover:text-neutral-black transition-all hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {mentorHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-neutral-gray-light" />
                </div>
                <p className="text-lg font-semibold text-neutral-gray-dark">No mentor history available</p>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {mentorHistory.map((entry, index) => (
                  <div
                    key={index}
                    className={`p-5 rounded-[20px] border-2 transition-all ${
                      entry.isActive
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                        : 'bg-gradient-to-br from-white to-neutral-50 border-neutral-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            entry.isActive ? 'bg-green-500/20' : 'bg-neutral-200'
                          }`}>
                            <Award className={`w-4 h-4 ${entry.isActive ? 'text-green-600' : 'text-neutral-gray-dark'}`} />
                          </div>
                          <h3 className="font-black text-neutral-black">{entry.mentorName}</h3>
                          {entry.isActive && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-gray-dark mb-3">{entry.mentorEmail}</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-neutral-gray-dark">
                            <Clock className="w-4 h-4" />
                            <span className="font-semibold">Added:</span>
                            <span>
                              {entry.addedAt?.toDate?.().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          {entry.removedAt && (
                            <div className="flex items-center gap-2 text-sm text-neutral-gray-dark">
                              <Clock className="w-4 h-4" />
                              <span className="font-semibold">Removed:</span>
                              <span>
                                {entry.removedAt?.toDate?.().toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t-2 border-neutral-200">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setShowHistoryModal(false)}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showAddMentorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <Card className="max-w-md w-full animate-scaleIn" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-neutral-black">Add Mentor</h2>
              </div>
              <button
                onClick={() => {
                  setShowAddMentorModal(false)
                  setSelectedMentor('')
                }}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-gray-light hover:text-neutral-black transition-all hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-neutral-black mb-3">
                  Select Mentor
                </label>
                <select
                  value={selectedMentor}
                  onChange={(e) => setSelectedMentor(e.target.value)}
                  className="w-full px-5 py-3.5 bg-white border-2 border-neutral-200 rounded-[16px] text-neutral-black focus:outline-none focus:border-baires-blue focus:ring-4 focus:ring-orange-100 transition-all"
                >
                  <option value="">Choose a mentor...</option>
                  {availableMentors.map((mentor) => (
                    <option key={mentor.uid} value={mentor.uid}>
                      {mentor.displayName} ({mentor.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowAddMentorModal(false)
                    setSelectedMentor('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleAddMentor}
                  disabled={!selectedMentor}
                  icon={<UserPlus className="w-4 h-4" />}
                >
                  Add Mentor
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

