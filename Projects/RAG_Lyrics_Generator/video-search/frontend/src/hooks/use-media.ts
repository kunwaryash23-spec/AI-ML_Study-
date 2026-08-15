"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Playback for the indexed recording.
 *
 * Three things this hook is careful about:
 *
 * 1. `currentTime` is polled with requestAnimationFrame rather than the
 *    `timeupdate` event. The browser fires `timeupdate` roughly 4x a second,
 *    which is fine for a digital clock and visibly jerky for a playhead.
 * 2. The waveform is decoded from the real file. If we cannot decode it, the
 *    timeline falls back to a ruler -- it never draws invented peaks, because a
 *    fake waveform is a picture of data that does not exist.
 * 3. The AnalyserNode is optional and wrapped in try/catch. Attaching Web Audio
 *    to a media element can fail (autoplay policy, CORS, unsupported codec) and
 *    losing the level meter must never cost you playback.
 */

export interface MediaState {
  available: boolean;
  ready: boolean;
  playing: boolean;
  currentTime: number;
  duration: number;
  peaks: number[] | null;
  levels: number[];
  error: string | null;
}

const PEAK_COUNT = 420;
const BAND_COUNT = 5;

export function useMedia(url: string | null | undefined, fallbackDuration: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const frameRef = useRef<number | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(fallbackDuration);
  const [peaks, setPeaks] = useState<number[] | null>(null);
  const [levels, setLevels] = useState<number[]>(() => new Array(BAND_COUNT).fill(0));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setDuration((prev) => (prev > 0 ? prev : fallbackDuration)), [fallbackDuration]);

  /* -- element ---------------------------------------------------------- */
  useEffect(() => {
    if (!url) {
      audioRef.current = null;
      setReady(false);
      return;
    }

    const audio = new Audio(url);
    audio.preload = "metadata";
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const onLoaded = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) setDuration(audio.duration);
      setReady(true);
      setError(null);
    };
    const onEnded = () => setPlaying(false);
    const onError = () => {
      setReady(false);
      setError("This recording could not be loaded.");
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
      audioRef.current = null;
    };
  }, [url]);

  /* -- real waveform peaks --------------------------------------------- */
  useEffect(() => {
    if (!url) {
      setPeaks(null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("fetch failed");
        const buffer = await response.arrayBuffer();

        const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        const decoded = await ctx.decodeAudioData(buffer);
        void ctx.close();
        if (cancelled) return;

        const channel = decoded.getChannelData(0);
        const step = Math.floor(channel.length / PEAK_COUNT) || 1;
        const next: number[] = [];
        let ceiling = 0;

        for (let i = 0; i < PEAK_COUNT; i += 1) {
          let peak = 0;
          const start = i * step;
          for (let j = 0; j < step; j += 32) {
            const value = Math.abs(channel[start + j] ?? 0);
            if (value > peak) peak = value;
          }
          ceiling = Math.max(ceiling, peak);
          next.push(peak);
        }

        // Normalise so a quietly mastered file still fills the ribbon.
        setPeaks(ceiling > 0 ? next.map((v) => v / ceiling) : null);
        if (Number.isFinite(decoded.duration) && decoded.duration > 0) setDuration(decoded.duration);
      } catch {
        if (!cancelled) setPeaks(null); // ruler fallback, not fake peaks
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url]);

  /* -- playhead + level meter ------------------------------------------ */
  useEffect(() => {
    if (!playing) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      setLevels(new Array(BAND_COUNT).fill(0));
      return;
    }

    const bins = analyserRef.current ? new Uint8Array(analyserRef.current.frequencyBinCount) : null;

    const tick = () => {
      const audio = audioRef.current;
      if (audio) setCurrentTime(audio.currentTime);

      const analyser = analyserRef.current;
      if (analyser && bins) {
        analyser.getByteFrequencyData(bins);
        const width = Math.floor(bins.length / BAND_COUNT);
        const next: number[] = [];
        for (let band = 0; band < BAND_COUNT; band += 1) {
          let sum = 0;
          for (let i = 0; i < width; i += 1) sum += bins[band * width + i];
          // Raw FFT magnitudes on speech and quiet masters sit near the floor,
          // which renders as five identical dots. Boost, then clamp.
          next.push(Math.min(1, (sum / width / 255) * 2.1));
        }
        setLevels(next);
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [playing]);

  const attachAnalyser = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || ctxRef.current) return;
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const source = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
    } catch {
      // Meter unavailable. Playback is unaffected.
    }
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    attachAnalyser();
    void ctxRef.current?.resume();
    try {
      await audio.play();
      setPlaying(true);
      setError(null);
    } catch {
      setPlaying(false);
      setError("Playback was blocked. Press play again.");
    }
  }, [attachAnalyser]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (playing) pause();
    else void play();
  }, [pause, play, playing]);

  const seek = useCallback(
    (seconds: number) => {
      const clamped = Math.max(0, Math.min(seconds, duration || seconds));
      setCurrentTime(clamped);
      const audio = audioRef.current;
      if (audio) audio.currentTime = clamped;
    },
    [duration],
  );

  const playFrom = useCallback(
    (seconds: number) => {
      seek(seconds);
      if (audioRef.current) void play();
    },
    [play, seek],
  );

  const nudge = useCallback((delta: number) => seek(currentTime + delta), [currentTime, seek]);

  const state: MediaState = useMemo(
    () => ({
      available: Boolean(url),
      ready,
      playing,
      currentTime,
      duration: duration || fallbackDuration,
      peaks,
      levels,
      error,
    }),
    [currentTime, duration, error, fallbackDuration, levels, peaks, playing, ready, url],
  );

  return { ...state, play, pause, toggle, seek, playFrom, nudge };
}

export type MediaController = ReturnType<typeof useMedia>;
