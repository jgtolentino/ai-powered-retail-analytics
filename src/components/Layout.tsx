import { ReactNode } from 'react'
import { BarChart3, Bot, Home, Settings, TrendingUp, Users, Activity, ShoppingCart, Eye, Award, FileText } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const navigation = [
    { 
      name: 'Analytics', 
      href: '#', 
      icon: BarChart3,
      subItems: [
        { name: 'Overview', href: '/', description: 'Daily pulse & KPIs' },
        { name: 'Sales Explorer', href: '/sales-explorer', description: 'Transaction analysis' },
        { name: 'Basket Analysis', href: '/basket-analysis', description: 'Purchase patterns' },
        { name: 'Consumer Insights', href: '/consumer-insights', description: 'Demographics & behavior' },
        { name: 'Device Health', href: '/device-health', description: 'Edge device monitoring' },
        { name: 'Brand Performance', href: '/brand-performance', description: 'TBWA vs competitors' },
        { name: 'AI Console', href: '/ai-genie', description: 'Comprehensive analytics workspace', badge: 'PRO' },
      ]
    },
    { 
      name: 'Administration', 
      href: '#', 
      icon: Settings,
      subItems: [
        { name: 'System Logs', href: '/logs', description: 'Operations & audit' },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <div className="text-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RetailBot
            </h1>
            <p className="text-xs text-gray-500 mt-1">Sari-Sari Analytics</p>
          </div>
        </div>
        <nav className="mt-5 space-y-6 px-2">
          {navigation.map((section) => (
            <div key={section.name}>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.name}
              </h3>
              <div className="mt-3 space-y-1">
                {section.subItems?.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-40 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <h2 className="text-lg font-semibold text-gray-900">
              AI-Powered Retail Analytics Platform
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Philippine Market Intelligence</span>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}