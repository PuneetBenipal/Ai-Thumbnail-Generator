
import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] bg-white/5 border border-dashed border-white/10 rounded-xl p-8 animate-fade-in">
      <div className="relative flex items-center justify-center h-20 w-20">
        <div className="absolute h-full w-full rounded-full border-2 border-purple-500/50"></div>
        <div className="absolute h-full w-full rounded-full border-t-2 border-purple-500 animate-spin"></div>
      </div>
      <p className="mt-4 text-lg text-gray-300 font-semibold tracking-wide">{message}</p>
    </div>
  );
};