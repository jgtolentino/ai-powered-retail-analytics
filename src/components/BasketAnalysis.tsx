import React from 'react';
import { FilterProvider } from '../context/FilterContext';
import GlobalFilterBar from './shared/GlobalFilterBar';
import SideNavigation from './shared/SideNavigation';
import { Package, Download, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const BasketAnalysis: React.FC = () => {
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
                  <CardTitle>Basket Size Distribution</CardTitle>
                  <CardDescription>Items per transaction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-500">Histogram Coming Soon</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Combos</CardTitle>
                  <CardDescription>Frequently bought together</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-500">Combo Table Coming Soon</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Category Mix</CardTitle>
                  <CardDescription>Product category breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-500">Pie Chart Coming Soon</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Substitution Flow</CardTitle>
                <CardDescription>Product substitution patterns (Sankey diagram)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-500">Sankey Substitution Flow Coming Soon</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FilterProvider>
  );
};

export default BasketAnalysis;