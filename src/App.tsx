import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from './components/Dashboard'
import ScoutDashboard from './components/ScoutDashboard'
import EnhancedScoutDashboard from './components/EnhancedScoutDashboard'
import OverviewPage from './components/OverviewPage'
import SalesExplorer from './components/SalesExplorer'
import BasketAnalysis from './components/BasketAnalysis'
import ConsumerInsights from './components/ConsumerInsights'
import DeviceHealth from './components/DeviceHealth'
import DemoPage from './components/DemoPage'
import AIGenie from './components/AIGenie'
import AIAssistantPage from './components/AIAssistantPage'
import Layout from './components/Layout'
import { Toaster } from 'sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/sales-explorer" element={<SalesExplorer />} />
            <Route path="/basket-analysis" element={<BasketAnalysis />} />
            <Route path="/consumer-insights" element={<ConsumerInsights />} />
            <Route path="/device-health" element={<DeviceHealth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scout" element={<ScoutDashboard />} />
            <Route path="/scout-enhanced" element={<EnhancedScoutDashboard />} />
            <Route path="/ai-genie" element={
              <Layout>
                <AIGenie />
              </Layout>
            } />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/analytics" element={
              <Layout>
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold text-gray-900">Analytics Coming Soon</h2>
                </div>
              </Layout>
            } />
            <Route path="/performance" element={
              <Layout>
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold text-gray-900">Performance Coming Soon</h2>
                </div>
              </Layout>
            } />
            <Route path="/customers" element={
              <Layout>
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold text-gray-900">Customers Coming Soon</h2>
                </div>
              </Layout>
            } />
            <Route path="/settings" element={
              <Layout>
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold text-gray-900">Settings Coming Soon</h2>
                </div>
              </Layout>
            } />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App