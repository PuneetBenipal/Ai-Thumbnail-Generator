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

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">1. Upload Image or Video</h2>
      <div 
        className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
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
            <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="mt-2 text-gray-300">
              <span className="font-semibold text-purple-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, MP4, etc.</p>
          </div>
        )}
        
        {mediaFile && 'base64' in mediaFile && (
           <div className="relative">
             <img 
               src={`data:${mediaFile.file.type};base64,${mediaFile.base64}`} 
               alt="Preview" 
               className="mx-auto max-h-48 rounded-md"
             />
             <p className="text-sm text-gray-400 mt-2 truncate">{mediaFile.file.name}</p>
           </div>
        )}

        {mediaFile && 'url' in mediaFile && (
            <div className="space-y-4">
                <video src={mediaFile.url} controls className="w-full rounded-md max-h-48" />
                <p className="text-sm text-gray-400 mt-2 truncate">{mediaFile.file.name}</p>
            </div>
        )}
      </div>
    </div>
  );
};