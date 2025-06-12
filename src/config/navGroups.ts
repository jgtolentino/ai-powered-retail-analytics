export interface NavItem {
  title: string;
  path: string;
  subtitle?: string;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    title: 'Analytics',
    items: [
      { title: 'Overview',          subtitle: 'Daily pulse & KPIs',      path: '/overview' },
      { title: 'Sales Explorer',    subtitle: 'Transaction analysis',    path: '/sales-explorer' },
      { title: 'Basket Analysis',   subtitle: 'Purchase patterns',       path: '/basket-analysis' },
      { title: 'Consumer Insights', subtitle: 'Demographics & behavior', path: '/consumer-insights' },
    ],
  },
];