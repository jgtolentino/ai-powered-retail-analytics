import { useState, useMemo } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { Clock, MapPin, Package2, Calendar } from 'lucide-react'

interface TransactionTrendsProps {
  data: {
    transactions: any[]
    brands: any[]
    products: any[]
  }
}

export default function TransactionTrends({ data }: TransactionTrendsProps) {
  const [timeView, setTimeView] = useState<'hourly' | 'daily' | 'weekly'>('daily')
  const [locationView, setLocationView] = useState<'region' | 'city'>('region')

  // Time series analysis
  const timeSeriesData = useMemo(() => {
    if (!data.transactions) return []

    const groupedData = new Map()

    data.transactions.forEach(transaction => {
      const date = new Date(transaction.created_at)
      let key: string

      switch (timeView) {
        case 'hourly':
          key = `${date.getHours()}:00`
          break
        case 'weekly':
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          key = weekStart.toLocaleDateString('en-PH')
          break
        default: // daily
          key = date.toLocaleDateString('en-PH')
      }

      if (!groupedData.has(key)) {
        groupedData.set(key, {
          period: key,
          transactions: 0,
          revenue: 0,
          avgAmount: 0
        })
      }

      const existing = groupedData.get(key)
      existing.transactions += 1
      existing.revenue += transaction.total_amount || 0
      existing.avgAmount = existing.revenue / existing.transactions
    })

    return Array.from(groupedData.values())
      .sort((a, b) => a.period.localeCompare(b.period))
      .slice(-14) // Last 14 periods
  }, [data.transactions, timeView])

  // Location analysis
  const locationData = useMemo(() => {
    if (!data.transactions) return []

    const locationMap = new Map()

    data.transactions.forEach(transaction => {
      if (!transaction.store_location) return

      let location: string
      if (locationView === 'region') {
        // Extract region from store_location
        const parts = transaction.store_location.split(',')
        location = parts[0]?.trim() || 'Unknown'
      } else {
        // Extract city
        const parts = transaction.store_location.split(',')
        location = parts[1]?.trim() || parts[0]?.trim() || 'Unknown'
      }

      if (!locationMap.has(location)) {
        locationMap.set(location, {
          location,
          transactions: 0,
          revenue: 0,
          customers: new Set()
        })
      }

      const existing = locationMap.get(location)
      existing.transactions += 1
      existing.revenue += transaction.total_amount || 0
      if (transaction.device_id) {
        existing.customers.add(transaction.device_id)
      }
    })

    return Array.from(locationMap.values())
      .map(item => ({
        ...item,
        customers: item.customers.size
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8)
  }, [data.transactions, locationView])

  // Peak hours analysis
  const peakHoursData = useMemo(() => {
    if (!data.transactions) return []

    const hourlyMap = new Map()

    data.transactions.forEach(transaction => {
      const hour = new Date(transaction.created_at).getHours()
      const hourLabel = `${hour}:00`

      if (!hourlyMap.has(hourLabel)) {
        hourlyMap.set(hourLabel, {
          hour: hourLabel,
          transactions: 0,
          revenue: 0
        })
      }

      const existing = hourlyMap.get(hourLabel)
      existing.transactions += 1
      existing.revenue += transaction.total_amount || 0
    })

    return Array.from(hourlyMap.values())
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour))
  }, [data.transactions])

  // Weekend vs Weekday analysis
  const weekendData = useMemo(() => {
    if (!data.transactions) return []

    const weekendMap = { weekend: 0, weekday: 0 }
    const weekendRevenue = { weekend: 0, weekday: 0 }

    data.transactions.forEach(transaction => {
      const dayOfWeek = new Date(transaction.created_at).getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

      if (isWeekend) {
        weekendMap.weekend += 1
        weekendRevenue.weekend += transaction.total_amount || 0
      } else {
        weekendMap.weekday += 1
        weekendRevenue.weekday += transaction.total_amount || 0
      }
    })

    return [
      { 
        name: 'Weekday', 
        transactions: weekendMap.weekday, 
        revenue: weekendRevenue.weekday,
        color: '#3B82F6'
      },
      { 
        name: 'Weekend', 
        transactions: weekendMap.weekend, 
        revenue: weekendRevenue.weekend,
        color: '#10B981'
      }
    ]
  }, [data.transactions])

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      
      {/* Time View Controls */}
      <div className="flex flex-wrap gap-2">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['hourly', 'daily', 'weekly'] as const).map((view) => (
            <Button
              key={view}
              variant={timeView === view ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeView(view)}
              className="text-xs"
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['region', 'city'] as const).map((view) => (
            <Button
              key={view}
              variant={locationView === view ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLocationView(view)}
              className="text-xs"
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Time Series Chart */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3 flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          {timeView.charAt(0).toUpperCase() + timeView.slice(1)} Trends
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip 
              formatter={(value: any, name: string) => [
                name === 'revenue' ? `₱${value.toLocaleString()}` : value.toLocaleString(),
                name === 'revenue' ? 'Revenue' : name === 'transactions' ? 'Transactions' : 'Avg Amount'
              ]}
            />
            <Line type="monotone" dataKey="transactions" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Location Analysis */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Top {locationView === 'region' ? 'Regions' : 'Cities'}
        </h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={locationData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" fontSize={10} />
            <YAxis dataKey="location" type="category" width={80} fontSize={10} />
            <Tooltip formatter={(value: any) => [`₱${value.toLocaleString()}`, 'Revenue']} />
            <Bar dataKey="revenue" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Peak Hours & Weekend Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Peak Hours */}
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Peak Hours
          </h4>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={peakHoursData.slice(6, 22)}>
              <XAxis dataKey="hour" fontSize={8} />
              <YAxis fontSize={8} />
              <Tooltip formatter={(value: any) => [value, 'Transactions']} />
              <Bar dataKey="transactions" fill="#F59E0B" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Weekend vs Weekday */}
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <Package2 className="h-4 w-4 mr-2" />
            Weekend vs Weekday
          </h4>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={weekendData}
                cx="50%"
                cy="50%"
                outerRadius={40}
                innerRadius={20}
                dataKey="transactions"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                fontSize={10}
                paddingAngle={2}
              >
                {weekendData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [value, 'Transactions']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

      </div>

    </div>
  )
}