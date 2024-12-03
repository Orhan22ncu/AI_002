import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { KlineData } from '../../types';
import { GeneticAlgorithm } from '../../utils/geneticAlgorithm';
import { RsiTrendFilterIndicator } from '../../indicators/RsiTrendFilter';

interface TrainingChartProps {
  klineData: KlineData[];
  geneticAlgorithm: GeneticAlgorithm | null;
}

const TrainingChart: React.FC<TrainingChartProps> = ({ klineData, geneticAlgorithm }) => {
  const bestIndividual = geneticAlgorithm?.getBestIndividual();
  const indicator = bestIndividual 
    ? new RsiTrendFilterIndicator(bestIndividual.genes)
    : new RsiTrendFilterIndicator();
  
  const results = indicator.calculate(klineData);
  
  const data = klineData.map((k, i) => ({
    time: new Date(k.closeTime).toLocaleTimeString(),
    price: parseFloat(k.close),
    rsi: results[i]?.adjRsi,
    rsiMa: results[i]?.rsiMa,
    upper: results[i]?.bands.upper,
    lower: results[i]?.bands.lower,
  }));

  return (
    <div className="h-[600px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '0.375rem',
              color: '#F3F4F6'
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#60A5FA"
            dot={false}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="rsiMa"
            stroke="#10B981"
            dot={false}
            strokeWidth={1}
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
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrainingChart;