import { NextRequest, NextResponse } from 'next/server';
import { addRegistration, getEventById } from '@/lib/data';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { eventId } = await params;

        // 1. Verify Event Exists
        const event = await getEventById(eventId);
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // 2. Parse Form Data
        // Unbounce sends data as application/x-www-form-urlencoded or multipart/form-data
        const formData = await request.formData();
        const data: Record<string, string> = {};

        formData.forEach((value, key) => {
            if (typeof value === 'string') {
                data[key] = value;
            }
        });

        // 3. Extract Standard Fields
        // Unbounce fields usually map to what you name them in the builder.
        // We'll look for common variations.
        const email = data['email'] || data['work_email'] || data['contact_email'];
        const name = data['name'] || data['full_name'] || `${data['first_name'] || ''} ${data['last_name'] || ''}`.trim();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // 4. Save Registration
        await addRegistration({
            eventId: event.id,
            eventName: event.name,
            email: email,
            name: name || 'Anonymous',
            status: 'New',
            registrationDate: new Date().toISOString(),
            registrationDetails: data // Store all other fields as details
        });

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('Error processing Unbounce webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
