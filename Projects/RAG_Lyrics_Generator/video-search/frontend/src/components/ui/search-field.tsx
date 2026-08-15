"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { ArrowRightIcon, CloseIcon, LensIcon } from "@/components/ui/icons";
import { LevelBars } from "@/components/ui/level-bars";
import { MorphingText } from "@/components/ui/morphing-text";
import { cn } from "@/lib/utils";

/**
 * The primary control on the page.
 *
 * Built on the pinned prompt-input reference's physics -- spring height morph,
 * top/bottom scroll fade masks, an action button whose icons rotate and
 * crossfade between states, and a popover with a sliding hover highlight.
 *
 * What was deliberately NOT carried over: the model picker, the effort cycler,
 * and the attachment tray. This product has one job, and each of those would be
 * a control the user has to interpret before they can search.
 *
 * Two things this field owes the page:
 *
 * 1. It has to *look* primary before you touch it. The submit carries its amber
 *    at rest as a ring and a tint, and fills solid once there is something to
 *    search -- so the field wins the first viewport without claiming to be
 *    actionable when it is not.
 * 2. Its right-hand reserve is responsive. The submit label is hidden below
 *    `sm`, so a fixed desktop reserve would strand the button and wrap the
 *    placeholder onto two lines on a phone.
 */

const SPRING = "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
const MIN_HEIGHT = 26;
const MAX_HEIGHT = 108;
const ROW_HEIGHT = 36;
const NARROW = 640;

export interface SearchFieldHandle {
  focus: () => void;
}

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onCancel?: () => void;
  busy?: boolean;
  placeholder?: string;
  /** Used below the `sm` breakpoint, where the field is much narrower. */
  shortPlaceholder?: string;
  suggestions?: string[];
  disabled?: boolean;
}

