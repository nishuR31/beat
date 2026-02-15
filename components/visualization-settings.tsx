"use client";

import { VisualizationStyle } from "@/lib/visualization-styles";
import { ColorScheme, allColorSchemes } from "@/lib/color-schemes";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Palette } from "lucide-react";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Fullscreen,
  Image as ImageIcon,
  RotateCw,
  SlidersHorizontal,
  Filter,
  Eye,
} from "lucide-react";

interface VisualizationSettingsProps {
  style: VisualizationStyle;
  onStyleChange: (style: VisualizationStyle) => void;
  colorScheme: ColorScheme;
  onColorSchemeChange: (scheme: ColorScheme) => void;
  customColor: string;
  onCustomColorChange: (color: string) => void;
  beatGlowEnabled: boolean;
  onBeatGlowChange: (enabled: boolean) => void;
  particleEffectEnabled: boolean;
  onParticleEffectChange: (enabled: boolean) => void;
  mirrorEffect: boolean;
  onMirrorEffectChange: (enabled: boolean) => void;
  sensitivity: number;
  onSensitivityChange: (value: number) => void;
  smoothing: number;
  onSmoothingChange: (value: number) => void;
  beatSyncMode: string;
  onBeatSyncModeChange: (mode: string) => void;
  image: string | null;
  onImageUpload: (img: string) => void;
  autoColor: boolean;
  onAutoColorChange: (enabled: boolean) => void;
  fullscreen: boolean;
  onFullscreenChange: (enabled: boolean) => void;
  aspect: string;
  onAspectChange: (aspect: string) => void;
  rotation: number;
  onRotationChange: (value: number) => void;
  filter: string;
  onFilterChange: (filter: string) => void;
}

const styles: VisualizationStyle[] = [
  "bars",
  "circle",
  "waveform",
  "phonk",
  "spiral",
  "classicEq",
  "spectrum",
  "dotMatrix",
  "waveGrid",
];

const backgroundPalettes = [
  { name: "Vaporwave", colors: ["#ff8ae2", "#8afff7", "#fff685", "#ffb86b"] },
  { name: "Cyberpunk", colors: ["#ff005c", "#00fff7", "#fffd37", "#ff00ea"] },
  { name: "Sunset", colors: ["#ff6e7f", "#bfe9ff", "#f9d423", "#ff4e50"] },
  { name: "Aurora", colors: ["#00c3ff", "#ffff1c", "#ff61a6", "#a200ff"] },
  { name: "Mono", colors: ["#22223b", "#4a4e69", "#9a8c98", "#c9ada7"] },
];

