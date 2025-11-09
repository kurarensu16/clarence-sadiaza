import { usePortfolioContent } from '../hooks/usePortfolioContent'

const Experience = () => {
  const { content, loading } = usePortfolioContent()
  const experiences = content?.experience || []

  if (loading) {
    return (
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-start gap-3 mb-4">
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
        <h2 className="text-xl font-bold">Experience</h2>
      </div>
      
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-black dark:bg-white rounded-full mt-2"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm">{exp.title}</h3>
                <span className="text-gray-500 dark:text-gray-400 text-xs">•</span>
                <span className="text-gray-600 dark:text-gray-300 text-xs">{exp.company}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{exp.year}</p>
              <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Experience
