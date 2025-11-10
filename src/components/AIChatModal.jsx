import { useState, useRef, useEffect } from 'react'
import { X, Send, Sparkles, Zap, MessageCircle, Lightbulb } from 'lucide-react'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../config/firebase'

export default function AIChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your Mentorship CoPilot. How can I help you today?",
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [thinkingSteps, setThinkingSteps] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages([...messages, userMessage])
    const messageToSend = inputValue
    setInputValue('')
    setIsTyping(true)
    setThinkingSteps([]) // Clear previous thinking steps

    try {
      // Call the AI chat endpoint
      const chatFunction = httpsCallable(functions, 'mentorshipCopilotChat')
      
      // Build chat history for context
      const chatHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))

      const result = await chatFunction({
        message: messageToSend,
        chatHistory: chatHistory.slice(-10) // Keep last 10 messages for context
      })

      // Display thinking steps if available
      if (result.data.thinkingSteps && result.data.thinkingSteps.length > 0) {
        setThinkingSteps(result.data.thinkingSteps)
      }

      // Add AI response
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: result.data.response,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        thinkingSteps: result.data.thinkingSteps
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error calling AI chat:', error)
      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: "I apologize, but I'm having trouble connecting right now. Please make sure the ANTHROPIC_API_KEY is configured in your Firebase environment. You can try asking again in a moment.",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
      // Clear thinking steps after a short delay
      setTimeout(() => setThinkingSteps([]), 1000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickActions = [
    { icon: Lightbulb, text: 'Find mentors for JavaScript', color: 'orange' },
    { icon: MessageCircle, text: 'Show me React mentors', color: 'blue' },
    { icon: Zap, text: 'Who are the Python experts?', color: 'purple' },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-3xl h-[80vh] bg-white rounded-[32px] shadow-[0_20px_60px_rgb(0,0,0,0.3)] border border-neutral-100 flex flex-col animate-scaleIn overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-baires-orange via-orange-600 to-orange-700 text-white p-6 rounded-t-[32px]">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-[16px] flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  Mentorship CoPilot
                  <span className="text-sm font-normal bg-white/20 px-2 py-0.5 rounded-full">AI</span>
                </h2>
                <p className="text-sm opacity-90">Your intelligent assistant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-[12px] flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 p-4 border-b border-neutral-100 bg-gradient-to-r from-orange-50 to-blue-50">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setInputValue(action.text)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[12px] bg-white border-2 ${
                action.color === 'orange' ? 'border-orange-200 hover:border-orange-400 text-baires-orange' :
                action.color === 'blue' ? 'border-blue-200 hover:border-blue-400 text-baires-blue' :
                'border-purple-200 hover:border-purple-400 text-purple-600'
              } hover:shadow-md transition-all duration-300 text-sm font-semibold`}
            >
              <action.icon className="w-4 h-4" />
              {action.text}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slideInUp`}
            >
              <div className={`max-w-[75%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`rounded-[20px] p-4 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-baires-orange to-orange-600 text-white'
                      : 'bg-gradient-to-br from-neutral-50 to-neutral-100 text-neutral-black border border-neutral-200'
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content.split('\n').map((line, idx) => (
                      <span key={idx}>
                        {line}
                        {idx < message.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
                <p className={`text-xs text-neutral-gray-dark mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-slideInUp">
              <div className="max-w-[85%]">
                {/* Thinking Breakdown Card */}
                <div className="bg-gradient-to-br from-orange-50 via-white to-blue-50 rounded-[20px] p-5 border-2 border-orange-200/50 shadow-lg backdrop-blur-sm">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-orange-200/50">
                    <div className="w-10 h-10 bg-gradient-to-br from-baires-orange to-orange-600 rounded-[12px] flex items-center justify-center shadow-md">
                      <Sparkles className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-black">AI Thinking...</h4>
                      <p className="text-xs text-neutral-gray-dark">Processing your request</p>
                    </div>
                  </div>

                  {/* Thinking Steps */}
                  <div className="space-y-2.5">
                    {thinkingSteps.length === 0 ? (
                      <div className="flex items-center gap-3 text-sm text-neutral-gray-dark">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 bg-baires-orange rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-baires-orange rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-baires-orange rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <span className="animate-pulse">Initializing...</span>
                      </div>
                    ) : (
                      thinkingSteps.map((step, index) => (
                        <div 
                          key={index}
                          className="flex items-start gap-2.5 animate-slideInUp"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {/* Icon indicator */}
                          <div className={`w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0 shadow-sm ${
                            step.type === 'tool_call' ? 'bg-blue-100 text-blue-600' :
                            step.type === 'tool_result' ? 'bg-green-100 text-green-600' :
                            step.type === 'analyzing' ? 'bg-purple-100 text-purple-600' :
                            step.type === 'validating' ? 'bg-orange-100 text-orange-600' :
                            step.type === 'complete' ? 'bg-green-100 text-green-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            <span className="text-sm">{step.message.split(' ')[0]}</span>
                          </div>

                          {/* Step message */}
                          <div className="flex-1 pt-1">
                            <p className="text-sm text-neutral-black leading-relaxed">
                              {step.message}
                            </p>
                            {step.toolName && (
                              <p className="text-xs text-neutral-gray-dark mt-0.5 font-mono">
                                {step.toolName}
                              </p>
                            )}
                          </div>

                          {/* Animated indicator for active step */}
                          {index === thinkingSteps.length - 1 && step.type !== 'complete' && (
                            <div className="flex items-center gap-1 pt-1">
                              <div className="w-1.5 h-1.5 bg-baires-orange rounded-full animate-ping"></div>
                              <div className="w-1.5 h-1.5 bg-baires-orange rounded-full"></div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 pt-3 border-t border-orange-200/50">
                    <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-baires-orange via-orange-500 to-orange-600 rounded-full transition-all duration-500 ease-out animate-pulse"
                        style={{ 
                          width: thinkingSteps.length === 0 ? '20%' : 
                                 thinkingSteps.some(s => s.type === 'complete') ? '100%' : 
                                 `${Math.min(20 + (thinkingSteps.length * 15), 95)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-neutral-100 bg-gradient-to-r from-neutral-50 to-white">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about mentorship..."
                className="w-full px-4 py-3 pr-12 rounded-[16px] border-2 border-neutral-200 focus:border-baires-orange focus:outline-none resize-none bg-white text-neutral-black placeholder:text-neutral-gray-dark transition-colors"
                rows="1"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-1 text-neutral-gray-dark">
                <Sparkles className="w-4 h-4 text-baires-orange" />
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="w-12 h-12 bg-gradient-to-br from-baires-orange to-orange-600 text-white rounded-[16px] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

