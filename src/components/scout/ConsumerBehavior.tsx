import { useState, useMemo } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import { Activity, CreditCard, Clock, ShoppingBag } from 'lucide-react'

interface ConsumerBehaviorProps {
  data: {
    transactions: any[]
    brands: any[]
    products: any[]
  }
}

export default function ConsumerBehavior({ data }: ConsumerBehaviorProps) {
  const [behaviorView, setBehaviorView] = useState<'patterns' | 'preferences' | 'frequency'>('patterns')

  // Purchase patterns analysis
  const purchasePatterns = useMemo(() => {
    if (!data.transactions) return []

    const deviceMap = new Map()

    data.transactions.forEach(transaction => {
      if (!transaction.device_id) return

      if (!deviceMap.has(transaction.device_id)) {
        deviceMap.set(transaction.device_id, {
          device_id: transaction.device_id,
          transactions: [],
          totalSpent: 0,
          avgAmount: 0,
          frequency: 0,
          preferredPayment: new Map(),
          timePreferences: new Map(),
          ageGroup: transaction.customer_age,
          gender: transaction.customer_gender
        })
      }

      const customer = deviceMap.get(transaction.device_id)
      customer.transactions.push(transaction)
      customer.totalSpent += transaction.total_amount || 0
      
      // Payment method preference
      const payment = transaction.payment_method || 'unknown'
      customer.preferredPayment.set(payment, (customer.preferredPayment.get(payment) || 0) + 1)
      
      // Time preference
      const hour = new Date(transaction.created_at).getHours()
      const timeSlot = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening'
      customer.timePreferences.set(timeSlot, (customer.timePreferences.get(timeSlot) || 0) + 1)
    })

    return Array.from(deviceMap.values())
      .map(customer => ({
        ...customer,
        frequency: customer.transactions.length,
        avgAmount: customer.totalSpent / customer.transactions.length,
        preferredPayment: customer.preferredPayment.size > 0 ? 
          (() => {
            const entries: [string, number][] = Array.from(customer.preferredPayment.entries())
            const sorted = entries.sort((a, b) => b[1] - a[1])
            return sorted.length > 0 ? sorted[0][0] : 'unknown'
          })() : 'unknown',
        preferredTime: customer.timePreferences.size > 0 ?
          (() => {
            const entries: [string, number][] = Array.from(customer.timePreferences.entries())
            const sorted = entries.sort((a, b) => b[1] - a[1])
            return sorted.length > 0 ? sorted[0][0] : 'unknown'
          })() : 'unknown'
      }))
      .filter(customer => customer.frequency > 1) // Only repeat customers
      .sort((a, b) => b.totalSpent - a.totalSpent)
  }, [data.transactions])

  // Payment method distribution
  const paymentMethodData = useMemo(() => {
    if (!data.transactions) return []

    const paymentMap = new Map()
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

    data.transactions.forEach(transaction => {
      const method = transaction.payment_method || 'Unknown'
      paymentMap.set(method, (paymentMap.get(method) || 0) + 1)
    })

    return Array.from(paymentMap.entries())
      .map(([method, count], index) => ({
        method,
        count,
        percentage: (count / data.transactions.length) * 100,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.count - a.count)
  }, [data.transactions])

  // Shopping time preferences
  const timePreferences = useMemo(() => {
    if (!data.transactions) return []

    const hourMap = new Map()

    data.transactions.forEach(transaction => {
      const hour = new Date(transaction.created_at).getHours()
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1)
    })

    return Array.from(hourMap.entries())
      .map(([hour, count]) => ({
        hour: `${hour}:00`,
        transactions: count,
        period: hour < 6 ? 'Late Night' : 
                hour < 12 ? 'Morning' :
                hour < 18 ? 'Afternoon' : 'Evening'
      }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour))
  }, [data.transactions])

  // Customer segmentation by behavior
  const customerSegments = useMemo(() => {
    const segments = {
      'High Value': { count: 0, avgSpent: 0, color: '#10B981' },
      'Frequent': { count: 0, avgSpent: 0, color: '#3B82F6' },
      'Occasional': { count: 0, avgSpent: 0, color: '#F59E0B' },
      'One-time': { count: 0, avgSpent: 0, color: '#EF4444' }
    }

    purchasePatterns.forEach(customer => {
      if (customer.totalSpent > 1000) {
        segments['High Value'].count += 1
        segments['High Value'].avgSpent += customer.totalSpent
      } else if (customer.frequency > 5) {
        segments['Frequent'].count += 1
        segments['Frequent'].avgSpent += customer.totalSpent
      } else if (customer.frequency > 1) {
        segments['Occasional'].count += 1
        segments['Occasional'].avgSpent += customer.totalSpent
      } else {
        segments['One-time'].count += 1
        segments['One-time'].avgSpent += customer.totalSpent
      }
    })

    return Object.entries(segments).map(([name, data]) => ({
      segment: name,
      customers: data.count,
      avgSpent: data.count > 0 ? data.avgSpent / data.count : 0,
      color: data.color
    })).filter(s => s.customers > 0)
  }, [purchasePatterns])

  // Basket size analysis
  const basketAnalysis = useMemo(() => {
    if (!data.transactions) return []

    const basketSizes = data.transactions.map(t => ({
      amount: t.total_amount || 0,
      age: t.customer_age || 0,
      gender: t.customer_gender || 'Unknown'
    })).filter(t => t.amount > 0)

    // Group by amount ranges
    const ranges = [
      { range: '₱0-100', min: 0, max: 100, count: 0, avgAge: 0, totalAge: 0 },
      { range: '₱101-300', min: 101, max: 300, count: 0, avgAge: 0, totalAge: 0 },
      { range: '₱301-500', min: 301, max: 500, count: 0, avgAge: 0, totalAge: 0 },
      { range: '₱501-1000', min: 501, max: 1000, count: 0, avgAge: 0, totalAge: 0 },
      { range: '₱1000+', min: 1001, max: Infinity, count: 0, avgAge: 0, totalAge: 0 }
    ]

    basketSizes.forEach(basket => {
      const range = ranges.find(r => basket.amount >= r.min && basket.amount <= r.max)
      if (range) {
        range.count += 1
        range.totalAge += basket.age
      }
    })

    return ranges.map(range => ({
      ...range,
      avgAge: range.count > 0 ? range.totalAge / range.count : 0
    })).filter(r => r.count > 0)
  }, [data.transactions])

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      
      {/* Behavior View Controls */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        {(['patterns', 'preferences', 'frequency'] as const).map((view) => (
          <Button
            key={view}
            variant={behaviorView === view ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBehaviorView(view)}
            className="text-xs"
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </Button>
        ))}
      </div>

      {/* Customer Segmentation */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3 flex items-center">
          <Activity className="h-4 w-4 mr-2" />
          Customer Segments
        </h4>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={customerSegments}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="segment" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip 
              formatter={(value: any, name: string) => [
                name === 'avgSpent' ? `₱${value.toFixed(0)}` : value,
                name === 'avgSpent' ? 'Avg Spent' : 'Customers'
              ]}
            />
            <Bar dataKey="customers" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Payment & Time Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Payment Methods */}
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Preferences
          </h4>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                outerRadius={50}
                dataKey="count"
                label={({ method, percentage }) => 
                  `${method} ${percentage.toFixed(0)}%`
                }
                labelLine={false}
                fontSize={9}
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [value, 'Transactions']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Shopping Time Patterns */}
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Shopping Hours
          </h4>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={timePreferences}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" fontSize={8} interval={2} />
              <YAxis fontSize={8} />
              <Tooltip formatter={(value: any) => [value, 'Transactions']} />
              <Line 
                type="monotone" 
                dataKey="transactions" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

      </div>

      {/* Basket Size Analysis */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3 flex items-center">
          <ShoppingBag className="h-4 w-4 mr-2" />
          Purchase Behavior by Amount
        </h4>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={basketAnalysis}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip 
              formatter={(value: any, name: string) => [
                name === 'avgAge' ? `${value.toFixed(1)} years` : value,
                name === 'avgAge' ? 'Avg Age' : 'Transactions'
              ]}
            />
            <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Behavior Insights */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3">🔍 Behavior Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-green-600">Top Patterns</div>
            <ul className="space-y-1 text-gray-600">
              <li>• {purchasePatterns.length} repeat customers identified</li>
              <li>• Peak shopping: {timePreferences.reduce((peak, curr) => 
                curr.transactions > peak.transactions ? curr : peak, timePreferences[0])?.hour} hours</li>
              <li>• Most popular: {paymentMethodData[0]?.method} payments</li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-blue-600">Opportunities</div>
            <ul className="space-y-1 text-gray-600">
              <li>• Target high-value segment growth</li>
              <li>• Optimize for peak hours</li>
              <li>• Promote preferred payment methods</li>
            </ul>
          </div>
        </div>
      </Card>

    </div>
  )
}