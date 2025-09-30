
'use server';

/**
 * @fileOverview An AI flow for editing an existing image based on a prompt.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateEditedImageSchema = z.object({
  prompt: z.string().describe('The user\'s instructions for how to edit the image.'),
  imageUrl: z.string().describe("The original image to be edited, as a data URI or URL."),
});
export type GenerateEditedImageInput = z.infer<typeof GenerateEditedImageSchema>;

export async function generateEditedImage(input: GenerateEditedImageInput): Promise<string> {
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: [
            { media: { url: input.imageUrl } },
            { text: input.prompt },
        ],
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    if (!media.url) {
        throw new Error('Image editing failed to produce a new image.');
    }

    return media.url; // Returns a data URI string
}
