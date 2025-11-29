
'use server';

/**
 * @fileOverview An AI flow for generating an image for a website block.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateImageBlockSchema = z.object({
    prompt: z.string().describe('The user\'s description of the image to generate.'),
});
export type GenerateImageBlockInput = z.infer<typeof GenerateImageBlockSchema>;

export async function generateImageBlock(input: GenerateImageBlockInput): Promise<string> {
    const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: input.prompt,
    });

    if (!media || !media.url) {
        throw new Error('Image generation failed to produce an image.');
    }

    return media.url; // Returns a data URI string
}
