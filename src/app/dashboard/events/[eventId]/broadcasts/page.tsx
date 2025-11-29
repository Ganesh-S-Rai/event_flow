import { getEventById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { BroadcastForm } from './components/broadcast-form';

export default async function BroadcastPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    const event = await getEventById(eventId);

    if (!event) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Event Pulse</h2>
                <p className="text-muted-foreground">
                    Send real-time updates to your attendees for {event.name}.
                </p>
            </div>

            <BroadcastForm
                eventId={event.id}
                eventName={event.name}
                eventDescription={event.description}
            />
        </div>
    );
}
