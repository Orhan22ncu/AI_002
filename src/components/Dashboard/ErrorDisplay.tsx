import React from 'react';

interface ErrorDisplayProps {
  error: Error;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-red-500">Error loading data: {error.message}</div>
    </div>
  );
};

export default ErrorDisplay;