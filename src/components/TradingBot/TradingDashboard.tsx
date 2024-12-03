import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, TrendingUp, DollarSign, BarChart2 } from 'lucide-react';
import { fetchKlines } from '../../services/binance';
import { RsiTrendFilterIndicator } from '../../indicators/RsiTrendFilter';
import TradingChart from './TradingChart';
import PortfolioStats from './PortfolioStats';
import TradeHistory from './TradeHistory';
import TradingControls from './TradingControls';

interface Portfolio {
  balance: number;
  initialBalance: number;
  position: {
    type: 'LONG' | 'SHORT' | null;
    entryPrice: number;
    size: number;
  };
  trades: {
    type: 'BUY' | 'SELL';
    price: number;
    size: number;
    timestamp: number;
    profit?: number;
  }[];
}

const TradingDashboard: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    balance: 100,
    initialBalance: 100,
    position: { type: null, entryPrice: 0, size: 0 },
    trades: []
  });
  const [isTrading, setIsTrading] = useState(false);

  const { data: klineData, isLoading } = useQuery({
    queryKey: ['klines'],
    queryFn: () => fetchKlines(),
    refetchInterval: isTrading ? 60000 : false,
  });

  useEffect(() => {
    if (!isTrading || !klineData?.length) return;

    const indicator = new RsiTrendFilterIndicator();
    const results = indicator.calculate(klineData);
    const lastResult = results[results.length - 1];
    const currentPrice = parseFloat(klineData[klineData.length - 1].close);

    if (!lastResult) return;

    // Trading logic
    if (!portfolio.position.type) {
      if (lastResult.signal === 'OVERSOLD' && lastResult.trend === 'UP') {
        const tradeSize = portfolio.balance * 0.95; // 95% of balance
        setPortfolio(prev => ({
          ...prev,
          balance: prev.balance - tradeSize,
          position: {
            type: 'LONG',
            entryPrice: currentPrice,
            size: tradeSize / currentPrice
          },
          trades: [...prev.trades, {
            type: 'BUY',
            price: currentPrice,
            size: tradeSize / currentPrice,
            timestamp: Date.now()
          }]
        }));
      }
    } else if (portfolio.position.type === 'LONG') {
      if (lastResult.signal === 'OVERBOUGHT' || lastResult.trend === 'DOWN') {
        const profit = (currentPrice - portfolio.position.entryPrice) * portfolio.position.size;
        setPortfolio(prev => ({
          ...prev,
          balance: prev.balance + (currentPrice * prev.position.size),
          position: { type: null, entryPrice: 0, size: 0 },
          trades: [...prev.trades, {
            type: 'SELL',
            price: currentPrice,
            size: prev.position.size,
            timestamp: Date.now(),
            profit
          }]
        }));
      }
    }
  }, [klineData, isTrading, portfolio]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  const totalProfit = portfolio.balance - portfolio.initialBalance;
  const profitPercentage = (totalProfit / portfolio.initialBalance) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">Portfolio Balance</h3>
              <DollarSign className="text-blue-400" />
            </div>
            <p className="text-2xl font-bold mt-2">${portfolio.balance.toFixed(2)}</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">Total Profit/Loss</h3>
              <TrendingUp className={`${profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            </div>
            <p className={`text-2xl font-bold mt-2 ${profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {profitPercentage >= 0 ? '+' : ''}{profitPercentage.toFixed(2)}%
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">Active Position</h3>
              <Activity className="text-purple-400" />
            </div>
            <p className="text-2xl font-bold mt-2">
              {portfolio.position.type || 'No Position'}
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">Total Trades</h3>
              <BarChart2 className="text-yellow-400" />
            </div>
            <p className="text-2xl font-bold mt-2">{portfolio.trades.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-gray-800 p-6 rounded-lg">
              <TradingChart 
                klineData={klineData || []}
                trades={portfolio.trades}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <TradingControls
              isTrading={isTrading}
              onToggleTrading={() => setIsTrading(!isTrading)}
            />
            <PortfolioStats portfolio={portfolio} />
            <TradeHistory trades={portfolio.trades} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingDashboard;