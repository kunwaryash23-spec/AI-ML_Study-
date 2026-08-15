"use client";

import { forwardRef } from "react";
import { ArrowRightIcon, PlayIcon } from "@/components/ui/icons";
import { highlight } from "@/lib/highlight";
import { spokenTime, timecode } from "@/lib/time";
import type { Moment } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * One found moment.
 *
 * The timecode is the largest thing in the card, on purpose: it is the answer
 * the user came for. The transcript text is the evidence that the answer is
 * right. Everything else is quiet until hovered.
 *
 * The card is an `<article>`, not a `role="button"`. Wrapping two real buttons
 * in a button role collapses the whole card to one accessible name — the
 * highlighted words and both actions vanish for assistive tech. The click
 * handler stays as a mouse convenience; the keyboard path is the real buttons.
 *
 * Amber appears here only on the moment that is currently playing. It is the
 * page's notation for position, so a hover recolour of every timecode would
 * spend the meaning it carries.
 *
 * There is no score, no rank number, and no relevance bar. The order of the
 * cards already carries the ranking, and a number would only invite the user to
 * argue with it.
 */

interface ResultCardProps {
  moment: Moment;
  query: string;
  index: number;
  isActive: boolean;
  isFirst: boolean;
  showSpeaker: boolean;
  canPlay: boolean;
  onPlay: (moment: Moment) => void;
  onOpenContext: (moment: Moment, rect: DOMRect) => void;
  onHover: (id: number | null) => void;
}

export const ResultCard = forwardRef<HTMLElement, ResultCardProps>(function ResultCard(
  { moment, query, index, isActive, isFirst, showSpeaker, canPlay, onPlay, onOpenContext, onHover },
  ref,
) {
  const runs = highlight(moment.text, query);
  const label = timecode(moment.start_time);

  return (
    <article
      ref={ref}
      data-moment={moment.chunk_id}
      onClick={() => onPlay(moment)}
      onMouseEnter={() => onHover(moment.chunk_id)}
      onMouseLeave={() => onHover(null)}
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms`, animationFillMode: "backwards" }}
      className={cn(
        "group animate-in fade-in slide-in-from-bottom-3 relative cursor-pointer overflow-hidden",
        "rounded-[var(--radius-card)] border bg-ink-850 duration-500 ease-out",
        "shadow-card transition-[border-color,background-color,box-shadow,transform] duration-300 ease-out",
        "hover:-translate-y-px hover:bg-ink-800 hover:shadow-[var(--shadow-lift)]",
        isActive ? "border-signal/55 bg-ink-800" : "border-line hover:border-line-strong",
      )}
    >
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:gap-6 sm:p-5">
        {/* timecode gutter */}
        <div className="flex shrink-0 flex-row items-center gap-3 sm:w-[124px] sm:flex-col sm:items-start sm:gap-1.5">
          <span
            className={cn(
              "timecode text-[1.5rem] leading-none font-medium transition-colors duration-300 sm:text-[1.875rem]",
              isActive ? "text-signal-bright" : "text-paper",
            )}
          >
            {label}
          </span>

          {isFirst && (
            <span className="text-[0.625rem] font-semibold tracking-[0.16em] text-paper-faint uppercase">
              Closest
            </span>
          )}

          {showSpeaker && moment.speaker && (
            <span className="truncate text-[0.6875rem] font-semibold tracking-[0.14em] text-paper-faint uppercase">
              {moment.speaker}
            </span>
          )}
        </div>

        {/* the words */}
        <div className="min-w-0 flex-1">
          <p className="text-[1rem] leading-[1.62] text-paper-dim transition-colors duration-300 group-hover:text-paper sm:text-[1.0625rem] sm:leading-[1.65]">
            <span aria-hidden="true" className="text-paper-faint">
              “
            </span>
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
            <span aria-hidden="true" className="text-paper-faint">
              ”
            </span>
          </p>

          <div className="mt-3.5 flex items-center gap-1">
            <button
              type="button"
              data-play
              data-magnetic
              aria-label={`${canPlay ? "Play from" : "Open at"} ${spokenTime(moment.start_time)}`}
              onClick={(event) => {
                event.stopPropagation();
                onPlay(moment);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full py-1.5 pr-3 pl-2.5 text-[0.8125rem] font-semibold",
                "transition-colors duration-200",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
                isActive
                  ? "bg-signal text-ink-950"
                  : "bg-ink-750/70 text-paper-dim group-hover:bg-ink-750 group-hover:text-paper",
              )}
            >
              <span className={cn("shrink-0", isActive ? "text-ink-950" : "text-signal")}>
                {canPlay ? <PlayIcon size={13} /> : <ArrowRightIcon size={14} />}
              </span>
              <span aria-hidden="true">
                {canPlay ? "Play from" : "Open at"} <span className="timecode">{label}</span>
              </span>
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onOpenContext(moment, event.currentTarget.getBoundingClientRect());
              }}
              className="rounded-full px-3 py-1.5 text-[0.8125rem] font-medium text-paper-faint transition-colors duration-200 hover:bg-ink-750/70 hover:text-paper-dim focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
            >
              Read in context
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});
