import { Link } from 'react-router-dom'
import { usePortfolioContent } from '../hooks/usePortfolioContent'

const AllProjects = () => {
  const { content, loading } = usePortfolioContent()
  const projects = content?.projects || []

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900 text-black dark:text-white">
        <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-black dark:text-gray-100 font-bold border-2 border-black dark:border-gray-300 px-3 py-1 bg-white dark:bg-gray-900 hover:bg-black hover:text-white dark:hover:bg-gray-300 dark:hover:text-black mb-6 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <div>
              <h1 className="text-3xl font-bold">Projects</h1>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            // Extract domain from URL
            const getDomain = (url) => {
              try {
                const urlObj = new URL(url)
                return urlObj.hostname.replace('www.', '')
              } catch {
                return url.replace(/^https?:\/\//, '').replace('www.', '').split('/')[0]
              }
            }
            const domain = getDomain(project.url)
            
            return (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border-4 border-black dark:border-gray-300 p-6 bg-white dark:bg-gray-900 cursor-pointer group hover:translate-x-1 hover:translate-y-1 transition-all duration-200 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(209,213,219,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(209,213,219,1)]"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{project.title}</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{project.year}</span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-yellow-400 text-black text-sm font-bold border-2 border-black dark:border-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 text-sm text-black dark:text-gray-100 font-bold border-2 border-black dark:border-gray-300 px-3 py-1 bg-blue-400 dark:bg-blue-400 group-hover:bg-black group-hover:text-white dark:group-hover:bg-gray-300 dark:group-hover:text-black transition-all duration-200">
                  View Project
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AllProjects
