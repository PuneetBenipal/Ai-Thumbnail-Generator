import React from 'react';
import type { PastGeneration } from '../types';

interface GenerationCardProps {
    generation: PastGeneration;
    onSelect: (generation: PastGeneration) => void;
    isSelected: boolean;
    style?: React.CSSProperties;
}

export const GenerationCard: React.FC<GenerationCardProps> = ({ generation, onSelect, isSelected, style }) => {
    const date = generation.createdAt?.toDate ? generation.createdAt.toDate().toLocaleDateString() : 'N/A';

    return (
        <div 
            className={`bg-white/5 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 animate-fade-in-up ${
                isSelected ? 'border-purple-500 bg-purple-900/20' : 'border-white/10 hover:border-white/30'
            }`}
            onClick={() => onSelect(generation)}
            style={style} // For animation delay
        >
            <div className="flex gap-4 items-center">
                {generation.thumbnails && generation.thumbnails.length > 0 && (
                     <img 
                        src={`data:image/png;base64,${generation.thumbnails[0]}`}
                        alt="Thumbnail preview"
                        className="w-28 h-auto aspect-video object-cover rounded-md flex-shrink-0"
                     />
                )}
                <div className="flex-1 overflow-hidden">
                     <p className="text-sm font-semibold text-white truncate" title={generation.prompt}>
                        {generation.prompt}
                     </p>
                     <p className="text-xs text-gray-400 mt-1">
                        Generated on {date}
                     </p>
                     {generation.titles && (
                        <p className="text-xs text-gray-500 mt-2 italic truncate">
                           Title: "{generation.titles[0]}"
                        </p>
                     )}
                </div>
            </div>
        </div>
    );
};
