import { useState } from 'react'
import { MessageCircle, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import AIChatModal from './AIChatModal'

export default function FloatingChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { user } = useAuth()

  // Only show for authenticated users
  if (!user) {
    return null
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-6 right-6 z-40 group cursor-pointer"
        aria-label="Open AI Chat"
      >
        {/* Main Button */}
        <div className="relative">
          {/* Outer Glow Ring - Animated */}
          <div className="absolute -inset-3 bg-gradient-to-r from-baires-orange via-orange-500 to-orange-600 rounded-full opacity-60 blur-xl group-hover:opacity-90 animate-pulse transition-opacity duration-500"></div>
          
          {/* Middle Ring - 3D Effect */}
          <div className="absolute -inset-1 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
          
          {/* Button Container with 3D Shadow */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-baires-orange via-orange-500 to-orange-600 rounded-full shadow-[0_10px_35px_rgb(251,146,60,0.5),0_4px_15px_rgb(0,0,0,0.15)] flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_15px_50px_rgb(251,146,60,0.7),0_5px_20px_rgb(0,0,0,0.2)] group-hover:-translate-y-1 group-active:scale-95 group-active:translate-y-0">
            
            {/* Inner Highlight for 3D effect */}
            <div className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>
            
            {/* AI Badge with Animation */}
            <div className={`absolute -top-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 ${isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
              <Sparkles className="w-4 h-4 text-baires-orange animate-pulse" />
            </div>
            
            {/* Main Icon with slight animation */}
            <MessageCircle 
              className={`w-7 h-7 text-white relative z-10 transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`} 
              strokeWidth={2.5} 
            />
            
            {/* Shine Effect on Hover */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
          </div>
          
          {/* Ripple Effect on Hover */}
          {isHovered && (
            <div className="absolute inset-0 rounded-full border-2 border-baires-orange animate-ping opacity-75"></div>
          )}
        </div>

        {/* Tooltip - Enhanced 3D */}
        <div className={`absolute cursor-pointer bottom-full right-0 mb-4 transition-all duration-300 pointer-events-none ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="bg-neutral-black text-white px-5 py-3 rounded-[16px] text-sm font-semibold whitespace-nowrap shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-neutral-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-baires-orange" />
              <span>Chat with Mentorship Copilot</span>
            </div>
            {/* Arrow */}
            <div className="absolute top-full right-8 -mt-1">
              <div className="border-[6px] border-transparent border-t-neutral-black"></div>
            </div>
          </div>
        </div>
      </button>

      {/* AI Chat Modal */}
      <AIChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  )
}

