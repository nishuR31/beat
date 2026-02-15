import { useRef, useState, useCallback } from 'react';

interface UseVideoRecorderOptions {
  mimeType?: string;
  videoBitsPerSecond?: number;
}

interface UseVideoRecorderReturn {
  isRecording: boolean;
  startRecording: (canvas: HTMLCanvasElement, audioElement: HTMLAudioElement) => void;
  stopRecording: () => Promise<Blob | null>;
  downloadVideo: (blob: Blob, filename?: string) => void;
  recordingTime: number;
}

export function useVideoRecorder(
  options: UseVideoRecorderOptions = {}
): UseVideoRecorderReturn {
  const { mimeType = 'video/webm', videoBitsPerSecond = 5000000 } = options;

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const startRecording = useCallback(
    (canvas: HTMLCanvasElement, audioElement: HTMLAudioElement) => {
      try {
        // Create canvas stream
        const canvasStream = canvas.captureStream(60);

        // Get audio track from audio element
        if (audioElement.srcObject) {
          const audioTracks = (audioElement.srcObject as MediaStream).getAudioTracks();
          if (audioTracks.length > 0) {
            canvasStream.addTrack(audioTracks[0]);
          }
        } else if (audioElement.src) {
          // If audio is loaded directly, we'll record just the video
          console.warn('Audio loaded from direct src; recording video only');
        }

        // Create media recorder
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

        mediaRecorder.start();
        setIsRecording(true);

        // Update recording time
        const interval = setInterval(() => {
          setRecordingTime(
            Math.floor((Date.now() - recordingStartTimeRef.current) / 1000)
          );
        }, 100);

        // Store interval ID on the mediaRecorder for cleanup
        (mediaRecorder as any).__interval = interval;

        mediaRecorderRef.current = mediaRecorder;
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    },
    [mimeType, videoBitsPerSecond]
  );

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder) {
        resolve(null);
        return;
      }

      // Clear interval
      const interval = (mediaRecorder as any).__interval;
      if (interval) {
        clearInterval(interval);
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setIsRecording(false);
        setRecordingTime(0);
        mediaRecorderRef.current = null;
        chunksRef.current = [];
        resolve(blob);
      };

      mediaRecorder.stop();
    });
  }, [mimeType]);

  const downloadVideo = useCallback((blob: Blob, filename = 'visualization.webm') => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
    downloadVideo,
    recordingTime,
  };
}
