/**
 * Split transcript text into plain and matched runs so the UI can mark the
 * words the user actually asked for.
 *
 * Whole-phrase matches are marked as one run when present, because "slipping
 * through my fingers" highlighted as four separate words reads as noise. Only
 * if the phrase is absent do we fall back to marking individual terms.
 */

const STOP = new Set([
  "the", "a", "an", "and", "or", "but", "if", "of", "to", "in", "on", "at", "for",
  "with", "is", "are", "was", "were", "be", "been", "it", "its", "that", "this",
  "what", "does", "do", "about",
]);

export interface Run {
  text: string;
  match: boolean;
}

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function highlight(text: string, query: string): Run[] {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [{ text, match: false }];

  const phrase = trimmed.toLowerCase();
  const hasPhrase = text.toLowerCase().includes(phrase) && phrase.includes(" ");

  const patterns = hasPhrase
    ? [escape(trimmed)]
    : trimmed
        .toLowerCase()
        .replace(/[^a-z0-9\s']/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOP.has(w))
        .map((w) => `${escape(w)}\\w*`);

  if (patterns.length === 0) return [{ text, match: false }];

  const regex = new RegExp(`(${patterns.join("|")})`, "gi");
  const runs: Run[] = [];
  let cursor = 0;

  for (const found of text.matchAll(regex)) {
    const start = found.index ?? 0;
    if (start > cursor) runs.push({ text: text.slice(cursor, start), match: false });
    runs.push({ text: found[0], match: true });
    cursor = start + found[0].length;
  }

  if (cursor < text.length) runs.push({ text: text.slice(cursor), match: false });
  return runs.length > 0 ? runs : [{ text, match: false }];
}
