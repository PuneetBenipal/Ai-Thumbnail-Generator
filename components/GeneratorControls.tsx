import React from 'react';
import type { MediaFile, ThumbnailStyle } from '../types';

interface GeneratorControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  mediaFile: MediaFile | null;
  thumbnailStyle: ThumbnailStyle;
  setThumbnailStyle: (style: ThumbnailStyle) => void;
  credits: number;
}

const styles: ThumbnailStyle[] = ['Cinematic', 'Minimalist', 'Cartoonish', 'Retro'];

export const GeneratorControls: React.FC<GeneratorControlsProps> = ({
  prompt,
  setPrompt,
  onGenerate,
  isLoading,
  mediaFile,
  thumbnailStyle,
  setThumbnailStyle,
  credits
}) => {
  const hasNoCredits = credits <= 0;
  const canGenerate = !!mediaFile && !isLoading && !!prompt && !hasNoCredits;

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 bg-purple-600 rounded-full text-sm font-bold">2</span>
            Describe Your Video
        </h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A tutorial on how to bake a chocolate cake, targeting beginners."
          className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors h-28 resize-none text-gray-300"
          disabled={isLoading}
        />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 bg-purple-600 rounded-full text-sm font-bold">3</span>
            Select Style
        </h3>
        <div className="grid grid-cols-2 gap-2">
            {styles.map(style => (
                <button
                    key={style}
                    onClick={() => setThumbnailStyle(style)}
                    disabled={isLoading}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 disabled:cursor-not-allowed border-2 ${
                        thumbnailStyle === style
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-white/5 border-transparent text-gray-300 hover:border-white/50'
                    }`}
                >
                    {style}
                </button>
            ))}
        </div>
      </div>
      {hasNoCredits && (
        <div className="text-center p-3 bg-yellow-900/50 text-yellow-300 border border-yellow-700/50 rounded-md text-sm">
            You're out of credits! Please purchase more to continue.
        </div>
      )}
      <button
        onClick={onGenerate}
        disabled={!canGenerate}
        className="w-full px-4 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold rounded-lg hover:from-fuchsia-700 hover:to-purple-700 disabled:bg-gradient-to-r disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-100 flex items-center justify-center shadow-lg hover:shadow-purple-500/50"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          '✨ Generate Content'
        )}
      </button>
    </>
  );
};