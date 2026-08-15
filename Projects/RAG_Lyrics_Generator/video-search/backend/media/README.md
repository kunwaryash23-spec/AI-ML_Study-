# Drop the recording here

Put the audio or video file for the indexed transcript in this folder. The first
playable file found is streamed at `/api/media`, and clicking a timestamp in the
UI seeks to it.

Recognised: `.mp3 .m4a .aac .wav .ogg .opus .flac .mp4 .webm .mov`

Only one file is served — the first in alphabetical order. Keep one recording
here at a time, matching the transcript in `TRANSCRIPT_PATH`.

With this folder empty the app still works: the timeline shows where every
result sits in the recording, the transport is disabled, and the UI says what is
missing. Nothing fakes a waveform.
