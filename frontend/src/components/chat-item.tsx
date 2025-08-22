import type { HistoryChatItem } from "@/types";
import { useNavigate } from "react-router";
import { Avatar, AvatarImage } from "./ui/avatar";

interface Props {
  chat: HistoryChatItem;
  isActive: boolean;
}

function ChatItem(props: Props) {
  const { chat, isActive } = props;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/chats/${chat.id}`)}
      key={chat.description}
      className={`h-14 hover:border text-black hover:border-gray-300 hover:cursor-pointer rounded-md flex px-1 py-3 items-center space-x-1 ${isActive ? "bg-gray-400" : ""}`}
    >
      <Avatar className="h-12 flex items-center justify-center w-12 rounded-full border p-2">
        <AvatarImage
          className="h-full w-full"
          src={chat.avatar}
          alt={"avatar"}
        />
        {!(chat.avatar && chat.avatar.includes("http")) && (
          <span className=" text-center text-2xl h-full w-full">
            {chat.avatar}
          </span>
        )}
      </Avatar>
      <div className="flex flex-col text-sm grow">
        <span className="truncate self-start">{chat.updatedAt}</span>
        <span className="truncate self-start">{chat.description}</span>
      </div>
    </div>
  );
}

export default ChatItem;
