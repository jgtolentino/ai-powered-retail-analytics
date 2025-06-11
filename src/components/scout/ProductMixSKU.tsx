import { useState, useMemo } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { Package, TrendingUp, Repeat, Star } from 'lucide-react'

interface ProductMixSKUProps {
  data: {
    transactions: any[]
    brands: any[]
    products: any[]
    transactionItems: any[]
  }
}

export default function ProductMixSKU({ data }: ProductMixSKUProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [brandView, setBrandView] = useState<'share' | 'growth' | 'volume'>('share')

  // Brand performance analysis
  const brandPerformance = useMemo(() => {
    if (!data.brands || !data.transactionItems || !data.products) return []

    const brandMap = new Map()
    
    // Initialize brands
    data.brands.forEach(brand => {
      brandMap.set(brand.id, {
        id: brand.id,
        name: brand.name,
        category: brand.category,
        is_tbwa: brand.is_tbwa,
        revenue: 0,
        volume: 0,
        transactions: 0,
        products: new Set()
      })
    })

    // Calculate brand metrics from transaction items
    data.transactionItems.forEach(item => {
      const product = data.products.find(p => p.id === item.product_id)
      if (product && brandMap.has(product.brand_id)) {
        const brand = brandMap.get(product.brand_id)
        brand.revenue += (item.price * item.quantity) || 0
        brand.volume += item.quantity || 0
        brand.transactions += 1
        brand.products.add(product.id)
      }
    })

    // Filter by category if selected
    let filteredBrands = Array.from(brandMap.values())
    if (categoryFilter !== 'all') {
      filteredBrands = filteredBrands.filter(brand => 
        brand.category?.toLowerCase() === categoryFilter.toLowerCase()
      )
    }

    return filteredBrands
      .map(brand => ({
        ...brand,
        products: brand.products.size,
        avgTransaction: brand.transactions > 0 ? brand.revenue / brand.transactions : 0
      }))
      .filter(brand => brand.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
  }, [data.brands, data.products, data.transactionItems, categoryFilter])

  // Category distribution
  const categoryDistribution = useMemo(() => {
    if (!data.brands) return []

    const categoryMap = new Map()
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']

    brandPerformance.forEach(brand => {
      const category = brand.category || 'Other'
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          category,
          revenue: 0,
          brands: 0,
          volume: 0,
          color: colors[categoryMap.size % colors.length]
        })
      }
      
      const cat = categoryMap.get(category)
      cat.revenue += brand.revenue
      cat.brands += 1
      cat.volume += brand.volume
    })

    return Array.from(categoryMap.values())
      .sort((a, b) => b.revenue - a.revenue)
  }, [brandPerformance])

  // Top SKUs analysis
  const topSKUs = useMemo(() => {
    if (!data.products || !data.transactionItems || !data.brands) return []

    const skuMap = new Map()

    data.transactionItems.forEach(item => {
      const product = data.products.find(p => p.id === item.product_id)
      const brand = product ? data.brands.find(b => b.id === product.brand_id) : null

      if (product) {
        const skuKey = product.id
        if (!skuMap.has(skuKey)) {
          skuMap.set(skuKey, {
            id: product.id,
            name: product.name,
            brand: brand?.name || 'Unknown',
            category: product.category || brand?.category || 'Other',
            revenue: 0,
            volume: 0,
            transactions: 0
          })
        }

        const sku = skuMap.get(skuKey)
        sku.revenue += (item.price * item.quantity) || 0
        sku.volume += item.quantity || 0
        sku.transactions += 1
      }
    })

    return Array.from(skuMap.values())
      .filter(sku => sku.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8)
  }, [data.products, data.transactionItems, data.brands])

  // TBWA vs Competitor analysis
  const tbwaAnalysis = useMemo(() => {
    const tbwaMetrics = { revenue: 0, volume: 0, brands: 0 }
    const competitorMetrics = { revenue: 0, volume: 0, brands: 0 }

    brandPerformance.forEach(brand => {
      if (brand.is_tbwa) {
        tbwaMetrics.revenue += brand.revenue
        tbwaMetrics.volume += brand.volume
        tbwaMetrics.brands += 1
      } else {
        competitorMetrics.revenue += brand.revenue
        competitorMetrics.volume += brand.volume
        competitorMetrics.brands += 1
      }
    })

    const total = tbwaMetrics.revenue + competitorMetrics.revenue

    return [
      {
        name: 'TBWA Clients',
        revenue: tbwaMetrics.revenue,
        share: total > 0 ? (tbwaMetrics.revenue / total * 100) : 0,
        brands: tbwaMetrics.brands,
        color: '#3B82F6'
      },
      {
        name: 'Competitors',
        revenue: competitorMetrics.revenue,
        share: total > 0 ? (competitorMetrics.revenue / total * 100) : 0,
        brands: competitorMetrics.brands,
        color: '#10B981'
      }
    ]
  }, [brandPerformance])

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set(['all'])
    data.brands?.forEach(brand => {
      if (brand.category) cats.add(brand.category)
    })
    return Array.from(cats)
  }, [data.brands])

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      
      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs px-2 py-1 border rounded"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['share', 'growth', 'volume'] as const).map((view) => (
            <Button
              key={view}
              variant={brandView === view ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBrandView(view)}
              className="text-xs"
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Brand Performance */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Top Brands by Revenue
        </h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={brandPerformance} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" fontSize={10} />
            <YAxis dataKey="name" type="category" width={80} fontSize={10} />
            <Tooltip 
              formatter={(value: any, name: string) => [
                name === 'revenue' ? `₱${value.toLocaleString()}` : value.toLocaleString(),
                name === 'revenue' ? 'Revenue' : name === 'volume' ? 'Volume' : 'Transactions'
              ]}
            />
            <Bar 
              dataKey="revenue" 
              fill="#3B82F6" 
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Category Mix & TBWA Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Category Distribution */}
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Category Mix
          </h4>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                outerRadius={50}
                dataKey="revenue"
                label={({ category, percent }) => 
                  `${category} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
                fontSize={9}
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`₱${value.toLocaleString()}`, 'Revenue']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* TBWA vs Competitors */}
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <Star className="h-4 w-4 mr-2" />
            TBWA vs Competitors
          </h4>
          <div className="space-y-3">
            {tbwaAnalysis.map((segment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded mr-2" 
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-sm font-medium">{segment.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {segment.share.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    ₱{segment.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="text-xs text-gray-600">
              TBWA Brands: {tbwaAnalysis[0]?.brands || 0} | 
              Competitors: {tbwaAnalysis[1]?.brands || 0}
            </div>
          </div>
        </Card>

      </div>

      {/* Top SKUs */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3 flex items-center">
          <Repeat className="h-4 w-4 mr-2" />
          Top Performing SKUs
        </h4>
        <div className="space-y-2">
          {topSKUs.map((sku, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex-1">
                <div className="font-medium text-sm">{sku.name}</div>
                <div className="text-xs text-gray-500">{sku.brand} • {sku.category}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm">₱{sku.revenue.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{sku.volume} units</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}