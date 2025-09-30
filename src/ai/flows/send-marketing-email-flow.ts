
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
  preheader: z.string().optional().describe('The pre-header text for the email.'),
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
  async ({ toEmail, subject, body, preheader }) => {
    try {
      let finalHtml = body;

      // Embed the pre-header as a hidden element at the start of the body
      if (preheader) {
        const preheaderHtml = `
          <span style="display: none; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">
            ${preheader}
          </span>
        `;
        finalHtml = preheaderHtml + body;
      }

      await sendNetcoreEmail({
        toEmail,
        subject,
        htmlContent: finalHtml,
      });
      return { success: true, message: 'Email sent successfully!' };
    } catch (error: any) {
      console.error('Flow Error:', error);
      return { success: false, message: error.message || 'An unknown error occurred.' };
    }
  }
);
