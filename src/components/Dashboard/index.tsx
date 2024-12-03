import React, { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchKlines } from '../../services/binance';
import { RsiTrendFilterIndicator } from '../../indicators/RsiTrendFilter';
import { getNumericEnvVariable } from '../../utils/env';
import { GeneticAlgorithm } from '../../utils/geneticAlgorithm';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import PriceChart from './PriceChart';
import IndicatorChart from './IndicatorChart';
import TradeList from './TradeList';
import Stats from './Stats';
import TrainingStats from './TrainingStats';
import { backtest } from '../../utils/backtest';

const Dashboard: React.FC = () => {
  const [geneticAlgorithm, setGeneticAlgorithm] = useState<GeneticAlgorithm | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [lastEvaluationTime, setLastEvaluationTime] = useState(0);

  const initializeGeneticAlgorithm = useCallback(() => {
    if (!geneticAlgorithm) {
      const ga = new GeneticAlgorithm({
        populationSize: 50,      // Dev mode: küçük popülasyon
        generations: 10,         // Dev mode: az nesil
        mutationRate: 0.1,      // Dev mode: standart mutasyon
        elitismCount: 2,        // Dev mode: minimum elit
      });
      setGeneticAlgorithm(ga);
    }
  }, [geneticAlgorithm]);

  const { data: klineData, isLoading, error, refetch } = useQuery({
    queryKey: ['klines'],
    queryFn: () => fetchKlines(),
    refetchInterval: isTraining ? false : 30000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
  });

  useEffect(() => {
    if (klineData) {
      initializeGeneticAlgorithm();
    }
  }, [klineData, initializeGeneticAlgorithm]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (geneticAlgorithm && klineData && isTraining) {
      intervalId = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime - lastEvaluationTime < 1000) return;

        geneticAlgorithm.evaluatePopulation(klineData);
        geneticAlgorithm.evolve();
        
        const currentGeneration = geneticAlgorithm.getGeneration();
        setTrainingProgress((currentGeneration / 10) * 100);
        
        if (currentGeneration >= 10) {
          setIsTraining(false);
          setTrainingProgress(100);
        }
        
        setGeneticAlgorithm(new GeneticAlgorithm({
          ...geneticAlgorithm.config,
          population: geneticAlgorithm.getPopulation(),
          generation: currentGeneration,
          bestIndividual: geneticAlgorithm.getBestIndividual(),
        }));

        setLastEvaluationTime(currentTime);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [geneticAlgorithm, klineData, isTraining, lastEvaluationTime]);

  const handleTrainingToggle = () => {
    if (!isTraining) {
      initializeGeneticAlgorithm();
      refetch();
    }
    setIsTraining(!isTraining);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error as Error} />;
  if (!klineData || !geneticAlgorithm) return null;

  const bestIndividual = geneticAlgorithm.getBestIndividual();
  const indicator = new RsiTrendFilterIndicator(bestIndividual?.genes);
  const results = indicator.calculate(klineData);
  const backtestResults = backtest(klineData, indicator, {
    stopLoss: getNumericEnvVariable('STOP_LOSS', 0.5),
    takeProfit: getNumericEnvVariable('TAKE_PROFIT', 1.0),
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PriceChart klineData={klineData} results={results} />
          <IndicatorChart results={results} />
        </div>
        <div className="space-y-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <button
              onClick={handleTrainingToggle}
              className={`w-full p-3 rounded-lg font-bold ${
                isTraining
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isTraining ? 'Eğitimi Durdur' : 'Eğitimi Başlat'}
            </button>
            {isTraining && (
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${trainingProgress}%` }}
                  ></div>
                </div>
                <p className="text-center mt-2 text-sm text-gray-400">
                  {Math.round(trainingProgress)}% Tamamlandı
                </p>
              </div>
            )}
          </div>
          <TrainingStats
            generation={geneticAlgorithm.getGeneration()}
            bestIndividual={geneticAlgorithm.getBestIndividual()}
            population={geneticAlgorithm.getPopulation()}
          />
          <Stats results={backtestResults} />
          <TradeList signals={backtestResults.signals} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;