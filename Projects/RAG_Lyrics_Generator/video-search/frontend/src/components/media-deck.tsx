"use client";

import { TimelineRibbon } from "@/components/timeline-ribbon";
import {
  BackIcon,
  ForwardIcon,
  LectureIcon,
  MicIcon,
  NoteIcon,
  PauseIcon,
  PlayIcon,
  WaveIcon,
} from "@/components/ui/icons";
import { LevelBars } from "@/components/ui/level-bars";
import type { MediaController } from "@/hooks/use-media";
import { timecode } from "@/lib/time";
import type { Moment, Source } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * The recording, as an object on the page.
 *
 * The brief asked for the "currently indexed video" area to stay small, and it
 * does -- one row of metadata. What earns the extra height is the ribbon, which
 * is not decoration: it is where results land and where the user clicks to move.
 *
 * Nothing in this deck is amber except the marks that mean position: the
 * playhead, the pins, the played region, the running timecode. The transport
 * buttons are controls, not positions, so they are drawn in paper -- which also
 * stops the play button from out-shouting the search field below it.
 */

const KIND_GLYPH = {
  music: NoteIcon,
  podcast: MicIcon,
  interview: MicIcon,
  lecture: LectureIcon,
  talk: MicIcon,
  video: WaveIcon,
} as const;

interface MediaDeckProps {
  source: Source;
  media: MediaController;
  moments: Moment[];
  activeMomentId: number | null;
  hoveredMomentId: number | null;
  onPickMoment: (moment: Moment) => void;
  onHoverMoment: (id: number | null) => void;
}

export function MediaDeck({
  source,
  media,
  moments,
  activeMomentId,
  hoveredMomentId,
  onPickMoment,
  onHoverMoment,
}: MediaDeckProps) {
  const Glyph = KIND_GLYPH[source.kind] ?? WaveIcon;
  const playable = media.available && media.ready;
  const duration = media.duration || source.duration || 0;

  return (
    <section
      aria-label="The indexed recording"
      className="shadow-deck relative overflow-hidden rounded-[var(--radius-deck)] border border-line-strong bg-ink-900"
    >
      {/* metadata row */}
      <div className="flex items-center gap-3.5 px-4 pt-4 pb-3.5 sm:gap-4 sm:px-6 sm:pt-5">
        <span className="grid size-11 shrink-0 place-items-center rounded-[14px] border border-line-strong bg-ink-850 text-paper-dim sm:size-12">
          <Glyph size={22} />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[1.0625rem] font-semibold tracking-[-0.015em] text-paper sm:text-[1.1875rem]">
            {source.title}
          </h2>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.8125rem] text-paper-mute">
            {source.byline && <span className="truncate">{source.byline}</span>}
            {source.byline && <span aria-hidden="true" className="text-paper-faint">·</span>}
            <span>Transcript indexed</span>
            {duration > 0 && (
              <>
                <span aria-hidden="true" className="hidden text-paper-faint sm:inline">·</span>
                <span className="timecode hidden text-[0.75rem] sm:inline">{timecode(duration)}</span>
              </>
            )}
          </p>
        </div>

        {moments.length > 0 && (
          <span className="hidden shrink-0 items-center gap-2 rounded-full border border-line-strong bg-ink-850 px-3 py-1.5 text-[0.75rem] font-semibold text-paper-dim sm:inline-flex">
            {moments.length} on the timeline
          </span>
        )}
      </div>

      {/* ribbon */}
      <div className="px-4 sm:px-6">
        <TimelineRibbon
          duration={duration}
          currentTime={media.currentTime}
          peaks={media.peaks}
          moments={moments}
          activeMomentId={activeMomentId}
          hoveredMomentId={hoveredMomentId}
          seekable={playable}
          onSeek={media.seek}
          onPickMoment={onPickMoment}
          onHoverMoment={onHoverMoment}
        />
      </div>

      {/* transport */}
      <div className="hairline-t mt-4 flex items-center gap-3 px-4 py-3.5 sm:px-6">
        <button
          type="button"
          data-magnetic
          disabled={!playable}
          onClick={media.toggle}
          aria-label={media.playing ? "Pause" : "Play"}
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full transition-all duration-300 ease-[var(--ease-spring)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
            playable
              ? "border border-signal/28 bg-ink-850 text-signal hover:border-signal/55 hover:bg-ink-800 active:scale-95"
              : "cursor-not-allowed border border-line bg-ink-850 text-paper-faint",
          )}
        >
          <span className="relative grid size-5 place-items-center">
            <span
              className={cn(
                "absolute transition-all duration-300 ease-[var(--ease-spring)]",
                media.playing ? "scale-100 opacity-100" : "scale-50 opacity-0",
              )}
            >
              <PauseIcon size={18} />
            </span>
            <span
              className={cn(
                "absolute transition-all duration-300 ease-[var(--ease-spring)]",
                media.playing ? "scale-50 opacity-0" : "scale-100 opacity-100",
              )}
            >
              <PlayIcon size={18} />
            </span>
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            disabled={!playable}
            onClick={() => media.nudge(-10)}
            aria-label="Back 10 seconds"
            className="grid size-9 place-items-center rounded-full text-paper-mute transition-colors duration-200 hover:bg-ink-800 hover:text-paper disabled:pointer-events-none disabled:opacity-40"
          >
            <BackIcon size={17} />
          </button>
          <button
            type="button"
            disabled={!playable}
            onClick={() => media.nudge(10)}
            aria-label="Forward 10 seconds"
            className="grid size-9 place-items-center rounded-full text-paper-mute transition-colors duration-200 hover:bg-ink-800 hover:text-paper disabled:pointer-events-none disabled:opacity-40"
          >
            <ForwardIcon size={17} />
          </button>
        </div>

        <p className="timecode shrink-0 text-[0.8125rem] text-paper-dim">
          <span className={cn("transition-colors duration-300", media.playing && "text-signal")}>
            {timecode(media.currentTime)}
          </span>
          <span className="text-paper-faint"> / {timecode(duration)}</span>
        </p>

        {/* The meter only exists while there is a level to show. At rest it
            would just be five grey dots pretending to be an instrument. */}
        {media.playing && (
          <LevelBars
            variant="level"
            levels={media.levels}
            className="animate-in fade-in ml-auto shrink-0 text-paper-dim duration-300"
          />
        )}

        {!media.available && (
          <p className="ml-auto max-w-[52%] text-right text-[0.75rem] leading-snug text-paper-faint sm:max-w-none">
            Playback needs the audio file —{" "}
            <span className="text-paper-mute">drop one in <code className="font-mono text-[0.7rem]">backend/media/</code></span>
          </p>
        )}
        {media.available && media.error && (
          <p className="ml-auto text-right text-[0.75rem] text-paper-mute">{media.error}</p>
        )}
      </div>
    </section>
  );
}
