import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiTailwindcss,
  SiHtml5,
  SiCss3,
  SiSass,
  SiWebpack,
  SiVite,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiMysql,
  SiMongodb,
  SiPostgresql,
  SiAmazonwebservices,
  SiSupabase,
  SiGit,
  SiGithub,
  SiPostman,
  SiVercel,
  SiNpm,
  SiFirebase,
  SiRedux,
  SiNextdotjs,
  SiFastapi,
  SiSqlite,
  SiDocker,
  SiGraphql,
  SiPrisma,
  SiLinux,
  SiFigma,
  SiFlutter,
  SiDart,
  SiPhp,
  SiGo,
  SiRust,
  SiRuby,
  SiDjango,
  SiFlask,
  SiAngular,
  SiVuedotjs,
  SiSvelte,
  SiNestjs,
  SiRedis,
  SiKubernetes,
  SiJquery,
  SiBootstrap,
  SiCloudflare,
  SiNetlify,
  SiJupyter,
  SiPytorch,
  SiOpenai,
  SiAnthropic,
  SiGoogle,
  SiRailway,
  SiClerk,
  SiFramer,
  SiSqlalchemy,
  SiPwa,
  SiLeaflet,
  SiJsonwebtokens,
  SiReactquery,
  SiChartdotjs
} from 'react-icons/si'
import {
  TbBrandTeams,
  TbRouter,
  TbTerminal2,
  TbPrompt,
  TbDeviceLaptop,
  TbCpu,
  TbCreditCard,
  TbDatabase,
  TbSparkles,
  TbCloudComputing
} from 'react-icons/tb'
import { RiBearSmileLine } from 'react-icons/ri'
import { VscCode } from 'react-icons/vsc'

// Available icon options for dropdown / manual selection
export const AVAILABLE_ICONS = [
  { id: 'auto', label: '⚡ Auto-Detect' },
  { id: 'openai', label: 'OpenAI' },
  { id: 'claudecode', label: 'Claude Code' },
  { id: 'antigravity', label: 'Google Antigravity' },
  { id: 'pytorch', label: 'PyTorch' },
  { id: 'openrouter', label: 'OpenRouter' },
  { id: 'opencode', label: 'OpenCode' },
  { id: 'kilocode', label: 'KiloCode' },
  { id: 'teams', label: 'Microsoft Teams' },
  { id: 'react', label: 'React' },
  { id: 'next', label: 'Next.js' },
  { id: 'vue', label: 'Vue.js' },
  { id: 'angular', label: 'Angular' },
  { id: 'svelte', label: 'Svelte' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'html', label: 'HTML5' },
  { id: 'css', label: 'CSS3' },
  { id: 'tailwind', label: 'Tailwind CSS' },
  { id: 'bootstrap', label: 'Bootstrap' },
  { id: 'sass', label: 'Sass' },
  { id: 'node', label: 'Node.js' },
  { id: 'express', label: 'Express' },
  { id: 'nestjs', label: 'NestJS' },
  { id: 'python', label: 'Python' },
  { id: 'django', label: 'Django' },
  { id: 'flask', label: 'Flask' },
  { id: 'fastapi', label: 'FastAPI' },
  { id: 'php', label: 'PHP' },
  { id: 'go', label: 'Go (Golang)' },
  { id: 'rust', label: 'Rust' },
  { id: 'ruby', label: 'Ruby' },
  { id: 'postgres', label: 'PostgreSQL' },
  { id: 'mysql', label: 'MySQL' },
  { id: 'sqlite', label: 'SQLite' },
  { id: 'mongo', label: 'MongoDB' },
  { id: 'redis', label: 'Redis' },
  { id: 'supabase', label: 'Supabase' },
  { id: 'firebase', label: 'Firebase' },
  { id: 'prisma', label: 'Prisma' },
  { id: 'graphql', label: 'GraphQL' },
  { id: 'aws', label: 'AWS' },
  { id: 'docker', label: 'Docker' },
  { id: 'kubernetes', label: 'Kubernetes' },
  { id: 'linux', label: 'Linux' },
  { id: 'git', label: 'Git' },
  { id: 'github', label: 'GitHub' },
  { id: 'postman', label: 'Postman' },
  { id: 'vercel', label: 'Vercel' },
  { id: 'railway', label: 'Railway' },
  { id: 'clerk', label: 'Clerk Auth' },
  { id: 'framer', label: 'Framer Motion' },
  { id: 'tanstack', label: 'TanStack Query' },
  { id: 'zustand', label: 'Zustand' },
  { id: 'convex', label: 'Convex' },
  { id: 'groq', label: 'Groq AI' },
  { id: 'lucide', label: 'Lucide Icons' },
  { id: 'recharts', label: 'Recharts' },
  { id: 'pwa', label: 'PWA' },
  { id: 'leaflet', label: 'Leaflet' },
  { id: 'jwt', label: 'JWT / Simple JWT' },
  { id: 'sqlalchemy', label: 'SQLAlchemy' },
  { id: 'paymongo', label: 'PayMongo' },
  { id: 'netlify', label: 'Netlify' },
  { id: 'cloudflare', label: 'Cloudflare' },
  { id: 'vite', label: 'Vite' },
  { id: 'webpack', label: 'Webpack' },
  { id: 'npm', label: 'npm' },
  { id: 'figma', label: 'Figma' },
  { id: 'flutter', label: 'Flutter' },
  { id: 'dart', label: 'Dart' },
  { id: 'jupyter', label: 'Jupyter' }
]

