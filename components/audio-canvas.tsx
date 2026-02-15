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
  logo?: string | null;
  backgroundPalette?: string;
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
  logo,
  backgroundPalette,
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
    logo,
    backgroundPalette,
  });

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let prevWidth = 0;
    let prevHeight = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const newWidth = rect.width * dpr;
      const newHeight = rect.height * dpr;
      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
          ctx.scale(dpr, dpr);
        }
        prevWidth = newWidth;
        prevHeight = newHeight;
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
