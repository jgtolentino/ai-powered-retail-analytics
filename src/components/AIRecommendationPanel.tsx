import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Brain, Lightbulb, TrendingUp } from 'lucide-react'

interface AIRecommendationPanelProps {
  data: Array<{ id: string; title: string; info: string[]; toggles: string[]; viz: JSX.Element }>
}

export default function AIRecommendationPanel({ data }: AIRecommendationPanelProps) {
  // Generate AI insights based on the data sections
  const generateRecommendations = () => {
    // This would typically call an AI service or analyze the data
    return [
      {
        type: 'insight',
        icon: Brain,
        title: 'Data Pattern Detected',
        description: 'Based on your current data sections, we recommend focusing on high-value customer segments.',
        priority: 'high'
      },
      {
        type: 'suggestion',
        icon: Lightbulb,
        title: 'Optimization Opportunity',
        description: 'Consider adjusting your inventory mix based on seasonal trends identified in the data.',
        priority: 'medium'
      },
      {
        type: 'prediction',
        icon: TrendingUp,
        title: 'Market Forecast',
        description: 'Projected 15% increase in demand for category X based on historical patterns.',
        priority: 'high'
      }
    ]
  }

  const recommendations = generateRecommendations()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Recommendations & Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.priority === 'high'
                    ? 'border-l-red-500 bg-red-50'
                    : 'border-l-yellow-500 bg-yellow-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 mt-0.5 text-gray-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    <span
                      className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                        rec.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {rec.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}