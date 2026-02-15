"use client";

import { useState, useRef, useMemo } from "react";
import { useAudioContext } from "@/hooks/useAudioContext";
import { VisualizationStyle } from "@/lib/visualization-styles";
import { ColorScheme } from "@/lib/color-schemes";
import { AudioCanvas } from "./audio-canvas";
import { AudioControlPanel } from "./audio-control-panel";
import { VisualizationSettings } from "./visualization-settings";
import { VideoExport } from "./video-export";
import { Music } from "lucide-react";

export function VisualizerLayout() {
  const {
    analyser,
    dataArray,
    audioElement,
    playing,
    duration,
    currentTime,
    play,
    pause,
    stop,
    loadAudio,
    setVolume,
    setPlaybackRate,
    seekTo,
  } = useAudioContext();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [style, setStyle] = useState<VisualizationStyle>("bars");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("neon");
  const [beatGlowEnabled, setBeatGlowEnabled] = useState(true);
  const [particleEffectEnabled, setParticleEffectEnabled] = useState(true);
  const [mirrorEffect, setMirrorEffect] = useState(false);
  const [sensitivity, setSensitivity] = useState(0.5);
  const [smoothing, setSmoothing] = useState(0.8);

  const handleFileLoad = (file: File) => {
    loadAudio(file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Header */}
      <header className="glass mb-8 mt-4 mx-auto max-w-4xl w-full">
        <div className="px-6 py-4 flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Music className="w-7 h-7 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold magenta-text drop-shadow-lg">
                Music Visualizer
              </h1>
              <p className="text-base text-pink-200 font-medium">
                Real-time audio visualization with beat detection
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Canvas Area */}
          <div className="lg:col-span-3 flex items-center justify-center">
            <div className="glass w-full h-full p-2 flex items-center justify-center shadow-2xl">
              <AudioCanvas
                canvasRef={canvasRef}
                analyser={analyser}
                dataArray={dataArray}
                style={style}
                colorScheme={colorScheme}
                beatGlowEnabled={beatGlowEnabled}
                particleEffectEnabled={particleEffectEnabled}
                mirrorEffect={mirrorEffect}
                sensitivity={sensitivity}
                smoothing={smoothing}
              />
            </div>
          </div>

          {/* Control Panels */}
          <div className="space-y-6">
            {/* Audio Controls */}
            <div className="glass p-6 shadow-xl">
              <h2 className="text-lg font-bold magenta-text mb-4 uppercase tracking-wide">
                Audio
              </h2>
              <AudioControlPanel
                onFileLoad={handleFileLoad}
                onPlay={play}
                onPause={pause}
                onStop={stop}
                onVolumeChange={setVolume}
                onPlaybackRateChange={setPlaybackRate}
                onSeek={seekTo}
                playing={playing}
                duration={duration}
                currentTime={currentTime}
              />
            </div>

            {/* Visualization Settings */}
            <div className="glass p-6 shadow-xl">
              <h2 className="text-lg font-bold magenta-text mb-4 uppercase tracking-wide">
                Settings
              </h2>
              <VisualizationSettings
                style={style}
                onStyleChange={setStyle}
                colorScheme={colorScheme}
                onColorSchemeChange={setColorScheme}
                beatGlowEnabled={beatGlowEnabled}
                onBeatGlowChange={setBeatGlowEnabled}
                particleEffectEnabled={particleEffectEnabled}
                onParticleEffectChange={setParticleEffectEnabled}
                mirrorEffect={mirrorEffect}
                onMirrorEffectChange={setMirrorEffect}
                sensitivity={sensitivity}
                onSensitivityChange={setSensitivity}
                smoothing={smoothing}
                onSmoothingChange={setSmoothing}
              />
            </div>

            {/* Video Export */}
            <div className="glass p-6 shadow-xl">
              <h2 className="text-lg font-bold magenta-text mb-4 uppercase tracking-wide">
                Export
              </h2>
              <VideoExport
                canvasRef={canvasRef}
                audioElement={audioElement}
                playing={playing}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass mt-12 mx-auto max-w-4xl w-full">
        <div className="px-6 py-6 text-center">
          <p className="text-base magenta-text font-semibold">
            Built with React, Web Audio API, and Canvas. Supports WebM video
            export.
          </p>
        </div>
      </footer>
    </div>
  );
}
