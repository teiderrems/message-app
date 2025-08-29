import { Mic, Paperclip, SendHorizontal, Smile, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { toast } from "sonner";
import socket from "@/util";
import { MessageDetailDto } from "@/types";
import EmojiPicker from "./emoji-picker";
import VoiceRecorder from "./audio-record";

interface Props {
  onSendMessage: (message: string, attachments?: File[] | null) => void;
  userId: number;
  chatId: number;
  destinatorId: number;
  messageToReply: MessageDetailDto | undefined;
  setMessageToReply: React.Dispatch<
    React.SetStateAction<MessageDetailDto | undefined>
  >;
}

function ChatForm(props: Props) {
  const {
    onSendMessage,
    userId,
    chatId,
    destinatorId,
    messageToReply,
    setMessageToReply,
  } = props;

  const [message, setMessage] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    setIsVoiceRecorder(false);
    onSendMessage(message, selectedFiles);
    setMessage("");
    setShowEmojiPicker(false);
    setSelectedFiles(null);
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);

      // Validation des fichiers
      const maxSize = 25 * 1024 * 1024; // 25MB
      const validFiles = filesArray.filter((file) => {
        if (file.size > maxSize) {
          toast(`${file.name} dépasse la taille maximale de 25MB.`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setSelectedFiles((prev) =>
          prev ? [...prev, ...validFiles] : validFiles
        );
      }
    }
  };

  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files) {
      const filesArray = Array.from(files);

      // Validation des fichiers
      const maxSize = 25 * 1024 * 1024; // 25MB
      const validFiles = filesArray.filter((file) => {
        if (file.size > maxSize) {
          toast(`${file.name} dépasse la taille maximale de 25MB.`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setSelectedFiles((prev) =>
          prev ? [...prev, ...validFiles] : validFiles
        );
      }
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(
      (prev) => prev?.filter((_, index) => index !== indexToRemove) || null
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const handleInput = () => {
    socket.emit("user_typing", {
      chatId,
      userId,
      destinatorId,
      isTyping: true,
    });

    // reset timer pour notifier "arrêt d'écriture"
    if (typeof typingTimeout === "number") clearTimeout(typingTimeout);
    setTypingTimeout(
      setTimeout(() => {
        socket.emit("user_typing", { chatId, destinatorId, isTyping: false });
      }, 2000) // 2 sec sans frappe => stop typing
    );
  };

  function cancelReply(): void {
    setMessageToReply(undefined);
  }

  const [isVoiceRecorder, setIsVoiceRecorder] = useState(false);

  return (
    <form
      className="bg-white border-t border-gray-200 px-4 py-2 relative"
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSubmit(e);
        }
      }}
    >
      {/* Aperçu des fichiers sélectionnés */}
      {selectedFiles && selectedFiles.length > 0 && (
        <div className="mb-2 p-2 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm border"
              >
                <div className="flex-shrink-0">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {messageToReply && (
        <div className="bg-gray-100 p-2 border-t border-gray-200">
          <div className="flex items-start justify-between bg-white p-2 rounded-md">
            <div className="flex items-start">
              <div
                className={`w-1 h-8 mr-2 mt-1 ${
                  messageToReply.author.id === userId
                    ? "bg-green-500"
                    : "bg-blue-500"
                }`}
              ></div>
              <div>
                <p className="font-medium text-sm">
                  Répondre à{" "}
                  {messageToReply.author.id === userId
                    ? "vous"
                    : messageToReply.author.email ||
                      messageToReply.author.username}
                </p>
                <p className="text-sm text-gray-600">
                  {messageToReply.content}
                </p>
              </div>
            </div>
            <button
              onClick={cancelReply}
              className="text-gray-500 hover:text-gray-700 ml-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div
        className={`flex items-center space-x-2 mx-auto p-1 bg-white rounded-full border-2 transition-colors ${
          isDragging
            ? "border-green-500 bg-green-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!isVoiceRecorder && (
          <>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="*"
              className="hidden"
            />

            <Button
              asChild
              size={"icon"}
              onClick={handleFileInputClick}
              className="hover:cursor-pointer border-0 flex bg-white text-gray-600 hover:bg-gray-400 items-center justify-center rounded-full hover:text-white transition"
            >
              <Paperclip className="h-8 w-8" />
            </Button>

            <Button
              asChild
              size={"icon"}
              className="hover:cursor-pointer border-0 flex bg-white text-gray-600 hover:bg-gray-400 items-center justify-center rounded-full hover:text-white transition"
            >
              <Smile
                className="h-8 w-8"
                onClick={() => setShowEmojiPicker(true)}
              />
            </Button>
          </>
        )}

        {!isVoiceRecorder ? (
          <div className="flex-1 relative h-10">
            <Input
              type="text"
              placeholder={
                selectedFiles && selectedFiles.length > 0
                  ? "Ajouter un message (facultatif)"
                  : "Écrire un message"
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onInput={handleInput} // Remplace 1 par l'ID réel de l'utilisateur
              className="w-full h-10 border-0 focus-visible:border-0 focus:border-white placeholder:italic px-4 focus:outline-none"
            />
          </div>
        ) : (
          <VoiceRecorder
            isRecord={isVoiceRecorder}
            setIsVoiceRecorder={setIsVoiceRecorder}
            onSend={onSendMessage}
          />
        )}

        {!message && !selectedFiles && !isVoiceRecorder ? (
          <Button
            asChild
            type="button"
            size={"icon"}
            onClick={() => setIsVoiceRecorder((state) => !state)}
            className="hover:cursor-pointer border-0 flex items-center justify-center bg-white text-gray-600 hover:bg-green-600 rounded-full hover:text-white transition"
          >
            <Mic className="h-8 w-8" />
          </Button>
        ) : (
          <Button
            type="submit"
            asChild
            size={"icon"}
            onClick={handleSubmit}
            className="hover:cursor-pointer border-0 p-1 w-10 h-10 flex items-center text-white bg-green-600 hover:bg-green-700 justify-center rounded-full transition"
          >
            <SendHorizontal className="h-8 w-8" />
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center mt-1">
        Glissez-déposez des fichiers ici ou cliquez sur l'icône pour ajouter
      </p>
      {showEmojiPicker && (
        <div className="absolute bottom-full flex justify-center mb-2 left-0 z-50">
          <EmojiPicker
            setMessage={setMessage}
            onClose={() => setShowEmojiPicker(false)}
          />
        </div>
      )}
    </form>
  );
}

export default ChatForm;
