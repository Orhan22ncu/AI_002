import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PortfolioStatsProps {
  portfolio: {
    balance: number;
    initialBalance: number;
    trades: {
      profit?: number;
    }[];
  };
}

const PortfolioStats: React.FC<PortfolioStatsProps> = ({ portfolio }) => {
  const winningTrades = portfolio.trades.filter(t => t.profit && t.profit > 0).length;
  const totalTrades = portfolio.trades.length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const totalProfit = portfolio.balance - portfolio.initialBalance;
  const profitPercentage = (totalProfit / portfolio.initialBalance) * 100;

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Portfolio Statistics</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Win Rate</span>
          <span className="font-semibold">{winRate.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total P/L</span>
          <div className="flex items-center gap-2">
            {profitPercentage >= 0 ? (
              <ArrowUpRight className="text-green-400" size={20} />
            ) : (
              <ArrowDownRight className="text-red-400" size={20} />
            )}
            <span className={`font-semibold ${
              profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {profitPercentage.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total Trades</span>
          <span className="font-semibold">{totalTrades}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Winning Trades</span>
          <span className="font-semibold text-green-400">{winningTrades}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Losing Trades</span>
          <span className="font-semibold text-red-400">
            {totalTrades - winningTrades}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioStats;