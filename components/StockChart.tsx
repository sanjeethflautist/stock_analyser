"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';

interface StockChartProps {
  data: any[];
  symbol: string;
}

export default function StockChart({ data, symbol }: StockChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <p className="text-gray-600 dark:text-gray-400 text-center">No historical data available</p>
      </div>
    );
  }

  // Format data for the chart
  const chartData = data.slice(-60).map(item => ({
    date: item.date,
    price: item.close,
    volume: item.volume,
  }));

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd');
    } catch {
      return dateStr;
    }
  };

  const formatPrice = (value: number) => `$${value.toFixed(2)}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        {symbol} - 60 Day Price Chart
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              tickFormatter={formatPrice}
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              labelFormatter={formatDate}
              formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Price']}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#6366f1" 
              strokeWidth={2}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">60-Day High</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            ${Math.max(...chartData.map(d => d.price)).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">60-Day Low</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            ${Math.min(...chartData.map(d => d.price)).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Average Price</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            ${(chartData.reduce((sum, d) => sum + d.price, 0) / chartData.length).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Volume</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {(chartData.reduce((sum, d) => sum + d.volume, 0) / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>
    </div>
  );
}
