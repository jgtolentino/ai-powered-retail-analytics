import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Award, Target, BarChart3, Download, RefreshCw, Eye } from 'lucide-react';

const BrandPerformancePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('3months');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Brand performance data
  const brandData = [
    {
      name: 'TBWA Philippines',
      category: 'All Categories',
      marketShare: 35.5,
      revenue: 1669688.38,
      growth: 12.3,
      trend: 'up',
      color: '#3B82F6'
    },
    {
      name: 'Unilever PH',
      category: 'Personal Care',
      marketShare: 28.2,
      revenue: 1327240.50,
      growth: 8.7,
      trend: 'up',
      color: '#10B981'
    },
    {
      name: 'Procter & Gamble',
      category: 'Personal Care',
      marketShare: 22.1,
      revenue: 1040872.30,
      growth: -2.1,
      trend: 'down',
      color: '#F59E0B'
    },
    {
      name: 'Nestlé Philippines',
      category: 'Food & Beverages',
      marketShare: 18.7,
      revenue: 880341.20,
      growth: 15.9,
      trend: 'up',
      color: '#EF4444'
    },
    {
      name: 'Coca-Cola FEMSA',
      category: 'Food & Beverages',
      marketShare: 15.3,
      revenue: 720158.40,
      growth: 6.4,
      trend: 'up',
      color: '#8B5CF6'
    }
  ];

  const categoryPerformance = [
    { name: 'Personal Care', brands: 3, topBrand: 'Unilever PH', growth: 8.5, marketValue: 2368112.80 },
    { name: 'Food & Beverages', brands: 2, topBrand: 'Nestlé PH', growth: 11.2, marketValue: 1600499.60 },
    { name: 'Household Products', brands: 2, topBrand: 'TBWA', growth: 5.1, marketValue: 857814.00 },
    { name: 'Health & Wellness', brands: 1, topBrand: 'TBWA', growth: 15.9, marketValue: 584676.00 }
  ];

  const competitiveMetrics = [
    { metric: 'Brand Awareness', tbwa: 87, competitor: 92, industry: 78 },
    { metric: 'Purchase Intent', tbwa: 73, competitor: 68, industry: 65 },
    { metric: 'Customer Satisfaction', tbwa: 4.6, competitor: 4.2, industry: 4.1 },
    { metric: 'Price Perception', tbwa: 82, competitor: 79, industry: 75 },
    { metric: 'Quality Rating', tbwa: 4.7, competitor: 4.4, industry: 4.3 }
  ];

  const monthlyData = [
    { month: 'Jan', tbwa: 420000, competitors: 380000 },
    { month: 'Feb', tbwa: 445000, competitors: 395000 },
    { month: 'Mar', tbwa: 465000, competitors: 410000 },
    { month: 'Apr', tbwa: 490000, competitors: 425000 },
    { month: 'May', tbwa: 515000, competitors: 440000 },
    { month: 'Jun', tbwa: 535000, competitors: 455000 }
  ];

  const exportData = () => {
    const csvContent = [
      ['Brand', 'Market Share', 'Revenue', 'Growth %'],
      ...brandData.map(brand => [
        brand.name,
        `${brand.marketShare}%`,
        `₱${brand.revenue.toLocaleString()}`,
        `${brand.growth}%`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brand-performance-analysis.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Award className="w-6 h-6 mr-2 text-blue-500" />
                Brand Performance Analytics
              </h1>
              <p className="text-gray-600 mt-1">TBWA vs competitors analysis</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button 
                onClick={exportData}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Market Share</p>
                <p className="text-2xl font-bold text-blue-600">35.5%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2.3% vs last period
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Brand Revenue</p>
                <p className="text-2xl font-bold text-green-600">₱1.67M</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.3% growth
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Brand Awareness</p>
                <p className="text-2xl font-bold text-purple-600">87%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Above industry avg
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Competitive Rank</p>
                <p className="text-2xl font-bold text-orange-600">#1</p>
                <p className="text-xs text-gray-600 mt-1">
                  Leading position
                </p>
              </div>
              <Award className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Brand Comparison Chart & Competitive Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Brand Market Share */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Share by Brand</h3>
            <div className="space-y-4">
              {brandData.map((brand, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: brand.color }}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-800">{brand.name}</p>
                      <p className="text-sm text-gray-500">{brand.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{brand.marketShare}%</p>
                    <p className={`text-sm flex items-center ${
                      brand.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {brand.trend === 'up' ? 
                        <TrendingUp className="w-3 h-3 mr-1" /> : 
                        <TrendingDown className="w-3 h-3 mr-1" />
                      }
                      {brand.growth > 0 ? '+' : ''}{brand.growth}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitive Metrics */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Competitive Metrics</h3>
            <div className="space-y-4">
              {competitiveMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{metric.metric}</span>
                    <div className="flex space-x-4 text-xs">
                      <span className="text-blue-600">TBWA: {metric.tbwa}{metric.metric.includes('Rating') ? '/5' : '%'}</span>
                      <span className="text-gray-500">Avg: {metric.industry}{metric.metric.includes('Rating') ? '/5' : '%'}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ 
                          width: `${metric.metric.includes('Rating') ? 
                            (metric.tbwa / 5) * 100 : 
                            metric.tbwa
                          }%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Performance Trends */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue Trends</h3>
          <div className="grid grid-cols-6 gap-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-2">{data.month}</p>
                <div className="space-y-2">
                  <div className="bg-blue-100 rounded p-2">
                    <p className="text-xs text-gray-600">TBWA</p>
                    <p className="font-semibold text-blue-600">₱{(data.tbwa / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="bg-gray-100 rounded p-2">
                    <p className="text-xs text-gray-600">Others</p>
                    <p className="font-semibold text-gray-600">₱{(data.competitors / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryPerformance.map((category, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800">{category.name}</h4>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Top Brand:</span>
                    <span className="font-medium">{category.topBrand}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Brands:</span>
                    <span className="font-medium">{category.brands}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Growth:</span>
                    <span className={`font-medium ${
                      category.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {category.growth > 0 ? '+' : ''}{category.growth}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Value:</span>
                    <span className="font-medium">₱{(category.marketValue / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AI-Powered Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Key Strengths</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Leading market share at 35.5% across all categories</li>
                <li>• Strong brand awareness (87%) above industry average</li>
                <li>• Consistent growth in Health & Wellness (+15.9%)</li>
                <li>• Superior customer satisfaction ratings (4.6/5)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Increase investment in Personal Care segment</li>
                <li>• Focus on digital marketing for 26-35 age group</li>
                <li>• Expand Baby Care and Pet Care portfolios</li>
                <li>• Strengthen weekend retail presence</li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  );
};

export default BrandPerformancePage;