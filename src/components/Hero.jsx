import clarenceImage from '../assets/clarence.jpg'
import { usePortfolioContent } from '../hooks/usePortfolioContent'

const Hero = ({ theme, setTheme }) => {
  const { content, loading } = usePortfolioContent()
  const heroContent = content?.hero

  if (loading || !heroContent) {
    return (
      <section className="bg-white dark:bg-gray-900 border-4 border-black dark:border-gray-300 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(209,213,219,1)]">
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white dark:bg-gray-900 border-4 border-black dark:border-gray-300 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(209,213,219,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(209,213,219,1)] transition-all duration-200 cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1"></div>
        {theme !== undefined && setTheme && (
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={theme === 'dark'}
              onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            />
            <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none border-4 border-black dark:border-gray-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-7 rtl:peer-checked:after:-translate-x-7 after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-white after:border-2 after:border-black dark:after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-800 dark:peer-checked:bg-gray-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(209,213,219,1)]">
              {/* Sun Icon */}
              <svg className="pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-yellow-300 opacity-0 dark:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M22 12h-2M4 12H2m15.364-7.364-1.414 1.414M8.05 16.95 6.636 18.364m10.728 0-1.414-1.414M8.05 7.05 6.636 5.636" />
              </svg>
              {/* Moon Icon */}
              <svg className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600 dark:text-gray-200 opacity-100 dark:opacity-0 transition-opacity" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
          </label>
        )}
      </div>
      <div className="flex items-start gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 overflow-hidden border-4 border-black dark:border-white">
            <img 
              src={clarenceImage} 
              alt={heroContent.name || 'Profile'} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{heroContent.name}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-1 text-sm">{heroContent.location}</p>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{heroContent.title}</p>
          
          {/* CTA Button */}
          <a 
            href={`mailto:${heroContent.email}`}
            className="bg-blue-400 dark:bg-blue-400 text-black px-4 py-2 border-4 border-black dark:border-gray-300 font-bold hover:bg-blue-300 transition-all duration-200 inline-flex items-center gap-2 text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(209,213,219,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(209,213,219,1)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Email
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero