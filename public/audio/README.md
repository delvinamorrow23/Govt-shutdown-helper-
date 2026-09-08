# Narration audio

The READ step plays one human-recorded narration file for the demo story.

Drop the file here as:

```
public/audio/demo-story.mp3
```

(That path is referenced by `lib/story.ts` → `DEMO_STORY.audioSrc`.)

Until the file is present, the player shows a friendly "Narration coming soon"
state and the child can still read the story. This is intentional — the MVP
uses one human-recorded track and does **not** include a text-to-speech
pipeline (that is deferred).
