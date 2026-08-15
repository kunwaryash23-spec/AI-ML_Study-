"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { timecode } from "@/lib/time";
import type { Moment } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * The signature element: the recording as a strip of time, with the search
 * results pinned onto it.
 *
 * This is the whole product in one control. A list of timestamps tells you when
 * something was said; pins on a ribbon tell you *where in the recording* it
 * lives, how many times it recurs, and whether the matches cluster in the first
 * verse or spread across the whole thing. That reading is free here and
 * impossible in a list.
 *
 * The waveform is drawn on a canvas rather than as DOM bars, for a reason worth
 * remembering: a fixed number of flex children cannot survive a narrow
 * container -- 420 bars in a 310px phone ribbon round to zero width and the
 * waveform silently disappears. Canvas lets the bar count follow the measured
 * width, so the same data draws correctly at any size.
 *
 * When there is no decoded audio it draws a minute ruler and a centre line. It
 * never draws invented peaks: a fake waveform is a picture of data that does
 * not exist, and this interface does not do that.
 */

interface TimelineRibbonProps {
  duration: number;
  currentTime: number;
  peaks: number[] | null;
  moments: Moment[];
  activeMomentId: number | null;
  hoveredMomentId: number | null;
  seekable: boolean;
  onSeek: (seconds: number) => void;
  onPickMoment: (moment: Moment) => void;
  onHoverMoment: (id: number | null) => void;
}

const BAR_WIDTH = 2;
/** Height reserved at the bottom of the track for the ruler's timecodes. */
const LABEL_BAND = 18;
const BAR_GAP = 1;
// The played region is context; the pins and the playhead are the answer. Keep
// the field well below them or a pass of playback swallows every pin it crosses.
const PLAYED = "rgba(255, 176, 32, 0.30)";
const UNPLAYED = "rgba(246, 240, 228, 0.24)";

