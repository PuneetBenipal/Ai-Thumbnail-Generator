import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { GeneratorControls } from './components/GeneratorControls';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { EditModal } from './components/EditModal';
import {
  generateTextContent,
  generateThumbnails,
  analyzeImage,
  analyzeVideoFile,
  editImageWithPrompt,
} from './services/geminiService';
import type { MediaFile, GeneratedContent, ThumbnailStyle } from './types';

const getThumbnailPrompt = (style: ThumbnailStyle, userPrompt: string, analysis: string): string => {
  const baseInstructions = `**Core Subject:** A video about "${userPrompt}".
**Visual Analysis:** The video content is about: "${analysis}".
**Strict Rule:** DO NOT include any text, logos, watermarks, or letters on the image. The image must be clean and purely visual.`;

  switch (style) {
    case 'Minimalist':
      return `Create a set of 4 minimalist YouTube thumbnails.
      **Style:** Clean, simple, flat design with a limited color palette. Use negative space effectively. Focus on a single, iconic subject.
      ${baseInstructions}`;
    case 'Cartoonish':
      return `Create a set of 4 cartoon-style YouTube thumbnails.
      **Style:** Vibrant colors, bold outlines, exaggerated features. Fun, engaging, and friendly, like an animated movie still.
      ${baseInstructions}`;
    case 'Retro':
      return `Create a set of 4 retro-style YouTube thumbnails.
      **Style:** 80s or 90s aesthetic. Use neon glows, synthwave color palettes (pinks, purples, blues), and maybe subtle film grain or VHS effects.
      ${baseInstructions}`;
    case 'Cinematic':
    default:
      return `Create a set of 4 visually stunning, professional YouTube thumbnails.
      **Style:** Photorealistic, cinematic, high-contrast lighting, dramatic. Use the rule of thirds. Masterpiece, 4K, high detail.
      ${baseInstructions}`;
  }
};


function App() {
  const [mediaFile, setMediaFile] = useState<MediaFile | null>(null);
  const [prompt, setPrompt] = useState('');
  const [thumbnailStyle, setThumbnailStyle] = useState<ThumbnailStyle>('Cinematic');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<{ image: string; index: number } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleGenerate = async () => {
    if (!mediaFile) return;
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      let analysisPrompt = '';
      if ('base64' in mediaFile) { // Image
        setLoadingMessage('Analyzing your image...');
        analysisPrompt = await analyzeImage(mediaFile.base64, mediaFile.file.type);
      } else { // Video
        analysisPrompt = await analyzeVideoFile(mediaFile.file, setLoadingMessage);
      }
      
      const textGenerationPrompt = `User Prompt: "${prompt}"\n\nMedia Analysis:\n${analysisPrompt}`;

      setLoadingMessage('Generating creative thumbnails...');
      const thumbnailGenerationPrompt = getThumbnailPrompt(thumbnailStyle, prompt, analysisPrompt);
      
      const thumbnailPromise = generateThumbnails(thumbnailGenerationPrompt);
      
      setLoadingMessage('Crafting titles and description...');
      const textPromise = generateTextContent(textGenerationPrompt);

      const [thumbnails, textContent] = await Promise.all([thumbnailPromise, textPromise]);
      
      setGeneratedContent({ ...textContent, thumbnails });

    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleOpenEditModal = (image: string, index: number) => {
    setEditingImage({ image, index });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingImage(null);
  };
  
  const handleEdit = async (editPrompt: string) => {
    if (!editingImage || !generatedContent) return;
    setIsEditing(true);
    
    try {
      const newImage = await editImageWithPrompt(editingImage.image, 'image/png', editPrompt);
      const newThumbnails = [...generatedContent.thumbnails];
      newThumbnails[editingImage.index] = newImage;
      setGeneratedContent({ ...generatedContent, thumbnails: newThumbnails });
      handleCloseModal();
    } catch (e) {
      console.error(e);
      // Here you could set an error state within the modal
    } finally {
      setIsEditing(false);
    }
  };


  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header />
        <main className="mt-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUploader onMediaUpload={setMediaFile} mediaFile={mediaFile} />
            <GeneratorControls 
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              mediaFile={mediaFile}
              thumbnailStyle={thumbnailStyle}
              setThumbnailStyle={setThumbnailStyle}
            />
          </div>

          {isLoading && (
            <div className="mt-8">
              <Loader message={loadingMessage} />
            </div>
          )}
          
          {error && (
            <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
              <p className="font-bold">An error occurred:</p>
              <p>{error}</p>
            </div>
          )}

          {generatedContent && !isLoading && (
            <div className="mt-8">
              <ResultsDisplay content={generatedContent} onEditThumbnail={handleOpenEditModal} />
            </div>
          )}

          {editingImage && (
            <EditModal 
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              imageSrc={`data:image/png;base64,${editingImage.image}`}
              onEdit={handleEdit}
              isEditing={isEditing}
            />
          )}

        </main>
      </div>
    </div>
  );
}

export default App;