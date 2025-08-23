import ChatForm from "@/components/chat-form";
import { ChatHeader } from "@/components/chat-header";
import { useEffect, useRef, useState } from "react";
import useLocalStorage from "@/hooks/use-local-storage";
import { useParams } from "react-router"; // ✅ Vérifie que c'est bien react-router-dom
import MessageBubble from "@/components/message-bubble";
import { Attachment, Message } from "@/generated/prisma";
import { MessageDetailDto } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";
import socket from "@/util"; // ✅ Assure-toi que c’est bien l’instance socket

const ChatPage = () => {
  const { id } = useParams<{ id: string }>(); // ✅ Typage correct
  const chatId = Number(id);

  const { data, isSuccess, refetch } = useQuery(trpc.chat.getChatById.queryOptions({ id: chatId }));

  const [messages, setMessages] = useState<MessageDetailDto[]>([]);
  const [userId, setUserId] = useState<number>(1);

  const { getValue } = useLocalStorage();

  useEffect(() => {
    const user = getValue("user");
    const currentUserId = user?.id || 1;
    setUserId(currentUserId);

    // ✅ Rejoindre le chat uniquement une fois que userId et chatId sont prêts
    if (chatId && currentUserId) {
      socket.emit("join_chat", { userId: currentUserId, chatId });
    }

    // ✅ Charger les messages initiaux depuis le backend
    if (isSuccess && data) {
      setMessages(data.messages);
    }

    // 🔁 Écouter les nouveaux messages
    const onChatMessage = ({ message }: { message: MessageDetailDto }) => {
      setMessages((prev) => [...prev, message]);

      // Marquer comme lu après un court délai
      setTimeout(() => {
        socket.emit("read_message", {
          messageId: message.id,
          from: currentUserId,
          chatId,
        });
      }, 2000);
    };

    // 🔁 Écouter les mises à jour de statut (lu/non lu)
    const onMessageStatus = ({ messageId, isViewed }: { messageId: number; isViewed: boolean }) => {
      console.log(`Message ${messageId} marqué comme lu:`, isViewed);
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, isViewed } : m))
      );
    };

    // 📢 Ajouter les listeners
    socket.on("chat_message", onChatMessage);
    socket.on("message_status", onMessageStatus);

    // 🧹 Nettoyage : retirer les listeners et quitter le salon
    return () => {
      socket.off("chat_message", onChatMessage);
      socket.off("message_status", onMessageStatus);

      // Optionnel : informer le backend que l’utilisateur quitte (si tu le gères)
      // socket.emit("leave_chat", { userId: currentUserId, chatId });
    };
  }, [chatId, isSuccess, data]); // ✅ Dépendances correctes


  const getFileData = async(files?: File[] | null) => {
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

  const sendMessage = async(input: string, files?: File[] | null) => {
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
    };

    socket.emit("chat_message", { message, attachments });// Envoyer les données des fichiers avec le message
  };

  const { mutateAsync: deleteMessage } = useMutation(trpc.message.deleteMessage.mutationOptions());

  const messageContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messageContentRef.current) {
      messageContentRef.current.scrollTop = messageContentRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <ChatHeader/>

      {/* Messages Container */}
      <div ref={messageContentRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-green-50 to-white">
        {messages.map((message) => (
          <MessageBubble key={message.id} userId={userId} message={message} onDelete={async() => {
            await deleteMessage({ id: message.id });
            setMessages((prev) => prev.filter((m) => m.id !== message.id));
            await refetch();
          }} />
        ))}
      </div>

      {/* Input Area */}
      <ChatForm onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatPage;