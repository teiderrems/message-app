import * as React from "react"
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
import { useEffect, useState } from "react"
import type{ User } from "@/generated/prisma"
import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"
import socket from "@/util"
import { MessageSquareMoreIcon } from "lucide-react"
import { NavLink } from "react-router"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { getValue } = useLocalStorage();
  const [user, _] = useState<Partial<User>&{avatar:string}>(getValue("user"));

  const { data: chats,isFetching,refetch } = useQuery(trpc.chat.getChatsByUserId.queryOptions({userId:user?.id||1},{
      refetchOnMount:true,
      refetchOnReconnect:true,
      refetchOnWindowFocus:true,
      retry:3
    }));

  useEffect(()=>{
    socket.on('update_description',async({})=>{
      await refetch();
    })

  },[isFetching])


  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="flex items-center justify-between p-4 border-b border-gray-200 bg-green-600 text-white">
         <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <NavLink to="/chats">
                <MessageSquareMoreIcon className="!size-5" />
                <span className="text-base font-semibold ">Message-App</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> 
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={chats} userId={user.id!} refetch={refetch} />
        {/* Nav Groups */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  )
}
