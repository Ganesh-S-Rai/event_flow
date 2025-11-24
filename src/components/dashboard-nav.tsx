'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Wand2,
  Settings,
  GalleryVertical,
  Receipt,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/events', icon: Calendar, label: 'Events' },
  { href: '/dashboard/expenses', icon: Receipt, label: 'Expenses' },
  { href: '/dashboard/leads', icon: Users, label: 'Leads' },
  { href: '/dashboard/templates', icon: GalleryVertical, label: 'Templates' },
  { href: '/dashboard/tools', icon: Wand2, label: 'Tools' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function DashboardNav() {
  const pathname = usePathname();

  const isToolsActive = pathname.startsWith('/dashboard/tools');
  const isTemplatesActive = pathname.startsWith('/dashboard/templates');
  const isSettingsActive = pathname.startsWith('/dashboard/settings');

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const isActive =
          (item.href === '/dashboard/tools' && isToolsActive) ||
          (item.href === '/dashboard/templates' && isTemplatesActive) ||
          (item.href === '/dashboard/settings' && isSettingsActive) ||
          pathname === item.href;

        return (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              className={`transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary font-medium border-r-2 border-primary rounded-none' : 'hover:bg-muted/50'}`}
              tooltip={{
                children: item.label,
                side: 'right',
                align: 'center',
              }}
            >
              <Link href={item.href} className="flex items-center gap-3 px-3 py-2">
                <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
