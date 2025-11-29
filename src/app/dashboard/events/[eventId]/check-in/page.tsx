import { getRegistrations, getEventById } from '@/lib/data';
import { CheckInList } from './components/check-in-list';
import { notFound } from 'next/navigation';

export default async function CheckInPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    const event = await getEventById(eventId);

    if (!event) {
        notFound();
    }

    const allRegistrations = await getRegistrations();
    const eventRegistrations = allRegistrations.filter(l => l.eventId === eventId);

    return (
        <div className="max-w-2xl mx-auto py-8 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Event Check-in</h1>
                <p className="text-muted-foreground text-lg">
                    {event.name} • {new Date(event.date).toLocaleDateString()}
                </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground pb-4 border-b">
                <div>Total Registrations: <span className="font-medium text-foreground">{eventRegistrations.length}</span></div>
                <div>Checked In: <span className="font-medium text-foreground">{eventRegistrations.filter(l => l.status === 'Attended').length}</span></div>
            </div>

            <CheckInList registrations={eventRegistrations} eventId={eventId} />
        </div>
    );
}
