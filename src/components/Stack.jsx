import { useState, useMemo } from 'react'
import { usePortfolioContent } from '../hooks/usePortfolioContent'
import { renderTechIcon } from '../lib/techIcons'

const BACKEND_KEYWORDS = [
  'node', 'express', 'python', 'fastapi', 'flask', 'django', 'sql', 'mysql', 
  'postgres', 'sqlite', 'mongo', 'firebase', 'supabase', 'aws', 'api', 'rest', 
  'graphql', 'prisma', 'paymongo', 'stripe', 'server', 'docker', 'redis'
]

const CATEGORY_META = {
  frontend: {
    title: 'Frontend & Client-Side',
    description: 'User interfaces, client state, styling systems, and web standards',
    badgeClass: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
  },
  backend: {
    title: 'Backend, Database & Cloud',
    description: 'Server runtimes, RESTful APIs, relational & document databases',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  devops: {
    title: 'DevOps & Cloud Infrastructure',
    description: 'Deployment pipelines, serverless platforms, containerization, and DNS',
    badgeClass: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
  },
  tools: {
    title: 'Developer Tools & Workflow',
    description: 'Version control, API clients, testing environments, and collaboration',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  },
  ai: {
    title: 'AI, LLMs & Intelligent Agents',
    description: 'Neural network frameworks, model inference, agentic tooling, and routers',
    badgeClass: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  }
}

const Stack = () => {
  const { content, loading } = usePortfolioContent()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 1. Resolve raw skills from content or standard portfolio defaults
  const rawSkills = content?.skills || {
    frontend: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Vite', 'Redux', 'TanStack Query', 'Zustand', 'Framer Motion', 'Recharts', 'Lucide React', 'Clerk Auth', 'PWA', 'Leaflet', 'CSS3', 'HTML5'],
    backend: ['Node.js', 'Python', 'FastAPI', 'Django', 'Django REST Framework', 'PostgreSQL', 'MongoDB', 'Supabase', 'Firebase', 'MySQL', 'SQLite', 'SQLAlchemy', 'REST API', 'PayMongo'],
    tools: ['Git', 'GitHub', 'Postman', 'Vercel', 'Railway', 'Teams'],
    ai: ['PyTorch', 'OpenAI', 'Claude Code', 'Google Antigravity', 'OpenRouter', 'Groq AI', 'OpenCode', 'KiloCode']
  }

  // 2. Ensure any project tags are represented without dropping existing categories
  const allProjects = content?.projects || []
  const projectTags = Array.from(
    new Set(allProjects.flatMap(p => p.tags || []))
  ).map(t => typeof t === 'string' ? t.trim() : '').filter(Boolean)

  const resolvedSkills = useMemo(() => {
    const existingSkillNames = new Set(
      Object.values(rawSkills).flat().map(item => {
        const name = typeof item === 'object' ? item?.name : item
        return typeof name === 'string' ? name.trim().toLowerCase() : ''
      }).filter(Boolean)
    )

    const merged = { ...rawSkills }

    // Merge unlisted project tags into frontend or backend
    projectTags.forEach(tag => {
      const lower = tag.toLowerCase()
      if (!existingSkillNames.has(lower)) {
        existingSkillNames.add(lower)
        const isBackend = BACKEND_KEYWORDS.some(kw => lower.includes(kw))
        const targetCategory = isBackend ? 'backend' : 'frontend'
        merged[targetCategory] = [...(merged[targetCategory] || []), tag]
      }
    })

    return merged
  }, [rawSkills, projectTags])

  // Count total technologies
  const totalCount = useMemo(() => {
    return Object.values(resolvedSkills).reduce((acc, curr) => acc + (curr?.length || 0), 0)
  }, [resolvedSkills])

  // Filter skills based on category and search query
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const result = {}

    Object.entries(resolvedSkills).forEach(([catKey, items]) => {
      if (activeCategory !== 'all' && activeCategory !== catKey) return

      let matchedItems = items || []
      if (q) {
        matchedItems = matchedItems.filter(skill => {
          const name = typeof skill === 'object' ? (skill.name || '') : skill
          return name.toLowerCase().includes(q)
        })
      }

      if (matchedItems.length > 0) {
        result[catKey] = matchedItems
      }
    })

    return result
  }, [resolvedSkills, activeCategory, searchQuery])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"></div>
        <div className="space-y-4">
          <div className="h-44 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"></div>
          <div className="h-44 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"></div>
        </div>
      </div>
    )
  }

  const categoryKeys = Object.keys(resolvedSkills)

  return (
    <div id="stack" className="space-y-8 animate-fade-in">
      {/* Header Accent Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-none shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight uppercase">Tech Stack</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Languages, libraries, databases, and environments I use to build robust software
            </p>
          </div>
        </div>

        {/* Count Indicator */}
        <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 font-mono shadow-sm">
          {totalCount} Technologies
        </span>
      </div>

      {/* Navigation & Search Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold transition-all rounded-none ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            All ({totalCount})
          </button>

          {categoryKeys.map(catKey => {
            const count = resolvedSkills[catKey]?.length || 0
            const meta = CATEGORY_META[catKey]
            const label = meta ? meta.title.split('&')[0].trim() : catKey.toUpperCase()

            return (
              <button
                key={catKey}
                onClick={() => setActiveCategory(catKey)}
                className={`px-3 py-1.5 text-xs font-semibold transition-all rounded-none ${
                  activeCategory === catKey
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {label} ({count})
              </button>
            )
          })}
        </div>

        {/* Search Input Filter */}
        <div className="relative min-w-[200px] sm:min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search technology..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-100 transition-all rounded-none"
          />
          <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Categorized Shelves - Balanced horizontal layout, no empty gaps */}
      <div className="space-y-6">
        {Object.entries(filteredCategories).length === 0 ? (
          <div className="p-8 text-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
            <p className="text-sm font-mono text-slate-500">No technologies found matching "{searchQuery}"</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all') }}
              className="mt-3 text-xs font-semibold text-slate-900 dark:text-slate-100 underline underline-offset-4"
            >
              Reset filters
            </button>
          </div>
        ) : (
          Object.entries(filteredCategories).map(([category, items]) => {
            const meta = CATEGORY_META[category]
            const displayTitle = meta?.title || category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
            const description = meta?.description || ''

            return (
              <section 
                key={category}
                className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-none overflow-hidden shadow-sm"
              >
                {/* Category Header */}
                <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm tracking-tight uppercase text-slate-900 dark:text-slate-100">
                      {displayTitle}
                    </h3>
                    {description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {description}
                      </p>
                    )}
                  </div>
                  <span className="self-start sm:self-auto text-[10px] font-bold font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                    {items.length} {items.length === 1 ? 'Tool' : 'Tools'}
                  </span>
                </div>

                {/* Fluid Responsive Grid of High-End Brand Tiles */}
                <div className="p-5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
                    {items.map((skillItem, index) => {
                      const skillName = typeof skillItem === 'object' ? skillItem.name : skillItem
                      const explicitIcon = typeof skillItem === 'object' ? skillItem.icon : null

                      return (
                        <div
                          key={index}
                          className="group relative flex items-center gap-2.5 px-3 py-2.5 bg-white dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800 rounded-none hover:border-slate-900 dark:hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                        >
                          {/* Brand Icon - Clean, direct placement without square border or background */}
                          <div className="flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 duration-200">
                            {renderTechIcon(skillName, explicitIcon)}
                          </div>

                          {/* Skill Label (Comfortable spacing, no awkward cutoffs) */}
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-tight line-clamp-2">
                              {skillName}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Stack
