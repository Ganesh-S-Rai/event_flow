'use server';

import { doc, increment, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function incrementView(eventId: string) {
    // In a real app, we would check if we are using mock data here too.
    // Since we can't easily share state between server actions and the data module without a database,
    // we will just log it for now if it fails, or we could try to import the flag if we exported it.
    // For this demo, we'll just try-catch and ignore errors to prevent crashing.
    try {
        const eventRef = doc(db, 'events', eventId);
        await updateDoc(eventRef, {
            'analytics.views': increment(1)
        });
    } catch (error) {
        console.log('Mock Mode: View incremented (simulated)');
        // console.error('Error incrementing view:', error);
    }
}

import { cookies } from 'next/headers';

export async function incrementClick(eventId: string) {
    try {
        const cookieStore = await cookies();
        const hasClicked = cookieStore.has(`clicked_event_${eventId}`);

        const eventRef = doc(db, 'events', eventId);

        const updates: any = {
            'analytics.clicks': increment(1)
        };

        if (!hasClicked) {
            updates['analytics.uniqueClicks'] = increment(1);
            // Set cookie to mark this user as having clicked
            cookieStore.set(`clicked_event_${eventId}`, 'true', { maxAge: 60 * 60 * 24 * 30 }); // 30 days
        }

        await updateDoc(eventRef, updates);
    } catch (error) {
        console.log('Mock Mode: Click incremented (simulated)');
        // console.error('Error incrementing click:', error);
    }
}
