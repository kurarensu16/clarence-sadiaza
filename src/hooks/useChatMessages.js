import { useState, useEffect, useRef } from 'react'
import { getChatMessages, sendChatMessage, subscribeToChatMessages } from '../services/chatService'

// Get unique conversation ID from sessionStorage (unique per tab)
const getConversationId = () => {
  const storageKey = 'portfolio_chat_conversation_id'
  let conversationId = sessionStorage.getItem(storageKey)
  
  if (!conversationId) {
    conversationId = `chat-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    sessionStorage.setItem(storageKey, conversationId)
  }
  
  return conversationId
}

export const useChatMessages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const subscriptionRef = useRef(null)
  const hasLoadedRef = useRef(false)
  const conversationIdRef = useRef(getConversationId())

  useEffect(() => {
    let isMounted = true

    // Load initial messages only once
    const loadMessages = async () => {
      if (hasLoadedRef.current) {
        return
      }
      
      try {
        setLoading(true)
        const data = await getChatMessages(conversationIdRef.current)
        if (isMounted) {
          setMessages(prev => {
            if (prev.length === 0) {
              return data || []
            } else {
              // Merge loaded database messages with any unsaved local messages
              const existingIds = new Set(prev.map(msg => msg.id))
              const newMessages = (data || []).filter(msg => !existingIds.has(msg.id))
              if (newMessages.length > 0) {
                return [...prev, ...newMessages].sort((a, b) => 
                  new Date(a.created_at) - new Date(b.created_at)
                )
              }
              return prev
            }
          })
          hasLoadedRef.current = true
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
          console.error('Failed to load chat messages:', err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadMessages()

    // Subscribe to new messages for this specific conversation
    subscriptionRef.current = subscribeToChatMessages((newMessage) => {
      if (!isMounted) return
      
      // Only process messages for this conversation
      if (newMessage && newMessage.conversation_id !== conversationIdRef.current) {
        return
      }
      
      // Add message if it's not already in local state
      setMessages(prev => {
        const exists = prev.some(msg => msg.id === newMessage.id)
        if (exists) return prev
        return [...prev, newMessage]
      })
    }, conversationIdRef.current)

    return () => {
      isMounted = false
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [])

  const sendMessage = async (message, sender = 'user') => {
    // Generate a temporary ID for optimistic update
    const tempId = `temp-${Date.now()}-${Math.random()}`
    const optimisticMessage = {
      id: tempId,
      conversation_id: conversationIdRef.current,
      sender: sender,
      message: message,
      status: 'sent',
      created_at: new Date().toISOString()
    }

    try {
      // 1. Add optimistic message immediately for real-time responsiveness
      setMessages(prev => {
        if (prev.some(msg => msg.id === tempId)) return prev
        return [...prev, optimisticMessage]
      })

      // 2. Save the message to Supabase
      const newMessage = await sendChatMessage(message, sender, conversationIdRef.current)
      
      if (!newMessage || !newMessage.id) {
        throw new Error('Failed to send message')
      }

      // 3. Replace the optimistic message with the database record
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== tempId)
        const alreadyExists = filtered.some(msg => msg.id === newMessage.id)
        if (!alreadyExists) {
          return [...filtered, newMessage]
        }
        return filtered
      })

      return newMessage
    } catch (err) {
      console.error('Error sending message:', err)
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(msg => msg.id !== tempId))
      setError(err.message)
      throw err
    }
  }

  return { messages, loading, error, sendMessage }
}