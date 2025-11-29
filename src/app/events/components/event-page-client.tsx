
'use client';

import { useState, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Calendar, MapPin, Ticket, CheckCircle, Download, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { processRegistration, type RegistrationOutput } from '@/ai/flows/register-flow';
import { useToast } from '@/hooks/use-toast';
import type { Event, Block } from '@/lib/data';
import { cn } from '@/lib/utils';
import { incrementView } from '../actions';
import { useEffect } from 'react';
import { RenderBlock } from '@/components/blocks/render-block';

type FormField = NonNullable<Event['formFields']>[0];

function RegistrationForm({
    open,
    onOpenChange,
    fields,
    eventId,
    eventName,
    title
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    fields: FormField[],
    eventId: string,
    eventName: string,
    title?: string
}) {
    const [submissionState, setSubmissionState] = useState<'form' | 'submitting' | 'success'>('form');
    const [result, setResult] = useState<RegistrationOutput | null>(null);
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmissionState('submitting');
        const formData = new FormData(event.currentTarget);
        const details: { [key: string]: string } = {};

        // Convert FormData to plain object
        formData.forEach((value, key) => {
            if (typeof value === 'string') {
                details[key] = value;
            }
        });

        // Also map fields by label for robust extraction if needed (though flow handles fuzzy matching)
        fields.forEach(field => {
            // Ensure we capture the field ID value
            const val = formData.get(field.id);
            if (typeof val === 'string') {
                details[field.id] = val;
            }
        });

        try {
            const res = await processRegistration({
                eventId: eventId,
                eventName: eventName,
                registrationDetails: details
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
                            <DialogTitle>{title || 'Tell us about you'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto px-1 pb-2">
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
                                    By submitting, you agree to our <Link href="https://netcorecloud.com/privacy-policy/" target="_blank" className="underline text-primary">privacy policy</Link>.
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
                            <a href={result.qrCode} download={`event-qrcode-${result.registrationId}.png`}>
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
    const { toast } = useToast();
    const { formFields = [], content = [] } = event;

    const handleOpenForm = () => {
        if (formFields.length > 0) {
            setIsFormOpen(true);
        } else {
            toast({
                title: "Registration Unavailable",
                description: "This event has no registration form configured.",
                variant: "destructive"
            });
        }
    };

    const hasHeroBlock = content.some(block => block.type === 'hero');

    useEffect(() => {
        incrementView(event.id);
    }, [event.id]);

    return (
        <div className="bg-background text-foreground">
            {formFields.length > 0 && (
                <RegistrationForm
                    open={isFormOpen}
                    onOpenChange={setIsFormOpen}
                    fields={formFields}
                    eventId={event.id}
                    eventName={event.name}
                    title={event.formTitle}
                />
            )}
            <header className={`px-4 lg:px-6 h-14 flex items-center z-20 ${hasHeroBlock ? 'absolute top-0 left-0 right-0 bg-transparent text-white' : 'sticky top-0 bg-background/80 backdrop-blur-sm border-b'}`}>
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
                {/* If there's no hero block, add default padding */}
                <div className={hasHeroBlock ? '' : 'py-12 md:py-24'}>
                    <div className="w-full">
                        {content.map(block => (
                            <RenderBlock key={block.id} block={block} onButtonClick={handleOpenForm} eventId={event.id} />
                        ))}
                    </div>
                </div>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-muted-foreground">&copy; 2024 {event.name}. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link href="https://netcorecloud.com/terms-of-service/" target="_blank" className="text-xs hover:underline underline-offset-4" prefetch={false}>
                        Terms of Service
                    </Link>
                    <Link href="https://netcorecloud.com/privacy-policy/" target="_blank" className="text-xs hover:underline underline-offset-4" prefetch={false}>
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    );
}
