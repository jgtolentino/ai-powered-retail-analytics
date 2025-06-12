import React from 'react'
import PageLayout from '../components/PageLayout'
import DataSection from '../components/DataSection'
import AIRecommendationPanel from '../components/AIRecommendationPanel'
import useRecommendationsData from '../hooks/useRecommendationsData'

export default function AIRecommendationsPage() {
  // fetch real data via Supabase RPC or queries
  const { sections, loading, error } = useRecommendationsData()

  if (loading) return <PageLayout title="AI Recommendation Panel">Loading…</PageLayout>
  if (error)   return <PageLayout title="AI Recommendation Panel">Error loading data</PageLayout>

  return (
    <PageLayout title="AI Recommendation Panel">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {sections.map((sec) => (
          <DataSection
            key={sec.id}
            title={sec.title}
            info={sec.info}
            toggles={sec.toggles}
            viz={sec.viz} /* viz components receive real data inside hook */
          />
        ))}
      </div>
      <div className="mt-8">
        <AIRecommendationPanel data={sections} />
      </div>
    </PageLayout>
  )
}