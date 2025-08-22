import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { type HistoryChatItem } from "@/types";
import ChatItem from "./chat-item";
import { useParams } from "react-router";

export function NavMain({ items }: { items: HistoryChatItem[] | undefined }) {
  const { id } = useParams();

  if (!items) {
    return null;
  }
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="flex flex-col">
          <SidebarHeader>
            <h3 className="text-sm font-medium">Recent Chats</h3>
          </SidebarHeader>
          {items.map((item) => (
            <ChatItem
              key={item.id}
              chat={item}
              isActive={item.id === Number(id)}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
