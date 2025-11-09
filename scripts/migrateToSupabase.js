import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrate() {
  try {
    // Read localStorage data (you'll need to export this first)
    const portfolioContent = JSON.parse(
      fs.readFileSync('./migration-data/portfolioContent.json', 'utf8')
    )
    const chatMessages = JSON.parse(
      fs.readFileSync('./migration-data/chatMessages.json', 'utf8')
    )

    // Get user ID (you'll need to provide this)
    const userId = process.env.USER_ID

    // Migrate portfolio content
    const { error: contentError } = await supabase
      .from('portfolio_content')
      .upsert({
        user_id: userId,
        content: portfolioContent
      })

    if (contentError) {
      console.error('Error migrating portfolio content:', contentError)
      return
    }

    // Migrate chat messages
    const messagesToInsert = chatMessages.map(msg => ({
      conversation_id: msg.conversationId || 'portfolio-chat',
      sender: msg.sender,
      message: msg.text,
      status: msg.status || 'sent',
      created_at: msg.timestamp,
      user_id: userId
    }))

    const { error: messagesError } = await supabase
      .from('chat_messages')
      .insert(messagesToInsert)

    if (messagesError) {
      console.error('Error migrating chat messages:', messagesError)
      return
    }

    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

migrate()