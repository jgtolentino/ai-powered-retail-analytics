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
    { name: 'Overview', href: '/', icon: Home },
    { name: 'Sales Explorer', href: '/sales-explorer', icon: TrendingUp },
    { name: 'Basket Analysis', href: '/basket-analysis', icon: ShoppingCart },
    { name: 'Consumer Insights', href: '/consumer-insights', icon: Users },
    { name: 'Device Health', href: '/device-health', icon: Activity },
    { name: 'Brand Performance', href: '/brand-performance', icon: Award },
    { name: 'AI Console', href: '/ai-genie', icon: Bot, badge: 'AI' },
    { name: 'System Logs', href: '/logs', icon: FileText, divider: true },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <div className="text-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics
            </h1>
            <p className="text-xs text-gray-500 mt-1">Retail Intelligence</p>
          </div>
        </div>
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon
              return (
                <div key={item.name}>
                  {item.divider && <div className="border-t border-gray-200 my-4" />}
                  <Link
                    to={item.href}
                    className={cn(
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    )} />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="ml-2 px-2 py-1 text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </div>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Retail Analytics
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Philippine Market
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                A
              </div>
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