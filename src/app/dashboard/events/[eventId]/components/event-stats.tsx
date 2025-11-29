'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Wallet, Users, MousePointerClick, Eye } from 'lucide-react';
import type { Event, Lead, Expense } from '@/lib/data';

interface EventStatsProps {
    event: Event;
    leads: Lead[];
    expenses: Expense[];
}

export function EventStats({ event, leads, expenses }: EventStatsProps) {
    // Calculate Metrics
    const totalBudget = event.budget || 0;
    const totalSpend = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalLeads = leads.length;

    const costPerLead = totalLeads > 0 ? totalSpend / totalLeads : 0;
    const budgetUtilization = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{budgetUtilization.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                        ₹{totalSpend.toLocaleString()} spent of ₹{totalBudget.toLocaleString()}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalLeads}</div>
                    <p className="text-xs text-muted-foreground">
                        {leads.filter(l => l.status === 'Attended').length} attended
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cost Per Lead</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{costPerLead.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        Target: ₹500.00
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{event.analytics?.views || 0}</div>
                    <div className="flex flex-col gap-1 mt-1">
                        <p className="text-xs text-muted-foreground">
                            {event.analytics?.clicks || 0} total clicks
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {event.analytics?.uniqueClicks || 0} unique clicks
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
