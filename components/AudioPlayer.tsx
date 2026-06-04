'use client';

import React, { useEffect, useRef, useState } from 'react';

// Simple narration player for the READ step. It plays ONE human-recorded
// narration file that Delvina supplies for the demo story (drop it at the
// `src` path, e.g. public/audio/demo-story.mp3). This is intentionally NOT a
// text-to-speech system — TTS is deferred.
export function AudioPlayer({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTime = () =>
      setProgress(el.duration ? (el.currentTime / el.duration) * 100 : 0);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnd);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('ended', onEnd);
    };
  }, []);

  function toggle() {
    const el = ref.current;
    if (!el || !available) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(
        () => setPlaying(true),
        () => setAvailable(false),
      );
    }
  }

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3">
      <audio
        ref={ref}
        src={src}
        preload="none"
        onError={() => setAvailable(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause narration' : 'Play narration'}
        disabled={!available}
        className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gleea-pink text-2xl
                   text-white shadow-glow transition active:scale-95 disabled:opacity-50"
      >
        {playing ? '⏸️' : '▶️'}
      </button>
      <div className="min-w-0 flex-1">
        <div className="font-rounded font-bold text-white">
          {available ? label : 'Narration coming soon'}
        </div>
        {available ? (
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gleea-rose transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : (
          <div className="text-sm text-white/60">You can still read the story below.</div>
        )}
      </div>
    </div>
  );
}
