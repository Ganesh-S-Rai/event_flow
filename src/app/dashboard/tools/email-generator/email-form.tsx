'use client';

import { useFormState, useFormStatus } from 'react-dom';
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
import { generateEmailAction } from './actions';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Copy, Wand2, Loader2, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';

function SubmitButton() {
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
            {copied ? <ClipboardCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy</span>
        </Button>
    );
}

export function EmailGeneratorForm() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [state, formAction] = useFormState(generateEmailAction, {
    message: '',
  });

  useEffect(() => {
    if (state.message && state.message.startsWith('Error:')) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: state.issues?.[0] || 'Please review your inputs.',
      });
    } else if (state.message && state.data) {
        toast({
            title: 'Generation Successful',
            description: 'Your email copy is ready.',
        });
    }
  }, [state, toast]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <form ref={formRef} action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Provide the details for your event to generate marketing content.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                name="eventName"
                placeholder="e.g., InnovateX 2024"
                defaultValue={state.fields?.eventName}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="eventDate">Event Date</Label>
                <Input
                  id="eventDate"
                  name="eventDate"
                  placeholder="e.g., October 26, 2024"
                  defaultValue={state.fields?.eventDate}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="eventLocation">Event Location</Label>
                <Input
                  id="eventLocation"
                  name="eventLocation"
                  placeholder="e.g., San Francisco, CA"
                  defaultValue={state.fields?.eventLocation}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="eventDescription">Event Description</Label>
              <Textarea
                id="eventDescription"
                name="eventDescription"
                placeholder="Describe your event in a few sentences."
                defaultValue={state.fields?.eventDescription}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                name="targetAudience"
                placeholder="e.g., Tech professionals, students"
                defaultValue={state.fields?.targetAudience}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="callToAction">Call to Action</Label>
                <Input
                  id="callToAction"
                  name="callToAction"
                  placeholder="e.g., Register Now"
                  defaultValue={state.fields?.callToAction}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tone">Tone</Label>
                <Select name="tone" defaultValue={state.fields?.tone}>
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
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
      <div className="space-y-4">
        <Card className="min-h-[600px]">
          <CardHeader>
            <CardTitle>Generated Email</CardTitle>
            <CardDescription>
              Here is the AI-generated email copy. You can copy it or request a new one.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="emailSubject">Subject</Label>
                    {state.data?.emailSubject && <CopyButton textToCopy={state.data.emailSubject} />}
                </div>
              <Input
                id="emailSubject"
                readOnly
                value={state.data?.emailSubject || ''}
                placeholder="Your generated subject line will appear here."
              />
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                    <Label htmlFor="emailBody">Body</Label>
                    {state.data?.emailBody && <CopyButton textToCopy={state.data.emailBody} />}
                </div>
              <Textarea
                id="emailBody"
                readOnly
                className="min-h-[350px] resize-none"
                value={state.data?.emailBody || ''}
                placeholder="Your generated email body will appear here."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
