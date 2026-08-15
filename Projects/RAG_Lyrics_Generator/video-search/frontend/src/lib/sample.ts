/**
 * Offline fallback.
 *
 * These are the real chunks the Python index produces from the transcript on
 * disk, and this file exists for exactly one reason: the interface must be
 * runnable and reviewable with the backend down. The scoring below is a crude
 * word-overlap stand-in, not a reimplementation of the search engine -- when
 * the backend is up, none of this code runs.
 */

import type { Moment, Source } from "@/lib/types";

export const SAMPLE_SOURCE: Source = {
  title: "Slipping Through My Fingers",
  byline: "Declan McKenna",
  kind: "music",
  indexed: true,
  duration: 240.06,
  duration_label: "00:04:00",
  moment_count: 6,
  speakers: ["Speaker 1"],
  sample_queries: [
    "through my fingers",
    "early morning waving goodbye",
    "hand she leaves",
    "absent minded smile",
  ],
  media_available: false,
  media_kind: null,
  media_url: null,
};

export const SAMPLE_MOMENTS: Moment[] = [
  {
    chunk_id: 0,
    start_time: 2.12,
    end_time: 34.03,
    timestamp: "00:00:02",
    speaker: "Speaker 1",
    text: "School bag in hand, she leaves home in the early morning, waving goodbye with an absent-minded smile. I watch her go with a surge of that well-known sadness. And I have to sit down for a while. The feeling that I'm losing her forever while never really entering her world.",
  },
  {
    chunk_id: 1,
    start_time: 49.18,
    end_time: 61.11,
    timestamp: "00:00:49",
    speaker: "Speaker 1",
    text: "I'm glad whenever I can share Her laughter, that funny little girl. Slipping through my fingers all the time. I try to catch her every minute.",
  },
  {
    chunk_id: 2,
    start_time: 70.22,
    end_time: 96.12,
    timestamp: "00:01:10",
    speaker: "Speaker 1",
    text: "The feeling in it, slipping through my fingers all the time. Do I really see what's in her mind each time I think? I'm close to knowing. She keeps on growing, slipping through my fingers all the time. Sleep in our eyes, her and me at the breakfast table. Barely awake, I let precious time go by.",
  },
  {
    chunk_id: 3,
    start_time: 113.01,
    end_time: 127.18,
    timestamp: "00:01:53",
    speaker: "Speaker 1",
    text: "Then when she's gone, there's that old melancholy feeling and a sense of guilt I can't deny. What happened to our wonderful adventures? The places I had planned for us to go? Well, some of that We did, but most we didn't, and why, I just don't know.",
  },
  {
    chunk_id: 4,
    start_time: 154.07,
    end_time: 180.04,
    timestamp: "00:02:34",
    speaker: "Speaker 1",
    text: "Slipping through my fingers all the time, I try to capture every minute, the feeling in it. Slipping through my fingers all the time, do I really see what's in her mind? Each time I think I'm close to knowing. She keeps on growing, slipping through my fingers all the time.",
  },
  {
    chunk_id: 5,
    start_time: 189.05,
    end_time: 240.06,
    timestamp: "00:03:09",
    speaker: "Speaker 1",
    text: "Sometimes I wish that I could freeze the picture and save it from the funny tricks of Time slipping through my fingers. School bag in hand, she leaves home in the early morning, waving goodbye with an absent-minded smile.",
  },
];

const STOP = new Set([
  "the", "a", "an", "and", "or", "but", "if", "of", "to", "in", "on", "at", "for",
  "with", "is", "are", "was", "were", "be", "been", "it", "its", "that", "this",
  "what", "does", "do", "he", "she", "they", "about", "her", "his", "my", "i",
]);

const words = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));

export async function searchSample(query: string, k = 6): Promise<Moment[]> {
  // A visible pause, so loading states are real in offline mode too.
  await new Promise((resolve) => window.setTimeout(resolve, 260));

  const terms = words(query);
  if (terms.length === 0) return [];

  const scored = SAMPLE_MOMENTS.map((moment) => {
    const haystack = words(moment.text);
    const hits = terms.filter((term) => haystack.some((w) => w.startsWith(term))).length;
    const phrase = moment.text.toLowerCase().includes(query.trim().toLowerCase()) ? 0.4 : 0;
    return { moment, score: hits / terms.length + phrase };
  });

  return scored
    .filter((entry) => entry.score > 0.15)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((entry) => ({ ...entry.moment, score: Number(entry.score.toFixed(3)) }));
}
