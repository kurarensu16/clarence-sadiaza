import { useState, useEffect, useRef } from 'react'
import clarenceImage from '../assets/clarence.jpg'
import { useChatMessages } from '../hooks/useChatMessages'
import { usePortfolioContent } from '../hooks/usePortfolioContent'
import { supabase } from '../lib/supabase'

const defaultChatSettings = {
  enabled: true,
  buttonText: "Chat with Clarence",
  placeholder: "Type a message...",
  autoResponses: [],
  fallbackResponse: "That's interesting! I'm always eager to learn and discuss new topics."
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

      if (isDev && devApiKey) {
        // Direct query in local development to avoid proxy configurations in dev mode
        const name = content?.hero?.name || 'Clarence Timothy Sadiaza'
        const title = content?.hero?.title || 'Software Engineer'
        const about = (content?.about?.paragraphs || []).join(' ')
        const skills = JSON.stringify(content?.skills || {})
        const experience = JSON.stringify(content?.experience || [])
        const projects = JSON.stringify(content?.projects || [])
        const certifications = JSON.stringify(content?.certifications || [])
        const email = content?.hero?.email || 'sadiazaclarence@gmail.com'

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${devApiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "Clarence Sadiaza Portfolio (Local Dev)"
          },
          body: JSON.stringify({
            model: "poolside/laguna-m.1:free",
            messages: [
              {
                role: "system",
                content: `You are the AI Assistant chatbot on Clarence Timothy Sadiaza's portfolio website. 
Answer questions briefly and professionally on behalf of Clarence. Keep responses under 3 sentences. If you don't know something or if it's not in the resume, say you will check and let him know, or tell them to email him at ${email}.
Resume Details:
- Name: ${name}
- Title: ${title}
- About: ${about}
- Technologies / Skills: ${skills}
- Experience: ${experience}
- Projects: ${projects}
- Certifications: ${certifications}
- Contact Email: ${email}`
              },
              { role: "user", content: userMessage }
            ]
          })
        })

        if (response.ok) {
          const data = await response.json()
          return data.choices?.[0]?.message?.content || chatSettings.fallbackResponse
        }
      }

      // Default: Call the secure serverless API proxy (Vercel)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_message: userMessage })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.response && data.response.trim()) {
          return data.response
        }
      }
    } catch (error) {
      console.warn('AI chat completion failed:', error)
    }
    
    return chatSettings.fallbackResponse || "I'm sorry, I'm currently having trouble connecting to my AI backend. Please try again in a few moments, or feel free to email Clarence directly!"
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    try {
      // Send user message
      await sendMessage(inputMessage, 'user')
      setInputMessage('')
      setIsTyping(true)

      // Generate bot response via OpenRouter
      const botResponse = await generateAIResponse(inputMessage)
      
      // Send bot response
      await sendMessage(botResponse, 'bot')
      setIsTyping(false)
    } catch (error) {
      console.error('Error sending message:', error)
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
              maxLength={1000}
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
            <span>Ask me about work or skills!</span>
            <span className="border border-slate-200 dark:border-slate-850 px-2 py-0.5 rounded-none bg-slate-100 dark:bg-slate-900">{inputMessage.length}/1000</span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Chat
