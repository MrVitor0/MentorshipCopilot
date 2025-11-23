import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import usePermissions from '../hooks/usePermissions'
import { getDashboardAnalytics } from '../services/firestoreService'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'
import SEO from '../components/SEO'
import { 
  BarChart3, Users, FolderOpen, Award, TrendingUp, Download, Loader2, 
  Target, Sparkles, ArrowRight, ChevronRight, Activity, Zap, Star,
  PieChart, TrendingDown, UserCheck, Briefcase
} from 'lucide-react'

export default function Analytics() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { canManageProjects } = usePermissions()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!canManageProjects) {
      navigate('/dashboard')
      return
    }
    loadAnalytics()
  }, [canManageProjects, navigate])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const data = await getDashboardAnalytics(user.uid)
      setAnalytics(data)
    } catch (err) {
      console.error('Error loading analytics:', err)
      setError('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!analytics) return

    const csvData = []
    
    csvData.push(['Teams Analytics'])
    csvData.push(['Total Teams', analytics.teams.totalTeams])
    csvData.push(['Total Members', analytics.teams.totalMembers])
    csvData.push(['Average Members per Team', analytics.teams.averageMembersPerTeam])
    csvData.push(['Teams with Projects', analytics.teams.teamsWithProjects])
    csvData.push([])
    
    csvData.push(['Projects Analytics'])
    csvData.push(['Total Projects', analytics.projects.totalProjects])
    csvData.push(['Total Mentees', analytics.projects.totalMentees])
    csvData.push(['Active Mentors', analytics.projects.totalActiveMentors])
    csvData.push(['Average Mentees per Project', analytics.projects.averageMenteesPerProject])
    csvData.push(['Projects with Teams', analytics.projects.projectsWithTeams])
    csvData.push(['Projects without Teams', analytics.projects.projectsWithoutTeams])
    csvData.push([])
    
    csvData.push(['Your Statistics'])
    csvData.push(['My Teams', analytics.userStats.myTeams])
    csvData.push(['My Projects', analytics.userStats.myProjects])
    csvData.push(['My Mentees', analytics.userStats.myMentees])
    csvData.push(['My Active Mentors', analytics.userStats.myActiveMentors])

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `analytics_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Component: Insight Card - Visual card with context
  const InsightCard = ({ title, value, change, changeLabel, icon: Icon, color, insight }) => (
    <Card hover padding="lg" gradient className="group relative overflow-hidden cursor-pointer">
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 group-hover:opacity-10 transition-all duration-700`}></div>
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 ${color} rounded-[18px] flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
            <Icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300 group-hover:scale-110 ${
              change >= 0 ? 'bg-green-100 text-green-700 group-hover:bg-green-200' : 'bg-red-100 text-red-700 group-hover:bg-red-200'
            }`}>
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-bold">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-neutral-gray-dark font-bold mb-2 group-hover:text-neutral-black transition-colors">{title}</p>
        <h3 className="text-5xl font-black text-neutral-black mb-3 group-hover:text-baires-blue transition-colors duration-300">{value}</h3>
        
        {changeLabel && (
          <p className="text-xs font-semibold text-neutral-gray-light mb-3">{changeLabel}</p>
        )}
        
        {insight && (
          <div className="mt-4 pt-4 border-t-2 border-neutral-200 group-hover:border-baires-blue/30 transition-colors duration-300">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-baires-blue flex-shrink-0 mt-0.5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
              <p className="text-sm text-neutral-gray-dark leading-relaxed group-hover:text-neutral-black transition-colors">{insight}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )

  // Component: Progress Ring - Visual circular progress
  const ProgressRing = ({ percentage, size = 120, strokeWidth = 12, label, color = '#8B5CF6' }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-neutral-black">{percentage}%</span>
          {label && <span className="text-xs text-neutral-gray-dark font-semibold mt-1">{label}</span>}
        </div>
      </div>
    )
  }

  // Component: Team/Project List Item
  const ListItem = ({ item, type }) => {
    const isTeam = type === 'team'
    const Icon = isTeam ? Users : FolderOpen
    const colorClass = isTeam ? 'from-baires-blue to-blue-600' : 'from-purple-500 to-purple-600'
    const hoverColorClass = isTeam ? 'group-hover:text-baires-blue' : 'group-hover:text-purple-600'
    const shadowColor = isTeam ? 'rgba(26,115,232,0.25)' : 'rgba(168,85,247,0.25)'
    const shadowHoverColor = isTeam ? 'rgba(26,115,232,0.4)' : 'rgba(168,85,247,0.4)'

    return (
      <Link
        to={`/${type}s/${item.id}`}
        className="group block"
      >
        <Card hover padding="md" className="transition-all duration-300 group-hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div 
                className={`w-14 h-14 bg-gradient-to-br ${colorClass} rounded-[18px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}
                style={{
                  boxShadow: `0 8px 20px ${shadowColor}`,
                  transition: 'all 0.5s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 12px 30px ${shadowHoverColor}`}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 8px 20px ${shadowColor}`}
              >
                <Icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-black text-neutral-black mb-1 transition-colors duration-300 ${hoverColorClass}`}>{item.name}</h4>
                <div className="flex items-center gap-3 text-sm text-neutral-gray-dark font-semibold">
                  {isTeam ? (
                    <>
                      <span className="flex items-center gap-1 group-hover:text-neutral-black transition-colors">
                        <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        {item.membersCount} members
                      </span>
                      <span className="flex items-center gap-1 group-hover:text-neutral-black transition-colors">
                        <FolderOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        {item.projectsCount} projects
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1 group-hover:text-neutral-black transition-colors">
                        <UserCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        {item.menteesCount} mentees
                      </span>
                      <span className="flex items-center gap-1 group-hover:text-neutral-black transition-colors">
                        <Award className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        {item.mentorsCount} mentors
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-baires-blue transition-all duration-300">
              <ChevronRight className="w-5 h-5 text-neutral-gray-dark group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <>
      <SEO 
        title="Analytics Dashboard"
        description="Visual insights into your teams and projects. Track performance and make data-driven decisions."
      />
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/15">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
            {/* Page Header - Simplified and modern */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-baires-blue to-blue-600 rounded-[16px] flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-neutral-black">Analytics Dashboard</h1>
                  <p className="text-sm text-neutral-gray-dark">Visual insights and performance metrics</p>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-baires-blue mx-auto mb-4 animate-spin" />
                  <p className="text-neutral-gray-dark">Loading analytics...</p>
                </div>
              </div>
            ) : error || !analytics ? (
              <Card padding="xl" className="text-center bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-300/70">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-700 mb-2">Error Loading Analytics</h3>
                  <p className="text-red-600">{error || 'Failed to load analytics'}</p>
                </div>
              </Card>
            ) : (
              <>
                {/* Tabs Navigation */}
                <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
                  {[
                    { id: 'overview', label: 'Overview', icon: Activity },
                    { id: 'teams', label: 'Teams', icon: Users },
                    { id: 'projects', label: 'Projects', icon: FolderOpen },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group flex items-center gap-2 px-6 py-3 rounded-[16px] font-bold transition-all duration-300 whitespace-nowrap flex-shrink-0 cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-baires-blue to-blue-600 text-white shadow-[0_8px_20px_rgba(246,97,53,0.35)] hover:shadow-[0_12px_30px_rgba(246,97,53,0.45)]'
                          : 'bg-white text-neutral-gray-dark hover:text-baires-blue hover:bg-orange-50/50 border-2 border-neutral-200 hover:border-baires-blue hover:shadow-md active:shadow-sm'
                      }`}
                    >
                      <tab.icon className={`w-5 h-5 transition-all duration-300 ${
                        activeTab === tab.id ? 'group-hover:scale-110' : 'group-hover:scale-110 group-hover:rotate-3'
                      }`} />
                      {tab.label}
                    </button>
                  ))}
                  <div className="ml-auto">
                    <Button
                      onClick={exportToCSV}
                      variant="outline"
                      size="sm"
                      icon={<Download className="w-4 h-4" />}
                      className="whitespace-nowrap"
                    >
                      Export
                    </Button>
                  </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8 animate-fadeIn">
                    {/* Hero Stats - Large Visual Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InsightCard
                        title="Total Teams"
                        value={analytics.teams.totalTeams}
                        change={12}
                        changeLabel="vs last month"
                        icon={Users}
                        color="bg-gradient-to-br from-baires-blue to-blue-600"
                        insight="Your teams are growing! Strong collaboration across departments."
                      />
                      <InsightCard
                        title="Total Projects"
                        value={analytics.projects.totalProjects}
                        change={8}
                        changeLabel="vs last month"
                        icon={FolderOpen}
                        color="bg-gradient-to-br from-purple-500 to-purple-600"
                        insight="Active project portfolio is expanding with new initiatives."
                      />
                    </div>

                    {/* Secondary Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card padding="lg" hover gradient className="text-center group cursor-pointer">
                        <div className="mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-[0_8px_20px_rgba(34,197,94,0.25)] group-hover:shadow-[0_12px_30px_rgba(34,197,94,0.4)] group-hover:scale-110 transition-all duration-500">
                            <UserCheck className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        </div>
                        <h3 className="text-4xl font-black text-neutral-black mb-2 group-hover:text-green-600 transition-colors duration-300">
                          {analytics.projects.totalMentees}
                        </h3>
                        <p className="text-sm text-neutral-gray-dark font-bold group-hover:text-neutral-black transition-colors">Total Mentees</p>
                        <p className="text-xs text-neutral-gray-light mt-2 font-semibold">Across all projects</p>
                      </Card>

                      <Card padding="lg" hover gradient className="text-center group cursor-pointer">
                        <div className="mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-baires-blue to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-[0_8px_20px_rgba(246,97,53,0.25)] group-hover:shadow-[0_12px_30px_rgba(246,97,53,0.4)] group-hover:scale-110 transition-all duration-500">
                            <Award className="w-8 h-8 text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                          </div>
                        </div>
                        <h3 className="text-4xl font-black text-neutral-black mb-2 group-hover:text-baires-blue transition-colors duration-300">
                          {analytics.projects.totalActiveMentors}
                        </h3>
                        <p className="text-sm text-neutral-gray-dark font-bold group-hover:text-neutral-black transition-colors">Active Mentors</p>
                        <p className="text-xs text-neutral-gray-light mt-2 font-semibold">Currently assigned</p>
                      </Card>

                      <Card padding="lg" hover gradient className="text-center group cursor-pointer">
                        <div className="mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-baires-blue to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-[0_8px_20px_rgba(26,115,232,0.25)] group-hover:shadow-[0_12px_30px_rgba(26,115,232,0.4)] group-hover:scale-110 transition-all duration-500">
                            <Briefcase className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        </div>
                        <h3 className="text-4xl font-black text-neutral-black mb-2 group-hover:text-baires-blue transition-colors duration-300">
                          {analytics.teams.totalMembers}
                        </h3>
                        <p className="text-sm text-neutral-gray-dark font-bold group-hover:text-neutral-black transition-colors">Team Members</p>
                        <p className="text-xs text-neutral-gray-light mt-2 font-semibold">Total across teams</p>
                      </Card>
                    </div>

                    {/* Visual Distribution */}
                    <Card padding="xl" gradient>
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-neutral-black mb-2">Project Distribution</h3>
                        <p className="text-neutral-gray-dark">Team-based vs Individual projects</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        <div className="text-center">
                          <ProgressRing 
                            percentage={analytics.projects.totalProjects > 0 ? Math.round((analytics.projects.projectsWithTeams / analytics.projects.totalProjects) * 100) : 0}
                            size={180}
                            strokeWidth={16}
                            color="#8B5CF6"
                          />
                          <h4 className="text-xl font-bold text-neutral-black mt-6 mb-2">Team Projects</h4>
                          <p className="text-neutral-gray-dark">
                            <span className="font-bold text-purple-600">{analytics.projects.projectsWithTeams}</span> out of {analytics.projects.totalProjects} projects
                          </p>
                          <div className="mt-4 pt-4 border-t border-neutral-200">
                            <p className="text-sm text-neutral-gray-dark">Strong team collaboration model</p>
                          </div>
                        </div>

                        <div className="text-center">
                          <ProgressRing 
                            percentage={analytics.projects.totalProjects > 0 ? Math.round((analytics.projects.projectsWithoutTeams / analytics.projects.totalProjects) * 100) : 0}
                            size={180}
                            strokeWidth={16}
                            color="#F66135"
                          />
                          <h4 className="text-xl font-bold text-neutral-black mt-6 mb-2">Individual Projects</h4>
                          <p className="text-neutral-gray-dark">
                            <span className="font-bold text-baires-blue">{analytics.projects.projectsWithoutTeams}</span> out of {analytics.projects.totalProjects} projects
                          </p>
                          <div className="mt-4 pt-4 border-t border-neutral-200">
                            <p className="text-sm text-neutral-gray-dark">Independent mentorship tracks</p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card padding="md" className="text-center border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                        <p className="text-xs text-neutral-gray-dark font-semibold mb-1">Avg Members/Team</p>
                        <p className="text-3xl font-bold text-baires-blue">{analytics.teams.averageMembersPerTeam}</p>
                      </Card>
                      <Card padding="md" className="text-center border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                        <p className="text-xs text-neutral-gray-dark font-semibold mb-1">Avg Mentees/Project</p>
                        <p className="text-3xl font-bold text-purple-600">{analytics.projects.averageMenteesPerProject}</p>
                      </Card>
                      <Card padding="md" className="text-center border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
                        <p className="text-xs text-neutral-gray-dark font-semibold mb-1">My Teams</p>
                        <p className="text-3xl font-bold text-green-600">{analytics.userStats.myTeams}</p>
                      </Card>
                      <Card padding="md" className="text-center border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                        <p className="text-xs text-neutral-gray-dark font-semibold mb-1">My Projects</p>
                        <p className="text-3xl font-bold text-baires-blue">{analytics.userStats.myProjects}</p>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Teams Tab */}
                {activeTab === 'teams' && (
                  <div className="space-y-8 animate-fadeIn">
                    {/* Teams Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card padding="lg" hover gradient className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-baires-blue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-5xl font-bold text-neutral-black mb-2">{analytics.teams.totalTeams}</h3>
                        <p className="text-sm text-neutral-gray-dark font-semibold">Total Teams</p>
                        <div className="mt-4 pt-4 border-t border-neutral-200">
                          <p className="text-xs text-neutral-gray-dark">Across your organization</p>
                        </div>
                      </Card>

                      <Card padding="lg" hover gradient className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-5xl font-bold text-neutral-black mb-2">{analytics.teams.totalMembers}</h3>
                        <p className="text-sm text-neutral-gray-dark font-semibold">Total Members</p>
                        <div className="mt-4 pt-4 border-t border-neutral-200">
                          <p className="text-xs text-neutral-gray-dark">{analytics.teams.averageMembersPerTeam} avg per team</p>
                        </div>
                      </Card>

                      <Card padding="lg" hover gradient className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <FolderOpen className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-5xl font-bold text-neutral-black mb-2">{analytics.teams.teamsWithProjects}</h3>
                        <p className="text-sm text-neutral-gray-dark font-semibold">Teams with Projects</p>
                        <div className="mt-4 pt-4 border-t border-neutral-200">
                          <p className="text-xs text-neutral-gray-dark">Active project teams</p>
                        </div>
                      </Card>
                    </div>

                    {/* Teams List */}
                    {analytics.teams.teamsList.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-neutral-black mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-baires-blue" />
                          All Teams
                        </h3>
                        <div className="space-y-3">
                          {analytics.teams.teamsList.map((team) => (
                            <ListItem key={team.id} item={team} type="team" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                  <div className="space-y-8 animate-fadeIn">
                    {/* Projects Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card padding="lg" hover gradient className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <FolderOpen className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-5xl font-bold text-neutral-black mb-2">{analytics.projects.totalProjects}</h3>
                        <p className="text-sm text-neutral-gray-dark font-semibold">Total Projects</p>
                        <div className="mt-4 pt-4 border-t border-neutral-200">
                          <p className="text-xs text-neutral-gray-dark">Active across organization</p>
                        </div>
                      </Card>

                      <Card padding="lg" hover gradient className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <UserCheck className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-5xl font-bold text-neutral-black mb-2">{analytics.projects.totalMentees}</h3>
                        <p className="text-sm text-neutral-gray-dark font-semibold">Total Mentees</p>
                        <div className="mt-4 pt-4 border-t border-neutral-200">
                          <p className="text-xs text-neutral-gray-dark">{analytics.projects.averageMenteesPerProject} avg per project</p>
                        </div>
                      </Card>

                      <Card padding="lg" hover gradient className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-baires-blue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-5xl font-bold text-neutral-black mb-2">{analytics.projects.totalActiveMentors}</h3>
                        <p className="text-sm text-neutral-gray-dark font-semibold">Active Mentors</p>
                        <div className="mt-4 pt-4 border-t border-neutral-200">
                          <p className="text-xs text-neutral-gray-dark">Currently assigned</p>
                        </div>
                      </Card>
                    </div>

                    {/* Projects List */}
                    {analytics.projects.projectsList.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-neutral-black mb-4 flex items-center gap-2">
                          <Star className="w-5 h-5 text-purple-600" />
                          All Projects
                        </h3>
                        <div className="space-y-3">
                          {analytics.projects.projectsList.map((project) => (
                            <ListItem key={project.id} item={project} type="project" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

