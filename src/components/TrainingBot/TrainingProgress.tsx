import React from 'react';
import { Activity } from 'lucide-react';

interface TrainingProgressProps {
  progress: number;
  generation: number;
  totalGenerations: number;
}

const TrainingProgress: React.FC<TrainingProgressProps> = ({
  progress,
  generation,
  totalGenerations
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Training Progress</h2>
        <Activity className="text-blue-400" size={20} />
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Generation</span>
          <span className="font-semibold">
            {generation} / {totalGenerations}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrainingProgress;