
import { getEvents, getRegistrations, getExpenses } from '@/lib/data';
import { StatsCards } from './components/stats-cards';
import { Overview } from './components/overview';
import { RecentSignups } from './components/recent-signups';
import { CalendarDateRangePicker } from './components/date-range-picker';
import { CreateEvent } from './events/components/create-event';
import { UpcomingEvent } from './components/upcoming-event';
import { RoiCards } from './components/roi-cards';

export default async function DashboardPage() {
  const events = await getEvents();
  const registrations = await getRegistrations();
  const expenses = await getExpenses();

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <CreateEvent />
        </div>
      </div>

      {/* ROI & Budget Section */}
      <RoiCards events={events} registrations={registrations} expenses={expenses} />

      <UpcomingEvent events={events} />


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-7">
          <RecentSignups registrations={registrations} />
        </div>
      </div>
    </div>
  );
}
