import React from 'react';
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Bar,
  Line,
} from 'recharts';
import { KlineData } from '../../types';
import { RsiTrendFilterIndicator } from '../../indicators/RsiTrendFilter';

interface TradingChartProps {
  klineData: KlineData[];
  trades: {
    type: 'BUY' | 'SELL';
    price: number;
    timestamp: number;
  }[];
}

const CustomCandlestick = (props: any) => {
  const { x, y, width, open, close, high, low } = props;
  const isGreen = close > open;
  const color = isGreen ? '#10B981' : '#EF4444';
  const wickHeight = Math.abs(high - low);
  const bodyHeight = Math.abs(open - close);
  const bodyY = isGreen ? y + (high - close) : y + (high - open);

  return (
    <g>
      {/* Wick */}
      <line
        x1={x + width / 2}
        y1={y}
        x2={x + width / 2}
        y2={y + wickHeight}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body */}
      <rect
        x={x}
        y={bodyY}
        width={width}
        height={Math.max(1, bodyHeight)}
        fill={color}
      />
    </g>
  );
};

const TradingChart: React.FC<TradingChartProps> = ({ klineData, trades }) => {
  const indicator = new RsiTrendFilterIndicator();
  const results = indicator.calculate(klineData);

  const data = klineData.map((k, i) => ({
    time: new Date(k.closeTime).toLocaleTimeString(),
    open: parseFloat(k.open),
    high: parseFloat(k.high),
    low: parseFloat(k.low),
    close: parseFloat(k.close),
    rsiMa: results[i]?.rsiMa,
    upper: results[i]?.bands.upper,
    lower: results[i]?.bands.lower,
    level3Upper: results[i]?.bands.level3Upper,
    level3Lower: results[i]?.bands.level3Lower,
  }));

  // Calculate price domain for better visualization
  const prices = data.map(d => [d.high, d.low]).flat();
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <div className="h-[600px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="time"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            domain={[minPrice - padding, maxPrice + padding]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '0.375rem',
              color: '#F3F4F6'
            }}
            formatter={(value: any, name: string) => [
              parseFloat(value).toFixed(2),
              name.charAt(0).toUpperCase() + name.slice(1)
            ]}
          />

          {/* Candlesticks */}
          <Bar
            dataKey="high"
            fill="transparent"
            stroke="transparent"
            shape={<CustomCandlestick />}
          />

          {/* RSI MA Line - Pink */}
          <Line
            type="monotone"
            dataKey="rsiMa"
            stroke="#EC4899"
            dot={false}
            strokeWidth={2}
          />

          {/* Upper Band - Green */}
          <Line
            type="monotone"
            dataKey="upper"
            stroke="#10B981"
            dot={false}
            strokeWidth={1}
            strokeDasharray="3 3"
          />

          {/* Lower Band - Green */}
          <Line
            type="monotone"
            dataKey="lower"
            stroke="#10B981"
            dot={false}
            strokeWidth={1}
            strokeDasharray="3 3"
          />

          {/* Level 3 Bands - Light Purple */}
          <Line
            type="monotone"
            dataKey="level3Upper"
            stroke="#C084FC"
            dot={false}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <Line
            type="monotone"
            dataKey="level3Lower"
            stroke="#C084FC"
            dot={false}
            strokeWidth={1}
            strokeDasharray="3 3"
          />

          {/* Trade Markers */}
          {trades.map((trade, i) => (
            <ReferenceLine
              key={i}
              x={new Date(trade.timestamp).toLocaleTimeString()}
              stroke={trade.type === 'BUY' ? '#10B981' : '#EF4444'}
              strokeWidth={2}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TradingChart;