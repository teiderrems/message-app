import { Button } from "@/components/ui/button";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { MoreVertical, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/use-local-storage";
import { type User } from "@/generated/prisma";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  IconUserCircle,
  IconCreditCard,
  IconNotification,
  IconLogout,
} from "@tabler/icons-react";
import { trpc } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";

export function ChatHeader() {
  const { getValue, clearValue } = useLocalStorage();
  const [user, setUser] = useState<Partial<User> & { avatar: string } | null>(
    getValue("user")
  );

  const navigate = useNavigate();
  if (!user || !user.id) {
    return null;
  }
  const { data: userStatus, isFetching, refetch } = useQuery(
    trpc.user.getUserStatus.queryOptions({ userId: user.id })
  );
  useEffect(() => {
    setUser(getValue("user"));
    if (!userStatus) {
     refetch().catch(console.error);
    }
  }, [isFetching, userStatus]);

  return (
    <header className="bg-green-600 text-white px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-lg font-semibold">{user.avatar}</span>
        </div>
        <div>
          <h2 className="font-semibold">John Doe</h2>
          <p className="text-green-100 text-xs flex items-center">
            { userStatus ? <span className="w-2 h-2 bg-green-300 rounded-full mr-1"></span> : <span className="w-2 h-2 bg-black rounded-full mr-1"></span>}
            {userStatus ? "En ligne" : "Hors ligne"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          asChild
          size="icon"
          className="hover:cursor-pointer"
        >
          <Search className="w-5 h-5 cursor-pointer hover:text-green-200 transition" />
        </Button>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  asChild
                  size="icon"
                  className="hover:cursor-pointer"
                >
                  <MoreVertical className="w-5 h-5 cursor-pointer hover:text-green-200 transition" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={"bottom"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-full border p-2">
                      <AvatarImage src={user.avatar} alt={"avatar"} />
                      {!user.avatar.includes("http") && (
                        <AvatarFallback className="rounded-full">
                          {user.avatar}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {user?.email}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="hover:cursor-pointer">
                    <IconUserCircle />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:cursor-pointer">
                    <IconCreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:cursor-pointer">
                    <IconNotification />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    clearValue("user");
                    setUser(null);
                    navigate("/login");
                  }}
                  className="hover:cursor-pointer"
                >
                  <IconLogout />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </header>
  );
}
