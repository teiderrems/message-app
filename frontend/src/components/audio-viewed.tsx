import { useState, useRef, useEffect } from "react";
import { Play, Pause, Mic } from "lucide-react";
import { Button } from "./ui/button";
import { StatusMessage } from "./message-bubble";

const AudioMessage = ({
  sent,
  src,
  isViewed,
  voiceDuration,
  time
}: {
  sent: boolean;
  src: string;
  isViewed: boolean;
  time?:string;
  voiceDuration: number;
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (voiceDuration) {
      setDuration(formatTime(voiceDuration));
    }

    const handleTimeUpdate = () => {
      setCurrentTime(formatTime(audio.currentTime));
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.log("Playback failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  return (
    <div
      className={`flex items-center relative gap-2 max-w-md  rounded-tr-2xl rounded-bl-2xl px-3 py-2 shadow-sm ${
        sent ? "bg-green-100" : "bg-gray-300"
      }`}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
        <Mic className={sent ? "text-green-600" : "text-gray-600"} size={20} />
      </div>

      {/* Play / Pause */}
      <Button
        asChild
        size={"icon"}
        onClick={togglePlay}
        className={`flex items-center hover:cursor-pointer justify-center rounded-full ${
          sent ? "bg-green-500" : "bg-gray-500"
        } text-white`}
      >
        {isPlaying ? (
          <Pause className="w-8 h-8" />
        ) : (
          <Play className="w-8 h-8" />
        )}
      </Button>

      {/* Waveform fake */}
      <div className="flex-1 flex items-center gap-1 px-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className={`w-1 ${sent ? "bg-green-600" : "bg-gray-600"} rounded`}
            style={{
              height: `${Math.random() * 20 + 5}px`,
              animation: isPlaying
                ? `pulse ${0.5 + Math.random()}s infinite ease-in-out`
                : "none",
            }}
          ></span>
        ))}
      </div>
      <div className="flex justify-between items-center text-[10px] font-mono">
        <span>{isPlaying ? currentTime : duration || "0:00"}</span>
      </div>
      <span className="absolute flex items-center space-x-1 right-2 bottom-0">
        <span className={`text-xs ${
                  sent ? "text-green-400" : "text-gray-500"
                }`}>{time}</span>
        <StatusMessage isViewed={isViewed} />
      </span>

      {/* Audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
};

export default AudioMessage;
