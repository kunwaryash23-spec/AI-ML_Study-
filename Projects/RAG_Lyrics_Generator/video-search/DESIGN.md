---
name: Video Search
description: A transcript search that answers with positions on a recording, not passages of text.
colors:
  ink-950: "#0b0c0d"
  ink-900: "#101113"
  ink-850: "#16181b"
  ink-800: "#1d2024"
  ink-750: "#24272c"
  paper: "#f2efe9"
  paper-dim: "#b5b0a6"
  paper-mute: "#9c978d"
  paper-faint: "#8c877d"
  signal: "#ffb020"
  signal-bright: "#ffc155"
  line: "rgba(246, 240, 228, 0.08)"
  line-strong: "rgba(246, 240, 228, 0.16)"
typography:
  display:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.25rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.038em"
  headline:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  body-sm:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  meta:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.14em"
  timecode:
    fontFamily: "Martian Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "1.875rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.055em"
    fontFeature: "\"tnum\" 1"
rounded:
  hairline: "3px"
  focus: "4px"
  chip: "10px"
  track: "12px"
  row: "14px"
  action: "16px"
  card: "20px"
  field: "22px"
  deck: "24px"
  pill: "999px"
spacing:
  micro: "4px"
  tight: "8px"
  stack: "12px"
  panel-pad: "16px"
  gutter: "20px"
  panel-pad-lg: "24px"
  gutter-lg: "32px"
  deck-gap: "44px"
  section-gap: "48px"
  page-bottom: "96px"
components:
  deck:
    backgroundColor: "{colors.ink-900}"
    textColor: "{colors.paper}"
    rounded: "{rounded.deck}"
    padding: "20px 24px"
  timeline-track:
    backgroundColor: "rgba(11, 12, 13, 0.6)"
    rounded: "{rounded.track}"
    height: "76px"
  search-field:
    backgroundColor: "rgba(16, 17, 19, 0.9)"
    textColor: "{colors.paper}"
    rounded: "{rounded.field}"
    typography: "{typography.body}"
    height: "68px"
  search-field-focus:
    backgroundColor: "rgba(22, 24, 27, 0.95)"
    textColor: "{colors.paper}"
    rounded: "{rounded.field}"
  action-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.ink-950}"
    rounded: "{rounded.action}"
    padding: "0 16px"
    height: "44px"
  action-primary-hover:
    backgroundColor: "{colors.signal-bright}"
    textColor: "{colors.ink-950}"
  action-primary-rest:
    backgroundColor: "rgba(255, 176, 32, 0.2)"
    textColor: "{colors.signal-bright}"
    rounded: "{rounded.action}"
    padding: "0 16px"
    height: "44px"
  transport-play:
    backgroundColor: "{colors.ink-850}"
    textColor: "{colors.signal}"
    rounded: "{rounded.pill}"
    size: "44px"
  transport-play-hover:
    backgroundColor: "{colors.ink-800}"
    textColor: "{colors.signal}"
    rounded: "{rounded.pill}"
    size: "44px"
  transport-play-disabled:
    backgroundColor: "{colors.ink-850}"
    textColor: "{colors.paper-faint}"
    rounded: "{rounded.pill}"
    size: "44px"
  result-card:
    backgroundColor: "{colors.ink-850}"
    textColor: "{colors.paper-dim}"
    rounded: "{rounded.card}"
    padding: "20px"
  result-card-hover:
    backgroundColor: "{colors.ink-800}"
    textColor: "{colors.paper}"
    rounded: "{rounded.card}"
  result-card-active:
    backgroundColor: "{colors.ink-800}"
    textColor: "{colors.paper}"
    rounded: "{rounded.card}"
  play-from-chip:
    backgroundColor: "rgba(36, 39, 44, 0.7)"
    textColor: "{colors.paper-dim}"
    rounded: "{rounded.pill}"
    padding: "6px 12px 6px 10px"
  play-from-chip-hover:
    backgroundColor: "{colors.ink-750}"
    textColor: "{colors.paper}"
  play-from-chip-active:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.ink-950}"
    rounded: "{rounded.pill}"
    padding: "6px 12px 6px 10px"
  sheet-play:
    backgroundColor: "{colors.ink-850}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "8px 14px 8px 12px"
  count-chip:
    backgroundColor: "{colors.ink-850}"
    textColor: "{colors.paper-dim}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  ghost-pill:
    backgroundColor: "transparent"
    textColor: "{colors.paper-dim}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  suggestion-row:
    backgroundColor: "{colors.ink-800}"
    textColor: "{colors.paper-dim}"
    rounded: "{rounded.row}"
    height: "36px"
    padding: "0 14px"
  context-sheet:
    backgroundColor: "{colors.ink-900}"
    textColor: "{colors.paper}"
    rounded: "{rounded.deck}"
    padding: "20px 24px"
  transcript-mark:
    backgroundColor: "{colors.ink-750}"
    textColor: "{colors.paper}"
    rounded: "{rounded.hairline}"
    padding: "0 0.15em"
---

# Design System: Video Search

## Overview

**Creative North Star: "The Edit Suite"**

