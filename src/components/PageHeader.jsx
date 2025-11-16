import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import usePermissions from '../hooks/usePermissions'
import Button from './Button'
import AIChatModal from './AIChatModal'
import { Search, Plus } from 'lucide-react'

/**
 * Reusable page header component with title, description and action buttons
 * Used across all main pages (Dashboard, Mentorship, etc.)
 */
export default function PageHeader({ 
  title, 
  description = "AI-powered mentorship at your fingertips",
  showActions = true 
}) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const permissions = usePermissions()

  return (
    <>
      {/* AI Chat Modal */}
      <AIChatModal 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neutral-black to-baires-indigo bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            <p className="text-neutral-gray-dark flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-baires-indigo" />
              {description}
            </p>
          </div>
          
          {showActions && (
            <div className="flex items-center gap-4 cursor-pointer">
              <button
                onClick={() => setIsChatOpen(true)}
                className="group  cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-baires-indigo to-indigo-600 text-white px-6 py-3 rounded-[14px] font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Ask Mentorship Copilot</span>
              </button>
              
              {/* Only Product Managers can see these buttons */}
              {permissions.isPM && (
                <>
                  <Button 
                    variant="outline" 
                    size="md" 
                    icon={<Search className="w-4 h-4" />}
                    onClick={() => window.location.href = '/find-mentors'}
                  >
                    Find Mentor
                  </Button>
                  <Button 
                    variant="orange" 
                    size="md" 
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => window.location.href = '/create-mentorship'}
                  >
                    New Mentorship
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

