
'use server';

import { z } from 'zod';
import { updateEvent, type Event } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { generateTextBlock } from '@/ai/flows/generate-text-block-flow';
import { generateImageBlock } from '@/ai/flows/generate-image-block-flow';
import { generateEditedImage } from '@/ai/flows/generate-edited-image-flow';

const PublishEventSchema = z.object({
  eventId: z.string(),
  name: z.string().min(1, 'Event name is required.'),
  slug: z.string().min(1, 'Slug is required.'),
  content: z.string().transform((str) => JSON.parse(str)),
  formFields: z.string().transform((str) => JSON.parse(str)).optional(),
  formTitle: z.string().optional(),
  autoReplyConfig: z.string().transform((str) => JSON.parse(str)).optional(),
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
      status: 'Active',
    };
    await updateEvent(eventId, dataToUpdate);

    revalidatePath('/dashboard/events');
    revalidatePath(`/dashboard/editor/${eventId}`);
    revalidatePath(`/events/${eventData.slug}`);

    return {
      message: 'Successfully published event page.',
      data: { status: 'Active' },
    };
  } catch (error) {
    console.error(error);
    return { message: 'Error: Failed to publish event.' };
  }
}

// AI Action for generating text
const GenerateTextBlockSchema = z.object({
  prompt: z.string(),
  context: z.string().optional(),
});

export async function generateTextBlockAction(input: z.infer<typeof GenerateTextBlockSchema>): Promise<{ text?: string; error?: string }> {
  const validatedFields = GenerateTextBlockSchema.safeParse(input);
  if (!validatedFields.success) {
    return { error: 'Invalid input.' };
  }
  try {
    const text = await generateTextBlock(validatedFields.data);
    return { text };
  } catch (error: any) {
    return { error: error.message || 'Failed to generate text.' };
  }
}

// AI Action for generating images
const GenerateImageBlockSchema = z.object({
  prompt: z.string(),
});

export async function generateImageBlockAction(input: z.infer<typeof GenerateImageBlockSchema>): Promise<{ imageUrl?: string; error?: string }> {
  const validatedFields = GenerateImageBlockSchema.safeParse(input);
  if (!validatedFields.success) {
    return { error: 'Invalid input.' };
  }
  try {
    const imageUrl = await generateImageBlock(validatedFields.data);
    return { imageUrl };
  } catch (error: any) {
    return { error: error.message || 'Failed to generate image.' };
  }
}

// AI Action for editing images
const GenerateEditedImageSchema = z.object({
  prompt: z.string(),
  imageUrl: z.string(),
});

export async function generateEditedImageAction(input: z.infer<typeof GenerateEditedImageSchema>): Promise<{ imageUrl?: string; error?: string }> {
  const validatedFields = GenerateEditedImageSchema.safeParse(input);
  if (!validatedFields.success) {
    return { error: 'Invalid input.' };
  }
  try {
    const imageUrl = await generateEditedImage(validatedFields.data);
    return { imageUrl };
  } catch (error: any) {
    return { error: error.message || 'Failed to generate image.' };
  }
}
