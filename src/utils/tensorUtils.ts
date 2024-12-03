import { KlineData } from '../types';
import * as tf from '@tensorflow/tfjs';

export function normalizeWindow(window: number[][]): number[][] {
  const transposed = window[0].map((_, colIndex) => window.map(row => row[colIndex]));
  
  return transposed.map(column => {
    const min = Math.min(...column);
    const max = Math.max(...column);
    const range = max - min;
    return column.map(value => range !== 0 ? (value - min) / range : 0);
  });
}

export function prepareTrainingData(data: KlineData[], windowSize: number): {
  features: tf.Tensor3D;
  labels: tf.Tensor2D;
} {
  const windows: number[][][] = [];
  const labels: number[][] = [];
  
  for (let i = windowSize; i < data.length; i++) {
    const windowData = data.slice(i - windowSize, i).map(candle => [
      parseFloat(candle.open),
      parseFloat(candle.high),
      parseFloat(candle.low),
      parseFloat(candle.close),
      parseFloat(candle.volume)
    ]);
    
    const normalized = normalizeWindow(windowData);
    windows.push(normalized);
    
    const nextCandle = data[i];
    const currentClose = parseFloat(data[i-1].close);
    const nextClose = parseFloat(nextCandle.close);
    const priceChange = ((nextClose - currentClose) / currentClose) * 100;
    
    if (priceChange > 1) {
      labels.push([0, 1, 0]); // BUY
    } else if (priceChange < -1) {
      labels.push([0, 0, 1]); // SELL
    } else {
      labels.push([1, 0, 0]); // HOLD
    }
  }
  
  return {
    features: tf.tensor3d(windows),
    labels: tf.tensor2d(labels)
  };
}

export function preparePredictionData(data: KlineData[], windowSize: number): tf.Tensor3D {
  const window = data.slice(-windowSize).map(candle => [
    parseFloat(candle.open),
    parseFloat(candle.high),
    parseFloat(candle.low),
    parseFloat(candle.close),
    parseFloat(candle.volume)
  ]);
  
  const normalized = normalizeWindow(window);
  return tf.tensor3d([normalized]);
}