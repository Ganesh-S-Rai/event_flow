import Link from 'next/link';
import Image from 'next/image';
import { getTemplates } from '@/lib/templates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, LayoutTemplate } from 'lucide-react';

export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Event Templates</h2>
        <p className="text-muted-foreground text-lg">
          Choose from professionally designed templates optimized for webinars, product launches, and customer events.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <Card key={template.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-card">
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={template.imageUrl}
                alt={template.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button variant="secondary" size="lg" asChild className="font-semibold">
                  <Link href={`/dashboard/editor/${template.id}`}>
                    Preview Template
                  </Link>
                </Button>
              </div>
            </div>

            <CardHeader className="space-y-2 pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="w-fit">
                  {template.name.includes('Mashup') ? 'Networking' : template.name.includes('Summit') ? 'Conference' : 'Innovation'}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold">{template.name}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1">
              <CardDescription className="text-base leading-relaxed">
                {template.description}
              </CardDescription>
            </CardContent>

            <CardFooter className="pt-4 border-t bg-muted/20">
              <Button asChild className="w-full text-base py-6 shadow-sm hover:shadow-md transition-all">
                <Link href={`/dashboard/editor/${template.id}`}>
                  Use This Template <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}

        {/* Coming Soon Card */}
        <Card className="border-2 border-dashed border-muted bg-muted/10 flex flex-col items-center justify-center text-center p-8 space-y-4 min-h-[400px]">
          <div className="p-4 bg-muted rounded-full">
            <LayoutTemplate className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">More Templates Coming Soon</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">
              We are constantly adding new designs for webinars, product launches, and more.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
