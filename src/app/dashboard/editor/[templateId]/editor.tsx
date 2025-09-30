
'use client';

import { useState, useEffect, useActionState, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Loader2, ArrowUp, ArrowDown, Type, Image as ImageIcon, MessageSquare, Pilcrow, Wand2, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3, Edit, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { type Event, type Block } from '@/lib/data';
import { publishEventAction, generateTextBlockAction, generateImageBlockAction, generateEditedImageAction } from './actions';
import { Badge } from '@/components/ui/badge';
import { useFormStatus } from 'react-dom';
import { EventPageClient } from '@/app/events/components/event-page-client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';

// --- Helper Functions ---
const slugify = (text: string) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');

// --- Main Components ---
function PublishButton({status}: {status: Event['status']}) {
  const { pending } = useFormStatus();
  return (
      <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (status === 'Active' ? 'Update' : 'Publish')}
      </Button>
  );
}

function AddBlockPopover({ onAddBlock }: { onAddBlock: (type: Block['type']) => void }) {
  const blockTypes: { type: Block['type']; label: string; icon: React.ElementType }[] = [
    { type: 'hero', label: 'Hero', icon: Star },
    { type: 'heading', label: 'Heading', icon: Type },
    { type: 'text', label: 'Text', icon: Pilcrow },
    { type: 'image', label: 'Image', icon: ImageIcon },
    { type: 'button', label: 'Button', icon: MessageSquare },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Block
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="grid gap-1">
          {blockTypes.map(({ type, label, icon: Icon }) => (
            <Button key={type} variant="ghost" className="justify-start" onClick={() => onAddBlock(type)}>
              <Icon className="mr-2 h-4 w-4" /> {label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function GenerateTextDialog({ open, onOpenChange, onGenerate, currentText }: { open: boolean, onOpenChange: (open: boolean) => void, onGenerate: (text: string) => void, currentText?: string }) {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const result = await generateTextBlockAction({ prompt, context: currentText });
            if (result.error) throw new Error(result.error);
            onGenerate(result.text!);
            onOpenChange(false);
            setPrompt('');
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate text.' });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Text with AI</DialogTitle>
                    <DialogDescription>Describe the text you want to generate. You can also provide the current text as context.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Textarea placeholder="e.g., A welcoming headline for a tech conference" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                    {currentText && <p className="text-sm text-muted-foreground">Context: "{currentText}"</p>}
                </div>
                <Button onClick={handleGenerate} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate'}
                </Button>
            </DialogContent>
        </Dialog>
    );
}

function GenerateImageDialog({ open, onOpenChange, onGenerate }: { open: boolean, onOpenChange: (open: boolean) => void, onGenerate: (url: string) => void }) {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const result = await generateImageBlockAction({ prompt });
            if (result.error) throw new Error(result.error);
            onGenerate(result.imageUrl!);
            onOpenChange(false);
            setPrompt('');
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate image.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Image with AI</DialogTitle>
                    <DialogDescription>Describe the image you want to create.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Textarea placeholder="e.g., A vibrant, abstract background for a tech website hero section" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
                <Button onClick={handleGenerate} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate'}
                </Button>
            </DialogContent>
        </Dialog>
    );
}

function EditImageDialog({ open, onOpenChange, onGenerate, currentImage }: { open: boolean, onOpenChange: (open: boolean) => void, onGenerate: (url: string) => void, currentImage: string }) {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!currentImage) {
            toast({ variant: 'destructive', title: 'Error', description: 'No image to edit.' });
            return;
        }
        setIsLoading(true);
        try {
            const result = await generateEditedImageAction({ prompt, imageUrl: currentImage });
            if (result.error) throw new Error(result.error);
            onGenerate(result.imageUrl!);
            onOpenChange(false);
            setPrompt('');
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to edit image.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Image with AI</DialogTitle>
                    <DialogDescription>Describe how you want to change the current image.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Textarea placeholder="e.g., make it black and white, add a cat in the foreground" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
                <Button onClick={handleGenerate} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Apply Edits'}
                </Button>
            </DialogContent>
        </Dialog>
    );
}


function BlockEditor({ block, onUpdate, onRemove, onMove }: { block: Block, onUpdate: (id: string, content: any) => void, onRemove: (id: string) => void, onMove: (id: string, direction: 'up' | 'down') => void }) {
    const [isTextGenOpen, setIsTextGenOpen] = useState(false);
    const [isImageGenOpen, setIsImageGenOpen] = useState(false);
    const [isImageEditOpen, setIsImageEditOpen] = useState(false);
    
    const handleGenerateText = (field: string) => (newText: string) => {
        onUpdate(block.id, { ...block.content, [field]: newText });
    };

    const handleGenerateImage = (field: string) => (newUrl: string) => {
        onUpdate(block.id, { ...block.content, [field]: newUrl });
    };

    const renderBlock = () => {
        switch (block.type) {
            case 'hero':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label>Background Image URL</Label>
                            <Input value={block.content.backgroundImageSrc || ''} onChange={(e) => onUpdate(block.id, { ...block.content, backgroundImageSrc: e.target.value })} placeholder="Image URL" />
                            <div className="flex gap-2 mt-2">
                                <Button variant="outline" size="sm" onClick={() => setIsImageGenOpen(true)}><Wand2 className="mr-2 h-4 w-4" /> Generate New</Button>
                                <Button variant="outline" size="sm" onClick={() => setIsImageEditOpen(true)} disabled={!block.content.backgroundImageSrc}><Edit className="mr-2 h-4 w-4" /> Edit with AI</Button>
                            </div>
                            <GenerateImageDialog open={isImageGenOpen} onOpenChange={setIsImageGenOpen} onGenerate={handleGenerateImage('backgroundImageSrc')} />
                            <EditImageDialog open={isImageEditOpen} onOpenChange={setIsImageEditOpen} onGenerate={handleGenerateImage('backgroundImageSrc')} currentImage={block.content.backgroundImageSrc} />
                        </div>
                        <Separator />
                        <div className="space-y-2">
                             <Label>Headline Text</Label>
                            <div className="flex items-center gap-2">
                                <Input value={block.content.headline || ''} onChange={(e) => onUpdate(block.id, { ...block.content, headline: e.target.value })} />
                                <Button variant="ghost" size="icon" onClick={() => setIsTextGenOpen(true)}><Wand2 className="h-4 w-4" /></Button>
                                <GenerateTextDialog open={isTextGenOpen} onOpenChange={setIsTextGenOpen} onGenerate={handleGenerateText('headline')} currentText={block.content.headline} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Subtext</Label>
                            <Textarea value={block.content.text || ''} onChange={(e) => onUpdate(block.id, { ...block.content, text: e.target.value })} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label>Button Text</Label>
                            <Input value={block.content.buttonText || ''} onChange={(e) => onUpdate(block.id, { ...block.content, buttonText: e.target.value })} />
                        </div>
                    </div>
                );
            case 'heading':
                return (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Input value={block.content.text || ''} onChange={(e) => onUpdate(block.id, { ...block.content, text: e.target.value })} className="text-2xl font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                            <Button variant="ghost" size="icon" onClick={() => setIsTextGenOpen(true)}><Wand2 className="h-4 w-4" /></Button>
                            <GenerateTextDialog open={isTextGenOpen} onOpenChange={setIsTextGenOpen} onGenerate={handleGenerateText('text')} currentText={block.content.text} />
                        </div>
                        <div className="flex items-center justify-between p-1 rounded-md bg-muted">
                           <ToggleGroup type="single" size="sm" value={block.content.level || 'h2'} onValueChange={(value) => value && onUpdate(block.id, {...block.content, level: value})}>
                               <ToggleGroupItem value="h1" aria-label="Heading 1"><Heading1 className="h-4 w-4" /></ToggleGroupItem>
                               <ToggleGroupItem value="h2" aria-label="Heading 2"><Heading2 className="h-4 w-4" /></ToggleGroupItem>
                               <ToggleGroupItem value="h3" aria-label="Heading 3"><Heading3 className="h-4 w-4" /></ToggleGroupItem>
                           </ToggleGroup>
                           <ToggleGroup type="single" size="sm" value={block.content.alignment || 'left'} onValueChange={(value) => value && onUpdate(block.id, {...block.content, alignment: value})}>
                               <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
                               <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
                               <ToggleGroupItem value="right" aria-label="Align right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
                           </ToggleGroup>
                        </div>
                    </div>
                );
            case 'text':
                return (
                     <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <Textarea value={block.content.text || ''} onChange={(e) => onUpdate(block.id, { ...block.content, text: e.target.value })} rows={4} className="border-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                            <Button variant="ghost" size="icon" onClick={() => setIsTextGenOpen(true)}><Wand2 className="h-4 w-4" /></Button>
                            <GenerateTextDialog open={isTextGenOpen} onOpenChange={setIsTextGenOpen} onGenerate={handleGenerateText('text')} currentText={block.content.text} />
                        </div>
                        <div className="flex items-center justify-end p-1 rounded-md bg-muted">
                           <ToggleGroup type="single" size="sm" value={block.content.alignment || 'left'} onValueChange={(value) => value && onUpdate(block.id, {...block.content, alignment: value})}>
                               <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
                               <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
                               <ToggleGroupItem value="right" aria-label="Align right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
                           </ToggleGroup>
                        </div>
                    </div>
                );
            case 'image':
                return (
                    <div>
                        <Input value={block.content.src || ''} onChange={(e) => onUpdate(block.id, { ...block.content, src: e.target.value })} placeholder="Image URL" />
                        <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" onClick={() => setIsImageGenOpen(true)}><Wand2 className="mr-2 h-4 w-4" /> Generate New</Button>
                            <Button variant="outline" size="sm" onClick={() => setIsImageEditOpen(true)} disabled={!block.content.src}><Edit className="mr-2 h-4 w-4" /> Edit with AI</Button>
                        </div>
                        <GenerateImageDialog open={isImageGenOpen} onOpenChange={setIsImageGenOpen} onGenerate={handleGenerateImage('src')} />
                        <EditImageDialog open={isImageEditOpen} onOpenChange={setIsImageEditOpen} onGenerate={handleGenerateImage('src')} currentImage={block.content.src} />
                    </div>
                );
            case 'button':
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Button Text</Label>
                            <Input value={block.content.text || ''} onChange={(e) => onUpdate(block.id, { ...block.content, text: e.target.value })} placeholder="Button Text" />
                        </div>
                        <div className="space-y-2">
                             <Label>Button URL (Optional)</Label>
                            <Input value={block.content.href || ''} onChange={(e) => onUpdate(block.id, { ...block.content, href: e.target.value })} placeholder="https://example.com" />
                            <p className="text-xs text-muted-foreground">If empty, button will open registration form.</p>
                        </div>
                        <div className="flex items-center justify-between p-1 rounded-md bg-muted">
                            <Label className="pl-2">Size</Label>
                            <ToggleGroup type="single" size="sm" value={block.content.size || 'default'} onValueChange={(value) => value && onUpdate(block.id, {...block.content, size: value})}>
                               <ToggleGroupItem value="sm" aria-label="Small">S</ToggleGroupItem>
                               <ToggleGroupItem value="default" aria-label="Default">M</ToggleGroupItem>
                               <ToggleGroupItem value="lg" aria-label="Large">L</ToggleGroupItem>
                           </ToggleGroup>
                           <Label className="pl-2">Alignment</Label>
                           <ToggleGroup type="single" size="sm" value={block.content.alignment || 'left'} onValueChange={(value) => value && onUpdate(block.id, {...block.content, alignment: value})}>
                               <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
                               <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
                               <ToggleGroupItem value="right" aria-label="Align right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
                           </ToggleGroup>
                        </div>
                    </div>
                );
            default:
                return <p>Unsupported block type</p>;
        }
    };

    return (
        <div className="p-3 border rounded-md space-y-2 relative group bg-background">
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onMove(block.id, 'up')}><ArrowUp className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onMove(block.id, 'down')}><ArrowDown className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemove(block.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
            <Label className="text-xs text-muted-foreground uppercase">{block.type}</Label>
            {renderBlock()}
        </div>
    );
}


