import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface ReferenceSectionProps {
  title: string
  items: string[]
  toggles: string[]
  onShowCharts?: () => void
}

const ReferenceSection: React.FC<ReferenceSectionProps> = ({ 
  title, 
  items, 
  toggles, 
  onShowCharts 
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bullet list of items */}
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-blue-500 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Toggle controls */}
        {toggles.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {toggles.map((toggle, index) => (
                <button
                  key={index}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                >
                  {toggle}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Show me charts button */}
        <button
          onClick={onShowCharts}
          className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
        >
          Show me charts
          <span className="text-lg">▶︎</span>
        </button>
      </CardContent>
    </Card>
  )
}

interface ReferencePanelProps {
  onTransactionCharts?: () => void
  onConsumerCharts?: () => void
}

const ReferencePanel: React.FC<ReferencePanelProps> = ({ 
  onTransactionCharts, 
  onConsumerCharts 
}) => {
  const transactionItems = [
    "Location, Time of day",
    "Product/category breakdown",
    "% breakdown per product/category", 
    "Volume (units) per transaction",
    "# of items per transaction",
    "Average basket value",
    "SKU-level detail & substitution patterns"
  ]

  const consumerItems = [
    "Gender (inferred)",
    "Age bracket (audio+video inference)", 
    "Location mapping"
  ]

  const transactionToggles = ["Time", "Region", "Category"]
  const consumerToggles = ["Gender", "Age", "Location"]

  return (
    <div className="space-y-6">
      {/* Top-level title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">REFERENCE</h2>
        <p className="text-sm text-gray-600 mt-1">
          Info collected from the actual recording
        </p>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReferenceSection
          title="Transaction Insights"
          items={transactionItems}
          toggles={transactionToggles}
          onShowCharts={onTransactionCharts}
        />
        
        <ReferenceSection
          title="Consumer Profiling"
          items={consumerItems}
          toggles={consumerToggles}
          onShowCharts={onConsumerCharts}
        />
      </div>
    </div>
  )
}

export default ReferencePanel