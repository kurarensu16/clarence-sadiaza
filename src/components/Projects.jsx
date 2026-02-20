import { Link } from 'react-router-dom'
import { usePortfolioContent } from '../hooks/usePortfolioContent'

const Projects = () => {
  const { content, loading } = usePortfolioContent()
  const skills = content?.skills || { frontend: [], backend: [] }
  const allProjects = [...(content?.projects || [])].sort((a, b) => (b.year || '').localeCompare(a.year || ''))
  const displayedProjects = allProjects.slice(0, 2) // Show only first 2 projects

  if (loading) {
    return (
      <div className="space-y-6">
        <section className="bg-white dark:bg-gray-900 border-4 border-black dark:border-gray-300 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(209,213,219,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(209,213,219,1)] transition-all duration-200 cursor-pointer">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tech Stack Section */}
      <section className="bg-white dark:bg-gray-900 border-4 border-black dark:border-gray-300 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(209,213,219,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(209,213,219,1)] transition-all duration-200 cursor-pointer">
        <div className="flex items-start gap-3 mb-4">
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h2 className="text-xl font-bold">Skills/Technologies</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold mb-3">Frontend</h3>
            <div className="flex flex-wrap gap-2">
              {skills.frontend.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-yellow-400 text-black text-sm font-bold border-2 border-black dark:border-white dark:bg-yellow-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Backend</h3>
            <div className="flex flex-wrap gap-2">
              {skills.backend.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-yellow-400 text-black text-sm font-bold border-2 border-black dark:border-white dark:bg-yellow-400"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="text-right mt-3">
              <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
                View All &gt;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="bg-white dark:bg-gray-900 border-4 border-black dark:border-gray-300 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(209,213,219,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(209,213,219,1)] transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-xl font-bold">Projects</h2>
          </div>
          {allProjects.length > 2 && (
            <Link
              to="/projects"
              className="inline-flex items-center gap-1 text-sm text-black dark:text-gray-100 font-bold border-2 border-black dark:border-gray-300 px-3 py-1 bg-white dark:bg-gray-900 hover:bg-black hover:text-white dark:hover:bg-gray-300 dark:hover:text-black transition-all duration-200"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedProjects.map((project) => {
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
                className="block border-4 border-black dark:border-gray-300 p-5 bg-white dark:bg-gray-900 cursor-pointer group hover:translate-x-1 hover:translate-y-1 transition-all duration-200 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(209,213,219,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(209,213,219,1)]"
              >
                <h3 className="text-base font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                  {project.description.length > 80 ? `${project.description.substring(0, 80)}...` : project.description}
                </p>
                {project.image && (
                  <div className="mb-4 border-2 border-black dark:border-gray-300 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <span className="inline-block px-3 py-1.5 bg-blue-400 text-black text-xs font-bold border-2 border-black dark:border-gray-300">
                  {domain}
                </span>
              </a>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default Projects