export interface TextContent {
  titles: string[];
  description: string;
  hashtags: string[];
  predictedCtr: string;
}

export interface GeneratedContent extends TextContent {
  thumbnails: string[];
}

export type MediaFile =
  | { file: File; base64: string } // Image
  | { file: File; url: string };      // Video

export type ThumbnailStyle = 'Cinematic' | 'Minimalist' | 'Cartoonish' | 'Retro';