import React, { Suspense, lazy } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Brain } from 'lucide-react';
import { fetchKlines } from '../../services/binance';
import { ModelTrainer } from '../../services/modelTrainer';
import { useTrainingStore } from '../../store/trainingStore';
import LoadingSpinner from '../Dashboard/LoadingSpinner';
import ErrorDisplay from '../Dashboard/ErrorDisplay';

// Lazy load heavy components
const TrainingMetrics = lazy(() => import('./TrainingMetrics'));
const TrainingControls = lazy(() => import('./TrainingControls'));

const modelTrainer = new ModelTrainer();

const TrainingDashboard: React.FC<{ onTrainingComplete: () => void }> = ({ 
  onTrainingComplete 
}) => {
  const { 
    isTraining, 
    progress,
    error,
    setTraining,
    addMetric,
    setProgress,
    setError,
    reset
  } = useTrainingStore();

  const { data: klineData, isLoading, error: fetchError } = useQuery({
    queryKey: ['klines'],
    queryFn: fetchKlines,
    refetchInterval: isTraining ? 30000 : false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
    staleTime: 60000, // Cache data for 1 minute
  });

  React.useEffect(() => {
    if (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Veri yüklenirken hata oluştu');
    }
  }, [fetchError, setError]);

  const handleStartTraining = React.useCallback(() => {
    if (!klineData) return;
    
    reset();
    setTraining(true);
    
    const trainModel = async () => {
      try {
        await modelTrainer.train(klineData, {
          onProgress: (metric) => {
            addMetric(metric);
            setProgress(modelTrainer.getProgress());
          }
        });
        setTraining(false);
        onTrainingComplete();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Eğitim sırasında hata oluştu');
        setTraining(false);
      }
    };

    trainModel();
  }, [klineData, addMetric, setProgress, setTraining, setError, reset, onTrainingComplete]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={new Error(error)} />;
  if (!klineData) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Model Eğitimi</h1>
            <Brain className="text-blue-400" size={24} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Durum</span>
                <div className={`w-3 h-3 rounded-full ${isTraining ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              </div>
              <p className="text-xl font-semibold">
                {isTraining ? "Eğitim Devam Ediyor..." : "Hazır"}
              </p>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">İlerleme</span>
                <span className="text-blue-400">{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <Suspense fallback={<LoadingSpinner />}>
            <TrainingControls
              isTraining={isTraining}
              onStartTraining={handleStartTraining}
            />
          </Suspense>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <TrainingMetrics />
        </Suspense>
      </div>
    </div>
  );
};

export default TrainingDashboard;