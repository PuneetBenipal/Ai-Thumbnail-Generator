
import React from 'react';
import { ThumbnailCard } from './ThumbnailCard';
import type { GeneratedContent } from '../types';

interface ResultsDisplayProps {
  content: GeneratedContent;
  onEditThumbnail: (image: string, index: number) => void;
}

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ content, onEditThumbnail }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg animate-fade-in-up">
      <h2 className="text-3xl font-bold text-white mb-6">Your Generated Content</h2>
      
      {/* Thumbnails */}
      <section>
        <h3 className="text-2xl font-semibold text-purple-400 mb-4">Thumbnails</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {content.thumbnails.map((base64Image, index) => (
            <ThumbnailCard 
              key={index}
              base64Image={base64Image} 
              onEdit={() => onEditThumbnail(base64Image, index)}
            />
          ))}
        </div>
      </section>

      {/* Titles & CTR */}
      <section className="mt-8">
        <h3 className="text-2xl font-semibold text-purple-400 mb-4">Titles</h3>
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <div className="mb-4">
            <p className="text-lg font-semibold text-green-400">Predicted CTR: {content.predictedCtr}</p>
          </div>
          <ul className="space-y-3">
            {content.titles.map((title, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-md">
                <span className="text-gray-300">{title}</span>
                <button onClick={() => copyToClipboard(title)} className="p-1.5 rounded-md hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Description */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-purple-400">Description</h3>
            <button onClick={() => copyToClipboard(content.description)} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Copy
            </button>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <p className="text-gray-300 whitespace-pre-wrap">{content.description}</p>
        </div>
      </section>

      {/* Hashtags */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-purple-400">Hashtags</h3>
            <button onClick={() => copyToClipboard(content.hashtags.join(' '))} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2_0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Copy All
            </button>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {content.hashtags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">{tag}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};