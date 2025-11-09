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
		<div className="min-h-screen text-black bg-white dark:text-white dark:bg-neutral-900">
			{/* Theme Toggle - Top Right */}
			<div className="fixed top-2 right-8 z-50">
				<label className="inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						className="sr-only peer"
						checked={theme === 'dark'}
						onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
						aria-label="Toggle theme"
					/>
					<div className="relative w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gray-800 dark:peer-checked:bg-gray-800">
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


