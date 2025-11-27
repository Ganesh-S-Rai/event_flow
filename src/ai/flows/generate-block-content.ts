'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBlockContentInputSchema = z.object({
    blockType: z.enum(['hero', 'heading', 'text', 'speaker', 'agenda', 'faq', 'button', 'image']),
    eventName: z.string(),
    eventDescription: z.string(),
    userPrompt: z.string().optional(),
});

export type GenerateBlockContentInput = z.infer<typeof GenerateBlockContentInputSchema>;

// We return a flexible JSON object because the structure depends on the blockType
const GenerateBlockContentOutputSchema = z.object({
    content: z.any(),
});

export type GenerateBlockContentOutput = z.infer<typeof GenerateBlockContentOutputSchema>;

export async function generateBlockContent(input: GenerateBlockContentInput): Promise<GenerateBlockContentOutput> {
    return generateBlockContentFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateBlockContentPrompt',
    input: { schema: GenerateBlockContentInputSchema },
    output: { schema: GenerateBlockContentOutputSchema },
    prompt: `You are an AI assistant for an event management platform.
  Your task is to generate content for a landing page block based on the event details.

  Event Name: {{eventName}}
  Event Description: {{eventDescription}}
  Block Type: {{blockType}}
  User Prompt: {{userPrompt}}

  Generate content specifically for the '{{blockType}}' block.
  
  Output Structure Requirements:
  - For 'hero': { headline: string, text: string, buttonText: string }
  - For 'heading': { text: string }
  - For 'text': { text: string }
  - For 'speaker': { name: string, role: string, bio: string } (Generate a fictional but realistic speaker relevant to the event)
  - For 'agenda': { items: [{ time: string, title: string, description: string }] } (Generate 3 realistic agenda items)
  - For 'faq': { items: [{ question: string, answer: string }] } (Generate 3 relevant FAQs)
  - For 'button': { text: string }

  Make the content engaging, professional, and relevant to the event.
  `,
});

const generateBlockContentFlow = ai.defineFlow(
    {
        name: 'generateBlockContentFlow',
        inputSchema: GenerateBlockContentInputSchema,
        outputSchema: GenerateBlockContentOutputSchema,
    },
    async (input) => {
        try {
            const { output } = await prompt(input);
            return output!;
        } catch (error: any) {
            console.warn("AI Generation failed, falling back to mock data:", error.message);
            // Mock fallback based on blockType
            const mockData: any = {};
            switch (input.blockType) {
                case 'hero':
                    mockData.headline = `Welcome to ${input.eventName}`;
                    mockData.text = input.eventDescription || "Join us for an amazing event.";
                    mockData.buttonText = "Register Now";
                    break;
                case 'heading':
                    mockData.text = `About ${input.eventName}`;
                    break;
                case 'text':
                    mockData.text = input.eventDescription || "This is a placeholder description for the event.";
                    break;
                case 'speaker':
                    mockData.name = "Jane Doe";
                    mockData.role = "Keynote Speaker";
                    mockData.bio = "Jane is an industry expert with over 10 years of experience.";
                    break;
                case 'agenda':
                    mockData.items = [
                        { time: "09:00 AM", title: "Registration", description: "Check-in and breakfast." },
                        { time: "10:00 AM", title: "Keynote", description: "Opening remarks by the host." },
                        { time: "11:00 AM", title: "Panel Discussion", description: "Industry trends and insights." }
                    ];
                    break;
                case 'faq':
                    mockData.items = [
                        { question: "What is the refund policy?", answer: "Refunds are available up to 7 days before the event." },
                        { question: "Is parking available?", answer: "Yes, free parking is available at the venue." },
                        { question: "Will lunch be provided?", answer: "Yes, a buffet lunch is included with your ticket." }
                    ];
                    break;
                case 'button':
                    mockData.text = "Sign Up";
                    break;
                default:
                    mockData.text = "Content placeholder";
            }
            return { content: mockData };
        }
    }
);
