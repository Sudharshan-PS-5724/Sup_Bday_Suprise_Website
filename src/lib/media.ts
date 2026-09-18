/**
 * Extensible media trigger layer.
 * Register clips against trigger names; acts fire triggers without knowing
 * which media (if any) is attached. Adding a reaction = adding a registration.
 */

export type MediaTrigger =
  | "onEnter"
  | "onClick"
  | "onCorrect"
  | "onWrong"
  | "onLastGuess"
  | "onReveal"
  | "onComplete"
  | "onChoice"
  | "onScroll"
  | "cakeSelection";

export interface MediaCue {
  type: "audio";
  src: string;
  volume?: number;
}

const registry = new Map<string, MediaCue[]>();
let enabled = true;
let current: HTMLAudioElement | null = null;

export function setAudioEnabled(value: boolean) {
  enabled = value;
  if (!value && current) {
    current.pause();
    current = null;
  }
}

export function registerMedia(trigger: MediaTrigger, cue: MediaCue, scope = "global") {
  const key = `${scope}:${trigger}`;
  registry.set(key, [...(registry.get(key) ?? []), cue]);
}

export function fireTrigger(trigger: MediaTrigger, scope = "global") {
  if (!enabled || typeof window === "undefined") return;
  const cues = registry.get(`${scope}:${trigger}`) ?? registry.get(`global:${trigger}`);
  if (!cues || cues.length === 0) return;
  const cue = cues[Math.floor(Math.random() * cues.length)];
  if (!cue) return;
  try {
    current?.pause();
    const audio = new Audio(cue.src);
    audio.volume = cue.volume ?? 0.7;
    current = audio;
    void audio.play().catch(() => undefined);
  } catch {
    /* media failures never break gameplay */
  }
}
