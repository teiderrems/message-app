import type { ChatItemDetailDto } from "@/types";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import socket from "@/util";
import { StatusMessage } from "./message-bubble";
import { Button } from "./ui/button";
import { ChevronDown, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem } from "./ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

interface Props {
  chat: ChatItemDetailDto;
  isActive: boolean;
  userId: number;
  refetch: () => Promise<void>;
}

function ChatItem(props: Props) {
  const { chat, isActive, userId, refetch } = props;
  const navigate = useNavigate();

  const [isTyping, setIsTyping] = useState(false);

  function formatChatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();

    // Normaliser pour ne comparer que les jours
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const messageDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    // Aujourd'hui -> heure (HH:mm)
    if (messageDay.getTime() === today.getTime()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Hier
    if (messageDay.getTime() === yesterday.getTime()) {
      return "Yesterday";
    }

    // Même semaine (depuis dimanche)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // dimanche de cette semaine
    if (messageDay >= weekStart) {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    }

    // Sinon -> date complète
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const { mutateAsync } = useMutation(
    trpc.chat.deactivatedChat.mutationOptions()
  );

  useEffect(() => {
    socket.on(
      "user_typing_chat",
      ({
        chatId,
        isTyping,
        userId: user_id,
      }: {
        chatId: number;
        isTyping: boolean;
        userId: number;
      }) => {
        if (chat.id === chatId && userId !== user_id) {
          setIsTyping(isTyping);
        }
      }
    );

    return () => {
      socket.off("user_typing_chat");
    };
  }, [chat.id, userId]);

  const isMobile = useIsMobile();

  return (
    <div
      onClick={() => navigate(`/chats/${chat.id}`,{replace:true})}
      key={chat.id}
      className={`h-14 hover:border hover:bg-gray-200 text-black hover:border-gray-300 hover:cursor-pointer rounded-md flex px-1 py-3 items-center space-x-1 ${
        isActive ? "bg-gray-200" : ""
      }`}
    >
      <div className="w-10 min-w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
        <span className="text-lg font-semibold">{chat.avatar}</span>
      </div>
      <div className="flex flex-col text-sm grow">
        <div className="flex justify-between w-full">
          <span className="font-bold self-start">{chat.title}</span>
          <span className="text-gray-400">
            {formatChatDate(chat.createdAt)}
          </span>
        </div>
        <div className="flex items-center max-w-50">
          {isTyping ? (
            <span className="text-xs text-gray-300 ml-1">
              Est en train d'écrire...
            </span>
          ) : (
            <div className="flex space-x-1 z-0 truncate w-full relative items-center">
              <span>
                <StatusMessage isViewed={chat.isRead || false} />
              </span>
              <span className="text-gray-700 truncate flex-1">
                {chat.description}
              </span>
              <SidebarMenu className="absolute right-0 -translate-y-1.5">
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant={"link"}
                        onClick={(e) => e.stopPropagation()}
                        asChild
                        size="icon"
                        className={`hover:cursor-pointer hover:border-0 ${
                          isMobile ? "text-white" : "text-gray-700"
                        } absolute right-0 opacity-0 translate-x-1 hover:opacity-100 transition-all duration-200`}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg shadow-lg"
                      side={isMobile ? "bottom" : "right"}
                      align="end"
                      sideOffset={4}
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={async (e) => {
                            e.stopPropagation();
                            await mutateAsync({ chatId: chat.id, userId });
                            await refetch();
                          }}
                          className="hover:cursor-pointer focus:bg-red-50 focus:text-red-600"
                        >
                          <Trash2 className="w-5 h-5 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatItem;
