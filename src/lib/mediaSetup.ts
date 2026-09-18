import mediaData from "@/data/media.json";
import { registerMedia, type MediaCue, type MediaTrigger } from "./media";

type CueInput = string | { src: string; volume?: number };
type ScopeMap = Record<string, Record<string, CueInput[]>>;

function toCue(input: CueInput): MediaCue {
  return typeof input === "string"
    ? { type: "audio", src: input }
    : { type: "audio", src: input.src, ...(input.volume === undefined ? {} : { volume: input.volume }) };
}

let done = false;

/** Registers every cue declared in media.json. */
export function setupMedia() {
  if (done) return;
  done = true;

  const scopes = mediaData as unknown as ScopeMap;
  for (const [scope, triggers] of Object.entries(scopes)) {
    if (scope.startsWith("_") || typeof triggers !== "object" || triggers === null) continue;
    for (const [trigger, cues] of Object.entries(triggers)) {
      if (!Array.isArray(cues)) continue;
      for (const cue of cues) registerMedia(trigger as MediaTrigger, toCue(cue), scope);
    }
  }
}
