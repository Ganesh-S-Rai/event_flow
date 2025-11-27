
import { getEventBySlug, getEventById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { EventPageClient } from '../components/event-page-client';

export default async function EventLandingPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  // The event could be looked up by slug or ID
  const event = await getEventBySlug(eventId) || await getEventById(eventId);

  if (!event || event.status === 'Draft') {
    notFound();
  }

  // We fetch the data on the server and pass it to a Client Component.
  return <EventPageClient event={event} />;
}
