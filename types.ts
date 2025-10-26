import { Timestamp } from 'firebase/firestore';

export type ThumbnailStyle = 'Cinematic' | 'Minimalist' | 'Cartoonish' | 'Retro';

export interface UserProfile {
    email: string;
    credits: number;
}

export interface MediaFileImage {
    file: File;
    base64: string;
}

export interface MediaFileVideo {
    file: File;
    url: string;
}

export type MediaFile = MediaFileImage | MediaFileVideo;

export interface TextContent {
  titles: string[];
  description: string;
  hashtags: string[];
  predictedCtr: string;
}

export interface GeneratedContent extends TextContent {
  thumbnails: string[];
}

export interface PastGeneration extends GeneratedContent {
    id: string;
    createdAt: Timestamp;
    prompt: string;
}
