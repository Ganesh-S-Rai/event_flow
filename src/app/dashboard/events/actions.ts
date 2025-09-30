
'use server';

import { z } from 'zod';
import { createEvent } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const CreateEventSchema = z.object({
  name: z.string().min(1, 'Event name is required.'),
  date: z.string().min(1, 'Event date is required.'),
  location: z.string().min(1, 'Event location is required.'),
  description: z.string().min(1, 'Event description is required.'),
});

type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function createEventAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = CreateEventSchema.safeParse({
    name: formData.get('name'),
    date: formData.get('date'),
    location: formData.get('location'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      message: 'Error: Please check the form fields.',
      issues: Object.values(fieldErrors).flat(),
    };
  }

  try {
    await createEvent(validatedFields.data);
    revalidatePath('/dashboard/events');
    return { message: 'Success: Event created.' };
  } catch (error) {
    return { message: 'Error: Failed to create event.' };
  }
}