export function TimelineRibbon({
  duration,
  currentTime,
  peaks,
  moments,
  activeMomentId,
  hoveredMomentId,
  seekable,
  onSeek,
  onPickMoment,
  onHoverMoment,
}: TimelineRibbonProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const safeDuration = duration > 0 ? duration : 1;
  const progress = Math.min(1, Math.max(0, currentTime / safeDuration));

  /* -- measure ---------------------------------------------------------- */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  /* -- draw ------------------------------------------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !peaks || size.width === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(size.width * dpr);
    canvas.height = Math.floor(size.height * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size.width, size.height);

    const step = BAR_WIDTH + BAR_GAP;
    const barCount = Math.max(1, Math.floor(size.width / step));
    const bucket = peaks.length / barCount;
    // The waveform lives above the label band, so a ruler timecode is never
    // drawn over by a bar.
    const field = size.height - LABEL_BAND;
    const usable = field * 0.8;
    const midline = field / 2;
    const playedBars = Math.round(barCount * progress);

    for (let i = 0; i < barCount; i += 1) {
      // Take the loudest sample in this bar's slice, so transients survive
      // downsampling instead of being averaged into mush.
      let peak = 0;
      const from = Math.floor(i * bucket);
      const to = Math.max(from + 1, Math.floor((i + 1) * bucket));
      for (let j = from; j < to && j < peaks.length; j += 1) {
        if (peaks[j] > peak) peak = peaks[j];
      }

      const height = Math.max(2, peak * usable);
      ctx.fillStyle = i < playedBars ? PLAYED : UNPLAYED;
      ctx.beginPath();
      ctx.roundRect(i * step, midline - height / 2, BAR_WIDTH, height, 1);
      ctx.fill();
    }
  }, [peaks, progress, size]);

  /* -- scrubbing -------------------------------------------------------- */
  const positionFromEvent = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return 0;
      const { left, width } = track.getBoundingClientRect();
      return Math.min(1, Math.max(0, (clientX - left) / width)) * safeDuration;
    },
    [safeDuration],
  );

  const startScrub = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!seekable) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    onSeek(positionFromEvent(event.clientX));
  };

  const continueScrub = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!seekable || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    onSeek(positionFromEvent(event.clientX));
  };

  /* -- ruler: density follows the measured width, not the duration ------ */
  const ticks = useMemo(() => {
    const maxTicks = Math.max(2, Math.floor((size.width || 900) / 108));
    const candidates = [15, 30, 60, 120, 300, 600, 900, 1800, 3600];
    const step = candidates.find((s) => safeDuration / s <= maxTicks) ?? 3600;
    const marks: number[] = [];
    for (let t = step; t < safeDuration - step * 0.35; t += step) marks.push(t);
    return marks;
  }, [safeDuration, size.width]);

  return (
    <div className="relative">
      {/* pins sit above the track so a match at 00:00 is still reachable */}
      <div className="relative h-7">
        {moments.map((moment, index) => {
          const left = Math.min(99.6, (moment.start_time / safeDuration) * 100);
          const isActive = activeMomentId === moment.chunk_id;
          const isHovered = hoveredMomentId === moment.chunk_id;
          return (
            <button
              key={moment.chunk_id}
              type="button"
              onClick={() => onPickMoment(moment)}
              onMouseEnter={() => onHoverMoment(moment.chunk_id)}
              onMouseLeave={() => onHoverMoment(null)}
              onFocus={() => onHoverMoment(moment.chunk_id)}
              onBlur={() => onHoverMoment(null)}
              aria-label={`Moment at ${timecode(moment.start_time)}`}
              style={{
                left: `${left}%`,
                animationDelay: `${index * 55}ms`,
                animationFillMode: "backwards",
              }}
              className={cn(
                "group absolute bottom-0 flex h-7 w-8 -translate-x-1/2 cursor-pointer items-end justify-center",
                "animate-in fade-in slide-in-from-top-2 duration-500 ease-out",
                "rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
              )}
            >
              <span
                className={cn(
                  "block w-[2px] origin-bottom rounded-full transition-all duration-300 ease-[var(--ease-spring)]",
                  isActive
                    ? "h-6 bg-signal-bright"
                    : isHovered
                      ? "h-5 bg-signal"
                      : "h-4 bg-signal/70 group-hover:h-5 group-hover:bg-signal",
                )}
              />
              <span
                className={cn(
                  "absolute top-0 size-[7px] rounded-full transition-all duration-300 ease-[var(--ease-spring)]",
                  isActive || isHovered
                    ? "scale-100 bg-signal-bright opacity-100"
                    : "scale-0 bg-signal opacity-0 group-hover:scale-100 group-hover:opacity-100",
                )}
              />
            </button>
          );
        })}
      </div>

      {/* the track */}
      <div
        ref={trackRef}
        role={seekable ? "slider" : undefined}
        tabIndex={seekable ? 0 : -1}
        aria-label={seekable ? "Position in the recording" : undefined}
        aria-valuemin={seekable ? 0 : undefined}
        aria-valuemax={seekable ? Math.round(safeDuration) : undefined}
        aria-valuenow={seekable ? Math.round(currentTime) : undefined}
        aria-valuetext={seekable ? timecode(currentTime) : undefined}
        onPointerDown={startScrub}
        onPointerMove={continueScrub}
        onKeyDown={(event) => {
          if (!seekable) return;
          const jump = event.shiftKey ? 30 : 5;
          if (event.key === "ArrowRight") {
            event.preventDefault();
            onSeek(currentTime + jump);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            onSeek(currentTime - jump);
          }
          if (event.key === "Home") {
            event.preventDefault();
            onSeek(0);
          }
          if (event.key === "End") {
            event.preventDefault();
            onSeek(safeDuration);
          }
        }}
        className={cn(
          "relative h-16 overflow-hidden rounded-xl border border-line bg-ink-950/60 select-none sm:h-[76px]",
          seekable ? "cursor-pointer" : "cursor-default",
        )}
      >
        {/* ruler. Drawn last in z-order via the label band below, but the tick
            rules themselves sit under the waveform. */}
        <div className="pointer-events-none absolute inset-0 z-[1]">
          {ticks.map((t) => (
            <div
              key={t}
              style={{ left: `${(t / safeDuration) * 100}%` }}
              className="absolute inset-y-0 w-px bg-[rgba(246,240,228,0.07)]"
            >
              <span className="timecode absolute bottom-[3px] left-1.5 text-[0.5625rem] text-paper-mute">
                {timecode(t)}
              </span>
            </div>
          ))}
        </div>

        {peaks ? (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
            style={{ width: size.width, height: size.height }}
          />
        ) : (
          <>
            <div
              style={{ bottom: LABEL_BAND }}
              className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex items-center"
            >
              <span className="h-px w-full bg-[rgba(246,240,228,0.16)]" />
            </div>
            <div
              style={{ width: `${progress * 100}%`, bottom: LABEL_BAND }}
              className="pointer-events-none absolute top-0 left-0 z-[2] flex items-center bg-signal/10"
            >
              <span className="h-px w-full bg-signal/80" />
            </div>
          </>
        )}

        {/* playhead */}
        <div
          style={{ left: `${progress * 100}%` }}
          className="pointer-events-none absolute inset-y-0 z-[3] w-[2px] -translate-x-1/2 bg-signal-bright"
        >
          <span className="absolute -top-px left-1/2 size-2 -translate-x-1/2 rounded-full bg-signal-bright" />
        </div>
      </div>
    </div>
  );
}
