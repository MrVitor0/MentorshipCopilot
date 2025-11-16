import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import usePermissions from '../hooks/usePermissions'
import {
  getTeamById,
  updateTeam,
  addTeamMember,
  removeTeamMember,
  getProjectsByTeam,
  getUserProfile,
  getAllUsers
} from '../services/firestoreService'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import SEO from '../components/SEO'
import { 
  Users, Plus, Trash2, ArrowLeft, FolderOpen, UserPlus, X, 
  Edit2, Save, Loader2, Target, Briefcase, Calendar, Check, ChevronRight
} from 'lucide-react'

export default function TeamDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { canManageTeams } = usePermissions()
  const [team, setTeam] = useState(null)
  const [projects, setProjects] = useState([])
  const [members, setMembers] = useState([])
  const [availablePMs, setAvailablePMs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [selectedPM, setSelectedPM] = useState('')
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({ name: '', description: '' })

  useEffect(() => {
    if (!canManageTeams) {
      navigate('/dashboard')
      return
    }
    loadTeamData()
  }, [id, canManageTeams, navigate])

  const loadTeamData = async () => {
    try {
      setLoading(true)
      const teamData = await getTeamById(id)
      if (!teamData) {
        navigate('/teams')
        return
      }

      setTeam(teamData)
      setEditData({ name: teamData.name, description: teamData.description || '' })

      const teamProjects = await getProjectsByTeam(id)
      setProjects(teamProjects)

      const memberDetails = await Promise.all(
        (teamData.members || []).map(memberId => getUserProfile(memberId))
      )
      setMembers(memberDetails.filter(Boolean))

      // Get all users and filter PMs not in team
      const allUsers = await getAllUsers()
      const filteredPMs = allUsers.filter(u => 
        u.userType === 'pm' && !teamData.members.includes(u.uid)
      )
      setAvailablePMs(filteredPMs)
    } catch (err) {
      console.error('Error loading team data:', err)
      setError('Failed to load team data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTeam = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      await updateTeam(id, editData)
      setEditMode(false)
      loadTeamData()
    } catch (err) {
      console.error('Error updating team:', err)
      setError('Failed to update team')
    }
  }

  const handleAddMember = async () => {
    if (!selectedPM) return

    try {
      setError(null)
      await addTeamMember(id, selectedPM)
      setShowAddMemberModal(false)
      setSelectedPM('')
      loadTeamData()
    } catch (err) {
      console.error('Error adding member:', err)
      setError(err.message || 'Failed to add member')
    }
  }

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member from the team?')) return

    try {
      await removeTeamMember(id, memberId)
      loadTeamData()
    } catch (err) {
      console.error('Error removing member:', err)
      setError('Failed to remove member')
    }
  }

  return (
    <>
      <SEO 
        title={team ? `${team.name} - Team Details` : 'Team Details'}
        description="Manage team members, view projects, and track team performance."
      />
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-orange-50/15">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate('/teams')}
              className="flex items-center gap-2 text-neutral-gray-dark hover:text-neutral-black mb-6 transition-colors group font-semibold"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Teams
            </button>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-baires-orange mx-auto mb-4 animate-spin" />
                  <p className="text-neutral-gray-dark">Loading team...</p>
                </div>
              </div>
            ) : !team ? (
              <Card padding="xl" className="text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-black mb-2">Team not found</h3>
                  <p className="text-neutral-gray-dark mb-6">The team you're looking for doesn't exist</p>
                  <Button variant="orange" onClick={() => navigate('/teams')}>
                    Back to Teams
                  </Button>
                </div>
              </Card>
            ) : (
              <>
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

                {/* Team Header Card */}
                <Card className="mb-8" padding="lg" gradient>
                  {editMode ? (
                    <form onSubmit={handleUpdateTeam} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-neutral-black mb-2">
                          Team Name
                        </label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-[14px] border-2 border-neutral-200 focus:border-baires-orange focus:outline-none text-neutral-black placeholder-neutral-gray-dark transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-neutral-black mb-2">
                          Description
                        </label>
                        <textarea
                          value={editData.description}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          className="w-full px-4 py-3 rounded-[14px] border-2 border-neutral-200 focus:border-baires-orange focus:outline-none text-neutral-black placeholder-neutral-gray-dark transition-colors resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button type="button" variant="secondary" size="md" onClick={() => setEditMode(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" variant="orange" size="md" icon={<Save className="w-4 h-4" />}>
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[20px] flex items-center justify-center shadow-lg">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h1 className="text-3xl font-bold text-neutral-black mb-2">{team.name}</h1>
                            {team.description && (
                              <p className="text-neutral-gray-dark">{team.description}</p>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="md" icon={<Edit2 className="w-4 h-4" />} onClick={() => setEditMode(true)}>
                          Edit
                        </Button>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[16px] border-2 border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-baires-blue" />
                            <span className="text-xs text-neutral-gray-dark font-semibold">Members</span>
                          </div>
                          <p className="text-3xl font-bold text-baires-blue">{members.length}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-[16px] border-2 border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <FolderOpen className="w-4 h-4 text-purple-600" />
                            <span className="text-xs text-neutral-gray-dark font-semibold">Projects</span>
                          </div>
                          <p className="text-3xl font-bold text-purple-600">{projects.length}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-[16px] border-2 border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-neutral-gray-dark font-semibold">Total Mentees</span>
                          </div>
                          <p className="text-3xl font-bold text-green-600">
                            {projects.reduce((sum, p) => sum + (p.mentees?.length || 0), 0)}
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[16px] border-2 border-orange-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-baires-orange" />
                            <span className="text-xs text-neutral-gray-dark font-semibold">Created</span>
                          </div>
                          <p className="text-sm font-bold text-neutral-black">
                            {team.createdAt?.toDate?.().toLocaleDateString('en-US', { 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </Card>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Team Members Card */}
                  <Card padding="lg">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[14px] flex items-center justify-center shadow-md">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-black">Team Members</h2>
                      </div>
                      <Button
                        variant="orange"
                        size="sm"
                        icon={<UserPlus className="w-4 h-4" />}
                        onClick={() => setShowAddMemberModal(true)}
                      >
                        Add
                      </Button>
                    </div>

                    {members.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-baires-blue" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-black mb-2">No members yet</h3>
                        <p className="text-neutral-gray-dark text-sm mb-4">Add PMs to this team</p>
                        <Button 
                          variant="outline"
                          size="sm"
                          icon={<UserPlus className="w-4 h-4" />}
                          onClick={() => setShowAddMemberModal(true)}
                        >
                          Add Member
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {members.map((member) => (
                          <Card 
                            key={member.uid} 
                            hover
                            padding="md"
                            className="group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar
                                  src={member.photoURL}
                                  initials={member.displayName?.substring(0, 2)?.toUpperCase()}
                                  size="md"
                                />
                                <div>
                                  <p className="font-bold text-neutral-black">{member.displayName}</p>
                                  <p className="text-xs text-neutral-gray-dark">{member.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {member.uid === team.createdBy ? (
                                  <span className="text-xs font-bold text-baires-orange bg-orange-100 px-3 py-1.5 rounded-full border border-orange-200">
                                    Creator
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleRemoveMember(member.uid)}
                                    className="p-2 hover:bg-red-100 rounded-[10px] text-red-600 transition-colors opacity-0 group-hover:opacity-100"
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
                  </Card>

                  {/* Projects Card */}
                  <Card padding="lg">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[14px] flex items-center justify-center shadow-md">
                          <FolderOpen className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-neutral-black">Projects</h2>
                      </div>
                      <Link to={`/projects/new?teamId=${id}`}>
                        <Button
                          variant="orange"
                          size="sm"
                          icon={<Plus className="w-4 h-4" />}
                        >
                          Add
                        </Button>
                      </Link>
                    </div>

                    {projects.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FolderOpen className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-black mb-2">No projects yet</h3>
                        <p className="text-neutral-gray-dark text-sm mb-4">Create projects for this team</p>
                        <Link to={`/projects/new?teamId=${id}`}>
                          <Button 
                            variant="outline"
                            size="sm"
                            icon={<Plus className="w-4 h-4" />}
                          >
                            Create Project
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {projects.map((project) => (
                          <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="block group"
                          >
                            <Card hover padding="md">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[12px] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all">
                                    <FolderOpen className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-neutral-black group-hover:text-baires-orange transition-colors">{project.name}</p>
                                    <p className="text-xs text-neutral-gray-dark">
                                      {project.mentees?.length || 0} mentees
                                    </p>
                                  </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-neutral-gray-dark group-hover:text-baires-orange group-hover:translate-x-1 transition-all" />
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <Card className="max-w-md w-full animate-scaleIn" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[16px] flex items-center justify-center shadow-lg">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-black">Add Team Member</h2>
              </div>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-[10px] hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5 text-neutral-gray-dark" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral-black mb-2">
                  Select PM
                </label>
                <select
                  value={selectedPM}
                  onChange={(e) => setSelectedPM(e.target.value)}
                  className="w-full px-4 py-3 rounded-[14px] border-2 border-neutral-200 focus:border-baires-orange focus:outline-none text-neutral-black transition-colors"
                >
                  <option value="">Choose a PM...</option>
                  {availablePMs.map((pm) => (
                    <option key={pm.uid} value={pm.uid}>
                      {pm.displayName} ({pm.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={() => setShowAddMemberModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="orange"
                  size="md"
                  className="flex-1"
                  icon={<Check className="w-4 h-4" />}
                  onClick={handleAddMember}
                  disabled={!selectedPM}
                >
                  Add Member
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

