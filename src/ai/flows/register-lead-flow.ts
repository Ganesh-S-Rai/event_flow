
'use server';
/**
 * @fileOverview A flow for registering a new lead and generating a QR code.
 *
 * - registerLead - A function that handles the lead registration process.
 * - RegisterLeadInput - The input type for the registerLead function.
 * - RegisterLeadOutput - The return type for the registerLead function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import * as QRCode from 'qrcode';

const RegisterLeadInputSchema = z.object({
  eventId: z.string().describe('The ID of the event.'),
  eventName: z.string().describe('The name of the event.'),
  registrationDetails: z
    .record(z.string())
    .describe('Key-value pairs of registration form data.'),
});
export type RegisterLeadInput = z.infer<typeof RegisterLeadInputSchema>;

const RegisterLeadOutputSchema = z.object({
  leadId: z.string().describe('The ID of the newly created lead document.'),
  qrCode: z
    .string()
    .describe(
      "A data URI of the generated QR code image. Expected format: 'data:image/png;base64,<encoded_data>'."
    ),
});
export type RegisterLeadOutput = z.infer<typeof RegisterLeadOutputSchema>;

export async function registerLead(
  input: RegisterLeadInput
): Promise<RegisterLeadOutput> {
  return registerLeadFlow(input);
}

const registerLeadFlow = ai.defineFlow(
  {
    name: 'registerLeadFlow',
    inputSchema: RegisterLeadInputSchema,
    outputSchema: RegisterLeadOutputSchema,
  },
  async (input) => {
    const { eventId, eventName, registrationDetails } = input;

    // 1. Create a new lead document in Firestore
    const leadData = {
      name: `${registrationDetails.first_name || ''} ${
        registrationDetails.last_name || ''
      }`.trim(),
      email: registrationDetails.work_email || '',
      eventId,
      eventName,
      status: 'New' as const,
      registrationDate: new Date().toISOString(),
      registrationDetails,
    };

    const leadRef = await addDoc(collection(db, 'leads'), leadData);
    const leadId = leadRef.id;

    // 2. Generate a QR code containing the leadId
    const qrCodeDataUri = await QRCode.toDataURL(leadId, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
    });

    return {
      leadId,
      qrCode: qrCodeDataUri,
    };
  }
);
