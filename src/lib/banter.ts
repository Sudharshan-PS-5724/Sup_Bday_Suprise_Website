import { banter } from "./content";

const lastPicked = new Map<string, string>();

/** Random line from a banter category, avoiding an immediate repeat. */
export function pickBanter(category: string, fallback = "Hmm."): string {
  const pool = banter[category];
  if (!pool || pool.length === 0) return fallback;
  if (pool.length === 1) return pool[0] ?? fallback;
  const previous = lastPicked.get(category);
  let choice = pool[Math.floor(Math.random() * pool.length)] ?? fallback;
  let guard = 0;
  while (choice === previous && guard < 6) {
    choice = pool[Math.floor(Math.random() * pool.length)] ?? fallback;
    guard += 1;
  }
  lastPicked.set(category, choice);
  return choice;
}
