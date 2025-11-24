
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useActionState, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createEventAction } from '../actions';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-11 px-8 bg-primary hover:bg-primary/90">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Create Event
    </Button>
  );
}

export function CreateEvent() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [state, formAction] = useActionState(createEventAction, {
    message: '',
  });

  useEffect(() => {
    if (state.message.startsWith('Success')) {
      toast({
        title: 'Event Created',
        description: 'Your new event has been successfully created.',
      });
      setOpen(false);
      router.push('/dashboard/events');
    } else if (state.message.startsWith('Error')) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.issues?.[0] || 'An unexpected error occurred.',
      });
    }
  }, [state, toast, router]);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-md">
          + Create New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 bg-muted/30 border-b">
          <DialogTitle className="text-2xl font-bold text-primary">Create New Event</DialogTitle>
          <DialogDescription className="text-base">
            Launch your next big event. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="p-6 space-y-6">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Event Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Annual Tech Conference 2024"
                className="h-11"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date" className="text-sm font-semibold">
                  Date
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  className="h-11"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget" className="text-sm font-semibold">
                  Budget (₹)
                </Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  placeholder="500000"
                  className="h-11"
                  min="0"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location" className="text-sm font-semibold">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g. Grand Hyatt, Mumbai or Online"
                className="h-11"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Briefly describe what this event is about..."
                className="min-h-[100px] resize-none"
                required
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-11">
              Cancel
            </Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
