import type { ChatItemDetailDto } from "@/types";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import socket from "@/util";
import { StatusMessage } from "./message-bubble";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  chat: ChatItemDetailDto;
  isActive: boolean;
  userId: number;
  onDelete?: (chatId: number) => void;
}

function ChatItem(props: Props) {
  const { chat, isActive, userId } = props;
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
  }, [userId, isTyping]);

  // function handleDelete(): void {
  //   if (onDelete) {
  //     onDelete(chat.id);
  //   }
  // }
  return (
    <div
      onClick={() => navigate(`/chats/${chat.id}`)}
      key={chat.id}
      className={`h-14 hover:border text-black hover:border-gray-300 hover:cursor-pointer rounded-md flex px-1 py-3 items-center space-x-1 ${
        isActive ? "bg-gray-200" : ""
      }`}
    >
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
        <span className="text-lg font-semibold">{chat.avatar}</span>
      </div>
      <div className="flex flex-col text-sm grow">
        <span className="flex justify-between">
          <span className="font-bold self-start">{chat.title}</span>
          <span className="text-gray-400">
            {formatChatDate(chat.createdAt)}
          </span>
        </span>
        <div className=" items-center relative">
          {isTyping ? (
            <span className="text-xs text-gray-300 ml-1">
              Est en train d'écrire...
            </span>
          ) : (
            <span className="flex space-x-1 items-center">
              <span>
                <StatusMessage isViewed={chat.isRead || false} />
              </span>
              <span className="truncate self-start">{chat.description}</span>
            </span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="bottom-0 right-0 absolute opacity-0 group-hover:opacity-100 transition"
                asChild
                variant={"ghost"}
                size={"icon"}
              >
                <ChevronDown className="!size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default ChatItem;
