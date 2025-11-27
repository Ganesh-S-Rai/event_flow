import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Type, Image as ImageIcon, MessageSquare, Star, Pilcrow,
    AlignLeft, AlignCenter, AlignRight, Trash2, ArrowUp, ArrowDown,
    Heading1, Heading2, Heading3, Users, Calendar, HelpCircle, Plus, X, Sparkles
} from 'lucide-react';
import { generateBlockContent } from '@/ai/flows/generate-block-content';
import { generateImage } from '@/ai/flows/generate-image';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { Block } from '@/lib/data';

interface EditorSidebarProps {
    selectedBlock: Block | null;
    onUpdateBlock: (id: string, content: any) => void;
    onAddBlock: (type: Block['type']) => void;
    onRemoveBlock: (id: string) => void;
    onMoveBlock: (id: string, direction: 'up' | 'down') => void;
    eventName: string;
    eventDescription: string;
}

export function EditorSidebar({ selectedBlock, onUpdateBlock, onAddBlock, onRemoveBlock, onMoveBlock, eventName, eventDescription }: EditorSidebarProps) {
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateContent = async () => {
        if (!selectedBlock) return;
        setIsGenerating(true);
        try {
            const result = await generateBlockContent({
                blockType: selectedBlock.type,
                eventName,
                eventDescription,
            });
            onUpdateBlock(selectedBlock.id, { ...selectedBlock.content, ...result.content });
            toast({ title: "Content Generated", description: "AI has updated the block content." });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Generation Failed", description: "Could not generate content." });
        }
        setIsGenerating(false);
    };

    const handleGenerateImage = async (prompt: string) => {
        if (!selectedBlock) return;
        setIsGenerating(true);
        try {
            const { imageUrl } = await generateImage({ prompt });
            onUpdateBlock(selectedBlock.id, { ...selectedBlock.content, src: imageUrl, backgroundImageSrc: imageUrl, imageUrl });
            toast({ title: "Image Generated", description: "AI has generated a new image." });
        } catch (error) {
            toast({ variant: "destructive", title: "Generation Failed", description: "Could not generate image." });
        }
        setIsGenerating(false);
    };

    if (!selectedBlock) {
        return (
            <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                    <h3 className="font-semibold">Add Content</h3>
                </div>
                <ScrollArea className="flex-1 p-4">
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => onAddBlock('hero')}>
                            <Star className="h-6 w-6" />
                            <span>Hero</span>
                        </Button>
                        <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => onAddBlock('heading')}>
                            <Type className="h-6 w-6" />
                            <span>Heading</span>
                        </Button>
                        <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => onAddBlock('text')}>
                            <Pilcrow className="h-6 w-6" />
                            <span>Text</span>
                        </Button>
                        <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => onAddBlock('image')}>
                            <ImageIcon className="h-6 w-6" />
                            <span>Image</span>
                        </Button>
                        <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => onAddBlock('button')}>
                            <MessageSquare className="h-6 w-6" />
                            <span>Button</span>
                        </Button>
                        <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => onAddBlock('speaker')}>
                            <Users className="h-6 w-6" />
                            <span>Speaker</span>
                        </Button>
                        <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => onAddBlock('agenda')}>
                            <Calendar className="h-6 w-6" />
                            <span>Agenda</span>
                        </Button>
                        <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => onAddBlock('faq')}>
                            <HelpCircle className="h-6 w-6" />
                            <span>FAQ</span>
                        </Button>
                    </div>
                </ScrollArea>
            </div>
        );
    }

    const { type, content } = selectedBlock;

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                <h3 className="font-semibold capitalize">{type} Block</h3>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleGenerateContent}
                        disabled={isGenerating}
                        title="Generate Content with AI"
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                    >
                        <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    </Button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <Button variant="ghost" size="icon" onClick={() => onMoveBlock(selectedBlock.id, 'up')} title="Move Up">
                        <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onMoveBlock(selectedBlock.id, 'down')} title="Move Down">
                        <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onRemoveBlock(selectedBlock.id)} className="text-destructive hover:text-destructive" title="Delete Block">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4 space-y-6">
                {type === 'hero' && (
                    <>
                        <div className="space-y-2">
                            <Label>Headline</Label>
                            <Input value={content.headline || ''} onChange={(e) => onUpdateBlock(selectedBlock.id, { ...content, headline: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Subtext</Label>
                            <Textarea value={content.text || ''} onChange={(e) => onUpdateBlock(selectedBlock.id, { ...content, text: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Button Text</Label>
                            <Input value={content.buttonText || ''} onChange={(e) => onUpdateBlock(selectedBlock.id, { ...content, buttonText: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Background Image URL</Label>
                            <Input value={content.backgroundImageSrc || ''} onChange={(e) => onUpdateBlock(selectedBlock.id, { ...content, backgroundImageSrc: e.target.value })} />
                        </div>
                    </>
                )}

                {type === 'heading' && (
                    <>
                        <div className="space-y-2">
                            <Label>Text</Label>
                            <Input value={content.text || ''} onChange={(e) => onUpdateBlock(selectedBlock.id, { ...content, text: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Level</Label>
                            <ToggleGroup type="single" value={content.level || 'h2'} onValueChange={(val) => val && onUpdateBlock(selectedBlock.id, { ...content, level: val })} className="justify-start">
                                <ToggleGroupItem value="h1"><Heading1 className="h-4 w-4" /></ToggleGroupItem>
                                <ToggleGroupItem value="h2"><Heading2 className="h-4 w-4" /></ToggleGroupItem>
                                <ToggleGroupItem value="h3"><Heading3 className="h-4 w-4" /></ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                        <div className="space-y-2">
                            <Label>Alignment</Label>
                            <ToggleGroup type="single" value={content.alignment || 'left'} onValueChange={(val) => val && onUpdateBlock(selectedBlock.id, { ...content, alignment: val })} className="justify-start">
                                <ToggleGroupItem value="left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
                                <ToggleGroupItem value="center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
                                <ToggleGroupItem value="right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                    </>
                )}

                {type === 'text' && (
                    <>
                        <div className="space-y-2">
                            <Label>Content</Label>
                            <Textarea value={content.text || ''} onChange={(e) => onUpdateBlock(selectedBlock.id, { ...content, text: e.target.value })} rows={6} />
                        </div>
                        <div className="space-y-2">
                            <Label>Alignment</Label>
                            <ToggleGroup type="single" value={content.alignment || 'left'} onValueChange={(val) => val && onUpdateBlock(selectedBlock.id, { ...content, alignment: val })} className="justify-start">
                                <ToggleGroupItem value="left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
                                <ToggleGroupItem value="center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
                                <ToggleGroupItem value="right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                    </>
                )}

                {type === 'image' && (
                    <>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Image URL</Label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs text-purple-600 hover:text-purple-700"
                                    onClick={() => {
                                        const prompt = window.prompt("Enter a description for the image:");
                                        if (prompt) handleGenerateImage(prompt);
                                    }}
                                    disabled={isGenerating}
                                >
                                    <Sparkles className="h-3 w-3 mr-1" /> Generate
                                </Button>
                            </div>
                            <Input value={content.src || ''} onChange={(e) => onUpdateBlock(selectedBlock.id, { ...content, src: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Alt Text</Label>
                            <Input value={content.alt || ''} onChange={(e) => onUpdateBlock(selectedBlock.id, { ...content, alt: e.target.value })} />
                        </div>
                    </>
                )}

                {type === 'button' && (
                    <>
                        <div className="space-y-2">
                            <Label>Text</Label>
                            <Input value={content.text || ''} onChange={(e) => onUpdateBlock(selectedBlock.id, { ...content, text: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>URL (Optional)</Label>
                            <Input value={content.href || ''} onChange={(e) => onUpdateBlock(selectedBlock.id, { ...content, href: e.target.value })} placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Variant</Label>
                            <Select value={content.variant || 'default'} onValueChange={(val) => onUpdateBlock(selectedBlock.id, { ...content, variant: val })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Primary</SelectItem>
                                    <SelectItem value="secondary">Secondary</SelectItem>
                                    <SelectItem value="outline">Outline</SelectItem>
                                    <SelectItem value="ghost">Ghost</SelectItem>
                                    <SelectItem value="link">Link</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Alignment</Label>
                            <ToggleGroup type="single" value={content.alignment || 'left'} onValueChange={(val) => val && onUpdateBlock(selectedBlock.id, { ...content, alignment: val })} className="justify-start">
                                <ToggleGroupItem value="left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
                                <ToggleGroupItem value="center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
                                <ToggleGroupItem value="right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                    </>
                )}

                {type === 'speaker' && (
                    <>
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={content.name || ''} onChange={(e) => onUpdateBlock(selectedBlock.id, { ...content, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Input value={content.role || ''} onChange={(e) => onUpdateBlock(selectedBlock.id, { ...content, role: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <Textarea value={content.bio || ''} onChange={(e) => onUpdateBlock(selectedBlock.id, { ...content, bio: e.target.value })} rows={4} />
                        </div>
                        <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input value={content.imageUrl || ''} onChange={(e) => onUpdateBlock(selectedBlock.id, { ...content, imageUrl: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>LinkedIn URL (Optional)</Label>
                            <Input value={content.linkedinUrl || ''} onChange={(e) => onUpdateBlock(selectedBlock.id, { ...content, linkedinUrl: e.target.value })} />
                        </div>
                    </>
                )}

                {type === 'agenda' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Agenda Items</Label>
                            <Button size="sm" variant="outline" onClick={() => {
                                const newItems = [...(content.items || []), { time: '09:00', title: 'New Session', description: 'Session description' }];
                                onUpdateBlock(selectedBlock.id, { ...content, items: newItems });
                            }}>
                                <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {(content.items || []).map((item: any, index: number) => (
                                <div key={index} className="border rounded-lg p-3 space-y-2 relative bg-muted/20">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                                        onClick={() => {
                                            const newItems = [...content.items];
                                            newItems.splice(index, 1);
                                            onUpdateBlock(selectedBlock.id, { ...content, items: newItems });
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="col-span-1">
                                            <Label className="text-xs">Time</Label>
                                            <Input value={item.time} onChange={(e) => {
                                                const newItems = [...content.items];
                                                newItems[index] = { ...item, time: e.target.value };
                                                onUpdateBlock(selectedBlock.id, { ...content, items: newItems });
                                            }} className="h-8" />
                                        </div>
                                        <div className="col-span-2">
                                            <Label className="text-xs">Title</Label>
                                            <Input value={item.title} onChange={(e) => {
                                                const newItems = [...content.items];
                                                newItems[index] = { ...item, title: e.target.value };
                                                onUpdateBlock(selectedBlock.id, { ...content, items: newItems });
                                            }} className="h-8" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-xs">Description</Label>
                                        <Textarea value={item.description} onChange={(e) => {
                                            const newItems = [...content.items];
                                            newItems[index] = { ...item, description: e.target.value };
                                            onUpdateBlock(selectedBlock.id, { ...content, items: newItems });
                                        }} className="h-16 text-sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {type === 'faq' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Questions</Label>
                            <Button size="sm" variant="outline" onClick={() => {
                                const newItems = [...(content.items || []), { question: 'New Question', answer: 'Answer goes here.' }];
                                onUpdateBlock(selectedBlock.id, { ...content, items: newItems });
                            }}>
                                <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {(content.items || []).map((item: any, index: number) => (
                                <div key={index} className="border rounded-lg p-3 space-y-2 relative bg-muted/20">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                                        onClick={() => {
                                            const newItems = [...content.items];
                                            newItems.splice(index, 1);
                                            onUpdateBlock(selectedBlock.id, { ...content, items: newItems });
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <div>
                                        <Label className="text-xs">Question</Label>
                                        <Input value={item.question} onChange={(e) => {
                                            const newItems = [...content.items];
                                            newItems[index] = { ...item, question: e.target.value };
                                            onUpdateBlock(selectedBlock.id, { ...content, items: newItems });
                                        }} className="h-8" />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Answer</Label>
                                        <Textarea value={item.answer} onChange={(e) => {
                                            const newItems = [...content.items];
                                            newItems[index] = { ...item, answer: e.target.value };
                                            onUpdateBlock(selectedBlock.id, { ...content, items: newItems });
                                        }} className="h-16 text-sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
