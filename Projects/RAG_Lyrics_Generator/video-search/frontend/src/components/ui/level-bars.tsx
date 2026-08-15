"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The five-bar meter from the pinned reference, doing double duty:
 *
 *   variant="scan"  -> the loading indicator while a search runs. Bars sweep
 *                      left to right like a needle passing over tape.
 *   variant="level" -> a live playback meter driven by an AnalyserNode.
 *   variant="rest"  -> idle, all bars at their floor.
 *
 * Both animated variants stop entirely under prefers-reduced-motion; the meter
 * is decoration, and decoration is the first thing that should hold still.
 */

const BAR_COUNT = 5;

export function LevelBars({
  variant = "rest",
  levels,
  className,
}: {
  variant?: "rest" | "scan" | "level";
  levels?: number[];
  className?: string;
}) {
  const [phase, setPhase] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (variant !== "scan") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let start: number | null = null;
    const tick = (now: number) => {
      start ??= now;
      setPhase(((now - start) / 620) % 1);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [variant]);

  const heightFor = (index: number) => {
    if (variant === "level" && levels) return 3 + Math.min(1, levels[index] ?? 0) * 15;
    if (variant === "scan") {
      const distance = Math.abs(index / (BAR_COUNT - 1) - phase);
      return 3 + Math.max(0, 1 - distance * 3.2) * 15;
    }
    return index === 2 ? 7 : 4;
  };

  return (
    <span
      className={cn("inline-flex h-5 items-center gap-[3px]", className)}
      aria-hidden="true"
    >
      {Array.from({ length: BAR_COUNT }, (_, index) => (
        <span
          key={index}
          className="w-[3px] rounded-full bg-current transition-[height] duration-100 ease-out"
          style={{ height: `${heightFor(index)}px` }}
        />
      ))}
    </span>
  );
}
