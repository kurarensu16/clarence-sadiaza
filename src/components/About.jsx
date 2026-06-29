import clarenceImage from '../assets/clarence.jpg'
import { usePortfolioContent } from '../hooks/usePortfolioContent'

const About = () => {
  const { content, loading } = usePortfolioContent()
  const aboutContent = content?.about
  const heroContent = content?.hero

  if (loading || !aboutContent || !heroContent) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-none shadow-sm">
          <div className="h-32 bg-slate-100 dark:bg-slate-800/80 rounded-none"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Professional Resume Header Card */}
      <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 md:p-10 rounded-none shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8 relative overflow-hidden">
        {/* Profile Image (Sharp Square Frame) */}
        <div className="w-32 h-32 rounded-none overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex-shrink-0 relative group transition-transform duration-300 hover:scale-[1.01] cursor-pointer">
          <img 
            src={clarenceImage} 
            alt={heroContent.name || 'Profile'} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-none mb-2 uppercase">
              {heroContent.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg md:text-xl uppercase tracking-wide">
              {heroContent.title}
            </p>
          </div>
          
          {/* Location */}
          <div className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 px-3 py-1.5 rounded-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{heroContent.location}</span>
          </div>
        </div>
      </section>

      {/* Biography Card */}
      <section id="about" className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-none shadow-sm hover:shadow-md transition-shadow">
        {/* Header Accent Bar */}
        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2 bg-slate-105 dark:bg-slate-850 text-slate-700 dark:text-slate-300 rounded-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight uppercase">Biography</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">A short introduction about me and my goals</p>
          </div>
        </div>
        
        <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed pl-1">
          {aboutContent.paragraphs?.map((paragraph, index) => (
            <p key={index} className="pl-4 border-l border-slate-350 dark:border-slate-700 text-slate-600 dark:text-slate-400">{paragraph}</p>
          ))}
        </div>
      </section>
    </div>
  )
}

export default About