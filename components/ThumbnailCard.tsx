import React from 'react';

interface ThumbnailCardProps {
  base64Image: string;
  onEdit: () => void;
}

export const ThumbnailCard: React.FC<ThumbnailCardProps> = ({ base64Image, onEdit }) => {
  const imageUrl = `data:image/png;base64,${base64Image}`;

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `thumbgenius-thumbnail-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <img src={imageUrl} alt="Generated Thumbnail" className="w-full h-auto aspect-video object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
        <button 
          onClick={downloadImage}
          className="p-3 bg-green-600 rounded-full text-white hover:bg-green-700 transition-all duration-200 transform hover:scale-110"
          title="Download"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        </button>
        <button 
          onClick={onEdit}
          className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-all duration-200 transform hover:scale-110"
          title="Edit with AI"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
        </button>
      </div>
    </div>
  );
};