'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { Lead } from '@/lib/data';

interface LeadActionsProps {
    data: Lead[];
}

export function LeadActions({ data }: LeadActionsProps) {
    const handleExport = () => {
        if (!data || data.length === 0) return;

        // Define CSV headers
        const headers = ['ID', 'Name', 'Email', 'Event', 'Status', 'Date'];

        // Map data to CSV rows
        const rows = data.map(lead => [
            lead.id,
            `"${lead.name}"`, // Quote strings to handle commas
            lead.email,
            `"${lead.eventName}"`,
            lead.status,
            new Date(lead.registrationDate).toLocaleDateString()
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
            </Button>
        </div>
    );
}
