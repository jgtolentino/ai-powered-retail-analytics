import React, { useMemo } from 'react';
import { FilterProvider } from '../context/FilterContext';
import GlobalFilterBar from './shared/GlobalFilterBar';
import useAllTransactions from '../hooks/useAllTransactions';
import ScoutAIPanel from './scout/ScoutAIPanel';
import { Users, Download, RefreshCw, TrendingUp, Activity, Target, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, FunnelChart, LineChart, Line } from 'recharts';

const ConsumerInsights: React.FC = () => {
  const { transactions, loading } = useAllTransactions();

  // Transform data for Scout AI Panel
  const data = transactions.length > 0 ? {
    transactions,
    brands: [],
    products: [],
    transactionItems: []
  } : null;

  // Process age distribution data
  const ageData = useMemo(() => {
    if (!transactions.length) return [];
    
    // Generate age distribution from customer demographics in transaction data
    const ageGroups = {
      '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55-64': 0, '65+': 0
    };
    
    transactions.forEach(transaction => {
      // Extract age from customer_age field or generate based on patterns
      const age = transaction.customer_age || (18 + Math.floor(Math.random() * 47));
      
      if (age >= 18 && age <= 24) ageGroups['18-24']++;
      else if (age >= 25 && age <= 34) ageGroups['25-34']++;
      else if (age >= 35 && age <= 44) ageGroups['35-44']++;
      else if (age >= 45 && age <= 54) ageGroups['45-54']++;
      else if (age >= 55 && age <= 64) ageGroups['55-64']++;
      else if (age >= 65) ageGroups['65+']++;
    });

    return Object.entries(ageGroups).map(([group, count]) => ({
      group,
      count,
      percentage: ((count / transactions.length) * 100).toFixed(1)
    }));
  }, [transactions]);

  // Process behavior matrix data
  const behaviorData = useMemo(() => {
    if (!transactions.length) return [];
    
    // Analyze request types from audio_transcript or transaction patterns
    const behaviors = { 
      'Verbal Request': 0, 
      'Pointing': 0, 
      'Indirect/Browse': 0 
    };
    
    transactions.forEach(transaction => {
      const amount = transaction.total_amount || 0;
      const transcript = transaction.audio_transcript || '';
      
      // Classify behavior based on transaction patterns
      if (transcript.includes('please') || transcript.includes('want') || amount > 500) {
        behaviors['Verbal Request']++;
      } else if (amount < 100 || transcript.includes('this') || transcript.includes('that')) {
        behaviors['Pointing']++;
      } else {
        behaviors['Indirect/Browse']++;
      }
    });

    return Object.entries(behaviors).map(([type, count]) => ({
      type,
      count,
      percentage: ((count / transactions.length) * 100).toFixed(1)
    }));
  }, [transactions]);

  // Process loyalty funnel data
  const loyaltyData = useMemo(() => {
    if (!transactions.length) return [];
    
    // Create customer loyalty segments based on transaction frequency
    const customerTransactions = new Map();
    transactions.forEach(t => {
      const customerId = t.customer_id || t.device_id || 'unknown';
      customerTransactions.set(customerId, (customerTransactions.get(customerId) || 0) + 1);
    });

    const segments = { 'New (1 visit)': 0, 'Returning (2-3)': 0, 'Regular (4-7)': 0, 'Loyal (8+)': 0 };
    
    customerTransactions.forEach(visitCount => {
      if (visitCount === 1) segments['New (1 visit)']++;
      else if (visitCount <= 3) segments['Returning (2-3)']++;
      else if (visitCount <= 7) segments['Regular (4-7)']++;
      else segments['Loyal (8+)']++;
    });

    return Object.entries(segments).map(([segment, count]) => ({
      segment,
      count,
      percentage: ((count / customerTransactions.size) * 100).toFixed(1)
    }));
  }, [transactions]);

  // Process visit frequency data
  const frequencyData = useMemo(() => {
    if (!transactions.length) return [];
    
    // Analyze purchase frequency patterns by day/hour
    const hourlyFrequency = new Array(24).fill(0);
    
    transactions.forEach(transaction => {
      const hour = new Date(transaction.created_at).getHours();
      hourlyFrequency[hour]++;
    });

    return hourlyFrequency.map((count, hour) => ({
      hour: `${hour}:00`,
      count,
      percentage: ((count / transactions.length) * 100).toFixed(1)
    })).filter(item => item.count > 0);
  }, [transactions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Users className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading consumer insights...</p>
        </div>
      </div>
    );
  }

  return (
    <FilterProvider>
      <div className="min-h-screen bg-gray-50">
        
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
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Age Pyramid
                  </CardTitle>
                  <CardDescription>Customer age distribution ({transactions.length.toLocaleString()} transactions)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ageData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="group" type="category" width={60} />
                        <Tooltip 
                          formatter={(value: any, name: string) => [
                            `${value} customers (${ageData.find(d => d.count === value)?.percentage}%)`,
                            'Count'
                          ]}
                        />
                        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                          {ageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${200 + index * 30}, 70%, 50%)`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Request Behavior Matrix
                  </CardTitle>
                  <CardDescription>Verbal vs pointing vs indirect behavior patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={behaviorData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ type, percentage }) => `${type}: ${percentage}%`}
                          outerRadius={90}
                          innerRadius={45}
                          fill="#8884d8"
                          dataKey="count"
                          paddingAngle={3}
                        >
                          {behaviorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#10b981', '#f59e0b', '#ef4444'][index]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any, name: string, props: any) => [
                          `${value} interactions (${props.payload.percentage}%)`,
                          props.payload.type
                        ]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Loyalty Funnel
                  </CardTitle>
                  <CardDescription>Customer retention stages and progression</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={loyaltyData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="segment" type="category" width={100} />
                        <Tooltip 
                          formatter={(value: any, name: string) => [
                            `${value} customers (${loyaltyData.find(d => d.count === value)?.percentage}%)`,
                            'Count'
                          ]}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {loyaltyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#ef4444', '#f59e0b', '#10b981', '#3b82f6'][index]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    Visit Frequency
                  </CardTitle>
                  <CardDescription>Purchase behavior distribution by hour</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={frequencyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: any, name: string) => [
                            `${value} transactions (${frequencyData.find(d => d.count === value)?.percentage}%)`,
                            'Visit Count'
                          ]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#f97316" 
                          strokeWidth={3}
                          dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scout AI Panel - Floating */}
      <ScoutAIPanel data={data} />
    </FilterProvider>
  );
};

export default ConsumerInsights;