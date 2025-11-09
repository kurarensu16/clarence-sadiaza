import { supabase } from '../lib/supabase'

const CONVERSATION_ID = 'portfolio-chat'

// Get chat messages for portfolio chat
export const getChatMessages = async (limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', CONVERSATION_ID)
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching chat messages:', error)
    throw error
  }
}

// Send a chat message
export const sendChatMessage = async (message, sender = 'user') => {
  try {
    // Try to get user, but don't require authentication (for public chat)
    let user = null
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      user = authUser
    } catch (err) {
      // User is not authenticated, that's fine for public chat
      console.log('Sending message as unauthenticated user')
    }
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: CONVERSATION_ID,
        sender: sender,
        message: message,
        status: 'sent',
        user_id: user?.id || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting chat message:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error sending chat message:', error)
    throw error
  }
}

// Subscribe to new chat messages
export const subscribeToChatMessages = (callback) => {
  const channelName = `chat_messages_${CONVERSATION_ID}_${Date.now()}`
  
  const subscription = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `conversation_id=eq.${CONVERSATION_ID}`
      },
      (payload) => {
        console.log('Chat subscription received:', payload)
        if (payload.new) {
          callback(payload.new)
        }
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Chat subscription active')
      } else if (status === 'CHANNEL_ERROR') {
        console.error('Chat subscription error')
      } else if (status === 'TIMED_OUT') {
        console.error('Chat subscription timed out')
      } else if (status === 'CLOSED') {
        console.log('Chat subscription closed')
      }
    })

  return subscription
}

// Update message status (e.g., mark as read)
export const updateMessageStatus = async (messageId, status) => {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .update({ status })
      .eq('id', messageId)

    if (error) throw error
  } catch (error) {
    console.error('Error updating message status:', error)
    throw error
  }
}