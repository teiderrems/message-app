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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  IconUserCircle,
  IconCreditCard,
  IconNotification,
  IconLogout,
} from "@tabler/icons-react";
import { DestinatorDto } from "@/types";
import socket from "@/util";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

interface ChatHeaderProps {
  destinator?: DestinatorDto;
  userId: number;
  chatId?: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function ChatHeader({
  destinator,
  userId,
  chatId,
  setOpen,
}: ChatHeaderProps) {
  if (!destinator || !destinator.id) {
    return null;
  }
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);

  const { data: userStatus, isFetching } = useQuery(
    trpc.user.getUserStatus.queryOptions(
      { userId: destinator.id },
      {
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        retry: 3,
      }
    )
  );

  useEffect(() => {
    if (userStatus) {
      setIsOnline(userStatus);
    }
  }, [userStatus, isFetching]);

  useEffect(() => {
    socket.on(
      "user_typing",
      ({
        isTyping,
        chatId: currentChatId,
      }: {
        isTyping: boolean;
        chatId: number;
      }) => {
        if (currentChatId === chatId) {
          setShowTypingIndicator(true);
        }
        setIsTyping(isTyping);
      }
    );

    return () => {
      socket.off("user_typing");
    };
  }, [isOnline, isTyping, userId, chatId, showTypingIndicator]);

  return (
    <header className="bg-green-600 text-white px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-lg font-semibold">{destinator?.avatar}</span>
        </div>
        <div>
          <h2 className="font-semibold">
            {destinator?.username || destinator?.email}
          </h2>
          <p className="text-green-100 text-xs flex items-center">
            {isTyping && showTypingIndicator ? (
              <span className="text-xs text-gray-300 ml-1">
                Est en train d'écrire...
              </span>
            ) : isOnline ? (
              "En ligne"
            ) : (
              "Hors ligne"
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-4">
        <Button
          variant="ghost"
          asChild
          size="icon"
          className="hover:cursor-pointer"
          onClick={() => {
            setOpen((state) => !state);
          }}
        >
          <Search className="w-5 h-5 cursor-pointer transition" />
        </Button>

        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="self-end">
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
                      <AvatarImage
                        src={destinator?.avatar || ""}
                        alt={"avatar"}
                      />
                      {destinator &&
                        destinator.avatar &&
                        !destinator.avatar.includes("http") && (
                          <AvatarFallback className="rounded-full">
                            {destinator.avatar}
                          </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {destinator?.email}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {destinator?.email}
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
                <DropdownMenuItem className="hover:cursor-pointer">
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