This is the inside of a machine built for one job: finding a place in a recording. The surface is graphite — five near-black greys, warm rather than blue — lit by warm paper type and exactly one colour. Nothing glows, nothing charts, nothing is coloured because colour was available. The room the recording sits in is drawn with an edit suite's own materials: a faint film-grain wash, hairline rules at eight-percent paper, and vertical ruler ticks every 96px far below the content.

Density is deliberate and calm. A single 1080px column carries the whole page, and the composition's widest element is the timeline ribbon — because the ribbon is the product. The thesis is that a result is a *position*, so the found moments are pinned onto the recording's own strip of time before they are ever read as text. Panels are generously rounded (20–24px) and layered by tone, not by outline; depth comes from a five-step graphite ramp and diffuse downward shadow, never from a border that gets brighter.

The one colour, amber `#ffb020`, is load-bearing, and it does exactly two jobs. It marks a **position in the recording**: played waveform, playhead and cap, timeline pins, the active card's border and its timecode. And it marks the **affordance that moves you to one**: every play control carries an amber play glyph, and the page's single primary action — the search submit — is amber. That is the complete list. Matched words inside a transcript line are *not* amber; they are lifted in graphite, because a sentence full of amber runs would spend the notation the timeline depends on. Because amber never decorates, amber always means something, and the eye can be trained on it in a single viewport.

**Key Characteristics:**
- Graphite tonal layering (`#0b0c0d` → `#24272c`); no outlines carrying hierarchy
- Warm paper type (`#f2efe9`) on a four-step legibility ramp down to `#8c877d`
- Exactly one accent, carrying two meanings: position in the recording, and the play affordance that takes you there
- Archivo Variable for voice; Martian Mono tabular for every timecode
- Rounded 20–24px panels, hairline rules, film-grain wash, ruler ticks
- One authored motion moment: the pins landing on the timeline in a 55ms stagger

## Colors

A graphite room, warm paper type, and one signal lamp — no second hue exists anywhere in the build.

### Primary
- **Signal Amber** (`{colors.signal}`): The only colour on the surface, and it carries two meanings and no others. *Position:* the played portion of the waveform (at 30% alpha), the playhead and its cap, timeline pins (70% at rest, full when hovered), the active result card's `1px` border (at 55% alpha), the context sheet's matched-line stamps. *Affordance:* the play glyph inside every play control, the transport button's ring (28% at rest, 55% on hover) and its icon, the context sheet's play pill edge (45% / 70%), the search field's own border (22% at rest, 55% focused) and its lens, and the search submit's fill. Plus three browser surfaces: the caret, the focus ring, and the text selection (at 30% alpha). Nothing else.
- **Signal Bright** (`{colors.signal-bright}`): The hotter step, reserved for the *currently* live position — the playhead and its cap, the active and hovered pin, the active card's timecode — and for the submit, both as its resting label and as its hover fill.

### Neutral
- **Room Graphite** (`{colors.ink-950}`): The page itself, and the recessed timeline track at 60% alpha. Also the text colour used *on* amber fills, so an amber button reads as a lamp rather than a label.
- **Panel Graphite** (`{colors.ink-900}`): The deck, the context sheet, the suggestion popover, and state-icon tiles. One step up from the page.
- **Card Graphite** (`{colors.ink-850}`): Result cards at rest, the metadata tile, the offline badge, the keyboard hint.
- **Raised Graphite** (`{colors.ink-800}`): The hover and active state of a card, the hover of the transport and sheet play controls, the suggestion popover's sliding highlight, skeleton rows.
- **Chip Graphite** (`{colors.ink-750}`): Small inset surfaces — the quiet "Play from" chip (at 70% alpha, full on card hover), the ground under a matched word, the clear-button hover, and the scrollbar thumb.
- **Paper** (`{colors.paper}`): Primary type. Headings, the display line, the wordmark, matched transcript text, the result card's timecode at rest, the context sheet's play pill label, and any text a hover promotes.
- **Paper Dim** (`{colors.paper-dim}`): Transcript body at rest and the transport readout — one step below primary, because the words are evidence and the timecode is the answer. Also every glyph that is *not* a play affordance: the deck's kind tile, the state icon tiles, the playback level meter, the scanning meter in the searching state, and the deck's result-count chip.
- **Paper Mute** (`{colors.paper-mute}`): Supporting prose, metadata rows, placeholder text, ruler timecodes, secondary controls.
- **Paper Faint** (`{colors.paper-faint}`): Micro-labels (including "CLOSEST", which is a warm grey and never amber), separators, unmatched context lines, disabled type, and the field's clear button at rest.
- **Hairline** (`{colors.line}`): The default border colour for every element (set globally), plus header/footer/section rules.
- **Hairline Strong** (`{colors.line-strong}`): Borders that need to survive on top of a panel — the deck, the popover, icon tiles, the count chip, the ghost pills. (The search field is the exception: its border is amber at rest, because it is the primary action.)

### Named Rules
**The Amber-Means-Position Rule.** Amber marks a position in the recording: played waveform, playhead and cap, timeline pins, the active card's border and timecode, a matched line's stamp. It is never a brand accent, never a hover tint on a neutral control, never a border for emphasis, never a status colour, and never a highlight on text. If a new element is amber for positional reasons, name the position it marks; if you cannot, see the next rule — and if that does not cover it either, it is not amber.

**The Amber-Means-Affordance Rule.** The one sanctioned non-positional use of amber on the content plane is the *play affordance*, and the page's single primary action. Every play control carries an amber play glyph, and the search submit — the only primary action on the page — is amber. This is an amendment, not a loophole: it is written down because leaving it unwritten is how the original diffusion of amber across every button comes back by another route.

The escalation lives on the **glyph, not the container**: a play control always shows an amber glyph, and its container escalates with *singularity, not importance*.

- A **repeated, per-result** control stays graphite with an amber glyph — the result card's "Play from `MM:SS`" chip (`ink-750` at 70%, paper-dim label, amber glyph).
- A **singular** control takes an amber **edge** — the deck's transport play/pause (`border-signal/28`, amber icon) and the context sheet's "Play from here" (`border-signal/45`, paper label, amber glyph). There are exactly two of these.
- Only a control that **is the position currently playing** fills **solid** amber — the active card's play chip (`bg-signal`, `text-ink-950`). At that point it is not an affordance any more; it is the position.

Nothing else earns amber. A second solid-amber button on a screen is a defect, not a variant.

**The Pins-Outrank-Playback Rule.** Where amber marks meet, alpha carries the rank. The played waveform sits at `rgba(255, 176, 32, 0.30)`, deliberately well below the pins (70%–100%) and the playhead (solid `signal-bright`), and the unplayed waveform sits at `rgba(246, 240, 228, 0.24)`. Playback is context; the pins are the answer. Never raise the played field to where a pass of playback swallows the pins it crosses.

**The Graphite-Highlight Rule.** A matched word is lifted in graphite, not in amber: `ink-750` ground, `paper` text, a `1px` inset paper hairline at 14%, `3px` radius, `box-decoration-clone` so a run that wraps keeps its shape on both lines. Highlighting in amber would put the timeline's notation inside a sentence, where it means nothing.

**The One Hue Rule.** There is no second accent. Error, warning, and success states are drawn in graphite and paper with an authored alert glyph, not in red, amber-as-warning, or green. Introducing a second hue would cost amber its meaning.

**The Room-Wash Exception.** The one sanctioned use of amber *beneath* the content plane is the atmosphere layer: two radial washes at 7% and 3.5% in the `.room` utility, sitting under all content. It is the light in the room, not a glow on an element. Nothing on top of the content plane gets an amber halo, bloom, or ring shadow.

**The Tonal Hierarchy Rule.** Depth is a step on the graphite ramp, never a brighter border. Page → panel → card → hover → chip is `#0b0c0d` → `#101113` → `#16181b` → `#1d2024` → `#24272c`. To raise an element, move it one step up the ramp.

## Typography

**Display / Body Font:** Archivo Variable (with `ui-sans-serif`, `system-ui`, `sans-serif`), self-hosted
**Label/Mono Font:** Martian Mono (400 / 500 / 700), self-hosted, tabular

**Character:** Archivo is a grotesque with enough width and a tight negative tracking at display sizes to read as equipment lettering rather than editorial — confident, unromantic, engineered. Martian Mono carries every number: strongly tracked in (`-0.055em`) so timecode columns stay compact, and always tabular so digits never shift as the clock runs. `font-synthesis-weight` is off; only real weights render.

### Hierarchy
- **Display** (600, `2.5rem` → `3.75rem` → `4.25rem`, `0.98` line-height, `-0.038em`): The single page thesis line, left-aligned, capped at `19ch` with `text-balance`. It exists only in the idle state and springs away on search.
- **Headline** (600, `1.375rem`, `-0.02em`): State titles — "Nothing searched yet", "No matching section found", "Something went wrong", "No transcript is indexed".
- **Title** (600, `1.0625rem` → `1.1875rem`, `-0.015em`): The recording's title in the deck. Truncates rather than wraps.
- **Body** (400, `1rem` → `1.125rem`, `1.62`–`1.7` line-height): The lead paragraph (`1.0625` → `1.125rem`, capped `46ch`) and transcript text in cards and the context sheet (`1rem`, rising to `1.0625rem` at `sm` in a card).
- **Body Small** (400, `0.9375rem`, relaxed): State copy, capped `34–40ch`. Suggestion rows.
- **Meta** (400, `0.8125rem`): Metadata rows, transport readout, footer, chip labels.
- **Label** (600, `0.6875rem`–`0.75rem`, `0.06em`–`0.16em`, uppercase): Section headers ("RESULTS"), speaker names, "CLOSEST", "TRY", "IN CONTEXT", the offline badge.
- **Timecode** (Martian Mono, tabular, `-0.055em`): `1.5rem` → `1.875rem` in a result card, `1.375rem` in the context sheet header, `0.8125rem` in the transport, `0.75rem` in sheet lines, `0.6875rem` in the keyboard hint and index counts, `0.5625rem` on ruler ticks.

### Named Rules
**The Timecode Rule.** Every number that means a position in time carries the `.timecode` class — Martian Mono, `tabular-nums`, `"tnum" 1`. Durations, ruler ticks, transport readouts, card timestamps, sheet line stamps, section counts. A time in Archivo is a bug.

**The Timecode-Is-The-Answer Rule.** In a result card the timecode is the largest element on the card (`1.5rem` mobile, `1.875rem` up), set larger than the transcript text it labels. The user came for a position; the words are the evidence that the position is right.

