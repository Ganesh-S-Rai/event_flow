import { getEventById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Ticket } from 'lucide-react';

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
    <div className="bg-background text-foreground">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-20 border-b">
        <Link href="/" className="flex items-center justify-center font-bold" prefetch={false}>
          EventFlow
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild>
            <Link href="#register">
              <Ticket className="mr-2" />
              Register Now
            </Link>
          </Button>
        </nav>
      </header>
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center text-center text-primary-foreground">
          <Image
            src="https://picsum.photos/seed/hero-event/1920/1080"
            alt={event.name}
            fill
            className="object-cover -z-10"
            data-ai-hint="event stage"
          />
          <div className="absolute inset-0 bg-black/50 -z-10" />
          <div className="container px-4 md:px-6 space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              {event.name}
            </h1>
            <div className="flex items-center justify-center gap-4 md:gap-8 text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="size-5" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-5" />
                <span>{event.location}</span>
              </div>
            </div>
            <Button asChild size="lg">
              <Link href="#register">
                Register Today
              </Link>
            </Button>
          </div>
        </section>

        {/* About the Event Section */}
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                About The Event
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                {event.description}
              </p>
            </div>
          </div>
        </section>
        
        {/* RSVP Section Placeholder */}
        <section id="register" className="py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Register Now
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Secure your spot at {event.name}. The RSVP form will be here.
              </p>
            </div>
          </div>
        </section>

      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 EventFlow. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
