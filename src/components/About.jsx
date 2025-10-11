import { useState, useEffect } from 'react'

const About = () => {
  const [content, setContent] = useState({
    paragraphs: [
      "I'm an Information Technology student with a passion for creating clean, intuitive digital experiences. Currently pursuing my degree while building personal projects and learning modern web development technologies.",
      "My focus is on full-stack development with modern technologies like React, Node.js, and cloud platforms. I enjoy turning ideas into functional applications and continuously learning new technologies to stay current with industry trends.",
      "Beyond academics, I'm passionate about contributing to open-source projects and building a strong foundation in software engineering principles. I'm always eager to learn and grow in the tech community."
    ]
  })

  useEffect(() => {
    const savedContent = localStorage.getItem('portfolioContent')
    if (savedContent) {
      const parsedContent = JSON.parse(savedContent)
      if (parsedContent.about) {
        setContent(parsedContent.about)
      }
    }
  }, [])

  return (
    <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-start gap-3 mb-4">
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-300 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h2 className="text-xl font-bold">About</h2>
      </div>
      
      <div className="space-y-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        {content.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  )
}

export default About