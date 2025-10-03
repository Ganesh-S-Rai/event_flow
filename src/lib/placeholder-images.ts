
import { promises as fs } from 'fs';
import path from 'path';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const getPlaceholderImages = async (): Promise<ImagePlaceholder[]> => {
  const filePath = path.join(process.cwd(), 'placeholder-images.json');
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return data.placeholderImages || [];
  } catch (error) {
    console.error('Failed to read placeholder-images.json:', error);
    return [];
  }
};
