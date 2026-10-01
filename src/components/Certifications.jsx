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
        <div className="space-y-3">
          <div className="h-16 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none"></div>
          <div className="h-16 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none"></div>
          <div className="h-16 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none"></div>
        </div>
      </div>
    )
  }

  return (
    <div id="certifications" className="space-y-8 animate-fade-in">
      {/* Header Accent Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight uppercase">Certifications</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Verified courses, achievements, and technical credentials</p>
          </div>
        </div>

        {/* Count Indicator */}
        <span className="self-start sm:self-auto text-xs font-semibold px-2.5 py-1 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 font-mono">
          {certifications.length} {certifications.length === 1 ? 'Credential' : 'Credentials'}
        </span>
      </div>

      {/* Structured Credential Table / Rows */}
      {certifications.length === 0 ? (
        <div className="border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-slate-50/50 dark:bg-slate-900/40 rounded-none">
          <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">No certifications listed yet.</p>
        </div>
      ) : (
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 divide-y divide-slate-100 dark:divide-slate-800/80 shadow-sm">
          {/* Table Header Row (Hidden on mobile) */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50/60 dark:bg-slate-900/80 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
            <span className="col-span-6">Credential / Course</span>
            <span className="col-span-3">Issuing Organization</span>
            <span className="col-span-1 text-center">Year</span>
            <span className="col-span-2 text-right">Verification</span>
          </div>

          {/* List Items */}
          {certifications.map((cert, idx) => (
            <div 
              key={cert.id || idx}
              className="group p-5 md:px-6 md:py-4 flex flex-col md:grid md:grid-cols-12 md:items-center gap-3 md:gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              {/* Title & Badge Icon */}
              <div className="md:col-span-6 flex items-start gap-3">
                <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 rounded-none flex-shrink-0 mt-0.5 md:mt-0">
                  <svg className="w-4 h-4 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    {cert.title}
                  </h3>
                  {/* Mobile-only issuer display */}
                  <span className="md:hidden text-xs text-slate-500 dark:text-slate-400 font-medium block mt-0.5">
                    {cert.issuer} {cert.date ? `• ${cert.date}` : ''}
                  </span>
                </div>
              </div>

              {/* Issuer (Desktop) */}
              <div className="hidden md:flex md:col-span-3 items-center">
                <span className="inline-block px-2.5 py-1 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-none truncate max-w-[200px]">
                  {cert.issuer}
                </span>
              </div>

              {/* Year (Desktop) */}
              <div className="hidden md:flex md:col-span-1 justify-center">
                {cert.date ? (
                  <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                    {cert.date}
                  </span>
                ) : (
                  <span className="text-slate-300 dark:text-slate-700">—</span>
                )}
              </div>

              {/* Action Button / Link */}
              <div className="md:col-span-2 flex justify-end items-center pt-2 md:pt-0">
                {cert.url ? (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-800 rounded-none px-3 py-1.5 bg-white dark:bg-slate-800/80 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900 hover:border-slate-900 dark:hover:border-slate-100 transition-all shadow-sm w-full md:w-auto justify-center"
                    title={`Verify ${cert.title}`}
                  >
                    <span>Verify</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-600 font-mono">Verified</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Certifications
