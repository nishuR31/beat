'use client';

import { VisualizationStyle } from '@/lib/visualization-styles';
import { ColorScheme, allColorSchemes } from '@/lib/color-schemes';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Palette } from 'lucide-react';

interface VisualizationSettingsProps {
  style: VisualizationStyle;
  onStyleChange: (style: VisualizationStyle) => void;
  colorScheme: ColorScheme;
  onColorSchemeChange: (scheme: ColorScheme) => void;
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
}

const styles: VisualizationStyle[] = ['bars', 'circle', 'waveform', 'phonk', 'spiral'];

export function VisualizationSettings({
  style,
  onStyleChange,
  colorScheme,
  onColorSchemeChange,
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
}: VisualizationSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white">Visualization Style</label>
        <div className="grid grid-cols-2 gap-2">
          {styles.map((s) => (
            <button
              key={s}
              onClick={() => onStyleChange(s)}
              className={`py-2 px-3 rounded-lg capitalize text-sm font-medium transition-all ${
                style === s
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-gray-300'
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
                colorScheme === scheme
                  ? 'ring-2 ring-white'
                  : 'ring-1 ring-gray-600'
              }`}
              style={{
                background:
                  scheme === 'neon'
                    ? 'linear-gradient(90deg, #00ff88, #00ccff, #ff00ff)'
                    : scheme === 'cyberpunk'
                    ? 'linear-gradient(90deg, #ff006e, #8338ec, #3a86ff)'
                    : scheme === 'plasma'
                    ? 'linear-gradient(90deg, #ff006e, #ff6b9d, #ffa8c5)'
                    : scheme === 'warm'
                    ? 'linear-gradient(90deg, #ff6b35, #ff8c42, #ffc93c)'
                    : scheme === 'ocean'
                    ? 'linear-gradient(90deg, #0093e9, #80d0c7, #00c896)'
                    : 'linear-gradient(90deg, #ff6b6b, #feca57, #ff9ff3)',
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
              beatGlowEnabled
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-gray-300'
            }`}
          >
            <span>Beat Glow</span>
            {beatGlowEnabled && <Badge className="bg-white text-black">ON</Badge>}
          </button>

          <button
            onClick={() => onParticleEffectChange(!particleEffectEnabled)}
            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
              particleEffectEnabled
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-gray-300'
            }`}
          >
            <span>Particles</span>
            {particleEffectEnabled && <Badge className="bg-white text-black">ON</Badge>}
          </button>

          <button
            onClick={() => onMirrorEffectChange(!mirrorEffect)}
            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
              mirrorEffect
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-gray-300'
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
            <label className="text-sm font-semibold text-white">Beat Sensitivity</label>
            <span className="text-xs text-gray-400">{(sensitivity * 100).toFixed(0)}%</span>
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
            <label className="text-sm font-semibold text-white">Smoothing</label>
            <span className="text-xs text-gray-400">{(smoothing * 100).toFixed(0)}%</span>
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
