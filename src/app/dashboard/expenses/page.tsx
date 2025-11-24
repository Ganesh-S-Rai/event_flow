import { getExpenses, getEvents } from '@/lib/data';
import { ExpenseList } from './components/expense-list';
import { AddExpenseDialog } from './components/add-expense-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp } from 'lucide-react';

export default async function ExpensesPage() {
    const expenses = await getExpenses();
    const events = await getEvents();

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const pendingAmount = expenses.filter(e => e.status === 'Pending').reduce((sum, exp) => sum + exp.amount, 0);

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
                <div className="flex items-center space-x-2">
                    <AddExpenseDialog events={events} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{pendingAmount.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            <ExpenseList expenses={expenses} />
        </div>
    );
}
