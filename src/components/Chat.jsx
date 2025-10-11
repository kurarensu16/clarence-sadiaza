import { useState, useEffect, useRef } from 'react'
import clarenceImage from '../assets/clarence.jpg'

const Chat = ({ isOpen, onClose }) => {
  const [chatSettings, setChatSettings] = useState({
    enabled: true,
    buttonText: "Chat with Clarence",
    placeholder: "Type a message...",
    autoResponses: [],
    fallbackResponse: "That's interesting! I'm always eager to learn and discuss new topics."
  })

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 I'm Clarence's AI assistant. Ask me anything about his projects, skills, or experiences!",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const savedContent = localStorage.getItem('portfolioContent')
    if (savedContent) {
      const parsedContent = JSON.parse(savedContent)
      if (parsedContent.chat) {
        setChatSettings(parsedContent.chat)
      }
    }

    // Load existing messages from localStorage
    const existingMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]')
    const portfolioMessages = existingMessages.filter(msg => msg.conversationId === 'portfolio-chat')
    
    if (portfolioMessages.length > 0) {
      setMessages(portfolioMessages)
    }
  }, [])

  // Check for new messages from CMS
  useEffect(() => {
    const checkForNewMessages = () => {
      const allMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]')
      const portfolioMessages = allMessages.filter(msg => msg.conversationId === 'portfolio-chat')
      
      // Check if there are new messages that aren't in our current state
      const currentMessageIds = messages.map(msg => msg.id)
      const newMessages = portfolioMessages.filter(msg => !currentMessageIds.includes(msg.id))
      
      if (newMessages.length > 0) {
        setMessages(prev => [...prev, ...newMessages])
      }
    }

    // Check for new messages every 2 seconds
    const interval = setInterval(checkForNewMessages, 2000)
    
    return () => clearInterval(interval)
  }, [messages])

  const findBestResponse = (userMessage) => {
    const message = userMessage.toLowerCase()
    
    // Default responses if no CMS responses are configured
    const defaultResponses = [
      { triggers: ['hello', 'hi', 'hey'], response: "Hello! 👋 Thanks for visiting my portfolio. How can I help you today?" },
      { triggers: ['about', 'who are you', 'tell me about yourself'], response: "I'm Clarence Sadiaza, an Information Technology student passionate about full-stack development. I love creating clean, intuitive digital experiences with modern technologies like React, Node.js, and cloud platforms." },
      { triggers: ['projects', 'work', 'portfolio'], response: "I've worked on several projects including an E-Commerce Platform, Task Management App, Weather Dashboard, and this Portfolio Website. You can click on any project card to view the source code on GitHub!" },
      { triggers: ['skills', 'technologies', 'tech stack'], response: "My tech stack includes React, JavaScript, TypeScript, Node.js, MongoDB, PostgreSQL, AWS, and many more. I'm always learning new technologies to stay current with industry trends." },
      { triggers: ['contact', 'email', 'reach out'], response: "You can reach me at sadiazaclarence@gmail.com or connect with me on LinkedIn and GitHub. I'm always interested in new opportunities and exciting projects!" },
      { triggers: ['experience', 'background', 'education'], response: "I'm currently pursuing my Bachelor's in Information Technology at Dr. Yanga's Colleges. I've been self-teaching web development since 2022 and have built various personal projects to practice my skills." }
    ]
    
    // Check CMS auto-responses first
    if (chatSettings.autoResponses && chatSettings.autoResponses.length > 0) {
      for (const response of chatSettings.autoResponses) {
        if (response.trigger && response.trigger.length > 0) {
          for (const trigger of response.trigger) {
            if (trigger && message.includes(trigger.toLowerCase())) {
              return response.response
            }
          }
        }
      }
    }
    
    // Check default responses
    for (const response of defaultResponses) {
      for (const trigger of response.triggers) {
        if (message.includes(trigger)) {
          return response.response
        }
      }
    }
    
    // Return fallback response
    return chatSettings.fallbackResponse || "That's interesting! I'm always eager to learn and discuss new topics. Feel free to ask me about my projects, skills, or experiences in tech!"
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
      conversationId: 'portfolio-chat'
    }

    // Save message to localStorage for CMS to see
    const existingMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]')
    const updatedMessages = [...existingMessages, userMessage]
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages))

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate thinking time and generate intelligent response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: findBestResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
        status: 'sent',
        conversationId: 'portfolio-chat'
      }
      
      // Save bot response to localStorage
      const botMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]')
      const updatedBotMessages = [...botMessages, botResponse]
      localStorage.setItem('chatMessages', JSON.stringify(updatedBotMessages))
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds for realism
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img 
              src={clarenceImage} 
              alt="Clarence Sadiaza" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200">{chatSettings.buttonText}</h3>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                message.sender === 'user'
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={chatSettings.placeholder}
              maxLength={1000}
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm placeholder-gray-500 dark:placeholder-gray-400 dark:text-white"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span>Ask me about programming, web dev, or tech!</span>
            <span>{inputMessage.length}/1000</span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Chat
