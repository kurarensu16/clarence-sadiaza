import { useEffect, useState } from 'react'
import Hero from './Hero'
import About from './About'
import Experience from './Experience'
import Projects from './Projects'
import Contact from './Contact'
import Chat from './Chat'
import { usePortfolioContent } from '../hooks/usePortfolioContent'

const Layout = () => {
	const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
	const [isChatOpen, setIsChatOpen] = useState(false)
	const { content } = usePortfolioContent()
	const chatSettings = content?.chat || {
		enabled: true,
		buttonText: "Chat with Clarence",
		placeholder: "Type a message...",
		autoResponses: [],
		fallbackResponse: "That's interesting! I'm always eager to learn and discuss new topics."
	}

	useEffect(() => {
		const root = document.documentElement
		if (theme === 'dark') {
			root.classList.add('dark')
		} else {
			root.classList.remove('dark')
		}
		localStorage.setItem('theme', theme)
	}, [theme])

	return (
		<div className="min-h-screen text-black bg-white dark:text-gray-100 dark:bg-gray-950">
			{/* Floating Chat Button */}
			{chatSettings.enabled && (
				<div className="fixed bottom-6 right-6 z-50">
					<button 
						onClick={() => setIsChatOpen(true)}
						className="bg-black text-white px-6 py-3 border-4 border-black dark:border-gray-300 dark:bg-gray-900 dark:text-gray-100 hover:bg-white hover:text-black dark:hover:bg-gray-300 dark:hover:text-black transition-all duration-200 flex items-center gap-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(209,213,219,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(209,213,219,1)]"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
						</svg>
						{chatSettings.buttonText}
					</button>
				</div>
			)}

			{/* Main Content - Optimized Grid Layout */}
			<main className="w-full max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-8">
				{/* Hero Section - Full Width at Top */}
				<div className="mb-6">
					<Hero theme={theme} setTheme={setTheme} />
				</div>
				
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* Left Column - About, Contact */}
					<div className="lg:col-span-4 space-y-6">
						<About />
						<Contact />
					</div>
					
					{/* Right Column - Experience & Projects */}
					<div className="lg:col-span-8 space-y-6">
						<Experience />
						<Projects />
					</div>
				</div>
			</main>

			{/* Chat Modal */}
			<Chat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
		</div>
	)
}

export default Layout


