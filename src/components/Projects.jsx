import { useState, useEffect } from 'react'

const Projects = () => {
  const [skills, setSkills] = useState({
    frontend: ['JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'HTML5', 'CSS3', 'Sass', 'Webpack', 'Vite'],
    backend: ['Node.js', 'Express', 'Python', 'MySQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Supabase']
  })

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A fully responsive e-commerce website with product filtering, cart functionality, and secure checkout process.",
      tags: ["React", "Node.js", "MongoDB", "PayMongo"],
      year: "2024",
      url: "https://github.com/kurarensu16/ecommerce-platform"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A productivity application for managing tasks with drag-and-drop functionality and real-time collaboration.",
      tags: ["React", "Firebase", "Material UI", "Redux"],
      year: "2023",
      url: "https://github.com/kurarensu16/task-management-app"
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "Real-time weather application with 5-day forecast, location search, and interactive maps integration.",
      tags: ["JavaScript", "REST API", "CSS3", "Leaflet"],
      year: "2023",
      url: "https://github.com/kurarensu16/weather-dashboard"
    },
    {
      id: 4,
      title: "Portfolio Website",
      description: "A minimalist portfolio website showcasing projects and skills with smooth animations and responsive design.",
      tags: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
      year: "2024",
      url: "https://github.com/kurarensu16/portfolio-website"
    }
  ])

  useEffect(() => {
    const savedContent = localStorage.getItem('portfolioContent')
    if (savedContent) {
      const parsedContent = JSON.parse(savedContent)
      if (parsedContent.skills) {
        setSkills(parsedContent.skills)
      }
      if (parsedContent.projects) {
        setProjects(parsedContent.projects)
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Tech Stack Section */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
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
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded dark:bg-gray-700 dark:text-gray-200"
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
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded dark:bg-gray-700 dark:text-gray-200"
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
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h2 className="text-xl font-bold">Projects</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-gray-200 dark:border-gray-600 p-4 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300 rounded-lg bg-gray-50 dark:bg-gray-700 cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{project.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{project.year}</span>
                  <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-3 text-xs leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-1">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded dark:bg-gray-600 dark:text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Projects