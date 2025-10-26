import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ImageUploader } from './ImageUploader';
import { GeneratorControls } from './GeneratorControls';
import { ResultsDisplay } from './ResultsDisplay';
import { EditModal } from './EditModal';
import { Loader } from './Loader';
import { analyzeImage, analyzeVideoFrames, generateTextContent, generateThumbnails, editImageWithPrompt } from '../services/geminiService';
import { deductCredit as deductCreditService, saveGeneration } from '../services/firestoreService';
import type { MediaFile, ThumbnailStyle, GeneratedContent } from '../types';

// Helper function to extract frames from a video file
const extractFramesFromVideo = (videoFile: File, numFrames: number = 5): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(videoFile);
    video.muted = true;

    video.onloadedmetadata = async () => {
      if (video.duration === Infinity) {
          video.currentTime = 1e101; // A large number to force duration detection
          await new Promise(r => setTimeout(r, 250));
      }

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const frames: string[] = [];
      const interval = video.duration / numFrames;

      video.currentTime = 0;
      await video.play();

      const captureFrame = async (frameIndex: number) => {
        if (frameIndex >= numFrames) {
          video.pause();
          URL.revokeObjectURL(video.src);
          resolve(frames);
          return;
        }

        video.currentTime = frameIndex * interval;
      };

      video.onseeked = async () => {
        if (context) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            frames.push(dataUrl.split(',')[1]); // Remove the data URI prefix
        }
        await captureFrame(frames.length);
      };

      captureFrame(0);
    };

    video.onerror = (err) => {
      reject(new Error('Failed to load video metadata.'));
    };
  });
};

export const Dashboard: React.FC = () => {
  const { currentUser, userProfile, deductCredit: deductCreditFromContext } = useAuth();

  const [mediaFile, setMediaFile] = useState<MediaFile | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [thumbnailStyle, setThumbnailStyle] = useState<ThumbnailStyle>('Cinematic');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string>('');

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingImage, setEditingImage] = useState<{ image: string, index: number } | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);


  const handleGenerate = async () => {
    if (!mediaFile || !prompt || !currentUser) return;

    if (userProfile && userProfile.credits <= 0) {
      setError("You are out of credits. Please purchase more to continue generating content.");
      return;
    }

    setIsLoading(true);
    setError('');
    setGeneratedContent(null);
    let analysis = '';

    try {
      if ('base64' in mediaFile) {
        setLoadingMessage('Analyzing your image...');
        analysis = await analyzeImage(mediaFile.base64, mediaFile.file.type);
      } else {
        setLoadingMessage('Extracting key frames from video...');
        const frames = await extractFramesFromVideo(mediaFile.file);
        setLoadingMessage('Analyzing video frames...');
        analysis = await analyzeVideoFrames(frames);
      }
      
      const fullPrompt = `Style: ${thumbnailStyle}\nVideo topic: ${prompt}\n\nKey moments/visuals from video: ${analysis}`;

      setLoadingMessage('Generating awesome content...');
      const [textContent, thumbnails] = await Promise.all([
        generateTextContent(fullPrompt),
        generateThumbnails(`A YouTube thumbnail in a ${thumbnailStyle} style. The video is about: ${prompt}. Key visual elements from the video: ${analysis}`),
      ]);

      const finalContent = { ...textContent, thumbnails };
      setGeneratedContent(finalContent);

      // Save and deduct credit on success
      await saveGeneration({ ...finalContent, prompt });
      await deductCreditService(currentUser.uid);
      deductCreditFromContext(); // Update UI immediately

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };
  
  const handleOpenEditModal = (image: string, index: number) => {
    setEditingImage({ image, index });
    setIsEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingImage(null);
  };

  const handleEditImage = async (editPrompt: string) => {
    if (!editingImage || !generatedContent) return;
    setIsEditing(true);
    try {
      const mimeType = 'image/png'; // Thumbnails are generated as PNGs
      const editedImageBase64 = await editImageWithPrompt(editingImage.image, mimeType, editPrompt);
      
      const updatedThumbnails = [...generatedContent.thumbnails];
      updatedThumbnails[editingImage.index] = editedImageBase64;

      setGeneratedContent({
        ...generatedContent,
        thumbnails: updatedThumbnails,
      });

      handleCloseEditModal();
    } catch (err) {
      // Could show an error in the modal
      console.error(err);
    } finally {
      setIsEditing(false);
    }
  };


  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="lg:col-span-1 space-y-6 lg:sticky top-[100px] self-start">
          <ImageUploader onMediaUpload={setMediaFile} mediaFile={mediaFile} />
          <GeneratorControls
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            mediaFile={mediaFile}
            thumbnailStyle={thumbnailStyle}
            setThumbnailStyle={setThumbnailStyle}
            credits={userProfile?.credits ?? 0}
          />
        </aside>
        <div className="lg:col-span-2">
          {isLoading && <Loader message={loadingMessage} />}
          {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
          {generatedContent && !isLoading && <ResultsDisplay content={generatedContent} onEditThumbnail={handleOpenEditModal}/>}
          {!generatedContent && !isLoading && !error && (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-white/5 border border-dashed border-white/10 rounded-xl p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <h3 className="mt-4 text-xl font-semibold text-white">Your results will appear here</h3>
              <p className="mt-1 text-gray-400">Upload your media, describe your video, and click "Generate Content" to start.</p>
            </div>
          )}
        </div>
      </div>
       {isEditModalOpen && editingImage && (
        <EditModal 
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          imageSrc={`data:image/png;base64,${editingImage.image}`}
          onEdit={handleEditImage}
          isEditing={isEditing}
        />
       )}
    </main>
  );
};
