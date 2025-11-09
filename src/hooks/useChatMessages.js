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
  const messageIdsRef = useRef(new Set())
  const hasLoadedRef = useRef(false)
  const conversationIdRef = useRef(getConversationId())

  useEffect(() => {
    let isMounted = true

    // Load initial messages only once
    const loadMessages = async () => {
      if (hasLoadedRef.current) {
        console.log('Messages already loaded, skipping')
        return
      }
      
      try {
        setLoading(true)
        const data = await getChatMessages(conversationIdRef.current)
        console.log('Loaded messages from database:', data?.length || 0)
        if (isMounted) {
          // Only set messages if we don't have any, or merge with existing
          setMessages(prev => {
            if (prev.length === 0) {
              // No existing messages, use database data
              if (data && data.length > 0) {
                messageIdsRef.current = new Set(data.map(msg => msg.id))
                console.log('Tracked message IDs:', messageIdsRef.current.size)
                return data
              }
              return []
            } else {
              // We have existing messages, merge with database
              const existingIds = new Set(prev.map(msg => msg.id))
              const newMessages = (data || []).filter(msg => !existingIds.has(msg.id))
              if (newMessages.length > 0) {
                console.log('Merging', newMessages.length, 'new messages')
                newMessages.forEach(msg => messageIdsRef.current.add(msg.id))
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
      
      console.log('Subscription received message:', newMessage)
      
      // Only process messages for this conversation
      if (newMessage && newMessage.conversation_id !== conversationIdRef.current) {
        console.log('Message from different conversation, ignoring')
        return
      }
      
      // Prevent duplicate messages
      if (newMessage && newMessage.id && !messageIdsRef.current.has(newMessage.id)) {
        messageIdsRef.current.add(newMessage.id)
        setMessages(prev => {
          // Check if message already exists
          const exists = prev.some(msg => msg.id === newMessage.id)
          if (exists) {
            console.log('Message already exists, skipping:', newMessage.id)
            return prev
          }
          console.log('Adding new message from subscription:', newMessage.id)
          return [...prev, newMessage]
        })
      } else {
        console.log('Skipping duplicate or invalid message:', newMessage)
      }
    }, conversationIdRef.current)

    return () => {
      isMounted = false
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [])

  const sendMessage = async (message, sender = 'user') => {
    try {
      console.log('Sending message:', { message, sender })
      
      // Optimistically add message to state immediately
      const tempId = `temp-${Date.now()}-${Math.random()}`
      const optimisticMessage = {
        id: tempId,
        conversation_id: conversationId,
        sender: sender,
        message: message,
        status: 'sent',
        created_at: new Date().toISOString()
      }
      
      // Add optimistic message immediately
      setMessages(prev => {
        // Check if already added
        if (prev.some(msg => msg.id === tempId)) {
          console.log('Optimistic message already added')
          return prev
        }
        console.log('Adding optimistic message:', tempId)
        return [...prev, optimisticMessage]
      })
      messageIdsRef.current.add(tempId)

      // Send to server with unique conversation ID
      const newMessage = await sendChatMessage(message, sender, conversationIdRef.current)
      console.log('Server response:', newMessage)
      
      if (!newMessage || !newMessage.id) {
        throw new Error('Failed to send message')
      }

      // Replace optimistic message with real one
      // The subscription will also receive this, but we handle it here to ensure immediate update
      setMessages(prev => {
        // Remove temp message
        const filtered = prev.filter(msg => msg.id !== tempId)
        messageIdsRef.current.delete(tempId)
        console.log('Removed temp message, current count:', filtered.length)
        
        // Add real message if not already there (subscription might have already added it)
        if (!messageIdsRef.current.has(newMessage.id)) {
          messageIdsRef.current.add(newMessage.id)
          // Check if subscription already added it
          const alreadyExists = filtered.some(msg => msg.id === newMessage.id)
          if (!alreadyExists) {
            console.log('Adding real message:', newMessage.id)
            return [...filtered, newMessage]
          } else {
            console.log('Real message already exists from subscription')
          }
        } else {
          console.log('Real message ID already tracked')
        }
        return filtered
      })

      return newMessage
    } catch (err) {
      console.error('Error sending message:', err)
      // Remove optimistic message on error
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.id?.startsWith('temp-'))
        // Also remove any temp IDs from tracking
        messageIdsRef.current.forEach(id => {
          if (id.startsWith('temp-')) {
            messageIdsRef.current.delete(id)
          }
        })
        return filtered
      })
      setError(err.message)
      throw err
    }
  }

  return { messages, loading, error, sendMessage }
}