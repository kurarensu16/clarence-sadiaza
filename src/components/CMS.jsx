import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { usePortfolioContent } from '../hooks/usePortfolioContent'

const CMS = () => {
  const { content, loading, error, updateContent } = usePortfolioContent()
  const { user, logout, loading: authLoading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')
  const [isLoading, setIsLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const navigate = useNavigate()

  // Use content from database (will be null initially, then auto-created with defaults)
  const currentContent = content

  // Check if user is authenticated (ProtectedRoute handles this, but double-check)
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateContent(currentContent)
      setSaveMessage('Content saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage('Error saving content. Please try again.')
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateContentField = (section, field, value) => {
    const updatedContent = {
      ...currentContent,
      [section]: {
        ...currentContent[section],
        [field]: value
      }
    }
    updateContent(updatedContent)
  }

  const updateArrayContent = (section, index, field, value) => {
    const updatedContent = {
      ...currentContent,
      [section]: currentContent[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }
    updateContent(updatedContent)
  }

  const addArrayItem = (section, newItem) => {
    const updatedContent = {
      ...currentContent,
      [section]: [...currentContent[section], newItem]
    }
    updateContent(updatedContent)
  }

  const removeArrayItem = (section, index) => {
    const updatedContent = {
      ...currentContent,
      [section]: currentContent[section].filter((_, i) => i !== index)
    }
    updateContent(updatedContent)
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
  ]

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading content...</p>
          </div>
        </div>
      )
    }

    if (!currentContent) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No content found. Initializing with default content...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto"></div>
          </div>
        </div>
      )
    }

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
                  value={currentContent.hero?.name || ''}
                  onChange={(e) => updateContentField('hero', 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={currentContent.hero?.location || ''}
                  onChange={(e) => updateContentField('hero', 'location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={currentContent.hero?.title || ''}
                  onChange={(e) => updateContentField('hero', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={currentContent.hero?.email || ''}
                  onChange={(e) => updateContentField('hero', 'email', e.target.value)}
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
              {currentContent.about?.paragraphs?.map((paragraph, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium mb-2">Paragraph {index + 1}</label>
                  <textarea
                    value={paragraph}
                    onChange={(e) => {
                      const newParagraphs = [...(currentContent.about?.paragraphs || [])]
                      newParagraphs[index] = e.target.value
                      updateContent({
                        ...currentContent,
                        about: { ...currentContent.about, paragraphs: newParagraphs }
                      })
                    }}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  updateContent({
                    ...currentContent,
                    about: {
                      ...currentContent.about,
                      paragraphs: [...(currentContent.about?.paragraphs || []), '']
                    }
                  })
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
              {currentContent.experience?.map((exp, index) => (
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
                  {currentContent.skills?.frontend?.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...(currentContent.skills?.frontend || [])]
                          newSkills[index] = e.target.value
                          updateContent({
                            ...currentContent,
                            skills: { ...currentContent.skills, frontend: newSkills }
                          })
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                      />
                      <button
                        onClick={() => {
                          const newSkills = (currentContent.skills?.frontend || []).filter((_, i) => i !== index)
                          updateContent({
                            ...currentContent,
                            skills: { ...currentContent.skills, frontend: newSkills }
                          })
                        }}
                        className="px-3 py-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      updateContent({
                        ...currentContent,
                        skills: {
                          ...currentContent.skills,
                          frontend: [...(currentContent.skills?.frontend || []), '']
                        }
                      })
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
                  {currentContent.skills?.backend?.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...(currentContent.skills?.backend || [])]
                          newSkills[index] = e.target.value
                          updateContent({
                            ...currentContent,
                            skills: { ...currentContent.skills, backend: newSkills }
                          })
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                      />
                      <button
                        onClick={() => {
                          const newSkills = (currentContent.skills?.backend || []).filter((_, i) => i !== index)
                          updateContent({
                            ...currentContent,
                            skills: { ...currentContent.skills, backend: newSkills }
                          })
                        }}
                        className="px-3 py-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      updateContent({
                        ...currentContent,
                        skills: {
                          ...currentContent.skills,
                          backend: [...(currentContent.skills?.backend || []), '']
                        }
                      })
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
              {currentContent.projects?.map((project, index) => (
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
                  value={currentContent.contact?.email || ''}
                  onChange={(e) => updateContentField('contact', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={currentContent.contact?.location || ''}
                  onChange={(e) => updateContentField('contact', 'location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Availability</label>
                <input
                  type="text"
                  value={currentContent.contact?.availability || ''}
                  onChange={(e) => updateContentField('contact', 'availability', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={currentContent.contact?.social?.github || ''}
                  onChange={(e) => updateContentField('contact', 'social', { ...currentContent.contact?.social, github: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  value={currentContent.contact?.social?.linkedin || ''}
                  onChange={(e) => updateContentField('contact', 'social', { ...currentContent.contact?.social, linkedin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Facebook URL</label>
                <input
                  type="url"
                  value={currentContent.contact?.social?.facebook || ''}
                  onChange={(e) => updateContentField('contact', 'social', { ...currentContent.contact?.social, facebook: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        )

      case 'chat':
        const autoResponses = currentContent.chat?.autoResponses || []
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Chat Bot Management</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Configure automated responses for your portfolio chat bot
                </p>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <input
                  type="checkbox"
                  id="chatEnabled"
                  checked={currentContent.chat?.enabled || false}
                  onChange={(e) => updateContentField('chat', 'enabled', e.target.checked)}
                  className="w-4 h-4 text-black dark:text-white bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-black dark:focus:ring-white"
                />
                <label htmlFor="chatEnabled" className="text-sm font-medium cursor-pointer">
                  {currentContent.chat?.enabled ? 'Chat Enabled' : 'Chat Disabled'}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Settings */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Basic Settings
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Button Text</label>
                      <input
                        type="text"
                        value={currentContent.chat?.buttonText || ''}
                        onChange={(e) => updateContentField('chat', 'buttonText', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white text-sm"
                        placeholder="Chat with Clarence"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Input Placeholder</label>
                      <input
                        type="text"
                        value={currentContent.chat?.placeholder || ''}
                        onChange={(e) => updateContentField('chat', 'placeholder', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white text-sm"
                        placeholder="Type a message..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Fallback Response</label>
                      <textarea
                        value={currentContent.chat?.fallbackResponse || ''}
                        onChange={(e) => updateContentField('chat', 'fallbackResponse', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white text-sm"
                        placeholder="Default response when no specific trigger matches"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        This response is used when visitor messages don't match any trigger words
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Auto Responses */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Auto Responses
                      <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-xs rounded-full">
                        {autoResponses.length}
                      </span>
                    </h4>
                    <button
                      onClick={() => {
                        const currentResponses = currentContent.chat?.autoResponses || []
                        const newResponses = [...currentResponses, { trigger: [''], response: '' }]
                        updateContent({
                          ...currentContent,
                          chat: { ...currentContent.chat, autoResponses: newResponses }
                        })
                      }}
                      className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center gap-1.5 text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Response
                    </button>
                  </div>
                  
                  {autoResponses.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No auto responses configured</p>
                      <button
                        onClick={() => {
                          const currentResponses = currentContent.chat?.autoResponses || []
                          const newResponses = [...currentResponses, { trigger: [''], response: '' }]
                          updateContent({
                            ...currentContent,
                            chat: { ...currentContent.chat, autoResponses: newResponses }
                          })
                        }}
                        className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 text-sm font-medium"
                      >
                        Add Your First Response
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                      {autoResponses.map((response, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
                                #{index + 1}
                              </span>
                              <h4 className="font-medium text-sm">Auto Response</h4>
                            </div>
                            <button
                              onClick={() => {
                                const currentResponses = currentContent.chat?.autoResponses || []
                                const newResponses = currentResponses.filter((_, i) => i !== index)
                                setContent(prev => ({
                                  ...prev,
                                  chat: { ...prev.chat, autoResponses: newResponses }
                                }))
                              }}
                              className="text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1 text-sm transition-colors"
                              title="Remove response"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="flex items-center gap-1 text-sm font-medium mb-1.5">
                                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                Trigger Words
                              </label>
                              <input
                                type="text"
                                value={(response.trigger || []).join(', ')}
                                onChange={(e) => {
                                  const currentResponses = currentContent.chat?.autoResponses || []
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
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Separate multiple triggers with commas
                              </p>
                            </div>
                            
                            <div>
                              <label className="flex items-center gap-1 text-sm font-medium mb-1.5">
                                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                Bot Response
                              </label>
                              <textarea
                                value={response.response || ''}
                                onChange={(e) => {
                                  const currentResponses = currentContent.chat?.autoResponses || []
                                  const newResponses = [...currentResponses]
                                  newResponses[index].response = e.target.value
                                  setContent(prev => ({
                                    ...prev,
                                    chat: { ...prev.chat, autoResponses: newResponses }
                                  }))
                                }}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-gray-800 dark:text-white text-sm resize-none"
                                placeholder="Enter the bot's response message..."
                              />
                            </div>
                            
                            {/* Preview */}
                            {(response.trigger && response.trigger.length > 0 && response.trigger[0]) || response.response ? (
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                                <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                                  <div className="text-xs font-medium text-green-800 dark:text-green-300 mb-1">Bot</div>
                                  <div className="text-sm text-green-900 dark:text-green-200">
                                    {response.response || 'Response preview will appear here...'}
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
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
                    <span className="font-medium truncate">
                      {tab.name}
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
