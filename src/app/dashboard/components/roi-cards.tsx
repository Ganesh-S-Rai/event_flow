'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Wallet, Users } from 'lucide-react';
import type { Event, Lead, Expense } from '@/lib/data';

interface RoiCardsProps {
    events: Event[];
    leads: Lead[];
    expenses: Expense[];
}

export function RoiCards({ events, leads, expenses }: RoiCardsProps) {
    // Calculate Metrics
    const totalBudget = events.reduce((sum, event) => sum + (event.budget || 0), 0);
    const totalSpend = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalLeads = leads.length;

    const costPerLead = totalLeads > 0 ? totalSpend / totalLeads : 0;
    const budgetUtilization = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{totalBudget.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        Allocated across {events.length} events
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{totalSpend.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        {budgetUtilization.toFixed(1)}% of budget used
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cost Per Lead (CPL)</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{costPerLead.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        Based on {totalLeads} total leads
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
                        Across all active events
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
