
import { getTemplates, getEvents } from '@/lib/data';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';
import Link from 'next/link';

export default async function TemplatesPage() {
  const templates = await getTemplates();
  const events = await getEvents();
  const recentlyEditedEventId = events.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.id;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Landing Page Templates</h2>
        <p className="text-muted-foreground">
          Choose a template to start creating your event landing page, or edit an existing one.
        </p>
      </div>

       {recentlyEditedEventId && (
        <Card className="bg-primary/10 border-primary/40">
          <CardHeader>
            <CardTitle>Continue Editing</CardTitle>
            <CardDescription>
              Jump back into the last event you were working on.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href={`/dashboard/editor/${recentlyEditedEventId}`}>
                <Pencil className="mr-2" />
                Continue Editing
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-6">
        {templates.map((template) => (
          <Card key={template.id} className="group flex flex-col">
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="aspect-video overflow-hidden rounded-md border">
                <Image
                  src={template.imageUrl}
                  alt={template.name}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="#">
                  <Eye className="mr-2" />
                  Preview
                </Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href={`/dashboard/editor/${template.id}`}>
                  <Pencil className="mr-2" />
                  Use Template
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
