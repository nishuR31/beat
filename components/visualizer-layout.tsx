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
  const [logo, setLogo] = useState<string | null>(null);
  const [backgroundPalette, setBackgroundPalette] = useState("Vaporwave");

  // Aspect ratio style
  const aspectStyle = useMemo(() => {
    switch (aspect) {
      case "4/3":
        return "aspect4x3";
      case "1/1":
        return "aspect1x1";
      case "21/9":
        return "aspect21x9";
      default:
        return "aspect16x9";
    }
  }, [aspect]);

  // Image color extraction (auto color)
  const handleImageUpload = (img: string) => {
    setImage(img);
    if (autoColor) {
      // Extract dominant color (simple average, can be improved)
      const imageEl = new globalThis.Image();
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

  // File load handler for AudioControlPanel
  const handleFileLoad = (file: File) => {
    loadAudio(file);
  };
  // Sidebar state for mobile (must be before any JSX usage)
  // Sidebar state for mobile (only declare once at the top)
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // ...existing code...

  // Filter style
  const filterStyle = useMemo(() => {
    switch (filter) {
      case "blur":
        return "filterBlur";
      case "grayscale":
        return "filterGrayscale";
      case "invert":
        return "filterInvert";
      case "sepia":
        return "filterSepia";
      default:
        return "filterNone";
    }
  }, [filter]);

  // Rotation style
  const rotationStyle = useMemo(() => {
    // Only a few rotation classes for simplicity
    if (rotation === 0) return "rotate0";
    // Add more as needed
    return "";
  }, [rotation]);

  // Sidebar state for mobile
  // (Removed duplicate sidebarOpen declaration)

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Header */}
      <header className="glass mb-4 mt-2 mx-auto max-w-4xl w-full">
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
          {/* Sidebar toggle for mobile */}
          <button
            className="ml-auto lg:hidden p-2 rounded bg-pink-600 text-white hover:bg-pink-700 focus:outline-none"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle settings sidebar"
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-stretch justify-center px-2 py-4 gap-4">
        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className={`glass w-full h-full flex items-center justify-center shadow-2xl canvasContainer ${aspectStyle} ${filterStyle} ${rotationStyle}`}
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
              logo={logo}
              backgroundPalette={backgroundPalette}
            />
          </div>
        </div>
        {/* Sidebar: Settings and Controls */}
        <aside
          className={`fixed top-0 right-0 z-40 h-screen w-80 max-w-full bg-slate-900 bg-opacity-95 shadow-2xl border-l border-pink-400 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
            lg:static lg:translate-x-0 lg:w-96 lg:max-w-xs lg:h-auto lg:bg-transparent lg:shadow-none lg:border-0 flex flex-col gap-6 p-4 min-w-72 overflow-y-auto lg:overflow-visible`}
          style={{
            maxHeight: "100dvh",
            height: "100dvh",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Close button for mobile sidebar */}
          <button
            className="lg:hidden self-end mb-2 p-2 rounded bg-pink-600 text-white hover:bg-pink-700 focus:outline-none"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
          {/* Audio Controls */}
          <div className="glass p-4 shadow-xl">
            <h2 className="text-lg font-bold magenta-text mb-2 uppercase tracking-wide">
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
          <div className="glass p-4 shadow-xl">
            <h2 className="text-lg font-bold magenta-text mb-2 uppercase tracking-wide">
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
              logo={logo}
              onLogoUpload={setLogo}
              backgroundPalette={backgroundPalette}
              onBackgroundPaletteChange={setBackgroundPalette}
            />
          </div>
          {/* Video Export */}
          <div className="glass p-4 shadow-xl">
            <h2 className="text-lg font-bold magenta-text mb-2 uppercase tracking-wide">
              Export
            </h2>
            <VideoExport
              canvasRef={canvasRef}
              audioElement={audioElement}
              playing={playing}
            />
          </div>
        </aside>
      </main>
      <footer className="glass mt-8 mx-auto max-w-4xl w-full">
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
