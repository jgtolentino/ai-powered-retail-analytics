import React, { useState, useMemo } from 'react';
import { FilterProvider } from '../context/FilterContext';
import GlobalFilterBar from './shared/GlobalFilterBar';
import SideNavigation from './shared/SideNavigation';
import useAllTransactions, { Transaction } from '../hooks/useAllTransactions';
import ScoutAIPanel from './scout/ScoutAIPanel';
import { TrendingUp, Download, RefreshCw, Search, Calendar, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const SalesExplorer: React.FC = () => {
  const { transactions, loading, error, data } = useAllTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'created_at' | 'total_amount'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Process transactions for timeseries chart
  const timeseriesData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const dailyData = new Map<string, { date: string; revenue: number; count: number }>();
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.created_at).toISOString().split('T')[0];
      const existing = dailyData.get(date) || { date, revenue: 0, count: 0 };
      dailyData.set(date, {
        date,
        revenue: existing.revenue + (transaction.total_amount || 0),
        count: existing.count + 1
      });
    });

    return Array.from(dailyData.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Last 30 days
  }, [transactions]);

  // Process transactions for hour heatmap
  const hourlyData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const hourlyMap = new Map<number, { hour: number; count: number; revenue: number }>();
    
    for (let hour = 0; hour < 24; hour++) {
      hourlyMap.set(hour, { hour, count: 0, revenue: 0 });
    }

    transactions.forEach(transaction => {
      const hour = new Date(transaction.created_at).getHours();
      const existing = hourlyMap.get(hour)!;
      hourlyMap.set(hour, {
        hour,
        count: existing.count + 1,
        revenue: existing.revenue + (transaction.total_amount || 0)
      });
    });

    return Array.from(hourlyMap.values());
  }, [transactions]);

  // Filter and sort transactions for table
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    
    let filtered = transactions;
    
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.id?.toString().includes(searchTerm) ||
        t.store_id?.toString().includes(searchTerm) ||
        t.total_amount?.toString().includes(searchTerm)
      );
    }

    return filtered
      .sort((a, b) => {
        const aVal = sortField === 'created_at' ? new Date(a.created_at).getTime() : (a.total_amount || 0);
        const bVal = sortField === 'created_at' ? new Date(b.created_at).getTime() : (b.total_amount || 0);
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      })
      .slice(0, 100); // Show first 100 results
  }, [transactions, searchTerm, sortField, sortOrder]);

  if (loading) {
    return (
      <FilterProvider>
        <div className="min-h-screen bg-gray-50 flex">
          <SideNavigation />
          <div className="flex-1 flex flex-col">
            <GlobalFilterBar />
            <div className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="text-lg text-gray-600">Loading sales data...</div>
                <div className="text-sm text-gray-500 mt-2">Processing {transactions.length} transactions...</div>
              </div>
            </div>
          </div>
        </div>
      </FilterProvider>
    );
  }

  if (error) {
    return (
      <FilterProvider>
        <div className="min-h-screen bg-gray-50 flex">
          <SideNavigation />
          <div className="flex-1 flex flex-col">
            <GlobalFilterBar />
            <div className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <div className="text-lg text-red-600">Error Loading Sales Data</div>
                <div className="text-sm text-red-500 mt-2">Unable to process transaction data</div>
              </div>
            </div>
          </div>
        </div>
      </FilterProvider>
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
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  Sales Explorer
                </h1>
                <p className="text-gray-600 mt-1">
                  Transaction analysis and drill-down
                  <span className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    {transactions.length.toLocaleString()} transactions
                  </span>
                </p>
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
            <div className="grid gap-6 md:grid-cols-2">
              {/* Revenue Timeseries */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Revenue Timeseries
                  </CardTitle>
                  <CardDescription>Daily revenue trends over last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={timeseriesData}>
                      <XAxis 
                        dataKey="date" 
                        fontSize={10}
                        tick={{ fill: '#6B7280' }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis 
                        fontSize={10}
                        tick={{ fill: '#6B7280' }}
                        tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`₱${value.toLocaleString()}`, 'Revenue']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Hourly Transaction Pattern */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Hourly Patterns
                  </CardTitle>
                  <CardDescription>Transaction count by hour of day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={hourlyData}>
                      <XAxis 
                        dataKey="hour" 
                        fontSize={10}
                        tick={{ fill: '#6B7280' }}
                        tickFormatter={(value) => `${value}:00`}
                      />
                      <YAxis 
                        fontSize={10}
                        tick={{ fill: '#6B7280' }}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`${value} transactions`, 'Count']}
                        labelFormatter={(label) => `${label}:00`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            {/* Transaction Details Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  Transaction Details
                </CardTitle>
                <CardDescription>
                  Searchable transaction data (showing first 100 results)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search and Sort Controls */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by ID, store, or amount..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={`${sortField}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-') as [typeof sortField, typeof sortOrder];
                      setSortField(field);
                      setSortOrder(order);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="created_at-desc">Newest First</option>
                    <option value="created_at-asc">Oldest First</option>
                    <option value="total_amount-desc">Highest Amount</option>
                    <option value="total_amount-asc">Lowest Amount</option>
                  </select>
                </div>

                {/* Transaction Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left p-3 font-medium text-gray-600">Transaction ID</th>
                        <th className="text-left p-3 font-medium text-gray-600">Date</th>
                        <th className="text-left p-3 font-medium text-gray-600">Time</th>
                        <th className="text-left p-3 font-medium text-gray-600">Store</th>
                        <th className="text-right p-3 font-medium text-gray-600">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction, index) => (
                        <tr key={transaction.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 font-mono text-blue-600">{transaction.id || 'N/A'}</td>
                          <td className="p-3">{new Date(transaction.created_at).toLocaleDateString()}</td>
                          <td className="p-3">{new Date(transaction.created_at).toLocaleTimeString()}</td>
                          <td className="p-3">Store {transaction.store_id || 'Main'}</td>
                          <td className="p-3 text-right font-semibold">₱{(transaction.total_amount || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Results Summary */}
                <div className="mt-4 text-sm text-gray-500 text-center">
                  Showing {filteredTransactions.length} of {transactions.length.toLocaleString()} transactions
                  {searchTerm && ` matching "${searchTerm}"`}
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

export default SalesExplorer;