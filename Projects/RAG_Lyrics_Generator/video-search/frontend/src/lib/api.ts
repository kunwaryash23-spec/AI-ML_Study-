/**
 * The only place in the frontend that knows a network exists.
 *
 * Two things worth noticing:
 *
 * 1. Nothing here mentions TF-IDF, chunks, vectors, or scores. Swap the Python
 *    backend for embeddings tomorrow and this file does not change.
 * 2. If /api is unreachable, we fall back to a local sample of the real
 *    transcript so the interface is still developable and reviewable. The
 *    fallback announces itself (`degraded: true`) rather than pretending --
 *    silently faking results is how a UI ships a lie.
 */

import { SAMPLE_MOMENTS, SAMPLE_SOURCE, searchSample } from "@/lib/sample";
import type { ContextLine, Moment, SearchResponse, Source } from "@/lib/types";

const TIMEOUT_MS = 12000;

/**
 * Opened from the filesystem (a double-clicked single-file build), there is no
 * API by definition — every relative fetch resolves to `file:///api/...` and is
 * refused. Skip the round trip so the offline sample loads cleanly instead of
 * announcing two CORS errors first.
 */
const NO_BACKEND = typeof window !== "undefined" && window.location.protocol === "file:";

export class SearchError extends Error {
  constructor(
    message: string,
    readonly kind: "network" | "server" | "no-index" = "server",
  ) {
    super(message);
    this.name = "SearchError";
  }
}

let degraded = false;
export const isDegraded = () => degraded;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(path, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });

    if (response.status === 503) {
      throw new SearchError("No transcript is indexed yet.", "no-index");
    }
    if (!response.ok) {
      throw new SearchError(`Request failed with status ${response.status}.`, "server");
    }
    return (await response.json()) as T;
  } finally {
    window.clearTimeout(timer);
  }
}

export async function fetchSource(): Promise<Source> {
  if (NO_BACKEND) {
    degraded = true;
    return SAMPLE_SOURCE;
  }

  try {
    const source = await request<Source>("/api/source");
    degraded = false;
    return source;
  } catch {
    degraded = true;
    return SAMPLE_SOURCE;
  }
}

export async function search(query: string, k = 6): Promise<Moment[]> {
  if (degraded) return searchSample(query, k);

  try {
    const data = await request<SearchResponse>("/api/search", {
      method: "POST",
      body: JSON.stringify({ query, k }),
    });
    return data.results;
  } catch (error) {
    if (error instanceof SearchError && error.kind === "no-index") throw error;
    // A network-level failure mid-session: fall back rather than dead-end,
    // and flip the flag so the surface can say so.
    degraded = true;
    return searchSample(query, k);
  }
}

export async function fetchContext(chunkId: number): Promise<ContextLine[]> {
  if (degraded) {
    return SAMPLE_MOMENTS.filter(
      (m) => Math.abs(m.chunk_id - chunkId) <= 1,
    ).map((m) => ({
      chunk_id: m.chunk_id,
      start_time: m.start_time,
      timestamp: m.timestamp,
      text: m.text,
      speaker: m.speaker,
      is_match: m.chunk_id === chunkId,
    }));
  }

  const data = await request<{ lines: ContextLine[] }>(`/api/context/${chunkId}`);
  return data.lines;
}
