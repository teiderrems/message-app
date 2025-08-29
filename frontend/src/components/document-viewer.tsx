"use client";

import React from "react";
import { FileText, FileSpreadsheet, FileArchive, File } from "lucide-react";
import { Card } from "@/components/ui/card";

type WhatsAppDocumentProps = {
  name: string;        // Nom du fichier
  size?: string;        // Taille affichée (ex: "2.3 MB")
  url: string;         // Lien de téléchargement / ouverture
  sent?: boolean;      // Alignement bulle
};

const DocumentViewer: React.FC<WhatsAppDocumentProps> = ({
  name,
  size,
  url,
  sent,
}) => {
  const getFileIcon = () => {
    const ext = name.split(".").pop()?.toLowerCase();

    switch (ext) {
      case "pdf":
        return <FileText className="text-red-500" size={28} />;
      case "xls":
      case "xlsx":
      case "csv":
        return <FileSpreadsheet className="text-green-500" size={28} />;
      case "zip":
      case "rar":
        return <FileArchive className="text-yellow-500" size={28} />;
      default:
        return <File className="text-blue-500" size={28} />;
    }
  };

  return (
    <div className={`flex ${sent ? "justify-end" : "justify-start"}`}>
      <Card
        className={`flex items-center gap-3 px-3 py-2  max-w-xs cursor-pointer
          ${sent ? "bg-green-500 text-white" : "bg-white text-black"}`}
        onClick={() => window.open(url, "_blank")}
      >
        {/* Icône du document */}
        <div className="p-2 rounded-md bg-white/20">{getFileIcon()}</div>

        {/* Infos document */}
        <div className="flex flex-col overflow-hidden">
          <span className="font-medium truncate max-w-[150px]">{name}</span>
          <span className="text-xs opacity-80">{size}</span>
        </div>
      </Card>
    </div>
  );
};

export default DocumentViewer;
