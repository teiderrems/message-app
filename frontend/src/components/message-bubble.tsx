import { MessageDetailDto } from "@/types";
import {
  CheckCheck,
  Trash2,
  Reply,
  Copy,
  ChevronDown
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem } from "./ui/sidebar";
import { useEffect } from "react";

const MessageBubble = ({
  message,
  userId,
  onDelete,
  onReply,
}: {
  message: MessageDetailDto;
  userId: number;
  onDelete?: (messageId: number) => void;
  onReply?: (message: MessageDetailDto) => void;
}) => {
  const isMe = message.author.id === userId;

  // Format date to display only time (HH:MM)
  const formatTime = (dateString: string) => {
    return dateString.substring(0, 5);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(message.id);
  };

  const handleReply = () => {
    if (onReply) onReply(message);
  };

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
    }
  };

  useEffect(()=>{
    // Handle attachment changes
    console.log(message.attachments);
  },[message.attachments])

  return (
    <div
      className={`flex ${
        isMe ? "justify-end" : "justify-start"
      } mb-3 relative group`}
    >
      <div className="flex flex-col max-w-xs lg:max-w-md">
        {/* Attachments - display if they exist */}
        {message.attachments && message.attachments.length > 0 && (
          <div
            className={`mt-1 flex flex-wrap gap-1 ${
              isMe ? "justify-end" : "justify-start"
            }`}
          >
            {message.attachments.map((attachment, index) => (
              <img
                key={index}
                src={attachment}
                alt="Pièce jointe"
                className="max-w-full max-h-96 object-contain rounded-lg border-2 border-white shadow-sm"
              />
            ))}
          </div>
        )}
        {/* Message content */}
                  <div
            className={`px-4 py-2 rounded-md relative ${
              isMe
                ? "bg-green-500 text-white rounded-tr-none"
                : "bg-gray-200 text-gray-800 rounded-tl-none"
            }`}
          >
            {/* Dropdown menu */}
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      asChild
                      size="icon"
                      className="hover:cursor-pointer absolute right-0 opacity-0 group-hover:opacity-100 transition"
                    >
                      <ChevronDown className="w-5 h-5 cursor-pointer hover:text-green-200 transition" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    side={isMe ? "bottom" : "top"}
                    align={isMe ? "end" : "start"}
                    sideOffset={4}
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={handleReply} className="hover:cursor-pointer">
                        <Reply className="w-5 h-5" />
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleCopy} className="hover:cursor-pointer">
                        <Copy className="w-5 h-5" />
                        Copy
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDelete} className="hover:cursor-pointer">
                        <Trash2 className="w-5 h-5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>

            <p className={`text-pretty leading-relaxed ${message.content?.length===0?"p-3":"pr-8"}`}>{message.content || " "}</p>
          </div>
        

        {/* Timestamp and status */}
        <div
          className={`flex items-center mt-1 ${
            isMe ? "justify-end space-x-1" : "justify-start space-x-2"
          }`}
        >
          <span
            className={`text-xs ${isMe ? "text-green-400" : "text-gray-500"}`}
          >
            {formatTime(message.createdAt)}
          </span>
          {isMe &&
            (message.isViewed ? (
              <CheckCheck className="w-3 h-3 text-blue-300" />
            ) : (
              <CheckCheck className="w-3 h-3" />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
