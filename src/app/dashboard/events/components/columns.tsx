
'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/lib/data';
import Link from 'next/link';
import { deleteEventAction } from '../actions';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

const statusVariantMap: Record<Event['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Active: 'default',
  Draft: 'secondary',
  Completed: 'outline',
  Cancelled: 'destructive',
};

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const event = row.original;
      return (
        <Link
          href={`/dashboard/events/${event.id}`}
          className="font-medium hover:underline text-primary"
        >
          {row.getValue('name')}
        </Link>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status: Event['status'] = row.getValue('status');
      return <Badge variant={statusVariantMap[status]}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'registrations',
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Registrations
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('registrations') || '0');
      return <div className="text-right font-medium">{amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: 'analytics.views',
    header: 'Views',
    cell: ({ row }) => <div className="text-right">{row.original.analytics?.views || 0}</div>,
  },
  {
    accessorKey: 'analytics.clicks',
    header: 'Clicks',
    cell: ({ row }) => <div className="text-right">{row.original.analytics?.clicks || 0}</div>,
  },
];