**The Dropped-Hour Rule.** Display timecodes omit the hour segment on recordings under an hour (`04:12`, not `00:04:12`). Use the hour-forced form only where a column must stay aligned across sources of different lengths.

**The Product-Language Rule.** Copy names what the user is doing, never what the engine is doing. "No matching section found", not "0 chunks above threshold". No retrieval method, score, or threshold is ever named on the surface.

## Layout

One centred column at `max-width: 1080px`, shared by the header rail, the main content, and the footer rail so the three read as one instrument face. Page gutters are `20px` mobile / `32px` at `sm`, with `96px` of bottom breathing room under the last result.

Vertical order is fixed and load-bearing: hairline top rail (wordmark + `/` hint) → display line → the recording deck → the search field → results. The deck holds the composition's full width, and inside it the timeline ribbon spans edge to edge minus the deck's own `16px`/`24px` padding, making it the widest single element on the page. The search field sits directly beneath the deck at `20px`/`24px`, so the primary action is adjacent to the surface the action affects.

Rhythm, in the steps the build actually uses: `12–14px` between result cards, `16–24px` inside panels, `20–24px` between the deck and the field, `36–44px` from deck to content once the hero has collapsed, `40–48px` above the results section, `100–136px` of hero padding when the hero is open.

Responsive behaviour is a single breakpoint story at `sm` (640px) with one `lg` step for the display line. Below `sm`: gutters tighten, the result card's timecode gutter flips from a `124px` left column to a horizontal row above the text, the deck's result-count chip and the wordmark suffix drop out, the submit's label is hidden so the field's right-hand reserve shrinks, and the ribbon shortens from `76px` to `64px`. The ribbon's waveform bar count and ruler tick density are derived from the *measured* width, not from the viewport or the duration, so it draws correctly at any size. The context sheet is `min(100vw - 32px, 660px)` wide and grows to fit its content up to `min(100vh - 96px, 620px)`.

### Named Rules
**The Measured-Collapse Rule.** Any height a reveal animates to is measured, never guessed. The hero's collapse ceiling comes from a `ResizeObserver` reading `borderBoxSize` — not `contentRect`, which excludes the hero's own `pt-14`/`pb-11` and so clips roughly `100px` off the ceiling and cuts the last line of copy. The context sheet measures its loaded content the same way before settling at its final height. A hard-coded `max-height` here is a regression waiting for one more line of copy.

**The One Column Rule.** Everything lives in one 1080px column. There is no sidebar, no split view, and no second content track; a library or multi-source view would break the thesis that this page is one recording.

**The Ribbon Owns The Width Rule.** The timeline ribbon is the widest element in the composition. Nothing may be introduced that is wider than it or competes with it for the eye at first viewport.

## Elevation & Depth

Hybrid, weighted toward tone. Rank is carried by the five-step graphite ramp; shadow only separates a floating plane from the page beneath it. Every shadow in the build is a large-blur, negative-spread, pure-black cast pointing straight down — no offset-hard shadows, no rim lights, no coloured shadow, no inset highlight except a single 6%-paper hairline used to draw the deck's transport divider.

### Shadow Vocabulary
- **Deck** (`box-shadow: 0 24px 60px -24px rgba(0,0,0,0.9), 0 2px 6px -2px rgba(0,0,0,0.6)`): The recording deck. Two-part: a deep ambient pool plus a tight contact shadow so the panel sits on the page rather than hovering above it.
- **Card** (`box-shadow: 0 12px 32px -18px rgba(0,0,0,0.85)`): Result cards at rest.
- **Lift** (`box-shadow: 0 22px 50px -22px rgba(0,0,0,0.95)`): A card on hover, paired with a `1px` upward translate. The only shadow that is a state response.
- **Field** (`box-shadow: 0 18px 48px -28px rgba(0,0,0,0.9)`, focused `0 26px 64px -30px rgba(0,0,0,1)`): The search field, which deepens on focus rather than glowing.
- **Popover** (`box-shadow: 0 28px 64px -24px rgba(0,0,0,0.95)`): The suggestion list, over a *solid* `ink-900` — this is the one panel in the build with no glass, because the empty state sits directly under its footprint and ghosted through it.
- **Overlay** (`box-shadow: 0 40px 90px -30px rgba(0,0,0,1)`): The context sheet at rest above a `72%` ink-950 scrim with `backdrop-blur-md`.

### Named Rules
**The Down-Cast Rule.** Shadows are diffuse, black, and cast downward with a negative spread so the edge never hardens. A shadow with a visible offset silhouette, a coloured tint, or a glow belongs to a different world than this one.

**The Focus-Deepens Rule.** Focus and hover deepen the shadow and step the surface up the graphite ramp. They never add an amber halo, bloom, or ring shadow to a control.

## Shapes

Two panel radii carry the form language: `24px` for the deck and the context sheet (the two objects that represent the recording), `20px` for result cards and the suggestion popover. The search field sits between them at `22px`, and its action button at `16px`, which reads as a control nested inside a panel rather than a panel of its own. Smaller inset geometry steps down: `16px` for the state icon tiles, `14px` for the deck's kind tile and the suggestion rows, `12px` for the recessed timeline track, `10px` for the magnetic cursor's fallback snap, `4px` on the global focus ring, `3px` on a transcript highlight.

