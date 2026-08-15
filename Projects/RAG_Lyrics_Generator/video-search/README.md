# Video Search

Search inside one recording's transcript and jump to the moment it was said.

```
transcript  →  query  →  ranked sections  →  timestamp  →  play from there
```

The frontend does not know how retrieval works. It posts a query to `/api/search`
and renders whatever comes back. Swap TF-IDF for embeddings, hybrid search, or a
reranker and nothing in `frontend/` changes — that separation is the point.

---

## Just want to look at it?

`video-search-preview.html` is the whole app in one self-contained file — no npm,
no server, no backend. Double-click it. It runs against the offline transcript
sample, which is what the **Offline sample** badge in the header means. Playback
is unavailable there, because a file:// page has no media to stream.

Rebuild it any time with `npm run build:single` in `frontend/`.

---

## Run it for real

Two processes. Backend first.

```bash
# 1. backend  (http://127.0.0.1:8000)
cd backend
python -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 2. frontend (http://127.0.0.1:5173)
cd frontend
npm install
npm run dev
```

Open http://127.0.0.1:5173. Vite proxies `/api/*` to the backend, so there is no
API URL to configure.

If the backend is down the UI still runs against a local sample of the real
transcript and labels itself **Offline sample** in the header. That is a
development convenience, not a silent fallback.

---

## Playback

Drop the recording's audio or video file into `backend/media/`. The first
media file found there is streamed at `/api/media` with HTTP Range support, so
clicking a timestamp seeks instead of re-downloading.

With no media file the timeline still works as a map of the recording — result
pins, ruler, scrubbing disabled — and the transport says what is missing. The
waveform only ever draws decoded audio; it never invents peaks.

---

## Pointing it at a different recording

Environment variables, no code edits:

```bash
TRANSCRIPT_PATH="/path/to/lecture.pdf" \
SOURCE_TITLE="Distributed Systems, Lecture 4" \
SOURCE_BYLINE="Prof. Ada Nkemdirim" \
SOURCE_KIND=lecture \
uvicorn main:app --reload
```

| Variable | Default | Notes |
|---|---|---|
| `TRANSCRIPT_PATH` | the Declan McKenna PDF | `.pdf`, `.txt`, `.vtt`, `.srt`-style |
| `MEDIA_DIR` | `backend/media` | first playable file wins |
| `SOURCE_TITLE` / `SOURCE_BYLINE` | — | shown in the deck |
| `SOURCE_KIND` | `music` | `music`, `podcast`, `interview`, `lecture`, `talk`, `video` — picks the glyph |
| `SEARCH_BACKEND` | `tfidf` | or `lsa` |
| `CHUNK_SIZE` | `300` | characters per searchable section |

Transcript lines must look like:

```
[00:02:14.37] - Speaker 1
the words that were said, wrapped over as many lines as the source likes
```

The suggestion chips under the search box are derived from the transcript's own
distinctive phrases at startup. Nothing there is hardcoded.

---

## API

| Route | Purpose |
|---|---|
| `GET /api/source` | what is indexed, duration, playability, sample queries |
| `POST /api/search` | `{ query, k? }` → `{ results: [...] }` |
| `GET /api/context/{chunk_id}` | a moment plus its neighbours |
| `GET /api/media` | streams the recording, Range-aware |
| `GET /api/health` | liveness |

A result:

```json
{
  "chunk_id": 4,
  "start_time": 154.07,
  "end_time": 180.04,
  "timestamp": "00:02:34",
  "text": "Slipping through my fingers all the time…",
  "speaker": "Speaker 1",
  "score": 0.42
}
```

`score` is for ordering only. No component reads it and none should.

---

## The notebook

`../RAG_lyrics.ipynb` is the experiment surface, and it does **not** reimplement
the engine — it imports it:

```python
from transcript_search import load_index
```

That one line is the layout's whole point. The notebook and the API run the same
code, so anything you prove in a cell is already true in the running app. No
copying, no drift, no "which version was I tuning?"

The rule: **the notebook asks questions, the module holds answers.** If you find
yourself pasting a function body into a cell, you are about to create the second
copy this arrangement exists to prevent.

It ships executed, so you can read the results without running anything. Inside:
a chunk-size sweep measured against a gold set, TF-IDF vs LSA, the IDF weights
that actually decide your rankings, and a score histogram showing why `min_score`
exists (75% of all query×chunk pairs fall below it).

---

## Layout

```
RAG_lyrics.ipynb         the lab — imports the engine, never reimplements it
RAG_lyrics.original.ipynb  your first version, kept as a record
video-search/
backend/
  transcript_search.py   parsing, chunking, index — no web framework in sight
  main.py                FastAPI: four routes
  media/                 drop the audio/video file here
frontend/
  src/lib/               api client, types, timecode, highlighting, offline sample
  src/hooks/use-media.ts playback, waveform decoding, level meter
  src/components/ui/     reusable primitives (shadcn-style)
  src/components/        the surface: deck, timeline, cards, context sheet, states
```

## Where to take it next

The seams are already cut for these:

- **Better recall.** TF-IDF cannot find "what does he say about parenthood" if
  the word is never spoken. `SEARCH_BACKEND=lsa` buys a little tolerance;
  swapping in sentence embeddings buys a lot. Only `transcript_search.py` moves.
- **Chunk size.** The one knob that changes result quality most. Small chunks
  split a phrase across two sections; large chunks return a timestamp minutes
  before the words. Re-run your own queries after changing it.
- **Evaluation.** Write down twenty queries and the timestamp each should
  return, then measure. Without that you are tuning by vibes.
- **More than one recording.** `TranscriptIndex` is per-source by design; a
  library is a dict of them plus a source picker in the deck.
