
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';


function LandingPagePreview({
  heroTitle,
  heroDescription,
  heroCta,
  aboutTitle,
  aboutDescription,
}: {
  heroTitle: string;
  heroDescription: string;
  heroCta: string;
  aboutTitle: string;
  aboutDescription: string;
}) {
  const event = {
    name: heroTitle || 'Your Event Name',
    description:
      heroDescription ||
      'This is where your event description will go. Keep it engaging!',
    date: '2024-10-26',
    location: 'San Francisco, CA',
  };

  return (
    <div className="bg-background text-foreground border rounded-lg overflow-hidden scale-[0.8] origin-top-left w-[125%] h-[125%]">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-20 border-b">
        <Link
          href="#"
          className="flex items-center justify-center font-bold"
          prefetch={false}
        >
          EventFlow
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild>
            <Link href="#register">
              <Ticket className="mr-2" />
              {heroCta || 'Register Now'}
            </Link>
          </Button>
        </nav>
      </header>
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] flex items-center justify-center text-center text-primary-foreground">
          <Image
            src="https://picsum.photos/seed/hero-event/1200/800"
            alt={event.name}
            fill
            className="object-cover -z-10"
            data-ai-hint="event stage"
          />
          <div className="absolute inset-0 bg-black/50 -z-10" />
          <div className="container px-4 md:px-6 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              {event.name}
            </h1>
            <div className="flex items-center justify-center gap-4 md:gap-8 text-md">
              <div className="flex items-center gap-2">
                <Calendar className="size-5" />
                <span>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-5" />
                <span>{event.location}</span>
              </div>
            </div>
            <Button asChild size="lg">
              <Link href="#register">{heroCta || 'Register Today'}</Link>
            </Button>
          </div>
        </section>

        {/* About the Event Section */}
        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                {aboutTitle}
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                {aboutDescription}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


export function Editor({
  templateId,
}: {
  templateId: string;
}) {
  // Hero States
  const [heroTitle, setHeroTitle] = useState('InnovateX 2024');
  const [heroDescription, setHeroDescription] = useState(
    'The premier conference for technology and innovation. Join industry leaders, venture capitalists, and brilliant founders to explore the future of tech.'
  );
  const [heroCta, setHeroCta] = useState('Register Now');

  // About States
  const [aboutTitle, setAboutTitle] = useState('About The Event');
  const [aboutDescription, setAboutDescription] = useState(
    'This is where your event description will go. It should be exciting and informative, telling people why they should attend.'
  );

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Landing Page Editor
          </h2>
          <p className="text-muted-foreground">
            Editing template: {templateId}
          </p>
        </div>
        <Button>Publish</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-120px)]">
        {/* Editor Form */}
        <div className="lg:col-span-1 overflow-y-auto pr-4">
          <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <h3 className="text-lg font-medium">Hero Section</h3>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-1">
                  <div className="space-y-2">
                    <Label htmlFor="hero-title">Title</Label>
                    <Input
                      id="hero-title"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-description">Description</Label>
                    <Textarea
                      id="hero-description"
                      value={heroDescription}
                      onChange={(e) => setHeroDescription(e.target.value)}
                      rows={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-cta">Button Text (CTA)</Label>
                    <Input
                      id="hero-cta"
                      value={heroCta}
                      onChange={(e) => setHeroCta(e.target.value)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <h3 className="text-lg font-medium">About Section</h3>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-1">
                  <div className="space-y-2">
                    <Label htmlFor="about-title">Section Title</Label>
                    <Input
                      id="about-title"
                      value={aboutTitle}
                      onChange={(e) => setAboutTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about-description">Section Description</Label>
                    <Textarea
                      id="about-description"
                      value={aboutDescription}
                      onChange={(e) => setAboutDescription(e.target.value)}
                      rows={5}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" disabled>
               <AccordionTrigger>
                <h3 className="text-lg font-medium">Speakers (coming soon)</h3>
              </AccordionTrigger>
            </AccordionItem>
             <AccordionItem value="item-4" disabled>
               <AccordionTrigger>
                <h3 className="text-lg font-medium">Agenda (coming soon)</h3>
              </AccordionTrigger>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-2 bg-muted/20 rounded-lg h-full overflow-hidden">
            <div className="w-full h-full transform">
                <LandingPagePreview 
                  heroTitle={heroTitle} 
                  heroDescription={heroDescription} 
                  heroCta={heroCta}
                  aboutTitle={aboutTitle}
                  aboutDescription={aboutDescription}
                />
            </div>
        </div>
      </div>
    </div>
  );
}
