"use client";

import { AlertIcon, LensIcon, RetryIcon } from "@/components/ui/icons";
import { LevelBars } from "@/components/ui/level-bars";
import { cn } from "@/lib/utils";

/**
 * The states that are not "here are your results".
 *
 * Each one answers a different question and none of them mentions the machine.
 * "No matching section found" is the product's language; "0 chunks above
 * threshold 0.02" is the engine's, and the user is not debugging the engine.
 *
 * All of them sit on the page's left axis. A centred block under a left-aligned
 * RESULTS rule reads as two different pages.
 */

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 flex flex-col items-start py-9 text-left duration-500 ease-out sm:py-11",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Before the first search. */
export function EmptyState({ momentCount }: { momentCount: number }) {
  return (
    <Frame>
      <span className="grid size-12 place-items-center rounded-2xl border border-line-strong bg-ink-900 text-paper-dim">
        <LensIcon size={22} />
      </span>
      <h3 className="mt-5 text-[1.25rem] font-semibold tracking-[-0.02em] text-paper sm:text-[1.375rem]">
        Nothing searched yet
      </h3>
      <p className="mt-2 max-w-[42ch] text-[0.9375rem] leading-relaxed text-paper-mute">
        Type a phrase, a topic, or a whole sentence. Matching sections come back with the
        timestamp where they were said.
      </p>
      {momentCount > 0 && (
        <p className="timecode mt-5 text-[0.6875rem] tracking-[0.08em] text-paper-faint">
          {momentCount} SECTIONS INDEXED
        </p>
      )}
    </Frame>
  );
}

/** While a search is in flight. */
export function SearchingState() {
  return (
    <Frame className="flex-row items-center gap-3.5 py-10 sm:py-12">
      <LevelBars variant="scan" className="h-6 text-paper-dim" />
      <p className="text-[0.9375rem] text-paper-dim">Searching transcript…</p>
    </Frame>
  );
}

/** A search that found nothing worth showing. */
export function NoResultsState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <Frame>
      <h3 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-paper sm:text-[1.375rem]">
        No matching section found
      </h3>
      <p className="mt-2 max-w-[44ch] text-[0.9375rem] leading-relaxed text-paper-mute">
        Nothing in this recording matches <span className="text-paper-dim">“{query}”</span>. Try
        different words, or a broader phrase.
      </p>
      <button
        type="button"
        data-magnetic
        onClick={onClear}
        className="mt-6 rounded-full border border-line-strong px-5 py-2.5 text-[0.875rem] font-semibold text-paper-dim transition-colors duration-200 hover:border-paper/25 hover:bg-ink-850 hover:text-paper"
      >
        Start over
      </button>
    </Frame>
  );
}

/** Backend or network failure. Never a stack trace. */
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Frame>
      <span className="grid size-12 place-items-center rounded-2xl border border-line-strong bg-ink-900 text-paper-dim">
        <AlertIcon size={22} />
      </span>
      <h3 className="mt-5 text-[1.25rem] font-semibold tracking-[-0.02em] text-paper sm:text-[1.375rem]">
        Something went wrong
      </h3>
      <p className="mt-2 max-w-[40ch] text-[0.9375rem] leading-relaxed text-paper-mute">
        The search did not come back. Nothing was lost — try it again.
      </p>
      <button
        type="button"
        data-magnetic
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-[0.875rem] font-semibold text-paper-dim transition-colors duration-200 hover:border-paper/25 hover:bg-ink-850 hover:text-paper"
      >
        <RetryIcon size={15} />
        Try again
      </button>
    </Frame>
  );
}

/** No transcript indexed at all — a setup problem, said plainly. */
export function NoIndexState() {
  return (
    <Frame>
      <span className="grid size-12 place-items-center rounded-2xl border border-line-strong bg-ink-900 text-paper-dim">
        <AlertIcon size={22} />
      </span>
      <h3 className="mt-5 text-[1.25rem] font-semibold tracking-[-0.02em] text-paper sm:text-[1.375rem]">
        No transcript is indexed
      </h3>
      <p className="mt-2 max-w-[44ch] text-[0.9375rem] leading-relaxed text-paper-mute">
        Point the server at a timestamped transcript and restart it. Until then there is nothing
        to search.
      </p>
    </Frame>
  );
}
