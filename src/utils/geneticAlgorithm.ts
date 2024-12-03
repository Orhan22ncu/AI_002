import { Individual, GeneticAlgorithmConfig } from './types';
import { KlineData } from '../types';
import { RsiTrendFilterIndicator } from '../indicators/RsiTrendFilter';
import { backtest } from './backtest';
import { getNumericEnvVariable } from './env';
import { mutationRanges, adaptiveMutation, hybridCrossover } from './mutations';
import { calculateFitness } from './fitness';

export class GeneticAlgorithm {
  private population: Individual[];
  private generation: number;
  private bestIndividual: Individual | null;
  private lastImprovement: number;
  private stagnationCount: number;
  public config: GeneticAlgorithmConfig;

  constructor(config: GeneticAlgorithmConfig) {
    this.config = {
      populationSize: getNumericEnvVariable('POPULATION_SIZE', 500),
      generations: getNumericEnvVariable('GENERATIONS', 150),
      mutationRate: getNumericEnvVariable('MUTATION_RATE', 0.15),
      elitismCount: getNumericEnvVariable('ELITISM_COUNT', 15),
      ...config
    };
    this.population = config.population || this.initializePopulation();
    this.generation = config.generation || 0;
    this.bestIndividual = config.bestIndividual || null;
    this.lastImprovement = 0;
    this.stagnationCount = 0;
  }

  private initializePopulation(): Individual[] {
    const baseIndividuals: Individual[] = [
      {
        genes: { rsiLength: 14, rsima: 100, emalen: 20, level2: 10, level3: 40, level5: 50 },
        fitness: 0
      },
      {
        genes: { rsiLength: 11, rsima: 159, emalen: 44, level2: 9, level3: 17, level5: 62 },
        fitness: 0
      },
      {
        genes: { rsiLength: 7, rsima: 75, emalen: 15, level2: 8, level3: 35, level5: 45 },
        fitness: 0
      }
    ];

    const population = [...baseIndividuals];

    while (population.length < this.config.populationSize) {
      const parent = baseIndividuals[Math.floor(Math.random() * baseIndividuals.length)];
      population.push(this.createMutatedIndividual(parent));
    }

    return population;
  }

  // Rest of the class implementation remains the same...
  // Including all other methods: createMutatedIndividual, evaluatePopulation, etc.
  
  private createMutatedIndividual(base: Individual): Individual {
    const genes = { ...base.genes };
    Object.keys(genes).forEach(key => {
      const geneKey = key as keyof typeof genes;
      const range = mutationRanges[geneKey];
      genes[geneKey] = adaptiveMutation(genes[geneKey], range, this.generation);
    });
    
    return { genes, fitness: 0 };
  }

  public evaluatePopulation(data: KlineData[]): void {
    const stopLoss = getNumericEnvVariable('STOP_LOSS', 0.5);
    const takeProfit = getNumericEnvVariable('TAKE_PROFIT', 1.0);

    this.population.forEach(individual => {
      const indicator = new RsiTrendFilterIndicator(individual.genes);
      const results = backtest(data, indicator, { stopLoss, takeProfit });

      individual.stats = {
        winRate: results.winRate,
        totalProfit: results.totalProfit,
        profitFactor: results.profitFactor,
        maxDrawdown: results.maxDrawdown,
        totalTrades: results.totalTrades
      };

      individual.fitness = calculateFitness(individual.stats);
    });

    this.updateBestIndividual();
  }

  private updateBestIndividual(): void {
    const currentBest = this.population.reduce((best, current) => 
      current.fitness > best.fitness ? current : best
    , this.population[0]);

    if (!this.bestIndividual || currentBest.fitness > this.bestIndividual.fitness) {
      this.bestIndividual = { ...currentBest };
      this.lastImprovement = this.generation;
      this.stagnationCount = 0;
    } else {
      this.stagnationCount++;
    }
  }

  public evolve(): void {
    if (this.stagnationCount > 5) {
      this.increaseDiversity();
      this.stagnationCount = 0;
    }

    const newPopulation: Individual[] = [];
    const sorted = [...this.population].sort((a, b) => b.fitness - a.fitness);
    
    // Elitism with increased count
    for (let i = 0; i < this.config.elitismCount; i++) {
      newPopulation.push({ ...sorted[i] });
    }

    // Enhanced crossover and mutation
    while (newPopulation.length < this.config.populationSize) {
      if (Math.random() < 0.85) {
        const parent1 = this.selectParent();
        const parent2 = this.selectParent();
        const child = this.advancedCrossover(parent1, parent2);
        this.advancedMutate(child);
        newPopulation.push(child);
      } else {
        // New blood injection
        newPopulation.push(this.createMutatedIndividual(sorted[0]));
      }
    }

    this.population = newPopulation;
    this.generation++;
  }

  private increaseDiversity(): void {
    const elites = this.population
      .sort((a, b) => b.fitness - a.fitness)
      .slice(0, Math.floor(this.config.populationSize * 0.2));

    this.population = [...elites];

    while (this.population.length < this.config.populationSize) {
      const base = elites[Math.floor(Math.random() * elites.length)];
      const mutated = this.createMutatedIndividual(base);
      if (Math.random() < 0.3) {
        this.advancedMutate(mutated);
      }
      this.population.push(mutated);
    }
  }

  private selectParent(): Individual {
    const tournamentSize = 4;
    let best: Individual | null = null;
    
    for (let i = 0; i < tournamentSize; i++) {
      const candidate = this.population[Math.floor(Math.random() * this.population.length)];
      if (!best || candidate.fitness > best.fitness) {
        best = candidate;
      }
    }
    
    return best!;
  }

  private advancedCrossover(parent1: Individual, parent2: Individual): Individual {
    const child: Individual = {
      genes: {} as typeof parent1.genes,
      fitness: 0
    };

    Object.keys(parent1.genes).forEach(key => {
      const geneKey = key as keyof typeof parent1.genes;
      const range = mutationRanges[geneKey];
      child.genes[geneKey] = hybridCrossover(
        parent1.genes[geneKey],
        parent2.genes[geneKey],
        range
      );
    });

    return child;
  }

  private advancedMutate(individual: Individual): void {
    Object.keys(individual.genes).forEach(key => {
      const geneKey = key as keyof typeof individual.genes;
      const range = mutationRanges[geneKey];
      
      const baseMutationRate = this.config.mutationRate;
      const adaptiveRate = range.adaptiveRate || 0.3;
      const effectiveRate = baseMutationRate * (1 + adaptiveRate * (this.stagnationCount / 5));
      
      if (Math.random() < effectiveRate) {
        individual.genes[geneKey] = adaptiveMutation(
          individual.genes[geneKey],
          range,
          this.generation
        );
      }
    });
  }

  public getBestIndividual(): Individual | null {
    return this.bestIndividual;
  }

  public getGeneration(): number {
    return this.generation;
  }

  public getPopulation(): Individual[] {
    return this.population;
  }
}