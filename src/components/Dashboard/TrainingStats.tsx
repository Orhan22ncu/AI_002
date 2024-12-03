import React from 'react';
import { Individual } from '../../utils/geneticAlgorithm';

interface TrainingStatsProps {
  generation: number;
  bestIndividual: Individual | null;
  population: Individual[];
}

const TrainingStats: React.FC<TrainingStatsProps> = ({
  generation,
  bestIndividual,
  population,
}) => {
  const averageFitness = population.reduce((sum, ind) => sum + ind.fitness, 0) / population.length;

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Eğitim İstatistikleri</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-700 rounded">
            <p className="text-gray-400 text-sm">Nesil</p>
            <p className="text-2xl font-bold">{generation}</p>
          </div>
          <div className="p-3 bg-gray-700 rounded">
            <p className="text-gray-400 text-sm">Ortalama Fitness</p>
            <p className="text-2xl font-bold">{averageFitness.toFixed(2)}</p>
          </div>
        </div>

        {bestIndividual && (
          <div className="p-4 bg-gray-700 rounded">
            <h3 className="text-lg font-semibold mb-2">En İyi Parametreler</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-400">RSI Uzunluk:</p>
                <p className="font-bold">{bestIndividual.genes.rsiLength}</p>
              </div>
              <div>
                <p className="text-gray-400">RSI MA:</p>
                <p className="font-bold">{bestIndividual.genes.rsima}</p>
              </div>
              <div>
                <p className="text-gray-400">EMA Uzunluk:</p>
                <p className="font-bold">{bestIndividual.genes.emalen}</p>
              </div>
              <div>
                <p className="text-gray-400">Level 2:</p>
                <p className="font-bold">{bestIndividual.genes.level2}</p>
              </div>
              <div>
                <p className="text-gray-400">Level 3:</p>
                <p className="font-bold">{bestIndividual.genes.level3}</p>
              </div>
              <div>
                <p className="text-gray-400">Level 5:</p>
                <p className="font-bold">{bestIndividual.genes.level5}</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-gray-400">Fitness Değeri:</p>
              <p className="text-2xl font-bold text-green-400">
                {bestIndividual.fitness.toFixed(2)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingStats;