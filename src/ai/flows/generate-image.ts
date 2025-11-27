'use server';

import { z } from 'genkit';

const GenerateImageInputSchema = z.object({
    prompt: z.string(),
});

export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
    imageUrl: z.string(),
});

export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
    const encodedPrompt = encodeURIComponent(input.prompt);
    // Using Pollinations.ai for instant, no-auth image generation
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;

    return { imageUrl };
}
