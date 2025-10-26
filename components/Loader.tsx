
import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-lg p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      <p className="mt-4 text-lg text-gray-300 font-semibold">{message}</p>
    </div>
  );
};
