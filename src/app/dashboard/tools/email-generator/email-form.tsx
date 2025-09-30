
'use client';

import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateEmailAction, sendTestEmailAction } from './actions';
import { useActionState, useEffect, useRef, useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Copy, Wand2, Loader2, ClipboardCheck, Send } from 'lucide-react';
import type { Event } from '@/lib/data';
import { Separator } from '@/components/ui/separator';

function GenerateButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-4 w-4" />
      )}
      Generate Email
    </Button>
  );
}

function SendTestButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} size="sm">
             {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
             ) : (
                <Send className="mr-2 h-4 w-4" />
             )}
            Send Test
        </Button>
    )
}

function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy}>
      {copied ? (
        <ClipboardCheck className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      <span className="sr-only">Copy</span>
    </Button>
  );
}

export function EmailGeneratorForm({ events }: { events: Event[] }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [generateState, generateFormAction] = useActionState(generateEmailAction, {
    message: '',
  });

  const [sendState, sendFormAction] = useActionState(sendTestEmailAction, {
    sendTestMessage: '',
  });

  const generatedData = useMemo(() => generateState.data, [generateState]);

  useEffect(() => {
    if (generateState.message && generateState.message.startsWith('Error:')) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: generateState.issues?.[0] || 'Please review your inputs.',
      });
    } else if (generateState.message && generateState.data) {
      toast({
        title: 'Generation Successful',
        description: 'Your email copy is ready.',
      });
    }
  }, [generateState, toast]);

  useEffect(() => {
    if (sendState.sendTestMessage) {
      toast({
        variant: sendState.sendTestSuccess ? 'default' : 'destructive',
        title: sendState.sendTestSuccess ? 'Success' : 'Error',
        description: sendState.sendTestMessage,
      });
    }
  }, [sendState, toast]);

  const handleEventChange = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
    } else {
      setSelectedEvent(null);
    }
  };
  
  useEffect(() => {
    if (selectedEvent && formRef.current) {
      (formRef.current.elements.namedItem('eventName') as HTMLInputElement).value = selectedEvent.name;
      (formRef.current.elements.namedItem('eventDate') as HTMLInputElement).value = new Date(selectedEvent.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      (formRef.current.elements.namedItem('eventLocation') as HTMLInputElement).value = selectedEvent.location;
      (formRef.current.elements.namedItem('eventDescription') as HTMLTextAreaElement).value = selectedEvent.description;
    }
  }, [selectedEvent]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <form ref={formRef} action={generateFormAction}>
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Select an existing event or provide new details to generate marketing content.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="event-select">Select an Event (Optional)</Label>
                <Select onValueChange={handleEventChange}>
                    <SelectTrigger id="event-select">
                        <SelectValue placeholder="Choose an existing event..." />
                    </SelectTrigger>
                    <SelectContent>
                        {events.map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                                {event.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                name="eventName"
                placeholder="e.g., InnovateX 2024"
                defaultValue={generateState.fields?.eventName}
                key={selectedEvent?.id ? `name-${selectedEvent.id}`: 'name-new'}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="eventDate">Event Date</Label>
                <Input
                  id="eventDate"
                  name="eventDate"
                  placeholder="e.g., October 26, 2024"
                  defaultValue={generateState.fields?.eventDate}
                  key={selectedEvent?.id ? `date-${selectedEvent.id}`: 'date-new'}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="eventLocation">Event Location</Label>
                <Input
                  id="eventLocation"
                  name="eventLocation"
                  placeholder="e.g., San Francisco, CA"
                  defaultValue={generateState.fields?.eventLocation}
                  key={selectedEvent?.id ? `location-${selectedEvent.id}`: 'location-new'}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="eventDescription">Event Description</Label>
              <Textarea
                id="eventDescription"
                name="eventDescription"
                placeholder="Describe your event in a few sentences."
                defaultValue={generateState.fields?.eventDescription}
                key={selectedEvent?.id ? `description-${selectedEvent.id}`: 'description-new'}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                name="targetAudience"
                placeholder="e.g., Tech professionals, students"
                defaultValue={generateState.fields?.targetAudience}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="callToAction">Call to Action</Label>
                <Input
                  id="callToAction"
                  name="callToAction"
                  placeholder="e.g., Register Now"
                  defaultValue={generateState.fields?.callToAction}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tone">Tone</Label>
                <Select name="tone" defaultValue={generateState.fields?.tone}>
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="playful">Playful</SelectItem>
                    <SelectItem value="inspirational">Inspirational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <GenerateButton />
          </CardFooter>
        </Card>
      </form>
      <div className="space-y-4">
        <Card className="min-h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>Generated Email</CardTitle>
            <CardDescription>
              Here is the AI-generated email copy. You can copy it or send a test.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow">
            <div className="grid gap-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="emailSubject">Subject</Label>
                    {generatedData?.emailSubject && <CopyButton textToCopy={generatedData.emailSubject} />}
                </div>
              <Input
                id="emailSubject"
                readOnly
                value={generatedData?.emailSubject || ''}
                placeholder="Your generated subject line will appear here."
              />
            </div>
            <div className="grid gap-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="emailPreheader">Pre-header</Label>
                    {generatedData?.emailPreheader && <CopyButton textToCopy={generatedData.emailPreheader} />}
                </div>
              <Input
                id="emailPreheader"
                readOnly
                value={generatedData?.emailPreheader || ''}
                placeholder="Your generated pre-header will appear here."
              />
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                    <Label htmlFor="emailBody">Body</Label>
                    {generatedData?.emailBody && <CopyButton textToCopy={generatedData.emailBody} />}
                </div>
                <div 
                    className="min-h-[350px] w-full rounded-md border border-input bg-background/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {generatedData?.emailBody ? (
                        <div dangerouslySetInnerHTML={{ __html: generatedData.emailBody }} />
                    ) : (
                        <p className="text-muted-foreground">Your generated email body will appear here.</p>
                    )}
                </div>
            </div>
          </CardContent>
            {generatedData?.emailBody && (
                <>
                <Separator />
                 <CardFooter className="flex-col items-start gap-4">
                    <h3 className="font-semibold text-sm">Send a Test</h3>
                    <form action={sendFormAction} className="w-full space-y-2">
                        <input type="hidden" name="subject" value={generatedData.emailSubject} />
                        <input type="hidden" name="preheader" value={generatedData.emailPreheader || ''} />
                        <input type="hidden" name="body" value={generatedData.emailBody} />
                        <div className="flex w-full items-center gap-2">
                            <Input name="toEmail" type="email" placeholder="Recipient's Email Address" required className="flex-1"/>
                            <SendTestButton />
                        </div>
                    </form>
                </CardFooter>
                </>
            )}
        </Card>
      </div>
    </div>
  );
}
