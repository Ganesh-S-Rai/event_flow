import { getRegistrations } from '@/lib/data';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';

import { RegistrationActions } from './components/registration-actions';

export default async function RegistrationsPage() {
  const data = await getRegistrations();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Registrations</h2>
          <p className="text-muted-foreground">View and manage all registrations across your events.</p>
        </div>
        <RegistrationActions data={data} />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
