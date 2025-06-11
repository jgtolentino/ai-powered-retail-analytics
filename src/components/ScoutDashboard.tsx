import { RefreshCw, Package, TrendingUp, Users, MapPin, Bot } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import useAllTransactions from '../hooks/useAllTransactions'
import TransactionTrends from './scout/TransactionTrends'
import ProductMixSKU from './scout/ProductMixSKU'
import ConsumerBehavior from './scout/ConsumerBehavior'
import ConsumerProfiling from './scout/ConsumerProfiling'
import ScoutAIPanel from './scout/ScoutAIPanel'
import { AIInsightsOverlay } from './ai/AIInsightsOverlay'
import { useState } from 'react'

export default function ScoutDashboard() {
  const [showAIInsights, setShowAIInsights] = useState(false);
  
  const { 
    data, 
    loading, 
    error, 
    progress, 
    currentStep, 
    totalTransactions 
  } = useAllTransactions()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <Package className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading Scout Dashboard</h2>
            <p className="text-gray-600">Philippine Retail Intelligence</p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Progress Info */}
          <div className="space-y-2">
            <p className="text-lg font-semibold text-blue-600">{progress}%</p>
            <p className="text-sm text-gray-600">{currentStep}</p>
            {totalTransactions > 0 && (
              <p className="text-xs text-gray-500">
                {totalTransactions.toLocaleString()} transactions loaded
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <div className="text-red-600 mb-4">
            <Package className="h-12 w-12 mx-auto mb-2" />
          </div>
          <h2 className="text-lg font-semibold text-red-800 mb-2">Scout Dashboard Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Loading
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Scout Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Package className="h-8 w-8 mr-3 text-blue-600" />
              Scout Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Philippine Retail Intelligence • {totalTransactions.toLocaleString()} Transactions
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Data loaded: {totalTransactions.toLocaleString()} records
            </div>
            <Button
              onClick={() => setShowAIInsights(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="sm"
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Insights
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Scout 4-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
        
        {/* Panel 1: Transaction Trends */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Transaction Trends
            </CardTitle>
            <CardDescription>Time series, location & category analysis</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            {data && <TransactionTrends data={data} />}
          </CardContent>
        </Card>

        {/* Panel 2: Product Mix & SKU */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Package className="h-5 w-5 mr-2 text-purple-600" />
              Product Mix & SKU
            </CardTitle>
            <CardDescription>Brand breakdown & substitution patterns</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            {data && <ProductMixSKU data={data} />}
          </CardContent>
        </Card>

        {/* Panel 3: Consumer Behavior */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Users className="h-5 w-5 mr-2 text-orange-600" />
              Consumer Behavior
            </CardTitle>
            <CardDescription>Preference signals & purchase patterns</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            {data && <ConsumerBehavior data={data} />}
          </CardContent>
        </Card>

        {/* Panel 4: Consumer Profiling */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Consumer Profiling
            </CardTitle>
            <CardDescription>Demographics & location mapping</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            {data && <ConsumerProfiling data={data} />}
          </CardContent>
        </Card>

      </div>

      {/* Scout AI Panel - Floating */}
      <ScoutAIPanel data={data} />

      {/* AI Insights Overlay */}
      {showAIInsights && (
        <AIInsightsOverlay
          isOpen={showAIInsights}
          onClose={() => setShowAIInsights(false)}
          dashboardData={data}
          filters={{}}
        />
      )}
      
    </div>
  )
}