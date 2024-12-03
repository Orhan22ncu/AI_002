import React from 'react';
import { TradeSignal } from '../../types';

interface TradeListProps {
  signals: TradeSignal[];
}

const TradeList: React.FC<TradeListProps> = ({ signals }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Recent Trades</h2>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {signals.slice(-10).reverse().map((signal, index) => (
          <div
            key={index}
            className={`p-3 rounded ${
              signal.action === 'BUY'
                ? 'bg-green-900 bg-opacity-20'
                : 'bg-red-900 bg-opacity-20'
            }`}
          >
            <div className="flex justify-between items-center">
              <span
                className={`font-semibold ${
                  signal.action === 'BUY' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {signal.action}
              </span>
              <span className="text-gray-400">
                {new Date(signal.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-400">Price:</span>
              <span>${signal.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Confidence:</span>
              <span>{signal.confidence.toFixed(2)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeList;