import React, { useState } from 'react';
import { Users, MapPin, ShoppingBag, TrendingUp, Clock, Award } from 'lucide-react';

const ConsumerProfileWidget = () => {
  const [activeTab, setActiveTab] = useState('demographics');

  // Sample data - replace with real data from your API
  const demographicsData = {
    ageGroups: [
      { range: '18-25', percentage: 22, count: 3960 },
      { range: '26-35', percentage: 35, count: 6300 },
      { range: '36-45', percentage: 28, count: 5040 },
      { range: '46-55', percentage: 12, count: 2160 },
      { range: '55+', percentage: 3, count: 540 }
    ],
    genderSplit: {
      female: 58,
      male: 40,
      other: 2
    }
  };

  const geographicData = [
    { region: 'Metro Manila', percentage: 45, customers: 8100 },
    { region: 'Cebu', percentage: 18, customers: 3240 },
    { region: 'Davao', percentage: 12, customers: 2160 },
    { region: 'Laguna', percentage: 10, customers: 1800 },
    { region: 'Others', percentage: 15, customers: 2700 }
  ];

  const behaviorData = {
    loyaltyTiers: [
      { tier: 'VIP', percentage: 8, avgSpend: '₱8,500' },
      { tier: 'Premium', percentage: 22, avgSpend: '₱4,200' },
      { tier: 'Regular', percentage: 45, avgSpend: '₱2,100' },
      { tier: 'New', percentage: 25, avgSpend: '₱890' }
    ],
    shoppingPatterns: [
      { pattern: 'Weekend Shoppers', percentage: 38 },
      { pattern: 'Weekday Browsers', percentage: 28 },
      { pattern: 'Event Driven', percentage: 20 },
      { pattern: 'Impulse Buyers', percentage: 14 }
    ]
  };

  const renderDemographics = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Age Distribution
          </h4>
          <div className="space-y-2">
            {demographicsData.ageGroups.map((group, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{group.range}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${group.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{group.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-3">Gender Split</h4>
          <div className="relative w-24 h-24 mx-auto mb-2">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
              <circle 
                cx="48" cy="48" r="40" fill="none" stroke="#3b82f6" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40 * demographicsData.genderSplit.female / 100} ${2 * Math.PI * 40}`}
              />
              <circle 
                cx="48" cy="48" r="40" fill="none" stroke="#10b981" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 40 * demographicsData.genderSplit.male / 100} ${2 * Math.PI * 40}`}
                strokeDashoffset={`-${2 * Math.PI * 40 * demographicsData.genderSplit.female / 100}`}
              />
            </svg>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                Female
              </span>
              <span>{demographicsData.genderSplit.female}%</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                Male
              </span>
              <span>{demographicsData.genderSplit.male}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeographic = () => (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-700 flex items-center">
        <MapPin className="w-4 h-4 mr-2" />
        Regional Distribution
      </h4>
      <div className="space-y-3">
        {geographicData.map((region, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium">{region.region}</span>
              <p className="text-sm text-gray-500">{region.customers.toLocaleString()} customers</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">{region.percentage}%</div>
              <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${region.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBehavior = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <Award className="w-4 h-4 mr-2" />
            Customer Loyalty Tiers
          </h4>
          <div className="space-y-3">
            {behaviorData.loyaltyTiers.map((tier, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{tier.tier}</span>
                  <p className="text-sm text-gray-500">Avg: {tier.avgSpend}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-600">{tier.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Shopping Patterns
          </h4>
          <div className="space-y-2">
            {behaviorData.shoppingPatterns.map((pattern, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{pattern.pattern}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${pattern.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-8">{pattern.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Consumer Profile</h3>
        <div className="flex items-center text-sm text-gray-500">
          <TrendingUp className="w-4 h-4 mr-1" />
          Live Analytics
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4">
        <button
          onClick={() => setActiveTab('demographics')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'demographics' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Demographics
        </button>
        <button
          onClick={() => setActiveTab('geographic')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'geographic' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Geographic
        </button>
        <button
          onClick={() => setActiveTab('behavior')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'behavior' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Behavior
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'demographics' && renderDemographics()}
        {activeTab === 'geographic' && renderGeographic()}
        {activeTab === 'behavior' && renderBehavior()}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">18,000</div>
            <div className="text-sm text-gray-500">Total Customers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">₱2,620</div>
            <div className="text-sm text-gray-500">Avg Customer Value</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">4.2</div>
            <div className="text-sm text-gray-500">Avg Orders/Customer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerProfileWidget;