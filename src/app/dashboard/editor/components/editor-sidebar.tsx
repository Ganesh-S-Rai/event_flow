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
    Heading1, Heading2, Heading3
} from 'lucide-react';
import type { Block } from '@/lib/data';

interface EditorSidebarProps {
    selectedBlock: Block | null;
    onUpdateBlock: (id: string, content: any) => void;
    onAddBlock: (type: Block['type']) => void;
    onRemoveBlock: (id: string) => void;
    onMoveBlock: (id: string, direction: 'up' | 'down') => void;
}

export function EditorSidebar({ selectedBlock, onUpdateBlock, onAddBlock, onRemoveBlock, onMoveBlock }: EditorSidebarProps) {

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
                            <Label>Image URL</Label>
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
            </ScrollArea>
        </div>
    );
}
