"""
FastAPI shell around transcript_search.py.

Run it:
    cd backend
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

The whole API is four routes. Keep it that way -- every route you add here is a
control the frontend eventually has to explain to the user.

    GET  /api/source          what is indexed, how long it is, is media playable
    POST /api/search          the only route that matters
    GET  /api/context/{id}    surrounding lines for the expanded reading view
    GET  /api/media           streams the audio/video file, with Range support
"""

from __future__ import annotations

import mimetypes
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel, Field

from transcript_search import format_timecode, load_index

# --------------------------------------------------------------------------
# Configuration
# --------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent

# Point this at your transcript. Env var wins so you can swap sources without
# editing code: TRANSCRIPT_PATH=/path/to/lecture.pdf uvicorn main:app
TRANSCRIPT_PATH = Path(
    os.environ.get(
        "TRANSCRIPT_PATH",
        PROJECT_DIR / "Declan McKenna - Slipping Through My Fingers (Official Audio).pdf",
    )
)

# Drop the recording's audio or video file in backend/media/ to enable playback.
MEDIA_DIR = Path(os.environ.get("MEDIA_DIR", BASE_DIR / "media"))
MEDIA_EXTENSIONS = {".mp3", ".m4a", ".aac", ".wav", ".ogg", ".opus", ".flac", ".mp4", ".webm", ".mov"}

SOURCE_TITLE = os.environ.get("SOURCE_TITLE", "Slipping Through My Fingers")
SOURCE_BYLINE = os.environ.get("SOURCE_BYLINE", "Declan McKenna")
SOURCE_KIND = os.environ.get("SOURCE_KIND", "music")  # music | podcast | lecture | interview | talk
SEARCH_BACKEND = os.environ.get("SEARCH_BACKEND", "tfidf")  # tfidf | lsa

CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE", "300"))

app = FastAPI(title="Video Search", version="1.0.0", docs_url="/api/docs")

# The Vite dev server runs on a different port, so the browser treats it as a
# different origin. In production, serve the built frontend from FastAPI and
# this list can shrink to nothing.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# --------------------------------------------------------------------------
# Index, built once at startup
# --------------------------------------------------------------------------

INDEX = None
INDEX_ERROR: str | None = None

try:
    INDEX = load_index(TRANSCRIPT_PATH, backend=SEARCH_BACKEND, chunk_size=CHUNK_SIZE)
except Exception as exc:  # noqa: BLE001 - surfaced through /api/source
    INDEX_ERROR = str(exc)


def require_index():
    if INDEX is None:
        # 503, not 500: the service is fine, its source is not.
        raise HTTPException(status_code=503, detail="No transcript is indexed.")
    return INDEX


def find_media() -> Path | None:
    if not MEDIA_DIR.is_dir():
        return None
    for path in sorted(MEDIA_DIR.iterdir()):
        if path.is_file() and path.suffix.lower() in MEDIA_EXTENSIONS:
            return path
    return None


# --------------------------------------------------------------------------
# Schemas
# --------------------------------------------------------------------------


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=400)
    k: int = Field(6, ge=1, le=25)


# --------------------------------------------------------------------------
# Routes
# --------------------------------------------------------------------------


@app.get("/api/source")
def get_source():
    """Everything the UI needs to describe what is indexed."""
    media = find_media()
    return {
        "title": SOURCE_TITLE,
        "byline": SOURCE_BYLINE,
        "kind": SOURCE_KIND,
        "indexed": INDEX is not None,
        "index_error": INDEX_ERROR,
        "duration": INDEX.duration if INDEX else None,
        "duration_label": format_timecode(INDEX.duration) if INDEX else None,
        "moment_count": len(INDEX.chunks) if INDEX else 0,
        "speakers": INDEX.speakers if INDEX else [],
        # Example queries derived from this transcript, never hardcoded.
        "sample_queries": INDEX.suggested_queries(4) if INDEX else [],
        "media_available": media is not None,
        "media_kind": ("video" if media and media.suffix.lower() in {".mp4", ".webm", ".mov"} else "audio")
        if media
        else None,
        "media_url": "/api/media" if media else None,
    }


@app.post("/api/search")
def post_search(payload: SearchRequest):
    """
    The only route the product actually needs.

    Note what is NOT in the response: no backend name, no vectoriser settings,
    no explanation of the score. `score` rides along for ordering and debugging
    and the UI is expected to ignore it.
    """
    index = require_index()
    results = index.search(payload.query, k=payload.k)
    return {"query": payload.query, "count": len(results), "results": results}


@app.get("/api/context/{chunk_id}")
def get_context(chunk_id: int, radius: int = 1):
    index = require_index()
    if not 0 <= chunk_id < len(index.chunks):
        raise HTTPException(status_code=404, detail="No such moment.")
    return {"chunk_id": chunk_id, "lines": index.context(chunk_id, radius=radius)}


@app.get("/api/media")
def get_media(request: Request):
    """
    Stream the recording with HTTP Range support.

    Range matters: without it the browser must download the whole file before
    it can seek, which defeats the entire point of clicking a timestamp.
    """
    media = find_media()
    if media is None:
        raise HTTPException(
            status_code=404,
            detail=f"No media file found. Put an audio or video file in {MEDIA_DIR}.",
        )

    file_size = media.stat().st_size
    content_type = mimetypes.guess_type(media.name)[0] or "application/octet-stream"
    range_header = request.headers.get("range")

    if not range_header:
        return FileResponse(
            media,
            media_type=content_type,
            headers={"Accept-Ranges": "bytes", "Cache-Control": "public, max-age=3600"},
        )

    units, _, raw = range_header.partition("=")
    if units.strip().lower() != "bytes":
        raise HTTPException(status_code=416, detail="Only byte ranges are supported.")

    start_raw, _, end_raw = raw.partition("-")
    try:
        start = int(start_raw) if start_raw else 0
        end = int(end_raw) if end_raw else file_size - 1
    except ValueError:
        raise HTTPException(status_code=416, detail="Malformed Range header.") from None

    end = min(end, file_size - 1)
    if start > end:
        raise HTTPException(status_code=416, detail="Range out of bounds.")

    with media.open("rb") as handle:
        handle.seek(start)
        data = handle.read(end - start + 1)

    return Response(
        content=data,
        status_code=206,
        media_type=content_type,
        headers={
            "Content-Range": f"bytes {start}-{end}/{file_size}",
            "Accept-Ranges": "bytes",
            "Content-Length": str(len(data)),
        },
    )


@app.get("/api/health")
def health():
    return {"ok": INDEX is not None}
