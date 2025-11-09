import clarenceImage from '../assets/clarence.jpg'
import { usePortfolioContent } from '../hooks/usePortfolioContent'

const Hero = () => {
  const { content, loading } = usePortfolioContent()
  const heroContent = content?.hero

  if (loading || !heroContent) {
    return (
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-start gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
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
            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300 inline-flex items-center gap-2 text-sm"
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