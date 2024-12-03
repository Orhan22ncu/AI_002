import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TrainingDashboard from './components/TrainingBot/TrainingDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
      staleTime: 30000,
    },
  },
});

function App() {
  const handleTrainingComplete = () => {
    console.log('Training completed');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-900">
        <TrainingDashboard onTrainingComplete={handleTrainingComplete} />
      </div>
    </QueryClientProvider>
  );
}

export default App;