import React, { useState } from 'react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onEdit: (prompt: string) => void;
  isEditing: boolean;
}

export const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, imageSrc, onEdit, isEditing }) => {
  const [prompt, setPrompt] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(prompt);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#110d18] border border-white/10 rounded-xl shadow-2xl w-full max-w-3xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Edit Thumbnail with AI</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img src={imageSrc} alt="Editing preview" className="rounded-lg w-full aspect-video object-contain bg-black" />
            <form onSubmit={handleSubmit} className="flex flex-col justify-center space-y-4">
              <div>
                <label htmlFor="edit-prompt" className="block text-sm font-medium text-gray-300 mb-2">
                  Describe your edit:
                </label>
                <input
                  id="edit-prompt"
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Add a retro filter'"
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  disabled={isEditing}
                />
              </div>
              <div className="flex gap-4 pt-2">
                 <button 
                  type="button" 
                  onClick={onClose}
                  disabled={isEditing}
                  className="w-full px-4 py-2 bg-white/10 text-white font-semibold rounded-md hover:bg-white/20 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!prompt || isEditing}
                  className="w-full px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-semibold rounded-md hover:from-fuchsia-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 transition-all"
                >
                  {isEditing ? 'Applying...' : 'Apply Edit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};