Anything round is fully round: transport buttons, the play/back/forward controls, the "Play from" chip, the count chip, the "Start over" pill, the close button, the scrollbar thumb, waveform bar caps, pin dots. There is no in-between "slightly pill" radius.

Borders are a single hairline weight at two strengths, and they delineate — they never emphasise. The one border that carries meaning is the active result card's, and it is still `1px`: an amber hairline at 55% around the whole card, never a fat coloured bar and never a thick left rail. Panels clip their contents (`overflow-hidden`) so the ribbon, the grain layer, and the sheet's scroll body all end exactly at the corner curve.

### Named Rules
**The Hairline Rule.** One border weight (`1px`) at two opacities (8% / 16% paper). To make an edge more present, raise it from `line` to `line-strong` — never thicken it, never colour it.

## Components

### The Recording Deck
The recording as a physical object on the page. Rounded `24px` panel graphite with a hairline-strong border and the deck shadow, clipping three stacked bands: a metadata row (a `44–48px` kind-glyph tile in `ink-850`/paper-dim behind a `14px` hairline-strong frame, title, byline, "Transcript indexed", duration in timecode, and a neutral count chip once results exist — `border-line-strong bg-ink-850 text-paper-dim`, because a count is not a position), the timeline ribbon, and a transport strip separated by an inset `6%`-paper hairline. The whole deck is the page's fixed anchor; when the hero collapses on search it rises to the top.

### Timeline Ribbon (signature component)
The product in one control. A `64/76px` recessed track (`ink-950` at 60%, `12px` radius) drawn in three planes: ruler tick rules and their `0.5625rem` timecodes at the bottom in a reserved `18px` label band; the waveform above them on a canvas, laid out inside `height − 18px` so a bar can never be drawn over a ruler timecode; the `signal-bright` playhead and its `8px` cap on top. Search results are `2px` amber pins in a `28px` band directly above the track, rising from `16px` at rest (`signal` at 70%) to `20px` on hover (full `signal`) to `24px` `signal-bright` when active, each with a `7px` dot that springs in. The track is a real slider when playable: `role="slider"` with `aria-valuetext` in timecode, pointer scrubbing with pointer capture, and arrow keys (`5s`, `30s` with Shift) plus Home/End.
- **Waveform alpha:** played bars are `rgba(255, 176, 32, 0.30)`, unplayed `rgba(246, 240, 228, 0.24)`. Both sit below the pins and the playhead on purpose — see the Pins-Outrank-Playback Rule.
- **Playable vs not-playable:** when playback is unavailable the track loses `role="slider"`, its cursor, and its tab stop; pins remain fully interactive because a result is still a position you can read, and they keep their own focus ring (`2px` amber at `2px` offset, `focus-visible:outline-signal`) so a keyboard user can reach every match on the ribbon.
- **Waveform vs ruler:** the waveform is drawn *only* from decoded audio peaks. With no decoded audio the ribbon draws a centre line and an amber progress line against the minute ruler.

### Search Field
The primary action, and the loudest control on the page. A `22px` panel at 90% ink-900 with `backdrop-blur-xl`, an amber border at 22% (35% on hover, 55% focused — the field declares itself primary before anyone touches it), a `20px` amber lens on the field's own baseline at `21px` from the top, and a textarea that auto-grows from `26px` to `108px` of text height with the field springing to match. Focused: surface to `ink-850`/95%, shadow deepens. A `24px` clear button springs in at 50%→100% scale only when there is a value.
- **Action button:** `44px` tall, `16px` radius, right-bottom aligned, and the page's single primary action. **It has a rest state and it is amber:** `border-signal/65 bg-signal/20 text-signal-bright` with nothing to search, filling solid `bg-signal text-ink-950` (hover `signal-bright`) once there is a value or a search is running. Deliberately one step hotter than the deck's transport ring, so the primary action still wins the first viewport. Three icons occupy one `20px` slot and crossfade with a rotate and a 1px blur — lens (empty), arrow (has value), scanning meter (busy) — while the label morphs "Search" ⇄ "Stop" and is hidden entirely below `sm`.
- **Responsive reserve (easy to regress):** the right-hand reserve is `94px` below `sm` and `132px` above, the clear button sits at `66px` / `112px`, the text pad is `pl-11` / `sm:pl-14`, the type steps `1rem` → `1.1875rem` at `sm`, and a shorter placeholder is swapped in below `sm`. A fixed desktop reserve strands the button and wraps the placeholder onto two lines on a phone.
- **Empty-textarea height (easy to regress):** with no value the textarea is pinned to exactly one row rather than trusting `scrollHeight`. Chromium includes the laid-out *placeholder* in an empty textarea's `scrollHeight`, so a placeholder that wraps at narrow widths silently inflates the field by two rows before anyone has typed.
- **Scroll fade masks:** mounted **only** while the textarea is actually scrollable. Kept alive at zero opacity they read as a faint band across the placeholder, because a gradient's stop colour can never match a translucent, backdrop-blurred field in every state.
- **Suggestions popover:** `20px` panel on **solid** `ink-900` with no backdrop blur, entering with a spring scale from `0.98`. A single `ink-800` highlight block slides between `36px` rows on hover instead of each row painting its own background.
- **Combobox semantics:** the textarea is `role="combobox"` with `aria-expanded`, `aria-controls`, `aria-autocomplete="list"` and `aria-activedescendant`; the panel is `role="listbox"` and `inert` when closed; each option is `role="option"` with `aria-selected` and `tabIndex={-1}` while closed, so four invisible buttons never sit in the tab order behind the submit. ↑↓ wrap around the list and Enter submits the active option.
- **Disabled:** when nothing is indexed the field drops to 50% opacity and loses pointer events.

