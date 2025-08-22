import ChatForm from "@/components/chat-form";
import { ChatHeader } from "@/components/chat-header";
import {
  Check,
  CheckCheck
} from "lucide-react";

const ChatPage = () => {
  const messages = [
    {
      id: 1,
      sender: "me",
      content: "Bonjour ! Comment ça va ?",
      time: "14:30",
      status: "read",
    },
    {
      id: 2,
      sender: "other",
      content: "Salut ! Tout va bien merci, et toi ?",
      time: "14:32",
      status: "delivered",
    },
    {
      id: 3,
      sender: "me",
      content: "Très bien aussi ! J'espère que tu as passé un bon week-end.",
      time: "14:33",
      status: "read",
    },
    {
      id: 4,
      sender: "other",
      content: "Oui super ! On est allé à la montagne, c'était magnifique.",
      time: "14:35",
      status: "delivered",
    },
    {
      id: 5,
      sender: "me",
      content: "Waouh ! Quelles photos incroyables ! 😍",
      time: "14:36",
      status: "read",
    },
    {
      id: 6,
      sender: "other",
      content: "Merci ! Je t'en envoie quelques-unes.",
      time: "14:37",
      status: "delivered",
    },
    {
      id: 7,
      sender: "me",
      content: "Parfait, hâte de les voir !",
      time: "14:38",
      status: "read",
    },
    {
      id: 8,
      sender: "other",
      content: "Merci ! Je t'en envoie quelques-unes.",
      time: "14:37",
      status: "delivered",
    },
    {
      id: 9,
      sender: "me",
      content: "Parfait, hâte de les voir !",
      time: "14:38",
      status: "read",
    },
    {
      id: 10,
      sender: "other",
      content: "Merci ! Je t'en envoie quelques-unes.",
      time: "14:37",
      status: "delivered",
    },
    {
      id: 11,
      sender: "me",
      content: "Parfait, hâte de les voir !",
      time: "14:38",
      status: "read",
    },
  ];

  const MessageBubble = ({
    message,
  }: {
    message: (typeof messages)[number];
  }) => {
    const isMe = message.sender === "me";

    return (
      <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3`}>
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
            isMe
              ? "bg-green-500 text-white rounded-tr-none"
              : "bg-gray-200 text-gray-800 rounded-tl-none"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
          <div
            className={`flex items-center justify-end mt-1 space-x-1 ${
              isMe ? "text-green-100" : "text-gray-500"
            }`}
          >
            <span className="text-xs">{message.time}</span>
            {isMe &&
              (message.status === "read" ? (
                <CheckCheck className="w-3 h-3 text-blue-300" />
              ) : message.status === "delivered" ? (
                <CheckCheck className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <ChatHeader />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-green-50 to-white">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      {/* Input Area */}
      <ChatForm onSendMessage={(message) => console.log(message)} />
    </div>
  );
};

export default ChatPage;
