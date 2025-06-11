import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, Package, Users, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface EnhancedScoutPanelProps {
  panelType: 'trends' | 'products' | 'behavior' | 'profiling';
  filters: {
    dateFilter?: string;
    regionFilter?: string;
    categoryFilter?: string;
    brandFilter?: string;
    ageFilter?: string;
    genderFilter?: string;
    paymentFilter?: string;
  };
  className?: string;
}

export const EnhancedScoutPanel: React.FC<EnhancedScoutPanelProps> = ({ 
  panelType, 
  filters = {},
  className = '' 
}) => {
  // Use optimized database function instead of client-side processing
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['enhanced-scout', panelType, filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_scout_dashboard_data', {
        p_date_filter: filters.dateFilter || 'all',
        p_region_filter: filters.regionFilter || null,
        p_category_filter: filters.categoryFilter || null,
        p_brand_filter: filters.brandFilter || null,
        p_age_filter: filters.ageFilter || null,
        p_gender_filter: filters.genderFilter || null,
        p_payment_filter: filters.paymentFilter || null
      });
      
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    enabled: true,
  });

  const getIcon = () => {
    switch (panelType) {
      case 'trends': return TrendingUp;
      case 'products': return Package;
      case 'behavior': return Users;
      case 'profiling': return MapPin;
      default: return TrendingUp;
    }
  };

  const getTitle = () => {
    switch (panelType) {
      case 'trends': return 'Transaction Trends';
      case 'products': return 'Product Mix & SKU';
      case 'behavior': return 'Consumer Behavior';
      case 'profiling': return 'Consumer Profiling';
      default: return 'Analytics';
    }
  };

  const getDescription = () => {
    switch (panelType) {
      case 'trends': return 'Time series, location & category analysis';
      case 'products': return 'Brand breakdown & substitution patterns';
      case 'behavior': return 'Preference signals & purchase patterns';
      case 'profiling': return 'Demographics & location mapping';
      default: return '';
    }
  };

  const Icon = getIcon();

  if (isLoading) {
    return (
      <Card className={`animate-pulse ${className}`}>
        <CardHeader>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gray-200 rounded mr-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-100 rounded"></div>
            <div className="h-32 bg-gray-100 rounded"></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-20 bg-gray-100 rounded"></div>
              <div className="h-20 bg-gray-100 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`border-red-200 bg-red-50 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            Error Loading Panel
          </CardTitle>
          <CardDescription className="text-red-600">
            {error.message || 'Failed to load panel data'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <button 
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Loading
          </button>
        </CardContent>
      </Card>
    );
  }

  const renderPanelContent = () => {
    if (!data) return null;

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    switch (panelType) {
      case 'trends':
        return (
          <div className="space-y-4">
            {/* Hourly Trends */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Hourly Pattern
              </h4>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={data.transaction_trends?.hourly || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="hour" 
                    fontSize={10} 
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis fontSize={10} tick={{ fill: '#6B7280' }} axisLine={{ stroke: '#E5E7EB' }} />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'transactions' ? value : `₱${value?.toLocaleString()}`,
                      name === 'transactions' ? 'Transactions' : 'Revenue'
                    ]}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="transactions" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', r: 3 }}
                    activeDot={{ r: 5, fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Location Analysis */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Top Regions
              </h4>
              <div className="space-y-2">
                {(data.transaction_trends?.location_analysis || []).slice(0, 4).map((location: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{location.region}</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">
                        ₱{location.revenue?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {location.transactions} txns
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Revenue Trend */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Weekly Revenue
              </h4>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={(data.transaction_trends?.weekly || []).slice(-6)}>
                  <XAxis 
                    dataKey="week" 
                    fontSize={9} 
                    tick={{ fill: '#6B7280' }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis fontSize={9} tick={{ fill: '#6B7280' }} />
                  <Tooltip 
                    formatter={(value: any) => [`₱${value.toLocaleString()}`, 'Revenue']}
                    labelFormatter={(label) => `Week of ${new Date(label).toLocaleDateString()}`}
                  />
                  <Bar dataKey="revenue" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="space-y-4">
            {/* TBWA vs Competitors */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                TBWA vs Competitors
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">
                    {data.product_mix?.tbwa_vs_competitors?.tbwa_share?.toFixed(1) || '0'}%
                  </div>
                  <div className="text-xs text-blue-600">TBWA Share</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {data.product_mix?.tbwa_vs_competitors?.tbwa_brands || 0} brands
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">
                    ₱{(data.product_mix?.tbwa_vs_competitors?.tbwa_revenue || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600">TBWA Revenue</div>
                  <div className="text-xs text-gray-500 mt-1">
                    vs ₱{(data.product_mix?.tbwa_vs_competitors?.competitor_revenue || 0).toLocaleString()} competitor
                  </div>
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                Category Mix
              </h4>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={data.product_mix?.categories || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={45}
                    dataKey="revenue"
                    label={({ category, percentage }) => 
                      percentage > 10 ? `${category} ${percentage}%` : ''
                    }
                    labelLine={false}
                    fontSize={9}
                  >
                    {(data.product_mix?.categories || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`₱${value.toLocaleString()}`, 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Brands */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Top Performing Brands
              </h4>
              <div className="space-y-1">
                {(data.product_mix?.top_brands || []).slice(0, 5).map((brand: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{brand.brand_name}</span>
                      {brand.is_tbwa && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          TBWA
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        ₱{brand.revenue?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {brand.market_share?.toFixed(1)}% share
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'behavior':
        return (
          <div className="space-y-4">
            {/* Payment Methods */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Payment Preferences
              </h4>
              <div className="space-y-2">
                {(data.consumer_behavior?.payment_methods || []).map((method: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{method.payment_method}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${method.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 w-10 text-right">
                        {method.percentage?.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Patterns */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Shopping Time Patterns
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {(data.consumer_behavior?.time_patterns || []).map((pattern: any, index: number) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">
                      {pattern.transactions}
                    </div>
                    <div className="text-xs text-gray-600">{pattern.period}</div>
                    <div className="text-xs text-blue-600 mt-1">
                      {pattern.percentage?.toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekend vs Weekday */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Weekend vs Weekday
              </h4>
              {data.consumer_behavior?.weekend_vs_weekday && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-700">
                      {data.consumer_behavior.weekend_vs_weekday.weekday_transactions}
                    </div>
                    <div className="text-xs text-blue-600">Weekday</div>
                    <div className="text-xs text-gray-500 mt-1">
                      ₱{data.consumer_behavior.weekend_vs_weekday.weekday_revenue?.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-700">
                      {data.consumer_behavior.weekend_vs_weekday.weekend_transactions}
                    </div>
                    <div className="text-xs text-green-600">Weekend</div>
                    <div className="text-xs text-gray-500 mt-1">
                      ₱{data.consumer_behavior.weekend_vs_weekday.weekend_revenue?.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Segments */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                Customer Segments
              </h4>
              <div className="space-y-1">
                {(data.consumer_behavior?.customer_segments || []).slice(0, 4).map((segment: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                    <span className="text-xs font-medium">{segment.segment}</span>
                    <div className="text-right">
                      <div className="text-xs font-semibold">{segment.count}</div>
                      <div className="text-xs text-gray-500">
                        ₱{segment.avg_spend?.toFixed(0)} avg
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'profiling':
        return (
          <div className="space-y-4">
            {/* Age Distribution */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Age Groups
              </h4>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={data.consumer_profiling?.age_distribution || []}>
                  <XAxis dataKey="age_group" fontSize={9} tick={{ fill: '#6B7280' }} />
                  <YAxis fontSize={9} tick={{ fill: '#6B7280' }} />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      value,
                      name === 'count' ? 'Customers' : 'Avg Spend'
                    ]}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gender Split */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Gender Distribution
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {(data.consumer_profiling?.gender_split || []).slice(0, 2).map((gender: any, index: number) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{gender.count}</div>
                    <div className="text-xs text-gray-600">{gender.gender}</div>
                    <div className="text-xs text-green-600 mt-1">
                      {gender.percentage?.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      ₱{gender.avg_spend?.toFixed(0)} avg
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Regions */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                Regional Performance
              </h4>
              <div className="space-y-1">
                {(data.consumer_profiling?.location_data || []).slice(0, 5).map((location: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{location.region}</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        ₱{location.revenue?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {location.unique_customers} customers
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demographics Insights */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Key Insights
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-blue-50 rounded">
                  <span>High Value Age Groups</span>
                  <span className="font-medium">
                    {data.consumer_profiling?.demographics_correlation?.high_value_age_groups?.length || 0} identified
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-green-50 rounded">
                  <span>Regional Preferences</span>
                  <span className="font-medium">
                    {data.consumer_profiling?.demographics_correlation?.regional_preferences?.length || 0} patterns
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-center text-gray-500 py-8">Panel type not recognized</div>;
    }
  };

  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Icon className="h-5 w-5 mr-2 text-blue-600" />
          {getTitle()}
        </CardTitle>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {renderPanelContent()}
        
        {/* Summary Stats */}
        {data?.summary_stats && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-semibold text-gray-900">
                  ₱{data.summary_stats.total_revenue?.toLocaleString()}
                </div>
                <div className="text-gray-600">Total Revenue</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-semibold text-gray-900">
                  {data.summary_stats.total_transactions?.toLocaleString()}
                </div>
                <div className="text-gray-600">Transactions</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedScoutPanel;