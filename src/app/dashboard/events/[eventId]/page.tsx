import { getEventById, getLeads, getExpenses } from '@/lib/data';
import { notFound } from 'next/navigation';
import { EventStats } from './components/event-stats';
import { EventActions } from './components/event-actions';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { CheckInList } from './check-in/components/check-in-list';

export default async function EventDashboardPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    const event = await getEventById(eventId);

    if (!event) {
        notFound();
    }

    const allLeads = await getLeads();
    const eventLeads = allLeads.filter(l => l.eventId === eventId);

    const allExpenses = await getExpenses();
    const eventExpenses = allExpenses.filter(e => e.eventId === eventId);

    return (
        <div className="flex-1 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
                        <Badge variant={event.status === 'Active' ? 'default' : 'secondary'}>
                            {event.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                        </div>
                    </div>
                </div>
                <EventActions event={event} />
            </div>

            <Separator />

            {/* Stats Section */}
            <EventStats event={event} leads={eventLeads} expenses={eventExpenses} />

            {/* Recent Registrations / Check-in Preview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 lg:col-span-7 space-y-4">
                    <div className="border rounded-lg p-6 bg-card">
                        <h3 className="text-lg font-semibold mb-4">Recent Registrations</h3>
                        <CheckInList leads={eventLeads.slice(0, 5)} eventId={eventId} />
                        {eventLeads.length > 5 && (
                            <div className="mt-4 text-center">
                                <p className="text-sm text-muted-foreground">Showing 5 of {eventLeads.length} registrations</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
