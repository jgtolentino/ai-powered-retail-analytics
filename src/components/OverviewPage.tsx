import React from 'react';
import { FilterProvider } from '../context/FilterContext';
import GlobalFilterBar from './shared/GlobalFilterBar';
import SideNavigation from './shared/SideNavigation';
import KPICards from './retail/overview/KPICards';
import DailyTrendsHeatmap from './retail/overview/DailyTrendsHeatmap';
import BasketSummary from './retail/overview/BasketSummary';
import BrandPerformance from './retail/overview/BrandPerformance';
import ConsumerProfile from './retail/overview/ConsumerProfile';
import ScoutAIPanel from './scout/ScoutAIPanel';
import useAllTransactions from '../hooks/useAllTransactions';
import { Store, Sparkles } from 'lucide-react';

const OverviewPage: React.FC = () => {
  const { transactions, loading } = useAllTransactions();
  
  // Transform to match expected data structure for ScoutAIPanel
  const data = transactions.length > 0 ? {
    transactions,
    brands: [],
    products: [],
    transactionItems: []
  } : null;
  
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
              {/* Basket Summary */}
              <BasketSummary />
              
              {/* Brand Performance */}
              <BrandPerformance />
              
              {/* Consumer Profile */}
              <ConsumerProfile />
            </section>
          </div>
        </div>
      </div>
      
      {/* Scout AI Panel - Floating */}
      <ScoutAIPanel data={data} />
    </FilterProvider>
  );
};

export default OverviewPage;