/**
 * The entire contract between this frontend and whatever is behind /api.
 *
 * `score` is present because the backend sends it. It is used for ordering and
 * nothing else -- no component reads it, and none should. If a future backend
 * stops returning it, nothing here breaks.
 */

export interface Moment {
  chunk_id: number;
  start_time: number;
  end_time: number;
  timestamp: string;
  text: string;
  speaker?: string | null;
  score?: number;
}

export interface SearchResponse {
  query: string;
  count: number;
  results: Moment[];
}

export interface ContextLine {
  chunk_id: number;
  start_time: number;
  timestamp: string;
  text: string;
  speaker?: string | null;
  is_match: boolean;
}

export type SourceKind = "music" | "podcast" | "lecture" | "interview" | "talk" | "video";

export interface Source {
  title: string;
  byline?: string | null;
  kind: SourceKind;
  indexed: boolean;
  index_error?: string | null;
  duration: number | null;
  duration_label?: string | null;
  moment_count: number;
  speakers: string[];
  /** Example queries the backend derived from this transcript. */
  sample_queries?: string[];
  media_available: boolean;
  media_kind?: "audio" | "video" | null;
  media_url?: string | null;
}

export type SearchStatus = "idle" | "searching" | "results" | "empty" | "error";