### Result Card
`20px` card graphite with a hairline border and the card shadow, with hover coupling that lights the matching pin on the ribbon. Hover raises to `ink-800`, lifts `1px`, and swaps to the lift shadow. Active is a `1px` amber border at 55% over `ink-800`.
- **It is an `<article>`, not a `role="button"`.** No card-level role, no card-level `tabIndex`. Wrapping two real buttons in a button role collapses the whole card to one accessible name and the highlighted words and both actions vanish for assistive tech. The card's click handler is a **mouse convenience only**; the keyboard path is the two real buttons.
- **Left gutter:** the timecode at `1.5/1.875rem` — `paper` at rest and `signal-bright` only when the card is the position currently playing. It does **not** recolour on hover; a hover recolour of every timecode would spend the notation amber carries.
- **Body:** transcript text in paper-dim, promoted to paper on hover, wrapped in decorative curly quotes, with matched runs marked in graphite (`ink-750` ground, paper text, `1px` inset paper hairline at 14%, `box-decoration-clone`). Whole-phrase matches mark as one run; individual terms only when the phrase is absent. A "CLOSEST" micro-label sits on the first card only, in `paper-faint` warm grey — not amber — plus an uppercase speaker name when the recording has more than one speaker.
- **Actions:** a "Play from `MM:SS`" chip carrying `data-play`, quiet `ink-750`/70% with a paper-dim label and an **amber play glyph** at rest, `ink-750`/paper on card hover, and filled solid amber only when it *is* the position playing. Its verb and icon change to "Open at" with an arrow when playback is unavailable. Its `aria-label` is built from `spokenTime()` while the visible label is `aria-hidden`, so the colon form never gets read out digit by digit. Beside it, a ghost "Read in context" pill.
- **Keyboard traversal walks the play buttons**, not the cards: `playButtonFor()` resolves `button[data-play]` inside each card, ArrowDown/ArrowUp move between them, and ArrowUp from the first returns focus to the field.
- **No score.** There is no rank number, percentage, or relevance bar. Card order is the ranking.

### Context Sheet
"Read in context" grows the pressed pill into a reading panel: a shared-element FLIP animating `top`/`left`/`width`/`height`/`border-radius` from the button's own rect (`999px`) to a centred `24px` panel, then measures its loaded content and reuses the same transition to settle at the right height. Panel graphite, hairline-strong border, overlay shadow, over a `72%` ink-950 blurred scrim. Header carries the moment's timecode at `1.375rem` in amber with an "IN CONTEXT" label, a "Play from here" pill when playable — one of the two singular play controls, so it takes an amber **edge** rather than an amber fill (`border-signal/45 bg-ink-850` with a paper label and an amber glyph; hover `border-signal/70 bg-ink-800`) — and a round close button. Body is a timecode-gutter transcript where matched lines are paper with amber stamps and surrounding lines are paper-faint; matched words inside them carry the same graphite `<mark>` as the cards. Loading shows three staggered pulse bars, not a spinner. `role="dialog"`, `aria-modal`, Escape closes, body scroll locks, focus moves to the panel.

### Transport
A `44px` round play/pause button drawn as an amber **ring**, not an amber fill: enabled `border-signal/28 bg-ink-850 text-signal`, hover `border-signal/55 bg-ink-800`, press `scale-95`; disabled `border-line bg-ink-850 text-paper-faint`. It is deliberately one step lighter than the search submit, so the primary action still wins the first viewport and the deck does not out-shout the field beneath it. Its two icons crossfade with a spring scale. Beside it, two `36px` ghost nudge buttons (±10s) and the timecode readout — current time turning amber while playing, total time in paper-faint. The five-bar level meter appears only while audio is actually playing, in `paper-dim`; at rest it would be five grey dots pretending to be an instrument. When there is no media file the transport degrades to a disabled graphite button plus a plain sentence naming where to put the file.

### Level Bars
Five `3px` round-capped bars in `currentColor`, three duties: `scan` sweeps left to right as the search loading indicator, `level` is driven by a real analyser during playback, `rest` sits at a floor. Both animated variants stop entirely under reduced motion, and the element is `aria-hidden`.

### States
All of them share one **left-axis** frame (`items-start`, `text-left`, `py-9` / `sm:py-11`, entering with a fade and a `2px` rise) and one voice. They are not centred: a centred block sitting under a left-aligned "RESULTS" rule reads as two different pages.
- **Idle:** a `48px` panel tile at `16px` radius holding a **paper-dim** lens, "Nothing searched yet", plus an indexed-section count in timecode.
- **Searching:** a left-aligned row — the scanning meter in `paper-dim` beside the label "Searching transcript…" — not a centred block.
- **Results:** a hairline-ruled header with an uppercase "RESULTS" label and a morphing count, then the card list.
- **No results:** headline, the query quoted back in paper-dim, and a ghost "Start over" pill that clears and refocuses the field.
- **Error:** paper-dim alert glyph in the same `48px` tile, "Something went wrong. Nothing was lost — try it again.", and a ghost "Try again" pill (hairline-strong border, paper-dim label) — the state icons and their recovery buttons are neutral, because a failure is not a position.
- **No index:** paper-dim alert glyph and a plain setup instruction; the search field is disabled in this state.