export const SearchField = forwardRef<SearchFieldHandle, SearchFieldProps>(function SearchField(
  {
    value,
    onChange,
    onSubmit,
    onCancel,
    busy = false,
    placeholder = "What are you looking for?",
    shortPlaceholder,
    suggestions = [],
    disabled = false,
  },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [textHeight, setTextHeight] = useState(MIN_HEIGHT);
  const [overflowing, setOverflowing] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeOption, setActiveOption] = useState(-1);
  const [narrow, setNarrow] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState({
    opacity: 0,
    transform: "translateY(0px)",
    transition: "none",
  });

  const shellRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const topFadeRef = useRef<HTMLDivElement>(null);
  const bottomFadeRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({ focus: () => textareaRef.current?.focus() }), []);

  const hasValue = value.trim().length > 0;
  const listId = "search-suggestions";

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${NARROW - 1}px)`);
    const sync = () => setNarrow(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const shownPlaceholder = narrow && shortPlaceholder ? shortPlaceholder : placeholder;

  /* -- scroll fade masks, straight from the reference ------------------- */
  const updateFades = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (topFadeRef.current) {
      topFadeRef.current.style.opacity = String(Math.min(scrollTop / 18, 1));
    }
    if (bottomFadeRef.current) {
      const remaining = scrollHeight - clientHeight - scrollTop;
      bottomFadeRef.current.style.opacity = String(Math.min(Math.max(remaining - 8, 0) / 10, 1));
    }
  }, []);

  /* -- auto-grow -------------------------------------------------------- */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    const previous = el.style.height;
    el.style.transition = "none";
    el.style.height = "0px";
    const scrollHeight = el.scrollHeight;
    el.style.height = previous;
    void el.offsetHeight;
    el.style.transition = "";

    // An empty textarea's scrollHeight includes the laid-out *placeholder* in
    // Chromium, so a placeholder that wraps at narrow widths silently inflates
    // the field by two rows before anyone has typed. With no value there is
    // nothing to grow for: pin it to one row.
    const next =
      value.length === 0 ? MIN_HEIGHT : Math.max(MIN_HEIGHT, Math.min(scrollHeight, MAX_HEIGHT));
    el.style.height = `${next}px`;
    setTextHeight(next);
    setOverflowing(value.length > 0 && scrollHeight > MAX_HEIGHT);
    window.setTimeout(updateFades, 0);
  }, [value, updateFades]);

  /* -- dismiss the suggestion popover ---------------------------------- */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (shellRef.current && !shellRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const closeList = useCallback(() => {
    setOpen(false);
    setActiveOption(-1);
    setHighlightStyle((prev) => ({ ...prev, opacity: 0, transition: "opacity 0.18s ease-in" }));
  }, []);

  const moveHighlight = useCallback((index: number) => {
    setActiveOption(index);
    setHighlightStyle((prev) => ({
      opacity: 1,
      transform: `translateY(${index * ROW_HEIGHT}px)`,
      transition:
        prev.opacity === 0 ? "opacity 0.14s ease-out" : `transform 0.3s ${SPRING}, opacity 0.14s ease`,
    }));
  }, []);

  const submit = (raw?: string) => {
    if (busy) {
      onCancel?.();
      return;
    }
    const next = (raw ?? value).trim();
    if (!next || disabled) return;
    if (raw !== undefined) onChange(raw);
    closeList();
    textareaRef.current?.blur();
    onSubmit(next);
  };

  const showLens = !hasValue && !busy;
  const showArrow = hasValue && !busy;

  /* Right-hand reserve: the submit is icon-only below `sm`. */
  const reserve = useMemo(() => (narrow ? 94 : 132), [narrow]);
  const clearOffset = narrow ? 66 : 112;

  return (
    <div ref={shellRef} className="relative w-full">
      {/* ---- the field ------------------------------------------------- */}
      <div
        onMouseDown={(event) => {
          if (event.target !== textareaRef.current) {
            event.preventDefault();
            textareaRef.current?.focus();
          }
        }}
        style={{
          height: textHeight + 42,
          // The field's height animation is inherited from the pinned reference
          // component and is the identity of this control. Every child is
          // absolutely positioned, so the morph reflows one box and nothing in
          // flow; promoting it keeps that off the main thread's layout path.
          willChange: "height",
          transition: `height 0.32s ${SPRING}, box-shadow 0.3s ease-out, border-color 0.3s ease-out, background-color 0.3s ease-out`,
        }}
        className={cn(
          "relative cursor-text rounded-[22px] border bg-ink-900/90 backdrop-blur-xl",
          "shadow-[0_18px_48px_-28px_rgba(0,0,0,0.9)]",
          focused
            ? "border-signal/55 bg-ink-850/95 shadow-[0_26px_64px_-30px_rgba(0,0,0,1)]"
            : "border-signal/22 hover:border-signal/35 hover:bg-ink-850/70",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        {/* The lens is amber at rest: this field is the page's primary action
            before anyone touches it. */}
        <div className="pointer-events-none absolute top-[21px] left-4 text-signal sm:left-5">
          <LensIcon size={20} />
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          rows={1}
          disabled={disabled}
          spellCheck={false}
          role="combobox"
          aria-label="Search inside the transcript"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && activeOption >= 0 ? `${listId}-${activeOption}` : undefined}
          placeholder={shownPlaceholder}
          style={{ paddingRight: reserve }}
          onChange={(event) => {
            onChange(event.target.value);
            if (event.target.value.trim()) closeList();
          }}
          onScroll={updateFades}
          onFocus={() => {
            setFocused(true);
            if (!hasValue && suggestions.length > 0) setOpen(true);
          }}
          onBlur={() => setFocused(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              if (open && activeOption >= 0) submit(suggestions[activeOption]);
              else submit();
              return;
            }
            if (event.key === "Escape") {
              if (open) closeList();
              else if (hasValue) onChange("");
              else textareaRef.current?.blur();
              return;
            }
            if ((event.key === "ArrowDown" || event.key === "ArrowUp") && suggestions.length > 0) {
              if (hasValue && !open) return;
              event.preventDefault();
              if (!open) {
                setOpen(true);
                moveHighlight(0);
                return;
              }
              const delta = event.key === "ArrowDown" ? 1 : -1;
              const next = (activeOption + delta + suggestions.length) % suggestions.length;
              moveHighlight(next);
            }
          }}
          className={cn(
            "field-scroll absolute inset-x-0 top-[18px] w-full resize-none bg-transparent",
            "pl-11 text-[1rem] leading-[26px] tracking-[-0.01em] text-paper outline-none sm:pl-14",
            "placeholder:text-paper-mute sm:text-[1.1875rem] sm:leading-[26px]",
            overflowing ? "overflow-y-auto" : "overflow-y-hidden",
          )}
        />

        {/* Scroll fades — the reference's trick, but only mounted while there is
            something to scroll. Kept alive at zero opacity they read as a faint
            band across the placeholder, because the gradient's stop colour can
            never match a translucent, backdrop-blurred field at every state. */}
        {overflowing && (
          <>
            <div
              ref={topFadeRef}
              style={{ opacity: 0, right: reserve }}
              className="pointer-events-none absolute top-[14px] left-11 h-5 bg-gradient-to-b from-ink-850 to-transparent sm:left-14"
            />
            <div
              ref={bottomFadeRef}
              style={{ opacity: 0, top: `${textHeight - 4}px`, right: reserve }}
              className="pointer-events-none absolute left-11 h-6 bg-gradient-to-t from-ink-850 to-transparent sm:left-14"
            />
          </>
        )}

        {/* clear */}
        <button
          type="button"
          tabIndex={hasValue ? 0 : -1}
          aria-hidden={!hasValue}
          aria-label="Clear search"
          style={{ right: clearOffset }}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            onChange("");
            textareaRef.current?.focus();
          }}
          className={cn(
            "absolute top-[19px] flex size-6 items-center justify-center rounded-full",
            "text-paper-faint transition-all duration-300 ease-[var(--ease-spring)]",
            "hover:bg-ink-750 hover:text-paper",
            hasValue && !busy ? "scale-100 opacity-100" : "pointer-events-none scale-50 opacity-0",
          )}
        >
          <CloseIcon size={14} />
        </button>

        {/* the action. One button, three states, crossfaded like the reference. */}
        <button
          type="button"
          data-magnetic
          onClick={() => submit()}
          disabled={disabled || (!hasValue && !busy)}
          aria-label={busy ? "Stop searching" : "Search the transcript"}
          className={cn(
            "group absolute right-2.5 bottom-2.5 flex h-11 items-center gap-2 rounded-[16px] px-4",
            "text-[0.9375rem] font-semibold tracking-[-0.01em] transition-colors duration-300",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal",
            hasValue || busy
              ? "bg-signal text-ink-950 hover:bg-signal-bright"
              : "border border-signal/65 bg-signal/20 text-signal-bright",
            disabled && "opacity-60",
          )}
        >
          <span className="relative flex size-5 items-center justify-center">
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[var(--ease-spring)]",
                showLens ? "rotate-0 scale-100 opacity-100 blur-none" : "-rotate-45 scale-50 opacity-0 blur-[1px]",
              )}
            >
              <LensIcon size={18} />
            </span>
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[var(--ease-spring)]",
                showArrow ? "rotate-0 scale-100 opacity-100 blur-none" : "rotate-45 scale-50 opacity-0 blur-[1px]",
              )}
            >
              <ArrowRightIcon size={18} />
            </span>
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[var(--ease-spring)]",
                busy ? "scale-100 opacity-100 blur-none" : "scale-50 opacity-0 blur-[1px]",
              )}
            >
              <LevelBars variant="scan" className="h-5" />
            </span>
          </span>
          <MorphingText text={busy ? "Stop" : "Search"} className="hidden sm:inline-flex" />
        </button>
      </div>

      {/* ---- suggestions: the reference's sliding-highlight popover -----
          `inert` when closed, so four invisible buttons do not sit in the tab
          order immediately after the submit. */}
      {suggestions.length > 0 && (
        <div
          id={listId}
          role="listbox"
          aria-label="Suggested searches"
          inert={!open}
          onMouseLeave={() =>
            setHighlightStyle((prev) => ({ ...prev, opacity: 0, transition: "opacity 0.18s ease-in" }))
          }
          className={cn(
            "absolute inset-x-0 top-[calc(100%+10px)] z-40 rounded-[20px] border border-line-strong",
            // Solid, not translucent: the empty state sits directly under this panel's
            // footprint, and a blurred ghost of "Nothing searched yet" reading through
            // the options is worse than losing the glass.
            "bg-ink-900 p-1.5 shadow-[0_28px_64px_-24px_rgba(0,0,0,0.95)]",
            "transition-all duration-300",
            open
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0",
          )}
        >
          <p className="px-3.5 pt-2 pb-2.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-paper-faint uppercase">
            Try
          </p>
          <div className="relative">
            <div
              style={{ ...highlightStyle, height: ROW_HEIGHT }}
              className="pointer-events-none absolute inset-x-0 top-0 -z-10 rounded-[14px] bg-ink-800"
            />
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                id={`${listId}-${index}`}
                type="button"
                role="option"
                aria-selected={activeOption === index}
                tabIndex={open ? 0 : -1}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => moveHighlight(index)}
                onFocus={() => moveHighlight(index)}
                onClick={() => submit(suggestion)}
                className="relative flex w-full items-center gap-2.5 rounded-[14px] px-3.5 text-left text-[0.9375rem] text-paper-dim transition-colors duration-200 hover:text-paper focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal"
                style={{ height: ROW_HEIGHT }}
              >
                <LensIcon size={14} className="shrink-0 text-paper-faint" />
                <span className="truncate">{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
