import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Pause, Play } from "lucide-react";

type Props = {
  onSend?: (input: string, files?: File[], duration?: number) => void;
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
  const isDeleteRef = useRef(false); // ← Ref pour accès synchrone
  const finalDurationRef = useRef<number>(0); // Référence pour persister la valeur du timer

  // Format temps mm:ss
  const formatTime = (s: number) => {
    if (!Number.isFinite(s) || isNaN(s)) return "00:00";
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // Démarrer le minuteur
  const startTimer = () => {
    stopTimer();
    timerIntervalRef.current = window.setInterval(() => {
      setTimer((prevTimer) => {
        const newTimer = prevTimer + 1;
        finalDurationRef.current = newTimer; // Mise à jour de la référence

        if (newTimer >= maxDurationSec) {
          stopRecording(true);
          return maxDurationSec;
        }
        return newTimer;
      });
    }, 1000) as unknown as number;
  };

  // Arrêter le minuteur
  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Convertir Blob en File
  const blobToFile = (blob: Blob, fileName: string): File => {
    return new File([blob], fileName, {
      type: blob.type,
      lastModified: Date.now(),
    });
  };

  const startRecording = async () => {
    isDeleteRef.current = false; // ✅ réinitialiser au démarrage
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, {
            type: mimeType,
          });
          const file = blobToFile(
            blob,
            `record-${Date.now()}.${blob.type.split("/")[1]}`
          );

          // ✅ Utiliser isDeleteRef.current au lieu de isDelete
          if (onSend && !isDeleteRef.current) {
            onSend("audio", [file], finalDurationRef.current);
          }
        }
        setIsVoiceRecorder(false);
        cleanup();
      };

      // ✅ Ordre critique :
      mediaRecorder.start();
      setIsVoiceRecorder(true); // après start()
      setPaused(false);
      setTimer(0); // forcer reset
      finalDurationRef.current = 0; // reset de la référence
      startTimer(); // démarrer après tout
    } catch (err) {
      console.error("Erreur microphone :", err);
      alert("Impossible d'accéder au microphone.");
      setIsVoiceRecorder(false);
      onCancel?.();
    }
  };

  useEffect(() => {
    if (isRecord && !mediaRecorderRef.current) {
      startRecording();
    }
    return () => {
      cleanup();
    };
  }, [isRecord]);

  // Arrêter l'enregistrement
  const stopRecording = (send = false) => {
    stopTimer();
    setIsVoiceRecorder(false);
    setPaused(false);

    if (!send) {
      // On arrête l'enregistrement SANS envoyer
      mediaRecorderRef.current?.stop(); // déclenche onstop
      chunksRef.current = [];
      onCancel?.();
      cleanup();
      return;
    }

    // Si send=true, on laisse onstop gérer l'envoi
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  // Pause/Reprendre
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

  // Nettoyage des ressources
  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    stopTimer();
  };

  return (
    <>
      {isRecord && (
        <div className="flex items-center justify-between bg-white flex-1 px-2 py-1">
          <Button
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              isDeleteRef.current = true; // ✅ mise à jour synchrone
              stopRecording(false);
            }}
            className="bg-white text-red-600 hover:bg-gray-100 rounded-full transition"
          >
            <Trash2 className="h-7 w-7" />
          </Button>

          <div className="flex items-center gap-2 flex-1 justify-center">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-sm font-medium">{formatTime(timer)}</span>

            <div className="flex items-center gap-[2px] mx-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <span
                  key={i}
                  className="w-[2px] bg-gray-400 rounded-sm animate-pulse"
                  style={{
                    height: `${5 + (i % 4) * 4}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              togglePause();
            }}
            className="rounded-full"
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
