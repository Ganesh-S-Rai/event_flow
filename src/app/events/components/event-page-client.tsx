
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Ticket, CheckCircle, Download, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerLead, type RegisterLeadOutput } from '@/ai/flows/register-lead-flow';
import { useToast } from '@/hooks/use-toast';
import type { Event } from '@/lib/data';

type Speaker = Event['speakers'][0];
type AgendaItem = Event['agenda'][0];
type FormField = Event['formFields'][0];

function RegistrationForm({ 
  open, 
  onOpenChange, 
  fields, 
  eventId, 
  eventName 
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void, 
  fields: FormField[],
  eventId: string,
  eventName: string,
}) {
    const [submissionState, setSubmissionState] = useState<'form' | 'submitting' | 'success'>('form');
    const [result, setResult] = useState<RegisterLeadOutput | null>(null);
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmissionState('submitting');
        const formData = new FormData(event.currentTarget);
        const details: { [key: string]: string } = {};
        fields.forEach(field => {
          const key = field.label.toLowerCase().replace(/ /g, '_');
          details[key] = formData.get(field.id) as string;
        });

        try {
            const res = await registerLead({
                eventId,
                eventName,
                registrationDetails: details,
            });
            setResult(res);
            setSubmissionState('success');
        } catch (error) {
            console.error('Registration failed:', error);
            toast({
                variant: 'destructive',
                title: 'Registration Failed',
                description: 'Something went wrong. Please try again.',
            });
            setSubmissionState('form');
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        setTimeout(() => {
            setSubmissionState('form');
            setResult(null);
        }, 300);
    }
    
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                {submissionState === 'form' && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Tell us about you</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto pr-4">
                                {fields.map(field => {
                                    if (field.type === 'select') {
                                        return (
                                            <div key={field.id} className="space-y-2">
                                                <Label htmlFor={field.id}>{field.label}</Label>
                                                <Select name={field.id}>
                                                    <SelectTrigger id={field.id}>
                                                        <SelectValue placeholder={field.placeholder} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {field.options?.map((option, index) => (
                                                            <SelectItem key={index} value={option}>{option}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )
                                    }
                                    return (
                                        <div key={field.id} className="space-y-2">
                                            <Label htmlFor={field.id}>{field.label}</Label>
                                            <Input id={field.id} name={field.id} type={field.type} placeholder={field.placeholder} required={!field.label.includes('(Optional)')} />
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="flex items-start space-x-3 pt-2">
                                <Checkbox id="consent" defaultChecked required />
                                <Label htmlFor="consent" className="text-sm text-muted-foreground font-normal">
                                    By submitting, you agree to our <Link href="#" className="underline text-primary">privacy policy</Link>.
                                </Label>
                            </div>
                            <Button type="submit" className="w-full">Submit</Button>
                        </form>
                    </>
                )}
                 {submissionState === 'submitting' && (
                    <div className="flex flex-col items-center justify-center h-48 gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-muted-foreground">Submitting your registration...</p>
                    </div>
                )}
                {submissionState === 'success' && result?.qrCode && (
                    <div className="text-center py-8">
                         <DialogHeader className="mb-6">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <DialogTitle className="text-2xl">Registration Successful!</DialogTitle>
                            <DialogDescription>
                                Your unique QR code has been generated. Please save it for event check-in.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="relative aspect-square w-full max-w-[200px] mx-auto rounded-lg overflow-hidden border">
                            <Image src={result.qrCode} alt="Registration QR Code" fill />
                        </div>
                        <Button asChild className="mt-6 w-full">
                            <a href={result.qrCode} download={`event-qrcode-${result.leadId}.png`}>
                                <Download className="mr-2" />
                                Download QR Code
                            </a>
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

export function EventPageClient({ event }: { event: Event }) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Default values for a new/draft event
  const heroTitle = event.heroTitle || event.name;
  const heroCta = event.heroCta || 'Register Now';
  const heroImageUrl = event.heroImageUrl || "https://picsum.photos/seed/hero-event/1200/800";
  const aboutTitle = event.aboutTitle || 'About The Event';
  const aboutDescription = event.aboutDescription || event.description;
  const speakersTitle = event.speakersTitle || 'Featured Speakers';
  const speakers = event.speakers || [];
  const agendaTitle = event.agendaTitle || 'Event Agenda';
  const agenda = event.agenda || [];
  const formFields = event.formFields || [];

  return (
    <div className="bg-background text-foreground">
       {formFields.length > 0 && (
          <RegistrationForm 
            open={isFormOpen} 
            onOpenChange={setIsFormOpen} 
            fields={formFields} 
            eventId={event.id} 
            eventName={heroTitle}
          />
       )}
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
            <Link href="#register" onClick={(e) => { e.preventDefault(); setIsFormOpen(true); }}>
              <Ticket className="mr-2" />
              {heroCta}
            </Link>
          </Button>
        </nav>
      </header>
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] flex items-center justify-center text-center text-primary-foreground">
          <Image
            src={heroImageUrl}
            alt={heroTitle}
            fill
            className="object-cover -z-10"
            data-ai-hint="event stage"
          />
          <div className="absolute inset-0 bg-black/50 -z-10" />
          <div className="container px-4 md:px-6 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              {heroTitle}
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
              <Link href="#register" onClick={(e) => { e.preventDefault(); setIsFormOpen(true); }}>{heroCta}</Link>
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

        {/* Speakers Section */}
        {speakers.length > 0 && (
            <section className="py-12 md:py-16 bg-muted/40">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{speakersTitle}</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {speakers.map(speaker => (
                            <div key={speaker.id} className="text-center">
                                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-background shadow-lg">
                                    <AvatarImage src={speaker.avatarUrl} alt={speaker.name} />
                                    <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-bold">{speaker.name}</h3>
                                <p className="text-muted-foreground">{speaker.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )}

        {/* Agenda Section */}
        {agenda.length > 0 && (
            <section className="py-12 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{agendaTitle}</h2>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-8">
                        {agenda.map(item => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-24 text-right">
                                    <p className="font-bold text-primary">{item.time}</p>
                                </div>
                                <div className="flex-1 border-l-2 border-primary pl-4">
                                    <h4 className="font-bold text-lg">{item.title}</h4>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )}
        
        {/* RSVP Section */}
        <section id="register" className="py-12 md:py-24 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Register Now
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Secure your spot. Click the button to get started.
              </p>
                <Button size="lg" className="mt-6" onClick={() => setIsFormOpen(true)}>
                    Register Today
                </Button>
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