// Render an icon based on key or raw skill text
export const renderTechIcon = (nameOrKey = '', explicitIcon = null, size = 'w-5 h-5') => {
  const query = (explicitIcon && explicitIcon !== 'auto') 
    ? explicitIcon.toLowerCase() 
    : (typeof nameOrKey === 'string' ? nameOrKey : nameOrKey?.name || '').toLowerCase().replace(/[^a-z0-9]/g, '')

  // Specific AI & Developer CLI / Agent Tools
  if (query.includes('pytorch')) return <SiPytorch className={`${size} text-orange-600`} />
  if (query.includes('openai') || query.includes('chatgpt')) return <SiOpenai className={`${size} text-emerald-600 dark:text-emerald-400`} />
  if (query.includes('claude') || query.includes('anthropic')) return <SiAnthropic className={`${size} text-amber-700 dark:text-amber-500`} />
  if (query.includes('antigravity') || query.includes('googleantigravity')) return <SiGoogle className={`${size} text-blue-500`} />
  if (query.includes('openrouter')) return <TbRouter className={`${size} text-purple-500`} />
  if (query.includes('opencode')) return <TbTerminal2 className={`${size} text-sky-500`} />
  if (query.includes('kilocode')) return <TbPrompt className={`${size} text-indigo-500`} />
  if (query.includes('teams') || query.includes('microsoftteams')) return <TbBrandTeams className={`${size} text-indigo-600 dark:text-indigo-400`} />

  // Frontend Libraries & Modern Ecosystem
  if (query.includes('tanstack') || query.includes('reactquery') || query.includes('query')) return <SiReactquery className={`${size} text-rose-500`} />
  if (query.includes('zustand')) return <RiBearSmileLine className={`${size} text-amber-600 dark:text-amber-400`} />
  if (query.includes('clerk')) return <SiClerk className={`${size} text-indigo-500 dark:text-indigo-400`} />
  if (query.includes('framer') || query.includes('framermotion')) return <SiFramer className={`${size} text-sky-500`} />
  if (query.includes('recharts') || query.includes('chartjs')) return <SiChartdotjs className={`${size} text-rose-400`} />
  if (query.includes('lucide')) return <TbSparkles className={`${size} text-pink-500`} />
  if (query.includes('convex')) return <TbCloudComputing className={`${size} text-orange-500`} />
  if (query.includes('groq')) return <TbCpu className={`${size} text-amber-500`} />
  if (query.includes('pwa')) return <SiPwa className={`${size} text-purple-600 dark:text-purple-400`} />
  if (query.includes('leaflet')) return <SiLeaflet className={`${size} text-emerald-600`} />
  if (query.includes('jwt') || query.includes('simplejwt')) return <SiJsonwebtokens className={`${size} text-fuchsia-600 dark:text-fuchsia-400`} />
  if (query.includes('google') || query.includes('identity')) return <SiGoogle className={`${size} text-blue-500`} />
  if (query.includes('responsive')) return <TbDeviceLaptop className={`${size} text-sky-500`} />
  if (query.includes('datamanagement')) return <TbDatabase className={`${size} text-emerald-500`} />
  if (query.includes('paymongo')) return <TbCreditCard className={`${size} text-teal-600 dark:text-teal-400`} />

  // Cloud & Hosting
  if (query.includes('railway')) return <SiRailway className={`${size} text-purple-700 dark:text-purple-300`} />
  if (query.includes('vercel')) return <SiVercel className={`${size} text-slate-900 dark:text-slate-100`} />
  if (query.includes('netlify')) return <SiNetlify className={`${size} text-teal-500`} />
  if (query.includes('cloudflare')) return <SiCloudflare className={`${size} text-amber-500`} />

  // Web & Core Stack
  if (query.includes('javascript') || query === 'js') return <SiJavascript className={`${size} text-yellow-500`} />
  if (query.includes('typescript') || query === 'ts') return <SiTypescript className={`${size} text-blue-500`} />
  if (query.includes('next')) return <SiNextdotjs className={`${size} text-slate-900 dark:text-slate-100`} />
  if (query.includes('react')) return <SiReact className={`${size} text-cyan-500`} />
  if (query.includes('vue')) return <SiVuedotjs className={`${size} text-emerald-500`} />
  if (query.includes('angular')) return <SiAngular className={`${size} text-red-600`} />
  if (query.includes('svelte')) return <SiSvelte className={`${size} text-orange-600`} />
  if (query.includes('tailwind')) return <SiTailwindcss className={`${size} text-sky-400`} />
  if (query.includes('html')) return <SiHtml5 className={`${size} text-orange-500`} />
  if (query.includes('css')) return <SiCss3 className={`${size} text-blue-500`} />
  if (query.includes('bootstrap')) return <SiBootstrap className={`${size} text-purple-600`} />
  if (query.includes('sass')) return <SiSass className={`${size} text-pink-500`} />
  if (query.includes('webpack')) return <SiWebpack className={`${size} text-blue-400`} />
  if (query.includes('vite')) return <SiVite className={`${size} text-purple-500`} />
  if (query.includes('node')) return <SiNodedotjs className={`${size} text-emerald-500`} />
  if (query.includes('express')) return <SiExpress className={`${size} text-slate-800 dark:text-slate-200`} />
  if (query.includes('nest')) return <SiNestjs className={`${size} text-red-600`} />
  if (query.includes('fastapi')) return <SiFastapi className={`${size} text-teal-500`} />
  if (query.includes('django')) return <SiDjango className={`${size} text-emerald-800 dark:text-emerald-400`} />
  if (query.includes('flask')) return <SiFlask className={`${size} text-slate-800 dark:text-slate-200`} />
  if (query.includes('python')) return <SiPython className={`${size} text-amber-500`} />
  if (query.includes('sqlalchemy')) return <SiSqlalchemy className={`${size} text-red-600`} />
  if (query.includes('php')) return <SiPhp className={`${size} text-indigo-400`} />
  if (query.includes('go') || query === 'golang') return <SiGo className={`${size} text-cyan-500`} />
  if (query.includes('rust')) return <SiRust className={`${size} text-orange-700 dark:text-orange-400`} />
  if (query.includes('ruby')) return <SiRuby className={`${size} text-red-600`} />
  if (query.includes('mysql')) return <SiMysql className={`${size} text-blue-600`} />
  if (query.includes('sqlite')) return <SiSqlite className={`${size} text-sky-600`} />
  if (query.includes('mongo')) return <SiMongodb className={`${size} text-emerald-600`} />
  if (query.includes('postgres')) return <SiPostgresql className={`${size} text-indigo-500`} />
  if (query.includes('redis')) return <SiRedis className={`${size} text-red-600`} />
  if (query.includes('prisma')) return <SiPrisma className={`${size} text-slate-900 dark:text-slate-100`} />
  if (query.includes('graphql')) return <SiGraphql className={`${size} text-pink-600`} />
  if (query.includes('aws') || query.includes('amazon')) return <SiAmazonwebservices className={`${size} text-amber-600`} />
  if (query.includes('supabase')) return <SiSupabase className={`${size} text-emerald-500`} />
  if (query.includes('firebase')) return <SiFirebase className={`${size} text-amber-500`} />
  if (query.includes('redux')) return <SiRedux className={`${size} text-purple-600`} />
  if (query.includes('docker')) return <SiDocker className={`${size} text-blue-500`} />
  if (query.includes('kubernetes') || query === 'k8s') return <SiKubernetes className={`${size} text-blue-600`} />
  if (query.includes('linux')) return <SiLinux className={`${size} text-yellow-600`} />
  if (query.includes('git') && !query.includes('github')) return <SiGit className={`${size} text-orange-600`} />
  if (query.includes('github')) return <SiGithub className={`${size} text-slate-800 dark:text-slate-200`} />
  if (query.includes('postman')) return <SiPostman className={`${size} text-orange-500`} />
  if (query.includes('npm')) return <SiNpm className={`${size} text-red-500`} />
  if (query.includes('figma')) return <SiFigma className={`${size} text-purple-500`} />
  if (query.includes('flutter')) return <SiFlutter className={`${size} text-sky-500`} />
  if (query.includes('dart')) return <SiDart className={`${size} text-blue-500`} />
  if (query.includes('jupyter')) return <SiJupyter className={`${size} text-orange-600`} />
  if (query.includes('jquery')) return <SiJquery className={`${size} text-blue-600`} />

  return <VscCode className={`${size} text-slate-400`} />
}
