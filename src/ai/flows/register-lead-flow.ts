
'use server';
/**
 * @fileOverview A flow for registering a new lead, generating a QR code, and sending a confirmation email.
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
import { sendMarketingEmail } from './send-marketing-email-flow';
import { sendEmail } from '@/lib/netcore';

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

    // Helper to find value by fuzzy key matching
    const findValue = (keywords: string[]) => {
      const key = Object.keys(registrationDetails).find(k =>
        keywords.some(keyword => k.toLowerCase().includes(keyword))
      );
      return key ? registrationDetails[key] : '';
    };

    // Robust extraction
    const userEmail = findValue(['email', 'mail']) || '';
    const firstName = findValue(['first', 'fname', 'name']) || ''; // Fallback to just 'name' if first not found
    const lastName = findValue(['last', 'lname']) || '';

    // Construct full name, avoiding "undefined undefined"
    let userName = firstName;
    if (lastName && !userName.includes(lastName)) {
      userName = `${userName} ${lastName}`;
    }
    userName = userName.trim() || 'Guest'; // Default to Guest if absolutely nothing found

    // 1. Create a new lead document in Firestore
    const leadData = {
      name: userName,
      email: userEmail,
      eventId,
      eventName,
      status: 'New' as const,
      registrationDate: new Date().toISOString(),
      registrationDetails,
    };

    const leadRef = await addDoc(collection(db, 'leads'), leadData);
    const leadId = leadRef.id;

    // 1.1 Increment event registrations and analytics
    try {
      const { doc, updateDoc, increment } = await import('firebase/firestore');
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        registrations: increment(1),
        'analytics.formSubmissions': increment(1)
      });
    } catch (error) {
      console.error("Failed to increment event stats:", error);
      // Don't fail the whole flow just for stats
    }

    // 2. Generate a QR code containing the leadId
    const qrCodeDataUri = await QRCode.toDataURL(leadId, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
    });

    // 3. Send a confirmation email with the QR code
    if (userEmail) {
      let emailSubject = `Confirmation for ${eventName}`;
      let emailBody = `
            <h1>Registration Confirmed!</h1>
            <p>Hi ${userName || 'there'},</p>
            <p>Thank you for registering for <strong>${eventName}</strong>. We're excited to see you there!</p>
            <p>Please keep this email handy. You'll need the QR code below for a smooth check-in at the event.</p>
            <br>
            <img src="${qrCodeDataUri}" alt="Your Registration QR Code" />
            <br>
            <p>See you at the event!</p>
            <p><em>The EventFlow Team</em></p>
        `;

      try {
        // Fetch event to check for custom auto-reply settings
        const { getEventById } = await import('@/lib/data');
        const event = await getEventById(eventId);

        if (event?.autoReplyConfig?.enabled) {
          emailSubject = event.autoReplyConfig.subject || emailSubject;

          // Simple template replacement
          let customBody = event.autoReplyConfig.body || '';
          customBody = customBody.replace(/{{name}}/g, userName || 'there');
          customBody = customBody.replace(/{{eventName}}/g, eventName);

          // Append QR code if not present (or just always append it for now to be safe)
          // Ideally we'd let them place it with {{qrCode}}, but for now let's just append it if they didn't include it.
          if (!customBody.includes('{{qrCode}}')) {
            customBody += `
                        <br>
                        <img src="${qrCodeDataUri}" alt="Your Registration QR Code" />
                        <br>
                    `;
          } else {
            customBody = customBody.replace(/{{qrCode}}/g, `<img src="${qrCodeDataUri}" alt="Your Registration QR Code" />`);
          }

          // Use sendEmail for auto-reply
          await sendEmail({
            to: userEmail,
            subject: emailSubject, // Use emailSubject which was updated above
            html: customBody,
            from: 'events@netcorecloud.com' // Ideally from config
          }).catch(console.error); // Log error if email sending fails

          // Skip the default sendMarketingEmail if auto-reply was sent
          return {
            leadId,
            qrCode: qrCodeDataUri,
          };
        }
      } catch (error) {
        console.error("Error fetching event for auto-reply config:", error);
        // Fallback to default email is already set
      }

      // We can call the other flow directly. No need to await if we don't need the result here.
      sendMarketingEmail({
        toEmail: userEmail,
        subject: emailSubject,
        body: emailBody,
      }).catch(console.error); // Log error if email sending fails, but don't block the response
    }


    return {
      leadId,
      qrCode: qrCodeDataUri,
    };
  }
);
