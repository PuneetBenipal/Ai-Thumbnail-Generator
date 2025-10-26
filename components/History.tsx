import React, { useState, useEffect } from 'react';
import { getGenerations } from '../services/firestoreService';
import type { PastGeneration } from '../types';
import { GenerationCard } from './GenerationCard';
import { ResultsDisplay } from './ResultsDisplay';

export const History: React.FC = () => {
    const [generations, setGenerations] = useState<PastGeneration[]>([]);
    const [selectedGeneration, setSelectedGeneration] = useState<PastGeneration | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGenerations = async () => {
            try {
                const pastGenerations = await getGenerations();
                setGenerations(pastGenerations);
                if (pastGenerations.length > 0) {
                    setSelectedGeneration(pastGenerations[0]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch history.');
            } finally {
                setLoading(false);
            }
        };
        fetchGenerations();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="relative flex items-center justify-center h-12 w-12">
                  <div className="absolute h-full w-full rounded-full border-2 border-purple-500/50"></div>
                  <div className="absolute h-full w-full rounded-full border-t-2 border-purple-500 animate-spin"></div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return <div className="text-red-400 bg-red-900/50 p-4 rounded-lg m-8">{error}</div>
    }

    return (
        <main className="container mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <aside className="lg:col-span-1">
                    <h2 className="text-2xl font-bold text-white mb-4">Your History</h2>
                    {generations.length > 0 ? (
                        <div className="space-y-3 max-h-[calc(100vh-150px)] overflow-y-auto pr-2">
                           {generations.map((gen, index) => (
                               <GenerationCard 
                                 key={gen.id} 
                                 generation={gen} 
                                 isSelected={selectedGeneration?.id === gen.id}
                                 onSelect={setSelectedGeneration}
                                 style={{ animationDelay: `${index * 75}ms`}}
                               />
                           ))}
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-white/5 border border-dashed border-white/10 rounded-xl p-8 text-center">
                            <h3 className="text-xl font-semibold text-white">No history yet</h3>
                            <p className="mt-1 text-gray-400">Your generated content will appear here.</p>
                        </div>
                    )}
                </aside>
                <div className="lg:col-span-2">
                    {selectedGeneration ? (
                        <ResultsDisplay 
                            content={selectedGeneration}
                            // Editing is disabled in history view for simplicity
                            onEditThumbnail={() => {}}
                        />
                    ) : (
                         <div className="flex items-center justify-center h-full min-h-[500px] bg-white/5 border border-dashed border-white/10 rounded-xl p-8 text-center">
                            <p className="text-gray-400">Select an item from your history to view its details.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};
