import { useState } from 'react'
import { X, Send, MessageSquare, Loader2 } from 'lucide-react'
import { useConfirm } from '../hooks/useConfirm'
import Card from './Card'
import Avatar from './Avatar'
import Button from './Button'

export default function MessageModal({ isOpen, onClose, recipient }) {
  const confirm = useConfirm()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  if (!isOpen) return null

  const handleSend = async () => {
    if (!message.trim()) return
    
    setSending(true)
    
    // Simulate sending - replace with real implementation
    setTimeout(async () => {
      await confirm.showDialog({
        type: 'success',
        hideIcon: true,
        hideTitle: true,
        confirmText: 'OK',
        message: (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-3">
              <svg viewBox="0 0 54 54" className="w-16 h-16">
                <g fill="none" fillRule="evenodd">
                  <path d="M19.712.133a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386h5.376V5.52A5.381 5.381 0 0 0 19.712.133m0 14.365H5.376A5.381 5.381 0 0 0 0 19.884a5.381 5.381 0 0 0 5.376 5.387h14.336a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386" fill="#36C5F0"/>
                  <path d="M53.76 19.884a5.381 5.381 0 0 0-5.376-5.386 5.381 5.381 0 0 0-5.376 5.386v5.387h5.376a5.381 5.381 0 0 0 5.376-5.387m-14.336 0V5.52A5.381 5.381 0 0 0 34.048.133a5.381 5.381 0 0 0-5.376 5.387v14.364a5.381 5.381 0 0 0 5.376 5.387 5.381 5.381 0 0 0 5.376-5.387" fill="#2EB67D"/>
                  <path d="M34.048 54a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386h-5.376v5.386A5.381 5.381 0 0 0 34.048 54m0-14.365h14.336a5.381 5.381 0 0 0 5.376-5.386 5.381 5.381 0 0 0-5.376-5.387H34.048a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386" fill="#ECB22E"/>
                  <path d="M0 34.249a5.381 5.381 0 0 0 5.376 5.386 5.381 5.381 0 0 0 5.376-5.386v-5.387H5.376A5.381 5.381 0 0 0 0 34.25m14.336 0v14.364A5.381 5.381 0 0 0 19.712 54a5.381 5.381 0 0 0 5.376-5.387V34.25a5.381 5.381 0 0 0-5.376-5.387 5.381 5.381 0 0 0-5.376 5.387" fill="#E01E5A"/>
                </g>
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-xl mb-2">Message sent to Slack!</p>
              <p className="text-sm text-neutral-600">
                Your message has been successfully delivered to <strong>{recipient?.name || 'the recipient'}</strong> via Slack.
              </p>
            </div>
          </div>
        )
      })
      setSending(false)
      setMessage('')
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl">
        <Card padding="none" className="overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-baires-blue to-blue-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-[14px] flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Send Message</h2>
                  <p className="text-sm opacity-90">Communicate with your team</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-[12px] flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient */}
            {recipient && (
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-[16px]">
                <Avatar 
                  src={recipient.avatar}
                  initials={recipient.name?.substring(0, 2)?.toUpperCase()}
                  size="md"
                />
                <div>
                  <div className="text-xs opacity-75 font-semibold uppercase">TO:</div>
                  <div className="font-bold">{recipient.name}</div>
                  {recipient.role && (
                    <div className="text-xs opacity-75">{recipient.role}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Message Body */}
          <div className="p-6">
            <label className="block text-sm font-bold text-neutral-black mb-2">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={6}
              className="w-full px-4 py-3 rounded-[16px] border-2 border-neutral-200 focus:border-baires-blue focus:outline-none resize-none transition-colors"
              disabled={sending}
            />
            
            <div className="mt-4 p-3 bg-blue-50 rounded-[12px] border border-blue-200 flex items-start gap-2">
              <svg viewBox="0 0 54 54" className="w-5 h-5 flex-shrink-0 mt-0.5">
                <g fill="none" fillRule="evenodd">
                  <path d="M19.712.133a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386h5.376V5.52A5.381 5.381 0 0 0 19.712.133m0 14.365H5.376A5.381 5.381 0 0 0 0 19.884a5.381 5.381 0 0 0 5.376 5.387h14.336a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386" fill="#36C5F0"/>
                  <path d="M53.76 19.884a5.381 5.381 0 0 0-5.376-5.386 5.381 5.381 0 0 0-5.376 5.386v5.387h5.376a5.381 5.381 0 0 0 5.376-5.387m-14.336 0V5.52A5.381 5.381 0 0 0 34.048.133a5.381 5.381 0 0 0-5.376 5.387v14.364a5.381 5.381 0 0 0 5.376 5.387 5.381 5.381 0 0 0 5.376-5.387" fill="#2EB67D"/>
                  <path d="M34.048 54a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386h-5.376v5.386A5.381 5.381 0 0 0 34.048 54m0-14.365h14.336a5.381 5.381 0 0 0 5.376-5.386 5.381 5.381 0 0 0-5.376-5.387H34.048a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386" fill="#ECB22E"/>
                  <path d="M0 34.249a5.381 5.381 0 0 0 5.376 5.386 5.381 5.381 0 0 0 5.376-5.386v-5.387H5.376A5.381 5.381 0 0 0 0 34.25m14.336 0v14.364A5.381 5.381 0 0 0 19.712 54a5.381 5.381 0 0 0 5.376-5.387V34.25a5.381 5.381 0 0 0-5.376-5.387 5.381 5.381 0 0 0-5.376 5.387" fill="#E01E5A"/>
                </g>
              </svg>
              <p className="text-xs text-blue-800 flex-1">
                Your message will be delivered directly to <strong>{recipient?.name}</strong>'s Slack workspace.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button
              variant="blue"
              onClick={handleSend}
              disabled={!message.trim() || sending}
              icon={sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            >
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

