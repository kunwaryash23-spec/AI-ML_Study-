"""
Transcript ingestion + search.

This module is deliberately free of any web framework. It knows how to:

    1. read a timestamped transcript out of a PDF  -> parse_pdf()
    2. merge tiny segments into searchable chunks  -> build_chunks()
    3. build a lexical index and query it          -> TranscriptIndex

`main.py` (FastAPI) is a thin shell around this. The reason for that split is
the one product principle that matters most here: the frontend must not know
*how* retrieval works. Keeping retrieval in a plain Python class means you can
swap TF-IDF for LSA, embeddings, or a hybrid reranker by editing this file
alone -- the HTTP contract and the UI never move.

Why TF-IDF at all?
------------------
TF-IDF scores a chunk by how often the query's words appear in it (term
frequency) discounted by how common those words are across the whole
transcript (inverse document frequency). It is exact-word matching, so it is
excellent for "find the line that says X" and useless for "find where he talks
about parenthood" if the word "parenthood" is never spoken. That limitation is
the reason SEARCH_BACKENDS below exists: LSA (TruncatedSVD over the TF-IDF
matrix) buys you a little semantic tolerance for free, and swapping in a
sentence-transformer buys you a lot. Start lexical, measure, then upgrade.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Iterable, Literal

import numpy as np
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import Normalizer

# --------------------------------------------------------------------------
# Parsing
# --------------------------------------------------------------------------

# Matches:  [00:02:14.37] - Speaker 1
#           the words that were said, possibly wrapped over several lines
# The lookahead stops the capture at the next timestamp instead of at a
# newline, which is what lets a single spoken block span multiple PDF lines.
SEGMENT_PATTERN = re.compile(
    r"\[(\d{2}:\d{2}:\d{2}\.\d{2})\]\s*-?\s*(.*?)(?=\[\d{2}:\d{2}:\d{2}\.\d{2}\]|$)",
    re.DOTALL,
)

SPEAKER_PATTERN = re.compile(r"^(Speaker\s+\d+|[A-Z][A-Za-z .'-]{1,30}?):?\s+(.*)$")

# Used only to judge whether a suggested phrase is mostly filler.
STOP_WORDS = {
    "a", "an", "and", "the", "of", "to", "in", "on", "at", "for", "with", "is",
    "are", "was", "were", "be", "been", "it", "its", "that", "this", "i", "my",
    "me", "he", "she", "her", "his", "they", "we", "our", "do", "does", "did",
    "so", "but", "if", "or", "as", "all", "can", "just", "what", "when",
}


@dataclass
class Segment:
    """One timestamped line as it appears in the source transcript."""

    timestamp: str
    start_time: float
    text: str
    speaker: str | None = None


@dataclass
class Chunk:
    """A searchable unit: several consecutive segments merged together."""

    chunk_id: int
    start_time: float
    end_time: float
    text: str
    speaker: str | None = None
    segments: list[Segment] = field(default_factory=list)


def timestamp_to_seconds(timestamp: str) -> float:
    """'00:02:14.37' -> 134.37"""
    hours, minutes, seconds = timestamp.split(":")
    return int(hours) * 3600 + int(minutes) * 60 + float(seconds)


def format_timecode(seconds: float) -> str:
    """134.37 -> '00:02:14'.  Always h:mm:ss so columns line up in the UI."""
    total = int(seconds)
    return f"{total // 3600:02d}:{(total % 3600) // 60:02d}:{total % 60:02d}"


def parse_transcript(text: str) -> list[Segment]:
    """Turn raw transcript text into ordered Segments."""
    segments: list[Segment] = []

    for timestamp, body in SEGMENT_PATTERN.findall(text):
        # Collapse the PDF's hard line wraps into single spaces.
        body = " ".join(body.split())
        if not body:
            continue

        speaker: str | None = None
        match = SPEAKER_PATTERN.match(body)
        if match:
            speaker, body = match.group(1), match.group(2)

        segments.append(
            Segment(
                timestamp=timestamp,
                start_time=timestamp_to_seconds(timestamp),
                text=body,
                speaker=speaker,
            )
        )

    return segments


def parse_pdf(pdf_path: str | Path) -> list[Segment]:
    """Extract text from a PDF transcript, then parse it."""
    import pymupdf  # imported lazily so the module works without a PDF backend

    document = pymupdf.open(pdf_path)
    try:
        text = "\n".join(page.get_text() for page in document)
    finally:
        document.close()

    return parse_transcript(text)


# --------------------------------------------------------------------------
# Chunking
# --------------------------------------------------------------------------


def build_chunks(segments: Iterable[Segment], chunk_size: int = 300) -> list[Chunk]:
    """
    Merge consecutive segments until a chunk is about `chunk_size` characters.

    Chunk size is the single most consequential knob in this whole pipeline and
    it is a genuine trade-off, not a tuning detail:

      too small -> a query's words get split across two chunks, so neither
                   chunk scores well and the right moment never surfaces.
      too large -> the chunk matches, but its start_time points minutes before
                   the words the user actually asked for, so the timestamp is
                   technically correct and practically useless.

    300 characters is roughly two spoken sentences: long enough for TF-IDF to
    have signal, short enough that start_time still lands on the right moment.
    Change it and re-run your own queries; there is no universally right value.
    """
    chunks: list[Chunk] = []
    current: list[Segment] = []
    length = 0

    def flush() -> None:
        if not current:
            return
        speakers = {s.speaker for s in current if s.speaker}
        chunks.append(
            Chunk(
                chunk_id=len(chunks),
                start_time=current[0].start_time,
                end_time=current[-1].start_time,
                text=" ".join(s.text for s in current),
                # Only label a chunk when it belongs to exactly one speaker.
                speaker=next(iter(speakers)) if len(speakers) == 1 else None,
                segments=list(current),
            )
        )

    for segment in segments:
        if current and length + len(segment.text) > chunk_size:
            flush()
            current, length = [], 0
        current.append(segment)
        length += len(segment.text)

    flush()
    return chunks


# --------------------------------------------------------------------------
# Index
# --------------------------------------------------------------------------

SearchBackend = Literal["tfidf", "lsa"]


class TranscriptIndex:
    """
    A searchable transcript.

    Two backends, same interface -- which is the point. `search()` returns the
    same shape either way, so swapping the backend cannot break the frontend.

      "tfidf"  exact word overlap. Fast, transparent, zero tolerance for
               synonyms or paraphrase.
      "lsa"    TF-IDF projected onto `n_components` latent dimensions with
               TruncatedSVD. Words that co-occur across the transcript end up
               near each other, so paraphrase partly survives. On a transcript
               this short the latent space is thin, so keep expectations low --
               it is here as the honest next step, not a fix.
    """

    def __init__(
        self,
        chunks: list[Chunk],
        backend: SearchBackend = "tfidf",
        n_components: int = 60,
    ) -> None:
        if not chunks:
            raise ValueError("Cannot index an empty transcript.")

        self.chunks = chunks
        self.backend = backend
        texts = [chunk.text for chunk in chunks]

        # sublinear_tf dampens repeated words -- a chorus that says "slipping
        # through my fingers" five times should not outrank the verse that
        # answers the query better.
        self.vectorizer = TfidfVectorizer(
            stop_words="english",
            sublinear_tf=True,
            ngram_range=(1, 2),
        )
        matrix = self.vectorizer.fit_transform(texts)

        if backend == "lsa":
            # n_components can never exceed the number of features or samples.
            components = max(2, min(n_components, matrix.shape[1] - 1, len(chunks) - 1))
            self.reducer = make_pipeline(
                TruncatedSVD(n_components=components, random_state=0),
                Normalizer(copy=False),
            )
            self.matrix = self.reducer.fit_transform(matrix)
        else:
            self.reducer = None
            self.matrix = matrix

    # -- properties the API surfaces -------------------------------------

    @property
    def duration(self) -> float:
        return max(chunk.end_time for chunk in self.chunks)

    @property
    def speakers(self) -> list[str]:
        return sorted({c.speaker for c in self.chunks if c.speaker})

    # -- search -----------------------------------------------------------

    def search(self, query: str, k: int = 5, min_score: float = 0.02) -> list[dict[str, Any]]:
        """
        Rank chunks against `query` and return the top `k`.

        `min_score` is what turns a bad search into an honest empty result.
        Cosine similarity always returns *something*; without a floor the UI
        would confidently show the user the least-irrelevant line in the
        transcript. Dropping near-zero scores is what lets the interface say
        "no matching section found" and mean it.
        """
        query = query.strip()
        if not query:
            return []

        query_vector = self.vectorizer.transform([query])
        if self.reducer is not None:
            query_vector = self.reducer.transform(query_vector)
            scores = self.matrix @ query_vector.T
            scores = np.asarray(scores).flatten()
        else:
            # Both matrices are L2-normalised by TfidfVectorizer, so this dot
            # product *is* cosine similarity -- no extra division needed.
            scores = (self.matrix @ query_vector.T).toarray().flatten()

        order = np.argsort(scores)[::-1][:k]

        results: list[dict[str, Any]] = []
        for i in order:
            score = float(scores[i])
            if score < min_score:
                continue
            chunk = self.chunks[i]
            results.append(
                {
                    "chunk_id": chunk.chunk_id,
                    "start_time": chunk.start_time,
                    "end_time": chunk.end_time,
                    "timestamp": format_timecode(chunk.start_time),
                    "text": chunk.text,
                    "speaker": chunk.speaker,
                    "score": round(score, 4),
                }
            )

        return results

    def suggested_queries(self, n: int = 4) -> list[str]:
        """
        Pull example queries out of the transcript itself.

        Rank the transcript's own 3-to-5 word phrases by total TF-IDF weight and
        keep the strongest few that do not overlap each other. High weight means
        "distinctive to this recording", which is exactly what makes a good
        demonstration query.

        Note this uses its own vectoriser rather than the search one. The search
        index strips English stop words, which is right for matching and wrong
        for display -- "slipping fingers" is a good feature and a bad suggestion.
        Phrases shown to a person keep their connecting words.

        The point is that these are never hardcoded. Index a lecture on
        thermodynamics and the suggestions become phrases from that lecture,
        with no code change and nothing for the UI to know about.
        """
        phrase_vectorizer = TfidfVectorizer(ngram_range=(3, 4), sublinear_tf=True)
        try:
            matrix = phrase_vectorizer.fit_transform([c.text for c in self.chunks])
        except ValueError:
            return []

        names = phrase_vectorizer.get_feature_names_out()
        weights = np.asarray(matrix.sum(axis=0)).flatten()

        chosen: list[str] = []
        used: set[str] = set()

        for i in np.argsort(weights)[::-1]:
            phrase = str(names[i])
            words_in = phrase.split()
            content = set(words_in) - STOP_WORDS

            # A suggestion has to read like something a person would type:
            # it starts and ends on a real word, carries at least two of them,
            # and shares none with a phrase already chosen.
            if words_in[0] in STOP_WORDS or words_in[-1] in STOP_WORDS:
                continue
            if len(content) < 2 or content & used:
                continue

            chosen.append(phrase)
            used |= content
            if len(chosen) >= n:
                break

        return chosen

    def context(self, chunk_id: int, radius: int = 1) -> list[dict[str, Any]]:
        """Return a chunk plus its neighbours, for the expanded reading view."""
        lo = max(0, chunk_id - radius)
        hi = min(len(self.chunks), chunk_id + radius + 1)
        return [
            {
                "chunk_id": c.chunk_id,
                "start_time": c.start_time,
                "timestamp": format_timecode(c.start_time),
                "text": c.text,
                "speaker": c.speaker,
                "is_match": c.chunk_id == chunk_id,
            }
            for c in self.chunks[lo:hi]
        ]


# --------------------------------------------------------------------------
# Convenience loader
# --------------------------------------------------------------------------


def load_index(
    source: str | Path,
    backend: SearchBackend = "tfidf",
    chunk_size: int = 300,
) -> TranscriptIndex:
    """Build an index from a .pdf, .txt, .vtt or .srt-style transcript file."""
    path = Path(source)
    if path.suffix.lower() == ".pdf":
        segments = parse_pdf(path)
    else:
        segments = parse_transcript(path.read_text(encoding="utf-8"))

    if not segments:
        raise ValueError(
            f"No timestamped segments found in {path.name}. "
            "Expected lines shaped like '[00:01:23.45] - Speaker 1 <text>'."
        )

    return TranscriptIndex(build_chunks(segments, chunk_size=chunk_size), backend=backend)


if __name__ == "__main__":
    # Tiny smoke test: python transcript_search.py <transcript> "<query>"
    import sys

    index = load_index(sys.argv[1])
    for hit in index.search(sys.argv[2] if len(sys.argv) > 2 else "fingers"):
        print(f"{hit['timestamp']}  {hit['text'][:80]}...")
