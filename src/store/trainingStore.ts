import { create } from 'zustand';
import { TrainingMetric } from '../types';

interface TrainingState {
  isTraining: boolean;
  metrics: TrainingMetric[];
  progress: number;
  error: string | null;
  setTraining: (isTraining: boolean) => void;
  addMetric: (metric: TrainingMetric) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useTrainingStore = create<TrainingState>((set) => ({
  isTraining: false,
  metrics: [],
  progress: 0,
  error: null,
  setTraining: (isTraining) => set({ isTraining }),
  addMetric: (metric) => set((state) => ({ metrics: [...state.metrics, metric] })),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error }),
  reset: () => set({ isTraining: false, metrics: [], progress: 0, error: null }),
}));