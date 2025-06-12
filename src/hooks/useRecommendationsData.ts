import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function useRecommendationsData() {
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [sections, setSections] = useState<
    Array<{ id: string; title: string; info: string[]; toggles: string[]; viz: JSX.Element }>
  >([])

  useEffect(() => {
    async function fetchData() {
      try {
        // Call your Supabase RPC or view that returns all panel data
        const { data, error } = await supabase
          .rpc('get_ai_recommendation_sections')
        if (error) throw error
        setSections(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { sections, loading, error }
}