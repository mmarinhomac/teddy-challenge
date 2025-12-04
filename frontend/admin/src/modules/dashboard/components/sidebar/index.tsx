import * as React from 'react';
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';

import { NavDocuments } from './nav-documents';
import { NavMain } from './nav-main';
import { NavSecondary } from './nav-secondary';
import { NavUser } from './nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shadcn/components/sidebar';
import { Logo } from '@/shared/components/Logo';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Lifecycle',
      url: '/lifecycle',
      icon: IconListDetails,
    },
    {
      title: 'Analytics',
      url: '/analytics',
      icon: IconChartBar,
    },
    {
      title: 'Projects',
      url: '/projects',
      icon: IconFolder,
    },
    {
      title: 'Team',
      url: '/team',
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: 'Capture',
      icon: IconCamera,
      isActive: true,
      url: '/capture',
      items: [
        {
          title: 'Active Proposals',
          url: '/capture/active',
        },
        {
          title: 'Archived',
          url: '/capture/archived',
        },
      ],
    },
    {
      title: 'Proposal',
      icon: IconFileDescription,
      url: '/proposal',
      items: [
        {
          title: 'Active Proposals',
          url: '/proposal/active',
        },
        {
          title: 'Archived',
          url: '/proposal/archived',
        },
      ],
    },
    {
      title: 'Prompts',
      icon: IconFileAi,
      url: '/prompts',
      items: [
        {
          title: 'Active Proposals',
          url: '/prompts/active',
        },
        {
          title: 'Archived',
          url: '/prompts/archived',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '/settings',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '/support',
      icon: IconHelp,
    },
    {
      title: 'Search',
      url: '/search',
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: 'Data Library',
      url: '/data-library',
      icon: IconDatabase,
    },
    {
      name: 'Reports',
      url: '/reports',
      icon: IconReport,
    },
    {
      name: 'Word Assistant',
      url: '/word-assistant',
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/" aria-label="Ir para a página inicial">
                <div className="flex h-8 w-fit">
                  <Logo />
                </div>
                <span className="text-base font-semibold">Teddy Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
