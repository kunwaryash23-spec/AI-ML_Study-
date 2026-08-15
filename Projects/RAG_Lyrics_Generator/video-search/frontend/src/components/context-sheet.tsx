"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CloseIcon, PlayIcon } from "@/components/ui/icons";
import { fetchContext } from "@/lib/api";
import { highlight } from "@/lib/highlight";
import { timecode } from "@/lib/time";
import type { ContextLine, Moment } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * "Read in context" — the shared-element FLIP transition from the pinned
 * reference, repurposed.
 *
 * In the original it grew an image thumbnail into a lightbox. Here it grows the
 * card's own button into a reading panel, which answers the question a
 * transcript search always raises next: *what was said around it?* Animating
 * from the pressed element keeps that answer attached to the moment it came
 * from instead of arriving as an unrelated dialog.
 */

const PANEL_WIDTH = 660;
/** The scroll body's own vertical padding (py-5, top + bottom). */
const BODY_PADDING = 40;

interface ContextSheetProps {
  moment: Moment;
  originRect: DOMRect;
  query: string;
  showSpeaker: boolean;
  canPlay: boolean;
  onPlay: (seconds: number) => void;
  onClose: () => void;
}

export function ContextSheet({
  moment,
  originRect,
  query,
  showSpeaker,
  canPlay,
  onPlay,
  onClose,
}: ContextSheetProps) {
  const [phase, setPhase] = useState<"opening" | "open" | "closing">("opening");
  const [target, setTarget] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [lines, setLines] = useState<ContextLine[] | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetchContext(moment.chunk_id)
      .then((result) => !cancelled && setLines(result))
      .catch(
        () =>
          !cancelled &&
          setLines([
            {
              chunk_id: moment.chunk_id,
              start_time: moment.start_time,
              timestamp: moment.timestamp,
              text: moment.text,
              speaker: moment.speaker,
              is_match: true,
            },
          ]),
      );
    return () => {
      cancelled = true;
    };
  }, [moment]);

  const layout = useCallback((measured?: number) => {
    const width = Math.min(window.innerWidth - 32, PANEL_WIDTH);
    const ceiling = Math.min(window.innerHeight - 96, 620);
    const height = Math.max(200, Math.min(measured ?? 420, ceiling));
    setTarget({
      top: (window.innerHeight - height) / 2,
      left: (window.innerWidth - width) / 2,
      width,
      height,
    });
  }, []);

  useEffect(() => {
    layout();
    const raf = requestAnimationFrame(() => setPhase("open"));
    return () => cancelAnimationFrame(raf);
  }, [layout]);

  /* The panel grows to fit the lines once they arrive, rather than sitting at a
     fixed height with dead space under three short paragraphs. Re-setting the
     target reuses the FLIP's own height transition, so it reads as one move.

     The measurement only works because the header and the content column are
     width-locked to the panel's FINAL width (see `columnWidth` below). Measured
     mid-FLIP, at the origin button's ~132px, the copy wraps many times over and
     the height clamps to the ceiling -- which is exactly the dead space this is
     here to prevent. */
  useEffect(() => {
    if (!lines) return;
    const frame = requestAnimationFrame(() => {
      const header = headerRef.current?.offsetHeight ?? 0;
      // The scroll container is a stretched flex child, so its own scrollHeight
      // reports the stretched box. Measure the content wrapper instead.
      const content = contentRef.current?.offsetHeight ?? 0;
      layout(header + content + BODY_PADDING);
    });
    return () => cancelAnimationFrame(frame);
  }, [layout, lines]);

  useEffect(() => {
    const onResize = () =>
      layout(
        (headerRef.current?.offsetHeight ?? 0) +
          (contentRef.current?.offsetHeight ?? 0) +
          BODY_PADDING,
      );
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [layout]);

  const close = useCallback(() => setPhase("closing"), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [close]);

  useEffect(() => {
    if (phase === "open") panelRef.current?.focus();
  }, [phase]);

  const isOpen = phase === "open";
  const isClosing = phase === "closing";

  const geometry =
    isOpen && target
      ? { ...target, radius: 24 }
      : {
          top: originRect.top,
          left: originRect.left,
          width: originRect.width,
          height: originRect.height,
          radius: 999,
        };

  /* Both inner regions render at the panel's final width from frame one; the
     panel's own `overflow: hidden` clips them while it grows. */
  const columnWidth = target?.width;

  const easing = isClosing ? "cubic-bezier(0.4, 0, 1, 1)" : "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
  const seconds = isClosing ? "0.26s" : "0.44s";
  const flip = (["top", "left", "width", "height", "border-radius"] as const)
    .map((property) => `${property} ${seconds} ${easing}`)
    .join(", ");

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Transcript context">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 cursor-default bg-ink-950/72 backdrop-blur-md transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0 }}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        onTransitionEnd={(event) => {
          if (phase === "closing" && event.propertyName === "top") onClose();
        }}
        style={{
          position: "fixed",
          top: geometry.top,
          left: geometry.left,
          width: geometry.width,
          height: geometry.height,
          borderRadius: geometry.radius,
          transition: flip,
          boxShadow: isOpen ? "0 40px 90px -30px rgba(0,0,0,1)" : "none",
        }}
        className="flex flex-col overflow-hidden border border-line-strong bg-ink-900 outline-none"
      >
        <div
          ref={headerRef}
          className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-4 transition-opacity duration-200 sm:px-6"
          style={{ opacity: isOpen ? 1 : 0, width: columnWidth }}
        >
          <div className="min-w-0">
            <p className="timecode text-[1.375rem] leading-none text-signal">
              {timecode(moment.start_time)}
            </p>
            <p className="mt-1.5 text-[0.75rem] tracking-[0.1em] text-paper-faint uppercase">
              In context
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {canPlay && (
              <button
                type="button"
                data-magnetic
                onClick={() => {
                  onPlay(moment.start_time);
                  close();
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-signal/45 bg-ink-850 py-2 pr-3.5 pl-3 text-[0.8125rem] font-semibold text-paper transition-colors duration-200 hover:border-signal/70 hover:bg-ink-800"
              >
                <span className="shrink-0 text-signal">
                  <PlayIcon size={13} />
                </span>
                Play from here
              </button>
            )}
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="grid size-9 place-items-center rounded-full text-paper-mute transition-colors duration-200 hover:bg-ink-800 hover:text-paper"
            >
              <CloseIcon size={16} />
            </button>
          </div>
        </div>

        <div
          className="field-scroll flex-1 overflow-y-auto px-5 py-5 transition-opacity duration-300 sm:px-6"
          style={{ opacity: isOpen ? 1 : 0, width: columnWidth }}
        >
          {lines === null ? (
            <div className="space-y-3" aria-busy="true">
              {[0, 1, 2].map((row) => (
                <div
                  key={row}
                  className="h-4 animate-pulse rounded bg-ink-800"
                  style={{ width: `${92 - row * 14}%`, animationDelay: `${row * 120}ms` }}
                />
              ))}
            </div>
          ) : (
            <div ref={contentRef} className="space-y-5">
              {lines.map((line) => {
                const runs = line.is_match ? highlight(line.text, query) : [{ text: line.text, match: false }];
                return (
                  <div key={line.chunk_id} className="flex gap-4">
                    <span
                      className={cn(
                        "timecode w-[62px] shrink-0 pt-[3px] text-[0.75rem]",
                        line.is_match ? "text-signal" : "text-paper-faint",
                      )}
                    >
                      {timecode(line.start_time)}
                    </span>
                    <div className="min-w-0 flex-1">
                      {showSpeaker && line.speaker && (
                        <p className="mb-1 text-[0.6875rem] font-semibold tracking-[0.14em] text-paper-faint uppercase">
                          {line.speaker}
                        </p>
                      )}
                      <p
                        className={cn(
                          "text-[1rem] leading-[1.7]",
                          line.is_match ? "text-paper" : "text-paper-faint",
                        )}
                      >
                        {runs.map((run, i) =>
                          run.match ? (
                            <mark
                              key={i}
                              className="box-decoration-clone rounded-[3px] bg-ink-750 px-[0.15em] text-paper shadow-[inset_0_0_0_1px_rgba(246,240,228,0.14)]"
                            >
                              {run.text}
                            </mark>
                          ) : (
                            <span key={i}>{run.text}</span>
                          ),
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
