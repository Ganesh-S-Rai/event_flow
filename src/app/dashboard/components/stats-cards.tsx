import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Calendar, BarChart3, Activity } from 'lucide-react';
import type { Event, Lead } from '@/lib/data';

export function StatsCards({
  events,
  leads,
}: {
  events: Event[];
  leads: Lead[];
}) {
  const totalRegistrations = leads.length;
  const totalEvents = events.length;
  const convertedLeads = leads.filter((l) => l.status === 'Converted').length;
  const conversionRate =
    totalRegistrations > 0
      ? ((convertedLeads / totalRegistrations) * 100).toFixed(1)
      : '0.0';

  const stats = [
    {
      title: 'Total Registrations',
      value: totalRegistrations.toLocaleString(),
      icon: Users,
      change: '+20.1% from last month',
    },
    {
      title: 'Total Events',
      value: totalEvents,
      icon: Calendar,
      change: '+2 since last month',
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: BarChart3,
      change: '+1.2% from last month',
    },
    {
      title: 'Active Now',
      value: '+573',
      icon: Activity,
      change: '+201 since last hour',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
