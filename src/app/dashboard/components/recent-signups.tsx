import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Lead } from '@/lib/data';

export function RecentSignups({ leads }: { leads: Lead[] }) {
  const recentLeads = leads
    .sort(
      (a, b) =>
        new Date(b.registrationDate).getTime() -
        new Date(a.registrationDate).getTime()
    )
    .slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Sign-ups</CardTitle>
        <CardDescription>
          {leads.filter((l) => l.status === 'New').length} new sign-ups this
          month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentLeads.map((lead, index) => (
            <div className="flex items-center" key={lead.id}>
              <Avatar className="h-9 w-9">
                <AvatarImage src={`/avatars/0${index + 1}.png`} alt="Avatar" />
                <AvatarFallback>
                  {lead.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">{lead.name}</p>
                <p className="text-sm text-muted-foreground">{lead.email}</p>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-medium">{lead.eventName}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(lead.registrationDate).toLocaleDateString()} {new Date(lead.registrationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
