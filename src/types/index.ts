export interface KlineData {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
}

export interface TrainingMetric {
  epoch: number;
  loss: number;
  accuracy: number;
  validationLoss: number;
  validationAccuracy: number;
}

export interface TrainingOptions {
  onProgress?: (metric: TrainingMetric) => void;
}

export interface TradeSignal {
  timestamp: number;
  action: 'BUY' | 'SELL' | 'HOLD';
  price: number;
  confidence: number;
}

export interface RsiTrendFilter {
  rsi: number;
  adjRsi: number;
  rsiMa: number;
  rsiEma: number;
  bands: {
    upper: number;
    lower: number;
    level2Upper: number;
    level2Lower: number;
    level3Upper: number;
    level3Lower: number;
    level5Upper: number;
    level5Lower: number;
  };
  trend: 'UP' | 'DOWN' | 'NEUTRAL';
  signal: 'OVERBOUGHT' | 'OVERSOLD' | 'NORMAL';
}