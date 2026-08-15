/**
 * Timecode formatting.
 *
 * Two shapes on purpose. `timecode()` is the display form -- it drops the hour
 * segment on short recordings so a 4-minute song does not read "00:02:14" and
 * waste the user's attention on a zero that will never change. `fullTimecode()`
 * always keeps hours, for anything that must stay column-aligned regardless of
 * source length.
 */

export function timecode(seconds: number, forceHours = false): string {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 || forceHours ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function fullTimecode(seconds: number): string {
  return timecode(seconds, true);
}

/** Spoken duration, for screen readers: "2 minutes 14 seconds". */
export function spokenTime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const parts: string[] = [];
  if (h) parts.push(`${h} hour${h === 1 ? "" : "s"}`);
  if (m) parts.push(`${m} minute${m === 1 ? "" : "s"}`);
  parts.push(`${s} second${s === 1 ? "" : "s"}`);
  return parts.join(" ");
}
