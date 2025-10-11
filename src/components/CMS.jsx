import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Messages Interface Component
const MessagesInterface = () => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedConversation, setSelectedConversation] = useState('portfolio-chat')

  useEffect(() => {
    const loadMessages = () => {
      const allMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]')
      setMessages(allMessages)
    }

    loadMessages()
    
    // Check for new messages every 2 seconds
    const interval = setInterval(loadMessages, 2000)
    
    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const adminMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'admin',
      timestamp: new Date(),
      status: 'sent',
      conversationId: selectedConversation
    }

    const existingMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]')
    const updatedMessages = [...existingMessages, adminMessage]
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages))

    setMessages(updatedMessages)
    setNewMessage('')
  }

  const portfolioMessages = messages.filter(msg => msg.conversationId === 'portfolio-chat')
  const unreadCount = portfolioMessages.filter(msg => msg.sender === 'user' && msg.status !== 'read').length

  return (
    <div className="space-y-4">
      {/* Conversation Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div>
          <h4 className="font-semibold">Portfolio Chat</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {portfolioMessages.length} messages
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Online</span>
        </div>
      </div>

      {/* Messages Display */}
      <div className="h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4 space-y-3">
        {portfolioMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                message.sender === 'admin'
                  ? 'bg-blue-500 text-white'
                  : message.sender === 'user'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              }`}
            >
              <div className="font-medium text-xs mb-1">
                {message.sender === 'admin' ? 'You' : message.sender === 'user' ? 'Visitor' : 'Bot'}
              </div>
              {message.text}
              <div className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {portfolioMessages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No messages yet. Start a conversation!
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your response..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  )
}

const CMS = () => {
  const [activeTab, setActiveTab] = useState('hero')
  const [isLoading, setIsLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const navigate = useNavigate()

  // Portfolio content state
  const [content, setContent] = useState({
    hero: {
      name: 'Clarence Sadiaza',
      location: 'Bulacan, Central Luzon, Philippines',
      title: 'Information Technology Student | Aspiring Full-Stack Developer',
      email: 'sadiazaclarence@gmail.com'
    },
    about: {
      paragraphs: [
        "I'm an Information Technology student with a passion for creating clean, intuitive digital experiences. Currently pursuing my degree while building personal projects and learning modern web development technologies.",
        "My focus is on full-stack development with modern technologies like React, Node.js, and cloud platforms. I enjoy turning ideas into functional applications and continuously learning new technologies to stay current with industry trends.",
        "Beyond academics, I'm passionate about contributing to open-source projects and building a strong foundation in software engineering principles. I'm always eager to learn and grow in the tech community."
      ]
    },
    experience: [
      {
        year: '2023-present',
        title: 'Information Technology Student',
        company: 'Dr. Yanga\'s Colleges',
        description: 'Currently pursuing Bachelor of Science in Information Technology with focus on software development, database management, and IT systems. Maintaining high academic performance while building personal projects.'
      },
      {
        year: '2022-2023',
        title: 'Self-Taught Developer',
        company: 'Online Learning',
        description: 'Completed multiple online courses in web development including React, Node.js, and modern JavaScript. Built various personal projects to practice and showcase skills.'
      },
      {
        year: '2022',
        title: 'High School Graduate',
        company: 'Japan–Philippines Institute of Technology',
        description: 'Graduated in Technical-Vocational Track(ICT), and developed interest in programming through basic web development projects.'
      }
    ],
    skills: {
      frontend: ['JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'HTML5', 'CSS3', 'Sass', 'Webpack', 'Vite'],
      backend: ['Node.js', 'Express', 'Python', 'MySQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Supabase']
    },
    projects: [
      {
        id: 1,
        title: "E-Commerce Platform",
        description: "A fully responsive e-commerce website with product filtering, cart functionality, and secure checkout process.",
        tags: ["React", "Node.js", "MongoDB", "PayMongo"],
        year: "2024",
        url: "https://github.com/kurarensu16/ecommerce-platform"
      },
      {
        id: 2,
        title: "Task Management App",
        description: "A productivity application for managing tasks with drag-and-drop functionality and real-time collaboration.",
        tags: ["React", "Firebase", "Material UI", "Redux"],
        year: "2023",
        url: "https://github.com/kurarensu16/task-management-app"
      },
      {
        id: 3,
        title: "Weather Dashboard",
        description: "Real-time weather application with 5-day forecast, location search, and interactive maps integration.",
        tags: ["JavaScript", "REST API", "CSS3", "Leaflet"],
        year: "2023",
        url: "https://github.com/kurarensu16/weather-dashboard"
      },
      {
        id: 4,
        title: "Portfolio Website",
        description: "A minimalist portfolio website showcasing projects and skills with smooth animations and responsive design.",
        tags: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
        year: "2024",
        url: "https://github.com/kurarensu16/portfolio-website"
      }
    ],
    contact: {
      email: 'sadiazaclarence@gmail.com',
      location: 'Bulacan, Central Luzon, Philippines',
      availability: 'Available for freelance work',
      social: {
        github: 'https://github.com/kurarensu16',
        linkedin: 'https://www.linkedin.com/in/clarence-sadiaza-16770b387/',
        facebook: 'https://www.facebook.com/profile.php?id=61580149517159'
      }
    },
    chat: {
      enabled: true,
      buttonText: "Chat with Clarence",
      placeholder: "Type a message...",
      autoResponses: [
        {
          trigger: ["hello", "hi", "hey"],
          response: "Hello! 👋 Thanks for visiting my portfolio. How can I help you today?"
        },
        {
          trigger: ["about", "who are you", "tell me about yourself"],
          response: "I'm Clarence Sadiaza, an Information Technology student passionate about full-stack development. I love creating clean, intuitive digital experiences with modern technologies like React, Node.js, and cloud platforms."
        },
        {
          trigger: ["projects", "work", "portfolio"],
          response: "I've worked on several projects including an E-Commerce Platform, Task Management App, Weather Dashboard, and this Portfolio Website. You can click on any project card to view the source code on GitHub!"
        },
        {
          trigger: ["skills", "technologies", "tech stack"],
          response: "My tech stack includes React, JavaScript, TypeScript, Node.js, MongoDB, PostgreSQL, AWS, and many more. I'm always learning new technologies to stay current with industry trends."
        },
        {
          trigger: ["contact", "email", "reach out"],
          response: "You can reach me at sadiazaclarence@gmail.com or connect with me on LinkedIn and GitHub. I'm always interested in new opportunities and exciting projects!"
        },
        {
          trigger: ["experience", "background", "education"],
          response: "I'm currently pursuing my Bachelor's in Information Technology at Dr. Yanga's Colleges. I've been self-teaching web development since 2022 and have built various personal projects to practice my skills."
        }
      ],
      fallbackResponse: "That's interesting! I'm always eager to learn and discuss new topics. Feel free to ask me about my projects, skills, or experiences in tech. You can also check out my GitHub repositories for more details!"
    }
  })

  // Load content from localStorage on component mount
  useEffect(() => {
    const savedContent = localStorage.getItem('portfolioContent')
    if (savedContent) {
      setContent(JSON.parse(savedContent))
    }
  }, [])

  // Check for unread messages
  useEffect(() => {
    const checkUnreadMessages = () => {
      const allMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]')
      const portfolioMessages = allMessages.filter(msg => msg.conversationId === 'portfolio-chat')
      const unreadCount = portfolioMessages.filter(msg => msg.sender === 'user' && msg.status !== 'read').length
      setUnreadMessages(unreadCount)
    }

    checkUnreadMessages()
    
    // Check every 2 seconds
    const interval = setInterval(checkUnreadMessages, 2000)
    
    return () => clearInterval(interval)
  }, [])

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    navigate('/')
  }

  const handleSave = () => {
    setIsLoading(true)
    // Simulate save operation
    setTimeout(() => {
      localStorage.setItem('portfolioContent', JSON.stringify(content))
      setSaveMessage('Content saved successfully!')
      setIsLoading(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }, 1000)
  }

  const updateContent = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const updateArrayContent = (section, index, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const addArrayItem = (section, newItem) => {
    setContent(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }))
  }

  const removeArrayItem = (section, index) => {
    setContent(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }))
  }

  const tabs = [
    { 
      id: 'hero', 
      name: 'Hero Section', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 'about', 
      name: 'About', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: 'experience', 
      name: 'Experience', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      )
    },
    { 
      id: 'skills', 
      name: 'Skills', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      id: 'projects', 
      name: 'Projects', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    { 
      id: 'contact', 
      name: 'Contact', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'chat', 
      name: 'Chat Settings', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    { 
      id: 'messages', 
      name: 'Messages', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'hero':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Hero Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={content.hero.name}
                  onChange={(e) => updateContent('hero', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={content.hero.location}
                  onChange={(e) => updateContent('hero', 'location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) => updateContent('hero', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={content.hero.email}
                  onChange={(e) => updateContent('hero', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        )

      case 'about':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">About Section</h3>
            <div className="space-y-4">
              {content.about.paragraphs.map((paragraph, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium mb-2">Paragraph {index + 1}</label>
                  <textarea
                    value={paragraph}
                    onChange={(e) => {
                      const newParagraphs = [...content.about.paragraphs]
                      newParagraphs[index] = e.target.value
                      setContent(prev => ({
                        ...prev,
                        about: { ...prev.about, paragraphs: newParagraphs }
                      }))
                    }}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  setContent(prev => ({
                    ...prev,
                    about: {
                      ...prev.about,
                      paragraphs: [...prev.about.paragraphs, '']
                    }
                  }))
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Paragraph
              </button>
            </div>
          </div>
        )

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Experience</h3>
              <button
                onClick={() => addArrayItem('experience', {
                  year: '',
                  title: '',
                  company: '',
                  description: ''
                })}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Experience
              </button>
            </div>
            <div className="space-y-6">
              {content.experience.map((exp, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Experience {index + 1}</h4>
                    <button
                      onClick={() => removeArrayItem('experience', index)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Year</label>
                      <input
                        type="text"
                        value={exp.year}
                        onChange={(e) => updateArrayContent('experience', index, 'year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateArrayContent('experience', index, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateArrayContent('experience', index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateArrayContent('experience', index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'skills':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Skills & Technologies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Frontend Technologies</h4>
                <div className="space-y-2">
                  {content.skills.frontend.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...content.skills.frontend]
                          newSkills[index] = e.target.value
                          setContent(prev => ({
                            ...prev,
                            skills: { ...prev.skills, frontend: newSkills }
                          }))
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                      />
                      <button
                        onClick={() => {
                          const newSkills = content.skills.frontend.filter((_, i) => i !== index)
                          setContent(prev => ({
                            ...prev,
                            skills: { ...prev.skills, frontend: newSkills }
                          }))
                        }}
                        className="px-3 py-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setContent(prev => ({
                        ...prev,
                        skills: {
                          ...prev.skills,
                          frontend: [...prev.skills.frontend, '']
                        }
                      }))
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Frontend Skill
                  </button>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Backend Technologies</h4>
                <div className="space-y-2">
                  {content.skills.backend.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...content.skills.backend]
                          newSkills[index] = e.target.value
                          setContent(prev => ({
                            ...prev,
                            skills: { ...prev.skills, backend: newSkills }
                          }))
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                      />
                      <button
                        onClick={() => {
                          const newSkills = content.skills.backend.filter((_, i) => i !== index)
                          setContent(prev => ({
                            ...prev,
                            skills: { ...prev.skills, backend: newSkills }
                          }))
                        }}
                        className="px-3 py-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setContent(prev => ({
                        ...prev,
                        skills: {
                          ...prev.skills,
                          backend: [...prev.skills.backend, '']
                        }
                      }))
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Backend Skill
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Projects</h3>
              <button
                onClick={() => addArrayItem('projects', {
                  id: Date.now(),
                  title: '',
                  description: '',
                  tags: [],
                  year: '',
                  url: ''
                })}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Project
              </button>
            </div>
            <div className="space-y-6">
              {content.projects.map((project, index) => (
                <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Project {index + 1}</h4>
                    <button
                      onClick={() => removeArrayItem('projects', index)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => updateArrayContent('projects', index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Year</label>
                      <input
                        type="text"
                        value={project.year}
                        onChange={(e) => updateArrayContent('projects', index, 'year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={project.description}
                        onChange={(e) => updateArrayContent('projects', index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={project.tags.join(', ')}
                        onChange={(e) => updateArrayContent('projects', index, 'tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Project URL</label>
                      <input
                        type="url"
                        value={project.url || ''}
                        onChange={(e) => updateArrayContent('projects', index, 'url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                        placeholder="https://github.com/username/project-name"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={content.contact.email}
                  onChange={(e) => updateContent('contact', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={content.contact.location}
                  onChange={(e) => updateContent('contact', 'location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Availability</label>
                <input
                  type="text"
                  value={content.contact.availability}
                  onChange={(e) => updateContent('contact', 'availability', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={content.contact.social.github}
                  onChange={(e) => updateContent('contact', 'social', { ...content.contact.social, github: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  value={content.contact.social.linkedin}
                  onChange={(e) => updateContent('contact', 'social', { ...content.contact.social, linkedin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Facebook URL</label>
                <input
                  type="url"
                  value={content.contact.social.facebook}
                  onChange={(e) => updateContent('contact', 'social', { ...content.contact.social, facebook: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        )

      case 'chat':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Chat Bot Management</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="chatEnabled"
                  checked={content.chat?.enabled || false}
                  onChange={(e) => updateContent('chat', 'enabled', e.target.checked)}
                  className="w-4 h-4 text-black dark:text-white bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-black dark:focus:ring-white"
                />
                <label htmlFor="chatEnabled" className="text-sm font-medium">
                  Enable Chat Bot
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Button Text</label>
                <input
                  type="text"
                  value={content.chat?.buttonText || ''}
                  onChange={(e) => updateContent('chat', 'buttonText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                  placeholder="Text displayed on the chat button"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Input Placeholder</label>
                <input
                  type="text"
                  value={content.chat?.placeholder || ''}
                  onChange={(e) => updateContent('chat', 'placeholder', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                  placeholder="Placeholder text for the message input field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Fallback Response</label>
                <textarea
                  value={content.chat?.fallbackResponse || ''}
                  onChange={(e) => updateContent('chat', 'fallbackResponse', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                  placeholder="Default response when no specific trigger matches"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium">Auto Responses</label>
                  <button
                    onClick={() => {
                      const currentResponses = content.chat?.autoResponses || []
                      const newResponses = [...currentResponses, { trigger: [''], response: '' }]
                      setContent(prev => ({
                        ...prev,
                        chat: { ...prev.chat, autoResponses: newResponses }
                      }))
                    }}
                    className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center gap-1 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Response
                  </button>
                </div>
                
                <div className="space-y-4">
                  {(content.chat?.autoResponses || []).map((response, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-sm">Response {index + 1}</h4>
                        <button
                          onClick={() => {
                            const currentResponses = content.chat?.autoResponses || []
                            const newResponses = currentResponses.filter((_, i) => i !== index)
                            setContent(prev => ({
                              ...prev,
                              chat: { ...prev.chat, autoResponses: newResponses }
                            }))
                          }}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Trigger Words (comma-separated)</label>
                          <input
                            type="text"
                            value={(response.trigger || []).join(', ')}
                            onChange={(e) => {
                              const currentResponses = content.chat?.autoResponses || []
                              const newResponses = [...currentResponses]
                              newResponses[index].trigger = e.target.value.split(',').map(t => t.trim()).filter(t => t)
                              setContent(prev => ({
                                ...prev,
                                chat: { ...prev.chat, autoResponses: newResponses }
                              }))
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white text-sm"
                            placeholder="hello, hi, hey"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Response</label>
                          <textarea
                            value={response.response || ''}
                            onChange={(e) => {
                              const currentResponses = content.chat?.autoResponses || []
                              const newResponses = [...currentResponses]
                              newResponses[index].response = e.target.value
                              setContent(prev => ({
                                ...prev,
                                chat: { ...prev.chat, autoResponses: newResponses }
                              }))
                            }}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white text-sm"
                            placeholder="Bot response message"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'messages':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Messages</h3>
            <MessagesInterface />
          </div>
        )

      default:
        return <div>Select a section to edit</div>
    }
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="h-16 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Portfolio CMS</h1>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Save Message */}
      {saveMessage && (
        <div className="bg-green-100 dark:bg-green-900 border-l-4 border-green-500 p-3 flex-shrink-0">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-green-700 dark:text-green-200">{saveMessage}</p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 transition-all duration-300`}>
          <nav className={`${sidebarCollapsed ? 'p-2' : 'p-4'} space-y-2 h-full overflow-y-auto`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left rounded-lg transition-colors ${
                  sidebarCollapsed ? 'justify-center' : ''
                } ${
                  activeTab === tab.id
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={sidebarCollapsed ? tab.name : ''}
              >
                <span className="flex-shrink-0">{tab.icon}</span>
                  {!sidebarCollapsed && (
                    <span className="font-medium truncate flex items-center gap-2">
                      {tab.name}
                      {tab.id === 'messages' && unreadMessages > 0 && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                          {unreadMessages}
                        </span>
                      )}
                    </span>
                  )}
                  {sidebarCollapsed && tab.id === 'messages' && unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {unreadMessages}
                    </span>
                  )}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="h-full p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 h-full">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CMS
