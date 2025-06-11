import React from 'react';
import { FilterProvider } from '../src/context/FilterContext';
import GlobalFilterBar from '../src/components/shared/GlobalFilterBar';
import SideNavigation from '../src/components/shared/SideNavigation';
import KPICards from '../src/components/retail/overview/KPICards';
import DailyTrendsHeatmap from '../src/components/retail/overview/DailyTrendsHeatmap';
import { Store, Sparkles } from 'lucide-react';

const OverviewPage: React.FC = () => {
  return (
    <FilterProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Side Navigation */}
        <SideNavigation />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Global Filter Bar */}
          <GlobalFilterBar />
          
          {/* Page Header */}
          <div className="p-6 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Store className="h-8 w-8 text-blue-600" />
                  RetailBot Overview
                  <span className="text-sm font-normal bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-3 py-1 rounded-full border border-green-200">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    Sari-Sari Analytics
                  </span>
                </h1>
                <p className="text-gray-600 mt-1">
                  Real-time insights for Philippine retail operations
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Last updated</div>
                  <div className="text-sm font-medium text-gray-900">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Dashboard Content */}
          <div className="flex-1 p-6 space-y-6">
            {/* KPI Cards */}
            <section>
              <KPICards />
            </section>
            
            {/* Daily Trends Heatmap */}
            <section>
              <DailyTrendsHeatmap />
            </section>
            
            {/* Additional Widgets Grid */}
            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Placeholder for Basket Summary */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basket Summary</h3>
                <div className="text-center text-gray-500 py-8">
                  Widget coming soon...
                </div>
              </div>
              
              {/* Placeholder for Brand Performance */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Performance</h3>
                <div className="text-center text-gray-500 py-8">
                  Widget coming soon...
                </div>
              </div>
              
              {/* Placeholder for Consumer Profile */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Consumer Profile</h3>
                <div className="text-center text-gray-500 py-8">
                  Widget coming soon...
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </FilterProvider>
  );
};

export default OverviewPage;