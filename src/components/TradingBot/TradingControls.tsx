import React from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

interface TradingControlsProps {
  isTrading: boolean;
  onToggleTrading: () => void;
}

const TradingControls: React.FC<TradingControlsProps> = ({
  isTrading,
  onToggleTrading
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Trading Controls</h2>
      <div className="space-y-4">
        <button
          onClick={onToggleTrading}
          className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 ${
            isTrading
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isTrading ? (
            <>
              <Pause size={20} />
              Stop Trading
            </>
          ) : (
            <>
              <Play size={20} />
              Start Trading
            </>
          )}
        </button>
        
        {isTrading && (
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <RefreshCw size={16} className="animate-spin" />
            Auto-trading active
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingControls;