import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Event } from "@/lib/data";

export function UpcomingEvent({ events }: { events: Event[] }) {
    // Filter for future events and sort by date
    const upcomingEvents = events
        .filter(e => new Date(e.date) > new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const nextEvent = upcomingEvents[0];

    if (!nextEvent) {
        return null; // Don't show anything if no upcoming events, or show a call to action
    }

    return (
        <Card className="border-l-4 border-l-primary bg-muted/40">
            <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{nextEvent.name}</h3>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Upcoming</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(nextEvent.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{nextEvent.location}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button asChild className="w-full md:w-auto">
                        <Link href={`/dashboard/editor/${nextEvent.id}`}>
                            Manage Event <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
