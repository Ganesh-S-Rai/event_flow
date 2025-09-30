
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
import { getConfig } from '@/lib/config';

const SendMarketingEmailInputSchema = z.object({
  toEmail: z.string().email().describe('The recipient\'s email address.'),
  subject: z.string().describe('The subject line of the email.'),
  body: z.string().describe('The HTML body of the email.'),
  preheader: z.string().optional().describe('The pre-header text for the email.'),
  from: z.object({
    name: z.string(),
    email: z.string().email(),
  }).optional().describe('The sender\'s name and email address. If not provided, the default will be used.'),
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
  async ({ toEmail, subject, body, preheader, from }) => {
    try {
      let finalHtml = body;
      let fromName = from?.name;
      let fromEmail = from?.email;

      // If no 'from' is provided, fetch the default from config
      if (!fromName || !fromEmail) {
        const config = await getConfig(true);
        if (config.defaultSenderId && config.senderProfiles) {
          const defaultSender = config.senderProfiles.find(p => p.id === config.defaultSenderId);
          if (defaultSender) {
            fromName = defaultSender.name;
            fromEmail = defaultSender.email;
          }
        }
      }

      if (!fromName || !fromEmail) {
        throw new Error('Default sender is not configured. Please set a default sender in the application settings.');
      }

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
        fromName,
        fromEmail,
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
