import { getEventById } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function EventLandingPage({
  params,
}: {
  params: { eventId: string };
}) {
  const event = await getEventById(params.eventId);

  if (!event) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{event.name}</h1>
    </main>
  );
}
