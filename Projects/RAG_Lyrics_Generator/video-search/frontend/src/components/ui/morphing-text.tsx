"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Text whose container springs to the new string's width while the glyphs
 * crossfade. Borrowed wholesale from the pinned reference component, because
 * it is the right answer for a label that changes length in place -- the result
 * count, the transport readout -- and a jumping layout is the alternative.
 */
export function MorphingText({ text, className }: { text: string; className?: string }) {
  const [width, setWidth] = useState<number | "auto">("auto");
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (measureRef.current) setWidth(measureRef.current.offsetWidth);
  }, [text]);

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden",
        "transition-all duration-300 ease-[var(--ease-spring)]",
        className,
      )}
      style={{ width }}
    >
      <span ref={measureRef} className="invisible whitespace-nowrap">
        {text}
      </span>
      <span
        key={text}
        className="animate-in fade-in zoom-in-95 absolute inset-0 flex items-center justify-center whitespace-nowrap duration-300"
      >
        {text}
      </span>
    </span>
  );
}
