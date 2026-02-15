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

  // Visualization settings state
  const [style, setStyle] = useState<VisualizationStyle>("bars");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("neon");
  const [customColor, setCustomColor] = useState("#ff00ff");
  const [beatGlowEnabled, setBeatGlowEnabled] = useState(true);
  const [particleEffectEnabled, setParticleEffectEnabled] = useState(true);
  const [mirrorEffect, setMirrorEffect] = useState(false);
  const [sensitivity, setSensitivity] = useState(0.5);
  const [smoothing, setSmoothing] = useState(0.8);
  const [beatSyncMode, setBeatSyncMode] = useState("default");
  const [image, setImage] = useState<string | null>(null);
  const [autoColor, setAutoColor] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [aspect, setAspect] = useState("16/9");
  const [rotation, setRotation] = useState(0);
  const [filter, setFilter] = useState("none");

  // Image color extraction (auto color)
  const handleImageUpload = (img: string) => {
    setImage(img);
    if (autoColor) {
      // Extract dominant color (simple average, can be improved)
      const imageEl = new window.Image();
      imageEl.src = img;
      imageEl.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = imageEl.width;
        canvas.height = imageEl.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(imageEl, 0, 0);
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          let r = 0,
            g = 0,
            b = 0,
            count = 0;
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          setCustomColor(
            `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`,
          );
        }
      };
    }
  };

  // Fullscreen logic
  useEffect(() => {
    if (fullscreen && canvasRef.current) {
      const el = canvasRef.current;
      if (el.requestFullscreen) el.requestFullscreen();
    }
  }, [fullscreen]);

  const handleFileLoad = (file: File) => {
    loadAudio(file);
  };

  // Aspect ratio style
  const aspectStyle = useMemo(() => {
    switch (aspect) {
      case "4/3":
        return { aspectRatio: "4 / 3" };
      case "1/1":
        return { aspectRatio: "1 / 1" };
      case "21/9":
        return { aspectRatio: "21 / 9" };
      default:
        return { aspectRatio: "16 / 9" };
    }
  }, [aspect]);

  // Filter style
  const filterStyle = useMemo(() => {
    switch (filter) {
      case "blur":
        return { filter: "blur(4px)" };
      case "grayscale":
        return { filter: "grayscale(1)" };
      case "invert":
        return { filter: "invert(1)" };
      case "sepia":
        return { filter: "sepia(1)" };
      default:
        return {};
    }
  }, [filter]);

  // Rotation style
  const rotationStyle = useMemo(
    () => ({ transform: `rotate(${rotation}deg)` }),
    [rotation],
  );

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
            <div
              className="glass w-full h-full p-2 flex items-center justify-center shadow-2xl"
              style={{ ...aspectStyle, ...filterStyle, ...rotationStyle }}
            >
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
                customColor={customColor}
                image={image}
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
                customColor={customColor}
                onCustomColorChange={setCustomColor}
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
                beatSyncMode={beatSyncMode}
                onBeatSyncModeChange={setBeatSyncMode}
                image={image}
                onImageUpload={handleImageUpload}
                autoColor={autoColor}
                onAutoColorChange={setAutoColor}
                fullscreen={fullscreen}
                onFullscreenChange={setFullscreen}
                aspect={aspect}
                onAspectChange={setAspect}
                rotation={rotation}
                onRotationChange={setRotation}
                filter={filter}
                onFilterChange={setFilter}
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
