'use server';

import { getRegistrations, getEventById } from '@/lib/data';
import { sendEmail } from '@/lib/netcore';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DraftBroadcastSchema = z.object({
    eventName: z.string(),
    eventDescription: z.string(),
    audience: z.string(),
    intent: z.string(),
});

export async function draftBroadcastContent(eventName: string, eventDescription: string, audience: string, intent: string) {
    const prompt = `
    You are an expert event communications manager. Draft a professional and engaging email broadcast for an event.
    
    Event Name: ${eventName}
    Event Description: ${eventDescription}
    Target Audience: ${audience}
    Goal/Intent: ${intent}
    
    Return a JSON object with "subject" and "body" (HTML).
    The body should be concise, warm, and clear. Use <br> for line breaks.
    `;

    try {
        const { output } = await ai.generate({
            prompt: prompt,
            output: {
                schema: z.object({
                    subject: z.string(),
                    body: z.string(),
                })
            }
        });

        return output;
    } catch (error) {
        console.error("AI Drafting failed:", error);
        return null;
    }
}

export async function sendBroadcastAction(eventId: string, audience: string, subject: string, body: string) {
    try {
        const registrations = await getRegistrations();
        // Filter registrations for this event
        let targetRegistrations = registrations.filter(r => r.eventId === eventId);

        // Filter by audience
        if (audience === 'checked-in') {
            targetRegistrations = targetRegistrations.filter(r => r.status === 'Attended');
        } else if (audience === 'registered') {
            // All registrations for this event are registered
        }

        if (targetRegistrations.length === 0) {
            return { success: false, error: 'No recipients found for this audience.' };
        }

        // Send emails (in parallel for speed, but consider batching for large lists)
        const emailPromises = targetRegistrations.map(reg => {
            // Personalize body
            const personalizedBody = body.replace('{{name}}', reg.name.split(' ')[0]);

            return sendEmail({
                to: reg.email,
                subject: subject,
                html: personalizedBody,
                from: 'events@netcorecloud.com' // Should be configurable
            });
        });

        await Promise.all(emailPromises);

        return { success: true, count: targetRegistrations.length };
    } catch (error) {
        console.error("Broadcast failed:", error);
        return { success: false, error: 'Failed to send broadcast.' };
    }
}
