import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Chat from './Chat'
import { usePortfolioContent } from '../hooks/usePortfolioContent'

const Layout = () => {
	const location = useLocation()
	const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
	const [isChatOpen, setIsChatOpen] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const { content } = usePortfolioContent()
	
	const chatSettings = content?.chat || {
		enabled: true,
		buttonText: "Chat with Clarence",
		placeholder: "Type a message...",
		autoResponses: [],
		fallbackResponse: "That's interesting! I'm always eager to learn and discuss new topics."
	}
	
	const name = content?.hero?.name || 'Clarence Sadiaza'
	const heroContent = content?.hero || {}
	const contactContent = content?.contact || {}

	useEffect(() => {
		const root = document.documentElement
		if (theme === 'dark') {
			root.classList.add('dark')
		} else {
			root.classList.remove('dark')
		}
		localStorage.setItem('theme', theme)
	}, [theme])

	const getPageTitle = () => {
		const path = location.pathname
		if (path === '/') return 'About'
		if (path === '/experience') return 'Experience'
		if (path === '/stack') return 'Stack'
		if (path === '/projects') return 'Projects'
		if (path === '/contact') return 'Contact'
		if (path === '/cms') return 'CMS'
		return ''
	}
	const pageTitle = getPageTitle()

	return (
		<div className="min-h-screen text-black bg-white dark:text-gray-100 dark:bg-gray-950 flex flex-col md:flex-row">
			{/* Desktop Sidebar */}
			<aside className="hidden md:block fixed top-0 left-0 bottom-0 w-64 lg:w-72 bg-white dark:bg-slate-900/40 border-r border-slate-200/80 dark:border-slate-800 p-6 overflow-y-auto z-30">
				<Sidebar theme={theme} setTheme={setTheme} />
			</aside>

			{/* Mobile Sidebar Overlay (Drawer) */}
			{isMobileMenuOpen && (
				<div 
					className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex"
					onClick={() => setIsMobileMenuOpen(false)}
				>
					<div 
						className="w-64 bg-white dark:bg-slate-950 h-full border-r border-slate-205 dark:border-slate-850 p-6 overflow-y-auto relative animate-slide-in"
						onClick={(e) => e.stopPropagation()}
					>
						<Sidebar 
							theme={theme} 
							setTheme={setTheme} 
							isOpen={isMobileMenuOpen} 
							onClose={() => setIsMobileMenuOpen(false)} 
						/>
					</div>
				</div>
			)}

			{/* Right Side Content Container */}
			<div className="flex-1 md:pl-64 lg:pl-72 flex flex-col min-h-screen bg-slate-50/40 dark:bg-slate-950">
				{/* Global Sticky Topbar */}
				<header className="sticky top-0 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-20 w-full">
					<div className="flex items-center gap-3">
						{/* Mobile Hamburger Button */}
						<button 
							onClick={() => setIsMobileMenuOpen(true)}
							className="md:hidden p-2 rounded-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-205 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors shadow-sm"
							aria-label="Open menu"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
						{/* Mobile Brand Name */}
						<span className="font-bold text-slate-800 dark:text-slate-100 tracking-tight md:hidden">{name}</span>
						
						{/* Desktop Brand Subtitle/Tagline */}
						<span className="hidden md:inline text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase font-mono">
							{heroContent?.title || 'Software Engineer'}
						</span>
					</div>

					{/* Theme Switcher on the Right */}
					{theme !== undefined && setTheme && (
						<button 
							onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
							className="p-2 rounded-none border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors shadow-sm"
							aria-label="Toggle theme"
						>
							{theme === 'dark' ? (
								<svg className="w-5 h-5 text-slate-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2M22 12h-2M4 12H2m15.364-7.364-1.414 1.414M8.05 16.95 6.636 18.364m10.728 0-1.414-1.414M8.05 7.05 6.636 5.636" />
								</svg>
							) : (
								<svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
								</svg>
							)}
						</button>
					)}
				</header>

				{/* Main Content Area */}
				<main className="flex-1 w-full">
					<div className="max-w-4xl mx-auto px-6 md:px-12 py-8 md:py-12">
						<Outlet context={{ theme, setTheme }} />
					</div>
				</main>
			</div>

			{/* Floating Chat Button */}
			{chatSettings.enabled && (
				<div className="fixed bottom-6 right-6 z-50">
					<button 
						onClick={() => setIsChatOpen(true)}
						className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 border border-slate-900 dark:border-slate-100 hover:bg-slate-800 dark:hover:bg-slate-205 transition-colors flex items-center gap-2 font-semibold text-sm rounded-none shadow-md"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
						</svg>
						{chatSettings.buttonText}
					</button>
				</div>
			)}

			{/* Chat Modal */}
			<Chat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
		</div>
	)
}

export default Layout


