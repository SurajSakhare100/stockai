
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { StockHistoricalData, StockPrediction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StockChartProps {
  data: StockHistoricalData[];
  prediction?: StockPrediction | null;
  timeframe: 'day' | 'week' | 'month' | 'year';
  onTimeframeChange: (timeframe: 'day' | 'week' | 'month' | 'year') => void;
  isLoading?: boolean;
}

const StockChart: React.FC<StockChartProps> = ({ 
  data, 
  prediction, 
  timeframe, 
  onTimeframeChange,
  isLoading = false
}) => {
  // Format date based on timeframe
  const formatDate = (date: string) => {
    const d = new Date(date);
    if (timeframe === 'day') {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeframe === 'week') {
      return d.toLocaleDateString([], { weekday: 'short' });
    } else if (timeframe === 'month') {
      return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
    }
    return d.toLocaleDateString([], { month: 'short', year: '2-digit' });
  };
  
  // Determine chart color based on price trend
  const chartColor = data.length > 1 && data[0].close < data[data.length - 1].close 
    ? '#2CA58D' // Green for uptrend
    : '#DB504A'; // Red for downtrend
  
  // Add prediction point if available
  const chartData = [...data];
  
  const latestDate = data.length > 0 ? new Date(data[data.length - 1].date) : new Date();
  
  if (prediction) {
    const predDate = new Date(prediction.date);
    
    // Only add prediction if it's for a future date
    if (predDate > latestDate) {
      chartData.push({
        date: prediction.date,
        open: prediction.predictedPrice,
        high: prediction.predictedPrice,
        low: prediction.predictedPrice,
        close: prediction.predictedPrice,
        volume: 0
      });
    }
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="px-6 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Price History</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant={timeframe === 'day' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => onTimeframeChange('day')}
              className="text-xs h-8 px-3"
            >
              1D
            </Button>
            <Button 
              variant={timeframe === 'week' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => onTimeframeChange('week')}
              className="text-xs h-8 px-3"
            >
              1W
            </Button>
            <Button 
              variant={timeframe === 'month' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => onTimeframeChange('month')}
              className="text-xs h-8 px-3"
            >
              1M
            </Button>
            <Button 
              variant={timeframe === 'year' ? 'secondary' : 'outline'} 
              size="sm"
              onClick={() => onTimeframeChange('year')}
              className="text-xs h-8 px-3"
            >
              1Y
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4 h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse-subtle text-muted-foreground">Loading chart data...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                minTickGap={30}
                tick={{ fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tick={{ fontSize: 12 }}
                width={45}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value: any) => [`$${value}`, 'Price']}
                labelFormatter={(label) => formatDate(label.toString())}
              />
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke={chartColor} 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: chartColor }}
              />
              
              {/* Draw a dashed line where historical data ends and prediction begins */}
              {prediction && (
                <ReferenceLine 
                  x={data[data.length-1].date} 
                  stroke="#666" 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: "Prediction", 
                    position: "insideBottomRight",
                    fill: "#666",
                    fontSize: 12
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default StockChart;
