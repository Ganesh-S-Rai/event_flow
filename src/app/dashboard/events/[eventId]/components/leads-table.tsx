'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Search } from 'lucide-react';
import type { Lead } from '@/lib/data';

interface LeadsTableProps {
    leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
            lead.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusVariantMap: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
        New: 'default',
        Qualified: 'secondary',
        Contacted: 'outline',
        Converted: 'default',
        Lost: 'destructive',
        Junk: 'destructive',
        Attended: 'default',
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search leads..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Qualified">Qualified</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Converted">Converted</SelectItem>
                            <SelectItem value="Attended">Attended</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLeads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    No leads found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLeads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell className="font-medium">{lead.name}</TableCell>
                                    <TableCell>{lead.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariantMap[lead.status] || 'outline'}>
                                            {lead.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(lead.registrationDate).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="text-sm text-muted-foreground">
                Showing {filteredLeads.length} of {leads.length} leads
            </div>
        </div>
    );
}
