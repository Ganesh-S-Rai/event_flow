'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useTransition } from "react";
import { deleteEventAction } from "../actions";
import { useToast } from "@/hooks/use-toast";

interface DeleteEventDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    event: { id: string; name: string };
}

export function DeleteEventDialog({ open, onOpenChange, event }: DeleteEventDialogProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleDelete = async () => {
        startTransition(async () => {
            try {
                await deleteEventAction(event.id);
                toast({
                    title: "Event deleted",
                    description: `${event.name} has been successfully deleted.`,
                });
                onOpenChange(false);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to delete event. Please try again.",
                });
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the event
                        To confirm, type <span className="font-bold text-foreground">delete my event</span> below:
                        <span className="font-semibold text-foreground"> &quot;{event.name}&quot; </span>
                        and remove all associated data including leads and expenses.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
