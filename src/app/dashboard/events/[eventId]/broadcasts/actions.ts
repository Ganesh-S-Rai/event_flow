'use server';

import { getLeads, getEventById } from '@/lib/data';
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
        const leads = await getLeads();
        // Filter leads for this event
        let targetLeads = leads.filter(l => l.eventId === eventId);

        // Filter by audience
        if (audience === 'checked-in') {
            targetLeads = targetLeads.filter(l => l.status === 'Attended');
        } else if (audience === 'registered') {
            // All leads for this event are registered
        }

        if (targetLeads.length === 0) {
            return { success: false, error: 'No recipients found for this audience.' };
        }

        // Send emails (in parallel for speed, but consider batching for large lists)
        const emailPromises = targetLeads.map(lead => {
            // Personalize body
            const personalizedBody = body.replace('{{name}}', lead.name.split(' ')[0]);

            return sendEmail({
                to: lead.email,
                subject: subject,
                html: personalizedBody,
                from: 'events@netcorecloud.com' // Should be configurable
            });
        });

        await Promise.all(emailPromises);

        return { success: true, count: targetLeads.length };
    } catch (error) {
        console.error("Broadcast failed:", error);
        return { success: false, error: 'Failed to send broadcast.' };
    }
}
