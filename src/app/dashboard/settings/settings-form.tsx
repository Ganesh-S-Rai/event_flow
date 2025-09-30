
'use client';

import { useActionState, useEffect } from 'react';
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
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveConfigAction } from './actions';
import type { AppConfig } from '@/lib/config';

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

  return (
    <form action={formAction}>
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
                Your API key is stored securely and is not displayed here for your protection.
            </p>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
