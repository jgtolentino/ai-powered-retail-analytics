import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, TrendingUp, Package } from 'lucide-react';

const CategoryMixWidget = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // FMCG Categories relevant to Philippine market
  const categoryData = [
    { 
      name: 'Personal Care', 
      value: 28.5, 
      amount: 1342875,
      color: '#3B82F6', 
      items: ['Shampoo', 'Soap', 'Toothpaste', 'Deodorant'],
      growth: '+12.3%'
    },
    { 
      name: 'Food & Beverages', 
      value: 24.8, 
      amount: 1169240,
      color: '#10B981', 
      items: ['Instant Noodles', 'Coffee', 'Soft Drinks', 'Snacks'],
      growth: '+8.7%'
    },
    { 
      name: 'Household Products', 
      value: 18.2, 
      amount: 857814,
      color: '#F59E0B', 
      items: ['Detergent', 'Fabric Conditioner', 'Dishwashing Liquid'],
      growth: '+5.1%'
    },
    { 
      name: 'Health & Wellness', 
      value: 12.4, 
      amount: 584676,
      color: '#EF4444', 
      items: ['Vitamins', 'Pain Relievers', 'Cold Medicine'],
      growth: '+15.9%'
    },
    { 
      name: 'Baby Care', 
      value: 8.7, 
      amount: 410133,
      color: '#8B5CF6', 
      items: ['Diapers', 'Baby Food', 'Baby Shampoo'],
      growth: '+22.1%'
    },
    { 
      name: 'Pet Care', 
      value: 4.2, 
      amount: 197898,
      color: '#06B6D4', 
      items: ['Pet Food', 'Pet Shampoo', 'Pet Treats'],
      growth: '+18.5%'
    },
    { 
      name: 'Others', 
      value: 3.2, 
      amount: 150840,
      color: '#84CC16', 
      items: ['Batteries', 'Air Fresheners', 'Misc Items'],
      growth: '+2.8%'
    }
  ];

  const totalAmount = categoryData.reduce((sum, cat) => sum + cat.amount, 0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const createDonutPath = (startAngle, endAngle, innerRadius, outerRadius) => {
    const start = polarToCartesian(0, 0, outerRadius, endAngle);
    const end = polarToCartesian(0, 0, outerRadius, startAngle);
    const innerStart = polarToCartesian(0, 0, innerRadius, endAngle);
    const innerEnd = polarToCartesian(0, 0, innerRadius, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleExport = () => {
    const csvContent = [
      ['Category', 'Percentage', 'Amount (PHP)', 'Growth'],
      ...categoryData.map(cat => [
        cat.name,
        `${cat.value}%`,
        `₱${cat.amount.toLocaleString()}`,
        cat.growth
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fmcg-category-analysis.csv';
    a.click();
  };

  let currentAngle = 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Category Mix
          </h3>
          <p className="text-sm text-gray-500">Product category breakdown</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleExport}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <div className="flex justify-center items-center">
          <div className="relative">
            <svg width="280" height="280" className="transform -rotate-90">
              <g transform="translate(140,140)">
                {categoryData.map((category, index) => {
                  const startAngle = currentAngle;
                  const endAngle = currentAngle + (category.value / 100) * 360;
                  const path = createDonutPath(startAngle, endAngle, 60, 120);
                  currentAngle = endAngle;

                  return (
                    <path
                      key={category.name}
                      d={path}
                      fill={category.color}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedCategory === category.name ? 'opacity-100 filter drop-shadow-lg' : 'opacity-90 hover:opacity-100'
                      }`}
                      style={{
                        transformOrigin: '0 0',
                        transform: selectedCategory === category.name ? 'scale(1.05)' : 'scale(1)',
                        strokeWidth: selectedCategory === category.name ? 2 : 0,
                        stroke: selectedCategory === category.name ? '#ffffff' : 'none'
                      }}
                      onMouseEnter={() => setSelectedCategory(category.name)}
                      onMouseLeave={() => setSelectedCategory(null)}
                    />
                  );
                })}
              </g>
            </svg>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  ₱{(totalAmount / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-500">Total Sales</div>
                {selectedCategory && (
                  <div className="mt-2">
                    <div className="text-lg font-semibold text-blue-600">
                      {categoryData.find(c => c.name === selectedCategory)?.value}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedCategory}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Legend and Details */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
            {categoryData.map((category, index) => (
              <div
                key={category.name}
                className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                  selectedCategory === category.name
                    ? 'bg-gray-50 border-gray-300 shadow-sm'
                    : 'hover:bg-gray-25 border-gray-200'
                }`}
                onMouseEnter={() => setSelectedCategory(category.name)}
                onMouseLeave={() => setSelectedCategory(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <div>
                      <div className="font-medium text-gray-800">{category.name}</div>
                      <div className="text-xs text-gray-500">
                        {category.items.slice(0, 2).join(', ')}
                        {category.items.length > 2 && ` +${category.items.length - 2}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">{category.value}%</div>
                    <div className="text-xs text-gray-500">
                      ₱{(category.amount / 1000).toFixed(0)}K
                    </div>
                    <div className={`text-xs font-medium ${
                      category.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {category.growth}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-xl font-bold text-blue-600">7</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-xl font-bold text-green-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +11.2%
                </div>
                <div className="text-sm text-gray-600">Avg Growth</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Categories */}
      <div className="mt-6 pt-4 border-t">
        <h4 className="font-semibold text-gray-700 mb-3">Top Performing FMCG Categories</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {categoryData
            .sort((a, b) => parseFloat(b.growth) - parseFloat(a.growth))
            .slice(0, 3)
            .map((category, index) => (
              <div key={category.name} className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{category.name}</div>
                    <div className="text-sm text-gray-500">₱{(category.amount / 1000).toFixed(0)}K sales</div>
                  </div>
                  <div className="text-green-600 font-bold">{category.growth}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryMixWidget;