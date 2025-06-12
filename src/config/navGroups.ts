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
      { title: 'Overview',            path: '/' },
      { title: 'Transaction Trends',  path: '/transaction-trends' },
      { title: 'Product Mix',         path: '/product-mix' },
      { title: 'Consumer Behavior',   path: '/consumer-behavior' },
    ],
  },
];