import { usePortfolioContent } from '../hooks/usePortfolioContent'

const Projects = () => {
  const { content, loading } = usePortfolioContent()

  const allProjects = [...(content?.projects || [])].sort((a, b) => (b.year || '').localeCompare(a.year || ''))

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
      <div className="flex items-center gap-3.5 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2 bg-slate-105 dark:bg-slate-855 text-slate-700 dark:text-slate-300 rounded-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight uppercase">Projects</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">A collection of my work and personal builds</p>
        </div>
      </div>

      {/* Projects List Section */}
      <section className="space-y-10">
        {allProjects.map((project, idx) => {
          const getDomain = (url) => {
            try {
              const urlObj = new URL(url)
              return urlObj.hostname.replace('www.', '')
            } catch {
              return url.replace(/^https?:\/\//, '').replace('www.', '').split('/')[0]
            }
          }
          const domain = getDomain(project.url)
          const isEven = idx % 2 === 0

          return (
            <div 
              key={project.id}
              className="group border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-none overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row hover:border-slate-300 dark:hover:border-slate-700"
            >
              {/* Image Column */}
              {project.image && (
                <div className={`w-full md:w-2/5 h-56 md:h-auto overflow-hidden border-b md:border-b-0 border-slate-100 dark:border-slate-800 ${isEven ? 'md:border-r' : 'md:border-l md:order-last'}`}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-500"
                  />
                </div>
              )}

              {/* Content Column */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Title and Year */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono">
                        Project {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    {project.year && (
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-2.5 py-0.5 rounded-none bg-slate-50/50 dark:bg-slate-950/20 font-mono">
                        {project.year}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  {project.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 bg-slate-50 dark:bg-slate-950/40 text-slate-605 dark:text-slate-400 border border-slate-200 dark:border-slate-800/80 text-[10px] font-semibold rounded-none tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer details & CTA */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-105 dark:border-slate-800/60">
                  <span className="inline-block px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-none border border-slate-200 dark:border-slate-700/60 font-mono">
                    {domain}
                  </span>
                  
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-bold border border-slate-202 dark:border-slate-800 rounded-none px-4 py-2 bg-slate-50/80 dark:bg-slate-850 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900 hover:border-slate-900 dark:hover:border-slate-100 transition-all shadow-[1px_1px_0px_rgba(0,0,0,0.02)]"
                  >
                    <span>Explore Build</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
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