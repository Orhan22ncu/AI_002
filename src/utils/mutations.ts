export interface MutationRange {
  min: number;
  max: number;
  variance: number;
  adaptiveRate?: number;
}

export const mutationRanges: Record<string, MutationRange> = {
  rsiLength: { min: 5, max: 40, variance: 6, adaptiveRate: 0.40 },
  rsima: { min: 50, max: 250, variance: 40, adaptiveRate: 0.50 },
  emalen: { min: 8, max: 80, variance: 15, adaptiveRate: 0.40 },
  level2: { min: 5, max: 25, variance: 6, adaptiveRate: 0.35 },
  level3: { min: 20, max: 60, variance: 12, adaptiveRate: 0.45 },
  level5: { min: 35, max: 100, variance: 20, adaptiveRate: 0.50 }
};

export function adaptiveMutation(value: number, range: MutationRange, generation: number): number {
  // Dinamik adaptasyon faktörü - Daha yavaş azalan
  const adaptationFactor = Math.exp(-generation / 30) + 0.25;
  const baseVariance = range.variance * adaptationFactor;
  
  // Çoklu mutasyon stratejisi - Ayarlanmış olasılıklar
  const strategyChoice = Math.random();
  
  if (strategyChoice < 0.20) {
    // Quantum jump - Daha kontrollü büyük mutasyonlar
    return Math.min(range.max, Math.max(range.min, 
      value + (Math.random() - 0.5) * range.variance * 4
    ));
  } else if (strategyChoice < 0.45) {
    // Hassas ayar - Daha sık küçük mutasyonlar
    const microMutation = (Math.random() - 0.5) * baseVariance * 0.5;
    return Math.min(range.max, Math.max(range.min, 
      Math.round(value + microMutation)
    ));
  } else {
    // Standart adaptif mutasyon - İyileştirilmiş sınır kontrolü
    const mutation = (Math.random() - 0.5) * 2 * baseVariance;
    const mutatedValue = value + mutation;
    
    // Boundary handling with smoother reflection
    let finalValue = Math.round(mutatedValue);
    if (finalValue < range.min) {
      const overflow = range.min - finalValue;
      finalValue = range.min + Math.min(overflow, range.max - range.min);
    } else if (finalValue > range.max) {
      const overflow = finalValue - range.max;
      finalValue = range.max - Math.min(overflow, range.max - range.min);
    }
    
    return finalValue;
  }
}

export function hybridCrossover(parent1: number, parent2: number, range: MutationRange): number {
  const strategyChoice = Math.random();
  
  if (strategyChoice < 0.45) {
    // Enhanced Blend Crossover (BLX-alpha)
    const alpha = 0.4;
    const min = Math.min(parent1, parent2);
    const max = Math.max(parent1, parent2);
    const diff = max - min;
    
    const extendedMin = Math.max(range.min, min - alpha * diff);
    const extendedMax = Math.min(range.max, max + alpha * diff);
    
    return Math.round(extendedMin + Math.random() * (extendedMax - extendedMin));
  } else if (strategyChoice < 0.75) {
    // Weighted Arithmetic Recombination
    const weight = Math.random() * 0.8 + 0.1; // 0.1 to 0.9
    return Math.round(parent1 * weight + parent2 * (1 - weight));
  } else {
    // Enhanced Geometric Recombination
    const logP1 = Math.log(Math.max(1, parent1));
    const logP2 = Math.log(Math.max(1, parent2));
    const weight = Math.random() * 0.8 + 0.1; // 0.1 to 0.9
    const geometricMean = Math.exp(logP1 * weight + logP2 * (1 - weight));
    
    return Math.min(range.max, Math.max(range.min, Math.round(geometricMean)));
  }
}