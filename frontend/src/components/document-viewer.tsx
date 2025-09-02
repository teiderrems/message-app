import React from "react";
import { FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";
// import { Button } from "./ui/button";
import { StatusMessage } from "./message-bubble";
import { v4 } from 'uuid';

type WhatsAppDocumentProps = {
  name: string;
  size?: string;
  meta?: string; // ex: "32 pages · PDF"
  preview?: string; // bref aperçu du contenu
  url: string;
  sent?: boolean;
  isViewed: boolean;
  time?: string; // ex: "16:27"
};

const DocumentViewer: React.FC<WhatsAppDocumentProps> = ({
  name,
  size,
  meta,
  preview,
  url,
  sent,
  isViewed,
  time,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 max-w-md relative rounded-2xl px-3 py-2 shadow-sm ",
        sent ? "justify-end bg-green-500" : "justify-start bg-white"
      )}
    >
      <div className={cn("relative my-2")}>
        {/* Contenu document */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          // onClick={() => window.open(url, "_blank")}
        >
          <FileText className="text-red-500 flex-shrink-0" size={28} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="font-medium text-sm truncate">{name}</span>
            <span className="text-xs text-gray-600 truncate">
              {meta} {size ? `· ${size}` : ""}
            </span>
          </div>
          <a
            href={url}
            target="_blank"
            download={v4()} // facultatif, sinon prend le nom de l’URL
            className="inline-flex items-center justify-center rounded-full p-2 hover:bg-gray-200 transition"
          >
            <Download className="text-gray-600 w-6 h-6" />
          </a>
        </div>

        {/* Aperçu du contenu */}
        {preview && (
          <div className="mt-2 text-xs text-gray-500 italic line-clamp-2">
            {preview}
          </div>
        )}
      </div>
      <span className="absolute flex items-center space-x-1 right-2 bottom-0">
        <span
          className={`text-xs ${sent ? "text-green-400" : "text-gray-500"}`}
        >
          {time}
        </span>
        <StatusMessage isViewed={isViewed} />
      </span>
    </div>
  );
};

export default DocumentViewer;
