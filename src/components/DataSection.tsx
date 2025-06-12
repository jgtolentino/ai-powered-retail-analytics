import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface DataSectionProps {
  title: string
  info: string[]
  toggles: string[]
  viz: JSX.Element
}

export default function DataSection({ title, info, toggles, viz }: DataSectionProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info section */}
        {info.length > 0 && (
          <div className="space-y-2">
            {info.map((item, index) => (
              <p key={index} className="text-sm text-gray-600">
                {item}
              </p>
            ))}
          </div>
        )}

        {/* Toggle controls */}
        {toggles.length > 0 && (
          <div className="space-y-2">
            {toggles.map((toggle, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{toggle}</span>
              </label>
            ))}
          </div>
        )}

        {/* Visualization component */}
        <div className="mt-4">
          {viz}
        </div>
      </CardContent>
    </Card>
  )
}