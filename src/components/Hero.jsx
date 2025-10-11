import { useState, useEffect } from 'react'
import clarenceImage from '../assets/clarence.jpg'

const Hero = () => {
  const [content, setContent] = useState({
    name: 'Clarence Sadiaza',
    location: 'Bulacan, Central Luzon, Philippines',
    title: 'Information Technology Student | Aspiring Full-Stack Developer',
    email: 'sadiazaclarence@gmail.com'
  })

  useEffect(() => {
    const savedContent = localStorage.getItem('portfolioContent')
    if (savedContent) {
      const parsedContent = JSON.parse(savedContent)
      if (parsedContent.hero) {
        setContent(parsedContent.hero)
      }
    }
  }, [])

  return (
    <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-start gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
            <img 
              src={clarenceImage} 
              alt={content.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{content.name}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-1 text-sm">{content.location}</p>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{content.title}</p>
          
          {/* CTA Button */}
          <a 
            href={`mailto:${content.email}`}
            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2 text-sm inline-block"
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