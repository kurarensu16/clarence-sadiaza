import { usePortfolioContent } from '../hooks/usePortfolioContent'

const defaultCertifications = [
  {
    id: 'c1',
    title: 'Responsive Web Design',
    issuer: 'freeCodeCamp',
    date: '2023',
    url: 'https://freecodecamp.org'
  },
  {
    id: 'c2',
    title: 'JavaScript Algorithms and Data Structures',
    issuer: 'freeCodeCamp',
    date: '2023',
    url: 'https://freecodecamp.org'
  },
  {
    id: 'c3',
    title: 'Full-Stack Web Development Course',
    issuer: 'Udemy (Online)',
    date: '2024',
    url: 'https://udemy.com'
  }
]

const Certifications = () => {
  const { content, loading } = usePortfolioContent()
  const certifications = content?.certifications || defaultCertifications

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none"></div>
          <div className="h-40 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none"></div>
          <div className="h-40 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none"></div>
        </div>
      </div>
    )
  }

  return (
    <div id="certifications" className="space-y-8 animate-fade-in">
      {/* Header Accent Bar */}
      <div className="flex items-center gap-3.5 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2 bg-slate-105 dark:bg-slate-855 text-slate-700 dark:text-slate-300 rounded-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight uppercase">Certifications</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">Credentials, online courses, and academic achievements</p>
        </div>
      </div>

      {/* Certifications Grid */}
      {certifications.length === 0 ? (
        <div className="border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-slate-50/50 dark:bg-slate-900/40 rounded-none">
          <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">No certifications listed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert, idx) => {
            const indexStr = String(idx + 1).padStart(2, '0')

            return (
              <div 
                key={cert.id || idx}
                className="group border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-none p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="space-y-4">
                  {/* Top Row: Index and Title */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono">
                        Credential {indexStr}
                      </span>
                      <h3 className="text-base font-black uppercase tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors">
                        {cert.title}
                      </h3>
                    </div>
                    {cert.date && (
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-none bg-slate-50/50 dark:bg-slate-950/20 font-mono">
                        {cert.date}
                      </span>
                    )}
                  </div>

                  {/* Issuer details */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold font-mono uppercase">
                    <span>Issued By:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">{cert.issuer}</span>
                  </div>
                </div>

                {/* Footer details & CTA */}
                {cert.url && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-6 flex justify-end">
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-800 rounded-none px-4 py-2 bg-slate-50/80 dark:bg-slate-850 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900 hover:border-slate-900 hover:border-slate-100 transition-all shadow-[1px_1px_0px_rgba(0,0,0,0.02)]"
                    >
                      <span>Verify Credential</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Certifications
