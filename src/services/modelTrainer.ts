import { HybridModel } from '../models/HybridModel';
import { KlineData } from '../types';
import * as tf from '@tensorflow/tfjs';

export class ModelTrainer {
  private model: HybridModel;
  private trainingProgress: number = 0;
  private isInitialized: boolean = false;
  
  constructor() {
    // Lazy initialization
    this.model = new HybridModel();
  }

  private async initialize() {
    if (!this.isInitialized) {
      // Enable WebGL backend for better performance
      await tf.setBackend('webgl');
      // Memory management optimizations
      tf.engine().startScope();
      this.isInitialized = true;
    }
  }
  
  async train(
    data: KlineData[],
    onProgress?: (metric: TrainingMetric) => void
  ): Promise<void> {
    await this.initialize();
    
    const isProd = process.env.VITE_MODE === 'prod';
    const epochs = isProd ? 100 : 10;
    
    try {
      await this.model.train(data, {
        epochs,
        onEpochEnd: (epoch, logs) => {
          this.trainingProgress = ((epoch + 1) / epochs) * 100;
          
          if (onProgress && logs) {
            onProgress({
              epoch: epoch + 1,
              loss: logs.loss,
              accuracy: logs.acc,
              validationLoss: logs.val_loss,
              validationAccuracy: logs.val_acc
            });
          }
        }
      });
      
      this.trainingProgress = 100;
    } catch (error) {
      console.error('Eğitim hatası:', error);
      throw error;
    } finally {
      // Clean up memory
      tf.engine().endScope();
    }
  }
  
  async predict(data: KlineData[]): Promise<{
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
  }> {
    await this.initialize();
    return await this.model.predict(data);
  }
  
  getProgress(): number {
    return this.trainingProgress;
  }
}