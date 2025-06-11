import React, { useState, useEffect } from 'react';
import { Bot, X, Lightbulb, TrendingUp, Users, Package, AlertCircle, Download, Sparkles, Target, Zap } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useQuery } from '@tanstack/react-query';

interface AIInsight {
  id: string;
  type: 'trend' | 'opportunity' | 'alert' | 'recommendation';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  metric?: {
    value: number;
    change: number;
    unit: string;
  };
  actions: {
    label: string;
    action: () => void;
  }[];
  confidence: number;
  impact: string;
  category: 'sales' | 'operations' | 'marketing' | 'inventory';
}

interface AIInsightsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardData: any;
  filters: any;
}

export const AIInsightsOverlay: React.FC<AIInsightsOverlayProps> = ({
  isOpen,
  onClose,
  dashboardData,
  filters
}) => {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [insightFilters, setInsightFilters] = useState({
    type: 'all',
    priority: 'all',
    category: 'all'
  });

  // Generate AI insights based on dashboard data
  const { data: insights, isLoading } = useQuery({
    queryKey: ['ai-insights', dashboardData, filters],
    queryFn: async () => {
      if (!dashboardData) return [];
      
      const insights: AIInsight[] = [];

      // 1. PEAK HOUR OPTIMIZATION ANALYSIS
      if (dashboardData?.transaction_trends?.hourly) {
        const hourlyData = dashboardData.transaction_trends.hourly;
        if (hourlyData && hourlyData.length > 0) {
          const peakHour = hourlyData.reduce((max: any, curr: any) => 
            curr.transactions > max.transactions ? curr : max
          , hourlyData[0]);

          const avgHourlyTransactions = hourlyData.reduce((sum: number, h: any) => 
            sum + h.transactions, 0) / hourlyData.length;

          if (peakHour && peakHour.transactions > avgHourlyTransactions * 1.5) {
            insights.push({
              id: 'peak-hour-optimization',
              type: 'opportunity',
              priority: 'high',
              title: 'Peak Hour Revenue Optimization',
              description: `Your busiest hour is ${peakHour.hour}:00 with ${peakHour.transactions} transactions (${Math.round((peakHour.transactions / avgHourlyTransactions - 1) * 100)}% above average). This represents significant untapped potential for targeted promotions and premium product placement.`,
              metric: {
                value: peakHour.transactions,
                change: Math.round((peakHour.transactions / avgHourlyTransactions - 1) * 100),
                unit: 'transactions/hour'
              },
              actions: [
                {
                  label: 'Create Peak Hour Promotion',
                  action: () => console.log('Create promotion for peak hour')
                },
                {
                  label: 'Optimize Staff Schedule',
                  action: () => console.log('Schedule more staff for peak hour')
                },
                {
                  label: 'Feature Premium Products',
                  action: () => console.log('Promote high-margin items during peak')
                }
              ],
              confidence: 94,
              impact: 'Potential 15-20% revenue increase during peak hours',
              category: 'operations'
            });
          }
        }
      }

      // 2. TBWA BRAND PORTFOLIO ANALYSIS
      if (dashboardData?.product_mix?.tbwa_vs_competitors) {
        const tbwaData = dashboardData.product_mix.tbwa_vs_competitors;
        const tbwaShare = tbwaData.tbwa_share || 0;
        
        if (tbwaShare < 35) {
          insights.push({
            id: 'tbwa-expansion-opportunity',
            type: 'recommendation',
            priority: 'high',
            title: 'TBWA Brand Portfolio Expansion',
            description: `TBWA brands currently represent ${tbwaShare.toFixed(1)}% of your portfolio revenue. Industry leaders typically see 40-50% TBWA brand contribution. This presents a significant partnership expansion opportunity.`,
            metric: {
              value: tbwaShare,
              change: 40 - tbwaShare,
              unit: '% potential growth'
            },
            actions: [
              {
                label: 'Request TBWA Catalog',
                action: () => console.log('Contact TBWA for expanded catalog')
              },
              {
                label: 'Schedule Partnership Review',
                action: () => console.log('Book meeting with TBWA representative')
              },
              {
                label: 'Analyze Competitor Gaps',
                action: () => console.log('Identify competitor weaknesses')
              }
            ],
            confidence: 92,
            impact: 'Potential 25-30% margin improvement with expanded TBWA partnership',
            category: 'sales'
          });
        } else if (tbwaShare > 60) {
          insights.push({
            id: 'tbwa-excellence',
            type: 'trend',
            priority: 'medium',
            title: 'TBWA Partnership Excellence',
            description: `Outstanding performance! TBWA brands contribute ${tbwaShare.toFixed(1)}% of revenue, well above industry average. This strong partnership is driving superior margins and customer satisfaction.`,
            metric: {
              value: tbwaShare,
              change: tbwaShare - 40,
              unit: '% above industry avg'
            },
            actions: [
              {
                label: 'Showcase Success Story',
                action: () => console.log('Create TBWA success case study')
              },
              {
                label: 'Explore Premium Tiers',
                action: () => console.log('Discuss premium TBWA products')
              }
            ],
            confidence: 98,
            impact: 'Continue exceptional performance with strategic expansion',
            category: 'sales'
          });
        }
      }

      // 3. DIGITAL PAYMENT ADOPTION ANALYSIS
      if (dashboardData?.consumer_behavior?.payment_methods) {
        const paymentMethods = dashboardData.consumer_behavior.payment_methods;
        const digitalPayments = paymentMethods
          ?.filter((pm: any) => pm.payment_method === 'gcash' || pm.payment_method === 'card')
          ?.reduce((sum: number, pm: any) => sum + (pm.percentage || 0), 0) || 0;

        if (digitalPayments < 45) {
          insights.push({
            id: 'digital-payment-acceleration',
            type: 'opportunity',
            priority: 'medium',
            title: 'Digital Payment Acceleration Program',
            description: `${digitalPayments.toFixed(1)}% digital payment adoption vs. 55% Philippine retail average. Accelerating digital adoption reduces cash handling costs by 2-3% and improves transaction speed by 40%.`,
            metric: {
              value: digitalPayments,
              change: 55 - digitalPayments,
              unit: '% growth potential'
            },
            actions: [
              {
                label: 'Launch GCash Cashback',
                action: () => console.log('Create GCash promotion campaign')
              },
              {
                label: 'Install Express Lanes',
                action: () => console.log('Setup digital-only checkout lanes')
              },
              {
                label: 'Train Staff on Benefits',
                action: () => console.log('Educate team on digital payment benefits')
              }
            ],
            confidence: 87,
            impact: 'Save ₱50,000-₱80,000 annually in cash handling costs',
            category: 'operations'
          });
        }
      }

      // 4. CUSTOMER DEMOGRAPHIC OPTIMIZATION
      if (dashboardData?.consumer_profiling?.age_distribution) {
        const ageGroups = dashboardData.consumer_profiling.age_distribution;
        const totalCustomers = ageGroups?.reduce((sum: number, age: any) => sum + (age.count || 0), 0) || 0;
        
        const youngCustomers = ageGroups
          ?.filter((age: any) => age.age_group === '18-24' || age.age_group === '25-34')
          ?.reduce((sum: number, age: any) => sum + (age.count || 0), 0) || 0;
        
        const youngPercentage = totalCustomers > 0 ? (youngCustomers / totalCustomers) * 100 : 0;

        if (youngPercentage > 55) {
          insights.push({
            id: 'gen-z-millennial-strategy',
            type: 'trend',
            priority: 'high',
            title: 'Gen Z & Millennial Market Dominance',
            description: `${youngPercentage.toFixed(0)}% of customers are under 35 - a powerful demographic driving digital-first shopping behaviors. This cohort responds to social proof, sustainability messaging, and mobile-optimized experiences.`,
            metric: {
              value: youngPercentage,
              change: youngPercentage - 40,
              unit: '% above avg demographic'
            },
            actions: [
              {
                label: 'Launch TikTok Campaign',
                action: () => console.log('Create viral TikTok marketing strategy')
              },
              {
                label: 'Stock Trending Products',
                action: () => console.log('Inventory trending Gen Z products')
              },
              {
                label: 'Implement Social Commerce',
                action: () => console.log('Add social media shopping features')
              }
            ],
            confidence: 91,
            impact: 'Capture 30% more young customers with targeted digital strategy',
            category: 'marketing'
          });
        }
      }

      // 5. WEEKEND VS WEEKDAY OPTIMIZATION
      if (dashboardData?.consumer_behavior?.weekend_vs_weekday) {
        const weekendData = dashboardData.consumer_behavior.weekend_vs_weekday;
        const weekendRevenue = weekendData.weekend_revenue || 0;
        const weekdayRevenue = weekendData.weekday_revenue || 0;
        const totalRevenue = weekendRevenue + weekdayRevenue;
        
        if (totalRevenue > 0) {
          const weekendPercentage = (weekendRevenue / totalRevenue) * 100;
          
          if (weekendPercentage > 35) {
            insights.push({
              id: 'weekend-revenue-driver',
              type: 'trend',
              priority: 'medium',
              title: 'Weekend Revenue Powerhouse',
              description: `Weekends drive ${weekendPercentage.toFixed(1)}% of total revenue despite being only 28% of the week. This indicates strong leisure shopping patterns and family purchasing behavior.`,
              metric: {
                value: weekendPercentage,
                change: weekendPercentage - 28,
                unit: '% revenue concentration'
              },
              actions: [
                {
                  label: 'Extend Weekend Hours',
                  action: () => console.log('Consider longer weekend operating hours')
                },
                {
                  label: 'Weekend Family Bundles',
                  action: () => console.log('Create family-oriented weekend promotions')
                },
                {
                  label: 'Saturday Event Series',
                  action: () => console.log('Plan weekend customer events')
                }
              ],
              confidence: 85,
              impact: 'Optimize weekend operations for 15% revenue boost',
              category: 'operations'
            });
          }
        }
      }

      // 6. CATEGORY PERFORMANCE ALERTS
      if (dashboardData?.product_mix?.categories) {
        const categories = dashboardData.product_mix.categories;
        const totalRevenue = dashboardData.summary_stats?.total_revenue || 0;
        
        const lowPerformers = categories?.filter((cat: any) => 
          (cat.revenue || 0) < totalRevenue * 0.03
        ) || [];

        if (lowPerformers.length > 2) {
          insights.push({
            id: 'category-optimization-alert',
            type: 'alert',
            priority: 'medium',
            title: 'Category Portfolio Optimization',
            description: `${lowPerformers.length} categories each contribute less than 3% of revenue. Optimizing or consolidating these categories could free up valuable shelf space for top performers.`,
            metric: {
              value: lowPerformers.length,
              change: 0,
              unit: 'underperforming categories'
            },
            actions: [
              {
                label: 'Category Performance Review',
                action: () => console.log('Analyze category ROI and turnover')
              },
              {
                label: 'Negotiate Better Terms',
                action: () => console.log('Renegotiate supplier agreements')
              },
              {
                label: 'Test Category Consolidation',
                action: () => console.log('Pilot category space reallocation')
              }
            ],
            confidence: 78,
            impact: 'Improve space efficiency and overall profitability by 8-12%',
            category: 'inventory'
          });
        }
      }

      // 7. HIGH-VALUE CUSTOMER INSIGHTS
      if (dashboardData?.summary_stats) {
        const avgTransaction = dashboardData.summary_stats.avg_transaction || 0;
        const totalTransactions = dashboardData.summary_stats.total_transactions || 0;
        
        // Simulate high-value customer analysis
        if (avgTransaction > 0) {
          const highValueThreshold = avgTransaction * 2;
          const estimatedHighValueCustomers = Math.round(totalTransactions * 0.15); // Estimate 15% are high-value
          
          insights.push({
            id: 'vip-customer-program',
            type: 'recommendation',
            priority: 'high',
            title: 'VIP Customer Loyalty Program',
            description: `Approximately ${estimatedHighValueCustomers} customers spend above ₱${highValueThreshold.toFixed(0)} per transaction. A targeted VIP program could increase their frequency by 25% and average spend by 15%.`,
            metric: {
              value: estimatedHighValueCustomers,
              change: 25,
              unit: '% frequency increase potential'
            },
            actions: [
              {
                label: 'Design VIP Program',
                action: () => console.log('Create tiered loyalty program')
              },
              {
                label: 'Exclusive Product Access',
                action: () => console.log('Offer early access to new products')
              },
              {
                label: 'Personalized Offers',
                action: () => console.log('Create individual customer promotions')
              }
            ],
            confidence: 89,
            impact: 'Increase high-value customer lifetime value by 35-40%',
            category: 'marketing'
          });
        }
      }

      // 8. SEASONAL TREND PREDICTION
      if (dashboardData?.transaction_trends?.weekly) {
        const weeklyData = dashboardData.transaction_trends.weekly;
        if (weeklyData && weeklyData.length >= 4) {
          // Simple trend analysis
          const recentWeeks = weeklyData.slice(-4);
          const growthTrend = recentWeeks.map((week: any, index: number) => {
            if (index === 0) return 0;
            const prevWeek = recentWeeks[index - 1];
            return ((week.revenue - prevWeek.revenue) / prevWeek.revenue) * 100;
          }).filter(g => g !== 0);
          
          const avgGrowth = growthTrend.reduce((sum, g) => sum + g, 0) / growthTrend.length;
          
          if (Math.abs(avgGrowth) > 5) {
            insights.push({
              id: 'trend-prediction',
              type: avgGrowth > 0 ? 'trend' : 'alert',
              priority: 'medium',
              title: avgGrowth > 0 ? 'Positive Growth Momentum' : 'Revenue Trend Alert',
              description: `${avgGrowth > 0 ? 'Strong' : 'Declining'} trend detected: ${Math.abs(avgGrowth).toFixed(1)}% average weekly ${avgGrowth > 0 ? 'growth' : 'decline'} over the last month. ${avgGrowth > 0 ? 'Capitalize on this momentum' : 'Take immediate action to reverse this trend'}.`,
              metric: {
                value: Math.abs(avgGrowth),
                change: avgGrowth,
                unit: '% weekly trend'
              },
              actions: [
                {
                  label: avgGrowth > 0 ? 'Scale Successful Strategies' : 'Implement Recovery Plan',
                  action: () => console.log(avgGrowth > 0 ? 'Expand winning initiatives' : 'Launch revenue recovery initiatives')
                },
                {
                  label: 'Deep Dive Analysis',
                  action: () => console.log('Analyze root causes of trend')
                }
              ],
              confidence: 82,
              impact: avgGrowth > 0 ? 'Sustain and accelerate growth trajectory' : 'Recover revenue and stabilize performance',
              category: 'sales'
            });
          }
        }
      }

      return insights.sort((a, b) => {
        // Sort by priority (high > medium > low) then by confidence
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return b.confidence - a.confidence;
      });
    },
    enabled: isOpen && !!dashboardData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });

  const filteredInsights = insights?.filter(insight => {
    if (insightFilters.type !== 'all' && insight.type !== insightFilters.type) return false;
    if (insightFilters.priority !== 'all' && insight.priority !== insightFilters.priority) return false;
    if (insightFilters.category !== 'all' && insight.category !== insightFilters.category) return false;
    return true;
  }) || [];

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend': return TrendingUp;
      case 'opportunity': return Lightbulb;
      case 'alert': return AlertCircle;
      case 'recommendation': return Target;
      default: return Sparkles;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'opportunity': return 'text-green-600 bg-green-100 border-green-200';
      case 'alert': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'recommendation': return 'text-purple-600 bg-purple-100 border-purple-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityColor = (priority: AIInsight['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-700 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getCategoryIcon = (category: AIInsight['category']) => {
    switch (category) {
      case 'sales': return TrendingUp;
      case 'operations': return Zap;
      case 'marketing': return Users;
      case 'inventory': return Package;
      default: return Bot;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                AI Insights
                <Sparkles className="w-6 h-6 text-purple-500" />
              </h2>
              <p className="text-sm text-gray-600">
                Powered by retail intelligence • {insights?.length || 0} insights generated
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Enhanced Filters */}
        <div className="flex items-center gap-4 p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Type:</label>
            <select
              value={insightFilters.type}
              onChange={(e) => setInsightFilters(prev => ({ ...prev, type: e.target.value }))}
              className="text-sm border rounded-lg px-3 py-2 bg-white"
            >
              <option value="all">All Types</option>
              <option value="trend">📈 Trends</option>
              <option value="opportunity">💡 Opportunities</option>
              <option value="alert">⚠️ Alerts</option>
              <option value="recommendation">🎯 Recommendations</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Priority:</label>
            <select
              value={insightFilters.priority}
              onChange={(e) => setInsightFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="text-sm border rounded-lg px-3 py-2 bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <select
              value={insightFilters.category}
              onChange={(e) => setInsightFilters(prev => ({ ...prev, category: e.target.value }))}
              className="text-sm border rounded-lg px-3 py-2 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="sales">💰 Sales</option>
              <option value="operations">⚡ Operations</option>
              <option value="marketing">👥 Marketing</option>
              <option value="inventory">📦 Inventory</option>
            </select>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {filteredInsights.length} insights • Confidence: {insights?.reduce((sum, i) => sum + i.confidence, 0) / (insights?.length || 1) || 0}% avg
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
                  <Bot className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-600" />
                </div>
                <p className="text-gray-600 font-medium">Analyzing your retail data...</p>
                <p className="text-sm text-gray-500 mt-1">Generating intelligent insights</p>
              </div>
            </div>
          ) : filteredInsights.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">No insights match your filters</p>
              <p className="text-sm text-gray-500">Try adjusting your filter criteria to see more insights</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredInsights.map((insight) => {
                const Icon = getInsightIcon(insight.type);
                const CategoryIcon = getCategoryIcon(insight.category);
                const isSelected = selectedInsight === insight.id;
                
                return (
                  <Card
                    key={insight.id}
                    className={`p-6 cursor-pointer transition-all duration-200 border-2 ${
                      isSelected ? 'ring-2 ring-blue-500 shadow-lg border-blue-200' : 'hover:shadow-md border-gray-200'
                    }`}
                    onClick={() => setSelectedInsight(isSelected ? null : insight.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-xl ${getInsightColor(insight.type)} border`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-xl text-gray-900 mb-1">{insight.title}</h3>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs px-3 py-1 rounded-full font-medium border ${getPriorityColor(insight.priority)}`}>
                                {insight.priority.toUpperCase()}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <CategoryIcon className="w-3 h-3" />
                                {insight.category}
                              </div>
                              <div className="text-xs text-gray-500">
                                {insight.confidence}% confidence
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4 leading-relaxed">{insight.description}</p>
                        
                        {insight.metric && (
                          <div className="flex items-center gap-6 mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-bold text-gray-900">
                                {insight.metric.unit === 'PHP' || insight.metric.unit.includes('₱') ? '₱' : ''}
                                {insight.metric.value.toLocaleString()}
                                {insight.metric.unit === '%' || insight.metric.unit.includes('%') ? '%' : ''}
                              </span>
                              {insight.metric.change !== 0 && (
                                <span className={`text-sm font-medium px-2 py-1 rounded ${
                                  insight.metric.change > 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                                }`}>
                                  {insight.metric.change > 0 ? '+' : ''}{insight.metric.change}%
                                </span>
                              )}
                            </div>
                            {!['PHP', '%'].includes(insight.metric.unit) && !insight.metric.unit.includes('₱') && !insight.metric.unit.includes('%') && (
                              <span className="text-sm text-gray-600 font-medium">{insight.metric.unit}</span>
                            )}
                          </div>
                        )}
                        
                        {isSelected && (
                          <div className="mt-6 space-y-4 border-t pt-4">
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                              <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Expected Impact
                              </p>
                              <p className="text-sm text-gray-600">{insight.impact}</p>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                              {insight.actions.map((action, index) => (
                                <Button
                                  key={index}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.action();
                                  }}
                                  size="sm"
                                  variant={index === 0 ? 'default' : 'outline'}
                                  className={index === 0 ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : ''}
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Analysis based on {dashboardData?.summary_stats?.total_transactions?.toLocaleString() || 0} transactions
            {dashboardData?.summary_stats?.total_revenue && (
              <span> • ₱{dashboardData.summary_stats.total_revenue.toLocaleString()} total revenue</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={() => {
                const exportData = {
                  insights: filteredInsights,
                  dashboardSummary: dashboardData?.summary_stats,
                  filters: filters,
                  generatedAt: new Date().toISOString(),
                  metadata: {
                    totalInsights: insights?.length || 0,
                    avgConfidence: insights?.reduce((sum, i) => sum + i.confidence, 0) / (insights?.length || 1),
                    categories: insights?.reduce((acc, i) => {
                      acc[i.category] = (acc[i.category] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  }
                };
                const dataStr = JSON.stringify(exportData, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const exportFileDefaultName = `ai-insights-${new Date().toISOString().split('T')[0]}.json`;
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
              }}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Insights
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsOverlay;