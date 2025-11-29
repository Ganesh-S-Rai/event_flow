import { ai } from '@/ai/genkit';
import { gemini15Flash } from '@genkit-ai/googleai';
import { z } from 'zod';

export const extractExpenseFlow = ai.defineFlow(
    {
        name: 'extractExpense',
        inputSchema: z.object({
            image: z.string().describe('Base64 encoded image or URL'),
        }),
        outputSchema: z.object({
            amount: z.number().nullable(),
            date: z.string().nullable(),
            vendor: z.string().nullable(),
            description: z.string().nullable(),
            category: z.enum(['Venue', 'Catering', 'Marketing', 'Travel', 'Other']).nullable(),
        }),
    },
    async (input) => {
        const prompt = `
      Analyze this receipt/invoice image and extract the following details:
      - Total Amount (as a number)
      - Date (in ISO format YYYY-MM-DD)
      - Vendor Name
      - A brief description of the items
      - Categorize it into one of: Venue, Catering, Marketing, Travel, Other.

      If you cannot find a field, return null for it.
    `;

        try {
            const response = await ai.generate({
                model: gemini15Flash,
                prompt: [
                    { text: prompt },
                    { media: { url: input.image } }
                ],
                output: {
                    format: 'json',
                    schema: z.object({
                        amount: z.number().nullable(),
                        date: z.string().nullable(),
                        vendor: z.string().nullable(),
                        description: z.string().nullable(),
                        category: z.enum(['Venue', 'Catering', 'Marketing', 'Travel', 'Other']).nullable(),
                    })
                }
            });

            if (!response.output) {
                throw new Error("AI returned no output");
            }

            return response.output;
        } catch (error) {
            console.error("AI Extraction Failed:", error);
            // Return a safe fallback or rethrow
            return {
                amount: null,
                date: null,
                vendor: null,
                description: "Failed to extract",
                category: 'Other' as const
            };
        }
    }
);
