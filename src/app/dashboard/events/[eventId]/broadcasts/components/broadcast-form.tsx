'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Send } from 'lucide-react';
import { draftBroadcastContent, sendBroadcastAction } from '../actions';

interface BroadcastFormProps {
    eventId: string;
    eventName: string;
    eventDescription: string;
}

export function BroadcastForm({ eventId, eventName, eventDescription }: BroadcastFormProps) {
    const [audience, setAudience] = useState('registered');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [intent, setIntent] = useState('');
    const [isDrafting, setIsDrafting] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const { toast } = useToast();

    const handleDraft = async () => {
        if (!intent) {
            toast({ title: "Intent Required", description: "Please describe what you want to say.", variant: "destructive" });
            return;
        }

        setIsDrafting(true);
        try {
            const draft = await draftBroadcastContent(eventName, eventDescription, audience, intent);
            if (draft) {
                setSubject(draft.subject);
                setBody(draft.body);
                toast({ title: "Draft Generated", description: "Review and edit before sending." });
            } else {
                toast({ title: "Error", description: "Failed to generate draft.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
        } finally {
            setIsDrafting(false);
        }
    };

    const handleSend = async () => {
        if (!subject || !body) {
            toast({ title: "Missing Content", description: "Please provide a subject and body.", variant: "destructive" });
            return;
        }

        setIsSending(true);
        try {
            const result = await sendBroadcastAction(eventId, audience, subject, body);
            if (result.success) {
                toast({ title: "Broadcast Sent", description: `Successfully sent to ${result.count} recipients.` });
                setSubject('');
                setBody('');
                setIntent('');
            } else {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to send broadcast.", variant: "destructive" });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">AI Assistant</h3>
                </div>
                <div className="space-y-2">
                    <Label>What do you want to tell them?</Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="e.g., Remind them to bring their laptops, or announce a venue change..."
                            value={intent}
                            onChange={(e) => setIntent(e.target.value)}
                        />
                        <Button
                            variant="secondary"
                            onClick={handleDraft}
                            disabled={isDrafting || !intent}
                        >
                            {isDrafting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Draft'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Audience</Label>
                    <Select value={audience} onValueChange={setAudience}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="registered">All Registrants</SelectItem>
                            <SelectItem value="checked-in">Checked-in Attendees Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Email Subject"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Message Body (HTML supported)</Label>
                    <Textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="<p>Hi {{name}}, ...</p>"
                        rows={10}
                        className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">Use <code>{`{{name}}`}</code> to insert the attendee&apos;s first name.</p>
                </div>

                <Button className="w-full" onClick={handleSend} disabled={isSending}>
                    {isSending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" /> Send Broadcast
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
