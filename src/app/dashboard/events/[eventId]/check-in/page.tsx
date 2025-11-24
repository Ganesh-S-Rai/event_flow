import { getLeads, getEventById } from '@/lib/data';
import { CheckInList } from './components/check-in-list';
import { notFound } from 'next/navigation';

export default async function CheckInPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    const event = await getEventById(eventId);

    if (!event) {
        notFound();
    }

    const allLeads = await getLeads();
    const eventLeads = allLeads.filter(l => l.eventId === eventId);

    return (
        <div className="max-w-2xl mx-auto py-8 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Event Check-in</h1>
                <p className="text-muted-foreground text-lg">
                    {event.name} • {new Date(event.date).toLocaleDateString()}
                </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground pb-4 border-b">
                <div>Total Registrations: <span className="font-medium text-foreground">{eventLeads.length}</span></div>
                <div>Checked In: <span className="font-medium text-foreground">{eventLeads.filter(l => l.status === 'Attended').length}</span></div>
            </div>

            <CheckInList leads={eventLeads} eventId={eventId} />
        </div>
    );
}
