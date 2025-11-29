import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Settings, Mail } from 'lucide-react';
import type { Event } from '@/lib/data';

interface FormBuilderProps {
    formFields: NonNullable<Event['formFields']>;
    formTitle?: string;
    autoReplyConfig: Event['autoReplyConfig'];
    onUpdate: (fields: NonNullable<Event['formFields']>, config: Event['autoReplyConfig'], title?: string) => void;
}

export function FormBuilder({ formFields, formTitle, autoReplyConfig, onUpdate }: FormBuilderProps) {
    const [fields, setFields] = useState(formFields);
    const [title, setTitle] = useState(formTitle || 'Tell us about you');
    const [config, setConfig] = useState(autoReplyConfig || { enabled: false, subject: '', body: '' });
    const [isOpen, setIsOpen] = useState(false);

    const handleSave = () => {
        onUpdate(fields, config, title);
        setIsOpen(false);
    };

    const addField = () => {
        setFields([...fields, { id: `field-${Date.now()}`, label: 'New Field', type: 'text', placeholder: '' }]);
    };

    const removeField = (index: number) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };

    const updateField = (index: number, key: string, value: any) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], [key]: value };
        setFields(newFields);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" /> Configure Form & Email
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Registration Settings</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="form" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="form">Form Fields</TabsTrigger>
                        <TabsTrigger value="email">Auto-Reply Email</TabsTrigger>
                    </TabsList>

                    <TabsContent value="form" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Form Title</Label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Tell us about you"
                            />
                        </div>
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-start border p-3 rounded-md bg-muted/20">
                                    <div className="grid gap-2 flex-1">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label className="text-xs">Label</Label>
                                                <Input
                                                    value={field.label}
                                                    onChange={(e) => updateField(index, 'label', e.target.value)}
                                                    className="h-8"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Type</Label>
                                                <Select value={field.type} onValueChange={(val) => updateField(index, 'type', val)}>
                                                    <SelectTrigger className="h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="text">Text</SelectItem>
                                                        <SelectItem value="email">Email</SelectItem>
                                                        <SelectItem value="tel">Phone</SelectItem>
                                                        <SelectItem value="select">Dropdown</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs">Placeholder</Label>
                                            <Input
                                                value={field.placeholder}
                                                onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                                                className="h-8"
                                            />
                                        </div>
                                        {field.type === 'select' && (
                                            <div>
                                                <Label className="text-xs">Options (comma separated)</Label>
                                                <Input
                                                    value={field.options?.join(', ') || ''}
                                                    onChange={(e) => updateField(index, 'options', e.target.value.split(',').map(s => s.trim()))}
                                                    className="h-8"
                                                    placeholder="Option 1, Option 2"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeField(index)} className="text-destructive mt-6">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" onClick={addField} className="w-full border-dashed">
                            <Plus className="mr-2 h-4 w-4" /> Add Field
                        </Button>
                    </TabsContent>

                    <TabsContent value="email" className="space-y-4 py-4">
                        <div className="flex items-center justify-between border p-4 rounded-lg">
                            <div className="space-y-0.5">
                                <Label className="text-base">Enable Auto-Reply</Label>
                                <p className="text-sm text-muted-foreground">Send an email with QR code upon registration</p>
                            </div>
                            <Switch
                                checked={config.enabled}
                                onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
                            />
                        </div>

                        {config.enabled && (
                            <div className="space-y-4 border p-4 rounded-lg">
                                <div className="space-y-2">
                                    <Label>Email Subject</Label>
                                    <Input
                                        value={config.subject}
                                        onChange={(e) => setConfig({ ...config, subject: e.target.value })}
                                        placeholder="Registration Confirmed: [Event Name]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email Body</Label>
                                    <p className="text-xs text-muted-foreground mb-2">HTML is supported. The QR code will be automatically appended.</p>
                                    <Textarea
                                        value={config.body}
                                        onChange={(e) => setConfig({ ...config, body: e.target.value })}
                                        placeholder="<p>Thank you for registering...</p>"
                                        rows={8}
                                        className="font-mono text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
