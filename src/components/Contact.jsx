import { useState } from 'react'
import { usePortfolioContent } from '../hooks/usePortfolioContent'
import { sendContactMessage } from '../services/portfolioService'

const Contact = () => {
  const { content, loading } = usePortfolioContent()
  const contactContent = content?.contact

  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSending, setIsSending] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSending(true)
    setErrorMessage('')
    
    try {
      await sendContactMessage(formData)
      setIsSending(false)
      setShowModal(true)
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('Failed to send message:', error)
      setErrorMessage('Failed to send your message. Please check your connection or try again later.')
      setIsSending(false)
    }
  }

  if (loading || !contactContent) {
    return (
      <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-none shadow-sm animate-pulse">
        <div className="h-32 bg-slate-100 dark:bg-slate-800/80 rounded-none"></div>
      </section>
    )
  }

  return (
    <section id="contact" className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-none shadow-sm hover:shadow-md transition-shadow relative">
      {/* Header Accent Bar */}
      <div className="flex items-center gap-3.5 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2 bg-slate-105 dark:bg-slate-855 text-slate-700 dark:text-slate-300 rounded-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight uppercase">Contact</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">Get in touch or send a direct message</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side Details Column */}
        <div className="lg:col-span-5 space-y-6">
          <p className="text-slate-550 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            I'm always interested in new opportunities, collaboration, or discussing tech. 
            Feel free to drop a message in the console form, or reach out directly via socials!
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 rounded-none shadow-sm hover:border-slate-300 transition-colors">
              <svg className="w-5 h-5 text-slate-450 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href={`mailto:${contactContent.email}`} className="text-slate-700 dark:text-slate-200 font-semibold hover:text-slate-900 dark:hover:text-white transition-colors text-xs md:text-sm truncate">
                {contactContent.email}
              </a>
            </div>
            
            <div className="flex items-center gap-3.5 p-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 rounded-none shadow-sm hover:border-slate-300 transition-colors">
              <svg className="w-5 h-5 text-slate-455 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-slate-700 dark:text-slate-200 font-semibold text-xs md:text-sm">{contactContent.location}</span>
            </div>
            
            <div className="flex items-center gap-3.5 p-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 rounded-none shadow-sm hover:border-slate-300 transition-colors">
              <svg className="w-5 h-5 text-slate-455 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-slate-700 dark:text-slate-200 font-semibold text-xs md:text-sm">{contactContent.availability}</span>
            </div>
          </div>
          
          <div className="flex gap-3.5 pt-2">
            {contactContent.social?.github && (
              <a href={contactContent.social.github} target="_blank" rel="noopener noreferrer" className="p-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-405 rounded-none shadow-sm hover:text-slate-800 dark:hover:text-slate-100 hover:border-slate-305 dark:hover:border-slate-700 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
            {contactContent.social?.linkedin && (
              <a href={contactContent.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-405 rounded-none shadow-sm hover:text-slate-800 dark:hover:text-slate-100 hover:border-slate-305 dark:hover:border-slate-700 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0H1.771z"/>
                </svg>
              </a>
            )}
            {contactContent.social?.facebook && (
              <a href={contactContent.social.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-405 rounded-none shadow-sm hover:text-slate-800 dark:hover:text-slate-100 hover:border-slate-305 dark:hover:border-slate-700 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Right Side Form Column */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 rounded-none shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b border-slate-205 dark:border-slate-800 pb-2 uppercase tracking-tight">
              Send a Message
            </h3>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 rounded-none font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 rounded-none font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Message</label>
              <textarea
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Hey, let's work together!"
                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 rounded-none font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-500/10 focus:border-slate-900 dark:focus:border-slate-100 resize-none"
              />
            </div>

            {errorMessage && (
              <div className="p-3 border border-red-200/50 bg-red-50/50 dark:bg-red-950/30 text-red-650 dark:text-red-400 text-xs font-semibold text-center rounded-none">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSending}
              className="w-full text-center py-3 mt-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-semibold rounded-none shadow-sm transition-colors uppercase tracking-wider text-xs border border-transparent"
            >
              {isSending ? 'Sending Message...' : 'Submit Message'}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 max-w-sm w-full rounded-none shadow-xl text-center animate-scale-up">
            <div className="w-14 h-14 mx-auto mb-4 bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-none flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2 uppercase">Message Sent!</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed mb-6">
              Thank you for reaching out. Your message has been saved. I'll get back to you as soon as possible!
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-semibold rounded-none shadow-sm transition-colors uppercase tracking-wider text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Contact