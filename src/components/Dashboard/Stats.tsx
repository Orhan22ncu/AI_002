import React from 'react';
import { BacktestResult } from '../../utils/backtest';

interface StatsProps {
  results: BacktestResult;
}

const Stats: React.FC<StatsProps> = ({ results }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Performance Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-700 rounded">
          <p className="text-gray-400 text-sm">Total Trades</p>
          <p className="text-2xl font-bold">{results.totalTrades || 0}</p>
        </div>
        <div className="p-3 bg-gray-700 rounded">
          <p className="text-gray-400 text-sm">Win Rate</p>
          <p className="text-2xl font-bold">
            {results.totalTrades > 0 ? `${results.winRate.toFixed(2)}%` : '0%'}
          </p>
        </div>
        <div className="p-3 bg-gray-700 rounded">
          <p className="text-gray-400 text-sm">Total Profit</p>
          <p className={`text-2xl font-bold ${results.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {results.totalProfit.toFixed(2)}%
          </p>
        </div>
        <div className="p-3 bg-gray-700 rounded">
          <p className="text-gray-400 text-sm">Avg. Profit/Trade</p>
          <p className={`text-2xl font-bold ${results.averageProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {results.totalTrades > 0 ? `${results.averageProfit.toFixed(2)}%` : '0%'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stats;