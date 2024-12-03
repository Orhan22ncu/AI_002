import { Individual } from './types';

export function calculateFitness(stats: Individual['stats']): number {
  if (!stats || stats.totalTrades < 15) return 0;
  
  // Temel metrikler - Daha dengeli ödüllendirme
  const profitScore = Math.pow(Math.max(0, stats.totalProfit), 1.3) * 
    (stats.profitFactor > 1 ? Math.pow(stats.profitFactor, 1.5) : 0.5);
  
  const winRateScore = Math.pow(stats.winRate / 100, 1.5) * 200;
  
  // Gelişmiş risk yönetimi - Daha esnek drawdown kontrolü
  const maxDrawdownTolerance = 15;
  const maxDrawdownPenalty = stats.maxDrawdown <= maxDrawdownTolerance
    ? 1
    : Math.exp(-(stats.maxDrawdown - maxDrawdownTolerance) / 15);
  const drawdownScore = maxDrawdownPenalty * 150;
  
  // İşlem tutarlılığı - Daha geniş optimal işlem aralığı
  const optimalTradeCount = 30;
  const tradeFrequencyScore = Math.exp(
    -(Math.abs(stats.totalTrades - optimalTradeCount) / 20)
  ) * 120;
  
  // Gelişmiş profit factor değerlendirmesi
  const profitFactorBonus = stats.profitFactor > 1.2
    ? Math.pow(stats.profitFactor - 1.2, 1.5) * 50
    : 0;
  
  // Risk-getiri optimizasyonu
  const riskAdjustedReturn = stats.maxDrawdown > 0
    ? (stats.totalProfit / Math.pow(stats.maxDrawdown, 1.1)) * 180
    : stats.totalProfit * 120;
  
  // Tutarlılık bonusu - Daha esnek kriterler
  const consistencyBonus = (
    stats.winRate > 55 && 
    stats.profitFactor > 1.5 && 
    stats.maxDrawdown < 18 &&
    stats.totalTrades >= 18
  ) ? 45 : 0;
  
  // Volatilite cezası - Daha toleranslı
  const volatilityPenalty = stats.maxDrawdown > 10
    ? Math.pow(stats.maxDrawdown - 10, 1.4) * 1.2
    : 0;
  
  // Minimum performans gereksinimleri - Daha esnek
  if (stats.totalProfit < -5 || stats.winRate < 35 || stats.maxDrawdown > 30) {
    return Math.max(0, profitScore * 0.15);
  }
  
  // Ağırlıklı toplam skor - Yeniden dengelenmiş ağırlıklar
  const weightedScore = (
    profitScore * 0.35 +
    winRateScore * 0.25 +
    drawdownScore * 0.15 +
    tradeFrequencyScore * 0.10 +
    profitFactorBonus * 0.08 +
    riskAdjustedReturn * 0.07
  );
  
  return Math.max(0, weightedScore + consistencyBonus - volatilityPenalty);
}