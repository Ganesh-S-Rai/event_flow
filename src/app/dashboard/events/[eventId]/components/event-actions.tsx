'use client';

import { Button } from '@/components/ui/button';
import { Download, Edit, QrCode, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Event } from '@/lib/data';

interface EventActionsProps {
    event: Event;
}

export function EventActions({ event }: EventActionsProps) {
    const pageUrl = event.status === 'Active' && event.slug ? `/events/${event.slug}` : `/events/${event.id}`;

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href={pageUrl} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Page
                </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/editor/${event.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Page
                </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/events/${event.id}/check-in`}>
                    <QrCode className="mr-2 h-4 w-4" />
                    Check-in Desk
                </Link>
            </Button>
            <Button variant="default" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Leads
            </Button>
        </div>
    );
}
