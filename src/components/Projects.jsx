import { usePortfolioContent } from '../hooks/usePortfolioContent'
import { renderTechIcon } from '../lib/techIcons'

const Projects = () => {
  const { content, loading } = usePortfolioContent()

  const allProjects = [...(content?.projects || [])].sort((a, b) => (b.year || '').localeCompare(a.year || ''))

  const getDomain = (url) => {
    if (!url) return ''
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace('www.', '')
    } catch {
      return url.replace(/^https?:\/\//, '').replace('www.', '').split('/')[0]
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-none shadow-sm">
          <div className="h-32 bg-slate-100 dark:bg-slate-800/80 rounded-none"></div>
        </section>
      </div>
    )
  }

  return (
    <div id="projects" className="space-y-8 animate-fade-in">
      {/* Header Accent Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight uppercase">Projects</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Things I've built, shipped, and experimented with</p>
          </div>
        </div>

        {/* Count Indicator */}
        <span className="self-start sm:self-auto text-xs font-semibold px-2.5 py-1 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 font-mono">
          {allProjects.length} {allProjects.length === 1 ? 'Build' : 'Builds'}
        </span>
      </div>

      {/* Projects 2-Column Responsive Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allProjects.map((project) => {
          // Resolve GitHub URL: explicit githubUrl, or fallback to url if it includes github.com
          const githubLink = project.githubUrl || (project.url?.includes('github.com') ? project.url : null)
          // Resolve Live Demo URL: explicit liveUrl, or fallback to url if it does NOT include github.com
          const liveLink = project.liveUrl || (project.url && !project.url.includes('github.com') ? project.url : null)

          const primaryUrl = liveLink || githubLink || project.url
          const domain = getDomain(primaryUrl)

          return (
            <div 
              key={project.id}
              className="group border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-none overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Window Header Bar */}
              <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  <span className="ml-2 font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate max-w-[140px] sm:max-w-[200px]">
                    {domain || 'project.dev'}
                  </span>
                </div>
                {project.year && (
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                    {project.year}
                  </span>
                )}
              </div>

              {/* Project Preview (Image or Fallback) */}
              {project.image ? (
                <div className="w-full aspect-video overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video px-6 py-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/30 flex flex-col justify-center space-y-1.5 font-mono text-xs text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-semibold">
                    <span className="text-slate-400 dark:text-slate-600">&gt;</span>
                    <span>stack: [{(project.tags || []).slice(0, 3).join(', ')}]</span>
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-600">
                    // Ready to run & deployed
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Tags with Icons */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1.5 px-2 py-1 border text-[10px] font-semibold rounded-none bg-slate-50/70 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800/80"
                      >
                        <span className="flex-shrink-0">
                          {renderTechIcon(tag)}
                        </span>
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer details & Dual Action Buttons */}
              <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/30 dark:bg-slate-900/30">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono hidden sm:inline">
                  {liveLink ? 'Live Build' : 'Open Source'}
                </span>

                <div className="flex items-center gap-2 ml-auto">
                  {/* GitHub Action Button */}
                  {githubLink && (
                    <a
                      href={githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-800 rounded-none px-3 py-1.5 bg-white dark:bg-slate-800/80 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900 hover:border-slate-900 dark:hover:border-slate-100 transition-all shadow-sm"
                      title="View GitHub Repository"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span>GitHub</span>
                    </a>
                  )}

                  {/* Live Demo Action Button */}
                  {liveLink && (
                    <a
                      href={liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 font-bold border border-slate-900 dark:border-slate-100 rounded-none px-3 py-1.5 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-sm"
                      title="Launch Live Demo"
                    >
                      <span>Live Demo</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}

                  {/* Fallback button if neither specific link is populated but project has a generic url */}
                  {!githubLink && !liveLink && project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-800 rounded-none px-3 py-1.5 bg-white dark:bg-slate-800/80 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900 hover:border-slate-900 dark:hover:border-slate-100 transition-all shadow-sm"
                    >
                      <span>View Project</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default Projects