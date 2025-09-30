
import { getEventById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { EventPageClient } from '../components/event-page-client';

export default async function EventLandingPage({
  params,
}: {
  params: { eventId: string };
}) {
  const event = await getEventById(params.eventId);

  if (!event) {
    notFound();
  }

  // We fetch the data on the server and pass it to a Client Component.
  return <EventPageClient event={event} />;
}
