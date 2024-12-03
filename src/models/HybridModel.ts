import * as tf from '@tensorflow/tfjs';
import { KlineData, TrainingOptions } from '../types';
import { prepareTrainingData, preparePredictionData } from '../utils/tensorUtils';

export class HybridModel {
  private model: tf.LayersModel | null = null;
  private windowSize: number = 60;
  private features: number = 5;
  
  constructor() {
    this.buildModel();
  }

  private buildModel(): void {
    const input = tf.input({shape: [this.windowSize, this.features]});
    
    // CNN Layer
    const conv = tf.layers.conv1d({
      filters: 64,
      kernelSize: 3,
      padding: 'same',
      activation: 'relu'
    }).apply(input);
    
    const maxPool = tf.layers.maxPooling1d({
      poolSize: 2,
      strides: 2
    }).apply(conv);
    
    // LSTM Layers
    const lstm1 = tf.layers.lstm({
      units: 100,
      returnSequences: true
    }).apply(maxPool);
    
    const lstm2 = tf.layers.lstm({
      units: 50,
      returnSequences: false
    }).apply(lstm1);
    
    // Dense Layers
    const dense1 = tf.layers.dense({
      units: 32,
      activation: 'relu'
    }).apply(lstm2);
    
    const dropout = tf.layers.dropout({
      rate: 0.2
    }).apply(dense1);
    
    const output = tf.layers.dense({
      units: 3,
      activation: 'softmax'
    }).apply(dropout);
    
    this.model = tf.model({inputs: input, outputs: output as tf.SymbolicTensor});
    
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  async train(data: KlineData[], options: TrainingOptions = {}): Promise<void> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const { features, labels } = prepareTrainingData(data, this.windowSize);
    
    try {
      await this.model.fit(features, labels, {
        epochs: 50,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (options.onProgress && logs) {
              options.onProgress({
                epoch: epoch + 1,
                loss: logs.loss,
                accuracy: logs.acc,
                validationLoss: logs.val_loss || 0,
                validationAccuracy: logs.val_acc || 0
              });
            }
          }
        }
      });
    } finally {
      features.dispose();
      labels.dispose();
    }
  }

  async predict(data: KlineData[]): Promise<{
    action: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
  }> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    if (data.length < this.windowSize) {
      throw new Error('Insufficient data for prediction');
    }
    
    const tensor = preparePredictionData(data, this.windowSize);
    
    try {
      const prediction = this.model.predict(tensor) as tf.Tensor;
      const probabilities = await prediction.data();
      
      const maxProbIndex = probabilities.indexOf(Math.max(...probabilities));
      const actions: Array<'HOLD' | 'BUY' | 'SELL'> = ['HOLD', 'BUY', 'SELL'];
      
      return {
        action: actions[maxProbIndex],
        confidence: probabilities[maxProbIndex] * 100
      };
    } finally {
      tensor.dispose();
    }
  }

  async save(path: string): Promise<void> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }
    await this.model.save(`file://${path}`);
  }

  async load(path: string): Promise<void> {
    this.model = await tf.loadLayersModel(`file://${path}`);
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }
}