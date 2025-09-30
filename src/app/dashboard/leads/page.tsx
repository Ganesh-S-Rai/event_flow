import { getLeads } from '@/lib/data';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';

export default async function LeadsPage() {
  const data = await getLeads();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Leads</h2>
        <p className="text-muted-foreground">
          Here's a list of all event registrations.
        </p>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
