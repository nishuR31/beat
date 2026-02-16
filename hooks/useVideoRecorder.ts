import { useRef, useState, useCallback } from "react";

interface UseVideoRecorderOptions {
  mimeType?: string;
  videoBitsPerSecond?: number;
  onProgress?: (seconds: number) => void;
}

interface UseVideoRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  startRecording: (
    canvas: HTMLCanvasElement,
    audioElement: HTMLAudioElement,
  ) => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => Promise<Blob | null>;
  downloadVideo: (blob: Blob, filename?: string) => void;
  recordingTime: number;
  error: string | null;
}

export function useVideoRecorder(
  options: UseVideoRecorderOptions = {},
): UseVideoRecorderReturn {
  const {
    mimeType = "video/webm",
    videoBitsPerSecond = 5000000,
    onProgress,
  } = options;

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const startRecording = useCallback(
    (canvas: HTMLCanvasElement, audioElement: HTMLAudioElement) => {
      try {
        const canvasStream = canvas.captureStream(60);
        if (audioElement.srcObject) {
          const audioTracks = (
            audioElement.srcObject as MediaStream
          ).getAudioTracks();
          if (audioTracks.length > 0) {
            canvasStream.addTrack(audioTracks[0]);
          }
        }
        const mediaRecorder = new MediaRecorder(canvasStream, {
          mimeType,
          videoBitsPerSecond,
        });
        chunksRef.current = [];
        recordingStartTimeRef.current = Date.now();

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onpause = () => setIsPaused(true);
        mediaRecorder.onresume = () => setIsPaused(false);

        mediaRecorder.start();
        setIsRecording(true);
        setIsPaused(false);

        const interval = setInterval(() => {
          const seconds = Math.floor(
            (Date.now() - recordingStartTimeRef.current) / 1000,
          );
          setRecordingTime(seconds);
          if (onProgress) onProgress(seconds);
        }, 100);

        (mediaRecorder as any).__interval = interval;
        mediaRecorderRef.current = mediaRecorder;
      } catch (err: any) {
        setError(err.message || "Error starting recording");
      }
    },
    [mimeType, videoBitsPerSecond, onProgress],
  );

  const pauseRecording = useCallback(() => {
    mediaRecorderRef.current?.pause();
  }, []);

  const resumeRecording = useCallback(() => {
    mediaRecorderRef.current?.resume();
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder) {
        resolve(null);
        return;
      }
      const interval = (mediaRecorder as any).__interval;
      if (interval) clearInterval(interval);

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setIsRecording(false);
        setIsPaused(false);
        setRecordingTime(0);
        mediaRecorderRef.current = null;
        chunksRef.current = [];
        resolve(blob);
      };
      mediaRecorder.stop();
    });
  }, [mimeType]);

  const downloadVideo = useCallback(
    (blob: Blob, filename = "visualization.webm") => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [],
  );

  return {
    isRecording,
    isPaused,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    downloadVideo,
    recordingTime,
    error,
  };
}
