import { useEffect, useState } from 'react'
import { MetricCard } from './ui/metric-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { 
  ShoppingCart, TrendingUp, Users, 
  Package, Bot, RefreshCw 
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

interface DashboardMetrics {
  totalRevenue: number
  totalTransactions: number
  totalCustomers: number
  avgTransactionValue: number
  topBrands: any[]
  salesByRegion: any[]
  dailySales: any[]
}

export default function RetailDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch key metrics
      const { data: transactions, error: transError } = await supabase
        .from('transactions')
        .select('total_amount, device_id, customer_age, customer_gender, created_at, store_location')
        .order('created_at', { ascending: false })
        .limit(1000)

      if (transError) throw transError

      // Calculate metrics
      const totalRevenue = transactions?.reduce((sum, t) => sum + (t.total_amount || 0), 0) || 0
      const totalTransactions = transactions?.length || 0
      const uniqueDevices = new Set(transactions?.map(t => t.device_id)).size // Using device_id as unique customer identifier
      const avgTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0

      // Fetch top brands
      const { data: brandData } = await supabase
        .from('transaction_items')
        .select('quantity, subtotal, products(brand_id, brands(name))')
        .limit(100)

      // Aggregate brand sales
      const brandSales: Record<string, number> = {}
      brandData?.forEach((item: any) => {
        const brandName = item.products?.brands?.name || 'Unknown'
        brandSales[brandName] = (brandSales[brandName] || 0) + (item.subtotal || 0)
      })

      const topBrands = Object.entries(brandSales)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5)

      // Mock regional data (would come from stores table with regions)
      const salesByRegion = [
        { region: 'NCR', sales: totalRevenue * 0.4, color: '#3B82F6' },
        { region: 'Luzon', sales: totalRevenue * 0.25, color: '#10B981' },
        { region: 'Visayas', sales: totalRevenue * 0.2, color: '#F59E0B' },
        { region: 'Mindanao', sales: totalRevenue * 0.15, color: '#EF4444' },
      ]

      // Mock daily sales trend
      const dailySales = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return {
          date: date.toLocaleDateString('en-PH', { weekday: 'short' }),
          sales: Math.floor(totalRevenue / 7 * (0.8 + Math.random() * 0.4))
        }
      })

      setMetrics({
        totalRevenue,
        totalTransactions,
        totalCustomers: uniqueDevices, // Using unique devices as customer count
        avgTransactionValue,
        topBrands,
        salesByRegion,
        dailySales
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading dashboard data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading dashboard: {error}</p>
        <Button onClick={fetchDashboardData} className="mt-2">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Retail Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time insights for Philippine retail market</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`₱${metrics?.totalRevenue.toLocaleString('en-PH')}`}
          change={12.5}
          icon={TrendingUp}
          iconColor="text-green-600"
          trend="up"
        />
        <MetricCard
          title="Transactions"
          value={metrics?.totalTransactions.toLocaleString() || '0'}
          change={8.2}
          icon={ShoppingCart}
          iconColor="text-blue-600"
          trend="up"
        />
        <MetricCard
          title="Unique Devices"
          value={metrics?.totalCustomers.toLocaleString() || '0'}
          change={-2.4}
          icon={Users}
          iconColor="text-purple-600"
          trend="down"
        />
        <MetricCard
          title="Avg Transaction"
          value={`₱${metrics?.avgTransactionValue.toFixed(2) || '0'}`}
          change={5.7}
          icon={Package}
          iconColor="text-orange-600"
          trend="up"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>7-Day Sales Trend</CardTitle>
            <CardDescription>Daily revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics?.dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: any) => `₱${value.toLocaleString()}`} />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Brands */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Brands</CardTitle>
            <CardDescription>Sales by brand</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics?.topBrands}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: any) => `₱${value.toLocaleString()}`} />
                <Bar dataKey="sales" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Regional Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Sales by Region</CardTitle>
          <CardDescription>Geographic distribution of revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics?.salesByRegion}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ region, percent }) => `${region} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="sales"
                >
                  {metrics?.salesByRegion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `₱${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-4 flex flex-col justify-center">
              {metrics?.salesByRegion.map((region) => (
                <div key={region.region} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded mr-3" 
                      style={{ backgroundColor: region.color }}
                    />
                    <span className="font-medium">{region.region}</span>
                  </div>
                  <span className="text-gray-600">₱{region.sales.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant CTA */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bot className="h-5 w-5 mr-2 text-blue-600" />
                AI-Powered Insights Available
              </h3>
              <p className="text-gray-600 mt-1">
                Ask our AI assistant about sales trends, customer behavior, or get recommendations
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Launch AI Genie
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}