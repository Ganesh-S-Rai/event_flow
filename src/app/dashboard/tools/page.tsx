import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Wand2 } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    title: "AI Email Generator",
    description: "Craft engaging marketing emails for your events using AI. Increase engagement and drive registrations.",
    href: "/dashboard/tools/email-generator",
    icon: Wand2,
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tools</h2>
        <p className="text-muted-foreground">
          Leverage powerful tools to make your event a success.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3">
                <tool.icon className="h-6 w-6" />
                <CardTitle>{tool.title}</CardTitle>
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild className="w-full">
                <Link href={tool.href}>
                  Launch Tool <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
