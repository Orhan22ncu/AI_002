export interface Individual {
  genes: {
    rsiLength: number;
    rsima: number;
    emalen: number;
    level2: number;
    level3: number;
    level5: number;
  };
  fitness: number;
  stats?: {
    winRate: number;
    totalProfit: number;
    profitFactor: number;
    maxDrawdown: number;
    totalTrades: number;
  };
}

export interface GeneticAlgorithmConfig {
  populationSize: number;
  generations: number;
  mutationRate: number;
  elitismCount: number;
  population?: Individual[];
  generation?: number;
  bestIndividual?: Individual | null;
}