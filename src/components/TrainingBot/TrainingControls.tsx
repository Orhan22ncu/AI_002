import React from 'react';
import { Play, Pause } from 'lucide-react';

interface TrainingControlsProps {
  isTraining: boolean;
  onStartTraining: () => void;
}

const TrainingControls: React.FC<TrainingControlsProps> = ({
  isTraining,
  onStartTraining
}) => {
  return (
    <button
      onClick={onStartTraining}
      disabled={isTraining}
      className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
        isTraining
          ? 'bg-gray-600 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {isTraining ? (
        <>
          <Pause size={20} />
          Eğitim Devam Ediyor...
        </>
      ) : (
        <>
          <Play size={20} />
          Eğitimi Başlat
        </>
      )}
    </button>
  );
};

export default TrainingControls;