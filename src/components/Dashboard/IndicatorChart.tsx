import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { RsiTrendFilter } from '../../types';

interface IndicatorChartProps {
  results: RsiTrendFilter[];
}

const IndicatorChart: React.FC<IndicatorChartProps> = ({ results }) => {
  const data = results.map((r, i) => ({
    index: i,
    adjRsi: r.adjRsi,
    rsiMa: r.rsiMa,
    upper: r.bands.upper,
    lower: r.bands.lower,
    level3Upper: r.bands.level3Upper,
    level3Lower: r.bands.level3Lower,
  }));

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">RSI Trend Filter</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="index" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Area
              type="monotone"
              dataKey="adjRsi"
              stroke="#60A5FA"
              fill="#3B82F6"
              fillOpacity={0.1}
            />
            <Line
              type="monotone"
              dataKey="rsiMa"
              stroke="#10B981"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="upper"
              stroke="#F59E0B"
              dot={false}
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="lower"
              stroke="#F59E0B"
              dot={false}
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="level3Upper"
              stroke="#EC4899"
              dot={false}
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="level3Lower"
              stroke="#EC4899"
              dot={false}
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IndicatorChart;