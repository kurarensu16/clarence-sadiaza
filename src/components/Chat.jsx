import { useState, useEffect, useRef } from 'react'
import clarenceImage from '../assets/clarence.jpg'
import { useChatMessages } from '../hooks/useChatMessages'
import { usePortfolioContent } from '../hooks/usePortfolioContent'

const defaultChatSettings = {
  enabled: true,
  buttonText: "Chat with Clarence",
  placeholder: "Type a message...",
  autoResponses: [],
  fallbackResponse: "I'm having trouble connecting right now. Please try again or email Clarence directly!"
}

// ─── Client-side rate limiter (per browser session) ───────────────────────────
// ─── Client-side flood protection (generous 30 msgs/min) ──────────────────────
const CLIENT_RATE = { maxRequests: 30, windowMs: 60_000 }
let clientMsgTimestamps = []

function isClientRateLimited() {
  const now = Date.now()
  clientMsgTimestamps = clientMsgTimestamps.filter(t => now - t < CLIENT_RATE.windowMs)
  if (clientMsgTimestamps.length >= CLIENT_RATE.maxRequests) return true
  clientMsgTimestamps.push(now)
  return false
}

const Chat = ({ isOpen, onClose }) => {
  const { messages, sendMessage } = useChatMessages()
  const { content } = usePortfolioContent()
  const chatSettings = content?.chat || defaultChatSettings
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const generateAIResponse = async (userMessage) => {
    try {
      const isDev = import.meta.env.DEV
      const devApiKey = import.meta.env.VITE_OPENROUTER_API_KEY

      // Build recent conversation turns so follow-up questions work
      const recentHistory = messages.slice(-4).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.message || m.text || ''
      })).filter(m => m.content.trim())

      if (isDev && devApiKey) {
        // Direct query in local dev – production routes through /api/chat proxy
        const name = content?.hero?.name || 'Clarence Timothy Sadiaza'
        const title = content?.hero?.title || 'Software Engineer'
        const about = (content?.about?.paragraphs || []).join(' ')
        const email = content?.hero?.email || 'sadiazaclarence@gmail.com'
        
        // Format structured content cleanly to avoid prompt bloat
        const projectSummaries = (content?.projects || []).map(p => `- ${p.title}: ${p.description || ''} (Stack: ${(p.tags || []).join(', ')})`).join('\n')
        const skillCategories = Object.entries(content?.skills || {}).map(([cat, list]) => `${cat}: ${(Array.isArray(list) ? list : []).map(s => typeof s === 'string' ? s : s.name).join(', ')}`).join('\n')
        const experienceSummaries = (content?.experience || []).map(e => `- ${e.role} at ${e.company} (${e.period || ''})`).join('\n')

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${devApiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Clarence Sadiaza Portfolio (Local Dev)'
          },
          signal: AbortSignal.timeout(12000),
          body: JSON.stringify({
            models: [
              'inclusionai/ling-3.0-flash-sante:free',
              'liquid/lfm-2.5-2.6b:free',
              'poolside/laguna-s-2.1:free'
            ],
            max_tokens: 600,
            include_reasoning: false,
            messages: [
              {
                role: 'system',
                content: `You are the AI assistant on ${name}'s portfolio website. Answer questions professionally and accurately about ${name}'s background, skills, and projects based on his resume below. Keep answers concise (under 4 sentences or bullet points). If a question is unrelated to Clarence, politely decline and redirect them to his work. If you do not know something, suggest emailing ${email}.

Resume Details:
- Name: ${name} (${title})
- About: ${about}
- Skills:\n${skillCategories}
- Projects:\n${projectSummaries}
- Experience:\n${experienceSummaries}
- Contact Email: ${email}`
              },
              ...recentHistory,
              { role: 'user', content: userMessage }
            ]
          })
        })

        if (response.ok) {
          const data = await response.json()
          const msg = data.choices?.[0]?.message
          const answer = (msg?.content || msg?.reasoning || '').trim()
          if (answer) return answer
        }
      }

      // Production: secure serverless proxy (API key never exposed to client)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_message: userMessage,
          history: recentHistory 
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.response?.trim()) return data.response
      } else if (response.status === 429) {
        return "You're sending messages too fast. Please wait a moment and try again! ⏳"
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('AI chat error:', err)
      }
    }

    return chatSettings.fallbackResponse
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    const trimmed = inputMessage.trim()
    if (!trimmed) return

    // Client-side rate limit check
    if (isClientRateLimited()) {
      return
    }

    try {
      await sendMessage(trimmed, 'user')
      setInputMessage('')
      setIsTyping(true)
      const botResponse = await generateAIResponse(trimmed)
      await sendMessage(botResponse, 'bot')
      setIsTyping(false)
    } catch {
      setIsTyping(false)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!isOpen) return null

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col shadow-lg rounded-none">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 overflow-hidden border border-slate-205 dark:border-slate-800 rounded-none">
            <img 
              src={clarenceImage} 
              alt="Clarence Sadiaza" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-xs uppercase text-slate-800 dark:text-slate-200 tracking-wider">{chatSettings.buttonText}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 bg-emerald-500"></div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Online</p>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 p-1 border border-slate-200 dark:border-slate-800 rounded-none transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50 dark:bg-slate-950/20">
        {messages.length === 0 && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-350 font-medium rounded-none">
              Hello! 👋 I'm Clarence's AI assistant. Ask me anything about his projects, skills, or experiences!
            </div>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 border text-xs font-semibold rounded-none ${
                message.sender === 'user'
                  ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-705 text-slate-800 dark:text-slate-200'
              }`}
            >
              {message.message || message.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white dark:bg-slate-800 px-3 py-2 border border-slate-200 dark:border-slate-705 rounded-none">
              <div className="flex space-x-1 py-1">
                <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <form onSubmit={handleSendMessage} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={chatSettings.placeholder}
              maxLength={500}
              className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 text-xs placeholder-slate-400 text-slate-800 dark:text-slate-100 font-medium rounded-none"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-10 h-10 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-900 dark:border-slate-100 hover:bg-slate-805 dark:hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold transition-colors rounded-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            <span>Ask about his work or skills!</span>
            <span className={`border px-2 py-0.5 rounded-none ${
              inputMessage.length > 450
                ? 'border-amber-400 bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                : 'border-slate-200 dark:border-slate-850 bg-slate-100 dark:bg-slate-900'
            }`}>{inputMessage.length}/500</span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Chat
