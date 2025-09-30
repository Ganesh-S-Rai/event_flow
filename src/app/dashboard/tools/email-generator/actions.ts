'use server';

import {
  generateMarketingEmail,
  type GenerateMarketingEmailInput,
  type GenerateMarketingEmailOutput,
} from '@/ai/flows/generate-marketing-email';
import { z } from 'zod';

const GenerateMarketingEmailInputSchema = z.object({
  eventName: z.string().min(1, 'Event name is required.'),
  eventDate: z.string().min(1, 'Event date is required.'),
  eventLocation: z.string().min(1, 'Event location is required.'),
  eventDescription: z.string().min(1, 'Event description is required.'),
  targetAudience: z.string().min(1, 'Target audience is required.'),
  callToAction: z.string().min(1, 'Call to action is required.'),
  tone: z.string().min(1, 'Tone is required.'),
});

type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  data?: GenerateMarketingEmailOutput;
};

export async function generateEmailAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = GenerateMarketingEmailInputSchema.safeParse(
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
      issues: validatedFields.error.flatten().fieldErrors[Object.keys(validatedFields.error.flatten().fieldErrors)[0]],
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
