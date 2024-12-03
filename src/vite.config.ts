import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
      include: [
        '@tensorflow/tfjs',
        '@tanstack/react-query',
        'zustand',
        'recharts'
      ]
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            tensorflow: ['@tensorflow/tfjs'],
            vendor: ['react', 'react-dom', 'recharts'],
            query: ['@tanstack/react-query']
          }
        }
      }
    },
    define: {
      'process.env.VITE_MODE': JSON.stringify(env.VITE_MODE),
      'process.env.VITE_POPULATION_SIZE': env.VITE_MODE === 'prod' 
        ? env.VITE_PROD_POPULATION_SIZE 
        : env.VITE_DEV_POPULATION_SIZE,
      'process.env.VITE_GENERATIONS': env.VITE_MODE === 'prod'
        ? env.VITE_PROD_GENERATIONS
        : env.VITE_DEV_GENERATIONS,
      'process.env.VITE_MUTATION_RATE': env.VITE_MODE === 'prod'
        ? env.VITE_PROD_MUTATION_RATE
        : env.VITE_DEV_MUTATION_RATE,
      'process.env.VITE_ELITISM_COUNT': env.VITE_MODE === 'prod'
        ? env.VITE_PROD_ELITISM_COUNT
        : env.VITE_DEV_ELITISM_COUNT,
    }
  };
});