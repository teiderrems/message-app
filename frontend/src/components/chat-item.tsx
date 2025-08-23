import type { HistoryChatItem } from "@/types";
import { useNavigate } from "react-router";

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
      className={`h-14 hover:border text-black hover:border-gray-300 hover:cursor-pointer rounded-md flex px-1 py-3 items-center space-x-1 ${
        isActive ? "bg-gray-400" : ""
      }`}
    >
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
        <span className="text-lg font-semibold">{chat.avatar}</span>
      </div>
      <div className="flex flex-col text-sm grow">
        <span className="truncate self-start">{chat.updatedAt}</span>
        <span className="truncate self-start">{chat.description}</span>
      </div>
    </div>
  );
}

export default ChatItem;
