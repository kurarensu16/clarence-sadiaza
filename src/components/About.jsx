import { usePortfolioContent } from '../hooks/usePortfolioContent'

const About = () => {
  const { content, loading } = usePortfolioContent()
  const aboutContent = content?.about

  if (loading || !aboutContent) {
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h2 className="text-xl font-bold">About</h2>
      </div>
      
      <div className="space-y-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        {aboutContent.paragraphs?.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  )
}

export default About