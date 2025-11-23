import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { updateUserProfile } from '../services/firestoreService'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import SEO from '../components/SEO'
import { User, FileText, Camera, Save, AlertCircle, CheckCircle } from 'lucide-react'

export default function Settings() {
  const { user, refreshUser } = useAuth()
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    photoURL: user?.photoURL || ''
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setSuccess(false)
    setError('')
  }

  const handleSave = async () => {
    if (!formData.displayName.trim()) {
      setError('Name is required')
      return
    }

    if (!formData.bio.trim()) {
      setError('Bio is required')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await updateUserProfile(user.uid, {
        displayName: formData.displayName,
        bio: formData.bio,
        photoURL: formData.photoURL
      })
      
      await refreshUser()
      setSuccess(true)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || 'Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO 
        title="Settings"
        description="Manage your profile settings"
      />
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/15">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-black to-baires-blue bg-clip-text text-transparent mb-2">
                Settings
              </h1>
              <p className="text-neutral-gray-dark">
                Manage your profile and preferences
              </p>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-[16px] flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">Profile updated successfully!</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[16px] flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="grid gap-6">
              {/* Profile Picture */}
              <Card gradient padding="lg">
                <div className="flex items-center gap-3 mb-6">
                  <Camera className="w-6 h-6 text-baires-blue" />
                  <h2 className="text-xl font-bold text-neutral-black">Profile Picture</h2>
                </div>

                <div className="flex items-center gap-6">
                  <Avatar 
                    src={formData.photoURL || user?.photoURL}
                    initials={formData.displayName?.substring(0, 2)?.toUpperCase() || 'U'}
                    size="2xl"
                    ring
                  />
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-neutral-black mb-2">
                      Photo URL <span className="text-neutral-gray-dark font-normal">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.photoURL}
                      onChange={(e) => handleChange('photoURL', e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-baires-blue focus:border-transparent transition-all"
                      placeholder="https://example.com/photo.jpg"
                    />
                    <p className="text-xs text-neutral-gray-dark mt-2">
                      Enter a URL to your profile picture or leave empty to use initials
                    </p>
                  </div>
                </div>
              </Card>

              {/* Basic Information */}
              <Card gradient padding="lg">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-baires-blue" />
                  <h2 className="text-xl font-bold text-neutral-black">Basic Information</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-black mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => handleChange('displayName', e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-baires-blue focus:border-transparent transition-all"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-black mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-[14px] text-neutral-gray-dark cursor-not-allowed"
                    />
                    <p className="text-xs text-neutral-gray-dark mt-2">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-black mb-2">
                      User Type
                    </label>
                    <input
                      type="text"
                      value={user?.userType === 'pm' ? 'Product Manager' : user?.userType === 'mentor' ? 'Mentor' : 'Mentee'}
                      disabled
                      className="w-full px-4 py-3 bg-neutral-100 border border-neutral-200 rounded-[14px] text-neutral-gray-dark cursor-not-allowed capitalize"
                    />
                    <p className="text-xs text-neutral-gray-dark mt-2">
                      User type cannot be changed
                    </p>
                  </div>
                </div>
              </Card>

              {/* Bio */}
              <Card gradient padding="lg">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-purple-500" />
                  <h2 className="text-xl font-bold text-neutral-black">Bio</h2>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-black mb-2">
                    Profile Description
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    rows={5}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-baires-blue focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="text-xs text-neutral-gray-dark mt-2">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      displayName: user?.displayName || '',
                      bio: user?.bio || '',
                      photoURL: user?.photoURL || ''
                    })
                    setError('')
                    setSuccess(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="orange"
                  onClick={handleSave}
                  disabled={loading}
                  icon={<Save className="w-4 h-4" />}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

