
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveConfigAction } from './actions';
import type { AppConfig, SenderProfile } from '@/lib/config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Save Configuration
    </Button>
  );
}

export function SettingsForm({ initialConfig }: { initialConfig: AppConfig }) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(saveConfigAction, {
    message: '',
  });

  const [senderProfiles, setSenderProfiles] = useState<SenderProfile[]>(
    initialConfig.senderProfiles || []
  );
  const [defaultSenderId, setDefaultSenderId] = useState(
    initialConfig.defaultSenderId || ''
  );

  useEffect(() => {
    if (state.message.startsWith('Success')) {
      toast({
        title: 'Settings Saved',
        description: 'Your new configuration has been saved successfully.',
      });
    } else if (state.message.startsWith('Error')) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.issues?.[0] || 'An unexpected error occurred.',
      });
    }
  }, [state, toast]);

  const addSenderProfile = () => {
    setSenderProfiles([
      ...senderProfiles,
      { id: `sender-${Date.now()}`, name: '', email: '' },
    ]);
  };

  const removeSenderProfile = (id: string) => {
    const newProfiles = senderProfiles.filter((p) => p.id !== id);
    setSenderProfiles(newProfiles);
    if (defaultSenderId === id) {
      setDefaultSenderId(newProfiles[0]?.id || '');
    }
  };

  const handleSenderProfileChange = (
    id: string,
    field: 'name' | 'email',
    value: string
  ) => {
    setSenderProfiles(
      senderProfiles.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  return (
    <form action={formAction}>
      <input
        type="hidden"
        name="senderProfiles"
        value={JSON.stringify(senderProfiles)}
      />
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Netcore Integration</CardTitle>
            <CardDescription>
              Configure your Netcore Email API to send event communications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="netcore-api-key">Email API Key</Label>
              <Input
                id="netcore-api-key"
                name="netcoreApiKey"
                type="password"
                placeholder="Enter your Netcore API key"
                defaultValue={initialConfig.netcoreApiKey}
              />
              <p className="text-sm text-muted-foreground">
                Your API key is stored securely and is not displayed here for
                your protection.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sender Profiles</CardTitle>
            <CardDescription>
              Manage the "From" names and email addresses for your marketing
              communications. These must be verified senders in Netcore.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {senderProfiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center gap-2 p-3 border rounded-md"
              >
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="space-y-2">
                    <Label htmlFor={`sender-name-${profile.id}`}>
                      Sender Name
                    </Label>
                    <Input
                      id={`sender-name-${profile.id}`}
                      value={profile.name}
                      onChange={(e) =>
                        handleSenderProfileChange(
                          profile.id,
                          'name',
                          e.target.value
                        )
                      }
                      placeholder="e.g., The EventFlow Team"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`sender-email-${profile.id}`}>
                      Sender Email
                    </Label>
                    <Input
                      id={`sender-email-${profile.id}`}
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        handleSenderProfileChange(
                          profile.id,
                          'email',
                          e.target.value
                        )
                      }
                      placeholder="e.g., marketing@yourcompany.com"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSenderProfile(profile.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Remove Profile</span>
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addSenderProfile}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Sender Profile
            </Button>
            {senderProfiles.length > 0 && (
              <div className="space-y-2 pt-4">
                <Label>Default Sender</Label>
                <Select
                  name="defaultSenderId"
                  value={defaultSenderId}
                  onValueChange={setDefaultSenderId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a default sender..." />
                  </SelectTrigger>
                  <SelectContent>
                    {senderProfiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name} &lt;{profile.email}&gt;
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  This sender will be used by default for automated emails like
                  registration confirmations.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Domain</CardTitle>
            <CardDescription>
              Connect your Netcore Cloud domain to host your landing pages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>CNAME Record</Label>
              <div className="rounded-md bg-muted p-4 text-sm">
                <p className="mb-2">To use a custom domain (e.g., <code>events.netcorecloud.com</code>), add the following CNAME record to your DNS provider:</p>
                <div className="flex items-center justify-between rounded bg-background p-2 border">
                  <code className="text-xs">cname.vercel-dns.com</code>
                  <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText('cname.vercel-dns.com')}>
                    Copy
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Your Domain</Label>
              <Input id="domain" placeholder="e.g. events.netcorecloud.com" />
              <p className="text-xs text-muted-foreground">Enter the domain you have configured.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Verify Domain</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardFooter className="flex justify-end p-6">
            <SubmitButton />
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}
