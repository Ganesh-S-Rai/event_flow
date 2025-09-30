import { getEvents } from '@/lib/data';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { CreateEvent } from './components/create-event';

export default async function EventsPage() {
  const data = await getEvents();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground">
            Here's a list of your events.
          </p>
        </div>
        <CreateEvent />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
