import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { user_message } = req.body
  if (!user_message || !user_message.trim()) {
    return res.status(400).json({ error: 'Missing user_message' })
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
    const openRouterApiKey = process.env.OPENROUTER_API_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Server environment variables are missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
    }

    if (!openRouterApiKey) {
      throw new Error('OPENROUTER_API_KEY environment variable is not configured')
    }

    // 1. Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // 2. Fetch the latest portfolio content to build the context prompt dynamically (RAG)
    const { data: portfolioRow, error: dbError } = await supabase
      .from('portfolio_content')
      .select('content')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (dbError) {
      throw new Error(`Database fetch failed: ${dbError.message}`)
    }

    const content = portfolioRow?.content || {}
    const name = content.hero?.name || 'Clarence Timothy Sadiaza'
    const title = content.hero?.title || 'Software Engineer'
    const about = (content.about?.paragraphs || []).join(' ')
    const skills = JSON.stringify(content.skills || {})
    const experience = JSON.stringify(content.experience || [])
    const projects = JSON.stringify(content.projects || [])
    const certifications = JSON.stringify(content.certifications || [])
    const email = content.hero?.email || 'sadiazaclarence@gmail.com'

    // 3. Format the RAG system prompt
    const systemPrompt = `You are the AI Assistant chatbot on Clarence Timothy Sadiaza's portfolio website. 
Answer questions briefly and professionally on behalf of Clarence. Keep responses under 3 sentences. If you don't know something or if it's not in the resume, say you will check and let him know, or tell them to email him at ${email}.
Resume Details:
- Name: ${name}
- Title: ${title}
- About: ${about}
- Technologies / Skills: ${skills}
- Experience: ${experience}
- Projects: ${projects}
- Certifications: ${certifications}
- Contact Email: ${email}`

    // 4. Send request to OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://clarence-sadiaza.vercel.app",
        "X-Title": "Clarence Sadiaza Portfolio"
      },
      body: JSON.stringify({
        model: "poolside/laguna-m.1:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: user_message }
        ]
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`OpenRouter API failed with status ${response.status}: ${errText}`)
    }

    const data = await response.json()
    const botResponse = data.choices?.[0]?.message?.content || ''

    return res.status(200).json({ response: botResponse })
  } catch (error) {
    console.error('Serverless Chatbot Proxy Error:', error)
    return res.status(500).json({ error: error.message })
  }
}
