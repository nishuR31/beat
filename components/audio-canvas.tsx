"use client";

import { useEffect, useRef } from "react";
import { useVisualization } from "@/hooks/useVisualization";
import { VisualizationStyle } from "@/lib/visualization-styles";
import { ColorScheme } from "@/lib/color-schemes";

interface AudioCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  analyser: AnalyserNode | null;
  dataArray: Uint8Array | null;
  style: VisualizationStyle;
  colorScheme: ColorScheme;
  beatGlowEnabled: boolean;
  particleEffectEnabled: boolean;
  mirrorEffect: boolean;
  sensitivity: number;
  smoothing: number;
  customColor?: string;
  image?: string | null;
}

export function AudioCanvas({
  canvasRef,
  analyser,
  dataArray,
  style,
  colorScheme,
  beatGlowEnabled,
  particleEffectEnabled,
  mirrorEffect,
  sensitivity,
  smoothing,
  customColor,
  image,
}: AudioCanvasProps) {
  useVisualization(canvasRef, {
    analyser,
    dataArray,
    style,
    colorScheme,
    beatGlowEnabled,
    particleEffectEnabled,
    mirrorEffect,
    sensitivity,
    smoothing,
    customColor,
    image,
  });

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    // Initial size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block rounded-2xl shadow-2xl"
      style={{
        aspectRatio: "16 / 9",
        minHeight: "400px",
        background: "rgba(255,0,204,0.08)",
        backdropFilter: "blur(12px) saturate(180%)",
        border: "2px solid rgba(255,0,204,0.18)",
      }}
    />
  );
}
