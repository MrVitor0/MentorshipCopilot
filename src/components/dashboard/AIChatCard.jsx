import { useState, useRef, useEffect } from 'react'
import { Sparkles, BarChart3, Users, Target, Send, Zap, Search, CheckCircle, Brain } from 'lucide-react'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../../config/firebase'
import Card from '../Card'

const quickActions = [
  {
    id: 1,
    icon: BarChart3,
    text: 'Show team performance',
    gradient: 'from-white to-blue-50 hover:to-blue-100',
    border: 'border-blue-100 hover:border-blue-300',
    iconColor: 'text-baires-blue'
  },
  {
    id: 2,
    icon: Users,
    text: 'Find mentor for React',
    gradient: 'from-white to-purple-50 hover:to-purple-100',
    border: 'border-purple-100 hover:border-purple-300',
    iconColor: 'text-purple-600'
  },
  {
    id: 3,
    icon: Target,
    text: 'Get recommendations',
    gradient: 'from-white to-indigo-50 hover:to-indigo-100',
    border: 'border-indigo-100 hover:border-indigo-300',
    iconColor: 'text-baires-indigo'
  }
]

export default function AIChatCard() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I can help you analyze your mentorship progress, find the best mentors, or answer questions about your projects.",
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [thinkingSteps, setThinkingSteps] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, thinkingSteps])

  const handleSend = async (messageText = inputValue) => {
    if (!messageText.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: messageText,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages([...messages, userMessage])
    setInputValue('')
    setIsTyping(true)
    setThinkingSteps([])

    try {
      const chatFunction = httpsCallable(functions, 'mentorshipCopilotChat')
      
      const chatHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))

      const result = await chatFunction({
        message: messageText,
        chatHistory: chatHistory.slice(-10)
      })

      if (result.data.thinkingSteps && result.data.thinkingSteps.length > 0) {
        const steps = result.data.thinkingSteps
        for (let i = 0; i < steps.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 150))
          setThinkingSteps(steps.slice(0, i + 1))
        }
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: result.data.response,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiMessage])
      setThinkingSteps([])
      setIsTyping(false)
    } catch (error) {
      console.error('Error calling AI chat:', error)
      const errorMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, errorMessage])
      setThinkingSteps([])
      setIsTyping(false)
    }
  }

  const handleQuickAction = (text) => {
    setInputValue(text)
    handleSend(text)
  }

  const getStepIcon = (type) => {
    switch(type) {
      case 'tool_call': return <Search className="w-3 h-3" />
      case 'tool_result': return <CheckCircle className="w-3 h-3" />
      case 'analyzing': return <Brain className="w-3 h-3" />
      default: return <Sparkles className="w-3 h-3" />
    }
  }

  const getStepColor = (type) => {
    switch(type) {
      case 'tool_call': return 'bg-blue-100 text-blue-600'
      case 'tool_result': return 'bg-green-100 text-green-600'
      case 'analyzing': return 'bg-purple-100 text-purple-600'
      default: return 'bg-indigo-100 text-indigo-600'
    }
  }

  return (
    <Card padding="none" className="overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 border-2 border-indigo-100 shadow-[0_20px_50px_rgba(79,70,229,0.15)] flex flex-col h-full">
      <div className="relative flex flex-col h-full">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-baires-indigo/10 to-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-400/10 to-indigo-400/5 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-2 p-4 pb-3 border-b border-indigo-100 flex-shrink-0">
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-baires-indigo to-indigo-600 rounded-[10px] flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-black">CoPilot</h3>
              <p className="text-xs text-neutral-gray-dark">AI Assistant</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0" style={{ maxHeight: '400px' }}>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-[12px] p-2.5 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-baires-indigo to-indigo-600 text-white'
                      : 'bg-white border border-indigo-100 text-neutral-black shadow-sm'
                  }`}>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p className={`text-[10px] text-neutral-gray-dark mt-0.5 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}

            {/* Thinking Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[90%] bg-white border border-indigo-200 rounded-[12px] p-2.5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-baires-indigo animate-pulse" />
                    <span className="text-xs font-bold text-neutral-black">Thinking...</span>
                  </div>
                  
                  {thinkingSteps.length > 0 ? (
                    <div className="space-y-1.5">
                      {thinkingSteps.slice(-3).map((step, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                          <div className={`w-5 h-5 rounded-[6px] flex items-center justify-center flex-shrink-0 ${getStepColor(step.type)}`}>
                            {getStepIcon(step.type)}
                          </div>
                          <p className="text-[10px] text-neutral-gray-dark leading-tight flex-1">{step.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-baires-indigo rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-baires-indigo rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1.5 h-1.5 bg-baires-indigo rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && !isTyping && (
            <div className="px-3 pb-2 flex-shrink-0">
              <p className="text-[10px] font-bold text-neutral-gray-dark uppercase tracking-wider mb-1.5">Quick Actions</p>
              <div className="grid grid-cols-1 gap-1">
                {quickActions.map((action) => (
                  <button 
                    key={action.id}
                    onClick={() => handleQuickAction(action.text)}
                    className={`w-full text-left px-2 py-1.5 bg-gradient-to-br ${action.gradient} border ${action.border} rounded-[8px] transition-all duration-300 cursor-pointer`}
                  >
                    <div className="flex items-center gap-1.5">
                      <action.icon className={`w-3 h-3 ${action.iconColor} flex-shrink-0`} />
                      <span className="text-[10px] text-neutral-black font-medium">{action.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 pt-2 border-t border-indigo-100 flex-shrink-0">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask me anything..."
                className="w-full bg-white border-2 border-indigo-200 text-neutral-black placeholder-neutral-gray-dark px-2.5 py-2 pr-9 rounded-[10px] focus:outline-none focus:border-baires-indigo transition-all duration-300 text-xs"
                disabled={isTyping}
              />
              <button 
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-baires-indigo to-indigo-600 rounded-[6px] flex items-center justify-center hover:scale-110 transition-transform shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Send className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

