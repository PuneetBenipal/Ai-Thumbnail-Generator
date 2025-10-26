import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { TextContent } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const textContentSchema = {
  type: Type.OBJECT,
  properties: {
    titles: {
      type: Type.ARRAY,
      description: "5 catchy, SEO-optimized YouTube video titles. Each title should be compelling and likely to get clicks.",
      items: { type: Type.STRING },
    },
    description: {
      type: Type.STRING,
      description: "An engaging, SEO-optimized YouTube video description that includes relevant keywords and a call-to-action.",
    },
    hashtags: {
      type: Type.ARRAY,
      description: "A list of 10-15 relevant hashtags to improve discoverability.",
      items: { type: Type.STRING },
    },
    predictedCtr: {
        type: Type.STRING,
        description: "A predicted Click-Through Rate (CTR) as a percentage (e.g., '5-7%'). Include a brief justification for this prediction based on title strength and topic relevance."
    }
  },
  required: ["titles", "description", "hashtags", "predictedCtr"],
};

export const generateTextContent = async (prompt: string): Promise<TextContent> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Based on the following information, generate a set of YouTube video titles, a description, hashtags, and a predicted CTR. The tone should be engaging and optimized for maximum clicks.\n\n${prompt}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: textContentSchema,
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as TextContent;
    } catch (error) {
        console.error("Error generating text content:", error);
        throw new Error("Failed to generate text content from Gemini API.");
    }
};

export const generateThumbnails = async (prompt: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 4,
                aspectRatio: '16:9',
                outputMimeType: 'image/png',
            }
        });
        return response.generatedImages.map(img => img.image.imageBytes);
    } catch (error) {
        console.error("Error generating thumbnails:", error);
        throw new Error("Failed to generate thumbnails from Imagen API.");
    }
};

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: { data: base64Image, mimeType },
        };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: "Briefly describe this image as if it were a frame from a YouTube video. What is happening? What is the main subject and mood?" }] },
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw new Error("Failed to analyze image with Gemini API.");
    }
};

export const analyzeVideoFile = async (videoFile: File, onProgress: (message: string) => void): Promise<string> => {
    try {
        onProgress("Uploading video... This may take a moment.");
        const uploadResponse = await ai.files.upload({
            file: videoFile,
        });

        if (!uploadResponse.file?.name) {
             throw new Error("File upload failed: The API did not return the expected file metadata.");
        }

        let file = uploadResponse.file;
        
        onProgress("Processing video... This can take several minutes.");
        while (file.state === 'PROCESSING') {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
            const getFileResponse = await ai.files.get({ name: file.name });
            file = getFileResponse.file;
        }

        if (file.state === 'FAILED') {
            throw new Error(`Video processing failed: ${file.stateDescription}`);
        }

        if (file.state !== 'ACTIVE') {
            throw new Error(`Unexpected video file state: ${file.state}`);
        }

        onProgress("Analyzing video with Gemini...");
        const videoPart = {
            fileData: {
                mimeType: file.mimeType as string,
                fileUri: file.uri as string,
            }
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [
                videoPart,
                { text: "Analyze this video and provide a summary for a thumbnail creator. Describe the key subjects, the overall mood, and suggest 2-3 visually interesting moments that would make a great thumbnail." }
            ]},
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing video file:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to analyze video with Gemini API. ${error.message}`);
        }
        throw new Error("Failed to analyze video with Gemini API due to an unknown error.");
    }
};

export const editImageWithPrompt = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: { data: base64Image, mimeType },
        };
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("No image data found in edit response.");

    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to edit image with Gemini API.");
    }
};