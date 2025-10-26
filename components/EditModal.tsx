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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Edit Thumbnail with AI</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img src={imageSrc} alt="Editing preview" className="rounded-md w-full aspect-video object-contain bg-gray-900" />
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
                  placeholder="e.g., 'Add a retro filter' or 'Make the text neon green'"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  disabled={isEditing}
                />
              </div>
              <div className="flex gap-4">
                 <button 
                  type="button" 
                  onClick={onClose}
                  disabled={isEditing}
                  className="w-full px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!prompt || isEditing}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-md hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 transition-all duration-300 transform hover:scale-105 active:scale-100"
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