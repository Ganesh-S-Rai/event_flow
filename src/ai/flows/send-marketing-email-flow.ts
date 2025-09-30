
'use server';

/**
 * @fileOverview A flow for sending a marketing email via Netcore.
 *
 * - sendMarketingEmail - A function that handles sending the email.
 * - SendMarketingEmailInput - The input type for the sendMarketingEmail function.
 */

import { ai } from '@/ai/genkit';
import { sendEmail as sendNetcoreEmail } from '@/lib/netcore';
import { z } from 'genkit';

const SendMarketingEmailInputSchema = z.object({
  toEmail: z.string().email().describe('The recipient\'s email address.'),
  subject: z.string().describe('The subject line of the email.'),
  body: z.string().describe('The HTML body of the email.'),
});
export type SendMarketingEmailInput = z.infer<typeof SendMarketingEmailInputSchema>;

export async function sendMarketingEmail(input: SendMarketingEmailInput): Promise<{ success: boolean; message: string }> {
  return sendMarketingEmailFlow(input);
}

const sendMarketingEmailFlow = ai.defineFlow(
  {
    name: 'sendMarketingEmailFlow',
    inputSchema: SendMarketingEmailInputSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string() }),
  },
  async ({ toEmail, subject, body }) => {
    try {
      await sendNetcoreEmail({
        toEmail,
        subject,
        htmlContent: body,
      });
      return { success: true, message: 'Email sent successfully!' };
    } catch (error: any) {
      console.error('Flow Error:', error);
      return { success: false, message: error.message || 'An unknown error occurred.' };
    }
  }
);
