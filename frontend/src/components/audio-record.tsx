"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Pause, Play } from "lucide-react";

type Props = {
  onSend?: (input: string, files?: File[]) => void;
  onCancel?: () => void;
  maxDurationSec?: number;
  isRecord: boolean;
  setIsVoiceRecorder: React.Dispatch<React.SetStateAction<boolean>>;
};

export const VoiceRecorder: React.FC<Props> = ({
  onSend,
  onCancel,
  maxDurationSec = 60,
  isRecord,
  setIsVoiceRecorder,
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [paused, setPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerIntervalRef = useRef<number | null>(null);

  // 🎵 Timer format
  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // 🎵 Timer logic
  const startTimer = () => {
    stopTimer();
    timerIntervalRef.current = window.setInterval(() => {
      setTimer((t) => {
        if (t + 1 >= maxDurationSec) {
          stopRecording(true);
        }
        return t + 1;
      });
    }, 1000) as unknown as number;
  };
  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const blobToFile = (blob: Blob, fileName: string): File => {
    return new File([blob], fileName, {
      type: blob.type,
      lastModified: Date.now(),
    });
  };

  // 🎤 Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mime = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";
      const mr = new MediaRecorder(stream, { mimeType: mime });
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, {
            type: chunksRef.current[0]?.type || "audio/webm",
          });
          if (onSend) {
            onSend("audio", [
              blobToFile(
                blob,
                `record-${Date.now()}.${blob.type.split("/")[1]}`
              ),
            ]);
            setIsVoiceRecorder(false);
          }
        }
        cleanup();
      };

      mr.start();
      setIsVoiceRecorder(true);
      setPaused(false);
      setTimer(0);
      startTimer();
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Impossible d'accéder au micro.");
    }
  };

  // 🎤 Stop & send
  const stopRecording = (send = true) => {
    stopTimer();
    setIsVoiceRecorder(false);
    setPaused(false);

    if (!send) {
      mediaRecorderRef.current?.stop();
      chunksRef.current = [];
      onCancel?.();
      cleanup();
      return;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      const blob = new Blob(chunksRef.current, {
        type: chunksRef.current[0]?.type || "audio/webm",
      });
      if (onSend) {
        onSend("audio", [
          blobToFile(blob, `record-${Date.now()}.${blob.type.split("/")[1]}`),
        ]);
        setIsVoiceRecorder(false);
      }
      mediaRecorderRef.current.stop();
    }
  };

  // 🎤 Pause / Resume
  const togglePause = () => {
    if (!mediaRecorderRef.current) return;

    if (!paused) {
      mediaRecorderRef.current.pause();
      stopTimer();
      setPaused(true);
    } else {
      mediaRecorderRef.current.resume();
      startTimer();
      setPaused(false);
    }
  };

  // 🧹 Cleanup
  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    stopTimer();
  };

  useEffect(() => {
    if (isRecord) {
      startRecording();
    }
    return () => cleanup();
  }, []);

  return (
    <>
      {isRecord && (
        <div className="flex items-center border-0 justify-between bg-white flex-1">
          {/* Cancel */}
          <Button
            size="icon"
            asChild
            onClick={() => stopRecording(false)}
            className="hover:cursor-pointer border-0 flex bg-white text-red-600 hover:bg-gray-400 items-center justify-center rounded-full hover:text-white transition"
          >
            <Trash2 className="h-7 w-7" />
          </Button>

          {/* Timer + waveform */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-sm font-medium">{formatTime(timer)}</span>

            {/* Waveform */}
            <div className="flex items-center gap-[2px] mx-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <span
                  key={i}
                  className="w-[2px] bg-gray-600 rounded-sm animate-pulse"
                  style={{
                    height: `${5 + (i % 4) * 4}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Pause / Resume */}
          <Button
            size="icon"
            variant="ghost"
            asChild
            onClick={togglePause}
            className="rounded-full hover:cursor-pointer"
          >
            {paused ? (
              <Play className="h-7 w-7" />
            ) : (
              <Pause className="h-7 w-7" />
            )}
          </Button>
        </div>
      )}
    </>
  );
};

export default VoiceRecorder;
