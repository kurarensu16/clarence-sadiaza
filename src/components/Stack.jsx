import { usePortfolioContent } from '../hooks/usePortfolioContent'

const Stack = () => {
  const { content, loading } = usePortfolioContent()
  const skills = content?.skills || { frontend: [], backend: [] }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none"></div>
          <div className="h-64 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none"></div>
          <div className="h-64 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none"></div>
        </div>
      </div>
    )
  }

  return (
    <div id="stack" className="space-y-8 animate-fade-in">
      {/* Header Accent Bar */}
      <div className="flex items-center gap-3.5 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2 bg-slate-105 dark:bg-slate-855 text-slate-700 dark:text-slate-300 rounded-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight uppercase">Tech Stack</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">The languages, frameworks, databases, and environments I use</p>
        </div>
      </div>

      {/* Tech Stack Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(skills).map(([category, items], idx) => {
          const displayTitle = 
            category === 'frontend' ? 'Frontend Development' :
            category === 'backend' ? 'Backend & Services' :
            category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          
          const indexStr = String(idx + 1).padStart(2, '0');

          return (
            <div 
              key={category} 
              className="group border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-none overflow-hidden shadow-sm hover:shadow-md hover:border-slate-305 dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-6 space-y-6">
                {/* Top Row: Index and Category Title */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-450 dark:text-slate-500">
                      Category
                    </span>
                    <h4 className="font-extrabold text-sm tracking-tight uppercase text-slate-800 dark:text-slate-100">
                      {displayTitle}
                    </h4>
                  </div>
                  <span className="text-3xl font-black text-slate-100 dark:text-slate-800/30 tracking-tighter select-none font-mono group-hover:text-slate-200 dark:group-hover:text-slate-700/60 transition-colors">
                    {indexStr}
                  </span>
                </div>

                {/* Tech Badges wrap */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {(items || []).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-none hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900 hover:border-slate-900 dark:hover:border-slate-100 transition-all duration-200 cursor-default shadow-[1px_1px_0px_rgba(0,0,0,0.02)] dark:shadow-none"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Metric */}
              <div className="px-6 py-3 bg-slate-50/40 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-center text-[9px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                <span>Capacity</span>
                <span>{items?.length || 0} Technologies</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Stack
