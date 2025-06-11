import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import useAllTransactions from '../../../hooks/useAllTransactions';
import { Clock, TrendingUp } from 'lucide-react';

interface HourlyTrendData {
  hour: number;
  day_of_week: number;
  transaction_count: number;
  revenue: number;
  avg_basket: number;
}

export const DailyTrendsHeatmap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { transactions, loading, error } = useAllTransactions();

  // Process ALL 18K transactions into heatmap data
  const processHeatmapData = (): HourlyTrendData[] => {
    if (!transactions || transactions.length === 0) return [];

    // Initialize all hour/day combinations
    const heatmapData: HourlyTrendData[] = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 6; hour < 22; hour++) {
        heatmapData.push({
          hour,
          day_of_week: day,
          transaction_count: 0,
          revenue: 0,
          avg_basket: 0
        });
      }
    }

    // Group ALL transactions by hour and day of week
    const grouped = new Map<string, { count: number; totalRevenue: number }>();
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.created_at);
      const hour = date.getHours();
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Only include business hours
      if (hour >= 6 && hour < 22) {
        const key = `${dayOfWeek}-${hour}`;
        const existing = grouped.get(key) || { count: 0, totalRevenue: 0 };
        grouped.set(key, {
          count: existing.count + 1,
          totalRevenue: existing.totalRevenue + (transaction.total_amount || 0)
        });
      }
    });

    // Update heatmap data with real values from ALL 18K transactions
    heatmapData.forEach(item => {
      const key = `${item.day_of_week}-${item.hour}`;
      const data = grouped.get(key);
      if (data) {
        item.transaction_count = data.count;
        item.revenue = data.totalRevenue;
        item.avg_basket = data.count > 0 ? data.totalRevenue / data.count : 0;
      }
    });

    return heatmapData;
  };

  const data = processHeatmapData();

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Calculate cell dimensions
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 9 PM
    
    const cellWidth = (rect.width - 60) / hours.length;
    const cellHeight = (rect.height - 40) / days.length;

    // Find max transaction count for normalization
    const maxTransactions = Math.max(...data.map(d => d.transaction_count));

    // Draw heatmap cells
    data.forEach(item => {
      if (item.hour < 6 || item.hour > 21) return; // Only show 6 AM to 9 PM
      
      const x = 50 + (item.hour - 6) * cellWidth;
      const y = 20 + item.day_of_week * cellHeight;
      
      // Calculate intensity (0-1)
      const intensity = item.transaction_count / maxTransactions;
      
      // Color based on intensity (blue to red)
      const hue = (1 - intensity) * 240; // 240 (blue) to 0 (red)
      const color = `hsl(${hue}, 70%, ${50 + intensity * 30}%)`;
      
      ctx.fillStyle = color;
      ctx.fillRect(x, y, cellWidth - 1, cellHeight - 1);
      
      // Add transaction count text for high-intensity cells
      if (intensity > 0.6) {
        ctx.fillStyle = 'white';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          item.transaction_count.toString(),
          x + cellWidth / 2,
          y + cellHeight / 2 + 3
        );
      }
    });

    // Draw labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    
    // Day labels
    days.forEach((day, i) => {
      ctx.fillText(day, 45, 20 + i * cellHeight + cellHeight / 2 + 4);
    });
    
    // Hour labels
    ctx.textAlign = 'center';
    hours.forEach((hour, i) => {
      ctx.fillText(
        `${hour}:00`,
        50 + i * cellWidth + cellWidth / 2,
        rect.height - 5
      );
    });

  }, [data]);

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Daily Trends Heatmap
          </CardTitle>
          <CardDescription>Processing {transactions.length} transactions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded animate-pulse flex items-center justify-center">
            <div className="text-gray-500">Loading transaction patterns...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-600">Unable to load daily trends data</div>
        </CardContent>
      </Card>
    );
  }

  const peakHours = data?.reduce((acc, curr) => {
    if (curr.transaction_count > (acc?.transaction_count || 0)) {
      return curr;
    }
    return acc;
  }, data[0]);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Daily Trends Heatmap
        </CardTitle>
        <CardDescription>
          Transaction intensity by hour and day of week
          {peakHours && (
            <span className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              Peak: {peakHours.hour}:00 with {peakHours.transaction_count} transactions
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-64 border rounded"
            style={{ display: 'block' }}
          />
          
          {/* Legend */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>Low Activity</span>
              <div className="flex">
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((intensity, i) => {
                  const hue = (1 - intensity) * 240;
                  return (
                    <div
                      key={i}
                      className="w-4 h-4 border"
                      style={{ backgroundColor: `hsl(${hue}, 70%, ${50 + intensity * 30}%)` }}
                    />
                  );
                })}
              </div>
              <span>High Activity</span>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>Best performing time periods highlighted</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyTrendsHeatmap;