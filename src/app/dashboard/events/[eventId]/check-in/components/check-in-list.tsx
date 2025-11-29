'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle, QrCode } from 'lucide-react';
import type { Registration } from '@/lib/data';
import { checkInLeadAction } from '../actions';
import { useToast } from '@/hooks/use-toast';

import { QrScanner } from './qr-scanner';

interface CheckInListProps {
    leads: Registration[];
    eventId: string;
}

export function CheckInList({ leads, eventId }: CheckInListProps) {
    const [search, setSearch] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const { toast } = useToast();

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleCheckIn = async (leadId: string) => {
        try {
            await checkInLeadAction(leadId, eventId);
            toast({ title: "Checked In", description: "Attendee marked as present." });
            return true;
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to check in." });
            return false;
        }
    };

    const handleScan = async (decodedText: string) => {
        // decodedText should be the leadId
        const lead = leads.find(l => l.id === decodedText);

        if (lead) {
            if (lead.status === 'Attended') {
                toast({ title: "Already Checked In", description: `${lead.name} is already marked present.`, variant: "default" });
            } else {
                const success = await handleCheckIn(lead.id);
                if (success) {
                    // Optional: Play sound
                }
            }
        } else {
            toast({ variant: "destructive", title: "Invalid QR Code", description: "Lead not found for this event." });
        }
        setIsScanning(false);
    };

    return (
        <div className="space-y-4">
            {isScanning && (
                <QrScanner
                    onScan={handleScan}
                    onClose={() => setIsScanning(false)}
                />
            )}

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Button onClick={() => setIsScanning(true)}>
                    <QrCode className="mr-2 h-4 w-4" /> Scan QR
                </Button>
            </div>

            <div className="space-y-2">
                {filteredLeads.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No attendees found.
                    </div>
                ) : (
                    filteredLeads.map(lead => (
                        <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <QrCode className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">{lead.name}</p>
                                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {lead.status === 'Attended' ? (
                                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                        <CheckCircle className="mr-1 h-3 w-3" /> Checked In
                                    </Badge>
                                ) : (
                                    <Button size="sm" onClick={() => handleCheckIn(lead.id)}>
                                        Check In
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
