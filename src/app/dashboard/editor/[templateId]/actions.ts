
'use server';

import { z } from 'zod';
import { updateEvent, type Event } from '@/lib/data';
import { revalidatePath } from 'next/cache';

const PublishEventSchema = z.object({
  eventId: z.string(),
  slug: z.string().min(1, 'Slug is required.'),
  heroTitle: z.string(),
  heroCta: z.string(),
  heroImageUrl: z.string().url().or(z.literal('')),
  aboutTitle: z.string(),
  aboutDescription: z.string(),
  speakersTitle: z.string(),
  speakers: z.string().transform((str) => JSON.parse(str)),
  agendaTitle: z.string(),
  agenda: z.string().transform((str) => JSON.parse(str)),
  formFields: z.string().transform((str) => JSON.parse(str)),
});

type FormState = {
  message: string;
  issues?: string[];
  data?: Partial<Event>;
};

export async function publishEventAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = PublishEventSchema.safeParse(
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

  const { eventId, ...eventData } = validatedFields.data;

  try {
    const dataToUpdate: Partial<Event> = {
        ...eventData,
        name: eventData.heroTitle, // Also update the main event name
        status: 'Active',
    };
    await updateEvent(eventId, dataToUpdate);

    revalidatePath('/dashboard/events');
    revalidatePath(`/dashboard/editor/${eventId}`);
    revalidatePath(`/events/${eventId}`);


    return { 
      message: 'Successfully published event page.',
      data: { status: 'Active' },
    };
  } catch (error) {
    console.error(error);
    return { message: 'Error: Failed to publish event.' };
  }
}