### Magnetic Cursor
A `14px` paper dot in `exclusion` blend with a `1.35` contrast boost, lerped toward the pointer and stretched along its direction of travel (up to `+0.7` on X, `−0.25` on Y). Over any `[data-magnetic]` element it snaps to that element's bounds plus `8px`, adopts its computed radius, and switches to a `1.5px` amber ring in `normal` blend — because exclusion over a saturated amber fill inverts it to blue and destroys the label. The element itself leans `0.22` toward the pointer on an `elastic.out(1, 0.4)` release. Opt-in per element: the wordmark, the search action, the transport play button, the "Play from" pill, the sheet's play pill, and state buttons. Disabled entirely on touch, on coarse pointers, and under reduced motion.

### Icons
Every icon that carries product meaning is authored in one place on a 20-unit grid at `1.6` stroke weight, `round` caps and joins, `currentColor`, `aria-hidden`. Fills are used only where a solid form is the correct symbol (play, pause, the nudge triangles, dot terminals). Icon weight is tuned to sit with the type, not with a third-party set's default.

### Named Rules
**The Real-Data Rule.** The waveform is drawn only from decoded audio. When decoding fails or there is no media, the ribbon falls back to a minute ruler and a centre line. Invented peaks are forbidden: a fake waveform is a picture of data that does not exist.

**The No-Score Rule.** Relevance is never surfaced as a number, a bar, a percentage, or a rank badge. Ordering carries the ranking; a number only invites the user to argue with it.

**The Instrument-At-Rest Rule.** Live-data indicators exist only while there is data to show. The level meter renders during playback and nowhere else.

**The Coupled-Hover Rule.** Hovering or focusing a result lights its pin on the ribbon, and hovering a pin lights nothing else. The list and the timeline are two views of one set, and the pointer proves it.

## Motion

Two authored curves, one for morphs and one for reveals, plus one authored moment.

