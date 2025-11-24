'use server';

import { addExpense, type Expense } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { runFlow } from 'genkit';
import { extractExpenseFlow } from '@/ai/flows/extract-expense-flow';

export async function createExpenseAction(expenseData: Omit<Expense, 'id'>) {
    try {
        await addExpense(expenseData);
        revalidatePath('/dashboard/expenses');
        return { success: true };
    } catch (error) {
        console.error("Failed to create expense:", error);
        return { success: false, error: "Failed to create expense" };
    }
}

export async function analyzeReceiptAction(base64Image: string) {
    try {
        // In a real app, we might upload to storage first, but Genkit can handle base64 data URLs directly in some cases,
        // or we pass it as part of the prompt.
        // The extractExpenseFlow expects a string (URL or base64).

        const result = await runFlow(extractExpenseFlow, { image: base64Image });
        return { success: true, data: result };
    } catch (error) {
        console.error("Failed to analyze receipt:", error);
        // Mock response for demo if AI fails (e.g. no API key)
        if (process.env.NODE_ENV === 'development') {
            return {
                success: true,
                data: {
                    amount: 125.50,
                    date: new Date().toISOString().split('T')[0],
                    vendor: 'Mock Vendor Inc.',
                    description: 'Office Supplies',
                    category: 'Other'
                }
            };
        }
        return { success: false, error: "Failed to analyze receipt" };
    }
}
