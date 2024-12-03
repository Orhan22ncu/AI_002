import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TradeHistoryProps {
  trades: {
    type: 'BUY' | 'SELL';
    price: number;
    size: number;
    timestamp: number;
    profit?: number;
  }[];
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Recent Trades</h2>
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {trades.slice().reverse().map((trade, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              trade.type === 'BUY'
                ? 'bg-green-900 bg-opacity-20'
                : 'bg-red-900 bg-opacity-20'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className={`font-semibold ${
                trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'
              }`}>
                {trade.type}
              </span>
              <span className="text-gray-400">
                {new Date(trade.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Price</span>
                <span>${trade.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Size</span>
                <span>{trade.size.toFixed(4)}</span>
              </div>
              {trade.profit !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Profit</span>
                  <div className="flex items-center gap-1">
                    {trade.profit >= 0 ? (
                      <ArrowUpRight className="text-green-400" size={16} />
                    ) : (
                      <ArrowDownRight className="text-red-400" size={16} />
                    )}
                    <span className={trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                      ${trade.profit.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeHistory;