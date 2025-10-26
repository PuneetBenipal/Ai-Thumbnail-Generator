
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
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Thumbnails */}
      <section className="bg-white/5 border border-white/10 rounded-xl shadow-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Generated Thumbnails</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {content.thumbnails.map((base64Image, index) => (
            <ThumbnailCard 
              key={index}
              base64Image={base64Image} 
              onEdit={() => onEditThumbnail(base64Image, index)}
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Titles & CTR */}
        <section className="bg-white/5 border border-white/10 rounded-xl shadow-2xl p-6">
          <h3 className="text-2xl font-bold text-white mb-4">Catchy Titles</h3>
          <div className="mb-6 p-4 bg-black/30 rounded-lg text-center">
            <p className="text-sm text-green-400 font-semibold">PREDICTED CTR</p>
            <p className="text-4xl font-bold text-white">{content.predictedCtr.split(' ')[0]}</p>
            <p className="text-xs text-gray-400">{content.predictedCtr.split(' ').slice(1).join(' ')}</p>
          </div>
          <ul className="space-y-2">
            {content.titles.map((title, index) => (
              <li key={index} className="flex items-center justify-between bg-black/30 p-3 rounded-md group">
                <span className="text-gray-300 text-sm">{title}</span>
                <button onClick={() => copyToClipboard(title)} className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all" title="Copy title">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Hashtags */}
        <section className="bg-white/5 border border-white/10 rounded-xl shadow-2xl p-6">
           <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">Hashtags</h3>
                <button onClick={() => copyToClipboard(content.hashtags.join(' '))} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/10 rounded-md hover:bg-white/20 transition-colors" title="Copy all hashtags">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Copy All
                </button>
            </div>
          <div className="flex flex-wrap gap-2">
            {content.hashtags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-full text-sm font-medium">{tag}</span>
            ))}
          </div>
        </section>
      </div>


      {/* Description */}
      <section className="bg-white/5 border border-white/10 rounded-xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-white">Video Description</h3>
            <button onClick={() => copyToClipboard(content.description)} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/10 rounded-md hover:bg-white/20 transition-colors" title="Copy description">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Copy
            </button>
        </div>
        <p className="text-gray-400 whitespace-pre-wrap text-sm leading-relaxed">{content.description}</p>
      </section>

    </div>
  );
};