export function Editor({ event: initialEvent }: { event: Event }) {
  const { toast } = useToast();

  // Core state for the editor
  const [event, setEvent] = useState<Event>(initialEvent);
  const [slug, setSlug] = useState(initialEvent.slug || slugify(initialEvent.name));
  const [status, setStatus] = useState<Event['status']>(initialEvent.status || 'Draft');
  
  const [state, formAction] = useActionState(publishEventAction, { message: '' });

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
      case 'hero': newBlock.content = { headline: 'Your Event Headline', text: 'Engaging subtext about your event.', buttonText: 'Register Now', backgroundImageSrc: 'https://picsum.photos/1200/800' }; break;
      case 'heading': newBlock.content = { text: 'New Heading', level: 'h2', alignment: 'left' }; break;
      case 'text': newBlock.content = { text: 'New paragraph text.', alignment: 'left' }; break;
      case 'image': newBlock.content = { src: 'https://picsum.photos/1200/500', alt: 'Placeholder' }; break;
      case 'button': newBlock.content = { text: 'Click Me', alignment: 'left', size: 'default' }; break;
    }
    setEvent(prev => ({ ...prev, content: [...(prev.content || []), newBlock] }));
  };

  const handleUpdateBlock = (id: string, newContent: any) => {
    setEvent(prev => ({
      ...prev,
      content: prev.content?.map(b => b.id === id ? { ...b, content: newContent } : b)
    }));
  };

  const handleRemoveBlock = (id: string) => {
    setEvent(prev => ({ ...prev, content: prev.content?.filter(b => b.id !== id) }));
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

  return (
    <form action={formAction} className="space-y-4 h-full">
      <input type="hidden" name="eventId" value={event.id} />
      <input type="hidden" name="name" value={event.name} />
      <input type="hidden" name="content" value={JSON.stringify(event.content || [])} />
      <input type="hidden" name="slug" value={slug} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Landing Page Editor</h2>
          <p className="text-muted-foreground">
            Editing event: <span className="font-semibold text-foreground">{event.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant={status === 'Active' ? 'default' : 'secondary'}>{status}</Badge>
            <PublishButton status={status}/>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-120px)]">
        {/* Editor Panel */}
        <div className="lg:col-span-1 overflow-y-auto pr-4 space-y-4">
          <div className="p-3 border rounded-md space-y-2 bg-background">
            <Label>Event Name</Label>
            <Input value={event.name} onChange={(e) => setEvent(prev => ({ ...prev, name: e.target.value }))} />
          </div>
           <div className="p-3 border rounded-md space-y-2 bg-background">
             <Label htmlFor="slug">URL Slug</Label>
             <div className="flex items-center rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <span className="pl-3 text-sm text-muted-foreground">/events/</span>
                <Input id="slug" name="slug" className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0" value={slug} onChange={(e) => setSlug(e.target.value)} />
             </div>
           </div>
          
          {event.content?.map(block => (
            <BlockEditor key={block.id} block={block} onUpdate={handleUpdateBlock} onRemove={handleRemoveBlock} onMove={handleMoveBlock} />
          ))}

          <AddBlockPopover onAddBlock={handleAddBlock} />
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-2 bg-muted/20 rounded-lg h-full overflow-hidden">
            <div className="w-full h-full">
               <div className="bg-background text-foreground border rounded-lg overflow-y-auto w-[125%] h-[125%] origin-top-left scale-[0.8]">
                    <EventPageClient event={event} />
                </div>
            </div>
        </div>
      </div>
    </form>
  );
}
