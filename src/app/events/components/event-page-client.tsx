
'use client';

import { useState, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Ticket, CheckCircle, Download, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerLead, type RegisterLeadOutput } from '@/ai/flows/register-lead-flow';
import { useToast } from '@/hooks/use-toast';
import type { Event, Block } from '@/lib/data';

type FormField = NonNullable<Event['formFields']>[0];

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
          const key = field.label.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
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
                                    const isOptional = field.label.toLowerCase().includes('(optional)');
                                    if (field.type === 'select') {
                                        return (
                                            <div key={field.id} className="space-y-2">
                                                <Label htmlFor={field.id}>{field.label}</Label>
                                                <Select name={field.id} required={!isOptional}>
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
                                            <Input id={field.id} name={field.id} type={field.type} placeholder={field.placeholder} required={!isOptional} />
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

function RenderBlock({ block, onButtonClick }: { block: Block; onButtonClick?: () => void }) {
  const { type, content } = block;
  const alignment = content.alignment || 'left';
  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment] || 'text-left';

  switch (type) {
    case 'heading':
      const Tag = content.level || 'h2';
      const sizeClass = {
        h1: 'text-4xl md:text-6xl font-bold tracking-tighter',
        h2: 'text-3xl font-bold tracking-tighter sm:text-4xl',
        h3: 'text-2xl font-bold tracking-tighter',
      }[Tag] || 'text-2xl font-bold';
      return <Tag className={`${sizeClass} ${alignmentClass}`}>{content.text}</Tag>;

    case 'text':
      return <p className={`text-muted-foreground md:text-xl/relaxed whitespace-pre-line ${alignmentClass}`}>{content.text}</p>;

    case 'image':
      return (
        <div className="relative aspect-video w-full my-4 rounded-lg overflow-hidden">
          <Image src={content.src} alt={content.alt || 'Event image'} fill className="object-cover" />
        </div>
      );
    
    case 'button':
        return (
            <div className={alignmentClass}>
                <Button size="lg" className="mt-4" onClick={onButtonClick}>
                    {content.text}
                </Button>
            </div>
        );

    default:
      return null;
  }
}


export function EventPageClient({ event }: { event: Event }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { formFields = [], content = [] } = event;

  const handleOpenForm = () => {
    if (formFields.length > 0) {
      setIsFormOpen(true);
    }
  };

  return (
    <div className="bg-background text-foreground">
       {formFields.length > 0 && (
          <RegistrationForm 
            open={isFormOpen} 
            onOpenChange={setIsFormOpen} 
            fields={formFields} 
            eventId={event.id} 
            eventName={event.name}
          />
       )}
      <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-20 border-b">
        <Link href="#" className="flex items-center justify-center font-bold" prefetch={false}>
          {event.name}
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span className="text-sm">{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                <span className="text-sm">{event.location}</span>
            </div>
        </nav>
      </header>
      <main>
        <section className="py-12 md:py-24">
            <div className="container px-4 md:px-6 space-y-6">
                {content.map(block => (
                    <RenderBlock key={block.id} block={block} onButtonClick={handleOpenForm} />
                ))}
            </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 {event.name}. All rights reserved.</p>
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
