import { useEffect, useRef } from "react";
import {
  VisualizationStyle,
  VisualizationContext,
  Particle,
  drawBars,
  drawCircle,
  drawWaveform,
  drawPhonk,
  drawSpiral,
  drawClassicEq,
  drawSpectrum,
  drawDotMatrix,
  drawWaveGrid,
  updateAndDrawParticles,
  generateBeatParticles,
} from "@/lib/visualization-styles";
import { ColorScheme, createGradient } from "@/lib/color-schemes";
import { BeatDetector } from "@/lib/beat-detection";

export interface UseVisualizationOptions {
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
  beatSyncMode?: string;
  filter?: string;
  rotation?: number;
  aspect?: string;
  autoColor?: boolean;
  fullscreen?: boolean;
  logo?: string | null;
  backgroundPalette?: string;
  fps?: number;
  customBackground?: string;
  onBeat?: () => void;
}

export function useVisualization(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  options: UseVisualizationOptions,
) {
  const {
    analyser,
    dataArray,
    style,
    colorScheme,
    beatGlowEnabled,
    particleEffectEnabled,
    mirrorEffect,
    sensitivity,
    smoothing,
    logo,
    backgroundPalette,
    fps = 60,
    customBackground,
    onBeat,
  } = options;

  const particlesRef = useRef<Particle[]>([]);
  const beatGlowRef = useRef(0);
  const smoothedDataRef = useRef<Uint8Array | null>(null);
  const isBeatRef = useRef(false);
  const beatDetectorRef = useRef<BeatDetector | null>(null);
  const animationIdRef = useRef<number | null>(null);

  // Preload background and logo images for performance
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    beatDetectorRef.current = new BeatDetector({
      sensitivity,
      frequencyRange: { start: 0, end: 20 },
      debounceTime: 100,
    });
    return () => {
      beatDetectorRef.current?.reset();
    };
  }, [sensitivity]);

  useEffect(() => {
    if (dataArray) {
      smoothedDataRef.current = new Uint8Array(dataArray.length);
      for (let i = 0; i < dataArray.length; i++) {
        smoothedDataRef.current[i] = dataArray[i];
      }
    }
  }, [dataArray]);

  // Preload images
  useEffect(() => {
    if (customBackground && !customBackground.startsWith("#")) {
      const img = new window.Image();
      img.src = customBackground;
      bgImgRef.current = img;
    }
    if (logo) {
      const img = new window.Image();
      img.src = logo;
      logoImgRef.current = img;
    }
  }, [customBackground, logo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser || !dataArray) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastFrame = 0;
    const frameInterval = 1000 / fps;

    const animate = (now = 0) => {
      if (now - lastFrame < frameInterval) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrame = now;

      analyser.getByteFrequencyData(dataArray);

      // Smoothing
      if (smoothedDataRef.current) {
        for (let i = 0; i < dataArray.length; i++) {
          const smoothFactor = smoothing;
          smoothedDataRef.current[i] =
            smoothedDataRef.current[i] * smoothFactor +
            dataArray[i] * (1 - smoothFactor);
        }
      }

      // Clear/fade canvas
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(5, 5, 15, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Custom background
      if (customBackground) {
        if (customBackground.startsWith("#")) {
          ctx.save();
          ctx.globalAlpha = 1;
          ctx.fillStyle = customBackground;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.restore();
        } else if (bgImgRef.current && bgImgRef.current.complete) {
          ctx.save();
          ctx.globalAlpha = 0.2;
          ctx.drawImage(bgImgRef.current, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        }
      }

      // Beat detection
      let beatDetected = false;
      if (beatDetectorRef.current) {
        beatDetected = beatDetectorRef.current.detectBeat(dataArray);
        if (beatDetected) {
          beatGlowRef.current = 1;
          isBeatRef.current = true;
          if (particleEffectEnabled) {
            generateBeatParticles(
              { particles: particlesRef.current } as any,
              15,
            );
          }
          if (onBeat) onBeat();
          setTimeout(() => {
            isBeatRef.current = false;
          }, 100);
        }
      }

      // Decay beat glow
      beatGlowRef.current *= 0.95;

      // Create gradient
      const gradient = createGradient(
        ctx,
        colorScheme,
        canvas.width,
        canvas.height,
        "vertical",
      );

      // Visualization context
      const vizContext: VisualizationContext = {
        canvas,
        ctx,
        dataArray: smoothedDataRef.current || dataArray,
        analyser,
        width: canvas.width,
        height: canvas.height,
        gradient,
        beatGlow: beatGlowEnabled ? beatGlowRef.current : 0,
        particles: particlesRef.current,
        mirrorEffect,
        logo,
        backgroundPalette,
      };

      // Draw visualizer
      switch (style) {
        case "bars":
          drawBars(vizContext);
          break;
        case "circle":
          drawCircle(vizContext);
          break;
        case "waveform":
          drawWaveform(vizContext);
          break;
        case "phonk":
          drawPhonk(vizContext);
          break;
        case "spiral":
          drawSpiral(vizContext);
          break;
        case "classicEq":
          drawClassicEq(vizContext);
          break;
        case "spectrum":
          drawSpectrum(vizContext);
          break;
        case "dotMatrix":
          drawDotMatrix(vizContext);
          break;
        case "waveGrid":
          drawWaveGrid(vizContext);
          break;
      }

      // Draw logo
      if (logo && logoImgRef.current && logoImgRef.current.complete) {
        ctx.save();
        ctx.globalAlpha = 0.95;
        ctx.drawImage(
          logoImgRef.current,
          16,
          16,
          canvas.width * 0.12,
          canvas.width * 0.12,
        );
        ctx.restore();
      }

      // Draw particles
      if (particleEffectEnabled) {
        updateAndDrawParticles(vizContext);
      }

      // Mirror effect
      if (mirrorEffect && style !== "spiral") {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.scale(1, -1);
        ctx.translate(0, -canvas.height);
        switch (style) {
          case "bars":
            drawBars(vizContext);
            break;
          case "circle":
            drawCircle(vizContext);
            break;
          case "waveform":
            drawWaveform(vizContext);
            break;
          case "phonk":
            drawPhonk(vizContext);
            break;
        }
        ctx.globalAlpha = 1;
        ctx.scale(1, -1);
        ctx.translate(0, canvas.height);
        ctx.restore();
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [
    analyser,
    dataArray,
    style,
    colorScheme,
    beatGlowEnabled,
    particleEffectEnabled,
    mirrorEffect,
    smoothing,
    fps,
    customBackground,
    onBeat,
    logo,
    backgroundPalette,
  ]);

  return { isBeat: isBeatRef.current };
}
