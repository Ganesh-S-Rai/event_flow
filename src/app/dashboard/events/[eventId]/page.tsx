import { getEventById, getLeads, getExpenses } from '@/lib/data';
import { notFound } from 'next/navigation';
import { EventStats } from './components/event-stats';
import { EventActions } from './components/event-actions';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { CheckInList } from './check-in/components/check-in-list';
import { LeadsTable } from './components/leads-table';
import { RecentExpenses } from './components/recent-expenses';
import { AddExpenseDialog } from '../../expenses/components/add-expense-dialog';

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

            <div className="grid gap-6 md:grid-cols-2">
                {/* Registrations Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Registrations</h3>
                    </div>
                    <div className="border rounded-lg p-4 bg-card">
                        <LeadsTable leads={eventLeads} />
                    </div>
                </div>

                {/* Expenses Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Recent Expenses</h3>
                        <AddExpenseDialog events={[event]} defaultEventId={event.id} />
                    </div>
                    <div className="border rounded-lg p-4 bg-card">
                        <RecentExpenses expenses={eventExpenses} />
                    </div>
                </div>
            </div>
        </div>
    );
}
