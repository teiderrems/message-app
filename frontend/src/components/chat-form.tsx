import { Mic, Paperclip, SendHorizontal, Smile, X} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  onSendMessage: (message: string, attachments?: File[] | null) => void;
  message?: string;
}

function ChatForm(props: Props) {
  const { onSendMessage, message } = props;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const [inputMessage, setInputMessage] = useState(message || "");
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSendMessage(inputMessage, selectedFiles);
    setInputMessage("");
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
      const validFiles = filesArray.filter(file => {
        if (file.size > maxSize) {
          toast(`${file.name} dépasse la taille maximale de 25MB.`
            // title: "Fichier trop volumineux",
            // description: `${file.name} dépasse la taille maximale de 25MB.`,
            // variant: "destructive"
          );
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setSelectedFiles(prev => prev ? [...prev, ...validFiles] : validFiles);
      }
    }
  };

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
      const validFiles = filesArray.filter(file => {
        if (file.size > maxSize) {
          toast(`${file.name} dépasse la taille maximale de 25MB.`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setSelectedFiles(prev => prev ? [...prev, ...validFiles] : validFiles);
      }
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev?.filter((_, index) => index !== indexToRemove) || null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <form
      className="bg-white border-t border-gray-200 px-4 py-3"
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
              <div key={index} className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm border">
                <div className="flex-shrink-0">
                  <img src={URL.createObjectURL(file)} alt={file.name} className="w-10 h-10 object-cover rounded-md" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
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

      <div 
        className={`flex items-center space-x-2 p-2 mx-auto bg-white rounded-full border-2 transition-colors ${
          isDragging 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden"
        />
        
        <Button
          asChild
          onClick={handleFileInputClick}
          className="hover:cursor-pointer border-0 sm:h-10 sm:w-10 p-2 flex bg-white text-gray-600 hover:bg-gray-400 items-center justify-center rounded-full hover:text-white transition"
        >
          <Paperclip className="h-full w-fit" />
        </Button>
        
        <Button
          asChild
          className="hover:cursor-pointer border-0 sm:h-10 sm:w-10 p-2 flex bg-white text-gray-600 hover:bg-gray-400 items-center justify-center rounded-full hover:text-white transition"
        >
          <Smile className="h-full w-fit" />
        </Button>

        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder={selectedFiles && selectedFiles.length > 0 ? "Ajouter un message (facultatif)" : "Écrire un message"}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="w-full h-12 border-0 focus:border-0 focus:border-white placeholder:italic px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        {(!inputMessage && !selectedFiles) ? (
          <Button
            asChild
            type="button"
            className="hover:cursor-pointer border-0 sm:h-10 sm:w-10 p-2 flex items-center justify-center bg-white text-gray-600 hover:bg-green-600 rounded-full hover:text-white transition"
          >
            <Mic className="h-full w-fit" />
          </Button>
        ) : (
          <Button
            type="submit"
            asChild
            className="hover:cursor-pointer border-0 sm:h-10 sm:w-10 p-2 flex items-center text-white bg-green-600 hover:bg-green-700 justify-center rounded-full transition"
          >
            <SendHorizontal className="h-full w-fit" />
          </Button>
        )}
      </div>
      
      <p className="text-xs text-gray-500 text-center mt-1">
        Glissez-déposez des fichiers ici ou cliquez sur l'icône pour ajouter
      </p>
    </form>
  );
}

export default ChatForm;