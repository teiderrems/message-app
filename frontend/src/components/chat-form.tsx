import {
  Mic,
  Paperclip,
  SendHorizontal,
  Smile,
  X,
  Image as ImageIcon,
  FileAudio,
  FileVideo,
  FileText,
  FileSpreadsheet,
  File,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { toast } from "sonner";
import socket from "@/util";
import { MessageDetailDto } from "@/types";
import EmojiPicker from "./emoji-picker";
import VoiceRecorder from "./audio-record";

interface Props {
  onSendMessage: (
    message: string,
    attachments?: File[] | null,
    duration?: number
  ) => void;
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
  const [filePreviews, setFilePreviews] = useState<Record<number, string>>({});

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    setIsVoiceRecorder(false);
    onSendMessage(message, selectedFiles);
    setMessage("");
    setShowEmojiPicker(false);
    setSelectedFiles(null);
    setFilePreviews({});
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

        // Générer des prévisualisations pour les fichiers
        validFiles.forEach((file, index) => {
          const fileIndex = selectedFiles
            ? selectedFiles.length + index
            : index;

          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setFilePreviews((prev) => ({
                ...prev,
                [fileIndex]: e.target?.result as string,
              }));
            };
            reader.readAsDataURL(file);
          }
        });
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

        // Générer des prévisualisations pour les fichiers image
        validFiles.forEach((file, index) => {
          const fileIndex = selectedFiles
            ? selectedFiles.length + index
            : index;

          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setFilePreviews((prev) => ({
                ...prev,
                [fileIndex]: e.target?.result as string,
              }));
            };
            reader.readAsDataURL(file);
          }
        });
      }
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(
      (prev) => prev?.filter((_, index) => index !== indexToRemove) || null
    );

    // Mettre à jour les prévisualisations
    setFilePreviews((prev) => {
      const newPreviews = { ...prev };
      Object.keys(newPreviews).forEach((key) => {
        const numKey = parseInt(key);
        if (numKey === indexToRemove) {
          delete newPreviews[numKey];
        } else if (numKey > indexToRemove) {
          if (typeof newPreviews[numKey] === "string") {
            newPreviews[numKey - 1] = newPreviews[numKey] as string;
          }
          delete newPreviews[numKey];
        }
      });
      return newPreviews;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (file: File) => {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".pdf")) {
      return <FileText className="w-8 h-8 text-red-600" />;
    } else if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) {
      return <FileText className="w-8 h-8 text-blue-600" />;
    } else if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx")) {
      return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
    } else if (fileName.endsWith(".ppt") || fileName.endsWith(".pptx")) {
      return <File className="w-8 h-8 text-orange-600" />;
    } else if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-8 h-8 text-gray-600" />;
    } else if (file.type.startsWith("audio/")) {
      return <FileAudio className="w-8 h-8 text-purple-600" />;
    } else if (file.type.startsWith("video/")) {
      return <FileVideo className="w-8 h-8 text-red-600" />;
    } else {
      return <File className="w-8 h-8 text-gray-600" />;
    }
  };

  const getFileColor = (file: File): string => {
    const fileName = file.name.toLowerCase().trim();
    const { type } = file;

    // PDF : bleu doux et professionnel
    if (fileName.endsWith(".pdf")) return "from-gray-500/50 to-gray-500";

    // Word : bleu clair très doux
    if (fileName.endsWith(".doc") || fileName.endsWith(".docx"))
      return "from-blue-50 to-blue-100";

    // Excel : vert tendre
    if (fileName.endsWith(".xls") || fileName.endsWith(".xlsx"))
      return "from-emerald-50 to-emerald-100";

    // PowerPoint : orange pastel
    if (fileName.endsWith(".ppt") || fileName.endsWith(".pptx"))
      return "from-amber-50 to-amber-100";

    // Images : gris neutre / beige clair
    if (type.startsWith("image/")) return "from-gray-50 to-stone-50";

    // Audio : mauve très clair
    if (type.startsWith("audio/")) return "from-purple-200 to-purple-300";

    // Vidéo : rose pâle
    if (type.startsWith("video/")) return "from-rose-200 to-rose-300";

    // Autres : gris très clair
    return "from-cyan-200 to-cyan-300";
  };

  const getFileName = (fileName: string) => {
    return fileName.length > 12 ? fileName.substring(0, 12) + "..." : fileName;
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
      className="bg-white border-t border-gray-200 px-4 pt-2 pb-3 relative"
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
        <div className="mb-2 max-h-40 overflow-y-auto">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {selectedFiles.map((file, index) => {
              const mimeType = file.type;
              const fileName = file.name.toLowerCase();

              if (mimeType.startsWith("image/")) {
                return (
                  <div key={index} className="relative group">
                    <img
                      src={filePreviews[index] || URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded-lg"
                      onLoad={() => {
                        // Révoquer l'URL après chargement pour éviter les fuites de mémoire
                        URL.revokeObjectURL(filePreviews[index] || "");
                      }}
                    />
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="opacity-0 group-hover:opacity-100 text-white hover:text-red-500 transition-all duration-200 transform scale-90 hover:scale-100"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                );
              } else if (mimeType.startsWith("video/")) {
                return (
                  <div key={index} className="relative group">
                    <div className="relative">
                      <video
                        src={URL.createObjectURL(file)}
                        className="w-full h-24 object-cover rounded-lg"
                        controls={false}
                      />
                      <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center rounded-lg">
                        <div className="w-12 h-12 bg-white bg-opacity-50 rounded-full flex items-center justify-center">
                          <FileVideo className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="opacity-0 group-hover:opacity-100 text-white hover:text-red-500 transition-all duration-200 transform scale-90 hover:scale-100"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                );
              } else if (mimeType.startsWith("audio/")) {
                return (
                  <div key={index} className="relative group">
                    <div className="w-full h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <FileAudio className="w-8 h-8 text-white mx-auto mb-1" />
                        <p className="text-white text-xs font-medium truncate px-2">
                          {getFileName(file.name)}
                        </p>
                        <p className="text-white text-xs opacity-80">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="opacity-0 group-hover:opacity-100 text-white hover:text-red-500 transition-all duration-200 transform scale-90 hover:scale-100"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                );
              } else if (fileName.endsWith(".pdf")) {
                return (
                  <div key={index} className="relative group">
                    <div
                      className={`w-full h-24 bg-gradient-to-br from-gray-500/50 to-gray-500 rounded-lg flex items-center justify-center`}
                    >
                      <div className="text-center">
                        {getFileIcon(file)}
                        <p className="text-white text-xs font-medium truncate px-2 mt-1">
                          {getFileName(file.name)}
                        </p>
                        <p className="text-white text-xs opacity-80">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="opacity-0 group-hover:opacity-100 text-white hover:text-red-500 transition-all duration-200 transform scale-90 hover:scale-100"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                );
              } else if (
                fileName.endsWith(".doc") ||
                fileName.endsWith(".docx")
              ) {
                return (
                  <div key={index} className="relative group">
                    <div
                      className={`w-full h-24 bg-gradient-to-br from-gray-500/50 to-gray-500 rounded-lg flex items-center justify-center`}
                    >
                      <div className="text-center">
                        {getFileIcon(file)}
                        <p className="text-white text-xs font-medium truncate px-2 mt-1">
                          {getFileName(file.name)}
                        </p>
                        <p className="text-white text-xs opacity-80">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="opacity-0 group-hover:opacity-100 text-white hover:text-red-500 transition-all duration-200 transform scale-90 hover:scale-100"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                );
              } else if (
                fileName.endsWith(".xls") ||
                fileName.endsWith(".xlsx")
              ) {
                return (
                  <div key={index} className="relative group">
                    <div
                      className={`w-full h-24 bg-gradient-to-br from-gray-500/50 to-gray-500 rounded-lg flex items-center justify-center`}
                    >
                      <div className="text-center">
                        {getFileIcon(file)}
                        <p className="text-white text-xs font-medium truncate px-2 mt-1">
                          {getFileName(file.name)}
                        </p>
                        <p className="text-white text-xs opacity-80">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="opacity-0 group-hover:opacity-100 text-white hover:text-red-500 transition-all duration-200 transform scale-90 hover:scale-100"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="relative group">
                    <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        {getFileIcon(file)}
                        <p className="text-gray-700 text-xs font-medium truncate px-2 mt-1">
                          {getFileName(file.name)}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition-all duration-200 transform scale-90 hover:scale-100"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}

      {messageToReply && (
        <div className="bg-gray-100 p-2 border-t border-gray-200 mb-2">
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
        className={`flex items-center space-x-2 mx-auto p-1 bg-white rounded-full border transition-colors ${
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
              className="hover:cursor-pointer border-0 flex bg-white text-gray-600 hover:bg-gray-100 items-center justify-center rounded-full hover:text-green-600 transition-all duration-200"
            >
              <Paperclip className="h-6 w-6" />
            </Button>

            <Button
              asChild
              size={"icon"}
              className="hover:cursor-pointer border-0 flex bg-white text-gray-600 hover:bg-gray-100 items-center justify-center rounded-full hover:text-green-600 transition-all duration-200"
            >
              <Smile
                className="h-6 w-6"
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
                  ? "Ajouter un message..."
                  : "Message"
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onInput={handleInput}
              className="w-full h-10 border-0 focus-visible:ring-0 focus:border-0 placeholder:text-gray-500 placeholder:text-sm px-3 focus:outline-none text-sm"
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
            size={"icon"}
            onClick={() => setIsVoiceRecorder((state) => !state)}
            className="hover:cursor-pointer border-0 flex bg-white text-gray-600 hover:bg-gray-100 items-center justify-center rounded-full hover:text-green-600 transition-all duration-200"
          >
            <Mic className="h-6 w-6" />
          </Button>
        ) : (
          <Button
            type="submit"
            asChild
            size={"icon"}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            className="hover:cursor-pointer border-0 p-2 w-8 h-8 flex items-center justify-center bg-green-600 hover:bg-green-700 rounded-full transition-all duration-200"
          >
            <SendHorizontal className="h-5 w-5 text-white" />
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center mt-1">
        Glissez-déposez des fichiers ici
      </p>
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 z-50">
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
