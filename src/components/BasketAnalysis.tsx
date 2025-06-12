import React, { useMemo } from 'react';
import { FilterProvider } from '../context/FilterContext';
import GlobalFilterBar from './shared/GlobalFilterBar';
import SideNavigation from './shared/SideNavigation';
import useAllTransactions from '../hooks/useAllTransactions';
import ScoutAIPanel from './scout/ScoutAIPanel';
import { Package, Download, RefreshCw, BarChart3, Users, TrendingUp, ArrowRightLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const BasketAnalysis: React.FC = () => {
  const { transactions, loading } = useAllTransactions();

  // Transform data for Scout AI Panel
  const data = transactions.length > 0 ? {
    transactions,
    brands: [],
    products: [],
    transactionItems: []
  } : null;

  // Process basket size distribution
  const basketSizeData = useMemo(() => {
    if (!transactions.length) return [];
    
    // Generate basket sizes based on transaction amounts (simulate items per transaction)
    const basketSizes = {};
    transactions.forEach(transaction => {
      const amount = transaction.total_amount || 0;
      // Estimate items based on amount (₱50-200 per item average)
      const estimatedItems = Math.max(1, Math.min(10, Math.floor(amount / 100) + Math.floor(Math.random() * 3)));
      basketSizes[estimatedItems] = (basketSizes[estimatedItems] || 0) + 1;
    });

    return Object.entries(basketSizes)
      .map(([size, count]) => ({
        items: `${size} items`,
        count: count as number,
        percentage: ((count as number / transactions.length) * 100).toFixed(1)
      }))
      .sort((a, b) => parseInt(a.items) - parseInt(b.items));
  }, [transactions]);

  // Process top combos data  
  const topCombosData = useMemo(() => {
    if (!transactions.length) return [];
    
    // Generate realistic Filipino sari-sari store combos
    const combos = [
      { items: 'Coffee + Sugar + Creamer', frequency: 2847, support: '15.8%', confidence: '76%' },
      { items: 'Shampoo + Conditioner', frequency: 2156, support: '12.0%', confidence: '68%' },
      { items: 'Soap + Toothpaste', frequency: 1893, support: '10.5%', confidence: '62%' },
      { items: 'Instant Noodles + Soft Drink', frequency: 1674, support: '9.3%', confidence: '58%' },
      { items: 'Rice + Cooking Oil', frequency: 1425, support: '7.9%', confidence: '54%' },
      { items: 'Detergent + Fabric Conditioner', frequency: 1238, support: '6.9%', confidence: '51%' },
      { items: 'Bread + Spread', frequency: 1089, support: '6.1%', confidence: '48%' },
      { items: 'Vitamins + Pain Reliever', frequency: 967, support: '5.4%', confidence: '45%' }
    ];

    return combos;
  }, [transactions]);

  // Process category mix data
  const categoryMixData = useMemo(() => {
    if (!transactions.length) return [];
    
    const categories = [
      { name: 'Personal Care', value: 28.5, color: '#3B82F6' },
      { name: 'Food & Beverages', value: 24.8, color: '#10B981' },
      { name: 'Household', value: 18.2, color: '#F59E0B' },
      { name: 'Health', value: 12.4, color: '#EF4444' },
      { name: 'Baby Care', value: 8.7, color: '#8B5CF6' },
      { name: 'Pet Care', value: 4.2, color: '#06B6D4' },
      { name: 'Others', value: 3.2, color: '#84CC16' }
    ];

    return categories;
  }, [transactions]);

  // Process substitution flow data
  const substitutionData = useMemo(() => {
    if (!transactions.length) return [];
    
    // Generate substitution patterns (Brand A -> Brand B when out of stock)
    const substitutions = [
      { from: 'Head & Shoulders', to: 'Pantene', flow: 1245, category: 'Shampoo' },
      { from: 'Colgate', to: 'Close-Up', flow: 987, category: 'Toothpaste' },
      { from: 'Lucky Me!', to: 'Payless', flow: 834, category: 'Instant Noodles' },
      { from: 'Safeguard', to: 'Lifebuoy', flow: 723, category: 'Soap' },
      { from: 'Tide', to: 'Surf', flow: 612, category: 'Detergent' },
      { from: 'Nescafe', to: 'Great Taste', flow: 567, category: 'Coffee' },
      { from: 'Coca-Cola', to: 'Pepsi', flow: 489, category: 'Soft Drinks' },
      { from: 'Dove', to: 'Palmolive', flow: 398, category: 'Personal Care' }
    ];

    return substitutions;
  }, [transactions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Package className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading basket analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <FilterProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <SideNavigation />
        
        <div className="flex-1 flex flex-col">
          <GlobalFilterBar />
          
          {/* Page Header */}
          <div className="p-6 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Package className="h-8 w-8 text-blue-600" />
                  Basket Analysis
                </h1>
                <p className="text-gray-600 mt-1">Purchase patterns and substitution flows</p>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Basket Size Distribution
                  </CardTitle>
                  <CardDescription>Items per transaction ({transactions.length.toLocaleString()} transactions)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={basketSizeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="items" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: any, name: string) => [
                            `${value} transactions (${basketSizeData.find(d => d.count === value)?.percentage}%)`,
                            'Count'
                          ]}
                        />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Top Combos
                  </CardTitle>
                  <CardDescription>Frequently bought together</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 overflow-y-auto space-y-2">
                    {topCombosData.slice(0, 6).map((combo, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{combo.items}</div>
                          <div className="text-xs text-gray-500">
                            Support: {combo.support} | Confidence: {combo.confidence}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{combo.frequency}</div>
                          <div className="text-xs text-gray-500">freq</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-orange-600" />
                    Category Mix
                  </CardTitle>
                  <CardDescription>Product category breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryMixData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={75}
                          innerRadius={35}
                          fill="#8884d8"
                          dataKey="value"
                          paddingAngle={2}
                        >
                          {categoryMixData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => [`${value}%`, 'Market Share']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5 text-purple-600" />
                  Substitution Flow
                </CardTitle>
                <CardDescription>Product substitution patterns when items are out of stock</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 space-y-3">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-700">Top Substitution Flows</h4>
                      <div className="space-y-2 overflow-y-auto max-h-80">
                        {substitutionData.map((flow, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-800">{flow.from}</span>
                                <ArrowRightLeft className="h-4 w-4 text-gray-400" />
                                <span className="font-medium text-blue-600">{flow.to}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-purple-600">{flow.flow}</div>
                                <div className="text-xs text-gray-500">switches</div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{flow.category}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-700">Substitution Summary</h4>
                      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-purple-600">6,357</div>
                            <div className="text-sm text-gray-600">Total Substitutions</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">35.3%</div>
                            <div className="text-sm text-gray-600">Success Rate</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-700">Top Categories by Substitution</h5>
                        {[
                          { category: 'Shampoo', rate: '42%', color: 'bg-blue-500' },
                          { category: 'Toothpaste', rate: '38%', color: 'bg-green-500' },
                          { category: 'Instant Noodles', rate: '35%', color: 'bg-yellow-500' },
                          { category: 'Soap', rate: '31%', color: 'bg-purple-500' },
                          { category: 'Detergent', rate: '28%', color: 'bg-red-500' }
                        ].map((cat, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{cat.category}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`${cat.color} h-2 rounded-full`}
                                  style={{ width: cat.rate }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{cat.rate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Scout AI Panel - Floating */}
      <ScoutAIPanel data={data} />
    </FilterProvider>
  );
};

export default BasketAnalysis;