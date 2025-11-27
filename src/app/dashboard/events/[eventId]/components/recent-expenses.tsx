'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Expense } from '@/lib/data';

interface RecentExpensesProps {
    expenses: Expense[];
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
    // Sort by date desc
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    const statusVariantMap: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
        Approved: 'default',
        Pending: 'secondary',
        Rejected: 'destructive',
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedExpenses.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                No expenses recorded.
                            </TableCell>
                        </TableRow>
                    ) : (
                        sortedExpenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell className="font-medium">{expense.description}</TableCell>
                                <TableCell>{expense.category}</TableCell>
                                <TableCell>
                                    <Badge variant={statusVariantMap[expense.status] || 'outline'}>
                                        {expense.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">₹{expense.amount.toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
