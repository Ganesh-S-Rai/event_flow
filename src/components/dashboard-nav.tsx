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
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/events', icon: Calendar, label: 'Events' },
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
              tooltip={{
                children: item.label,
                side: 'right',
                align: 'center',
              }}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
