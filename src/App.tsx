import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from './components/Dashboard'
import ScoutDashboard from './components/ScoutDashboard'
import EnhancedScoutDashboard from './components/EnhancedScoutDashboard'
import Overview from './pages/NewOverview'
import TransactionTrends from './pages/TransactionTrends'
import ProductMix from './pages/ProductMix'
import ConsumerBehavior from './pages/ConsumerBehavior'
import DemoPage from './components/DemoPage'
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
            <Route path="/" element={<Overview />} />
            <Route path="/transaction-trends" element={<TransactionTrends />} />
            <Route path="/product-mix" element={<ProductMix />} />
            <Route path="/consumer-behavior" element={<ConsumerBehavior />} />
            {/* Redirect old routes to new structure */}
            <Route path="/overview" element={<Navigate to="/" replace />} />
            <Route path="/sales-explorer" element={<Navigate to="/transaction-trends" replace />} />
            <Route path="/basket-analysis" element={<Navigate to="/product-mix" replace />} />
            <Route path="/consumer-insights" element={<Navigate to="/consumer-behavior" replace />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scout" element={<ScoutDashboard />} />
            <Route path="/scout-enhanced" element={<EnhancedScoutDashboard />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App