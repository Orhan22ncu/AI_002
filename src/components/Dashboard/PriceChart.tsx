import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { KlineData, RsiTrendFilter } from '../../types';

interface PriceChartProps {
  klineData: KlineData[];
  results: RsiTrendFilter[];
}

const PriceChart: React.FC<PriceChartProps> = ({ klineData, results }) => {
  const data = klineData.map((k, i) => ({
    time: new Date(k.closeTime).toLocaleTimeString(),
    price: parseFloat(k.close),
    ma: results[i]?.rsiMa || null,
    upper: results[i]?.bands.upper || null,
    lower: results[i]?.bands.lower || null,
  }));

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#60A5FA"
              fill="#3B82F6"
              fillOpacity={0.1}
            />
            <Area
              type="monotone"
              dataKey="ma"
              stroke="#10B981"
              fill="none"
            />
            <Area
              type="monotone"
              dataKey="upper"
              stroke="#F59E0B"
              fill="none"
              strokeDasharray="3 3"
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="#F59E0B"
              fill="none"
              strokeDasharray="3 3"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;