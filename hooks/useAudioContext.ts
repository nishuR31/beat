import { useEffect, useRef, useState, useCallback } from "react";

interface UseAudioContextReturn {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  dataArray: Uint8Array | null;
  audioElement: HTMLAudioElement | null;
  playing: boolean;
  duration: number;
  currentTime: number;
  play: () => void;
  pause: () => void;
  stop: () => void;
  loadAudio: (file: File) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  seekTo: (time: number) => void;
}

export function useAudioContext(): UseAudioContextReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSource | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Initialize audio element (lazy initialize audio context on first play)
  useEffect(() => {
    // Only initialize on client side
    if (typeof window === "undefined") return;

    // Create audio element if not exists
    if (!audioElementRef.current) {
      audioElementRef.current = new Audio();
      audioElementRef.current.crossOrigin = "anonymous";
    }
  }, []);

  // Track audio playback
  useEffect(() => {
    const audioElement = audioElementRef.current;
    if (!audioElement) return;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleEnded = () => setPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audioElement.currentTime);
    const handleLoadedMetadata = () => setDuration(audioElement.duration);

    audioElement.addEventListener("play", handlePlay);
    audioElement.addEventListener("pause", handlePause);
    audioElement.addEventListener("ended", handleEnded);
    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audioElement.removeEventListener("play", handlePlay);
      audioElement.removeEventListener("pause", handlePause);
      audioElement.removeEventListener("ended", handleEnded);
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const play = useCallback(() => {
    const audioElement = audioElementRef.current;
    if (!audioElement) return;

    // Initialize audio context on first play
    if (!audioContextRef.current) {
      try {
        const audioContext = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const source = audioContext.createMediaElementSource(audioElement);
        const gainNode = audioContext.createGain();

        source.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(audioContext.destination);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        sourceRef.current = source;
        gainNodeRef.current = gainNode;
        dataArrayRef.current = dataArray;
      } catch (error) {
        console.error("[v0] Failed to initialize audio context:", error);
      }
    }

    const ctx = audioContextRef.current;
    if (ctx && ctx.state === "suspended") {
      ctx.resume();
    }
    audioElement.play().catch((error) => {
      console.error("[v0] Error playing audio:", error);
    });
  }, []);

  const pause = useCallback(() => {
    audioElementRef.current?.pause();
  }, []);

  const stop = useCallback(() => {
    const audioElement = audioElementRef.current;
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  }, []);

  const loadAudio = useCallback((file: File) => {
    const audioElement = audioElementRef.current;
    if (!audioElement) return;

    const url = URL.createObjectURL(file);
    audioElement.src = url;
    audioElement.load();
    setCurrentTime(0);
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = Math.max(0.25, Math.min(2, rate));
    }
  }, []);

  const seekTo = useCallback(
    (time: number) => {
      if (audioElementRef.current) {
        audioElementRef.current.currentTime = Math.max(
          0,
          Math.min(duration, time),
        );
      }
    },
    [duration],
  );

  return {
    audioContext: audioContextRef.current,
    analyser: analyserRef.current,
    dataArray: dataArrayRef.current,
    audioElement: audioElementRef.current,
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
  };
}
