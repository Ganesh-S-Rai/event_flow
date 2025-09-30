
'use server';

import { z } from 'zod';
import { saveConfig, type SenderProfile } from '@/lib/config';
import { revalidatePath } from 'next/cache';

const SenderProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Sender name cannot be empty.'),
  email: z.string().email('Invalid email address.'),
});

const SaveConfigSchema = z.object({
  netcoreApiKey: z.string().optional(),
  senderProfiles: z
    .string()
    .transform((str) => JSON.parse(str) as SenderProfile[]),
  defaultSenderId: z.string().optional(),
});

type FormState = {
  message: string;
  issues?: string[];
};

export async function saveConfigAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SaveConfigSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    console.log(fieldErrors);
    return {
      message: 'Error: Please check the form fields.',
      issues: Object.values(fieldErrors).flat(),
    };
  }

  try {
    await saveConfig(validatedFields.data);
    revalidatePath('/dashboard/settings');
    return { message: 'Success: Configuration saved.' };
  } catch (error) {
    return { message: 'Error: Failed to save configuration.' };
  }
}
