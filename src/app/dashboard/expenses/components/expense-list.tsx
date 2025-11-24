'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Expense } from "@/lib/data";

export function ExpenseList({ expenses }: { expenses: Expense[] }) {
    return (
        <div className="rounded-md border bg-background">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No expenses recorded.
                            </TableCell>
                        </TableRow>
                    ) : (
                        expenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell className="font-medium">{expense.description}</TableCell>
                                <TableCell>{expense.eventName}</TableCell>
                                <TableCell>{expense.category}</TableCell>
                                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant={expense.status === 'Approved' ? 'default' : expense.status === 'Rejected' ? 'destructive' : 'secondary'}>
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
