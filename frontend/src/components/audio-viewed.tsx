"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { Card } from "@/components/ui/card";

type WhatsAppAudioProps = {
  src: string;       // URL ou Base64 de l’audio
  sent?: boolean;    // true = bulle alignée à droite
};

const AudioViewer: React.FC<WhatsAppAudioProps> = ({ src, sent }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.onloadedmetadata = () => {
      setDuration(formatTime(audio.duration));
    };

    audio.ontimeupdate = () => {
      setCurrentTime(formatTime(audio.currentTime));
    };

    audio.onended = () => setIsPlaying(false);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  return (
    <div
      className={`flex ${sent ? "justify-end" : "justify-start"}`}
    >
      <Card
        className={`flex items-center gap-3 px-3 py-2 rounded-t-2xl shadow
          ${sent ? "bg-green-500 text-white" : "bg-white text-black"}`}
      >
        {/* Bouton Play/Pause */}
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        {/* Waveform (fake simple) */}
        <div className="flex-1 flex items-center gap-[2px]">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-[2px] rounded-sm"
              style={{
                height: `${Math.random() * 16 + 6}px`,
                backgroundColor: sent ? "white" : "black",
                opacity: 0.8,
              }}
            />
          ))}
        </div>

        {/* Durée */}
        <span className="text-xs font-mono">{isPlaying ? currentTime : duration}</span>

        <audio ref={audioRef} src={src} preload="metadata" hidden />
      </Card>
    </div>
  );
};

export default AudioViewer;
