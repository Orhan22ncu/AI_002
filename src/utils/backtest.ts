import { KlineData, RsiTrendFilter, TradeSignal } from '../types';
import { RsiTrendFilterIndicator } from '../indicators/RsiTrendFilter';

export interface BacktestResult {
  signals: TradeSignal[];
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalProfit: number;
  winRate: number;
  averageProfit: number;
  maxDrawdown: number;
  profitFactor: number;
}

export function backtest(
  data: KlineData[],
  indicator: RsiTrendFilterIndicator,
  config: {
    stopLoss: number;
    takeProfit: number;
  }
): BacktestResult {
  const results = indicator.calculate(data);
  const signals: TradeSignal[] = [];
  let position: 'LONG' | 'SHORT' | null = null;
  let entryPrice = 0;
  let stats = {
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    totalProfit: 0,
    maxDrawdown: 0,
    consecutiveWins: 0,
    maxConsecutiveWins: 0,
    consecutiveLosses: 0,
    maxConsecutiveLosses: 0,
    profitHistory: [] as number[],
  };

  let highestBalance = 0;
  let currentDrawdown = 0;

  for (let i = 2; i < data.length; i++) {
    const currentPrice = parseFloat(data[i].close);
    const result = results[i];
    const prevResult = results[i - 1];
    const prevResult2 = results[i - 2];
    
    if (!result || !prevResult || !prevResult2 || !currentPrice) continue;

    // Pozisyon kapatma kontrolleri
    if (position) {
      const profitPercent = position === 'LONG' 
        ? ((currentPrice - entryPrice) / entryPrice) * 100
        : ((entryPrice - currentPrice) / entryPrice) * 100;

      // Gelişmiş trend dönüşü tespiti
      const trendReversal = 
        (position === 'LONG' && (
          (result.adjRsi < result.rsiMa && prevResult.adjRsi >= prevResult.rsiMa) ||
          (result.signal === 'OVERBOUGHT' && result.adjRsi > result.bands.level3Upper) ||
          (result.trend !== prevResult.trend && result.trend === 'DOWN' && result.adjRsi < result.rsiMa)
        ));

      // Stop loss ve take profit kontrolü
      const stopLossHit = profitPercent <= -config.stopLoss;
      const takeProfitHit = profitPercent >= config.takeProfit;

      if (stopLossHit || takeProfitHit || trendReversal) {
        signals.push({
          timestamp: data[i].closeTime,
          action: 'SELL',
          price: currentPrice,
          confidence: Math.abs(profitPercent)
        });

        // İstatistik güncelleme
        stats.totalTrades++;
        stats.profitHistory.push(profitPercent);
        
        if (profitPercent > 0) {
          stats.winningTrades++;
          stats.consecutiveWins++;
          stats.consecutiveLosses = 0;
          stats.maxConsecutiveWins = Math.max(stats.maxConsecutiveWins, stats.consecutiveWins);
        } else {
          stats.losingTrades++;
          stats.consecutiveLosses++;
          stats.consecutiveWins = 0;
          stats.maxConsecutiveLosses = Math.max(stats.maxConsecutiveLosses, stats.consecutiveLosses);
        }

        stats.totalProfit += profitPercent;
        
        // Drawdown hesaplama
        if (stats.totalProfit > highestBalance) {
          highestBalance = stats.totalProfit;
          currentDrawdown = 0;
        } else {
          currentDrawdown = highestBalance - stats.totalProfit;
          stats.maxDrawdown = Math.max(stats.maxDrawdown, currentDrawdown);
        }

        position = null;
        entryPrice = 0;
        continue;
      }
    }

    // Gelişmiş giriş koşulları
    if (!position) {
      // Trend ve momentum analizi
      const trendStrength = 
        result.trend === 'UP' && 
        prevResult.trend === 'UP' &&
        result.adjRsi > result.rsiMa &&
        result.adjRsi > prevResult.adjRsi;

      // RSI ve band analizi
      const oversoldRecovery =
        result.signal === 'NORMAL' &&
        prevResult.signal === 'OVERSOLD' &&
        result.adjRsi > result.rsiMa &&
        result.adjRsi > result.bands.level3Lower;

      // Volatilite kontrolü
      const volatilityCheck = 
        Math.abs(result.adjRsi - prevResult.adjRsi) < result.bands.level2Upper - result.bands.level2Lower;

      if ((trendStrength || oversoldRecovery) && volatilityCheck) {
        position = 'LONG';
        entryPrice = currentPrice;
        signals.push({
          timestamp: data[i].closeTime,
          action: 'BUY',
          price: currentPrice,
          confidence: Math.abs(result.adjRsi - result.rsiMa) / result.rsiMa * 100
        });
      }
    }
  }

  const winRate = stats.totalTrades > 0 ? (stats.winningTrades / stats.totalTrades) * 100 : 0;
  const averageProfit = stats.totalTrades > 0 ? stats.totalProfit / stats.totalTrades : 0;
  
  // Profit Factor hesaplama
  const profitFactor = calculateProfitFactor(stats.profitHistory);

  return {
    signals,
    totalTrades: stats.totalTrades,
    winningTrades: stats.winningTrades,
    losingTrades: stats.losingTrades,
    totalProfit: stats.totalProfit,
    winRate,
    averageProfit,
    maxDrawdown: stats.maxDrawdown,
    profitFactor
  };
}

function calculateProfitFactor(profitHistory: number[]): number {
  const grossProfit = profitHistory
    .filter(profit => profit > 0)
    .reduce((sum, profit) => sum + profit, 0);
    
  const grossLoss = Math.abs(profitHistory
    .filter(profit => profit < 0)
    .reduce((sum, profit) => sum + profit, 0));
    
  return grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
}