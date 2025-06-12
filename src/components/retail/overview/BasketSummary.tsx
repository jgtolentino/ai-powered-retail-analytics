import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import useAllTransactions from '../../../hooks/useAllTransactions';
import { useRealTimeBasketMetrics } from '../../../hooks/useRealTimeData';
import { Package, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface BasketData {
  avg_basket_size: number;
  basket_distribution: { size: number; count: number; percentage: number }[];
  top_products: { product_name: string; frequency: number; category: string }[];
}

export const BasketSummary: React.FC = () => {
  const { transactions, loading: transactionLoading, error: transactionError } = useAllTransactions();
  
  // ✅ REAL DATA: Use real-time basket metrics instead of hardcoded products
  const { 
    data: realBasketData, 
    loading: basketLoading, 
    error: basketError, 
    refresh: refreshBaskets 
  } = useRealTimeBasketMetrics();

  const loading = transactionLoading || basketLoading;
  const error = transactionError || basketError;

  // Use real basket data if available, otherwise fallback to calculated data
  const data = realBasketData || {
    avg_basket_size: 0,
    basket_distribution: [],
    top_products: []
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Basket Summary
          </CardTitle>
          <CardDescription>Analyzing {transactions.length} transaction patterns...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded animate-pulse flex items-center justify-center">
            <div className="text-gray-500">Computing basket analytics...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Basket Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-600">Unable to load basket summary</div>
        </CardContent>
      </Card>
    );
  }

  const basketData = data || {} as BasketData;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-green-600" />
          Basket Summary
        </CardTitle>
        <CardDescription>
          Purchase patterns and basket analysis
          <span className="ml-2 text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded">
            Avg: {basketData.avg_basket_size} items
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basket Size Distribution */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Basket Size Distribution
          </h4>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={basketData.basket_distribution || []}>
              <XAxis 
                dataKey="size" 
                fontSize={10} 
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                fontSize={10} 
                tick={{ fill: '#6B7280' }} 
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  `${value} transactions (${basketData.basket_distribution?.find(d => d.count === value)?.percentage}%)`,
                  'Count'
                ]}
                labelFormatter={(label) => `${label} items`}
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#10B981" 
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Most Frequent Products
          </h4>
          <div className="space-y-2">
            {(basketData.top_products || []).map((product, index) => (
              <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm">{product.product_name}</div>
                  <div className="text-xs text-gray-500">{product.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{product.frequency}%</div>
                  <div className="text-xs text-gray-500">frequency</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-semibold text-green-700">
                {basketData.avg_basket_size?.toFixed(1)}
              </div>
              <div className="text-green-600">Avg Items</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="font-semibold text-blue-700">
                {basketData.basket_distribution?.reduce((sum, d) => sum + d.count, 0).toLocaleString()}
              </div>
              <div className="text-blue-600">Total Baskets</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasketSummary;