import { KlineData } from '../types';
import { getEnvVariable, getNumericEnvVariable } from '../utils/env';

const API_URL = 'https://api.binance.com/api/v3';

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Failed to fetch after retries');
}

export async function fetchKlines(): Promise<KlineData[]> {
  try {
    const symbol = getEnvVariable('SYMBOL', 'BCHUSDT');
    const interval = getEnvVariable('INTERVAL', '1m');
    const trainingDays = getNumericEnvVariable(
      process.env.VITE_MODE === 'prod' ? 'PROD_TRAINING_DAYS' : 'DEV_TRAINING_DAYS',
      1
    );
    
    const endTime = Date.now();
    const startTime = endTime - (trainingDays * 24 * 60 * 60 * 1000);

    const url = `${API_URL}/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}&limit=1000`;
    console.log('Fetching data from:', url);

    const response = await fetchWithRetry(url);
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format from Binance API');
    }

    return data.map((k: any[]) => ({
      openTime: k[0],
      open: k[1],
      high: k[2],
      low: k[3],
      close: k[4],
      volume: k[5],
      closeTime: k[6],
    }));
  } catch (error) {
    console.error('Error fetching klines:', error);
    throw error;
  }
}