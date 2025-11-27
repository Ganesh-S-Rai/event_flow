'use client';

import { useState, useEffect, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { type Event, type Block } from '@/lib/data';
import { publishEventAction } from './actions';
import { Badge } from '@/components/ui/badge';
import { useFormStatus } from 'react-dom';
import { Loader2, ArrowLeft, Monitor, Smartphone, Settings } from 'lucide-react';
import Link from 'next/link';
import { EditorCanvas } from '../components/editor-canvas';
import { EditorSidebar } from '../components/editor-sidebar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { WebhookCard } from '../../events/[eventId]/components/webhook-card';

const slugify = (text: string) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');

function PublishButton({ status }: { status: Event['status'] }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (status === 'Active' ? 'Update' : 'Publish')}
    </Button>
  );
}

export function Editor({ event: initialEvent }: { event: Event }) {
  const { toast } = useToast();

  // Core state for the editor
  const [event, setEvent] = useState<Event>(initialEvent);
  const [slug, setSlug] = useState(initialEvent.slug || slugify(initialEvent.name));
  const [status, setStatus] = useState<Event['status']>(initialEvent.status || 'Draft');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  const [state, formAction] = useActionState(publishEventAction, { message: '' });

  // Update ID for new events from templates
  useEffect(() => {
    if (initialEvent.id.startsWith('evt-from-')) {
      setEvent(prev => ({ ...prev, id: `${initialEvent.id}-${Date.now()}` }));
    }
  }, [initialEvent.id]);

  // Update slug when event name changes
  useEffect(() => {
    if (event.name) {
      setSlug(slugify(event.name));
    }
  }, [event.name]);

  // Handle form submission result
  useEffect(() => {
    if (state.message) {
      if (state.message.startsWith('Error')) {
        toast({ variant: 'destructive', title: 'Error', description: state.issues?.[0] || 'An unknown error occurred.' });
      } else {
        toast({ title: 'Success', description: state.message });
        if (state.data?.status) setStatus(state.data.status);
      }
    }
  }, [state, toast]);

  // --- Block Management ---
  const handleAddBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: {}
    };
    // Initialize with default content based on type
    switch (type) {
      case 'hero':
        newBlock.content = {
          headline: 'Your Event Headline',
          text: 'Engaging subtext about your event.',
          buttonText: 'Register Now',
          backgroundImageSrc: 'https://picsum.photos/seed/hero/1200/800',
          buttonVariant: 'default',
          buttonSize: 'lg',
        };
        break;
      case 'heading': newBlock.content = { text: 'New Heading', level: 'h2', alignment: 'left' }; break;
      case 'text': newBlock.content = { text: 'New paragraph text.', alignment: 'left' }; break;
      case 'image': newBlock.content = { src: 'https://picsum.photos/seed/image/1200/500', alt: 'Placeholder' }; break;
      case 'button': newBlock.content = { text: 'Click Me', alignment: 'left', size: 'default', variant: 'default' }; break;
    }
    setEvent(prev => ({ ...prev, content: [...(prev.content || []), newBlock] }));
    setSelectedBlockId(newBlock.id); // Select the new block
  };

  const handleUpdateBlock = (id: string, newContent: any, newStyles?: any) => {
    setEvent(prev => ({
      ...prev,
      content: prev.content?.map(b => b.id === id ? { ...b, content: newContent, styles: newStyles !== undefined ? newStyles : b.styles } : b)
    }));
  };

  const handleRemoveBlock = (id: string) => {
    setEvent(prev => ({ ...prev, content: prev.content?.filter(b => b.id !== id) }));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const handleMoveBlock = (id: string, direction: 'up' | 'down') => {
    const blocks = event.content || [];
    const index = blocks.findIndex(b => b.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]]; // Swap
    setEvent(prev => ({ ...prev, content: newBlocks }));
  };

  const selectedBlock = event.content?.find(b => b.id === selectedBlockId) || null;

  return (
    <div className="h-screen flex flex-col bg-muted/10">
      {/* Top Bar */}
      <div className="h-14 border-b bg-background flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/events">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
          <div className="h-6 w-px bg-border" />
          <span className="font-semibold text-sm">{event.name}</span>
          <Badge variant={status === 'Active' ? 'default' : 'secondary'}>{status}</Badge>
        </div>

        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-md">
          <Button
            variant={device === 'desktop' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setDevice('desktop')}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={device === 'mobile' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setDevice('mobile')}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Event Settings</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-2">
                  <Label>Event Name</Label>
                  <Input value={event.name} onChange={(e) => setEvent(prev => ({ ...prev, name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>URL Slug</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-4">Integrations</h3>
                  <WebhookCard eventId={event.id} />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <form action={formAction}>
            <input type="hidden" name="eventId" value={event.id} />
            <input type="hidden" name="name" value={event.name} />
            <input type="hidden" name="content" value={JSON.stringify(event.content || [])} />
            <input type="hidden" name="slug" value={slug} />
            <PublishButton status={status} />
          </form>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">

        {/* Canvas Area */}
        <div className="flex-1 overflow-y-auto bg-muted/20 p-8 flex justify-center" onClick={() => setSelectedBlockId(null)}>
          <div
            className={`bg-background shadow-lg transition-all duration-300 ${device === 'mobile' ? 'w-[375px]' : 'w-full max-w-5xl'}`}
            style={{ minHeight: 'calc(100vh - 100px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <EditorCanvas
              blocks={event.content || []}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l bg-background shrink-0 overflow-hidden">
          <EditorSidebar
            selectedBlock={selectedBlock}
            onUpdateBlock={handleUpdateBlock}
            onAddBlock={handleAddBlock}
            onRemoveBlock={handleRemoveBlock}
            onMoveBlock={handleMoveBlock}
            eventName={event.name}
            eventDescription={event.description}
            formFields={event.formFields}
            autoReplyConfig={event.autoReplyConfig}
            onUpdateEvent={(fields, config) => setEvent(prev => ({ ...prev, formFields: fields, autoReplyConfig: config }))}
          />
        </div>
      </div>
    </div>
  );
}
