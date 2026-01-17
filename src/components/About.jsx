import { usePortfolioContent } from '../hooks/usePortfolioContent'

const About = () => {
  const { content, loading } = usePortfolioContent()
  const aboutContent = content?.about

  if (loading || !aboutContent) {
    return (
      <section className="bg-white dark:bg-gray-900 border-4 border-black dark:border-gray-300 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(209,213,219,1)]">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white dark:bg-gray-900 border-4 border-black dark:border-gray-300 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(209,213,219,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(209,213,219,1)] transition-all duration-200 cursor-pointer">
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