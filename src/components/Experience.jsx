import { usePortfolioContent } from '../hooks/usePortfolioContent'

const Experience = () => {
  const { content, loading } = usePortfolioContent()
  const experiences = content?.experience || []

  if (loading) {
    return (
      <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-none shadow-sm animate-pulse">
        <div className="h-32 bg-slate-100 dark:bg-slate-800/80 rounded-none"></div>
      </section>
    )
  }

  return (
    <section id="experience" className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-none shadow-sm hover:shadow-md transition-shadow">
      {/* Header Accent Bar */}
      <div className="flex items-center gap-3.5 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2 bg-slate-105 dark:bg-slate-855 text-slate-700 dark:text-slate-300 rounded-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight uppercase">Experience</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">My academic path and employment history</p>
        </div>
      </div>
      
      {/* Vertical Timeline Wrapper */}
      <div className="relative pl-6 md:pl-8 border-l border-slate-205 dark:border-slate-800 ml-3 md:ml-4 space-y-8 my-6">
        {experiences.map((exp, index) => (
          <div key={index} className="relative animate-fade-in">
            {/* Timeline Circle Node (Sharp Square) */}
            <div className="absolute left-[-28px] md:left-[-36px] top-5 w-2 h-2 bg-slate-900 dark:bg-slate-100 border border-white dark:border-slate-950 shadow-sm" />

            {/* Timeline Content Card */}
            <div className="border border-slate-200 dark:border-slate-800/80 p-5 bg-white dark:bg-slate-900/60 rounded-none shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight leading-tight uppercase">
                    {exp.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                    {exp.company}
                  </p>
                </div>
                {/* Year Badge */}
                <span className="inline-block px-3 py-1 border border-slate-200 dark:border-slate-800 bg-transparent text-slate-600 dark:text-slate-400 font-semibold text-xs rounded-none">
                  {exp.year}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed mt-2 pl-3 border-l border-slate-200 dark:border-slate-800">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Experience
