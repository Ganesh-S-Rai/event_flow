'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WebhookCardProps {
    eventId: string;
}

export function WebhookCard({ eventId }: WebhookCardProps) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    // Construct the full webhook URL
    // Note: In production, this should use the actual domain
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const webhookUrl = `${origin}/api/webhooks/unbounce/${eventId}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(webhookUrl);
        setCopied(true);
        toast({
            title: "Copied!",
            description: "Webhook URL copied to clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    Unbounce Integration
                </CardTitle>
                <CardDescription>
                    Use this Webhook URL to capture leads from your Unbounce landing page directly into EventFlow.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <div className="flex gap-2">
                        <Input
                            id="webhook-url"
                            value={webhookUrl}
                            readOnly
                            className="font-mono text-sm bg-muted"
                        />
                        <Button variant="outline" size="icon" onClick={copyToClipboard} className="shrink-0">
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">You can use this webhook URL to integrate with third-party tools like Unbounce. It accepts POST requests with form data.</p>
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border">
                    <p className="font-medium mb-1">Instructions:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Go to your Unbounce Page Overview.</li>
                        <li>Click on <strong>Integrations</strong> &gt; <strong>Webhooks</strong>.</li>
                        <li>Click <strong>Add Webhook</strong> and paste the URL above.</li>
                        <li>Map your form fields (ensure &apos;email&apos; is mapped).</li>
                    </ol>
                </div>
            </CardContent>
        </Card>
    );
}
