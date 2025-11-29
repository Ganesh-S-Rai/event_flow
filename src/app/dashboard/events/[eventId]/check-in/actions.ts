'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

// Mock data store reference (in a real app, this would be DB only)
// We can't easily update the in-memory mock data from a server action in a separate file 
// without some shared state mechanism or just relying on the client to optimistically update.
// For this demo, we'll simulate the delay and revalidation.

export async function checkInRegistrationAction(registrationId: string, eventId: string) {
    // In a real app with Firebase:
    // await updateDoc(doc(db, 'registrations', registrationId), { status: 'Attended' });

    // Since we are using in-memory mock data in data.ts, and that file is imported here,
    // we can't directly mutate it across the server boundary easily if it's not a singleton in a persistent process.
    // However, Next.js dev server usually keeps the module in memory.

    // We will assume the data.ts export is mutable for the mock mode.
    // We need to import the mockRegistrations array to mutate it, but it's not exported directly as mutable.
    // We'll rely on a new helper in data.ts or just accept that for this specific "Check In" feature 
    // in mock mode, it might not persist across reloads unless we add a specific mutation function in data.ts.

    // Let's call a mutation function in data.ts if we can export one.
    // I'll update data.ts to export a `updateRegistrationStatus` function.

    const { updateRegistrationStatus } = await import('@/lib/data');
    await updateRegistrationStatus(registrationId, 'Attended');

    revalidatePath(`/dashboard/events/${eventId}/check-in`);
    return { success: true };
}
