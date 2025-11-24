'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, Loader2, ScanLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createExpenseAction, analyzeReceiptAction } from '../actions';
import type { Event } from '@/lib/data';

export function AddExpenseDialog({ events }: { events: Event[] }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        eventId: '',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Other',
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAnalyzing(true);
        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const base64 = event.target?.result as string;
                const result = await analyzeReceiptAction(base64);

                if (result.success && result.data) {
                    setFormData(prev => ({
                        ...prev,
                        amount: result.data.amount ? result.data.amount.toString() : prev.amount,
                        date: result.data.date || prev.date,
                        description: result.data.vendor || result.data.description || prev.description,
                        category: result.data.category || prev.category,
                    }));
                    toast({ title: "Receipt Analyzed", description: "Details extracted successfully." });
                } else {
                    toast({ variant: "destructive", title: "Analysis Failed", description: "Could not extract details." });
                }
                setAnalyzing(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error(error);
            setAnalyzing(false);
            toast({ variant: "destructive", title: "Error", description: "Failed to process file." });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const eventName = events.find(ev => ev.id === formData.eventId)?.name || 'Unknown Event';

        try {
            await createExpenseAction({
                eventId: formData.eventId,
                eventName,
                description: formData.description,
                amount: parseFloat(formData.amount),
                date: formData.date,
                category: formData.category as any,
                status: 'Pending'
            });
            toast({ title: "Success", description: "Expense added successfully." });
            setOpen(false);
            // Reset form
            setFormData({
                eventId: '',
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                category: 'Other',
            });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to add expense." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Expense
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                    <DialogDescription>
                        Manually enter details or upload a receipt to auto-fill.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="manual" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                        <TabsTrigger value="upload">Upload Receipt</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4 py-4">
                        <div
                            className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center gap-2"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {analyzing ? (
                                <>
                                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                    <p className="text-sm text-muted-foreground">Analyzing receipt with AI...</p>
                                </>
                            ) : (
                                <>
                                    <ScanLine className="h-10 w-10 text-muted-foreground" />
                                    <p className="text-sm font-medium">Click to upload receipt</p>
                                    <p className="text-xs text-muted-foreground">Supports JPG, PNG, PDF</p>
                                </>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*,application/pdf"
                                onChange={handleFileChange}
                            />
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                            After upload, switch to "Manual Entry" to review and save.
                        </p>
                    </TabsContent>

                    <TabsContent value="manual">
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="event">Event</Label>
                                <Select value={formData.eventId} onValueChange={(val) => setFormData({ ...formData, eventId: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select event" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {events.map(event => (
                                            <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="e.g. Catering Deposit" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="amount">Amount (₹)</Label>
                                    <Input id="amount" type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Venue">Venue</SelectItem>
                                        <SelectItem value="Catering">Catering</SelectItem>
                                        <SelectItem value="Marketing">Marketing</SelectItem>
                                        <SelectItem value="Travel">Travel</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Save Expense
                                </Button>
                            </div>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
