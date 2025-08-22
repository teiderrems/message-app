import * as React from "react"
import {
  IconInnerShadowTop,
} from "@tabler/icons-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import useLocalStorage from "@/hooks/use-local-storage"
import { useState } from "react"
import type{ User } from "@/generated/prisma"
import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc/client"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { getValue } = useLocalStorage();
  const [user, _] = useState<Partial<User>&{avatar:string}>(getValue("user"));

  const { data: chats } = useQuery(trpc.chat.getChatsByUserId.queryOptions({userId:user?.id||1}));


  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={chats} />
        {/* Nav Groups */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  )
}
