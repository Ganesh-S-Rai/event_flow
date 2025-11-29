import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Registration } from '@/lib/data';

export function RecentSignups({ registrations }: { registrations: Registration[] }) {
  const recentRegistrations = registrations
    .sort(
      (a, b) =>
        new Date(b.registrationDate).getTime() -
        new Date(a.registrationDate).getTime()
    )
    .slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Registrations</CardTitle>
        <CardDescription>
          {registrations.filter((r) => r.status === 'New').length} new registrations this
          month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentRegistrations.map((reg, index) => (
            <div className="flex items-center" key={reg.id}>
              <Avatar className="h-9 w-9">
                <AvatarImage src={`/avatars/0${index + 1}.png`} alt="Avatar" />
                <AvatarFallback>
                  {reg.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">{reg.name}</p>
                <p className="text-sm text-muted-foreground">{reg.email}</p>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-medium">{reg.eventName}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(reg.registrationDate).toLocaleDateString()} {new Date(reg.registrationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
