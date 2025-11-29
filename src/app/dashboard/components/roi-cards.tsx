'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Wallet, Users } from 'lucide-react';
import type { Event, Registration, Expense } from '@/lib/data';

interface RoiCardsProps {
    events: Event[];
    registrations: Registration[];
    expenses: Expense[];
}

export function RoiCards({ events, registrations, expenses }: RoiCardsProps) {
    // Calculate Metrics
    const totalBudget = events.reduce((sum, event) => sum + (event.budget || 0), 0);
    const totalSpend = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalRegistrations = registrations.length;

    const costPerRegistration = totalRegistrations > 0 ? totalSpend / totalRegistrations : 0;
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
                    <CardTitle className="text-sm font-medium">Cost Per Registration</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{costPerRegistration.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        Based on {totalRegistrations} total registrations
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalRegistrations}</div>
                    <p className="text-xs text-muted-foreground">
                        Across all active events
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
