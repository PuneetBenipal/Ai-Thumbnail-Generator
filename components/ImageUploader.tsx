import React, { useCallback } from 'react';
import type { MediaFile } from '../types';

interface ImageUploaderProps {
  onMediaUpload: (file: MediaFile | null) => void;
  mediaFile: MediaFile | null;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // remove data:mime/type;base64,
    };
    reader.onerror = (error) => reject(error);
  });

const processFile = async (file: File): Promise<MediaFile | null> => {
    if (file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        return { file, base64 };
    } else if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        return { file, url };
    }
    return null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onMediaUpload, mediaFile }) => {
  
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const media = await processFile(file);
      onMediaUpload(media);
    } else {
      onMediaUpload(null);
    }
  }, [onMediaUpload]);

  const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const media = await processFile(file);
      onMediaUpload(media);
    }
  }, [onMediaUpload]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const handleRemoveMedia = () => {
      onMediaUpload(null);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
        <span className="flex items-center justify-center w-7 h-7 bg-purple-600 rounded-full text-sm font-bold">1</span>
        Upload Media
      </h2>
      <div 
        className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !mediaFile && document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {!mediaFile && (
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <p className="mt-2 text-gray-400 text-sm">
              <span className="font-semibold text-purple-400">Click to upload</span> or drag & drop
            </p>
            <p className="text-xs text-gray-500">Image or Video</p>
          </div>
        )}
        
        {mediaFile && (
           <div className="relative group">
             {'base64' in mediaFile && (
                 <img 
                   src={`data:${mediaFile.file.type};base64,${mediaFile.base64}`} 
                   alt="Preview" 
                   className="mx-auto max-h-40 rounded-md"
                 />
             )}
             {'url' in mediaFile && (
                <video src={mediaFile.url} controls className="w-full rounded-md max-h-40" />
             )}
             <div className="absolute inset-0 bg-black/70 rounded-md flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm text-white mb-2 truncate max-w-[90%]">{mediaFile.file.name}</p>
                <button onClick={handleRemoveMedia} className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-700">
                    Remove
                </button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};