import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your application's appearance and settings.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of your app. These settings will apply
            globally.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Theme customization options will be available here soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
