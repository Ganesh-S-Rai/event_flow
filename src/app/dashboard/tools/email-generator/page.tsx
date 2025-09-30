import { getEvents } from '@/lib/data';
import { EmailGeneratorForm } from './email-form';

export default async function EmailGeneratorPage() {
  const events = await getEvents();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Automated Email Tool
        </h1>
        <p className="text-muted-foreground text-lg">
          Craft compelling marketing emails in seconds. Just provide the event details, and let our AI do the rest.
        </p>
      </div>
      <EmailGeneratorForm events={events} />
    </div>
  );
}
