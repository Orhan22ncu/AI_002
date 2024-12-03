import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTrainingStore } from '../../store/trainingStore';

const TrainingMetrics: React.FC = () => {
  const metrics = useTrainingStore((state) => state.metrics);
  
  if (metrics.length === 0) return null;

  const lastMetric = metrics[metrics.length - 1];

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Eğitim Metrikleri</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <span className="text-gray-300">Loss</span>
          <p className="text-2xl font-bold">{lastMetric.loss.toFixed(4)}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <span className="text-gray-300">Accuracy</span>
          <p className="text-2xl font-bold">
            {(lastMetric.accuracy * 100).toFixed(2)}%
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <span className="text-gray-300">Validation Loss</span>
          <p className="text-2xl font-bold">
            {lastMetric.validationLoss.toFixed(4)}
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <span className="text-gray-300">Validation Accuracy</span>
          <p className="text-2xl font-bold">
            {(lastMetric.validationAccuracy * 100).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="epoch" 
              stroke="#9CA3AF"
              label={{ value: 'Epoch', position: 'insideBottom', offset: -10 }}
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.375rem'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="accuracy" 
              name="Doğruluk"
              stroke="#10B981" 
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="validationAccuracy"
              name="Validasyon Doğruluğu" 
              stroke="#60A5FA"
              dot={false}
              strokeDasharray="3 3"
            />
            <Line 
              type="monotone" 
              dataKey="loss"
              name="Kayıp" 
              stroke="#F59E0B"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="validationLoss"
              name="Validasyon Kaybı"
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

export default TrainingMetrics;