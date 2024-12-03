import React from 'react';
import { Layers, Cpu, Network } from 'lucide-react';

const ModelSummary: React.FC = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Model Mimarisi</h2>
        <Layers className="text-blue-400" size={24} />
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={16} className="text-green-400" />
            <h3 className="font-semibold">CNN Katmanı</h3>
          </div>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• 64 filtre, 3x1 kernel boyutu</li>
            <li>• ReLU aktivasyon</li>
            <li>• Max pooling (2x1)</li>
          </ul>
        </div>

        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Network size={16} className="text-purple-400" />
            <h3 className="font-semibold">LSTM Katmanları</h3>
          </div>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• LSTM 1: 100 birim</li>
            <li>• LSTM 2: 50 birim</li>
            <li>• Sequence-to-vector dönüşümü</li>
          </ul>
        </div>

        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={16} className="text-yellow-400" />
            <h3 className="font-semibold">Çıkış Katmanları</h3>
          </div>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Dense 1: 32 birim, ReLU</li>
            <li>• Dropout: 0.2</li>
            <li>• Çıkış: 3 birim (HOLD, BUY, SELL)</li>
            <li>• Softmax aktivasyon</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModelSummary;