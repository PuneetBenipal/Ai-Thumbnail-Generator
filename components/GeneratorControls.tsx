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
}

const styles: ThumbnailStyle[] = ['Cinematic', 'Minimalist', 'Cartoonish', 'Retro'];

export const GeneratorControls: React.FC<GeneratorControlsProps> = ({
  prompt,
  setPrompt,
  onGenerate,
  isLoading,
  mediaFile,
  thumbnailStyle,
  setThumbnailStyle
}) => {
  const canGenerate = !!mediaFile && !isLoading;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">2. Describe Your Video</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A tutorial on how to bake a chocolate cake, targeting beginners. Mention key steps like mixing ingredients and baking times."
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors h-24 resize-none"
          disabled={isLoading}
        />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-white mb-3">3. Select Thumbnail Style</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {styles.map(style => (
                <button
                    key={style}
                    onClick={() => setThumbnailStyle(style)}
                    disabled={isLoading}
                    className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 disabled:cursor-not-allowed ${
                        thumbnailStyle === style
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    {style}
                </button>
            ))}
        </div>
      </div>
      <button
        onClick={onGenerate}
        disabled={!canGenerate}
        className="mt-auto pt-4 w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-md hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-100 flex items-center justify-center"
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
    </div>
  );
};