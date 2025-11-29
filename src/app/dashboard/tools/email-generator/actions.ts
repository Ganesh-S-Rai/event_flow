
'use server';

import {
  generateMarketingEmail,
  type GenerateMarketingEmailInput,
  type GenerateMarketingEmailOutput,
} from '@/ai/flows/generate-marketing-email';
import { sendMarketingEmail } from '@/ai/flows/send-marketing-email-flow';
import { z } from 'zod';

const GenerateEmailSchema = z.object({
  eventName: z.string().min(1, 'Event name is required.'),
  eventDate: z.string().min(1, 'Event date is required.'),
  eventLocation: z.string().min(1, 'Event location is required.'),
  eventDescription: z.string().min(1, 'Event description is required.'),
  targetAudience: z.string().min(1, 'Target audience is required.'),
  callToAction: z.string().min(1, 'Call to action is required.'),
  tone: z.string().min(1, 'Tone is required.'),
});

const SendTestEmailSchema = z.object({
  toEmail: z.string().email('Please enter a valid email address.'),
  subject: z.string().min(1, 'Subject cannot be empty.'),
  preheader: z.string().optional(),
  body: z.string().min(1, 'Body cannot be empty.'),
});

type GenerateFormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  data?: GenerateMarketingEmailOutput;
};

type SendFormState = {
  sendTestMessage: string;
  sendTestSuccess?: boolean;
};

export async function generateEmailAction(
  prevState: GenerateFormState,
  formData: FormData
): Promise<GenerateFormState> {
  const validatedFields = GenerateEmailSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(validatedFields.error.flatten().fieldErrors)) {
      fields[key] = formData.get(key)?.toString() ?? '';
    }
    return {
      message: 'Error: Please check the form fields.',
      fields,
      issues: Object.values(validatedFields.error.flatten().fieldErrors)[0],
    };
  }

  try {
    const result = await generateMarketingEmail(
      validatedFields.data as GenerateMarketingEmailInput
    );
    return {
      message: 'Successfully generated email copy.',
      data: result,
    };
  } catch (error) {
    return {
      message: 'An unexpected error occurred while generating the email.',
    };
  }
}

export async function sendTestEmailAction(
  prevState: SendFormState,
  formData: FormData
): Promise<SendFormState> {
  const validatedFields = SendTestEmailSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      sendTestMessage: 'Error: ' + validatedFields.error.flatten().fieldErrors.toEmail?.[0] || 'Invalid input.',
      sendTestSuccess: false,
    };
  }

  try {
    const result = await sendMarketingEmail(validatedFields.data);
    if (!result.success) {
      return { sendTestMessage: `Error: ${result.message}`, sendTestSuccess: false };
    }
    return { sendTestMessage: 'Test email sent successfully!', sendTestSuccess: true };
  } catch (error: any) {
    return { sendTestMessage: `Error: ${error.message || 'An unknown error occurred.'}`, sendTestSuccess: false };
  }
}
