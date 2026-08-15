"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ContextSheet } from "@/components/context-sheet";
import { MediaDeck } from "@/components/media-deck";
import { ResultCard } from "@/components/result-card";
import {
  EmptyState,
  ErrorState,
  NoIndexState,
  NoResultsState,
  SearchingState,
} from "@/components/states";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";
import { MorphingText } from "@/components/ui/morphing-text";
import { type SearchFieldHandle, SearchField } from "@/components/ui/search-field";
import { useMedia } from "@/hooks/use-media";
import { SearchError, fetchSource, isDegraded, search } from "@/lib/api";
import { SAMPLE_SOURCE } from "@/lib/sample";
import type { Moment, SearchStatus, Source } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function App() {
  const [source, setSource] = useState<Source | null>(null);
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [moments, setMoments] = useState<Moment[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [context, setContext] = useState<{ moment: Moment; rect: DOMRect } | null>(null);
  const [offline, setOffline] = useState(false);

  const fieldRef = useRef<SearchFieldHandle>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroHeight, setHeroHeight] = useState(0);
  const cardRefs = useRef<Map<number, HTMLElement>>(new Map());
  const resultsRef = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);

  const media = useMedia(source?.media_url, source?.duration ?? 0);

  /* The hero collapses on search. Its height is measured rather than guessed:
     a hard max-height clips its own bottom padding at wide breakpoints, and one
     extra line of copy would clip the copy itself. */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    // borderBoxSize, not contentRect: contentRect excludes the hero's own
    // pt-14/pb-11, so measuring it clips 100px of padding off the collapse
    // ceiling and cuts the last line of copy.
    const observer = new ResizeObserver(([entry]) =>
      setHeroHeight(entry.borderBoxSize?.[0]?.blockSize ?? hero.offsetHeight),
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  /* -- what is indexed -------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;
    fetchSource().then((result) => {
      if (cancelled) return;
      setSource(result);
      setOffline(isDegraded());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /* -- "/" focuses the field, the way a search tool should --------------- */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";
      if (event.key === "/" && !typing && !context) {
        event.preventDefault();
        fieldRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [context]);

  const runSearch = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const id = ++requestId.current;
    setSubmitted(trimmed);
    setStatus("searching");
    setActiveId(null);

    try {
      const results = await search(trimmed);
      if (id !== requestId.current) return; // a newer search already won
      setMoments(results);
      setStatus(results.length > 0 ? "results" : "empty");
      setOffline(isDegraded());
    } catch (error) {
      if (id !== requestId.current) return;
      setMoments([]);
      setStatus(error instanceof SearchError && error.kind === "no-index" ? "error" : "error");
    }
  }, []);

  const cancelSearch = useCallback(() => {
    requestId.current += 1;
    setStatus(moments.length > 0 ? "results" : "idle");
  }, [moments.length]);

  const reset = useCallback(() => {
    requestId.current += 1;
    setQuery("");
    setSubmitted("");
    setMoments([]);
    setStatus("idle");
    setActiveId(null);
    fieldRef.current?.focus();
  }, []);

  const playMoment = useCallback(
    (moment: Moment) => {
      setActiveId(moment.chunk_id);
      if (media.available) media.playFrom(moment.start_time);
      cardRefs.current.get(moment.chunk_id)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    },
    [media],
  );

  /* -- up/down walks the results ----------------------------------------
     The focusable thing in a card is its play button, not the card: the card is
     an <article> so that its two real controls survive for assistive tech. */
  const playButtonFor = (id: number) =>
    cardRefs.current.get(id)?.querySelector<HTMLButtonElement>("button[data-play]") ?? null;

  const onResultsKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const order = moments.map((m) => m.chunk_id);
    const current = order.findIndex((id) => playButtonFor(id) === document.activeElement);
    const next = event.key === "ArrowDown" ? current + 1 : current - 1;

    if (next < 0) {
      event.preventDefault();
      fieldRef.current?.focus();
      return;
    }
    const targetId = order[next];
    if (targetId === undefined) return;
    event.preventDefault();
    playButtonFor(targetId)?.focus();
  };

  const showSpeakers = (source?.speakers.length ?? 0) > 1;
  const heroOpen = status === "idle" && moments.length === 0;
  const indexed = source?.indexed ?? true;

  const resultLabel = useMemo(() => {
    if (moments.length === 0) return "";
    return `${moments.length} ${moments.length === 1 ? "moment" : "moments"}`;
  }, [moments.length]);

  return (
    <MagneticCursor>
      <div className="room grain relative min-h-dvh overflow-x-hidden">
        {/* --------------------------------------------------------------
            Top rail. Subtle branding, one keyboard hint, nothing else.
            -------------------------------------------------------------- */}
        <header className="relative z-20 border-b border-line">
          <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-5 py-4 sm:px-8 sm:py-5">
            <a
              href="/"
              data-magnetic
              className="group flex items-baseline gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
            >
              <span className="text-[0.9375rem] font-bold tracking-[-0.02em] text-paper">
                Video Search
              </span>
              <span className="timecode hidden text-[0.625rem] tracking-[0.1em] text-paper-faint sm:inline">
                TRANSCRIPT INDEX
              </span>
            </a>

            <div className="flex items-center gap-3">
              {offline && (
                <span className="rounded-full border border-line-strong bg-ink-850 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.06em] text-paper-mute uppercase">
                  Offline sample
                </span>
              )}
              <p className="hidden items-center gap-1.5 text-[0.75rem] text-paper-faint sm:flex">
                Press
                <kbd className="timecode rounded-md border border-line-strong bg-ink-850 px-1.5 py-0.5 text-[0.6875rem] text-paper-dim">
                  /
                </kbd>
                to search
              </p>
            </div>
          </div>
        </header>

        <main className="relative z-10 mx-auto max-w-[1080px] px-5 pb-24 sm:px-8">
          {/* ------------------------------------------------------------
              The thesis, which springs out of the way once you search.
              ------------------------------------------------------------ */}
          <div
            aria-hidden={!heroOpen}
            style={{
              maxHeight: heroOpen ? heroHeight || 400 : 0,
              opacity: heroOpen ? 1 : 0,
              transform: heroOpen ? "translateY(0)" : "translateY(-14px)",
              transition:
                "max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease-out, transform 0.45s cubic-bezier(0.16,1,0.3,1)",
            }}
            className="overflow-hidden"
          >
            <div ref={heroRef} className="pt-14 pb-11 sm:pt-20 sm:pb-14">
              <h1 className="max-w-[19ch] text-[2.5rem] leading-[0.98] font-semibold tracking-[-0.038em] text-balance text-paper sm:text-[3.75rem] lg:text-[4.25rem]">
                Find anything inside a video.
              </h1>
              <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed text-paper-mute sm:text-[1.125rem]">
                Search the words that were spoken. Get back the exact moment they were said,
                and jump straight to it.
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------------
              The recording, with results pinned to its timeline.
              ------------------------------------------------------------ */}
          {source && (
            <div className={cn("transition-[margin] duration-500", heroOpen ? "mt-0" : "mt-9 sm:mt-11")}>
              <MediaDeck
                source={source}
                media={media}
                moments={moments}
                activeMomentId={activeId}
                hoveredMomentId={hoveredId}
                onPickMoment={playMoment}
                onHoverMoment={setHoveredId}
              />
            </div>
          )}

          {/* ------------------------------------------------------------
              The search itself.
              ------------------------------------------------------------ */}
          <div className="relative z-30 mt-5 sm:mt-6">
            <SearchField
              ref={fieldRef}
              value={query}
              onChange={setQuery}
              onSubmit={runSearch}
              onCancel={cancelSearch}
              busy={status === "searching"}
              disabled={!indexed}
              suggestions={source?.sample_queries ?? SAMPLE_SOURCE.sample_queries ?? []}
              placeholder="Search a phrase, topic, or sentence…"
              shortPlaceholder="Search this recording…"
            />
          </div>

          {/* ------------------------------------------------------------
              Results.
              ------------------------------------------------------------ */}
          <section
            aria-label="Search results"
            className={cn(status === "idle" ? "mt-4" : "mt-10 sm:mt-12")}
          >
            {status !== "idle" && (
              <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-line pb-3.5">
                <h2 className="text-[0.75rem] font-semibold tracking-[0.14em] text-paper-faint uppercase">
                  Results
                </h2>
                {status === "results" && (
                  <p className="flex items-baseline gap-1.5 text-[0.8125rem] text-paper-mute">
                    <MorphingText text={resultLabel} className="font-semibold text-paper" />
                    <span>for “{submitted}”</span>
                  </p>
                )}
              </div>
            )}

            {!indexed ? (
              <NoIndexState />
            ) : status === "idle" ? (
              <EmptyState momentCount={source?.moment_count ?? 0} />
            ) : status === "searching" ? (
              <SearchingState />
            ) : status === "empty" ? (
              <NoResultsState query={submitted} onClear={reset} />
            ) : status === "error" ? (
              <ErrorState onRetry={() => runSearch(submitted || query)} />
            ) : (
              <div
                ref={resultsRef}
                onKeyDown={onResultsKeyDown}
                className="flex flex-col gap-3 sm:gap-3.5"
              >
                {moments.map((moment, index) => (
                  <ResultCard
                    key={moment.chunk_id}
                    ref={(node) => {
                      if (node) cardRefs.current.set(moment.chunk_id, node);
                      else cardRefs.current.delete(moment.chunk_id);
                    }}
                    moment={moment}
                    query={submitted}
                    index={index}
                    isFirst={index === 0}
                    isActive={activeId === moment.chunk_id}
                    showSpeaker={showSpeakers}
                    canPlay={media.available}
                    onPlay={playMoment}
                    onOpenContext={(m, rect) => setContext({ moment: m, rect })}
                    onHover={setHoveredId}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        <footer className="relative z-10 border-t border-line">
          <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-3 px-5 py-6 text-[0.75rem] text-paper-faint sm:px-8">
            <p>One recording at a time. Search finds where it was said.</p>
            {source?.duration_label && (
              <p className="timecode tracking-[0.06em]">
                {source.moment_count} SECTIONS · {source.duration_label}
              </p>
            )}
          </div>
        </footer>

        {context && (
          <ContextSheet
            moment={context.moment}
            originRect={context.rect}
            query={submitted}
            showSpeaker={showSpeakers}
            canPlay={media.available}
            onPlay={(seconds) => {
              setActiveId(context.moment.chunk_id);
              media.playFrom(seconds);
            }}
            onClose={() => setContext(null)}
          />
        )}
      </div>
    </MagneticCursor>
  );
}
