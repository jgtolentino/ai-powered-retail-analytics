import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Users, 
  Monitor, 
  Settings,
  Store,
  Brain,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  badge?: string;
}

const navigationItems: NavItem[] = [
  {
    href: '/overview',
    icon: BarChart3,
    label: 'Overview',
    description: 'Daily pulse & KPIs'
  },
  {
    href: '/sales-explorer',
    icon: TrendingUp,
    label: 'Sales Explorer',
    description: 'Transaction analysis'
  },
  {
    href: '/basket-analysis',
    icon: Package,
    label: 'Basket Analysis',
    description: 'Purchase patterns'
  },
  {
    href: '/consumer-insights',
    icon: Users,
    label: 'Consumer Insights',
    description: 'Demographics & behavior'
  },
  {
    href: '/device-health',
    icon: Monitor,
    label: 'Device Health',
    description: 'Edge device monitoring'
  },
  {
    href: '/brand-performance',
    icon: Store,
    label: 'Brand Performance',
    description: 'TBWA vs competitors'
  },
  {
    href: '/ai-assistant',
    icon: Brain,
    label: 'AI Assistant',
    description: 'Retail intelligence chat',
    badge: 'NEW'
  }
];

const adminItems: NavItem[] = [
  {
    href: '/admin/logs',
    icon: Settings,
    label: 'System Logs',
    description: 'Operations & audit'
  }
];

interface SideNavigationProps {
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({ 
  className = '', 
  collapsed = false,
  onToggleCollapse 
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (href: string) => {
    // Handle exact matches and nested routes
    if (href === '/overview' && currentPath === '/') return true;
    if (href === '/overview') return currentPath === '/overview';
    return currentPath.startsWith(href);
  };

  const NavItemComponent: React.FC<{ item: NavItem; isAdmin?: boolean }> = ({ item, isAdmin = false }) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    return (
      <Link
        to={item.href}
        className={`
          group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
          ${active 
            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
            : isAdmin 
              ? 'text-gray-600 hover:text-red-700 hover:bg-red-50' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }
          ${collapsed ? 'justify-center px-2' : ''}
        `}
      >
        <Icon className={`w-5 h-5 ${collapsed ? 'w-6 h-6' : ''}`} />
        
        {!collapsed && (
          <>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {item.description}
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 transition-transform ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
          </>
        )}
      </Link>
    );
  };

  return (
    <div className={`bg-white border-r border-gray-200 ${collapsed ? 'w-16' : 'w-64'} flex flex-col transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-gray-900">RetailBot</h1>
              <p className="text-xs text-gray-500">Sari-Sari Analytics</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-3 space-y-1">
        {!collapsed && (
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
            Analytics
          </div>
        )}
        
        {navigationItems.map((item) => (
          <NavItemComponent key={item.href} item={item} />
        ))}

        {/* Admin Section */}
        {adminItems.length > 0 && (
          <>
            <div className="pt-4">
              {!collapsed && (
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
                  Administration
                </div>
              )}
              {adminItems.map((item) => (
                <NavItemComponent key={item.href} item={item} isAdmin />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        {!collapsed ? (
          <div className="text-xs text-gray-500 px-3">
            <div className="flex items-center justify-between mb-1">
              <span>Data Status</span>
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            </div>
            <div>Last sync: {new Date().toLocaleTimeString()}</div>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-8 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
        >
          <ChevronRight className={`w-3 h-3 text-gray-500 transition-transform ${collapsed ? 'rotate-0' : 'rotate-180'}`} />
        </button>
      )}
    </div>
  );
};

export default SideNavigation;