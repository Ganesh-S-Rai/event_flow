
'use server';

/**
 * @fileOverview An AI agent for generating marketing email copy based on event details.
 *
 * - generateMarketingEmail - A function that generates marketing email copy.
 * - GenerateMarketingEmailInput - The input type for the generateMarketingEmail function.
 * - GenerateMarketingEmailOutput - The return type for the generateMarketingEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingEmailInputSchema = z.object({
  eventName: z.string().describe('The name of the event.'),
  eventDate: z.string().describe('The date of the event (e.g., January 1, 2024).'),
  eventLocation: z.string().describe('The location of the event (e.g., New York City).'),
  eventDescription: z.string().describe('A detailed description of the event.'),
  targetAudience: z.string().describe('The target audience for the event (e.g., young professionals, students).'),
  callToAction: z.string().describe('The desired call to action (e.g., Register Now, Learn More).'),
  tone: z.string().describe('The tone of the email (e.g., professional, friendly, urgent).'),
});
export type GenerateMarketingEmailInput = z.infer<typeof GenerateMarketingEmailInputSchema>;

const GenerateMarketingEmailOutputSchema = z.object({
  emailSubject: z.string().describe('The subject line for the marketing email.'),
  emailBody: z.string().describe('The generated body of the marketing email, formatted in simple HTML with paragraphs and including personalization placeholders like {{firstName}}.'),
});
export type GenerateMarketingEmailOutput = z.infer<typeof GenerateMarketingEmailOutputSchema>;

export async function generateMarketingEmail(input: GenerateMarketingEmailInput): Promise<GenerateMarketingEmailOutput> {
  return generateMarketingEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMarketingEmailPrompt',
  input: {schema: GenerateMarketingEmailInputSchema},
  output: {schema: GenerateMarketingEmailOutputSchema},
  prompt: `You are an AI assistant specialized in crafting engaging marketing emails.

  Based on the event details provided, generate a compelling email subject and a well-formatted HTML email body to attract the target audience.
  
  Instructions:
  1.  **Email Body Format:** The email body MUST be in simple HTML format. Use <p> tags for paragraphs and <strong> tags for emphasis.
  2.  **Personalization:** Include personalization placeholders where appropriate. Use Handlebars syntax, for example: 'Hi {{firstName}},'.
  3.  **Tone and Content:** Maintain the specified tone and highlight the key benefits of attending the event.
  4.  **Call to Action:** Ensure the call to action is clear and encourages the recipient to take the desired action.
  
  Event Details:
  Event Name: {{{eventName}}}
  Event Date: {{{eventDate}}}
  Event Location: {{{eventLocation}}}
  Event Description: {{{eventDescription}}}
  Target Audience: {{{targetAudience}}}
  Call to Action: {{{callToAction}}}
  Tone: {{{tone}}}
  
  Compose an email subject that is concise and attention-grabbing.
  Write the email body as a clean HTML string.
  `,
});

const generateMarketingEmailFlow = ai.defineFlow(
  {
    name: 'generateMarketingEmailFlow',
    inputSchema: GenerateMarketingEmailInputSchema,
    outputSchema: GenerateMarketingEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
