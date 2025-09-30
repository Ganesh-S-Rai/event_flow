
import { getEvents, getLeads } from '@/lib/data';
import { StatsCards } from './components/stats-cards';
import { Overview } from './components/overview';
import { RecentSignups } from './components/recent-signups';
import { CalendarDateRangePicker } from './components/date-range-picker';
import { CreateEvent } from './events/components/create-event';

export default async function DashboardPage() {
  const events = await getEvents();
  const leads = await getLeads();

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <CreateEvent />
        </div>
      </div>
      <StatsCards events={events} leads={leads} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Overview />
        </div>
        <div className="col-span-4 lg:col-span-3">
          <RecentSignups leads={leads} />
        </div>
      </div>
    </div>
  );
}
