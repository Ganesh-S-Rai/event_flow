
'use server';

/**
 * @fileOverview An AI flow for generating short-form text content for website blocks.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateTextBlockSchema = z.object({
  prompt: z.string().describe('The user\'s high-level instruction for the text to be generated. For example: "A catchy headline for a tech conference".'),
  context: z.string().optional().describe('Optional existing text to provide context or to be refined by the AI.'),
});
export type GenerateTextBlockInput = z.infer<typeof GenerateTextBlockSchema>;

export async function generateTextBlock(input: GenerateTextBlockInput): Promise<string> {
    const { output } = await generateTextBlockPrompt(input);
    return output!;
}

const generateTextBlockPrompt = ai.definePrompt({
    name: 'generateTextBlockPrompt',
    input: { schema: GenerateTextBlockSchema },
    output: { schema: z.string() },
    prompt: `
        You are an AI assistant specializing in creating concise and effective website copy.
        Generate a short piece of text based on the user's prompt.
        The output should be plain text, without any markdown or HTML.

        Prompt: {{{prompt}}}
        
        {{#if context}}
        Here is the current text for context, you can refine it or use it for inspiration:
        {{{context}}}
        {{/if}}
    `,
});
