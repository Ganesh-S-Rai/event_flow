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
  emailBody: z.string().describe('The generated body of the marketing email.'),
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

  Based on the event details provided, generate a compelling email subject and body to attract the target audience.
  Consider the event name, date, location, description, and desired call to action.
  Maintain the specified tone throughout the email.

  Event Name: {{{eventName}}}
  Event Date: {{{eventDate}}}
  Event Location: {{{eventLocation}}}
  Event Description: {{{eventDescription}}}
  Target Audience: {{{targetAudience}}}
  Call to Action: {{{callToAction}}}
  Tone: {{{tone}}}

  Compose an email subject that is concise and attention-grabbing.
  Write an email body that highlights the key benefits of attending the event and encourages the recipient to take the desired action.
  Ensure the email is well-structured and easy to read.

  Subject: {{emailSubject}}

  Body: {{emailBody}}`,
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
