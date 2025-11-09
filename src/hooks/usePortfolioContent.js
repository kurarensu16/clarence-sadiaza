import { useState, useEffect, useRef } from 'react'
import { getPortfolioContent, updatePortfolioContent, subscribeToPortfolioContent } from '../services/portfolioService'

export const usePortfolioContent = () => {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const subscriptionRef = useRef(null)

  useEffect(() => {
    // Load initial content
    const loadContent = async () => {
      try {
        setLoading(true)
        const data = await getPortfolioContent()
        setContent(data)
        setError(null)
      } catch (err) {
        // If user is not authenticated, that's okay for public portfolio view
        if (err.message !== 'User not authenticated') {
          setError(err.message)
          console.error('Failed to load portfolio content:', err)
        }
      } finally {
        setLoading(false)
      }
    }

    loadContent()

    // Subscribe to real-time updates
    const setupSubscription = async () => {
      try {
        subscriptionRef.current = await subscribeToPortfolioContent((updatedContent) => {
          if (updatedContent) {
            setContent(updatedContent)
          }
        })
      } catch (err) {
        // Subscription failed (likely user not authenticated), that's okay
        console.warn('Could not set up portfolio content subscription:', err)
      }
    }

    setupSubscription()

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [])

  const updateContent = async (newContent) => {
    try {
      await updatePortfolioContent(newContent)
      setContent(newContent)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return { content, loading, error, updateContent }
}