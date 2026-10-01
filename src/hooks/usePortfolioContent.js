import { useState, useEffect } from 'react'
import { getPortfolioContent, updatePortfolioContent, subscribeToPortfolioContent } from '../services/portfolioService'

const STORAGE_KEY = 'portfolio_cached_content_v1'

// Global in-memory cache shared across the entire SPA
let globalCache = null
let isFetching = false
let activeSubscription = null
const listeners = new Set()

const notifyListeners = (newData) => {
  globalCache = newData
  try {
    if (newData) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
    }
  } catch (e) {
    // Ignore storage quota or disabled storage errors
  }
  listeners.forEach(listener => {
    try {
      listener(newData)
    } catch (e) {
      // Ignore individual listener failures
    }
  })
}

const getInitialData = () => {
  if (globalCache) return globalCache
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      globalCache = JSON.parse(raw)
      return globalCache
    }
  } catch (e) {
    // Ignore sessionStorage retrieval errors
  }
  return null
}

const fetchLatestContent = async () => {
  if (isFetching) return
  isFetching = true
  try {
    const data = await getPortfolioContent()
    if (data) {
      notifyListeners(data)
    }
    return data
  } catch (err) {
    if (err.message !== 'User not authenticated') {
      console.error('Failed to load portfolio content:', err)
    }
    throw err
  } finally {
    isFetching = false
  }
}

const ensureSubscription = async () => {
  if (activeSubscription) return
  try {
    activeSubscription = await subscribeToPortfolioContent((updatedContent) => {
      if (updatedContent) {
        notifyListeners(updatedContent)
      }
    })
  } catch (err) {
    console.warn('Could not set up portfolio content subscription:', err)
  }
}

export const usePortfolioContent = () => {
  const [content, setContent] = useState(() => getInitialData())
  const [loading, setLoading] = useState(() => !getInitialData())
  const [error, setError] = useState(null)

  useEffect(() => {
    // Subscribe component to central cache notifications
    const handleUpdate = (newData) => {
      setContent(newData)
      setLoading(false)
      setError(null)
    }

    listeners.add(handleUpdate)

    // Ensure real-time websocket subscription is active across routes
    ensureSubscription()

    if (!globalCache) {
      // Cold boot: no cache available yet, fetch with loading indicator
      setLoading(true)
      fetchLatestContent()
        .then(() => {
          setLoading(false)
        })
        .catch(err => {
          if (err?.message !== 'User not authenticated') {
            setError(err?.message)
          }
          setLoading(false)
        })
    } else {
      // Stale-While-Revalidate: content is already cached and displayed instantly (0ms delay!)
      // Silently revalidate in background without triggering skeleton screen
      fetchLatestContent().catch(() => {
        // Silent failure in background is fine since we already have cached data
      })
    }

    return () => {
      listeners.delete(handleUpdate)
    }
  }, [])

  const updateContent = async (newContent) => {
    try {
      // Optimistically update memory and storage caches + notify all active views instantly
      notifyListeners(newContent)
      setContent(newContent)

      // Persist changes to Supabase
      await updatePortfolioContent(newContent)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return { content, loading, error, updateContent }
}