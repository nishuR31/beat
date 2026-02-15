'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Upload, Volume2, Zap } from 'lucide-react';

interface AudioControlPanelProps {
  onFileLoad: (file: File) => void;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onVolumeChange: (volume: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  onSeek: (time: number) => void;
  playing: boolean;
  duration: number;
  currentTime: number;
}

export function AudioControlPanel({
  onFileLoad,
  onPlay,
  onPause,
  onStop,
  onVolumeChange,
  onPlaybackRateChange,
  onSeek,
  playing,
  duration,
  currentTime,
}: AudioControlPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [volume, setVolume] = useState(100);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileLoad(file);
      setFileName(file.name);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const vol = value[0];
    setVolume(vol);
    onVolumeChange(vol / 100);
  };

  const handlePlaybackRateChange = (value: number[]) => {
    const rate = value[0];
    setPlaybackRate(rate);
    onPlaybackRateChange(rate);
  };

  const handleSeekChange = (value: number[]) => {
    onSeek(value[0]);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white">Audio File</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          {fileName ? fileName.substring(0, 20) : 'Upload Audio'}
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={playing ? onPause : onPlay}
          disabled={!fileName}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50"
        >
          {playing ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {playing ? 'Pause' : 'Play'}
        </Button>
        <Button
          onClick={onStop}
          disabled={!fileName}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Stop
        </Button>
      </div>

      {fileName && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeekChange}
            className="w-full"
          />
        </div>
      )}

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Volume
            </label>
            <span className="text-xs text-gray-400">{volume}%</span>
          </div>
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Playback Speed
            </label>
            <span className="text-xs text-gray-400">{playbackRate.toFixed(2)}x</span>
          </div>
          <Slider
            value={[playbackRate]}
            min={0.25}
            max={2}
            step={0.25}
            onValueChange={handlePlaybackRateChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
