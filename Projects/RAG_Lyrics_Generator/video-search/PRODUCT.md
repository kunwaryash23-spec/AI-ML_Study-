# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React 19 + TypeScript + Tailwind CSS 4, shadcn-style project structure (`src/components/ui`, `src/lib/utils`). Backend is Python: FastAPI serving `POST /search` over a TF-IDF index built from a timestamped transcript. Chosen by the user, 2026-08-13.

## Users

A person who already has a specific recording in front of them and remembers *something that was said* in it, but not *when*. They are mid-task: writing notes from a lecture, pulling a quote from a podcast, finding the bar a lyric lands on, locating a claim in an interview. They arrive with a phrase or a half-remembered idea, and they need a timestamp they can act on.

## Product Purpose

Search inside one recording's transcript and return the moments where the query is spoken, each with a timestamp precise enough to jump to. Success is a single measurable thing: the user finds the right moment on the first search and plays from it. Everything else in the interface is overhead.

## Positioning

Scrubbing a timeline is guessing; Ctrl+F on a transcript dump is reading. This searches the transcript and answers with *positions on the recording* — the result is a place, not a passage. The retrieval method (currently TF-IDF over ~300-character transcript chunks) is an implementation detail the interface never names.

## Operating Context

- Source transcripts arrive as timestamped text. The current one is extracted from a PDF whose lines look like `[00:00:12.34] - Speaker 1 <text>`.
- Segments are merged into ~300-character chunks; each chunk carries `chunk_id`, `start_time`, `end_time`, `text`, and an optional `speaker`.
- Search contract: `POST /search { "query": string, "k"?: number }` → `{ "results": [{ chunk_id, start_time, end_time, timestamp, text, score, speaker? }] }`.
- The frontend must stay independent of the retrieval implementation. Swapping TF-IDF for embeddings, hybrid search, or a reranker must require no frontend change.
- `score` is used for ordering only and is never surfaced as a number.
- One recording is indexed at a time. Multiple sources and a library view are explicitly out of MVP scope.

## Capabilities and Constraints

Confirmed in scope:

- Single-page search over one indexed recording.
- Result cards: timestamp, transcript text, optional speaker, action to play from that point.
- Audio playback with timestamp seeking (user chose the working-player scope).
- Loading, empty, no-results, and error states. No raw tracebacks or retrieval internals reach the user.
- Responsive from mobile through desktop; no horizontal scrolling.

Explicitly out of scope: authentication, dashboards, chat interfaces, agents, settings panels, YouTube URL ingestion, transcript upload, automatic transcription, speaker filtering, persisted search history, multi-video library.

Terminology: "moment" for a returned chunk, "recording" for the indexed source, "timecode" for the displayed position. Never "chunk", "embedding", "TF-IDF", "RAG", "relevance score", or "retrieval" in user-facing copy.

## Brand Commitments

Binding constraints the user set:

- Name: **Video Search**. Subtitle: *Find anything inside a video.*
- Deep dark, media-oriented surface. Large clean typography, rounded cards, subtle borders, soft shadows, sparing gradients, small amounts of glass/blur, generous whitespace, strong contrast on timestamps.
- Explicitly ruled out: excessive neon, excessive animation, cluttered dashboards, many controls, large decorative illustrations, technical-looking panels, visible ML scores.
- Two pinned interaction references (21st.dev components) whose grammar the build must adopt: a spring-morphing prompt input (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`, width-morphing text, crossfading action-button icons, scroll fade masks, shared-element FLIP modal, sliding hover highlight in popovers) and a GSAP magnetic cursor with exclusion blending.

## Evidence on Hand

- `RAG_lyrics.ipynb` — working notebook: PDF text extraction (PyMuPDF), regex segmentation, 300-char chunking, `TfidfVectorizer` index, `search_transcript(query, k)`.
- `Declan McKenna - Slipping Through My Fingers (Official Audio).pdf` — the one real transcript on disk.
- No audio or video file is present yet. The player is built against a real `<audio>` element and streams from the backend once the user drops a media file in; until then it runs against a generated demonstration track and the UI says so. Do not claim playable media exists.
- No users, benchmarks, pricing, uptime, or accuracy figures exist. None may be invented.

## Product Principles

1. **A timestamp is the deliverable.** Every screen state is judged by how fast the user gets to a position they can play.
2. **The method stays invisible.** Nothing in the interface reveals or depends on how retrieval works.
3. **One recording, one job.** New capability must earn its place against the cost of another control on the page.
4. **Never show the machinery failing.** Backend errors become plain language and a retry, never a stack trace or an empty screen.
5. **The transcript is content, not data.** Spoken words are typeset to be read, not rendered as rows in a table.

## Accessibility & Inclusion

- Keyboard-complete: Enter searches, arrow keys walk results, Enter plays the focused moment, Escape closes overlays.
- Visible focus rings drawn from the palette, never the browser default.
- Timecode uses tabular numerals and holds ≥4.5:1 contrast against its surface.
- Motion respects `prefers-reduced-motion`; the magnetic cursor is disabled on touch and under reduced motion.
