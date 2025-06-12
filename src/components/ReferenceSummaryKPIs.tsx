import React from 'react'
import { Card, CardContent } from './ui/card'

interface KPICardProps {
  label: string
  value: string
  className?: string
}

const KPICard: React.FC<KPICardProps> = ({ label, value, className = "" }) => {
  return (
    <Card className={`${className}`}>
      <CardContent className="p-4 text-center">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600 mt-1">{label}</div>
      </CardContent>
    </Card>
  )
}

interface ReferenceSummaryKPIsProps {
  totalTransactions?: number
  avgValue?: number
  avgUnits?: number
}

const ReferenceSummaryKPIs: React.FC<ReferenceSummaryKPIsProps> = ({
  totalTransactions = 18000,
  avgValue = 285.50,
  avgUnits = 4.2
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <KPICard
        label="Total Transactions"
        value={totalTransactions.toLocaleString()}
      />
      <KPICard
        label="Avg Basket Value"
        value={`₱${avgValue.toFixed(2)}`}
      />
      <KPICard
        label="Avg Units"
        value={avgUnits.toString()}
      />
    </div>
  )
}

export default ReferenceSummaryKPIs