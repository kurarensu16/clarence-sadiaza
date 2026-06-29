import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { usePortfolioContent } from '../hooks/usePortfolioContent'
import { supabase } from '../lib/supabase'

const CMS = () => {
  const { content, loading, error, updateContent } = usePortfolioContent()
  const { user, logout, loading: authLoading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [pageViews, setPageViews] = useState([])
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [uploadingImageIndex, setUploadingImageIndex] = useState(null)
  const [hasApiKey, setHasApiKey] = useState(false)
  const [openRouterKeyInput, setOpenRouterKeyInput] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const { data, error } = await supabase.rpc('has_openrouter_api_key')
        if (!error && data) {
          setHasApiKey(true)
          setOpenRouterKeyInput('••••••••••••')
        }
      } catch (err) {
        console.warn('Could not check if API key exists:', err)
      }
    }
    if (user) {
      checkApiKey()
    }
  }, [user])

  useEffect(() => {
    const fetchPageViews = async () => {
      try {
        setAnalyticsLoading(true)
        const { data, error } = await supabase
          .from('page_views')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setPageViews(data || [])
      } catch (err) {
        console.warn('Failed to load page views data:', err)
      } finally {
        setAnalyticsLoading(false)
      }
    }
    if (user && activeTab === 'dashboard') {
      fetchPageViews()
    }
  }, [user, activeTab])

  const handleImageUpload = async (file, projectIndex) => {
    if (!file) return
    setUploadingImageIndex(projectIndex)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath)

      updateArrayContent('projects', projectIndex, 'image', publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Make sure the "project-images" storage bucket exists in your Supabase project.')
    } finally {
      setUploadingImageIndex(null)
    }
  }

  const handleRemoveImage = async (projectIndex) => {
    const project = currentContent.projects[projectIndex]
    if (project.image) {
      try {
        const url = new URL(project.image)
        const pathParts = url.pathname.split('/project-images/')
        if (pathParts.length > 1) {
          await supabase.storage
            .from('project-images')
            .remove([pathParts[1]])
        }
      } catch (e) {
        console.warn('Could not delete old image from storage:', e)
      }
    }
    updateArrayContent('projects', projectIndex, 'image', '')
  }

  const [currentContent, setCurrentContent] = useState(null)

  // Sync initial content once it is loaded
  useEffect(() => {
    if (content && !currentContent) {
      const cloned = JSON.parse(JSON.stringify(content))
      if (!cloned.certifications) {
        cloned.certifications = []
      }
      if (cloned.chat && cloned.chat.openRouterApiKey) {
        delete cloned.chat.openRouterApiKey
      }
      setCurrentContent(cloned)
    }
  }, [content])

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

      // Save key securely via database RPC if it was updated
      if (openRouterKeyInput !== '••••••••••••') {
        const { error: rpcError } = await supabase.rpc('set_openrouter_api_key', { key_value: openRouterKeyInput })
        if (rpcError) throw rpcError
        
        if (openRouterKeyInput === '') {
          setHasApiKey(false)
        } else {
          setHasApiKey(true)
          setOpenRouterKeyInput('••••••••••••')
        }
      }

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
    setCurrentContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const updateArrayContent = (section, index, field, value) => {
    setCurrentContent(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const addArrayItem = (section, newItem) => {
    setCurrentContent(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem]
    }))
  }

  const removeArrayItem = (section, index) => {
    setCurrentContent(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }))
  }

  const tabs = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
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
      id: 'certifications',
      name: 'Certifications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
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
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-bold tracking-tight mb-1 uppercase">Analytics Overview</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Real-time visitor logs and geographic breakdown</p>
            </div>

            {analyticsLoading ? (
              <div className="flex items-center justify-center h-48 border border-slate-200 dark:border-slate-800 border-dashed">
                <div className="text-center font-mono">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-2"></div>
                  <p className="text-xs text-slate-500">Retrieving visitor logs...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
                    <span className="text-xs font-mono uppercase text-slate-400">Total Page Views</span>
                    <span className="text-4xl font-extrabold tracking-tight mt-2 font-mono text-black dark:text-white">{pageViews.length}</span>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
                    <span className="text-xs font-mono uppercase text-slate-400">Visits (Last 24h)</span>
                    <span className="text-4xl font-extrabold tracking-tight mt-2 font-mono text-black dark:text-white">
                      {pageViews.filter(v => new Date() - new Date(v.created_at) < 24 * 60 * 60 * 1000).length}
                    </span>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
                    <span className="text-xs font-mono uppercase text-slate-400">Unique Regions</span>
                    <span className="text-4xl font-extrabold tracking-tight mt-2 font-mono text-black dark:text-white">
                      {new Set(pageViews.map(v => [v.city, v.region].filter(Boolean).join(', ')).filter(Boolean)).size}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: Stats Lists */}
                  <div className="space-y-6">
                    {/* Pages Popularity */}
                    <div className="border border-slate-200 dark:border-slate-800 p-6">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">Popular Pages</h4>
                      <div className="space-y-3">
                        {(() => {
                          const pagePathCounts = pageViews.reduce((acc, curr) => {
                            acc[curr.page_path] = (acc[curr.page_path] || 0) + 1
                            return acc
                          }, {})
                          const sortedPages = Object.entries(pagePathCounts)
                            .map(([path, count]) => ({ path, count }))
                            .sort((a, b) => b.count - a.count)

                          if (sortedPages.length === 0) {
                            return <p className="text-xs font-mono text-slate-500">No visits tracked yet.</p>
                          }

                          return sortedPages.map(({ path, count }) => {
                            const pct = pageViews.length > 0 ? Math.round((count / pageViews.length) * 100) : 0
                            return (
                              <div key={path} className="space-y-1">
                                <div className="flex justify-between text-xs font-mono">
                                  <span className="font-semibold text-slate-800 dark:text-slate-200">{path}</span>
                                  <span className="text-slate-500">{count} views ({pct}%)</span>
                                </div>
                                <div className="h-1 bg-slate-100 dark:bg-slate-900 rounded-none overflow-hidden">
                                  <div 
                                    className="h-full bg-black dark:bg-white" 
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            )
                          })
                        })()}
                      </div>
                    </div>

                    {/* Geolocation breakdown */}
                    <div className="border border-slate-200 dark:border-slate-800 p-6">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">Visits by Location</h4>
                      <div className="max-h-60 overflow-y-auto space-y-2 pr-2 font-mono text-xs">
                        {(() => {
                          const cityCounts = pageViews.reduce((acc, curr) => {
                            const loc = [curr.city, curr.region].filter(Boolean).join(', ')
                            const key = loc || 'Unknown Location'
                            acc[key] = (acc[key] || 0) + 1
                            return acc
                          }, {})
                          const sortedLocs = Object.entries(cityCounts)
                            .map(([location, count]) => ({ location, count }))
                            .sort((a, b) => b.count - a.count)

                          if (sortedLocs.length === 0) {
                            return <p className="text-slate-500">No geographic data logged.</p>
                          }

                          return sortedLocs.slice(0, 10).map(({ location, count }) => (
                            <div key={location} className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-900 last:border-0">
                              <span className="text-slate-800 dark:text-slate-200">{location}</span>
                              <span className="font-semibold text-slate-950 dark:text-slate-50">{count} visits</span>
                            </div>
                          ))
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Visitor Feed */}
                  <div className="border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">Recent Visits Feed</h4>
                    <div className="flex-1 overflow-y-auto max-h-[480px] space-y-4 pr-2 font-mono text-xs">
                      {pageViews.slice(0, 15).map((view) => {
                        const loc = [view.city, view.region].filter(Boolean).join(', ')
                        const time = new Date(view.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        const date = new Date(view.created_at).toLocaleDateString([], { month: 'short', day: '2-digit' })
                        return (
                          <div key={view.id} className="flex items-start justify-between py-2 border-b border-slate-100 dark:border-slate-900 last:border-0">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 font-semibold uppercase text-[10px] tracking-tight text-slate-800 dark:text-slate-200">
                                  {view.page_path}
                                </span>
                                <span className="text-slate-400 text-[10px]">{date} at {time}</span>
                              </div>
                              <div className="text-slate-600 dark:text-slate-400">
                                {loc || 'Unknown Location'}
                              </div>
                            </div>
                            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tight flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                              Viewed
                            </span>
                          </div>
                        )
                      })}
                      {pageViews.length === 0 && (
                        <p className="text-slate-500 text-center py-12">No recent visits logged.</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )

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
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={currentContent.hero?.location || ''}
                  onChange={(e) => updateContentField('hero', 'location', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={currentContent.hero?.title || ''}
                  onChange={(e) => updateContentField('hero', 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={currentContent.hero?.email || ''}
                  onChange={(e) => updateContentField('hero', 'email', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
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
                      setCurrentContent(prev => ({
                        ...prev,
                        about: { ...prev.about, paragraphs: newParagraphs }
                      }))
                    }}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  setCurrentContent(prev => ({
                    ...prev,
                    about: {
                      ...prev.about,
                      paragraphs: [...(prev.about?.paragraphs || []), '']
                    }
                  }))
                }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-850 hover:bg-slate-205 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-none flex items-center gap-2 text-sm font-semibold transition-colors"
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
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-900 dark:border-slate-100 hover:bg-slate-805 dark:hover:bg-slate-200 flex items-center gap-2 rounded-none text-sm font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Experience
              </button>
            </div>
            <div className="space-y-6">
              {currentContent.experience?.map((exp, index) => (
                <div key={index} className="border border-slate-200 dark:border-slate-800 rounded-none p-5 bg-slate-50/20 dark:bg-slate-900/10">
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
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateArrayContent('experience', index, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateArrayContent('experience', index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateArrayContent('experience', index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'skills':
        const skillsObj = currentContent.skills || {}
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Skills & Technologies</h3>
              <p className="text-xs text-slate-500 mt-1">Manage categories and technical tools displayed on your portfolio</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(skillsObj).map(([category, items]) => {
                const displayTitle = 
                  category === 'frontend' ? 'Frontend Technologies' :
                  category === 'backend' ? 'Backend & Services' :
                  category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                
                return (
                  <div key={category} className="border border-slate-200 dark:border-slate-800 rounded-none p-5 bg-slate-50/20 dark:bg-slate-900/10 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                      <h4 className="font-bold text-sm tracking-tight uppercase text-slate-700 dark:text-slate-300">{displayTitle}</h4>
                      {category !== 'frontend' && category !== 'backend' && (
                        <button
                          onClick={() => {
                            const newSkillsObj = { ...skillsObj }
                            delete newSkillsObj[category]
                            setCurrentContent(prev => ({
                              ...prev,
                              skills: newSkillsObj
                            }))
                          }}
                          className="text-xs font-semibold uppercase tracking-wider text-red-500 hover:text-red-700 transition-colors"
                        >
                          Delete Category
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {(items || []).map((skill, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => {
                              const newCategorySkills = [...(items || [])]
                              newCategorySkills[index] = e.target.value
                              setCurrentContent(prev => ({
                                ...prev,
                                skills: {
                                  ...prev.skills,
                                  [category]: newCategorySkills
                                }
                              }))
                            }}
                            className="flex-1 px-3 py-2 border border-slate-205 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 text-sm transition-all"
                          />
                          <button
                            onClick={() => {
                              const newCategorySkills = (items || []).filter((_, i) => i !== index)
                              setCurrentContent(prev => ({
                                ...prev,
                                skills: {
                                  ...prev.skills,
                                  [category]: newCategorySkills
                                }
                              }))
                            }}
                            className="px-3 py-2 text-red-500 hover:text-red-700 font-semibold text-xs uppercase tracking-wider transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      
                      <button
                        onClick={() => {
                          setCurrentContent(prev => ({
                            ...prev,
                            skills: {
                              ...prev.skills,
                              [category]: [...(items || []), '']
                            }
                          }))
                        }}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-850 hover:bg-slate-205 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-none flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Skill
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Add New Custom Category Box */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-none p-5 bg-white dark:bg-slate-900 shadow-sm max-w-md">
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">Add Custom Skill Category</h4>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="newCategoryInput"
                  placeholder="e.g. Tools & Platforms, Databases"
                  className="flex-1 px-3 py-2 border border-slate-205 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 text-sm transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val) {
                        if (skillsObj[val]) {
                          alert('This category already exists!');
                          return;
                        }
                        setCurrentContent(prev => ({
                          ...prev,
                          skills: {
                            ...prev.skills,
                            [val]: []
                          }
                        }));
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('newCategoryInput');
                    const val = input ? input.value.trim() : '';
                    if (val) {
                      if (skillsObj[val]) {
                        alert('This category already exists!');
                        return;
                      }
                      setCurrentContent(prev => ({
                        ...prev,
                        skills: {
                          ...prev.skills,
                          [val]: []
                        }
                      }));
                      if (input) input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-805 dark:hover:bg-slate-200 font-semibold text-xs uppercase tracking-wider rounded-none transition-colors border border-transparent"
                >
                  Add Category
                </button>
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
                  url: '',
                  image: ''
                })}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-900 dark:border-slate-100 hover:bg-slate-805 dark:hover:bg-slate-200 flex items-center gap-2 rounded-none text-sm font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Project
              </button>
            </div>
            <div className="space-y-6">
              {currentContent.projects?.map((project, index) => (
                <div key={project.id} className="border border-slate-200 dark:border-slate-800 rounded-none p-5 bg-slate-50/20 dark:bg-slate-900/10">
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
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Year</label>
                      <input
                        type="text"
                        value={project.year}
                        onChange={(e) => updateArrayContent('projects', index, 'year', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={project.description}
                        onChange={(e) => updateArrayContent('projects', index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={project.tags.join(', ')}
                        onChange={(e) => updateArrayContent('projects', index, 'tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Project URL</label>
                      <input
                        type="url"
                        value={project.url || ''}
                        onChange={(e) => updateArrayContent('projects', index, 'url', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                        placeholder="https://github.com/username/project-name"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Project Image</label>
                      {project.image ? (
                         <div className="relative group">
                          <img
                            src={project.image}
                            alt={project.title || 'Project image'}
                            className="w-full h-48 object-cover rounded-none border border-slate-205 dark:border-slate-800"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-none flex items-center justify-center gap-3">
                            <label className="px-3 py-1.5 bg-white text-black text-sm font-semibold rounded-none cursor-pointer hover:bg-slate-100 transition-colors">
                              Replace
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files[0]) handleImageUpload(e.target.files[0], index)
                                }}
                              />
                            </label>
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="px-3 py-1.5 bg-red-650 hover:bg-red-700 text-white text-sm font-semibold rounded-none transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className={`flex flex-col items-center justify-center w-full h-48 border border-dashed rounded-none cursor-pointer transition-colors ${uploadingImageIndex === index
                            ? 'border-slate-400 bg-slate-100 dark:bg-slate-900/50'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30'
                          }`}>
                          {uploadingImageIndex === index ? (
                            <div className="flex flex-col items-center">
                              <svg className="animate-spin w-8 h-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span className="text-sm text-blue-500 font-medium">Uploading...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Click to upload image</span>
                              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG, GIF, WebP</span>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingImageIndex === index}
                            onChange={(e) => {
                              if (e.target.files[0]) handleImageUpload(e.target.files[0], index)
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'certifications':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Certifications</h3>
              <button
                onClick={() => addArrayItem('certifications', {
                  id: Date.now().toString(),
                  title: '',
                  issuer: '',
                  date: '',
                  url: ''
                })}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-900 dark:border-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 flex items-center gap-2 rounded-none text-sm font-semibold transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Certification
              </button>
            </div>

            <div className="space-y-4">
              {(currentContent.certifications || []).map((cert, index) => (
                <div 
                  key={cert.id || index} 
                  className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 rounded-none space-y-4 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Certification #{index + 1}
                    </h4>
                    <button
                      onClick={() => removeArrayItem('certifications', index)}
                      className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-semibold uppercase tracking-wider transition-colors hover:underline"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={cert.title || ''}
                        onChange={(e) => updateArrayContent('certifications', index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-805 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all text-sm font-medium"
                        placeholder="e.g., Responsive Web Design"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Issuer
                      </label>
                      <input
                        type="text"
                        value={cert.issuer || ''}
                        onChange={(e) => updateArrayContent('certifications', index, 'issuer', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-805 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all text-sm font-medium"
                        placeholder="e.g., freeCodeCamp"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Year/Date
                      </label>
                      <input
                        type="text"
                        value={cert.date || ''}
                        onChange={(e) => updateArrayContent('certifications', index, 'date', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-805 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all text-sm font-medium"
                        placeholder="e.g., 2023"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Verification URL
                      </label>
                      <input
                        type="url"
                        value={cert.url || ''}
                        onChange={(e) => updateArrayContent('certifications', index, 'url', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-805 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all text-sm font-medium"
                        placeholder="e.g., https://freecodecamp.org/certs/..."
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
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={currentContent.contact?.location || ''}
                  onChange={(e) => updateContentField('contact', 'location', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Availability</label>
                <input
                  type="text"
                  value={currentContent.contact?.availability || ''}
                  onChange={(e) => updateContentField('contact', 'availability', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={currentContent.contact?.social?.github || ''}
                  onChange={(e) => updateContentField('contact', 'social', { ...currentContent.contact?.social, github: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  value={currentContent.contact?.social?.linkedin || ''}
                  onChange={(e) => updateContentField('contact', 'social', { ...currentContent.contact?.social, linkedin: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Facebook URL</label>
                <input
                  type="url"
                  value={currentContent.contact?.social?.facebook || ''}
                  onChange={(e) => updateContentField('contact', 'social', { ...currentContent.contact?.social, facebook: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all"
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
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-none shadow-sm">
                <input
                  type="checkbox"
                  id="chatEnabled"
                  checked={currentContent.chat?.enabled || false}
                  onChange={(e) => updateContentField('chat', 'enabled', e.target.checked)}
                  className="w-4 h-4 text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-none focus:ring-slate-500/10"
                />
                <label htmlFor="chatEnabled" className="text-sm font-semibold uppercase tracking-wide cursor-pointer text-slate-700 dark:text-slate-300">
                  {currentContent.chat?.enabled ? 'Chat Enabled' : 'Chat Disabled'}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Settings */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-5 shadow-sm">
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
                        className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 text-sm transition-all"
                        placeholder="Chat with Clarence"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Input Placeholder</label>
                      <input
                        type="text"
                        value={currentContent.chat?.placeholder || ''}
                        onChange={(e) => updateContentField('chat', 'placeholder', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 text-sm transition-all"
                        placeholder="Type a message..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">OpenRouter API Key (Optional)</label>
                      <input
                        type="password"
                        value={openRouterKeyInput}
                        onChange={(e) => setOpenRouterKeyInput(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 text-sm transition-all"
                        placeholder="sk-or-v1-..."
                      />
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-normal">
                        Insert your OpenRouter key to enable LLM-powered responses via <strong>poolside/laguna-m.1:free</strong>. If left blank or if the API query fails, it falls back to the keyword trigger rules below.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Fallback Response</label>
                      <textarea
                        value={currentContent.chat?.fallbackResponse || ''}
                        onChange={(e) => updateContentField('chat', 'fallbackResponse', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 text-sm transition-all"
                        placeholder="Default response when no specific trigger matches"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        This response is used when visitor messages don't match any trigger words and OpenRouter is not configured/active.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Auto Responses */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-5 shadow-sm">
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
                        setCurrentContent(prev => ({
                          ...prev,
                          chat: { ...prev.chat, autoResponses: newResponses }
                        }))
                      }}
                      className="px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-900 dark:border-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 flex items-center gap-1.5 text-sm font-semibold rounded-none transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Response
                    </button>
                  </div>

                  {autoResponses.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-slate-300 dark:border-slate-800 rounded-none bg-slate-50/50 dark:bg-slate-900/30">
                      <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No auto responses configured</p>
                      <button
                        onClick={() => {
                          const currentResponses = currentContent.chat?.autoResponses || []
                          const newResponses = [...currentResponses, { trigger: [''], response: '' }]
                          setCurrentContent(prev => ({
                            ...prev,
                            chat: { ...prev.chat, autoResponses: newResponses }
                          }))
                        }}
                        className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-900 dark:border-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-sm font-semibold rounded-none transition-colors"
                      >
                        Add Your First Response
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                      {autoResponses.map((response, index) => (
                        <div key={index} className="border border-slate-200 dark:border-slate-800 rounded-none p-4 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-350 dark:hover:border-slate-700 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-bold rounded-none border border-slate-200 dark:border-slate-700">
                                #{index + 1}
                              </span>
                              <h4 className="font-medium text-sm">Auto Response</h4>
                            </div>
                            <button
                              onClick={() => {
                                const currentResponses = currentContent.chat?.autoResponses || []
                                const newResponses = currentResponses.filter((_, i) => i !== index)
                                setCurrentContent(prev => ({
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
                                  setCurrentContent(prev => ({
                                    ...prev,
                                    chat: { ...prev.chat, autoResponses: newResponses }
                                  }))
                                }}
                                className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 text-sm transition-all"
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
                                  setCurrentContent(prev => ({
                                    ...prev,
                                    chat: { ...prev.chat, autoResponses: newResponses }
                                  }))
                                }}
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 rounded-none bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 text-sm resize-none transition-all"
                                placeholder="Enter the bot's response message..."
                              />
                            </div>

                            {/* Preview */}
                            {(response.trigger && response.trigger.length > 0 && response.trigger[0]) || response.response ? (
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-3">
                                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Bot Response Preview</div>
                                  <div className="text-sm text-slate-850 dark:text-slate-200">
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
    <div className="h-screen bg-slate-50/40 dark:bg-slate-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-none hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-850 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-tight">Portfolio CMS</h1>
            <span className="px-2.5 py-0.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-none bg-slate-50 dark:bg-slate-900 uppercase font-semibold">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border border-slate-900 dark:border-slate-100 hover:bg-slate-805 dark:hover:bg-slate-200 disabled:opacity-50 flex items-center gap-2 rounded-none transition-colors text-sm font-semibold"
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
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-2 rounded-none transition-colors text-sm font-semibold"
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
        <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-3 flex-shrink-0 animate-fade-in">
          <div className="flex items-center px-3">
            <svg className="w-5 h-5 text-slate-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">{saveMessage}</p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-slate-900/40 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 transition-all duration-300`}>
          <nav className={`${sidebarCollapsed ? 'p-2' : 'p-4'} space-y-1.5 h-full overflow-y-auto`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-all border-l-2 ${sidebarCollapsed ? 'justify-center' : ''
                  } ${activeTab === tab.id
                    ? 'bg-slate-100 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 font-bold border-slate-900 dark:border-slate-100 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-905 dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 border-transparent rounded-none'
                  }`}
                title={sidebarCollapsed ? tab.name : ''}
              >
                <span className="flex-shrink-0">{tab.icon}</span>
                {!sidebarCollapsed && (
                  <span className="font-semibold truncate text-sm">
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
            <div className="bg-white dark:bg-slate-900/50 rounded-none border border-slate-200 dark:border-slate-800 p-6 h-full overflow-y-auto">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CMS
