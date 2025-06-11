import { useState, useMemo } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter
} from 'recharts'
import { Users, MapPin, DollarSign, Mic } from 'lucide-react'

interface ConsumerProfilingProps {
  data: {
    transactions: any[]
    brands: any[]
    products: any[]
  }
}

export default function ConsumerProfiling({ data }: ConsumerProfilingProps) {
  const [profileView, setProfileView] = useState<'demographics' | 'location' | 'spending' | 'media'>('demographics')

  // Demographic analysis
  const demographics = useMemo(() => {
    if (!data.transactions) return { age: [], gender: [], combined: [] }

    // Age distribution
    const ageMap = new Map()
    const genderMap = new Map()
    const combinedMap = new Map()

    data.transactions.forEach(transaction => {
      // Age groups
      const age = transaction.customer_age
      if (age) {
        let ageGroup = 'Unknown'
        if (age < 25) ageGroup = '18-24'
        else if (age < 35) ageGroup = '25-34'
        else if (age < 45) ageGroup = '35-44'
        else if (age < 55) ageGroup = '45-54'
        else ageGroup = '55+'

        ageMap.set(ageGroup, (ageMap.get(ageGroup) || 0) + 1)
      }

      // Gender distribution
      const gender = transaction.customer_gender || 'Unknown'
      genderMap.set(gender, (genderMap.get(gender) || 0) + 1)

      // Combined demographics
      const key = `${gender}-${age < 35 ? 'Young' : 'Mature'}`
      if (!combinedMap.has(key)) {
        combinedMap.set(key, {
          segment: key,
          count: 0,
          totalSpent: 0,
          avgSpent: 0
        })
      }
      const combined = combinedMap.get(key)
      combined.count += 1
      combined.totalSpent += transaction.total_amount || 0
    })

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

    return {
      age: Array.from(ageMap.entries()).map(([group, count], index) => ({
        ageGroup: group,
        count,
        color: colors[index % colors.length]
      })),
      gender: Array.from(genderMap.entries()).map(([gender, count], index) => ({
        gender,
        count,
        color: colors[index % colors.length]
      })),
      combined: Array.from(combinedMap.values()).map(item => ({
        ...item,
        avgSpent: item.totalSpent / item.count
      }))
    }
  }, [data.transactions])

  // Location mapping
  const locationData = useMemo(() => {
    if (!data.transactions) return { regions: [], cities: [], stores: [] }

    const regionMap = new Map()
    const cityMap = new Map()
    const storeMap = new Map()

    data.transactions.forEach(transaction => {
      if (!transaction.store_location) return

      const parts = transaction.store_location.split(',').map((s: string) => s.trim())
      const region = parts[0] || 'Unknown'
      const city = parts[1] || 'Unknown'
      const store = transaction.store_location

      // Region analysis
      if (!regionMap.has(region)) {
        regionMap.set(region, {
          region,
          transactions: 0,
          revenue: 0,
          customers: new Set()
        })
      }
      const regionData = regionMap.get(region)
      regionData.transactions += 1
      regionData.revenue += transaction.total_amount || 0
      if (transaction.device_id) regionData.customers.add(transaction.device_id)

      // City analysis
      if (!cityMap.has(city)) {
        cityMap.set(city, {
          city,
          transactions: 0,
          revenue: 0,
          customers: new Set()
        })
      }
      const cityData = cityMap.get(city)
      cityData.transactions += 1
      cityData.revenue += transaction.total_amount || 0
      if (transaction.device_id) cityData.customers.add(transaction.device_id)

      // Store analysis
      storeMap.set(store, (storeMap.get(store) || 0) + 1)
    })

    return {
      regions: Array.from(regionMap.values())
        .map(r => ({ ...r, customers: r.customers.size }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 8),
      cities: Array.from(cityMap.values())
        .map(c => ({ ...c, customers: c.customers.size }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10),
      stores: Array.from(storeMap.entries())
        .map(([store, count]) => ({ store, transactions: count }))
        .sort((a, b) => b.transactions - a.transactions)
        .slice(0, 8)
    }
  }, [data.transactions])

  // Spending power analysis
  const spendingPower = useMemo(() => {
    if (!data.transactions) return []

    const deviceSpending = new Map()

    data.transactions.forEach(transaction => {
      const deviceId = transaction.device_id
      if (!deviceId) return

      if (!deviceSpending.has(deviceId)) {
        deviceSpending.set(deviceId, {
          device_id: deviceId,
          totalSpent: 0,
          transactions: 0,
          avgAmount: 0,
          age: transaction.customer_age || 0,
          gender: transaction.customer_gender || 'Unknown'
        })
      }

      const spending = deviceSpending.get(deviceId)
      spending.totalSpent += transaction.total_amount || 0
      spending.transactions += 1
      spending.avgAmount = spending.totalSpent / spending.transactions
    })

    return Array.from(deviceSpending.values())
      .filter(s => s.transactions > 1) // Only repeat customers
      .map(spending => ({
        ...spending,
        powerLevel: spending.totalSpent > 1000 ? 'High' :
                   spending.totalSpent > 500 ? 'Medium' : 'Low'
      }))
  }, [data.transactions])

  // Media preferences (based on transcription data)
  const mediaPreferences = useMemo(() => {
    if (!data.transactions) return { verbal: 0, nonVerbal: 0, languages: [] }

    let verbalRequests = 0
    let nonVerbalRequests = 0
    const languageMap = new Map()

    data.transactions.forEach(transaction => {
      if (transaction.transcription_text) {
        verbalRequests += 1
        
        // Simple language detection based on Filipino words
        const text = transaction.transcription_text.toLowerCase()
        const hasFilipino = /\b(po|opo|ate|kuya|pabili|isang|dalawa|tatlo)\b/.test(text)
        const language = hasFilipino ? 'Filipino' : 'English'
        languageMap.set(language, (languageMap.get(language) || 0) + 1)
      } else {
        nonVerbalRequests += 1
      }
    })

    return {
      verbal: verbalRequests,
      nonVerbal: nonVerbalRequests,
      languages: Array.from(languageMap.entries()).map(([lang, count]) => ({
        language: lang,
        count,
        percentage: (count / verbalRequests) * 100
      }))
    }
  }, [data.transactions])

  // Purchase power by demographics
  const powerByDemographics = useMemo(() => {
    const segments = spendingPower.reduce((acc, customer) => {
      const key = `${customer.gender}-${customer.age < 35 ? 'Young' : 'Mature'}`
      if (!acc[key]) {
        acc[key] = {
          segment: key,
          customers: 0,
          totalSpent: 0,
          avgSpent: 0,
          highPower: 0
        }
      }
      
      acc[key].customers += 1
      acc[key].totalSpent += customer.totalSpent
      if (customer.powerLevel === 'High') acc[key].highPower += 1

      return acc
    }, {} as any)

    return Object.values(segments).map((seg: any) => ({
      ...seg,
      avgSpent: seg.totalSpent / seg.customers,
      highPowerRate: (seg.highPower / seg.customers) * 100
    }))
  }, [spendingPower])

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      
      {/* Profile View Controls */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        {(['demographics', 'location', 'spending', 'media'] as const).map((view) => (
          <Button
            key={view}
            variant={profileView === view ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setProfileView(view)}
            className="text-xs"
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </Button>
        ))}
      </div>

      {profileView === 'demographics' && (
        <>
          {/* Age & Gender Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Age Distribution
              </h4>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={demographics.age}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ageGroup" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip formatter={(value: any) => [value, 'Customers']} />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Gender Split
              </h4>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={demographics.gender}
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    dataKey="count"
                    label={({ gender, count }) => `${gender}: ${count}`}
                    labelLine={false}
                    fontSize={10}
                  >
                    {demographics.gender.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [value, 'Customers']} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

          </div>

          {/* Purchase Power by Demographics */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3">💰 Purchase Power by Segment</h4>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={powerByDemographics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="segment" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'avgSpent' ? `₱${value.toFixed(0)}` : 
                    name === 'highPowerRate' ? `${value.toFixed(1)}%` : value,
                    name === 'avgSpent' ? 'Avg Spent' : 
                    name === 'highPowerRate' ? 'High Power %' : 'Customers'
                  ]}
                />
                <Bar dataKey="avgSpent" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}

      {profileView === 'location' && (
        <>
          {/* Regional Performance */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Top Performing Regions
            </h4>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={locationData.regions} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={10} />
                <YAxis dataKey="region" type="category" width={60} fontSize={10} />
                <Tooltip formatter={(value: any) => [`₱${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* City & Store Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <Card className="p-4">
              <h4 className="font-semibold mb-3">🏙️ Top Cities</h4>
              <div className="space-y-2">
                {locationData.cities.slice(0, 5).map((city, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{city.city}</span>
                    <div className="text-right">
                      <div className="font-semibold">₱{city.revenue.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{city.customers} customers</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-3">🏪 Top Stores</h4>
              <div className="space-y-2">
                {locationData.stores.slice(0, 5).map((store, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium truncate">{store.store}</div>
                    <div className="text-xs text-gray-500">{store.transactions} transactions</div>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </>
      )}

      {profileView === 'spending' && (
        <>
          {/* Spending Power Distribution */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Customer Spending Power
            </h4>
            <ResponsiveContainer width="100%" height={180}>
              <ScatterChart data={spendingPower.slice(0, 50)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="transactions" name="Transactions" fontSize={10} />
                <YAxis dataKey="totalSpent" name="Total Spent" fontSize={10} />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'totalSpent' ? `₱${value}` : value,
                    name === 'totalSpent' ? 'Total Spent' : 'Transactions'
                  ]}
                />
                <Scatter dataKey="totalSpent" fill="#F59E0B" />
              </ScatterChart>
            </ResponsiveContainer>
          </Card>

          {/* Power Level Distribution */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3">💎 Spending Segments</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              {['High', 'Medium', 'Low'].map(level => {
                const count = spendingPower.filter(s => s.powerLevel === level).length
                const percentage = (count / spendingPower.length) * 100
                
                return (
                  <div key={level} className="p-3 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">{count}</div>
                    <div className="text-sm font-medium">{level} Power</div>
                    <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                )
              })}
            </div>
          </Card>
        </>
      )}

      {profileView === 'media' && (
        <>
          {/* Media Interaction Preferences */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Mic className="h-4 w-4 mr-2" />
              Interaction Preferences
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-3xl font-bold text-blue-600">{mediaPreferences.verbal}</div>
                <div className="text-sm font-medium">Verbal Requests</div>
                <div className="text-xs text-gray-500">Voice interactions</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded">
                <div className="text-3xl font-bold text-gray-600">{mediaPreferences.nonVerbal}</div>
                <div className="text-sm font-medium">Non-Verbal</div>
                <div className="text-xs text-gray-500">Other interactions</div>
              </div>
            </div>
          </Card>

          {/* Language Preferences */}
          {mediaPreferences.languages.length > 0 && (
            <Card className="p-4">
              <h4 className="font-semibold mb-3">🗣️ Language Preferences</h4>
              <div className="space-y-3">
                {mediaPreferences.languages.map((lang, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{lang.language}</span>
                    <div className="text-right">
                      <div className="font-semibold">{lang.percentage.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">{lang.count} requests</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

    </div>
  )
}