import wishesData from "@/data/wishes.json";
import banterData from "@/data/banter.json";
import languagesData from "@/data/languages.json";
import interactionsData from "@/data/interactions.json";
import birthdayPhotosData from "@/data/photos.json";

export type VisualStyle =
  | "letter"
  | "postcard"
  | "polaroid"
  | "diary"
  | "note"
  | "clipping"
  | "sticker"
  | "invitation";

export interface Wish {
  id: number;
  name: string;
  aliases?: string[];
  wish: string;
  visualStyle?: VisualStyle | string;
  audio?: string;
  meme?: string;
  /** Legacy content fields are stripped before the game renders a wish. */
  photo?: string;
  revealNote?: string;
}

export type BanterKey = keyof typeof banterData;

const voiceNoteNames = new Set([
  "Akash",
  "Arivumathi",
  "Monifa",
  "Roshny",
  "Singaram",
  "Sreekar",
  "Suraj",
  "Suruthi",
  "Swetha KV",
]);

import { getCustomWishes } from "@/components/AddWishModal";

/** Static wishes loaded from wishes.json */
export const staticWishes = (wishesData as Wish[]).map(({ photo: _photo, ...wish }) =>
  voiceNoteNames.has(wish.name) ? { ...wish, audio: `/audio/${wish.name}.mp3` } : wish,
);

/** Combines static wishes from wishes.json and custom wishes added live from website */
export function getCombinedWishes(): Wish[] {
  const custom = getCustomWishes();
  return [...staticWishes, ...custom];
}

export const wishes = staticWishes;
export const banter = banterData as Record<string, string[]>;
export const languages = languagesData as { language: string; text: string }[];
export const content = interactionsData;
/** Photos of the birthday person, displayed in a different random order each play-through. */
export const birthdayPhotos = birthdayPhotosData as string[];

export const GUESSES_PER_WISH = 5;
