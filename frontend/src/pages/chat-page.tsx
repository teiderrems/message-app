import ChatForm from "@/components/chat-form";
import { ChatHeader } from "@/components/chat-header";
import { useEffect, useRef, useState } from "react";
import useLocalStorage from "@/hooks/use-local-storage";
import { useParams } from "react-router"; // ✅ Vérifie que c'est bien react-router-dom
import MessageBubble from "@/components/message-bubble";
import { Attachment, Message } from "@/generated/prisma";
import { ChatDetailDto, DestinatorDto, MessageDetailDto } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import socket from "@/util"; // ✅ Assure-toi que c’est bien l’instance socket
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@/components/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const ChatPage = () => {
  const { id } = useParams<{ id: string }>(); // ✅ Typage correct
  const chatId = Number(id);

  const [userId, setUserId] = useState<number>(1);
  const { data, refetch, isFetched } = useQuery(
    trpc.chat.getChatById.queryOptions(
      { id: chatId, userId },
      {
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        retry: 3,
      }
    )
  );

  const [messages, setMessages] = useState<MessageDetailDto[]>([]);
  const [searchMessages, setSearchMessages] = useState<MessageDetailDto[]>([]);
  const [highlightedMessageId, setHighlightedMessageId] = useState<number>();

  const [messageToReply, setMessageToReply] = useState<
    MessageDetailDto | undefined
  >();

  const { getValue } = useLocalStorage();

  const [showTypingIndicator, setShowTypingIndicator] = useState(false);

  const getReplyMessage = (messageId: number | undefined | null) => {
    if (!messageId) {
      return undefined;
    }
    return messages.find((m) => m.id === messageId);
  };

  const navigateToMessage = (messageId: number) => {
    // Utilisation de l'ID comme ID de tag HTML
    if (open) {
      setOpen(false);
    }
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Ajout d'une animation de surbrillance
      element.classList.add(
        "animate-pulse",
        "bg-gray-150",
        "border-l-4",
        "border-gray-200"
      );
      setHighlightedMessageId(messageId);

      // Retirer la surbrillance après 2 secondes
      setTimeout(() => {
        const el = document.getElementById(`message-${messageId}`);
        if (el) {
          el.classList.remove(
            "animate-pulse",
            "bg-gray-150",
            "border-l-4",
            "border-gray-200"
          );
        }
        if (highlightedMessageId === messageId) {
          setHighlightedMessageId(undefined);
        }
      }, 2000);
    }
  };

  useEffect(() => {
    const user = getValue("user");
    const currentUserId = user?.id || 1;
    setUserId(currentUserId);

    // ✅ Rejoindre le chat uniquement une fois que userId et chatId sont prêts
    if (chatId && currentUserId) {
      socket.emit("join_chat", { userId: currentUserId, chatId });
    }

    // ✅ Charger les messages initiaux depuis le backend
    if (isFetched && data) {
      setMessages(data.messages);
    }

    // 🔁 Écouter les nouveaux messages
    const onChatMessage = ({ message }: { message: MessageDetailDto }) => {
      setMessages((prev) => [...prev, message]);

      // Marquer comme lu après un court délai

      if (currentUserId !== message.author.id) {
        socket.emit("read_message", {
          messageId: message.id,
          from: currentUserId,
          chatId,
        });
      }
    };

    // 🔁 Écouter les mises à jour de statut (lu/non lu)
    const onMessageStatus = ({
      messageId,
      isViewed,
    }: {
      messageId: number;
      isViewed: boolean;
    }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, isViewed } : m))
      );
    };

    socket.on(
      "user_typing_indicator",
      ({
        isTyping,
        chatId: currentChatId,
      }: {
        isTyping: boolean;
        chatId: number;
      }) => {
        if (currentChatId === chatId) {
          setShowTypingIndicator(isTyping);
        }
      }
    );

    // 📢 Ajouter les listeners
    socket.on("chat_message", onChatMessage);
    socket.on("message_status", onMessageStatus);

    // 🧹 Nettoyage : retirer les listeners et quitter le salon
    return () => {
      socket.off("chat_message", onChatMessage);
      socket.off("message_status", onMessageStatus);
      // Optionnel : informer le backend que l’utilisateur quitte (si tu le gères)
      // socket.emit("leave_chat", { userId: currentUserId, chatId });
      socket.off("user_typing_indicator");
    };
  }, [chatId, isFetched]); // ✅ Dépendances correctes

  const getFileData = async (files?: File[] | null) => {
    if (!files || files.length === 0) return;

    const fileReaders = files.map((file): Promise<Partial<Attachment>> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result;
          if (arrayBuffer && typeof arrayBuffer !== "string") {
            resolve({
              filename: file.name,
              data: new Uint8Array(arrayBuffer),
              mimetype: file.type,
            });
          }
        };
        reader.readAsArrayBuffer(file);
      });
    });
    return await Promise.all(fileReaders);
  };

  const sendMessage = async (input: string, files?: File[] | null) => {
    if (!input.trim() && !files) return;

    const attachments: Partial<Attachment>[] = [];

    if (files) {
      try {
        const filesData = await getFileData(files);
        filesData?.forEach((fileData) => {
          attachments.push(fileData);
        });
        // Envoyer le message avec les données des fichiers
      } catch (error) {
        console.error("Error reading files:", error);
      }
    }

    const message: Partial<Message> = {
      content: input.trim(),
      chatId,
      authorId: userId,
      replyMessageId: messageToReply ? messageToReply.id : null,
    };
    setMessageToReply(undefined);
    socket.emit("chat_message", { message, attachments }); // Envoyer les données des fichiers avec le message
  };

  const { mutateAsync: deleteMessage } = useMutation(
    trpc.message.deleteMessage.mutationOptions()
  );

  const messageContentRef = useRef<HTMLDivElement | null>(null);
  const handleSearch = (message: string) => {
    setSearchMessages(messages.filter((m) => m.content?.includes(message)));
  };

  useEffect(() => {
    if (messageContentRef.current) {
      messageContentRef.current.scrollTop =
        messageContentRef.current.scrollHeight;
    }
    return () => {
      const message = messages[messages.length - 1];
      if (message && message.content) {
        socket.emit("update_description", { chatId, content: message.content });
      }
    };
  }, [messages]);

  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <ChatHeader
        userId={userId}
        chatId={chatId}
        setOpen={setOpen}
        destinator={
          (data as ChatDetailDto | undefined)?.destinator as DestinatorDto
        }
      />

      {/* Messages Container */}
      <div
        ref={messageContentRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-green-50 to-white"
      >
        {messages.map((message) => (
          <MessageBubble
            replyMessage={getReplyMessage(message.replyMessageId)}
            key={message.id}
            onReply={(message) => setMessageToReply(message)}
            userId={userId}
            navigateToMessage={navigateToMessage}
            message={message}
            onDelete={async () => {
              await deleteMessage({ id: message.id });
              setMessages((prev) => prev.filter((m) => m.id !== message.id));
              await refetch();
            }}
          />
        ))}
        {/* Typing indicator */}
        {showTypingIndicator && (
          <div className="flex justify-start items-center">
            <div className="px-4 py-2 flex items-center space-x-1 rounded-l-none h-10 rounded-b-md bg-gray-200 rounded-r-md rounded-t-md">
              {/* <div className="flex items-center space-x-1"> */}
              <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-black rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-black rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            {/* </div> */}
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatForm
        userId={userId}
        messageToReply={messageToReply}
        setMessageToReply={setMessageToReply}
        destinatorId={data?.destinator.id}
        chatId={chatId}
        onSendMessage={sendMessage}
      />
      <Sheet
        open={open}
        onOpenChange={() => {
          setSearchMessages([]);
          setOpen((state) => !state);
        }}
      >
        <SheetContent>
          <SheetHeader>
            <DialogTitle>Search message here</DialogTitle>
            <div className="flex border mt-5 border-white rounded-full bg-gray-200 hover:border-gray-500 px-2 items-center">
              <Button
                asChild
                variant={"ghost"}
                size={"icon"}
                className="text-gray-600"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Input
                type="search"
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.value.length > 1) {
                    handleSearch(e.target.value);
                  }
                }}
                placeholder="Search message here"
                className="border-none placeholder:text-sm focus-visible:border-0 placeholder:text-gray-400 placeholder:italic"
              />
            </div>
          </SheetHeader>
          <div className="flex flex-col overflow-y-auto">
            {searchMessages.map((sm) => (
              <div
                key={sm.id}
                onClick={() => navigateToMessage(sm.id)}
                className="flex items-center space-x-3 mx-3 px-2 hover:cursor-pointer hover:bg-gray-300 rounded-md"
              >
                <div className="w-10 h-10 min-w-10 bg-gray-700 text-white rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold">
                    {data?.destinator?.avatar}
                  </span>
                </div>
                <div className="flex flex-col truncate">
                  <h2 className="font-semibold">
                    {data?.destinator?.username || data?.destinator?.email}
                  </h2>
                  <span className="truncate">{sm.content}</span>
                </div>
              </div>
            ))}
          </div>
          <SheetFooter>
            <Separator />
            @2025
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatPage;
