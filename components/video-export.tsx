'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import { Video, Download, Circle } from 'lucide-react';

interface VideoExportProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  audioElement: HTMLAudioElement | null;
  playing: boolean;
}

export function VideoExport({ canvasRef, audioElement, playing }: VideoExportProps) {
  const { isRecording, startRecording, stopRecording, downloadVideo, recordingTime } =
    useVideoRecorder();
  const [lastBlob, setLastBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas || !audioElement) {
      alert('Canvas or audio element not available');
      return;
    }

    startRecording(canvas, audioElement);
  };

  const handleStopRecording = async () => {
    setIsProcessing(true);
    try {
      const blob = await stopRecording();
      if (blob) {
        setLastBlob(blob);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (lastBlob) {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      downloadVideo(lastBlob, `music-visualization-${timestamp}.webm`);
    }
  };

  return (
    <div className="space-y-3">
      {isRecording && (
        <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-3 flex items-center gap-2">
          <Circle className="w-3 h-3 text-red-500 animate-pulse" />
          <span className="text-sm font-semibold text-red-300">Recording: {formatTime(recordingTime)}</span>
        </div>
      )}

      {!isRecording ? (
        <Button
          onClick={handleStartRecording}
          disabled={!audioElement}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white disabled:opacity-50"
        >
          <Video className="w-4 h-4 mr-2" />
          Start Recording
        </Button>
      ) : (
        <Button
          onClick={handleStopRecording}
          disabled={isProcessing}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          {isProcessing ? 'Processing...' : 'Stop Recording'}
        </Button>
      )}

      {lastBlob && !isRecording && (
        <div className="bg-green-900 bg-opacity-30 border border-green-500 rounded-lg p-3">
          <p className="text-sm text-green-300 mb-2">Recording saved!</p>
          <p className="text-xs text-gray-300 mb-3">Size: {(lastBlob.size / 1024 / 1024).toFixed(2)} MB</p>
          <Button
            onClick={handleDownload}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Video
          </Button>
        </div>
      )}
    </div>
  );
}
