
import { SettingsForm } from './settings-form';
import { getConfig } from '@/lib/config';

export default async function SettingsPage() {
  const config = await getConfig();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and integrations and appearance.</p>
      </div>
      <SettingsForm initialConfig={config} />
    </div>
  );
}
