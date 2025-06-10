import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: LucideIcon
  iconColor?: string
  trend?: 'up' | 'down' | 'neutral'
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon: Icon,
  iconColor = "text-blue-600",
  trend = 'neutral'
}: MetricCardProps) {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
  const trendBg = trend === 'up' ? 'bg-green-50' : trend === 'down' ? 'bg-red-50' : 'bg-gray-50'

  return (
    <div className="relative overflow-hidden rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50" />
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          </div>
          {Icon && (
            <div className={cn("rounded-full p-3 bg-gray-50", iconColor)}>
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
        
        {change !== undefined && (
          <div className="mt-4 flex items-center">
            <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", trendBg, trendColor)}>
              {change > 0 && '+'}
              {change}%
            </span>
            <span className="ml-2 text-xs text-gray-500">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  )
}