export function VisualizationSettings({
  style,
  onStyleChange,
  colorScheme,
  onColorSchemeChange,
  customColor,
  onCustomColorChange,
  beatGlowEnabled,
  onBeatGlowChange,
  particleEffectEnabled,
  onParticleEffectChange,
  mirrorEffect,
  onMirrorEffectChange,
  sensitivity,
  onSensitivityChange,
  smoothing,
  onSmoothingChange,
  beatSyncMode,
  onBeatSyncModeChange,
  image,
  onImageUpload,
  autoColor,
  onAutoColorChange,
  fullscreen,
  onFullscreenChange,
  aspect,
  onAspectChange,
  rotation,
  onRotationChange,
  filter,
  onFilterChange,
  logo,
  onLogoUpload,
  backgroundPalette,
  onBackgroundPaletteChange,
}: VisualizationSettingsProps & {
  logo: string | null;
  onLogoUpload: (img: string) => void;
  backgroundPalette: string;
  onBackgroundPaletteChange: (palette: string) => void;
}) {
  {
    /* Logo Upload */
  }
  <div className="space-y-2">
    <label className="text-sm font-semibold text-white flex items-center gap-2">
      <ImageIcon className="w-4 h-4" /> Logo Image
    </label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            if (ev.target?.result) onLogoUpload(ev.target.result as string);
          };
          reader.readAsDataURL(file);
        }
      }}
    />
    {logo && (
      <img
        src={logo}
        alt="Logo"
        className="w-16 h-16 object-contain rounded-lg mt-2 bg-white/10"
      />
    )}
  </div>;
  {
    /* Background Palette Selector */
  }
  <div className="space-y-2">
    <label className="text-sm font-semibold text-white flex items-center gap-2">
      <Palette className="w-4 h-4" /> Background Palette
    </label>
    <div className="flex flex-wrap gap-2">
      {backgroundPalettes.map((p) => (
        <button
          key={p.name}
          onClick={() => onBackgroundPaletteChange(p.name)}
          className={`rounded-lg px-3 py-2 text-xs font-medium ${backgroundPalette === p.name ? "ring-2 ring-white" : "ring-1 ring-gray-600"} flex items-center gap-1`}
          style={{
            background: `linear-gradient(90deg, ${p.colors.join(", ")})`,
          }}
        >
          {p.name}
        </button>
      ))}
    </div>
  </div>;
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-4">
      {/* Beat Sync Options */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white">Beat Sync</label>
        <select
          className="w-full rounded-lg bg-slate-800 text-white p-2"
          value={beatSyncMode}
          onChange={(e) => onBeatSyncModeChange(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="kick">Kick</option>
          <option value="snare">Snare</option>
          <option value="hihat">Hi-Hat</option>
        </select>
      </div>
      {/* Custom Color Picker */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white flex items-center gap-2">
          🎨 Custom Color
        </label>
        <input
          type="color"
          value={customColor}
          onChange={(e) => onCustomColorChange(e.target.value)}
          className="w-12 h-8 p-0 border-none bg-transparent"
        />
      </div>
      {/* Image Upload & Auto Color */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> Image Upload
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => {
                if (ev.target?.result)
                  onImageUpload(ev.target.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
          className="hidden"
        />
        <button
          className="w-full py-2 px-3 rounded-lg bg-slate-800 text-white"
          onClick={() => fileInputRef.current?.click()}
        >
          {image ? "Change Image" : "Upload Image"}
        </button>
        {image && (
          <img
            src={image}
            alt="Uploaded"
            className="w-full h-24 object-cover rounded-lg mt-2"
          />
        )}
        <div className="flex items-center gap-2 mt-2">
          <Switch checked={autoColor} onCheckedChange={onAutoColorChange} />
          <span className="text-xs text-white">Auto Color from Image</span>
        </div>
      </div>
      {/* Fullscreen & Aspect Ratio */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white flex items-center gap-2">
          <Fullscreen className="w-4 h-4" /> Fullscreen
        </label>
        <Switch checked={fullscreen} onCheckedChange={onFullscreenChange} />
        <label className="text-sm font-semibold text-white flex items-center gap-2 mt-2">
          Aspect Ratio
        </label>
        <select
          className="w-full rounded-lg bg-slate-800 text-white p-2"
          value={aspect}
          onChange={(e) => onAspectChange(e.target.value)}
        >
          <option value="16/9">16:9 (YouTube)</option>
          <option value="9/16">9:16 (TikTok/Reels)</option>
          <option value="1/1">1:1 (Instagram Square)</option>
          <option value="4/5">4:5 (Instagram Portrait)</option>
          <option value="5/4">5:4</option>
          <option value="2/3">2:3</option>
          <option value="4/3">4:3</option>
          <option value="21/9">21:9</option>
        </select>
      </div>
      {/* Rotation, Effects, Filters */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white flex items-center gap-2">
          <RotateCw className="w-4 h-4" /> Rotation
        </label>
        <Slider
          value={[rotation]}
          min={0}
          max={360}
          step={1}
          onValueChange={(v) => onRotationChange(v[0])}
          className="w-full"
        />
        <label className="text-sm font-semibold text-white flex items-center gap-2 mt-2">
          <Filter className="w-4 h-4" /> Filter
        </label>
        <select
          className="w-full rounded-lg bg-slate-800 text-white p-2"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="none">None</option>
          <option value="blur">Blur</option>
          <option value="grayscale">Grayscale</option>
          <option value="invert">Invert</option>
          <option value="sepia">Sepia</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white">
          Visualization Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {styles.map((s) => (
            <button
              key={s}
              onClick={() => onStyleChange(s)}
              className={`py-2 px-3 rounded-lg capitalize text-sm font-medium transition-all ${
                style === s ?
                  "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                : "bg-slate-800 hover:bg-slate-700 text-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-white flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Color Scheme
        </label>
        <div className="grid grid-cols-3 gap-2">
          {allColorSchemes.map((scheme) => (
            <button
              key={scheme}
              onClick={() => onColorSchemeChange(scheme)}
              className={`py-2 px-2 rounded-lg capitalize text-xs font-medium transition-all ${
                colorScheme === scheme ? "ring-2 ring-white" : (
                  "ring-1 ring-gray-600"
                )
              }`}
              style={{
                background:
                  scheme === "neon" ?
                    "linear-gradient(90deg, #00ff88, #00ccff, #ff00ff)"
                  : scheme === "cyberpunk" ?
                    "linear-gradient(90deg, #ff006e, #8338ec, #3a86ff)"
                  : scheme === "plasma" ?
                    "linear-gradient(90deg, #ff006e, #ff6b9d, #ffa8c5)"
                  : scheme === "warm" ?
                    "linear-gradient(90deg, #ff6b35, #ff8c42, #ffc93c)"
                  : scheme === "ocean" ?
                    "linear-gradient(90deg, #0093e9, #80d0c7, #00c896)"
                  : "linear-gradient(90deg, #ff6b6b, #feca57, #ff9ff3)",
              }}
              title={scheme}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Effects
          </label>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onBeatGlowChange(!beatGlowEnabled)}
            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
              beatGlowEnabled ?
                "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
              : "bg-slate-800 hover:bg-slate-700 text-gray-300"
            }`}
          >
            <span>Beat Glow</span>
            {beatGlowEnabled && (
              <Badge className="bg-white text-black">ON</Badge>
            )}
          </button>

          <button
            onClick={() => onParticleEffectChange(!particleEffectEnabled)}
            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
              particleEffectEnabled ?
                "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "bg-slate-800 hover:bg-slate-700 text-gray-300"
            }`}
          >
            <span>Particles</span>
            {particleEffectEnabled && (
              <Badge className="bg-white text-black">ON</Badge>
            )}
          </button>

          <button
            onClick={() => onMirrorEffectChange(!mirrorEffect)}
            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
              mirrorEffect ?
                "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
              : "bg-slate-800 hover:bg-slate-700 text-gray-300"
            }`}
          >
            <span>Mirror</span>
            {mirrorEffect && <Badge className="bg-white text-black">ON</Badge>}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-white">
              Beat Sensitivity
            </label>
            <span className="text-xs text-gray-400">
              {(sensitivity * 100).toFixed(0)}%
            </span>
          </div>
          <Slider
            value={[sensitivity]}
            min={0}
            max={1}
            step={0.05}
            onValueChange={(value) => onSensitivityChange(value[0])}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-white">
              Smoothing
            </label>
            <span className="text-xs text-gray-400">
              {(smoothing * 100).toFixed(0)}%
            </span>
          </div>
          <Slider
            value={[smoothing]}
            min={0.5}
            max={1}
            step={0.05}
            onValueChange={(value) => onSmoothingChange(value[0])}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
