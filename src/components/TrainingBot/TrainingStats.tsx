import React from 'react';
import { TrendingUp, BarChart2 } from 'lucide-react';
import { GeneticAlgorithm } from '../../utils/geneticAlgorithm';

interface TrainingStatsProps {
  geneticAlgorithm: GeneticAlgorithm | null;
  isTraining: boolean;
}

const TrainingStats: React.FC<TrainingStatsProps> = ({ geneticAlgorithm, isTraining }) => {
  const bestIndividual = geneticAlgorithm?.getBestIndividual();
  const population = geneticAlgorithm?.getPopulation() || [];
  const averageFitness = population.length > 0
    ? population.reduce((sum, ind) => sum + (ind.fitness || 0), 0) / population.length
    : 0;

  const formatNumber = (value: number | undefined): string => {
    if (value === undefined || Number.isNaN(value)) return '0';
    return value.toFixed(2);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Training Stats</h2>
        <TrendingUp className="text-green-400" size={20} />
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Generation</span>
              <BarChart2 size={16} className="text-blue-400" />
            </div>
            <p className="text-2xl font-bold">
              {geneticAlgorithm?.getGeneration() || 0}
            </p>
          </div>
          
          <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Avg Fitness</span>
              <TrendingUp size={16} className="text-green-400" />
            </div>
            <p className="text-2xl font-bold">
              {formatNumber(averageFitness)}
            </p>
          </div>
        </div>

        {bestIndividual && (
          <div className="p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Best Parameters</h3>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div>
                <p className="text-gray-400">RSI Length</p>
                <p className="font-bold">{bestIndividual.genes.rsiLength || 0}</p>
              </div>
              <div>
                <p className="text-gray-400">RSI MA</p>
                <p className="font-bold">{bestIndividual.genes.rsima || 0}</p>
              </div>
              <div>
                <p className="text-gray-400">EMA Length</p>
                <p className="font-bold">{bestIndividual.genes.emalen || 0}</p>
              </div>
              <div>
                <p className="text-gray-400">Level 2</p>
                <p className="font-bold">{formatNumber(bestIndividual.genes.level2)}</p>
              </div>
              <div>
                <p className="text-gray-400">Level 3</p>
                <p className="font-bold">{bestIndividual.genes.level3 || 0}</p>
              </div>
              <div>
                <p className="text-gray-400">Level 5</p>
                <p className="font-bold">{bestIndividual.genes.level5 || 0}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-600">
              <p className="text-gray-400">Fitness Score</p>
              <p className="text-2xl font-bold text-green-400">
                {formatNumber(bestIndividual.fitness)}%
              </p>
            </div>
          </div>
        )}

        {bestIndividual?.stats && (
          <div className="p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div>
                <p className="text-gray-400">Win Rate</p>
                <p className="font-bold">{formatNumber(bestIndividual.stats.winRate)}%</p>
              </div>
              <div>
                <p className="text-gray-400">Total Profit</p>
                <p className={`font-bold ${bestIndividual.stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatNumber(bestIndividual.stats.totalProfit)}%
                </p>
              </div>
              <div>
                <p className="text-gray-400">Profit Factor</p>
                <p className="font-bold">{formatNumber(bestIndividual.stats.profitFactor)}</p>
              </div>
              <div>
                <p className="text-gray-400">Max Drawdown</p>
                <p className="font-bold text-red-400">{formatNumber(bestIndividual.stats.maxDrawdown)}%</p>
              </div>
              <div>
                <p className="text-gray-400">Total Trades</p>
                <p className="font-bold">{bestIndividual.stats.totalTrades || 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingStats;