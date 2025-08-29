import { MessageDetailDto } from "@/types";
import { CheckCheck, Trash2, Reply, Copy, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem } from "./ui/sidebar";
import ImageDisplay from "./image-viewer";
import AudioViewer from "./audio-viewed";
import DocumentViewer from "./document-viewer";
import { Fragment } from "react/jsx-runtime";

const MessageBubble = ({
  message,
  userId,
  onDelete,
  onReply,
  replyMessage,
  navigateToMessage,
}: {
  message: MessageDetailDto;
  replyMessage: MessageDetailDto | undefined;
  userId: number;
  onDelete?: (messageId: number) => void;
  navigateToMessage: (messageId: number) => void;
  onReply?: (message: MessageDetailDto) => void;
}) => {
  const isMe = message.author.id === userId;

  // Format date to display only time (HH:MM)
  const formatTime = (dateString: string) => {
    return dateString.split(" ")[1]?.substring(0, 5);
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

  const getComponent = (attachment: string) => {
    const array = attachment.split("?");
    if (array.length > 1) {
      if (array[1]?.includes("image")) {
        return <ImageDisplay initialImageUrl={attachment} />;
      } else if (array[1]?.includes("audio") || array[1]?.includes("video")) {
        return <AudioViewer src={attachment} />;
      }
      return (
        <DocumentViewer
          url={attachment}
          name={`attachment-${Date.now()}.${array[1]?.split("/")[1]}`}
        />
      );
    }
    return null;
  };

  return (
    <div
      id={`message-${message.id}`}
      className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3 group`}
    >
      <div className="flex flex-col max-w-sm lg:max-w-lg">
        {/* Attachments - display if they exist */}
        {message.attachments && message.attachments.length > 0 && (
          <div
            className={`mt-1 flex flex-wrap gap-1 relative ${
              isMe ? "justify-end" : "justify-start"
            }`}
          >
            {/* Dropdown menu */}
            {(message.content==='audio' || message.content?.length===0) && <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant={"link"}
                      asChild
                      size="icon"
                      className={`hover:cursor-pointer hover:border-0 ${
                        isMe ? "text-white" : "text-gray-700"
                      } absolute right-3 top-2 opacity-0 group-hover:opacity-100 transition`}
                    >
                      <ChevronDown className="w-5 h-5 cursor-pointer transition" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    side={isMe ? "bottom" : "top"}
                    align={isMe ? "end" : "start"}
                    sideOffset={4}
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={handleReply}
                        className="hover:cursor-pointer"
                      >
                        <Reply className="w-5 h-5" />
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleCopy}
                        className="hover:cursor-pointer"
                      >
                        <Copy className="w-5 h-5" />
                        Copy
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleDelete}
                        className="hover:cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>}

            {message.attachments.map((attachment, index) => (
              <Fragment key={index}>{getComponent(attachment)}</Fragment>
            ))}
          </div>
        )}
        {/* Message content */}
        {message.content !== "audio" && message.content?.length!==0 && (
          <div
            className={`px-1 py-2 min-w-12 max-w-full z-0 rounded-md relative ${
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
                      type="button"
                      variant={"link"}
                      asChild
                      size="icon"
                      className={`hover:cursor-pointer hover:border-0 ${
                        isMe ? "text-white" : "text-gray-700"
                      } absolute right-0 opacity-0 -translate-y-2 group-hover:opacity-100 transition`}
                    >
                      <ChevronDown className="w-5 h-5 cursor-pointer transition" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    side={isMe ? "bottom" : "top"}
                    align={isMe ? "end" : "start"}
                    sideOffset={4}
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={handleReply}
                        className="hover:cursor-pointer"
                      >
                        <Reply className="w-5 h-5" />
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleCopy}
                        className="hover:cursor-pointer"
                      >
                        <Copy className="w-5 h-5" />
                        Copy
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleDelete}
                        className="hover:cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
            {replyMessage && (
              <div
                onClick={() => navigateToMessage(replyMessage.id)}
                className={`border-l-4 pl-1 mt-2 mb-1 hover:cursor-pointer bg-white rounded-sm ${
                  replyMessage.author.id === userId
                    ? "border-green-500"
                    : "border-blue-500"
                }`}
              >
                <p
                  className={`text-xs font-semibold ${
                    replyMessage.author.id === userId
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                >
                  {replyMessage.author.id === userId
                    ? "Vous"
                    : replyMessage.author.email || replyMessage.author.username}
                </p>
                <p className="text-xs text-gray-700 truncate">
                  {replyMessage.content}
                </p>
              </div>
            )}
            <p className={`text-wrap leading-relaxed p-1`}>
              {message.content || " "}
            </p>
            {/* Timestamp and status */}
            <div className={`flex items-center mt-1 justify-end space-x-1`}>
              <span
                className={`text-xs ${
                  isMe ? "text-green-400" : "text-gray-500"
                }`}
              >
                {formatTime(message.createdAt)}
              </span>
              {isMe && <StatusMessage isViewed={message.isViewed} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;

export const StatusMessage = ({ isViewed }: { isViewed: boolean }) => {
  return (
    <>
      {isViewed ? (
        <CheckCheck className="w-3 h-3 text-blue-300" />
      ) : (
        <CheckCheck className="w-3 h-3" />
      )}
    </>
  );
};
