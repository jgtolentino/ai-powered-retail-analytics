import React from 'react';
import { FilterProvider } from '../context/FilterContext';
import GlobalFilterBar from './shared/GlobalFilterBar';
import SideNavigation from './shared/SideNavigation';
import { Users, Download, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const ConsumerInsights: React.FC = () => {
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
                  <Users className="h-8 w-8 text-blue-600" />
                  Consumer Insights
                </h1>
                <p className="text-gray-600 mt-1">Demographics and behavioral patterns</p>
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
              <Card>
                <CardHeader>
                  <CardTitle>Age Pyramid</CardTitle>
                  <CardDescription>Customer age distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-500">Age Pyramid Coming Soon</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Request Behavior Matrix</CardTitle>
                  <CardDescription>Verbal vs pointing vs indirect</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-500">Behavior Matrix Coming Soon</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Loyalty Funnel</CardTitle>
                  <CardDescription>Customer retention stages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-500">Loyalty Funnel Coming Soon</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Visit Frequency</CardTitle>
                  <CardDescription>Purchase behavior distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-500">Frequency ECDF Coming Soon</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </FilterProvider>
  );
};

export default ConsumerInsights;