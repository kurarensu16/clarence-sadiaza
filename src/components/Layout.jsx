import { useEffect, useState } from 'react'
import Hero from './Hero'
import About from './About'
import Experience from './Experience'
import Projects from './Projects'
import Contact from './Contact'
import Chat from './Chat'

const Layout = () => {
	const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
	const [isChatOpen, setIsChatOpen] = useState(false)
	const [chatSettings, setChatSettings] = useState({
		enabled: true,
		buttonText: "Chat with Clarence",
		placeholder: "Type a message...",
		autoResponses: [],
		fallbackResponse: "That's interesting! I'm always eager to learn and discuss new topics."
	})

	useEffect(() => {
		const root = document.documentElement
		if (theme === 'dark') {
			root.classList.add('dark')
		} else {
			root.classList.remove('dark')
		}
		localStorage.setItem('theme', theme)
	}, [theme])

	useEffect(() => {
		const savedContent = localStorage.getItem('portfolioContent')
		if (savedContent) {
			const parsedContent = JSON.parse(savedContent)
			if (parsedContent.chat) {
				setChatSettings(parsedContent.chat)
			}
		}
		// Ensure chat is enabled by default
		setChatSettings(prev => ({
			...prev,
			enabled: true
		}))
	}, [])

	return (
		<div className="min-h-screen text-black bg-white dark:text-white dark:bg-neutral-900">
			{/* Theme Toggle - Top Right */}
			<div className="fixed top-12 right-8 z-50">
				<button
					onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
					aria-label="Toggle theme"
					className="relative inline-flex items-center w-10 h-6 rounded-full transition-colors bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 shadow-lg"
				>
					<span className="absolute left-0.5 text-yellow-500">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
							<circle cx="12" cy="12" r="4" />
							<path d="M12 2v2m0 16v2M22 12h-2M4 12H2m15.364-7.364-1.414 1.414M8.05 16.95 6.636 18.364m10.728 0-1.414-1.414M8.05 7.05 6.636 5.636" />
						</svg>
					</span>
					<span className="absolute right-0.5 text-gray-700 dark:text-gray-200">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
						</svg>
					</span>
					<span className={`inline-block h-4 w-4 bg-white dark:bg-neutral-900 rounded-full transform transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
				</button>
			</div>

			{/* Floating Chat Button */}
			{chatSettings.enabled && (
				<div className="fixed bottom-6 right-6 z-50">
					<button 
						onClick={() => setIsChatOpen(true)}
						className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 dark:bg-white dark:text-black dark:hover:bg-gray-200 flex items-center gap-2"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
						</svg>
						{chatSettings.buttonText}
					</button>
				</div>
			)}

			{/* Main Content - Optimized Grid Layout */}
			<main className="w-full px-6 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* Left Column - Profile, About, Contact */}
					<div className="lg:col-span-4 space-y-6">
						<Hero />
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


