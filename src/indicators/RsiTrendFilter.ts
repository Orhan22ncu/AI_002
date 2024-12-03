import { RSI, EMA } from 'technicalindicators';
import { KlineData, RsiTrendFilter } from '../types';

export class RsiTrendFilterIndicator {
  private rsiLength: number;
  private rsima: number;
  private emalen: number;
  private atrPeriod: number;
  private level2: number;
  private level3: number;
  private level5: number;

  constructor({
    rsiLength = 14,
    rsima = 100,
    emalen = 20,
    level2 = 10,
    level3 = 40,
    level5 = 50
  } = {}) {
    this.rsiLength = rsiLength;
    this.rsima = rsima;
    this.emalen = emalen;
    this.atrPeriod = 100;
    this.level2 = level2;
    this.level3 = level3;
    this.level5 = level5;
  }

  calculate(data: KlineData[]): RsiTrendFilter[] {
    const closes = data.map(d => parseFloat(d.close));
    const opens = data.map(d => parseFloat(d.open));
    const highs = data.map(d => parseFloat(d.high));
    const lows = data.map(d => parseFloat(d.low));
    
    // Calculate RSI
    const rsi = new RSI({ values: closes, period: this.rsiLength }).getResult();

    // Calculate ATR
    const tr = this.calculateTR(highs, lows, closes);
    const atr = this.calculateEMA(tr, this.atrPeriod);

    // Calculate adjusted RSI
    const adjRsi = closes.map((close, i) => 
      close + (atr[i] * (rsi[i] || 0) / 100)
    );

    // Calculate RSI MA
    const rsiMa = this.calculateEMA(adjRsi, this.rsima);
    
    // Calculate RSI EMA
    const rsiEma = this.calculateEMA(adjRsi, this.emalen);

    return adjRsi.map((value, i) => {
      if (!rsiMa[i]) return null;

      const ma = rsiMa[i];
      const atrValue = atr[i];

      const bands = {
        upper: ma + (atrValue * 5),
        lower: ma - (atrValue * 5),
        level2Upper: ma + (atrValue * this.level2 / 10),
        level2Lower: ma - (atrValue * this.level2 / 10),
        level3Upper: ma + (atrValue * this.level3 / 10),
        level3Lower: ma - (atrValue * this.level3 / 10),
        level5Upper: ma + (atrValue * this.level5 / 10),
        level5Lower: ma - (atrValue * this.level5 / 10),
      };

      return {
        rsi: rsi[i] || 0,
        adjRsi: value,
        rsiMa: ma,
        rsiEma: rsiEma[i] || 0,
        bands,
        trend: this.determineTrend(opens[i], ma),
        signal: this.determineSignal(value, bands)
      };
    }).filter(Boolean) as RsiTrendFilter[];
  }

  private calculateTR(highs: number[], lows: number[], closes: number[]): number[] {
    return highs.map((high, i) => {
      if (i === 0) return high - lows[i];
      
      const prevClose = closes[i - 1];
      return Math.max(
        high - lows[i],
        Math.abs(high - prevClose),
        Math.abs(lows[i] - prevClose)
      );
    });
  }

  private calculateEMA(values: number[], period: number): number[] {
    const ema = new EMA({ values, period });
    return ema.getResult();
  }

  private determineTrend(open: number, ma: number): 'UP' | 'DOWN' | 'NEUTRAL' {
    if (open > ma) return 'UP';
    if (open < ma) return 'DOWN';
    return 'NEUTRAL';
  }

  private determineSignal(
    value: number,
    bands: RsiTrendFilter['bands']
  ): 'OVERBOUGHT' | 'OVERSOLD' | 'NORMAL' {
    if (value > bands.level3Upper) return 'OVERBOUGHT';
    if (value < bands.level3Lower) return 'OVERSOLD';
    return 'NORMAL';
  }
}