- **Spring** (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`, `0.3–0.44s`): Anything that changes size or swaps identity — the field's height morph, icon crossfades, the morphing label's width, pin height and dot pops, the suggestion highlight slide, the context sheet's FLIP open, chip and button transitions.
- **Exponential ease-out** (`cubic-bezier(0.16, 1, 0.3, 1)`, `0.35–0.5s`): Reveals and collapses that must not overshoot — the hero's max-height and translate as it springs away on search.
- **Ease-out, 500ms:** every entrance (result cards, pins, state frames) via a fade plus a short directional slide.
- **The one authored moment:** pins land on the ribbon in a `55ms` stagger with a `fade-in slide-in-from-top-2`, and cards enter beneath in a `70ms` stagger capped at eight cards so a long list never crawls. This is the story of the product — moments pinning themselves to the timeline — and it is the only place in the build that spends the user's time on choreography.
- **Closing is faster than opening:** the context sheet closes in `0.26s` on `cubic-bezier(0.4, 0, 1, 1)` against `0.44s` on the spring to open.
- **Hover and colour transitions** are `0.2–0.3s`; nothing interactive changes state instantly and nothing takes longer than `0.5s`.

### Named Rules
**The Reduced-Motion Rule.** Under `prefers-reduced-motion: reduce` all animations and transitions are clamped to `0.01ms` globally, the magnetic cursor never mounts, and the scanning meter holds still. Every state remains reachable; nothing depends on an animation completing to be readable.

**The One Moment Rule.** There is exactly one piece of authored choreography — the pin-landing stagger. Everything else is a state change with an honest curve on it. A second showpiece would make the first one furniture.

## Accessibility

- **Focus is global and amber.** `:focus-visible` draws a `2px` amber outline at `2px` offset with a `4px` radius, applied at the base layer so nothing can be focused invisibly. Composite controls (the card's two buttons, the submit, the pins, the transport, the suggestion options) restate it explicitly.
- **Real elements over composite roles.** A result card is an `<article>` with no role and no `tabIndex`; its two buttons are the accessible surface, so the marked words and both actions survive instead of collapsing into one accessible name.
- **Keyboard paths are complete.** `/` focuses the field from anywhere outside a text input; Enter submits, Shift+Enter newlines, Escape steps back through popover → clear value → blur; ArrowDown opens suggestions from an empty field and ↑↓ wrap within them; ArrowUp/ArrowDown walk the result list by moving between the cards' **play buttons**, and ArrowUp from the first returns to the field; the ribbon scrubs with arrows (`5s` / `30s`) and Home/End; Escape closes the sheet.
- **The suggestion list is a real combobox.** `role="combobox"` on the textarea with `aria-expanded` / `aria-controls` / `aria-autocomplete="list"` / `aria-activedescendant`; `role="listbox"` on the panel, `inert` when closed; `role="option"` with `aria-selected` on each row, and `tabIndex={-1}` while closed so closed options never sit in the tab order.
- **Time is spoken, not shown.** A card's play button carries an `aria-label` built from `spokenTime()` ("2 minutes 14 seconds") while its visible colon-form label is `aria-hidden`, and the ribbon exposes `aria-valuetext` as a timecode.
- **Decoration is hidden.** The waveform canvas, the level meter, the magnetic cursor, curly quotes, middot separators, and icon SVGs are all `aria-hidden`; the grain and room washes are pure background.
- **Regions are named.** `aria-label` on the deck ("The indexed recording"), the results section, the field ("Search inside the transcript"), and the dialog; `aria-busy` on the sheet's loading skeleton; `aria-hidden` on the hero once it has collapsed.
- **The colour is never the only cue.** The active pin is taller as well as brighter, the active card gains a border and a background step, the playing state changes the icon, and matched words are real `<mark>` elements carrying a ground, a hairline and a radius rather than a tint alone.
- **Text scale is respected.** `-webkit-text-size-adjust: 100%`, no font-size lock, `font-synthesis-weight: none` so no faux-bold appears at any zoom.

## Browser Surfaces

The surfaces the browser draws by default are drawn deliberately here: `color-scheme: dark`; selection in amber at 30% over paper text; caret amber in every input and textarea; a `10px` scrollbar with a transparent track and a `999px` `ink-750` thumb ringed by a `3px` page-coloured border (a `#33373d` hover), plus a `4px` thumb-on-hover-only variant inside the field and the sheet; `theme-color` `#0B0C0D` so mobile browser chrome joins the room; the global default border colour set to the hairline token so an unstyled border can never appear white.

## Do's and Don'ts

### Do:
- **Do** put every number that means a position in time in `.timecode` (Martian Mono, tabular, `-0.055em`).
- **Do** keep amber to its two meanings — a position in the recording (played time, playhead, pins, active moment) and the play affordance (an amber glyph on every play control, plus the one primary action).
- **Do** escalate a play control on its **container**, not its glyph: repeated chip stays graphite, singular control takes an amber edge, only the position currently playing fills solid amber.
- **Do** keep the played waveform (`30%`) below the pins (`70–100%`) and the playhead in alpha, so playback never swallows the pins it crosses.
- **Do** mark matched words in graphite (`ink-750` with a `1px` inset paper hairline at 14%), and let `box-decoration-clone` keep a wrapped run intact.
- **Do** measure any height a reveal animates to, reading `borderBoxSize` rather than `contentRect` so an element's own padding is not clipped off the ceiling.
- **Do** keep the empty, no-results, error and no-index states on the page's left axis, and give the searching state a left-aligned row rather than a centred block.
- **Do** raise an element by stepping it up the graphite ramp (`#16181b` → `#1d2024`) rather than by brightening its border.
- **Do** draw the waveform from decoded audio only, and fall back to the minute ruler when there is none.
- **Do** make the timecode the largest element in a result card, larger than the transcript text.
- **Do** use the spring `cubic-bezier(0.175, 0.885, 0.32, 1.275)` for anything that changes size or swaps identity, and the exponential ease-out `cubic-bezier(0.16, 1, 0.3, 1)` for reveals.
- **Do** couple the list and the timeline: hovering or focusing a result lights its pin.
- **Do** write state copy in the product's language ("No matching section found"), and give every state a way forward.
- **Do** author new icons on the 20-unit grid at `1.6` stroke so their weight matches the type.
- **Do** keep live indicators off the screen when there is no live data.

### Don't:
- **Don't** surface a relevance score as a number, a bar, a percentage, or a rank badge.
- **Don't** draw invented waveform peaks, placeholder audio, or any picture of data that does not exist.
- **Don't** introduce a second accent hue, including a red error colour or a green success colour.
- **Don't** use amber as decoration, or as an emphasis border on something that is neither a position nor a play affordance.
- **Don't** recolour anything amber on hover — not a card's timecode, not the "Play from" chip, not a neutral control. Amber arrives with meaning, not with the pointer.
- **Don't** highlight matched words in amber, and don't put a second solid-amber button on a screen beside the search submit.
- **Don't** add an amber glow, halo, bloom, or ring shadow to an element on the content plane — the only amber light in the build is the sub-8% room wash beneath everything.
- **Don't** mark the active moment with a fat coloured bar or a thick left rail; it gets a `1px` amber border at 55%.
- **Don't** wrap a card's contents in `role="button"`; the card is an `<article>` and its two real buttons are the keyboard path.
- **Don't** put a backdrop blur on the suggestion popover; the empty state sits under its footprint and ghosts through translucency.
- **Don't** keep the field's scroll fade masks mounted when there is nothing to scroll, and don't trust an empty textarea's `scrollHeight` — Chromium counts the laid-out placeholder in it.
- **Don't** thicken or colour a hairline to make it more present — move it from 8% to 16% paper.
- **Don't** add a second piece of authored choreography alongside the pin-landing stagger.
- **Don't** name the retrieval method, a threshold, a chunk, or any engine concept on the surface.
- **Don't** widen the page past `1080px` or introduce a sidebar, split view, or second content track.
- **Don't** carry over the reference components' model picker, effort cycler, attachment tray, or text-caret cursor stretch; each was declined on purpose and none is part of this system.
